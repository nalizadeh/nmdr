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
#  nmdrCommands
#
#  Version: 1.00.00
#  Date: April 18. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrCommands(id) {
	
	var $ = nmdr.core.$(id, "nmdrCommands");
	if ($ == null) return;

    $.imagePath = "img/";
    $.lang = "en";
    $.color = "#666";
    $.background = "#F7F3F7";
    $.backgroundImage = "ribbonBackground.png";
    $.font = "normal 11px 'Segoe UI',Tahoma,Verdana,sans-serif"; // "normal 0.8em Calibri, Arial, Trebuchet MS";
    $.buttonWidth = 62;
    $.isMenuOpen = false;
    $.isComboOpen = false;
    $.selectedButton = null;
    $.commands = null;

    //=========================================
    // Asynchronous enabling disabling commands
    //=========================================

    // hashmap to store the state of commands
    $.commandsHash = {};

    // hashmap to store invoked calls
    $.commandsPool = {};

    // method to invoke bevor asyncron call
    $.preCheckMethod = null;

    // method to invoke after asyncron call
    $.postCheckMethod = null;

    // shows whether the check is performing right now
    $.checkIsPerforming = null;

    //==========================================

    $.build = function (xml, preCheckMethod, postCheckMethod, lang, imagePath) {

        if (xml == null) xml = this.prepareTestCommands();
        if (lang) this.lang = lang;
        if (imagePath) this.imagePath = imagePath + "/";

        this.preCheckMethod = preCheckMethod;
        this.postCheckMethod = postCheckMethod;
        this.commandsHash = {};
        this.commandsPool = {};

        this.readFromXML(xml);

        for (var i = 0, n = 0; i < this.commands.groups.length; i++) {
            var group = this.commands.groups[i];
            for (var j = 0; j < group.buttons.length; j++) {
                this.commandsHash[group.buttons[j].id] = null;
            }
        }

        var buf = [], pfx = "#" + this.id + "_nmdrCommands";

        var styles =
        "<style>" +
		    "#" + this.id + " { position:relative !important; }" +

			pfx + " { position:absolute; left:0px; top:0px; width:100%; height:90px; margin:0; padding:0; " +
					"vertical-align:top; display:inline-block; font:" + this.font + "; font-size:11px; color:#23272c; line-height:1em;" +
					"border-top:none; border-bottom:1px solid transparent; background-image:url(" + this.imagePath + this.backgroundImage + ") !important;" +
					"background-repeat:no-repeat; background:#fff; " +
					"-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none; }" +

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
			pfx + " .comboitemDiv:hover { cursor:pointer;  background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +

			pfx + " .menuitemDiv:hover { cursor:pointer; background-image:url(" + this.imagePath + "ribbonMItemHover.png) !important;background-repeat:repeat; }" +
			pfx + " .groupnameDiv { height:16px; text-align:center; font-size:11px; color:#666; }" +

			pfx + " .itemDisabled { opacity:0.5; cursor:default !important;}" +
			pfx + " .popupDiv { background:#fff;padding:4px;border:1px solid #ccc;font-size:11px; z-index:999;}" +
		"</style>";

        buf.push("<div id='" + this.id + "_nmdrCommands' style='display:inline-block;'>");
        buf.push("<div id='" + this.id + "_nmdrCommands_popup' class='popupDiv' style='position:absolute;left:0px;top:0px;width:0px;height:0px;display:none;'></div>");
        buf.push("<div id='" + this.id + "_nmdrCommands_sizeCalculator' style='position:absolute;top:0px;left:0px;visibility:hidden;'></div>");
        buf.push("</div>");

        this.innerHTML = styles + buf.join("");
        this.createContent();
		
		return this;
    };

    //=================

    $.getItem = function (id) {

        var find = function (id, items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) return items[i];
            }
        };

        var groups = this.commands.groups, it = null;
        for (var i = 0; i < groups.length; i++) {
            it = find(id, groups[i].buttons);
            if (it != null) break;
            it = find(id, groups[i].checkboxes);
            if (it != null) break;
            it = find(id, groups[i].radiobuttons);
            if (it != null) break;
            it = find(id, groups[i].comboboxes);
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
        document.getElementById(this.id + "_nmdrCommands_checkboxDiv_" + id + "_img").src = im;
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
            document.getElementById(this.id + "_nmdrCommands_radiobuttonDiv_" + rb.id + "_img").src = im;
            if (rb.selected) rbt = rb;
        }
        if (rbt && rbt.command) this.actionPerformed(rbt.command);
    };

    $.selectComboBox = function (id, itm) {
        var self = this, co = this.getItem(id);
        co.selected = itm;
        document.getElementById(this.id + "_nmdrCommands_comboboxDiv_" + co.id + "_input").innerHTML = itm;
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

        this.selectedButton = this.id + "_nmdrCommands_buttonDiv_" + button.id;

        var
		m = document.getElementById(this.id + "_nmdrCommands_popup"),
		n = document.getElementById(this.selectedButton),
		d = document.getElementById(this.id + "_nmdrCommands_sizeCalculator"),
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

            var m = document.getElementById(this.id + "_nmdrCommands_popup"),
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
    }

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
		m = document.getElementById(this.id + "_nmdrCommands_popup"),
		n = document.getElementById(this.id + "_nmdrCommands_comboboxDiv_" + id),
		d = document.getElementById(this.id + "_nmdrCommands_sizeCalculator"),
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

            var m = document.getElementById(this.id + "_nmdrCommands_popup");

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

    //==== commands 

    $.canDO = function (id) {
        var rc = false;
        if (this.commandsHash[id] == null) {
            this.commandsPool[id] = "X";
            this.doCheck();
        }
        else {
            var it = this.getItem(id);
            if (it) it.enabled = this.commandsHash[id];

            this.commandsHash[id] = null;
        }
    };

    $.doCheck = function () {
        // wait until all commands are collected

        if (this.checkIsPerforming == null && Object.keys(this.commandsPool).length == Object.keys(this.commandsHash).length) {

            this.checkIsPerforming = true;

            for (var key in this.commandsHash) {
                this.commandsHash[key] = false;
            }

            var self = this;
            this.preCheckMethod(function () {
                self.postCheckMethod(self.commandsHash);
                self.checkIsPerforming = null;
                self.commandsPool = {};
                self.checkCommands();
                self.createContent();
            });
        }
    };

    $.checkCommands = function () {
        for (var i = 0, n = 0; i < this.commands.groups.length; i++) {
            var group = this.commands.groups[i];
            for (var j = 0; j < group.buttons.length; j++) {
                this.canDO(group.buttons[j].id);
            }
        }
    };

    //==========================

    $.createContent = function () {

        var buf = [];

        for (var i = 0, n = 0; i < this.commands.groups.length; i++) {
            var group = this.commands.groups[i], smallbts = [];

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
				"<div class='buttonDiv" + (bt.enabled ? "'" : " itemDisabled'") + "id='" + this.id + "_nmdrCommands_buttonDiv_" + bt.id + "' style='display:inline-block;'" +
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
					    "<div class='smallbuttonDiv" + (bt.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrCommands_buttonDiv_" + bt.id + "' style='display:block;' " +
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
						    im = this.imagePath + (cb.checked ? '/checkboxon.png' : '/checkboxoff.png');

                        buf.push(
					    "<div class='checkboxDiv" + (cb.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrCommands_checkboxDiv_" + cb.id + "' style='display:block;' " +
							    (cb.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').toggleCheckBox('" + cb.id + "');\"" : "") + ">" +
						    "<table cellpadding='1' cellspacing='0' border='0'><tr>" +
							    "<td style='vertical-align:middle;'>" +
								    "<img id='" + this.id + "_nmdrCommands_checkboxDiv_" + cb.id + "_img' src='" + im + "' title='" + cb.tooltip + "'></td>" +
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
							im = this.imagePath + (rb.selected ? '/radiobutton.png' : '/radiobuttoff.png');

                        buf.push(
						"<div class='radiobuttonDiv" + (rb.enabled ? "'" : " itemDisabled'") + " id='" + this.id + "_nmdrCommands_radiobuttonDiv_" + rb.id + "' style='display:block;' " +
								(rb.enabled ? "onclick=\"nmdr.core.$('" + this.id + "').selectRadioButton('" + group.id + "','" + rb.id + "');\"" : "") + ">" +
							"<table cellpadding='1' cellspacing='0' border='0'><tr>" +
								"<td style='vertical-align:middle;'>" +
									"<img id='" + this.id + "_nmdrCommands_radiobuttonDiv_" + rb.id + "_img' src='" + im + "' title='" + rb.tooltip + "'></td>" +
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
							id = this.id + "_nmdrCommands_comboboxDiv_" + co.id,
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

        document.getElementById(this.id + "_nmdrCommands").innerHTML = buf.join("");
    };

    //=======================================
    // XML
    //=======================================

    $.readFromXML = function (xml) {
        var root = nmdr.core.xml.read(xml, "Commands");

        this.commands = { id: root.attributes["id"], title: root.attributes["title"], groups: [] };

        for (var i in root.childNodes) {
            if (root.childNodes[i].name) {
                this.commands.groups.push(this.addGroup(root.childNodes[i]));
            }
        }
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

    $.prepareTestCommands = function () {
        return "<?xml version=\"1.0\"?>" +
		"<Commands id='MyCommands' title='MyCommands'>" +
			"<Group id='MyGroup' text='Group'>" +
			    "<Button id='MyButton' " +
				        "text='Button' " +
				        "tooltip='Button' " +
				        "command='NewDocument' " +
				        "size='32' " +
				        "image='ribbon/32x32.png'>" +
			    "</Button>" +
			"</Group>" +
		"</Ribbon>";
    };

    return $;
}

