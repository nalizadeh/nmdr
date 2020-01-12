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
// nmdrHTML
//
// Author: Nader Alizadeh
// Copyright: nalizadeh.com
//
// minimize with: http://javascript-minifier.com/
// minimize with: https://jscompress.com/
//

'use strict';

function Row(data) {
    this.parent = data.parent;
    this.sh = data.height ? data.height : "auto";
    this.minWidth = data.minWidth;
    this.spacing = data.spacing;
    this.hAlign = data.hAlign;
    this.background = data.background;
	this.left = 0;
	this.top = 0;
	this.width = 0;
    this.height = 0;
    this.columns = [];
}

Row.prototype.addNewColumn = function(data, index) {
	if (!data) data = {parent:this}; else data.parent = this;
    var co = new Column(data);
    if (typeof index == "undefined") this.columns.push(co); else this.columns.splice(index, 0, co);
    return {row:this, col:co};
};

Row.prototype.addColumn = function(co, index) {
    co.parent = this;
    if (typeof index == "undefined") this.columns.push(co); else this.columns.splice(index, 0, co);
    return {row:this, col:co};
};

Row.prototype.clone = function() {
    var row = new Row(
		{
			parent:this.parent, 
			height:this.sh, 
			minWidth:this.minWidth,  
			spacing:this.spacing, 
			hAlign:this.hAlign, 
			background:this.background
		}
	);

	for (var co=0; co < this.columns.length; co++) {
        row.columns.push(this.columns[co].clone());
    }
    return row;
};

function Column(data) {
    this.parent = data.parent;
	this.sw = data.width ? data.width : "auto";
    this.target = data.target;
    this.background = data.background;
	this.left = 0;
	this.top = 0;
	this.width = 0;
    this.height = 0;
    this.rows = [];
}

Column.prototype.addNewRow = function(data) {
	if (!data) data = {parent:this}; else data.parent = this;
	var rw = new Row(data);
    this.rows.push(rw);
    return {row:rw, col:this};
};

Column.prototype.addRow = function(rw) {
	rw.parent = this;
    this.rows.push(rw);
    return {row:rw, col:this};
};

Column.prototype.clone = function() {
    var col = new Column(
		{
			parent:this.parent, 
			width:this.sw, 
			target:this.target, 
			background:this.background
		}
	);

	for (var ro=0; ro < this.rows.length; ro++) {
        col.rows.push(this.rows[ro].clone());
    }
    return col;
};

function bodySize() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        //x = w.innerWidth || e.clientWidth || g.clientWidth,
        x = g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
    return {width:x, height:y};
}
        

//==============================================

