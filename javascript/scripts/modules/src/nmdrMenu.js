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

