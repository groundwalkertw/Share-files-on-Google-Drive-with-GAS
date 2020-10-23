//this script should be bound to the form, and use a trigger to initiate the function responder
//the ID of the spreadsheet, required
const spreadsheetID='';

const spreadsheet=SpreadsheetApp.openById(sheetPID);
const sheetU=spreadsheet.getSheetByName('users');
const sheetF=spreadsheet.getSheetByName('files');
const sheetS=spreadsheet.getSheetByName('settings');
const rowNumF=sheetF.getLastRow();
const rowNumU=sheetU.getLastRow();



const pos={
  address: 1,
  surname: 2,
  token: 3,
  title: 5,
  gmail: 6,
  time: 7,
  toSend: 8,
  sent: 9,
  urlRe: 10,
  file: 11
};

//the values depend on how the form is arranged
const posF={
  request: 0,
  token: 1,
  gmail: 2,
  video: 3,
  slides: 4
};


function filesGenerator(){
  let urls= new UrlArray( sheetF.getRange(2,1,rowNumF-1,1).getValues() );
  let files=urlArray.toFiles();
  let nameAndPos=sheetF.getRange(2,1,rowNumF-1,2).getValues();
  
  for(let i=0;i<fileArray.length;i++){
    [files[i].name,files[i].pos]=nameAndPos[i];
  }
  
  return files;    
}




function valueAt(indR,indC){
  return sheet.getRange(indR,indC).getValue();
}

function valueSet(indR,indC,val){
  sheet.getRange(indR,indC).setValue(val);
}

function permissionAndContent(fileQuery,indR){
  let google=valueAt(indR,pos.gmail);
  let content='';
  
  for(let i of fileArray){
    if(fileQuery[i.posF]===1)
    {
      try
      {
        i.file.addViewer(google);
        content+=`<div class="center"><p><a href="${i.url}">${i.name}</a></p></div>`;
      }
      catch(e)
      {
        return (new Error(''));
      };      
    };
  };
  return content;
}

//decode the access token
function decoder(token){
  //the part between these two // depends on how it's encoded
  let whichRow=token%100+1;
  //
  return whichRow;
}

function responder(e){
  let responses=e.response.getItemResponses().map(x => x.getResponse());

  let request=0;
  let check=0;
  let formReUrl=e.response.getEditResponseUrl();
  let fileQuery=[];  
  
/*Keywords: 
 form: token, gmail, file
 users: mail, token, surname, title, gmail, sent, file
 files: url, name, pos
*/

  let setting=loadSettings(sheetS);
 
  let whichRow=decoder( responses[setting.form.token] );
  
  if(valueAt(whichRow,pos.code)==ranVal[posF.code])
  {
    check=1;
    if(responses[posF.request]==='Yes')
    {
       request=1;
       fileQuery=(ranVal[posF.video].concat(ranVal[posF.slides])).map(x=> x==='Yes'?1:0);
       valueSet(whichRow,pos.time,e.response.getTimestamp());
       valueSet(rowWhich,pos.urlRe,formReUrl);
          
       sheet.getRange(rowWhich,pos.file,1,fileQuery.length).setValues([fileQuery]);
          
       if(sheet.getRange(rowWhich,pos.gmail).isBlank())
       {
         valueSet(rowWhich,pos.gmail,ranVal[posF.gmail]);
       };          
     };
    
  };

  
  if(check===1)
  {
    
  let subject='Thank you for filling in the form!';
  
  let msgEnd=`<hr><p>Please don't reply to this mail.</p>

<p>Kind regards,<br>
</p>

</body>
</html>`;
    if(request===1)
    {    
      let permiContent=permissionAndContent(fileQuery,rowWhich);
      if(permiContent instanceof Error)
      {
        sheet.getRange(rowWhich,pos.gmail).clear();
        subject='An error occured while adding you as a viewer';
        msg+=`<p>However, we failed to add you as a viewer to the files. Please check your Google account and re-submit the form by using the link above.</p>`;
      }
      else
      {
        msg+=`<hr><p>Here are the links to the videos and/or slides:</p>`+permiContent+`<p>You can edit your response to gain access to files you haven't requested. 
       Please don't share the content of the files with anyone else.</p>`;
      }      
    }
    msg+=msgEnd; 
     
    GmailApp.sendEmail(valueAt(rowWhich,pos.address),subject,null,{htmlBody: msg, name: '',replyTo: ''});
    valueSet(rowWhich,pos.sent,1);
  };

}

let msg=`<html>
<head>
	<title></title>
    <style>
    body {
      font-family:arial,calibri,helvetica;
      font-size:15px;
    }
    p {
      font-family:arial,calibri,helvetica;
      font-size:15px;
    }
    a {
      color: #6699ff;
      text-decoration: none;
    }
    .center {
     text-align: center;
     font-size:17px;    
     background-color: white;
      color:  #9933ff;
    }
    .center a{
      font-size:17px;
      color: #6699ff;
    }

   </style>
</head>
<body>
<p>Dear ${valueAt(rowWhich,pos.title)} ${valueAt(rowWhich,pos.surname)}:</p>
<p>Below is the link to your response. Please don't share the link with others.</p>
<div class="center"><a href=${formReUrl}>View or edit your response</a></div>`;
