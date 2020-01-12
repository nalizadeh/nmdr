//-------------------------------------------------------------------------------------------------------
function holeOut_Style(buff) {
	buff.push('<style type="text/css">');
	buff.push('@keyframes holeOut ');
	buff.push('{0% {opacity:1;transform-origin:50% 50%;transform:scale(1,1) rotateY(0deg);}');
	buff.push('100% {opacity:0;transform-origin:50% 50%;transform:scale(0,0) rotateY(180deg);}}');
	buff.push('</style>');
}
function holeOut_Line() {
	return 'animation-duration:2s;animation-fill-mode:both;animation-name: holeOut;';
}
//-------------------------------------------------------------------------------------------------------
function swashin_Style(buff) {
		buff.push('<style type="text/css">');
		buff.push('@keyframes swashin ');
		buff.push('{0% {opacity:0;transform-origin:50% 50%;transform:scale(0,0);}');
		buff.push('90% {opacity:1;transform-origin:50% 50%;transform:scale(0.9,0.9);}');
		buff.push('100% {opacity:1;transform-origin:50% 50%;transform:scale(1,1);}}');
		buff.push('</style>');
}
function swashin_Line() {
	return 'animation-duration:2s;animation-fill-mode:both;animation-name: swashin;';
}
//-------------------------------------------------------------------------------------------------------
function boingOutDown_Style(buff) {
		buff.push('<style type="text/css">');
		buff.push('@keyframes boingOutDown ');
		buff.push('{0% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}');
		buff.push('20% {opacity:1;transform-origin:100% 100%;transform:perspective(800px) rotateX(0deg) rotateY(5deg);}');
		buff.push('30% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(0deg) rotateY(0deg);}');
		buff.push('40% {opacity:1;transform-origin:0% 100%;transform:perspective(800px) rotateX(10deg) rotateY(10deg);}');
		buff.push('100% {opacity:0;transform-origin:100% 100%;transform:perspective(800px) rotateX(90deg) rotateY(0deg);}}');
		buff.push('</style>');
}
function boingOutDown_Line(buff) {
	return 'animation-duration:1s;animation-fill-mode:both;animation-name: boingOutDown;';
}
//-------------------------------------------------------------------------------------------------------
function boingInUp_Style(buff) {
		buff.push('<style type="text/css">');
		buff.push('@keyframes boingInUp ');
		buff.push('{0% {opacity:0;transform-origin:50% 0%;transform:perspective(800px) rotateX(-90deg);}');
		buff.push('50% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(50deg);}');
		buff.push('100% {opacity:1;transform-origin:50% 0%;transform:perspective(800px) rotateX(0deg);}}');
		buff.push('</style>');
}
function boingInUp_Line() {
	return 'animation-duration:5s;animation-fill-mode:both;animation-name: boingInUp;';
}
//-------------------------------------------------------------------------------------------------------
