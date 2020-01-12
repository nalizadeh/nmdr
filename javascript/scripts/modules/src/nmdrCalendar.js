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
#  nmdrCalendar
#
#  Version: 1.00.00
#  Date: Mai 03. 2015
#  Status: Release
#
#####################################################################
*/

function CALDATA(lang) {
	
    var d = new Date(),
	
    en = {
        months: d.langDATA.en.months,
        weekdays: d.langDATA.en.weekdays,
        daysShort: d.langDATA.en.daysShort,
        weekname: d.langDATA.en.weekname,
        views: ["Default view...","Tabular view...","Year view..."],
        commands: ["Open item...", "Edit item...", "Delete item..."]
    },
    de = {
        months: d.langDATA.de.months,
        weekdays: d.langDATA.de.weekdays,
        daysShort: d.langDATA.de.daysShort,
        weekname: d.langDATA.de.weekname,
        views: ["Standardansicht...","Tabellenansicht...","Jahresansicht..."],
        commands: ["Öffnen...", "Bearbeiten...", "Löschen..."]
    },
    fr = {
        months: d.langDATA.fr.months,
        weekdays: d.langDATA.fr.weekdays,
        daysShort: d.langDATA.fr.daysShort,
        weekname: d.langDATA.fr.weekname,
        views: ["Mode d'affichage standard...","Vue de table...","année..."],
        commands: ["Ouvert...", "Éditer...", "Effacer..."]
    };
	
	switch (lang) {
		case "en" : return en; break;
		case "de" : return de; break;
		case "fr" : return fr; break;
	}

    return en;
}

