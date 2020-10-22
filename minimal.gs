//The user has to create a spreadsheet first with two sheets, named "users" and "files." Folders can also be shared.

const spreadSheet=SpreadsheetApp.getActive();
const sheetF=spreadSheet.getSheetByName('files');
const sheetU=spreadSheet.getSheetByName('users');
const sheetS=spreadSheet.getSheetByName('settings');

const rowNumF=sheetF.getLastRow();
const rowNumU=sheetU.getLastRow();

//key: whether to check the validity of individual Google accounts
function permission(key=0)
{
  let settings=loadSettings(sheetS);
  let googleCol=settings.users.gmail || 1; //where the column of Google accounts is
  let errorCol=settings.users.error || 2; //where the column of errors is
  let urlCol=settings.files.url || 1;
  
  let urlArray= new UrlArray( sheetF.getRange(2,urlCol,rowNumF-1,1).getValues() );
  let fileArray=urlArray.toFiles();
      
  let userArray= sheetU.getRange(2,googleCol,rowNumU-1,1).getValues(); 
  
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
        sheetU.getRange(i+2,2).setValue('Failed');  
        Logger.log(err);
      }       
    }      
  }       
}

