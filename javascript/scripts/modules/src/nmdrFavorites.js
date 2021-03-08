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
#  nmdrFavorites
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrFavorites(id) {
	
	var $ = nmdr.core.$(id, "nmdrFavorites");
	if ($ == null) return;

    $.backgroundColor = "#fff";
    $.backgroundImage = "teaserbg.png";
    $.naviButtonColor = "#5C6B79";
    $.menuTitleColor = "#5C6B79";
    $.menuTitleTextColor = "#fff";
    $.menuColor = "#fff";
    $.menuSelectColor = "#ACABA9";
    $.menuTextColor = "#000";
    $.menuSelectTextColor = "#fff";

    //----

    $.width = 0;
    $.height = 0;
    $.paddingH = 10;
    $.paddingV = 10;
    $.menuWidth = 0;
    $.naviWidth = 45;
    $.firstMenu = 0;
    $.animation = false;
    $.imagePath = "";
    $.menus = [];

    $.init = function (width, height, imagePath, xml) {
		
        this.width = width;
        this.height = height;
        this.imagePath = imagePath;
        this.menuWidth = Math.round((width - (2 * this.naviWidth + 6 * this.paddingH)) / 3);

        //this.style.position = "relative";
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.padding = "0px";
        this.style.bfolder = "1px";
        this.style.bfolderStyle = "solid";
        this.style.bfolderColor = "lightgray";
        this.style.boxShadow = "5px 5px 5px #ccc";
        this.style.backgroundColor = this.backgroundColor;
        if (this.backgroundImage) this.style.background = "url(" + this.imagePath + this.backgroundImage + ")";

        if (xml) this.readFromXML(xml);

        this.build();
		
        nmdr.core.animate.setData(10, 10);
    };

    $.build = function () {

        var style =
			"<style type='text/css'>" +
			"#" + this.id + " { position:relative !important; }" +

			".fav_navigation {background-color:" + this.naviButtonColor + ";padding:0px;}" +
			".fav_navigation:hover {}" +
			"#" + this.id + "_fav_navibackward {position:absolute; left:" + this.paddingH + "px; top:" + this.paddingV + "px; " +
				"width:" + this.naviWidth + "px; height:" + (this.height - 2 * this.paddingV) + "px;}" +
			"#" + this.id + "_fav_naviforward {position:absolute; left:" + (3 * this.menuWidth + this.naviWidth + 5 * this.paddingH) + "px; top:" +
				this.paddingV + "px; " + "width:" + this.naviWidth + "px; height:" + (this.height - 2 * this.paddingV) + "px;}" +

			"#" + this.id + "_fav_swprev_img {width:12px; height:23px; position:absolute; top:50%; left:50%; margin-left:-6px; margin-top:-12px; " +
				"background-position: -178px -3px; background-image: url(\"" + this.imagePath + "favoritenSprite.png\");}" +
			"#" + this.id + "_fav_swnext_img {width:12px; height:23px; position:absolute; top:50%; left:50%; margin-left:-6px; margin-top:-12px; " +
				"background-position: -165px -3px; background-image: url(\"" + this.imagePath + "favoritenSprite.png\");}" +

			".fav_area {overflow:hidden; position:absolute; padding:0px;}" +
			"#" + this.id + "_fav_area {left:" + (this.naviWidth + 2 * this.paddingH) + "px; " +
				"top:" + this.paddingV + "px; width:" + (this.width - 2 * this.naviWidth - 4 * this.paddingH) + "px; " +
				"height:" + (this.height - 2 * this.paddingV) + "px;}" +

			".fav_view {position:absolute; left:0px; top:0px;}" +

			".fav_menu: {}" +
			".fav_menu_header {height:26px;vertical-align:middle;text-align:left; padding:0px 5px 0px 5px;" +
				"font-family:arial,Helvetica,sans-serif;font-size:13px;font-style:normal;font-weight:bold;border-bottom:1px solid black;" +
				"background:" + this.menuTitleColor + ";color:" + this.menuTitleTextColor + ";}" +

			".fav_menu_header_title {line-height:26px; height:26px; display:inline;}" +
			".fav_menu_header_control {margin-top:4px;line-height:26px; width:18px; height:18px; display:inline; float:right;background-position: -5px -35px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_menu_header_control:hover {cursor:pointer; background-position: -35px -35px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +

			".fav_menu_content {position:absolute; left:0px top:20x; width:100%; display:inline; padding:1px 0px 1px 0px;" +
				"height:" + (this.height - 2 * this.paddingV - 28) + "px ;overflow-y:auto; background:" + this.menuColor + ";}" +

			".fav_menu_item {color:" + this.menuTextColor + ";height:24px;vertical-align:middle;text-align:left;padding:0px 5px 0px 5px; font-family:arial,Helvetica,sans-serif;font-size:12px;font-style:normal;font-weight:normal;}" +
			".fav_menu_item:hover {background:" + this.menuSelectColor + ";color:" + this.menuSelectTextColor + ";}" +
			".fav_item_title_folder {cursor:pointer;line-height:20px;vertical-align:middle;}" +
			".fav_item_title_link {cursor:pointer;line-height:20px;vertical-align:middle;}" +
			".fav_item_title_link:hover {color:blue;}" +
			".fav_item_title_arrow_blank {line-height:20px;background-position: -240px -5px; background-image: url(\"" + this.imagePath + "favoritenSprite.png\");}" +
			".fav_item_title_arrow_open {cursor:pointer;line-height:20px;vertical-align:middle;background-position: -185px -305px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_item_title_arrow_close {cursor:pointer;line-height:20px;vertical-align:middle;background-position: -185px -335px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_item_control1 {background-position: -35px -65px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_item_control2 {background-position: -35px -95px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_item_control1:hover {cursor:pointer; background-color:white;background-position: -185px -65px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			".fav_item_control2:hover {cursor:pointer; background-color:white;background-position: -185px -95px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +

			"#fav_ctrl_menupopup {z-index:999 !important;display:none;position:absolute; top:0px; left:0px; width:180px; padding:5px 2px 5px 2px; background:#eee;" +
				"bfolder:1px; bfolder-style:solid; bfolder-color:black; box-shadow:3px 3px 3px #ccc;}" +
			".fav_ctrl_menuitem {height:24px;vertical-align:middle;text-align:left;font-family:arial,Helvetica,sans-serif;font-size:13px;font-style:normal;font-weight:normal;}" +
			".fav_ctrl_menuitem:hover {cursor:pointer; background:#5C6B79;color:white;}" +
			".fav_ctrl_menuitem_img {height:20px;width:20px;vertical-align:middle;float:left;}" +
			".fav_ctrl_menuitem_text {height:20px;vertical-align:middle;padding:4px 0px 0px 25px;}" +

			"</style>";

        var prev = this.firstMenu != 0;
        var next = this.firstMenu < this.menus.length - 3;

        var prevDiv =
			"<div class='fav_navigation' id='" + this.id + "_fav_navibackward' " +
			(prev ? "onmouseover=\"this.style.cursor='pointer';this.style.opacity=0.5;\" onmouseout=\"this.style.opacity=1;\" " +
			"onclick=\"nmdr.core.$('" + this.id + "').goBackward();\"><div id='" + this.id + "_fav_swprev_img'></div>" : ">") + "</div>";

        var nextDiv =
			"<div class='fav_navigation' id='" + this.id + "_fav_naviforward' " +
			(next ? "onmouseover=\"this.style.cursor='pointer';this.style.opacity=0.5;\" onmouseout=\"this.style.opacity=1;\" " +
			"onclick=\"nmdr.core.$('" + this.id + "').goForward();\"><div id='" + this.id + "_fav_swnext_img'></div>" : ">") + "</div>";

        var buf = [];

        buf.push(style);
        buf.push(this.makeControlMenu());
        buf.push(prevDiv);
        buf.push(this.createMenus());
        buf.push(nextDiv);

        this.innerHTML = buf.join("");
    };

    $.createMenus = function () {
        var buf=[],le = 0;
		
        buf.push("<div class='fav_area' id='" + this.id + "_fav_area'><div class='fav_view'>");

        for (var i = 0; i < this.menus.length; i++) {
            if (i >= this.firstMenu && i <= this.firstMenu + 2) {
                var key = this.menus[i].key;
                buf.push("<div class='fav_menu' id='" + this.id + '_' + key + "' style='position:absolute; left:" + le +
					"px; top:0px; width:" + this.menuWidth + "px; height:" + (this.height - 2 * this.paddingV) + "px; text-align:left;'>");

                buf.push("<div class='fav_menu_header'>");
                buf.push("<span class='fav_menu_header_title'>" + key + "</span>");
                buf.push("<span class='fav_menu_header_control' id='" + this.id + "_" + key + "_menuCtrl" + "' " +	
					"onclick=\"nmdr.core.$('" + this.id + "').openCtrlPopup(this);\"></span></div>");
                buf.push("<div class='fav_menu_content' id='" + this.id + "_" + key + "_content'>");
                buf.push(this.createMenuContent(key));
                buf.push("</div></div>");

                le += this.menuWidth + this.paddingH;
            }
        }
		
		buf.push("</div></div>");
		
		return buf.join("");
    };

    $.createMenuContent = function (key) {
        var buf = [];
        buf.push("<table border='0', cellpadding='0', cellspacing='0', width=100%>");
        var items = this.getMenu(key).items;
        for (var m in items) {
            this.createItem(buf, items[m], 5);
        }
        buf.push("</table>");
        return buf.join("");
    };

    $.createItem = function (buf, item, deep) {

        buf.push("<tr><td class='fav_menu_item' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').showItemControls(this, true);\" " +
			"onmouseout=\"nmdr.core.$('" + this.id + "').showItemControls(this, false);\" style='padding-left:" + deep + "px;'>" +

			"<span class='fav_item_title_arrow_" + (item.folder ? (item.expanded ? "close" : "open") : "blank") + "' " +
			"style='width:22px; height:20px; float:left;' " + (item.folder ? "onclick=\"nmdr.core.$('" + this.id + "').expandNode('" + item.id + "');\"" : "") + "></span>" +

			"<span class='fav_item_title_" + (item.folder ? "folder" : "link") + "' onclick=\"nmdr.core.$('" + this.id + "')." +
			(item.folder ? "expandNode('" + item.id + "')" : "startLink('" + item.url + "')") + ";\">" + item.title + "</span>" +

			"<span id='" + item.id + "_delete' class='fav_item_control2' style='width:20px; height:20px; float:right; display:none;' " +
			"onclick=\"nmdr.core.$('" + this.id + "').itemControl(event);\"></span>" +
			"<span id='" + item.id + "_edit' class='fav_item_control1' style='width:20px; height:20px; float:right; display:none;' " +
			"onclick=\"nmdr.core.$('" + this.id + "').itemControl(event);\"></span></td></tr>");

        if (item.expanded) {
            for (var i in item.childs) {
                this.createItem(buf, item.childs[i], deep + 12);
            }
        }
    };

    $.goBackward = function () {
        if (!this.animation) {
            this.animation = true;
            if (this.menus[this.firstMenu + 2]) {
                nmdr.core.animate.fadeOut(this.id + "_" + this.menus[this.firstMenu + 2].key, null, 0.05);
            }
            var elem = this.getElementsByClassName("fav_view")[0];
            nmdr.core.animate.move(null, elem, Math.round(elem.offsetLeft + this.menuWidth + this.paddingH), elem.offsetTop,
				function (arg) {
				    arg.firstMenu--;
				    arg.build();
				    arg.animation = false;
				},
			this);
        }
    };

    $.goForward = function () {
        if (!this.animation) {
            this.animation = true;
            var elem = this.getElementsByClassName("fav_view")[0];
            nmdr.core.animate.fadeOut(this.id + "_" + this.menus[this.firstMenu].key, null, 0.05);
            nmdr.core.animate.move(null, elem, Math.round(elem.offsetLeft - this.menuWidth - this.paddingH), elem.offsetTop,
				function (arg) {
				    arg.firstMenu++;
				    arg.build();
				    arg.animation = false;
				},
			this);
        }
    };

    //=========================================================

    $.readFromXML = function (xml) {

        var self = this;
        var recu = function (menu, parent, node) {
            var newMenu = menu ? menu : self.addMenu(node.attributes.id);
            var newItem = menu ? self.addItem(menu, parent, node.attributes.title, node.attributes.url, false) : null;
            for (var i in node.childNodes) {
                if (node.childNodes[i].name) {
                    var name = node.childNodes[i].name.toLowerCase();
                    if (name == "item" || name == "menuitem") {
                        recu(newMenu, newItem, node.childNodes[i]);
                    }
                }
            }
        };

        var root = nmdr.core.xml.read(xml, "menus");
        for (var i in root.childNodes) {
            if (root.childNodes[i].name) {
                recu(null, null, root.childNodes[i]);
            }
        }
    };

    $.addMenu = function (key) {
        var menu = this.getMenu(key);
        if (menu == null) {
            menu = { "key": key, items: [] };
            this.menus.push(menu);
        }
        return menu;
    };

    $.addItem = function (menu, item, title, url, folder) {
        var id = "";
        if (item) {
            id = item.id + "_" + item.childs.length;
        }
        else {
            if (this.getMenu(menu.key) != null) {
                id = this.id + "_" + menu.key + "#" + menu.items.length;
            }
        }
        var it = { "id": id, "title": title, "url": url, "childs": [], "folder": folder, "expanded": false };
        if (item) {
            item.folder = true;
            item.childs.push(it);
        }
        else menu.items.push(it);
        return it;
    };

    $.getMenu = function (key) {
        for (var i in this.menus) {
            if (this.menus[i].key == key) return this.menus[i];
        }
        return null;
    };

    $.removeMenu = function (key) {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].key == key) {
                this.menus.splice(i, 1);
                break;
            };
        }
    };

    $.renameMenu = function (key, newKey) {
        var self = this, menu = this.getMenu(key);

        var recu = function (parent, items) {
            for (var i in items) {
                var item = items[i]
                item.id = parent ? parent.id + "_" + i : self.id + "_" + menu.key + "#" + i;
                if (item.folder) recu(item, item.childs);
            }
        };

        menu.key = newKey;
        recu(null, menu.items);
    };

    $.getItem = function (id) {
        var recu = function (id, items) {
            for (var i in items) {
                var item = items[i];
                if (item.id == id) return item;
                if (item.folder) {
                    var x = recu(id, item.childs);
                    if (x != null) return x;
                }
            }
            return null;
        };

        for (var i in this.menus) {
            var x = recu(id, this.menus[i].items);
            if (x) return x;
        }
        return null;
    };

    $.removeItem = function (id) {
        var p = id.indexOf("#"),
		key = id.substring(0, p),
		mkey = key.substring(id.indexOf("_") + 1, key.length),
		menu = this.getMenu(mkey);

        var recu1 = function (items) {
            for (var i in items) {
                if (items[i].id == id) {
                    items.splice(i, 1);
                    return true;
                }
                if (items[i].folder && recu1(items[i].childs)) return true;
            }
            return false;
        };

        var recu2 = function (parent, items) {
            for (var i in items) {
                var item = items[i]
                item.id = parent ? parent.id + "_" + i : self.id + "_" + menu.key + "#" + i;
                if (item.folder) recu2(item, item.childs);
            }
        };

        if (recu1(menu.items)) recu2(null, menu.items);
    };

    $.renameItem = function (id, title, link) {
        if (title.length > 0 && link.length > 0) {
            var it = item = this.getItem(id);
            if (it) {
                it.title = title;
                it.url = link;
            }
        }
    };

    $.expandFolder = function (id) {
        var recu = function (id, items) {
            for (var i in items) {
                var item = items[i];
                if (item.folder) {
                    if (item.id == id) {
                        item.expanded = true;
                        return true;
                    }
                    if (recu(id, item.childs)) {
                        item.expanded = true;
                        return true;
                    }
                }
            }
            return false;
        };

        for (var i in this.menus) {
            if (recu(id, this.menus[i].items)) return true;
        }
        return false;
    };

    $.getFolders = function (menu, key, parentitem, parentname) {
        var items = [];
        if (parentitem != null)
            items = parentitem.childs;
        else {
            if (menu == null) menu = this.getMenu(key);
            items = menu.items;
        }
        var folders = [];
        for (var i in items) {
            if (items[i].folder) {
                var name = (parentname ? parentname + "/" : "") + items[i].title;
                folders.push({ "name": name, "id": items[i].id });
                folders = folders.concat(this.getFolders(null, null, items[i], name));
            }
        }
        return folders;
    }

    $.getItem = function (id) {
        var rec = function (item, id) {
            if (item.id == id) return item;
            for (var it in item.childs) {
                var rc = rec(item.childs[it], id);
                if (rc) return rc;
            };
        };

        for (var i in this.menus) {
            var items = this.menus[i].items;
            for (var m in items) {
                var rc = rec(items[m], id);
                if (rc) return rc;
            }
        }
        return null;
    };

    $.startLink = function (url) {
        alert("start-link: " + url);
    };

    $.itemControl = function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.id.indexOf("delete") != -1) this.deleteItemX(target.id);
        else if (target.id.indexOf("edit") != -1) this.editItemX(target.id);
        else alert("action " + target.id);
        //nmdr.core.utils.stopPropagation(e);
    };

    $.showItemControls = function (elem, show) {
        elem.getElementsByClassName("fav_item_control1")[0].style.display = show ? "inline" : "none";
        elem.getElementsByClassName("fav_item_control2")[0].style.display = show ? "inline" : "none";
    };

    $.expandNode = function (id) {
        var item = this.getItem(id);
        if (item) {
            item.expanded = !item.expanded;
            var mk = id.substring(0, id.indexOf("#"));
            document.getElementById(mk + "_content").innerHTML = this.createMenuContent(mk.substring(mk.indexOf("_") + 1, mk.length));
        }
    };

    //===== controls popup menu 

    $.makeControlMenu = function () {
		var buf = [];
        buf.push("<div id='fav_ctrl_menupopup'>");
        buf.push("<table border='0', cellpadding='0', cellspacing='0', width=100%>");

        for (var i = 0; i < 6; i++) {
            buf.push("<tr><td class='fav_ctrl_menuitem' ");
            buf.push("onmouseover=\"nmdr.core.$('" + this.id + "').showCtrlMenuItem(this," + i + ",true);\" ");
            buf.push("onmouseout=\"nmdr.core.$('" + this.id + "').showCtrlMenuItem(this," + i + ",false);\">");
            buf.push("<div class='fav_ctrl_menuitem_img' onclick=\"nmdr.core.$('" + this.id + "').ctrlActionPerformed(this);\" " +
				"style='" + this.getCtrlMenuItemImage(i, false) + "'></div>");
            buf.push("<div class='fav_ctrl_menuitem_text' onclick=\"nmdr.core.$('" + this.id + "').ctrlActionPerformed(this);\">" +
				this.getCtrlMenuItemText(i) + "</div>");
            buf.push("</td></tr>");
        }
        buf.push("</table></div>");
		return buf.join("");
    };

    $.openCtrlPopup = function (elem) {
        var self = this, p = nmdr.core.utils.positionOld(elem, this), popup = document.getElementById("fav_ctrl_menupopup");
		
        nmdr.core.popup.open(popup, elem, null, function (cb) { self.closeCtrlPopup(cb); });

        var img = popup.getElementsByClassName("fav_ctrl_menuitem_img");
        var items = popup.getElementsByClassName("fav_ctrl_menuitem_text");
        for (var i = 0; i < img.length; i++) img[i].id = elem.id + "#" + i;
        for (var i = 0; i < items.length; i++) items[i].id = elem.id + "#" + i;

        popup.style.display = "inline-block";
        popup.style.top = p.top + 20 + "px";
        popup.style.left = p.left - popup.offsetWidth + elem.offsetWidth + "px";
    };

    $.closeCtrlPopup = function (callback) {
        var popup = document.getElementById("fav_ctrl_menupopup");
        popup.style.display = "none";
        popup.style.top = "0px";
        popup.style.left = "0px";
        nmdr.core.popup.close();
		if (callback) callback();
    };

    $.ctrlActionPerformed = function (elem) {
        this.closeCtrlPopup();
        var num = elem.id.substring(elem.id.indexOf("#") + 1, elem.id.length);
        switch (num) {
            case "0": this.addNewMenuX(elem.id); break;
            case "1": this.addNewItemX(elem.id, true); break;
            case "2": this.addNewItemX(elem.id, false); break;
            case "3": this.deleteMenuX(elem.id); break;
            case "4": this.renameMenuX(elem.id); break;
            default: break;
        }
    };

    $.showCtrlMenuItem = function (elem, num, hover) {
        var e = elem.getElementsByClassName("fav_ctrl_menuitem_img")[0];
        e.style.backgroundPosition = this.getCtrlMenuItemImagePos(num, hover);
    };

    $.getCtrlMenuItemImage = function (index, hover) {
        return "background-position: " + this.getCtrlMenuItemImagePos(index, hover) +
			"background-image: url(\"" + this.imagePath + "favoritenSprite.png\");";
    };

    $.getCtrlMenuItemImagePos = function (index, hover) {
        switch (index) {
            case 0: return (hover ? "-35px -215px;" : "-185px -215px;"); break;
            case 1: return (hover ? "-35px -245px;" : "-185px -245px;"); break;
            case 2: return (hover ? "-35px -275px;" : "-185px -275px;"); break;
            case 3: return (hover ? "-35px -95px;" : "-185px -95px;"); break;
            case 4: return (hover ? "-35px -65px;" : "-185px -65px;"); break;
            case 5: return (hover ? "-35px -155px;" : "-185px -155px;"); break;
            default: return ""; break;
        }
    };

    $.getCtrlMenuItemText = function (index) {
        /*
		switch(index) {
			case 0: return "Neues Menue"; break;
			case 1: return "Neuer Ordner"; break;
			case 2: return "Neuer Link"; break;
			case 3: return "Menue loeschen"; break;
			case 4: return "Menue umbenennen"; break;
			case 5: return "Eintraege sortieren"; break;
			default: return "";
		}
		*/
        switch (index) {
            case 0: return "Create new menu"; break;
            case 1: return "Create new folder"; break;
            case 2: return "Create new link"; break;
            case 3: return "Delete menu"; break;
            case 4: return "Rename menu"; break;
            case 5: return "Sort items"; break;
            default: return "";
        }
    };

    $.addNewMenuX = function (id) {
        var self = this, html = "<table cellpadding='2' cellspacing='10'´><tr>" +
			 "<td>Name :</td><td><input type='text' name='menu_name' id='menu_name' style='width:300px;height:22px;'></td></tr></table>";

        var saveAction = function () {
            var name = document.getElementById("menu_name").value;
            var key = id.substring(id.indexOf("_") + 1, id.length);
            key = key.substring(0, key.indexOf("_"));
            for (var i = 0; i < self.menus.length; i++) {
                if (self.menus[i].key == key) {
                    self.menus.splice(i + 1, 0, { "key": name, "items": [] });
                    break;
                }
            }
            self.build();
        };

        var cancelAction = function () {
        };

        nmdr.core.dialog.dialog(
		{
		    title: "Adding new menu",
		    message: html,
		    width: 400,
		    height: 200,
		    buttons: [
				{ lable: "Cancel", callback: cancelAction },
				{ lable: "Save", callback: saveAction }
		    ]
		});
    };

    $.addNewItemX = function (id, isfolder) {

        var key = id.substring(id.indexOf("_") + 1, id.length);
        key = key.substring(0, key.indexOf("_"));
        var folders = this.getFolders(null, key, null, null);
        var sels = "<option value=''></option>";
        for (var i in folders) {
            sels += ("<option value='" + folders[i].id + "'>" + folders[i].name + "</option>");
        }

        var self = this, html =
			"<table cellpadding='2' cellspacing='10'>" +
			"<tr><td>Folders:</td><td><select name='enty_folder' id='enty_folder' style='width:300px;height:22px;'>" + sels + "</select></td></tr>" +
			"<tr><td>Title:</td><td><input type='text' name='enty_title' id='enty_title' style='width:300px;height:22px;'></td></tr>" +
			"<tr><td>Link:</td><td><input type='text' name='entry_link' id='entry_link' style='width:300px;height:22px;'></td></tr>" +
			"</table>";

        var okAction = function () {
            var folder = document.getElementById("enty_folder").value;
            var title = document.getElementById("enty_title").value;
            var link = document.getElementById("entry_link").value;

            for (var i = 0; i < self.menus.length; i++) {
                if (self.menus[i].key == key) {
                    self.addItem(self.menus[i], self.getItem(folder), title, link, isfolder);
                    break;
                }
            }

            self.expandFolder(folder);
            self.build();
        };

        nmdr.core.dialog.dialog(
		{
		    title: "Adding new " + (isfolder ? "folder" : "item"),
		    message: html,
		    width: 400,
		    height: 200,
		    buttons: [
				{ lable: "Cancel", callback: null },
				{ lable: "Save", callback: okAction }
		    ]
		});
    };

    $.deleteMenuX = function (id) {
        var self = this;
        var mkey = id.substring(0, id.lastIndexOf("_"));
        var key = mkey.substring(id.indexOf("_") + 1, mkey.length);

        nmdr.core.dialog.confirm("Deleting menu..", "Are you sure to delete the menu '" + key + "' ?",
			function (result) {
			    if (result) {
			        nmdr.core.animate.fadeOut(mkey, null, 0.05, true, 
						function (args) {
						    self.removeMenu(key);
						    if (self.menus.length == 0) self.addMenu("New menu");
						    self.build();
						}
					);
			    }
			}
		);
    };

    $.renameMenuX = function (id) {
        var self = this, html =
			"<table cellpadding='2' cellspacing='10'>" +
			"<tr><td>Name:</td><td><input type='text' name='entry_name' id='entry_name' style='width:300px;height:22px;'></td></tr>" +
			"</table>";

        var key = id.substring(id.indexOf("_") + 1, id.length);
        key = key.substring(0, key.indexOf("_"));

        var okAction = function () {
            self.renameMenu(key, document.getElementById("entry_name").value);
            self.build();
        };

        nmdr.core.dialog.dialog(
		{
		    title: "Renaming menu",
		    message: html,
		    width: 400,
		    height: 200,
		    buttons: [
				{ lable: "Cancel", callback: null },
				{ lable: "Rename", callback: okAction }
		    ]
		});
    };

    $.deleteItemX = function (id) {
        var self = this, key = id.substring(0, id.lastIndexOf("_")), item = this.getItem(key);


        nmdr.core.dialog.confirm("Deleting item..", "Are you sure to delete the item '" + item.title + "' ?",
			function (result) {
			    if (result) {
			        self.removeItem(key);
			        self.build();
			    }
			}
		);
    };

    $.editItemX = function (id) {
        var self = this, key = id.substring(0, id.lastIndexOf('_')), item = this.getItem(key),
			html = "<table cellpadding='2' cellspacing='10'>" +
			"<tr><td>Title:</td><td><input type='text' name='enty_title' id='enty_title' value='" + item.title + "' style='width: 300px'></td></tr>" +
			"<tr><td>Link:</td><td><input type='text' name='entry_link' id='entry_link' value='" + item.url + "' style='width: 300px'></td></tr>" +
			"</table>";

        var okAction = function () {
            var title = document.getElementById("enty_title").value;
            var url = document.getElementById("entry_link").value;
            self.renameItem(key, title, url);
            self.build();
        };

        nmdr.core.dialog.dialog(
		{
		    title: "Editing item",
		    message: html,
		    width: 400,
		    height: 200,
		    buttons: [
				{ lable: "Cancel", callback: null },
				{ lable: "Save", callback: okAction }
		    ]
		});
    };

    return $;
}

