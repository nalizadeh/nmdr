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

  __  __ __  __    ____   _____
 /  \/ //  \/  \  / __ \ / - _/ 
/_/\__//_/\__/\_\/_/_/_//_/\_\  
_______________________________ 

  N M D R - T O O L K I T S 
  
  Author: Nader Alizadeh
  Copyright: nalizadeh.com
  Revision: 3112031218063101.27-01-18.27
  
  minimize with: https://jscompress.com/
  
  ==> https://jspreadsheets.com/
  
*/

'use strict';

var nmdr = nmdr || {
	
	core: Object.freeze({
		
		$: function(id, name) { 
			//var elem = (typeof id == "string") ? this.$(id) : id;

			var elem = document.getElementById(id); 
			if (elem == null) {
				alert("[" + name + "]\n\nThe specified container '" + id + "' does not exist.\n" + 
				"Please verify that you have a container with this ID in the page.");
			}
			return elem;
		},
		
		onLoad: function(callback) {
			var isReady = setInterval(function() {
				if (document.body) {
					clearInterval(isReady);
					callback();
				}
			}, 10);
		},

		utils: 		new nmdrUtils(),
		xml: 		new nmdrXML(),
		animate: 	new nmdrAnimate(),
		ajax: 		new nmdrAjax(),
		tooltips: 	new nmdrTooltips(),
		popup: 		new nmdrPopup(),
		dialog: 	new nmdrDialogWrapper()
	}),
	
	modules: {},
	
	initModules: function() {
		this.modules = {
			"accordion": 	{methode: "nmdrAccordion"},
			"album": 		{methode: "nmdrAlbum"},
			"bitmap": 		{methode: "nmdrBitmap"},
			"calendar": 	{methode: "nmdrCalendar"},
			"carousel": 	{methode: "nmdrCarousel"},
			"aClock": 		{methode: "nmdrAnalogClock", url: "nmdrClock"},
			"dClock": 		{methode: "nmdrDigitalClock", url:"nmdrClock"},
			"dClockCss": 	{methode: "nmdrCssDigitalClock", url:"nmdrClock"},
			"commands": 	{methode: "nmdrCommands"},
			"datetime": 	{methode: "nmdrDateTimePicker"},
			"favorites": 	{methode: "nmdrFavorites"},
			"layout": 		{methode: "nmdrLayout"},
			"menu": 		{methode: "nmdrMenu"},
			"checkboxList":	{methode: "nmdrCheckboxList"},
			"multiSelect": 	{methode: "nmdrMultiSelect"},
			"phpCalendar": 	{methode: "nmdrPHPCalendar"},
			"pixshow": 		{methode: "nmdrPixShow"},
			"ribbon": 		{methode: "nmdrRibbon"},
			"table": 		{methode: "nmdrTable"},
			"tabs": 		{methode: "nmdrTabs"},
			"tabview": 		{methode: "nmdrTabview"},
			"teaser": 		{methode: "nmdrTeaser"},
			"tile": 		{methode: "nmdrTile", url: "nmdrTile"},
			"tiles": 		{methode: "nmdrTiles", url: "nmdrTile"},
			"slideTile": 	{methode: "nmdrSlideTile", url: "nmdrTile"},
			"tree": 		{methode: "nmdrTree"},
			"video": 		{methode: "nmdrVideo"},
		};
	},
	
	loadModule: function(name, callback, location) { 
		this.loadModules([name], callback, location); 
	},
	
	loadModules: function(names, callback, location) {
		
		var loads = [], self = this, loc = location || "scripts/modules/", n = 0;

		names.forEach(function(item, index) {
			var m = self.modules[item];
			if (m && self[item] === undefined) {
				loads.push({name: item, methode: m.methode, url: loc + (m.url ? m.url : m.methode) + "-min.js"});
			}
		});
		
		n = loads.length;
		loads.forEach(function(item, index) {
			self.core.utils.loadModule("nmdr", item.name, item.methode, item.url, function() {
				n--;
				if (n === 0 && callback) callback();
			});
		});
	},
};

(function() { nmdr.initModules(); }());

