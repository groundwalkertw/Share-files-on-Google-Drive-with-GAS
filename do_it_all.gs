//the ID of the spreadsheet; required
const sheetID='';

function decoder(token){
  const whichRow=token%100+1;
  return whichRow;
}

function responder(e)
{
  const spreadSheet=SpreadsheetApp.openById(sheetID);
  const sheetF=spreadSheet.getSheetByName('files');
  const sheetS=spreadSheet.getSheetByName('settings_form');
  const sheetU=spreadSheet.getSheetByName('users_form');
  
  const responses=e.response.getItemResponses().map(x => x.getResponse());
  const settings=loadSettings(sheetS);
  const formUrl=e.response.getEditResponseUrl();
  
  const formPos={
    token: (settings.form.token || 1) - 1,
    gmail: (settings.form.gmail || 2) - 1,
    fileQuery: (settings.form.file || 3) - 1
  };
  const whichRow=decoder( responses[formPos.token] );
  
  if( whichRow<=0 || !Number.isInteger(whichRow) ){
    throw 'Wrong row num.';
  };  
  
  const rowNumU=sheetU.getLastRow();
  const rowNumF=sheetF.getLastRow();
  
  const Col={
    surname: settings.users.surname || 1,
    title: settings.users.title || 2,
    mail: settings.users.mail || 3,
    token: settings.users.token || 4,
    gmail: settings.users.gmail || 5,
    formURL: settings.users.url || 6,
    msg: settings.users.msg || 7,   
    fileQuery: settings.users.fileQuery || 8,
    
    url: settings.files.url || 1,
    filePos: settings.files.pos || 2
  };
  
  if(sheetU.getRange(whichRow,Col.token).getValue()!=responses[formPos.token]){
    throw 'Wrong token';
  }
  
  let gmail=sheetU.getRange(whichRow,Col.gmail).getValue();
  if(!gmail){
    gmail=responses[formPos.gmail];
    sheetU.getRange(whichRow,Col.gmail).setValue(gmail);
  }
  
  const fileQueryArray=responses[formPos.fileQuery].map(x => x==='Yes'? 1:0);
  sheetU.getRange(whichRow,Col.fileQuery,1,rowNumF-1).setValues([fileQueryArray]);
  
  const urlArray= new UrlArray( sheetF.getRange(2,Col.url,rowNumF-1,1).getValues().map( x=>x[0]) );
  const fileArray=urlArray.toFiles();
  const filePosArray=sheetF.getRange(2,Col.filePos,rowNumF-1,1).getValues().map( x=>x[0]-1 ); 
        
  let temp;
  
  try{
    for(let i=0; i<rowNumF-1;i++){
      if(fileQueryArray[ filePosArray[i] ]){
        fileArray[i].addViewer(gmail);
      }
    }
    sheetU.getRange(whichRow,Col.msg).setValue('Succeded');
    temp = HtmlService.createTemplateFromFile('mail_template');   
  }  
  catch(err){
    sheetU.getRange(whichRow,Col.msg).setValue('Failed');
    Logger.log(err);
    temp = HtmlService.createTemplateFromFile('mail_template_err');
  }
  
  temp.surname=sheetU.getRange(whichRow,Col.surname).getValue();
  temp.url=formUrl;
  temp.title=sheetU.getRange(whichRow,Col.title).getValue();
  temp.sender=settings.mail.sender;

  GmailApp.sendEmail(sheetU.getRange(whichRow,Col.mail).getValue(),settings.mail.subject,null,{htmlBody: temp.evaluate().getContent(), name: settings.mail.sendFrom});
    
}  
