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
#  nmdrBitmap
#
#  Version: 1.00.00
#  Date: December 20. 2016
#  Status: Release
#
#####################################################################
*/
/*
function nmdrBitmap(width, height) {
    this.width = width;
    this.height = height;
    this.pixel = new Array(width);
    for (var x = 0; x < width; x++) {
        this.pixel[x] = new Array(height);
        for (var y = 0; y < height; y++) {
            this.pixel[x][y] = [0, 0, 0, 0];
		}
    }
}

nmdrBitmap.prototype.subsample = function(n) {
    var width = ~~(this.width / n);
    var height = ~~(this.height / n);
    var pixel = new Array(width);
    for (var x = 0; x < width; x++) {
        pixel[x] = new Array(height);
        for (var y = 0; y < height; y++) {
            var q = [0, 0, 0, 0];
            for (var i = 0; i < n; i++)
                for (var j = 0; j < n; j++) {
                    var r = this.pixel[x*n+i][y*n+j];
                    q[0] += r[3] * r[0];
                    q[1] += r[3] * r[1];
                    q[2] += r[3] * r[2];
                    q[3] += r[3];
                }
            if (q[3]) {
                q[0] /= q[3];
                q[1] /= q[3];
                q[2] /= q[3];
                q[3] /= n * n;
            }
            pixel[x][y] = q;
        }
    }
    this.width = width;
    this.height = height;
    this.pixel = pixel;
}

nmdrBitmap.prototype.dataURL = function() {
    function sample(v) {
        return ~~(Math.max(0, Math.min(1, v)) * 255);
    }

    function gamma(v) {
        return sample(Math.pow(v, .45455));
    }

    function row(pixel, width, y) {
        var data = "\0";
        for (var x = 0; x < width; x++) {
            var r = pixel[x][y];
            data += String.fromCharCode(gamma(r[0]), gamma(r[1]), gamma(r[2]), sample(r[3]));
        }
        return data;
    }

    function rows(pixel, width, height) {
        var data = "";
        for (var y = 0; y < height; y++)
            data += row(pixel, width, y);
        return data;
    }

    function adler(data) {
        var s1 = 1, s2 = 0;
        for (var i = 0; i < data.length; i++) {
            s1 = (s1 + data.charCodeAt(i)) % 65521;
            s2 = (s2 + s1) % 65521;
        }
        return s2 << 16 | s1;
    }

    function hton(i) {
        return String.fromCharCode(i>>>24, i>>>16 & 255, i>>>8 & 255, i & 255);
    }

    function deflate(data) {
        var len = data.length;
        return "\170\1\1" +
            String.fromCharCode(len & 255, len>>>8, ~len & 255, (~len>>>8) & 255) +
            data + hton(adler(data));
    }

    function crc32(data) {
        var c = ~0;
        for (var i = 0; i < data.length; i++)
            for (var b = data.charCodeAt(i) | 0x100; b != 1; b >>>= 1)
                c = (c >>> 1) ^ ((c ^ b) & 1 ? 0xedb88320 : 0);
        return ~c;
    }

    function chunk(type, data) {
        return hton(data.length) + type + data + hton(crc32(type + data));
    }

    function base64(data) {
        enc = "";
        for (var i = 5, n = data.length * 8 + 5; i < n; i += 6)
            enc += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                (data.charCodeAt(~~(i/8)-1) << 8 | data.charCodeAt(~~(i/8))) >> 7 - i%8 & 63];
        for (; enc.length % 4; enc += "=");
        return enc;
    }

    var png = "\211PNG\r\n\32\n" +
        chunk("IHDR", hton(this.width) + hton(this.height) + "\10\6\0\0\0") +
        chunk("IDAT", deflate(rows(this.pixel, this.width, this.height))) +
        chunk("IEND", "");

    return "data:image/png;base64," + base64(png);
}

nmdrBitmap.prototype.makeImage = function(cod, inv, bufOnly) {

	var b0 = [
	"0000000..",
	"000000..0",
	".0000..00",
	"..00..000",
	"0....0000",
	"00..00000"];
	
	var b1 = [
	"0..........00000",
	".1111111111.0000",
	".11..........000",
	".1.1111111111.00",
	".1.11..........0",
	".1.1.1111111111.",
	".1.1.1111111111.",
	".1.1.11......11.",
	".1.1.1111111111.",
	".1.1.11......11.",
	".1.1.1111111111.",
	"0..1.11......11.",
	"00.1.1111111111.",
	"000..1111111111.",
	"0000.1111111111.",
	"00000..........0"];

	var b2 = [
	"00.........00000",
	"0.111111111.0000",
	"0.1111111111.000",
	"0.11......111.00",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"0.11........11.0",
	"0.111111111111.0",
	"0.111111111111.0",
	"00............00"];
	
	var b3 = [
	"..00000000",
	"...0000000",
	"....000000",
	".....00000",
	"......0000",
	"......0000",
	".....00000",
	"....000000",
	"...0000000",
	"..00000000"];
	
	var b4 = [
	"..........000",
	"..........000",
	"0........0000",
	"00......00000",
	"000....000000",
	"0000..0000000",
	"0000000000000"];

	var b5 = [
	"00000......00000",
	"0000.111111.0000",
	"0..............0",
	".11111111111111.",
	".11111111111111.",
	"0..............0",
	"0.111111111111.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111.1.1.1.0",
	"0.111111111111.0",
	"00............00",
	"0000000000000000"];

	var b6 = [
	"0.............00",
	".1111111111111.0",
	".1111111111111.0",
	".11......11111.0",
	".1111111111111.0",
	".11......1111...",
	".11111111111.11.",
	".11......11.111.",
	".111111111.111.0",
	".11111111.111..0",
	".1111111.111.1.0",
	".1111111.11.11.0",
	".1111111...111.0",
	".1111111111111.0",
	"0.............00",
	"0000000000000000"];

	var b7 = [
	"0.............00",
	".1111111111111.0",
	".1....11111111.0",
	".111111....111.0",
	".1..11.1111.11.0",
	".1111.111111.1.0",
	".1..1.111111.1.0",
	".1111.111111.1.0",
	".1..1.111111.1.0",
	".11111.111111.00",
	".1...11....111.0",
	".1111111111.111.",
	".1........11.11.",
	".111111111111...",
	"0.............00",
	"0000000000000000"];
	
	var bb = null;
	switch(cod) {
		case 0: bb = b0; break;
		case 1: bb = b1; break;
		case 2: bb = b2; break;
		case 3: bb = b3; break;
		case 4: bb = b4; break;
		case 5: bb = b5; break;
		case 6: bb = b6; break;
		case 7: bb = b7; break;
	}
	
	var w = bb[0].length, h = bb.length, bmp = new Bitmap(w, h);
	
	r = r?r:1;
	g = g?g:1;
	b = b?b:1;
		
	for (var i=0; i < h; i++) {
		for (var j=0; j < w; j++) {
			if (bb[i][j] == ".") bmp.pixel[j][i] = inv ? [1,1,1,1] : [.3,.3,.3, 1];
			else if (bb[i][j] == "1") bmp.pixel[j][i] = [r, g, b, 1];
		}
	}
	
	if (!crImg) return bmp.dataURL();
	
    var img = document.createElement("img");
    img.setAttribute("src", bmp.dataURL());
	return img;
}
*/
