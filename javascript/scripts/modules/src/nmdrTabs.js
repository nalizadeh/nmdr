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
#  nmdrTabs
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTabs(id) {
	
	var $ = nmdr.core.$(id, "nmdrTabs");
	if ($ == null) return;

    $.tabs = {};

    $.addTab = function (Name, url) {
        this.tabs[Name] = url;
    };

    $.build = function (nr) {

        var prefix = '#' + this.id + '_nmdrTabs';

        var styles =
        "<style>" +
			prefix + " * { box-sizing: content-box !important; }" +
			prefix + " ul { width:100%; margin:0; padding:0 0 26px 0; font: normal 14px arial, sans, sans-serif; -list-style-type: none; border-bottom: 1px solid gray; }" +
			prefix + " ul li { display: inline; float: left; height: 24px; min-width:80px; text-align:center; padding:0; margin: 1px 0px 0px 0px; border: 1px solid gray; border-radius: 8px 0 0 0; }" +
			prefix + " ul li a { float: left; color: #666; text-decoration: none; padding: 4px; text-align:center; background-color:#eee; min-width:80px; border-bottom: 1px solid gray; border-radius: 8px 0 0 0; }" +
			prefix + " ul li a.selected { color: #000; font-weight:bold; background-color: #fff; border-bottom: 1px solid #fff; }" +
			prefix + " ul li a:hover { color: #000; font-weight:bold; background-color: #fff; }" +
			prefix + "Container { background: white; border:1px solid gray; border-top: none; height:100%; width:100%; padding:0; margin:0; left:0; top:0; }" +
				"iframe { border:none; margin:0; padding:0; }" +
		"</style>";

        var tabsStr = "<div id='" + this.id + "_nmdrTabs'><ul>";
        for (var i = 0, keys = Object.keys(this.tabs), ii = keys.length; i < ii; i++) {
            tabsStr += "<li><a href='#' rel='" + this.tabs[keys[i]] + "' onclick=\"nmdr.core.$('" + this.id + "').loadTab(this);\">" + keys[i] + "</a></li>";
		}
        tabsStr += "</ul></div><iframe id='" + this.id + "_nmdrTabsContainer'></iframe>";

        this.innerHTML = styles + tabsStr;

        var self = this, tabs = document.getElementById(this.id + '_nmdrTabs').getElementsByTagName("a");

        this.loadTab(nr ? tabs[nr] ? tabs[nr] : tabs[0] : tabs[0]);
        this.updateSize();

        window.addEventListener('resize', function () { self.updateSize(); });
    };

    $.loadTab = function (tab) {
        var container = document.getElementById(this.id + "_nmdrTabsContainer");
        container.src = tab.rel;

        var tabs = document.getElementById(this.id + "_nmdrTabs").getElementsByTagName("a");
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].rel == tab.rel) tabs[i].className = "selected";
            else tabs[i].className = "";
        }
    };

	$.selectTab = function (nr) {
        var tabs = document.getElementById(this.id + "_nmdrTabs").getElementsByTagName("a");
		if (tabs[nr]) this.loadTab(tabs[nr]);
	};
	
    $.updateSize = function () {
        var d = nmdr.core.utils.calculateWindowSize(), 
		container = document.getElementById(this.id + "_nmdrTabsContainer");
        container.style.height = d.height - 50 + "px";
    };

    return $;
}
