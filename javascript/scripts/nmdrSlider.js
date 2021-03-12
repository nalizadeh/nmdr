/*
Copyright (C) 2016 nalizadeh.com

This program is free software; you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the Free Software Foundation; either version 2 of the 
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, 
write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA. 
*/

//
// nmdrSlider
//
// Author: Nader Alizadeh
// Copyright: nalizadeh.com
//
// minimize with: http://javascript-minifier.com/
// minimize with: https://jscompress.com/
//

'use strict';

//=============================
// GEOMETRY
//=============================

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} destWidth
 * @param {Number} destHeight
 * 
 * @return {width: Number, height:Number}
 */
function resizeKeepingRatio(width, height, destWidth, destHeight)
{
    if (!width || !height || width <= 0 || height <= 0)
    {
        throw "Params error";
    }
    var ratioW = width / destWidth;
    var ratioH = height / destHeight;
    if (ratioW <= 1 && ratioH <= 1)
    {
        var ratio = 1 / ((ratioW > ratioH) ? ratioW : ratioH);
        width *= ratio;
        height *= ratio;
    }
    else if (ratioW > 1 && ratioH <= 1)
    {
        var ratio = 1 / ratioW;
        width *= ratio;
        height *= ratio;
    }
    else if (ratioW <= 1 && ratioH > 1)
    {
        var ratio = 1 / ratioH;
        width *= ratio;
        height *= ratio;
    }
    else if (ratioW >= 1 && ratioH >= 1)
    {
        var ratio = 1 / ((ratioW > ratioH) ? ratioW : ratioH);
        width *= ratio;
        height *= ratio;
    }
    return {
        width : width,
        height : height
    };
}

//=============================
// ANIMATION
//=============================

var stepH = 20;
var stepV = 10;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function resizeElement(id, el, width, height, callback, args) {
    var elem = id ? document.getElementById(id) : el;
    if (elem != null) {
		var doResize = function () {

			var w = elem.offsetWidth, h = elem.offsetHeight;

			if (w < width) { w = w + stepH; if (w > width) w = width; } else if (w > width) { w = w - stepH; if (w < width) w = width; }
			if (h < height) { h = h + stepV; if (h > height) h = height; } else if (h > height) { h = h - stepV; if (h < height) h = height; }

			elem.style.width = w + "px";
			elem.style.height = h + "px";

			if (w == width && h == height) {
				cancelAnimationFrame(elem.resizeTm);
				if (callback) callback(args);
			}
			else elem.resizeTm = requestAnimationFrame(doResize);
		};
		doResize();
	}
}

function moveElement(id, el, left, top, callback, args) {
    var elem = id ? document.getElementById(id) : el;
    if (elem != null) {
		var doMove = function() {
			var l = elem.offsetLeft, t = elem.offsetTop;

			if (left != null) { if (l < left) { l += stepH; if (l > left) l = left; } else if (l > left) { l -= stepH; if (l < left) l = left; } }
			if (top != null) { if (t < top) { t += stepV; if (t > top) t = top; } else if (t > top) { t -= stepV; if (t < top) t = top; } }

			elem.style.left = l + "px";
			elem.style.top = t + "px";

			if ((left == null || l == left) && (top == null || t == top)) {
				cancelAnimationFrame(elem.moveTM);
				if (callback) callback(args);
			}
			else elem.moveTM = requestAnimationFrame(doMove);
		};
		doMove();
	}
}

function fadeElement(id, el, startopa, endopa, step, callback, args) {

    var elem = id ? document.getElementById(id) : el;
    if (elem != null) {

        if (startopa < endopa) {
            startopa += step;
            if (startopa > endopa) startopa = endopa;
        }
        else if (startopa > endopa) {
            startopa -= step;
            if (startopa < endopa) startopa = endopa;
        }

        elem.style.opacity = startopa;
        elem.style.filter = "alpha(opacity=" + startopa * 100 + ")";

        if (startopa == endopa) {
			cancelAnimationFrame(elem.fadeTM);
            if (callback) callback(args);
            return;
        }

		elem.fadeTM = requestAnimationFrame(function() { fadeElement(null, elem, startopa, endopa, step, callback, args); });
    }
}

function scrollElement(id, el, dx, dy, callback, args) {
    var elem = id ? document.getElementById(id) : el;
    if (elem != null) {
        if (dx != null) dx += elem.offsetLeft;
        if (dy != null) dy += elem.offsetTop;
        moveElement(null, elem, dx, dy, callback, args);
    }
}

//=============================
// TIMER
//=============================

var nmdrTimer = null;

function stopTimer() {
    clearTimeout(nmdrTimer);
};

function startTimer(callback, step) {
    clearTimeout(nmdrTimer);
    nmdrTimer = setTimeout(callback, step);
};

//=============================
// EVENTS
//=============================

function stopPropagation(e) {
    e = e || window.event;
    if (e.cancelBubble != null) e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
}

//=============================
// POPUP
//=============================

var currPopup = null;
var currInvokers = [];
var currCallback = null;
var currCanCloseCallback = null;

