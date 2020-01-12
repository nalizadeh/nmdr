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

