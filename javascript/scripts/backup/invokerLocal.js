/*
Copyright (C) 2017 nalizadeh.com

This program is free software; you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation; either version 2 of the 
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, 
write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA. 
*/

//
// invoker
//
// Author: Nader Alizadeh
// Copyright: nalizadeh.com
//
// minimize with: http://javascript-minifier.com/
// minimize with: https://jscompress.com/
//

'use strict';

var params = {};
var scripts = document.getElementsByTagName('script');

for (var i=0; i < scripts.length; i++) {
	if (scripts[i].src.indexOf("invokerLocal.js") != -1) {
		var qs = scripts[i].src;
		var st = qs.substring(qs.indexOf("?")+1);
		var ss = st.split("&");
		for (var i=0; i < ss.length; i++) {
			var pp = ss[i].split("=");
			params[pp[0]] = pp[1];
		}
		break;
	}
}

var script = document.createElement("script");
script.src = "javascript/scripts/nmdr.js";
script.onload = function () {
	var fname = params["function"];
	var divid = params["id"];

	if (fname == "calendar") {
		nmdr.loadModules(["datetime", "calendar", "phpCalendar"], function() {
			nmdr.phpCalendar(divid).init(
			{
				date: new Date(), 
				imagePath: "javascript/img/"
			});
		}, "javascript/scripts/modules/");
	}
};

document.head.appendChild(script);
