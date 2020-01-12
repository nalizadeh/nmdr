//@FN:#nmdrMenu
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
#  nmdrMenu
#
#  Version: 1.00.00
#  Date: January 29. 2016
#  Status: Release
#
#####################################################################
*/

function nmdrMenu(id) {
    
	var $ = nmdr.core.$(id, "nmdrMenu");
	if ($ == null) return;

    $.imagePath = "img/";
	$.menu = null;
	$.currentMenu = null;
	
	$.menus = {};
	$.items = {};
	
	$.init = function (imagePath) {
		
        if (imagePath) this.imagePath = imagePath + "/";
		
		this.menu = this.prepareMenu();
		
        var self = this, 
			pfx = "#" + this.id,
			css =
			pfx + ":hover {cursor:pointer;}" +
			".nmdrMenuTr {height:24px;}" +
			".nmdrMenuTr:hover {color:#fff;background:#33AAFF !important; cursor:pointer;}" +
			".nmdrMenuClose:hover {cursor:pointer;}" +
			"hr.nmdrMenuHr {border:0px;height:1px;background-color:#B0C4DE;color:#B0C4DE}";

        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));

		document.head.appendChild(style);
		
		var build = function(menu, parentMenu) {
		
			var id = self.id + "_nmdrMenu_" + menu.name, div = document.createElement("div");
			
			div.setAttribute("class", "nmdrMenu");
			div.setAttribute("id", id);			
			div.style.cssText = 
			"position:absolute;top:-250;left:0;width:1px;height:1px;" +
			"z-index:100;display:none;padding:3px;background-color:#fff;border:1px solid #bbb;" + 
			"font-family:arial,verdana,sans-serif;font-weight:normal;font-size:12px;box-shadow:5px 5px 5px #eee;";
		
			document.body.appendChild(div);
		
			menu.id = id;
			menu.dom = document.getElementById(id);
			menu.parentMenu = parentMenu;
			menu.opened = false;
			
			if (menu.width == null) menu.width = 150;
			if (menu.showClose == null) menu.showClose = false;
			
			self.menus[id] = menu;
			
			for (var i = 0; i < menu.items.length; i++) {
				var it = menu.items[i];
				if (it.menu) build(it.menu, menu);
			}
		};
		
		build(this.menu, null);
		
		this.onclick = function(e) { self.openMenu(e, self.menu.id); }
	};

    $.makeMenu = function (e, menu, loading) {
								
		if (loading) {
			menu.dom.innerHTML = "<div style='position:absolute; height:100%; width:100%; top:0px; left:0px; cursor:wait;" +
			"background:#fff url(" + this.imagePath + "loading.gif) no-repeat center center;opacity:0.75; z-index:101;'></div>";

			var src = e.target || e.srcElement, ap = src.absPosition;
			
			menu.dom.style.position = "absolute";
			menu.dom.style.left = (ap.left + src.offsetWidth - 20) + "px";
			menu.dom.style.top = (ap.top + 4) + "px";
			menu.dom.style.width = menu.width + "px";
			menu.dom.style.height = (menu.items.length * 20) + "px";
			menu.dom.style.display = "block";	
			
			return;
		}

		var buf = [];
		buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");
		
		if (menu.showClose) {
			buf.push("<tr style='height:20px'><td class='nmdrMenuClose' colspan='3' style='text-align:right;background:#eee;padding:2px 3px 0 0;'>");
			buf.push("<img class='nmdrMenuClose' src='" + this.imagePath + "dmclose.png' ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').closeMenu('" + menu.id + "')\"></td></tr>");
		}

		var h1 = 0, h2 = 0;
		for (var i = 0; i < menu.items.length; i++) {
			var it = menu.items[i];
			if (it.name == "#separator") {
				buf.push("<tr><td colspan='3'><hr class='nmdrMenuHr'></td></tr>"); 
				h1++;
			}
			else {
				
				it.id = menu.id + "_tr" + i;
				
				buf.push("<tr class='nmdrMenuTr' id='" + it.id + "' " );
				buf.push((it.enabled ? 
				"onclick=\"nmdr.core.$('" + this.id + "').itemClick(event,'" + menu.id + "'," + i + ")\"" +
				(it.menu ? "" : " onmouseover=\"nmdr.core.$('" + this.id + "').closeMenu('" + menu.id + "', true)\"") : "style='opacity:0.5;'") + ">");
				
				buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + it.icon + "'></td>");
				buf.push("<td><span>" + it.name + "</span></td>");
				buf.push("<td style='width:10px;padding:0 0 0 0;'>" + (it.menu ? "<img src='" + this.imagePath + "/submenu.gif'>" : "") + "</td>");
				buf.push("</tr>");
				h2++;
			}
		}
		buf.push("</table>");
		
		var h = menu.showClose ? 20 : 0
		menu.dom.style.width = menu.width + "px";
		menu.dom.style.height = (h2 * 24 + h1 * 14 + h) + "px";
        menu.dom.innerHTML = buf.join("");
    };

	$.canClose = function (target) {
		if (target.className == "nmdrMenuClose") return false;
		
		var find = function(mm) {		
			for (var i = 0; i < mm.items.length; i++) {
				var it = mm.items[i];
				if (it.id == target.id) return it;
				var p = target.parentElement;
				while (p != null) {
					if (p.id == it.id) return it; 
					p = p.parentElement;
				}
				if (it.menu) return find(it.menu);
			}
			return null;			
		};
		
		var it = find(this.menu);
		
		return it && it.menu ? false : true;	
	};
	
    $.openMenu = function (e, id) {

		var self = this, menu = this.menus[id];

		var open = function(mm) {
			self.makeMenu(e, menu, true);
			
			if (id == self.menu.id) {
				nmdr.core.popup.open(menu.dom, self, null,
					function(cb) { self.closeMenu(self.menu.id, false, cb); }, 
					function(invoker, target) { return self.canClose(target); }
				);
			}

			nmdr.core.animate.fadeIn(null, menu.dom, null, true);

			window.setTimeout(function () {
				self.checkItems(menu, 
					function() {
						self.makeMenu(e, menu, false);
						menu.opened = true;
					}
				);
			}, 10);
		};
				
		if (menu.opened) this.closeMenu(id, true);
		open(menu);
    };
	
    $.closeMenu = function (id, subs, callback) {
	
		var self = this, menu = this.menus[id];

		var close = function(mm) {
						
			for (var i = 0; i < mm.items.length; i++) {
				var it = mm.items[i];
				if (it.menu && it.menu.opened) {
					close(it.menu);
					document.getElementById(it.id).style.background = "#ffffff";
				}
			}
						
			if (subs && mm.id == id) return;
			
			nmdr.core.animate.fadeOut(null, mm.dom, null, true, function () { 
				mm.dom.style.top = "-250";
				mm.dom.style.left = "0";
				mm.dom.style.display = "none";
				mm.opened = false;
				if (mm.id == self.menu.id) {
					nmdr.core.popup.close();
					if (callback) callback(); 
				}
				else if (mm.parentMenu) {
					for (var i = 0; i < mm.parentMenu.items.length; i++) {
						var it = mm.parentMenu.items[i];
						if (it.menu) {
							document.getElementById(it.id).style.background = "#ffffff";
						}
					}				
				}
			});
		}

		close(menu);
    };
	
	$.itemClick = function (e, id, index) {
		var menu = this.menus[id];
		var it = menu.items[index];
		if (it.menu) {
			document.getElementById(it.id).style.background = "#ABD6F5";
			this.openMenu(e, it.menu.id);
		}
		else {
			var self = this;
			this.closeMenu(this.menu.id, false, function() { self.execute(menu.name, it.name); } );
		}
	};
	
	//=== to be overwritten 
	
	$.checkItems = function (menu, callback) {
		if (menu.name == "M1") menu.items[2].enabled = false;
		callback();
	};
	
	$.execute = function (menuName, itemName) {
		alert(menuName + "  " + itemName);
	};
	
	$.prepareMenu = function () {
		var m = 
		{
			name: "M1",
			showClose: false,
			width: 200,
			items: [
				{ name: "open item...", icon: "details.gif", enabled: true, action: "view" },
				{ name: "edit item...", icon: "editdetails.gif", enabled: true, action: "edit" },
				{ name: "delete item...", icon: "delete.gif", enabled: true, action: "delete" },
				{ name: "#separator" },
				{ name: "show details...", icon: "new.gif", enabled: true, action: "showdetails" },
				{ name: "edit details...", icon: "edititem.gif", enabled: true, action: "editdetails" },
				{ name: "#separator" },
				{ name: "refresh page...", icon: "menu/refpage.png", enabled: true, action: "refresh", 
					menu:
					{
						name: "SM1",
						showClose: true,
						items: [
							{ name: "show exchange..", icon: "menu/globalx.png", enabled: true, action: "view" },
							{ name: "edit item...", icon: "editdetails.gif", enabled: true, action: "edit" },
							{ name: "delete item...", icon: "uncheck.png", enabled: true, action: "delete" },
							{ name: "#separator" },
							{ name: "user properties...", icon: "menu/users.png", enabled: true, action: "refresh"}
						]
					}
				},
			]
		};
		
		return m;
	};

	return $;
}

//@FN:#nmdrMultiSelect
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

//@FN:#nmdrAccordion
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
#  nmdrAccordion
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrAccordion(id) {

	var $ = nmdr.core.$(id, "nmdrAccordion");
	if ($ == null) return;

    $.foreColor = "#fff";
    $.foreColorSelected = "#fff";
    $.backgroundColor = "#55718A";
    $.backgroundOpened = "#3E5265";
    $.backgroundHover = "#607E9B";
    $.border = "border:1px solid #004B84;";
    $.font = "font:12px Verdana,Arial;";
    $.imagePath = "";
    $.withShadow = true;
    $.roundCorners = true;

    $.tm = 10;
    $.sp = 10;
    $.accordions = [];

    $.start = function (w, c, k, ip) {

        this.imagePath = ip;

        // Important --> first of all adding style

        var self = this, h, s,
			ws = this.withShadow ? "-moz-box-shadow: 4px 4px 4px #BBB;-webkit-box-shadow: 4px 4px 4px #BBB;box-shadow: 4px 4px 4px #BBB;" : "",
			rct = this.roundCorners ? "border-radius: 8px 8px 0 0; -moz-border-radius: 8px 8px 0 0; -webkit-border-radius: 8px 8px 0 0; -khtml-border-radius: 8px 8px 0 0;" : "",
			rcb = this.roundCorners ? "border-radius: 0 0 8px 8px; -moz-border-radius: 0 0 8px 8px; -webkit-border-radius: 0 0 8px 8px; -khtml-border-radius: 0 0 8px 8px;" : "";

        var css =
			"#" + this.id + " dt {width:" + (w - 20) + "px; margin-top:5px; padding:8px; cursor:pointer; " + this.border + " ;" + this.font + "; font-weight:bold; background-color:" +
				this.backgroundColor + "; color:" + this.foreColor + "; background-image:url(" + this.imagePath + "accoArrowDown.gif); background-position:right center; background-repeat:no-repeat;" +
				ws + rct + "}" +

			"#" + this.id + " .open {background-color:" + this.backgroundOpened + "; color:" + this.foreColorSelected + ";background-image:url(" + this.imagePath + "accoArrowUp.gif);}" +
			"#" + this.id + " dt:hover {background-color:" + this.backgroundHover + "; color:" + this.foreColorSelected + ";}" +
			"#" + this.id + " dd {overflow:hidden; background:#fff;margin:0;padding:0; " + ws + rcb + "}" +
			"#" + this.id + " .accordionSpan {display:block; width:" + (w - 24) + "px; " + this.border + "; border-top:none; padding:10px; " + rcb + "}";

        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));

        document.getElementsByTagName("head")[0].appendChild(style);
        //this.appendChild(style);

        //===========

        h = this.getElementsByTagName("dt");
        s = this.getElementsByTagName("dd");

        for (var i = 0; i < h.length; i++) {
            this.accordions[i] = h[i];
            this.accordions[i].onclick = new Function("nmdr.core.$('" + this.id + "').accor(this)");
            if (c == i && k) this.accordions[i].className = "open";
        }

        for (var i = 0; i < s.length; i++) {
            s[i].mh = s[i].offsetHeight;
            if (c != i) { s[i].style.height = 0; s[i].style.display = "none"; }
        }
    };

    $.accor = function (d) {
		var self = this;
        for (var i = 0; i < this.accordions.length; i++) {
            var s = this.accordions[i].nextSibling;
            s = s.nodeType != 1 ? s.nextSibling : s;
            this.stopAnimate(s);
            if (this.accordions[i] == d && s.style.display == "none") {
                s.style.display = "";
                this.startAnimate(s, 1);
                this.accordions[i].className = "open";
            }
            else if (s.style.display == "") {
                this.startAnimate(s, -1);
                this.accordions[i].className = "";
            }
        }
    };

    $.startAnimate = function (c, f) {
        var self = this;
        c.tm = setInterval(function () { self.animate(c, f); }, this.tm);
    };

    $.stopAnimate = function (c) {
		clearInterval(c.tm);
    };
	
    $.animate = function (c, f) {
        var h = c.offsetHeight, m = c.mh, d = f == 1 ? m - h : h;

        c.style.height = h + (Math.ceil(d / this.sp) * f) + "px";
        c.style.opacity = h / m;
        c.style.filter = "alpha(opacity=" + h * 100 / m + ")";

        if (f == 1 && h >= m) this.stopAnimate(c);
        else if (f != 1 && h == 1) { c.style.display = "none"; this.stopAnimate(c); }
    }

    return $;
}

//@FN:#nmdrClock
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
#  nmdrCssDigitalClock
#
#  Version: 1.00.00
#  Date: Mai 03. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrCssDigitalClock(id) {

	var $ = nmdr.core.$(id, "nmdrCssDigitalClock");
	if ($ == null) return;
		
	$.start = function () {
        
		var buf=[],dd=new Date(),hh=dd.getHours(),mm=dd.getMinutes(),ss=dd.getSeconds(),pfx = '#' + this.id;
		
        buf.push("<style type='text/css'>" +
        pfx + " .digitalWrap {overflow:hidden;width:9em;height:3em;border:.1em solid #222;border-radius:.2em;background:#4c4c4c;font-size:62.5%;" +
			"background:-webkit-linear-gradient(top, #4c4c4c 0%,#0f0f0f 100%);" +
			"background:-moz-linear-gradient(top, #4c4c4c 0%, #0f0f0f 100%);" +
			"background:-ms-linear-gradient(top, #4c4c4c 0%,#0f0f0f 100%);" +
			"background:-o-linear-gradient(top, #4c4c4c 0%,#0f0f0f 100%);" +
			"background:linear-gradient(to bottom, #4c4c4c 0%,#0f0f0f 100%);}" +
		pfx + " .digitalWrap ul {float:left;width:2.85em;height:3em;list-style:none;margin:0;padding:0;border-right:.1em solid #000;color:#ddd;font-family:Consolas, monaco, monospace;}" +
		pfx + " .digitalWrap ul:last-child {border:none;}" +
		pfx + " .digitalWrap li {font-size:1.5em;line-height:2;letter-spacing:2px;text-align:center;position:relative;left:1px;}" +
		pfx + " .digitMinutes li {animation:dsm 3600s steps(60, end) 0s infinite;}" +
		pfx + " .digitSeconds li {animation:dsm 60s steps(60, end) 0s infinite;}" +
		"@keyframes dsm {to { transform:translateY(-120em) }" +
        "</style>");
		
		buf.push("<div class='digitalWrap'>") +
		buf.push("<ul class='digitHours'>");	
		for (var i=hh; i < 24; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");
		for (var i=0; i < hh; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");		
		buf.push("</ul>");
		
		buf.push("<ul class='digitMinutes'>");	
		for (var i=mm; i < 60; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");
		for (var i=0; i < mm; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");
		buf.push("</ul>");
		
		buf.push("<ul class='digitSeconds'>");	
		for (var i=ss; i < 60; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");
		for (var i=0; i < ss; i++) buf.push("<li>" + (i < 10 ? "0" + i : i) + "</li>");
		buf.push("</ul>");
		buf.push("</div>");
		
		this.innerHTML = buf.join("");
	}
	
	return $;
}

/*
#####################################################################
#
#  nmdrDigitalClock
#
#  Version: 1.00.00
#  Date: Mai 03. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrDigitalClock(id) {

	var $ = nmdr.core.$(id, "nmdrDigitalClock");
	if ($ == null) return;
	
	$.start = function () {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = $.checkTime(m);
		s = $.checkTime(s);
		$.innerHTML = h + ":" + m + ":" + s;
		var t = setTimeout($.start, 500);
	};
	
	$.checkTime = function (i) {
		if (i < 10) {i = "0" + i};
		return i;
	};
	
	return $;
}

/*
#####################################################################
#
#  nmdrAnalogClock
#
#  Version: 1.00.00
#  Date: Mai 03. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrAnalogClock(id) {

	var $ = nmdr.core.$(id, "nmdrAnalogClock");
	if ($ == null) return;

	$.ctx;
	$.radius;

	$.start = function () {
		this.ctx = this.getContext("2d");
		this.radius = this.height / 2;
	
		this.ctx.translate(this.radius, this.radius);
		this.radius = this.radius * 0.90
		setInterval(this.drawClock, 1000);
	};
	
	$.drawClock = function() {
		$.drawFace();
		$.drawNumbers();
		$.drawTime();
	};

	$.drawFace = function() {
	  
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'white';
		this.ctx.fill();
		
		var grad = this.ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
		grad.addColorStop(0, '#333');
		grad.addColorStop(0.5, 'white');
		grad.addColorStop(1, '#333');
		
		this.ctx.strokeStyle = grad;
		this.ctx.lineWidth = this.radius * 0.1;
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
		this.ctx.fillStyle = '#333';
		this.ctx.fill();
	};

	$.drawNumbers = function() {
		
		var ang, num;
		
		this.ctx.font = this.radius * 0.15 + "px arial";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		
		for(num = 1; num < 13; num++){
			ang = num * Math.PI / 6;
			this.ctx.rotate(ang);
			this.ctx.translate(0, -this.radius * 0.85);
			this.ctx.rotate(-ang);
			this.ctx.fillText(num.toString(), 0, 0);
			this.ctx.rotate(ang);
			this.ctx.translate(0, this.radius * 0.85);
			this.ctx.rotate(-ang);
		}
	};

	$.drawTime = function(){
		var now = new Date();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		
		// hour
		hour = hour%12;
		hour = (hour*Math.PI/6) + (minute*Math.PI/(6*60)) + (second*Math.PI/(360*60));
		this.drawHand(hour, this.radius*0.5, this.radius*0.07);
		
		// minute
		minute = (minute*Math.PI/30) + (second*Math.PI/(30*60));
		this.drawHand(minute, this.radius*0.8, this.radius*0.07);
		
		// second
		second = (second*Math.PI/30);
		this.drawHand(second, this.radius*0.9, this.radius*0.02);
	};

	$.drawHand = function(pos, length, width) {
		this.ctx.beginPath();
		this.ctx.lineWidth = width;
		this.ctx.lineCap = "round";
		this.ctx.moveTo(0,0);
		this.ctx.rotate(pos);
		this.ctx.lineTo(0, -length);
		this.ctx.stroke();
		this.ctx.rotate(-pos);
	};
	
	return $;
}

//@FN:#nmdrDateTimePicker
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
#  nmdrDateTimePicker
#
#  Version: 1.00.00
#  Date: October 21. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrDateTimePicker(id) {

	var $ = nmdr.core.$(id, "nmdrDateTimePicker");
	if ($ == null) return;

    $.inputFocusBackground = "#FFFCE1";
    $.backgroundColor = "#FFFCE1";
    $.headerColor = "#999";
    $.headerBackground = "#f1f1f1";
    $.cellColor = "#777";
    $.cellBackground = "#f6f6f6";
    $.hoverColor = "#fff";
    $.hoverBackground = "orange";
    $.imagePath = "img/";
    $.lang = "en";
    $.langData = null;
    $.showTime = false;
    $.showStatusbar = false;
	
    $.date = null;
    $.days = [];
    $.selectedDayIndex = -1;
    $.selectedHourIndex = -1;
    $.selectedMinutIndex = -1;
    $.monthIndex = 0;
    $.yearIndex = 0;
    $.hourIndex = -1;
    $.minutIndex = -1;

    $.init = function (props) {
	
		props = props || {};
		
        this.setDate(props.hasOwnProperty("date") ? props.date: new Date());	
        this.lang = props.hasOwnProperty("lang") ? props.lang : this.lang;
        this.langData = this.lang == "de" ? this.date.langDATA.de : this.date.langDATA.en;
        this.showTime = props.hasOwnProperty("showTime") ? props.showTime : this.showTime;
        this.showStatusbar = props.hasOwnProperty("showStatusbar") ? props.showStatusbar : this.showStatusbar;
        this.imagePath = props.hasOwnProperty("imagePath") ? props.imagePath : this.imagePath;

        this.inputFocusBackground = props.hasOwnProperty("inputFocusBackground") ? props.inputFocusBackground : this.inputFocusBackground;
        this.backgroundColor = props.hasOwnProperty("backgroundColor") ? props.backgroundColor : this.backgroundColor;
        this.headerColor = props.hasOwnProperty("headerColor") ? props.headerColor : this.headerColor;
        this.headerBackground = props.hasOwnProperty("headerBackground") ? props.headerBackground : this.headerBackground;
        this.cellColor = props.hasOwnProperty("cellColor") ? props.cellColor : this.cellColor;
        this.cellBackground = props.hasOwnProperty("cellBackground") ? props.cellBackground : this.cellBackground;
        this.hoverColor = props.hasOwnProperty("hoverColor") ? props.hoverColor : this.hoverColor;
        this.hoverBackground = props.hasOwnProperty("hoverBackground") ? props.hoverBackground : this.hoverBackground;
		
        var dtStr =
        "<div id='" + this.id + "_nmdrDTP_div' style='border:1px solid #ddd;position:relative;" +
		"width:" + (this.showTime ? 145 : 125) + "px; height:23px;vertical-align:middle;'>" +
        "<div style='display:inline-block;position:absolute;left:0px; top:0px;'>" +
        "<input id='" + this.id + "_nmdrDTP_datepicker' type='text' name='nmdrDTP_datepicker' size='" +
		(this.showTime ? 18 : 15) + "' onchange=\"nmdr.core.$('" + this.id + "').parseDate();\"" +
        "style='height:21px;border:0px;padding:2px 0px 0px 0px;'></div>" +
        "<div style='display:inline-block;position:absolute;left:" + (this.showTime ? 118 : 98) + "px; top:0px;'>" +
        "<img id='" + this.id + "_nmdrDTP_button' src='" + this.imagePath + "calendar.gif' style='cursor:pointer;' " +
		"onclick=\"nmdr.core.$('" + this.id + "').openDateTime();\"></div></div>" +
        "<div id='" + this.id + "_nmdrDTP_overlay' style='position:absolute;z-index:2;display:none;'></div>";

        this.innerHTML = dtStr;
        this.makeDateTime();
    };

    $.makeDateTime = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
	
			hh = this.date.getHours(),
			mi = this.date.getMinutes(),
	
			curMonth = this.langData.months[this.date.getMonth()],
			dayOfWeek = this.langData.weekdays[this.date.getDay() == 0 ? 6 : this.date.getDay() - 1],
	
			dst1 = this.date.asString(".", this.showTime),
			dst2 = this.lang == 'en' ? (dayOfWeek + " " + dd + "th of " + curMonth + ", " + yyyy) : (dayOfWeek + " " + dd + " " + curMonth + " " + yyyy),
			pfx = "#" + this.id + "_nmdrDTP_overlay",
			w = this.showTime ? 347 : 245,
			h = this.showStatusbar ? 240 : 220,
			sh = "0 4px 8px 0 rgba(0,0,0,0.22),0 6px 20px 0 rgba(0,0,0,0.19);",
			buf = [];

        this.monthIndex = mm > 5 ? 5 : mm;
        this.yearIndex = yyyy;

		// style
		buf.push("<style type='text/css'>");
        buf.push("#" + this.id + "_nmdrDTP_datepicker:focus {background-color:" + this.inputFocusBackground + ";}");

        buf.push(pfx + " .container {background-color:" + this.backgroundColor + ";font-family:arial;line-height:1.42857;}");

        buf.push(pfx + " .daystable,.hourstable,.minutstable {border:1px solid #ddd;font-size:12px;}");
        buf.push(pfx + " .daystable td {width:26px;height:24px;cursor:default;}");
        buf.push(pfx + " .daystable tr:not(:last-child) td {border-bottom: 1px solid #ddd;}");
        buf.push(pfx + " .daystable td:not(:last-child) {border-right: 1px solid #ddd;}");
        buf.push(pfx + " .hourstable tr:not(:last-child) td {border-bottom: 1px solid #ddd;}");
        buf.push(pfx + " .hourstable td {height:24px;cursor:default;}");
        buf.push(pfx + " .minutstable tr:not(:last-child) td {border-bottom: 1px solid #ddd;}");
        buf.push(pfx + " .minutstable td {height:24px;cursor:default;}");
        buf.push(pfx + " .header_cell {text-align:center;color:" + this.headerColor + ";background:" + this.headerBackground + ";font-weight:normal;cursor:default;}");
        buf.push(pfx + " .cell {text-align:right;padding-right:5px;color:" + this.cellColor + ";background:" + this.cellBackground + ";font-weight:normal;}");
        buf.push(pfx + " .hourcell, .minutcell {text-align:center;color:" + this.cellColor + ";background:" + this.cellBackground + ";font-weight:normal;cursor:pointer;}");
        buf.push(pfx + " .cell:hover, .hourcell:hover, .minutcell:hover {color:" + this.hoverColor + " !important;background:" + this.hoverBackground + ";}");
        buf.push(pfx + " .hourcell:hover {color:" + this.hoverColor + ";background:" + this.hoverBackground + ";}"); // <<==== ??
        buf.push(pfx + " .cell_ac {cursor:pointer;}");
        buf.push(pfx + " .cell_pa {opacity: 0.3;}");
        buf.push(pfx + " .cell_ss {color:#854;}");
        buf.push(pfx + " .cell_to {color:#33AAFF !important;}");
        buf.push(pfx + " .cell_ar {text-align:center;background:" + this.headerBackground + ";opacity: 0.4;}");
        buf.push(pfx + " .cell_se, .hourcell_se, .minutcell_se {background:#33AAFF;color:white !important;font-weight:bold;}");
        buf.push(pfx + " .hourcell_se {background:#33AAFF;color:white;font-weight:bold;}");  // <<==== ??
        buf.push(pfx + " .img {cursor:pointer; opacity: 0.5;}");
        buf.push(pfx + " .img:hover {opacity: 1;}");
        buf.push(pfx + " .mtitle, .ytitle {font-family:Arial;font-size:13px;font-weight:normal;cursor:pointer;}");
        buf.push(pfx + " .mtitle:hover, .ytitle:hover {text-decoration: underline;}");
        buf.push(pfx + " .tdisp {font-family:verdana; font-size:12px;font-weight:normal;}");

        buf.push(pfx + " .container, .monthsdiv, .yearsdiv {border-radius: 4px; -moz-box-shadow:" + sh + "-webkit-box-shadow:" + sh + "box-shadow:" + sh + "}");
        buf.push(pfx + " .monthstable, .yearstable {border: 1px solid #ddd;}");
        buf.push(pfx + " .monthstable td {width:46px;height:24px;cursor:pointer;text-align:left;font-size:12px;font-weight:normal;padding-left:5px;}");
        buf.push(pfx + " .yearstable td {width:26px;height:24px;cursor:pointer;text-align:center;font-size:12px;font-weight:normal;}");
        buf.push(pfx + " .monthcell:hover, .yearcell:hover {background:#33AAFF;color:white;}");
		
        buf.push("</style>");

        buf.push("<div id='" + this.id + "_nmdrDTP_container' class='container' style='display:inline-block;position:relative; width:" + w + "px; height:" + h + "px; border:thin lightgray solid;'>");
        buf.push("<div style='display:inline-block;position:absolute;left:14px; top:8px; width:20px; height:20px;'><img class='img' src='" + this.imagePath + "ghome.gif' onclick=\"nmdr.core.$('" + this.id + "').goToday();\"></div>");
        buf.push("<div style='display:inline-block;position:absolute;left:38px; top:9px; width:20px; height:20px;'><img class='img' src='" + this.imagePath + "gleft.png' onclick=\"nmdr.core.$('" + this.id + "').goPrevMonth();\"></div>");
        buf.push("<div style='display:inline-block;position:absolute;left:62px; top:9px; width:20px; height:20px;'><img class='img' src='" + this.imagePath + "gright.png' onclick=\"nmdr.core.$('" + this.id + "').goNextMonth();\"></div>");
        buf.push("<div style='display:inline-block;position:absolute;left:88px; top:6px; width:140px; height:20px;text-align:left;'>");
		buf.push("<span id='" + this.id + "_nmdrDTP_mtitle' class='mtitle' onclick=\"nmdr.core.$('" + this.id + "').openMonthPopup();\">" + curMonth + "</span><span>&nbsp;&nbsp;</span>");
        buf.push("<span id='" + this.id + "_nmdrDTP_ytitle' class='ytitle' onclick=\"nmdr.core.$('" + this.id + "').openYearPopup();\">" + yyyy + "</span></div>");
        buf.push("<div style='display:inline;position:absolute;left:10px; top:35px; width:225px; height:176px;'>"); // <<-- set the width & height 
		
        buf.push(this.makeDays() + "</div>" +
        (this.showTime ? this.makeHoursAndMinuts() : "") +
		(this.showStatusbar ? "<div class='tdisp' style='display:inline-block;position:absolute;left:10px; top:215px; width:240px; height:20px;padding-top:3px;'><span>" + dst2 + "</span></div>" : ""));

        buf.push("<div id='" + this.id + "_nmdrDTP_monthsdiv' class='monthsdiv' style='position:absolute;left:0px; top:0px; width:75px; height:170px;display:none;z-index:998;overflow:hidden;background:white;'>");
        buf.push(this.makeMonthsList() + "</div><div id='" + this.id + "_nmdrDTP_yearsdiv' class='yearsdiv' style='position:absolute;left:0px; top:0px; width:50px; height:170px;display:none;z-index:999;overflow:hidden;background:white;'>" + this.makeYearsList() + "</div></div>");

        document.getElementById(this.id + "_nmdrDTP_overlay").innerHTML = buf.join("");
        document.getElementById(this.id + "_nmdrDTP_datepicker").value = dst1;

        if (this.showTime) {
            nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrDTP_timesdiv", this.scrollHours);
            nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrDTP_minutsdiv", this.scrollMinuts);
        }
        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrDTP_monthsdiv", this.scrollMonths);
        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrDTP_yearsdiv", this.scrollYears);
    };

    $.makeDays = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
	
			firstDay = new Date(yyyy, mm, 1),
			lastDay = new Date(yyyy, mm, 0),
			today = new Date(),
	
			curMonthDays = [],
			prevMonthDays = [],
			nextMonthDays = [],
			mx, 
			yx, 
			d,
			start = false, 
			end = false, 
			ind = 0, 
			p = 0, 
			q = 0, 
			s = 0, 
			cd, 
			pd,
			daysstr = [],
			daystitle = [];
			
		d = new Date(yyyy, mm, 1);
        while (d.getMonth() === mm) {
            curMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        mx = mm == 0 ? 11 : mm - 1;
		yx = mm == 0 ? yyyy - 1 : yyyy;
		d = new Date(yx, mx, 1);
        while (d.getMonth() == mx) {
            prevMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        mx = mm == 11 ? 0 : mm + 1;
		yx = mm == 11 ? yyyy + 1 : yyyy;
        d = new Date(yx, mx, 1);
        while (d.getMonth() == mx) {
            nextMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

		cd = new Date(curMonthDays[0]);
		pd = cd.getDay() == 0 ? 6 : cd.getDay() - 1;

        for (var c = 0; c < 7; c++) {
            if (this.langData.weekdays[c] == this.langData.weekdays[pd]) break;
            s++;
        }

		daystitle.push("<tr>");
        for (var i = 0; i < this.langData.weekdays.length; i++) {
            daystitle.push("<td class='header_cell'><span>");
			daystitle.push(this.langData.weekdays[i].substring(0, this.lang == "en" ? 3 : 2) + "</span></td>");
        }
        daystitle.push("</tr>");

        this.days = [];

        for (var r = 0; r < 6; r++) {
            daysstr.push("<tr>");
            for (var c = 0; c < 7; c++) {
                var m = false;
                var d = new Date(curMonthDays[p]);
                pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
                if (!start && this.langData.weekdays[pd] == this.langData.weekdays[c]) start = true;
                if (p == curMonthDays.length) end = true;
                if (start && !end) {
                    p++;
                    m = true;
                    if (this.selectedDayIndex === -1 && dd === d.getDate()) this.selectedDayIndex = ind;
                }
                else if (!start) d = new Date(prevMonthDays[prevMonthDays.length - s + c]);
                else if (end) d = new Date(nextMonthDays[q++]);
                this.days.push(d);

                var sel = this.selectedDayIndex == ind, td = d.toDateString() == today.toDateString();

                daysstr.push("<td class='cell" + (m ? " cell_ac" : " cell_pa") + (td ? " cell_to" : "") +
					(sel ? " cell_se" : "") + (pd == 5 || pd == 6 ? " cell_ss" : "") +
                    "' id='" + this.id + "_nmdrDTP_cell_" + ind + "' " + (m ? "onclick=\"nmdr.core.$('" + this.id + "').selectDay(" + ind + ")\"" : "") +
					"><span>" + d.getDate() + "</span></td>");
                ind++;
            }
            daysstr.push("</tr>");
        }

        return "<table class='daystable' width='100%' height='100%' cellpadding=0 cellspacing=0>" + daystitle.join("") + daysstr.join("") + "</table>";
    };

    $.makeHoursAndMinuts = function () {

        if (this.hourIndex === -1) {
            if (this.selectedHourIndex !== -1) {
                this.hourIndex = 23 - this.selectedHourIndex < 7 ? 23 - 6 : this.selectedHourIndex;
            }
            else this.hourIndex = 0;
        }

        if (this.minutIndex === -1) {
            if (this.selectedMinutIndex !== -1) {
                this.minutIndex = 59 - this.selectedMinutIndex < 7 ? 59 - 6 : this.selectedMinutIndex;
            }
            else this.minutIndex = 0;
        }

        var atd1 = "<td class='cell_ar' style='width:10'><img class='img' src='" + this.imagePath + "gup.gif' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').scrollHoursTimer(1);\" onmouseout=\"nmdr.core.utils.stopTimer()\"></td>",

			atd2 = "<td class='cell_ar' style='width:10'><img class='img' src='" + this.imagePath + "gdown.gif' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').scrollHoursTimer(-1);\" onmouseout=\"nmdr.core.utils.stopTimer()\"></td>",

			atd3 = "<td class='cell_ar' style='width:10'><img class='img' src='" + this.imagePath + "gup.gif' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').scrollMinutsTimer(1);\" onmouseout=\"nmdr.core.utils.stopTimer()\"></td>",

			atd4 = "<td class='cell_ar' style='width:10'><img class='img' src='" + this.imagePath + "gdown.gif' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').scrollMinutsTimer(-1);\" onmouseout=\"nmdr.core.utils.stopTimer()\"></td>",

			hours = [],
			minuts = [];
		
        for (var i = this.hourIndex; i < this.hourIndex + 7; i++) {
            var s = i < 10 ? "0" + i : "" + i;
            var z = i == this.hourIndex ? atd1 : i == this.hourIndex + 6 ? atd2 : '<td class="cell_ar"></td>';

            hours.push("<tr><td class='hourcell" + (i == this.selectedHourIndex ? " hourcell_se'" : "'") +
                " id='" + this.id + "_nmdrDTP_hourcell_" + i + "' onclick=" + this.id +
                ".selectHour(" + i + ")><span>" + s + ":00</span></td>" + z + "</tr>");
        }
        
        for (var i = this.minutIndex; i < this.minutIndex + 7; i++) {
            var s = i < 10 ? "0" + i : "" + i;
            var z = i == this.minutIndex ? atd3 : i == this.minutIndex + 6 ? atd4 : "<td class='cell_ar'></td>";

            minuts.push("<tr><td class='minutcell" + (i == this.selectedMinutIndex ? " minutcell_se'" : "'") +
                " id='" + this.id + "_nmdrDTP_minutcell_" + i + "' onclick=" + this.id +
                ".selectMinut(" + i + ")><span>" + s + "</span></td>" + z + "</tr>");
        }

        var div =
        //hours
        "<div id='" + this.id + "_nmdrDTP_timesdiv' class='timesdiv' style='display:inline-block;overflow:hidden;position:absolute; left:240px; top:35px; width:61px;'>" +
        "<table class='hourstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + hours.join("") + "</table>" +
        "</div>" +
        //minutes
        "<div id='" + this.id + "_nmdrDTP_minutsdiv' class='minutsdiv' style='display:inline-block;overflow:hidden;position:absolute; left:304px; top:35px; width:34px;'>" +
        "<table class='minutstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + minuts.join("") + "</table>" +
        "</div>";
        return div;
    };

    $.openDateTime = function () {
        var self = this,
            m = document.getElementById(this.id + "_nmdrDTP_overlay"),
            b = document.getElementById(this.id + "_nmdrDTP_button");

        nmdr.core.popup.open(m, b, null, function (cb) { self.closeDateTime(self, cb); });
        m.style.display = "block";
        nmdr.core.animate.fadeIn(null, m, null, true);
    };

    $.closeDateTime = function (self, callback) {
        if (self == null) self = this;
        self.closeMonthPopup();
        self.closeYearPopup();
        var m = document.getElementById(self.id + "_nmdrDTP_overlay");
        nmdr.core.animate.fadeOut(null, m, null, true, function () { m.style.display = "none"; });
        nmdr.core.popup.close();
		if (callback) callback();
    };

    $.getDate = function () {
        return this.date;
    };

    $.showHourPicker = function (hmp) {
        this.showTime = hmp;
    };

    $.setDate = function (date) {
        this.date = date;
        this.selectedDayIndex = -1;
        this.hourIndex = -1;
        this.minutIndex = -1;
        this.selectedHourIndex = date.getHours();
        this.selectedMinutIndex = date.getMinutes();
    };

    $.selectDay = function (ind) {
        var d = this.days[ind];
        this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
            this.date.getHours(), this.date.getMinutes(), 0));
        this.makeDateTime();
        this.closeDateTime();
    };

    $.selectMonth = function (month) {
        this.setDate(new Date(this.date.getFullYear(), month, this.date.getDate(),
            this.date.getHours(), this.date.getMinutes(), 0));
        this.makeDateTime();
    };

    $.selectYear = function (year) {
        this.setDate(new Date(year, this.date.getMonth(), this.date.getDate(),
            this.date.getHours(), this.date.getMinutes(), 0));
        this.makeDateTime();
    };

    $.goPrevMonth = function () {
        this.setDate(this.date.prevMonth());
        this.makeDateTime();
    };

    $.goNextMonth = function () {
        this.setDate(this.date.nextMonth());
        this.makeDateTime();
    };

    $.goToday = function () {
        this.setDate(new Date());
        this.makeDateTime();
    };

    $.selectHour = function (ind) {
        this.selectedHourIndex = ind;
        this.date.setHours(ind);
        this.makeDateTime();
    };

    $.selectMinut = function (ind) {
        this.selectedMinutIndex = ind;
        this.date.setMinutes(ind);
        this.makeDateTime();
    };

    $.parseDate = function () {
        var dtp = document.getElementById(this.id + "_nmdrDTP_datepicker");
        if (dtp) {
            var v = dtp.value;
            if (!this.showTime) { var to = new Date(); v += " " + to.getHours() + ":" + to.getMinutes(); }
            var a = v.split(" ");
            if (a.length === 2) {
                var dd = a[0].split(".");
                var hh = a[1].split(":");
                if (dd.length === 3 && hh.length === 2) {
                    var y = parseInt(dd[2]),
                        m = parseInt(dd[1]),
                        d = parseInt(dd[0]),
                        h = parseInt(hh[0]),
                        mi = parseInt(hh[1]);
                    if (y >= 1995 && y <= 2050 && m >= 1 && m <= 12 &&
                        d >= 1 && d <= 31 && h >= 0 && h <= 23 && mi >= 0 && mi <= 59)
                        this.setDate(new Date(y, m - 1, d, h, mi));
                    else this.setDate(new Date());
                    this.makeDateTime();
                }
            }
        }
    };

    $.scrollHours = function (src, step) {
        var self = src == null ? this : src;
        if (step <= -1) { if (self.hourIndex < 23 - 6) self.hourIndex++; }
        else if (self.hourIndex > 0) self.hourIndex--;
        self.makeDateTime();
    };

    $.scrollHoursTimer = function (step) {
        var self = this;
        nmdr.core.utils.startTimer(function () { self.scrollHours(self, step); }, 100);
    };

    $.scrollMinuts = function (src, step) {
        var self = src == null ? this : src;
        if (step <= -1) { if (self.minutIndex < 59 - 6) self.minutIndex++; }
        else if (self.minutIndex > 0) self.minutIndex--;
        self.makeDateTime();
    };

    $.scrollMinutsTimer = function (step) {
        var self = this;
        nmdr.core.utils.startTimer(function () { self.scrollMinuts(self, step); }, 100);
    };

    //==== Months drop down menu

    $.makeMonthsList = function () {
        var mms = [];
        for (var i = this.monthIndex; i < this.langData.months.length; i++) {
            mms.push("<tr><td class='monthcell' id='" + this.id + "_nmdrDTP_monthcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectMonth(" + i + ");\"><span>" + this.langData.months[i] + "</span></td></tr>");
        }

        return "<div id='" + this.id + "_nmdrDTP_mtdiv'><table class='monthstable' " +
            "width='100%' height='100%' cellpadding='0' cellspacing='0'>" + mms.join("") + "</table></div>";
    };

    $.openMonthPopup = function () {
        var e = document.getElementById(this.id + "_nmdrDTP_mtitle"),
			m = document.getElementById(this.id + "_nmdrDTP_monthsdiv"),
			y = document.getElementById(this.id + "_nmdrDTP_yearsdiv"),
			c = document.getElementById(this.id + "_nmdrDTP_container");
        y.style.display = "none";
        m.style.position = "absolute";
        m.style.left = e.absLeft - c.absLeft + "px";
        m.style.top = e.absTop - c.absTop + 16 + "px";
        m.style.display = "block";
    };

    $.closeMonthPopup = function () {
		var m = document.getElementById(this.id + "_nmdrDTP_monthsdiv");
        m.style.display = "none";
    };

    $.scrollMonths = function (src, step) {
        if (step <= -120) { if (src.monthIndex < 5) src.monthIndex++; }
        else if (src.monthIndex > 0) src.monthIndex--;
        document.getElementById(src.id + "_nmdrDTP_mtdiv").innerHTML = src.makeMonthsList();
    };

    //==== Years drop down menu

    $.makeYearsList = function () {
        var yms = [];
        for (var i = this.yearIndex; i < this.yearIndex + 7; i++) {
            yms.push("<tr><td class='yearcell' id='" + this.id + "_nmdrDTP_yearcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectYear(" + i + ");\"><span>" + i + "</span></td></tr>");
        }

        return "<div id='" + this.id + "_nmdrDTP_ytdiv'><table class='yearstable' " +
            "width='100%' height='100%' cellpadding='0' cellspacing='0'>" + yms.join("") + "</table></div>";
    };

    $.openYearPopup = function () {
        var e = document.getElementById(this.id + "_nmdrDTP_ytitle"),
			m = document.getElementById(this.id + "_nmdrDTP_monthsdiv"),
			y = document.getElementById(this.id + "_nmdrDTP_yearsdiv"),
			c = document.getElementById(this.id + "_nmdrDTP_container");
        m.style.display = "none";
        y.style.position = "absolute";
        y.style.left = e.absLeft - c.absLeft + "px";
        y.style.top = e.absTop - c.absTop + 16 + "px";
        y.style.display = "block";
    };

    $.closeYearPopup = function () {
        document.getElementById(this.id + "_nmdrDTP_yearsdiv").style.display = "none";
    };

    $.scrollYears = function (src, step) {
        if (step <= -120) { if (src.yearIndex < 2050) src.yearIndex++; }
        else if (src.yearIndex > 1995) src.yearIndex--;
        document.getElementById(src.id + "_nmdrDTP_ytdiv").innerHTML = src.makeYearsList();
    };

    return $;
}

//@FN:#nmdrCalendar
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
#  nmdrCalendar
#
#  Version: 1.00.00
#  Date: Mai 03. 2015
#  Status: Release
#
#####################################################################
*/

function CALDATA(lang) {
	
    var d = new Date(),
	
    en = {
        months: d.langDATA.en.months,
        weekdays: d.langDATA.en.weekdays,
        daysShort: d.langDATA.en.daysShort,
        weekname: d.langDATA.en.weekname,
        views: ["Default view...","Tabular view...","Year view..."],
        commands: ["Open item...", "Edit item...", "Delete item..."]
    },
    de = {
        months: d.langDATA.de.months,
        weekdays: d.langDATA.de.weekdays,
        daysShort: d.langDATA.de.daysShort,
        weekname: d.langDATA.de.weekname,
        views: ["Standardansicht...","Tabellenansicht...","Jahresansicht..."],
        commands: ["Öffnen...", "Bearbeiten...", "Löschen..."]
    },
    fr = {
        months: d.langDATA.fr.months,
        weekdays: d.langDATA.fr.weekdays,
        daysShort: d.langDATA.fr.daysShort,
        weekname: d.langDATA.fr.weekname,
        views: ["Mode d'affichage standard...","Vue de table...","année..."],
        commands: ["Ouvert...", "Éditer...", "Effacer..."]
    };
	
	switch (lang) {
		case "en" : return en; break;
		case "de" : return de; break;
		case "fr" : return fr; break;
	}

    return en;
}

function nmdrCalendar(id) {

	var $ = nmdr.core.$(id, "nmdrCalendar");
	if ($ == null) return;
   
	//=== constants
	
    $.defaultView = 1;
    $.tabularView = 2;
    $.yearView = 3;
	
	//=== props
	
    $.view = $.defaultView;
    $.date = null;
    $.imagePath = "";
    $.lang = "en";
    $.langData = null;

    $.cellWidth = 0;
    $.cellHeight = 0;
       
    $.headerFontSize = 15;
    $.fontSize = 12;

    $.orgHeaderFontSize = $.headerFontSize;
    $.orgFontSize = $.fontSize;
	
    $.backgroundColor = "#fff";
    $.headerColor = "#000";
    $.headerBackground = "#fff";
    $.cellColor = "#000";
    $.cellBackground = "#fff";
    $.hoverColor = "orange";
    $.hoverBackground = "#D9EFFF";
	$.todayBackground = "#0072C6";
    $.notCurrentMonthBG = "#F2F2F2";
    $.saturdaySundayBG = "#F5FFFF";
    $.saturdaySundayFC = "#854";
    $.cellSelectionBG = "#FFFFD7";
    $.cellSelectionFC = "#000";
    $.wnCellBackground = "#FFF4CC";
    $.userCellBackground = "#EBF1DE";
	
    $.yvHeaderBackground = "#fff";
    $.yvCellBackground = "#fff";
    $.yvMonthTitleBackground = "#ddd";
       
	$.enabled = true;
	$.showOptions = true;
	$.showClock = true;
	$.showWN = true;
	$.showFooter = true;
	
	$.tabuserLines = 10;
	$.moDDListWidth = 75;
	$.yeDDListWidth = 50;
	
	//=== variables
	
    $.days = [];
    $.dayIndex = -1;
    $.monthIndex = 0;
    $.yearIndex = 0;
	
	$.commands = [];    
      
    $.init = function (props) { 
	
		props = props || {};

        this.setDate(props.hasOwnProperty("date") ? props.date == "" ? new Date() : props.date : new Date());
        
        this.view = props.hasOwnProperty("view") ? props.view : this.view;
        this.lang = props.hasOwnProperty("lang") ? props.lang : "en";
        this.langData = CALDATA(this.lang); 
        this.imagePath = props.hasOwnProperty("imagePath") ? props.imagePath : "img/";
        this.fontSize = props.hasOwnProperty("fontSize") ? props.fontSize : this.fontSize;
		this.enabled = props.hasOwnProperty("enabled") ? props.enabled : this.enabled
        this.showOptions = props.hasOwnProperty("showOptions") ? props.showOptions : this.showOptions;
        this.showClock = props.hasOwnProperty("showClock") ? props.showClock : this.showClock;
        this.showWN = props.hasOwnProperty("showWn") ? props.showWn : this.showWN;
		this.tabuserLines = props.hasOwnProperty("userLines") ? props.userLines : this.tabuserLines;
        
		this.commands = this.prepareCommands();

        this.dateChanged();
		
		nmdr.core.utils.updateOnLoadResize(this, function(self) {
			self.closeCellMenu();
			self.closeViewMenu();
			self.makeCalendar(); 
		});
    };

    $.makeCalendar = function () {

        var buf = [],
		pfx = "#" + this.id, 
		
		dd = this.date.getDate(),
		mm = this.date.getMonth(),
		yyyy = this.date.getFullYear(),

		curMonth = this.langData.months[this.date.getMonth()],
		dayOfWeek = this.langData.weekdays[this.date.getDay() == 0 ? 6 : this.date.getDay() - 1],
		
		todayText = dayOfWeek + " " + dd + " " + curMonth + " " + yyyy,

		tabcellWidth = 26,
		tabcellHeight = 18,
		tabusercellWidth = 80,

		yearCellWidth = 26,
		yearCellHeight = 24,
		
		daysnameHeight = 34,
		footerHeight = this.showFooter ? 22 : 0,

		paddingLeft = 10,
		headerHeight = this.view == this.defaultView ? 40 : 65,
		wnWidth = this.showWN ? 25 : 0,
		
		dim = nmdr.core.utils.getInnerDim(this.parentElement);

		this.headerFontSize = this.orgHeaderFontSize;
		this.fontSize = this.orgFontSize;

		this.cellWidth = (dim.width - wnWidth - 2 * paddingLeft) / 7;
		this.cellHeight = (dim.height - headerHeight - daysnameHeight - footerHeight) / 6;
		
        var width = 
			this.view == this.defaultView ? (this.cellWidth * 7 + wnWidth + 2 * paddingLeft) : 
			this.view == this.tabularView ? (tabcellWidth * 32 + tabusercellWidth + 28) : (yearCellWidth * 8 * 4);
			
		var height = 
			this.view == this.defaultView ? (this.cellHeight * 6 + headerHeight + daysnameHeight + footerHeight) : 
			this.view == this.tabularView ? (tabcellHeight * (this.tabuserLines + 4) + headerHeight + footerHeight + 4) : (yearCellHeight * 8 * 3 + headerHeight + footerHeight + 32);

		if (width < 280) {

			this.headerFontSize = 12;
			this.fontSize = 10;
			
			if (width < 250) {
				this.headerFontSize = 10;
				this.fontSize = 9;
				headerHeight = this.view == this.defaultView ? 32 : 65;
			}
			if (width < 180) 
				this.showOptions = false;
		}
		
        this.monthIndex = mm > 5 ? 5 : mm;
        this.yearIndex = yyyy;
		
        buf.push("<style type='text/css'>");
        buf.push(pfx + " * {box-sizing:border-box;}");
        buf.push(pfx + " .calcontainer {padding:0;margin:0;white-space:nowrap;background:" + this.backgroundColor + ";font-family:'Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif; outline:1px solid #ccc;}");
        
        buf.push(pfx + " .loader {position:absolute; display:none; height:100%; width:100%; cursor:wait; background:#fff url(\"" + this.imagePath + "loading.gif\") no-repeat center center;opacity:0.75;z-index:100;}");
        buf.push(pfx + " .header {color:#000;background:#fff;text-align:left;font-size:" + (this.fontSize - 1) + "px;font-weight:normal;}");
        buf.push(pfx + " .footer {color:#aaa;background:#fff;text-align:right;font-size:" + (this.fontSize - 1) + "px;font-weight:normal;}");
		
        buf.push(pfx + " .daysdiv {font-size:" + this.fontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .daysdiv table {table-layout: fixed; border-collapse: collapse;}");             

        //============
		      
        buf.push(pfx + " .hcells {cursor:default;text-align:left;vertical-align:bottom;cursor:default;height:" + daysnameHeight + "px;line-height:" + (daysnameHeight+16) + "px;background:" +
				this.headerBackground + ";color:" + this.headerColor + ";border-bottom:1px solid #ccc; font-weight:normal;}");

        buf.push(pfx + " .hcell {width:" + this.cellWidth + "px;height:100%;border-right:1px solid transparent;}");
        buf.push(pfx + " .hcellspan {padding-left:4px;}");

        buf.push(pfx + " .cell {width:" + this.cellWidth + "px;height:" + this.cellHeight + "px;cursor:default;border-bottom:1px solid #ddd; " +
				"border-right:1px solid #ddd;text-align:left;vertical-align:top;color:" + this.cellColor + ";background:" +	this.cellBackground + ";font-weight:normal; }");
				
        buf.push(pfx + " .hcellWN {width:" + wnWidth + "px;height:100%;padding-left:4px;}");
        buf.push(pfx + " .cellWN {width:" + wnWidth + "px;height:" + this.cellHeight + "px;border-left: 1px solid #ddd;border-bottom:1px solid #ddd;padding-left:4px;background:" + this.wnCellBackground + ";opacity: 0.5;}");

        //============
               
        buf.push(pfx + " .hcell1 {width:" + tabcellWidth + "px;height:38px;text-align:left;vertical-align:bottom;padding-bottom:3px;}");
        buf.push(pfx + " .hcell1 {border-bottom:1px solid #ddd;}");
        buf.push(pfx + " .hcell1:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell1_span {display:block;transform:rotate(-90deg);-moz-transform:rotate(-90deg);-ms-transform:rotate(-90deg);-webkit-transform:rotate(-90deg); }");
        buf.push(pfx + " .hcell1_user {width:" + tabusercellWidth + "px;}");
        
        buf.push(pfx + " .hcell2 {text-align:center;background:" + this.wnCellBackground + ";height:" + tabcellHeight + "px;}");
        buf.push(pfx + " .hcell2 {border-bottom:1px solid #ddd;}");
		buf.push(pfx + " .hcell2:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell2_user {}");

        buf.push(pfx + " .hcell3 {width:" + tabcellWidth + "px;height:" + tabcellHeight + "px;text-align:center;}");
        buf.push(pfx + " .hcell3 {border-bottom:1px solid #ddd;}");
		buf.push(pfx + " .hcell3:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell3_user {border-bottom:1px solid #ddd;}");

        buf.push(pfx + " .hcell4 {width:" + tabcellWidth + "px;height:" + tabcellHeight + "px;}");
        buf.push(pfx + " .hcell4 {border-bottom:1px solid #ddd;}");
        buf.push(pfx + " .hcell4:not(:last-child) {border-right:1px solid #ddd;}");
		buf.push(pfx + " .hcell4_user {background:" + this.userCellBackground + ";border-bottom:1px solid #ddd; }");
		
 		buf.push(pfx + " .hcell_fr {border-left:1px solid #ddd;}");
        
        //============
        
        buf.push(pfx + " .yvContainer {background:#fff;border:1px solid " + this.yvMonthTitleBackground + ";}");
        buf.push(pfx + " .yvMontitle {background:" + this.yvMonthTitleBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvHcell {background:" + this.yvHeaderBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvCell {background:" + this.yvCellBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvCellho {background:#9FDDEC !important;}");
        
        //============
        
        buf.push(pfx + " .hcell_fi {border-left: 1px solid transparent;}");
        buf.push(pfx + " .cell_fi {border-left: 1px solid #ddd;}");
        buf.push(pfx + " .cell_ac {cursor:pointer;}");
        buf.push(pfx + " .cell_ac:hover {background:" + this.hoverBackground + ";color:" + this.hoverColor + " !important;cursor:pointer;}");
        buf.push(pfx + " .cell_pa {opacity: 0.3;background:" + this.notCurrentMonthBG + "}");
        buf.push(pfx + " .cell_ss {color:" + this.saturdaySundayFC + ";background:" + this.saturdaySundayBG + "}");
        buf.push(pfx + " .cell_to {background:" + this.todayBackground + " !important;color:#fff !important;" + (this.fontSize + 2) + "px;font-weight:bold;}");
        buf.push(pfx + " .cell_se {background:" + this.cellSelectionBG + ";color:" + this.cellSelectionFC + " !important;font-weight:bold;}");
        buf.push(pfx + " .cell_ar {text-align:center;background:" + this.headerBackground + ";opacity: 0.4;}");
        buf.push(pfx + " .img {cursor:pointer; opacity: 1;}");
        buf.push(pfx + " .img:hover {opacity: 0.7;}");
        buf.push(pfx + " .clockdiv {font-family:Consolas,monaco,monospace;font-size:12px;font-weight:normal;}");
        buf.push(pfx + " .headtable {font-size:" + this.headerFontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .headtable td {padding:2px;}");
        buf.push(pfx + " .mtitle,.ytitle {cursor:pointer;}");
        buf.push(pfx + " .mtitle:hover,.ytitle:hover,.dayspan:hover {text-decoration:underline;}");
        buf.push(pfx + " .daydiv {width:100%;height:18px;padding:0;}");
        buf.push(pfx + " .userdiv {width:100%;height:" + (this.cellHeight - 19) + "px;padding:0; font-size:" + this.fontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .dayspan, .dayspan_pa, .dayspan_ho {padding-left:4px;}");
        buf.push(pfx + " .dayspan:hover, .dayspan_ho:hover {font-weight:bold;}");
        buf.push(pfx + " .dayspan_ho {color:#a1d490 !important; font-size:" + (this.fontSize + 3) + "px;font-weight:bold;}");
		
		buf.push(pfx + " .monthsdiv, .yearsdiv {overflow:hidden;background:white;box-shadow:3px 3px 3px #eee;transition:all 0.3s ease-in-out; -webkit-transition:all 0.3s ease-in-out; -moz-transition:all 0.3s ease-in-out; -o-transition:all 0.3s ease-in-out;}");
        buf.push(pfx + " .monthstable, .yearstable {border:1px solid #ccc;}");
        buf.push(pfx + " .monthstable td {width:46px;height:24px;cursor:pointer;text-align:left;font-size:12px;font-weight:normal;padding-left:5px;}");
        buf.push(pfx + " .yearstable td {width:26px;height:24px;cursor:pointer;text-align:center;font-size:12px;font-weight:normal;}");
        buf.push(pfx + " .monthcell:hover, .yearcell:hover {background:#33AAFF;color:white;}");

        buf.push("</style>");
					
        buf.push(
        "<div class='calcontainer' id='" + this.id + "_nmdrCAL_container' style='display:block;position:relative;left:0px;top:0px;width:" + width + "px;height:" + height + "px;'>" +
        "<div class='loader'></div>" +
        "<div class='header' style='display:block;position:absolute;left:" + paddingLeft + "px; top:5px; width:" + (width-2*paddingLeft) + "px; height:" + headerHeight + "px;'>" +
		"<table class='headtable' cellpadding='2' cellspacing='0' border='0'><tr>" +
		"<td style='padding-top:4px'><img class='img' src='" + this.imagePath + "ghome.gif' onclick=\"nmdr.core.$('" + this.id + "').goToday();\"></td>" +
		"<td style='padding-top:6px'><img class='img' src='" + this.imagePath + "calprev.png' onclick=\"nmdr.core.$('" + this.id + "').goPrevMonth();\"></td>" +
		"<td style='padding-top:6px'><img class='img' src='" + this.imagePath + "calnext.png' onclick=\"nmdr.core.$('" + this.id + "').goNextMonth();\"></td>" +
		"<td style='padding-left:5px'><span class='mtitle' id='" + this.id + "_nmdrCAL_mtitle' onclick=\"nmdr.core.$('" + this.id + "').openMonthPopup();\">" + curMonth + "</span></td>" +
		"<td style='padding-left:3px'><span class='ytitle' id='" + this.id + "_nmdrCAL_ytitle' onclick=\"nmdr.core.$('" + this.id + "').openYearPopup();\">" + yyyy + "</span></td>" +
 		(this.showOptions ? "<td style='padding:8px 0 0 8px'><img class='img' src='" + this.imagePath + "calmenu.png' onclick=\"nmdr.core.$('" + this.id + "').openViewMenu(this);\"></td>" : "") +
		"</tr></table></div>" +
		"<div class='daysdiv' id='" + this.id + "_nmdrCAL_daysdiv' style='display:block;position:absolute;left:" + paddingLeft + "px;top:" + headerHeight + "px;width:" + (width-2*paddingLeft) + "px;height:" + (height-75) + "px;'></div>" +
		(this.showFooter ? "<div class='footer' style='display:block;position:absolute;left:" + paddingLeft + "px; top:" + (height-footerHeight) + "px; width:" + (width-2*paddingLeft) + "px; height:" + footerHeight + "px;line-height:" + (footerHeight+3) + "px;'><span>" + todayText + "</span>" +
        (this.showClock ? "&nbsp;&nbsp;&nbsp;<span id='" + this.id + "_nmdrCAL_clock'></span></div>" : "</div>") : "") +
        "<div class='monthsdiv' id='" + this.id + "_nmdrCAL_monthsdiv' style='position:absolute;left:0px; top:0px; width:0px; height:170px;z-index:998;'>" + this.makeMonthsList() + "</div>" +
        "<div class='yearsdiv' id='" + this.id + "_nmdrCAL_yearsdiv' style='position:absolute;left:0px; top:0px; width:0px; height:170px;z-index:999;'>" + this.makeYearsList() + "</div>" +
        "</div>");

        this.innerHTML = buf.join("");

        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrCAL_monthsdiv", this.scrollMonths);
        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrCAL_yearsdiv", this.scrollYears);

		this.makeDays();
		
		if (this.showClock) nmdrDigitalClock(this.id + "_nmdrCAL_clock").start();
    };

    $.makeDays = function () {
        
        this.days = [];
        var	curMonth = this.langData.months[this.date.getMonth()],
			yyyy = this.date.getFullYear(),
			html = 
            this.view == this.defaultView ? this.makeDefaultView() : 
            this.view == this.tabularView ? this.makeTabularView() : this.makeYearView();

		document.getElementById(this.id + "_nmdrCAL_mtitle").innerHTML = curMonth;
		document.getElementById(this.id + "_nmdrCAL_ytitle").innerHTML = yyyy;
		document.getElementById(this.id + "_nmdrCAL_daysdiv").innerHTML = html;
 		
        this.afterRendering();

        nmdr.core.tooltips.start("calhotspot", "#BCDBE6", "#0EB5ED");
    };
    
    $.makeDefaultView = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
	
			firstDay = new Date(yyyy, mm, 1),
			lastDay = new Date(yyyy, mm, 0),
			today = new Date(),
		
			curMonthDays = [],
			d = new Date(yyyy, mm, 1);
			
        while (d.getMonth() === mm) {
            curMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var prevMonthDays = [],
			mx = mm == 0 ? 11 : mm - 1,
			yx = mm == 0 ? yyyy - 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            prevMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var nextMonthDays = [],
			mx = mm == 11 ? 0 : mm + 1,
			yx = mm == 11 ? yyyy + 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            nextMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var start = false, end = false, ind=0, p=0, q=0, s=0, cd = new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay() - 1;

        for (var c = 0; c < 7; c++) {
            if (this.langData.weekdays[c] == this.langData.weekdays[pd]) break;
            s++;
        }

        var buf = [];
        buf.push("<div class='hcells' style='display:block;'>");

        if (this.showWN) buf.push("<div class='hcellWN' style='display:inline-block;width:" + this.langData.weekname + "px;'>" + this.langData.weekname + "</div>");
			
        for (var i = 0; i < this.langData.weekdays.length; i++) {
			var dn = this.cellWidth < 80 ?  this.langData.daysShort[i==6?0:i+1] : this.langData.weekdays[i], fi = i==0 ? " hcell_fi" : "";
            buf.push("<div class='hcell " + fi + "' style='display:inline-block;'><span class='hcellspan'>" + dn.toUpperCase() + "</span></div>");
        }
        buf.push("</div>");
		
        this.days = [];

        for (var r = 0; r < 6; r++) {
            buf.push("<div style='display:block;'>");
							
            for (var c = 0; c < 7; c++) {
                var m = false, d = new Date(curMonthDays[p]);
                pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
                if (!start && this.langData.weekdays[pd] == this.langData.weekdays[c]) start = true;
                if (p == curMonthDays.length) end = true;
                if (start && !end) {
                    p++;
                    m = true;
                    //if (this.dayIndex === -1 && dd === d.getDate()) this.dayIndex = ind;  // <== if each month should have a selected day then comment in this line!
                }
                else if (!start) d = new Date(prevMonthDays[prevMonthDays.length - s + c]);
                else if (end) d = new Date(nextMonthDays[q++]);
                			
                this.days.push(d);

				var td = d.toDateString() == today.toDateString(),
					sel = this.enabled && this.dayIndex == ind,
					hol = d.isHoliday(),
					dn = d.getDay() == 0 ? 6 : d.getDay()-1,				
					tooltip = "";
					
                if (hol != null) {
                    tooltip = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                    for (var i = 0; i < hol.federalstates.length; i++) {
                        tooltip += hol.federalstates[i];
                        if (i < hol.federalstates.length - 1) tooltip += "<br>";
                    }
                }

				if (this.showWN && c == 0) 
					buf.push("<div class='cellWN' style='display:inline-block;'>" + d.getWeek() + "</div>");

                buf.push("<div class='cell" + (c == 0 ? " cell_fi" : "") + (m ? " cell_ac" : " cell_pa") + (td ? " cell_to" : "") +
					(sel ? " cell_se" : "") + (dn == 5 || dn == 6 ? " cell_ss" : "") + "' id='" + this.id + "_nmdrCAL_cell_" + ind + "'" +
					(this.enabled && m ? " onclick=\"nmdr.core.$('" + this.id + "').openCellMenu(this, " + ind + ")\"" : "") + " style='display:inline-block;'>" +
					"<div class='daydiv' style='display:block;'>" +
					"<span class='" + (hol != null ? "dayspan_ho calhotspot" : (m ? "dayspan" : "dayspan_pa")) + "' id='" + this.id + "_nmdrCAL_cellspan_" + ind + "'" +					
					(hol != null ? " tooltip='" + tooltip + "'" : "") + ">" + d.getDate() + "</span></div>" +
					"<div class='userdiv' style='display:block;'>" + this.renderCell(d) + "</div></div>");
					
                ind++;
            }
            buf.push("</div>");
        }
        
        return buf.join("");
	};
	
    $.makeTabularView = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
			today = new Date(),
			curMonthDays = [],
			d = new Date(yyyy, mm, 1);
		
        while (d.getMonth() === mm) {
            curMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var nextMonthDays = [],
			mx = mm == 11 ? 0 : mm + 1,
			yx = mm == 11 ? yyyy + 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            nextMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var p=0, q=0, s=0, ix=false, cd = new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay() - 1,
			buf=[], bf1=[], bf2=[], bf3=[], bf4=[], p=0;
			
        for (var c = 0; c < 7; c++) {
            if (this.langData.weekdays[c] == this.langData.weekdays[pd]) break;
            s++;
        }

        bf1.push("<td class='hcell1_user'></td>");
        bf2.push("<td class='hcell2_user'></td>");
        bf3.push("<td class='hcell3_user'></td>");

		for (var ind = 0; ind < 31; ind++) {
 
            var m = false, d = new Date(curMonthDays[p]);
            pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
            if (p != curMonthDays.length) {
                p++;
                m = true;
                //if (this.dayIndex === -1 && dd === d.getDate()) this.dayIndex = ind;  // <== if each month should have a selected day then comment in this line
            }
            else d = new Date(nextMonthDays[q++]);
            
            this.days.push(d);

			var td = d.toDateString() == today.toDateString(),
				sel = this.enabled && this.dayIndex == ind,
				hol = d.isHoliday(),
				tooltip = "";
			
            if (hol != null) {
                tooltip = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                for (var t = 0; t < hol.federalstates.length; t++) {
                    tooltip += hol.federalstates[t];
                    if (t < hol.federalstates.length - 1) tooltip += "<br>";
                }
            }
            			
			var cls = (m ? " cell_ac" : " cell_pa") + (td ? " cell_to" : "") + (sel ? " cell_se" : "") + (pd == 5 || pd == 6 ? " cell_ss" : "");
					
            bf1.push("<td class='hcell1" + cls + "' id='" + this.id + "_nmdrCAL_dcell_" + ind + "'>" +
                "<span class='hcell1_span " + (hol != null ? "dayspan_ho calhotspot" : (m ? "dayspan" : "dayspan_pa")) + "' id='" + this.id + "_nmdrCAL_cellspan_" + ind + "'" +					
					(hol != null ? " tooltip='" + tooltip + "'" : "") + ">" + d.getDate() + "." + (d.getMonth()+1) + "</span></td>");

			if (d.getDay() == 1) {
				if (ind == 0) ix = true;
				var cr = false, cs = ind == 0 ? 7 : ind < 7 ? ind : ind < 24 ? 7 : 0;
				if (cs == 0) { cs = 7; cr = !ix; }
				bf2.push("<td class='hcell2' id='" + this.id + "_nmdrCAL_wcell_" + ind + "' colspan=" + cs + ">" +
				"<span class='hcell_2_span'>" + d.addDay(d,(ix ? 0 : -1)).getWeek() + "</span></td>");
				if (cr) {
					bf2.push("<td class='hcell2' id='" + this.id + "_nmdrCAL_wcell_" + ind + "' colspan=" + (31-ind) + ">" +
					"<span class='hcell2_span'>" + d.addDay(d,1).getWeek() + "</span></td>");
				}
			}
			
            bf3.push("<td class='hcell3" + cls + (ind==0 ? " hcell_fr" : "") + "' id='" + this.id + "_nmdrCAL_ncell_" + ind + "'>" +
				"<span class='hcell3_span'>" + this.langData.daysShort[d.getDay()] + "</span></td>");
        }
		
		for (var i = 0; i < this.tabuserLines; i++) {
			bf4.push("<tr><td class='hcell4_user'>" + this.renderFirstColumn(i) + "</td>");
			p=q=0;
			for (var ind = 0; ind < 31; ind++) {
				var m = false, d = new Date(curMonthDays[p]);
				pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
				if (p != curMonthDays.length) {	p++; m = true; }
				else d = new Date(nextMonthDays[q++]);
				var cls = (m ? " cell_ac" : " cell_pa") + (pd == 5 || pd == 6 ? " cell_ss" : "") + (ind==0 ? " hcell_fr" : "");
				bf4.push("<td class='hcell4" + cls + "' id='" + this.id + "_nmdrCAL_ucell_" + i + "_" + ind + "'" +
					(this.enabled && m ? " onclick=\"nmdr.core.$('" + this.id + "').openCellMenu(this," + ind + ",'" + 
                    this.id + "_nmdrCAL_ucell_" + i + "_" + ind + "')\"" : "") + ">" + this.renderTableCell(i, ind, d) + "</td>");
			}
			bf4.push("</tr>");
		}
 
   		buf.push("<table width='100%' height='auto' border='0' cellpadding='0' cellspacing='0'>");
   		buf.push("<tr>" + bf1.join("") + "</tr>");
   		buf.push("<tr>" + bf2.join("") + "</tr>");
   		buf.push("<tr>" + bf3.join("") + "</tr>");
   		buf.push(bf4.join(""));
   		buf.push("</table>");
     
        return buf.join("");
	};

    $.makeYearView = function() {

        var year = this.date.getFullYear();
        
        this.dayIndex = 0;
           
        var str =
            "<table width='100%' height='auto' cellpadding='4' cellspacing='0' border='0'>" +
            "<tr>" +
            "<td id='yearviewCell_0'>" + this.makeMonthTable("yearviewCell_0", year, 0, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" + 
            "<td id='yearviewCell_1'>" + this.makeMonthTable("yearviewCell_1", year, 1, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_2'>" + this.makeMonthTable("yearviewCell_2", year, 2, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_3'>" + this.makeMonthTable("yearviewCell_3", year, 3, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='yearviewCell_4'>" + this.makeMonthTable("yearviewCell_4", year, 4, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_5'>" + this.makeMonthTable("yearviewCell_5", year, 5, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_6'>" + this.makeMonthTable("yearviewCell_6", year, 6, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_7'>" + this.makeMonthTable("yearviewCell_7", year, 7, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='yearviewCell_8'>" + this.makeMonthTable("yearviewCell_8", year, 8, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_9'>" + this.makeMonthTable("yearviewCell_9", year, 9, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_10'>" + this.makeMonthTable("yearviewCell_10", year, 10, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_11'>" + this.makeMonthTable("yearviewCell_11", year, 11, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "</table>";

        return str;
    };
    
    $.makeMonthTable = function(id, year, month, lang, render, tooltipCallback, backgroundCallback) {

        var date = new Date(year, month, 1),
            yyyy = date.getFullYear(),
            curMonth = this.langData.months[date.getMonth()],
            self = this;

        var makeDays = function () {

            var dd = date.getDate(),
                mm = date.getMonth(),
                yyyy = date.getFullYear(),

                firstDay = new Date(yyyy, mm, 1),
                lastDay = new Date(yyyy, mm, 0),
                today = new Date(),

                curMonthDays = [],
                d = new Date(yyyy, mm, 1);                
            
            while (d.getMonth() === mm) {
                curMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var prevMonthDays = [],
                mx = mm == 0 ? 11 : mm - 1,
                yx = mm == 0 ? yyyy - 1 : yyyy,
                d = new Date(yx, mx, 1);
                
            while (d.getMonth() == mx) {
                prevMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var nextMonthDays = [],
                mx = mm == 11 ? 0 : mm + 1,
                yx = mm == 11 ? yyyy + 1 : yyyy,
                d = new Date(yx, mx, 1);
                
            while (d.getMonth() == mx) {
                nextMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var start=false, end=false, p=0, q=0, s=0, cd=new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay()-1;

            for (var c = 0; c < 7; c++) {
                if (self.langData.weekdays[c] == self.langData.weekdays[pd]) break;
                s++;
            }

            var daysstr = "", daystitle = "<tr>";

            for (var i = 0; i < self.langData.weekdays.length; i++) {
                daystitle += "<td class='yvHcell'><span>" + self.langData.daysShort[i==6?0:i+1] + "</span></td>";
            }
            daystitle += "</tr>";

            for (var r = 0; r < 6; r++) {
                daysstr += "<tr>";
                for (var c = 0; c < 7; c++) {
                    var m = false, d = new Date(curMonthDays[p]);
                    pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
                    if (!start && self.langData.weekdays[pd] == self.langData.weekdays[c]) start = true;
                    if (p == curMonthDays.length) end = true;
                    if (start && !end) { p++; m = true; }
                    else if (!start) d = new Date(prevMonthDays[prevMonthDays.length - s + c]);
                    else if (end) d = new Date(nextMonthDays[q++]);
                    
                    self.days.push(d);

                    var td = d.toDateString() == today.toDateString(),
						hol = d.isHoliday(),
						tt = hol ? null : tooltipCallback(d),
						bc = hol ? null : backgroundCallback(d),
						st = tt ? " style='background:" + (bc ? bc : this.yvCellBackground) + "'" : "";
                    
                    if (hol != null) {
                        tt = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                        for (var t = 0; t < hol.federalstates.length; t++) {
                            tt += hol.federalstates[t];
                            if (t < hol.federalstates.length - 1) tt += "<br>";
                        }
                    }

                    var dy = d.getDay() == 0 ? 6 : d.getDay()-1, 
                        dn = d.getDate(), 
                        dm = self.enabled && m && hol == null ? (" onclick=\"nmdr.core.$('" + self.id + "').openCellMenu(this," + self.dayIndex + ")\"") : "",
                        mm = m && tt != null && tt != "" ? 
                            ("yvCellac" + (hol != null ? " yvCellho" : "") + "'" + st + " " + dm + "><span class='calhotspot' tooltip='" + tt + "'>" + dn + "</span>") : 
                            (m ? "yvCellac'" + dm + "><span>" + dn + "</span>" : "'>");

                    daysstr += "<td id='" + self.id + "_cell" + self.dayIndex + "' class='yvCell" + (m ? " cell_ac" : " cell_pa") + (td && m ? " cell_to" : "") +
                        (dy==5 || dy==6 ? " cell_ss" : "") + st + " " + mm + "</td>";

                    self.dayIndex++;
                }
                daysstr += "</tr>";
            }

            return daystitle + daysstr;
        };

        var calStr =
        "<div class='yvContainer'>" +
        "<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>" +
        "<tr><td class='yvMontitle' colspan='7'><span>" + curMonth + "&nbsp;&nbsp;" + yyyy + "</span></td></tr>" + makeDays() + "</table></div>";

        if (render) document.getElementById(id).innerHTML = calStr;
        
        return calStr;
    };
   
    $.getYVTooltip = function (date) {
        return null;
    };

    $.getYVBackground = function (date) {
        return null;
    };
	
    //========================
       
    $.getDate = function () {
        return this.date;
    };

    $.setDate = function (date) {
        if (typeof (date) == "string") this.date = new Date(date);
        else this.date = date;
        this.dayIndex = -1;
    };

    $.selectDay = function (index, cellid) {
		
		if (this.view == this.defaultView) {
			if (this.dayIndex != -1) {
				var el = document.getElementById(this.id + "_nmdrCAL_cell_" + this.dayIndex);
				if (el) el.classList.remove("cell_se"); // <-- el could be null becouse of dynamic html
			}
			
            this.dayIndex = -1;
            
			if (index != -1) {
				var d = this.days[index];
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));				
                    
                   this.dayIndex = index;
				
				var el = document.getElementById(this.id + "_nmdrCAL_cell_" + index);
				el.classList.add("cell_se");
			}
		}
		else if (this.view == this.tabularView) {
			if (this.dayIndex != -1) {
				var e1 = document.getElementById(this.id + "_nmdrCAL_dcell_" + this.dayIndex);
				var e2 = document.getElementById(this.id + "_nmdrCAL_ncell_" + this.dayIndex);            
				if (e1) { 
					e1.classList.remove("cell_se"); 
					e2.classList.remove("cell_se"); 
					
					var e3 = document.getElementsByClassName("ucellsel");
					if (e3.length > 0) {
						var el = e3[0];
						el.classList.remove("ucellsel"); 
						el.classList.remove("cell_se"); 
					}
				}
			}
			
            this.dayIndex = -1;

			if (index != -1) {
				var d = this.days[index];
				
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));
                    
                this.dayIndex = index;
								
				var e1 = document.getElementById(this.id + "_nmdrCAL_dcell_" + this.dayIndex);
				var e2 = document.getElementById(this.id + "_nmdrCAL_ncell_" + this.dayIndex);
				e1.classList.add("cell_se");
				e2.classList.add("cell_se");
				
				if (cellid) {
					var e3 = document.getElementById(cellid);
					if (e3) {
						e3.classList.add("ucellsel"); 
						e3.classList.add("cell_se"); 
					}
				}
			}
		}
		else {
			var e1 = document.getElementsByClassName("ucellsel");
			if (e1.length > 0) {
                var el = e1[0];
				el.classList.remove("ucellsel"); 
				el.classList.remove("cell_se"); 
			}
			
			if (index != -1) {
				var d = this.days[index];
				
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));
                    
				var el = document.getElementById(this.id + "_cell" + index);
				if (el) {
					el.classList.add("ucellsel"); 
					el.classList.add("cell_se"); 
				}
			}
	    }
    };

    $.selectMonth = function (month) {
		this.selectDay(-1);
        this.setDate(new Date(this.date.getFullYear(), month, this.date.getDate(),
		this.date.getHours(), this.date.getMinutes(), 0));
        this.dateChanged();
    };

    $.selectYear = function (year) {
		this.selectDay(-1);
        this.setDate(new Date(year, this.date.getMonth(), this.date.getDate(),
		this.date.getHours(), this.date.getMinutes(), 0));
        this.dateChanged();
    };

    $.goPrevMonth = function () {
		this.selectDay(-1);
        this.setDate(this.date.prevMonth());
        this.dateChanged();
    };

    $.goNextMonth = function () {
		this.selectDay(-1);
        this.setDate(this.date.nextMonth());
        this.dateChanged();
    };

    $.goToday = function () {
		this.selectDay(-1);
        this.setDate(new Date());
        this.dateChanged();
    };

    $.refresh = function () {
        this.dateChanged();
    };
	
    $.dateChanged = function () {
        if (this.date != null) {
            var self = this;
            this.showLoader(true);
            window.setTimeout(function () {
                self.prepareUserData(self.date.toISOString(), function () {
                    self.showLoader(false);
                    self.makeCalendar();
                });
            }, 50);
        }
    };

	$.executeMenuCommand = function (commandName) {
		var self = this;
		this.closeCellMenu(function() { self.executeCommand(commandName, self.getDate()); } );
	};

	//=================================================================
    // Virtual methods (may be overridden by user)
	//=================================================================

    $.prepareUserData = function (date, callback) {
        setTimeout(function () { callback(); }, 20);
    };

    $.renderFirstColumn = function (row) {
        return "" + row;
    };
    
    $.renderCell = function (date) {
        return "";
    };

    $.renderTableCell = function (date) {
        return "";
    };
    
    $.afterRendering = function () {
    };

    $.prepareCommands = function () {
        return [
            { name: this.langData.commands[0], icon: "details.gif", enabled: true, action: "view" },
            { name: this.langData.commands[1], icon: "editdetails.gif", enabled: true, action: "edit" },
            { name: this.langData.commands[2], icon: "delete.gif", enabled: true, action: "delete" },
        ];
    };
	
    $.checkCommands = function (commands, date, callback) {	
		callback();
	};
	
	$.executeCommand = function (commandName, date) {
		alert(commandName + "  " + date);
	};

	//=================================================================
    // View menu
	//=================================================================

	$.changeView = function (num) {
		var self = this;
		this.closeViewMenu(function() {
			switch (num) {
				case 1: self.view = self.defaultView; break;
				case 2: self.view = self.tabularView; break;
				case 3: self.view = self.yearView; break;
			}
			self.dateChanged();
		});
	};
	
    $.openViewMenu = function (src) {
				
        this.selectDay(-1);

		var self = this, buf = [];
	
		buf.push("<style>.viewMenuTr {height:24px;} .viewMenuTr:hover {color:#fff;background:#33AAFF; cursor:pointer;}</style>");
		buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(1)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview1.png'></td>");
		buf.push("<td><span>" + this.langData.views[0] + "</span></td>");
		buf.push("</tr>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(2)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview2.png'></td>");
		buf.push("<td><span>" + this.langData.views[1] + "</span></td>");
		buf.push("</tr>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(3)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview3.png'></td>");
		buf.push("<td><span>" + this.langData.views[2] + "</span></td>");
		buf.push("</tr></table>");

		var m = document.createElement("div");
        m.setAttribute("id", this.id + "_nmdrCAL_viewmenu");
		m.innerHTML = buf.join("");

		m.style.cssText = 
		"position:absolute;background-color:white; border:1px solid #bbb; padding:3px; width:0; height:0; opacity:0; font-family:arial,verdana,sans-serif; font-weight:normal; font-size:12px; z-index:999;" +
		"box-shadow:5px 5px 5px #eee; transition:all 500ms ease-in-out; -webkit-transition:all 500ms ease-in-out; -moz-transition:all 500ms ease-in-out; -o-transition:all 500ms ease-in-out;";
		
		document.body.appendChild(m);
		
		m.style.left = src.absLeft + "px";
		m.style.top = src.absTop + 20 + "px";
		m.style.height = 80 + "px";
		m.style.width = 180 + "px";
		m.style.opacity = 1;
			
		nmdr.core.popup.open(m, src, null, function (cb) { self.closeViewMenu(cb); });
    };
	
    $.closeViewMenu = function (callback) {
		var m = document.getElementById(this.id + "_nmdrCAL_viewmenu");
		if (m != null) {
			m.innerHTML = "";
			m.style.width = 0;
			m.style.height = 0;
			m.style.opacity = 0;
			
			nmdr.core.popup.close();
			
			if (callback) callback();
			
			document.body.removeChild(m);
		}
    };
    
    //=================================================================
    // Cell menu
	//=================================================================

    $.makeCellMenu = function (loading, src) {
		
		var m = document.getElementById(this.id + "_nmdrCAL_cellmenu");
		
		if (loading) {
			var self = this;
			
			if (m == null) {
				m = document.createElement("div");
				m.setAttribute("id", this.id + "_nmdrCAL_cellmenu");
							
				m.style.cssText = 
				"position:absolute;background-color:white; border:1px solid #bbb; padding:3px; width:0; height:0; opacity:0; font-family:arial,verdana,sans-serif; font-weight:normal; font-size:12px; z-index:998;" +
				"box-shadow:3px 3px 3px #eee; transition:all 500ms ease-in-out; -webkit-transition:all 500ms ease-in-out; -moz-transition:all 500ms ease-in-out; -o-transition:all 500ms ease-in-out;";

				document.body.appendChild(m);
			}
		
			m.innerHTML = "<div style='position:absolute; height:100%; width:100%; top:0px; left:0px; cursor:wait;" +
			"background:#fff url(" + this.imagePath + "loading.gif) no-repeat center center;opacity:0.75; z-index:999;'></div>";
		
			m.style.visibility = "visible";
			m.style.left = src.absLeft + "px";
			m.style.top = src.absTop + 20 + "px";
			m.style.height = (this.commands.length * 24 + 28) + "px";
			m.style.width = 180 + "px";
			m.style.opacity = 1;
			
			nmdr.core.popup.open(m, src, null, 
				function (cb) { self.closeCellMenu(cb); },
				function (invoker, target) { 
					var p = target.parentElement;
					while (p != null) {
						if (p == invoker) return false;
						p = p.parentElement;
					}
					return true;
				}
			);
			return;
		}

		var buf = [];
		buf.push("<style>.cellMenuTr {height:24px;} .cellMenuTr:hover {color:#fff;background:#33AAFF; cursor:pointer;} .menuclose:hover {cursor:pointer;}</style>");
		buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");
        buf.push("<tr style='height:20px'><td colspan='2' style='text-align:right;background:#eee;padding:2px 3px 0 0;'>");
		buf.push("<img class='menuclose' src='" + this.imagePath + "dmclose.png' onclick=\"nmdr.core.$('" + this.id + "').closeCellMenu()\"></td></tr>");

		for (var i = 0; i < this.commands.length; i++) {
			var com = this.commands[i];
			buf.push("<tr class='cellMenuTr'" + (com.enabled ? " onclick=\"nmdr.core.$('" + this.id + "').executeMenuCommand('" + com.action + "')\"" : "") + 
				(com.enabled ? "" : " style='opacity:0.5;") + "'>");
			buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + com.icon + "'></td>");
			buf.push("<td><span>" + com.name + "</span></td>");
			buf.push("</tr>");
		}
		buf.push("</table>");

        m.innerHTML = buf.join("");
    };
	
    $.openCellMenu = function (src, index, cellid) {
		
		var self = this;

		this.selectDay(index, cellid);
		this.makeCellMenu(true, src);		
		this.commands = this.prepareCommands();
		
        window.setTimeout(function () {
			self.checkCommands(self.commands, self.getDate(), 
				function() {
					self.makeCellMenu(false);
				}
			);       
        }, 50);
    };
	
    $.closeCellMenu = function (callback) {
	
        var m = document.getElementById(this.id + "_nmdrCAL_cellmenu");
		
		if (m != null) {
			
			this.selectDay(-1);
			
			var c = document.getElementById(this.id + "_nmdrCAL_container");
			m.style.left = c.absLeft + "px";
			m.style.top = c.absTop + "px";
			m.style.width = 0;
			m.style.height = 0;
			m.style.opacity = 0;
			m.style.visibility = "hidden";
			
			nmdr.core.popup.close();
			
			if (callback) callback(); 
		}
    };

    //=================================================================
    // Months drop down menu
	//=================================================================

    $.makeMonthsList = function () {
        var mms = "";
        for (var i = this.monthIndex; i < this.langData.months.length; i++) {
            mms += "<tr><td class='monthcell' id='" + this.id + "_nmdrCAL_monthcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectMonth(" + i + ");\"><span>" + this.langData.months[i] + "</span></td></tr>";
        }
        return "<table class='monthstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + mms + "</table>";
    };

    $.openMonthPopup = function () {
		var self = this
        var e = document.getElementById(this.id + "_nmdrCAL_mtitle");
        var m = document.getElementById(this.id + "_nmdrCAL_monthsdiv");
        var c = document.getElementById(this.id + "_nmdrCAL_container");
        m.style.position = "absolute";
        m.style.left = e.absLeft - c.absLeft + "px";
        m.style.top = e.absTop - c.absTop + 20 + "px";
		m.style.width = this.moDDListWidth + "px";
		nmdr.core.popup.open(m, e, null, function (cb) { self.closeMonthPopup(cb); });
    };

    $.closeMonthPopup = function (callback) {
        var m = document.getElementById(this.id + "_nmdrCAL_monthsdiv");
		m.style.width = "0";
		nmdr.core.popup.close();
		if (callback) callback();
    };

    $.scrollMonths = function (src, step) {
        if (step <= -120) { if (src.monthIndex < 5) src.monthIndex++; }
        else if (src.monthIndex > 0) src.monthIndex--;
        document.getElementById(src.id + "_nmdrCAL_monthsdiv").innerHTML = src.makeMonthsList();
    };

    //=================================================================
    // Years drop down menu
	//=================================================================

    $.makeYearsList = function () {
        var yms = "";
        for (var i = this.yearIndex; i < this.yearIndex + 7; i++) {
            yms += "<tr><td class='yearcell' id='" + this.id + "_nmdrCAL_yearcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectYear(" + i + ");\"><span>" + i + "</span></td></tr>";
        }
        return "<table class='yearstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + yms + "</table>";
    };

    $.openYearPopup = function () {
		var self = this
        var e = document.getElementById(this.id + "_nmdrCAL_ytitle");
        var m = document.getElementById(this.id + "_nmdrCAL_yearsdiv");
        var c = document.getElementById(this.id + "_nmdrCAL_container");
        m.style.position = "absolute";
        m.style.left = e.absLeft - c.absLeft + "px";
        m.style.top = e.absTop - c.absTop + 20 + "px";
		m.style.width = this.yeDDListWidth + "px";
		nmdr.core.popup.open(m, e, null, function (cb) { self.closeYearPopup(cb); });
    };

    $.closeYearPopup = function (callback) {
        var m = document.getElementById(this.id + "_nmdrCAL_yearsdiv");
		m.style.width = "0";
		nmdr.core.popup.close();
		if (callback) callback();
    };

    $.scrollYears = function (src, step) {
        if (step <= -120) { if (src.yearIndex < 2094) src.yearIndex++; }
        else if (src.yearIndex > 1995) src.yearIndex--;
        document.getElementById(src.id + "_nmdrCAL_yearsdiv").innerHTML = src.makeYearsList();
    };

    $.showLoader = function (show) {        
        var loader = this.getElementsByClassName("loader")[0];
        if (loader) {
            loader.style.display = show ? "inline" : "none";
            loader.style.cursor = show ? "wait" : "default";
        }
    };

    return $;
}

//@FN:#nmdrPHPCalendar
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
#  nmdrPHPCalendar
#
#  Version: 1.00.00
#  Date: August 15. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrPHPCalendar(id) {
    
	var $ = nmdr.core.$(id, "nmdrPHPCalendar");
	if ($ == null) return;

//	$.PHP_URL = "http://localhost/dashboard/nalizadeh/javascript/php/calendar.php";
	$.PHP_URL = "http://nalizadeh.com/javascript/php/calendar.php";
	
	$.calData = [];
	$.ca = null;

	$.init = function(props) {
		
		var self = this, ca = nmdr.calendar(id);
		
		ca.prepareUserData = function (date, callback) {
			self.readItems(date, callback);
		};
		
		ca.renderCell = function (date) {
		
			var ln = self.findItems(date), tp = "", bg = "", tooltip = "";
			
			for (var i=0; i < ln.length; i++) {

				var cd = self.calData[ln[i]], von = new Date(cd.startdate), bis = new Date(cd.enddate);
				
				tp = cd.type;
				tooltip += "<b>" + cd.username + "</b><br>" + cd.type + "&nbsp;" + cd.text + "<br>" + von.asString() + " - " + bis.asString();
				if (i < ln.length-1) tooltip += "<br><br>";
					
				switch (cd.type) {
					case "Urlaub": bg = "background:#D8E4BC"; break;
					case "Frei": bg = "background:#8DB4E2"; break;
					case "Termin": bg = "background:#E6B8B7"; break;
				}
			}
					
			return tp == "" ? "" :
				"<div style='width:100%;height:100%;" + bg + "'><span class='hotspot' tooltip='" + tooltip + "' " +
				"style='font-weight:normal'>" + tp + "</span></div>";
		};
	
		ca.afterRendering = function () {
			nmdr.core.tooltips.start("hotspot", "#FFFFAE", "#FFB13D");
		};
		
		ca.getYVTooltip = function (date) {
			var ln = self.findItems(date), tp = "", bg = "", tooltip = "";
			
			for (var i=0; i < ln.length; i++) {

				var cd = self.calData[ln[i]], von = new Date(cd.startdate), bis = new Date(cd.enddate);
				
				tp = cd.type;
				tooltip += "<b>" + cd.username + "</b><br>" + cd.type + "&nbsp;" + cd.text + "<br>" + von.asString() + " - " + bis.asString();
				if (i < ln.length-1) tooltip += "<br><br>";
			}
			return tooltip == "" ? null : tooltip;
		};

		ca.getYVBackground = function (date) {
			var ln = self.findItems(date);
			return ln.length == 0 ? null : "#D8E4BC";
		};
		
		ca.prepareCommands = function () {
			return [
				{ name: "Neu...", icon: "details.gif", enabled: true, action: "new" },
				{ name: "Öffnen...", icon: "editdetails.gif", enabled: true, action: "view" },
				{ name: "Bearbeiten...", icon: "editdetails.gif", enabled: true, action: "edit" },
				{ name: "Löschen...", icon: "delete.gif", enabled: true, action: "delete" },
			];
		};
		
		ca.executeCommand = function (commandName, date) {
		
			var callback = function() { ca.refresh(); };
			
			if (commandName == "new") self.editItem(date, callback, true);
			if (commandName == "view") self.viewItem(date, callback);
			if (commandName == "edit") self.editItem(date, callback);
			if (commandName == "delete") self.deleteItem(date, callback);
		};

		ca.checkCommands = function (commands, date, callback) {
			var n = self.findItems(date);	
			for (var i = 0; i < commands.length; i++) {
				if (commands[i].action == "new" && n.length != 0) commands[i].enabled = false;
				if (commands[i].action == "view" && n.length == 0) commands[i].enabled = false;
				if (commands[i].action == "edit" && n.length == 0) commands[i].enabled = false;
				if (commands[i].action == "delete" && n.length == 0) commands[i].enabled = false;
			}
			
			callback();
		};
		
		props.view = ca.defaultView;
		
		ca.init(props);
		
		this.ca = ca;
		nmdr.core.dialog.imagePath = this.ca.imagePath;
	};

	$.dbREAD = function(item, success, failure) {
		item.func = "read";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.dbWRITE = function(item, success, failure) {
		item.func = "write";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.dbDELETE = function(item, success, failure) {
		item.func = "delete";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.findItems = function(date) {
		var rc = [];
		for (var i=0; i < this.calData.length; i++) {
			if (date.withoutTime().inRange(new Date(this.calData[i].startdate), new Date(this.calData[i].enddate))) rc.push(i);
		}
		return rc;
	};

	$.readItems = function(date, callback) {

		var self = this, d = new Date(date),
		
		failure = function(result) {
			if (self.calData.length == 0) {
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/03/2017", enddate: "06/04/2017", type: "Termin", text: "" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/10/2017", enddate: "06/12/2017", type: "Frei", text: "" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/20/2017", enddate: "06/20/2017", type: "Termin", text: "von 10:00 bis 12:00 Uhr" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/20/2017", enddate: "06/20/2017", type: "Termin", text: "von 14:00 bis 14:30 Uhr" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/25/2017", enddate: "07/10/2017", type: "Urlaub", text: "in Malaga" });
			}
			nmdr.core.dialog.message("Message", "Server response<br>" +
				"<br>readyState: " + result.readyState + 
				"<br>status: " + result.status + 
				"<br>responseText: " + result.responseText, 500, 300, callback);
		},
		
		success = function(result) {
			self.calData = [];
			for (var i=0; i < result.data.length; i++) self.calData.push(result.data[i]);
			callback();
		};
		
		var start = this.view == this.yearView ? new Date(d.getFullYear(), 0, 1).addMonth(-1) : d.addMonth(-1);
		var end = this.view == this.yearView ? new Date(d.getFullYear(), 11, 31).addMonth(1) : d.addMonth(1);
		
		this.dbREAD({startdate:start.toStr(), enddate:end.toStr()}, success, failure);
	};

	$.editItem = function(date, callback, isNew) {

		var self = this, ids = this.findItems(date), data = ids.length == 0 ? date : this.calData[ids[0]],
		
		saveForm = function (elem) {
			
			var uuid = elem.getElementsByClassName("uuid")[0],
				name = elem.getElementsByClassName("username")[0],
				start = elem.getElementsByClassName("startdate")[0],
				end = elem.getElementsByClassName("enddate")[0],
				typ = elem.getElementsByClassName("type")[0],
				txt = elem.getElementsByClassName("usertext")[0],
			
				data = {
					id: uuid.value,
					username: name.value,
					startdate: start.getDate().toStr(),
					enddate: end.getDate().toStr(),
					type: typ.options[typ.selectedIndex].value,
					text: txt.value
				},
				
				success = function(result) {			
					nmdr.core.dialog.message("Nachricht", result.responseText, 400, 250, callback);
				},
				
				failure = function(result) { 
					
					if (isNew) self.calData.push(data);
					else {
						var ids = findItems(new Date(data.startdate));
						if (ids.length > 0) {
							var cd = self.calData[ids[0]]; 
							cd.id = data.id;
							cd.username = data.username;
							cd.startdate = data.startdate;
							cd.enddate = data.enddate;
							cd.type = data.type;
							cd.text = data.text;
						}
					}
				
					var msg = "Folgende Daten wurden lokal gespeichert<br>" +
						"<br>Name: " + data.username +
						"<br>Anfang: " + data.startdate +
						"<br>Ende: " + data.enddate +
						"<br>Typ: " + data.type +
						"<br>Text: " + data.text;
						
					nmdr.core.dialog.message("Nachricht", "Server response<br>" +
						"<br>readyState: " + result.readyState + 
						"<br>status: " + result.status + 
						"<br>responseText: " + result.responseText +
						"<br><br>" + msg, 600, 450, callback);
				};
			
			self.dbWRITE(data, success, failure);
		},

		cancelForm = function (elem) {},

		renderDialog = function (data) {
			var id = data.id ? data.id : nmdr.coew.ajax.createUUID(),
				tp = data.type ? data.type : "",
				un = data.username ? data.username : "",
				op = "<option" + (tp=="Urlaub" ? " selected" : "") + ">Urlaub</option>" +
					 "<option" + (tp=="Frei" ? " selected" : "") + ">Frei</option>" +
					 "<option" + (tp=="Termin" ? " selected" : "") + ">Termin</option>",
				tx = data.text ? data.text : "";
				
			return "" +
			"<table cellpadding='2' cellspacing='10' width='100%' border='0'>" +
			"<tr><td>Id:</td><td><input type='text' name='uuid' class='uuid' style='width: 260px;border:0;background:#fff' value='" + id + "' disabled></td></tr>" +
			"<tr><td>Name:</td><td><input type='text' name='username' class='username' style='width: 250px' value='" + un + "'></td></tr>" +
			"<tr><td>Anfang:</td><td><div class='startdate' id='startdate'></div></td></tr>" +
			"<tr><td>Ende:</td><td><div class='enddate' id='enddate'></div></td></tr>" +
			"<tr><td>Typ:</td><td><select name='type' class='type' style='width: 150px'>" + op + "</select></td></tr>" +
			"<tr><td>Text:</td><td><input type='text' name='usertext' class='usertext' value='" + tx + "' style='width: 300px'></td></tr></table>";
		},

		afterRenderDialog = function (data) { 
			nmdr.datetime("startdate").init({"date": new Date(data.startdate ? data.startdate : data), "imagePath": self.ca.imagePath});
			nmdr.datetime("enddate").init({"date": new Date(data.enddate ? data.enddate : data), "imagePath": self.ca.imagePath});
		};

		nmdr.core.dialog.dialog(
		{
			title: 'Bearbeiten',
			width: 450,
			height: 340,
			render: renderDialog,
			renderAfter: afterRenderDialog,
			renderData: data,
			buttons: [
				{ lable: 'Save', className: 'saveButton', callback: saveForm },
				{ lable: 'Cancel', className: 'cancelButton', callback: cancelForm }
			]
		});
	};

	$.deleteItem = function(date, callback) {
		var self = this;
		nmdr.core.dialog.confirm("Delete", "Do you want to delete the selected calendar items?", 
			function (conf, result) {
				if (conf) {
					var ids = self.findItems(date);
					if (ids.length > 0) {
						self.dbDELETE(self.calData[ids[0]], 
							function(result) {
								nmdr.core.dialog.alert("Delete", "Items successfully deleted.", callback);
							}, 
							function(result) {
								
								self.calData.splice(ids[0],1);

								nmdr.core.dialog.message("Message", 
									"Server response<br>" +
									"<br>readyState: " + result.readyState + 
									"<br>status: " + result.status + 
									"<br>responseText: " + result.responseText, 500, 300, callback);
							}
						);
					}
				}
			}
		);
	};

	$.viewItem = function(date, callback) {
		var ids = this.findItems(date);
		if (ids.length > 0) {
			var cd = this.calData[ids[0]],
				msg = "<table cellpadding='2' cellspacing='2' width='100%' border='0'>" +
				"<tr><td colspan='2'><b>Kalendareintrag</b></td></tr>" +
				"<tr><td colspan='2' style='height:10px'></td></tr>" +
				"<tr><td>Id:</td><td>" + cd.id + "</td></tr>" +
				"<tr><td>Name:</td><td>" + cd.username + "</td></tr>" +
				"<tr><td>Anfang:</td><td>" + cd.startdate + "</td></tr>" +
				"<tr><td>Ende:</td><td>" + cd.enddate + "</td></tr>" +
				"<tr><td>Typ:</td><td>" + cd.type + "</td></tr>" +
				"<tr><td>Text:</td><td>" + cd.text + "</td></tr></table>";
			
			nmdr.core.dialog.message("Kalendar", msg, 400, 320);
		}
	};

	return $;
}

//@FN:#nmdrTable
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
#  nmdrTable
# 
#  nmdrTable is a pure Javascript extension of the HTML table that 
#  provides full customizable solution for representing tabular data 
#  on the web. It is part of the nmdrUI framework and supports sorting, 
#  filtering and pagination. Each cell of header, footer and body is 
#  customizable with own rendering. The data of table can be loaded 
#  dynamically through Ajax calls, so any server-side technology 
#  including PHP, ASP, Perl, Java Servlets and JSP can be used.
#
#
#  Version: 1.00.00
#  Date: February 28. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTable(id) {

	var $ = nmdr.core.$(id, "nmdrTable");
	if ($ == null) return;

    //=== Global variables without reference to this object instance

    var reference = null;

    //=== Local variables, which refer to this object instance

    $.columns = [];
    $.dataRows = [];
    $.originRows = [];
    $.selectedRows = [];
    $.menuCommands = [];
    $.selectedColumn = -1;
    $.selectedColumnOld = -1;

    $.pageNumber = 1;
    $.pageCount = 0;
    $.totalNumber = 0;
    $.firstRow = 0;
    $.lastRow = 0;
    $.clickedRow = -1;
    $.rowMenuActRow = -1;
    
    $.headerMenuOpen = false;
    $.rowMenuOpen = false;
	
	$.SORT_ASCENDING = "SortZA";
	$.SORT_DESCENDING = "SortAZ";

    //=== Properties
    
    $.props = {
   
		//=== controls

        imagePath : "img/",
        rowLimit : 10,
        sortingColumn : -1,
        sortingDirection : null,
        filters : {},
        customQuery : null,
        dataSplitter : ",",
        filterSplitter : "&",
		menuColumn : -1,
		        		
        clientHandling : true,
        doPostBack : false,
        multiSelection : false,     
        showRowCommands : false,
        showHeader : false,
        showFooter : false,
        showBorder : true,
        showGrids : true,
        showShadow : false,
		scrollable : false,
		scrollable2 : false,

		dummyCols : 6,
		dummyRows : 6,
		
        //=== Localization

		lang: "en",
        patternNames : "",
        removeFilterLable : "",
        removeSortingLable : "",
        pageLable : "",
        ofLable : "",
        totalLable : "",
        rowCountLable : "",
        gotoPageLable : "",

        //=== Styles
		
        color : "#000000",
        background : "#ffffff",
        borderColor : "#e0e0e0",
        borderWidth : "1px",
        fontFamily : "Arial, Helvetica, sans-serif",
        fontWidth : "normal",
        fontSize : "13px",
        checkSelectionColor : "rgb(0,113,198)",
        menuCellBackground : "rgb(156, 206, 240)",
		selcolumnWidth : 20,
		menucolumnWidth : 24,

		//=== header
		headerHeight : 24,
 		headerPadding : 3,
 		headerWhiteSpace : "nowrap",
		headerTextOverflow : "ellipsis",
		headerColor : "#000",
        headerBackground : "rgb(248, 248, 248)",
        headerFontFamily : "Arial, Helvetica, sans-serif",
        headerFontWidth : "bold",
        headerFontSize : "13px",
        headerSelectionColor : "rgba(156, 206, 240, 0.5)",
        headerHOverColor : "#000",
        headerHOverBackColor : "rgba(205,230,247,0.5)",
		
		//=== body
		bodyRowHeight : 24,
		bodyPadding : 3,
 		bodyWhiteSpace : "nowrap",
		bodyTextOverflow : "ellipsis",
        bodySelectionColor : "#000",
        bodySelectionBackColor : "rgba(156, 206, 240, 0.5)",
        bodyHOverColor : "#000",
        bodyHOverBackColor : "rgba(205,230,247,0.5)",
        bodyAlternateColor : "rgba(242,246,252,0.5)",
		
		//=== footer
        footerHeight : 42,
        footerColor : "#000000",
        footerBackColor : "rgb(248, 248, 248)",
        footerFontFamily : "Arial, Helvetica, sans-serif",
        footerFontWidth : "normal",
        footerFontSize : "12px",
        footerShowPager : true,
        footerShowGoPage : true,
        footerShowRowCount : true,
        footerShowPageInfo : true,
    };

    //=== Methods 

    $.init = function (props) {
		
		props = props || {};
		
        this.props = nmdr.core.utils.mergeProperties(this.props, props);
		
		this.localization();

        //this.makeView();
        this.loadData(true, true);
    };

    $.localization = function () {
		if (this.props.lang === "en") {
			this.props.patternNames = ["is equal/x", "is not equal/x", "contains/x", "not contains/x", "starts with/x", "ends with/x"];
			this.props.removeFilterLable = "Remove Filter";
			this.props.removeSortingLable = "Remove Sorting";
			this.props.pageLable = "Page";
			this.props.ofLable = "of";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Row count";
			this.props.gotoPageLable = "Go to page";
		}
		else if (this.props.lang === "de") {
			this.props.patternNames = ["is equal/ist gleich", "is not equal/ist nicht gleich", "contains/enthält", "not contains/enthält nicht", "starts with/beginnt mit", "ends with/endet mit"];
			this.props.removeFilterLable = "Filter löschen";
			this.props.removeSortingLable = "Sortierung löschen";
			this.props.pageLable = "Seite";
			this.props.ofLable = "von";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Anzahl Zeilen";
			this.props.gotoPageLable = "Gehe zur Seite";
		}
		else if (this.props.lang === "fr") {
			this.props.patternNames = ["is equal/est le même", "is not equal/n'est pas égal", "contains/contient", "not contains/ne contient pas", "starts with/commence par", "ends with/se termine par"];
			this.props.removeFilterLable = "Supprimer le filtre";
			this.props.removeSortingLable = "Supprimer le tri";
			this.props.pageLable = "Page";
			this.props.ofLable = "de";
			this.props.totalLable = "Totalement";
			this.props.rowCountLable = "Nombre de lignes";
			this.props.gotoPageLable = "Aller à la page";
		}
		else if (this.props.lang === "es") {
			this.props.patternNames = ["is equal/es lo mismo", "is not equal/no es igual", "contains/contiene", "not contains/no contiene", "starts with/comienza con", "ends with/termina con"];
			this.props.removeFilterLable = "Eliminar filtro";
			this.props.removeSortingLable = "Eliminar clasificación";
			this.props.pageLable = "Página";
			this.props.ofLable = "de";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Numero de lineas";
			this.props.gotoPageLable = "Ir a la página";
		}
	};
	
    //=== virtual methods

    $.renderHeaderCell = function (col, value) { return null; };
    $.renderBodyCell = function (row, col, value, selected) { return null; };
    $.getColumnWidth = function (col) { return null; };
    $.handleEvents = function (selections) { };
    $.openRow = function (row) { alert("open row: " + row); };
    $.editRow = function (row) { alert("edit row: " + row); };
    $.deleteRow = function (row) { alert("delete row: " + row); };

    //=== 

    $.makeView = function () {

        var buf = [], pr = this.props, 
		
		pfx = "#" + this.id,
		script = "<script type='text/javascript'>(function() { })();</script>",
		style = "<style type='text/css'>" +
			pfx + " {" +
			" position: relative !important;" +
			" width: 100%;" +
			" height: 100%;" +
			" box-sizing: border-box;" +
			" -webkit-box-sizing: border-box;" +
			" -moz-box-sizing: border-box;" +
            " -ms-box-sizing: border-box;" +
            " -o-box-sizing: border-box;" +
			"}" +
            pfx + " .nmdrTB_content {" +
			" overflow: hidden;" +
            " color:" + pr.color + ";" +
            " background:" + pr.background + ";" +
            " font-family: " + pr.fontFamily + ";" +
            " font-weight: " + pr.fontWidth + ";" +
            " font-size: " + pr.fontSize + ";" +
            " border-width:" + (pr.showBorder ? pr.borderWidth : "0px") + ";" +
            " border-color:" + pr.borderColor + ";" +
            " border-style: solid;" +
            " cursor: default;" +
            " -webkit-user-select: none;" +
            " -moz-user-select: none;" +
            " -ms-user-select: none;" +
            " -o-user-select: none;" +
            "  user-select: none;" + (pr.showShadow ? "box-shadow:3px 3px 3px #ccc;" : "") +
            "}" +

			pfx + " .nmdrTB_table { border-collapse: collapse; }" +
            pfx + " .nmdrTB_table td.nmdrTB_body_td { vertical-align: middle; }" +
            pfx + " .nmdrTB_table img { vertical-align: middle; cursor: pointer; }" +

			//=== header
		
            pfx + " .nmdrTB_header { background: " + pr.headerSelectionColor + "; height: " + pr.headerHeight + "px; }" +
            pfx + " .nmdrTB_header_tr {}" +
            pfx + " .nmdrTB_header_th {" +
			" height: " + pr.headerHeight + "px;" +
            " color: " + pr.headerColor + ";" +
            " background: linear-gradient(#eee, " + pr.headerBackground + ");" +
            " font-family: " + pr.headerFontFamily + ";" +
            " font-weight: " + pr.headerFontWidth + ";" +
            " font-size: " + pr.headerFontSize + ";" +
            " border-bottom-width:" + (pr.showBorder || pr.showGrids ? pr.borderWidth : "0px") + ";" +
            " border-bottom-color:" + pr.borderColor + ";" +
            " border-bottom-style: solid;" +
			" padding: " + pr.headerPadding + "px;" +
			" padding-top: " + (pr.headerPadding + 1) + "px;" +
            " text-align: left;" +
			" white-space: " + pr.headerWhiteSpace + ";" +
			" text-overflow: " + pr.headerTextOverflow + ";" +
			" overflow: hidden;" +
            "}" +
            pfx + " .nmdrTB_header_tr th.nmdrTB_header_th:not(:first-child) {" +
			"  border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_header_th:hover {" +
			" color: " + pr.headerHOverColor + ";" +
			" background: " + pr.headerHOverBackColor + ";" +
			" transition:all 0.5s ease-in-out;" +
			"}" +
            pfx + " .nmdrTB_header_th_sp:hover { cursor: pointer; }" +
			pfx + " .nmdrTB_header_th_se { width:" + pr.selcolumnWidth + "px; text-align:center; }" +
			pfx + " .nmdrTB_header_th_cm { width:" + pr.menucolumnWidth + "px; text-align:center; }" +
			pfx + " .nmdrTB_header_th_cm img { opacity: 0.3; }" +
			
			//=== body 
						
            pfx + " .nmdrTB_body_tr { height: " + pr.bodyRowHeight + "px; }" +
            pfx + " .nmdrTB_body_td {" +
			" height: " + pr.bodyRowHeight + "px;" +
			" padding: " + pr.bodyPadding + "px;" +
			" white-space: " + pr.bodyWhiteSpace + ";" +
			" text-overflow: " + pr.bodyTextOverflow + ";" +
			" overflow: hidden;" +
			"}" +
			pfx + " .nmdrTB_body_tr:nth-child(even) { background: " + pr.bodyAlternateColor + "; }" +
			pfx + " .nmdrTB_body_tr:nth-child(odd) { background: " + pr.background + "}" +
	        pfx + " .nmdrTB_body_tr:hover { color: " + pr.bodyHOverColor + "; background: " + pr.bodyHOverBackColor + "; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td:first-child { background: " + pr.bodyHOverBackColor + "; }" +

            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td:not(:first-child) {" +
			" border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td {" +
			" border-bottom: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
			
            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: hidden; float:right; }" +
            pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: hidden; float:right; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: visible; opacity: 0.3; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td:first-child img:first-of-type { visibility: visible; }" +
            pfx + " .nmdrTB_body_tr:hover .nmdrTB_body_cm { visibility: visible; opacity: 0.3; }" +
			
			//=== selection row
			
			pfx + " .nmdrTB_body_tr_sel { color: " + pr.bodySelectionColor + "; background: " + pr.bodySelectionBackColor + "; }" +
			pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td:not(:first-child) {" +
			" border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
			pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td {" +
			" border-bottom: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_body_tr_sel:hover td.nmdrTB_body_td a.nmdrTB_rowcontrol {" +
            " visibility: visible !important; opacity: 1 !important;" +
			"}" +

			pfx + " .nmdrTB_body_td_se {" +
			" width:" + pr.selcolumnWidth + "px;" +
			" min-width:" + pr.selcolumnWidth + "px;" +
			" max-width:" + pr.selcolumnWidth + "px;" +
			" text-align:center;" +
			"}" +
			pfx + " .nmdrTB_body_td_se_sel { background: " + pr.checkSelectionColor + "; }" +
			pfx + " .nmdrTB_body_se { visibility: hidden; }" +
			pfx + " .nmdrTB_body_se_sel { visibility: visible; }" +
			
			pfx + " .nmdrTB_body_td_cm {" +
			" width:" + pr.menucolumnWidth + "px;" +
			" min-width:" + pr.menucolumnWidth + "px;" +
			" max-width:" + pr.menucolumnWidth + "px;" +
			" text-align:center;" +
			"}" +
			pfx + " .nmdrTB_body_td_cm_sel { background: " + pr.menuCellBackground + "; }" +
			pfx + " .nmdrTB_body_cm { visibility: hidden; }" +
			pfx + " .nmdrTB_body_cm_sel { visibility: visible; }" +

			//=== footer
			
            pfx + " .nmdrTB_footer {}" +
            pfx + " .nmdrTB_footer_tr {}" +
            pfx + " .nmdrTB_footer_td { padding: 0px; }" +
            pfx + " .nmdrTB_footer_div {" +
			" width: 100%;" +
			" height: " + pr.footerHeight + "px;" +
            " color: " + pr.footerColor + ";" +
            " background: linear-gradient(#eee, " + pr.footerBackColor + ");" +
            " font-family: " + pr.footerFontFamily + ";" +
            " font-weight: " + pr.footerFontWidth + ";" +
            " font-size: " + pr.footerFontSize + ";" +
            " border-top-width: " + (pr.showBorder && !pr.showGrids ? pr.borderWidth : pr.scrollable ? "1px" : "0px") + ";" +
            " border-top-color: " + pr.borderColor + ";" +
            " border-top-style: solid;" +
            "}" +
			
			//=== rest
			
            pfx + " .nmdrTB_headerMenu {" +
			" display: none;" +
			" background-color: white;" +
			" border: 1px solid #bbb;" +
			" padding:10px;" +
            " line-height: 22px;" +
            " font-family: arial,verdana,sans-serif;" +
            " font-weight: normal;" +
            " font-size:12px;" +
            " z-index: 999;" +
            " box-shadow:5px 5px 5px #ddd;" +
			" transition:all 0.5s ease-in-out;" +
            "}" +
            pfx + " .nmdrTB_rowMenu {" +
			" display: none;" +
			" background-color: white;" +
			" border: 1px solid #bbb;" +
			" padding: 5px;" +
			" width: 200px;" +
            " line-height: 22px;" +
            " font-family: arial,verdana,sans-serif;" +
            " font-weight: normal;" +
            " font-size:12px;" +
            " z-index: 999;" +
            " box-shadow:5px 5px 5px #ddd;" +
			" transition:all 0.5s ease-in-out;" +
            "}" +
            pfx + " .nmdrTB_rowMenu img { vertical-align: middle; }" +
            pfx + " .nmdrTB_rowMenu_tr { height:28px; }" +
            pfx + " .rowMenuActRow, .nmdrTB_rowMenu_tr:hover {" +
            "  background: " + pr.bodyHOverBackColor + " !important;" +
            "  cursor: pointer;" +
            "}" +
            pfx + " .nmdrTB_loader {" +
            " position: absolute;" +
            " top: 0px;" +
            " left: 0px;" +
            " width: 100%;" +
            " height: 100%;" +
            " display: none;" +
            " cursor: wait;" +
            " z-index: 999;" +
            " background:#ffffff url(\"" + pr.imagePath + "spLoader.gif\") no-repeat center center;" +
            " opacity: 0.75;" +
            " filter: alpha(opacity=75);" +
            "}" +
			
			//=== Scrolling
			
			(pr.scrollable ?
				pfx + " .nmdrTB_header_tr { display: block; }" +
				pfx + " .nmdrTB_body { display: block; overflow-y: scroll; overflow-x:hidden; height: " + (this.offsetHeight - pr.headerHeight - pr.footerHeight) + "px; }" : 
				pfx + " .nmdrTB_content {" + (pr.scrollable2 ? "position:absolute; left:0px; top:0px; width:100%; height:100%; overflow-y:scroll;}" : "}") 		
			) +
			
            "</style>";

        buf.push(style);
        buf.push(script);
        buf.push(this.makeRowMenu());
        buf.push(this.makeHeaderMenu());
        buf.push(this.makeContent());
		
        document.getElementById(this.id).innerHTML = buf.join("");
		
		this.configSize();
        this.initKeyEvents();
    };
	
    $.makeContent = function () {
		var buf = [];
        buf.push("<div class='nmdrTB_loader'></div>");
		buf.push("<div class='nmdrTB_content' tabindex='1'>");
		buf.push(this.makeTable());
		buf.push("</div>");	
		return buf.join("");
	};
	
    $.makeTable = function () {
        var buf = [];
        buf.push("<table class='nmdrTB_table' border='0' cellpadding='0' cellspacing='0' onselectstart='return false' ondragstart='return false'>");
        buf.push(this.makeHeader());
        buf.push(this.makeBody());
        buf.push(this.makeFooter());
        buf.push("</table>");
        return buf.join("");
    };

    $.makeHeader = function () {
		
		if (!this.props.showHeader) return "";
		
        var ww = 0, buf = [];
		
        buf.push("<thead class='nmdrTB_header'>");
        buf.push("<tr class='nmdrTB_header_tr'>");
		
        for (var col = 0; col < this.columns.length; col++) {
			
			if (col == 0) {
				buf.push("<th class='nmdrTB_header_th nmdrTB_header_th_se'><img src='" + this.props.imagePath + "spCheck.png' ");
				buf.push("onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'selectAll');\"></th>");
				ww += this.props.selcolumnWidth;
			}
					
			if (col + 1 == this.props.menuColumn) {
				buf.push("<th class='nmdrTB_header_th nmdrTB_header_th_cm'><img src='" + this.props.imagePath + "spCMenu.gif'></th>");
				ww += this.props.menucolumnWidth;
			}                        

			var cw = this.getColumnWidth(col),
				s1 = this.props.sortingColumn == col ? "<img src='" + this.props.imagePath + "sp" + this.props.sortingDirection + ".png'" : "",
				s2 = this.props.filters[col] != null ? "<img src='" + this.props.imagePath + "spFilter.png'>" : "",
				ct = this.renderHeaderCell(col, this.columns[col]);

			buf.push("<th class='nmdrTB_header_th' id='" + this.id + "_nmdrTB_header_th" + col + "' ");
			buf.push(cw ? "style='width:" + cw + "px; min-width:" + cw + "px; max-width:" + cw + "px;'" : "");
			buf.push("onmouseOver=\"nmdr.core.$('" + this.id + "').selectHeader(" + col + ", true);\" ");
			buf.push("onmouseOut=\"nmdr.core.$('" + this.id + "').selectHeader(" + col + ", false);\" ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').selectColumn(event, " + col + ");\">");
			buf.push("<table width=100% border='0' cellpadding='0' cellspacing='0'><tr>");
			buf.push("<td style='padding:0px 0px 0px 0px;'><table border='0' cellpadding='0' cellspacing='0'><tr>");
			buf.push("<td style='padding:0px 0px 0px 0px;'><span class='nmdrTB_header_th_sp' onClick=\"nmdr.core.$('" + this.id + "').sortColumn(" + col + ");\">" + (ct ? ct : this.columns[col]) + "</span></td>");
			buf.push("<td style='width:20px; padding:0px 0px 0px 4px;'>" + s1 + "</td>");
			buf.push("<td style='width:16px; padding:0px 0px 0px 0px;'>" + s2 + "</td></tr></table></td>");
			buf.push("<td style='width:16px; padding:0px 4px 0px 0px; float:right;'>");
			buf.push("<img id='" + this.id + "_nmdrTB_hdm" + col + "' src='" + this.props.imagePath + "spMenu.png' ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').openHeaderMenu(event, this);\" style='visibility:hidden'></td>");
			buf.push("</tr></table></th>");
			
			ww += (cw ? cw : 0);
		}

        buf.push("</tr></thead>");
		
		//if (this.props.scrollable) this.style.width = ww + "px";  
		
        return buf.join("");
    };

    $.makeBody = function () {
        var buf = [];

        buf.push("<tbody class='nmdrTB_body'>");
		
        if (this.dataRows.length > 0) {

            var first = this.props.clientHandling ? this.firstRow : 1,
            	last = this.props.clientHandling ? this.lastRow : this.props.rowLimit > this.totalNumber ? this.totalNumber : this.props.rowLimit;

            for (var row = first; row <= last; row++) {
				
                var cols = this.dataRows[row - 1].split(this.props.dataSplitter),
					se = this.selectedRows.indexOf(row) != -1;

                buf.push("<tr class='nmdrTB_body_tr" + (se ? "_sel" : "") + "' id='" + this.id + "_nmdrTB_body_tr" + row + "' ");
				buf.push("onClick=\"nmdr.core.$('" + this.id + "').selectRows(event, " + row + ");\">");
						
                for (var col = 0; col < cols.length; col++) {
				
					if (col == 0) {
						buf.push("<td class='nmdrTB_body_td nmdrTB_body_td_se'>");
						buf.push("<img class='nmdrTB_body_se' src='" + this.props.imagePath + "spCheckSel.png'></td>");
					}
					
					if (col + 1 == this.props.menuColumn) {
						buf.push("<td class='nmdrTB_body_td nmdrTB_body_td_cm'>");
						buf.push("<img class='nmdrTB_body_cm' src='" + this.props.imagePath + "spCMenu.gif' ");
						buf.push("onClick=\"nmdr.core.$('" + this.id + "').openRowMenu(event, " + row + ");\"></td>");
					}
					
					var 
					cw = this.getColumnWidth(col),
					bc = this.renderBodyCell(row - 1, col, cols[col], se),
					ac = this.props.showRowCommands && col == cols.length - 1 ?
					"<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr>" +
					"<td style='vertical-align: middle;'>" + (bc ? bc : cols[col]) + "</td><td style='text-alignment: right;'><a class='nmdrTB_rowcontrol'>" +
					"<img src='" + this.props.imagePath + "spOpen.gif' title='open row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'openRow', " + row + ");\">&nbsp;" +
					"<img src='" + this.props.imagePath + "spEdit.gif' title='edit row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'editRow', " + row + ");\">&nbsp;" +
					"<img src='" + this.props.imagePath + "spDelete.gif' title='delete row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'deleteRow', " + row + ");\">&nbsp;" +	
					"</a></td></tr></table>" : null;

					if (this.props.scrollable && cw && col == cols.length - 1) cw -= 18;  // <=== attention important
					
					buf.push("<td class='nmdrTB_body_td'");
					buf.push(cw ? " style='width:" + cw + "px; min-width:" + cw + "px; max-width:" + cw + "px;'>" : ">");
					buf.push(ac ? ac : bc ? bc : cols[col] + "</td>");
                }
                buf.push("</tr>");
            };
        }
        buf.push("</tbody>");
        return buf.join("");
    };

    $.makeFooter = function () {
				
		if (!this.props.showFooter) return "";

        var buf = [], cs = this.columns.length + (this.props.menuColumn == -1 ? 1 : 2);
        buf.push("<tfoot class='nmdrTB_footer'>");
        buf.push("<tr class='nmdrTB_footer_tr'>");
		buf.push("<td class='nmdrTB_footer_td' colspan=" + cs + ">");
		buf.push("<div class='nmdrTB_footer_div'>" + this.renderFooter() + "</div>");
        buf.push("</td></tr></tfoot>");
		return buf.join("");
    };

    $.renderFooter = function () {
        var buf = [];
        buf.push("<table width='100%' height='100%' border='0' cellpadding='4px' cellspacing='0'><tr>");

        if (this.props.footerShowPager) {
            if (this.dataRows.length > 0) {
                var s1 = this.firstRow > 1 ?
					"<img src='" + this.props.imagePath + "spPrevend.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'firstPage');\"" :
					"<img src='" + this.props.imagePath + "spPrevenddis.gif'";
                var s2 = this.firstRow > 1 ?
					"<img src='" + this.props.imagePath + "spPrev.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'prevPage');\"" :
					"<img src='" + this.props.imagePath + "spPrevdis.gif'";
                var s3 = this.lastRow < this.totalNumber ?
					"<img src='" + this.props.imagePath + "spNext.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'nextPage');\"" :
					"<img src='" + this.props.imagePath + "spNextdis.gif'";
                var s4 = this.lastRow < this.totalNumber ?
					"<img src='" + this.props.imagePath + "spNextend.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'lastPage');\"" :
					"<img src='" + this.props.imagePath + "spNextenddis.gif'";

                buf.push("<td><table border='0' cellpadding='0' cellspacing='0'><tr>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s1 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s2 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + this.firstRow + "-" + this.lastRow + " / " + this.totalNumber + "</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s3 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s4 + "'</td>");
                buf.push("</tr></table>");
				
                buf.push("<td>");
				buf.push("<table border='0' cellpadding='0' cellspacing='0' style='margin-right:4px;margin-left:auto;'><tr><td></td>");

                if (this.props.footerShowPageInfo) {
                    buf.push("<td style='padding:2px 0px 0px 0px;'><span>" + this.props.pageLable + " <b>" +
						this.pageNumber + "</b> " + this.props.ofLable + " <b>" + this.pageCount + "</b> / " +
						this.props.totalLable + " <b>" + this.totalNumber + "</b></span></td>");
                }

                if (this.props.footerShowGoPage) {
                    buf.push("<td style='padding:2px 0px 0px 10px;'>" + this.props.gotoPageLable);
                    buf.push(" <select id='" + this.id + "_nmdrTB_goPageSelect' onchange=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'goToPage');\">");
                    buf.push("<option value=''></option>");
                    for (var i = 1; i <= this.pageCount; i++) buf.push("<option value='" + i + "'>" + i + "</option>");
                    buf.push("</select></td>");
                }

                if (this.props.footerShowRowCount) {
					buf.push("<td style='padding:2px 0px 0px 10px;'>" + this.props.rowCountLable);
                    buf.push(" <select id='" + this.id + "_nmdrTB_rowLimitSelect' onchange=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'setRowLimit');\">");
                    buf.push("<option value='10' " + (this.props.rowLimit === 10 ? "Selected" : "") + ">10</option>");
                    buf.push("<option value='25' " + (this.props.rowLimit === 25 ? "Selected" : "") + ">25</option>");
                    buf.push("<option value='50' " + (this.props.rowLimit === 50 ? "Selected" : "") + ">50</option>");
                    buf.push("<option value='100' " + (this.props.rowLimit === 100 ? "Selected" : "") + ">100</option>");
                    buf.push("<option value='150' " + (this.props.rowLimit === 150 ? "Selected" : "") + ">150</option>");
                    buf.push("<option value='200' " + (this.props.rowLimit === 200 ? "Selected" : "") + ">200</option>");
                    buf.push("</select></td>");
                }

                buf.push("</tr></table></td>");
            }
            else {
                buf.push("<td>This view contains no data.</td>");
            }
        }
        buf.push("</tr></table>");
        return buf.join("");
    };

    $.configSize = function () {
		var tb = this.getElementsByClassName("nmdrTB_table")[0];
		if (this.props.scrollable) this.style.width = (tb.offsetWidth + 2) + "px";
		else tb.style.width = "100%";
	};

    $.updateTable = function () {
		this.getElementsByClassName("nmdrTB_content")[0].innerHTML = this.makeTable();
		this.configSize();
    };

    $.loadData = function (calculate, firstCall) {

		var self = this;
		
        this.showLoader(true);
		        
        window.setTimeout(function () {

            var data = self.prepareData();
			
            self.columns = data.columns.slice(0);
			
			if (self.props.menuColumn !== -1) {
				self.props.menuColumn = Math.max(self.props.menuColumn, 1);
				self.props.menuColumn = Math.min(self.props.menuColumn, self.columns.length);
			}

            self.menuCommands = self.props.menuColumn !== -1 ? self.prepareMenuCommands() : [];
			self.props.rowLimit = Math.min(self.props.rowLimit, data.rows.length);

            if (self.props.clientHandling) {
                reference = self;
                self.originRows = data.rows.slice(0);
                self.dataRows = self.filterList();
                self.dataRows.sort(self.sortComparator);
            }
            else {
                self.dataRows = data.rows.slice(0);
            }

            if (calculate) {
                self.pageNumber = 1;
                self.totalNumber = self.dataRows.length;
                self.firstRow = 1;
                self.lastRow = self.props.rowLimit > self.totalNumber ? self.totalNumber : self.props.rowLimit;
                self.pageCount = Math.ceil(self.totalNumber / self.props.rowLimit);
            }

            if (firstCall) self.makeView(); else self.updateTable();

            self.showLoader(false);
        }, 10);
    };

    $.selectRows = function (event, row, all) {
		
		if (all && !this.props.multiSelection) return;
	
		this.deselect();
		
		if (all) {
			var sc = this.selectedRows.length;
			this.clickedRow = -1;
			this.selectedRows = [];
			if (sc != this.props.rowLimit) {
				for (var i = this.firstRow; i <= this.lastRow; i++) {
					this.selectedRows.push(i);
				}
			}
		}
		else {
			
			var ind = this.selectedRows.indexOf(row);

			if (this.props.multiSelection) {
				if (event && event.ctrlKey) {
					if (ind == -1) this.selectedRows.push(row);
					else { this.selectedRows.splice(ind, 1); row = -1; }
				}
				else if (event && event.shiftKey) {
					if (row < this.selectedRows[0]) {
						for (var i = row; i < this.selectedRows[0]; i++) this.selectedRows.push(i);
					}
					else if (row > this.selectedRows[this.selectedRows.length - 1]) {
						var n = this.selectedRows[this.selectedRows.length - 1];
						for (var i = row; i > n; i--) this.selectedRows.push(i);
					}
				}
				else if (ind == -1 || this.selectedRows.length > 1) {
					this.selectedRows = [];
					this.selectedRows[0] = row;
				}
				else {
					this.selectedRows = []; 
					row = -1;
				}

				this.selectedRows.sort(function (a, b) { return (a - b); });
			}
			else if (ind == -1) {
				this.selectedRows[0] = row;
			}
			else { 
				this.selectedRows = []; 
				row = -1; 
			}

			this.clickedRow = row;
		}
		
		this.select();
        this.selectionChanged();
    };

	$.select = function () {
		var self = this;
		this.selectedRows.forEach(function(item, index) {
		
			var 
			tr = document.getElementById(self.id + "_nmdrTB_body_tr" + item),
			ts = tr.getElementsByClassName("nmdrTB_body_td_se")[0],
			se = tr.getElementsByClassName("nmdrTB_body_se")[0],
			tm = tr.getElementsByClassName("nmdrTB_body_td_cm")[0],
			cm = tr.getElementsByClassName("nmdrTB_body_cm")[0];

			tr.classList.remove("nmdrTB_body_tr");
			tr.classList.add("nmdrTB_body_tr_sel");
			ts.classList.add("nmdrTB_body_td_se_sel");
			se.classList.add("nmdrTB_body_se_sel");
			if (tm) {
				tm.classList.add("nmdrTB_body_td_cm_sel");
				cm.classList.add("nmdrTB_body_cm_sel");
			}
		});
	};
		
	$.deselect = function () {
		var self = this;
		this.selectedRows.forEach(function(item, index) {
	
			var 
			tr = document.getElementById(self.id + "_nmdrTB_body_tr" + item),
			ts = tr.getElementsByClassName("nmdrTB_body_td_se")[0],
			se = tr.getElementsByClassName("nmdrTB_body_se")[0],
			tm = tr.getElementsByClassName("nmdrTB_body_td_cm")[0],
			cm = tr.getElementsByClassName("nmdrTB_body_cm")[0];

			tr.classList.remove("nmdrTB_body_tr_sel");
			tr.classList.add("nmdrTB_body_tr");
			ts.classList.remove("nmdrTB_body_td_se_sel");
			se.classList.remove("nmdrTB_body_se_sel");
			if (tm) {
				tm.classList.remove("nmdrTB_body_td_cm_sel");
				cm.classList.remove("nmdrTB_body_cm_sel");
			}
		});
	};
	
    $.clearSelection = function () {
        this.clickedRow = -1;
        this.selectedRows = [];
        this.selectionChanged();
    };

    $.selectionChanged = function () {
        var ids = this.getSelection();
        this.handleEvents(ids);
        this.handlePostBack(ids);
    };

    $.getSelection = function () {
        var ids = [];
        for (var i = 0; i < this.selectedRows.length; i++) {
            var rows = this.dataRows[this.selectedRows[i] - 1].split(this.props.dataSplitter);
            ids.push(rows[0]);
        }
        return ids;
    };
	
	$.selectColumn = function (event, col) {
		// @todo
	};
	
    $.nextPage = function () {
        this.clearSelection();
        this.pageNumber++;
        this.firstRow += this.props.rowLimit;
        this.lastRow += this.props.rowLimit;
        if (this.firstRow > this.totalNumber) this.firstRow = this.lastRow + 1;
        if (this.lastRow > this.totalNumber) this.lastRow = this.totalNumber;

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.prevPage = function () {
        this.pageNumber--;
        this.firstRow -= this.props.rowLimit;
        this.lastRow -= this.props.rowLimit;
        if (this.firstRow < 1) this.firstRow = 1;
        if (this.lastRow < this.firstRow + this.props.rowLimit) this.lastRow = this.firstRow + this.props.rowLimit - 1;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.firstPage = function () {
        this.pageNumber = 1;
        this.firstRow = 1;
        this.lastRow = this.props.rowLimit;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.lastPage = function () {
        var rest = this.totalNumber - ((this.pageCount - 1) * this.props.rowLimit);

        this.pageNumber = this.pageCount;
        this.firstRow = this.totalNumber - rest;
        this.lastRow = this.totalNumber;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.sortColumn = function (column) {
		if (this.props.sortingColumn != column) this.props.sortingDirection = null;
		
        this.props.sortingColumn = column;
        this.props.sortingDirection = this.props.sortingDirection == null ? this.SORT_DESCENDING : 
		this.props.sortingDirection == this.SORT_DESCENDING ? this.SORT_ASCENDING : this.SORT_DESCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.sortAZ = function () {
        this.props.sortingColumn = this.selectedColumn;
        this.props.sortingDirection = this.SORT_DESCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.sortZA = function () {
        this.props.sortingColumn = this.selectedColumn;
        this.props.sortingDirection = this.SORT_ASCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.removeSorting = function () {
        this.props.sortingColumn = -1;
        this.props.sortingDirection = null;
        this.clearSelection();
        this.doSort();
    };

    $.doSort = function () {
        if (!this.props.clientHandling) return this.loadData(false, false);
		
        this.showLoader(true);
		
        var self = this;
        window.setTimeout(function () { // just due showing loader
            if (self.props.sortingColumn === -1)
                self.dataRows = self.originRows.slice(0);
            else {
                reference = self;
                self.dataRows.sort(self.sortComparator);
            }
            self.showLoader(false);
            self.updateTable();

        }, 10);
    };

    $.sortComparator = function (a, b) {
        var self = reference;

        if (a == null && b == null) return 0;
        if (a != null && b == null) return self.props.sortingDirection == self.SORT_DESCENDING ? 1 : -1;
        if (a == null && b != null) return self.props.sortingDirection == self.SORT_DESCENDING ? -1 : 1;

        var aa = a.split(self.props.dataSplitter),
			bb = b.split(self.props.dataSplitter),
			s1 = aa[self.props.sortingColumn],
			s2 = bb[self.props.sortingColumn];
			
        return s1 == s2 ? 0 : s1 > s2 ? 
			(self.props.sortingDirection == self.SORT_DESCENDING ? 1 : -1) : 
			(self.props.sortingDirection == self.SORT_DESCENDING ? -1 : 1);
    };

    $.setFilter = function () {
        var filterCondition = document.getElementById(this.id + "_nmdrTB_filterSelect").value;
        var filterValue = document.getElementById(this.id + "_nmdrTB_filterText").value;
        if (filterValue.length > 0) {
            this.props.filters[this.selectedColumn] = filterCondition + this.props.filterSplitter + filterValue;
            this.clearSelection();
            this.doFilter();
        }
    };

    $.removeFilter = function () {
        delete this.props.filters[this.selectedColumn];
        this.clearSelection();
        this.doFilter();
    };

    $.doFilter = function () {
        if (!this.props.clientHandling) return this.loadData(true, false);

        this.showLoader(true);

        var self = this;
        window.setTimeout(function () { // just due showing loader
            self.dataRows = self.filterList();
            self.pageNumber = 1;
            self.totalNumber = self.dataRows.length;
            self.firstRow = self.dataRows.length > 0 ? 1 : 0;
            self.lastRow = self.props.rowLimit < self.totalNumber ? self.props.rowLimit : self.totalNumber;
            self.pageCount = Math.ceil(self.totalNumber / self.props.rowLimit);
            self.showLoader(false);
            self.updateTable();
        }, 10);
    };

    $.filterList = function () {
        var data = [];
        if (Object.keys(this.props.filters).length > 0) {
            for (var i in this.originRows) {
                var row = this.originRows[i], cols = row.split(this.props.dataSplitter), match = true;
                for (var c in cols) {
                    if (this.props.filters[c]) {
                        var value = cols[c], filter = this.props.filters[c].split(this.props.filterSplitter);
                        switch (filter[0]) {
                            case "isequal": match &= value === filter[1]; break;
                            case "isnotequal": match &= value !== filter[1]; break;
                            case "contains": match &= value.indexOf(filter[1]) !== -1; break;
							case "notcontains": match &= value.indexOf(filter[1]) == -1; break;
                            case "startswith": match &= value.indexOf(filter[1]) == 0; break;
                            case "endswith": match &= value.indexOf(filter[1], value.length - filter[1].length) !== -1; break;
                        }
                    }
                }
                if (match) data.push(row);
            }		
        }
		else data = this.originRows.slice(0);
		
		if (this.props.sortingColumn !== -1) {
            reference = this;
            data.sort(this.sortComparator);
		}
        return data;
    };

    $.setRowLimit = function () {
        var limit = document.getElementById(this.id + "_nmdrTB_rowLimitSelect").value;
        this.props.rowLimit = parseInt(limit);
        if (this.props.clientHandling) {
            this.pageNumber = 1;
            this.firstRow = this.dataRows.length > 0 ? 1 : 0;
            this.lastRow = this.props.rowLimit < this.totalNumber ? this.props.rowLimit : this.totalNumber;
            this.pageCount = Math.ceil(this.totalNumber / this.props.rowLimit);

            this.clearSelection();
            this.updateTable();
        }
        else this.loadData(true, false);
    };

    $.goToPage = function () {
        var page = document.getElementById(this.id + "_nmdrTB_goPageSelect").value;
        if (page.length) {
            this.pageNumber = parseInt(page);
            if (this.props.clientHandling) {
                this.firstRow = (this.pageNumber - 1) * this.props.rowLimit + 1;
                this.lastRow = this.firstRow + this.props.rowLimit - 1;
                if (this.lastRow > this.totalNumber) this.lastRow = this.totalNumber;

                this.clearSelection();
                this.updateTable();
            }
            else this.loadData(false, false);
        }
    };

    $.openHeaderMenu = function (event, src) {

        var self = this,
			id = src.id.substring(src.id.indexOf("_hdm") + 4),
			h = document.getElementById(this.id + "_nmdrTB_header_th" + id),
			m = this.getElementsByClassName('nmdrTB_headerMenu')[0],
			t = this.absPosition, 
			o = h.absPosition;
			
		nmdr.core.utils.stopPropagation(event);

        if (o.left + m.offsetWidth > t.left + this.offsetWidth)
            o.left = t.left + this.offsetWidth - m.offsetWidth;

        m.style.display = "inline-block";
        m.style.position = "absolute";
        m.style.left = o.left - t.left + "px";
        m.style.top = o.top - t.top + (this.props.headerHeight + 8) + "px";
			
        nmdr.core.popup.open(m, src,
			function() { nmdr.core.animate.fadeIn(null, m, null, true, function () { self.headerMenuOpen = true; }); },
			function (cb) { self.closeHeaderMenu(null, self, cb); }
		);
		
		//self.headerMenuOpen = true;  // @todo
		
        document.getElementById(this.id + "_nmdrTB_filterColumnName").text = this.columns[id];
        this.selectedColumnOld = this.selectedColumn;
        this.selectedColumn = parseInt(id);

        document.getElementById(this.id + "_nmdrTB_filterSelect").innerHTML = this.makeFilterPattern(false);
        document.getElementById(this.id + "_nmdrTB_filterText").value = this.makeFilterPattern(true);
        if (this.selectedColumnOld != -1) document.getElementById(this.id + "_nmdrTB_header_th" + this.selectedColumnOld).style.opacity = 1.0;
    };

    $.closeHeaderMenu = function (code, self, callback) {
        if (self == null) self = this;
        var m = self.getElementsByClassName("nmdrTB_headerMenu")[0];
        nmdr.core.animate.fadeOut(null, m, null, true, function () {
            m.style.display = "none";
            document.getElementById(self.id + "_nmdrTB_header_th" + self.selectedColumn).style.opacity = 1.0;

            self.headerMenuOpen = false;
            self.handleCommand(null, code);
            self.selectedColumn = -1;
			self.selectedColumnOld = -1;
			if (callback) callback();
        });
        nmdr.core.popup.close();
    };

    $.openRowMenu = function (event, row) {

        var self = this,
            s = document.getElementById(this.id + "_nmdrTB_body_tr" + row).getElementsByClassName("nmdrTB_body_cm")[0],
			m = this.getElementsByClassName("nmdrTB_rowMenu")[0],
			t = this.absPosition, 
			o = s.absPosition;

        if (o.left + m.offsetWidth > t.left + this.offsetWidth) o.left = this.offsetWidth - m.offsetWidth;

        m.style.display = "inline-block";
        m.style.position = "absolute";
        m.style.left = o.left - t.left + "px";
        m.style.top = o.top - t.top + 14 + "px";

        nmdr.core.popup.open(m, s, 
			function() { nmdr.core.animate.fadeIn(null, m, null, true, function () { self.rowMenuOpen = true; }); }, 
			function (cb) { self.closeRowMenu("clear", null, self, cb); }
		);
		
		if (this.clickedRow == row || (this.selectedRows.length > 1 && this.selectedRows.indexOf(row) != -1)) 
			nmdr.utils.stopPropagation(event);
    };

    $.closeRowMenu = function (code, cmd, self, callback) {
        if (self == null) self = this;
        var m = self.getElementsByClassName("nmdrTB_rowMenu")[0];
        nmdr.core.animate.fadeOut(null, m, null, true, 
			function () { 
				m.style.display = "none";
                self.updateRowMenuRow(false);
				self.rowMenuOpen = false;
                self.rowMenuActRow = -1;
				self.handleCommand(null, code);
				if (cmd) cmd();
				if (callback) callback();
			}
		);
        nmdr.core.popup.close();
    };
    
    $.updateRowMenuRow = function (sel) {
        if (this.rowMenuActRow != -1) {
            var tr = document.getElementById(this.id + "_nmdrTB_rowMenu_tr_" + this.rowMenuActRow);
            if (sel) tr.classList.add("rowMenuActRow"); else tr.classList.remove("rowMenuActRow");
        }
    };
    
    $.onRowMenuMouseOver = function(ev) {
        this.updateRowMenuRow(false);
        this.rowMenuActRow != -1        
    };

    $.selectHeader = function (hi, show) {
        var m = document.getElementById(this.id + "_nmdrTB_header_th" + hi);
		if (m == null) {
			var kk=0;
		}
        var n = document.getElementById(this.id + "_nmdrTB_hdm" + hi);
        m.style.opacity = hi == this.selectedColumn ? 0.5 : 1.0;
        if (n) n.style.visibility = show ? "visible" : "hidden";
    };

    $.initKeyEvents = function () {
        var self = this;
        document.addEventListener("keydown", function(ev) { 
		
			if (!nmdr.core.utils.isActiveElement(self)) return;
			
            // down arrow
            if (ev.keyCode == 40) {
                if (self.rowMenuOpen) {
                    if (self.rowMenuActRow != -1) {
                        self.updateRowMenuRow(false);
                        if (self.rowMenuActRow == 3) self.rowMenuActRow = 0; else self.rowMenuActRow++;
                    } else self.rowMenuActRow = 0;                    
                    self.updateRowMenuRow(true);
                }
                else {
                    var row = self.selectedRows.length == 0 ? 0 : self.selectedRows[0];
					
					if (self.props.scrollable) {
						var el = self.getElementsByClassName("nmdrTB_body")[0];
						if (row < self.lastRow) {
							el.scrollTop += (self.props.bodyRowHeight + 7);
							self.selectRows(null, row + 1);
						}
					}
					else {
						self.selectRows(null, row == self.lastRow ? self.firstRow : row + 1);
					}
                }
				
                nmdr.core.utils.stopPropagation(ev);
            }
            // up arrow
            else if (ev.keyCode == 38) {
                if (self.rowMenuOpen) {
                    if (self.rowMenuActRow != -1) {
                        self.updateRowMenuRow(false);
                        if (self.rowMenuActRow == 0) self.rowMenuActRow = 3; else self.rowMenuActRow--;
                    } else self.rowMenuActRow = 0;
                    self.updateRowMenuRow(true);
                }
                else {
                    var row = self.selectedRows.length == 0 ? 0 : self.selectedRows[0];    
					if (self.props.scrollable) {
						var el = self.getElementsByClassName("nmdrTB_body")[0];
						if (row > self.firstRow) {
							el.scrollTop -= (self.props.bodyRowHeight + 7);
							self.selectRows(null, row - 1);
						}
					}
					else {
						self.selectRows(null, row == self.firstRow ? self.lastRow : row - 1);
					}
                }
				
                nmdr.core.utils.stopPropagation(ev);
            }
			// pic up arrow
            else if (ev.keyCode == 33) {
				nmdr.core.utils.stopPropagation(ev);
			}
			// pic down arrow
            else if (ev.keyCode == 34) {
				nmdr.core.utils.stopPropagation(ev);
			}			
            // enter key
            else if (ev.keyCode == 13) {
                if (self.rowMenuOpen) {
                    self.executeMenuCommand(self.rowMenuActRow);
                }
                else {
                    if (self.props.menuColumn != -1) self.openRowMenu(ev, self.selectedRows[0]);
                }
                nmdr.core.utils.stopPropagation(ev);
            }
        });
    };

    $.showLoader = function (show) {
        var loader = this.getElementsByClassName("nmdrTB_loader")[0];
        if (loader) {
            loader.style.display = show ? "inline" : "none";
            loader.style.cursor = show ? "wait" : "default";
        }
    };

    $.handleCommand = function (event, name, row) {

        if (this.headerMenuOpen) { this.closeHeaderMenu(name); return; }
        if (this.rowMenuOpen) { this.closeRowMenu(name); return; }

		if (event) nmdr.core.utils.stopPropagation(event);
		if (row) this.selectRows(event, row);

        switch (name) {
            case "selectAll": this.selectRows(null, null, true); break;
            case "nextPage": this.nextPage(); break;
            case "prevPage": this.prevPage(); break;
            case "firstPage": this.firstPage(); break;
            case "lastPage": this.lastPage(); break;
            case "sortAZ": this.sortAZ(); break;
            case "sortZA": this.sortZA(); break;
            case "removeSorting": this.removeSorting(); break;
            case "setFilter": this.setFilter(); break;
            case "removeFilter": this.removeFilter(); break;
            case "setRowLimit": this.setRowLimit(); break;
            case "goToPage": this.goToPage(); break;
            case "openRow": this.openRow(row); break;
            case "editRow": this.editRow(row); break;
            case "deleteRow": this.deleteRow(row); break;
            case "clear": break;
        }
    };

    $.executeMenuCommand = function (num) {
        this.closeRowMenu("clear", this.menuCommands[num].action);
    }

    $.handlePostBack = function (sels) {
        if (this.props.doPostBack) {
        }
    };

    $.makeFilterPattern = function (onlyValue) {
        if (onlyValue) {
            if (this.props.filters[this.selectedColumn]) return this.props.filters[this.selectedColumn].split(this.props.filterSplitter)[1];
            return "";
        }

        var opt = "", fc = this.props.filters[this.selectedColumn] ? this.props.filters[this.selectedColumn].split(this.props.filterSplitter)[0] : "";
        for (var i in this.props.patternNames) {
            var p = this.props.patternNames[i].split("/");
            switch (p[0]) {
                case "is equal": opt += "<option value='isequal' " + (fc == "isequal" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "is not equal": opt += "<option value='isnotequal' " + (fc == "isnotequal" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "contains": opt += "<option value='contains' " + (fc == "contains" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "not contains": opt += "<option value='notcontains' " + (fc == "notcontains" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "starts with": opt += "<option value='startswith' " + (fc == "startswith" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "ends with": opt += "<option value='endswith' " + (fc == "endswith" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
            }
        }
        return opt;
    };

    $.makeRowMenu = function () {

        if (this.props.menuColumn === -1) return "";

        var buf = [];
        buf.push("<div class='nmdrTB_rowMenu' id='" + this.id + "_nmdrTB_rowMenu'>");
        buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");

        for (var i = 0; i < this.menuCommands.length; i++) {
            var com = this.menuCommands[i];
            buf.push("<tr class='nmdrTB_rowMenu_tr' id='" + this.id + "_nmdrTB_rowMenu_tr_" + i + "' ");
            buf.push("onclick=\"nmdr.core.$('" + this.id + "').executeMenuCommand(" + i + ");\" ");
            buf.push("onmouseover=\"nmdr.core.$('" + this.id + "').onRowMenuMouseOver(event);\">");
            buf.push("<td style='width:24px'><img src='" + this.props.imagePath + com.icon + "'></td>");
            buf.push("<td><span>" + com.name + "</span></td>");
            buf.push("</tr>");
        }
        buf.push("</table></div>");
        return buf.join("");
    };

    $.makeHeaderMenu = function () {
        var buf = [];
        buf.push("<div class='nmdrTB_headerMenu'>");
        buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");
        buf.push("<tr>");
        buf.push("<td>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spDoSortAZ.gif' style='border-style:none;'/></a>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'sortAZ');\" style='text-decoration:none;'>A-Z</a>");
        buf.push("</td>");
        buf.push("<td>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event);\">");
        buf.push("<img src='" + this.props.imagePath + "spClosePopup.gif' style='border-style:none; vertical-align:middle;float:right;'/>");
        buf.push("</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spDoSortZA.gif' style='border-style:none;'/></a>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'sortZA');\" style='text-decoration:none;'>Z-A</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2' style='border-bottom:dotted; border-bottom-width:1px;'></td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spFilterdel.gif' style='border-style:none;'/></a>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'removeFilter');\" style='text-decoration:none;'>" + this.props.removeFilterLable + "&nbsp;&nbsp;</a>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spSortdel.gif' style='border-style:none;'/></a>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'removeSorting');\" style='text-decoration:none;'>" + this.props.removeSortingLable + "</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<table>");
        buf.push("<tr>");
        buf.push("<td>");
        buf.push("<span id='" + this.id + "_nmdrTB_filterColumnName'>Column</span>");
        buf.push("</td>");
        buf.push("<td>");
        buf.push("<select id='" + this.id + "_nmdrTB_filterSelect'>" + this.makeFilterPattern(false) + "</select>");
        buf.push("</td>");
        buf.push("<td>");
        buf.push("<input id='" + this.id + "_nmdrTB_filterText' type='text' name='columnfilter' size='10' value='" + this.makeFilterPattern(true) + "'/>");
        buf.push("</td>");
        buf.push("<td>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'setFilter');\">");
        buf.push("<img src='" + this.props.imagePath + "spFilterset.gif' style='border-style:none; vertical-align:middle;'/>");
        buf.push("</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("</table>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("</table>");
        buf.push("</div>");

        return buf.join("");
    };

    $.prepareMenuCommands = function () {
		return [
            { name: "open item", icon: "details.gif", action: function () { alert("open item"); } },
            { name: "edit item", icon: "editdetails.gif", action: function () { alert("edit item"); } },
            { name: "delete item", icon: "delete.gif", action: function () { alert("delete item"); } },
            { name: "rename item", icon: "edititem.gif", action: function () { alert("rename item"); } },
        ];
	};
	
    $.prepareData = function () {
		var columns = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            s = this.props.dataSplitter, 
			cols = [], 
			rows = [];
			
        for (var r = 0; r < this.props.dummyRows; r++) {
			var ro = "";
			for (var c = 0; c < this.props.dummyCols; c++) {
				if (c < columns.length) {
					if (r == 0) cols.push(columns[c]);
					ro += (columns[c] + r);
					if (c < this.props.dummyCols-1) ro += s;
				}
			}
			rows.push(ro);
        }

		return { columns: cols, rows: rows };
    };

	/*
    $.prepareData = function () {
		var rowdata = [], s = this.props.dataSplitter;
		for (var i = 0; i < 10000; i++) {
			rowdata[i] = "Name " + i + s + "Adress " + i + s + "Email " + i + s + "Phone " + i;
		}

		var data =
		{
			columns: ["Name", "Adress", "Email", "Phone"],
			rows: rowdata
		};
		return data;
    };
	*/
    return $;
}

//@FN:#nmdrTree
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
#  nmdrTree
#
#  Version: 1.00.00
#  Date: Februar 28. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTree(id) {

	var $ = nmdr.core.$(id, "nmdrTree");
	if ($ == null) return;

    //=== Local variables, which refer to this object instance

    $.props = {
        imagePath:"img/",
        
        doPostBack: false,
        multiSelection: false,
        showRowCommands: true,

        //=== Styles

        lineHeight:"18px",
        color:"#000000",
        backColor:"#ffffff",
        rowSelectionColor:"rgba(156, 206, 240, 0.5)",
        rowHOverColor:"rgba(205,230,247,0.5)",
        rowAlternateColor:"rgba(242,246,252,0.5)",
        checkSelectionColor:"rgb(0,113,198)",
        showBorder:true,
        showShadow:true,
        borderColor:"rgb(207,208,210)",
        borderWidth:"1px",
        fontStyle:"Arial, Helvetica, sans-serif",
        fontWidth:"normal",
        fontSize:"13px",
        headerColor:"#000000",
        headerBackColor:"rgb(248, 248, 248)",
        headerFontStyle:"Arial, Helvetica, sans-serif",
        headerFontWidth:"bold",
        headerFontSize:"13px",
    };

    $.columns = [];
    $.widths = [];
    $.treeviewData = [];
    $.selections = [];
    $.clickedRow = -1;
    $.firstRow = 0;
    $.lastRow = 0;

    //=== Methods 

    $.init = function (props) {
		
 		props = props || {};
		
		if (!props.data) { alert("[nmdrTree]\n\nParameter 'data' does not exist."); return; }
        this.props = nmdr.core.utils.mergeProperties(this.props, props);
        this.updateData(this.props.data);
    };
    
    //=== virtual methods

    $.headerCellTemplate = function (col, value) { return null; };
    $.itemCellTemplate = function (row, col, value, selected) { return null; };
    $.columnWidthTemplate = function (col) { return null; };
    $.handleEvents = function (selections) { };
    $.openItem = function (row) { alert("open row: " + row); };
    $.editItem = function (row) { alert("edit row: " + row); };
    $.deleteItem = function (row) { alert("delete row: " + row); };

    //===

    $.makeViewer = function () {

        var pfx = "#" + this.id;
        var script = "<script type='text/javascript'></script>";

        var style = "<style type='text/css'>" +
 			pfx + " { position:relative !important; }" +
            pfx + " .nmdrTR_content {" +
            "  line-height: " + this.props.lineHeight + ";" +
            "  color:" + this.props.color + ";" +
            "  background:" + this.props.backColor + ";" +
            "  font-family: " + this.props.fontStyle + ";" +
            "  font-weight: " + this.props.fontWidth + ";" +
            "  font-size: " + this.props.fontSize + ";" +
            "  border-width:" + (this.props.showBorder ? this.props.borderWidth : "0px") + ";" +
            "  border-color:" + this.props.borderColor + ";" +
            "  border-style: solid;" +
            "  cursor: default;" +
            "  -webkit-user-select: none;" +
            "  -moz-user-select: none;" +
            "  -ms-user-select: none;" +
            "   user-select: none;" + (this.props.showShadow ? "box-shadow:3px 3px 3px #ccc;" : "") +
            "}" +
            pfx + " .nmdrTR_table td {" +
            "   padding-top: 2px;" +
            "   padding-bottom: 2px;" +
            "   padding-right: 2px;" +
            "   padding-left: 2px;" +
            "}" +
            pfx + " .nmdrTR_header {" +
            "  background: lightgray;" +
            "  line-height: " + (this.props.lineHeight + 8) + ";" +
            "}" +
            pfx + " .nmdrTR_header_th {" +
            "  color: " + this.props.headerColor + ";" +
            "  background: " + this.props.headerBackColor + ";" +
            "  font-family: " + this.props.headerFontStyle + ";" +
            "  font-weight: " + this.headerFontWidth + ";" +
            "  font-size: " + this.props.headerFontSize + ";" +
            "  border-bottom-width:" + (this.props.showBorder ? this.props.borderWidth : "0px") + ";" +
            "  border-bottom-color:" + this.props.borderColor + ";" +
            "  border-bottom-style: solid;" +
			"  padding: 2px;" +
            "  text-align: left;}" +
			
            pfx + " .nmdrTR_header_th span, img {vertical-align: middle;}" +
            pfx + " .nmdrTR_tr:hover {background: " + this.props.rowHOverColor + " !important;}" +
            pfx + " .nmdrTR_tr:hover td:first-child {background: " + this.props.rowHOverColor + " !important;}" +
            pfx + " .nmdrTR_tr:hover td:first-child span:first-of-type {display:inline !important;}" +
            pfx + " .nmdrTR_tr:hover td a.nmdrTR_rowcontrol {display: inline !important; opacity: 0.3 !important;}" +
            pfx + " .nmdrTR_tr_sel:hover td a.nmdrTR_rowcontrol {display: inline !important; opacity: 1 !important;}" +
			pfx + " .nmdrTR_td_folarw:hover, a.nmdrTR_rowcontrol:hover {cursor:pointer;}" +
            "</style>";

        var buf = [];
        buf.push(style);
        buf.push(script);
        buf.push("<div id='" + this.id + "nmdrTR_root' width:100%;height:100%;overflow:hidden;clear:both;'>");
        buf.push("<div id='" + this.id + "nmdrTR_content' class='nmdrTR_content' style='overflow:hidden;'>");
        buf.push(this.makeTable());
        buf.push("</div>");
        buf.push("</div>");

        this.innerHTML = buf.join("");
        this.initEvents();
    };

    $.makeTable = function () {
        var buf = [];
		var st = this.widths.length > 0 ? " style='table-layout: fixed;'" : "";
        buf.push("<table class='nmdrTR_table' width='100%' border='0' cellpadding='0' cellspacing='0' " +
			"onselectstart='return false' ondragstart='return false'" + st + ">");
        buf.push(this.makeHeader());
        buf.push(this.makeBody(true));
        buf.push("</table>");
        return buf.join("");
    };

    $.makeHeader = function () {
        var buf = [];
        buf.push("<thead class='nmdrTR_header'><tr class='nmdrTR_header_tr'>");
        buf.push("<th class='nmdrTR_header_th' style='width:20px;text-align:center;'>");
        buf.push("<img src='" + this.props.imagePath + "spCheck.png' onClick=\"nmdr.core.$('" + this.id + "').selectAll();\"></th>");

        for (var col = 0; col < this.columns.length; col++) {
			var cw = this.widths[col];
			var w = cw && !cw.endsWith("%") ? "style='width:" + cw + "'" : "";
            buf.push("<th class='nmdrTR_header_th'" + w + "> <span>" + this.columns[col] + "</span></th>");
        };
        buf.push("</tr></thead>");
        return buf.join("");
    };

    $.makeBody = function () {

        var self = this;

        var makeNode = function (buf, row, data, deep) {
            var pr = self.props,
                al = row % 2 === 0,
                cl = row === self.clickedRow,
                se = self.selections.indexOf(row) !== -1,
                bc = se ? pr.rowSelectionColor : al ? pr.rowAlternateColor : pr.backColor,
                cc = se ? pr.checkSelectionColor : al ? pr.rowAlternateColor : pr.backColor;

            buf.push("<tr class='nmdrTR_tr" + (cl ? "_sel" : "") + "' id='nmdrTR_tr#" + row + "' " +
					"onClick=\"nmdr.core.$('" + self.id + "').selectRow(event, " + row + ");\" style='background:" + bc + " '>");

            buf.push("<td style='width:20px; text-align:center; background:" + cc + "'>");
            buf.push("<span style='display:" + (se ? "inline" : "none") + "'>");
            buf.push("<img src='" + pr.imagePath + "spCheck" + (se ? "Sel" : "") + ".png'></span></td>");

            var dat = data.data;
			if (data.sub) {
                buf.push("<td class='nmdrTR_tr_td' colspan=" + (self.columns.length) + " style='text-align:left; background:" + bc + "'>"  + dat[0] + "</td></tr>");
			}
			else {
				for (var l = 0; l < dat.length; l++) {
					if (l == 0) {
						buf.push("<td class='nmdrTR_td' style='text-align:right;'>");
						buf.push("<table border='0' cellpadding='0' cellspacing='0'><tr>");

						for (var i = 0; i < data.dep; i++)
							buf.push("<td style='width:14px;'></td>");

						buf.push("<td style='width:14px;vertical-align:middle'" + 
							(data.fol ? " class='nmdrTR_td_folarw' onClick=\"nmdr.core.$('" +	self.id + "').expandNode('" + data.id + "');\">"+
							"<img src='" + pr.imagePath + (data.exp ? "spArrowd" : "spArrowl") + ".gif'>" : ">") + "</td>");

						buf.push("<td style='width:14px;vertical-align:top'><img src='" + pr.imagePath + 
							(data.fol ? "spFolder" : "spFile") + ".gif'></td>");

						buf.push("<td>" + dat[l] + "</td></tr></table></td>");
					}
					else {
						var ac = pr.showRowCommands && l == dat.length - 1 ?
							"<a class='nmdrTR_rowcontrol' id='" + self.id + "_nmdrTR_rowcontrol_" + row + "' style='display:none;float:right;'>" +
							"<img src='" + pr.imagePath + "spOpen.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'open'," + row + ");\">&nbsp;" +
							"<img src='" + pr.imagePath + "spEdit.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'edit'," + row + ");\">&nbsp;" +
							"<img src='" + pr.imagePath + "spDelete.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'delete'," + row + ");\">&nbsp;" +
							"</a>" : "";

						var x = l == dat.length - 1 ? 'style=\"width:150px;\"' : "";
						buf.push("<td class='nmdrTR_td " + x + "'>" + dat[l] + ac + "</td>");
					}
				}
				buf.push("</tr>");
            }

            row++;

            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    row = makeNode(buf, row, data.childs[i], deep + 1);
                }
            }

            return row;
        };

        var buf = [];
        buf.push("<tbody class='nmdrTR_body'>");
               
        if (this.treeviewData.length > 0) {

            var row = 0;
            for (var i = 0; i < this.treeviewData.length; i++) {
                row = makeNode(buf, row, this.treeviewData[i], 0);
            }
        }
        
        this.firstRow = 0;
        this.lastRow = row-1;
        
        buf.push("</tbody>");
        return buf.join("");
    };

    $.updateTable = function () {
        document.getElementById(this.id + "nmdrTR_content").innerHTML = this.makeTable();
    };

    $.expandNode = function (id, exp) {
        var self = this;

        var expand = function (id, data) {
            if (data.id === id) {
                if (exp == null) {
                    data.exp = !data.exp;
                    return true;
                }
                else {
                    if (exp && !data.exp) { data.exp = true;  return true; }
                    if (!exp && data.exp) { data.exp = false; return true; }
                }
                return false;
            }
            
            for (var n = 0; n < data.childs.length; n++) {
                if (expand(id, data.childs[n])) {
                    return true;
                }
            }
            return false;
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            if (expand(id, this.treeviewData[i])) {
                this.clearSelection();
                document.getElementById(this.id + "nmdrTR_content").innerHTML = this.makeTable();
                break;
            }
        }
    };

    $.findNodeId = function (index) {
        var ind = 0;
        var findNode = function (data) {
            if (ind === index) return data.id;
            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    ind++;
                    var id = findNode(data.childs[i]);
                    if (id !== null) return id;
                }
            }
            return null;
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            var id = findNode(this.treeviewData[i]);
            if (id !== null) return id;
            ind++;
        }
        return null;
    };

    $.getAllVisibleNodes = function () {
        var ind = 0;
        var exps = [];

        var getVisible = function (data) {
            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    exps.push(ind++);
                    getVisible(data.childs[i]);
                }
            }
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            exps.push(ind++);
            getVisible(this.treeviewData[i]);
        }
        return exps;
    };

    $.selectRow = function (event, row) {
        var ind = this.selections.indexOf(row);

        if (this.props.multiSelection) {
            if (event && event.ctrlKey) {
                if (ind === -1) this.selections.push(row);
                else { this.selections.splice(ind, 1); row = -1; }
            }
            else if (event && event.shiftKey) {
                if (row < this.selections[0]) {
                    for (var i = row; i < this.selections[0]; i++) this.selections.push(i);
                }
                else if (row > this.selections[this.selections.length - 1]) {
                    var n = this.selections[this.selections.length - 1];
                    for (var i = row; i > n; i--) this.selections.push(i);
                }
            }
            else if (ind === -1 || this.selections.length > 1) {
                this.selections = [];
                this.selections[0] = row;
            }
            else {
                this.selections = []; row = -1;
            }

            this.selections.sort(function (a, b) { return (a - b); });
        }
        else if (ind === -1) this.selections[0] = row;
        else { this.selections = []; row = -1; }

        this.clickedRow = row;
        
        this.updateTable();
        this.selectionChanged();
    };

    $.selectNext = function () {
        if (this.selections.length === 1) {
            this.selections[0] = this.selections[0] == this.lastRow ? this.firstRow : this.selections[0] + 1;
            this.clickedRow = this.selections[0];
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.selectPrev = function () {
        if (this.selections.length === 1) {
            this.selections[0] = this.selections[0] == this.firstRow ? this.lastRow : this.selections[0] - 1;
            this.clickedRow = this.selections[0];
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.selectAll = function () {
        if (this.multiSelection) {
            var sels = this.getAllVisibleNodes();
            this.clickedRow = -1;
            this.selections = this.selections.length === sels.length ? [] : sels;
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.clearSelection = function () {
        this.clickedRow = -1;
        this.selections = [];
        this.selectionChanged();
    };

    $.selectionChanged = function () {
        var ids = [];
        for (var i = 0; i < this.selections.length; i++) {
            ids.push(this.findNodeId(this.selections[i]));
        }
        this.handleEvents(ids);
        this.handlePostBack(ids);
    };
	
    $.action = function (ev, code, row) {
		this.selectRow(ev, row);
		switch(code) {
			case "open" : this.openItem(row); break;
			case "edit" : this.editItem(row); break;
			case "delete" : this.deleteItem(row); break;
		}
	};
	
    $.updateData = function (data) {
        this.columns = data.cols;
        this.widths = data.widths ? data.widths : [];
		var dat = data.data;

        var updateNodes = function (da, node, deep) {
            for (var i = 0; i < da.length; i++) {
                if (da[i].pid == node.id) {
                    var cn = {};
                    cn.id = da[i].id;
                    cn.pid = da[i].pid;
                    cn.fol = da[i].folder;
                    cn.sub = da[i].sub ? da[i].sub : false;
                    cn.exp = false;
                    cn.dep = deep;
                    cn.data = da[i].data;
                    cn.childs = [];
                    node.childs.push(cn);
                    updateNodes(da, cn, deep + 1);
                }
            }
        };

        for (var i = 0; i < dat.length; i++) {
            if (dat[i].pid == null) {
                var node = {};
                node.id = dat[i].id;
                node.pid = dat[i].pid;
                node.fol = dat[i].folder;
                node.sub = dat[i].sub ? dat[i].sub : false;
				node.exp = false;
                node.dep = 0;
                node.data = dat[i].data;
                node.childs = [];
                updateNodes(dat, node, 1);

                this.treeviewData.push(node);
            }
        }

        this.makeViewer();
    };

    $.initEvents = function () {
        var self = this;
        document.addEventListener("keydown", function(evt) { 
            switch(evt.keyCode) {
                // left arrow @todo
                case 10037: 
                    var sr = self.selections[0];
                    self.expandNode(self.treeviewData[self.selections[0]]["id"], false);
                    self.selectRow(null, sr);
                    evt.preventDefault();
                    break;
                // up arrow
                case 38: 
                    self.selectPrev();
                    evt.preventDefault();
                    break;
                
                // right arrow @todo
                case 10039:  
                    var sr = self.selections[0];
                    self.expandNode(self.treeviewData[self.selections[0]]["id"], true);
                    self.selectRow(null, sr);
                    evt.preventDefault();
                    break;
                    
                // down arrow
                case 40:
                    self.selectNext();
                    evt.preventDefault();
                break;
            }
        });
    };
    
    $.handlePostBack = function (sels) {
        if (this.props.doPostBack) {
            alert(sels);
        }
    };

    return $;
}

//@FN:#nmdrTile
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
#  nmdrTile
#
#  Version: 1.00.00
#  Date: June 01. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrTile(id) {

	var $ = nmdr.core.$(id, "nmdrTile");
	if ($ == null) return;

	$.tile = null;
	
    $.init = function (tile) {
		
		this.tile = tile ? tile : this.getDemoTile();
		
		var buf = [];
		
		buf.push("<style type='text/css'>" +
			".nmdrTIpic {" +
			"position:absolute; width:" + this.tile.width + "px; height:" + this.tile.height + "px; " +
			"vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; overflow:hidden; " +
			"background-color:" + (this.tile.bgcolor != null ? this.tile.bgcolor : "#ddd") + "; background-image:url(" + this.tile.image + "); " + 
			"background-size:cover; background-repeat:no-repeat; cursor:pointer; } " +

			".nmdrTIovr {" +
			"position:absolute; width:100%; height:100%; bottom:0; left:0; right:0; top:" + (this.tile.height - this.tile.titleHeight) + "px; " +
			"padding:5px; pointer-events:none; color:#fff; background:rgba(0,0,0,0.3); transition:0.5s; " + 
			(this.tile.font ? this.tile.font : "font-family:arial, verdana, sans-serif; font-size:1em;") + "} " +
			
			".nmdrTIpic:hover .nmdrTIovr:first-child { transition:0.5s; top:0; } " +

			"</style>");
		
		var link = tile.target.toLowerCase() == "script" ? tile.url : "nmdr.core.$('" + this.id + "').startLink()";		
		
        buf.push("<div class='nmdrTIpic' onclick=\"" + link + "\">");
        buf.push("<div class='nmdrTIovr' onclick=\"" + link + "\">");
        buf.push("<h3>" + this.tile.title + "</h3><span class='nmdrTItxt'>" + this.tile.desc + "</span>");
        buf.push("</div></div>");

        this.innerHTML = buf.join("");
    };

    $.startLink = function () {
        if (this.tile.url !== "") {
            switch (this.tile.target.toLowerCase()) {
                case "script":
                    alert(this.tile.url);
                    break;
                case "dialog":
                    alert(this.tile.url);
                    break;
                case "new window":
                    window.open(this.tile.url);
                    break;
                case "current window":
                    location.href = this.tile.url;
                default:;
            }
        }
    };
	
	$.getDemoTile = function () {
		return {
			title: "Name", 
			desc: "Description",
			image: "img/tiles/tile1.png", 
			width: 200,
			height: 200,
			titleHeight: 50,
			bgcolor: "purple", 
			target: "Script", 
			url: "alert('Hello World from XTilesView!');", 
		}
	};

    return $;
}

/*
#####################################################################
#
#  nmdrTiles
#
#  Version: 1.00.00
#  Date: October 23. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTiles(id) {

	var $ = nmdr.core.$(id, "nmdrTiles");
	if ($ == null) return;

    $.slideStep = 8;
	$.tiles = null;
	$.titleFont = null;
	$.descFont = null;
	$.half = false;
    $.slides = {};
	
    $.init = function (tiles, titleFont, descFont, half) {
		$.tiles = tiles ? tiles : this.createTestTiles();
		$.titleFont = titleFont;
		$.descFont = descFont;
		$.half = half;		
        $.build();
    };

    $.build = function () {

		var tf = this.titleFont == null || this.titleFont == "" ? "font-family:arial, verdana, sans-serif; font-size:1em;" : this.titleFont,
			df = this.descFont == null || this.descFont == "" ? "font-family:arial, verdana, sans-serif; font-size:0.8em;" : this.descFont,       
			pfx = "#" + this.id;
	   
        this.innerHTML = "<style type='text/css'>" +
			pfx + " .nmdrTI_title {vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; " + tf + "}" +
			pfx + " .nmdrTI_description{vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; " + df + "}" +
			"</style>";

        for (var i = 0; i < this.tiles.length; i++) {
            var til, xlink, width, height, indexRaw, rIndex, cIndex, buf = [];

            til = this.tiles[i];
            til.title = til.title !== null ? til.title : "";		
            til.descr = til.descr !== null ? til.descr : "";
			til.url = til.url !== null ? til.url : ""; 
			
            if (til.size.split("x").length > 1) {
                width = parseInt(til.size.split("x")[0]);
                height = parseInt(til.size.split("x")[1]);
            } else {
                width = height = parseInt(til.size.split("x")[0]);
            }

            xlink = til.target.toLowerCase() == "script" ? til.url : "nmdr.core.$('" + this.id + "').startLink(" + i + ")";
			
            indexRaw = til.index !== null ? til.index : "00-00";
            if (indexRaw.split("-").length > 1) {
                rIndex = indexRaw.split("-")[0];
                cIndex = indexRaw.split("-")[1];
            } else {
                rIndex = "01";
                cIndex = indexRaw;
            }

            var hx = 2 * height / (this.half ? 4 : 3);

            buf.push("<div style='float:left;clear:both;width:" + (width + 4) + "px;height:" + (height + 4) + "px;cursor:pointer;'>");
            buf.push("<div style='overflow:hidden;position:relative;width:" + width + "px;height:" + height + "px;");
            buf.push("background-color:" + (til.bgcolor ? til.bgcolor : "rgb(0,114,198)") + ";'>");

			var dbid = this.id + "_nmdrTI_" + rIndex + "_" + cIndex;
			
            buf.push("<div id='" + dbid + "_ev' style='width:" + width + "px;height:" + height + "px;overflow:hidden;display:inline-block;position:relative;' " +
				"onclick=\"" + xlink + "\" " +
				"onmouseover=\"nmdr.core.$('" + this.id + "').slideUp('" + dbid + "');\" " +
				"onmouseout=\"nmdr.core.$('" + this.id + "').slideDown('" + dbid + "'," + hx + ");\">" +
				(til.image ? "<img style='left: 0px; top: 0px; position: absolute;' onerror=\"nmdr.core.$('" + this.id + "').imgError(this);\" alt='" + til.title + "' src='" + til.image + "'/>" : "") + "</div>");

            buf.push("<div id='" + dbid + "' " +
				"onclick=\"" + xlink + "\" " +
				"onmouseover=\"nmdr.core.$('" + this.id + "').slideUp('" + dbid + "');\" " +
				"onmouseout=\"nmdr.core.$('" + this.id + "').slideDown('" + dbid + "'," + hx + ");\" " +
				"style='position:absolute;color:#fff;background-color:rgba(0,0,0,0.6);left:0px;top:" + hx + "px;width:" + width + "px;height:" + height + "px;pointer-events:none;'>");

            buf.push("<table border=0, cellpadding=0, cellspacing=0, width=100% height=100%>");
            buf.push("<tr><td class='nmdrTI_title' style='height:" + (height / 3) + "px;'>" + til.title + "</td></tr>");
            buf.push("<tr><td class='nmdrTI_description'>" + til.descr + "</td></tr></table>");

            buf.push("</div>");
            buf.push("</div>");
            buf.push("</div>");

            var id1 = this.id + "_nmdrTI_row_" + rIndex;
            var id2 = id1 + "_col_" + cIndex;
            var d1 = "", d2 = "";

            if (document.getElementById(id1) == null) {
                this.innerHTML += "<div id='" + id1 + "' style='float:left;clear:both;'>";
                d1 = "</div>";
            }

            if (document.getElementById(id2) == null) {
                document.getElementById(id1).innerHTML += "<div id='" + id2 + "' style='float:left;'>";
                d2 = "</div>";
            }
            document.getElementById(id2).innerHTML += buf.join("") + d2 + d1;
			
			// touch interface
			
			var dv1 = document.getElementById(dbid + "_ev");
			var dv2 = document.getElementById(dbid);
			
			var touchstart = function(e) {
				var touch = e.changedTouches[0];
				var div = document.elementFromPoint(touch.clientX, touch.clientY);
				if (div == dv1) dv1.addClass("hover");
				else if (div == dv2) dv2.addClass("hover");
				else { dv1.removeClass("hover"); dv2.removeClass("hover"); }
				e.preventDefault();
			};
			
			var touchmove = function(e) {};
			var touchend = function(e) {};
			
			dv1.addEventListener("touchstart", touchstart, false);
			dv2.addEventListener("touchstart", touchstart, false);
        }
    };

    $.slideUp = function (id) {
		var ti = document.getElementById(id);
		if (!ti.tileAnim && this.slides[id] != "up") {
            this.slides[id] = "up";
            this.slid(ti, 0, "up");
        }
    };

    $.slideDown = function (id, n) {
		var self = this, ti = document.getElementById(id);
		if (ti.tileAnim) { 
			setTimeout(function() {self.slideDown(id,n);}, 1000); 
			return; 
		}

		if (!ti.tileAnim && this.slides[id] != "down") {
            this.slides[id] = "down";
            this.slid(ti, n, "down");
        }
    };

    $.slid = function (elem, newTop, dir) {	
        var self = this;
		var doSlide = function() {
			var top = elem.offsetTop;

			if (top == newTop || (dir == "up" && self.slides[elem.id] != "up")) { 
				self.slides[elem.id] = ""; 
				elem.tileAnim = false;
				cancelAnimationFrame(elem.animId);
				return; 
			}

			if (top < newTop) {
				top += self.slideStep;
				if (top > newTop) top = newTop;
			}
			else if (top > newTop) {
				top -= self.slideStep;
				if (top < newTop) top = newTop;
			}

			elem.style.top = top + "px";
			elem.animId = requestAnimationFrame(doSlide);
		};
		elem.tileAnim = true; 
		doSlide();
    };

    $.imgError = function (elem) {
        elem.innerHTML = "<span style='color:#ffffff'>Error: The image specified was not found</span>";
    };

    $.startLink = function (n) {		
        if (this.tiles[n].url !== "") {
            switch (this.tiles[n].target.toLowerCase()) {
                case "dialog":
                    this.openInDlg(this.tiles[n].url);
                    break;
                case "new window":
                    window.open(this.tiles[n].url);
                    break;
                case "current window":
                    location.href = this.tiles[n].url;
                default:;
            }
        }
    };

    $.openInDlg = function (url) {
        alert(url);
    };

    $.createTestTiles = function () {
        var tiles = [
            { title: "Tile1", descr: "Hello tile 1", target: "Dialog", image: "img/tiles/tile1.png", bgcolor: "red", size: "150", url: "http://www.google.de", index: "00-00" },
            { title: "Tile2", descr: "Hello tile 2", target: "New Window", image: "img/tiles/tile2.png", bgcolor: "#FF6EBE", size: "150", url: "http://www.bing.de", index: "00-01" },
            { title: "Tile3", descr: "Hello tile 3", target: "Current Window", image: "img/tiles/tile3.png", bgcolor: "green", size: "150", url: "http://www.nalizadeh.com", index: "00-02" },
            { title: "Tile4", descr: "", target: "Script", image: "img/tiles/tile4.png", bgcolor: "purple", size: "150", url: "alert('Hello World from XTilesView!');", index: "01-00" },
            { title: "Tile5", descr: null, target: "Script", image: "img/tiles/tile5.png", bgcolor: "purple", size: "150", url: "alert('Hello World from XTilesView!');", index: "01-01" },
            { title: "Tile6", descr: null, target: "Script", image: "img/tiles/tile6.png", bgcolor: "purple", size: "150", url: "alert('Hello World from XTilesView!');", index: "01-02" },
        ];

        return tiles;
    };

    return $;
}

/*
#####################################################################
#
#  nmdrSlideTile
#
#  Version: 1.00.00
#  Date: October 23. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrSlideTile(id) {

	var $ = nmdr.core.$(id, "nmdrSlideTile");
	if ($ == null) return;

    $.slideWidth = 0;
    $.slideHeightt = 0;
    $.imagePath = "";
    $.currentTile = 0;
    $.animation = false;
    $.tiles = [];

    $.init = function (tiles, width, height, imagePath) {
        this.tiles = tiles ? tiles : this.createTestTiles();
        this.slideWidth = width;
        this.slideHeight = height;
        this.imagePath = imagePath ? imagePath : "";
        this.build();
        nmdr.core.animate.setData(10, 10);
    };

    $.build = function () {

        var styletxt =
		"<style type='text/css'>" +
		".nmdrST_title {height:30px;vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; font-family:arial, verdana, sans-serif; font-size:15px;}" +
		".nmdrST_text {vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; font-family:arial, verdana, sans-serif; font-size:13px; }" +
		"</style>";

        var buf = [], left = 0;

        buf.push("<div class='nmdrST_root' id='" + this.id + "_nmdrST_root' style='background-color:#000;overflow:hidden;position:relative;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;cursor:pointer;'>");
        buf.push("<div class='nmdrST_content' id='" + this.id + "_nmdrST_content' style='position:absolute;left:0px;top:0px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;'>");

        for (var i in this.tiles) {
            var til = this.tiles[i], title, descr, url, image;

            title = til.title !== null ? til.title : "";
            descr = til.description !== null ? til.description : "";
            image = this.imagePath + (til.image !== null ? til.image : "blank.gif");
            url = til.url;

            buf.push(
                "<div class='nmdrST_box' id='" + this.id + "_nmdrST_box" + i + "' " +
				    "onclick=\"nmdr.core.$('" + this.id + "').startLink('" + url + "');\" " +
				    "style='position:absolute;left:" + left + "px;top:0px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;pointer-events:auto;" +
				    "vertical-align:bottom;text-align:right;background-image: url(\"" + image + "\");'>" +
                "</div>" +

                "<div class='nmdrST_sbox' id='" + this.id + "_nmdrST_sbox" + i + "' " +
				    "style='position:absolute;left:" + left + "px;top:" + (this.slideHeight - 30) + "px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;" +
				    "vertical-align:top;text-align:left;color:#fff;background-color:rgba(0,0,0,0.4);pointer-events:auto;'>" +

                    "<table border=0 cellpadding=0 cellspacing=0 width=100% height=100%>" +
                        "<tr><td class='nmdrST_title'>" + title + "</td></tr>" +
                        "<tr><td class='nmdrST_text'>" + descr + "</td></tr>" +
                    "</table>" +

                    "<div class='nmdrST_slidButtons' id='" + this.id + "_nmdrST_slidButtons" + i + "' style='position:absolute;top:4px;left:" + (this.slideWidth - 100) + "px;display:inline'>" +
                        "<div class='nmdrST_slideTile' style='display:inline;padding:2px;'>" +
                            "<img src='" + this.imagePath + "slideUp.png' " +
                            "onmouseover=\"this.src='" + this.imagePath + "slideUpH.png'\" " +
                            "onmouseout=\"this.src='" + this.imagePath + "slideUp.png'\" " +
                            "onclick=\"nmdr.core.$('" + this.id + "').slide(event, this, '" + this.id + "_nmdrST_slidButtons" + i + "','" + this.id + "_nmdrST_sbox" + i + "', 'up')\"/>" +
                        "</div>" +
                        "<div class='nmdrST_prevTile' style='display:inline;padding:2px;'>" +
                            "<img src='" + this.imagePath + "slideLeft.png' " +
                            "onmouseover=\"this.src='" + this.imagePath + "slideLeftH.png'\" " +
                            "onmouseout=\"this.src='" + this.imagePath + "slideLeft.png'\" " +
                            "onclick=\"nmdr.core.$('" + this.id + "').showPrev(event)\"/>" +
                        "</div>" +
                        "<div class='nmdrST_nextTile' style='display:inline;padding:2px;'>" +
                            "<img src='" + this.imagePath + "slideRight.png' " +
                            "onmouseover=\"this.src='" + this.imagePath + "slideRightH.png'\" " +
                            "onmouseout=\"this.src='" + this.imagePath + "slideRight.png'\" " +
                            "onclick=\"nmdr.core.$('" + this.id + "').showNext(event)\"/>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            );

            left += this.slideWidth;
        }
        buf.push("</div>");
        buf.push("</div>");

        this.innerHTML = styletxt + buf.join("");
    };

    $.showPrev = function (e) {
        nmdr.core.utils.stopPropagation(e);
        if (this.currentTile > 0 && !this.animation) {
            this.animation = true;
            var st = nmdr.core.animate.stepH / this.slideWidth;
			
			nmdr.core.animate.fadeOut(this.id + "_nmdrST_box" + this.currentTile, null, st);
			nmdr.core.animate.fadeIn(this.id + "_nmdrST_box" + (this.currentTile-1), null, st);
			
            nmdr.core.animate.scroll(this.id + "_nmdrST_content", null, this.slideWidth, 0,
				function (arg) {
				    arg.currentTile--;
				    arg.animation = false;
				},
			this);
        }
    };

    $.showNext = function (e) {
        nmdr.core.utils.stopPropagation(e);
        if (this.currentTile < this.tiles.length - 1 && !this.animation) {
            this.animation = true;
            var st = nmdr.core.animate.stepH / this.slideWidth;
            nmdr.core.animate.fadeOut(this.id + "_nmdrST_box" + this.currentTile, null, st);
            nmdr.core.animate.fadeIn(this.id + "_nmdrST_box" + (this.currentTile + 1), null, st);
            nmdr.core.animate.scroll(this.id + "_nmdrST_content", null, -this.slideWidth, 0,
				function (arg) {
				    arg.currentTile++;
				    arg.animation = false;
				},
			this);
        }
    };

    $.slide = function (e, target, id1, id2, dir) {
        nmdr.core.utils.stopPropagation(e);
        if (!this.animation) {
            this.animation = true;
            var self = this;

            nmdr.core.animate.move(null, document.getElementById(id2), null, dir == "up" ? Math.floor(this.slideHeight / 2) : this.slideHeight - 30,
				function (args) {
				    document.getElementById(id1).style.top = (dir == "up" ? Math.floor(self.slideHeight / 2) - 26 : 4) + "px";

				    // chnage slid button
				    if (dir == "up") {
				        target.src = self.imagePath + "slideDown.png";
				        target.onclick = function (e) { self.slide(e, target, id1, id2, "down"); }
				        target.onmouseover = function (e) { target.src = self.imagePath + "slideDownH.png"; };
				        target.onmouseout = function (e) { target.src = self.imagePath + "slideDown.png"; };
				    }
				    else {
				        target.src = self.imagePath + "slideUp.png";
				        target.onclick = function (e) { self.slide(e, target, id1, id2, "up"); }
				        target.onmouseover = function (e) { target.src = self.imagePath + "slideUpH.png"; };
				        target.onmouseout = function (e) { target.src = self.imagePath + "slideUp.png"; };
				    }
				    self.animation = false;
				},
				null
			);
        }
    };

    $.imgError = function (elem) {
        elem.innerHTML = "<span style='color:#ffffff'>Error: The image specified was not found</span>";
    };

    $.startLink = function (url) {
        alert(url);
    };

    $.createTestTiles = function () {
        var slides = [
            { title: "Tile1", description: "description 1", image: "", url: "http://www.nalizadeh.com" },
            { title: "Tile2", description: "description 2", image: "", url: "http://www.bing.de" },
            { title: "Tile3", description: "description 3", image: "", url: "http://www.google.de" }
        ];

        return slides;
    };

    return $;
}

//@FN:#nmdrAlbum
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
#  nmdrAlbum
#
#  Version: 1.00.00
#  Date: December 18. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrAlbum(id) {

	var $ = nmdr.core.$(id, "nmdrAlbum");
	if ($ == null) return;

    $.albumWidth = 0;
    $.albumHeight = 0;

    $.slideWidth = 0;
    $.slideHeight = 0;

    $.thumbsCount = 0;
    $.thumbWidth = 0;
    $.thumbHeight = 0;
    $.tviewWidth = 0;
	
    $.imagePath = "";
    $.animation = false;
	$.imageOpened = false;
    $.paddingH = 2;
    $.paddingV = 2;
    $.firstThumb = 0;
    $.currentTile = 0;
    $.currentThumb = 0;
	
    $.albums = [];  // ==> {title: "", description: "", image: "", url: "", thumbsPath: "", imagePath: "",	thumbs: ["t1.jpg","t2.jpg","t3.jpg",...]}

    $.init = function (albums, width, height, imagePath, thumbWidth, thumbHeight, thumbsCount) {

        this.albums = albums ? albums : this.createTestAlbum();

        this.albumWidth = width;
        this.albumHeight = height;
        this.imagePath = imagePath ? imagePath : "";

        this.thumbWidth = thumbWidth;
        this.thumbHeight = thumbHeight;
        this.thumbsCount = thumbsCount;
        this.tviewWidth = thumbWidth + 10;
        this.slideWidth = thumbsCount * this.tviewWidth + (thumbsCount + 3) * this.paddingH;
        this.slideHeight = thumbHeight + 36;

        this.build();

        nmdr.core.animate.setData(10, 10);
		nmdr.core.utils.updateOnLoadResize(this, function(self) { self.build(); });
    };

    $.build = function () {

		if (this.imageOpened) this.showImage(false);
	
        var buf = [], left = 0;

        var styletxt =
			"<style type='text/css'>" +
			".nmdrAL_title {vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; font-family:arial, verdana, sans-serif; font-size:15px;height:26px;}" +
			".nmdrAL_text {vertical-align:top; text-align:left; padding:5px 0px 0px 5px; color:#fff; font-family:arial, verdana, sans-serif; font-size:13px;}" +
			".nmdrAL_thumbs {vertical-align:top;text-align:center;}" +
			"</style>";

        buf.push("<div class='nmdrAL_root' id='" + this.id + "_nmdrAL_root' style='background-color:#000;overflow:hidden;position:relative;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;cursor:pointer;'>");
        buf.push("<div class='nmdrAL_content' id='" + this.id + "_nmdrAL_content' style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;'>");

        for (var i in this.albums) {
            var til = this.albums[i],
            title = til.title !== null ? til.title : "",
            descr = til.description !== null ? til.description : "",
            url = til.url;

            buf.push("<div class='nmdrAL_box' id='" + this.id + "_nmdrAL_box" + i + "' " +
				"onclick=\"nmdr.core.$('" + this.id + "').startLink('" + url + "');\" " +
				"style='position:absolute;left:" + left + "px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;pointer-events:auto;" +
				"vertical-align:bottom;text-align:right;background-image: url(\"" + this.imagePath + til.image + "\");'></div>");

            buf.push("<div class='nmdrAL_sbox' id='" + this.id + "_nmdrAL_sbox" + i + "' " +
				"style='position:absolute;left:" + left + "px;top:" + (this.albumHeight - 30) + "px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"vertical-align:top;text-align:left;color:#fff;background-color:rgba(0,0,0,0.4);pointer-events:auto;'>");

            buf.push("<table border=0, cellpadding=0, cellspacing=0, width=100% height=100%>");
            buf.push("<tr><td class='nmdrAL_title'>" + title + "</td></tr>");
            buf.push("<tr><td class='nmdrAL_text'>" + descr + "</td></tr>");
            buf.push("<tr><td class='nmdrAL_thumbs' id='" + this.id + "_nmdrAL_sbox" + i + "_thumbs' height='40%'></td></tr>");
            buf.push("</table>");

            buf.push(
                "<div class='nmdrAL_slidButtons' id='" + this.id + "_nmdrAL_slidButtons" + i + "' style='position:absolute;top:4px;left:" + (this.slideWidth - 60) + "px;display:inline'>" +
                    "<div class='nmdrAL_slideTile' style='display:inline;padding:2px;'>" +
                        "<img src='" + this.imagePath + "slideUp.png' " +
                        "onmouseover=\"this.src='" + this.imagePath + "slideUpH.png'\" " +
                        "onmouseout=\"this.src='" + this.imagePath + "slideUp.png'\" " +
                        "onclick=\"nmdr.core.$('" + this.id + "').slide(event, this, '" + this.id + "_nmdrAL_slidButtons" + i + "','" + this.id + "_nmdrAL_sbox" + i + "', 'up')\"/>" +
                    "</div>" +
                    "<div class='nmdrAL_prevTile' style='display:inline;padding:2px;'>" +
                        "<img src='" + this.imagePath + "slideLeft.png' " +
                        "onmouseover=\"this.src='" + this.imagePath + "slideLeftH.png'\" " +
                        "onmouseout=\"this.src='" + this.imagePath + "slideLeft.png'\" " +
                        "onclick=\"nmdr.core.$('" + this.id + "').showPrev(event)\"/>" +
                    "</div>" +
                    "<div class='nmdrAL_nextTile' style='display:inline;padding:2px;'>" +
                        "<img src='" + this.imagePath + "slideRight.png' " +
                        "onmouseover=\"this.src='" + this.imagePath + "slideRightH.png'\" " +
                        "onmouseout=\"this.src='" + this.imagePath + "slideRight.png'\" " +
                        "onclick=\"nmdr.core.$('" + this.id + "').showNext(event)\"/>" +
                    "</div>" +
                "</div>");

            buf.push("</div>");

            left += this.albumWidth;
        }
        buf.push("</div>");
        buf.push("</div>");

        this.innerHTML = styletxt + buf.join("");

        //=== create thumbnails
		
        var showDiv = document.createElement("div");
        showDiv.innerHTML =
			"<div id='" + this.id + "_nmdrAL_divOverlay' style='display:none;position:absolute;z-index:10;top:0px;left:0px;width:1px;height:1px;background-color:white;background-color:rgba(0,0,0,0.6);vertical-align:middle;text-align:center;'></div>" +
			"<div id='" + this.id + "_nmdrAL_divFrame' style='position:absolute;z-index:12;display:none;border:5px solid;border-color:#fff;vertical-align:middle;text-align:center;background-color:#fff;'>" +
			"<table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%'><tr>" +
			"<td colspan=2>" +
			"<img id='" + this.id + "_nmdrAL_showdivImage' src='" + this.imagePath + "loading.gif' style='cursor:pointer;' " +
			"onmousemove=\"nmdr.core.$('" + this.id + "').showNaviButtons(event, true);\" " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').showNaviButtons(event, true);\" " +
			"onmouseout=\"nmdr.core.$('" + this.id + "').showNaviButtons(event, false);\" " +
			"onclick=\"nmdr.core.$('" + this.id + "').changeImage(event);\">" +
			"<img id='" + this.id + "_nmdrAL_showdivPrev' src='" + this.imagePath + "prevlabel.gif' style='display:none;position:absolute;top:0px;left:0px;opacity:0.5;'>" +
			"<img id='" + this.id + "_nmdrAL_showdivNext' src='" + this.imagePath + "nextlabel.gif' style='display:none;position:absolute;top:0px;left:0px;opacity:0.5;'>" +
			"</td></tr>" +
			"<tr><td style='height:40px; text-align:left;font-family:arial,Helvetica,sans-serif;font-size:11px;font-style:normal;font-weight:normal;'>" +
			"<span id='" + this.id + "_nmdrAL_showdivSpan'></span></td>" +
			"<td style='width:80px;cursor:pointer;' onclick=\"nmdr.core.$('" + this.id + "').showImage(false)\"><img id='" + this.id + "_nmdrAL_showdivClose' src='" + this.imagePath + "closelabel.gif'></td></tr>" +
			"</table></div>";

        this.parentNode.insertBefore(showDiv, this.nextSibling);
    };

    $.showPrev = function (e) {
        nmdr.core.utils.stopPropagation(e);
        if (this.currentTile > 0 && !this.animation) {
            this.animation = true;
            var st = nmdr.core.animate.stepH / this.slideWidth;
            nmdr.core.animate.fadeOut(this.id + "_nmdrAL_box" + this.currentTile, null, st);
            nmdr.core.animate.fadeIn(this.id + "_nmdrAL_box" + (this.currentTile - 1), null, st);
            nmdr.core.animate.scroll(this.id + "_nmdrAL_content", null, this.albumWidth, 0,
				function (arg) {
				    arg.currentTile--;
				    arg.animation = false;
				},
			this);
        }
    };

    $.showNext = function (e) {
        nmdr.core.utils.stopPropagation(e);
        if (this.currentTile < this.albums.length - 1 && !this.animation) {
            this.animation = true;
            var st = nmdr.core.animate.stepH / this.slideWidth;
            nmdr.core.animate.fadeOut(this.id + "_nmdrAL_box" + this.currentTile, null, st);
            nmdr.core.animate.fadeIn(this.id + "_nmdrAL_box" + (this.currentTile + 1), null, st);
            nmdr.core.animate.scroll(this.id + "_nmdrAL_content", null, -this.albumWidth, 0,
				function (arg) {
				    arg.currentTile++;
				    arg.animation = false;
				},
			this);
        }
    };

    $.slide = function (e, target, id1, id2, dir) {
        nmdr.core.utils.stopPropagation(e);
        if (!this.animation) {
            this.animation = true;

            var self = this;
            var elem = document.getElementById(id2 + "_thumbs");
            elem.innerHTML = dir == "up" ? "<img src='" + this.imagePath + "loading.gif'>" : "";
            nmdr.core.animate.move(null, document.getElementById(id2), null, dir == "up" ? 0 : this.albumHeight - 30,
				function (arg) {
				    elem.innerHTML = dir == "up" ? self.createThumbnails(self.albums[self.currentTile], self.currentTile) : "";
				    arg.animation = false;
				},
			this);

            document.getElementById(id1).style.top = (dir == "up" ? this.albumHeight - 26 : 4) + "px";

            // chnage slid button
            if (dir == "up") {
                target.src = this.imagePath + "slideDown.png";
                target.onclick = function (e) { self.slide(e, target, id1, id2, "down"); }
                target.onmouseover = function (e) { target.src = self.imagePath + "slideDownH.png"; };
                target.onmouseout = function (e) { target.src = self.imagePath + "slideDown.png"; };
            }
            else {
                target.src = this.imagePath + "slideUp.png";
                target.onclick = function (e) { self.slide(e, target, id1, id2, "up"); }
                target.onmouseover = function (e) { target.src = self.imagePath + "slideUpH.png"; };
                target.onmouseout = function (e) { target.src = self.imagePath + "slideUp.png"; };
            }
        }
    };

    $.createThumbnails = function (tile, num) {

        if (tile.thumbs == null || tile.thumbs.length == 0) return "";

        var style =
			"<style type=\"text/css\">" +
			"a { text-decoration:none; outline:0; color:#000; }" +
			".nmdrAL_thumbArea {overflow:hidden;overflow-x:scroll;position:absolute; padding:0px;}" +
			"#" + this.id + "_nmdrAL_thumArea {left:" + this.paddingH + "px; top:" + this.paddingV + "px; width:" + (this.slideWidth - 2 * this.paddingH) + "px; " +
				"height:" + (this.slideHeight - 2 * this.paddingV) + "px;}" +

			".nmdrAL_thumbView {position:absolute; left:0px; top:0px;background-color:#000;}" +
			".nmdrAL_thumbItem: {vertical-align:top;height:" + this.slideHeight + "px;background-color:#000;}" +
			".nmdrAL_thumbItem:hover {cursor:pointer;border:1px;border-style:solid;border-color:#000;}" +
			".nmdrAL_thumbImg {-moz-box-shadow: 5px 5px 5px #ddd; -webkit-box-shadow: 5px 5px 5px #ddd; box-shadow: 5px 5px 5px #ddd; opacity:0.7;}" +
			".nmdrAL_thumbImg:hover {opacity:1;}" +
			"</style>";

        var buf = [], le = 0;

        for (var i = this.firstThumb; i < tile.thumbs.length; i++) {
            buf.push(
				"<div class='nmdrAL_thumbItem' id='" + this.id + "_thumb" + i + "' " +
				"style='display:inline; position:absolute; left:" + le + "px; top:0px; width:" + this.tviewWidth + "px; height:" + (this.slideHeight - 2 * this.paddingV) + "px;'>" +
				"<img class='nmdrAL_thumbImg' id='" + this.id + "_img" + i + "' src='" + tile.thumbsPath + tile.thumbs[i] + "' width='" +
				this.thumbWidth + "' height='" + this.thumbHeight + "' onclick=\"nmdr.core.$('" + this.id + "').showImage(true, this," + num + "," + i + ")\"></div>");

            le += this.tviewWidth + this.paddingH;
        }

        return style +
			"<div class='nmdrAL_slidesShow' id='" + this.id + "_nmdrAL_slidesShow' style='position:absolute;left:" + ((this.albumWidth - this.slideWidth) / 2) +
			"px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;background:#000;border:1px;border-style:solid;border-color:lightgray;'>" +
			"<div class='nmdrAL_thumbArea' id='" + this.id + "_nmdrAL_thumArea'>" +
			"<div class='nmdrAL_thumbView' id='" + this.id + "_nmdrAL_thumbView'>" + buf.join("") + "</div></div>";
    };

    $.showImage = function (show, target, tilex, thumbx) {

        if (this.animation) return;

        var overlay = document.getElementById(this.id + "_nmdrAL_divOverlay"),
			frame = document.getElementById(this.id + "_nmdrAL_divFrame"),
			image = document.getElementById(this.id + "_nmdrAL_showdivImage"),
			span = document.getElementById(this.id + "_nmdrAL_showdivSpan"),
			prev = document.getElementById(this.id + "_nmdrAL_showdivPrev"),
			next = document.getElementById(this.id + "_nmdrAL_showdivNext"),
			self = this;

        next.style.display = "none";
        prev.style.display = "none";
        span.innerHTML = "";

        if (show) {

            nmdr.core.popup.open(frame, target, null, function (callback) { 
				self.showImage(false); 
				if (callback) callback(); 
			});

            this.currentTile = tilex;
            this.currentThumb = thumbx;

            frame.style.opacity = 0.5;
            image.src = this.imagePath + "loading.gif";

            var r = nmdr.core.utils.calculateWindowSize(), xy = nmdr.core.utils.calculateScroll();

            overlay.style.width = r.width + xy.left - 18 + "px";
            overlay.style.height = r.height + xy.top + "px";
            overlay.style.display = "inline";

            frame.style.top = Math.floor((window.innerHeight - 200) / 2 + xy.top) + "px";
            frame.style.left = Math.floor((window.innerWidth - 200) / 2 + xy.left) + "px";
            frame.style.height = "200px";
            frame.style.width = "200px";
            frame.style.display = "inline";

            var img = new Image();

            img.onload = function () {
                image.src = this.src;
                frame.style.opacity = 1.0;
                frame.style.top = Math.floor((window.innerHeight - this.height - 40) / 2 + xy[1]) + "px";
                frame.style.left = Math.floor((window.innerWidth - this.width) / 2 + xy[0]) + "px";
                frame.style.height = this.height + 40 + "px";
                frame.style.width = this.width + "px";
                self.animation = true;
                nmdr.core.animate.fadeIn(null, frame, null, false, function () {
                    span.innerHTML = "<b>" + self.albums[self.currentTile].title + "</b><br>Image " + (self.currentThumb + 1) + " of " + self.albums[self.currentTile].thumbs.length;
                    self.animation = false;
					self.imageOpened = true;
                });
            };

            img.src = this.albums[self.currentTile].imagePath + this.albums[this.currentTile].thumbs[this.currentThumb];
        }
        else {
            this.animation = true;
            nmdr.core.animate.fadeOut(null, frame, null, false, function () {
                image.src = self.imagePath + "loading.gif";
                frame.style.top = "0px";
                frame.style.left = "0px";
                frame.style.height = "1px";
                frame.style.width = "1px";
                frame.style.display = "none";
                overlay.style.display = "none";
                self.animation = false;
				self.imageOpened = false;
            });
			
            nmdr.core.popup.close();
        }
    };

    $.showNaviButtons = function (event, show) {
        var frame = document.getElementById(this.id + "_nmdrAL_divFrame"),
			prev = document.getElementById(this.id + "_nmdrAL_showdivPrev"),
			next = document.getElementById(this.id + "_nmdrAL_showdivNext");

        prev.style.display = "none";
        next.style.display = "none";

        if (show) {
            if (event.clientX < frame.offsetLeft + frame.offsetWidth / 2) {
                if (this.currentThumb > 0) {
                    prev.style.display = "inline";
                    prev.style.top = (frame.offsetHeight / 2 - 20) + "px";
                    prev.style.left = "0px";
                }
            }
            else if (this.currentThumb < this.albums[this.currentTile].thumbs.length - 1) {
                next.style.display = "inline";
                next.style.top = (frame.offsetHeight / 2 - 20) + "px";
                next.style.left = event.target.offsetWidth - 64 + "px";
            }
        }
        nmdr.core.utils.stopPropagation(event);
    };

    $.changeImage = function (event) {
        if (!this.animation) {
            var frame = document.getElementById(this.id + "_nmdrAL_divFrame"), x = event.clientX,
			xx = x < frame.offsetLeft + frame.offsetWidth / 2 ? this.currentThumb > 0 ? -1 : 0 : this.currentThumb < this.albums[this.currentTile].thumbs.length - 1 ? 1 : 0;
            if (xx != 0) this.showImage(true, event, this.currentTile, this.currentThumb + xx);
        }
    };

    $.startLink = function (url) {
        alert(url);
    };

    $.createTestAlbum = function () {
        var albums = [
        {
            title: "Animals",
            description: "These are some pics of animals.",
            image: "album/animals.jpg",
            url: "http://www.nalizadeh.com",
            thumbsPath: "img/album/animals/thumbs/",
            imagePath: "img/album/animals/",
            thumbs: ["animal1.jpg"]
        },
        ];

        return albums;
    };

    return $;
}

//@FN:#nmdrPixShow
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
#  nmdrPixShow
#
#  Version: 1.00.00
#  Date: September 24. 2016
#  Status: Release
#
#####################################################################
*/

function nmdrPixShow(id) {
	
	var $ = nmdr.core.$(id, "nmdrPixShow");
	if ($ == null) return;

    $.imagePath = "img/pixshow/";	
	$.background = "#000";

	$.paddingH = 2;
    $.paddingV = 2;

	$.descboxWidth = 280;
	$.descboxHeight = 340;
	
	$.slices = 10;
	$.boxes = 6;
    
    $.autoplayDelay = 4000;
	$.autoplayKenBurns = true;
	
    $.albumWidth = 0;
    $.albumHeight = 0;
    $.thumbWidth = 0;
    $.thumbHeight = 0;
	$.thumbViewCount = 0;

    $.slideWidth = 0;
    $.slideHeight = 0;
	
	$.touchX = -1;
	$.touchY = -1;
	$.currentAlbum = 0;
    $.inAnimation = false;
	$.inAutoplay = false;

    $.albums = [];
	$.effect = 0;
	
	$.onlySlider = false;

	$.effects = [
		"00 - Fade 1",
		"01 - Fade 2",
		"02 - Slide left",
		"03 - Slide right",
		"04 - Slide top",
		"05 - Slide buttom",
		"06 - Clap in out vertical", 
		"07 - Clap in out horizontal",
		"08 - Zoom in out 1",
		"09 - Zoom in out 2",
		"10 - Rotation",
		"11 - Card flip",
		"12 - Fold right",
		"13 - Fold left",
		"14 - Fold down",
		"15 - Fold up",
		"16 - Slice right",
		"17 - Slice left",
		"18 - Slice right 3d",
		"19 - Slice left 3d",
		"20 - Box 2d linear",
		"21 - Box 2d diagonal",
		"22 - Box 3d",
		"23 - Box rundom",
		"24 - Box right",
		"25 - HoleOut Swashin",
		"26 - BoingOutDown BoingInUp",
		"27 - Slide down/top",
		"28 - Slide left/right",
		"29 - Cube horizontal+",
		"30 - Cube horizontal-",
		"31 - Cube vertical+",
		"32 - Cube vertical-",
	];

	$.init = function (props) {  
	
		var d = props || this.createTestAlbum();

        this.albums = d.albums;
        this.albumWidth = d.width;
        this.albumHeight = d.height;
        this.thumbWidth = d.thumbWidth;
        this.thumbHeight = d.thumbHeight;
		this.effect = d.effect || 1;
		this.imagePath = d.imagePath || this.imagePath;
		this.background = d.background || this.background;
		this.autoplayKenBurns = d.autoplayKenBurns != null ? d.autoplayKenBurns : true;
		this.onlySlider = d.onlySlider != null ? d.onlySlider : false;
		this.currentAlbum = 0;

		if (d.width == -1 || d.height == -1) {
            this.albumWidth = window.innerWidth;
            this.albumHeight = window.innerHeight;
            this.style.left = "0px";
            this.style.top = "0px";
        }
		else if (d.originWidth && d.originHeight) {
			var ratio = nmdr.core.utils.resizeKeepingRatio(d.originWidth, d.originHeight, d.width, d.height);
			this.albumWidth = ratio.width;
			this.albumHeight = ratio.height;
		}

		var tc = Math.floor((this.albumWidth - 40) / this.thumbWidth);
		tc = (tc +1) * this.paddingH;
		tc = Math.floor((this.albumWidth - 40 - tc) / this.thumbWidth);
		
        this.thumbViewCount = tc;
        this.slideWidth = this.thumbWidth * this.thumbViewCount + ((this.thumbViewCount + 1) * this.paddingH);
        this.slideHeight = this.thumbHeight + 2 * this.paddingV;

        for (var i=0; i < this.albums.length; i++) {
			
            var al = this.albums[i];
            
			if (al.selected) this.currentAlbum = i;
			
			if (al.picsCount != -1) {
                al.pics = [];
                for (var n=0; n < al.picsCount; n++) {
                    al.pics[n] = {name: this.createImageName(al, n), desc: al.description, video: false};
                }
			}
			
			al.startPic = 0;
			al.currentPic = -1;
			al.currentVideo = null;
			al.picsCount = al.pics.length;
			al.loaded = false;
            al.thumbnailsOpen = false;
		}
			
        this.build();

   		this.style.backgroundColor = this.background;
   		this.style.width = this.albumWidth + "px";
   		this.style.height = this.albumHeight + "px";

		nmdr.core.animate.setData(20, 10);
        //window.addEventListener('resize', function () { window.location.reload(); });
        
		return this;
    };
		
    $.build = function () {
	
        var buf = [];

        buf.push("<style type='text/css'>video{width:100% !important;height:auto !important;}</style>");
        
        buf.push("<div class='nmdrPS_root' id='" + this.id + "_nmdrPS_root' style='position:relative;display:block;margin:0 auto;overflow:hidden;" + 
			"width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;'>");
			
        buf.push("<div class='nmdrPS_content' id='" + this.id + "_nmdrPS_content' " +
			"style='position:absolute;left:" + (-this.currentAlbum * this.albumWidth) + "px;top:0px;" + 
			"width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;' " +
			"onmouseover=\"nmdr.core.$('" + this.id + "').showToolbars(event,true)\" " +
			"onmouseout=\"nmdr.core.$('" + this.id + "').showToolbars(event,false)\">");

        for (var i=0; i < this.albums.length; i++) {
            
            var album = this.albums[i],
                title = album.title !== null ? album.title : "",
                descr = album.description !== null ? album.description : "",
                op1 = i == 0 ? 0.5 : 1.0,
                op2 = i < this.albums.length - 1 ? 1.0 : 0.5,
                left = i * this.albumWidth;
						
			buf.push("<div class='nmdrPS_pbox' id='" + this.id + "_nmdrPS_pbox" + i + "' " +
				"onmousedown=\"nmdr.core.$('" + this.id + "').onMouseTouchDown(event);\" " +
				"onmouseup=\"nmdr.core.$('" + this.id + "').onMouseTouchUp(event, false);\" " +
				"onclick=\"nmdr.core.$('" + this.id + "').openImage(event," + i + ");\" " +
				"style='position:absolute;left:" + left + "px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"vertical-align:top;text-align:left;pointer-events:auto;background-size:cover;'>" + 
				this.createPicBox(i) + "</div>");

			buf.push("<div class='nmdrPS_dbox' id='" + this.id + "_nmdrPS_dbox" + i + "' style='position:absolute;" +
				"left:" + (left + this.albumWidth - this.descboxWidth - 6) + "px;top:" + (this.albumHeight - this.descboxHeight - 6) + "px;" +
				"width:" + this.descboxWidth + "px;height:" + this.descboxHeight + "px;display:none; vertical-align:top;text-align:left;" +
				"color:#fff;background-image:linear-gradient(rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 100%);pointer-events:auto;'></div>");

            buf.push("<div class='nmdrPS_sbox' id='" + this.id + "_nmdrPS_sbox" + i + "' " +
				"style='position:absolute;left:" + left + "px;top:" + (this.albumHeight - 56) + "px;width:" + 
				this.albumWidth + "px;height:" + (56 + (this.thumbHeight + 2 * this.paddingV)) + "px;" +
				"vertical-align:top;text-align:left;color:#fff;pointer-events:auto;" + (this.onlySlider ? "visibility:hidden;" : "") + "'>");

			//=== Toolbars
			
			buf.push("<table border=0, cellpadding=0, cellspacing=2, width=100% height=100%><tr>");
            buf.push("<td style='width:20px;height:40px'></td>");

            buf.push("<td class='nmdrPS_dubt' id='" + this.id + "_nmdrPS_dubt" + i + "' title='Show thumbnails' style='width:40px;height:40px;");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideUp.png\");cursor:pointer;' ");
            buf.push("onclick=\"nmdr.core.$('" + this.id + "').showThumbnails(event, " + i + ", true)\"/></td>"); 
			
            buf.push("<td class='nmdrPS_aplay' id='" + this.id + "_nmdrPS_aplay" + i + "' title='Start autoplay' style='width:40px;height:40px;");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "autoplay.png\");cursor:pointer;' ");
            buf.push("onclick=\"nmdr.core.$('" + this.id + "').runAutoplay(event, " + i + ", true)\"/></td>"); 
			
            buf.push("<td style='width:20px;height:40px;'></td>");
            buf.push("<td class='nmdrPS_vidbar' id='" + this.id + "_nmdrPS_vidbar" + i + "' style='width:240px;height:40px;'></td>");
            buf.push("<td></td>");
			
			buf.push("<td class='nmdrPS_lebt' id='" + this.id + "_nmdrPS_prevAL" + i + "' title='Previous album' style='width:40px;height:40px;opacity:" + op1 + ";");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideLeft.png\");cursor:pointer;' ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').showPrevAlbum(event," + i + ")\"></td>");

			buf.push("<td class='nmdrPS_ribt' id='" + this.id + "_nmdrPS_nextAL" + i + "' title='Next album' style='width:40px;height:40px;opacity:" + op2 + ";");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideRight.png\");cursor:pointer;' ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').showNextAlbum(event," + i + ")\"></td>");

			buf.push("<td class='nmdrPS_vibt' id='" + this.id + "_nmdrPS_vibt" + i + "' title='Show image in new tab' style='width:40px;height:40px;");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideView.png\");cursor:pointer;'");			
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').openImage(event," + i + ",true)\"></td>");
			
			buf.push("<td class='nmdrPS_desc' id='" + this.id + "_nmdrPS_desc" + i + "' title='Open description bar' style='width:40px;height:40px;");
			buf.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideDesc.png\");cursor:pointer;'");			
			buf.push("onmouseover=\"nmdr.core.$('" + this.id + "').showDesc(event," + i + ",true);\" ");
			//buf.push("onmouseout=\"nmdr.core.$('" + this.id + "').showDesc(event," + i + ",false);\" ");
			buf.push("></td>");
            buf.push("<td style='width:20px'></td></tr>");
			
			//=== Thumbnails

			buf.push("<tr><td colspan='11' style='height:10px'></td></tr>");

			buf.push("<tr style='background-color:rgba(0,0,0,0.3);'>");
			buf.push("<td onclick=\"nmdr.core.$('" + this.id + "').slideThumbsLeft(event," + i + ")\" style='width:20px;height:" + 
				(this.thumbHeight + 2 * this.paddingV) + "px;cursor:pointer;'><img id='" + this.id + "_nmdrPS_scleft" + i + "' src='" + 
				this.imagePath + "slideLeftB.png' style='opacity:0.5'></td>");

			buf.push("<td id='" + this.id + "_nmdrPS_sbox" + i + "_thumbs' colspan='9' style='vertical-align:top;text-align:center;'>");
			buf.push("<div style='text-align:center !important; margin:0 auto; padding-top:10px;font:13px Arial,Helvetica,sans-serif;'>");
			buf.push("<table align='center' style='margin:auto;'><tr><td><img src=\"" + this.imagePath + "loading.gif\"></td>");
			buf.push("<td><p id='loadingCount' style='padding-left:6px;'>loading... 0 %</p></td></tr></table></div></td>");

			buf.push("<td onclick=\"nmdr.core.$('" + this.id + "').slideThumbsRight(event," + i + ")\" style='width:20px;height:" + 
				(this.thumbHeight + 2 * this.paddingV) + "px;cursor:pointer;opacity:" + (album.picsCount <= this.thumbViewCount ? "0.5" : "1") + "'>" +
				"<img id='" + this.id + "_nmdrPS_scright" + i + "' src='" + this.imagePath + "slideRightB.png'></td></tr>");

            buf.push("</table></div>");
        }
		
        buf.push("</div>");
        buf.push("</div>");

        this.innerHTML = buf.join("");	
		this.init3D();
		this.initTouchEvents();		
        this.initKeyEvents();
    };
	
    $.createPicBox = function (num) {
		
		if (!this.createVideoBox(num)) {

            var album = this.albums[num];
			
			var hm ="<div style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"vertical-align:top;text-align:left;pointer-events:auto;background-image: url(\"" + this.getImageName(album, album.currentPic) + "\");" +
				"backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);'><div id='" + this.id + "_nmdrPS_promo" + num + "'></div></div>";	

			var pb = this.init3D();
			if (pb) pb.innerHTML = hm; else return hm;
		}
			
		if (this.inAutoplay && this.autoplayKenBurns) {
			var buf = [];
			this.slideKenBurns_Style(buf);
			var pbox = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			pbox.classList.add("KenBurns");
			pbox.innerHTML = buf.join("") + pbox.innerHTML;
		}
				
		this.createPromotion(num);
	};
	
    $.createVideoBox = function (num) {
		
		var album = this.albums[num], vbox = document.getElementById(this.id + "_nmdrPS_vidbar" + num);
		
		if (vbox) {
				
			vbox.innerHTML = "";
			
			if (album.currentPic != -1 && album.pics[album.currentPic].video) {

				var buf=[], id = this.id, imp = this.imagePath;

				buf.push("<table border=0, cellpadding=0, cellspacing=0, width=100% height=100% style='background:#333333'><tr>");
				buf.push("<td>&nbsp;&nbsp;</td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrestart.png' title='Restart' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'restart')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vloop1.png' title='Loop' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'loop')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgobegin.png' title='Go begin' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'begin')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vplay.png' title='Play' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'play')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgoend.png' title='Go end' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'end')\"></td>"); 
				buf.push("<td>&nbsp;&nbsp;</td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vslower.png' title='Slower' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'slower')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vnormal.png' title='Normal' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'normal')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vfaster.png' title='Faster' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'faster')\"></td>"); 
				buf.push("<td>&nbsp;&nbsp;</td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrewind.png' title='Rewind' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'rew')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vforward.png' title='Forward' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'fwd')\"></td>"); 
				buf.push("<td>&nbsp;&nbsp;</td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vmute2.png' title='Mute' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'mute')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvoldown.png' title='Volume down' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'volDn')\"></td>"); 
				buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvolup.png' title='Volume up' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, " + num + ", 'volUp')\"></td>"); 
				buf.push("<td>&nbsp;&nbsp;</td>"); 
				buf.push("</tr></table>");
			
				vbox.innerHTML = buf.join("");

				this.handleVideo(null, num, "init");
				
				return true;
			}
		}
		return false;
	};

	$.init3D = function () {
		var pbox = document.getElementById(this.id + "_nmdrPS_pbox" + this.currentAlbum);
		if (pbox) {
			var all3D = [10,11,12,13,14,15,18,19,22,24];
			var is3D = all3D.indexOf(this.effect) != -1;
			
			pbox.style.transformStyle = is3D ? "preserve-3d" : "initial";
			pbox.style.webkitTransformStyle = is3D ? "preserve-3d" : "initial";
			pbox.style.perspective = is3D ? "1800px" : "none";
			pbox.style.webkitPerspective = is3D ? "1800px" : "none";
			pbox.style.backgroundImage = "none";
			
			return pbox;
		}
		return null;
	};
	
	$.createPromotion = function(num) {
        var album = this.albums[num];
		if (album.currentPic != -1 && album.pics[album.currentPic].promotion) {			
			var pr = document.getElementById(this.id + "_nmdrPS_promo" + num);
			pr.style.position = "absolute";
			pr.style.top = "100px";
			pr.style.left = "100px";
			pr.innerHTML = "<img src='" + album.url + album.path + album.pics[album.currentPic].promotion + "'>";
		}
	};
	
    $.createThumbnails = function (album, num) {

        var style =
			"<style type=\"text/css\">" +
			"a { text-decoration:none; outline:0; color:#000; }" +
			".nmdrPS_thumbItem:hover {cursor:pointer;outline:1px solid #A8D7FF !important;opacity:1 !important;}" +
			".thumbSelected {outline:1px solid orange !important;opacity:1 !important;}" +
			"</style>";

        var buf = [], le = this.paddingH, self = this;

		buf.push(style);
		buf.push("<div class='nmdrPS_slidesShow' id='" + this.id + "_nmdrPS_slidesShow" + num + "' style='position:absolute;left:" + 
			((this.albumWidth - this.slideWidth) / 2) +	"px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;overflow:hidden;'>");
		buf.push("<div class='nmdrPS_thumbsArea' id='" + this.id + "_nmdrPS_thumsArea" + num + "' style='position:absolute;'>");
	
        for (var i = 0; i < album.picsCount; i++) {	
			var pname = this.getImageName(album, i);
			
			var vd = album.pics[i].video ? "<img src=\"" + this.imagePath + "video.png\" style='position:absolute;left:4px;top:" + (this.thumbHeight-16) + "px;'>" : "";
			
            buf.push(
				"<div class='nmdrPS_thumbItem' id='thumb_" + num + "_" + i + "' style='display:block; opacity:0.5; position:absolute; " +
				"left:" + le + "px; top:" + this.paddingV + "px; width:" + this.thumbWidth + "px; height:" + this.thumbHeight + "px; " +
				"background-image: url(\"" + pname + "\"); background-size:cover;' " +
				"onmousedown=\"nmdr.core.$('" + this.id + "').onMouseTouchDown(event);\" " +
				"onmouseup=\"nmdr.core.$('" + this.id + "').onMouseTouchUp(event, true);\" " +
				"onclick=\"nmdr.core.$('" + this.id + "').changeImage(" + num + "," + i + ")\">" + vd + "</div>");

            le += this.thumbWidth + this.paddingH;
        }
		buf.push("</div></div>");

        return buf.join("");
    };
    
    $.onKeyDown = function (evt) {
		//nmdr.core.utils.stopPropagation(evt);

        if (evt.target.name && (evt.target.name == "albums" || evt.target.name == "effects")) return;
        
        var num = this.currentAlbum, album = this.albums[num];
        switch(evt.keyCode) {
            case 37: // key left
                if (album.thumbnailsOpen) this.changeThumbnail(evt, num, -1);
                else this.showPrevAlbum(evt, this.currentAlbum);
            break;
            case 38: // key up
                if (!album.thumbnailsOpen) this.showThumbnails(evt, num, true);
            break;
            case 39: // key right
                if (album.thumbnailsOpen) this.changeThumbnail(evt, num, 1);
                else this.showNextAlbum(evt, num);
            break;
            case 40: // key down
                if (album.thumbnailsOpen) {
					this.showDesc(evt, num, false);
					this.showThumbnails(evt, num, false);
				}
            break;
            case 27: // key escp
                this.runAutoplay(null, num, false);
                this.showDesc(evt, num, false);
                this.showThumbnails(evt, num, false);
            break;
        }        
    };
    
	$.onMouseTouchDown = function(evt) {
		this.touchX = parseInt(evt.clientX);
		this.touchY = parseInt(evt.clientY);
		var source = evt.target || evt.srcElement;
		source.style.cursor = "pointer";
		return false;
	};

	$.onMouseTouchUp = function(evt, slide) {
		var dist = parseInt(evt.clientX) - this.touchX;
		if (dist < -20) if (slide) this.slideThumbsRight(evt, this.currentAlbum); else this.showNextAlbum(evt, this.currentAlbum);  
		if (dist > 20) if (slide) this.slideThumbsLeft(evt, this.currentAlbum); else this.showPrevAlbum(evt, this.currentAlbum);  
		this.touchX = -1;
		this.touchY = -1;
		var source = evt.target || evt.srcElement;
		source.style.cursor = slide ? "pointer" : "default";
	};
	
    $.initTouchEvents = function () {
		var self = this;
        for (var i=0; i < this.albums.length; i++) {
			var div = document.getElementById(self.id + "_nmdrPS_pbox" + i);

			div.addEventListener("touchstart", function(e){
				var touchobj = evt.changedTouches[0];
				self.touchX = parseInt(touchobj.clientX);
				self.touchY = parseInt(touchobj.clientY);
				evt.preventDefault();
			}, false);
			
			div.addEventListener("touchmove", function(e){
				var touchobj = evt.changedTouches[0];	
				var dist = parseInt(touchobj.clientX) - self.touchX;
				if (dist < -20) self.showNextAlbum(e, self.currentAlbum); 
				if (dist > 20) self.showPrevAlbum(e, self.currentAlbum); 
				evt.preventDefault();
			}, false);
			
			div.addEventListener("touchend", function(e){
				self.touchX = -1;
				self.touchY = -1;
				evt.preventDefault();
			}, false);
		}
	};
    
    $.initKeyEvents = function () {
        var self = this;
        document.addEventListener("keydown", function(ev) { self.onKeyDown(ev); });  
    };

	$.changeAlbum = function (evt, num) {

		var e = document.getElementById(this.id + "_nmdrPS_albums");
		var n = parseInt(e.options[e.selectedIndex].value);
		
		if (!this.inAnimation && n != this.currentAlbum) {
			
			this.runAutoplay(null, this.currentAlbum, false);
			this.showDesc(evt, num, false);
			this.showThumbnails(evt, num, false);
			
			this.inAnimation = true; 
			
			var self = this, cont = document.getElementById(this.id + "_nmdrPS_content");
			nmdr.core.animate.fadeOut(null, cont, 0.03, null, function() { 
				cont.style.left = (-n * self.albumWidth) + "px";
				nmdr.core.animate.fadeIn(null, cont, 0.03, null, function() { 
					self.currentAlbum = n;
					self.inAnimation = false; 
				});
			});
		}
	};

	$.showPrevAlbum = function (evt, num) {
        if (!this.inAnimation && num > 0) {
			
			this.runAutoplay(null, this.currentAlbum, false);
			this.showDesc(evt, num, false);
			this.showThumbnails(evt, num, false);
			
			this.inAnimation = true; 
			this.currentAlbum -= 1;
			
            var s = nmdr.core.animate.stepH / this.slideWidth;
			var m = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			var n = document.getElementById(this.id + "_nmdrPS_pbox" + (num - 1));
			nmdr.core.animate.fadeOut(null, m, s);
			nmdr.core.animate.fadeIn(null, n, s);

            nmdr.core.animate.scroll(this.id + "_nmdrPS_content", null, this.albumWidth, 0,
				function (arg) { 
					m.style.opacity = 1; 
					arg.inAnimation = false;
				}, this);
        }
    };

    $.showNextAlbum = function (evt, num) {
        if (!this.inAnimation && num < this.albums.length - 1) {
		
			this.runAutoplay(null, this.currentAlbum, false);
			this.showDesc(evt, num, false);
			this.showThumbnails(evt, num, false);

			this.inAnimation = true; 
			this.currentAlbum += 1;
			
            var s = nmdr.core.animate.stepH / this.slideWidth;
			var m = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			var n = document.getElementById(this.id + "_nmdrPS_pbox" + (num + 1));
			nmdr.core.animate.fadeOut(null, m, s);
			nmdr.core.animate.fadeIn(null, n, s);
            nmdr.core.animate.scroll(this.id + "_nmdrPS_content", null, -this.albumWidth, 0,
				function (arg) { 
					m.style.opacity = 1; 
					arg.inAnimation = false; 
				}, this);
        }
    };

    $.showThumbnails = function (evt, num, show, callback) {
        if (!this.inAnimation) {
						
			this.inAnimation = true; 

			var id1 = this.id + "_nmdrPS_dubt" + num,
				id2 = this.id + "_nmdrPS_sbox" + num,
				id3 = this.id + "_nmdrPS_dbox" + num,
			
				d1 = show ? this.thumbHeight + 2 * this.paddingV + 56 : 56,
				d2 = show ? this.thumbHeight + 2 * this.paddingV + this.descboxHeight + 6 : this.descboxHeight + 6,
			
				self = this, 
				album = this.albums[num], 
				elem = document.getElementById(id2 + "_thumbs");
				
            nmdr.core.animate.move(null, document.getElementById(id2), null, this.albumHeight - d1,
				function (arg) {
                    if (show && !album.loaded) {
						self.loadThumbnails(elem, album, num, callback);
						//elem.innerHTML = self.createThumbnails(album, num);
						album.loaded = true;
					}
					
				    self.inAnimation = false;

					document.getElementById(id3).style.top = (self.albumHeight - d2) + "px";

					// change the title and icon of slidbutton
					var bt = document.getElementById(id1);

					if (show) {
						bt.title = "Hide thumbnails";
						bt.style.backgroundImage = "url('" + self.imagePath + "slideDown.png')";
						bt.onclick = function (e) { self.showThumbnails(e, num, false); }
                        album.thumbnailsOpen = true;
					}
					else {
						bt.title = "Show thumbnails";
						bt.style.backgroundImage = "url('" + self.imagePath + "slideUp.png')";
						bt.onclick = function (e) { self.showThumbnails(e, num, true); }
                        album.thumbnailsOpen = false;
					}
				},
			this);
        }
    };
    
    $.loadThumbnails = function (elem, album, num, callback) {
        
        var images=[], self=this;
        var checkForAllimgLoaded = function() {
            for (var i = 0; i < images.length; i++) {
				if (!images[i].attempts) images[i].attempts = 0;
                if (!images[i].complete && images[i].attempts < 5) {
                    images[i].attempts++;
                    var percentage = (i * 100.0 / (images.length)).toFixed(0).toString();
					var el = document.getElementById("loadingCount");
                    el.innerHTML = "loading... " + (percentage.length < 2 ? "0" : "") + percentage + " %";
                    setTimeout(checkForAllimgLoaded, 20);
                    return;
                }
            }
			
			elem.innerHTML = self.createThumbnails(album, num);
			if (callback) callback();
        };
        
        for (var i = 0; i < album.picsCount; i++) {	
			var img = new Image();
			img.src = this.getImageName(album, i);
            images.push(img);
		}
        
        checkForAllimgLoaded();
	};

    $.changeThumbnail = function(evt, num, dir, callback) {
        
        var album = this.albums[num], self = this;
               
        var waitForAnim = function(callback) { 
            var wait = function() {
                if (self.inAnimation) setTimeout(wait, 5); else callback();
            }
            wait();
        };

        if (dir == 1) {
            if (album.currentPic < album.picsCount-1) {
                
                if (album.currentPic % this.thumbViewCount == self.thumbViewCount-1) {
                    waitForAnim(function() {
                        self.slideThumbsRight(evt, num, true, function() {
                            self.changeImage(self.currentAlbum, album.currentPic + dir, false, callback);
                        });
                    });
                }
                else {
                    waitForAnim(function() {
                        self.changeImage(self.currentAlbum, album.currentPic + dir, false, callback);
                    });
                }
            }
            else {
                waitForAnim(function() {
                    var elem = document.getElementById(self.id + "_nmdrPS_sbox" + num + "_thumbs");
                    elem.innerHTML = self.createThumbnails(album, num);
                    album.startPic = 0;
                    document.getElementById(self.id + "_nmdrPS_scright" + num).style.opacity = 1.0;
                    document.getElementById(self.id + "_nmdrPS_scleft" + num).style.opacity = 0.5;
                    self.changeImage(self.currentAlbum, 0, false, callback);
                });
            }
        }
        else if (album.currentPic > 0) {
			
            if (album.currentPic % this.thumbViewCount == 0) {
                waitForAnim(function() {
                    self.slideThumbsLeft(evt, num, function() {
                        self.changeImage(self.currentAlbum, album.currentPic + dir, false, callback);
                    });
                });
            }
            else {
                waitForAnim(function() {
                    self.changeImage(self.currentAlbum, album.currentPic + dir, false, callback);
                });
            }
        }
    };
    
    $.slideThumbsRight = function (evt, num, autoplay, callback) {
		
		autoplay = typeof autoplay == "undefined" ? !this.inAutoplay : autoplay || !this.inAutoplay;
		
 	    var self = this, album = this.albums[num];
        if (!this.inAnimation && autoplay && album.startPic < album.picsCount - this.thumbViewCount) {
			
			this.inAnimation = true;

			var rx = Math.min(album.picsCount - album.startPic, this.thumbViewCount); 		
			var cx = Math.min(album.picsCount - album.startPic - rx, this.thumbViewCount);
			var dx = this.thumbWidth * cx + cx * this.paddingH;
						
			nmdr.core.animate.scroll(this.id + "_nmdrPS_thumsArea" + num, null, -dx, 0,
				function (arg) {
					album.startPic += cx;
					arg.inAnimation = false;
					document.getElementById(self.id + "_nmdrPS_scleft" + num).style.opacity = 1.0;
					if (album.startPic >= album.picsCount - self.thumbViewCount) {
						document.getElementById(self.id + "_nmdrPS_scright" + num).style.opacity = 0.5;
					}
					if (callback) callback();
				},
			this);
		}
	};

    $.slideThumbsLeft = function (evt, num, callback) {
				
		var self = this, album = this.albums[num];
		if (!this.inAnimation && !this.inAutoplay && album.startPic > 0) {
			
			this.inAnimation = true;
			
			var cx = Math.min(album.startPic - this.thumbViewCount, this.thumbViewCount);
			if (cx < this.thumbViewCount) {
				if (cx < 0) cx = 1;
				else {
					cx = Math.max(album.startPic - cx, this.thumbViewCount);
					if (cx < 0) cx = 1;
				}
			}
			var dx = this.thumbWidth * cx + cx * this.paddingH;
							
			nmdr.core.animate.scroll(this.id + "_nmdrPS_thumsArea" + num, null, dx, 0,
				function (arg) {
					album.startPic -= cx;
					arg.inAnimation = false;
					document.getElementById(self.id + "_nmdrPS_scright" + num).style.opacity = 1.0;
					if (album.startPic <= 0) {
						album.startPic = 0;
						document.getElementById(self.id + "_nmdrPS_scleft" + num).style.opacity = 0.5;
					}
					if (callback) callback();
				},
			this);
		}
	};
	
	$.showToolbars = function (evt, show) {
		
		if (this.onlySlider) return;
		
		nmdr.core.utils.stopPropagation(evt);
		var elem = document.getElementById(this.id + "_nmdrPS_sbox" + this.currentAlbum);
		elem.style.visibility = show ? "visible" : "hidden";
	};
	
    $.showDesc = function (evt, num, show) {

        if (evt) nmdr.core.utils.stopPropagation(evt);
			
		if (this.inAnimation) return;
		
		var bx = document.getElementById(this.id + "_nmdrPS_dbox" + num);

		if (!show) { bx.innerHTML = ""; bx.style.display = "none"; return; }
		
		document.getElementById(this.id + "_nmdrPS_sbox" + num).style.visibility = "visible";
		
		nmdr.core.popup.open(bx, document.getElementById(this.id + "_nmdrPS_desc" + num), null, 
			function(cb) { 
				bx.innerHTML = ""; 
				bx.style.display = "none"; 
				if (cb) cb();
			} 
		);

		var sel1 = "<select name='albums' id='" + this.id + "_nmdrPS_albums' onchange=\"nmdr.core.$('" + this.id + "').changeAlbum(event," + num + ")\" style='font:11px Arial,Helvetica,sans-serif;width:200px;'>";
		for (var i in this.albums) sel1 += "<option value='" + i + "' " + (this.currentAlbum == i ? "selected" : "") + ">" + this.albums[i].title + "</option>";
		sel1 += "</select>";
		
		var sel2 = "<select name='effects' id='" + this.id + "_nmdrPS_effects' onchange=\"nmdr.core.$('" + this.id + "').changeEffect()\" style='font:11px Arial,Helvetica,sans-serif;width:200px;'>";
		for (var i in this.effects) sel2 += "<option value='" + i + "' " + (this.effect == i ? "selected" : "") + ">" + this.effects[i] + "</option>";
		sel2 += "</select>";
		
		var buf = [], album = this.albums[num], 
			desc = this.getImageDescription(album), 
			links = this.getImageLinks();

		buf.push("<table border=0, cellpadding=0, cellspacing=8, width=100% height=100%>");
		buf.push("<tr><td style='height:10px'></td></tr>");		
		buf.push("<tr><td style='height:40px;border-bottom:2px solid #ccc;'><a style='color:#ccc;font:13px Arial,Helvetica,sans-serif;'>" + album.title + "</a></td></tr>");		
		buf.push("<tr><td style='height:5px'></td></tr>");		
		buf.push("<tr><td style='height:110px;vertical-align:top;'><a id='" + this.id + "_nmdrPS_descDs" + num + "' style='color:#fff;font:20px Segoe UI Light,Segoe UI,Arial,Helvetica,Sans-Serif;font-weight: 100'>" + desc + "</a>" + links + "</td></tr>");
		buf.push("<tr><td style='height:36px;'><table border=0, cellpadding=0, cellspacing=0, width=100% height=100%>");
		buf.push("<tr><td><a style='color:#ccc;font:11px Arial,Helvetica,sans-serif;'>Albums</a></td><td>" + sel1 + "</td></tr>");		
		buf.push("<tr><td><a style='color:#ccc;font:11px Arial,Helvetica,sans-serif;'>Effects&nbsp;&nbsp;</a></td><td>" + sel2 + "</td></tr></table></td></tr>");		
		buf.push("<tr><td style='height:20px;'><a style='color:#ccc;font:12px Arial,Helvetica,sans-serif;'>© nalizadeh.com 2016</a></td></tr>");		
		buf.push("<tr><td></td></tr>");
		buf.push("</table>");
		bx.innerHTML = buf.join("");
		bx.style.display = "inline";
    };
   
    $.runAutoplay = function (evt, num, start) {
			
		var bt = document.getElementById(this.id + "_nmdrPS_aplay" + num), self = this;
        
		if (start) {
			bt.title = "Stop autoplay";
			bt.style.backgroundImage = "url('" + this.imagePath + "autopause.png')";
			bt.onclick = function (e) { self.runAutoplay(e, num, false); }
			this.inAutoplay = true;
			           
			var run = function() {
				if (self.inAutoplay){

					self.changeEffect(Math.floor(Math.random()*32));
                    self.changeThumbnail(evt, num, 1, function() { setTimeout(run, self.autoplayDelay); });
                                       
                    var ds = document.getElementById(self.id + "_nmdrPS_descDs" + num);                    
                    if (ds) {
                        
                        var se = document.getElementById(self.id + "_nmdrPS_effects");
                        
                        se.selectedIndex = self.effect;
                        ds.innerHTML = self.getImageDescription(self.albums[self.currentAlbum]);
                    }
				}
			};
			run();
		}
		else if (this.inAutoplay) {
			bt.title = "Start autoplay";
			bt.style.backgroundImage = "url('" + this.imagePath + "autoplay.png')";
			bt.onclick = function (e) { self.runAutoplay(e, num, true); }
			this.inAutoplay = false;
            this.inAnimation = false;
			
			if (this.autoplayKenBurns) {
				var pbox = document.getElementById(this.id + "_nmdrPS_pbox" + num);
				pbox.classList.remove("KenBurns");
			}
		}
	};

    $.startAutoplay = function () {
		var self = this;
		this.showThumbnails(null, this.currentAlbum, true, function() {
			self.runAutoplay(null, self.currentAlbum, true);
		});
	};
	
 	$.createImageName = function (album, num) {
		var n = num + 1, nx = "" + n;
		if (album.order) {
			if (album.picsCount < 10 && n < 10) nx = "0" + nx;
			else if (album.picsCount < 100 && n < 10) nx = "0" + nx;
			else if (album.picsCount > 100) {
				if (n < 10) nx = "0" + nx;
				if (n < 100) nx = "0" + nx;
			}
		}
		else if (n < 10) nx = "0" + nx;
		
		return album.picname + nx + ".jpg";
    };
    
 	$.getImageName = function (album, num) {		
		if (num == -1) return album.url + album.image;
		return album.url + album.path + album.pics[num].name;
	};

 	$.getImageDescription = function (album) {
		if (album.currentPic == -1) return album.description;
		var num = album.currentPic == -1 ? 0 : album.currentPic;
		return album.pics[num].desc;
	};
	
 	$.getImageLinks = function() {
				
		var ln1 = "http://www.bing.com/search?q=",
			ln2 = "http://www.google.com/?gws_rd=ssl#q=",
			ln3 = "https://search.yahoo.com/search;?p=",

			links = "<br><br>" +
			"<img src='" + this.imagePath + "bing16x16.png' style='cursor:pointer;' onclick=\"nmdr.core.$('" + this.id + "').openLink('" + ln1 + "')\">&nbsp;" +
			"<img src='" + this.imagePath + "google16x16.png' style='cursor:pointer;' onclick=\"nmdr.core.$('" + this.id + "').openLink('" + ln2 + "')\">";
			
		return links;
	};

	$.openImage = function (evt, num, show) {
		this.showDesc(evt, num, false);
		this.showThumbnails(evt, num, false);
		
		if (show) {
			var album = this.albums[num];
			num = album.currentPic == -1 ? 0 : album.currentPic;
			var win = window.open(this.getImageName(album, num), "_blank");
			win.focus();
		}
    };
    
	$.openLink = function (lk) {
		var al = this.albums[this.currentAlbum],
			num = al.currentPic == -1 ? 0 : al.currentPic, url = lk + al.pics[num].desc,
			win = window.open(url, "_blank");
		win.focus()	
	};
	   
    $.handleVideo = function (evt, num, code) {
        var self = this, album = this.albums[num];
				
		if (code == "init") {
			var vname = this.getImageName(album, album.currentPic);

			album.currentVideo = document.createElement("video");
			album.currentVideo.id = this.id + "_nmdrPS_pbox_video" + num;
			album.currentVideo.src = vname.substring(0, vname.lastIndexOf(".")) + ".mp4";
			album.currentVideo.poster = vname;
			album.currentVideo.controls = false;
			album.currentVideo.autoPlay = true;
			album.currentVideo.preload = true;
			album.currentVideo.loop = true;
			album.currentVideo.addEventListener("error", function(err) { errMessage(err); }, true);
			album.currentVideo.load();
			
			album.currentVideo.onended = function() {
				if (!album.currentVideo.loop) {
					var vcc = document.getElementById(self.id + "_nmdrPS_vidbar" + num).getElementsByClassName("vc");
					vcc[3].src = self.imagePath + "vplay.png";
					album.currentVideo.pause();
				}
			};

			var pbox = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			
			pbox.innerHTML = "";
			pbox.appendChild(album.currentVideo);
			return true;
		}
		
		var video = album.currentVideo;
		
        if (video.canPlayType) { // tests that we have HTML5 video support
		
            // helper functions
			
            //  load video file from input field
            var getVideo = function() {
				var album = self.albums[num];
				var vname = self.getImageName(album, album.currentPic);
				video.src = vname.substring(0, vname.indexOf(".")) + ".mp4";
                video.load(); 
				video.addEventListener("error", function(err) { errMessage(err); }, true);
			};       

            //  play video
            var vidplay = function(evt) {
                if (video.src == "") { // inital source load
                    getVideo();
                }
                var button = evt.target; //  get the button id to swap the text based on the state                                    
                if (video.paused) { // play the file, and display pause symbol					
					video.play();
                    button.src = self.imagePath + "vpause.png";
					button.title = "Pause";
                } else { // pause the file, and display play symbol  
                    video.pause();
                    button.src = self.imagePath + "vplay.png";
 					button.title = "Play";
               }
            };

            //  button helper functions 
            //  skip forward, backward, or restart
            var setTime = function(tValue) {
                //  if no video is loaded, this throws an exception 
                try {
                    if (tValue == 0) {
                        video.currentTime = tValue;
                    } else {
                        video.currentTime += tValue;
                    }

                } catch (err) {
                    // errMessage(err) // show exception
                    errMessage("Video content might not be loaded");
                }
            };

            //  display an error message 
            var errMessage = function(msg) { alert(msg); };

            // change volume based on incoming value 
            var setVol = function(value) {
                var vol = video.volume;
                vol += value;
                //  test for range 0 - 1 to avoid exceptions
                if (vol >= 0 && vol <= 1) {
                    // if valid value, use it
                    video.volume = vol;
                } else {
                    // otherwise substitute a 0 or 1
                    video.volume = (vol < 0) ? 0 : 1;
                }
            };

            // Set src == latest video file URL
            if (code == "loadVideo") getVideo();
			//  Play
            if (code == "play") vidplay(evt);
			//  Go begin
            if (code == "begin") setTime(0);
			//  Go end
            if (code == "end") setTime(1000); // ???? todo
            //  Restart
            if (code == "restart") setTime(0);
            //  Skip backward 10 seconds
            if (code == "rew") setTime(-10);
            //  Skip forward 10 seconds
            if (code == "fwd") setTime(10);           
            // playback speed buttons
            if (code == "slower") video.playbackRate -= .25;
            if (code == "faster") video.playbackRate += .25;
            if (code == "normal") video.playbackRate = 1;
			
             // volume buttons down by 10%
            if (code == "volDn") setVol(-.1);
            // volume buttons up by 10%
            if (code == "volUp") setVol(.1);
            // mute
			if (code == "mute") {
                if (video.muted) {
                    video.muted = false;
                    evt.target.src = this.imagePath + "vmute2.png";
                } else {
                    video.muted = true;
                    evt.target.src = this.imagePath + "vmute1.png";
                }
            }
            // Set loop
			if (code == "loop") {
                if (video.loop) {
                    video.loop = false;
                    evt.target.src = this.imagePath + "vloop2.png";
                } else {
                    video.loop = true;
                    evt.target.src = this.imagePath + "vloop1.png";
                }
            }
        } 
	};

	$.changeEffect = function (ef) {
		var e = document.getElementById(this.id + "_nmdrPS_effects");
        this.effect = typeof ef == "undefined" ? parseInt(e.options[e.selectedIndex].value) : ef;
		this.init3D();
	};
	
    $.changeImage = function (num, thumbx, albumChanged, callback) {
	
		if (this.inAnimation) return;

		this.inAnimation = true;
	
		var pnameNew = "";
		var pnameOld = "";
		var self = this;
		var al = this.albums[num];
		
		pnameNew = this.getImageName(al, thumbx);
		pnameOld = this.getImageName(al, al.currentPic);
		
		al.currentPic = thumbx;
	
		var cont = document.getElementById(this.id + "_nmdrPS_pbox" + num);		
		var tcont = document.getElementById(this.id + "_nmdrPS_sbox" + num + "_thumbs");
		
		var tms = tcont.getElementsByClassName("nmdrPS_thumbItem");
		for (var i=0; i < tms.length; i++) {
			tms[i].classList.remove("thumbSelected");
			if (i == thumbx) tms[i].classList.add("thumbSelected");
		}
		
		var afterChange  = function() { 
			self.createPicBox(num);
			self.inAnimation = false;
            if (callback) callback();
		};			
		
        switch (this.effect) {
			
			case 0: 
			case 2:
			case 3: 
			case 4: 
			case 5: this.effect_0_2_3_4_5(cont, pnameNew, pnameOld, afterChange); break;
			
			case 1:			
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11: this.effect_1_6_7_8_9_10_11(cont, pnameNew, pnameOld, afterChange); break;

			case 12:
			case 13: this.effect_12_13(cont, pnameNew, pnameOld, afterChange); break;
			
			case 14:
			case 15: this.effect_14_15(cont, pnameNew, pnameOld, afterChange); break;
			
			case 16:
			case 17:
			case 18:
			case 19: this.effect_16_17_18_19(cont, pnameNew, pnameOld, afterChange); break;
			
			case 20: this.effect_20(cont, pnameNew, pnameOld, afterChange); break;
			case 21: this.effect_21(cont, pnameNew, pnameOld, afterChange); break;		
			case 22: this.effect_22(cont, pnameNew, pnameOld, afterChange); break;		
			case 23: this.effect_23(cont, pnameNew, pnameOld, afterChange); break;		
			case 24: this.effect_24(cont, pnameNew, pnameOld, afterChange); break;		
			case 25: this.effect_25(cont, pnameNew, pnameOld, afterChange); break;		
			case 26: this.effect_26(cont, pnameNew, pnameOld, afterChange); break;		
			case 27: this.effect_27(cont, pnameNew, pnameOld, afterChange); break;	
			case 28: this.effect_28(cont, pnameNew, pnameOld, afterChange); break;	
			
			case 29: 
			case 30: 
			case 31: 
			case 32: this.effect_29_30_31_32(cont, pnameNew, pnameOld, afterChange); break;		
		}
	};
	
    $.effect_0_2_3_4_5 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		var hdir = this.effect == 2 || this.effect == 3 ? this.effect == 2 ? -1 : 1 : 0;
		var vdir = this.effect == 4 || this.effect == 5 ? this.effect == 4 ? -1 : 1 : 0;

		var bleft = hdir * -1 * this.albumWidth;
		var btop = vdir * -1 * this.albumHeight;
		
		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);'></div>");

		buf.push("<div class='back' " +
			"style='position:absolute;left:" + bleft + "px;top:" + btop + "px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
		
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
			
 			if (self.effect == 0) {
				nmdr.core.animate.fadeOut(null, front, 0.02, null, 
					function (args) { 
						nmdr.core.animate.fadeIn(null, back, 0.02, null, callback); 
					}
				);
			}
			else {
				var st = nmdr.core.animate.stepH / self.albumWidth;
				
				nmdr.core.animate.fadeOut(null, front, st);
				nmdr.core.animate.fadeIn(null, back, st);
				
				if (self.effect == 2 || self.effect == 3) {
					nmdr.core.animate.scroll(null, front, hdir * self.albumWidth, 0);
					nmdr.core.animate.scroll(null, back, hdir * self.albumWidth, 0, callback);
				}
				else {
					nmdr.core.animate.scroll(null, front, 0, vdir * self.albumHeight);
					nmdr.core.animate.scroll(null, back, 0, vdir * self.albumHeight, callback);
				}
			}
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_1_6_7_8_9_10_11 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);" +
			(this.effect == 1 ? "-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;" : "") +
			(this.effect == 6 ? "-webkit-transition: 1.5s; transition: 1.5s;-webkit-transform-style: preserve-3d; transform-style: preserve-3d;-webkit-transform:rotateX(180deg);transform:rotateX(180deg);" : "") + 
			(this.effect == 7 ? "-webkit-transition: 1.5s; transition: 1.5s;-webkit-transform-style: preserve-3d; transform-style: preserve-3d;-webkit-transform:rotateY(180deg);transform:rotateY(180deg);" : "") + 
 			(this.effect == 8 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(0,0);transform:scale(0,0);-webkit-transform-origin:bottom left;transform-origin:bottom left;" : "") + 
 			(this.effect == 9 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(0,0);transform:scale(0,0);" : "") + 
 			(this.effect == 10 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:rotate(0deg) scale(0,0);transform:rotate(0deg) scale(0,0);" : "") + 
	 		(this.effect == 11 ? "-webkit-transform: rotateY(-180deg);transform:rotateY(-180deg);-webkit-transition:1.5s;transition:1.5s;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;-webkit-transform-origin: center center; transform-origin: center center;" : "") + 
			"'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
			(this.effect == 1 ? "-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;" : "") +
			(this.effect == 6 ? "-webkit-transition: 1.5s; transition: 1.5s;-webkit-transform-style: preserve-3d; transform-style: preserve-3d;-webkit-transform:rotateX(0deg);transform:rotateX(0deg);" : "") + 
			(this.effect == 7 ? "-webkit-transition: 1.5s; transition: 1.5s;-webkit-transform-style: preserve-3d; transform-style: preserve-3d;-webkit-transform:rotateY(0deg);transform:rotateY(0deg);" : "") + 
 			(this.effect == 8 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(1,1);transform:scale(1,1);-webkit-transform-origin:top right;transform-origin:top right;" : "") + 
 			(this.effect == 9 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(1,1);transform:scale(1,1);" : "") + 
 			(this.effect == 10 ? "-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:rotate(0deg) scale(1,1);transform:rotate(0deg) scale(1,1);" : "") + 
			(this.effect == 11 ? "-webkit-transform:rotateY(0deg);transform:rotateY(0deg);-webkit-transition:1.5s;transition:1.5s;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;-webkit-transform-origin: center center; transform-origin: center center;" : "") + 
			"'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
			
			if (self.effect == 1) {
				front.style.opacity = 0;
				back.style.opacity = 1;
			}
			else if (self.effect == 6) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "rotateX(0deg)";
				back.style.webkitTransform  = "rotateX(0deg)";
				
				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "rotateX(180deg)";
				front.style.webkitTransform  = "rotateX(180deg)";
			}
			else if (self.effect == 7) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "rotateY(0deg)";
				back.style.webkitTransform  = "rotateY(0deg)";
				
				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "rotateY(180deg)";
				front.style.webkitTransform  = "rotateY(180deg)";
			}
			else if (self.effect == 8) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "scale(1,1)";
				back.style.transformOrigin = "top right";
				back.style.webkitTransform  = "scale(1,1)";
				back.style.webkitTransformOrigin  = "top right";
				
				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "scale(0,0)";
				front.style.transformOrigin = "bottom left";
				front.style.webkitTransform = "scale(0,0)";
				front.style.webkitTransformOrigin = "bottom left";
			}
			else if (self.effect == 9) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "scale(1,1)";
				back.style.webkitTransform = "scale(1,1)";

				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "scale(0,0)";
				front.style.webkitTransform = "scale(0,0)";
			}
			else if (self.effect == 10) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "rotate(360deg) scale(1,1)";
				back.style.webkitTransform = "rotate(360deg) scale(1,1)";

				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "rotate(360deg) scale(0,0)";
				front.style.webkitTransform = "rotate(360deg) scale(0,0)";
			}
			else if (self.effect == 11) {
				back.style.opacity = 1;
				back.style.filter = "alpha(opacity=1)";
				back.style.webkitFilter = "alpha(opacity=1)";
				back.style.transform = "rotateY(0deg)";
				back.style.webkitTransform = "rotateY(0deg)";

				front.style.opacity = 0;
				front.style.filter = "alpha(opacity=0)";
				front.style.webkitFilter = "alpha(opacity=0)";
				front.style.transform = "rotateY(180deg)";
				front.style.webkitTransform = "rotateY(180deg)";
			}

			self.afterTransition(front, callback);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_12_13 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		var sx = Math.round(this.albumWidth / this.slices);
		
		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 12 ? dx - 50 : dx2 - 50;

			buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;opacity:0;alpha(opacity=0);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateY(" + (this.effect == 12 ? "-180" : "180") + "deg) translateZ(1px);transition-delay:" + de + "ms;transform-origin:" + to + "px 0px;" +
			"-webkit-transition:1s;-webkit-transform:rotateY(" + (this.effect == 12 ? "-180" : "180") + "deg) translateZ(1px);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:" + to + "px 0px;" +
			"'></div>");
		}

		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 12 ? dx - 50 : dx2 - 50;
			
			buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateY(0deg);transition-delay:" + de + "ms;transform-origin:" + to + "px 0px;" +
			"-webkit-transition:1s;-webkit-transform:rotateY(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:" + to + "px 0px;" +
			"'></div>");
		}
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");
			
			for (var i=0; i < fs.length; i++) {				
				bs[i].style.opacity = 1;
				bs[i].style.filter = "alpha(opacity=1)";
				bs[i].style.webkitFilter = "alpha(opacity=1)";
				bs[i].style.transform = "rotateY(0deg) translateZ(1px)";
				bs[i].style.webkitTransform = "rotateY(0deg) translateZ(1px)";
				
				fs[i].style.opacity = 0;
				fs[i].style.filter = "alpha(opacity=0)";
				fs[i].style.webkitFilter = "alpha(opacity=0)";
				fs[i].style.transform = "rotateY(" + (self.effect == 8 ? "180" : "-180") + "deg)";
				fs[i].style.webkitTransform = "rotateY(" + (self.effect == 8 ? "180" : "-180") + "deg)";
			}
			
			self.afterTransition(bs[self.effect == 12 ? self.slices/2 : self.slices/2-1], callback);
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_14_15 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		var sx = Math.round(this.albumHeight / this.slices);
		
		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 14 ? dx - 50 : dx2 - 50;

			buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;opacity:0;alpha(opacity=0);" +
			"clip:rect(" + qx + "px," + this.albumWidth + "px," + dx + "px,0px);" +
			"transition:1s;transform:rotateX(" + (this.effect == 14 ? "-180" : "180") + "deg) translateZ(1px);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(" + (this.effect == 14 ? "-180" : "180") + "deg) translateZ(1px);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}

		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 14 ? dx - 50 : dx2 - 50;
			
			buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(" + qx + "px," + this.albumWidth + "px," + dx + "px,0px);" +
			"transition:1s;transform:rotateX(0deg);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
						
			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");
			
			for (var i=0; i < fs.length; i++) {			
				bs[i].style.opacity = 1;
				bs[i].style.filter = "alpha(opacity=1)";
				bs[i].style.webkitFilter = "alpha(opacity=1)";
				bs[i].style.transform = "rotateX(0deg) translateZ(1px)";
				bs[i].style.webkitTransform = "rotateX(0deg) translateZ(1px)";
				
				fs[i].style.opacity = 0;
				fs[i].style.filter = "alpha(opacity=0)";
				fs[i].style.webkitFilter = "alpha(opacity=0)";
				fs[i].style.transform = "rotateX(" + (self.effect == 10 ? "180" : "-180") + "deg)";
				fs[i].style.webkitTransform = "rotateX(" + (self.effect == 10 ? "180" : "-180") + "deg)";
			}
			
			self.afterTransition(bs[self.effect == 14 ? self.slices/2 : self.slices/2-1], callback);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_16_17_18_19 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		var sx = Math.round(this.albumWidth / this.slices);

		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 16 || this.effect == 18 ? dx - 50 : dx2 - 50;

			buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;opacity:0;alpha(opacity=0);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateX(" + (this.effect == 16 || this.effect == 18 ? "-180" : "180") + "deg);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(" + (this.effect == 16 || this.effect == 18 ? "-180" : "180") + "deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}
		
		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 16 || this.effect == 18 ? dx - 50 : dx2 - 50;

			buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateX(0deg);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}

		cont.innerHTML = buf.join("");
		cont.style.backgroundImage = this.effect == 16 || this.effect == 17 ? ("url('" + pnameOld + "')") : "none";

		var self = this;
		var doChange = function () {

			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");

			for (var i=0; i < fs.length; i++) {			
				bs[i].style.opacity = 1;
				bs[i].style.filter = "alpha(opacity=1)";
				bs[i].style.webkitFilter = "alpha(opacity=1)";
				bs[i].style.transform = "rotateX(0deg) translateZ(0px)";
				bs[i].style.webkitTransform = "rotateX(0deg) translateZ(0px)";
				
				fs[i].style.opacity = 0;
				fs[i].style.filter = "alpha(opacity=0)";
				fs[i].style.webkitFilter = "alpha(opacity=0)";
				fs[i].style.transform = "rotateX(" + (self.effect == 16 || self.effect == 18 ? "180" : "-180") + "deg)";
				fs[i].style.webkitTransform = "rotateX(" + (self.effect == 16 || self.effect == 18 ? "180" : "-180") + "deg)";
			}
			
			self.afterTransition(bs[self.effect == 16 || self.effect == 18 ? self.slices-1 : 0], callback);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_20 = function (cont, pnameNew, pnameOld, callback) {
	
        var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		var ra = nmdr.core.utils.resizeKeepingRatio(sx,sy,4,4);
        var sh = ra.width;
        var sv = ra.height;
        var self = this, animId;

		cont.style.backgroundImage = "url('" + pnameOld + "')";
		
		var doChange = function () {
            if (sh >= sx && sv >= sy) {
                cancelAnimationFrame(animId);
                callback();
                return;
            }
          	
            var buf = [];

            for (var i=0; i < self.boxes; i++) {
                var xx = i * sx;
                var dx = xx + sh > xx + sx ? xx + sx : xx + sh;

                for (var j=0; j < self.boxes; j++) {
                    var yy = j * sy;
                    var dy = yy + sv > yy + sy ? yy + sy : yy + sv;
                    
					// rect (top, right, bottom, left)
                    
                    buf.push("<div class='back' " + 
                    "style='position:absolute;left:0px;top:0px;width:" + self.albumWidth + "px;height:" + self.albumHeight + "px;" +
                    "backface-visibility:visible;background-image: url(\"" + pnameNew + "\");background-size:cover;" +
                    "clip:rect(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                    "clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                    "-webkit-clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                    "'></div>");
                }
            }
           
            sh += ra.width;
            sv += ra.height;
            cont.innerHTML = buf.join("");
			animId = requestAnimationFrame(doChange);
        };
		
        doChange();   
    };
	
    $.effect_21 = function (cont, pnameNew, pnameOld, callback) {
	
        var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		var ra = nmdr.core.utils.resizeKeepingRatio(sx,sy,4,4);
        var sh = ra.width;
        var sv = ra.height;
        var self = this, animId;
			
		cont.style.backgroundImage = "url('" + pnameOld + "')";
		
		//=== calculate diagonal indexes =======================
		
		var digs=[], calc=[], n=0,del=1;
		
		for (var i=0; i < this.boxes; i++) 
			for (var j=0; j < this.boxes; j++) digs[n] = n++;

		n=0;
		for (var i=0; i < this.boxes; i++) {
			calc[n++] = digs[i];
			for (var j=1; j <= i; j++) calc[n++] = digs[j * (this.boxes-1) + i];
		}
		
		for (var i=2; i <= this.boxes; i++) {
			calc[n++] = digs[i * (this.boxes-1) + (i-1)];
			for (var j=i+1; j <= this.boxes; j++) calc[n++] = digs[j * (this.boxes-1) + (i-1)];
		}
			
        var t = this.boxes, sepoint = 0;
        do { sepoint += (2 * t - 1); t -= 2; } while(t > 0);
		
        //=======================================================
		
		var doChange = function () {
            if (sh >= sx && sv >= sy) {
                cancelAnimationFrame(animId);
                callback();
                return;
            }
          	
            var buf = [];
            for (var i=0; i < sepoint; i++) {
                
                var x = calc[i] % self.boxes;
                var y = Math.floor(calc[i] / self.boxes);               
                
                var xx = x * sx;
                var dx = xx + sh > xx + sx ? xx + sx : xx + sh;

                var yy = y * sy;
                var dy = yy + sv > yy + sy ? yy + sy : yy + sv;
                    
				// rect (top, right, bottom, left)
                
                buf.push("<div class='back' " + 
                "style='position:absolute;left:0px;top:0px;width:" + self.albumWidth + "px;height:" + self.albumHeight + "px;" +
                "backface-visibility:visible;background-image: url(\"" + pnameNew + "\");background-size:cover;" +
                "clip:rect(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "-webkit-clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "'></div>");
            }
           
            sh += ra.width;
            sv += ra.height;
            cont.innerHTML = buf.join("");
			animId = requestAnimationFrame(doChange);
        };
		
        doChange();   
    };
	
    $.effect_22 = function (cont, pnameNew, pnameOld, callback) {
		
		var buf = [];
		var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx

			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buf.push("<div class='back' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(0,0);transform:scale(0,0);" +
				"'></div>");
			}
		}
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx
			
			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buf.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(1,1);transform:scale(1,1);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buf.join("");
		
		//=== calculate diagonal indexes
		
		var digs=[], calc=[], n=0, del=10;
		
		for (var i=0; i < this.boxes; i++) 
			for (var j=0; j < this.boxes; j++) digs[n] = n++;

		n=0;
		for (var i=0; i < this.boxes; i++) {
			calc[n++] = {index:digs[i], delay:del};
			for (var j=1; j <= i; j++) 
				calc[n++] = {index:digs[j * (this.boxes-1) + i], delay:del};
			del+=100;
		}
		
		for (var i=2; i <= this.boxes; i++) {
			calc[n++] = {index:digs[i * (this.boxes-1) + (i-1)], delay:del};
			for (var j=i+1; j <= this.boxes; j++) 
				calc[n++] = {index:digs[j * (this.boxes-1) + (i-1)], delay:del};
			del+=100;
		}
			
		//=============
			
		var self = this;
		var doChange = function () {		
			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");
		
			for (var i=0; i < calc.length; i++) {
				var x = calc[i].index;		
				bs[x].style.opacity = 1;
				bs[x].style.filter = "alpha(opacity=1)";
				bs[x].style.webkitFilter = "alpha(opacity=1)";
				bs[x].style.transform = "scale(1,1)";
				bs[x].style.webkitTransform = "scale(1,1)";
				bs[x].style.transitionDelay = calc[i].delay + "ms";
				bs[x].style.webkitTransitionDelay = calc[i].delay + "ms";
				   
				fs[x].style.opacity = 0;
				fs[x].style.filter = "alpha(opacity=0)";
				fs[x].style.webkitFilter = "alpha(opacity=0)";
				fs[x].style.transform = "scale(0,0)";
				fs[x].style.webkitTransform = "scale(0,0)";
				fs[x].style.transitionDelay = calc[i].delay + "ms";
				fs[x].style.webkitTransitionDelay = calc[i].delay + "ms";
			}
			
			self.afterTransition(bs[i-1], callback);
		};
		
		setTimeout(doChange, 50);
	};
    
	$.effect_23 = function (cont, pnameNew, pnameOld, callback) {
		
		var buf = [];
		var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx

			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buf.push("<div class='back' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:center center;transition:transform 1.5s;transform:rotateY(-180deg) translateZ(1px);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:center center;-webkit-transition:transform 1.5s;-webkit-transform:rotateY(-180deg) translateZ(1px);" +
				"'></div>");
			}
		}
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx
			
			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buf.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:center center;transition:transform 1.5s;transform:rotateX(0deg);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:center center;-webkit-transition:transform 1.5s;-webkit-transform:rotateX(0deg);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buf.join("");
		cont.style.backgroundImage = "url('" + pnameOld + "')";
		
		var self = this;
		var doChange = function () {

			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");
		
			for (var i=0; i < bs.length; i++) {
				var del = Math.floor((Math.random() * 1000) + 1);
				bs[i].style.opacity = 1;
				bs[i].style.filter = "alpha(opacity=1)";
				bs[i].style.webkitFilter = "alpha(opacity=1)";
				bs[i].style.transform = "rotateY(0deg)";
				bs[i].style.webkitTransform = "rotateY(0deg)";
				bs[i].style.transitionDelay = del + "ms";
				bs[i].style.webkitTransitionDelay = del + "ms";
				
				fs[i].style.opacity = 1;
				fs[i].style.filter = "alpha(opacity=1)";
				fs[i].style.webkitFilter = "alpha(opacity=1)";
				fs[i].style.transform = "rotateX(180deg)";
				fs[i].style.webkitTransform = "rotateX(180deg)";
				fs[i].style.transitionDelay = del + "ms";
				fs[i].style.webkitTransitionDelay = del + "ms";
			}
			
			self.afterTransition(bs[i-1], callback);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_24 = function (cont, pnameNew, pnameOld, callback) {
		
		var buf = [];
		var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx
			var to = dx - sx / 2;

			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				var ro = dy - sy / 2;
				buf.push("<div class='back' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:" + to + "px " + ro + "px;transition:transform 1.5s;transform:rotateY(-180deg) translateZ(1px);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:" + to + "px " + ro + "px;-webkit-transition:transform 1.5s;-webkit-transform:rotateY(-180deg) translateZ(1px);" +
				"'></div>");
			}
		}
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx
			var to = dx - sx / 2;
			
			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				var ro = dy - sy / 2;
				buf.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:" + to + "px " + ro + "px;transition:transform 1.5s;transform:rotateX(0deg);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:" + to + "px " + ro + "px;-webkit-transition:transform 1.5s;-webkit-transform:rotateX(0deg);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			
			//=== calculate diagonal indexes
			
			var digs=[], calc=[], n=0, del=10;
			
			for (var i=0; i < self.boxes; i++) {
				for (var j=0; j < self.boxes; j++) {
					digs[n] = n++;
				}			
			}
			
			n=0;
			for (var i=0; i < self.boxes; i++) {
				calc[n++] = {index:digs[i], delay:del};
				for (var j=1; j <= i; j++) {
					calc[n++] = {index:digs[j * (self.boxes-1) + i], delay:del};
				}
				del+=100;
			}
			
			for (var i=2; i <= self.boxes; i++) {
				calc[n++] = {index:digs[i * (self.boxes-1) + (i-1)], delay:del};
				for (var j=i+1; j <= self.boxes; j++) {
					calc[n++] = {index:digs[j * (self.boxes-1) + (i-1)], delay:del};
				}
				del+=100;
			}
			
			//=============
			
			cont.style.backgroundImage = "url('" + pnameOld + "')";
			
			var fs = cont.getElementsByClassName("front");
			var bs = cont.getElementsByClassName("back");
		
			for (var i=0; i < calc.length; i++) {
				var x = calc[i].index;		
				bs[x].style.opacity = 1;
				bs[x].style.filter = "alpha(opacity=1)";
				bs[x].style.webkitFilter = "alpha(opacity=1)";
				bs[x].style.transform = "rotateY(0deg)";
				bs[x].style.webkitTransform = "rotateY(0deg)";
				bs[x].style.transitionDelay = calc[i].delay + "ms";
				bs[x].style.webkitTransitionDelay = calc[i].delay + "ms";
				   
				fs[x].style.opacity = 1;
				fs[x].style.filter = "alpha(opacity=1)";
				fs[x].style.webkitFilter = "alpha(opacity=1)";
				fs[x].style.transform = "rotateX(180deg)";
				fs[x].style.webkitTransform = "rotateX(180deg)";
				fs[x].style.transitionDelay = calc[i].delay + "ms";
				fs[x].style.webkitTransitionDelay = calc[i].delay + "ms";
			}
			
			self.afterTransition(bs[i-1], callback);
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_25 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		this.holeOut_Style(buf);
		this.swashin_Style(buf);
		
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;opacity:0;alpha(opacity=0);" +
			"-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
						
			back.classList.add("swashin");			
			front.classList.add("holeOut");
			
			self.afterAnimation(front, 
				function() { 
					back.classList.remove("swashin");
					front.classList.remove("holeOut");
					callback();
				}
			);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_26 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		this.boingOutDown_Style(buf);
		this.boingInUp_Style(buf);
		
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
						
			back.classList.add("boingInUp");			
			front.classList.add("boingOutDown");
			
			self.afterAnimation(front, 
				function() { 
					// since bug in css event!
					setTimeout(function() { 
						back.classList.remove("boingInUp");
						front.classList.remove("boingOutDown");
						callback();
					}, 3800);
				}
			);
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_27 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		this.slideDown_Style(buf);
		this.slideUp_Style(buf);
		
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;pointer-events:auto;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
						
			back.classList.add("slideUp");			
			front.classList.add("slideDown");
			
			self.afterAnimation(front, 
				function() { 
					back.classList.remove("slideUp");
					front.classList.remove("slideDown");
					callback();
				}
			);
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_28 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		this.slideLeft_Style(buf);
		this.slideRight_Style(buf);
		
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
						
			back.classList.add("slideLeft");			
			front.classList.add("slideRight");
			
			self.afterAnimation(front, 
				function() { 
					back.classList.remove("slideLeft");
					front.classList.remove("slideRight");
					callback();
				}
			);
		};
		
		setTimeout(doChange, 50);
	};
	
    $.effect_29_30_31_32 = function (cont, pnameNew, pnameOld, callback) {
		var buf = [];
		
		var e1 = this.effect == 29 || this.effect == 30;
		var e2 = this.effect == 29 || this.effect == 32;
		
		this.slideCubeOut_Style(buf, e1 ? true : false, e2 ? 1 : -1);
		this.slideCubeIn_Style(buf, e1 ? true : false, e2 ? 1 : -1);
		
        buf.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;'></div>");

		buf.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;'></div>");
		
		cont.innerHTML = buf.join("");
		
		var self = this;
		var doChange = function () {

			//document.getElementById(self.id + '_nmdrPS_root').style.overflow = 'visible';

            var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
						
			back.classList.add("cubeIn");			
			front.classList.add("cubeOut");
			           
			self.afterAnimation(back, 
				function() { 
					back.classList.remove("cubeIn");
					front.classList.remove("cubeOut");
					//document.getElementById(self.id + '_nmdrPS_root').style.overflow = 'hidden';
					callback();
				}
			);
		};
		
		setTimeout(doChange, 50);
	};
    
	$.holeOut_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes holeOut ");
		buf.push("{0% {opacity:1;transform-origin:50% 50%;transform:scale(1,1) rotateY(0deg);}");
		buf.push("100% {opacity:0;transform-origin:50% 50%;transform:scale(0,0) rotateY(180deg);}}");
		buf.push(".holeOut {animation-duration:2s;animation-fill-mode:both;animation-name: holeOut;}");
		buf.push("</style>");
	};
	
	$.swashin_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes swashin ");
		buf.push("{0% {opacity:0;transform-origin:50% 50%;transform:scale(0,0);}");
		buf.push("90% {opacity:1;transform-origin:50% 50%;transform:scale(0.9,0.9);}");
		buf.push("100% {opacity:1;transform-origin:50% 50%;transform:scale(1,1);}}");
		buf.push(".swashin {animation-duration:2s;animation-fill-mode:both;animation-name: swashin;}");
		buf.push("</style>");
	};
	
	$.boingOutDown_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes boingOutDown ");
		buf.push("{0% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}");
		buf.push("20% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(5deg);}");
		buf.push("30% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}");
		buf.push("40% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(10deg) rotateY(10deg);}");
		buf.push("100% {opacity:0;transform-origin:100% 100%;transform:perspective(800px) rotateX(90deg) rotateY(0deg);}}");
		buf.push(".boingOutDown {animation-duration:1s;animation-fill-mode:both;animation-name: boingOutDown;}");
		buf.push("</style>");
	};
	
	$.boingInUp_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes boingInUp ");
		buf.push("{0% {opacity:0;transform-origin:50% 0%;transform:perspective(800px) rotateX(-90deg);}");
		buf.push("50% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(50deg);}");
		buf.push("100% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(0deg);}}");
		buf.push(".boingInUp {animation-duration:5s;animation-fill-mode:both;animation-name: boingInUp;}");
		buf.push("</style>");
	};
	
	$.slideDown_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes slideDown ");
		buf.push("{0% {transform-origin: 0 0;transform: translateY(0%);}");
		buf.push("100% {transform-origin: 0 0;transform: translateY(100%);}}");
		buf.push(".slideDown {animation-duration:1s;animation-fill-mode:both;animation-name: slideDown;}");
		buf.push("</style>");
	};

	$.slideUp_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes slideUp ");
		buf.push("{0% {transform-origin: 0 0;transform: translateY(100%);}");
		buf.push("100% {transform-origin: 0 0;transform: translateY(0%);}}");
		buf.push(".slideUp {animation-duration:1s;animation-fill-mode:both;animation-name: slideUp;}");
		buf.push("</style>");
	};
	
	$.slideLeft_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes slideLeft ");
		buf.push("{0% {transform-origin: 0 0;transform: translateX(100%);}");
		buf.push("100% {transform-origin: 0 0;transform: translateX(0%);}}");
		buf.push(".slideLeft {animation-duration:1s;animation-fill-mode:both;animation-name: slideLeft;}");
		buf.push("</style>");
	};

	$.slideRight_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes slideRight ");
		buf.push("{0% {transform-origin: 0 0;transform: translateX(0%);}");
		buf.push("100% {transform-origin: 0 0;transform: translateX(100%);}}");
		buf.push(".slideRight {animation-duration:1s;animation-fill-mode:both;animation-name: slideRight;}");
		buf.push("</style>");
	};
	
	$.slideCubeOut_Style = function (buf, ho, dir) {
		
		var tz = ho ? (this.albumWidth / 2) : (this.albumHeight / 2);
		var rp = ho ? dir == 1 ? "rotateY(0deg)" : "rotateY(0deg)" : dir == 1 ? "rotateX(0deg)" : "rotateX(0deg)";
		var rq = ho ? dir == 1 ? "rotateY(90deg)" : "rotateY(-90deg)" : dir == 1 ? "rotateX(90deg)" : "rotateX(-90deg)";
		
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes cubeOut ");
		buf.push("{0% {transform: " + rp + " translateZ(" + tz + "px);opacity:1;visibility:visible;}");
		buf.push("100% {transform: " + rq + " translateZ(" + tz + "px);opacity:0;visibility:hidden;}}");
		buf.push(".cubeOut {animation-duration:2s;animation-timing-function:cubic-bezier(0.5,0.9,0.5,1);animation-name: cubeOut;}");
		buf.push("</style>");
	};
    
	$.slideCubeIn_Style = function (buf, ho, dir) {
		
		var tz = ho ? (this.albumWidth / 2) : (this.albumHeight / 2);
		var rp = ho ? dir == 1 ? "rotateY(-90deg)" : "rotateY(90deg)" : dir == 1 ? "rotateX(-90deg)" : "rotateX(90deg)";
		var rq = ho ? dir == 1 ? "rotateY(0deg)" : "rotateY(0deg)" : dir == 1 ? "rotateX(0deg)" : "rotateX(0deg)";

		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes cubeIn ");
		buf.push("{0% {transform: " + rp + " translateZ(" + tz + "px);opacity:0;visibility:visible;}");
		buf.push("100% {transform: " + rq + " translateZ(" + tz + "px);opacity:1;visibility:hidden;}}");
		buf.push(".cubeIn {animation-duration:2s; animation-timing-function:cubic-bezier(0.5,0.9,0.5,1);animation-name: cubeIn;}");
		buf.push("</style>");
	};   
    
	$.slideKenBurns_Style = function (buf) {
		buf.push("<style type=\"text/css\">");
		buf.push("@keyframes KenBurns { ");
		buf.push("0% {opacity:1;transform:scale(1);-ms-transform:scale(1); }");
		buf.push("5% {opacity:1}");
		buf.push("25% {opacity:1;}");
		buf.push("50% {opacity:1;transform:scale(1.4);-ms-transform:scale(1.4);}");
		buf.push("100% {opacity:1;transform:scale(1);-ms-transformm:scale(1);}}");
		 
		buf.push("@-o-keyframes KenBurns { ");
		buf.push("0% {opacity:1;-o-transform:scale(1);}");
		buf.push("5% {opacity:1}");
		buf.push("25% {opacity:1;}");
		buf.push("50% {opacity:1;-o-transform:scale(1.4);}");
		buf.push("100% {opacity:1;-o-transformm:scale(1);}}");

		buf.push("@-moz-keyframes KenBurns { ");
		buf.push("0% {opacity:1;-moz-transform:scale(1.4);}");
		buf.push("5% {opacity:1}");
		buf.push("25% {opacity:1;}");
		buf.push("50% {opacity:1;-moz-transform:scale(1.4);}");
		buf.push("100% {opacity:1;-moz-transformm:scale(1);}}");
		 
		buf.push("@-webkit-keyframes KenBurns { ");
		buf.push("0% {opacity:1;-webkit-transform:scale(1);}");
		buf.push("5% {opacity:1}");
		buf.push("25% {opacity:1;}");
		buf.push("50% {opacity:1;-webkit-transform:scale(1.4);}");
		buf.push("100% {opacity:1;-webkit-transformm:scale(1);}}");
		
		buf.push(".KenBurns {animation: KenBurns " + this.autoplayDelay + "ms linear infinite 0s;}");
		buf.push(".KenBurns {-o-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buf.push(".KenBurns {-moz-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buf.push(".KenBurns {-webkit-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buf.push("</style>");
	};
	
	$.afterAnimation = function (elem, callback) {
		var tname = "";
		var names = {
		  "WebkitAnimation":"webkitAnimationEnd",
		  //"MozAnimation":"mozAnimationEnd",
		  "OAnimation":"oAnimationEnd",
		  "animation":"animationend"
		};

		for (var name in names) {
			if (elem.style[name] !== undefined) {
				tname = names[name];
				break;
			}
		}

		var tc = function() { 
			elem.removeEventListener(tname, tc); 
			callback(); 
		};
		
		elem.addEventListener(tname, tc, false);	
	};

	$.afterTransition = function (elem, callback) {
		var self = this, tname = "";
		var names = {
		  "WebkitTransition":"webkitTransitionEnd",
		  //"MozTransition":"mozTransitionend",
		  "OTransition":"oTransitionEnd",
		  "transition":"transitionend"
		};

		for (var name in names) {
			if (elem.style[name] !== undefined) {
				tname = names[name];
				break;
			}
		}
		
		var tc = function() {
			elem.removeEventListener(tname, tc);
			callback();
		};
		
		elem.addEventListener(tname, tc, false);
	};

    $.createTestAlbum = function () {
		
		var data = {
			width: 980, 
			height: 580, 
			thumbWidth: 100, 
			thumbHeight: 68, 
			originWidth: 1366,
			originHeight: 768,
			imagePath: "img/pixshow/",
			
			albums:  
			[
				{
					title: "Bing pictures - July 2016",
					description: "Bing pictures of july 2016",
					
					url: "file:///C:/SPU/works/javascript/nmdrToolkits/img/pixshow/bing/2016/",
					path: "july/",
					image: "july.jpg",
					picname: null,
					order: false,
					picsCount: -1,
					pics: [
						{name:"CoraciasGarrulus_EN-US7934186588_1366x768.jpg",desc:"Coracias Garrulus",video:false},
						{name:"BloodMoon_GettyRM_495644264_768_EN-US.jpg",desc:"Blood Moon",video:true},
						{name:"DiaDosNamorados_EN-US10842918196_1366x768.jpg",desc:"Dia Dos Namorados",video:false},
						{name:"MuizenbergSA_EN-US9176714978_1366x768.jpg",desc:"Muizenberg SA",video:false},
						{name:"PatrioticLifeguard_EN-US9848917371_1366x768.jpg",desc:"Patriotic Lifeguard",video:false},
						{name:"SpottedPorcupinefish_EN-US11134793223_1366x768.jpg",desc:"Spotted Porcupinefish",video:false},
						{name:"WatchmanPeak_EN-US13273452928_1366x768.jpg",desc:"Watchman Peak",video:false},
						{name:"ZanzibarRedColobus_EN-US10197417600_1366x768.jpg",desc:"Zanzibar RedColobus",video:false},
					]
				},
				{
					title: "Bing pictures - August 2016",
					description: "Bing pictures of agust 2016",
					url: "file:///C:/SPU/works/javascript/nmdrToolkits/img/pixshow/bing/2016/",
					path: "august/",
					image: "august.jpg",
					picname: null,
					order: false,
					picsCount: -1,
					pics: [
						{name:"AddoElephants_EN-US13305434742_1366x768.jpg",desc:"Addo Elephants",video:false},
						{name:"ChicagoHarborLH_EN-US10112554534_1366x768.jpg",desc:"Chicago Harbor LH",video:false},
						{name:"GFLions_EN-US11413405777_1366x768.jpg",desc:"G F Lions",video:false},
						{name:"CircularIncaTerraces_EN-US11717004365_1366x768.jpg",desc:"Circular IncaTerraces",video:false},
						{name:"HarbinOperaHouse_EN-US10126072780_1366x768.jpg",desc:"Harbin Opera House",video:false},
						{name:"KerichoTea_EN-US6909044062_1366x768.jpg",desc:"Kericho Tea",video:false},
						{name:"Matterhorn_3_nimia-4K_336262_768_EN-US.jpg",desc:"Matterhorn",video:true},
						{name:"KingFisherPhoto_EN-US13774465411_1366x768.jpg",desc:"King Fisher Photo",video:false},
						{name:"MariaLenkDive_EN-US10833846465_1366x768.jpg",desc:"Maria Lenk Dive",video:false},
						{name:"RedSea_CoralReef_Getty-RF-534019530_768_EN-US.jpg",desc:"RedSea CoralReef Getty-RF",video:true},
						{name:"PortageValley_EN-US8340194401_1366x768.jpg",desc:"Portage Valley",video:false},
						{name:"SP_Dartmoor_NtlPark_Sunset_Nimia_4K_239546_768_EN-US.jpg",desc:"SP Dartmoor NtlPark Sunset Nimia",video:true},
					]
				},
				{
					title: "Bing pictures - September 2016",
					description: "Bing pictures of september 2016",
					url: "file:///C:/SPU/works/javascript/nmdrToolkits/img/pixshow/bing/2016/",
					path: "september/",
					image: "september.jpg",
					picname: null,
					order: false,
					picsCount: -1,
					pics: [
						{name:"SnowdoniaAlgae_EN-US14782527027_1366x768.jpg",desc:"Snowdonia Algae",video:false},
						{name:"SalteeGannets_EN-US13464110436_1366x768.jpg",desc:"Saltee Gannets",video:false},
						{name:"Meteora_Greece_Nimia_4K_315956_768_EN-US.jpg",desc:"Meteora",video:true},
						{name:"MoscowSkyline_EN-US10373876477_1366x768.jpg",desc:"Moscow Skyline",video:false},
						{name:"StatenIsland911_EN-US11413128946_1366x768.jpg",desc:"Staten Island911",video:false},
						{name:"TalkLikeAPirate_EN-US8324063595_1366x768.jpg",desc:"Talk Like A Pirate",video:false},
						{name:"UmpquaLichen_EN-US10319432488_1366x768.jpg",desc:"Umpqua Lichen",video:false},
						{name:"Waterfalls_Phnom_Kulen_Natl_Park_shutterstock_5582423_768_EN-US.jpg",desc:"Waterfalls Phnom Kulen",video:true},
						{name:"Castelmezzano_EN-US11750585825_1366x768.jpg",desc:"Castelmezzano",video:false},
						{name:"RedSeaWhip_EN-US9130505730_1366x768.jpg",desc:"RedSea Whip",video:false},
						{name:"MochoPuma_EN-US14722409029_1366x768.jpg",desc:"Mocho Puma",video:false},
					]
				},
			]
		};
        return data;	
    };
	
    return $;
}

//@FN:#nmdrVideo
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
#  nmdrVideo
#
#  Version: 1.00.00#  Date: November 25. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrVideo(id) {
    
	var $ = nmdr.core.$(id, "nmdrVideo");
	if ($ == null) return;

    $.imagePath = "img/pixshow/";
	$.videoname = null;
	$.poster = null;
	$.video = null;
	
	$.init = function(videoname, poster, width, height) {
		
		this.videoname = videoname;
		this.poster = poster;
		
		var id = this.id, imp = this.imagePath, buf=[];
				
        buf.push("<style type='text/css'>video{width:100% !important;height:auto !important;z-index:-1;}");
		buf.push(".vbox {position:absolute;left:0px;top:0px;width:100%;height:100%;background-size:cover;background-image: url(\"" + this.poster + "\");}");
		buf.push(".vbar {display:block;position:absolute;width:240px;height:40px;left:10px;bottom:10px;opacity:0;transition: all 500ms ease-in-out;}");
		buf.push(".vbox:hover .vbar {opacity:1 !important;}</style>");
		
		buf.push("<div class='vbox' id='" + this.id + "_vbox'>");
		buf.push("<div class='vbar' id='" + this.id + "_vbar'>");
		buf.push("<table border=0, cellpadding=0, cellspacing=0, width=100% height=100% style='background:#333333'><tr>");
		buf.push("<td>&nbsp;&nbsp;</td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrestart.png' title='Restart' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'restart')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vloop1.png' title='Loop' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'loop')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgobegin.png' title='Go begin' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event, 'begin')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vplay.png' title='Play' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'play')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgoend.png' title='Go end' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'end')\"></td>"); 
		buf.push("<td>&nbsp;&nbsp;</td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vslower.png' title='Slower' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'slower')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vnormal.png' title='Normal' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'normal')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vfaster.png' title='Faster' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'faster')\"></td>"); 
		buf.push("<td>&nbsp;&nbsp;</td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrewind.png' title='Rewind' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'rew')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vforward.png' title='Forward' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'fwd')\"></td>"); 
		buf.push("<td>&nbsp;&nbsp;</td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vmute2.png' title='Mute' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'mute')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvoldown.png' title='Volume down' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'volDn')\"></td>"); 
		buf.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvolup.png' title='Volume up' style='cursor:pointer;' onclick=\"nmdr.core.$('" + id + "').handleVideo(event,'volUp')\"></td>"); 
		buf.push("<td>&nbsp;&nbsp;</td>"); 
		buf.push("</tr></table></div></div>");
		
		var aspectRatio = height / width;
		this.style.height = Math.ceil(this.offsetWidth * aspectRatio) + "px";

		this.innerHTML = buf.join("");
		this.handleVideo(null, "init");
	};

    $.handleVideo = function (evt, code) {
        var self = this;
				
		if (code == "init") {

			this.video = document.createElement("video");
			this.video.id = this.id + "_video";
			this.video.src = this.videoname;
			this.video.poster = this.poster;
			this.video.controls = false;
			this.video.autoPlay = true;
			this.video.preload = true;
			this.video.loop = true;
			this.video.addEventListener("error", function(err) { errMessage(err); }, true);
			this.video.load();
			
			this.video.onloadeddata = function() {}; 
			
			this.video.onended = function() {
				if (!self.video.loop) {
					var vcc = document.getElementById(self.id + "_vbar").getElementsByClassName("vc");
					vcc[3].src = self.imagePath + "vplay.png";
					self.video.pause();
				}
			};
			
			document.getElementById(this.id + "_vbox").appendChild(this.video);
			return true;
		}
		
		var video = this.video;
		
        if (video.canPlayType) { // tests that we have HTML5 video support
		
            // helper functions

            //  play video
            var vidplay = function(evt) {
                if (video.src == "") { // inital source load
                    getVideo();
                }
                var button = evt.target; //  get the button id to swap the text based on the state                                    
                if (video.paused) { // play the file, and display pause symbol					
					video.play();
                    button.src = self.imagePath + "vpause.png";
					button.title = "Pause";
                } else { // pause the file, and display play symbol  
                    video.pause();
                    button.src = self.imagePath + "vplay.png";
 					button.title = "Play";
                }
            };

            //  button helper functions 
            //  skip forward, backward, or restart
            var setTime = function(tValue) {
                //  if no video is loaded, this throws an exception 
                try {
                    if (tValue == 0) {
                        video.currentTime = tValue;
                    } else {
                        video.currentTime += tValue;
                    }

                } catch (err) {
                    // errMessage(err) // show exception
                    errMessage("Video content might not be loaded");
                }
            };

            //  display an error message 
            var errMessage = function(msg) { alert(msg); };

            // change volume based on incoming value 
            var setVol = function(value) {
                var vol = video.volume;
                vol += value;
                //  test for range 0 - 1 to avoid exceptions
                if (vol >= 0 && vol <= 1) {
                    // if valid value, use it
                    video.volume = vol;
                } else {
                    // otherwise substitute a 0 or 1
                    video.volume = (vol < 0) ? 0 : 1;
                }
            };

            // Set src == latest video file URL
            if (code == "loadVideo") getVideo();
			//  Play
            if (code == "play") vidplay(evt);
			//  Go begin
            if (code == "begin") setTime(0);
			//  Go end
            if (code == "end") setTime(1000); // ???? todo
            //  Restart
            if (code == "restart") setTime(0);
            //  Skip backward 10 seconds
            if (code == "rew") setTime(-10);
            //  Skip forward 10 seconds
            if (code == "fwd") setTime(10);           
            // playback speed buttons
            if (code == "slower") video.playbackRate -= .25;
            if (code == "faster") video.playbackRate += .25;
            if (code == "normal") video.playbackRate = 1;
			
             // volume buttons down by 10%
            if (code == "volDn") setVol(-.1);
            // volume buttons up by 10%
            if (code == "volUp") setVol(.1);
            // mute
			if (code == "mute") {
                if (video.muted) {
                    video.muted = false;
                    evt.target.src = this.imagePath + "vmute2.png";
                } else {
                    video.muted = true;
                    evt.target.src = this.imagePath + "vmute1.png";
                }
            }
            // Set loop
			if (code == "loop") {
                if (video.loop) {
                    video.loop = false;
                    evt.target.src = this.imagePath + "vloop2.png";
                } else {
                    video.loop = true;
                    evt.target.src = this.imagePath + "vloop1.png";
                }
            }
        } 
	};
		
	return $;
}

//@FN:#nmdrTeaser
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
#  nmdrTeaser
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTeaser(id) {
	
	var $ = nmdr.core.$(id, "nmdrTeaser");
	if ($ == null) return;

    $.width = 0;
    $.height = 0;
    $.imagePath = "";
    $.paddingH = 2;
    $.paddingV = 2;
    $.teaserWidth = 150;
    $.teaserExpWidth = 0;
    $.expandAllowed = true;
    $.naviWidth = 45;
    $.firstTeaser = 0;
    $.expandedTeaser = 0;
    $.expanding = false;
    $.collapsing = false;
    $.moving = false;
    $.smallImgSize = [133, 100];
    $.bigImgSize = [330, 247];
    $.items = [];

    $.addItem = function (image, title, smallText, bigText, url) {
        var num = this.items.length + 1;
        var item = { "num": num, "image": image, "title": title, "smallText": smallText, "bigText": bigText, "url": url, "displayed": false, "expanded": false };
        this.items.push(item);
    };

    $.init = function (width, height, imagePath) {

        this.width = width;
        this.height = height;
        this.imagePath = imagePath;

        this.style.position = "relative";
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.background = "#eee";
        this.style.padding = "0px";
        this.style.border = "1px";
        this.style.borderStyle = "solid";
        this.style.borderColor = "lightgray";
        this.style.boxShadow = "5px 5px 5px #ccc";

        this.teaserExpWidth = this.width - this.naviWidth * 2 - this.teaserWidth * 2 - 6 * this.paddingH;

        if (this.items.length > 0) this.items[0].expanded = true;

        this.build();
		
        nmdr.core.animate.setData(8, 6);
    };

    $.build = function () {

        var style =
			"<style type='text/css'>" +
			"a { text-decoration:none; color:#000000; }" +

			".nmdrTE_img {box-shadow: 5px 5px 5px #ddd; -webkit-box-shadow: 5px 5px 5px #ddd; -moz-box-shadow: 5px 5px 5px #ddd;}" +
			".nmdrTE_navi {background-color:#4888CD; padding:0px;}" +
			".nmdrTE_navi:hover {}" +

			"#" + this.id + "nmdrTE_naviBW {position:absolute; left:" + this.paddingH + "px; top:" + this.paddingV + "px; " +
				"width:" + this.naviWidth + "px; height:" + (this.height - 2 * this.paddingV) + "px;}" +
			"#" + this.id + "nmdrTE_naviFW {position:absolute; left:" + (this.teaserExpWidth + 2 * this.teaserWidth + this.naviWidth + 5 * this.paddingH) + "px; top:" +
				this.paddingV + "px; " + "width:" + this.naviWidth + "px; height:" + (this.height - 2 * this.paddingV) + "px;}" +
			"#" + this.id + "nmdrTE_naviBWImg {width:12px; height:23px; position:absolute; top:50%; left:50%; margin-left:-6px; margin-top:-12px; " +
				"background-position: -43px -3px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +
			"#" + this.id + "nmdrTE_naviFWImg {width:12px; height:23px; position:absolute; top:50%; left:50%; margin-left:-6px; margin-top:-12px; " +
				"background-position: -30px -3px; background-image: url('" + this.imagePath + "favoritenSprite.png');}" +

			".nmdrTE_teaserArea {overflow:hidden; position:absolute; padding:0px;}" +
			"#" + this.id + "nmdrTE_area {left:" + (this.naviWidth + 2 * this.paddingH) + "px; " +
				"top:" + this.paddingV + "px; width:" + (this.width - 2 * this.naviWidth - 4 * this.paddingH) + "px; " +
				"height:" + (this.height - 2 * this.paddingV) + "px;}" +

			".nmdrTE_teaserView {position:absolute; left:0px; top:0px;}" +
			".nmdrTE_teaserItem: {background:" + this.background + ";}" +
			".nmdrTE_teaserItem:hover {background:url('" + this.imagePath + "teaserbg.png') !important;}" +

			".nmdrTE_smlTeaserTitle {vertical-align:top;text-align:left;height:60px; padding-top:5px;font-family:arial,Helvetica,sans-serif;font-size:16px;font-style:normal;font-weight:normal;text-decoration:none;}" +
			".nmdrTE_smlTeaserImage {vertical-align:top;height:" + (this.smallImgSize[1] + 10) + "px;}" +
			".nmdrTE_smlTeaserText {vertical-align:top;text-align:left;font-family:arial,Helvetica,sans-serif;font-size:13px;font-style:normal;}" +
			".nmdrTE_bigImg {text-align:left;vertical-align:top;padding-top:5px;}" +
			".nmdrTE_bigTeaserTextArea {vertical-align:top; padding-top:5px;}" +
			".nmdrTE_bigTeaserTitle {text-align:left;vertical-align:top;height:60px;padding-left:5px;font-family:arial,Helvetica,sans-serif;font-size:18px;font-style:normal;font-weight:normal;text-decoration:none;}" +
			".nmdrTE_bigTeaserText {line-height:20px;vertical-align:top;text-align:left;padding-left:5px;font-family:arial,Helvetica,sans-serif;font-size:13px;font-style:normal;}" +
			".nmdrTE_titleLink:hover {color:orange}" +
		"</style>";

        var prev = this.firstTeaser != 0;
        var next = this.firstTeaser < this.items.length - 3;

        var prevSwitch =
			"<div class='nmdrTE_navi' id='" + this.id + "nmdrTE_naviBW' " +
			(prev ? "onmouseover=\"this.style.cursor='pointer';this.style.opacity=0.7;\" onmouseout=\"this.style.opacity=1;\" " +
			"onclick=\"nmdr.core.$('" + this.id + "').goBackward();\"><div id='" + this.id + "nmdrTE_naviBWImg'></div>" : ">") + "</div>";

        var nextSwitch =
			"<div class='nmdrTE_navi' id='" + this.id + "nmdrTE_naviFW' " +
			(next ? "onmouseover=\"this.style.cursor='pointer';this.style.opacity=0.7;\" onmouseout=\"this.style.opacity=1;\" " +
			"onclick=\"nmdr.core.$('" + this.id + "').goForward();\"><div id='" + this.id + "nmdrTE_naviFWImg'></div>" : ">") + "</div>";

        var buf = [];

        buf.push(style);
        buf.push(prevSwitch);
        buf.push(this.createTeasers());
        buf.push(nextSwitch);

        this.innerHTML = buf.join("");
        this.expandTeaser(this.items[this.expandedTeaser].num);
    };

    $.createTeasers = function () {
        var le = 0;

		var buf = [];
		buf.push("<div class='nmdrTE_teaserArea' id='" + this.id + "nmdrTE_area'>");
		buf.push("<div class='nmdrTE_teaserView' id='" + this.id + "_nmdrTE_teaserView'>");
		
        for (var i = this.firstTeaser; i < this.firstTeaser + 3; i++) {

            var teaser = this.items[i];

            teaser.displayed = true;
            teaser.expanded = (i == this.expandedTeaser);

            var tx = "", w = teaser.expanded ? this.teaserExpWidth : this.teaserWidth;

            if (teaser.expanded) {
                tx =
				"<table border=0, cellpadding=5, cellspacing=5, height=100%, width=100%><tr><td class='nmdrTE_bigImg'>" +
				"<img class='nmdrTE_img' id='" + this.id + "_img" + teaser.num + "' src='" + teaser.image +
				"' width='" + (this.expandAllowed ? this.smallImgSize[0] : this.bigImgSize[0]) +
				"' height='" + (this.expandAllowed ? this.smallImgSize[1] : this.bigImgSize[1]) + "'></td><td class='nmdrTE_bigTeaserTextArea'>" +
				"<table border=0, cellpadding=0, cellspacing=0, height=100%, width=100%><tr><td class='nmdrTE_bigTeaserTitle'>" +
				"<a class='nmdrTE_titleLink' href='" + teaser.url + "'>" + teaser.title + "</a></td></tr>" +
				"<tr><td class='nmdrTE_bigTeaserText'><span class='nmdrTE_bigTxt' id='" + this.id + "_bigText" + teaser.num + "' style='opacity:" +
				(this.expandAllowed ? "0" : "1") + ";'>" + teaser.bigText + "</span></td></tr></table></td></tr></table>";
            }
            else {
                var cl = "onclick=\"nmdr.core.$('" + this.id + "').changeTeaser(" + teaser.num + ")\"";

                tx =
				"<table border=0, cellpadding=5, cellspacing=5, height=100%, width=100%><tr><td class='nmdrTE_smlTeaserTitle'>" +
				"<a href='" + teaser.url + "'>" + teaser.title + "</td></tr><tr><td class='nmdrTE_smlTeaserImage' " + cl + ">" +
				"<img class='nmdrTE_img' id='" + this.id + "_img" + teaser.num + "' src='" + teaser.image + "' width='" +
				this.smallImgSize[0] + "' height='" + this.smallImgSize[1] + "'></td>" +
				"</tr><tr><td class='nmdrTE_smlTeaserText' " + cl + "><span id='" + this.id + "_smallText" + teaser.num + "'>" +
				teaser.smallText + "</span></td></tr></table>";
            }

            buf.push(
				"<div class='nmdrTE_teaserItem' id='" + this.id + "_teaser" + teaser.num + "' " +
				"style='display:inline; position:absolute; left:" + le + "px; top:0px; width:" + w + "px; height:" +
				(this.height - 2 * this.paddingV) + "px;'>" + tx + "</div>");

            le += w + this.paddingH;
        }
		
		buf.push("</div></div>");
		
		return buf.join("");
    };

    $.resetTeasers = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].displayed = false;
            this.items[i].expanded = false;
        }
    };

    $.expandTeaser = function (num) {

        if (!this.expandAllowed) return;

        this.expanding = true;
        this.resetTeasers();

        var id = this.id + "_img" + this.items[this.expandedTeaser].num;
        var sc = nmdr.core.utils.scale(id, this.bigImgSize[0], this.bigImgSize[1]);
		var txt = document.getElementById(this.id + "_bigText" + this.items[this.expandedTeaser].num);

        nmdr.core.animate.resize(id, null, sc.width, sc.height,
			function (arg) { nmdr.core.animate.fadeIn(null, txt, null, true, function() { arg.expanding = false; }); }, this);
    };

    $.collapseTeaser = function (num1, num2) {
        this.collapsing = true;
        this.resetTeasers();

        var id = this.id + "_img" + num1;
        var sc = nmdr.core.utils.scale(id, this.smallImgSize[0], this.smallImgSize[1]);

        nmdr.core.animate.resize(id, null, sc.width, sc.height,
			function (args) {
			    args[0].expandedTeaser = args[1];
			    args[0].build();
			    args[0].collapsing = false;
			}, [this, num2 - 1]
		);
    };

    $.changeTeaser = function (num) {
        if (!this.expanding && !this.collapsing && !this.moving) {
            this.expanding = true;
			//nmdr.core.animate.fadeOut(null, txt, null, true, function() { self.collapseTeaser(self.items[self.expandedTeaser].num, num); });
			document.getElementById(this.id + "_bigText" + this.items[this.expandedTeaser].num).style.visibility = "hidden";
			this.collapseTeaser(this.items[this.expandedTeaser].num, num)
        }
    };

    $.goBackward = function () {
        if (!this.expanding && !this.collapsing && !this.moving) {
            var elem = document.getElementById(this.id + "_nmdrTE_teaserView");
            nmdr.core.animate.move(null, elem, elem.offsetLeft + this.teaserWidth, elem.offsetTop, function (self) {
                if (!self.expandAllowed) {
                    self.firstTeaser--;
                    self.build();
                    self.expandAllowed = true;
                    self.moving = false;
                }
            }, this);

            if (this.expandedTeaser != this.firstTeaser + 2) {
                this.expandAllowed = false;
                this.moving = true;
                return;
            }
            this.resetTeasers();
            this.firstTeaser--;
            this.changeTeaser(this.expandedTeaser == this.firstTeaser + 2 ? this.expandedTeaser - 1 : this.expandedTeaser);
        }
    };

    $.goForward = function () {
        if (!this.expanding && !this.collapsing && !this.moving) {
            var elem = document.getElementById(this.id + "_nmdrTE_teaserView");
            nmdr.core.animate.move(null, elem, elem.offsetLeft - this.teaserWidth, elem.offsetTop, function (self) {
                if (!self.expandAllowed) {
                    self.firstTeaser++;
                    self.build();
                    self.expandAllowed = true;
                    self.moving = false;
                }
            }, this);

            if (this.expandedTeaser != this.firstTeaser) {
                this.expandAllowed = false;
                this.moving = true;
                return;
            }
            this.resetTeasers();
            this.firstTeaser++;
            this.changeTeaser(this.firstTeaser - 1 == this.expandedTeaser ? this.expandedTeaser + 2 : this.expandedTeaser + 1);
        }
    };

    return $;
}

//@FN:#nmdrFavorites
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

//@FN:#nmdrRibbon
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

//@FN:#nmdrCommands
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

//@FN:#nmdrCarousel
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
#  nmdrCarousel
#
#  Version: 1.00.00
#  Date: June 01. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrCarousel(id) {
    
	var $ = nmdr.core.$(id, "nmdrCarousel");
	if ($ == null) return;

    $.paddingH = 2;
    $.paddingV = 2;
	
	$.mode = 1;
    $.width = 0;
    $.height = 0;
    $.caroWidth = 0;
    $.caroHeight = 0;
	
    $.bgColor = "#eee";
	$.toolbar = true;
	$.toolbarHeight = 28;
    $.firstCaro = 0;
	$.visibleCaros = 4;
    $.animation = false;
	$.autoplay = false;
	$.autoplayDir = 1;
	$.autoplayDelay = 800;
	$.autoplayPaused = false;
	$.autoplayID = null;
	$.responsive = false;
    $.imagePath = null;
    $.pics = [];

    $.carousel = function (props) {

        this.mode = props.hasOwnProperty("mode") ? props.mode : 1;
        this.width = props.hasOwnProperty("width") ? props.width : this.parentElement.clientWidth;
        this.height = props.hasOwnProperty("height") ? props.height : this.parentElement.clientHeight;
        this.imagePath = props.hasOwnProperty("imagePath") ? props.imagePath + "/" : "img/carous/";
        this.toolbar = props.hasOwnProperty("toolbar") ? props.toolbar : true;
        this.visibleCaros = props.hasOwnProperty("caros") ? props.caros : 4;
		this.bgColor = props.hasOwnProperty("bgColor") ? props.bgColor : "#eee";
		this.autoplayDelay = props.hasOwnProperty("delay") ? props.delay : 800;
        this.pics = props.pics;

		this.visibleCaros = Math.min(this.visibleCaros, props.pics.length-1);
		
        this.style.width = this.width + "px";
        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        this.style.padding = "0px";
        this.style.backgroundColor = this.bgColor;
		
        this.build();
			
		if (this.responsive) {
			nmdr.core.utils.updateOnWinResized(this, function (self) { 
				if (props.autoplay) self.stopAutoplay();
				self.width = self.parentElement.clientWidth;
				self.build();
				if (props.autoplay) self.startAutoplay();
			});
		}

		if (props.autoplay) this.startAutoplay();
		
		return this;
    };

    $.build = function () {

        this.caroWidth = Math.round((this.width - (this.visibleCaros + 1) * this.paddingH) / this.visibleCaros);
		this.caroHeight = this.height - 2 * this.paddingV - (this.toolbar ? this.toolbarHeight + this.paddingV : 0);
		
		var buf = [];
		
        buf.push(this.createStyles());
        buf.push(this.createCarousel(true));
        buf.push(this.createToolbar());
		
        this.innerHTML = buf.join("");
    };

    $.createStyles = function () {
		var pfx = "#" + this.id;
		return "<style type='text/css'>" +
			pfx + " { position:relative !important; }" +
			
			pfx + " .caroArea { position:absolute; left:" + this.paddingH + "px; top:" + this.paddingV + "px; width:" + (this.width - 2 * this.paddingH) + 
				"px; height:" + this.caroHeight + "px; padding:0px; overflow:hidden; }" +
			
			pfx + " .caroView {" +
				"position:absolute; left:0px; top:0px; }" +
			
			pfx + " .caroPic { position:absolute; top:0px; width:" + this.caroWidth + "px; height:" + this.caroHeight + "px; text-align:left;" +
				"background-size:cover; background-repeat:no-repeat; cursor:pointer; }" +
			
			pfx + " .caroDesc { position:absolute; top:100%; left:0; bottom:0; right:0; padding:5px;" +
				"color:#fff; background:rgba(0,0,0,0.3); font:13px Arial,Helvetica,sans-serif; transition:0.5s;}" +
						
			pfx + " .caroPic:hover .caroDesc:first-child { transition:0.5s; top:0; }" +
			
			pfx + " .caroToolbar { position:absolute; left:" + this.paddingH + "px; top:" + (this.caroHeight + 2 * this.paddingV) + "px; " +
				"width:" + (this.width - 2 * this.paddingH) + "px; height:" + this.toolbarHeight + "px; background:#fff; text-align:left; }" +
			
			pfx + " .caimg { padding-top:4px; }" +
			pfx + " .catd { width:30px; text-align: center; }" +
			pfx + " .catd:hover { background:#ddd; cursor:pointer; }" +
			"</style>";
	};
	
    $.createCarousel = function (first) {
		
		var buf=[], le=0;
		
		if (this.mode == 1) {
			var l=this.pics.length;
			
			if (this.firstCaro == l) this.firstCaro = 0;
			for (var i = this.firstCaro; i <= this.firstCaro + this.visibleCaros; i++) {
				
				var x = i >= l ? i-l : i, 
					pic = this.pics[x],
					bg = pic.img ? "background-image:url(" + pic.img + ");" : "background:" + nmdr.core.utils.createRandumColor() + ";";
				
				buf.push("<div class='caroPic' style='left:" + le + "px; " + bg + "' " +
					"onclick=\"nmdr.core.$('" + this.id + "').startLink('" + pic.url + "');\" " +
					"onmouseover=\"nmdr.core.$('" + this.id + "').pauseAutoplay(true);\" " +
					"onmouseout=\"nmdr.core.$('" + this.id + "').pauseAutoplay(false);\">" +
					"<div class='caroDesc'><h3>" + pic.title + "</h3><span class='caroText'>" + pic.desc + "</span></div></div>");

				le += this.caroWidth + this.paddingH;
			}
			
			if (first) return "<div class='caroArea'><div class='caroView' id='" + this.id + "_caroView'>" + buf.join("") + "</div></div>";
			
			var view = document.getElementById(this.id + "_caroView"); 
			view.style.left = 0;
			view.innerHTML = buf.join("");
		}
		else if (this.mode == 2) {
			buf.push("<div class='caroArea'><div class='caroView' id='" + this.id + "_caroView'>");

			for (var i = 0; i < this.pics.length; i++) {		
				var pic = this.pics[i], bg = pic.img ? "background-image:url(" + pic.img + ");" : "background:" + nmdr.core.utils.createRandumColor() + ";";
				buf.push("<div class='caroPic' style='left:" + le + "px; " + bg + "' " +
					"onclick=\"nmdr.core.$('" + this.id + "').startLink('" + pic.url + "');\" " +
					"onmouseover=\"nmdr.core.$('" + this.id + "').pauseAutoplay(true);\" " +
					"onmouseout=\"nmdr.core.$('" + this.id + "').pauseAutoplay(false);\">" +
					"<div class='caroDesc'><h3>" + pic.title + "</h3><span class='caroText'>" + pic.desc + "</span></div></div>");

				le += this.caroWidth + this.paddingH;
			}		
			buf.push("</div></div>");
			
			return buf.join("");
		}
	};
	
    $.createToolbar = function () {
		if (this.toolbar) {
			if (this.mode == 1) {
				return "<div class='caroToolbar'>" +
				"<table border='0' cellpadding='0' cellspacing='0' height='100%'><tr>" +
				"<td class='catd' onclick=\"nmdr.core.$('" + this.id + "').startAutoplay();\"><img class='caimg' src='" + this.imagePath + "start.png' title='start'></td>" +
				"<td class='catd' onclick=\"nmdr.core.$('" + this.id + "').stopAutoplay();\"><img class='caimg' src='" + this.imagePath + "stop.png' title='stop'></td>" +
				"</tr></table></div>";
			}
			else if (this.mode == 2) {
				return "<div class='caroToolbar'>" +
				"<table border='0' cellpadding='0' cellspacing='0' height='100%'><tr>" +
				"<td class='catd' id='" + this.id + "_b1' onclick=\"nmdr.core.$('" + this.id + "').goBackward(null, true);\"><img class='caimg' src='" + this.imagePath + "prev.png' title='prev'></td>" +
				"<td class='catd' id='" + this.id + "_b2' onclick=\"nmdr.core.$('" + this.id + "').goForward(null, true);\"><img class='caimg' src='" + this.imagePath + "next.png' title='next'></td>" +
				"<td class='catd' id='" + this.id + "_b3' onclick=\"nmdr.core.$('" + this.id + "').stopAutoplay();\"><img class='caimg' src='" + this.imagePath + "stop.png' title='stop'></td>" +
				"<td class='catd' id='" + this.id + "_b4' onclick=\"nmdr.core.$('" + this.id + "').startAutoplay();\"><img class='caimg' src='" + this.imagePath + "start.png' title='start'></td>" +
				"</tr></table></div>";
			}
		}
		return "";
	};

    $.slide = function (callback) {
        if (!this.animation) {
            this.animation = true;
            var elem = document.getElementById(this.id + "_caroView");
            nmdr.core.animate.move(null, elem, elem.offsetLeft - this.caroWidth - this.paddingH, elem.offsetTop,
				function (arg) {
					arg.firstCaro += 1;
					arg.animation = false;
					arg.createCarousel();
					callback();
				},
			this);
        }
    };

    $.goBackward = function (cb, ac) {
		if (ac && this.autoplay) return;
        if (!this.animation && this.firstCaro != 0) {
            this.animation = true;
            var elem = document.getElementById(this.id + "_caroView");
            nmdr.core.animate.move(null, elem, elem.offsetLeft + this.caroWidth + this.paddingH, elem.offsetTop,
				function (arg) {
				    arg.firstCaro--;
				    arg.animation = false;
					if (cb) cb();
				},
			this);
        }
    };

    $.goForward = function (cb, ac) {
		if (ac && this.autoplay) return;
        if (!this.animation && this.firstCaro < this.pics.length - this.visibleCaros) {
            this.animation = true;
            var elem = document.getElementById(this.id + "_caroView");
            nmdr.core.animate.move(null, elem, elem.offsetLeft - this.caroWidth - this.paddingH, elem.offsetTop,
				function (arg) {
				    arg.firstCaro++;
				    arg.animation = false;
					if (cb) cb();
				},
			this);
        }
    };
	
	$.startAutoplay = function () {
		if (!this.autoplay) {
			this.autoplay = true;
			this.autoplayPaused = false;
			
			if (this.mode == 2) this.updateButtons(false);

			var self = this;
			var play = function () {
				if (self.autoplay && !self.autoplayPaused) {
					if (self.mode == 1) {
						self.slide(function() { 
							clearInterval(self.autoplayID);
							self.autoplayID = setInterval(play, self.autoplayDelay);
						});
					}
					else if (self.mode == 2) {
						if (self.autoplayDir == 1) {
							var next = self.firstCaro < self.pics.length - self.visibleCaros;
							if (next) {
								self.goForward(function() { 
									self.autoplayDir = self.firstCaro < self.pics.length - self.visibleCaros ? 1 : -1;
									clearInterval(self.autoplayID);
									self.autoplayID = setInterval(play, self.autoplayDelay); 				
								});
							}
						}
						else {
							var prev = self.firstCaro != 0;
							if (prev) {
								self.goBackward(function() { 
									self.autoplayDir = self.firstCaro != 0 ? -1 : 1;
									clearInterval(self.autoplayID);
									self.autoplayID = setInterval(play, self.autoplayDelay); 				
								});
							}
						}
					}
				}
			};
			play();
		}
	};

	$.stopAutoplay = function () {
		if (this.autoplay) {
			this.autoplay = false;
			this.animation = false;
			if (this.mode == 2) this.updateButtons(true);
			clearInterval(this.autoplayID);
		}
	};

	$.pauseAutoplay = function(pause) {
		this.autoplayPaused = pause;
	};

	$.updateButtons = function(ac) {
		document.getElementById(this.id + "_b1").style.opacity = ac ? "1.0" : "0.2";
		document.getElementById(this.id + "_b2").style.opacity = ac ? "1.0" : "0.2";
	};

	$.startLink = function(url) {
		alert(url);
	};
	
    return $;
}

//@FN:#nmdrLayout
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
#  nmdrLayout
#
#  Version: 1.00.00#  Date: October 11. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrLayout(id) {

	var $ = nmdr.core.$(id, "nmdrLayout");
	if ($ == null) return; 
	
	$.padding = 0;
	$.bgColor = null;
	
	$.rows = null;
	$.cols = null;
	$.comps = null;
	$.cells = null;

	$.showGrids = null;
	$.responsive = null;
	$.fullscreen = null;
			
	$.init = function(props) { 
	
		props = props || {};

		this.padding = props.hasOwnProperty("padding") ? props.padding : 0;
		this.bgColor = props.hasOwnProperty("bgColor") ? props.bgColor : "#ddd";
		this.showGrids = props.hasOwnProperty("showGrids") ? props.showGrids : false;
		this.rows = props.hasOwnProperty("rows") ? props.rows : [{nr:1, sh:"auto"}];
		this.cols = props.hasOwnProperty("cols") ? props.cols : [{nr:1, sw:"auto"}];
		this.comps = props.hasOwnProperty("comps") ? props.comps : [];

		nmdr.core.utils.updateOnLoadResize(this, function(self) { self.layout(); });

		this.layout();
	};
		
	$.layout = function() {
		
		var wi = this.clientWidth - this.padding * (this.cols.length + 1);
		var hi = this.clientHeight - this.padding * (this.rows.length + 1);
		
		//=== rows
		
		var rx = 0, hx = 0, hn;
		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh == "auto") rx++;
			else if (this.rows[r].sh.endsWith("px")) {
				this.rows[r].height = parseInt(this.rows[r].sh); 
				hx += this.rows[r].height;
			}
		}

		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh.endsWith("%")) {
				var h = parseInt(this.rows[r].sh);
				this.rows[r].height = Math.max(0, Math.floor((hi - hx) * h / 100));
				hx += this.rows[r].height;
			}
		}

		hn = Math.floor((hi - hx) / rx);
		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh == "auto") this.rows[r].height = hn;
		}
					
		//=== columns
		
		var cx = 0, wx = 0, wn = 0;
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw == "auto") cx++;
			else if (this.cols[c].sw.endsWith("px")) {
				this.cols[c].width = parseInt(this.cols[c].sw); 
				wx += this.cols[c].width;
			}
		}
		
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw.endsWith("%")) {
				var w = parseInt(this.cols[c].sw);
				this.cols[c].width = Math.max(0, Math.floor((wi - wx) * w / 100));
				wx += this.cols[c].width;
			}
		}
		
		wn = Math.floor((wi - wx) / cx);
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw == "auto") this.cols[c].width = wn;
		}
		
		//=== cells	
		
		this.cells = {};
		var to = this.padding;
		for (var r = 0; r < this.rows.length; r++) {
			var le = this.padding;
			for (var c = 0; c < this.cols.length; c++) {

				var cm = null;
				for (var i = 0; i < this.comps.length; i++) {
					var cx = this.comps[i];
					if (r+1 == cx.row && c+1 == cx.col) {
						cm = cx;
						break;
					}
				}
				
				this.cells[r + "" + c] =
				{
					row: this.rows[r].nr,
					col: this.cols[c].nr,
					left: le,
					top: to,
					width: this.cols[c].width,
					height: this.rows[r].height,
					comp: cm
				};
				le += this.cols[c].width + this.padding;
			}
			to += this.rows[r].height + this.padding;
		}
		
		this.show();
	};
	
	$.show = function() {
		var buf = [];
		
		buf.push("<div id='" + this.id + "_root' ");
		buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;padding:0;margin:0;");
		buf.push("display:inline-block;overflow:hidden;box-sizing:border-box;background:" + this.bgColor + ";'>");	
				
		if (this.showGrids) {
			buf.push("<div id='" + this.id + "_grids' ");
			buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:transparent;'>");	

			for (var r = 0; r < this.rows.length; r++) {
				for (var c = 0; c < this.cols.length; c++) {
					var ce = this.cells[r + "" + c],
						bg = "background:#" + ((1<<24) * Math.random()|0).toString(16) + ";", 
						bg = "";
						
					buf.push("<div id='" + this.id + "cell" + ce.row + "-" + ce.col + "' ");
					buf.push("style='position:absolute;left:" + ce.left + "px;top:" + ce.top + "px;width:" + ce.width + "px;height:" + ce.height + "px;");
					buf.push("padding:0;margin:0;" + bg + "box-sizing:border-box;border:1px solid #ccc;'></div>");
				}
			}			
			buf.push("</div>");	
		}
		
		buf.push("<div id='" + this.id + "_comps' ");
		buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:transparent;");
		buf.push("font:14px arial,sans-serif;color:black;'>");
		
		for (var r = 0; r < this.rows.length; r++) {
			for (var c = 0; c < this.cols.length; c++) {
				var ce = this.cells[r + "" + c];
				
				if (ce.comp != null) {
					
					var el = document.getElementById(ce.comp.id);
					
					if (el) {
						var w = ce.width, 
							h = ce.height,
							l = ce.left,
							t = ce.top;
						
						if (ce.comp.colspan && ce.comp.colspan > 1 && c + ce.comp.colspan <= this.cols.length) {
							w += (ce.comp.colspan-1) * this.padding;
							for (var n=1; n < ce.comp.colspan; n++) {
								w += this.cells[r + "" + (c+n)].width;
							}
						}
						if (ce.comp.rowspan && ce.comp.rowspan > 1 && r + ce.comp.rowspan <= this.rows.length) {
							h += (ce.comp.rowspan-1) * this.padding;
							for (var n=1; n < ce.comp.rowspan; n++) {
								h += this.cells[(r+n) + "" + c].height;
							}
						}
						
						if (ce.comp.halign) {
							l = 
								ce.comp.halign == "left" ? l : 
								ce.comp.halign == "right" ? l + w - el.offsetWidth : 
								ce.comp.halign == "center" ? l + w / 2 - el.offsetWidth / 2 + 1 : l;
						}

						if (ce.comp.valign) {
							t = 
								ce.comp.valign == "top" ? t : 
								ce.comp.valign == "bottom" ? t + h - el.offsetHeight : 
								ce.comp.valign == "center" ? t + h / 2 - el.offsetHeight / 2 + 1 : t;
						}
						
						el.style.position = "absolute";
						el.style.left = l + "px";
						el.style.top = t + "px";
						el.style.width = w + "px";
						el.style.height = h + "px";
						el.style.padding = "0";
						el.style.margin = "0";
						el.style.boxSizing = "border-box";
						
						buf.push(el.outerHTML);
						el.parentNode.removeChild(el);
					}
				}
			}
		}
		
		buf.push("</div></div>");	
		
		this.innerHTML = buf.join("");
	};
	
	return $;
}

//@FN:#nmdrTabview
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

//@FN:#nmdrTabs
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

//@FN:#nmdrBitmap
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
#  nmdrBitmap
#
#  Version: 1.00.00
#  Date: December 20. 2016
#  Status: Release
#
#####################################################################
*/
/*
function nmdrBitmap(width, height) {
    this.width = width;
    this.height = height;
    this.pixel = new Array(width);
    for (var x = 0; x < width; x++) {
        this.pixel[x] = new Array(height);
        for (var y = 0; y < height; y++) {
            this.pixel[x][y] = [0, 0, 0, 0];
		}
    }
}

nmdrBitmap.prototype.subsample = function(n) {
    var width = ~~(this.width / n);
    var height = ~~(this.height / n);
    var pixel = new Array(width);
    for (var x = 0; x < width; x++) {
        pixel[x] = new Array(height);
        for (var y = 0; y < height; y++) {
            var q = [0, 0, 0, 0];
            for (var i = 0; i < n; i++)
                for (var j = 0; j < n; j++) {
                    var r = this.pixel[x*n+i][y*n+j];
                    q[0] += r[3] * r[0];
                    q[1] += r[3] * r[1];
                    q[2] += r[3] * r[2];
                    q[3] += r[3];
                }
            if (q[3]) {
                q[0] /= q[3];
                q[1] /= q[3];
                q[2] /= q[3];
                q[3] /= n * n;
            }
            pixel[x][y] = q;
        }
    }
    this.width = width;
    this.height = height;
    this.pixel = pixel;
}

nmdrBitmap.prototype.dataURL = function() {
    function sample(v) {
        return ~~(Math.max(0, Math.min(1, v)) * 255);
    }

    function gamma(v) {
        return sample(Math.pow(v, .45455));
    }

    function row(pixel, width, y) {
        var data = "\0";
        for (var x = 0; x < width; x++) {
            var r = pixel[x][y];
            data += String.fromCharCode(gamma(r[0]), gamma(r[1]), gamma(r[2]), sample(r[3]));
        }
        return data;
    }

    function rows(pixel, width, height) {
        var data = "";
        for (var y = 0; y < height; y++)
            data += row(pixel, width, y);
        return data;
    }

    function adler(data) {
        var s1 = 1, s2 = 0;
        for (var i = 0; i < data.length; i++) {
            s1 = (s1 + data.charCodeAt(i)) % 65521;
            s2 = (s2 + s1) % 65521;
        }
        return s2 << 16 | s1;
    }

    function hton(i) {
        return String.fromCharCode(i>>>24, i>>>16 & 255, i>>>8 & 255, i & 255);
    }

    function deflate(data) {
        var len = data.length;
        return "\170\1\1" +
            String.fromCharCode(len & 255, len>>>8, ~len & 255, (~len>>>8) & 255) +
            data + hton(adler(data));
    }

    function crc32(data) {
        var c = ~0;
        for (var i = 0; i < data.length; i++)
            for (var b = data.charCodeAt(i) | 0x100; b != 1; b >>>= 1)
                c = (c >>> 1) ^ ((c ^ b) & 1 ? 0xedb88320 : 0);
        return ~c;
    }

    function chunk(type, data) {
        return hton(data.length) + type + data + hton(crc32(type + data));
    }

    function base64(data) {
        enc = "";
        for (var i = 5, n = data.length * 8 + 5; i < n; i += 6)
            enc += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                (data.charCodeAt(~~(i/8)-1) << 8 | data.charCodeAt(~~(i/8))) >> 7 - i%8 & 63];
        for (; enc.length % 4; enc += "=");
        return enc;
    }

    var png = "\211PNG\r\n\32\n" +
        chunk("IHDR", hton(this.width) + hton(this.height) + "\10\6\0\0\0") +
        chunk("IDAT", deflate(rows(this.pixel, this.width, this.height))) +
        chunk("IEND", "");

    return "data:image/png;base64," + base64(png);
}

nmdrBitmap.prototype.makeImage = function(cod, inv, bufOnly) {

	var b0 = [
	"0000000..",
	"000000..0",
	".0000..00",
	"..00..000",
	"0....0000",
	"00..00000"];
	
	var b1 = [
	"0..........00000",
	".1111111111.0000",
	".11..........000",
	".1.1111111111.00",
	".1.11..........0",
	".1.1.1111111111.",
	".1.1.1111111111.",
	".1.1.11......11.",
	".1.1.1111111111.",
	".1.1.11......11.",
	".1.1.1111111111.",
	"0..1.11......11.",
	"00.1.1111111111.",
	"000..1111111111.",
	"0000.1111111111.",
	"00000..........0"];

	var b2 = [
	"00.........00000",
	"0.111111111.0000",
	"0.1111111111.000",
	"0.11......111.00",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"00............00"];
	
	var b3 = [
	"..00000000",
	"...0000000",
	"....000000",
	".....00000",
	"......0000",
	"......0000",
	".....00000",
	"....000000",
	"...0000000",
	"..00000000"];
	
	var b4 = [
	"..........000",
	"..........000",
	"0........0000",
	"00......00000",
	"000....000000",
	"0000..0000000",
	"0000000000000"];

	var b5 = [
	"00000......00000",
	"0000.111111.0000",
	"0..............0",
	".11111111111111.",
	".11111111111111.",
	"0..............0",
	"0.111111111111.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111111111.0",
	"00............00",
	"0000000000000000"];

	var b6 = [
	"0.............00",
	".1111111111111.0",
	".1111111111111.0",
	".11......11111.0",
	".1111111111111.0",
	".11......1111...",
	".11111111111.11.",
	".11......11.111.",
	".111111111.111.0",
	".11111111.111..0",
	".1111111.111.1.0",
	".1111111.11.11.0",
	".1111111...111.0",
	".1111111111111.0",
	"0.............00",
	"0000000000000000"];

	var b7 = [
	"0.............00",
	".1111111111111.0",
	".1....11111111.0",
	".111111....111.0",
	".1..11.1111.11.0",
	".1111.111111.1.0",
	".1..1.111111.1.0",
	".1111.111111.1.0",
	".1..1.111111.1.0",
	".11111.111111.00",
	".1...11....111.0",
	".1111111111.111.",
	".1........11.11.",
	".111111111111...",
	"0.............00",
	"0000000000000000"];
	
	var bb = null;
	switch(cod) {
		case 0: bb = b0; break;
		case 1: bb = b1; break;
		case 2: bb = b2; break;
		case 3: bb = b3; break;
		case 4: bb = b4; break;
		case 5: bb = b5; break;
		case 6: bb = b6; break;
		case 7: bb = b7; break;
	}
	
	var w = bb[0].length, h = bb.length, bmp = new Bitmap(w, h);
	
	r = r?r:1;
	g = g?g:1;
	b = b?b:1;
		
	for (var i=0; i < h; i++) {
		for (var j=0; j < w; j++) {
			if (bb[i][j] == ".") bmp.pixel[j][i] = inv ? [1,1,1,1] : [.3,.3,.3, 1];
			else if (bb[i][j] == "1") bmp.pixel[j][i] = [r, g, b, 1];
		}
	}
	
	if (!crImg) return bmp.dataURL();
	
    var img = document.createElement("img");
    img.setAttribute("src", bmp.dataURL());
	return img;
}
*/
