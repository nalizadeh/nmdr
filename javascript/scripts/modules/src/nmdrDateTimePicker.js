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

