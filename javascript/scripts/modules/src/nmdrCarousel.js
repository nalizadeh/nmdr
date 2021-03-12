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

