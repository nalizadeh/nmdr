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
#  nmdrMultiSelect
#
#  Version: 1.00.00
#  Date: October 06. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrMultiSelect(id) {
	
	var $ = nmdr.core.$(id, "nmdrMultiSelect");
	if ($ == null) return;

    $.imagePath = "img/";
    $.lang = "en";
    $.enabled = true;
    $.color = "#666";
    $.background = "#F7F3F7";
    $.backgroundImage = "ribbonBackground.png";
    $.font = "normal 11px/2 Verdana, Arial, Helvetica, sans-serif;";
    $.width = 240;
    $.height = 140;
    $.isOpen = false;
    $.checkboxes = [];

    $.infoText = "Select options";

    $.build = function (checkboxes, lang, width, height, imagePath) {

        this.checkboxes = checkboxes;

        if (lang) this.lang = lang;
        if (width) this.width = width;
        if (height) this.height = height;
        if (imagePath) this.imagePath = imagePath + "/";

        this.infoText = this.lang == "en" ? "Select options" : "Auswahl";

        var pfx = "#" + this.id + "_nmdrMS",
		styles = "<style>" +
		pfx + " { position:relative; margin:0; padding:0; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none; }" +
		pfx + " .nmdrMSinfoDiv { width:" + this.width + "px; height:24px; font:" + this.font + "; color:" + this.color + "; background:" + this.background + "; border:1px solid #ccc; cursor:pointer; }" +
		pfx + " .nmdrMSpopupDiv { background:#fff; border:1px solid #ccc; border-top:0px; font:" + this.font + "; z-index:100;}" +
		pfx + " .nmdrMSbutton { cursor:pointer; }" +
		pfx + " .nmdrMSbutton:hover { opacity: 0.7; }" +
		pfx + " .nmdrMScheckbox:hover { cursor:pointer; background:#0073C6; color:#FFFFFF; }" +
		"</style>";

        var buf = [];

        buf.push("<div id='" + this.id + "_nmdrMS' style='display:block;'>");
        buf.push("<div class='nmdrMSinfoDiv' " + "id='" + this.id + "_nmdrMSinfodiv' style='display:block;' " +
				"onclick=\"nmdr.core.$('" + this.id + "').openComboBox(event);\">" +
				"<table cellpadding='1' cellspacing='0' border='0' width='100%' height='100%'><tr>" +
					"<td id='" + this.id + "_nmdrMStopInfo' style='vertical-align:middle;" +
						"border-right:1px solid #ccc;'>&nbsp;&nbsp;<span id='" + this.id + "_nmdrMSinfoSpan'>" + this.infoText + "</span></td>" +
					"<td style='width:24px; vertical-align:bottom; text-align:center;padding:2px 0 0 0;'>" +
					"<img id='" + this.id + "_nmdrMSonoffImg' src='" + this.imagePath + "/tabdown.png'></td>" +
				"</tr></table></div>");
        buf.push("<div class='nmdrMSpopupDiv' id='" + this.id + "_nmdrMSpopupDiv' style='position:absolute; left:0px; top:0px; width:0px; height:0px; display:none;'></div>");
        buf.push("</div>");

        this.innerHTML = styles + buf.join("");
        this.updateInfo();
		
		return this;
    };

    $.makeCheckboxes = function () {
        var buf = [];
        buf.push("<div id='" + this.id + "_nmdrMStablediv' style='padding:2px;'>");
        buf.push("<table class='nmdrMStable' width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>");

        for (var i = 0; i < this.checkboxes.length; i++) {
            var cb = this.checkboxes[i];
            var id = this.id + "_nmdrMScheckbox" + i;
            var im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png");

            buf.push("<tr><td class='nmdrMScheckbox' id='" + id + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').toggleCheckBox(" + i + ");\">" +
			    "<table cellpadding='2' cellspacing='0' border='0'><tr>" +
				    "<td style='vertical-align:middle;'><img id='" + id + "_img' src='" + im + "'></td>" +
				    "<td style='vertical-align:middle;'><span>" + cb.title + "</span></td>" +
			    "</tr></table></td></tr>");
        }

        buf.push("</table></div>");
        return buf.join("");
    };

    $.openComboBox = function (event) {

        if (!this.enabled) return;
        if (this.isOpen) { this.closeComboBox(); return; }

        this.isOpen = true;

        var n = document.getElementById(this.id + "_nmdrMS"),
			m = document.getElementById(this.id + "_nmdrMSpopupDiv"),
			o = this.absPosition, 
			t = n.absPosition, 
	
			t1 = this.lang == "en" ? "Check all" : "Alle auswählen",
			t2 = this.lang == "en" ? "Uncheck all" : "Auswahl aufheben",
			self = this,
			buf = [];

        buf.push("<div style='position:absolute;left:0px;top:0px;width:100%;height:28px;background:" + this.background + "; vertical-align:middle;border-bottom:1px solid #ccc;'>");
        buf.push("<table class='daystable' width='100%' height='100%x' cellpadding='4' cellspacing='0' border='0'><tr>");
        buf.push("<td></td>");
        buf.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('" + this.id + "').checkAll();\"><img src='" + this.imagePath + "/check.png' title='" + t1 + "'></td>");
        buf.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('" + this.id + "').uncheckAll();\"><img src='" + this.imagePath + "/uncheck.png' title='" + t2 + "'></td>");
        buf.push("<td class='nmdrMSbutton' style='width:20px;' onclick=\"nmdr.core.$('" + this.id + "').endSelection();\"><img src='" + this.imagePath + "/ok.png'></td>");
        buf.push("</tr></table>");
        buf.push("</div>");

        buf.push("<div id='" + this.id + "_nmdrMSoverlayDiv' style='position:absolute;left:0px;top:30px;width:100%;height:" + (this.height - 30) + "px;background:#fff;overflow-x:hiden;overflow-y:auto;'>");
        buf.push(this.makeCheckboxes());
        buf.push("</div>");

        m.innerHTML = buf.join("");

        m.style.display = "inline-block";
        m.style.top = o.top - t.top + n.offsetHeight + "px";
        m.style.left = t.left - o.left + "px";
        m.style.width = this.width + "px";
        m.style.height = this.height + "px";

        document.getElementById(this.id + "_nmdrMSonoffImg").src = this.imagePath + "/tabup.png";

        nmdr.core.popup.open(m, event.target, null, function (cb) { self.closeComboBox(cb); });
        nmdr.core.animate.fadeIn(null, m, null, true);
        nmdr.core.utils.stopPropagation(event);
    };

    $.closeComboBox = function (callback) {
        if (this.isOpen) {
            this.isOpen = false;

            var m = document.getElementById(this.id + "_nmdrMSpopupDiv");

            nmdr.core.animate.fadeOut(null, m, null, true, function () {
                m.style.display = "none";
                m.style.height = "0px";
                if (callback) callback();
            });
            document.getElementById(this.id + "_nmdrMSonoffImg").src = this.imagePath + "/tabdown.png";
            nmdr.core.popup.close();
        }
    };

    $.setEnabled = function (enabled) {
        this.enabled = enabled;
        var ms = document.getElementById(this.id + "_nmdrMSinfodiv");
        if (enabled) {
            ms.style.opacity = 1.0;
            ms.style.cursor = "pointer";
        }
        else {
            ms.style.opacity = .5;
            ms.style.cursor = "default";
        }
    };

    $.updateInfo = function () {
        var count = 0;
        for (var i = 0; i < this.checkboxes.length; i++)
            if (this.checkboxes[i].checked) count++;
        document.getElementById(this.id + "_nmdrMSinfoSpan").innerHTML = count == 0 ? this.infoText :
			(count + (this.lang == "en" ? " selected" : " ausgewählt"));
    };

    $.checkAll = function () {
        for (var i = 0; i < this.checkboxes.length; i++) this.checkboxes[i].checked = true;
        document.getElementById(this.id + "_nmdrMSoverlayDiv").innerHTML = this.makeCheckboxes();
        this.updateInfo();
    };

    $.uncheckAll = function () {
        for (var i = 0; i < this.checkboxes.length; i++) this.checkboxes[i].checked = false;
        document.getElementById(this.id + "_nmdrMSoverlayDiv").innerHTML = this.makeCheckboxes();
        this.updateInfo();
    };

    $.toggleCheckBox = function (nr) {
        var cb = this.checkboxes[nr];
        cb.checked = !cb.checked;
        var im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png")
        document.getElementById(this.id + "_nmdrMScheckbox" + nr + "_img").src = im;
        this.updateInfo();
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

