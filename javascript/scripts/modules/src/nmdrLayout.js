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
#  nmdrLayout
#
#  Version: 1.00.00#  Date: October 11. 2017
#  Status: Release
#
#####################################################################
*/

function nmdrLayout(id) {

	var $ = nmdr.core.$(id, "nmdrLayout");
	if ($ == null) return; 
	
	$.padding = 0;
	$.bgColor = null;
	
	$.rows = null;
	$.cols = null;
	$.comps = null;
	$.cells = null;

	$.showGrids = null;
	$.responsive = null;
	$.fullscreen = null;
			
	$.init = function(props) { 
	
		props = props || {};

		this.padding = props.hasOwnProperty("padding") ? props.padding : 0;
		this.bgColor = props.hasOwnProperty("bgColor") ? props.bgColor : "#ddd";
		this.showGrids = props.hasOwnProperty("showGrids") ? props.showGrids : false;
		this.rows = props.hasOwnProperty("rows") ? props.rows : [{nr:1, sh:"auto"}];
		this.cols = props.hasOwnProperty("cols") ? props.cols : [{nr:1, sw:"auto"}];
		this.comps = props.hasOwnProperty("comps") ? props.comps : [];

		nmdr.core.utils.updateOnLoadResize(this, function(self) { self.layout(); });

		this.layout();
	};
		
	$.layout = function() {
		
		var wi = this.clientWidth - this.padding * (this.cols.length + 1);
		var hi = this.clientHeight - this.padding * (this.rows.length + 1);
		
		//=== rows
		
		var rx = 0, hx = 0, hn;
		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh == "auto") rx++;
			else if (this.rows[r].sh.endsWith("px")) {
				this.rows[r].height = parseInt(this.rows[r].sh); 
				hx += this.rows[r].height;
			}
		}

		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh.endsWith("%")) {
				var h = parseInt(this.rows[r].sh);
				this.rows[r].height = Math.max(0, Math.floor((hi - hx) * h / 100));
				hx += this.rows[r].height;
			}
		}

		hn = Math.floor((hi - hx) / rx);
		for (var r=0; r < this.rows.length; r++) {
			if (this.rows[r].sh == "auto") this.rows[r].height = hn;
		}
					
		//=== columns
		
		var cx = 0, wx = 0, wn = 0;
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw == "auto") cx++;
			else if (this.cols[c].sw.endsWith("px")) {
				this.cols[c].width = parseInt(this.cols[c].sw); 
				wx += this.cols[c].width;
			}
		}
		
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw.endsWith("%")) {
				var w = parseInt(this.cols[c].sw);
				this.cols[c].width = Math.max(0, Math.floor((wi - wx) * w / 100));
				wx += this.cols[c].width;
			}
		}
		
		wn = Math.floor((wi - wx) / cx);
		for (var c=0; c < this.cols.length; c++) {
			if (this.cols[c].sw == "auto") this.cols[c].width = wn;
		}
		
		//=== cells	
		
		this.cells = {};
		var to = this.padding;
		for (var r = 0; r < this.rows.length; r++) {
			var le = this.padding;
			for (var c = 0; c < this.cols.length; c++) {

				var cm = null;
				for (var i = 0; i < this.comps.length; i++) {
					var cx = this.comps[i];
					if (r+1 == cx.row && c+1 == cx.col) {
						cm = cx;
						break;
					}
				}
				
				this.cells[r + "" + c] =
				{
					row: this.rows[r].nr,
					col: this.cols[c].nr,
					left: le,
					top: to,
					width: this.cols[c].width,
					height: this.rows[r].height,
					comp: cm
				};
				le += this.cols[c].width + this.padding;
			}
			to += this.rows[r].height + this.padding;
		}
		
		this.show();
	};
	
	$.show = function() {
		var buf = [];
		
		buf.push("<div id='" + this.id + "_root' ");
		buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;padding:0;margin:0;");
		buf.push("display:inline-block;overflow:hidden;box-sizing:border-box;background:" + this.bgColor + ";'>");	
				
		if (this.showGrids) {
			buf.push("<div id='" + this.id + "_grids' ");
			buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:transparent;'>");	

			for (var r = 0; r < this.rows.length; r++) {
				for (var c = 0; c < this.cols.length; c++) {
					var ce = this.cells[r + "" + c],
						bg = "background:#" + ((1<<24) * Math.random()|0).toString(16) + ";", 
						bg = "";
						
					buf.push("<div id='" + this.id + "cell" + ce.row + "-" + ce.col + "' ");
					buf.push("style='position:absolute;left:" + ce.left + "px;top:" + ce.top + "px;width:" + ce.width + "px;height:" + ce.height + "px;");
					buf.push("padding:0;margin:0;" + bg + "box-sizing:border-box;border:1px solid #ccc;'></div>");
				}
			}			
			buf.push("</div>");	
		}
		
		buf.push("<div id='" + this.id + "_comps' ");
		buf.push("style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:transparent;");
		buf.push("font:14px arial,sans-serif;color:black;'>");
		
		for (var r = 0; r < this.rows.length; r++) {
			for (var c = 0; c < this.cols.length; c++) {
				var ce = this.cells[r + "" + c];
				
				if (ce.comp != null) {
					
					var el = document.getElementById(ce.comp.id);
					
					if (el) {
						var w = ce.width, 
							h = ce.height,
							l = ce.left,
							t = ce.top;
						
						if (ce.comp.colspan && ce.comp.colspan > 1 && c + ce.comp.colspan <= this.cols.length) {
							w += (ce.comp.colspan-1) * this.padding;
							for (var n=1; n < ce.comp.colspan; n++) {
								w += this.cells[r + "" + (c+n)].width;
							}
						}
						if (ce.comp.rowspan && ce.comp.rowspan > 1 && r + ce.comp.rowspan <= this.rows.length) {
							h += (ce.comp.rowspan-1) * this.padding;
							for (var n=1; n < ce.comp.rowspan; n++) {
								h += this.cells[(r+n) + "" + c].height;
							}
						}
						
						if (ce.comp.halign) {
							l = 
								ce.comp.halign == "left" ? l : 
								ce.comp.halign == "right" ? l + w - el.offsetWidth : 
								ce.comp.halign == "center" ? l + w / 2 - el.offsetWidth / 2 + 1 : l;
						}

						if (ce.comp.valign) {
							t = 
								ce.comp.valign == "top" ? t : 
								ce.comp.valign == "bottom" ? t + h - el.offsetHeight : 
								ce.comp.valign == "center" ? t + h / 2 - el.offsetHeight / 2 + 1 : t;
						}
						
						el.style.position = "absolute";
						el.style.left = l + "px";
						el.style.top = t + "px";
						el.style.width = w + "px";
						el.style.height = h + "px";
						el.style.padding = "0";
						el.style.margin = "0";
						el.style.boxSizing = "border-box";
						
						buf.push(el.outerHTML);
						el.parentNode.removeChild(el);
					}
				}
			}
		}
		
		buf.push("</div></div>");	
		
		this.innerHTML = buf.join("");
	};
	
	return $;
}

