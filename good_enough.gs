function permissionGE()
{
  const spreadSheet=SpreadsheetApp.getActive();
  const sheetF=spreadSheet.getSheetByName('files');
  const sheetS=spreadSheet.getSheetByName('settings');
  const sheetU=spreadSheet.getSheetByName('users');
  
  const rowNumU=sheetU.getLastRow();
  const rowNumF=sheetF.getLastRow();
  
  const settings=loadSettings(sheetS);
  const Col={
    google: settings.users.gmail || 1,
    url: settings.files.url || 1,
    fileQuery: settings.users.fileQuery || 3,
    filePos: settings.files.pos || 2,
    error: settings.users.error || 2
  };
  
  const urlArray= new UrlArray( sheetF.getRange(2,Col.url,rowNumF-1,1).getValues().map( x=>x[0]) );
  const fileArray=urlArray.toFiles();
  const fileQueryArray=sheetU.getRange(2,Col.fileQuery,rowNumU-1,rowNumF-1).getValues();      
  const userArray= sheetU.getRange(2,Col.google,rowNumU-1,1).getValues().map( x=>x[0] );
  const filePosArray=sheetF.getRange(2,Col.filePos,rowNumF-1,1).getValues().map( x=>x[0] );
  
  //There are other ways of looping over all users and files. The method chosen here is to have the greatest commonality with the do_it_all version, which is actually quite inefficient. 
  
  for(let i=0; i<rowNumU-1;i++){
    for(let j=0; j<rowNumF-1;j++){
      try{
        if(fileQueryArray[i][ filePosArray[j]-1 ]){
          fileArray[j].addViewer( userArray[i] );
        }
      }
      catch(err){
        sheetU.getRange(i+2,Col.error).setValue('Failed');
        Logger.log(err);
      }             
    }
    sheetU.getRange(i+2,Col.error).setValue('Succeded');
  }
    
}      
