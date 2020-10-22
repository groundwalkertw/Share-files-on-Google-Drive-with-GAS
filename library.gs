//Constructor
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
}