function nmdrCalendar(id) {

	var $ = nmdr.core.$(id, "nmdrCalendar");
	if ($ == null) return;
   
	//=== constants
	
    $.defaultView = 1;
    $.tabularView = 2;
    $.yearView = 3;
	
	//=== props
	
    $.view = $.defaultView;
    $.date = null;
    $.imagePath = "";
    $.lang = "en";
    $.langData = null;

    $.cellWidth = 0;
    $.cellHeight = 0;
       
    $.headerFontSize = 15;
    $.fontSize = 12;

    $.orgHeaderFontSize = $.headerFontSize;
    $.orgFontSize = $.fontSize;
	
    $.backgroundColor = "#fff";
    $.headerColor = "#000";
    $.headerBackground = "#fff";
    $.cellColor = "#000";
    $.cellBackground = "#fff";
    $.hoverColor = "orange";
    $.hoverBackground = "#D9EFFF";
	$.todayBackground = "#0072C6";
    $.notCurrentMonthBG = "#F2F2F2";
    $.saturdaySundayBG = "#F5FFFF";
    $.saturdaySundayFC = "#854";
    $.cellSelectionBG = "#FFFFD7";
    $.cellSelectionFC = "#000";
    $.wnCellBackground = "#FFF4CC";
    $.userCellBackground = "#EBF1DE";
	
    $.yvHeaderBackground = "#fff";
    $.yvCellBackground = "#fff";
    $.yvMonthTitleBackground = "#ddd";
       
	$.enabled = true;
	$.showOptions = true;
	$.showClock = true;
	$.showWN = true;
	$.showFooter = true;
	
	$.tabuserLines = 10;
	$.moDDListWidth = 75;
	$.yeDDListWidth = 50;
	
	//=== variables
	
    $.days = [];
    $.dayIndex = -1;
    $.monthIndex = 0;
    $.yearIndex = 0;
	
	$.commands = [];    
      
    $.init = function (props) { 
	
		props = props || {};

        this.setDate(props.hasOwnProperty("date") ? props.date == "" ? new Date() : props.date : new Date());
        
        this.view = props.hasOwnProperty("view") ? props.view : this.view;
        this.lang = props.hasOwnProperty("lang") ? props.lang : "en";
        this.langData = CALDATA(this.lang); 
        this.imagePath = props.hasOwnProperty("imagePath") ? props.imagePath : "img/";
        this.fontSize = props.hasOwnProperty("fontSize") ? props.fontSize : this.fontSize;
		this.enabled = props.hasOwnProperty("enabled") ? props.enabled : this.enabled
        this.showOptions = props.hasOwnProperty("showOptions") ? props.showOptions : this.showOptions;
        this.showClock = props.hasOwnProperty("showClock") ? props.showClock : this.showClock;
        this.showWN = props.hasOwnProperty("showWn") ? props.showWn : this.showWN;
		this.tabuserLines = props.hasOwnProperty("userLines") ? props.userLines : this.tabuserLines;
        
		this.commands = this.prepareCommands();

        this.dateChanged();
		
		nmdr.core.utils.updateOnLoadResize(this, function(self) {
			self.closeCellMenu();
			self.closeViewMenu();
			self.makeCalendar(); 
		});
    };

    $.makeCalendar = function () {

        var buf = [],
		pfx = "#" + this.id, 
		
		dd = this.date.getDate(),
		mm = this.date.getMonth(),
		yyyy = this.date.getFullYear(),

		curMonth = this.langData.months[this.date.getMonth()],
		dayOfWeek = this.langData.weekdays[this.date.getDay() == 0 ? 6 : this.date.getDay() - 1],
		
		todayText = dayOfWeek + " " + dd + " " + curMonth + " " + yyyy,

		tabcellWidth = 26,
		tabcellHeight = 18,
		tabusercellWidth = 80,

		yearCellWidth = 26,
		yearCellHeight = 24,
		
		daysnameHeight = 34,
		footerHeight = this.showFooter ? 22 : 0,

		paddingLeft = 10,
		headerHeight = this.view == this.defaultView ? 40 : 65,
		wnWidth = this.showWN ? 25 : 0,
		
		dim = nmdr.core.utils.getInnerDim(this.parentElement);

		this.headerFontSize = this.orgHeaderFontSize;
		this.fontSize = this.orgFontSize;

		this.cellWidth = (dim.width - wnWidth - 2 * paddingLeft) / 7;
		this.cellHeight = (dim.height - headerHeight - daysnameHeight - footerHeight) / 6;
		
        var width = 
			this.view == this.defaultView ? (this.cellWidth * 7 + wnWidth + 2 * paddingLeft) : 
			this.view == this.tabularView ? (tabcellWidth * 32 + tabusercellWidth + 28) : (yearCellWidth * 8 * 4);
			
		var height = 
			this.view == this.defaultView ? (this.cellHeight * 6 + headerHeight + daysnameHeight + footerHeight) : 
			this.view == this.tabularView ? (tabcellHeight * (this.tabuserLines + 4) + headerHeight + footerHeight + 4) : (yearCellHeight * 8 * 3 + headerHeight + footerHeight + 32);

		if (width < 280) {

			this.headerFontSize = 12;
			this.fontSize = 10;
			
			if (width < 250) {
				this.headerFontSize = 10;
				this.fontSize = 9;
				headerHeight = this.view == this.defaultView ? 32 : 65;
			}
			if (width < 180) 
				this.showOptions = false;
		}
		
        this.monthIndex = mm > 5 ? 5 : mm;
        this.yearIndex = yyyy;
		
        buf.push("<style type='text/css'>");
        buf.push(pfx + " * {box-sizing:border-box;}");
        buf.push(pfx + " .calcontainer {padding:0;margin:0;white-space:nowrap;background:" + this.backgroundColor + ";font-family:'Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif; outline:1px solid #ccc;}");
        
        buf.push(pfx + " .loader {position:absolute; display:none; height:100%; width:100%; cursor:wait; background:#fff url(\"" + this.imagePath + "loading.gif\") no-repeat center center;opacity:0.75;z-index:100;}");
        buf.push(pfx + " .header {color:#000;background:#fff;text-align:left;font-size:" + (this.fontSize - 1) + "px;font-weight:normal;}");
        buf.push(pfx + " .footer {color:#aaa;background:#fff;text-align:right;font-size:" + (this.fontSize - 1) + "px;font-weight:normal;}");
		
        buf.push(pfx + " .daysdiv {font-size:" + this.fontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .daysdiv table {table-layout: fixed; border-collapse: collapse;}");             

        //============
		      
        buf.push(pfx + " .hcells {cursor:default;text-align:left;vertical-align:bottom;cursor:default;height:" + daysnameHeight + "px;line-height:" + (daysnameHeight+16) + "px;background:" +
				this.headerBackground + ";color:" + this.headerColor + ";border-bottom:1px solid #ccc; font-weight:normal;}");

        buf.push(pfx + " .hcell {width:" + this.cellWidth + "px;height:100%;border-right:1px solid transparent;}");
        buf.push(pfx + " .hcellspan {padding-left:4px;}");

        buf.push(pfx + " .cell {width:" + this.cellWidth + "px;height:" + this.cellHeight + "px;cursor:default;border-bottom:1px solid #ddd; " +
				"border-right:1px solid #ddd;text-align:left;vertical-align:top;color:" + this.cellColor + ";background:" +	this.cellBackground + ";font-weight:normal; }");
				
        buf.push(pfx + " .hcellWN {width:" + wnWidth + "px;height:100%;padding-left:4px;}");
        buf.push(pfx + " .cellWN {width:" + wnWidth + "px;height:" + this.cellHeight + "px;border-left: 1px solid #ddd;border-bottom:1px solid #ddd;padding-left:4px;background:" + this.wnCellBackground + ";opacity: 0.5;}");

        //============
               
        buf.push(pfx + " .hcell1 {width:" + tabcellWidth + "px;height:38px;text-align:left;vertical-align:bottom;padding-bottom:3px;}");
        buf.push(pfx + " .hcell1 {border-bottom:1px solid #ddd;}");
        buf.push(pfx + " .hcell1:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell1_span {display:block;transform:rotate(-90deg);-moz-transform:rotate(-90deg);-ms-transform:rotate(-90deg);-webkit-transform:rotate(-90deg); }");
        buf.push(pfx + " .hcell1_user {width:" + tabusercellWidth + "px;}");
        
        buf.push(pfx + " .hcell2 {text-align:center;background:" + this.wnCellBackground + ";height:" + tabcellHeight + "px;}");
        buf.push(pfx + " .hcell2 {border-bottom:1px solid #ddd;}");
		buf.push(pfx + " .hcell2:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell2_user {}");

        buf.push(pfx + " .hcell3 {width:" + tabcellWidth + "px;height:" + tabcellHeight + "px;text-align:center;}");
        buf.push(pfx + " .hcell3 {border-bottom:1px solid #ddd;}");
		buf.push(pfx + " .hcell3:not(:last-child) {border-right:1px solid #ddd;}");
        buf.push(pfx + " .hcell3_user {border-bottom:1px solid #ddd;}");

        buf.push(pfx + " .hcell4 {width:" + tabcellWidth + "px;height:" + tabcellHeight + "px;}");
        buf.push(pfx + " .hcell4 {border-bottom:1px solid #ddd;}");
        buf.push(pfx + " .hcell4:not(:last-child) {border-right:1px solid #ddd;}");
		buf.push(pfx + " .hcell4_user {background:" + this.userCellBackground + ";border-bottom:1px solid #ddd; }");
		
 		buf.push(pfx + " .hcell_fr {border-left:1px solid #ddd;}");
        
        //============
        
        buf.push(pfx + " .yvContainer {background:#fff;border:1px solid " + this.yvMonthTitleBackground + ";}");
        buf.push(pfx + " .yvMontitle {background:" + this.yvMonthTitleBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvHcell {background:" + this.yvHeaderBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvCell {background:" + this.yvCellBackground + ";text-align:center;width:" + yearCellWidth + ";height:" + yearCellHeight + "px;}");
        buf.push(pfx + " .yvCellho {background:#9FDDEC !important;}");
        
        //============
        
        buf.push(pfx + " .hcell_fi {border-left: 1px solid transparent;}");
        buf.push(pfx + " .cell_fi {border-left: 1px solid #ddd;}");
        buf.push(pfx + " .cell_ac {cursor:pointer;}");
        buf.push(pfx + " .cell_ac:hover {background:" + this.hoverBackground + ";color:" + this.hoverColor + " !important;cursor:pointer;}");
        buf.push(pfx + " .cell_pa {opacity: 0.3;background:" + this.notCurrentMonthBG + "}");
        buf.push(pfx + " .cell_ss {color:" + this.saturdaySundayFC + ";background:" + this.saturdaySundayBG + "}");
        buf.push(pfx + " .cell_to {background:" + this.todayBackground + " !important;color:#fff !important;" + (this.fontSize + 2) + "px;font-weight:bold;}");
        buf.push(pfx + " .cell_se {background:" + this.cellSelectionBG + ";color:" + this.cellSelectionFC + " !important;font-weight:bold;}");
        buf.push(pfx + " .cell_ar {text-align:center;background:" + this.headerBackground + ";opacity: 0.4;}");
        buf.push(pfx + " .img {cursor:pointer; opacity: 1;}");
        buf.push(pfx + " .img:hover {opacity: 0.7;}");
        buf.push(pfx + " .clockdiv {font-family:Consolas,monaco,monospace;font-size:12px;font-weight:normal;}");
        buf.push(pfx + " .headtable {font-size:" + this.headerFontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .headtable td {padding:2px;}");
        buf.push(pfx + " .mtitle,.ytitle {cursor:pointer;}");
        buf.push(pfx + " .mtitle:hover,.ytitle:hover,.dayspan:hover {text-decoration:underline;}");
        buf.push(pfx + " .daydiv {width:100%;height:18px;padding:0;}");
        buf.push(pfx + " .userdiv {width:100%;height:" + (this.cellHeight - 19) + "px;padding:0; font-size:" + this.fontSize + "px;font-weight:normal;}");
        buf.push(pfx + " .dayspan, .dayspan_pa, .dayspan_ho {padding-left:4px;}");
        buf.push(pfx + " .dayspan:hover, .dayspan_ho:hover {font-weight:bold;}");
        buf.push(pfx + " .dayspan_ho {color:#a1d490 !important; font-size:" + (this.fontSize + 3) + "px;font-weight:bold;}");
		
		buf.push(pfx + " .monthsdiv, .yearsdiv {overflow:hidden;background:white;box-shadow:3px 3px 3px #eee;transition:all 0.3s ease-in-out; -webkit-transition:all 0.3s ease-in-out; -moz-transition:all 0.3s ease-in-out; -o-transition:all 0.3s ease-in-out;}");
        buf.push(pfx + " .monthstable, .yearstable {border:1px solid #ccc;}");
        buf.push(pfx + " .monthstable td {width:46px;height:24px;cursor:pointer;text-align:left;font-size:12px;font-weight:normal;padding-left:5px;}");
        buf.push(pfx + " .yearstable td {width:26px;height:24px;cursor:pointer;text-align:center;font-size:12px;font-weight:normal;}");
        buf.push(pfx + " .monthcell:hover, .yearcell:hover {background:#33AAFF;color:white;}");

        buf.push("</style>");
					
        buf.push(
        "<div class='calcontainer' id='" + this.id + "_nmdrCAL_container' style='display:block;position:relative;left:0px;top:0px;width:" + width + "px;height:" + height + "px;'>" +
        "<div class='loader'></div>" +
        "<div class='header' style='display:block;position:absolute;left:" + paddingLeft + "px; top:5px; width:" + (width-2*paddingLeft) + "px; height:" + headerHeight + "px;'>" +
		"<table class='headtable' cellpadding='2' cellspacing='0' border='0'><tr>" +
		"<td style='padding-top:4px'><img class='img' src='" + this.imagePath + "ghome.gif' onclick=\"nmdr.core.$('" + this.id + "').goToday();\"></td>" +
		"<td style='padding-top:6px'><img class='img' src='" + this.imagePath + "calprev.png' onclick=\"nmdr.core.$('" + this.id + "').goPrevMonth();\"></td>" +
		"<td style='padding-top:6px'><img class='img' src='" + this.imagePath + "calnext.png' onclick=\"nmdr.core.$('" + this.id + "').goNextMonth();\"></td>" +
		"<td style='padding-left:5px'><span class='mtitle' id='" + this.id + "_nmdrCAL_mtitle' onclick=\"nmdr.core.$('" + this.id + "').openMonthPopup();\">" + curMonth + "</span></td>" +
		"<td style='padding-left:3px'><span class='ytitle' id='" + this.id + "_nmdrCAL_ytitle' onclick=\"nmdr.core.$('" + this.id + "').openYearPopup();\">" + yyyy + "</span></td>" +
 		(this.showOptions ? "<td style='padding:8px 0 0 8px'><img class='img' src='" + this.imagePath + "calmenu.png' onclick=\"nmdr.core.$('" + this.id + "').openViewMenu(this);\"></td>" : "") +
		"</tr></table></div>" +
		"<div class='daysdiv' id='" + this.id + "_nmdrCAL_daysdiv' style='display:block;position:absolute;left:" + paddingLeft + "px;top:" + headerHeight + "px;width:" + (width-2*paddingLeft) + "px;height:" + (height-75) + "px;'></div>" +
		(this.showFooter ? "<div class='footer' style='display:block;position:absolute;left:" + paddingLeft + "px; top:" + (height-footerHeight) + "px; width:" + (width-2*paddingLeft) + "px; height:" + footerHeight + "px;line-height:" + (footerHeight+3) + "px;'><span>" + todayText + "</span>" +
        (this.showClock ? "&nbsp;&nbsp;&nbsp;<span id='" + this.id + "_nmdrCAL_clock'></span></div>" : "</div>") : "") +
        "<div class='monthsdiv' id='" + this.id + "_nmdrCAL_monthsdiv' style='position:absolute;left:0px; top:0px; width:0px; height:170px;z-index:998;'>" + this.makeMonthsList() + "</div>" +
        "<div class='yearsdiv' id='" + this.id + "_nmdrCAL_yearsdiv' style='position:absolute;left:0px; top:0px; width:0px; height:170px;z-index:999;'>" + this.makeYearsList() + "</div>" +
        "</div>");

        this.innerHTML = buf.join("");

        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrCAL_monthsdiv", this.scrollMonths);
        nmdr.core.utils.addMouseWheelEvent(this, this.id + "_nmdrCAL_yearsdiv", this.scrollYears);

		this.makeDays();
		
		if (this.showClock) nmdrDigitalClock(this.id + "_nmdrCAL_clock").start();
    };

    $.makeDays = function () {
        
        this.days = [];
        var	curMonth = this.langData.months[this.date.getMonth()],
			yyyy = this.date.getFullYear(),
			html = 
            this.view == this.defaultView ? this.makeDefaultView() : 
            this.view == this.tabularView ? this.makeTabularView() : this.makeYearView();

		document.getElementById(this.id + "_nmdrCAL_mtitle").innerHTML = curMonth;
		document.getElementById(this.id + "_nmdrCAL_ytitle").innerHTML = yyyy;
		document.getElementById(this.id + "_nmdrCAL_daysdiv").innerHTML = html;
 		
        this.afterRendering();

        nmdr.core.tooltips.start("calhotspot", "#BCDBE6", "#0EB5ED");
    };
    
    $.makeDefaultView = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
	
			firstDay = new Date(yyyy, mm, 1),
			lastDay = new Date(yyyy, mm, 0),
			today = new Date(),
		
			curMonthDays = [],
			d = new Date(yyyy, mm, 1);
			
        while (d.getMonth() === mm) {
            curMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var prevMonthDays = [],
			mx = mm == 0 ? 11 : mm - 1,
			yx = mm == 0 ? yyyy - 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            prevMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var nextMonthDays = [],
			mx = mm == 11 ? 0 : mm + 1,
			yx = mm == 11 ? yyyy + 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            nextMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var start = false, end = false, ind=0, p=0, q=0, s=0, cd = new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay() - 1;

        for (var c = 0; c < 7; c++) {
            if (this.langData.weekdays[c] == this.langData.weekdays[pd]) break;
            s++;
        }

        var buf = [];
        buf.push("<div class='hcells' style='display:block;'>");

        if (this.showWN) buf.push("<div class='hcellWN' style='display:inline-block;width:" + this.langData.weekname + "px;'>" + this.langData.weekname + "</div>");
			
        for (var i = 0; i < this.langData.weekdays.length; i++) {
			var dn = this.cellWidth < 80 ?  this.langData.daysShort[i==6?0:i+1] : this.langData.weekdays[i], fi = i==0 ? " hcell_fi" : "";
            buf.push("<div class='hcell " + fi + "' style='display:inline-block;'><span class='hcellspan'>" + dn.toUpperCase() + "</span></div>");
        }
        buf.push("</div>");
		
        this.days = [];

        for (var r = 0; r < 6; r++) {
            buf.push("<div style='display:block;'>");
							
            for (var c = 0; c < 7; c++) {
                var m = false, d = new Date(curMonthDays[p]);
                pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
                if (!start && this.langData.weekdays[pd] == this.langData.weekdays[c]) start = true;
                if (p == curMonthDays.length) end = true;
                if (start && !end) {
                    p++;
                    m = true;
                    //if (this.dayIndex === -1 && dd === d.getDate()) this.dayIndex = ind;  // <== if each month should have a selected day then comment in this line!
                }
                else if (!start) d = new Date(prevMonthDays[prevMonthDays.length - s + c]);
                else if (end) d = new Date(nextMonthDays[q++]);
                			
                this.days.push(d);

				var td = d.toDateString() == today.toDateString(),
					sel = this.enabled && this.dayIndex == ind,
					hol = d.isHoliday(),
					dn = d.getDay() == 0 ? 6 : d.getDay()-1,				
					tooltip = "";
					
                if (hol != null) {
                    tooltip = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                    for (var i = 0; i < hol.federalstates.length; i++) {
                        tooltip += hol.federalstates[i];
                        if (i < hol.federalstates.length - 1) tooltip += "<br>";
                    }
                }

				if (this.showWN && c == 0) 
					buf.push("<div class='cellWN' style='display:inline-block;'>" + d.getWeek() + "</div>");

                buf.push("<div class='cell" + (c == 0 ? " cell_fi" : "") + (m ? " cell_ac" : " cell_pa") + (td ? " cell_to" : "") +
					(sel ? " cell_se" : "") + (dn == 5 || dn == 6 ? " cell_ss" : "") + "' id='" + this.id + "_nmdrCAL_cell_" + ind + "'" +
					(this.enabled && m ? " onclick=\"nmdr.core.$('" + this.id + "').openCellMenu(this, " + ind + ")\"" : "") + " style='display:inline-block;'>" +
					"<div class='daydiv' style='display:block;'>" +
					"<span class='" + (hol != null ? "dayspan_ho calhotspot" : (m ? "dayspan" : "dayspan_pa")) + "' id='" + this.id + "_nmdrCAL_cellspan_" + ind + "'" +					
					(hol != null ? " tooltip='" + tooltip + "'" : "") + ">" + d.getDate() + "</span></div>" +
					"<div class='userdiv' style='display:block;'>" + this.renderCell(d) + "</div></div>");
					
                ind++;
            }
            buf.push("</div>");
        }
        
        return buf.join("");
	};
	
    $.makeTabularView = function () {

        var dd = this.date.getDate(),
			mm = this.date.getMonth(),
			yyyy = this.date.getFullYear(),
			today = new Date(),
			curMonthDays = [],
			d = new Date(yyyy, mm, 1);
		
        while (d.getMonth() === mm) {
            curMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var nextMonthDays = [],
			mx = mm == 11 ? 0 : mm + 1,
			yx = mm == 11 ? yyyy + 1 : yyyy,
			d = new Date(yx, mx, 1);
			
        while (d.getMonth() == mx) {
            nextMonthDays.push(d.toDateString());
            d.setDate(d.getDate() + 1);
        }

        var p=0, q=0, s=0, ix=false, cd = new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay() - 1,
			buf=[], bf1=[], bf2=[], bf3=[], bf4=[], p=0;
			
        for (var c = 0; c < 7; c++) {
            if (this.langData.weekdays[c] == this.langData.weekdays[pd]) break;
            s++;
        }

        bf1.push("<td class='hcell1_user'></td>");
        bf2.push("<td class='hcell2_user'></td>");
        bf3.push("<td class='hcell3_user'></td>");

		for (var ind = 0; ind < 31; ind++) {
 
            var m = false, d = new Date(curMonthDays[p]);
            pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
            if (p != curMonthDays.length) {
                p++;
                m = true;
                //if (this.dayIndex === -1 && dd === d.getDate()) this.dayIndex = ind;  // <== if each month should have a selected day then comment in this line
            }
            else d = new Date(nextMonthDays[q++]);
            
            this.days.push(d);

			var td = d.toDateString() == today.toDateString(),
				sel = this.enabled && this.dayIndex == ind,
				hol = d.isHoliday(),
				tooltip = "";
			
            if (hol != null) {
                tooltip = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                for (var t = 0; t < hol.federalstates.length; t++) {
                    tooltip += hol.federalstates[t];
                    if (t < hol.federalstates.length - 1) tooltip += "<br>";
                }
            }
            			
			var cls = (m ? " cell_ac" : " cell_pa") + (td ? " cell_to" : "") + (sel ? " cell_se" : "") + (pd == 5 || pd == 6 ? " cell_ss" : "");
					
            bf1.push("<td class='hcell1" + cls + "' id='" + this.id + "_nmdrCAL_dcell_" + ind + "'>" +
                "<span class='hcell1_span " + (hol != null ? "dayspan_ho calhotspot" : (m ? "dayspan" : "dayspan_pa")) + "' id='" + this.id + "_nmdrCAL_cellspan_" + ind + "'" +					
					(hol != null ? " tooltip='" + tooltip + "'" : "") + ">" + d.getDate() + "." + (d.getMonth()+1) + "</span></td>");

			if (d.getDay() == 1) {
				if (ind == 0) ix = true;
				var cr = false, cs = ind == 0 ? 7 : ind < 7 ? ind : ind < 24 ? 7 : 0;
				if (cs == 0) { cs = 7; cr = !ix; }
				bf2.push("<td class='hcell2' id='" + this.id + "_nmdrCAL_wcell_" + ind + "' colspan=" + cs + ">" +
				"<span class='hcell_2_span'>" + d.addDay(d,(ix ? 0 : -1)).getWeek() + "</span></td>");
				if (cr) {
					bf2.push("<td class='hcell2' id='" + this.id + "_nmdrCAL_wcell_" + ind + "' colspan=" + (31-ind) + ">" +
					"<span class='hcell2_span'>" + d.addDay(d,1).getWeek() + "</span></td>");
				}
			}
			
            bf3.push("<td class='hcell3" + cls + (ind==0 ? " hcell_fr" : "") + "' id='" + this.id + "_nmdrCAL_ncell_" + ind + "'>" +
				"<span class='hcell3_span'>" + this.langData.daysShort[d.getDay()] + "</span></td>");
        }
		
		for (var i = 0; i < this.tabuserLines; i++) {
			bf4.push("<tr><td class='hcell4_user'>" + this.renderFirstColumn(i) + "</td>");
			p=q=0;
			for (var ind = 0; ind < 31; ind++) {
				var m = false, d = new Date(curMonthDays[p]);
				pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
				if (p != curMonthDays.length) {	p++; m = true; }
				else d = new Date(nextMonthDays[q++]);
				var cls = (m ? " cell_ac" : " cell_pa") + (pd == 5 || pd == 6 ? " cell_ss" : "") + (ind==0 ? " hcell_fr" : "");
				bf4.push("<td class='hcell4" + cls + "' id='" + this.id + "_nmdrCAL_ucell_" + i + "_" + ind + "'" +
					(this.enabled && m ? " onclick=\"nmdr.core.$('" + this.id + "').openCellMenu(this," + ind + ",'" + 
                    this.id + "_nmdrCAL_ucell_" + i + "_" + ind + "')\"" : "") + ">" + this.renderTableCell(i, ind, d) + "</td>");
			}
			bf4.push("</tr>");
		}
 
   		buf.push("<table width='100%' height='auto' border='0' cellpadding='0' cellspacing='0'>");
   		buf.push("<tr>" + bf1.join("") + "</tr>");
   		buf.push("<tr>" + bf2.join("") + "</tr>");
   		buf.push("<tr>" + bf3.join("") + "</tr>");
   		buf.push(bf4.join(""));
   		buf.push("</table>");
     
        return buf.join("");
	};

    $.makeYearView = function() {

        var year = this.date.getFullYear();
        
        this.dayIndex = 0;
           
        var str =
            "<table width='100%' height='auto' cellpadding='4' cellspacing='0' border='0'>" +
            "<tr>" +
            "<td id='yearviewCell_0'>" + this.makeMonthTable("yearviewCell_0", year, 0, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" + 
            "<td id='yearviewCell_1'>" + this.makeMonthTable("yearviewCell_1", year, 1, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_2'>" + this.makeMonthTable("yearviewCell_2", year, 2, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_3'>" + this.makeMonthTable("yearviewCell_3", year, 3, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='yearviewCell_4'>" + this.makeMonthTable("yearviewCell_4", year, 4, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_5'>" + this.makeMonthTable("yearviewCell_5", year, 5, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_6'>" + this.makeMonthTable("yearviewCell_6", year, 6, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_7'>" + this.makeMonthTable("yearviewCell_7", year, 7, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='yearviewCell_8'>" + this.makeMonthTable("yearviewCell_8", year, 8, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_9'>" + this.makeMonthTable("yearviewCell_9", year, 9, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_10'>" + this.makeMonthTable("yearviewCell_10", year, 10, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "<td id='yearviewCell_11'>" + this.makeMonthTable("yearviewCell_11", year, 11, this.lang, false, this.getYVTooltip, this.getYVBackground) + "</td>" +
            "</tr>" +
            "</table>";

        return str;
    };
    
    $.makeMonthTable = function(id, year, month, lang, render, tooltipCallback, backgroundCallback) {

        var date = new Date(year, month, 1),
            yyyy = date.getFullYear(),
            curMonth = this.langData.months[date.getMonth()],
            self = this;

        var makeDays = function () {

            var dd = date.getDate(),
                mm = date.getMonth(),
                yyyy = date.getFullYear(),

                firstDay = new Date(yyyy, mm, 1),
                lastDay = new Date(yyyy, mm, 0),
                today = new Date(),

                curMonthDays = [],
                d = new Date(yyyy, mm, 1);                
            
            while (d.getMonth() === mm) {
                curMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var prevMonthDays = [],
                mx = mm == 0 ? 11 : mm - 1,
                yx = mm == 0 ? yyyy - 1 : yyyy,
                d = new Date(yx, mx, 1);
                
            while (d.getMonth() == mx) {
                prevMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var nextMonthDays = [],
                mx = mm == 11 ? 0 : mm + 1,
                yx = mm == 11 ? yyyy + 1 : yyyy,
                d = new Date(yx, mx, 1);
                
            while (d.getMonth() == mx) {
                nextMonthDays.push(d.toDateString());
                d.setDate(d.getDate() + 1);
            }

            var start=false, end=false, p=0, q=0, s=0, cd=new Date(curMonthDays[0]), pd = cd.getDay() == 0 ? 6 : cd.getDay()-1;

            for (var c = 0; c < 7; c++) {
                if (self.langData.weekdays[c] == self.langData.weekdays[pd]) break;
                s++;
            }

            var daysstr = "", daystitle = "<tr>";

            for (var i = 0; i < self.langData.weekdays.length; i++) {
                daystitle += "<td class='yvHcell'><span>" + self.langData.daysShort[i==6?0:i+1] + "</span></td>";
            }
            daystitle += "</tr>";

            for (var r = 0; r < 6; r++) {
                daysstr += "<tr>";
                for (var c = 0; c < 7; c++) {
                    var m = false, d = new Date(curMonthDays[p]);
                    pd = d.getDay() == 0 ? 6 : d.getDay() - 1;
                    if (!start && self.langData.weekdays[pd] == self.langData.weekdays[c]) start = true;
                    if (p == curMonthDays.length) end = true;
                    if (start && !end) { p++; m = true; }
                    else if (!start) d = new Date(prevMonthDays[prevMonthDays.length - s + c]);
                    else if (end) d = new Date(nextMonthDays[q++]);
                    
                    self.days.push(d);

                    var td = d.toDateString() == today.toDateString(),
						hol = d.isHoliday(),
						tt = hol ? null : tooltipCallback(d),
						bc = hol ? null : backgroundCallback(d),
						st = tt ? " style='background:" + (bc ? bc : this.yvCellBackground) + "'" : "";
                    
                    if (hol != null) {
                        tt = "<strong>" + hol.name + "</strong><br><br>Feiertag in:<br>";
                        for (var t = 0; t < hol.federalstates.length; t++) {
                            tt += hol.federalstates[t];
                            if (t < hol.federalstates.length - 1) tt += "<br>";
                        }
                    }

                    var dy = d.getDay() == 0 ? 6 : d.getDay()-1, 
                        dn = d.getDate(), 
                        dm = self.enabled && m && hol == null ? (" onclick=\"nmdr.core.$('" + self.id + "').openCellMenu(this," + self.dayIndex + ")\"") : "",
                        mm = m && tt != null && tt != "" ? 
                            ("yvCellac" + (hol != null ? " yvCellho" : "") + "'" + st + " " + dm + "><span class='calhotspot' tooltip='" + tt + "'>" + dn + "</span>") : 
                            (m ? "yvCellac'" + dm + "><span>" + dn + "</span>" : "'>");

                    daysstr += "<td id='" + self.id + "_cell" + self.dayIndex + "' class='yvCell" + (m ? " cell_ac" : " cell_pa") + (td && m ? " cell_to" : "") +
                        (dy==5 || dy==6 ? " cell_ss" : "") + st + " " + mm + "</td>";

                    self.dayIndex++;
                }
                daysstr += "</tr>";
            }

            return daystitle + daysstr;
        };

        var calStr =
        "<div class='yvContainer'>" +
        "<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>" +
        "<tr><td class='yvMontitle' colspan='7'><span>" + curMonth + "&nbsp;&nbsp;" + yyyy + "</span></td></tr>" + makeDays() + "</table></div>";

        if (render) document.getElementById(id).innerHTML = calStr;
        
        return calStr;
    };
   
    $.getYVTooltip = function (date) {
        return null;
    };

    $.getYVBackground = function (date) {
        return null;
    };
	
    //========================
       
    $.getDate = function () {
        return this.date;
    };

    $.setDate = function (date) {
        if (typeof (date) == "string") this.date = new Date(date);
        else this.date = date;
        this.dayIndex = -1;
    };

    $.selectDay = function (index, cellid) {
		
		if (this.view == this.defaultView) {
			if (this.dayIndex != -1) {
				var el = document.getElementById(this.id + "_nmdrCAL_cell_" + this.dayIndex);
				if (el) el.classList.remove("cell_se"); // <-- el could be null becouse of dynamic html
			}
			
            this.dayIndex = -1;
            
			if (index != -1) {
				var d = this.days[index];
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));				
                    
                   this.dayIndex = index;
				
				var el = document.getElementById(this.id + "_nmdrCAL_cell_" + index);
				el.classList.add("cell_se");
			}
		}
		else if (this.view == this.tabularView) {
			if (this.dayIndex != -1) {
				var e1 = document.getElementById(this.id + "_nmdrCAL_dcell_" + this.dayIndex);
				var e2 = document.getElementById(this.id + "_nmdrCAL_ncell_" + this.dayIndex);            
				if (e1) { 
					e1.classList.remove("cell_se"); 
					e2.classList.remove("cell_se"); 
					
					var e3 = document.getElementsByClassName("ucellsel");
					if (e3.length > 0) {
						var el = e3[0];
						el.classList.remove("ucellsel"); 
						el.classList.remove("cell_se"); 
					}
				}
			}
			
            this.dayIndex = -1;

			if (index != -1) {
				var d = this.days[index];
				
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));
                    
                this.dayIndex = index;
								
				var e1 = document.getElementById(this.id + "_nmdrCAL_dcell_" + this.dayIndex);
				var e2 = document.getElementById(this.id + "_nmdrCAL_ncell_" + this.dayIndex);
				e1.classList.add("cell_se");
				e2.classList.add("cell_se");
				
				if (cellid) {
					var e3 = document.getElementById(cellid);
					if (e3) {
						e3.classList.add("ucellsel"); 
						e3.classList.add("cell_se"); 
					}
				}
			}
		}
		else {
			var e1 = document.getElementsByClassName("ucellsel");
			if (e1.length > 0) {
                var el = e1[0];
				el.classList.remove("ucellsel"); 
				el.classList.remove("cell_se"); 
			}
			
			if (index != -1) {
				var d = this.days[index];
				
				this.setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate(),
					this.date.getHours(), this.date.getMinutes(), 0));
                    
				var el = document.getElementById(this.id + "_cell" + index);
				if (el) {
					el.classList.add("ucellsel"); 
					el.classList.add("cell_se"); 
				}
			}
	    }
    };

    $.selectMonth = function (month) {
		this.selectDay(-1);
        this.setDate(new Date(this.date.getFullYear(), month, this.date.getDate(),
		this.date.getHours(), this.date.getMinutes(), 0));
        this.dateChanged();
    };

    $.selectYear = function (year) {
		this.selectDay(-1);
        this.setDate(new Date(year, this.date.getMonth(), this.date.getDate(),
		this.date.getHours(), this.date.getMinutes(), 0));
        this.dateChanged();
    };

    $.goPrevMonth = function () {
		this.selectDay(-1);
        this.setDate(this.date.prevMonth());
        this.dateChanged();
    };

    $.goNextMonth = function () {
		this.selectDay(-1);
        this.setDate(this.date.nextMonth());
        this.dateChanged();
    };

    $.goToday = function () {
		this.selectDay(-1);
        this.setDate(new Date());
        this.dateChanged();
    };

    $.refresh = function () {
        this.dateChanged();
    };
	
    $.dateChanged = function () {
        if (this.date != null) {
            var self = this;
            this.showLoader(true);
            window.setTimeout(function () {
                self.prepareUserData(self.date.toISOString(), function () {
                    self.showLoader(false);
                    self.makeCalendar();
                });
            }, 50);
        }
    };

	$.executeMenuCommand = function (commandName) {
		var self = this;
		this.closeCellMenu(function() { self.executeCommand(commandName, self.getDate()); } );
	};

	//=================================================================
    // Virtual methods (may be overridden by user)
	//=================================================================

    $.prepareUserData = function (date, callback) {
        setTimeout(function () { callback(); }, 20);
    };

    $.renderFirstColumn = function (row) {
        return "" + row;
    };
    
    $.renderCell = function (date) {
        return "";
    };

    $.renderTableCell = function (date) {
        return "";
    };
    
    $.afterRendering = function () {
    };

    $.prepareCommands = function () {
        return [
            { name: this.langData.commands[0], icon: "details.gif", enabled: true, action: "view" },
            { name: this.langData.commands[1], icon: "editdetails.gif", enabled: true, action: "edit" },
            { name: this.langData.commands[2], icon: "delete.gif", enabled: true, action: "delete" },
        ];
    };
	
    $.checkCommands = function (commands, date, callback) {	
		callback();
	};
	
	$.executeCommand = function (commandName, date) {
		alert(commandName + "  " + date);
	};

	//=================================================================
    // View menu
	//=================================================================

	$.changeView = function (num) {
		var self = this;
		this.closeViewMenu(function() {
			switch (num) {
				case 1: self.view = self.defaultView; break;
				case 2: self.view = self.tabularView; break;
				case 3: self.view = self.yearView; break;
			}
			self.dateChanged();
		});
	};
	
    $.openViewMenu = function (src) {
				
        this.selectDay(-1);

		var self = this, buf = [];
	
		buf.push("<style>.viewMenuTr {height:24px;} .viewMenuTr:hover {color:#fff;background:#33AAFF; cursor:pointer;}</style>");
		buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(1)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview1.png'></td>");
		buf.push("<td><span>" + this.langData.views[0] + "</span></td>");
		buf.push("</tr>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(2)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview2.png'></td>");
		buf.push("<td><span>" + this.langData.views[1] + "</span></td>");
		buf.push("</tr>");

        buf.push("<tr class='viewMenuTr' onclick=\"nmdr.core.$('" + this.id + "').changeView(3)\">");
		buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + "calview3.png'></td>");
		buf.push("<td><span>" + this.langData.views[2] + "</span></td>");
		buf.push("</tr></table>");

		var m = document.createElement("div");
        m.setAttribute("id", this.id + "_nmdrCAL_viewmenu");
		m.innerHTML = buf.join("");

		m.style.cssText = 
		"position:absolute;background-color:white; border:1px solid #bbb; padding:3px; width:0; height:0; opacity:0; font-family:arial,verdana,sans-serif; font-weight:normal; font-size:12px; z-index:999;" +
		"box-shadow:5px 5px 5px #eee; transition:all 500ms ease-in-out; -webkit-transition:all 500ms ease-in-out; -moz-transition:all 500ms ease-in-out; -o-transition:all 500ms ease-in-out;";
		
		document.body.appendChild(m);
		
		m.style.left = src.absLeft + "px";
		m.style.top = src.absTop + 20 + "px";
		m.style.height = 80 + "px";
		m.style.width = 180 + "px";
		m.style.opacity = 1;
			
		nmdr.core.popup.open(m, src, null, function (cb) { self.closeViewMenu(cb); });
    };
	
    $.closeViewMenu = function (callback) {
		var m = document.getElementById(this.id + "_nmdrCAL_viewmenu");
		if (m != null) {
			m.innerHTML = "";
			m.style.width = 0;
			m.style.height = 0;
			m.style.opacity = 0;
			
			nmdr.core.popup.close();
			
			if (callback) callback();
			
			document.body.removeChild(m);
		}
    };
    
    //=================================================================
    // Cell menu
	//=================================================================

    $.makeCellMenu = function (loading, src) {
		
		var m = document.getElementById(this.id + "_nmdrCAL_cellmenu");
		
		if (loading) {
			var self = this;
			
			if (m == null) {
				m = document.createElement("div");
				m.setAttribute("id", this.id + "_nmdrCAL_cellmenu");
							
				m.style.cssText = 
				"position:absolute;background-color:white; border:1px solid #bbb; padding:3px; width:0; height:0; opacity:0; font-family:arial,verdana,sans-serif; font-weight:normal; font-size:12px; z-index:998;" +
				"box-shadow:3px 3px 3px #eee; transition:all 500ms ease-in-out; -webkit-transition:all 500ms ease-in-out; -moz-transition:all 500ms ease-in-out; -o-transition:all 500ms ease-in-out;";

				document.body.appendChild(m);
			}
		
			m.innerHTML = "<div style='position:absolute; height:100%; width:100%; top:0px; left:0px; cursor:wait;" +
			"background:#fff url(" + this.imagePath + "loading.gif) no-repeat center center;opacity:0.75; z-index:999;'></div>";
		
			m.style.visibility = "visible";
			m.style.left = src.absLeft + "px";
			m.style.top = src.absTop + 20 + "px";
			m.style.height = (this.commands.length * 24 + 28) + "px";
			m.style.width = 180 + "px";
			m.style.opacity = 1;
			
			nmdr.core.popup.open(m, src, null, 
				function (cb) { self.closeCellMenu(cb); },
				function (invoker, target) { 
					var p = target.parentElement;
					while (p != null) {
						if (p == invoker) return false;
						p = p.parentElement;
					}
					return true;
				}
			);
			return;
		}

		var buf = [];
		buf.push("<style>.cellMenuTr {height:24px;} .cellMenuTr:hover {color:#fff;background:#33AAFF; cursor:pointer;} .menuclose:hover {cursor:pointer;}</style>");
		buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");
        buf.push("<tr style='height:20px'><td colspan='2' style='text-align:right;background:#eee;padding:2px 3px 0 0;'>");
		buf.push("<img class='menuclose' src='" + this.imagePath + "dmclose.png' onclick=\"nmdr.core.$('" + this.id + "').closeCellMenu()\"></td></tr>");

		for (var i = 0; i < this.commands.length; i++) {
			var com = this.commands[i];
			buf.push("<tr class='cellMenuTr'" + (com.enabled ? " onclick=\"nmdr.core.$('" + this.id + "').executeMenuCommand('" + com.action + "')\"" : "") + 
				(com.enabled ? "" : " style='opacity:0.5;") + "'>");
			buf.push("<td style='width:24px;padding:3px 0 0 5px;'><img src='" + this.imagePath + com.icon + "'></td>");
			buf.push("<td><span>" + com.name + "</span></td>");
			buf.push("</tr>");
		}
		buf.push("</table>");

        m.innerHTML = buf.join("");
    };
	
    $.openCellMenu = function (src, index, cellid) {
		
		var self = this;

		this.selectDay(index, cellid);
		this.makeCellMenu(true, src);		
		this.commands = this.prepareCommands();
		
        window.setTimeout(function () {
			self.checkCommands(self.commands, self.getDate(), 
				function() {
					self.makeCellMenu(false);
				}
			);       
        }, 50);
    };
	
    $.closeCellMenu = function (callback) {
	
        var m = document.getElementById(this.id + "_nmdrCAL_cellmenu");
		
		if (m != null) {
			
			this.selectDay(-1);
			
			var c = document.getElementById(this.id + "_nmdrCAL_container");
			m.style.left = c.absLeft + "px";
			m.style.top = c.absTop + "px";
			m.style.width = 0;
			m.style.height = 0;
			m.style.opacity = 0;
			m.style.visibility = "hidden";
			
			nmdr.core.popup.close();
			
			if (callback) callback(); 
		}
    };

    //=================================================================
    // Months drop down menu
	//=================================================================

    $.makeMonthsList = function () {
        var mms = "";
        for (var i = this.monthIndex; i < this.langData.months.length; i++) {
            mms += "<tr><td class='monthcell' id='" + this.id + "_nmdrCAL_monthcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectMonth(" + i + ");\"><span>" + this.langData.months[i] + "</span></td></tr>";
        }
        return "<table class='monthstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + mms + "</table>";
    };

    $.openMonthPopup = function () {
		var self = this
        var e = document.getElementById(this.id + "_nmdrCAL_mtitle");
        var m = document.getElementById(this.id + "_nmdrCAL_monthsdiv");
        var c = document.getElementById(this.id + "_nmdrCAL_container");
        m.style.position = "absolute";
        m.style.left = e.absLeft - c.absLeft + "px";
        m.style.top = e.absTop - c.absTop + 20 + "px";
		m.style.width = this.moDDListWidth + "px";
		nmdr.core.popup.open(m, e, null, function (cb) { self.closeMonthPopup(cb); });
    };

    $.closeMonthPopup = function (callback) {
        var m = document.getElementById(this.id + "_nmdrCAL_monthsdiv");
		m.style.width = "0";
		nmdr.core.popup.close();
		if (callback) callback();
    };

    $.scrollMonths = function (src, step) {
        if (step <= -120) { if (src.monthIndex < 5) src.monthIndex++; }
        else if (src.monthIndex > 0) src.monthIndex--;
        document.getElementById(src.id + "_nmdrCAL_monthsdiv").innerHTML = src.makeMonthsList();
    };

    //=================================================================
    // Years drop down menu
	//=================================================================

    $.makeYearsList = function () {
        var yms = "";
        for (var i = this.yearIndex; i < this.yearIndex + 7; i++) {
            yms += "<tr><td class='yearcell' id='" + this.id + "_nmdrCAL_yearcell_" + i + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').selectYear(" + i + ");\"><span>" + i + "</span></td></tr>";
        }
        return "<table class='yearstable' width='100%' height='100%' cellpadding='0' cellspacing='0'>" + yms + "</table>";
    };

    $.openYearPopup = function () {
		var self = this
        var e = document.getElementById(this.id + "_nmdrCAL_ytitle");
        var m = document.getElementById(this.id + "_nmdrCAL_yearsdiv");
        var c = document.getElementById(this.id + "_nmdrCAL_container");
        m.style.position = "absolute";
        m.style.left = e.absLeft - c.absLeft + "px";
        m.style.top = e.absTop - c.absTop + 20 + "px";
		m.style.width = this.yeDDListWidth + "px";
		nmdr.core.popup.open(m, e, null, function (cb) { self.closeYearPopup(cb); });
    };

    $.closeYearPopup = function (callback) {
        var m = document.getElementById(this.id + "_nmdrCAL_yearsdiv");
		m.style.width = "0";
		nmdr.core.popup.close();
		if (callback) callback();
    };

    $.scrollYears = function (src, step) {
        if (step <= -120) { if (src.yearIndex < 2094) src.yearIndex++; }
        else if (src.yearIndex > 1995) src.yearIndex--;
        document.getElementById(src.id + "_nmdrCAL_yearsdiv").innerHTML = src.makeYearsList();
    };

    $.showLoader = function (show) {        
        var loader = this.getElementsByClassName("loader")[0];
        if (loader) {
            loader.style.display = show ? "inline" : "none";
            loader.style.cursor = show ? "wait" : "default";
        }
    };

    return $;
}

