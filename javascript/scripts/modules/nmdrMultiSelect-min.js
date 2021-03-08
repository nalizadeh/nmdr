function nmdrMultiSelect(e){var t=nmdr.core.$(e,"nmdrMultiSelect");if(null!=t)return t.imagePath="img/",t.lang="en",t.enabled=!0,t.color="#666",t.background="#F7F3F7",t.backgroundImage="ribbonBackground.png",t.font="normal 11px/2 Verdana, Arial, Helvetica, sans-serif;",t.width=240,t.height=140,t.isOpen=!1,t.checkboxes=[],t.infoText="Select options",t.build=function(e,t,i,n,o){this.checkboxes=e,t&&(this.lang=t),i&&(this.width=i),n&&(this.height=n),o&&(this.imagePath=o+"/"),this.infoText="en"==this.lang?"Select options":"Auswahl";var s="#"+this.id+"_nmdrMS",d="<style>"+s+" { position:relative; margin:0; padding:0; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none; }"+s+" .nmdrMSinfoDiv { width:"+this.width+"px; height:24px; font:"+this.font+"; color:"+this.color+"; background:"+this.background+"; border:1px solid #ccc; cursor:pointer; }"+s+" .nmdrMSpopupDiv { background:#fff; border:1px solid #ccc; border-top:0px; font:"+this.font+"; z-index:100;}"+s+" .nmdrMSbutton { cursor:pointer; }"+s+" .nmdrMSbutton:hover { opacity: 0.7; }"+s+" .nmdrMScheckbox:hover { cursor:pointer; background:#0073C6; color:#FFFFFF; }</style>",h=[];return h.push("<div id='"+this.id+"_nmdrMS' style='display:block;'>"),h.push("<div class='nmdrMSinfoDiv' id='"+this.id+"_nmdrMSinfodiv' style='display:block;' onclick=\"nmdr.core.$('"+this.id+"').openComboBox(event);\"><table cellpadding='1' cellspacing='0' border='0' width='100%' height='100%'><tr><td id='"+this.id+"_nmdrMStopInfo' style='vertical-align:middle;border-right:1px solid #ccc;'>&nbsp;&nbsp;<span id='"+this.id+"_nmdrMSinfoSpan'>"+this.infoText+"</span></td><td style='width:24px; vertical-align:bottom; text-align:center;padding:2px 0 0 0;'><img id='"+this.id+"_nmdrMSonoffImg' src='"+this.imagePath+"/tabdown.png'></td></tr></table></div>"),h.push("<div class='nmdrMSpopupDiv' id='"+this.id+"_nmdrMSpopupDiv' style='position:absolute; left:0px; top:0px; width:0px; height:0px; display:none;'></div>"),h.push("</div>"),this.innerHTML=d+h.join(""),this.updateInfo(),this},t.makeCheckboxes=function(){var e=[];e.push("<div id='"+this.id+"_nmdrMStablediv' style='padding:2px;'>"),e.push("<table class='nmdrMStable' width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>");for(var t=0;t<this.checkboxes.length;t++){var i=this.checkboxes[t],n=this.id+"_nmdrMScheckbox"+t,o=this.imagePath+(i.checked?"/checkboxon.png":"/checkboxoff.png");e.push("<tr><td class='nmdrMScheckbox' id='"+n+"' onclick=\"nmdr.core.$('"+this.id+"').toggleCheckBox("+t+");\"><table cellpadding='2' cellspacing='0' border='0'><tr><td style='vertical-align:middle;'><img id='"+n+"_img' src='"+o+"'></td><td style='vertical-align:middle;'><span>"+i.title+"</span></td></tr></table></td></tr>")}return e.push("</table></div>"),e.join("")},t.openComboBox=function(e){if(this.enabled)if(this.isOpen)this.closeComboBox();else{this.isOpen=!0;var t=document.getElementById(this.id+"_nmdrMS"),i=document.getElementById(this.id+"_nmdrMSpopupDiv"),n=this.absPosition,o=t.absPosition,s="en"==this.lang?"Check all":"Alle auswählen",d="en"==this.lang?"Uncheck all":"Auswahl aufheben",h=this,c=[];c.push("<div style='position:absolute;left:0px;top:0px;width:100%;height:28px;background:"+this.background+"; vertical-align:middle;border-bottom:1px solid #ccc;'>"),c.push("<table class='daystable' width='100%' height='100%x' cellpadding='4' cellspacing='0' border='0'><tr>"),c.push("<td></td>"),c.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('"+this.id+"').checkAll();\"><img src='"+this.imagePath+"/check.png' title='"+s+"'></td>"),c.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('"+this.id+"').uncheckAll();\"><img src='"+this.imagePath+"/uncheck.png' title='"+d+"'></td>"),c.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('"+this.id+"').endSelection();\"><img src='"+this.imagePath+"/ok.png'></td>"),c.push("</tr></table>"),c.push("</div>"),c.push("<div id='"+this.id+"_nmdrMSoverlayDiv' style='position:absolute;left:0px;top:30px;width:100%;height:"+(this.height-30)+"px;background:#fff;overflow-x:hiden;overflow-y:auto;'>"),c.push(this.makeCheckboxes()),c.push("</div>"),i.innerHTML=c.join(""),i.style.display="inline-block",i.style.top=n.top-o.top+t.offsetHeight+"px",i.style.left=o.left-n.left+"px",i.style.width=this.width+"px",i.style.height=this.height+"px",document.getElementById(this.id+"_nmdrMSonoffImg").src=this.imagePath+"/tabup.png",nmdr.core.popup.open(i,e.target,null,function(e){h.closeComboBox(e)}),nmdr.core.animate.fadeIn(null,i,null,!0),nmdr.core.utils.stopPropagation(e)}},t.closeComboBox=function(e){if(this.isOpen){this.isOpen=!1;var t=document.getElementById(this.id+"_nmdrMSpopupDiv");nmdr.core.animate.fadeOut(null,t,null,!0,function(){t.style.display="none",t.style.height="0px",e&&e()}),document.getElementById(this.id+"_nmdrMSonoffImg").src=this.imagePath+"/tabdown.png",nmdr.core.popup.close()}},t.setEnabled=function(e){this.enabled=e;var t=document.getElementById(this.id+"_nmdrMSinfodiv");e?(t.style.opacity=1,t.style.cursor="pointer"):(t.style.opacity=.5,t.style.cursor="default")},t.updateInfo=function(){for(var e=0,t=0;t<this.checkboxes.length;t++)this.checkboxes[t].checked&&e++;document.getElementById(this.id+"_nmdrMSinfoSpan").innerHTML=0==e?this.infoText:e+("en"==this.lang?" selected":" ausgewählt")},t.checkAll=function(){for(var e=0;e<this.checkboxes.length;e++)this.checkboxes[e].checked=!0;document.getElementById(this.id+"_nmdrMSoverlayDiv").innerHTML=this.makeCheckboxes(),this.updateInfo()},t.uncheckAll=function(){for(var e=0;e<this.checkboxes.length;e++)this.checkboxes[e].checked=!1;document.getElementById(this.id+"_nmdrMSoverlayDiv").innerHTML=this.makeCheckboxes(),this.updateInfo()},t.toggleCheckBox=function(e){var t=this.checkboxes[e];t.checked=!t.checked;var i=this.imagePath+(t.checked?"/checkboxon.png":"/checkboxoff.png");document.getElementById(this.id+"_nmdrMScheckbox"+e+"_img").src=i,this.updateInfo()},t.getCheckeds=function(){for(var e="",t=0;t<this.checkboxes.length;t++)e+=this.checkboxes[t].title,t<this.checkboxes.length-1&&(e+=";");return e},t.endSelection=function(){this.closeComboBox(),this.actionPerformed(this.getCheckeds())},t.actionPerformed=function(e){},t}