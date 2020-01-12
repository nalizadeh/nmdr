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