function registerPopup(popup, invoker, callback, canCloseCallback) {

    if (currPopup != null && currPopup != popup) {
        closeCurrentPopup();
    }

    currPopup = popup;
    currInvokers.push(invoker);
    currCallback = callback;
	currCanCloseCallback = canCloseCallback;

    document.body.onkeydown = function (e) {
        // escape key
        if (e.which == 27 && currPopup != null) {
			closeCurrentPopup();
            stopPropagation(e);
        }
    };

    // click on a box does nothing
    currPopup.onclick = function (e) {
        stopPropagation(e);
    };

    // click everywhere else except popup invoker closes the box
    document.onclick = function (e) {
		if (currPopup != null) {
			var target = e.target || e.srcElement;
			for (var i in currInvokers) {
				if (target == currInvokers[i]) return;
			}
			var cc = true;
			if (currCanCloseCallback) {
				for (var i in currInvokers) {
					if (!currCanCloseCallback(currInvokers[i], target)) { cc = false; break; }
				}
			} 
			if (cc) closeCurrentPopup();
		}
    }
}

function addPopupInvoker(invoker) {
    currInvokers.push(invoker);
}

function unregisterPopup() {
    currPopup = null;
    currCallback = null;
	currCanCloseCallback = null;
    while (currInvokers.length) currInvokers.pop();
}

function closeCurrentPopup() {
    if (currPopup != null) {
        currCallback();
        unregisterPopup();
    }
}

/*
Array.prototype.clear = function() {
  while (this.length) {
    this.pop();
  }
};
*/

/*
############################################################################
#
#  nmdrSlider
#
#  Version: 1.00.00
#  Date: September 24. 2016
#  Status: Release
#
############################################################################
*/

function _$(id) { return document.getElementById(id); }

