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

