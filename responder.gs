const pos={
  address: 1,
  surname: 2,
  code: 3,
  title: 5,
  gmail: 6,
  time: 7,
  toSend: 8,
  sent: 9,
  urlRe: 10,
  file: 11
};

const posF={
  request: 0,
  code: 1,
  gmail: 2,
  video: 3,
  slides: 4
};

function File(posF,id,name){
  this.posF=posF;
  this.id=id;
  this.name=name;
  this.file=DriveApp.getFileById(id);
  this.url=this.file.getUrl();
}

const fileArray=[                ]

const sheetPID='';

const sheet=SpreadsheetApp.openById(sheetPID).getSheetByName('Proce');

function valueAt(indR,indC){
  return sheet.getRange(indR,indC).getValue();
};

function valueSet(indR,indC,val){
  sheet.getRange(indR,indC).setValue(val);
};

function permissionAndContent(fileQuery,indR){
  let google=valueAt(indR,pos.gmail);
  let content='';
  
  for(let i of fileArray){
    if(fileQuery[i.posF]===1)
    {
      try
      {
        i.file.addViewer(google);
        content+=`<div class="center"><p><a href="${i.url}">${i.name}</a></p></div>`;
      }
      catch(e)
      {
        return (new Error(''));
      };      
    };
  };
  return content;
}

function responder(e){
  let ranVal=e.response.getItemResponses().map(x => x.getResponse());
  let rowNum=sheet.getLastRow();
  let request=0;
  let check=0;
  let formReUrl=e.response.getEditResponseUrl();
  let fileQuery=[];
  
  
  
  /*
  let codeValues=sheet.getRange(2,pos.code,rowNum-1,1).getValues();  
  for(let i=0; i<codeValues.length; i++)
  {
    if(Number(ranVal[posF.code])===codeValues[i][0])
    {
      check=1;
      rowWhich=i+2;
      if(ranVal[posF.request]==='Yes')
      {
          request=1;
          valueSet(rowWhich,pos.time,e.response.getTimestamp());
          valueSet(rowWhich,pos.urlRe,formReUrl);
          
          sheet.getRange(rowWhich,pos.file,1,fileQuery.length).setValues([fileQuery]);
          
          if(sheet.getRange(rowWhich,pos.gmail).isBlank())
          {
            valueSet(rowWhich,pos.gmail,ranVal[posF.gmail])
          };          
       };
      break;
     };
  };  
  */
  let rowWhich=ranVal[posF.code]%100+1;
  if(valueAt(rowWhich,pos.code)==ranVal[posF.code])
  {
    check=1;
    if(ranVal[posF.request]==='Yes')
    {
       request=1;
       fileQuery=(ranVal[posF.video].concat(ranVal[posF.slides])).map(x=> x==='Yes'?1:0);
       valueSet(rowWhich,pos.time,e.response.getTimestamp());
       valueSet(rowWhich,pos.urlRe,formReUrl);
          
       sheet.getRange(rowWhich,pos.file,1,fileQuery.length).setValues([fileQuery]);
          
       if(sheet.getRange(rowWhich,pos.gmail).isBlank())
       {
         valueSet(rowWhich,pos.gmail,ranVal[posF.gmail]);
       };          
     };
    
  };

  
  if(check===1)
  {
    let msg=`<html>
<head>
	<title></title>
    <style>
    body {
      font-family:arial,calibri,helvetica;
      font-size:15px;
    }
    p {
      font-family:arial,calibri,helvetica;
      font-size:15px;
    }
    a {
      color: #6699ff;
      text-decoration: none;
    }
    .center {
     text-align: center;
     font-size:17px;    
     background-color: white;
      color:  #9933ff;
    }
    .center a{
      font-size:17px;
      color: #6699ff;
    }

   </style>
</head>
<body>
<p>Dear ${valueAt(rowWhich,pos.title)} ${valueAt(rowWhich,pos.surname)}:</p>
<p>Below is the link to your response. Please don't share the link with others.</p>
<div class="center"><a href=${formReUrl}>View or edit your response</a></div>`;
  let subject='Thank you for filling in the form!';
  
  let msgEnd=`<hr><p>Please don't reply to this mail.</p>

<p>Kind regards,<br>
</p>

</body>
</html>`;
    if(request===1)
    {    
      let permiContent=permissionAndContent(fileQuery,rowWhich);
      if(permiContent instanceof Error)
      {
        sheet.getRange(rowWhich,pos.gmail).clear();
        subject='An error occured while adding you as a viewer';
        msg+=`<p>However, we failed to add you as a viewer to the files. Please check your Google account and re-submit the form by using the link above.</p>`;
      }
      else
      {
        msg+=`<hr><p>Here are the links to the videos and/or slides:</p>`+permiContent+`<p>You can edit your response to gain access to files you haven't requested. 
       Please don't share the content of the files with anyone else.</p>`;
      }      
    }
    msg+=msgEnd; 
     
    GmailApp.sendEmail(valueAt(rowWhich,pos.address),subject,null,{htmlBody: msg, name: ``});
    valueSet(rowWhich,pos.sent,1);
  };

}