/*
#####################################################################
#
#  nmdrUtils
#
#  Version: 1.00.00
#  Date: October 15. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrUtils() {
	
	//=== define prototypes

	this.initPrototypes = function() {

		//=== Extansions for Date

		Date.prototype.langDATA = {
			en: {
				months:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				weekdays:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				daysShort:["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				weekname:"WN",
				nextMonth: "Next month",
				prevMonth: "Previous month"
			},
			de: {
				months:["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
				weekdays:["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
				daysShort:["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
				weekname:"KW",
				nextMonth: "Nächster Monat",
				prevMonth: "Vorheriger Month"
			},
			fr: {
				months:["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
				weekdays:["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
				daysShort:["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
				weekname:"SE",
				nextMonth: "Le mois prochain",
				prevMonth: "Mois précédent"
			}
		};
	   
		Date.prototype.convert = function (d) {
			// Converts the date in d to a date-object. The input can be:
			//  a date object: returned without modification
			//  an array : Interpreted as [year,month,day]. NOTE: month is 0-11.
			//  a number : Interpreted as number of milliseconds since 1 Jan 1970 (a timestamp) 
			//  a string : Any format supported by the javascript engine, like "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
			//  an object : Interpreted as an object with year, month and date attributes. **NOTE** month is 0-11.
			return (
				d.constructor === Date ? d :
				d.constructor === Array ? new Date(d[0], d[1], d[2]) :
				d.constructor === Number ? new Date(d) :
				d.constructor === String ? new Date(d) :
				typeof d === "object" ? new Date(d.year, d.month, d.date) :
				NaN
			);
		};

		Date.prototype.compare = function (a, b) {
			// Compare two dates (could be of any type supported by the convert
			// function above) and returns:
			//  -1 : if a < b
			//   0 : if a = b
			//   1 : if a > b
			// NaN : if a or b is an illegal date
			// NOTE: The code inside isFinite does an assignment (=).
			return (
				isFinite(a = this.convert(a).valueOf()) &&
				isFinite(b = this.convert(b).valueOf()) ?
				(a > b) - (a < b) :
				NaN
			);
		};

		// usage:
		//
		// d.inRange(start, end)
		// d.inRange(start, end, date)
		//
		Date.prototype.inRange = function (start, end, d) {
			
			if (d == null) d = this;
			
			// Checks if date in d is between dates in start and end.
			// Returns a boolean or NaN:
			//   true  : if d is between start and end (inclusive)
			//   false : if d is before start or after end
			//   NaN   : if one or more of the dates is illegal.
			// NOTE: The code inside isFinite does an assignment (=).
			return (
				 isFinite(d = this.convert(d).valueOf()) &&
				 isFinite(start = this.convert(start).valueOf()) &&
				 isFinite(end = this.convert(end).valueOf()) ?
				 start <= d && d <= end :
				 NaN
			);
		};
		
		// usage:
		//
		// d.isLeapYear()
		// d.isLeapYear(year)
		//
		Date.prototype.isLeapYear = function (year) {
			var y = year ? year : this.getFullYear();
			return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0));
		};

		// usage:
		//
		// d.isWeekend()
		// d.isWeekend(d)
		//
		Date.prototype.isWeekend = function (d) {
			var day = d ? d.getDay() : this.getDay();
			return day == 6 || day == 0;
		};
		
		// usage:
		//
		// d.getDaysInMonth(year, month)
		//
		Date.prototype.getDaysInMonth = function (year, month) {
			return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		};

		// usage:
		//
		// d.addDay(days)
		// d.addDay(d, days)
		// d.addDay(null, days)
		//
		Date.prototype.addDay = function (date, days) {
			
			var d = this, ds = days;
			if (date && date instanceof Date) d = date; 
			else if (date != null) ds = date;
			
			if (isFinite(d = this.convert(d))) {
				var nd = new Date(d);
				nd.setDate(d.getDate() + ds);
				return nd;
			}
			return NaN;
		};
		
		// usage:
		//
		// d.addMonth(months)
		// d.addMonth(d, months)
		// d.addMonth(null, months)
		//
		Date.prototype.addMonth = function (date, months) {
			
			var d = this, mo = months;
			if (date && date instanceof Date) d = date; 
			else if (date != null) mo = date;
			
			if (isFinite(d = this.convert(d))) {
				var nd = new Date(d), n = nd.getDate();
				nd.setDate(1);
				nd.setMonth(nd.getMonth() + mo);
				nd.setDate(Math.min(n, this.getDaysInMonth(nd.getFullYear(), nd.getMonth())));
				return nd;
			}
			return NaN;
		};

		// usage:
		//
		// d.nextMonth(d)
		// d.nextMonth()
		//
		Date.prototype.nextMonth = function (d) {
			var dt = d ? d : this, thisMonth = dt.getMonth();
			this.setMonth(thisMonth + 1);
			if (dt.getMonth() != thisMonth + 1 && dt.getMonth() != 0) dt.setDate(0);
			return dt;
		};

		// usage:
		//
		// d.prevMonth(d)
		// d.prevMonth()
		//
		Date.prototype.prevMonth = function (d) {
			var dt = d ? d : this, thisMonth = dt.getMonth();
			dt.setMonth(thisMonth - 1);
			if (dt.getMonth() != thisMonth - 1 && (dt.getMonth() != 11 || (thisMonth == 11 && dt.getDate() == 1)))
				dt.setDate(0);
			return dt;
		};

		// usage:
		//
		// d.getWeek()
		//
		// Returns the ISO week of the date.
		//
		Date.prototype.getWeek = function() {
			var date = new Date(this.getTime());
			date.setHours(0, 0, 0, 0);
			// Thursday in current week decides the year.
			date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
			// January 4 is always in week 1.
			var week1 = new Date(date.getFullYear(), 0, 4);
			// Adjust to Thursday in week 1 and count number of weeks from date to week1.
			return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
		};
		
		Date.prototype.dayOfWeek = function (lang, d) {        
			var days = lang == "en" ? this.langDATA.en.weekdays : this.langDATA.de.weekdays;
			return days[d ? d.getDay() : this.getDay()];
		};
		
		Date.prototype.monthOfYear = function (lang, d) {
			var days = lang == "en" ? this.langDATA.en.months : this.langDATA.de.months;
			return months[d ? d.getMonth() : this.getMonth()];	
		};
		
		// usage:
		//
		// d.getEasterSunday(year)
		// d.getEasterSunday()
		//
		Date.prototype.getEasterSunday = function(year) {
			var y = year ? year : this.getFullYear(),
				a = y % 19,
				b = Math.floor(y / 100),
				c = y % 100,
				d = Math.floor(b / 4),
				e = b % 4,
				f = Math.floor((b + 8) / 25),
				g = Math.floor((b - f + 1) / 3),
				h = (19 * a + b - d - g + 15) % 30,
				i = Math.floor(c / 4),
				j = c % 4,
				k = (32 + 2 * e + 2 * i - h - j) % 7,
				l = Math.floor((a + 11 * h + 22 * k) / 451),
				m = (h + k + 7 * l + 114),
				n = Math.floor(m / 31) - 1,
				o = m % 31 + 1;
				
			return new Date(y,n,o); 
		};

		// usage:
		//
		// d.getBußUndBettag(year)
		// d.getBußUndBettag()
		//
		Date.prototype.getBußUndBettag = function(year) {
			var result = this.addDay(new Date(year ? year : this.getFullYear(), 11, 31), -42), 
			dw = this.dayOfWeek(result);
			if (dw != 'Wednesday')
			{
				if (dw == 'Sunday')
					result = this.addDay(result, -4);
				else
					result = this.addDay(result, 3 - result.getDay());
			}
			return result;
		};

		// Caching of holidays in static dictionary (calculated only once)
		Date.prototype.allHolidays = {};
										   
		// usage:
		//
		// d.getAllHolidays(year)
		// d.getAllHolidays()
		//
		Date.prototype.getAllHolidays = function(year) {
			var y = year ? year : this.getFullYear();
			
			if (this.allHolidays[y] != null) return this.allHolidays[y];

			var es = this.getEasterSunday(y),
			son = y == 2017 ? "<br>Achtung: Anlässlich des 500jährigen Jubiläums von Martin Lothers Thesenanschlag:<br>Der Reformationstag wird einmalig am 31.10.2017 ein bundesweiter Feiertag sein." : "";
			
			var holidays = {};
			holidays[new Date(y, 0, 1)] = { name: "Neujahr", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 0, 6)] = { name: "Heilige Drei Könige", federalstates: ["Baden-Württemberg", "Bayern", "Sachsen-Anhalt"] };
			holidays[new Date(y, 4, 1)] = { name: "Tag der Arbeit", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 7, 15)] = { name: "Mariä Himmelfahrt", federalstates: ["Saarland"] }; 
			holidays[new Date(y, 9, 3)] = { name: "Tag der Deutschen Einheit", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 9, 31)] = { name: "Reformationstag", federalstates: ["Brandenburg","Mecklenburg-Vorpommern","Sachsen","Sachsen-Anhalt","Thüringen", son] };
			holidays[new Date(y, 10, 1)] = { name: "Allerheiligen", federalstates: ["Baden-Württemberg","Bayern","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland"] };
			holidays[new Date(y, 11, 24)] = { name: "Heiliger Abend", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 11, 25)] = { name: "Erster Weihnachtstag", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 11, 26)] = { name: "Zweiter Weihnachtstag", federalstates: ["Bundesweit"] };
			holidays[new Date(y, 11, 31)] = { name: "Silvester", federalstates: ["Bundesweit"] };
			holidays[es] = { name: "Ostersonntag", federalstates: ["Brandenburg"] };
			holidays[this.addDay(es, -2)] = { name: "Karfreitag", federalstates: ["Bundesweit"] };
			holidays[this.addDay(es, 1)] = { name: "Ostermontag", federalstates: ["Bundesweit"] };
			holidays[this.addDay(es, 39)] = { name: "Christi Himmelfahrt", federalstates: ["Bundesweit"] };
			holidays[this.addDay(es, 49)] = { name: "Pfingstsonntag", federalstates: ["Brandenburg"] };
			holidays[this.addDay(es, 50)] = { name: "Pfingstmontag", federalstates: ["Bundesweit"] };
			holidays[this.addDay(es, 60)] = { name: "Fronleichnam", federalstates: ["Baden-Württemberg","Bayern","Hessen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland"] };
			holidays[this.getBußUndBettag(y)] = { name: "Buß- und Bettag", federalstates: ["Sachsen"] };

			this.allHolidays[y] = holidays;
			
			return holidays;
		};
		
		// usage:
		//
		// d.isHoliday(d,"state")
		// d.isHoliday(null, "state")
		// d.isHoliday("state")
		//
		Date.prototype.isHoliday = function(date, federalstate) {
			var d = this, fs = federalstate;

			if (date && date instanceof Date) d = date; 
			else if (date != null) fs = date;
			
			var holidays = d.getAllHolidays(),
				holiday = holidays[new Date(d.getFullYear(), d.getMonth(), d.getDate())];
			
			if (holiday != null) {
				if (fs) {
					var federalstates = ["Baden-Württemberg", "Bayern", "Brandenburg", "Bundesweit", "Hessen", "Nordrhein-Westfalen", 
						"Mecklenburg-Vorpommern", "Rheinland-Pfalz", "Sachsen", "Sachsen-Anhalt", "Saarland", "Thüringen"];

					fs = federalstates.indexOf(fs) == -1 ? 'Bundesweit' : fs;
					
					if (holiday.federalstates.indexOf(fs) != -1) {
						return holiday;
					}
					return null;
				}
				return holiday;
			}
			return null;
		};
		
		Date.prototype.asString = function (delimiter, withTime, d) {
			var da = d ? d : this;
			if (isFinite(da = this.convert(da))) {
				var dd = da.getDate(),
					mm = da.getMonth(),
					yyyy = da.getFullYear(),
					hh = da.getHours(),
					mi = da.getMinutes(),
					dl = delimiter ? delimiter : "/",
					wt = withTime ? withTime : false,
					st = (dd < 10 ? "0" + dd : dd) + dl + (mm + 1 < 10 ? "0" + (mm + 1) : mm + 1) + dl + yyyy;
					
				if (wt) st += " " + ((hh < 10 ? "0" + hh : hh) + ":" + (mi < 10 ? "0" + mi : mi));
				return st;
			}
			return "";
		};
		
		Date.prototype.toStr = function () {
			var dd = this.getDate(), mm = this.getMonth(), yyyy = this.getFullYear();
			return (mm + 1 < 10 ? "0" + (mm + 1) : mm + 1) + "/" + (dd < 10 ? "0" + dd : dd) + "/" + yyyy;
		};

		Date.prototype.withoutTime = function () {
			var d = new Date(this);
			d.setHours(0, 0, 0, 0);
			return d;
		};
		
		//=== Extansions for string

		if (typeof String.prototype.startsWith != "function") {
			String.prototype.startsWith = function(str) {
				return this.indexOf(prefix) === 0;
			}
		};

		if (typeof String.prototype.endsWith != "function") {
			String.prototype.endsWith = function(str) {
				return this.substring(this.length - str.length, this.length) === str;
			}
		};

		if (!String.prototype.splice) {
			/**
			 * {JSDoc}
			 *
			 * The splice() method changes the content of a string by removing a range of
			 * characters and/or adding new characters.
			 *
			 * @this {String}
			 * @param {number} start Index at which to start changing the string.
			 * @param {number} delCount An integer indicating the number of old chars to remove.
			 * @param {string} newSubStr The String that is spliced in.
			 * @return {string} A new string with the spliced substring.
			 */
			String.prototype.splice = function(start, delCount, newSubStr) {
				return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
			};
		}
		
		//=== Extansions for Element

		if (!Element.hasOwnProperty("absPosition")) {
			Object.defineProperty(Element.prototype, "absPosition", {
				get: function () { return nmdr.core.utils.position(this); }
			});
		}
		
		if (!Element.hasOwnProperty("absTop")) {
			Object.defineProperty(Element.prototype, "absTop", {
				get: function () { return this.absPosition.top; }
			});
		}

		if (!Element.hasOwnProperty("absLeft")) {
			Object.defineProperty(Element.prototype, "absLeft", {
				get: function () { return this.absPosition.left; }
			});
		}
	};
	
	//=== Events
	
	this.timerId = null;

	this.startTimer = function(callback, step) {
		this.stopTimer();
		this.timerId = setTimeout(callback, step);
	};

	this.stopTimer = function() {
		clearTimeout(this.timerId);
	};
	
	this.stopPropagation = function(e) {
		e = e || window.event;
		if (e.cancelBubble != null) e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		if (e.stopImmediatePropagation) e.stopImmediatePropagation();
		e.preventDefault();
	};

	this.addMouseWheelEvent = function(src, id, callback) {

		var div = document.getElementById(id);
		if (div) {

			//FF doesn't recognize mousewheel as of FF3.x
			var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"

			var sctm = function (e) {
				var evt = window.event || e; //equalize event object
				var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;

				callback(src, delta);

				if (evt.preventDefault)
					evt.preventDefault();
				else
					return false;
			};

			if (div.attachEvent) { //if IE (and Opera depending on user setting)
				div.attachEvent("on" + mousewheelevt, sctm)
			}
			else if (div.addEventListener) { //WC3 browsers
				div.addEventListener(mousewheelevt, sctm, false);
			}
		}
	};
	
	this.updateOnLoadResize = function(self, callback) {
		
		var to = false, update = function() { callback(self); };
		
		//=== update after load / reload page
		window.onload = update;
		
		//=== update after user has stopped resizing
		window.addEventListener("resize", function() { 
			if (to !== false) clearTimeout(to);
			to = setTimeout(update, 200); 
		});
		
		//=== or for immediately update
		//window.addEventListener("resize", update);
		
		//=== or use this
		//window.onresize = update;
	};
	
	//=== GEO 
		
	this.position = function (element) {
		var br = element.getBoundingClientRect();
		return { left: br.left + window.pageXOffset , top: br.top + window.pageYOffset }
	};

	this.positionOld = function(element, root) {
		var t = 0, l = 0;
		while (element) {
			if (root && element == root) break;
			l += (element.offsetLeft - element.scrollLeft);
			t += (element.offsetTop - element.scrollTop);
			element = element.offsetParent;
		}
		
		return {top: t, left: l};
	};
	
	this.calculateScroll = function() {
		if (window.pageYOffset) {
			return {left: window.pageXOffset, top: window.pageYOffset};
		}
		else {
			var sx, sy, r = document.documentElement, b = document.body;
			sx = r.scrollLeft || b.scrollLeft || 0;
			sy = r.scrollTop || b.scrollTop || 0;
			return {left: sx, top: sy};
		}
	};
	
	this.calculateWindowSize = function() {
		var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = w.innerWidth || e.offsetWidth || g.offsetWidth,
		y = w.innerHeight || e.offsetHeight || g.offsetHeight;
		return { width: x, height: y };
	};
	
	this.intersects = function(x1, y1, x2, y2, px, py) {
		return !(x2 < px || x1 > px || y2 < py || y1 > py);
	};
	
	this.isInside = function(event, element) {
		var ao = element.absPosition;
		var ax1 = ao.left;
		var ay1 = ao.top;
		var ax2 = ax1 + element.offsetWidth;
		var ay2 = ay1 + element.offsetHeight;
		return this.intersects(ax1, ay1, ax2, ay2, event.pageX, event.pageY);
	};

	// arguments: (element,id,id,...)
	this.isOutside = function() {
		for (var i = 1; i < arguments.length; i++) {
			if (this.isInside(arguments[0], document.getElementById(arguments[i]))) return false;
		}
		return true;
	};
	
	this.scale = function(id, width, height) {
		var elem = document.getElementById(id);
		if (elem != null) {

			var w = elem.width, h = elem.height, ratio = h / w;
			if (w >= width && ratio <= 1) {
				w = width;
				h = w * ratio;
			} else if (h >= height) {
				h = height;
				w = h / ratio;
			} else {
				w = width;
				h = height;
			}
			return { "width": Math.floor(w), "height": Math.floor(h) };
		}
		return null;
	};
	
	this.resizeImage = function(id, width, height, scale) {
		var elem = document.getElementById(id);
		if (elem) {
			var img = new Image()
			img.onload = function () {
				var w = img.width, h = img.height;
				if (scale) {
					var ratio = h / w;
					if (w >= width && ratio <= 1) {
						w = width;
						h = w * ratio;
					} else if (h >= height) {
						h = height;
						w = h / ratio;
					}
				}
				elem.width = w;
				elem.height = h;
			}
			img.src = elem.src;
		}
	};
	
	/**
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} destWidth
	 * @param {Number} destHeight
	 * 
	 * @return {width: Number, height:Number}
	 */
	this.resizeKeepingRatio = function(width, height, destWidth, destHeight) {
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
	};
	
	this.getInnerDim = function(elem) {
		
		if (elem == null) return {width:0,height:0};
		
		var style = window.getComputedStyle(elem),w1,w2,w3,w4,w5,w6,h1,h2,h3,h4,h5,h6;
		try { w1 = style.paddingLeft == "" ? 0 : parseFloat(style.paddingLeft); } catch(err) { w1 = 0; }
		try { w2 = style.paddingRight == "" ? 0 : parseFloat(style.paddingRight); } catch(err) { w2 = 0; }
		try { w3 = style.borderLeft == "" ? 0 : parseFloat(style.borderLeft); } catch(err) { w3 = 0; }
		try { w4 = style.borderRight == "" ? 0 : parseFloat(style.borderRight); } catch(err) { w4 = 0; }
		try { w5 = style.marginLeft == "" ? 0 : parseFloat(style.marginLeft); } catch(err) { w5 = 0; }
		try { w6 = style.marginRight == "" ? 0 : parseFloat(style.marginRight); } catch(err) { w6 = 0; }

		try { h1 = style.paddingTop == "" ? 0 : parseFloat(style.paddingTop); } catch(err) { h1 = 0; }
		try { h2 = style.paddingBottom == "" ? 0 : parseFloat(style.paddingBottom); } catch(err) { h2 = 0; }
		try { h3 = style.borderTop == "" ? 0 : parseFloat(style.borderTop); } catch(err) { h3 = 0; }
		try { h4 = style.borderBottom == "" ? 0 : parseFloat(style.borderBottom); } catch(err) { h4 = 0; }
		try { h5 = style.marginTop == "" ? 0 : parseFloat(style.marginTop); } catch(err) { h5 = 0; }
		try { h6 = style.marginBottom == "" ? 0 : parseFloat(style.marginBottom); } catch(err) { h6 = 0; }
		
		return {
			width: elem.offsetWidth - w1 - w2 - w3 - w4 - w5 - w6, 
			height: elem.offsetHeight - h1 - h2 - h3 - h4 - h5 - h6
		};
	};

	this.drawLine = function(x1, y1, x2, y2, color) {
		var a = x1 - x2,
			b = y1 - y2,
			c = Math.sqrt(a * a + b * b),

			sx = (x1 + x2) / 2,
			sy = (y1 + y2) / 2,

			x = sx - c / 2,
			y = sy,

			alpha = Math.PI - Math.atan2(-b, a),
			
			styles = "border: 1px solid " + color + "; "
				   + "position: absolute; "
				   + "top: " + y + "px; "
				   + "left: " + x + "px; "
				   + "width: " + c + "px; "
				   + "height: 0px; "
				   + "-moz-transform: rotate(" + alpha + "rad); "
				   + "-webkit-transform: rotate(" + alpha + "rad); "
				   + "-o-transform: rotate(" + alpha + "rad); "  
				   + "-ms-transform: rotate(" + alpha + "rad); ",
				   
			line = document.createElement("div");
				   
		line.setAttribute("style", styles); 
		
		document.body.appendChild(line);
	};
	
	this.drawRect = function(x1, y1, x2, y2, color) {
		this.drawLine(x1,y1,x2,y1,color);
		this.drawLine(x1,y2,x2,y2,color);
		this.drawLine(x1,y1,x1,y2,color);
		this.drawLine(x2,y1,x2,y2,color);
	};
	
	this.drawCircle = function(x, y, radius, bcolor, fcolor) {
		var styles = (fcolor ? "background: " + fcolor + ";" : "") 
			+ "border: 1px solid " + bcolor + "; "
			+ "position: absolute; "
			+ "top: " + y + "px; "
			+ "left: " + x + "px; "
			+ "width: " + radius + "px; "
			+ "height: " + radius + "px; "
			+ "border-radius: 50%; ",
				   
			circle = document.createElement("div");
				   
		circle.setAttribute("style", styles); 
		
		document.body.appendChild(circle);
	};

	//=== MISC
	
	this.readQueryString = function() {
		var urlParams = {},
			match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = window.location.search.substring(1);

		while (match = search.exec(query)) {
		   urlParams[decode(match[1])] = decode(match[2]);
		}
		return urlParams;
	};
	
	this.isActiveElement = function(elem) {
		var ae = document.activeElement;
		while (ae) {
			if (ae == elem) return true;
			ae = ae.parentNode;
		}
		return false;
	};
	
	this.getBrowserInfo = function() {
		var ua = navigator.userAgent, tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
			return "IE " + (tem[1] || "");
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
		return M.join(' ');
	};

	this.isIE = function() { 
		var ie = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
		return ie; 
	};
	
	this.mergeProperties = function(pa, pb) {
		var props = {};
		Object.keys(pa).forEach(function (key) { 
			props[key] = pb[key] != null ? pb[key] : pa[key];
		});
		Object.keys(pb).forEach(function (key) { 
			if (pa[key] == null) props[key] = pb[key];
		});
		return props;
	};

	this.createRandumColor = function() {
		return "#" + Math.floor(Math.random()*16777215).toString(16);
	};
	
	this.log = function(msg) {
		if (window.console) console.log(msg);
	};
	
	this.loadScript = function(url, callback, args) {

		var script = document.createElement("script");
		script.type = "text/javascript";

		if (callback) script.onload = function() { callback(args); };

		script.src = url;
		document.head.appendChild(script);
	};
		
	this.loadModule = function(comp, name, methode, url, callback) {	
		this.loadScript(url, function() {
			eval(comp + "." + name + "=" + methode + ";");
			if (callback) callback();
		});
	};
}