function nmdrSlider(id) {
	
    var $ = _$(id);
	
    if ($ == null) {
        alert("[nmdrSlider]\n\nThe specified container '" + id + "' does not exist.\n" +
		"Please verify that you have a container with this ID in the page.");
        return;
    }

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
			var ratio = resizeKeepingRatio(d.originWidth, d.originHeight, d.width, d.height);
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

		//setTimerData(20, 10);
        //window.addEventListener('resize', function () { window.location.reload(); });
        
		return this;
    };
		
    $.build = function () {
	
        var buff = [];

        buff.push("<style type='text/css'>video{width:100% !important;height:auto !important;}</style>");
        
        buff.push("<div class='nmdrPS_root' id='" + this.id + "_nmdrPS_root' style='position:relative;display:block;margin:0 auto;overflow:hidden;" + 
			"width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;'>");
			
        buff.push("<div class='nmdrPS_content' id='" + this.id + "_nmdrPS_content' " +
			"style='position:absolute;left:" + (-this.currentAlbum * this.albumWidth) + "px;top:0px;" + 
			"width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;' " +
			"onmouseover=\"_$('" + this.id + "').showToolbars(event,true)\" " +
			"onmouseout=\"_$('" + this.id + "').showToolbars(event,false)\">");

        for (var i=0; i < this.albums.length; i++) {
            
            var album = this.albums[i],
                title = album.title !== null ? album.title : "",
                descr = album.description !== null ? album.description : "",
                op1 = i == 0 ? 0.5 : 1.0,
                op2 = i < this.albums.length - 1 ? 1.0 : 0.5,
                left = i * this.albumWidth;
						
			buff.push("<div class='nmdrPS_pbox' id='" + this.id + "_nmdrPS_pbox" + i + "' " +
				"onmousedown=\"_$('" + this.id + "').onMouseTouchDown(event);\" " +
				"onmouseup=\"_$('" + this.id + "').onMouseTouchUp(event, false);\" " +
				"onclick=\"_$('" + this.id + "').openImage(event," + i + ");\" " +
				"style='position:absolute;left:" + left + "px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"vertical-align:top;text-align:left;pointer-events:auto;background-size:cover;'>" + 
				this.createPicBox(i) + "</div>");

			buff.push("<div class='nmdrPS_dbox' id='" + this.id + "_nmdrPS_dbox" + i + "' style='position:absolute;" +
				"left:" + (left + this.albumWidth - this.descboxWidth - 6) + "px;top:" + (this.albumHeight - this.descboxHeight - 6) + "px;" +
				"width:" + this.descboxWidth + "px;height:" + this.descboxHeight + "px;display:none; vertical-align:top;text-align:left;" +
				"color:#fff;background-image:linear-gradient(rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 100%);pointer-events:auto;'></div>");

            buff.push("<div class='nmdrPS_sbox' id='" + this.id + "_nmdrPS_sbox" + i + "' " +
				"style='position:absolute;left:" + left + "px;top:" + (this.albumHeight - 56) + "px;width:" + 
				this.albumWidth + "px;height:" + (56 + (this.thumbHeight + 2 * this.paddingV)) + "px;" +
				"vertical-align:top;text-align:left;color:#fff;pointer-events:auto;" + (this.onlySlider ? "visibility:hidden;" : "") + "'>");

			//=== Toolbars
			
			buff.push("<table border=0, cellpadding=0, cellspacing=2, width=100% height=100%><tr>");
            buff.push("<td style='width:20px;height:40px'></td>");

            buff.push("<td class='nmdrPS_dubt' id='" + this.id + "_nmdrPS_dubt" + i + "' title='Show thumbnails' style='width:40px;height:40px;");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideUp.png\");cursor:pointer;' ");
            buff.push("onclick=\"_$('" + this.id + "').showThumbnails(event, " + i + ", true)\"/></td>"); 
			
            buff.push("<td class='nmdrPS_aplay' id='" + this.id + "_nmdrPS_aplay" + i + "' title='Start autoplay' style='width:40px;height:40px;");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "autoplay.png\");cursor:pointer;' ");
            buff.push("onclick=\"_$('" + this.id + "').runAutoplay(event, " + i + ", true)\"/></td>"); 
			
            buff.push("<td style='width:20px;height:40px;'></td>");
            buff.push("<td class='nmdrPS_vidbar' id='" + this.id + "_nmdrPS_vidbar" + i + "' style='width:240px;height:40px;'></td>");
            buff.push("<td></td>");
			
			buff.push("<td class='nmdrPS_lebt' id='" + this.id + "_nmdrPS_prevAL" + i + "' title='Previous album' style='width:40px;height:40px;opacity:" + op1 + ";");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideLeft.png\");cursor:pointer;' ");
			buff.push("onclick=\"_$('" + this.id + "').showPrevAlbum(event," + i + ")\"></td>");

			buff.push("<td class='nmdrPS_ribt' id='" + this.id + "_nmdrPS_nextAL" + i + "' title='Next album' style='width:40px;height:40px;opacity:" + op2 + ";");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideRight.png\");cursor:pointer;' ");
			buff.push("onclick=\"_$('" + this.id + "').showNextAlbum(event," + i + ")\"></td>");

			buff.push("<td class='nmdrPS_vibt' id='" + this.id + "_nmdrPS_vibt" + i + "' title='Show image in new tab' style='width:40px;height:40px;");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideView.png\");cursor:pointer;'");			
			buff.push("onclick=\"_$('" + this.id + "').openImage(event," + i + ",true)\"></td>");
			
			buff.push("<td class='nmdrPS_desc' id='" + this.id + "_nmdrPS_desc" + i + "' title='Open description bar' style='width:40px;height:40px;");
			buff.push("background-color:rgba(0,0,0,0.5);background-image: url(\"" + this.imagePath + "slideDesc.png\");cursor:pointer;'");			
			buff.push("onmouseover=\"_$('" + this.id + "').showDesc(event," + i + ",true);\" ");
			//buff.push("onmouseout=\"_$('" + this.id + "').showDesc(event," + i + ",false);\" ");
			buff.push("></td>");
            buff.push("<td style='width:20px'></td></tr>");
			
			//=== Thumbnails

			buff.push("<tr><td colspan='11' style='height:10px'></td></tr>");

			buff.push("<tr style='background-color:rgba(0,0,0,0.3);'>");
			buff.push("<td onclick=\"_$('" + this.id + "').slideThumbsLeft(event," + i + ")\" style='width:20px;height:" + 
				(this.thumbHeight + 2 * this.paddingV) + "px;cursor:pointer;'><img id='" + this.id + "_nmdrPS_scleft" + i + "' src='" + 
				this.imagePath + "slideLeftB.png' style='opacity:0.5'></td>");
				
			buff.push("<td id='" + this.id + "_nmdrPS_sbox" + i + "_thumbs' colspan='9' style='vertical-align:top;text-align:center;'>");
			buff.push("<div style='text-align:center !important; margin:0 auto; padding-top:10px;font:13px Arial,Helvetica,sans-serif;'>");
			buff.push("<table align='center' style='margin:auto;'><tr><td><img src=\"" + this.imagePath + "loading.gif\"></td>");
			buff.push("<td><p id='loadingCount' style='padding-left:6px;'>loading... 0 %</p></td></tr></table></div></td>");

			buff.push("<td onclick=\"_$('" + this.id + "').slideThumbsRight(event," + i + ")\" style='width:20px;height:" + 
				(this.thumbHeight + 2 * this.paddingV) + "px;cursor:pointer;opacity:" + (album.picsCount <= this.thumbViewCount ? "0.5" : "1") + "'>" +
				"<img id='" + this.id + "_nmdrPS_scright" + i + "' src='" + this.imagePath + "slideRightB.png'></td></tr>");

            buff.push("</table></div>");
        }
		
        buff.push("</div>");
        buff.push("</div>");

        this.innerHTML = buff.join("");	
		this.init3D();
		this.initTouchEvents();
		
		var self = this;
		document.addEventListener("keydown", function(ev) { self.onKeyDown(ev); });
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
			var buff = [];
			this.slideKenBurns_Style(buff);
			var pbox = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			pbox.classList.add("KenBurns");
			pbox.innerHTML = buff.join("") + pbox.innerHTML;
		}
		
		this.createPromotion(num);
	};
		
    $.createVideoBox = function (num) {
		
		var album = this.albums[num], vbox = document.getElementById(this.id + "_nmdrPS_vidbar" + num);
		
		if (vbox) {
				
			vbox.innerHTML = "";
			
			if (album.currentPic != -1 && album.pics[album.currentPic].video) {

				var buff=[], id = this.id, imp = this.imagePath;

				buff.push("<table border=0, cellpadding=0, cellspacing=0, width=100% height=100% style='background:#333333'><tr>");
				buff.push("<td>&nbsp;&nbsp;</td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrestart.png' title='Restart' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'restart')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vloop1.png' title='Loop' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'loop')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgobegin.png' title='Go begin' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'begin')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vplay.png' title='Play' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'play')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vgoend.png' title='Go end' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'end')\"></td>"); 
				buff.push("<td>&nbsp;&nbsp;</td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vslower.png' title='Slower' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'slower')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vnormal.png' title='Normal' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'normal')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vfaster.png' title='Faster' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'faster')\"></td>"); 
				buff.push("<td>&nbsp;&nbsp;</td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vrewind.png' title='Rewind' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'rew')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vforward.png' title='Forward' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'fwd')\"></td>"); 
				buff.push("<td>&nbsp;&nbsp;</td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vmute2.png' title='Mute' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'mute')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvoldown.png' title='Volume down' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'volDn')\"></td>"); 
				buff.push("<td style='padding-top:6px'><img class='vc' src='" + imp + "vvolup.png' title='Volume up' style='cursor:pointer;' onclick=\"_$('" + id + "').handleVideo(event, " + num + ", 'volUp')\"></td>"); 
				buff.push("<td>&nbsp;&nbsp;</td>"); 
				buff.push("</tr></table>");
			
				vbox.innerHTML = buff.join("");

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

        var buff = [], le = this.paddingH, self = this;

		buff.push(style);
		buff.push("<div class='nmdrPS_slidesShow' id='" + this.id + "_nmdrPS_slidesShow" + num + "' style='position:absolute;left:" + 
			((this.albumWidth - this.slideWidth) / 2) +	"px;width:" + this.slideWidth + "px;height:" + this.slideHeight + "px;overflow:hidden;'>");
		buff.push("<div class='nmdrPS_thumbsArea' id='" + this.id + "_nmdrPS_thumsArea" + num + "' style='position:absolute;'>");
	
        for (var i = 0; i < album.picsCount; i++) {	
			var pname = this.getImageName(album, i);
			
			var vd = album.pics[i].video ? "<img src=\"" + this.imagePath + "video.png\" style='position:absolute;left:4px;top:" + (this.thumbHeight-16) + "px;'>" : "";
			
            buff.push(
				"<div class='nmdrPS_thumbItem' id='thumb_" + num + "_" + i + "' style='display:block; opacity:0.5; position:absolute; " +
				"left:" + le + "px; top:" + this.paddingV + "px; width:" + this.thumbWidth + "px; height:" + this.thumbHeight + "px; " +
				"background-image: url(\"" + pname + "\"); background-size:cover;' " +
				"onmousedown=\"_$('" + this.id + "').onMouseTouchDown(event);\" " +
				"onmouseup=\"_$('" + this.id + "').onMouseTouchUp(event, true);\" " +
				"onclick=\"_$('" + this.id + "').changeImage(" + num + "," + i + ")\">" + vd + "</div>");

            le += this.thumbWidth + this.paddingH;
        }
		buff.push("</div></div>");

        return buff.join("");
    };
    
    $.onKeyDown = function (evt) {
		//stopPropagation(evt);

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

	$.changeAlbum = function (evt, num) {

		var e = document.getElementById(this.id + "_nmdrPS_albums");
		var n = parseInt(e.options[e.selectedIndex].value);
		
		if (!this.inAnimation && n != this.currentAlbum) {
			
			this.runAutoplay(null, this.currentAlbum, false);
			this.showDesc(evt, num, false);
			this.showThumbnails(evt, num, false);
			
			this.inAnimation = true; 
			
			var self = this, cont = document.getElementById(this.id + "_nmdrPS_content");
			fadeElement(null, cont, 1.0, 0.0, 0.03, function() { 
				cont.style.left = (-n * self.albumWidth) + "px";
				fadeElement(null, cont, 0.0, 1.0, 0.03, function() { 
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
			
            var s = stepH / this.slideWidth;
			var m = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			var n = document.getElementById(this.id + "_nmdrPS_pbox" + (num - 1));
			fadeElement(null, m, 1.0, 0.0, s);
			fadeElement(null, n, 0.0, 1.0, s);

            scrollElement(this.id + "_nmdrPS_content", null, this.albumWidth, 0,
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
			
            var s = stepH / this.slideWidth;
			var m = document.getElementById(this.id + "_nmdrPS_pbox" + num);
			var n = document.getElementById(this.id + "_nmdrPS_pbox" + (num + 1));
			fadeElement(null, m, 1.0, 0.0, s);
			fadeElement(null, n, 0.0, 1.0, s);
            scrollElement(this.id + "_nmdrPS_content", null, -this.albumWidth, 0,
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
                                
            moveElement(null, document.getElementById(id2), null, this.albumHeight - d1,
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
						
			scrollElement(this.id + "_nmdrPS_thumsArea" + num, null, -dx, 0,
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
							
			scrollElement(this.id + "_nmdrPS_thumsArea" + num, null, dx, 0,
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
		
		stopPropagation(evt);
		var elem = document.getElementById(this.id + "_nmdrPS_sbox" + this.currentAlbum);
		elem.style.visibility = show ? "visible" : "hidden";
	};
	
    $.showDesc = function (evt, num, show) {

        if (evt) stopPropagation(evt);
			
		if (this.inAnimation) return;
		
		var bx = document.getElementById(this.id + "_nmdrPS_dbox" + num);

		if (!show) { bx.innerHTML = ""; bx.style.display = "none"; return; }
		
		document.getElementById(this.id + "_nmdrPS_sbox" + num).style.visibility = "visible";
		
		registerPopup(bx, document.getElementById(this.id + "_nmdrPS_desc" + num), 
			function() { 
				bx.innerHTML = ""; 
				bx.style.display = "none"; 
			} 
		);

		var sel1 = "<select name='albums' id='" + this.id + "_nmdrPS_albums' onchange=\"_$('" + this.id + "').changeAlbum(event," + num + ")\" style='font:11px Arial,Helvetica,sans-serif;width:200px;'>";
		for (var i in this.albums) sel1 += "<option value='" + i + "' " + (this.currentAlbum == i ? "selected" : "") + ">" + this.albums[i].title + "</option>";
		sel1 += "</select>";
		
		var sel2 = "<select name='effects' id='" + this.id + "_nmdrPS_effects' onchange=\"_$('" + this.id + "').changeEffect()\" style='font:11px Arial,Helvetica,sans-serif;width:200px;'>";
		for (var i in this.effects) sel2 += "<option value='" + i + "' " + (this.effect == i ? "selected" : "") + ">" + this.effects[i] + "</option>";
		sel2 += "</select>";
		
		var buff = [], album = this.albums[num], 
			desc = this.getImageDescription(album), 
			links = this.getImageLinks();
		
		buff.push("<table border=0, cellpadding=0, cellspacing=8, width=100% height=100%>");
		buff.push("<tr><td style='height:10px'></td></tr>");		
		buff.push("<tr><td style='height:40px;border-bottom:2px solid #ccc;'><a style='color:#ccc;font:13px Arial,Helvetica,sans-serif;'>" + album.title + "</a></td></tr>");		
		buff.push("<tr><td style='height:5px'></td></tr>");		
		buff.push("<tr><td style='height:110px;vertical-align:top;'><a id='" + this.id + "_nmdrPS_descDs" + num + "' style='color:#fff;font:20px Segoe UI Light,Segoe UI,Arial,Helvetica,Sans-Serif;font-weight: 100'>" + desc + "</a>" + links + "</td></tr>");
		buff.push("<tr><td style='height:36px;'><table border=0, cellpadding=0, cellspacing=0, width=100% height=100%>");
		buff.push("<tr><td><a style='color:#ccc;font:11px Arial,Helvetica,sans-serif;'>Albums</a></td><td>" + sel1 + "</td></tr>");		
		buff.push("<tr><td><a style='color:#ccc;font:11px Arial,Helvetica,sans-serif;'>Effects&nbsp;&nbsp;</a></td><td>" + sel2 + "</td></tr></table></td></tr>");		
		buff.push("<tr><td style='height:20px;'><a style='color:#ccc;font:12px Arial,Helvetica,sans-serif;'>© nalizadeh.com 2016</a></td></tr>");		
		buff.push("<tr><td></td></tr>");
		buff.push("</table>");
		bx.innerHTML = buff.join("");
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
			"<img src='" + this.imagePath + "bing16x16.png' style='cursor:pointer;' onclick=\"_$('" + this.id + "').openLink('" + ln1 + "')\">&nbsp;" +
			"<img src='" + this.imagePath + "google16x16.png' style='cursor:pointer;' onclick=\"_$('" + this.id + "').openLink('" + ln2 + "')\">";
			
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
		
		var afterChange = function() { 
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
		var buff = [];
		
		var hdir = this.effect == 2 || this.effect == 3 ? this.effect == 2 ? -1 : 1 : 0;
		var vdir = this.effect == 4 || this.effect == 5 ? this.effect == 4 ? -1 : 1 : 0;

		var bleft = hdir * -1 * this.albumWidth;
		var btop = vdir * -1 * this.albumHeight;
		
		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);'></div>");

		buff.push("<div class='back' " +
			"style='position:absolute;left:" + bleft + "px;top:" + btop + "px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;opacity:0;alpha(opacity=0);'></div>");
		
		cont.innerHTML = buff.join("");
		
		var self = this;
		var doChange = function () {
		
			var back = cont.getElementsByClassName("back")[0];
			var front = cont.getElementsByClassName("front")[0];
			
 			if (self.effect == 0) {
				fadeElement(null, front, 1.0, 0.0, 0.02,
					function (args) { 
						fadeElement(null, back, 0.0, 1.0, 0.02, callback); 
					}
				);
			}
			else {
				var st = stepH / self.albumWidth;
				
				fadeElement(null, front, 1.0, 0.0, st);
				fadeElement(null, back, 0.0, 1.0, st);
				
				if (self.effect == 2 || self.effect == 3) {
					scrollElement(null, front, hdir * self.albumWidth, 0);
					scrollElement(null, back, hdir * self.albumWidth, 0, callback);
				}
				else {
					scrollElement(null, front, 0, vdir * self.albumHeight);
					scrollElement(null, back, 0, vdir * self.albumHeight, callback);
				}
			}
		};
		
		setTimeout(doChange, 50);
	};

    $.effect_1_6_7_8_9_10_11 = function (cont, pnameNew, pnameOld, callback) {
		var buff = [];
        buff.push("<div class='back' " +
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

		buff.push("<div class='front' " +
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
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		var sx = Math.round(this.albumWidth / this.slices);
		
		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 12 ? dx - 50 : dx2 - 50;

			buff.push("<div class='back' " +
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
			
			buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateY(0deg);transition-delay:" + de + "ms;transform-origin:" + to + "px 0px;" +
			"-webkit-transition:1s;-webkit-transform:rotateY(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:" + to + "px 0px;" +
			"'></div>");
		}
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		var sx = Math.round(this.albumHeight / this.slices);
		
		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 14 ? dx - 50 : dx2 - 50;

			buff.push("<div class='back' " +
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
			
			buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(" + qx + "px," + this.albumWidth + "px," + dx + "px,0px);" +
			"transition:1s;transform:rotateX(0deg);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		var sx = Math.round(this.albumWidth / this.slices);

		for (var i=1; i <= this.slices; i++) {
			var dx = i * sx;
			var dx2 = (this.slices - i + 1) * sx;
			var qx = dx - sx
			var to = dx - 50;
			var de = this.effect == 16 || this.effect == 18 ? dx - 50 : dx2 - 50;

			buff.push("<div class='back' " +
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

			buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"clip:rect(0px," + dx + "px," + this.albumHeight + "px," + qx + "px);" +
			"transition:1s;transform:rotateX(0deg);transition-delay:" + de + "ms;transform-origin:0px " + to + "px;" +
			"-webkit-transition:1s;-webkit-transform:rotateX(0deg);-webkit-transition-delay:" + de + "ms;-webkit-transform-origin:0px " + to + "px;" +
			"'></div>");
		}

		cont.innerHTML = buff.join("");
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
		var ra = resizeKeepingRatio(sx,sy,4,4);
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
          	
            var buff = [];

            for (var i=0; i < self.boxes; i++) {
                var xx = i * sx;
                var dx = xx + sh > xx + sx ? xx + sx : xx + sh;

                for (var j=0; j < self.boxes; j++) {
                    var yy = j * sy;
                    var dy = yy + sv > yy + sy ? yy + sy : yy + sv;
                    
					// rect (top, right, bottom, left)
                    
                    buff.push("<div class='back' " + 
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
            cont.innerHTML = buff.join("");
			animId = requestAnimationFrame(doChange);
        };
		
        doChange();   
    };
	
    $.effect_21 = function (cont, pnameNew, pnameOld, callback) {
	
        var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		var ra = resizeKeepingRatio(sx,sy,4,4);
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
          	
            var buff = [];
            for (var i=0; i < sepoint; i++) {
                
                var x = calc[i] % self.boxes;
                var y = Math.floor(calc[i] / self.boxes);               
                
                var xx = x * sx;
                var dx = xx + sh > xx + sx ? xx + sx : xx + sh;

                var yy = y * sy;
                var dy = yy + sv > yy + sy ? yy + sy : yy + sv;
                    
				// rect (top, right, bottom, left)
                
                buff.push("<div class='back' " + 
                "style='position:absolute;left:0px;top:0px;width:" + self.albumWidth + "px;height:" + self.albumHeight + "px;" +
                "backface-visibility:visible;background-image: url(\"" + pnameNew + "\");background-size:cover;" +
                "clip:rect(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "-webkit-clip-path:rest(" + yy + "px," + dx + "px," + dy + "px," + xx + "px);" +
                "'></div>");
            }
           
            sh += ra.width;
            sv += ra.height;
            cont.innerHTML = buff.join("");
			animId = requestAnimationFrame(doChange);
        };
		
        doChange();   
    };
	
    $.effect_22 = function (cont, pnameNew, pnameOld, callback) {
		
		var buff = [];
		var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx

			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buff.push("<div class='back' " +
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
				buff.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"-webkit-transition: all 1.5s ease-in-out;transition: all 1.5s ease-in-out;-webkit-transform:scale(1,1);transform:scale(1,1);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buff.join("");
		
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
		
		var buff = [];
		var sx = Math.round(this.albumWidth / this.boxes);
		var sy = Math.round(this.albumHeight / this.boxes);
		
		for (var i=1; i <= this.boxes; i++) {
			var dx = i * sx;
			var qx = dx - sx

			for (var j=1; j <= this.boxes; j++) {
				var dy = j * sy;
				var qy = dy - sy;
				buff.push("<div class='back' " +
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
				buff.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:center center;transition:transform 1.5s;transform:rotateX(0deg);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:center center;-webkit-transition:transform 1.5s;-webkit-transform:rotateX(0deg);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buff.join("");
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
		
		var buff = [];
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
				buff.push("<div class='back' " +
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
				buff.push("<div class='front' " +
				"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
				"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;opacity:1;alpha(opacity=1);" +
				"clip:rect(" + qy + "px," + dx + "px," + dy + "px," + qx + "px);" +
				"transform-style:preserve-3d;transform-origin:" + to + "px " + ro + "px;transition:transform 1.5s;transform:rotateX(0deg);" +
				"-webkit-transform-style:preserve-3d;-webkit-transform-origin:" + to + "px " + ro + "px;-webkit-transition:transform 1.5s;-webkit-transform:rotateX(0deg);" +
				"'></div>");
			}
		}
			
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		
		this.holeOut_Style(buff);
		this.swashin_Style(buff);
		
        buff.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;opacity:0;alpha(opacity=0);" +
			"-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;'></div>");

		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;opacity:1;alpha(opacity=1);" +
			"-webkit-transition: opacity 1.5s ease; transition: opacity 1.5s ease;'></div>");
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		
		this.boingOutDown_Style(buff);
		this.boingInUp_Style(buff);
		
        buff.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		
		this.slideDown_Style(buff);
		this.slideUp_Style(buff);
		
        buff.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;pointer-events:auto;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		
		this.slideLeft_Style(buff);
		this.slideRight_Style(buff);
		
        buff.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");background-size:cover;'></div>");

		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");background-size:cover;'></div>");
		
		cont.innerHTML = buff.join("");
		
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
		var buff = [];
		
		var e1 = this.effect == 29 || this.effect == 30;
		var e2 = this.effect == 29 || this.effect == 32;
		
		this.slideCubeOut_Style(buff, e1 ? true : false, e2 ? 1 : -1);
		this.slideCubeIn_Style(buff, e1 ? true : false, e2 ? 1 : -1);
		
        buff.push("<div class='back' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameNew + "\");backface-visibility:hidden;background-size:cover;'></div>");

		buff.push("<div class='front' " +
			"style='position:absolute;left:0px;top:0px;width:" + this.albumWidth + "px;height:" + this.albumHeight + "px;" +
			"background-image: url(\"" + pnameOld + "\");backface-visibility:hidden;background-size:cover;'></div>");
		
		cont.innerHTML = buff.join("");
		
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
    
	$.holeOut_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes holeOut ");
		buff.push("{0% {opacity:1;transform-origin:50% 50%;transform:scale(1,1) rotateY(0deg);}");
		buff.push("100% {opacity:0;transform-origin:50% 50%;transform:scale(0,0) rotateY(180deg);}}");
		buff.push(".holeOut {animation-duration:2s;animation-fill-mode:both;animation-name: holeOut;}");
		buff.push("</style>");
	};
	
	$.swashin_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes swashin ");
		buff.push("{0% {opacity:0;transform-origin:50% 50%;transform:scale(0,0);}");
		buff.push("90% {opacity:1;transform-origin:50% 50%;transform:scale(0.9,0.9);}");
		buff.push("100% {opacity:1;transform-origin:50% 50%;transform:scale(1,1);}}");
		buff.push(".swashin {animation-duration:2s;animation-fill-mode:both;animation-name: swashin;}");
		buff.push("</style>");
	};
	
	$.boingOutDown_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes boingOutDown ");
		buff.push("{0% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}");
		buff.push("20% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(5deg);}");
		buff.push("30% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}");
		buff.push("40% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(10deg) rotateY(10deg);}");
		buff.push("100% {opacity:0;transform-origin:100% 100%;transform:perspective(800px) rotateX(90deg) rotateY(0deg);}}");
		buff.push(".boingOutDown {animation-duration:1s;animation-fill-mode:both;animation-name: boingOutDown;}");
		buff.push("</style>");
	};
	
	$.boingInUp_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes boingInUp ");
		buff.push("{0% {opacity:0;transform-origin:50% 0%;transform:perspective(800px) rotateX(-90deg);}");
		buff.push("50% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(50deg);}");
		buff.push("100% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(0deg);}}");
		buff.push(".boingInUp {animation-duration:5s;animation-fill-mode:both;animation-name: boingInUp;}");
		buff.push("</style>");
	};
	
	$.slideDown_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes slideDown ");
		buff.push("{0% {transform-origin: 0 0;transform: translateY(0%);}");
		buff.push("100% {transform-origin: 0 0;transform: translateY(100%);}}");
		buff.push(".slideDown {animation-duration:1s;animation-fill-mode:both;animation-name: slideDown;}");
		buff.push("</style>");
	};

	$.slideUp_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes slideUp ");
		buff.push("{0% {transform-origin: 0 0;transform: translateY(100%);}");
		buff.push("100% {transform-origin: 0 0;transform: translateY(0%);}}");
		buff.push(".slideUp {animation-duration:1s;animation-fill-mode:both;animation-name: slideUp;}");
		buff.push("</style>");
	};
	
	$.slideLeft_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes slideLeft ");
		buff.push("{0% {transform-origin: 0 0;transform: translateX(100%);}");
		buff.push("100% {transform-origin: 0 0;transform: translateX(0%);}}");
		buff.push(".slideLeft {animation-duration:1s;animation-fill-mode:both;animation-name: slideLeft;}");
		buff.push("</style>");
	};

	$.slideRight_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes slideRight ");
		buff.push("{0% {transform-origin: 0 0;transform: translateX(0%);}");
		buff.push("100% {transform-origin: 0 0;transform: translateX(100%);}}");
		buff.push(".slideRight {animation-duration:1s;animation-fill-mode:both;animation-name: slideRight;}");
		buff.push("</style>");
	};
	
	$.slideCubeOut_Style = function (buff, ho, dir) {
		
		var tz = ho ? (this.albumWidth / 2) : (this.albumHeight / 2);
		var rp = ho ? dir == 1 ? "rotateY(0deg)" : "rotateY(0deg)" : dir == 1 ? "rotateX(0deg)" : "rotateX(0deg)";
		var rq = ho ? dir == 1 ? "rotateY(90deg)" : "rotateY(-90deg)" : dir == 1 ? "rotateX(90deg)" : "rotateX(-90deg)";
		
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes cubeOut ");
		buff.push("{0% {transform: " + rp + " translateZ(" + tz + "px);opacity:1;visibility:visible;}");
		buff.push("100% {transform: " + rq + " translateZ(" + tz + "px);opacity:0;visibility:hidden;}}");
		buff.push(".cubeOut {animation-duration:2s;animation-timing-function:cubic-bezier(0.5,0.9,0.5,1);animation-name: cubeOut;}");
		buff.push("</style>");
	};
    
	$.slideCubeIn_Style = function (buff, ho, dir) {
		
		var tz = ho ? (this.albumWidth / 2) : (this.albumHeight / 2);
		var rp = ho ? dir == 1 ? "rotateY(-90deg)" : "rotateY(90deg)" : dir == 1 ? "rotateX(-90deg)" : "rotateX(90deg)";
		var rq = ho ? dir == 1 ? "rotateY(0deg)" : "rotateY(0deg)" : dir == 1 ? "rotateX(0deg)" : "rotateX(0deg)";

		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes cubeIn ");
		buff.push("{0% {transform: " + rp + " translateZ(" + tz + "px);opacity:0;visibility:visible;}");
		buff.push("100% {transform: " + rq + " translateZ(" + tz + "px);opacity:1;visibility:hidden;}}");
		buff.push(".cubeIn {animation-duration:2s; animation-timing-function:cubic-bezier(0.5,0.9,0.5,1);animation-name: cubeIn;}");
		buff.push("</style>");
	};   
    
	$.slideKenBurns_Style = function (buff) {
		buff.push("<style type=\"text/css\">");
		buff.push("@keyframes KenBurns { ");
		buff.push("0% {opacity:1;transform:scale(1);-ms-transform:scale(1); }");
		buff.push("5% {opacity:1}");
		buff.push("25% {opacity:1;}");
		buff.push("50% {opacity:1;transform:scale(1.4);-ms-transform:scale(1.4);}");
		buff.push("100% {opacity:1;transform:scale(1);-ms-transformm:scale(1);}}");
		 
		buff.push("@-o-keyframes KenBurns { ");
		buff.push("0% {opacity:1;-o-transform:scale(1);}");
		buff.push("5% {opacity:1}");
		buff.push("25% {opacity:1;}");
		buff.push("50% {opacity:1;-o-transform:scale(1.4);}");
		buff.push("100% {opacity:1;-o-transformm:scale(1);}}");

		buff.push("@-moz-keyframes KenBurns { ");
		buff.push("0% {opacity:1;-moz-transform:scale(1.4);}");
		buff.push("5% {opacity:1}");
		buff.push("25% {opacity:1;}");
		buff.push("50% {opacity:1;-moz-transform:scale(1.4);}");
		buff.push("100% {opacity:1;-moz-transformm:scale(1);}}");
		 
		buff.push("@-webkit-keyframes KenBurns { ");
		buff.push("0% {opacity:1;-webkit-transform:scale(1);}");
		buff.push("5% {opacity:1}");
		buff.push("25% {opacity:1;}");
		buff.push("50% {opacity:1;-webkit-transform:scale(1.4);}");
		buff.push("100% {opacity:1;-webkit-transformm:scale(1);}}");
		
		buff.push(".KenBurns {animation: KenBurns " + this.autoplayDelay + "ms linear infinite 0s;}");
		buff.push(".KenBurns {-o-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buff.push(".KenBurns {-moz-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buff.push(".KenBurns {-webkit-animation: KenBurns " + this.autoplayDelay + " linear infinite 0s;}");
		buff.push("</style>");
	};
	
	$.afterAnimation = function (elem, callback) {
		var self = this, tname = "";
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