function nmdrLayout (id, inited) {
    var $ = (typeof id == "string") ? document.getElementById(id) : id;
    if (inited) return $;
  
    $.originRows = [];
    $.rows = [];
    $.bsize;
	$.debug = false;

    $.addNewRow = function(data) {
        var rw = new Row(data ? data : {});
        this.originRows.push(rw);
		return {row:rw, column:null};
    };
    
    $.start = function (callback) {
        
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function(str) {
                return this.substring(0, str.length) === str;
            }
        };

        if (typeof String.prototype.endsWith != 'function') {
            String.prototype.endsWith = function(str) {
                return this.substring(this.length - str.length, this.length) === str;
            }
        };
             			
		var self = this;
		var everythingLoaded = setInterval(function() {
			if (document.readyState == "complete") {
				clearInterval(everythingLoaded);
				self.build();
				window.addEventListener('resize', function () { self.build(); });
				if (callback) callback();
		}}, 10);
    };

    $.build = function () {
        
        this.makeResponsible();
		this.dimColumns(this.rows, this.bsize.width, this.bsize.height);
		this.dimRows(this.rows, this.bsize.width, this.bsize.height);
		
		//this.showDebug();
        
        var buff = [];
        
        buff.push("<div id='" + this.id + "_mainContent' style='display:block;width:100%;height:100%;'>");
        this.makeRows(buff);
        buff.push("</div>");        
		
        this.innerHTML = buff.join("");
    };
       	    
    $.makeResponsible = function() {
       
        this.bsize = bodySize();
			
		var dim = function(originRows, newRows, bsize) {
		
			while (newRows.length) newRows.pop();
			
			for (var ro=0; ro < originRows.length; ro++) {

				var row = originRows[ro].clone();
							
				//=== spacing
				
				if (row.spacing && row.spacing > 0) {
					var n = row.columns.length-1, m = 1;
					for (var i=0; i < n; i++) {
						row.addNewColumn({width:row.spacing + "px" }, m);
						m += 2;
					}
				}

				//=== responsible
				
				if (row.minWidth && row.minWidth > bsize.width) {
					for (var co=0; co < row.columns.length; co++) {
						var col = row.columns[co];
						var newRow = new Row(
							{
								height: col.target ? row.sh : (row.spacing ? row.spacing : 10) + "px", 
								spacing: row.spacing, 
								hAlign: row.hAlign, 
								background: row.background
							}
						);

						var newCol = col.clone();
						newCol.sw = "100%";
						newRow.addColumn(newCol);
						newRows.push(newRow);
					}
				}
				else {
					newRows.push(row);
				}
			}
			
			//=== alignment

			for (var ro=0; ro < newRows.length; ro++) {
				
				row = newRows[ro];
				var fw = 0;
				for (var co=0; co < row.columns.length; co++) {
					var col = row.columns[co];
					if (col.sw.endsWith("px")) {
						fw += parseInt(col.sw);
					}
				}

				if (row.hAlign && fw != 0) {
					var w = bsize.width - fw;
					if (w > 0) {
						if (row.hAlign == "center") {
							row.addNewColumn({width:w / 2 + "px"}, 0);
							row.addNewColumn({width:w / 2 + "px"});
						}
						else if (row.hAlign == "right") row.addNewColumn({width:w + "px"}, 0);
						else if (row.hAlign == "left") row.addNewColumn({width:w + "px"});
					}
				}
			}
			
			for (var ro=0; ro < newRows.length; ro++) {
				var row = newRows[ro];
				for (var co=0; co < row.columns.length; co++) {
					var col = row.columns[co];
					if (col.rows.length > 0) {
						var newCol = col.clone();
						dim(newCol.rows, col.rows, bsize);
					}
				}
			}
		};
		
		dim(this.originRows, this.rows, this.bsize);
	};
    
	$.dimRows = function(rows, xw, xh) {
	
		var dimH = function(col) {
			if (col.target) {
				var el = document.getElementById(col.target);
				return {w:el.clientWidth, h:el.clientHeight};
			}
			var hh = 0;
			for (var ro=0; ro < col.rows.length; ro++) {
				var row = col.rows[ro], h=0;
				if (row.sh.endsWith("px")) h = parseInt(row.sh); 
				else {
					for (var co=0; co < row.columns.length; co++) {
						var d = dimH(row.columns[co]);
						h = Math.max(h, d.h);
					}
				}
				hh += h;
			}
			return {w:0, h:hh};
		};
		
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro];	
			if (row.sh == "auto") {
				var h = 0;
				for (var co=0; co < row.columns.length; co++) {
					h = Math.max(h, dimH(row.columns[co]).h);
				}
				row.sh = h + "px";
			}
		}
		
		var hh = 0;
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro];
			if (row.sh.endsWith("px")) { 
				row.height = parseInt(row.sh); 
				hh += row.height; 
			}
		}
	
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro];
			if (row.sh.endsWith("%")) {
				var hx = parseInt(row.sh);
				row.height = Math.max(0, Math.floor((xh - hh) * hx / 100));
			}
		}
		
		var tp = 0;
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro];		
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				col.height = row.height;
			}
			row.left = 0;
			row.top = tp;
			row.width = xw;
			tp += row.height;
		}
		
		// recursive
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro];
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				if (col.rows.length > 0) {
					this.dimRows(col.rows, col.width, col.height);
				}
			}
		}
	};
	
	$.dimColumns = function(rows, xw, xh) {
		
		var dimW = function(col) {
			if (col.target) {
				var el = document.getElementById(col.target);
				return {w:el.clientWidth, h:el.clientHeight};
			}
			var ww = 0;
			for (var ro=0; ro < col.rows.length; ro++) {
				var row = col.rows[ro], w = 0;
				for (var co=0; co < row.columns.length; co++) {
					var col = row.columns[co];
					if (col.sw.endsWith("px")) w += parseInt(col.sw);
					else {
						var d = dimW(col);
						w += d.w;
					}
				}
				ww = Math.max(ww, w);
			}
			return {w:ww, h:0};
		};
		
		for (var ro=0; ro < rows.length; ro++) {
			var row = rows[ro], ww = 0;
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				if (col.sw == "auto") {
					//var d = dimW(col);
					//col.sw = d.w != 0 ? d.w + "px" : "100%";
					
					col.sw = "100%";
				}
			}
			
			var ww = 0;
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				if (col.sw.endsWith("px")) { 
					col.width = parseInt(col.sw); 
					ww += col.width; 
				}
			}

			ww = xw - ww;
			var lf = 0;
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				if (col.sw.endsWith("%")) {
					var wx = parseInt(col.sw);
					col.width = Math.max(0, Math.floor(ww * wx / 100));
				}

				col.top = 0;
				col.left = lf;		
				lf += col.width;
			}
			
			// recursive			
			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co];
				if (col.rows.length > 0) {
					this.dimColumns(col.rows, col.width, col.height);
				}
			}		
		}
	};
	
    $.makeRows = function(buff) {
		var deb = this.debug ? "outline:1px solid blue;" : "";
		
		var make = function(buff, parent, id, ro) {
			
			var row = parent.rows[ro];
			
			buff.push("<div id='" + id + "_row_" + ro + "' " +
				"style='position:absolute;display:block;" +
				"left:" + row.left + "px;" +
				"top:" + row.top + "px;" +
				"width:" + row.width + "px;" +
				"height:" + row.height + "px;" + 
				(row.background ? "background:" + row.background + ";" : "") + deb + "'>");

			for (var co=0; co < row.columns.length; co++) {
				var col = row.columns[co], ih = "";
				if (col.target) {
					var ta = document.getElementById(col.target);
					ta.style.height = "100%";
					ta.style.width = "100%";
					ih = ta.outerHTML;
				}
				
				buff.push("<div id='" + id + "_row_" + ro + "_col_" + co + "' class='cell' " +
					"style='position:absolute;display:block;width:" + col.width + "px;height:" + row.height + 
					"px;left:" + col.left + "px;top:" + col.top + "px;" +
					(col.background ? "background:" + col.background + ";" : "") + deb + "'>" + ih);
						
				var col = row.columns[co];
				for (var r=0; r < col.rows.length; r++) { 
					make(buff, col, id + "_row_" + r + "_col_" + co, r);
				}
				buff.push("</div>");
			}
			buff.push("</div>");
		};
		
		for (var ro=0; ro < this.rows.length; ro++) { 
            make(buff, this, this.id, ro);
        }
	};
   
	$.showDebug = function() {
		var st = "";
		var deb = function(rows, pfx) {
			for (var ro=0; ro < rows.length; ro++) {
				var row = rows[ro];
				st += pfx + "<div>" + row.width + "," + row.height + "," + row.top + (row.calc ? ",true": "") + "\n";
				for (var co=0; co < row.columns.length; co++) {
					var col = row.columns[co];
					if (col.rows.length > 0) 
						st = deb(col.rows, pfx + "   ");
					else 
						st += pfx + "   <div>" + col.width + "," + col.height + (col.target ? "," + col.target : "") + "</div>\n";
				}
				st += pfx + "</div>\n";
			}
			return st;
		};
		
		deb(this.rows, "");
		
		alert(st);
	}
    
    return $;
}
