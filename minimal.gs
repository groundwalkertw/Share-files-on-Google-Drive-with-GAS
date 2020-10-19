//The user has to create a spreadsheet first with two sheets, named "users" and "files."


//Constructor
function File(url)
{ 
  let regex=/file\/d\/([^\/]+)/;
  this.url=url;
  this.id=this.url.match(regex)[1]; //fetch the id
  this.file=DriveApp.getFileById(this.id());
}

let spreadSheet=SpreadsheetApp.getActive();
let sheetF=spreadSheet.getSheetByName('files');
let sheetU=spreadSheet.getSheetByName('users');

let rowNumF=sheetF.getLastRow();
let rowNumU=sheetU.getLastRow();

let fileArray= sheetF.getRange(2,1,rowNumF-1,1).getValues().map(url=>new File(url));

//check whether files are valid and assign the file property
function fileChecker()
{
  
  return
}

function permission()
{
  fileChecker();
  
  
  let userArray= sheetU.getRange(2,1,rowNumU-1,1).getValues(); //assuming the google accounts are in the first column
  for(let i of fileArray)
  {
    for(let j of userArray)
    {
      try
      {
        
      }
    }  
  }
}
