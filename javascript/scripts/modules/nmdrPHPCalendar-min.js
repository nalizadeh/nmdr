function nmdrPHPCalendar(t){var e=nmdr.core.$(t,"nmdrPHPCalendar");if(null!=e)return e.PHP_URL="http://nalizadeh.dynv6.net/javascript/php/calendar.php",e.calData=[],e.ca=null,e.init=function(e){var c=this,n=nmdr.calendar(t);n.prepareUserData=function(e,t){c.readItems(e,t)},n.renderCell=function(e){for(var t=c.findItems(e),a="",n="",r="",d=0;d<t.length;d++){var s=c.calData[t[d]],i=new Date(s.startdate),l=new Date(s.enddate);switch(a=s.type,r+="<b>"+s.username+"</b><br>"+s.type+"&nbsp;"+s.text+"<br>"+i.asString()+" - "+l.asString(),d<t.length-1&&(r+="<br><br>"),s.type){case"Urlaub":n="background:#D8E4BC";break;case"Frei":n="background:#8DB4E2";break;case"Termin":n="background:#E6B8B7"}}return""==a?"":"<div style='width:100%;height:100%;"+n+"'><span class='hotspot' tooltip='"+r+"' style='font-weight:normal'>"+a+"</span></div>"},n.afterRendering=function(){nmdr.core.tooltips.start("hotspot","#FFFFAE","#FFB13D")},n.getYVTooltip=function(e){for(var t=c.findItems(e),a="",n=0;n<t.length;n++){var r=c.calData[t[n]],d=new Date(r.startdate),s=new Date(r.enddate);r.type,a+="<b>"+r.username+"</b><br>"+r.type+"&nbsp;"+r.text+"<br>"+d.asString()+" - "+s.asString(),n<t.length-1&&(a+="<br><br>")}return""==a?null:a},n.getYVBackground=function(e){return 0==c.findItems(e).length?null:"#D8E4BC"},n.prepareCommands=function(){return[{name:"Neu...",icon:"details.gif",enabled:!0,action:"new"},{name:"Öffnen...",icon:"editdetails.gif",enabled:!0,action:"view"},{name:"Bearbeiten...",icon:"editdetails.gif",enabled:!0,action:"edit"},{name:"Löschen...",icon:"delete.gif",enabled:!0,action:"delete"}]},n.executeCommand=function(e,t){var a=function(){n.refresh()};"new"==e&&c.editItem(t,a,!0),"view"==e&&c.viewItem(t,a),"edit"==e&&c.editItem(t,a),"delete"==e&&c.deleteItem(t,a)},n.checkCommands=function(e,t,a){for(var n=c.findItems(t),r=0;r<e.length;r++)"new"==e[r].action&&0!=n.length&&(e[r].enabled=!1),"view"==e[r].action&&0==n.length&&(e[r].enabled=!1),"edit"==e[r].action&&0==n.length&&(e[r].enabled=!1),"delete"==e[r].action&&0==n.length&&(e[r].enabled=!1);a()},e.view=n.defaultView,n.init(e),this.ca=n,nmdr.core.dialog.imagePath=this.ca.imagePath},e.dbREAD=function(e,t,a){e.func="read",nmdr.core.ajax.get(this.PHP_URL,e,t,a)},e.dbWRITE=function(e,t,a){e.func="write",nmdr.core.ajax.get(this.PHP_URL,e,t,a)},e.dbDELETE=function(e,t,a){e.func="delete",nmdr.core.ajax.get(this.PHP_URL,e,t,a)},e.findItems=function(e){for(var t=[],a=0;a<this.calData.length;a++)e.withoutTime().inRange(new Date(this.calData[a].startdate),new Date(this.calData[a].enddate))&&t.push(a);return t},e.readItems=function(e,a){var n=this,t=new Date(e),r=this.view==this.yearView?new Date(t.getFullYear(),0,1).addMonth(-1):t.addMonth(-1),d=this.view==this.yearView?new Date(t.getFullYear(),11,31).addMonth(1):t.addMonth(1);this.dbREAD({startdate:r.toStr(),enddate:d.toStr()},function(e){n.calData=[];for(var t=0;t<e.data.length;t++)n.calData.push(e.data[t]);a()},function(e){0==n.calData.length&&(n.calData.push({id:nmdr.core.ajax.createUUID(),username:"Nader",startdate:"06/03/2017",enddate:"06/04/2017",type:"Termin",text:""}),n.calData.push({id:nmdr.core.ajax.createUUID(),username:"Nader",startdate:"06/10/2017",enddate:"06/12/2017",type:"Frei",text:""}),n.calData.push({id:nmdr.core.ajax.createUUID(),username:"Nader",startdate:"06/20/2017",enddate:"06/20/2017",type:"Termin",text:"von 10:00 bis 12:00 Uhr"}),n.calData.push({id:nmdr.core.ajax.createUUID(),username:"Nader",startdate:"06/20/2017",enddate:"06/20/2017",type:"Termin",text:"von 14:00 bis 14:30 Uhr"}),n.calData.push({id:nmdr.core.ajax.createUUID(),username:"Nader",startdate:"06/25/2017",enddate:"07/10/2017",type:"Urlaub",text:"in Malaga"})),nmdr.core.dialog.message("Message","Server response<br><br>readyState: "+e.readyState+"<br>status: "+e.status+"<br>responseText: "+e.responseText,500,300,a)})},e.editItem=function(e,l,c){var o=this,t=this.findItems(e),a=0==t.length?e:this.calData[t[0]];nmdr.core.dialog.dialog({title:"Bearbeiten",width:450,height:340,render:function(e){var t=e.id?e.id:nmdr.core.ajax.createUUID(),a=e.type?e.type:"";return"<table cellpadding='2' cellspacing='10' width='100%' border='0'><tr><td>Id:</td><td><input type='text' name='uuid' class='uuid' style='width: 260px;border:0;background:#fff' value='"+t+"' disabled></td></tr><tr><td>Name:</td><td><input type='text' name='username' class='username' style='width: 250px' value='"+(e.username?e.username:"")+"'></td></tr><tr><td>Anfang:</td><td><div class='startdate' id='startdate'></div></td></tr><tr><td>Ende:</td><td><div class='enddate' id='enddate'></div></td></tr><tr><td>Typ:</td><td><select name='type' class='type' style='width: 150px'><option"+("Urlaub"==a?" selected":"")+">Urlaub</option><option"+("Frei"==a?" selected":"")+">Frei</option><option"+("Termin"==a?" selected":"")+">Termin</option></select></td></tr><tr><td>Text:</td><td><input type='text' name='usertext' class='usertext' value='"+(e.text?e.text:"")+"' style='width: 300px'></td></tr></table>"},renderAfter:function(e){nmdr.datetime("startdate").init({date:new Date(e.startdate?e.startdate:e),imagePath:o.ca.imagePath}),nmdr.datetime("enddate").init({date:new Date(e.enddate?e.enddate:e),imagePath:o.ca.imagePath})},renderData:a,buttons:[{lable:"Save",className:"saveButton",callback:function(e){var t=e.getElementsByClassName("uuid")[0],a=e.getElementsByClassName("username")[0],n=e.getElementsByClassName("startdate")[0],r=e.getElementsByClassName("enddate")[0],d=e.getElementsByClassName("type")[0],s=e.getElementsByClassName("usertext")[0],i={id:t.value,username:a.value,startdate:n.getDate().toStr(),enddate:r.getDate().toStr(),type:d.options[d.selectedIndex].value,text:s.value};o.dbWRITE(i,function(e){nmdr.core.dialog.message("Nachricht",e.responseText,400,250,l)},function(e){if(c)o.calData.push(i);else{var t=findItems(new Date(i.startdate));if(0<t.length){var a=o.calData[t[0]];a.id=i.id,a.username=i.username,a.startdate=i.startdate,a.enddate=i.enddate,a.type=i.type,a.text=i.text}}var n="Folgende Daten wurden lokal gespeichert<br><br>Name: "+i.username+"<br>Anfang: "+i.startdate+"<br>Ende: "+i.enddate+"<br>Typ: "+i.type+"<br>Text: "+i.text;nmdr.core.dialog.message("Nachricht","Server response<br><br>readyState: "+e.readyState+"<br>status: "+e.status+"<br>responseText: "+e.responseText+"<br><br>"+n,600,450,l)})}},{lable:"Cancel",className:"cancelButton",callback:function(e){}}]})},e.deleteItem=function(n,r){var d=this;nmdr.core.dialog.confirm("Delete","Do you want to delete the selected calendar items?",function(e,t){if(e){var a=d.findItems(n);0<a.length&&d.dbDELETE(d.calData[a[0]],function(e){nmdr.core.dialog.alert("Delete","Items successfully deleted.",r)},function(e){d.calData.splice(a[0],1),nmdr.core.dialog.message("Message","Server response<br><br>readyState: "+e.readyState+"<br>status: "+e.status+"<br>responseText: "+e.responseText,500,300,r)})}})},e.viewItem=function(e,t){var a=this.findItems(e);if(0<a.length){var n=this.calData[a[0]],r="<table cellpadding='2' cellspacing='2' width='100%' border='0'><tr><td colspan='2'><b>Kalendareintrag</b></td></tr><tr><td colspan='2' style='height:10px'></td></tr><tr><td>Id:</td><td>"+n.id+"</td></tr><tr><td>Name:</td><td>"+n.username+"</td></tr><tr><td>Anfang:</td><td>"+n.startdate+"</td></tr><tr><td>Ende:</td><td>"+n.enddate+"</td></tr><tr><td>Typ:</td><td>"+n.type+"</td></tr><tr><td>Text:</td><td>"+n.text+"</td></tr></table>";nmdr.core.dialog.message("Kalendar",r,400,320)}},e}