//The user has to create a spreadsheet first with two sheets, named "users" and "files." Folders can also be shared.


//Constructor
function File(url)
{
  this.url=url;
  //regular expression: start with /d/ or /folders/, end with / (for files) or ? (for folders)
  let regexFile=/\/d\/([^\/]+)/;
  let regexFolder=/\/folders\/([^\?]+)/;
  
  let idStr;
  //check whether files/folders are valid
  if(idStr=this.url.match(regexFile))
  {
    this.id=idStr;
    try{
      this.fOrF=DriveApp.getFileById(this.id()); //file or folder
    }
    catch(e){
      throw `Invalid link to a file!`;
    }
    
  }
  else if(idStr=this.url.match(regexFolder))
  {
    this.id=idStr;
    try{
      this.fOrF=DriveApp.getFolderById(this.id());
    }
    catch(e){
      throw `Invalid link to a folder!`;
    }    
  }
  else
  {
    throw `Neither a link to a file nor to a folder!`;
  }
  
}

let spreadSheet=SpreadsheetApp.getActive();
let sheetF=spreadSheet.getSheetByName('files');
let sheetU=spreadSheet.getSheetByName('users');

let rowNumF=sheetF.getLastRow();
let rowNumU=sheetU.getLastRow();

let urlArray= sheetF.getRange(2,1,rowNumF-1,1).getValues();

function permission()
{
  let fileArray=[];
  for(let i=2; i<=rowNumF;i++)
  {
    try{
      fileArray.push(new File(urlArray[i]));
    }
    catch(err){
      sheetF.getRange().setValue(err);
      Logger.log('URL error.');
      throw 'Terminated.'
    }
  }
      
  let userArray= sheetU.getRange(2,1,rowNumU-1,1).getValues(); //assuming the google accounts are in the first column
  for(let i in userArray){
    for(let file of fileArray)
    {
      try{
        file.fOrF.addViewer(user);
      }
      catch(err){
        sheetU.getRange(i+2,2).setValue('Failed');
        Logger.log('Error occured while trying to add a viewer.');
      }
    }
  }
}
