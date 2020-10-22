//The user has to create a spreadsheet first with two sheets, named "users" and "files." Folders can also be shared.

let spreadSheet=SpreadsheetApp.getActive();
let sheetF=spreadSheet.getSheetByName('files');
let sheetU=spreadSheet.getSheetByName('users');

let rowNumF=sheetF.getLastRow();
let rowNumU=sheetU.getLastRow();

let urlArray= sheetF.getRange(2,1,rowNumF-1,1).getValues();

function permission()
{
  let fileArray=[];
  for(let i in urlArray){
    try{
      fileArray.push(new File(urlArray[i]));
    }
    catch(err){
      sheetF.getRange(i+2,2).setValue(err);
      Logger.log('URL error.');
      throw 'Terminated.';
    }
  }
      
  let userArray= sheetU.getRange(2,1,rowNumU-1,1).getValues(); //assuming the google accounts are in the first column
  for(let i in userArray){
    for(let file of fileArray){
      try{
        file.fOrF.addViewer(user);
      }
      catch(err){
        sheetU.getRange(i+2,2).setValue('Failed');  //assuming the error messages are in the second column
        Logger.log('Error occured while trying to add a viewer.');
      }
    }
  }
}
