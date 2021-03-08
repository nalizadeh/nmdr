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
#  nmdrRibbon
#
#  Version: 1.00.00
#  Date: April 18. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrRibbon(id) {
	
	var $ = nmdr.core.$(id, "nmdrRibbon");
	if ($ == null) return;

    $.imagePath = "img/";
    $.lang = "en";
    $.color = "#666";
    $.background = "#F7F3F7";
    $.backgroundImage = "ribbonBackground.png";
    $.font = "normal 11px 'Segoe UI',Tahoma,Verdana,sans-serif"; // "normal 0.8em Calibri, Arial, Trebuchet MS";
    $.height = 32;
    $.buttonWidth = 62;
    $.isOpen = false;
    $.isMenuOpen = false;
    $.isComboOpen = false;
    $.selectedButton = null;
    $.tabs = [];

    $.build = function (xml, lang, imagePath) {

        if (xml == null) xml = this.prepareTestRibbon();
        if (lang) this.lang = lang;
        if (imagePath) this.imagePath = imagePath + "/";

        this.readFromXML(xml);

        var pfx = "#" + this.id + "_nmdrRB";

        var styles =
        "<style>" +
			"#" + this.id + " { position:relative !important; }" +

			pfx + " { position:absolute; width:100%; height:" + this.height + "px; top:0px; left:0px; margin:0; padding:0; " +
						"font:" + this.font + "; color:" + this.color + "; background:" + this.background + "; border-bottom:1px solid transparent; " +
                        "-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none; }" +

			pfx + " .navibuttDiv { vertical-align:middle; padding:0 10px 0 10px; cursor:pointer; }" +
			pfx + " .tabDiv { height:" + (this.height - 3) + "px; line-height:" + (this.height - 3) + "px; vertical-align:middle; " +
						" border:1px solid transparent; border-top:3px solid transparent; }" +

			pfx + " .tabDivText { height:" + (this.height - 3) + "px; padding:0px 10px 0px 10px; background:" + this.background + "; }" +
			pfx + " .tabDivText:hover { cursor:pointer; color:orange !important; background:#fff !important; }" +
			pfx + " .tabDivSelected .tabDivText { background:#fff; }" +
			pfx + " .tabDivIngroup .tabDivText { background:#eee; }" +

			pfx + " .containerDiv { vertical-align:top; padding:0; margin:0; display:none; z-index:998; font-size:11px; color:#23272c; line-height:1em;" +
						"border-bottom:1px solid transparent; border-top:none; background-image:url(" + this.imagePath + this.backgroundImage + ") !important;" +
						"background-repeat:no-repeat; background:#fff; }" +

			pfx + " .groupDiv { vertical-align:top; padding:2px 4px 0px 4px; height:88px; border-right:1px solid #ccc; }" +

			pfx + " .buttonDiv { vertical-align:top; padding:4px 0px 0px 0px; height:68px; overflow:hidden; border:1px solid transparent; }" +
			pfx + " .buttonDivtd { text-align:center; vertical-align:top; text-overflow:ellipsis; white-space:normal; }" +
			pfx + " .buttonDiv:hover { cursor:pointer; border:1px solid orange; background-image:url(" + this.imagePath +
					"ribbonButtonHover.png) !important;background-repeat:repeat; }" +

			pfx + " .smallbuttonsDiv { vertical-align:top; padding:4px 0px 0px 0px; height:68px; overflow:hidden; border:1px solid transparent; }" +
			pfx + " .smallbuttonDiv { height:20px; padding:2px 2px 0px 2px;}" +
			pfx + " .smallbuttonDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonButtonHover.png) !important;background-repeat:repeat; }" +

 			pfx + " .checkboxesDiv { vertical-align:top; padding:4px 0px 0px 0px; height:68px; overflow:hidden; border:1px solid transparent; }" +
			pfx + " .checkboxDiv { padding:0px 2px 0px 2px; }" +
			pfx + " .checkboxDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +

 			pfx + " .radiobuttonsDiv { vertical-align:top; padding:4px 0px 0px 0px; height:68px; overflow:hidden; border:1px solid transparent; }" +
			pfx + " .radiobuttonDiv { padding:0px 2px 0px 2px; }" +
			pfx + " .radiobuttonDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +

 			pfx + " .comboboxesDiv { vertical-align:top; padding:4px 0px 0px 0px; height:68px; overflow:hidden; border:1px solid transparent; }" +
			pfx + " .comboboxDiv { padding:0px 2px 0px 2px; border:1px solid #ccc; background:#fff; }" +
			pfx + " .comboboxDiv:hover { cursor:pointer; border:1px solid orange; }" +
			pfx + " .comboitemDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +

			pfx + " .menuitemDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +
			pfx + " .groupnameDiv { height:16px; text-align:center; font-size:11px; color:#666; }" +

			pfx + " .itemDisabled { opacity:0.5; cursor:default !important;}" +
			pfx + " .popupDiv { background:#fff;padding:4px;border:1px solid #ccc;font-size:11px; z-index:999;}" +
		"</style>";

        var buf = [];
        buf.push("<div id='" + this.id + "_nmdrRB' style='display:inline-block;'>");
        buf.push("<div class='navibuttDiv' style='display:inline-block;'><img id='" + this.id + "_nmdrRB_naviimg' src='" + this.imagePath + "tabdown.png'></div>");

        for (var i = 0; i < this.tabs.length; i++) {
            var tab = this.tabs[i];
            buf.push("<div class='tabDiv' id='" + this.id + "_nmdrRB_tabDiv" + i + "' style='display:inline-block;' onclick=\"nmdr.core.$('" +	this.id + "').selectTab(" + tab.number + 
			");\"><div class='tabDivText' style='display:inline-block;'>" + tab.text + "</div></div>");
        }

        buf.push("<div id='" + this.id + "_nmdrRB_container' class='containerDiv' style='position:absolute;left:0px;top:0px;width:100%;height:90px;display:none;'></div>");
        buf.push("<div id='" + this.id + "_nmdrRB_popup' class='popupDiv' style='position:absolute;left:0px;top:0px;width:0px;height:0px;display:none;'></div>");
        buf.push("<div id='" + this.id + "_nmdrRB_sizeCalculator' style='position:absolute;top:0px;left:0px;visibility:hidden;'></div>");
        buf.push("</div>");

        this.innerHTML = styles + buf.join("");
		
		return this;
    };

    $.selectTab = function (n) {

        var tags = document.getElementById(this.id + "_nmdrRB").getElementsByClassName("tabDiv");

        if (tags[n].className.indexOf("tabDivSelected") != -1) return;

        for (var i = 0; i < tags.length; i++) {
            tags[i].className = "tabDiv";
            tags[i].style.color = this.color;
            tags[i].style.borderColor = "transparent";
        }

        if (n == 0) {
            if (this.isOpen) {
                this.closeTab(n);
                this.isOpen = false;
                document.getElementById(this.id + "_nmdrRB").style.borderBottomColor = "transparent";
                document.getElementById(this.id + "_nmdrRB_container").style.borderBottomColor = "transparent";
                document.getElementById(this.id + "_nmdrRB_naviimg").src = this.imagePath + '/tabdown.png';
            }
        }
        else {
            var c = this.tabs[n].color;

            document.getElementById(this.id + "_nmdrRB").style.borderBottomColor = c;
            document.getElementById(this.id + "_nmdrRB_container").style.borderBottomColor = c;
            document.getElementById(this.id + "_nmdrRB_naviimg").src = this.imagePath + "/tabup.png";

            tags[n].className += " tabDivSelected";
            tags[n].style.color = c;
            tags[n].style.borderColor = c;
            tags[n].style.borderBottomColor = "#fff";

            for (var i = 0; i < this.tabs.length; i++) {
                if (i != n && this.tabs[i].groupnumber == this.tabs[n].groupnumber) {
                    c = this.tabs[i].color;
                    tags[i].className += " tabDivIngroup";
                    tags[i].style.borderColor = c;
                }
            }
            this.openTab(n);
            this.isOpen = true;
        }
    };

    $.openTab = function (nr) {
        var self = this, cont = document.getElementById(this.id + "_nmdrRB_container");
        cont.style.left = "0px";
        cont.style.top = "0px";
        cont.style.opacity = 0.0;
        this.createTabContent(nr);
        cont.style.display = "inline";
        nmdr.core.animate.scrollX(cont, 0, this.height + 1, 1, function () { self.tabOpened(nr); });
    };

    $.closeTab = function (nr) {
        var self = this, cont = document.getElementById(this.id + "_nmdrRB_container");
        nmdr.core.animate.scrollX(cont, 0, -(this.height + 1), -1, function () {
            cont.style.display = "none";
            cont.style.left = "0px";
            cont.style.top = "0px";
            self.tabClosed(nr);
        });
    };

    $.tabOpened = function (nr) { };
    $.tabClosed = function (nr) { };

    //=================

    $.getItem = function (id) {

        var find = function (id, items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) return items[i];
            }
        };

        var it = null;
        for (var i = 1; i < this.tabs.length; i++) {
            it = find(id, this.tabs[i].groups);
            if (it != null) break;
            for (var j = 0; j < this.tabs[i].groups.length; j++) {
                it = find(id, this.tabs[i].groups[j].buttons);
                if (it != null) break;
                it = find(id, this.tabs[i].groups[j].checkboxes);
                if (it != null) break;
                it = find(id, this.tabs[i].groups[j].radiobuttons);
                if (it != null) break;
                it = find(id, this.tabs[i].groups[j].comboboxes);
                if (it != null) break;
            }
            if (it != null) break;
        }
        return it;
    };

    $.actionPerformed = function (command) {
        alert("You started command: " + command);
    };

    $.executeCommand = function (event, id) {
        var self = this;
        if (this.closePopups(function () { self.executeCommand(event, id); })) return;

        var bx = this.getItem(id);
        if (bx != null) {
            if (bx.menu.length > 0) this.openMenu(event, bx);
            else this.actionPerformed(bx.command);
        }
    };

    $.executeMenuCommand = function (event, command) {
        var self = this;
        this.closeMenu(function () { self.actionPerformed(command); });
    };

    $.toggleCheckBox = function (id) {
        var self = this;
        if (this.closePopups(function () { self.toggleCheckBox(id); })) return;

        var cb = this.getItem(id);
        cb.checked = !cb.checked;
        var im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png")
        document.getElementById(this.id + "_nmdrRB_checkboxDiv_" + id + "_img").src = im;
        if (cb.command) this.actionPerformed(cb.command);
    };

    $.selectRadioButton = function (groupid, id) {
        var self = this;
        if (this.closePopups(function () { self.selectRadioButton(groupid, id); })) return;

        var gr = this.getItem(groupid), rbt = null;
        for (var i = 0; i < gr.radiobuttons.length; i++) {
            var rb = gr.radiobuttons[i];
            rb.selected = rb.id == id;
            var im = this.imagePath + (rb.selected ? "/radiobutton.png" : "/radiobuttoff.png");
            document.getElementById(this.id + "_nmdrRB_radiobuttonDiv_" + rb.id + "_img").src = im;
            if (rb.selected) rbt = rb;
        }
        if (rbt && rbt.command) this.actionPerformed(rbt.command);
    };

    $.selectComboBox = function (id, itm) {
        var self = this, co = this.getItem(id);
        co.selected = itm;
        document.getElementById(this.id + "_nmdrRB_comboboxDiv_" + co.id + "_input").innerHTML = itm;
        this.closeComboBox(function () { self.actionPerformed(co.command); });
    };

    $.openMenu = function (event, button) {
        var self = this;
        if (this.closePopups(function () { self.openMenu(event, button); })) return;

        this.isMenuOpen = true;

        var buf = [];
        for (var i = 0; i < button.menu.length; i++) {
            var itm = button.menu[i];

            buf.push(
             "<div class='menuitemDiv' style='display:block;' " +
                 "onclick=\"nmdr.core.$('" + this.id + "').executeMenuCommand(event,'" + itm.command + "');\">" +
                 "<table cellpadding='2' cellspacing='0' border='0'>" +
                     "<tr>" +
                         "<td><img src='" + itm.image + "' title='" + itm.tooltip + "'></td>" +
                         "<td style='vertical-align:middle;'><span style='font-size:12px;font-weight:bold;'>" + itm.text +
                         "</span><br><span style='font-size:11px;font-weight:normal;'>" + itm.description + "</span></td>" +
                     "</tr>" +
                 "</table>" +
             "</div>");
        }

        this.selectedButton = this.id + "_nmdrRB_buttonDiv_" + button.id;

        var
		m = document.getElementById(this.id + "_nmdrRB_popup"),
		n = document.getElementById(this.selectedButton),
		d = document.getElementById(this.id + "_nmdrRB_sizeCalculator"),
		o = this.absPosition, 
		t = n.absPosition, 
		b = buf.join("");

        d.innerHTML = b;
        m.innerHTML = b;

        n.style.background = "url(" + this.imagePath + "ribbonButtonHover.png)";

        m.style.display = "inline-block";
        m.style.top = t.top - o.top + n.offsetHeight + "px";
        m.style.left = t.left - o.left + "px";
        m.style.width = d.offsetWidth + 4 + "px";
        m.style.height = d.offsetHeight + "px";
        m.style.opacity = 0.0;

        d.innerHTML = "";

        nmdr.core.popup.open(m, event.target, null, function (cb) { self.closeMenu(cb); });
        nmdr.core.animate.fadeIn(null, m, null, true);
        nmdr.core.utils.stopPropagation(event);
    };

    $.closeMenu = function (callback) {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;

            var m = document.getElementById(this.id + "_nmdrRB_popup"),
				n = document.getElementById(this.selectedButton);

            nmdr.core.animate.fadeOut(null, m, null, true, function () {
                m.style.display = "none";
                m.style.top = "0px";
                m.style.left = "0px";
                m.style.width = "0px";
                m.style.height = "0px";
                n.style.background = "transparent";
                if (callback) callback();
            });
            nmdr.core.popup.close();
        }
    };

    $.openComboBox = function (event, id) {
        var self = this;
        if (this.closePopups(function () { self.openComboBox(event, id); })) return;

        this.isComboOpen = true;

        var buf = [], cbox = this.getItem(id);
        for (var i = 0; i < cbox.items.length; i++) {
            var itm = cbox.items[i];

            buf.push(
             "<div class='comboitemDiv' style='display:block;' onclick=\"nmdr.core.$('" + this.id + "').selectComboBox('" + id + "','" + itm + "');\">" +
                 "<table cellpadding='2' cellspacing='0' border='0'>" +
                     "<tr><td style='vertical-align:middle;'>" + itm + "</td></tr>" +
                 "</table>" +
             "</div>");
        }

        var
		m = document.getElementById(this.id + "_nmdrRB_popup"),
		n = document.getElementById(this.id + "_nmdrRB_comboboxDiv_" + id),
		d = document.getElementById(this.id + "_nmdrRB_sizeCalculator"),
		o = this.absPosition,
		t = n.absPosition,
		b = buf.join("");

        d.innerHTML = b;
        m.innerHTML = b;

        m.style.display = "inline-block";
        m.style.top = t.top - o.top + n.offsetHeight + "px";
        m.style.left = t.left - o.left + "px";
        m.style.width = (d.offsetWidth < cbox.width ? cbox.width - 4 : d.offsetWidth) + "px";
        m.style.height = d.offsetHeight + "px";

        d.innerHTML = "";

        nmdr.core.popup.open(m, event.target, null, function (cb) { self.closeComboBox(cb); });
        nmdr.core.animate.fadeIn(null, m, null, true);
        nmdr.core.utils.stopPropagation(event);
    };

    $.closeComboBox = function (callback) {
        if (this.isComboOpen) {
            this.isComboOpen = false;

            var m = document.getElementById(this.id + "_nmdrRB_popup");

            nmdr.core.animate.fadeOut(null, m, null, true, function () {
                m.style.display = "none";
                m.style.top = "0px";
                m.style.left = "0px";
                m.style.width = "0px";
                m.style.height = "0px";
                if (callback) callback();
            });
            nmdr.core.popup.close();
        }
    };

    $.closePopups = function (callback) {
        if (this.isMenuOpen) {
            this.closeMenu(callback);
            return true;
        }
        if (this.isComboOpen) {
            this.closeComboBox(callback);
            return true;
        }
        return false;
    };

    $.enableItem = function (id, enabled) {
        var it = this.getItem(id);
        if (it) it.enabled = enabled;
    };

    //==========================

    $.createTabContent = function (nr) {

        var tab = this.tabs[nr], buf = [];

        for (var i = 0, n = 0; i < tab.groups.length; i++) {
            var group = tab.groups[i], smallbts = [];

            buf.push("<div class='groupDiv' style='display:inline-block;'>");

            //======= Buttons

            for (var j = 0; j < group.buttons.length; j++) {
                var bt = group.buttons[j];
                if (bt.size == "16") {
                    smallbts.push(bt);
                    continue;
                }

                var me = "";
                if (bt.menu && bt.menu.length > 0) {
                    me = "<br><img src='" + this.imagePath + "/menuf.png'>";
                }

                buf.push(
				"<div class='buttonDiv" + (bt.enabled ? "'" : " itemDisabled'") + "id='" + this.id + "_nmdrRB_buttonDiv_" + bt.id + "' style='display:inline-block;'" +
					(bt.enabled ? " onclick=\"nmdr.core.$('" + this.id + "').executeCommand(event, '" + bt.id + "');\"" : "") + ">" +
					"<table cellpadding='2' cellspacing='0' border='0'>" +
						"<tr><td class='buttonDivtd' style='width:" + bt.width + "px;'><img src='" + bt.image + "' title='" + bt.tooltip + "'></td></tr>" +
						"<tr><td class='buttonDivtd' style='width:" + bt.width + "px;'>" + bt.text + me + "</td></tr>" +
					"</table>" +
				"</div>");
            }

            //======= SmallButtons

            if (smallbts.length > 0) {
                var rw = 0;
                do {
                    buf.push("<div class='smallbuttonsDiv' style='display:inline-block;'>");

                    for (var j = 0; rw < smallbts.length; j++, rw++) {
                        if (j > 0 && j % 3 == 0) break;

                        var bt = smallbts[rw], me = "";
                        if (bt.menu && bt.menu.length > 0) {
                            me = "&nbsp;<img src='" + this.imagePath + "/menuf.png' " +
						    "onclick=\"nmdr.core.$('" + this.id + "').openMenu(event, " + nr + ");\">";
                        }

                        buf.push(
					    "<div class='smallbuttonDiv" + (bt.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrRB_buttonDiv_" + bt.id + "' style='display:block;' " +
							    (bt.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').executeCommand(event, '" + bt.id + "');\"" : "") + ">" +
						    "<table cellpadding='1' cellspacing='0' border='0'>" +
							    "<tr><td><img src='" + bt.image + "' title='" + bt.tooltip + "'></td>" +
							    "<td style='vertical-align:middle;'><span>" + bt.text + me + "</span></td></tr>" +
						    "</table>" +
					    "</div>");
                    }
                    buf.push("</div>");
                } while (rw < smallbts.length);
            }

            //======= CheckBoxes

            if (group.checkboxes.length > 0) {
                var rw = 0;
                do {
                    buf.push("<div class='checkboxesDiv' style='display:inline-block;'>");

                    for (var j = 0; rw < group.checkboxes.length; j++, rw++) {
                        if (j > 0 && j % 3 == 0) break;

                        var cb = group.checkboxes[rw],
						    im = this.imagePath + (cb.checked ? "/checkboxon.png" : "/checkboxoff.png");

                        buf.push(
					    "<div class='checkboxDiv" + (cb.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrRB_checkboxDiv_" + cb.id + "' style='display:block;' " +
							    (cb.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').toggleCheckBox('" + cb.id + "');\"" : "") + ">" +
						    "<table cellpadding='1' cellspacing='0' border='0'><tr>" +
							    "<td style='vertical-align:middle;'>" +
								    "<img id='" + this.id + "_nmdrRB_checkboxDiv_" + cb.id + "_img' src='" + im + "' title='" + cb.tooltip + "'></td>" +
							    "<td style='vertical-align:middle;'><span>" + cb.text + "</span></td>" +
						    "</tr></table>" +
					    "</div>");
                    }
                    buf.push("</div>");
                } while (rw < group.checkboxes.length);
            }

            //======= RadioButtons

            if (group.radiobuttons.length > 0) {
                var rw = 0;
                do {
                    buf.push("<div class='radiobuttonsDiv' style='display:inline-block;'>");

                    for (var j = 0; rw < group.radiobuttons.length; j++, rw++) {
                        if (j > 0 && j % 3 == 0) break;

                        var rb = group.radiobuttons[rw],
							im = this.imagePath + (rb.selected ? "/radiobutton.png" : "/radiobuttoff.png");

                        buf.push(
						"<div class='radiobuttonDiv" + (rb.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrRB_radiobuttonDiv_" + rb.id + "' style='display:block;' " +
								(rb.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').selectRadioButton('" + group.id + "','" + rb.id + "');\"" : "") + ">" +
							"<table cellpadding='1' cellspacing='0' border='0'><tr>" +
								"<td style='vertical-align:middle;'>" +
									"<img id='" + this.id + "_nmdrRB_radiobuttonDiv_" + rb.id + "_img' src='" + im + "' title='" + rb.tooltip + "'></td>" +
								"<td style='vertical-align:middle;'><span>" + rb.text + "</span></td>" +
							"</tr></table>" +
						"</div>");
                    }
                    buf.push("</div>");
                } while (rw < group.radiobuttons.length);
            }

            //======== ComboBox

            if (group.comboboxes.length > 0) {
                var rw = 0;
                do {
                    buf.push("<div class='comboboxesDiv' style='display:inline-block;'>");

                    for (var j = 0; rw < group.comboboxes.length; j++, rw++) {
                        if (j > 0 && j % 3 == 0) break;

                        var co = group.comboboxes[rw],
							id = this.id + "_nmdrRB_comboboxDiv_" + co.id,
							sel = co.selected ? ("<span>" + co.selected + "</span>") : "";

                        buf.push(
							"<div class='comboboxDiv" + (co.enabled ? "'" : " itemDisabled'") + " id='" + id + "' style='display:block;width:" + co.width + "px;height:" + co.height + "px;'" +
								(co.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').openComboBox(event,'" + co.id + "');\"" : "") + ">" +

								"<table cellpadding='1' cellspacing='0' border='0' width='100%' height='100%'><tr>" +
									"<td id='" + id + "_input' style='vertical-align:middle;" +
										"border-right:1px solid #ccc; overflow:hidden; white-space:nowrap; text-overflow:clip;'>" + sel + "</td>" +
									"<td style='width:18px; vertical-align:middle; text-align:center;padding:0 0 2px 2px;'><img src='" + this.imagePath + "/menuf.png'></td>" +
								"</tr></table>" +
							"</div>");
                    }
                    buf.push("</div>");
                } while (rw < group.comboboxes.length);
            }

            buf.push("<div class='groupnameDiv' style='display:block;cursor:default;'>" + group.text + "</div>");
            buf.push("</div>");
        }

        document.getElementById(this.id + "_nmdrRB_container").innerHTML = buf.join("");
    };

    //=======================================
    // XML
    //=======================================

    $.readFromXML = function (xml) {
        var root = nmdr.core.xml.read(xml, "Ribbon");
        var ribbon = this.createRibbon(root);

        for (var i = 0, n = 0; i < ribbon.tabgroups.length; i++) {
            var tabgroup = ribbon.tabgroups[i];
            for (var j = 0; j < tabgroup.tabs.length; j++) {
                tabgroup.tabs[j].groupnumber = i;
                tabgroup.tabs[j].number = n;
                this.tabs.push(tabgroup.tabs[j]);
                n++;
            }
        }
    };

    $.createRibbon = function (root) {
        var ribbon = { id: root.attributes['id'], title: root.attributes['title'], tabgroups: [] };

        ribbon.tabgroups.push({ id: "x", tabs: [{ id: "x", text: this.lang == "en" ? "BROWSE" : "DURCHSUCHEN", groups: [] }] });

        for (var i in root.childNodes) {
            if (root.childNodes[i].name) {
                ribbon.tabgroups.push(this.addTabGroup(root.childNodes[i]));
            }
        }

        return ribbon;
    };

    $.addTabGroup = function (node) {
        var tabgroup = { id: node.attributes["id"], color: node.attributes["color"], tabs: [] };
        for (var i in node.childNodes) {
            if (node.childNodes[i].name) {
                tabgroup.tabs.push(this.addTab(node.childNodes[i], tabgroup.color));
            }
        }
        return tabgroup;
    };

    $.addTab = function (node, tcolor) {
        var tab = {
            id: node.attributes["id"],
            text: node.attributes["text"],
            groupnumber: -1,
            number: -1,
            color: tcolor,
            groups: []
        };
        for (var i in node.childNodes) {
            if (node.childNodes[i].name) {
                tab.groups.push(this.addGroup(node.childNodes[i]));
            }
        }
        return tab;
    };

    $.addGroup = function (node) {
        var group = { id: node.attributes["id"], text: node.attributes["text"], buttons: [], checkboxes: [], radiobuttons: [], comboboxes: [] };
        for (var i in node.childNodes) {
            var name = node.childNodes[i].name;

            if (name && name == "Button")
                group.buttons.push(this.addButton(node.childNodes[i]));
            else if (name && name == "CheckBox")
                group.checkboxes.push(this.addCheckBox(node.childNodes[i]));
            else if (name && name == "RadioButton")
                group.radiobuttons.push(this.addRadioButton(node.childNodes[i]));
            else if (name && name == "ComboBox")
                group.comboboxes.push(this.addComboBox(node.childNodes[i]));
        }
        return group;
    };

    $.addButton = function (node) {
        var button = {
            id: node.attributes["id"],
            text: node.attributes["text"],
            tooltip: node.attributes["tooltip"],
            command: node.attributes["command"],
            enabled: node.attributes["enabled"].toLowerCase() == "true",
            size: node.attributes["size"],
            image: node.attributes["image"],
            width: node.attributes["width"] ? parseInt(node.attributes["width"]) : this.buttonWidth,
            menu: [],
        };
        for (var i in node.childNodes) {
            if (node.childNodes[i].name) {
                var nd = node.childNodes[i];
                var item = {
                    id: nd.attributes["id"],
                    text: nd.attributes["text"],
                    tooltip: nd.attributes["tooltip"],
                    description: nd.attributes["description"],
                    image: nd.attributes["image"],
                    command: nd.attributes["command"],
                    enabled: nd.attributes["enabled"].toLowerCase() == "true"
                };
                button.menu.push(item);
            }
        }
        return button;
    };

    $.addCheckBox = function (node) {
        var cbox = {
            id: node.attributes["id"],
            text: node.attributes["text"],
            tooltip: node.attributes["tooltip"],
            command: node.attributes["command"],
            enabled: node.attributes["enabled"].toLowerCase() == "true",
            checked: node.attributes["checked"].toLowerCase() == "true"
        };
        return cbox;
    };

    $.addRadioButton = function (node) {
        var rb = {
            id: node.attributes["id"],
            text: node.attributes["text"],
            tooltip: node.attributes["tooltip"],
            command: node.attributes["command"],
            enabled: node.attributes["enabled"].toLowerCase() == "true",
            selcted: node.attributes["selected"].toLowerCase() == "true"
        };
        return rb;
    };

    $.addComboBox = function (node) {
        var cb = {
            id: node.attributes["id"],
            items: node.attributes["items"].split(","),
            selected: node.attributes["selected"],
            command: node.attributes["command"],
            enabled: node.attributes["enabled"].toLowerCase() == "true",
            width: parseInt(node.attributes["width"]),
            height: parseInt(node.attributes["height"])
        };
        return cb;
    };

    //=======================================

    $.prepareTestRibbon = function () {
        var ribbon = "<?xml version=\"1.0\"?>" +
		"<Ribbon id='MyRibbon' title='MyRibbon'>" +
            "<TabGroup id='MyTabGroup'>" +
			    "<Tab id='My ab' text='HELLO'>" +
				   "<Group id='MyGroup' text='Group'>" +
					    "<Button id='MyButton' " +
						        "text='Button' " +
						        "tooltip='Button' " +
						        "command='NewDocument' " +
						        "size='32' " +
						        "image='ribbon/32x32.png'>" +
					    "</Button>" +
					"</Group>" +
				"</Tab>" +
            "</TabGroup>" +
		"</Ribbon>";
        return ribbon;
    };

    return $;
}