//=== All things before body loaded goes here
nmdr.core.utils.initPrototypes();

//=== All things after body loaded goes here
window.onload = function () {}

/*
#####################################################################
#
#  nmdrXML
#
#  Version: 1.00.00#  Date: November 2. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrXML() {
	
	this.read = function(xml, rootName) {
		var xmlDoc;

		if (window.DOMParser) {
			try {
				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(xml, "text/xml");
			} catch (e) {
				alert(e);
			}
		}
		else { // Internet Explorer
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(xml);
		}

		return this.parseNode(xmlDoc.getElementsByTagName(rootName)[0]);
	};

	this.parseNode = function(node) {

		var docs = {
			name: node.nodeName,
			value: node.nodeValue ? node.nodeValue : node.firstChild ? node.firstChild.nodeValue : null,
			attributes: {},
			childNodes: []
		};

		for (var p in node.attributes) {
			if (node.attributes.hasOwnProperty(p)) {
				docs.attributes[node.attributes[p].nodeName] = node.attributes[p].value;
			}
		}
		for (var p in node.childNodes) {
			if (node.childNodes.hasOwnProperty(p)) {
				docs.childNodes.push(this.parseNode(node.childNodes[p]));
			}
		}
		return docs;
	};
};

/*
#####################################################################
#
#  nmdrAjax Cross-Origin Resource Sharing (CORS)
#
#  Version: 1.00.00#  Date: August 20. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrAjax() {
	
	this.get = function(url, args, success, error) { 
		this.doAjax("GET", url, args, success, error); 
	};
	
	this.post = function(url, args, success, error) { 
		this.doAjax("POST", url, args, success, error); 
	};

	this.doAjax = function(gp, url, args, success, error) {

		var self = this, req = this.createRequest();

		if (req == null) {
			alert("CORS is not supported by the browser.");
			return;
		}
		
		req.onreadystatechange = function() { 
			self.handleResponse(req, success, error); 
		};

		args["noCache"] = this.timestamp();  // avoid using of cache (ie)

		var aa =  url + "?x=" + JSON.stringify(args);
		
		req.open(gp, url + "?x=" + JSON.stringify(args), true);
		req.setRequestHeader("Requested-With", "XMLHttpRequest");
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.setRequestHeader("Cache-Control", "no-cache");
		
		req.send();
	};

	this.createRequest = function() {
	
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		
		if ("withCredentials" in xhr) {
		
			// Check if the XMLHttpRequest object has a "withCredentials" property.
			// "withCredentials" only exists on XMLHTTPRequest2 objects.
			xhr.withCredentials = true;

		} else if (typeof XDomainRequest != "undefined") {

			// Otherwise, check if XDomainRequest.
			// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			xhr = new XDomainRequest();

		} else {

			// Otherwise, CORS is not supported by the browser.
			xhr = null;
		}
		return xhr;
	};

	this.handleResponse = function(req, success, error) {
		if (req.readyState == 0) {
			//out("UNITIALIZED");
		}
		else if (req.readyState == 1) {
			//out("LOADING");
		}
		else if (req.readyState == 2) {
			//out("LOADED");
		}
		else if (req.readyState == 3) {
			//out("INTERACTIVE"); 
		}
		else if (req.readyState == 4) {

			//out("COMPLETE);
			
			var response = {}, ok = true;
			
			if (req.status == 200 ) {
				try {
					response = JSON.parse(req.response);
					//response.responseText = req.responseText; // That is already set in php
					response.readyState = req.readyState;
					response.status = req.status;
				} 
				catch(err) { 
					response.data = [];
					response.responseText = err.message; 
					response.readyState = req.readyState;
					response.status = req.status;
					ok = false;
				}
			}
			
			if (ok) success(response); else error(response);		
		}
	};

	this.timestamp = function() {
		return Math.floor((new Date).getTime()/1000);
	};

	this.createUUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (match) {
				/*
				* Create a random nibble. The two clever bits of this code:
				*
				* - Bitwise operations will truncate floating point numbers
				* - For a bitwise OR of any x, x | 0 = x
				*
				* So:
				*
				* Math.random * 16
				*
				* creates a random floating point number
				* between 0 (inclusive) and 16 (exclusive) and
				*
				* | 0
				*
				* truncates the floating point number into an integer.
				*/
				var randomNibble = Math.random() * 16 | 0;

				/*
				* Resolves the variant field. If the variant field (delineated
				* as y in the initial string) is matched, the nibble must
				* match the mask (where x is a do-not-care bit):
				*
				* 10xx
				*
				* This is achieved by performing the following operations in
				* sequence (where x is an intermediate result):
				*
				* - x & 0x3, which is equivalent to x % 3
				* - x | 0x8, which is equivalent to x + 8
				*
				* This results in a nibble between 8 inclusive and 11 exclusive,
				* (or 1000 and 1011 in binary), all of which satisfy the variant
				* field mask above.
				*/
				var nibble = (match == 'y') ?
					(randomNibble & 0x3 | 0x8) :
					randomNibble;

				/*
				* Ensure the nibble integer is encoded as base 16 (hexadecimal).
				*/
				return nibble.toString(16);
			}
		);
	};
	
	//=== not needed
	
	this.jsonToURLencodedString = function(object) {
		var es = "", si="spaceIsNull", sin = object.hasOwnProperty(si) && object[si];
		for (var prop in object) {
			if (object.hasOwnProperty(prop)) {
				if (prop == si || (sin && object[prop] == "")) continue;
				if (es.length > 0) es += "&";
				es += encodeURI(prop + "=" + object[prop]);
			}
		}
		return (es == "" ? "noCache=" : es + "&noChace=") + Math.random();
	};

	this.urlEncodedStringToJson = function(object) {
		var data = {}, props = object.split("&");
		if (props.lenght > 0) {
			for (var prop in props) {
				var arg = prop.split("=");
				if (arg.lenght == 2) {
					data[arg[0]] = arg[1];
				}
			}
		}
		return data;
	};
}

