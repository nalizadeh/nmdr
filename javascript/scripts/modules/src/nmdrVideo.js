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

