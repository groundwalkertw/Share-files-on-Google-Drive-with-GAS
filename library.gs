//Class and constructor File
class File{
  constructor(url){
    this.url=url;
    //regular expressions
    let regexFile=/\/d\/([^\/]+)/; //start with /d/, end with / 
    let regexFolder=/\/folders\/([^\?]+)/; //start with /folders/, end with ?
  
    let idStr;
      //check whether files/folders are valid
    if(idStr=this.url.match(regexFile)){
      this.id=idStr;
      try{
        this.fOrF=DriveApp.getFileById(this.id()); //file or folder
      }
      catch(err){
        throw `Invalid link to a file!`;
      } 
    }
    else if(idStr=this.url.match(regexFolder)){
      this.id=idStr;
      try{
        //the class file or folder
        this.fOrF=DriveApp.getFolderById(this.id());
      }
      catch(err){
        throw `Invalid link to a folder!`;
      }    
    }
    else{
      throw `Neither a link to a file nor to a folder!`;
    }
    
    this.name=this.fOrF.getName();
    
  }
  //method: add a viewer
  addViewer(user){
    try{
      this.fOrF.addViewer(user);
    }
    catch(err){
      throw `Failed to add viewer ${user}`;
    }    
  }
  //method: add viewers
  addViewers(userArray){
    this.fOrF.addViewers(userArray);  
  }
  
};
          

//class url array

class UrlArray extends Array{
  constructor(urls){
    let regex=/\bhttps/;
    let tmpArray=[];
    for(let i=0;i<urls.length;i++){
      if(regex.test(urls[i])){
        tmpArray.push(urls[i])
      }
      else{
        throw `${i}-th position: Invalid url.`;
      }        
    }                
  }
  
  //method: return an array of files generated from the urls
  toFiles(){
    let tmpArray=[];
    
    for(let i=0;i<this.length;i++){
      try{
        tmpArray.push(new File( this[i] ) );
      }
      catch(err){
        throw `${i}-th position: ${err}.`;
      }
    }
    
    return tmpArray;
  }
}

function loadSettings(sheetS){
  const colNum=sheetS.getLastColumn();
  const rowNum=sheetS.getLastRow();
  let settings={};
  
  for(let i=1;i<rowNum;i=i+2){
    
    let tmpArray=sheetS.getRange(i,1,2,colNum).getValues();
    let tmpObj;
    
    switch(tmpArray[0][0]){
      case 'files': tmpObj= ( settings.files={} );
        break;
      case 'users': tmpObj= ( settings.users={} );
        break;
      case 'form': tmpObj= ( settings.form={} );
        break;
      default:
        throw 'Unable to recognize the settings.';
    }
    
    for(let j=1;j<tmpArray[0].length;j++){
      if(tmpArray[0][j]){
        tmpObj[tmpArray[0][j]]=tmpArray[1][j];
      }
      else{
        break;
      }      
    }
    
  }
  return settings;
}



