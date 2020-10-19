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
      throw `${url} is an invalid link to a file!`;
    }
    
  }
  else if(idStr=this.url.match(regexFolder))
  {
    this.id=idStr;
    try{
      this.fOrF=DriveApp.getFolderById(this.id());
    }
    catch(e){
      throw `${url} is an invalid link to a folder!`;
    }    
  }
  else
  {
    throw `${url} is a link neither to a file nor to a folder!`;
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
  try
  {
    for(let i=2; i<=rowNumF;i++)
    {
      fileArray.push(new File(urlArray[i]));
    }
  }
  catch(e)
  {
    Logger.log(e);
  }
    
  
    
  
  
  let userArray= sheetU.getRange(2,1,rowNumU-1,1).getValues(); //assuming the google accounts are in the first column
  
}
