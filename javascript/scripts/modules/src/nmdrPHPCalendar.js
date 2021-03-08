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
#  nmdrPHPCalendar
#
#  Version: 1.00.00
#  Date: August 15. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrPHPCalendar(id) {
    
	var $ = nmdr.core.$(id, "nmdrPHPCalendar");
	if ($ == null) return;

//	$.PHP_URL = "http://localhost/javascript/php/calendar.php";
	$.PHP_URL = "http://nalizadeh.dynv6.net/javascript/php/calendar.php";
	
	$.calData = [];
	$.ca = null;

	$.init = function(props) {
		
		var self = this, ca = nmdr.calendar(id);
		
		ca.prepareUserData = function (date, callback) {
			self.readItems(date, callback);
		};
		
		ca.renderCell = function (date) {
		
			var ln = self.findItems(date), tp = "", bg = "", tooltip = "";
			
			for (var i=0; i < ln.length; i++) {

				var cd = self.calData[ln[i]], von = new Date(cd.startdate), bis = new Date(cd.enddate);
				
				tp = cd.type;
				tooltip += "<b>" + cd.username + "</b><br>" + cd.type + "&nbsp;" + cd.text + "<br>" + von.asString() + " - " + bis.asString();
				if (i < ln.length-1) tooltip += "<br><br>";
					
				switch (cd.type) {
					case "Urlaub": bg = "background:#D8E4BC"; break;
					case "Frei": bg = "background:#8DB4E2"; break;
					case "Termin": bg = "background:#E6B8B7"; break;
				}
			}
					
			return tp == "" ? "" :
				"<div style='width:100%;height:100%;" + bg + "'><span class='hotspot' tooltip='" + tooltip + "' " +
				"style='font-weight:normal'>" + tp + "</span></div>";
		};
	
		ca.afterRendering = function () {
			nmdr.core.tooltips.start("hotspot", "#FFFFAE", "#FFB13D");
		};
		
		ca.getYVTooltip = function (date) {
			var ln = self.findItems(date), tp = "", bg = "", tooltip = "";
			
			for (var i=0; i < ln.length; i++) {

				var cd = self.calData[ln[i]], von = new Date(cd.startdate), bis = new Date(cd.enddate);
				
				tp = cd.type;
				tooltip += "<b>" + cd.username + "</b><br>" + cd.type + "&nbsp;" + cd.text + "<br>" + von.asString() + " - " + bis.asString();
				if (i < ln.length-1) tooltip += "<br><br>";
			}
			return tooltip == "" ? null : tooltip;
		};

		ca.getYVBackground = function (date) {
			var ln = self.findItems(date);
			return ln.length == 0 ? null : "#D8E4BC";
		};
		
		ca.prepareCommands = function () {
			return [
				{ name: "Neu...", icon: "details.gif", enabled: true, action: "new" },
				{ name: "Öffnen...", icon: "editdetails.gif", enabled: true, action: "view" },
				{ name: "Bearbeiten...", icon: "editdetails.gif", enabled: true, action: "edit" },
				{ name: "Löschen...", icon: "delete.gif", enabled: true, action: "delete" },
			];
		};
		
		ca.executeCommand = function (commandName, date) {
		
			var callback = function() { ca.refresh(); };
			
			if (commandName == "new") self.editItem(date, callback, true);
			if (commandName == "view") self.viewItem(date, callback);
			if (commandName == "edit") self.editItem(date, callback);
			if (commandName == "delete") self.deleteItem(date, callback);
		};

		ca.checkCommands = function (commands, date, callback) {
			var n = self.findItems(date);	
			for (var i = 0; i < commands.length; i++) {
				if (commands[i].action == "new" && n.length != 0) commands[i].enabled = false;
				if (commands[i].action == "view" && n.length == 0) commands[i].enabled = false;
				if (commands[i].action == "edit" && n.length == 0) commands[i].enabled = false;
				if (commands[i].action == "delete" && n.length == 0) commands[i].enabled = false;
			}
			
			callback();
		};
		
		props.view = ca.defaultView;
		
		ca.init(props);
		
		this.ca = ca;
		nmdr.core.dialog.imagePath = this.ca.imagePath;
	};

	$.dbREAD = function(item, success, failure) {
		item.func = "read";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.dbWRITE = function(item, success, failure) {
		item.func = "write";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.dbDELETE = function(item, success, failure) {
		item.func = "delete";
		nmdr.core.ajax.get(this.PHP_URL, item, success, failure);
	};

	$.findItems = function(date) {
		var rc = [];
		for (var i=0; i < this.calData.length; i++) {
			if (date.withoutTime().inRange(new Date(this.calData[i].startdate), new Date(this.calData[i].enddate))) rc.push(i);
		}
		return rc;
	};

	$.readItems = function(date, callback) {

		var self = this, d = new Date(date),
		
		failure = function(result) {
			if (self.calData.length == 0) {
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/03/2017", enddate: "06/04/2017", type: "Termin", text: "" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/10/2017", enddate: "06/12/2017", type: "Frei", text: "" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/20/2017", enddate: "06/20/2017", type: "Termin", text: "von 10:00 bis 12:00 Uhr" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/20/2017", enddate: "06/20/2017", type: "Termin", text: "von 14:00 bis 14:30 Uhr" });
				self.calData.push({ id: nmdr.core.ajax.createUUID(), username: "Nader", startdate: "06/25/2017", enddate: "07/10/2017", type: "Urlaub", text: "in Malaga" });
			}
			nmdr.core.dialog.message("Message", "Server response<br>" +
				"<br>readyState: " + result.readyState + 
				"<br>status: " + result.status + 
				"<br>responseText: " + result.responseText, 500, 300, callback);
		},
		
		success = function(result) {
			self.calData = [];
			for (var i=0; i < result.data.length; i++) self.calData.push(result.data[i]);
			callback();
		};
		
		var start = this.view == this.yearView ? new Date(d.getFullYear(), 0, 1).addMonth(-1) : d.addMonth(-1);
		var end = this.view == this.yearView ? new Date(d.getFullYear(), 11, 31).addMonth(1) : d.addMonth(1);
		
		this.dbREAD({startdate:start.toStr(), enddate:end.toStr()}, success, failure);
	};

	$.editItem = function(date, callback, isNew) {

		var self = this, ids = this.findItems(date), data = ids.length == 0 ? date : this.calData[ids[0]],
		
		saveForm = function (elem) {
			
			var uuid = elem.getElementsByClassName("uuid")[0],
				name = elem.getElementsByClassName("username")[0],
				start = elem.getElementsByClassName("startdate")[0],
				end = elem.getElementsByClassName("enddate")[0],
				typ = elem.getElementsByClassName("type")[0],
				txt = elem.getElementsByClassName("usertext")[0],
			
				data = {
					id: uuid.value,
					username: name.value,
					startdate: start.getDate().toStr(),
					enddate: end.getDate().toStr(),
					type: typ.options[typ.selectedIndex].value,
					text: txt.value
				},
				
				success = function(result) {			
					nmdr.core.dialog.message("Nachricht", result.responseText, 400, 250, callback);
				},
				
				failure = function(result) { 
					
					if (isNew) self.calData.push(data);
					else {
						var ids = findItems(new Date(data.startdate));
						if (ids.length > 0) {
							var cd = self.calData[ids[0]]; 
							cd.id = data.id;
							cd.username = data.username;
							cd.startdate = data.startdate;
							cd.enddate = data.enddate;
							cd.type = data.type;
							cd.text = data.text;
						}
					}
				
					var msg = "Folgende Daten wurden lokal gespeichert<br>" +
						"<br>Name: " + data.username +
						"<br>Anfang: " + data.startdate +
						"<br>Ende: " + data.enddate +
						"<br>Typ: " + data.type +
						"<br>Text: " + data.text;
						
					nmdr.core.dialog.message("Nachricht", "Server response<br>" +
						"<br>readyState: " + result.readyState + 
						"<br>status: " + result.status + 
						"<br>responseText: " + result.responseText +
						"<br><br>" + msg, 600, 450, callback);
				};
			
			self.dbWRITE(data, success, failure);
		},

		cancelForm = function (elem) {},

		renderDialog = function (data) {
			var id = data.id ? data.id : nmdr.core.ajax.createUUID(),
				tp = data.type ? data.type : "",
				un = data.username ? data.username : "",
				op = "<option" + (tp=="Urlaub" ? " selected" : "") + ">Urlaub</option>" +
					 "<option" + (tp=="Frei" ? " selected" : "") + ">Frei</option>" +
					 "<option" + (tp=="Termin" ? " selected" : "") + ">Termin</option>",
				tx = data.text ? data.text : "";
				
			return "" +
			"<table cellpadding='2' cellspacing='10' width='100%' border='0'>" +
			"<tr><td>Id:</td><td><input type='text' name='uuid' class='uuid' style='width: 260px;border:0;background:#fff' value='" + id + "' disabled></td></tr>" +
			"<tr><td>Name:</td><td><input type='text' name='username' class='username' style='width: 250px' value='" + un + "'></td></tr>" +
			"<tr><td>Anfang:</td><td><div class='startdate' id='startdate'></div></td></tr>" +
			"<tr><td>Ende:</td><td><div class='enddate' id='enddate'></div></td></tr>" +
			"<tr><td>Typ:</td><td><select name='type' class='type' style='width: 150px'>" + op + "</select></td></tr>" +
			"<tr><td>Text:</td><td><input type='text' name='usertext' class='usertext' value='" + tx + "' style='width: 300px'></td></tr></table>";
		},

		afterRenderDialog = function (data) { 
			nmdr.datetime("startdate").init({"date": new Date(data.startdate ? data.startdate : data), "imagePath": self.ca.imagePath});
			nmdr.datetime("enddate").init({"date": new Date(data.enddate ? data.enddate : data), "imagePath": self.ca.imagePath});
		};

		nmdr.core.dialog.dialog(
		{
			title: 'Bearbeiten',
			width: 450,
			height: 340,
			render: renderDialog,
			renderAfter: afterRenderDialog,
			renderData: data,
			buttons: [
				{ lable: 'Save', className: 'saveButton', callback: saveForm },
				{ lable: 'Cancel', className: 'cancelButton', callback: cancelForm }
			]
		});
	};

	$.deleteItem = function(date, callback) {
		var self = this;
		nmdr.core.dialog.confirm("Delete", "Do you want to delete the selected calendar items?", 
			function (conf, result) {
				if (conf) {
					var ids = self.findItems(date);
					if (ids.length > 0) {
						self.dbDELETE(self.calData[ids[0]], 
							function(result) {
								nmdr.core.dialog.alert("Delete", "Items successfully deleted.", callback);
							}, 
							function(result) {
								
								self.calData.splice(ids[0],1);

								nmdr.core.dialog.message("Message", 
									"Server response<br>" +
									"<br>readyState: " + result.readyState + 
									"<br>status: " + result.status + 
									"<br>responseText: " + result.responseText, 500, 300, callback);
							}
						);
					}
				}
			}
		);
	};

	$.viewItem = function(date, callback) {
		var ids = this.findItems(date);
		if (ids.length > 0) {
			var cd = this.calData[ids[0]],
				msg = "<table cellpadding='2' cellspacing='2' width='100%' border='0'>" +
				"<tr><td colspan='2'><b>Kalendareintrag</b></td></tr>" +
				"<tr><td colspan='2' style='height:10px'></td></tr>" +
				"<tr><td>Id:</td><td>" + cd.id + "</td></tr>" +
				"<tr><td>Name:</td><td>" + cd.username + "</td></tr>" +
				"<tr><td>Anfang:</td><td>" + cd.startdate + "</td></tr>" +
				"<tr><td>Ende:</td><td>" + cd.enddate + "</td></tr>" +
				"<tr><td>Typ:</td><td>" + cd.type + "</td></tr>" +
				"<tr><td>Text:</td><td>" + cd.text + "</td></tr></table>";
			
			nmdr.core.dialog.message("Kalendar", msg, 400, 320);
		}
	};

	return $;
}