/*
#####################################################################
#
#  nmdrAnimate
#
#  Version: 1.00.00#  Date: October 28. 2017
#  Status: Release
#
#####################################################################
*/

(function() {
	var lastTime = 0;
	var vendors = ["ms", "moz", "webkit", "o"];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());


function nmdrAnimate() {

	this.useCssAnim = true;
	this.useTimer = false;

	//=== Wrappers

	this.move = function(id, el, left, top, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (this.useCssAnim) this.moveCSS(elem, left, top, callback, args);
			else if (this.useTimer) this.moveTimer(elem, left, top, callback, args);
			else this.moveAnim(elem, left, top, callback, args);
		}
	};

	this.resize = function(id, el, width, height, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (this.useCssAnim) this.resizeCSS(elem, width, height, callback, args);
			else if (this.useTimer) this.resizeTimer(elem, width, height, callback, args);
			else this.resizeAnim(elem, width, height, callback, args);
		}
	};

	this.moveAndResize = function(id, el, left, top, width, height, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (this.useCssAnim) this.moveAndResizeCSS(elem, width, height, callback, args);
			else if (this.useTimer) this.moveAndResizeTimer(elem, width, height, callback, args);
			else this.moveAndResizeAnim(elem, width, height, callback, args);
		}
	};
	
	this.fadeOut = function(id, el, st, fast, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (this.useCssAnim) this.fadeOutCSS(elem, callback, args);
			else if (this.useTimer) this.fadeTimer(elem, 1.0, 0.0, (st ? st : fast ? 0.05 : 0.01), callback, args);
			else this.fadeAnim(elem, 1.0, 0.0, (st ? st : fast ? 0.05 : 0.01), callback, args);
		}
	};

	this.fadeIn = function(id, el, st, fast, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (this.useCssAnim) this.fadeInCSS(elem, callback, args);
			else if (this.useTimer) this.fadeTimer(elem, 0.0, 1.0, (st ? st : fast ? 0.05 : 0.01), callback, args);
			else this.fadeAnim(elem, 0.0, 1.0, (st ? st : fast ? 0.05 : 0.01), callback, args);
		}
	};

	this.scroll = function(id, el, dx, dy, callback, args) {
		var elem = id ? document.getElementById(id) : el;
		if (elem != null) {
			if (dx != null) dx += elem.offsetLeft;
			if (dy != null) dy += elem.offsetTop;
			this.move(null, elem, dx, dy, callback, args);
		}
	};

	//=== CSS Animation

	this.cssAnimateSpeed = "500ms";
	this.transitionCounter = 0;
	this.numTransitionProps = 0;
	
	this.afterTransition = function(elem, callback) {
		var names = {
			"transition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd",
			//"MozTransition": "mozTransitionend",
			"OTransition": "oTransitionEnd"
		}, tname = "";

		for (var name in names) {
			if (elem.style[name] !== undefined) {
				tname = names[name];
				break;
			}
		}
		
		var self = this, transitionProp = window.getComputedStyle(elem , null)["transition-property"] || "";
		this.numTransitionProps = transitionProp.split(",").length;
		
		var tc = function(event) { 
			//alert(self.numTransitionProps);

			if (this.transitionCounter < this.numTransitionProps - 1) {
				this.transitionCounter++;
			} else {
				self.transitionCounter = 0;
				self.numTransitionProps = 0;
				elem.removeEventListener(tname, tc);
				callback(); 
			}
		};
		
		elem.addEventListener(tname, tc, false);	
	};

	this.startTransition = function(elem, callback, args) {

		elem.style.setProperty("transition", "all " + this.cssAnimateSpeed + " ease-in-out");
		elem.style.setProperty("-webkit-transition", "all " + this.cssAnimateSpeed + " ease-in-out");
		elem.style.setProperty("-moz-transition", "all " + this.cssAnimateSpeed + " ease-in-out");
		elem.style.setProperty("-o-transition", "all " + this.cssAnimateSpeed + " ease-in-out");
			
		this.afterTransition(elem, function() { 
			elem.style.removeProperty("transition");
			elem.style.removeProperty("-webkit-transition");
			elem.style.removeProperty("-moz-transition");
			elem.style.removeProperty("-o-transition");

			if (callback) callback(args);
		});
	};

	this.moveCSS = function(elem, left, top, callback, args) {
		this.startTransition(elem, callback, args);
		setTimeout(function() {
			elem.style.left = left + "px";
			elem.style.top = top + "px";
		}, 5);
	};

	this.resizeCSS = function(elem, width, height, callback, args) {
		this.startTransition(elem, callback, args);
		setTimeout(function() {
			elem.style.width = width + "px";
			elem.style.height = height + "px";
		}, 5);
	};

	this.moveAndResizeCSS = function(elem, left, top, width, height, callback, args) {
		this.startTransition(elem, callback, args);
		setTimeout(function() {
			elem.style.left = left + "px";
			elem.style.top = top + "px";
			elem.style.width = width + "px";
			elem.style.height = height + "px";
		}, 5);
	};
	
	this.fadeOutCSS = function(elem, callback, args) {
		elem.style.opacity = 1;
		this.startTransition(elem, callback, args);
		setTimeout(function() { elem.style.opacity = 0; }, 50);
	};

	this.fadeInCSS = function(elem, callback, args) {
		elem.style.opacity = 0;
		this.startTransition(elem, callback, args);
		setTimeout(function() { elem.style.opacity = 1; }, 50);
	};

	//=== JS Animation

	this.stepH = 4;
	this.stepV = 3;
	this.delay = 2;
	this.animating = false;
	
	this.setData = function(sh, sv, dl, ut) {
		this.stepH = sh;
		this.stepV = sv;
		if (dl) this.delay = dl;
		if (ut) this.useTimer = ut;
	};
	
	// Animating with request

	this.moveAnim = function(elem, left, top, callback, args) {
		var self = this, 
		doMove = function() {
		
			var l = elem.offsetLeft, t = elem.offsetTop;

			if (left != null) { if (l < left) { l += self.stepH; if (l > left) l = left; } else 
			if (l > left) { l -= self.stepH; if (l < left) l = left; } }
			if (top != null) { if (t < top) { t += self.stepV; if (t > top) t = top; } else 
			if (t > top) { t -= self.stepV; if (t < top) t = top; } }

			elem.style.left = l + "px";
			elem.style.top = t + "px";

			if ((left == null || l == left) && (top == null || t == top)) {
				cancelAnimationFrame(elem.moveTM);
				if (callback) callback(args);
			}
			else elem.moveTM = requestAnimationFrame(doMove);
		};
		doMove();
	};

	this.resizeAnim = function(elem, width, height, callback, args) {
		var self = this, 
		doResize = function () {

			var w = elem.offsetWidth, h = elem.offsetHeight;

			if (w < width) { w = w + self.stepH; if (w > width) w = width; } else 
			if (w > width) { w = w - self.stepH; if (w < width) w = width; }
			if (h < height) { h = h + self.stepV; if (h > height) h = height; } else 
			if (h > height) { h = h - self.stepV; if (h < height) h = height; }

			elem.style.width = w + "px";
			elem.style.height = h + "px";

			if (w == width && h == height) {
				cancelAnimationFrame(elem.resizeTM);
				if (callback) callback(args);
			}
			else elem.resizeTM = requestAnimationFrame(doResize);
		};
		doResize();
	};

	this.moveAndResizeAnim = function(elem, left, top, width, height, callback, args) {
		// todo
	};
	
	this.fadeAnim = function(elem, startopa, endopa, step, callback, args) {
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
		}
		else {
			var self = this;
			elem.fadeTM = requestAnimationFrame(function() { 
				self.fadeAnim(elem, startopa, endopa, step, callback, args); 
			});
		}
	};

	// Animating with timer

	this.resizeTimer = function(elem, width, height, callback, args) {
		var self = this, 
		doResize = function () {

			var w = elem.offsetWidth, h = elem.offsetHeight;

			if (w < width) { w = w + self.stepH; if (w > width) w = width; } else 
			if (w > width) { w = w - self.stepH; if (w < width) w = width; }
			if (h < height) { h = h + self.stepV; if (h > height) h = height; } else 
			if (h > height) { h = h - self.stepV; if (h < height) h = height; }

			elem.style.width = w + "px";
			elem.style.height = h + "px";

			if (w == width && h == height) {
				clearInterval(elem.resizeTM);
				if (callback) callback(args);
			}
		};
		elem.resizeTM = setInterval(doResize, this.delay);
	};

	this.moveTimer = function(elem, left, top, callback, args) {
		var self = this, 
		doMove = function() {
		
			var l = elem.offsetLeft, t = elem.offsetTop;

			if (left != null) { if (l < left) { l += self.stepH; if (l > left) l = left; } else 
			if (l > left) { l -= self.stepH; if (l < left) l = left; } }
			if (top != null) { if (t < top) { t += self.stepV; if (t > top) t = top; } else 
			if (t > top) { t -= self.stepV; if (t < top) t = top; } }

			elem.style.left = l + "px";
			elem.style.top = t + "px";

			if ((left == null || l == left) && (top == null || t == top)) {
				clearInterval(elem.moveTM);
				if (callback) callback(args);
			}
		};
		elem.moveTM = setInterval(doMove, this.delay);
	};

	this.fadeTimer = function(elem, startopa, endopa, step, callback, args) {
		var self = this, st = startopa,  
		doFade = function() {
			if (st < endopa) {
				st += step;
				if (st > endopa) st = endopa;
			}
			else if (st > endopa) {
				st -= step;
				if (st < endopa) st = endopa;
			}
			
			elem.style.opacity = st;
			elem.style.filter = "alpha(opacity=" + st * 100 + ")";

			if (st == endopa) {
				clearInterval(elem.fadeTM);
				if (callback) callback(args);
			}
		};		
		elem.fadeTM = setInterval(doFade, this.delay);
	};
	
	this.moveAndResizeTimer = function(elem, left, top, width, height, callback, args) {
		// todo
	};
	
	//=====

	this.scrollX = function(elem, dx, dy, fio, callback, args) {

		if (this.animating) return;

		this.animating = true;

		var left = dx != null ? dx + elem.offsetLeft : null;
		var top = dy != null ? dy + elem.offsetTop : null;

		var startopa = fio == 1 ? 0.0 : fio == -1 ? 1.0 : -1;
		var endopa = fio == 1 ? 1.0 : fio == -1 ? 0.0 : -1;
		var step = Math.abs(1.0 / dy);
		var self = this;

		elem.moveTM = setInterval(function () {
			var l = elem.offsetLeft;
			var t = elem.offsetTop;

			if (left != null) { if (l < left) { l += self.stepH; if (l > left) l = left; } else 
			if (l > left) { l -= self.stepH; if (l < left) l = left; } }
			if (top != null) { if (t < top) { t += self.stepV; if (t > top) t = top; } else 
			if (t > top) { t -= self.stepV; if (t < top) t = top; } }

			elem.style.left = l + "px";
			elem.style.top = t + "px";

			if (startopa != endopa) {

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
			}

			if ((left == null || l == left) && (top == null || t == top)) {
				if (fio != 0) {
					startopa = fio == 1 ? 1.0 : 0.0;
					elem.style.opacity = startopa;
					elem.style.filter = "alpha(opacity=" + startopa * 100 + ")";
				}
				clearInterval(elem.moveTM);
				self.animating = false;
				if (callback) callback(args);
			}
		}, 50);
	};
}

