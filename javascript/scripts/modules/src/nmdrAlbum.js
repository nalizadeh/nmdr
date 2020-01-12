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

