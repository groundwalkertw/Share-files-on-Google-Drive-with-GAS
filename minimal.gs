//The user has to create a spreadsheet first with two sheets, named "users" and "files."

//Constructor
function File(posF,id,name){
  this.posF=posF;
  this.id=id;
  this.name=name;
  this.file=DriveApp.getFileById(id);
  this.url=this.file.getUrl();
}
