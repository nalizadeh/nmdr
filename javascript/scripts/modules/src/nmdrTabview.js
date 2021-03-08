/*
Copyright (C) 2015-2018 nalizadeh.com

This program is free software: you can redistribute it and/or modify 
it under the terms of the GNU General Public License as published by 
the Free Software Foundation, version 3 or any later version.

This program is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License 
along with this program. If not, see http://www.gnu.org/licenses/

#####################################################################
#
#  nmdrTabview
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTabview(id) {
	
	var $ = nmdr.core.$(id, "nmdrTabview");
	if ($ == null) return;

    $.tabs = [];
	$.currTab = -1;
	$.padding = 5;
	$.background = "#fff";

    $.addTab = function (tabid, tabname, tabcallback, taburl) {
        this.tabs.push({ id: tabid, name: tabname, callback: tabcallback, url: taburl, html: null });
    };
	
    $.build = function (nr, titleWidth, w, h) {
		var self = this;
		nmdr.core.onLoad(function() { self.doBuild(nr, titleWidth, w, h); });
	};

    $.doBuild = function (nr, titleWidth, w, h) {

        var prefix = "#" + this.id + "_nmdrTV", tw = titleWidth, buf = [];

        buf.push(
		"<style>" +
			prefix + " * { box-sizing: content-box !important; }" +
			prefix + " ul { width:100%; margin:0; padding:0 0 26px 0; font:normal 14px arial, sans, sans-serif; -list-style-type:none; }" +
			prefix + " ul li { display:inline; float:left; height:24px;" + (tw ? " width:" + tw + "px; " : "") + "min-width:80px; text-align:center; padding:0; margin:1px 0px 0px 0px; border:1px solid #ccc; border-radius:8px 0 0 0; }" +
			prefix + " ul li a { float:left; color:#666; text-decoration:none;" + (tw? " width:" + (tw-8) + "px; " : "") + "padding:4px; text-align:center; background-color:#eee; min-width:80px; border-bottom:1px solid #ccc; border-radius:8px 0 0 0; }" +
			prefix + " ul li a.selected { color:#000; font-weight:bold; background-color:#fff; border-bottom:1px solid #fff; }" +
			prefix + " ul li a:hover { color:#000; font-weight:bold; }" +
			prefix + "Container { box-sizing:border-box; width:" + (w ? w + "px" : "100%") + "; height:" + (h ? h + "px" : "100%") + "; padding:" + this.padding + "px; margin:0; background:" + this.background + "; border:1px solid #ccc; }" +
		"</style>");

        buf.push("<div id='" + this.id + "_nmdrTV'><ul>");
		
        for (var i = 0; i < this.tabs.length; i++) {
            buf.push("<li><a href='#' rel='" + i + "' onclick=\"nmdr.core.$('" + this.id + "').loadTab(this);\">" + this.tabs[i].name + "</a></li>");
		}

        buf.push("</ul></div>");
		buf.push("<div id='" + this.id + "_nmdrTVContainer'></div>");

        this.innerHTML = buf.join("");
		
        for (var i = 0; i < this.tabs.length; i++) {
			if (this.tabs[i].url == null) {
				var cont = document.getElementById(this.tabs[i].id);
				this.tabs[i].html = cont.innerHTML;
				cont.parentNode.removeChild(cont);
			}
		}

        this.loadTab(null, nr);
    };

    $.loadTab = function (tab, nr) {
		
		var tabs = document.getElementById(this.id + "_nmdrTV").getElementsByTagName("a");
		tab = tab ? tab : nr ? tabs[nr] ? tabs[nr] : tabs[0] : tabs[0];	
        var n = parseInt(tab.rel), cont = document.getElementById(this.id + "_nmdrTVContainer"), self = this;
		
		if (this.currTab == n) return;
		
		this.currTab = n;
		
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].rel == tab.rel) tabs[i].className = "selected";
            else tabs[i].className = "";
        }		
		
		setTimeout(
			function() {
				if (self.tabs[n].url == null) {
					cont.innerHTML = self.tabs[n].html;	
					if (self.tabs[n].callback) self.tabs[n].callback();	
				}
				else {
					cont.innerHTML = "<iframe src='" + self.tabs[n].url + 
					"' style='width:100%; height:100%; border:none; margin:0; padding:0;'></iframe>"
				}
			}, 10
		);
    };
	
	$.selectTab = function (nr) {
		var tabs = document.getElementById(this.id + "_nmdrTV").getElementsByTagName("a");
		if (tabs[nr]) this.loadTab(tabs[nr]);
	};

    return $;
}
