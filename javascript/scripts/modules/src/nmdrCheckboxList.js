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
#  nmdrCheckboxList
#
#  Version: 1.00.00
#  Date: October 06. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrCheckboxList(id) {
	
	var $ = nmdr.core.$(id, "nmdrCheckboxList");
	if ($ == null) return;

    $.imagePath = "img/";
    $.enabled = true;
    $.color = "#666";
    $.background = "#F7F3F7";
    $.backgroundImage = "ribbonBackground.png";
    $.font = "normal 11px/2 Verdana, Arial, Helvetica, sans-serif;";
    $.width = 240;
    $.height = 140;
    $.isOpen = false;
    $.checkboxes = [];

    $.build = function (checkboxes, width, height, imagePath) {

        this.checkboxes = checkboxes;

        if (width) this.width = width;
        if (height) this.height = height;
        if (imagePath) this.imagePath = imagePath + "/";

        var pfx = "#" + this.id + "_nmdrCBL",
		styles = "<style>" +
		pfx + " { position:relative; margin:0; padding:0; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none; }" +
		pfx + " .nmdrCBLcheckbox:hover { cursor:pointer; background:#0073C6; color:#FFFFFF; }" +
		"</style>";

        var buf = [];

        buf.push("<div id='" + this.id + "_nmdrCBL' style='display:block;'>");
        buf.push("<div id='" + this.id + "_nmdrCBLoverlayDiv' style='position:absolute;left:0px;top:0px;width:" + this.width + "px;height:" + this.height + "px;background:#fff;border:1px solid #ccc;overflow-x:hiden;overflow-y:auto;'>");
        buf.push(this.makeCheckboxes());
        buf.push("</div></div>");

        this.innerHTML = styles + buf.join("");
		
		return this;
    };

    $.makeCheckboxes = function () {
        var buf = [];
        buf.push("<div style='padding:2px;'>");
        buf.push("<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>");

        for (var i = 0; i < this.checkboxes.length; i++) {
            var cb = this.checkboxes[i];
            var id = this.id + "_nmdrCBLcheckbox" + i;
            var im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png");

            buf.push("<tr><td class='nmdrCBLcheckbox' id='" + id + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').toggleCheckBox(" + i + ");\">" +
			    "<table cellpadding='2' cellspacing='0' border='0'><tr>" +
				    "<td style='vertical-align:middle;'><img id='" + id + "_img' src='" + im + "'></td>" +
				    "<td style='vertical-align:middle;'><span>" + cb.title + "</span></td>" +
			    "</tr></table></td></tr>");
        }

        buf.push("</table></div>");
        return buf.join("");
    };

    $.checkAll = function () {
        for (var i = 0; i < this.checkboxes.length; i++) this.checkboxes[i].checked = true;
        document.getElementById(this.id + "_nmdrCBLoverlayDiv").innerHTML = this.makeCheckboxes();
    };

    $.uncheckAll = function () {
        for (var i = 0; i < this.checkboxes.length; i++) this.checkboxes[i].checked = false;
        document.getElementById(this.id + "_nmdrCBLoverlayDiv").innerHTML = this.makeCheckboxes();
    };

    $.toggleCheckBox = function (nr) {
        var cb = this.checkboxes[nr];
        cb.checked = !cb.checked;
        var im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png")
        document.getElementById(this.id + "_nmdrCBLcheckbox" + nr + "_img").src = im;
    };

    $.getCheckeds = function () {
        var checkeds = "";
        for (var i = 0; i < this.checkboxes.length; i++) {
            checkeds += this.checkboxes[i].title;
            if (i < this.checkboxes.length - 1) checkeds += ";";
        }
        return checkeds;
    };

    $.endSelection = function () {
        this.closeComboBox();
        this.actionPerformed(this.getCheckeds());
    };

    $.actionPerformed = function (checkeds) {
    };

    return $;
}