/*
#####################################################################
#
#  nmdrTooltips
#
#  Version = 1.00.00
#  Date = Januar 17. 2015
#  Status = Release
#
#####################################################################
*/

function nmdrTooltips() {

	var id = "nmdrTooltips",
		background = "#FFFFAA",
		bordercolor = "#FFAD33",
		font = "11px/1.5 Verdana, Arial, Helvetica, sans-serif",
		bubble_top = false,
		showing = false,
		useCSS = true,
		tt, a, c;

    this.start = function(hi, bg, bc) {

        if (hi == null) hi = "hotspot";
        if (bg == null) bg = background;
        if (bc == null) bc = bordercolor;

        var css = "." + hi + " {color:#900; padding-bottom:1px; border-bottom:1px dotted #900; cursor:pointer}",
			head = document.head || document.getElementsByTagName("head")[0],
			style = document.createElement("style");

        style.type = "text/css";
        if (style.styleSheet) { style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); }
        head.appendChild(style);

        var self = this, hotpots = document.getElementsByClassName(hi);
        for (var i = 0; i < hotpots.length; i++) {
            hotpots.item(i).onmouseover = function (e) {                    
                var txt = e.target ? e.target.getAttribute("tooltip") : e.srcElement.getAttribute("tooltip");
                self.show(e, hi, txt, bg, bc, self);                    
            };
            hotpots.item(i).onmouseout = function () { self.hide(); };
            hotpots.item(i).onmousedown = function () { self.hide(); };
        }
    };

    this.show = function(ev, hi, innerHTML, background, bordercolor, self) {

		var doShow = function () {

            tt = document.getElementById(id + "_" + hi);

            if (tt == null) {

                var css =
                "display:block; position:absolute; padding:8px; opacity:0; filter:alpha(opacity=0); " +
                "background:" + background + "; font:" + font + "; border: 1px solid " + bordercolor + "; " +
                "box-shadow: 5px 5px 5px rgba(0,0,0,0.1); -webkit-box-shadow: 5px 5px rgba(0,0,0,0.1); -moz-box-shadow: 5px 5px rgba(0,0,0,0.1); " +
                "border-radius: 5px 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; z-index:1001 !important; " +
				"transition:all 250ms ease-in-out; -webkit-transition:all 250ms ease-in-out; -moz-transition:all 250ms ease-in-out; -o-transition:all 250ms ease-in-out;";
				
                tt = document.createElement("div");
                tt.setAttribute("id", id + "_" + hi);
                tt.style.cssText = css;

                c = document.createElement("div");
                c.setAttribute("id", id + "cont");

                a = document.createElement("div");
                a.setAttribute("class", bubble_top ? "arrow " + hi + "_top" : "arrow " + hi + "_bottom");

                if (bubble_top) {
                    a.style.cssText = "position: absolute;" +
                    "border-style: solid; border-color: transparent transparent " + bordercolor + " transparent;" +
                    "border-width: 0px 10px 10px 10px;top: -10px;";

                    self.addCSSRule(document.styleSheets[0],
                        "." + hi + "_top:after",
                        "position: absolute;left: -9px;" +
                        "border-color: transparent transparent " + background + " transparent;" +
                        "border-style:solid; border-width: 0px 9px 9px 9px; top:1px;" +
                        "content: '';", 0);
                }
                else {
                    a.style.cssText = "position: absolute;" +
                    "border-style: solid; border-color: " + bordercolor + " transparent transparent transparent;" +
                    "border-width: 10px 10px 0px 10px;bottom: -10px;";

                    self.addCSSRule(document.styleSheets[0],
                        "." + hi + "_bottom:after",
                        "position: absolute;left: -9px;" +
                        "border-color:" + background + " transparent transparent transparent;" +
                        "border-style:solid; border-width: 9px 9px 0px 9px; bottom:1px;" +
                        "content: '';", 0);
                }

                a.appendChild(c);
                tt.appendChild(a);

                document.body.appendChild(tt);
                document.onmousemove = self.pos;

                tt.appendChild(c);

				tt.style.display = "block";
				tt.style.width = "auto";
				tt.style.zIndex = 1001;
				tt.style.background = background;
				c.innerHTML = innerHTML;
				
				self.pos(ev);
				
				showing = true;
				
				if (useCSS) tt.style.opacity = 1; else self.fade(1);
			}
        };
		
		if (showing) this.hide(doShow); else doShow();
    };
	
    this.hide = function(callback) {
		if (showing) {
		
			var doHide = function() {
				if (tt != null) document.body.removeChild(tt);
				tt = null;
				showing = false;
				if (callback) callback();
			};
			
			if (useCSS) {
				this.afterTransition(tt, doHide);
				tt.style.opacity = 0;
			}
			else {
				this.fade(-1, doHide);
			}
		}
    };

    this.pos = function(e) {
		if (tt != null) {
			var u = e.pageY;
			var l = e.pageX;
			tt.style.top = (u - tt.offsetHeight - 6) + "px";
			tt.style.left = (l + 3) + "px";
		}
    };

    this.addCSSRule = function(sheet, selector, rules, index) {
		try {
			if ("insertRule" in sheet) sheet.insertRule(selector + "{" + rules + "}", index);
			else if ("addRule" in sheet) sheet.addRule(selector, rules, index);
		} catch(err) {
			try { if ("addRule" in sheet) sheet.addRule(selector, rules, index); } catch(err) {}
		}
    };

	this.afterTransition = function(elem, callback) {
		var names = {
		  "transition": "transitionend",
		  "WebkitTransition": "webkitTransitionEnd",
		  //"MozTransition": "mozTransitionend",
		  "OTransition": "oTransitionEnd"
		}, tname = "";

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
	
    this.fade = function (d, callback) {
		var timer = 20, speed = 10, alpha = 0, endalpha = 96;

 		function doFade() {
			var a = alpha;
			if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
				var i = speed;
				if (endalpha - a < speed && d == 1) {
					i = endalpha - a;
				} else if (alpha < speed && d == -1) {
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = "alpha(opacity=" + alpha + ")";
			} 
			else {
				clearInterval(tt.timer);
				if (callback) callback();
			}
		};
		
		clearInterval(tt.timer);
		tt.timer = setInterval(function() { doFade(d, callback); }, timer);
    };
}

