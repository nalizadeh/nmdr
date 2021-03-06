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
#  nmdrTable
# 
#  nmdrTable is a pure Javascript extension of the HTML table that 
#  provides full customizable solution for representing tabular data 
#  on the web. It is part of the nmdrUI framework and supports sorting, 
#  filtering and pagination. Each cell of header, footer and body is 
#  customizable with own rendering. The data of table can be loaded 
#  dynamically through Ajax calls, so any server-side technology 
#  including PHP, ASP, Perl, Java Servlets and JSP can be used.
#
#
#  Version: 1.00.00
#  Date: February 28. 2014
#  Status: Release
#
#####################################################################
*/

function nmdrTable(id) {

	var $ = nmdr.core.$(id, "nmdrTable");
	if ($ == null) return;

    //=== Global variables without reference to this object instance

    var reference = null;

    //=== Local variables, which refer to this object instance

    $.columns = [];
    $.dataRows = [];
    $.originRows = [];
    $.selectedRows = [];
    $.menuCommands = [];
    $.selectedColumn = -1;
    $.selectedColumnOld = -1;

    $.pageNumber = 1;
    $.pageCount = 0;
    $.totalNumber = 0;
    $.firstRow = 0;
    $.lastRow = 0;
    $.clickedRow = -1;
    $.rowMenuActRow = -1;
    
    $.headerMenuOpen = false;
    $.rowMenuOpen = false;
	
	$.SORT_ASCENDING = "SortZA";
	$.SORT_DESCENDING = "SortAZ";

    //=== Properties
    
    $.props = {
   
		//=== controls

        imagePath : "img/",
        rowLimit : 10,
        sortingColumn : -1,
        sortingDirection : null,
        filters : {},
        customQuery : null,
        dataSplitter : ",",
        filterSplitter : "&",
        filterDataSplitter : "|",
		menuColumn : -1,
		        		
        clientHandling : true,
        doPostBack : false,
        multiSelection : false,     
        showRowCommands : false,
        showHeader : false,
        showFooter : false,
        showBorder : true,
        showGrids : true,
        showShadow : false,
		showFilterData : true,
		scrollable : false,
		scrollable2 : false,

		dummyCols : 6,
		dummyRows : 6,
		
        //=== Localization

		lang: "en",
        patternNames : "",
        removeSortingLable : "",
        setFilterLable : "",
        removeFilterLable : "",
        pageLable : "",
        ofLable : "",
        totalLable : "",
        rowCountLable : "",
        gotoPageLable : "",

        //=== Styles
		
        color : "#000000",
        background : "#ffffff",
        borderColor : "#e0e0e0",
        borderWidth : "1px",
        fontFamily : "Arial, Helvetica, sans-serif",
        fontWidth : "normal",
        fontSize : "13px",
        checkSelectionColor : "rgb(0,113,198)",
        menuCellBackground : "rgb(156, 206, 240)",
		selcolumnWidth : 20,
		menucolumnWidth : 24,

		//=== header
		headerHeight : 24,
 		headerPadding : 3,
 		headerWhiteSpace : "nowrap",
		headerTextOverflow : "ellipsis",
		headerColor : "#000",
        headerBackground : "rgb(248, 248, 248)",
        headerFontFamily : "Arial, Helvetica, sans-serif",
        headerFontWidth : "bold",
        headerFontSize : "13px",
        headerSelectionColor : "rgba(156, 206, 240, 0.5)",
        headerHOverColor : "#000",
        headerHOverBackColor : "rgba(205,230,247,0.5)",
		
		//=== body
		bodyRowHeight : 24,
		bodyPadding : 3,
 		bodyWhiteSpace : "nowrap",
		bodyTextOverflow : "ellipsis",
        bodySelectionColor : "#000",
        bodySelectionBackColor : "rgba(156, 206, 240, 0.5)",
        bodyHOverColor : "#000",
        bodyHOverBackColor : "rgba(205,230,247,0.5)",
        bodyAlternateColor : "rgba(242,246,252,0.5)",
		
		//=== footer
        footerHeight : 42,
        footerColor : "#000000",
        footerBackColor : "rgb(248, 248, 248)",
        footerFontFamily : "Arial, Helvetica, sans-serif",
        footerFontWidth : "normal",
        footerFontSize : "12px",
        footerShowPager : true,
        footerShowGoPage : true,
        footerShowRowCount : true,
        footerShowPageInfo : true,
		
		//=== headermenu
		headerMenuWidth : 280
    };

    //=== Methods 

    $.init = function (props) {
		
		props = props || {};
		
        this.props = nmdr.core.utils.mergeProperties(this.props, props);
		
		this.localization();

        //this.makeView();
        this.loadData(true, true);
    };

    $.localization = function () {
		if (this.props.lang === "en") {
			this.props.patternNames = ["is equal/x", "is not equal/x", "contains/x", "not contains/x", "starts with/x", "ends with/x"];
			this.props.removeSortingLable = "Remove Sorting";
			this.props.removeFilterLable = "Remove Filter";
			this.props.setFilterLable = "Set Filter";
			this.props.pageLable = "Page";
			this.props.ofLable = "of";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Row count";
			this.props.gotoPageLable = "Go to page";
		}
		else if (this.props.lang === "de") {
			this.props.patternNames = ["is equal/ist gleich", "is not equal/ist nicht gleich", "contains/enthält", "not contains/enthält nicht", "starts with/beginnt mit", "ends with/endet mit"];
			this.props.removeSortingLable = "Sortierung löschen";
			this.props.removeFilterLable = "Filter löschen";
			this.props.setFilterLable = "Filter setzen";
			this.props.pageLable = "Seite";
			this.props.ofLable = "von";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Anzahl Zeilen";
			this.props.gotoPageLable = "Gehe zur Seite";
		}
		else if (this.props.lang === "fr") {
			this.props.patternNames = ["is equal/est le même", "is not equal/n'est pas égal", "contains/contient", "not contains/ne contient pas", "starts with/commence par", "ends with/se termine par"];
			this.props.removeSortingLable = "Supprimer le tri";
			this.props.removeFilterLable = "Supprimer le filtre";
			this.props.setFilterLable = "Définir le filtre";
			this.props.pageLable = "Page";
			this.props.ofLable = "de";
			this.props.totalLable = "Totalement";
			this.props.rowCountLable = "Nombre de lignes";
			this.props.gotoPageLable = "Aller à la page";
		}
		else if (this.props.lang === "es") {
			this.props.patternNames = ["is equal/es lo mismo", "is not equal/no es igual", "contains/contiene", "not contains/no contiene", "starts with/comienza con", "ends with/termina con"];
			this.props.removeSortingLable = "Eliminar clasificación";
			this.props.removeFilterLable = "Eliminar filtro";
			this.props.setFilterLable = "Establecer filtro";
			this.props.pageLable = "Página";
			this.props.ofLable = "de";
			this.props.totalLable = "Total";
			this.props.rowCountLable = "Numero de lineas";
			this.props.gotoPageLable = "Ir a la página";
		}
	};
	
    //=== virtual methods

    $.renderHeaderCell = function (col, value) { return null; };
    $.renderBodyCell = function (row, col, value, selected) { return null; };
    $.getColumnWidth = function (col) { return null; };
    $.handleEvents = function (selections) { };
    $.openRow = function (row) { alert("open row: " + row); };
    $.editRow = function (row) { alert("edit row: " + row); };
    $.deleteRow = function (row) { alert("delete row: " + row); };

    //=== 

    $.makeView = function () {

        var buf = [], pr = this.props, 
		
		pfx = "#" + this.id,
		script = "<script type='text/javascript'>(function() { })();</script>",
		style = "<style type='text/css'>" +
			pfx + " {" +
			" position: relative !important;" +
			" width: 100%;" +
			" height: 100%;" +
			" box-sizing: border-box;" +
			" -webkit-box-sizing: border-box;" +
			" -moz-box-sizing: border-box;" +
            " -ms-box-sizing: border-box;" +
            " -o-box-sizing: border-box;" +
			"}" +
            pfx + " .nmdrTB_content {" +
			" overflow: hidden;" +
            " color:" + pr.color + ";" +
            " background:" + pr.background + ";" +
            " font-family: " + pr.fontFamily + ";" +
            " font-weight: " + pr.fontWidth + ";" +
            " font-size: " + pr.fontSize + ";" +
            " border-width:" + (pr.showBorder ? pr.borderWidth : "0px") + ";" +
            " border-color:" + pr.borderColor + ";" +
            " border-style: solid;" +
            " cursor: default;" +
            " -webkit-user-select: none;" +
            " -moz-user-select: none;" +
            " -ms-user-select: none;" +
            " -o-user-select: none;" +
            "  user-select: none;" + (pr.showShadow ? "box-shadow:3px 3px 3px #ccc;" : "") +
            "}" +

			pfx + " .nmdrTB_table { border-collapse: collapse; }" +
            pfx + " .nmdrTB_table td.nmdrTB_body_td { vertical-align: middle; }" +
            pfx + " .nmdrTB_table img { vertical-align: middle; cursor: pointer; }" +

			//=== header
		
            pfx + " .nmdrTB_header { background: " + pr.headerSelectionColor + "; height: " + pr.headerHeight + "px; }" +
            pfx + " .nmdrTB_header_tr {}" +
            pfx + " .nmdrTB_header_th {" +
			" height: " + pr.headerHeight + "px;" +
            " color: " + pr.headerColor + ";" +
            " background: linear-gradient(#eee, " + pr.headerBackground + ");" +
            " font-family: " + pr.headerFontFamily + ";" +
            " font-weight: " + pr.headerFontWidth + ";" +
            " font-size: " + pr.headerFontSize + ";" +
            " border-bottom-width:" + (pr.showBorder || pr.showGrids ? pr.borderWidth : "0px") + ";" +
            " border-bottom-color:" + pr.borderColor + ";" +
            " border-bottom-style: solid;" +
			" padding: " + pr.headerPadding + "px;" +
			" padding-top: " + (pr.headerPadding + 1) + "px;" +
            " text-align: left;" +
			" white-space: " + pr.headerWhiteSpace + ";" +
			" text-overflow: " + pr.headerTextOverflow + ";" +
			" overflow: hidden;" +
            "}" +
            pfx + " .nmdrTB_header_tr th.nmdrTB_header_th:not(:first-child) {" +
			"  border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_header_th:hover {" +
			" color: " + pr.headerHOverColor + ";" +
			" background: " + pr.headerHOverBackColor + ";" +
			" transition:all 0.5s ease-in-out;" +
			"}" +
            pfx + " .nmdrTB_header_th_sp:hover { cursor: pointer; }" +
			pfx + " .nmdrTB_header_th_se { width:" + pr.selcolumnWidth + "px; text-align:center; }" +
			pfx + " .nmdrTB_header_th_cm { width:" + pr.menucolumnWidth + "px; text-align:center; }" +
			pfx + " .nmdrTB_header_th_cm img { opacity: 0.3; }" +
			
			//=== body 
						
            pfx + " .nmdrTB_body_tr { height: " + pr.bodyRowHeight + "px; }" +
            pfx + " .nmdrTB_body_td {" +
			" height: " + pr.bodyRowHeight + "px;" +
			" padding: " + pr.bodyPadding + "px;" +
			" white-space: " + pr.bodyWhiteSpace + ";" +
			" text-overflow: " + pr.bodyTextOverflow + ";" +
			" overflow: hidden;" +
			"}" +
			pfx + " .nmdrTB_body_tr:nth-child(even) { background: " + pr.bodyAlternateColor + "; }" +
			pfx + " .nmdrTB_body_tr:nth-child(odd) { background: " + pr.background + "}" +
	        pfx + " .nmdrTB_body_tr:hover { color: " + pr.bodyHOverColor + "; background: " + pr.bodyHOverBackColor + "; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td:first-child { background: " + pr.bodyHOverBackColor + "; }" +

            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td:not(:first-child) {" +
			" border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td {" +
			" border-bottom: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
			
            pfx + " .nmdrTB_body_tr td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: hidden; float:right; }" +
            pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: hidden; float:right; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td a.nmdrTB_rowcontrol { visibility: visible; opacity: 0.3; }" +
            pfx + " .nmdrTB_body_tr:hover td.nmdrTB_body_td:first-child img:first-of-type { visibility: visible; }" +
            pfx + " .nmdrTB_body_tr:hover .nmdrTB_body_cm { visibility: visible; opacity: 0.3; }" +
			
			//=== selection row
			
			pfx + " .nmdrTB_body_tr_sel { color: " + pr.bodySelectionColor + "; background: " + pr.bodySelectionBackColor + "; }" +
			pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td:not(:first-child) {" +
			" border-left: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
			pfx + " .nmdrTB_body_tr_sel td.nmdrTB_body_td {" +
			" border-bottom: " + (pr.showGrids ? pr.borderWidth : "0px") + " solid " + pr.borderColor + ";" +
			"}" +
            pfx + " .nmdrTB_body_tr_sel:hover td.nmdrTB_body_td a.nmdrTB_rowcontrol {" +
            " visibility: visible !important; opacity: 1 !important;" +
			"}" +

			pfx + " .nmdrTB_body_td_se {" +
			" width:" + pr.selcolumnWidth + "px;" +
			" min-width:" + pr.selcolumnWidth + "px;" +
			" max-width:" + pr.selcolumnWidth + "px;" +
			" text-align:center;" +
			"}" +
			pfx + " .nmdrTB_body_td_se_sel { background: " + pr.checkSelectionColor + "; }" +
			pfx + " .nmdrTB_body_se { visibility: hidden; }" +
			pfx + " .nmdrTB_body_se_sel { visibility: visible; }" +
			
			pfx + " .nmdrTB_body_td_cm {" +
			" width:" + pr.menucolumnWidth + "px;" +
			" min-width:" + pr.menucolumnWidth + "px;" +
			" max-width:" + pr.menucolumnWidth + "px;" +
			" text-align:center;" +
			"}" +
			pfx + " .nmdrTB_body_td_cm_sel { background: " + pr.menuCellBackground + "; }" +
			pfx + " .nmdrTB_body_cm { visibility: hidden; }" +
			pfx + " .nmdrTB_body_cm_sel { visibility: visible; }" +

			//=== footer
			
            pfx + " .nmdrTB_footer {}" +
            pfx + " .nmdrTB_footer_tr {}" +
            pfx + " .nmdrTB_footer_td { padding: 0px; }" +
            pfx + " .nmdrTB_footer_div {" +
			" width: 100%;" +
			" height: " + pr.footerHeight + "px;" +
            " color: " + pr.footerColor + ";" +
            " background: linear-gradient(#eee, " + pr.footerBackColor + ");" +
            " font-family: " + pr.footerFontFamily + ";" +
            " font-weight: " + pr.footerFontWidth + ";" +
            " font-size: " + pr.footerFontSize + ";" +
            " border-top-width: " + (pr.showBorder && !pr.showGrids ? pr.borderWidth : pr.scrollable ? "1px" : "0px") + ";" +
            " border-top-color: " + pr.borderColor + ";" +
            " border-top-style: solid;" +
            "}" +
			
			//=== rest
			
            pfx + " .nmdrTB_headerMenu {" +
			" display: none;" +
			" background-color: white;" +
			" border: 1px solid #bbb;" +
			" padding: 10px;" +
			" width: " + pr.headerMenuWidth + "px;" +
            " line-height: 22px;" +
            " font-family: arial,verdana,sans-serif;" +
            " font-weight: normal;" +
            " font-size: 12px;" +
            " z-index: 999;" +
            " box-shadow: 5px 5px 5px #ddd;" +
			" transition: all 0.5s ease-in-out;" +
            "}" +
            pfx + " .nmdrTB_rowMenu {" +
			" display: none;" +
			" background-color: white;" +
			" border: 1px solid #bbb;" +
			" padding: 5px;" +
			" width: 200px;" +
            " line-height: 22px;" +
            " font-family: arial,verdana,sans-serif;" +
            " font-weight: normal;" +
            " font-size:12px;" +
            " z-index: 999;" +
            " box-shadow:5px 5px 5px #ddd;" +
			" transition:all 0.5s ease-in-out;" +
            "}" +
            pfx + " .nmdrTB_rowMenu img { vertical-align: middle; }" +
            pfx + " .nmdrTB_rowMenu_tr { height:28px; }" +
            pfx + " .rowMenuActRow, .nmdrTB_rowMenu_tr:hover {" +
            "  background: " + pr.bodyHOverBackColor + " !important;" +
            "  cursor: pointer;" +
            "}" +
            pfx + " .nmdrTB_loader {" +
            " position: absolute;" +
            " top: 0px;" +
            " left: 0px;" +
            " width: 100%;" +
            " height: 100%;" +
            " display: none;" +
            " cursor: wait;" +
            " z-index: 999;" +
            " background:#ffffff url(\"" + pr.imagePath + "spLoader.gif\") no-repeat center center;" +
            " opacity: 0.75;" +
            " filter: alpha(opacity=75);" +
            "}" +
			
			//=== Scrolling
			
			(pr.scrollable ?
				pfx + " .nmdrTB_header_tr { display: block; }" +
				pfx + " .nmdrTB_body { display: block; overflow-y: scroll; overflow-x:hidden; height: " + (this.offsetHeight - pr.headerHeight - pr.footerHeight) + "px; }" : 
				pfx + " .nmdrTB_content {" + (pr.scrollable2 ? "position:absolute; left:0px; top:0px; width:100%; height:100%; overflow-y:scroll;}" : "}") 		
			) +
			
            "</style>";

        buf.push(style);
        buf.push(script);
        buf.push(this.makeRowMenu());
        buf.push(this.makeHeaderMenu());
        buf.push(this.makeContent());
		
        document.getElementById(this.id).innerHTML = buf.join("");
		
		this.configSize();
        this.initKeyEvents();
    };
	
    $.makeContent = function () {
		var buf = [];
        buf.push("<div class='nmdrTB_loader'></div>");
		buf.push("<div class='nmdrTB_content' tabindex='1'>");
		buf.push(this.makeTable());
		buf.push("</div>");	
		return buf.join("");
	};
	
    $.makeTable = function () {
        var buf = [];
        buf.push("<table class='nmdrTB_table' border='0' cellpadding='0' cellspacing='0' onselectstart='return false' ondragstart='return false'>");
        buf.push(this.makeHeader());
        buf.push(this.makeBody());
        buf.push(this.makeFooter());
        buf.push("</table>");
        return buf.join("");
    };

    $.makeHeader = function () {
		
		if (!this.props.showHeader) return "";
		
        var ww = 0, buf = [];
		
        buf.push("<thead class='nmdrTB_header'>");
        buf.push("<tr class='nmdrTB_header_tr'>");
		
        for (var col = 0; col < this.columns.length; col++) {
			
			if (col == 0) {
				buf.push("<th class='nmdrTB_header_th nmdrTB_header_th_se'><img src='" + this.props.imagePath + "spCheck.png' ");
				buf.push("onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'selectAll');\"></th>");
				ww += this.props.selcolumnWidth;
			}
					
			if (col + 1 == this.props.menuColumn) {
				buf.push("<th class='nmdrTB_header_th nmdrTB_header_th_cm'><img src='" + this.props.imagePath + "spCMenu.gif'></th>");
				ww += this.props.menucolumnWidth;
			}                        

			var cw = this.getColumnWidth(col),
				s1 = this.props.sortingColumn == col ? "<img src='" + this.props.imagePath + "sp" + this.props.sortingDirection + ".png'" : "",
				s2 = this.props.filters[col] != null ? "<img src='" + this.props.imagePath + "spFilter.png'>" : "",
				ct = this.renderHeaderCell(col, this.columns[col]);

			buf.push("<th class='nmdrTB_header_th' id='" + this.id + "_nmdrTB_header_th" + col + "' ");
			buf.push(cw ? "style='width:" + cw + "px; min-width:" + cw + "px; max-width:" + cw + "px;'" : "");
			buf.push("onmouseOver=\"nmdr.core.$('" + this.id + "').selectHeader(" + col + ", true);\" ");
			buf.push("onmouseOut=\"nmdr.core.$('" + this.id + "').selectHeader(" + col + ", false);\" ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').selectColumn(event, " + col + ");\">");
			buf.push("<table width=100% border='0' cellpadding='0' cellspacing='0'><tr>");
			buf.push("<td style='padding:0px 0px 0px 0px;'><table border='0' cellpadding='0' cellspacing='0'><tr>");
			buf.push("<td style='padding:0px 0px 0px 0px;'><span class='nmdrTB_header_th_sp' onClick=\"nmdr.core.$('" + this.id + "').sortColumn(" + col + ");\">" + (ct ? ct : this.columns[col]) + "</span></td>");
			buf.push("<td style='width:20px; padding:0px 0px 0px 4px;'>" + s1 + "</td>");
			buf.push("<td style='width:16px; padding:0px 0px 0px 0px;'>" + s2 + "</td></tr></table></td>");
			buf.push("<td style='width:16px; padding:0px 4px 0px 0px; float:right;'>");
			buf.push("<img id='" + this.id + "_nmdrTB_hdm" + col + "' src='" + this.props.imagePath + "spMenu.png' ");
			buf.push("onclick=\"nmdr.core.$('" + this.id + "').openHeaderMenu(event, this);\" style='visibility:hidden'></td>");
			buf.push("</tr></table></th>");
			
			ww += (cw ? cw : 0);
		}

        buf.push("</tr></thead>");
		
		//if (this.props.scrollable) this.style.width = ww + "px";  
		
        return buf.join("");
    };

    $.makeBody = function () {
        var buf = [];

        buf.push("<tbody class='nmdrTB_body'>");
		
        if (this.dataRows.length > 0) {

            var first = this.props.clientHandling ? this.firstRow : 1,
            	last = this.props.clientHandling ? this.lastRow : this.props.rowLimit > this.totalNumber ? this.totalNumber : this.props.rowLimit;

            for (var row = first; row <= last; row++) {
				
                var cols = this.dataRows[row - 1].split(this.props.dataSplitter),
					se = this.selectedRows.indexOf(row) != -1;

                buf.push("<tr class='nmdrTB_body_tr" + (se ? "_sel" : "") + "' id='" + this.id + "_nmdrTB_body_tr" + row + "' ");
				buf.push("onClick=\"nmdr.core.$('" + this.id + "').selectRows(event, " + row + ");\">");
						
                for (var col = 0; col < cols.length; col++) {
				
					if (col == 0) {
						buf.push("<td class='nmdrTB_body_td nmdrTB_body_td_se'>");
						buf.push("<img class='nmdrTB_body_se' src='" + this.props.imagePath + "spCheckSel.png'></td>");
					}
					
					if (col + 1 == this.props.menuColumn) {
						buf.push("<td class='nmdrTB_body_td nmdrTB_body_td_cm'>");
						buf.push("<img class='nmdrTB_body_cm' src='" + this.props.imagePath + "spCMenu.gif' ");
						buf.push("onClick=\"nmdr.core.$('" + this.id + "').openRowMenu(event, " + row + ");\"></td>");
					}
					
					var 
					cw = this.getColumnWidth(col),
					bc = this.renderBodyCell(row - 1, col, cols[col], se),
					ac = this.props.showRowCommands && col == cols.length - 1 ?
					"<table width='100%' height='100%' border='0' cellpadding='0' cellspacing='0'><tr>" +
					"<td style='vertical-align: middle;'>" + (bc ? bc : cols[col]) + "</td><td style='text-alignment: right;'><a class='nmdrTB_rowcontrol'>" +
					"<img src='" + this.props.imagePath + "spOpen.gif' title='open row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'openRow', " + row + ");\">&nbsp;" +
					"<img src='" + this.props.imagePath + "spEdit.gif' title='edit row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'editRow', " + row + ");\">&nbsp;" +
					"<img src='" + this.props.imagePath + "spDelete.gif' title='delete row' onclick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'deleteRow', " + row + ");\">&nbsp;" +	
					"</a></td></tr></table>" : null;

					if (this.props.scrollable && cw && col == cols.length - 1) cw -= 18;  // <=== attention important
					
					buf.push("<td class='nmdrTB_body_td'");
					buf.push(cw ? " style='width:" + cw + "px; min-width:" + cw + "px; max-width:" + cw + "px;'>" : ">");
					buf.push(ac ? ac : bc ? bc : cols[col] + "</td>");
                }
                buf.push("</tr>");
            };
        }
        buf.push("</tbody>");
        return buf.join("");
    };

    $.makeFooter = function () {
				
		if (!this.props.showFooter) return "";

        var buf = [], cs = this.columns.length + (this.props.menuColumn == -1 ? 1 : 2);
        buf.push("<tfoot class='nmdrTB_footer'>");
        buf.push("<tr class='nmdrTB_footer_tr'>");
		buf.push("<td class='nmdrTB_footer_td' colspan=" + cs + ">");
		buf.push("<div class='nmdrTB_footer_div'>" + this.renderFooter() + "</div>");
        buf.push("</td></tr></tfoot>");
		return buf.join("");
    };

    $.renderFooter = function () {
        var buf = [];
        buf.push("<table width='100%' height='100%' border='0' cellpadding='4px' cellspacing='0'><tr>");

        if (this.props.footerShowPager) {
            if (this.dataRows.length > 0) {
                var s1 = this.firstRow > 1 ?
					"<img src='" + this.props.imagePath + "spPrevend.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'firstPage');\"" :
					"<img src='" + this.props.imagePath + "spPrevenddis.gif'";
                var s2 = this.firstRow > 1 ?
					"<img src='" + this.props.imagePath + "spPrev.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'prevPage');\"" :
					"<img src='" + this.props.imagePath + "spPrevdis.gif'";
                var s3 = this.lastRow < this.totalNumber ?
					"<img src='" + this.props.imagePath + "spNext.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'nextPage');\"" :
					"<img src='" + this.props.imagePath + "spNextdis.gif'";
                var s4 = this.lastRow < this.totalNumber ?
					"<img src='" + this.props.imagePath + "spNextend.gif' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'lastPage');\"" :
					"<img src='" + this.props.imagePath + "spNextenddis.gif'";

                buf.push("<td><table border='0' cellpadding='0' cellspacing='0'><tr>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s1 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s2 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + this.firstRow + "-" + this.lastRow + " / " + this.totalNumber + "</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s3 + "'</td>");
                buf.push("<td style='padding:0px 0px 0px 10px'>" + s4 + "'</td>");
                buf.push("</tr></table>");
				
                buf.push("<td>");
				buf.push("<table border='0' cellpadding='0' cellspacing='0' style='margin-right:4px;margin-left:auto;'><tr><td></td>");

                if (this.props.footerShowPageInfo) {
                    buf.push("<td style='padding:2px 0px 0px 0px;'><span>" + this.props.pageLable + " <b>" +
						this.pageNumber + "</b> " + this.props.ofLable + " <b>" + this.pageCount + "</b> / " +
						this.props.totalLable + " <b>" + this.totalNumber + "</b></span></td>");
                }

                if (this.props.footerShowGoPage) {
                    buf.push("<td style='padding:2px 0px 0px 10px;'>" + this.props.gotoPageLable);
                    buf.push(" <select id='" + this.id + "_nmdrTB_goPageSelect' onchange=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'goToPage');\">");
                    buf.push("<option value=''></option>");
                    for (var i = 1; i <= this.pageCount; i++) buf.push("<option value='" + i + "'>" + i + "</option>");
                    buf.push("</select></td>");
                }

                if (this.props.footerShowRowCount) {
					buf.push("<td style='padding:2px 0px 0px 10px;'>" + this.props.rowCountLable);
                    buf.push(" <select id='" + this.id + "_nmdrTB_rowLimitSelect' onchange=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'setRowLimit');\">");
                    buf.push("<option value='10' " + (this.props.rowLimit === 10 ? "Selected" : "") + ">10</option>");
                    buf.push("<option value='25' " + (this.props.rowLimit === 25 ? "Selected" : "") + ">25</option>");
                    buf.push("<option value='50' " + (this.props.rowLimit === 50 ? "Selected" : "") + ">50</option>");
                    buf.push("<option value='100' " + (this.props.rowLimit === 100 ? "Selected" : "") + ">100</option>");
                    buf.push("<option value='150' " + (this.props.rowLimit === 150 ? "Selected" : "") + ">150</option>");
                    buf.push("<option value='200' " + (this.props.rowLimit === 200 ? "Selected" : "") + ">200</option>");
                    buf.push("</select></td>");
                }

                buf.push("</tr></table></td>");
            }
            else {
                buf.push("<td>This view contains no data.</td>");
            }
        }
        buf.push("</tr></table>");
        return buf.join("");
    };

    $.configSize = function () {
		var tb = this.getElementsByClassName("nmdrTB_table")[0];
		if (this.props.scrollable) this.style.width = (tb.offsetWidth + 2) + "px";
		else tb.style.width = "100%";
	};

    $.updateTable = function () {
		this.getElementsByClassName("nmdrTB_content")[0].innerHTML = this.makeTable();
		this.configSize();
    };

    $.loadData = function (calculate, firstCall) {

		var self = this;
		
        this.showLoader(true);
		        
        window.setTimeout(function () {

            var data = self.prepareData();
			
            self.columns = data.columns.slice(0);
			
			if (self.props.menuColumn !== -1) {
				self.props.menuColumn = Math.max(self.props.menuColumn, 1);
				self.props.menuColumn = Math.min(self.props.menuColumn, self.columns.length);
			}

            self.menuCommands = self.props.menuColumn !== -1 ? self.prepareMenuCommands() : [];
			self.props.rowLimit = Math.min(self.props.rowLimit, data.rows.length);

            if (self.props.clientHandling) {
                reference = self;
                self.originRows = data.rows.slice(0);
                self.dataRows = self.filterList();
                self.dataRows.sort(self.sortComparator);
            }
            else {
                self.dataRows = data.rows.slice(0);
            }

            if (calculate) {
                self.pageNumber = 1;
                self.totalNumber = self.dataRows.length;
                self.firstRow = 1;
                self.lastRow = self.props.rowLimit > self.totalNumber ? self.totalNumber : self.props.rowLimit;
                self.pageCount = Math.ceil(self.totalNumber / self.props.rowLimit);
            }

            if (firstCall) self.makeView(); else self.updateTable();

            self.showLoader(false);
        }, 10);
    };

    $.selectRows = function (event, row, all) {
		
		if (all && !this.props.multiSelection) return;
	
		this.deselect();
		
		if (all) {
			var sc = this.selectedRows.length;
			this.clickedRow = -1;
			this.selectedRows = [];
			if (sc != this.props.rowLimit) {
				for (var i = this.firstRow; i <= this.lastRow; i++) {
					this.selectedRows.push(i);
				}
			}
		}
		else {
			
			var ind = this.selectedRows.indexOf(row);

			if (this.props.multiSelection) {
				if (event && event.ctrlKey) {
					if (ind == -1) this.selectedRows.push(row);
					else { this.selectedRows.splice(ind, 1); row = -1; }
				}
				else if (event && event.shiftKey) {
					if (row < this.selectedRows[0]) {
						for (var i = row; i < this.selectedRows[0]; i++) this.selectedRows.push(i);
					}
					else if (row > this.selectedRows[this.selectedRows.length - 1]) {
						var n = this.selectedRows[this.selectedRows.length - 1];
						for (var i = row; i > n; i--) this.selectedRows.push(i);
					}
				}
				else if (ind == -1 || this.selectedRows.length > 1) {
					this.selectedRows = [];
					this.selectedRows[0] = row;
				}
				else {
					this.selectedRows = []; 
					row = -1;
				}

				this.selectedRows.sort(function (a, b) { return (a - b); });
			}
			else if (ind == -1) {
				this.selectedRows[0] = row;
			}
			else { 
				this.selectedRows = []; 
				row = -1; 
			}

			this.clickedRow = row;
		}
		
		this.select();
        this.selectionChanged();
    };

	$.select = function () {
		var self = this;
		this.selectedRows.forEach(function(item, index) {
		
			var 
			tr = document.getElementById(self.id + "_nmdrTB_body_tr" + item),
			ts = tr.getElementsByClassName("nmdrTB_body_td_se")[0],
			se = tr.getElementsByClassName("nmdrTB_body_se")[0],
			tm = tr.getElementsByClassName("nmdrTB_body_td_cm")[0],
			cm = tr.getElementsByClassName("nmdrTB_body_cm")[0];

			tr.classList.remove("nmdrTB_body_tr");
			tr.classList.add("nmdrTB_body_tr_sel");
			ts.classList.add("nmdrTB_body_td_se_sel");
			se.classList.add("nmdrTB_body_se_sel");
			if (tm) {
				tm.classList.add("nmdrTB_body_td_cm_sel");
				cm.classList.add("nmdrTB_body_cm_sel");
			}
		});
	};
		
	$.deselect = function () {
		var self = this;
		this.selectedRows.forEach(function(item, index) {
	
			var 
			tr = document.getElementById(self.id + "_nmdrTB_body_tr" + item),
			ts = tr.getElementsByClassName("nmdrTB_body_td_se")[0],
			se = tr.getElementsByClassName("nmdrTB_body_se")[0],
			tm = tr.getElementsByClassName("nmdrTB_body_td_cm")[0],
			cm = tr.getElementsByClassName("nmdrTB_body_cm")[0];

			tr.classList.remove("nmdrTB_body_tr_sel");
			tr.classList.add("nmdrTB_body_tr");
			ts.classList.remove("nmdrTB_body_td_se_sel");
			se.classList.remove("nmdrTB_body_se_sel");
			if (tm) {
				tm.classList.remove("nmdrTB_body_td_cm_sel");
				cm.classList.remove("nmdrTB_body_cm_sel");
			}
		});
	};
	
    $.clearSelection = function () {
        this.clickedRow = -1;
        this.selectedRows = [];
        this.selectionChanged();
    };

    $.selectionChanged = function () {
        var ids = this.getSelection();
        this.handleEvents(ids);
        this.handlePostBack(ids);
    };

    $.getSelection = function () {
        var ids = [];
        for (var i = 0; i < this.selectedRows.length; i++) {
            var rows = this.dataRows[this.selectedRows[i] - 1].split(this.props.dataSplitter);
            ids.push(rows[0]);
        }
        return ids;
    };
	
	$.selectColumn = function (event, col) {
		// @todo
	};
	
    $.nextPage = function () {
        this.clearSelection();
        this.pageNumber++;
        this.firstRow += this.props.rowLimit;
        this.lastRow += this.props.rowLimit;
        if (this.firstRow > this.totalNumber) this.firstRow = this.lastRow + 1;
        if (this.lastRow > this.totalNumber) this.lastRow = this.totalNumber;

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.prevPage = function () {
        this.pageNumber--;
        this.firstRow -= this.props.rowLimit;
        this.lastRow -= this.props.rowLimit;
        if (this.firstRow < 1) this.firstRow = 1;
        if (this.lastRow < this.firstRow + this.props.rowLimit) this.lastRow = this.firstRow + this.props.rowLimit - 1;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.firstPage = function () {
        this.pageNumber = 1;
        this.firstRow = 1;
        this.lastRow = this.props.rowLimit;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.lastPage = function () {
        var rest = this.totalNumber - ((this.pageCount - 1) * this.props.rowLimit);

        this.pageNumber = this.pageCount;
        this.firstRow = this.totalNumber - rest;
        this.lastRow = this.totalNumber;
        this.clearSelection();

        if (this.props.clientHandling) this.updateTable(); else this.loadData(false, false);
    };

    $.sortColumn = function (column) {
		if (this.props.sortingColumn != column) this.props.sortingDirection = null;
		
        this.props.sortingColumn = column;
        this.props.sortingDirection = this.props.sortingDirection == null ? this.SORT_DESCENDING : 
		this.props.sortingDirection == this.SORT_DESCENDING ? this.SORT_ASCENDING : this.SORT_DESCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.sortAZ = function () {
        this.props.sortingColumn = this.selectedColumn;
        this.props.sortingDirection = this.SORT_DESCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.sortZA = function () {
        this.props.sortingColumn = this.selectedColumn;
        this.props.sortingDirection = this.SORT_ASCENDING;
        this.clearSelection();
        this.doSort();
    };

    $.removeSorting = function () {
        this.props.sortingColumn = -1;
        this.props.sortingDirection = null;
        this.clearSelection();
        this.doSort();
    };

    $.doSort = function () {
        if (!this.props.clientHandling) return this.loadData(false, false);
		
        this.showLoader(true);
		
        var self = this;
        window.setTimeout(function () { // just due showing loader
            if (self.props.sortingColumn === -1) {
                self.dataRows = self.originRows.slice(0);
				self.doFilter();
			} else {
                reference = self;
                self.dataRows.sort(self.sortComparator);
            }
            self.showLoader(false);
            self.updateTable();

        }, 10);
    };

    $.sortComparator = function (a, b) {
        var self = reference;

        if (a == null && b == null) return 0;
        if (a != null && b == null) return self.props.sortingDirection == self.SORT_DESCENDING ? 1 : -1;
        if (a == null && b != null) return self.props.sortingDirection == self.SORT_DESCENDING ? -1 : 1;

        var aa = a.split(self.props.dataSplitter),
			bb = b.split(self.props.dataSplitter),
			s1 = aa[self.props.sortingColumn],
			s2 = bb[self.props.sortingColumn];
			
        return s1 == s2 ? 0 : s1 > s2 ? 
			(self.props.sortingDirection == self.SORT_DESCENDING ? 1 : -1) : 
			(self.props.sortingDirection == self.SORT_DESCENDING ? -1 : 1);
    };

    $.setFilter = function () {
		var sp = this.props.filterSplitter,
			filterCondition = document.getElementById(this.id + "_nmdrTB_filterSelect").value,
			filterValue = document.getElementById(this.id + "_nmdrTB_filterText").value,
			filter = filterValue.length > 0 ? filterCondition + sp + filterValue : "",
			filterdata = this.getFilterData();
			
		if (filterdata.length > 0) {
			filter += filter.length > 0 ? filter + sp + filterdata : sp + sp + filterdata;
		}
		if (filter.length > 0) {
            this.props.filters[this.selectedColumn] = filter;
            this.clearSelection();
            this.doFilter();
        } 
		else removeFilter(); 
    };

    $.removeFilter = function () {
        delete this.props.filters[this.selectedColumn];
        this.clearSelection();
        this.doFilter();
    };

    $.doFilter = function () {
        if (!this.props.clientHandling) return this.loadData(true, false);

        this.showLoader(true);

        var self = this;
        window.setTimeout(function () { // just due showing loader
            self.dataRows = self.filterList();
            self.pageNumber = 1;
            self.totalNumber = self.dataRows.length;
            self.firstRow = self.dataRows.length > 0 ? 1 : 0;
            self.lastRow = self.props.rowLimit < self.totalNumber ? self.props.rowLimit : self.totalNumber;
            self.pageCount = Math.ceil(self.totalNumber / self.props.rowLimit);
            self.showLoader(false);
            self.updateTable();
        }, 10);
    };

    $.filterList = function () {
        var data = this.originRows.slice(0);
        if (Object.keys(this.props.filters).length > 0) {
            var cols = data[0].split(this.props.dataSplitter);
            for (var col=0; col < cols.length; col++) {
				data = this.doFilterList(data, col);
            }
        }
		
		if (this.props.sortingColumn !== -1) {
            reference = this;
            data.sort(this.sortComparator);
		}
        return data;
    };

    $.doFilterList = function (rows, col) {
        var data = [];
        for (var i in rows) {
            var row = rows[i], cols = row.split(this.props.dataSplitter), match = true;
            if (this.props.filters[col]) {
                var value = cols[col], filter = this.props.filters[col].split(this.props.filterSplitter);
				if (filter[2] && filter[2].length > 0) {
					match = false;
					var fdata = filter[2].split(this.props.filterDataSplitter);
					for (var d in fdata) {
						if (value == fdata[d]) { match = true; break; }
					}
				}
                switch (filter[0]) {
                    case "isequal": match &= value === filter[1]; break;
                    case "isnotequal": match &= value !== filter[1]; break;
                    case "contains": match &= value.indexOf(filter[1]) !== -1; break;
					case "notcontains": match &= value.indexOf(filter[1]) == -1; break;
                    case "startswith": match &= value.indexOf(filter[1]) == 0; break;
                    case "endswith": match &= value.indexOf(filter[1], value.length - filter[1].length) !== -1; break;
                }
            }
            if (match) data.push(row);
        }
        return data;
    };

    $.setRowLimit = function () {
        var limit = document.getElementById(this.id + "_nmdrTB_rowLimitSelect").value;
        this.props.rowLimit = parseInt(limit);
        if (this.props.clientHandling) {
            this.pageNumber = 1;
            this.firstRow = this.dataRows.length > 0 ? 1 : 0;
            this.lastRow = this.props.rowLimit < this.totalNumber ? this.props.rowLimit : this.totalNumber;
            this.pageCount = Math.ceil(this.totalNumber / this.props.rowLimit);

            this.clearSelection();
            this.updateTable();
        }
        else this.loadData(true, false);
    };

    $.goToPage = function () {
        var page = document.getElementById(this.id + "_nmdrTB_goPageSelect").value;
        if (page.length) {
            this.pageNumber = parseInt(page);
            if (this.props.clientHandling) {
                this.firstRow = (this.pageNumber - 1) * this.props.rowLimit + 1;
                this.lastRow = this.firstRow + this.props.rowLimit - 1;
                if (this.lastRow > this.totalNumber) this.lastRow = this.totalNumber;

                this.clearSelection();
                this.updateTable();
            }
            else this.loadData(false, false);
        }
    };

    $.openHeaderMenu = function (event, src) {

        var self = this,
			id = src.id.substring(src.id.indexOf("_hdm") + 4),
			h = document.getElementById(this.id + "_nmdrTB_header_th" + id),
			m = this.getElementsByClassName('nmdrTB_headerMenu')[0],
			t = this.absPosition, 
			o = h.absPosition;
			
		nmdr.core.utils.stopPropagation(event);

        if (o.left + m.offsetWidth > t.left + this.offsetWidth)
            o.left = t.left + this.offsetWidth - m.offsetWidth;

        m.style.display = "inline-block";
        m.style.position = "absolute";
        m.style.left = o.left - t.left + "px";
        m.style.top = o.top - t.top + (this.props.headerHeight + 8) + "px";
			
        nmdr.core.popup.open(m, src,
			function() { nmdr.core.animate.fadeIn(null, m, null, true, function () { self.headerMenuOpen = true; }); },
			function (cb) { self.closeHeaderMenu(null, self, cb); }
		);
		
		//self.headerMenuOpen = true;  // @todo
		
        document.getElementById(this.id + "_nmdrTB_filterColumnName").text = this.columns[id];
        this.selectedColumnOld = this.selectedColumn;
        this.selectedColumn = parseInt(id);

        document.getElementById(this.id + "_nmdrTB_filterSelect").innerHTML = this.prepareFilterPattern(false);
        document.getElementById(this.id + "_nmdrTB_filterText").value = this.prepareFilterPattern(true);

		if (this.props.showFilterData) {
			document.getElementById(this.id + "_nmdrTB_filterData").innerHTML = this.prepareFilterData();
		}

        if (this.selectedColumnOld != -1) document.getElementById(this.id + "_nmdrTB_header_th" + this.selectedColumnOld).style.opacity = 1.0;
    };

    $.closeHeaderMenu = function (code, self, callback) {
        if (self == null) self = this;
        var m = self.getElementsByClassName("nmdrTB_headerMenu")[0];
        nmdr.core.animate.fadeOut(null, m, null, true, function () {
            m.style.display = "none";
            document.getElementById(self.id + "_nmdrTB_header_th" + self.selectedColumn).style.opacity = 1.0;

            self.headerMenuOpen = false;
            self.handleCommand(null, code);
            self.selectedColumn = -1;
			self.selectedColumnOld = -1;
			if (callback) callback();
        });
        nmdr.core.popup.close();
    };

    $.openRowMenu = function (event, row) {

        var self = this,
            s = document.getElementById(this.id + "_nmdrTB_body_tr" + row).getElementsByClassName("nmdrTB_body_cm")[0],
			m = this.getElementsByClassName("nmdrTB_rowMenu")[0],
			t = this.absPosition, 
			o = s.absPosition;

        if (o.left + m.offsetWidth > t.left + this.offsetWidth) o.left = this.offsetWidth - m.offsetWidth;

        m.style.display = "inline-block";
        m.style.position = "absolute";
        m.style.left = o.left - t.left + "px";
        m.style.top = o.top - t.top + 14 + "px";

        nmdr.core.popup.open(m, s, 
			function() { nmdr.core.animate.fadeIn(null, m, null, true, function () { self.rowMenuOpen = true; }); }, 
			function (cb) { self.closeRowMenu("clear", null, self, cb); }
		);
		
		if (this.clickedRow == row || (this.selectedRows.length > 1 && this.selectedRows.indexOf(row) != -1)) 
			nmdr.utils.stopPropagation(event);
    };

    $.closeRowMenu = function (code, cmd, self, callback) {
        if (self == null) self = this;
        var m = self.getElementsByClassName("nmdrTB_rowMenu")[0];
        nmdr.core.animate.fadeOut(null, m, null, true, 
			function () { 
				m.style.display = "none";
                self.updateRowMenuRow(false);
				self.rowMenuOpen = false;
                self.rowMenuActRow = -1;
				self.handleCommand(null, code);
				if (cmd) cmd();
				if (callback) callback();
			}
		);
        nmdr.core.popup.close();
    };
    
    $.updateRowMenuRow = function (sel) {
        if (this.rowMenuActRow != -1) {
            var tr = document.getElementById(this.id + "_nmdrTB_rowMenu_tr_" + this.rowMenuActRow);
            if (sel) tr.classList.add("rowMenuActRow"); else tr.classList.remove("rowMenuActRow");
        }
    };
    
    $.onRowMenuMouseOver = function(ev) {
        this.updateRowMenuRow(false);
        this.rowMenuActRow != -1        
    };

    $.selectHeader = function (hi, show) {
        var m = document.getElementById(this.id + "_nmdrTB_header_th" + hi);
		if (m == null) {
			var kk=0;
		}
        var n = document.getElementById(this.id + "_nmdrTB_hdm" + hi);
        m.style.opacity = hi == this.selectedColumn ? 0.5 : 1.0;
        if (n) n.style.visibility = show ? "visible" : "hidden";
    };

    $.initKeyEvents = function () {
        var self = this;
        document.addEventListener("keydown", function(ev) { 
		
			if (!nmdr.core.utils.isActiveElement(self)) return;
			
            // down arrow
            if (ev.keyCode == 40) {
                if (self.rowMenuOpen) {
                    if (self.rowMenuActRow != -1) {
                        self.updateRowMenuRow(false);
                        if (self.rowMenuActRow == 3) self.rowMenuActRow = 0; else self.rowMenuActRow++;
                    } else self.rowMenuActRow = 0;                    
                    self.updateRowMenuRow(true);
                }
                else {
                    var row = self.selectedRows.length == 0 ? 0 : self.selectedRows[0];
					
					if (self.props.scrollable) {
						var el = self.getElementsByClassName("nmdrTB_body")[0];
						if (row < self.lastRow) {
							el.scrollTop += (self.props.bodyRowHeight + 7);
							self.selectRows(null, row + 1);
						}
					}
					else {
						self.selectRows(null, row == self.lastRow ? self.firstRow : row + 1);
					}
                }
				
                nmdr.core.utils.stopPropagation(ev);
            }
            // up arrow
            else if (ev.keyCode == 38) {
                if (self.rowMenuOpen) {
                    if (self.rowMenuActRow != -1) {
                        self.updateRowMenuRow(false);
                        if (self.rowMenuActRow == 0) self.rowMenuActRow = 3; else self.rowMenuActRow--;
                    } else self.rowMenuActRow = 0;
                    self.updateRowMenuRow(true);
                }
                else {
                    var row = self.selectedRows.length == 0 ? 0 : self.selectedRows[0];    
					if (self.props.scrollable) {
						var el = self.getElementsByClassName("nmdrTB_body")[0];
						if (row > self.firstRow) {
							el.scrollTop -= (self.props.bodyRowHeight + 7);
							self.selectRows(null, row - 1);
						}
					}
					else {
						self.selectRows(null, row == self.firstRow ? self.lastRow : row - 1);
					}
                }
				
                nmdr.core.utils.stopPropagation(ev);
            }
			// pic up arrow
            else if (ev.keyCode == 33) {
				nmdr.core.utils.stopPropagation(ev);
			}
			// pic down arrow
            else if (ev.keyCode == 34) {
				nmdr.core.utils.stopPropagation(ev);
			}			
            // enter key
            else if (ev.keyCode == 13) {
                if (self.rowMenuOpen) {
                    self.executeMenuCommand(self.rowMenuActRow);
                }
                else {
                    if (self.props.menuColumn != -1) self.openRowMenu(ev, self.selectedRows[0]);
                }
                nmdr.core.utils.stopPropagation(ev);
            }
        });
    };

    $.showLoader = function (show) {
        var loader = this.getElementsByClassName("nmdrTB_loader")[0];
        if (loader) {
            loader.style.display = show ? "inline" : "none";
            loader.style.cursor = show ? "wait" : "default";
        }
    };

    $.handleCommand = function (event, name, row, leavOpen) {

        if (this.headerMenuOpen && !leavOpen) { this.closeHeaderMenu(name); return; }
        if (this.rowMenuOpen && !leavOpen) { this.closeRowMenu(name); return; }

		if (event) nmdr.core.utils.stopPropagation(event);
		if (row) this.selectRows(event, row);

        switch (name) {
            case "selectAll": this.selectRows(null, null, true); break;
            case "nextPage": this.nextPage(); break;
            case "prevPage": this.prevPage(); break;
            case "firstPage": this.firstPage(); break;
            case "lastPage": this.lastPage(); break;
            case "sortAZ": this.sortAZ(); break;
            case "sortZA": this.sortZA(); break;
            case "removeSorting": this.removeSorting(); break;
            case "setFilter": this.setFilter(); break;
            case "removeFilter": this.removeFilter(); break;
			case "checkAllFilter": this.checkAllFilterCheckBox(); break;
			case "uncheckAllFilter": this.uncheckAllFilterCheckBox(); break;
            case "setRowLimit": this.setRowLimit(); break;
            case "goToPage": this.goToPage(); break;
            case "openRow": this.openRow(row); break;
            case "editRow": this.editRow(row); break;
            case "deleteRow": this.deleteRow(row); break;
            case "clear": break;
        }
    };

    $.executeMenuCommand = function (num) {
        this.closeRowMenu("clear", this.menuCommands[num].action);
    }

    $.handlePostBack = function (sels) {
        if (this.props.doPostBack) {
        }
    };

    $.makeRowMenu = function () {

        if (this.props.menuColumn === -1) return "";

        var buf = [];
        buf.push("<div class='nmdrTB_rowMenu' id='" + this.id + "_nmdrTB_rowMenu'>");
        buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%'>");

        for (var i = 0; i < this.menuCommands.length; i++) {
            var com = this.menuCommands[i];
            buf.push("<tr class='nmdrTB_rowMenu_tr' id='" + this.id + "_nmdrTB_rowMenu_tr_" + i + "' ");
            buf.push("onclick=\"nmdr.core.$('" + this.id + "').executeMenuCommand(" + i + ");\" ");
            buf.push("onmouseover=\"nmdr.core.$('" + this.id + "').onRowMenuMouseOver(event);\">");
            buf.push("<td style='width:24px'><img src='" + this.props.imagePath + com.icon + "'></td>");
            buf.push("<td><span>" + com.name + "</span></td>");
            buf.push("</tr>");
        }
        buf.push("</table></div>");
        return buf.join("");
    };

    $.makeHeaderMenu = function () {
        var buf = [];
        buf.push("<div class='nmdrTB_headerMenu'>");
        buf.push("<table cellpadding='0' cellspacing='0' border='0' width='100%' height='100%' style='table-layout:fixed'>");
        
		// Sorting
		buf.push("<tr>");
        buf.push("<td>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spDoSortAZ.gif' style='border-style:none;'/></a>&nbsp;");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'sortAZ');\" style='text-decoration:none;'>A-Z</a>");
        buf.push("</td>");
        buf.push("<td>");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event);\">");
        buf.push("<img src='" + this.props.imagePath + "spClosePopup.gif' style='border-style:none; vertical-align:middle;float:right;'/></a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spDoSortZA.gif' style='border-style:none;'/></a>&nbsp;");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'sortZA');\" style='text-decoration:none;'>Z-A</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spSortdel.gif' style='border-style:none;'/></a>&nbsp;");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'removeSorting');\" style='text-decoration:none;'>" + this.props.removeSortingLable + "</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr style='height:5px'><td colspan='2'></td></tr>");
        buf.push("<tr><td colspan='2' style='border-bottom:dotted; border-bottom-width:1px;'></td></tr>");
        buf.push("<tr style='height:5px'><td colspan='2'></td></tr>");
		
		// Filtering
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spFilter.png' style='border-style:none;'/></a>&nbsp;");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'setFilter');\" style='text-decoration:none;'>" + this.props.setFilterLable + "&nbsp;&nbsp;</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<a href='#'><img src='" + this.props.imagePath + "spFilterdel.gif' style='border-style:none;'/></a>&nbsp;");
        buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'removeFilter');\" style='text-decoration:none;'>" + this.props.removeFilterLable + "&nbsp;&nbsp;</a>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("<tr>");
        buf.push("<td colspan='2'>");
        buf.push("<table border='0' width='100%' style='table-layout:fixed'>");
        buf.push("<tr>");
        buf.push("<td style='width:60px'>");
        buf.push("<span id='" + this.id + "_nmdrTB_filterColumnName'>Column</span>");
        buf.push("</td>");
        buf.push("<td style='text-align:right'>");
        buf.push("<select id='" + this.id + "_nmdrTB_filterSelect'>" + this.prepareFilterPattern(false) + "</select>&nbsp;");
		buf.push("<input id='" + this.id + "_nmdrTB_filterText' type='text' name='columnfilter' size='10' value='" + this.prepareFilterPattern(true) + "'/>");
		if (!this.props.showFilterData) {
			buf.push("&nbsp;");
			buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'setFilter');\">");
			buf.push("<img src='" + this.props.imagePath + "spFilterset.gif' style='border-style:none; vertical-align:middle;'/>");
			buf.push("</a>");
			buf.push("</td>");
			buf.push("</tr>");
		}
		else {
			buf.push("</td>");
			buf.push("</tr>");
			buf.push("<style>.nmdrTBFcheckbox:hover {cursor:pointer; background:#0073C6; color:#FFFFFF;}</style>");
			buf.push("<tr><td>Selection</td>");
			buf.push("<td style='text-align:right'>");
			buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'uncheckAllFilter', null, true);\">");
			buf.push("<img src='" + this.props.imagePath + "spUncheckAll.gif' style='border-style:none; vertical-align:middle;'/>");
			buf.push("</a>&nbsp;");
			buf.push("<a href='' onClick=\"nmdr.core.$('" + this.id + "').handleCommand(event, 'checkAllFilter', null, true);\">");
			buf.push("<img src='" + this.props.imagePath + "spCheckAll.gif' style='border-style:none; vertical-align:middle;'/>");
			buf.push("</a>");
			buf.push("</td>");
			buf.push("</tr>");
			buf.push("<tr>");
			buf.push("<td colspan='2'>");
			buf.push("<div id='" + this.id + "_nmdrTB_filterData' style='display:block;width:100%;height:108px;background:#fff;border:1px solid #ccc;overflow-x:hidden;overflow-y:auto;'>");
			buf.push(this.prepareFilterData());
			buf.push("</div>");
			buf.push("</td>");
			buf.push("</tr>");
		}
        buf.push("</table>");
        buf.push("</td>");
        buf.push("</tr>");
        buf.push("</table>");
        buf.push("</div>");

        return buf.join("");
    };

    $.prepareMenuCommands = function () {
		return [
            { name: "open item", icon: "details.gif", action: function () { alert("open item"); } },
            { name: "edit item", icon: "editdetails.gif", action: function () { alert("edit item"); } },
            { name: "delete item", icon: "delete.gif", action: function () { alert("delete item"); } },
            { name: "rename item", icon: "edititem.gif", action: function () { alert("rename item"); } },
        ];
	};
	
    $.prepareFilterPattern = function (onlyValue) {
		var fts = this.props.filters[this.selectedColumn] ? this.props.filters[this.selectedColumn].split(this.props.filterSplitter) : null;
		
        if (onlyValue) {
            return fts ? fts[1] : "";
        }

        var opt = "", fc = fts ? fts[0] : "";
        for (var i in this.props.patternNames) {
            var p = this.props.patternNames[i].split("/");
            switch (p[0]) {
                case "is equal": opt += "<option value='isequal' " + (fc == "isequal" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "is not equal": opt += "<option value='isnotequal' " + (fc == "isnotequal" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "contains": opt += "<option value='contains' " + (fc == "contains" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "not contains": opt += "<option value='notcontains' " + (fc == "notcontains" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "starts with": opt += "<option value='startswith' " + (fc == "startswith" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
                case "ends with": opt += "<option value='endswith' " + (fc == "endswith" ? "selected" : "") + ">" + (p[1] == "x" ? p[0] : p[1]) + "</option>"; break;
            }
        }
        return opt;
    };

    $.prepareFilterData = function () {
		if (this.selectedColumn == -1) return "";
		
		var colData = [], fts = [], buf = [];
		
		for (var i in this.originRows) {
			var row = this.originRows[i], cols = row.split(this.props.dataSplitter);
			colData.push(cols[this.selectedColumn]);
		}

		if (this.props.filters[this.selectedColumn]) {
			fts = this.props.filters[this.selectedColumn].split(this.props.filterSplitter);
			fts = fts.length > 2 ? fts[2].split(this.props.filterDataSplitter) : null;
		}
		
        buf.push("<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0'>");

        for (var i = 0; i < colData.length; i++) {
            var cb = false;
			if (fts && fts.length > 0) {
				for (var f in fts) {
					if (fts[f] == colData[i]) {
						cb = true;
						break;
					}
				}
			}
            var id = this.id + "_nmdrTB_FCBox" + i;
            var im = this.props.imagePath + (cb ? "/checkboxon.png" : "/checkboxoff.png");

            buf.push("<tr style='line-height:18px;'><td class='nmdrTBFcheckbox' id='" + id + "' " +
                "onclick=\"nmdr.core.$('" + this.id + "').toggleFilterCheckBox(" + i + ");\">" +
			    "<table cellpadding='2' cellspacing='0' border='0'><tr>" +
				    "<td style='vertical-align:middle;'><img class='nmdrTBCB' id='" + id + "_img' " +
					"name='" + colData[i] + "' checked='" + cb + "' src='" + im + "'></td>" +
				    "<td style='vertical-align:middle;'><span>" + colData[i] + "</span></td>" +
			    "</tr></table></td></tr>");
        }

        buf.push("</table>");
		return buf.join("");
	};

    $.toggleFilterCheckBox = function (nr) {
        var img = document.getElementById(this.id + "_nmdrTB_FCBox" + nr + "_img");
		var chk = img.getAttribute("checked");
		var ch = chk == "true" ? false : true;
		var im = this.props.imagePath + (ch ? "/checkboxon.png" : "/checkboxoff.png");
		img.setAttribute("checked", ch);
        img.src = im;
    };

    $.checkAllFilterCheckBox = function () {
		var elem = document.getElementById(this.id + "_nmdrTB_filterData");
		var cboxes = elem.getElementsByClassName("nmdrTBCB");
        for (var i=0; i < cboxes.length; i++) {
			cboxes[i].src = this.props.imagePath + "/checkboxon.png";
			cboxes[i].setAttribute("checked", "true");
		}
    };

    $.uncheckAllFilterCheckBox = function () {
		var elem = document.getElementById(this.id + "_nmdrTB_filterData");
		var cboxes = elem.getElementsByClassName("nmdrTBCB");
        for (var i=0; i < cboxes.length; i++) {
			cboxes[i].src = this.props.imagePath + "/checkboxoff.png";
			cboxes[i].setAttribute("checked", "false");
		}
    };

    $.getFilterData = function () {
		if (!this.props.showFilterData) return "";
		
		var elem = document.getElementById(this.id + "_nmdrTB_filterData");
		var cboxes = elem.getElementsByClassName("nmdrTBCB");
        var checkeds = "";
        for (var i=0; i < cboxes.length; i++) {
			var chk = cboxes[i].getAttribute("checked");
			if (chk == "true") {
				checkeds += (checkeds == "" ? "" : this.props.filterDataSplitter) + cboxes[i].getAttribute("name");
			}
        }
        return checkeds;
    };

    $.prepareData = function () {
		var columns = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            s = this.props.dataSplitter, 
			cols = [], 
			rows = [];
			
        for (var r = 0; r < this.props.dummyRows; r++) {
			var ro = "";
			for (var c = 0; c < this.props.dummyCols; c++) {
				if (c < columns.length) {
					if (r == 0) cols.push(columns[c]);
					ro += (columns[c] + r);
					if (c < this.props.dummyCols-1) ro += s;
				}
			}
			rows.push(ro);
        }

		return { columns: cols, rows: rows };
    };

	/*
    $.prepareData = function () {
		var rowdata = [], s = this.props.dataSplitter;
		for (var i = 0; i < 10000; i++) {
			rowdata[i] = "Name " + i + s + "Adress " + i + s + "Email " + i + s + "Phone " + i;
		}

		var data =
		{
			columns: ["Name", "Adress", "Email", "Phone"],
			rows: rowdata
		};
		return data;
    };
	*/
    return $;
}
