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
#  nmdrTree
#
#  Version: 1.00.00
#  Date: Februar 28. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTree(id) {

	var $ = nmdr.core.$(id, "nmdrTree");
	if ($ == null) return;

    //=== Local variables, which refer to this object instance

    $.props = {
        imagePath:"img/",
        
        doPostBack: false,
        multiSelection: false,
        showRowCommands: true,

        //=== Styles

        lineHeight:"18px",
        color:"#000000",
        backColor:"#ffffff",
        rowSelectionColor:"rgba(156, 206, 240, 0.5)",
        rowHOverColor:"rgba(205,230,247,0.5)",
        rowAlternateColor:"rgba(242,246,252,0.5)",
        checkSelectionColor:"rgb(0,113,198)",
        showBorder:true,
        showShadow:true,
        borderColor:"rgb(207,208,210)",
        borderWidth:"1px",
        fontStyle:"Arial, Helvetica, sans-serif",
        fontWidth:"normal",
        fontSize:"13px",
        headerColor:"#000000",
        headerBackColor:"rgb(248, 248, 248)",
        headerFontStyle:"Arial, Helvetica, sans-serif",
        headerFontWidth:"bold",
        headerFontSize:"13px",
    };

    $.columns = [];
    $.widths = [];
    $.treeviewData = [];
    $.selections = [];
    $.clickedRow = -1;
    $.firstRow = 0;
    $.lastRow = 0;

    //=== Methods 

    $.init = function (props) {
		
 		props = props || {};
		
		if (!props.data) { alert("[nmdrTree]\n\nParameter 'data' does not exist."); return; }
        this.props = nmdr.core.utils.mergeProperties(this.props, props);
        this.updateData(this.props.data);
    };
    
    //=== virtual methods

    $.headerCellTemplate = function (col, value) { return null; };
    $.itemCellTemplate = function (row, col, value, selected) { return null; };
    $.columnWidthTemplate = function (col) { return null; };
    $.handleEvents = function (selections) { };
    $.openItem = function (row) { alert("open row: " + row); };
    $.editItem = function (row) { alert("edit row: " + row); };
    $.deleteItem = function (row) { alert("delete row: " + row); };

    //===

    $.makeViewer = function () {

        var pfx = "#" + this.id;
        var script = "<script type='text/javascript'></script>";

        var style = "<style type='text/css'>" +
 			pfx + " { position:relative !important; }" +
            pfx + " .nmdrTR_content {" +
            "  line-height: " + this.props.lineHeight + ";" +
            "  color:" + this.props.color + ";" +
            "  background:" + this.props.backColor + ";" +
            "  font-family: " + this.props.fontStyle + ";" +
            "  font-weight: " + this.props.fontWidth + ";" +
            "  font-size: " + this.props.fontSize + ";" +
            "  border-width:" + (this.props.showBorder ? this.props.borderWidth : "0px") + ";" +
            "  border-color:" + this.props.borderColor + ";" +
            "  border-style: solid;" +
            "  cursor: default;" +
            "  -webkit-user-select: none;" +
            "  -moz-user-select: none;" +
            "  -ms-user-select: none;" +
            "   user-select: none;" + (this.props.showShadow ? "box-shadow:3px 3px 3px #ccc;" : "") +
            "}" +
            pfx + " .nmdrTR_table td {" +
            "   padding-top: 2px;" +
            "   padding-bottom: 2px;" +
            "   padding-right: 2px;" +
            "   padding-left: 2px;" +
            "}" +
            pfx + " .nmdrTR_header {" +
            "  background: lightgray;" +
            "  line-height: " + (this.props.lineHeight + 8) + ";" +
            "}" +
            pfx + " .nmdrTR_header_th {" +
            "  color: " + this.props.headerColor + ";" +
            "  background: " + this.props.headerBackColor + ";" +
            "  font-family: " + this.props.headerFontStyle + ";" +
            "  font-weight: " + this.headerFontWidth + ";" +
            "  font-size: " + this.props.headerFontSize + ";" +
            "  border-bottom-width:" + (this.props.showBorder ? this.props.borderWidth : "0px") + ";" +
            "  border-bottom-color:" + this.props.borderColor + ";" +
            "  border-bottom-style: solid;" +
			"  padding: 2px;" +
            "  text-align: left;}" +
			
            pfx + " .nmdrTR_header_th span, img {vertical-align: middle;}" +
            pfx + " .nmdrTR_tr:hover {background: " + this.props.rowHOverColor + " !important;}" +
            pfx + " .nmdrTR_tr:hover td:first-child {background: " + this.props.rowHOverColor + " !important;}" +
            pfx + " .nmdrTR_tr:hover td:first-child span:first-of-type {display:inline !important;}" +
            pfx + " .nmdrTR_tr:hover td a.nmdrTR_rowcontrol {display: inline !important; opacity: 0.3 !important;}" +
            pfx + " .nmdrTR_tr_sel:hover td a.nmdrTR_rowcontrol {display: inline !important; opacity: 1 !important;}" +
			pfx + " .nmdrTR_td_folarw:hover, a.nmdrTR_rowcontrol:hover {cursor:pointer;}" +
            "</style>";

        var buf = [];
        buf.push(style);
        buf.push(script);
        buf.push("<div id='" + this.id + "nmdrTR_root' width:100%;height:100%;overflow:hidden;clear:both;'>");
        buf.push("<div id='" + this.id + "nmdrTR_content' class='nmdrTR_content' style='overflow:hidden;'>");
        buf.push(this.makeTable());
        buf.push("</div>");
        buf.push("</div>");

        this.innerHTML = buf.join("");
        this.initEvents();
    };

    $.makeTable = function () {
        var buf = [];
		var st = this.widths.length > 0 ? " style='table-layout: fixed;'" : "";
        buf.push("<table class='nmdrTR_table' width='100%' border='0' cellpadding='0' cellspacing='0' " +
			"onselectstart='return false' ondragstart='return false'" + st + ">");
        buf.push(this.makeHeader());
        buf.push(this.makeBody(true));
        buf.push("</table>");
        return buf.join("");
    };

    $.makeHeader = function () {
        var buf = [];
        buf.push("<thead class='nmdrTR_header'><tr class='nmdrTR_header_tr'>");
        buf.push("<th class='nmdrTR_header_th' style='width:20px;text-align:center;'>");
        buf.push("<img src='" + this.props.imagePath + "spCheck.png' onClick=\"nmdr.core.$('" + this.id + "').selectAll();\"></th>");

        for (var col = 0; col < this.columns.length; col++) {
			var cw = this.widths[col];
			var w = cw && !cw.endsWith("%") ? "style='width:" + cw + "'" : "";
            buf.push("<th class='nmdrTR_header_th'" + w + "> <span>" + this.columns[col] + "</span></th>");
        };
        buf.push("</tr></thead>");
        return buf.join("");
    };

    $.makeBody = function () {

        var self = this;

        var makeNode = function (buf, row, data, deep) {
            var pr = self.props,
                al = row % 2 === 0,
                cl = row === self.clickedRow,
                se = self.selections.indexOf(row) !== -1,
                bc = se ? pr.rowSelectionColor : al ? pr.rowAlternateColor : pr.backColor,
                cc = se ? pr.checkSelectionColor : al ? pr.rowAlternateColor : pr.backColor;

            buf.push("<tr class='nmdrTR_tr" + (cl ? "_sel" : "") + "' id='nmdrTR_tr#" + row + "' " +
					"onClick=\"nmdr.core.$('" + self.id + "').selectRow(event, " + row + ");\" style='background:" + bc + " '>");

            buf.push("<td style='width:20px; text-align:center; background:" + cc + "'>");
            buf.push("<span style='display:" + (se ? "inline" : "none") + "'>");
            buf.push("<img src='" + pr.imagePath + "spCheck" + (se ? "Sel" : "") + ".png'></span></td>");

            var dat = data.data;
			if (data.sub) {
                buf.push("<td class='nmdrTR_tr_td' colspan=" + (self.columns.length) + " style='text-align:left; background:" + bc + "'>"  + dat[0] + "</td></tr>");
			}
			else {
				for (var l = 0; l < dat.length; l++) {
					if (l == 0) {
						buf.push("<td class='nmdrTR_td' style='text-align:right;'>");
						buf.push("<table border='0' cellpadding='0' cellspacing='0'><tr>");

						for (var i = 0; i < data.dep; i++)
							buf.push("<td style='width:14px;'></td>");

						buf.push("<td style='width:14px;vertical-align:middle'" + 
							(data.fol ? " class='nmdrTR_td_folarw' onClick=\"nmdr.core.$('" +	self.id + "').expandNode('" + data.id + "');\">"+
							"<img src='" + pr.imagePath + (data.exp ? "spArrowd" : "spArrowl") + ".gif'>" : ">") + "</td>");

						buf.push("<td style='width:14px;vertical-align:top'><img src='" + pr.imagePath + 
							(data.fol ? "spFolder" : "spFile") + ".gif'></td>");

						buf.push("<td>" + dat[l] + "</td></tr></table></td>");
					}
					else {
						var ac = pr.showRowCommands && l == dat.length - 1 ?
							"<a class='nmdrTR_rowcontrol' id='" + self.id + "_nmdrTR_rowcontrol_" + row + "' style='display:none;float:right;'>" +
							"<img src='" + pr.imagePath + "spOpen.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'open'," + row + ");\">&nbsp;" +
							"<img src='" + pr.imagePath + "spEdit.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'edit'," + row + ");\">&nbsp;" +
							"<img src='" + pr.imagePath + "spDelete.gif' onclick=\"nmdr.core.$('" + self.id + "').action(event,'delete'," + row + ");\">&nbsp;" +
							"</a>" : "";

						var x = l == dat.length - 1 ? 'style=\"width:150px;\"' : "";
						buf.push("<td class='nmdrTR_td " + x + "'>" + dat[l] + ac + "</td>");
					}
				}
				buf.push("</tr>");
            }

            row++;

            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    row = makeNode(buf, row, data.childs[i], deep + 1);
                }
            }

            return row;
        };

        var buf = [];
        buf.push("<tbody class='nmdrTR_body'>");
               
        if (this.treeviewData.length > 0) {

            var row = 0;
            for (var i = 0; i < this.treeviewData.length; i++) {
                row = makeNode(buf, row, this.treeviewData[i], 0);
            }
        }
        
        this.firstRow = 0;
        this.lastRow = row-1;
        
        buf.push("</tbody>");
        return buf.join("");
    };

    $.updateTable = function () {
        document.getElementById(this.id + "nmdrTR_content").innerHTML = this.makeTable();
    };

    $.expandNode = function (id, exp) {
        var self = this;

        var expand = function (id, data) {
            if (data.id === id) {
                if (exp == null) {
                    data.exp = !data.exp;
                    return true;
                }
                else {
                    if (exp && !data.exp) { data.exp = true;  return true; }
                    if (!exp && data.exp) { data.exp = false; return true; }
                }
                return false;
            }
            
            for (var n = 0; n < data.childs.length; n++) {
                if (expand(id, data.childs[n])) {
                    return true;
                }
            }
            return false;
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            if (expand(id, this.treeviewData[i])) {
                this.clearSelection();
                document.getElementById(this.id + "nmdrTR_content").innerHTML = this.makeTable();
                break;
            }
        }
    };

    $.findNodeId = function (index) {
        var ind = 0;
        var findNode = function (data) {
            if (ind === index) return data.id;
            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    ind++;
                    var id = findNode(data.childs[i]);
                    if (id !== null) return id;
                }
            }
            return null;
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            var id = findNode(this.treeviewData[i]);
            if (id !== null) return id;
            ind++;
        }
        return null;
    };

    $.getAllVisibleNodes = function () {
        var ind = 0;
        var exps = [];

        var getVisible = function (data) {
            if (data.exp) {
                for (var i = 0; i < data.childs.length; i++) {
                    exps.push(ind++);
                    getVisible(data.childs[i]);
                }
            }
        };

        for (var i = 0; i < this.treeviewData.length; i++) {
            exps.push(ind++);
            getVisible(this.treeviewData[i]);
        }
        return exps;
    };

    $.selectRow = function (event, row) {
        var ind = this.selections.indexOf(row);

        if (this.props.multiSelection) {
            if (event && event.ctrlKey) {
                if (ind === -1) this.selections.push(row);
                else { this.selections.splice(ind, 1); row = -1; }
            }
            else if (event && event.shiftKey) {
                if (row < this.selections[0]) {
                    for (var i = row; i < this.selections[0]; i++) this.selections.push(i);
                }
                else if (row > this.selections[this.selections.length - 1]) {
                    var n = this.selections[this.selections.length - 1];
                    for (var i = row; i > n; i--) this.selections.push(i);
                }
            }
            else if (ind === -1 || this.selections.length > 1) {
                this.selections = [];
                this.selections[0] = row;
            }
            else {
                this.selections = []; row = -1;
            }

            this.selections.sort(function (a, b) { return (a - b); });
        }
        else if (ind === -1) this.selections[0] = row;
        else { this.selections = []; row = -1; }

        this.clickedRow = row;
        
        this.updateTable();
        this.selectionChanged();
    };

    $.selectNext = function () {
        if (this.selections.length === 1) {
            this.selections[0] = this.selections[0] == this.lastRow ? this.firstRow : this.selections[0] + 1;
            this.clickedRow = this.selections[0];
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.selectPrev = function () {
        if (this.selections.length === 1) {
            this.selections[0] = this.selections[0] == this.firstRow ? this.lastRow : this.selections[0] - 1;
            this.clickedRow = this.selections[0];
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.selectAll = function () {
        if (this.multiSelection) {
            var sels = this.getAllVisibleNodes();
            this.clickedRow = -1;
            this.selections = this.selections.length === sels.length ? [] : sels;
            this.updateTable();
            this.selectionChanged();
        }
    };

    $.clearSelection = function () {
        this.clickedRow = -1;
        this.selections = [];
        this.selectionChanged();
    };

    $.selectionChanged = function () {
        var ids = [];
        for (var i = 0; i < this.selections.length; i++) {
            ids.push(this.findNodeId(this.selections[i]));
        }
        this.handleEvents(ids);
        this.handlePostBack(ids);
    };
	
    $.action = function (ev, code, row) {
		this.selectRow(ev, row);
		switch(code) {
			case "open" : this.openItem(row); break;
			case "edit" : this.editItem(row); break;
			case "delete" : this.deleteItem(row); break;
		}
	};
	
    $.updateData = function (data) {
        this.columns = data.cols;
        this.widths = data.widths ? data.widths : [];
		var dat = data.data;

        var updateNodes = function (da, node, deep) {
            for (var i = 0; i < da.length; i++) {
                if (da[i].pid == node.id) {
                    var cn = {};
                    cn.id = da[i].id;
                    cn.pid = da[i].pid;
                    cn.fol = da[i].folder;
                    cn.sub = da[i].sub ? da[i].sub : false;
                    cn.exp = false;
                    cn.dep = deep;
                    cn.data = da[i].data;
                    cn.childs = [];
                    node.childs.push(cn);
                    updateNodes(da, cn, deep + 1);
                }
            }
        };

        for (var i = 0; i < dat.length; i++) {
            if (dat[i].pid == null) {
                var node = {};
                node.id = dat[i].id;
                node.pid = dat[i].pid;
                node.fol = dat[i].folder;
                node.sub = dat[i].sub ? dat[i].sub : false;
				node.exp = false;
                node.dep = 0;
                node.data = dat[i].data;
                node.childs = [];
                updateNodes(dat, node, 1);

                this.treeviewData.push(node);
            }
        }

        this.makeViewer();
    };

    $.initEvents = function () {
        var self = this;
        document.addEventListener("keydown", function(evt) { 
            switch(evt.keyCode) {
                // left arrow @todo
                case 10037: 
                    var sr = self.selections[0];
                    self.expandNode(self.treeviewData[self.selections[0]]["id"], false);
                    self.selectRow(null, sr);
                    evt.preventDefault();
                    break;
                // up arrow
                case 38: 
                    self.selectPrev();
                    evt.preventDefault();
                    break;
                
                // right arrow @todo
                case 10039:  
                    var sr = self.selections[0];
                    self.expandNode(self.treeviewData[self.selections[0]]["id"], true);
                    self.selectRow(null, sr);
                    evt.preventDefault();
                    break;
                    
                // down arrow
                case 40:
                    self.selectNext();
                    evt.preventDefault();
                break;
            }
        });
    };
    
    $.handlePostBack = function (sels) {
        if (this.props.doPostBack) {
            alert(sels);
        }
    };

    return $;
}