/*
#####################################################################
#
#  nmdrPopup
#
#  Version: 1.00.00
#  Date: November 6. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrPopup() {

	this.currPopup = null;
	this.currInvokers = [];
	this.currOpenCallback = null;
	this.currCloseCallback = null;
	this.currCanCloseCallback = null;
	
	this.open = function(popup, invoker, openCallback, closeCallback, canCloseCallback) {

		var self = this;
		
		var doOpen = function() {
		
			document.addEventListener("keydown", function(e) { 
				// escape key
				if (e.which == 27 && self.currPopup != null) {
					self.close(null, true);
					nmdr.core.utils.stopPropagation(e);
				}
			});

			// click everywhere else except popup invoker closes the box
			document.addEventListener("click", function(event) { 
				if (self.currPopup != null) {
					var target = event.target || event.srcElement;
					for (var i in self.currInvokers) {
						if (target == self.currInvokers[i]) return;
					}
					var cc = true;
					if (self.currCanCloseCallback) {
						for (var i in self.currInvokers) {
							if (!self.currCanCloseCallback(self.currInvokers[i], target)) { 
								cc = false; 
								break; 
							}
						}
					}
					if (cc) self.close(null, true);
				}
			});
			
			// click on a box does nothing
			popup.onclick = function (event) {
				nmdr.core.utils.stopPropagation(event);
			};

			self.currPopup = popup;
			self.currInvokers.push(invoker);
			self.currOpenCallback = openCallback;
			self.currCloseCallback = closeCallback;
			self.currCanCloseCallback = canCloseCallback;

			if (openCallback) openCallback();
		};
		
		if (self.currPopup && self.currPopup != popup) {
			self.close(doOpen, true);
			return;
		}
		
		doOpen();	
	};

	this.close = function(callback, cur) {
		
		var self = this;
		
		var doClose = function() {
			self.currPopup = null;
			self.currOpenCallback = null;
			self.currCloseCallback = null;
			self.currCanCloseCallback = null;
			while (self.currInvokers.length) self.currInvokers.pop();
			if (callback) callback(); 
		};
		
		if (cur && this.currPopup) this.currCloseCallback(doClose); else doClose();
	};
	
	this.addInvoker = function(invoker) {
		this.currInvokers.push(invoker);
	};
	
	//=== PopupX

	this.openX = function(popup, invoker, left, top, openCallback, closeCallback) {

		var self = this;
		
		if (this.currPopup == popup) {
			for (var i in this.currInvokers) {
				if (this.currInvokers[i] == invoker) {
					this.closeX();
					return;
				}
			}
		}

		document.body.onkeydown = function (e) {
			// escape key
			if (self.currPopup != null && e.which == 27) {
				self.closeX();
				nmdr.core.utils.stopPropagation(e);
			}
		};

		// click on a box does nothing
		popup.onclick = function (e) {
			nmdr.core.utils.stopPropagation(e);
		};

		// click everywhere else except popup invoker closes the box
		document.onclick = function (e) {
			if (self.currPopup != null) {
				var target = e.target || e.srcElement;
				for (var i in self.currInvokers) {
					if (target == self.currInvokers[i]) return;
				}
				self.closeX();
			}
		}

		if (this.currPopup != null && this.currPopup != popup)
			this.closeX();

		var t = top - 20;

		popup.style.display = "inline-block";
		popup.style.top = t + "px";
		popup.style.left = left + "px";
		popup.style.opacity = 0.0;

		this.currPopup = popup;
		this.currOpenCallback = openCallback;
		this.currCloseCallback = closeCallback;
		this.currInvokers.push(invoker);

		nmdr.core.animate.scrollX(popup, 0, 20, 1, openCallback);
	};

	this.closeX = function() {
		if (this.currPopup != null) {
			var self = this;
			nmdr.core.animate.scrollX(this.currPopup, 0, -20, -1, function () {
				self.currPopup.style.display = 'none';
				//self.currPopup.style.top = '0px';
				//self.currPopup.style.left = '0px';
				if (self.currCloseCallback) self.currCloseCallback();
				self.currPopup = null;
				self.currInvokers = [];
				self.currOpenCallback = null;
				self.currCloseCallback = null;
			});
		}
	};
}

/*
#####################################################################
#
#  nmdrDialog
#
#  Version: 1.00.00
#  Date: January 24. 2015
#  Status: Release
#
#####################################################################
*/

