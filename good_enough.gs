function permissionGE()
{
  const spreadSheet=SpreadsheetApp.getActive();
  const sheetF=spreadSheet.getSheetByName('files');
  const sheetS=spreadSheet.getSheetByName('settings');
  const sheetU=spreadSheet.getSheetByName('users');
  
  const rowNumU=sheetU.getLastRow();
  const rowNumF=sheetF.getLastRow();
  let toDoArray=[];
  

  const settings=loadSettings(sheetS);
  const Col={
    gmail: settings.users.gmail || 1,
    url: settings.files.url || 1,

    filePos: settings.files.pos || 2,
    msg: settings.users.msg || 2
  };
  /*Here the key is to decide whether to grant access to all users or selected ones: falsy values: everyone; if true, we need the column "toDo"
  / access is given to a user iff toDo=1
  */  
  if(settings.users.key){
    Col.toDo=settings.users.toDo || 3;
    Col.fileQuery=settings.users.fileQuery || 4;
    toDoArray=sheetU.getRange(2,Col.toDo,rowNumU-1,1).getValues().map( x=>x[0] );
  }
  else{
    Col.fileQuery=settings.users.fileQuery || 3;
  }
  
  const urlArray= new UrlArray( sheetF.getRange(2,Col.url,rowNumF-1,1).getValues().map( x=>x[0]) );
  const fileArray=urlArray.toFiles();
  const fileQueryArray=sheetU.getRange(2,Col.fileQuery,rowNumU-1,rowNumF-1).getValues();      
  const gmailArray= sheetU.getRange(2,Col.gmail,rowNumU-1,1).getValues().map( x=>x[0] );
  const filePosArray=sheetF.getRange(2,Col.filePos,rowNumF-1,1).getValues().map( x=>x[0] );
  
  //There are other ways of looping over all users and files. The method chosen here is to have the greatest commonality with the do_it_all version, which is actually inefficient. 
  
  for(let i=0; i<rowNumU-1;i++){
    if(!settings.users.key || toDoArray[i]){
      let flag=1;
      for(let j=0; j<rowNumF-1;j++){
        try{
          if(fileQueryArray[i][ filePosArray[j]-1 ]){
            fileArray[j].addViewer( gmailArray[i] );
          }
        }
        catch(err){
          sheetU.getRange(i+2,Col.msg).setValue('Failed');
          Logger.log(err);
          flag=0;
          break;
        }             
      }
      if(flag){
        sheetU.getRange(i+2,Col.msg).setValue('Succeded');
      }
    }    
  }
    
}   
