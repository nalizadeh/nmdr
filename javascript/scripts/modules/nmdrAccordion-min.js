function nmdrAccordion(o){var t=nmdr.core.$(o,"nmdrAccordion");if(null!=t)return t.foreColor="#fff",t.foreColorSelected="#fff",t.backgroundColor="#55718A",t.backgroundOpened="#3E5265",t.backgroundHover="#607E9B",t.border="border:1px solid #004B84;",t.font="font:12px Verdana,Arial;",t.imagePath="",t.withShadow=!0,t.roundCorners=!0,t.tm=10,t.sp=10,t.accordions=[],t.start=function(o,t,e,r){this.imagePath=r;var i,a,n=this.withShadow?"-moz-box-shadow: 4px 4px 4px #BBB;-webkit-box-shadow: 4px 4px 4px #BBB;box-shadow: 4px 4px 4px #BBB;":"",s=this.roundCorners?"border-radius: 8px 8px 0 0; -moz-border-radius: 8px 8px 0 0; -webkit-border-radius: 8px 8px 0 0; -khtml-border-radius: 8px 8px 0 0;":"",d=this.roundCorners?"border-radius: 0 0 8px 8px; -moz-border-radius: 0 0 8px 8px; -webkit-border-radius: 0 0 8px 8px; -khtml-border-radius: 0 0 8px 8px;":"",c="#"+this.id+" dt {width:"+(o-20)+"px; margin-top:5px; padding:8px; cursor:pointer; "+this.border+" ;"+this.font+"; font-weight:bold; background-color:"+this.backgroundColor+"; color:"+this.foreColor+"; background-image:url("+this.imagePath+"accoArrowDown.gif); background-position:right center; background-repeat:no-repeat;"+n+s+"}#"+this.id+" .open {background-color:"+this.backgroundOpened+"; color:"+this.foreColorSelected+";background-image:url("+this.imagePath+"accoArrowUp.gif);}#"+this.id+" dt:hover {background-color:"+this.backgroundHover+"; color:"+this.foreColorSelected+";}#"+this.id+" dd {overflow:hidden; background:#fff;margin:0;padding:0; "+n+d+"}#"+this.id+" .accordionSpan {display:block; width:"+(o-24)+"px; "+this.border+"; border-top:none; padding:10px; "+d+"}",h=document.createElement("style");h.type="text/css",h.styleSheet?h.styleSheet.cssText=c:h.appendChild(document.createTextNode(c)),document.getElementsByTagName("head")[0].appendChild(h),i=this.getElementsByTagName("dt"),a=this.getElementsByTagName("dd");for(p=0;p<i.length;p++)this.accordions[p]=i[p],this.accordions[p].onclick=new Function("nmdr.core.$('"+this.id+"').accor(this)"),t==p&&e&&(this.accordions[p].className="open");for(var p=0;p<a.length;p++)a[p].mh=a[p].offsetHeight,t!=p&&(a[p].style.height=0,a[p].style.display="none")},t.accor=function(o){for(var t=0;t<this.accordions.length;t++){var e=this.accordions[t].nextSibling;e=1!=e.nodeType?e.nextSibling:e,this.stopAnimate(e),this.accordions[t]==o&&"none"==e.style.display?(e.style.display="",this.startAnimate(e,1),this.accordions[t].className="open"):""==e.style.display&&(this.startAnimate(e,-1),this.accordions[t].className="")}},t.startAnimate=function(o,t){var e=this;o.tm=setInterval(function(){e.animate(o,t)},this.tm)},t.stopAnimate=function(o){clearInterval(o.tm)},t.animate=function(o,t){var e=o.offsetHeight,r=o.mh,i=1==t?r-e:e;o.style.height=e+Math.ceil(i/this.sp)*t+"px",o.style.opacity=e/r,o.style.filter="alpha(opacity="+100*e/r+")",1==t&&e>=r?this.stopAnimate(o):1!=t&&1==e&&(o.style.display="none",this.stopAnimate(o))},t}