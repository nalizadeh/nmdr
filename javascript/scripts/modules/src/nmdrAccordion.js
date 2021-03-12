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

