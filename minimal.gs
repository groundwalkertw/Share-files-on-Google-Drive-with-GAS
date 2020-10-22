//The user has to create a spreadsheet first with two sheets, named "users" and "files." Folders can also be shared.

let spreadSheet=SpreadsheetApp.getActive();
let sheetF=spreadSheet.getSheetByName('files');
let sheetU=spreadSheet.getSheetByName('users');

let rowNumF=sheetF.getLastRow();
let rowNumU=sheetU.getLastRow();


//key: whether to check the validity of individual Google accounts
function permission(key=0)
{
  let urlArray= new UrlArray( sheetF.getRange(2,1,rowNumF-1,1).getValues() );
  let fileArray=urlArray.toFiles();
      
  let userArray= sheetU.getRange(2,1,rowNumU-1,1).getValues(); //assuming the google accounts are in the first column
  
  for(let file of fileArray){
    if(!key){
      file.addViewers(userArray);    
    }
    else{
      try{
        for(let i=0; i<rowNumU-1;i++){
          file.addViewer(user);
        }       
      }
      catch(err){
        sheetU.getRange(i+2,2).setValue('Failed');  //assuming the error messages are in the second column
        Logger.log(err);
      }       
    }      
  }       
}