function nmdrModalDialog(props) {
	
	props = props || {};

    this.imagePath = props.hasOwnProperty("imagePath") ? props.imagePath + "/" : "img/";
    this.fontFamily = props.hasOwnProperty("fontFamily") ? props.fontFamily : "Helvetica,Verdana,Arial,sans-serif";
    this.fontWidth = props.hasOwnProperty("fontWidth") ? props.fontWidth : "normal";
    this.fontSize = props.hasOwnProperty("fontSize") ? props.fontSize : 14;
    this.titleBackground = props.hasOwnProperty("titleBackground") ? props.titleBackground : "#21374C";
    this.backgroundImage = props.hasOwnProperty("backgroundImage") ? props.backgroundImage : null;//"dlgbg.png";
    this.backgroundColor = props.hasOwnProperty("backgroundColor") ? props.backgroundColor : "#fff";
    this.buttonWidth = props.hasOwnProperty("buttonWidth") ? props.buttonWidth : 90;
    this.buttonHeight = props.hasOwnProperty("buttonHeight") ? props.buttonHeight : 30;
    this.roundCorners = props.hasOwnProperty("roundCorners") ? props.roundCorners : true;

    this.resizeable = false;
    this.hasBorder = false;
    this.overlayOpacity = 0.5;
    this.shadow = "0 4px 8px 0 rgba(0,0,0,0.22),0 6px 20px 0 rgba(0,0,0,0.19);";
	this.transition = "all 0.3s ease-in-out";

    var conf, 
		dragging = false, 
		draggingElem = null, 
		dragTop = 0, 
		dragLeft = 0, 
		maximize = false,
		bg = this.backgroundImage ? "background-image:url(" + this.imagePath + this.backgroundImage + ");background-repeat:no-repeat" : "",
		buf= [];
		
	buf.push(
		"<style type=\"text/css\">" +
		"#nmdrDg_divFrame, #nmdrDg_spanMessage {" +
		"font-family: " + this.fontFamily + ";" +
		"font-weight: " + this.fontWidth + ";" +
		"font-size: " + this.fontSize + "px;" +
		"}" +
		".nmdrDg_btn:hover { background:#eee !important;}" +
		".nmdrDg_spanClose:hover { color:#fff !important; transform: scale(1.2); }" +
		"#nmdrDg_divCorner:hover { cursor: se-resize; }" +
		"</style>");

    buf.push(
		"<div id='nmdrDg_divOverlay' style='position:absolute;z-index:998; background-color:#333; opacity:" + this.overlayOpacity + ";' " +
		"onmousemove=\"nmdrDialog.doDragging(event,this)\" " +
		"onmouseup=\"nmdrDialog.stopDragging(event,this)\"></div>" +

		"<div id='nmdrDg_divFrame' style='position:absolute;padding:0;margin:0;z-index:999;display:none;background-color:" + this.backgroundColor + ";" + bg +
		(this.hasBorder ? "border:1px solid;border-color:gray; " : "") +
        "-moz-box-shadow: " + this.shadow + ";-webkit-box-shadow: " + this.shadow + ";box-shadow: " + this.shadow + "; " +
		(this.roundCorners ? "border-radius:4px; -moz-border-radius:4px; -webkit-border-radius:4px; -khtml-border-radius:4px;" : "") +
		"-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;transition:" + this.transition + "'>" +

		"<div id='nmdrDg_divTitle' style='width:100%;height:32px;text-align:left;padding:0;" +
		(this.roundCorners ? "border-radius: 4px 4px 0 0; -moz-border-radius: 4px 4px 0 0; -webkit-border-radius: 4px 4px 0 0; -khtml-border-radius: 4px 4px 0 0;'" : "'") +
		"onmouseover=\"nmdrDialog.hintDragging(event,this)\" " +
		"onmouseout=\"nmdrDialog.rehintDragging(event,this)\" " +
		"onmousedown=\"nmdrDialog.startDragging(event,this)\" " +
		"onmousemove=\"nmdrDialog.doDragging(event,this)\" " +
		"onmouseup=\"nmdrDialog.stopDragging(event,this)\">" +
		"<span id='nmdrDg_spanTitle' style='color:#ccc;font-size:14px;line-height:32px;padding-left:15px;'></span>" +
		"<span class='nmdrDg_spanClose' style='color:#bbb;font-size:16px;float:right;line-height:32px;padding-right:15px;cursor:pointer;' " +
		"onclick=\"nmdrDialog.closeDialog();\">x</span>" +
		"</div>" +
		
		"<div id='nmdrDg_divContent' style='width:100%;padding:0;margin:0;overflow:hidden;'>" +
		"<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr>" +
		"<td id='nmdrDg_tdContent' style='text-align:center;vertical-align:middle;'>" +
		"<span id='nmdrDg_spanLoading' style='display:none;'><img src=\"" + this.imagePath + "loading.gif\" alt='Loading...'/></span>" +
		"<span id='nmdrDg_spanMessage' style='display:none;'></span>" +
		"<input id='nmdrDg_prompt' type='text' name='nmdrDg_prompt' style='display:none;'>" +
		"<div id='nmdrDg_customDiv' style='display:none;'></div>" +
		"<iframe id='nmdrDg_iframe' name='nmdrDg_iframe' src='' frameborder='0'></iframe>" +
		"</td></tr></table></div>" +
		
		"<div id='nmdrDg_divButtons' style='width:100%;height:60px;" +
		(this.roundCorners ? "border-radius: 0 0 4px 4px; -moz-border-radius: 0 0 4px 4px; -webkit-border-radius: 0 0 4px 4px; -khtml-border-radius: 0 0 4px 4px;'>" : "") +
		"<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'>" +
		"<tr><td id='nmdrDg_buttonsRow' style='vertical-align:middle;text-align:right;padding-right:20px;'></td></tr></table></div>" +
		"<img id='nmdrDg_divCorner' src='" + this.imagePath + "corner.png' style='position:absolute;bottom:4px;right:4px;display:none;'/>" +
		"</div>");

 	var dd = document.createElement("div");
		dd.innerHTML = buf.join("");
		document.body.appendChild(dd);

    this.init = function (conf) {

        this.conf = conf;
        this.conf.maximize = false;

        if (conf.message == null) this.conf.message = "";
        if (conf.width == null) this.conf.width = 400;
        if (conf.height == null) this.conf.height = 200;
        if (conf.draggable == null) this.conf.draggable = true;
        if (conf.isAlert == null) this.conf.isAlert = false;
        if (conf.isMessage == null) this.conf.isMessage = false;
        if (conf.isConfirm == null) this.conf.isConfirm = false;
        if (conf.isPrompt == null) this.conf.isPrompt = false;
        if (conf.promptValue == null) this.conf.promptValue = "";
        if (conf.buttons == null) this.conf.buttons = [];

        var divOverlay = document.getElementById("nmdrDg_divOverlay"),
			divFrame = document.getElementById("nmdrDg_divFrame"),
			divTitle = document.getElementById("nmdrDg_divTitle"),
			spanTitle = document.getElementById("nmdrDg_spanTitle"),
			divContent = document.getElementById("nmdrDg_divContent"),
			tdContent = document.getElementById("nmdrDg_tdContent"),
			spanMsg = document.getElementById("nmdrDg_spanMessage"),
			divPrompt = document.getElementById("nmdrDg_prompt"),
			divCustom = document.getElementById("nmdrDg_customDiv"),
			divButons = document.getElementById("nmdrDg_divButtons"),
			divCorner = document.getElementById("nmdrDg_divCorner"),
			iframe = document.getElementById("nmdrDg_iframe"),
			loading = document.getElementById("nmdrDg_spanLoading"),
		
			left = (window.innerWidth - this.conf.width) / 2,
			top = (window.innerHeight - this.conf.height) / 2,
			d = nmdr.core.utils.calculateWindowSize(),
			xy = nmdr.core.utils.calculateScroll();

			left += xy.left;
			top += xy.top;

        divOverlay.style.top = "0px";
        divOverlay.style.left = "0px";
        divOverlay.style.width = d.width + xy.left - 18 + "px";
        divOverlay.style.height = d.height + xy.top + "px";
        divOverlay.style.display = "";

        divFrame.style.display = "";
        divFrame.style.top = top + "px";
        divFrame.style.left = left + "px";
        divFrame.style.height = this.conf.height + "px";
        divFrame.style.width = this.conf.width + "px";

        divTitle.style.background = this.conf.title != null ? this.titleBackground : "";
        spanTitle.innerHTML = this.conf.title != null ? this.conf.title : "";

        divContent.style.height = this.conf.height - (this.conf.url ? 32 : 92) + "px";
		if (this.roundCorners) {
			if (this.conf.url) {
				divContent.style.setProperty("border-radius", "0 0 4px 4px");
				divContent.style.setProperty("-moz-border-radius", "0 0 4px 4px");
				divContent.style.setProperty("-webkit-border-radius", "0 0 s4px 4px");
				divContent.style.setProperty("-khtml-border-radius", "0 0 4px 4px");
			}
			else {
				divContent.style.removeProperty("border-radius");
				divContent.style.removeProperty("-moz-border-radius");
				divContent.style.removeProperty("-webkit-border-radius");
				divContent.style.removeProperty("-khtml-border-radius");
			}
		}

        divButons.style.display = "";
		
        iframe.style.display = "none";
        iframe.style.height = "0px";
        iframe.style.width = "0px";
		
		divCorner.style.display = conf.resizeable ? "" : "none";

        if (this.conf.render != null) {
            tdContent.style.textAlign = "left";
            spanMsg.style.display = "none";
            divPrompt.style.display = "none";
            loading.style.display = "none";
			divCustom.style.display = "";
			divCustom.innerHTML = this.conf.render(this.conf.renderData);
			if (this.conf.renderAfter) this.conf.renderAfter(this.conf.renderData);
		}
        else if (this.conf.url != null) {
            spanMsg.style.display = "none";
            divPrompt.style.display = "none";
			divCustom.style.display = "none";
			divButons.style.display = "none";
            loading.style.display = "";
			this.loadUrl(this.conf.url);
        }
        else {
            tdContent.style.cssText = this.conf.isAlert ? "text-align:center" : "text-align:left;padding:20px;";
			divCustom.style.display = "none";
            spanMsg.style.display = "";
            spanMsg.innerHTML = this.conf.message + "<br>";
            divPrompt.style.display = this.conf.isPrompt ? "" : "none";
            divPrompt.value = this.conf.promptValue;
            divPrompt.style.width = this.conf.width - spanMsg.offsetWidth - 50 + "px";
        }

        //=== make buttons

        var bs = "";
        for (var i = 0; i < this.conf.buttons.length; i++) {
            var bt = this.conf.buttons[i], 
			cn = bt.className ? "class='" + bt.className + " nmdrDg_btn'" : "",
			fb = bt.isDefault ? " id='nmdrDg_defaultButton'" : "",
			sb = bt.isDefault ? " type=submit " :  "type='button' ";
			
            bs += "<input " + cn + fb + sb +
			"onclick=\"nmdrDialog.closeDialog(" + i + ");\" value='" + bt.lable + "' " +
			"style='width:" + this.buttonWidth + "px;height:" + this.buttonHeight + "px;padding:3px;margin-right:5px;background:#fff;cursor:pointer;" +
			"border-radius:3px; -moz-border-radius:3px; -webkit-border-radius:3px; -khtml-border-radius:3px;" +
			"border:1px solid;border-color:#bbb;-moz-box-shadow: 3px 3px 3px #eee;-webkit-box-shadow: 3px 3px 3px #eee;box-shadow: 3px 3px 3px #eee;'/>";
        }
        document.getElementById("nmdrDg_buttonsRow").innerHTML = bs;
		
		var fc;
		if ((fc = document.getElementById("nmdrDg_defaultButton"))) fc.focus();
    };

    this.closeDialog = function (nr) {	
		document.getElementById("nmdrDg_divOverlay").style.display = "none";
        document.getElementById("nmdrDg_divFrame").style.display = "none";

        if (nr != null) {
            var bt = this.conf.buttons[nr];
            if (bt.callback) {
				bt.callback(this.conf.render ? document.getElementById("nmdrDg_customDiv") : null);
			}
        }
    };
	
    this.loadUrl = function (url) {
        var self=this, iframe = document.getElementById("nmdrDg_iframe");
		iframe.onload = function() { self.onUrlLoaded(); };
		setTimeout(function() { iframe.src = url; }, 500);        
    };

    this.onUrlLoaded = function () {
        document.getElementById("nmdrDg_spanLoading").style.display = "none";
		
        var iframe = document.getElementById("nmdrDg_iframe");
        iframe.style.display = "";
        iframe.style.width = this.conf.width + "px";
        iframe.style.height = this.conf.height - 32 + "px";
    };

	// this is called external
    this.relegate = function (index, args) {
        this.closeDialog();
        this.conf.callbacks[index](args);
    };

    //========Dragging Logic======================

    this.hintDragging = function (e, src) {
        if (!this.conf.draggable) return;
        src.style.cursor = "move";
    };

    this.rehintDragging = function (e, src) {
        if (!this.conf.draggable) return;
        src.style.cursor = "default";
    };
	
    this.startDragging = function (e, src) {
        if (!this.conf.draggable) return;
		var xy = nmdr.core.utils.calculateScroll();
        draggingElem = document.getElementById("nmdrDg_divFrame");
		draggingElem.style.transition = "";
        dragLeft = e.pageX + xy.left;
        dragTop = e.pageY + xy.top;
        src.style.cursor = "move";
        dragging = true;
		
		var self = this;
		window.addEventListener("mouseup", function(e) { self.stopDragging(e, src); }, true);
    };

    this.stopDragging = function (e, src) {
        if (!this.conf.draggable) return;
        dragging = false;
        src.style.cursor = "default";
		draggingElem = document.getElementById("nmdrDg_divFrame");
		draggingElem.style.transition = this.transition;
		
		var self = this;
		window.removeEventListener("mouseup", function(e) { self.stopDragging(e, src); }, false);
    };

    this.doDragging = function (e, src) {
        if (!dragging) return;

        var xy = nmdr.core.utils.calculateScroll(),
			pos = draggingElem.absPosition,
			left = pos.left,
			top = pos.top,
			currentX = 0,
			currentY = 0;

        if (e.pageX) {
            currentX = e.pageX;
            currentY = e.pageY;
        }
        else if (e.x) {
            currentX = e.x;
            currentY = e.y;
        }

		currentX += xy.left;
		currentY += xy.top;
		
        if (currentX > dragLeft) left += currentX - dragLeft;
        else left -= dragLeft - currentX;
		
        if (currentY > dragTop) top += currentY - dragTop;
        else top -= dragTop - currentY;
               
        dragLeft = currentX;
        dragTop = currentY;
        
        draggingElem.style.top = top + "px";
        draggingElem.style.left = left + "px";        
    };

    this.maximizeDialog = function () {
        if (!maximize) {
            maximize = true;
            this.resizeDialog(window.screen.availWidth - 50, window.screen.availHeight - 200);
        } else {
            maximize = false;
            this.resizeDialog(orginalWidth, orginalHeight);
        }
    };

    this.resizeDialog = function (width, height) {
        var divFrame = document.getElementById("nmdrDg_divFrame"),
			iframe = document.getElementById("nmdrDg_iframe"),
			left = (window.screen.availWidth - width) / 2,
			top = (window.screen.availHeight - height) / 2,
			xy = nmdr.core.utils.calculateScroll();

        if (maximize) {
            left = xy.left + 10;
            top = xy.top + 10;
        } else {
            left += xy.left;
            top += xy.top;
        }
        divFrame.style.top = top + "px";
        divFrame.style.left = left + "px";
        divFrame.style.height = height + "px";
        divFrame.style.width = width + "px";
        iframe.style.height = divFrame.offsetHeight - 60 + "px";
        iframe.style.width = divFrame.offsetWidth - 2 + "px";
    };

    //==============

    this.dialog = function (args) {
        this.init(args);
    };

    this.alert = function (tit, msg, cb) {
        this.dialog(
		{
		    title: tit,
		    message: msg,
			isAlert: true,
		    buttons: [{ lable: "Ok", className: "okButton", isDefault: true, callback: cb ? function () { cb(true); } : null }]
		});
    };

    this.message = function (tit, msg, w, h, cb) {
        this.dialog(
		{
		    title: tit,
		    message: msg,
			width: w,
			height: h,
			isMessage: true,
		    buttons: [{ lable: "Ok", className: "okButton", isDefault: true, callback: cb ? function () { cb(true); } : null }]
		});
    };

    this.confirm = function (tit, msg, cb) {
        this.dialog(
		{
		    title: tit,
		    message: msg,
			isConform: true,
		    buttons: [
				{ lable: "Cancel", className: "cancelButton", callback: cb ? function () { cb(false); } : null },
				{ lable: "Ok", className: "okButton", isDefault: true, callback: cb ? function () { cb(true); } : null }
		    ]
		});
    };

    this.prompt = function (tit, msg, value, cb) {
        this.dialog(
		{
		    title: tit,
		    message: msg,
		    isPrompt: true,
		    promptValue: value,
		    buttons: [
				{ lable: "Cancel", className: "cancelButton", callback: cb ? function () { cb(false); } : null },
				{ lable: "Ok", className: "okButton", isDefault: true, callback: cb ? function () { cb(true, document.getElementById("nmdrDg_prompt").value); } : null }
		    ]
		});
    };

    this.showUrl = function (tit, ur, w, h) {
        this.dialog({ title: tit, url: ur, width: w, height: h });
    };
}

var nmdrDialog = null;

(function() {
	nmdr.core.onLoad(function() { nmdrDialog = new nmdrModalDialog(); });
}());

function nmdrDialogWrapper() {
	this.alert = function (tit, msg, cb) { nmdrDialog.alert(tit, msg, cb); };
	this.message = function (tit, msg, w, h, cb) { nmdrDialog.message(tit, msg, w,  h, cb); };
	this.confirm = function (tit, msg, cb) { nmdrDialog.confirm(tit, msg, cb); };
	this.prompt = function (tit, msg, value, cb) { nmdrDialog.prompt(tit, msg, value, cb); };
	this.showUrl = function (tit, url, w, h) { nmdrDialog.showUrl(tit, url, w, h); };
	this.dialog = function (args) { nmdrDialog.dialog(args); };
	this.relegate = function (index, args) { nmdrDialog.relegate(index, args); };
}
