"use strict";for(var params={},scripts=document.getElementsByTagName("script"),i=0;i<scripts.length;i++)if(-1!=scripts[i].src.indexOf("invoker-min.js")){var qs=scripts[i].src,st=qs.substring(qs.indexOf("?")+1),ss=st.split("&");for(i=0;i<ss.length;i++){var pp=ss[i].split("=");params[pp[0]]=pp[1]}break}var script=document.createElement("script");script.src="javascript/scripts/nmdr-min.js",script.onload=function(){var s=params.function,i=params.id;"calendar"==s&&nmdr.loadModules(["datetime","calendar","phpCalendar","dClock"],function(){nmdr.phpCalendar(i).init({date:new Date,imagePath:"javascript/img/"})},"javascript/scripts/modules/")},document.head.appendChild(script);