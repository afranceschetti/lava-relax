//dichiaro tutte le variabili ed alcune sono standard

//short version of Canvas
var cnv;
//Context
var ctx;
var active = true;
//questa non mi e' chiara
var frametime = [];
//come sopra
var nframetimes = 10;
//Window and Canvas height/width
var winW ,winH,cnvH,cnvW;

//The goo object provides access to most of the Goo Engine API. 
//For example, one can create entities and access math functions.
//http://goocreate.com/learn/the-goo-object/
//non ne ero a conoscenza
var goo = [255, 255, 40];
var goo1 = [255, 255, 40];
var scale = 1;


var cylW = 440 * scale,
    cylH = 660 * scale;
    
//cylR equivale q Cycle Right?
var cylR = cylW / 2;
var cylX = (winW) / 2; // xpos of centre
var cylY = (winH - cylH) / 2; // ypos of base

//qui creiamo un elemeno che poi andremo ad aggiungere al DOM
var goocanvas = document.createElement("canvas");

//The HTMLCanvasElement.getContext() 
//this method returns a drawing context on the canvas, 
//or null if the context identifier is not supported.
//non usando mai i Canvas non ne ero a conoscenza
var gooctx = goocanvas.getContext("2d"); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext

//lanciamo  queste variabili a caricamento pagina avvenuto
$(document).ready(function() {
    init();
    setcanvassize();
    createblobs();
    doAnimation();

    //go();
});

var init = function() {
	//il canvas e' un elemnto vuoto creato in cima all' HTML
	//che viene riempito successivamente
	//<canvas id='lavacanvas' ></canvas>
    cnv = document.getElementById("lavacanvas");
    //questo, come detto sopra, devo approfondirlo
    ctx = cnv.getContext("2d");
    
	//facciamo sparire la toolbar dopo 5 secondi
	setTimeout( function() {
			$('#toolbar').fadeOut('fast');
		}, 5000 
	); //l'ho riscritta solo per vedere se rende meglio indentantata, ma mi pare peggio di prima!
	//setTimeout(function() {$('#toolbar').fadeOut('fast');}, 5000); 
	
	//da dove arriva "change" ? pare logico visto il nome, ma non ricordo di averlo mai usato!
	//http://stackoverflow.com/questions/13418963/jquery-onchange-function-not-triggering-for-dynamically-created-inputs
	$("#lavacolor").on("change",function(){
		//.val devo rivederlo, facendo solo js adesso sono un po' fuori da jQuery
		//http://api.jquery.com/val/
		changeLavaColor($("#lavacolor").val());
	});
	
	//FINITO PRIMA PARTE DI COMMENTI 07/12/2015
	
	$("#randomlavacolor").on("click", function(){randomcolours();});
	$( "#lavacanvas" ).click(function( event ) {	
 		$('#toolbar').fadeIn('fast');
 		setTimeout(function() {$('#toolbar').fadeOut('fast');}, 30000); 
	});
	$("#close_toolbar_link").on("click", function(){$('#toolbar').fadeOut();});
	$("#open_credits_link").on("click", function(){$('#credits-panel').fadeIn();});
	$("#close_credits_link").on("click", function(){$('#credits-panel').fadeOut();});

};

var changeLavaColor = function(colorHex){
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
	
    goo1[0] = parseInt(rgb[1], 16);
    goo1[1] = parseInt(rgb[2], 16);
    goo1[2] = parseInt(rgb[3], 16);
};

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

/*
window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();
*/

var setcanvassize = function() {
	winW = $(window).width();
    winH = $(window).height();
	cnvH = winH;
    cnvW = winW;
	cylW = winW * scale,
    cylH = winH * scale;
	cylR = cylW / 2;
	cylX = (winW) / 2; // xpos of centre
	cylY = (winH - cylH) / 2; // ypos of base

    cnvW = Math.ceil(cylW);
    cnvH = Math.ceil(cylH);
    cnv.width = cnvW;
    cnv.height = cnvH;

	goocanvas.width = cylW;
	goocanvas.height = cylH;

	drawblobs();
};

var randomcolours = function() {
     var G = [255, 255, 255];
	var i1;
	do {
		i1 = Math.floor(Math.random() * 3);
	} while (goo1[i1] == 40);

	G[i1] = 40;
	goo1[0] = G[0];
	goo1[1] = G[1];
	goo1[2] = G[2];
};

var circle = function(x, y, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};

var goocircle = function(x, y, r, ctx) {
    var c = "rgb(" + goo[0] + "," + goo[1] + "," + goo[2] + ")";
    var ca = "rgba(" + goo[0] + "," + goo[1] + "," + goo[2] + ",0)";
    var grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, c);
    grd.addColorStop(1, ca);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};

var clear = function() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    gooctx.clearRect(0, 0, cylW, cylH);
};

var fps = function() {
    for (var i = nframetimes - 1; i > 0; i -= 1)
        frametime[i] = frametime[i - 1];
    frametime[0] = (new Date()).getTime();
};

var blobs = [];

var DT = 20;
var SP = 0.005;
var R = 20.0;

var drawblobs = function() {
    fps();
    clear();
    ctx.fillRect(cylX - cylR, cnvH - (cylY + cylH), cylW, cylH);

    gooctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < blobs.length; i++) {
        var o = blobs[i];
        var r = o.r;
        for (var j = 0; j < blobs.length; j++) {
            if (i == j) continue;
            var o2 = blobs[j];
            var d2 = (o.x - o2.x) * (o.x - o2.x) + (o.y - o2.y) * (o.y - o2.y);
            d2 /= ((o.r + o2.r) * (o.r + o2.r));
            if (d2 < 1) {
                r += 0.5 * (1 - d2) * o2.r;
                if (d2 > 0.5) {
                    var d = (o2.dy * o2.r - o.dy * o.r);
                    d *= 0.003;
                    blobs[i].dy += d / o.r;
                    blobs[j].dy -= d / o2.r;
                }
            }
            o.dt = 1 / r;
        }
        if (r > 100 * scale) r = 100 * scale;
        if (Math.abs(o.x) + r > cylR) {
            r = (r + cylR - Math.abs(o.x)) * 0.5;
            if (r < 5) r = 5;
        }
        goocircle(o.x + cylR, cylH - o.y, r, gooctx);
    }


    var imgd = gooctx.getImageData(0, 0, cylW, cylH);
    var data = imgd.data;
    var a;
    for (var i = 3, n = data.length; i < n; i += 4) {
        a = data[i];
        if (a) {
            if (a < 170) {
                data[i] = data[i - 1] = data[i - 2] = data[i - 3] = 0;
            } else
                data[i] = 255;
        }
    }
    gooctx.putImageData(imgd, 0, 0);

    ctx.drawImage(goocanvas, cylX - cylR, cnvH - (cylY + cylH));
};

var prevt = null;

var moveblobs = function() {
    drawblobs();

    var tnow = new Date().getTime();
    var tstep = 0.02;
    if (prevt) {
        tstep = (tnow - prevt) / 1000;
    }
    prevt = tnow;

    if (tstep > 1) tstep = 1;

    var tscale = tstep / 0.015;

    var nd = Math.ceil(tscale);
    for (var i = 0; i < nd; i++) {
        for (j = 0; j < 3; j++) {
            if (goo1[j] > goo[j]) goo[j] += 1;
            if (goo1[j] < goo[j]) goo[j] -= 5;
        }
    }


    var res = 0;
    for (var i = 0; i < blobs.length; i++) {
        var o = blobs[i];
        if (o.y < o.r) res += o.r;
    }
    res *= 0.05;
    for (var i = 0; i < blobs.length; i++) {
        var o = blobs[i];
        if (i > 8) {
            var temp = (cylH - o.y) / (cylH - res); // temp of environment, 1 at bottom, 0 at top
            var r = (cylR - o.x) * (cylR - o.x) / (cylR * cylR); // 1 in centre, 0 at edge
            r = 0.8 + r * 0.2; // 1 in centre 0.9 at edge
            temp *= r;
            temp = temp * temp * temp;

            o.t += tscale * 0.1 * o.dt * (temp - o.t); // move towards environment temp
            o.dy += 0.01 * (o.t - 0.5);
            var dh = 50 * scale;
            if (o.y < dh + res && o.dy < -0.1) o.dy *= 0.95;
            if (o.y <= res && o.dy < 0) o.dy = 0;
            if (o.y > cylH - dh && o.dy > 0) o.dy *= 0.99;
            if (o.y >= cylH && o.dy > 0) o.y = cylH - o.dy; //o.dy=0;

            var d = o.dy;
            if (d < -0.4 * scale) d = -0.4 * scale;
            if (d > 1 * scale) d = 1 * scale;

            o.y += d * tscale;
        }

        var r2 = o.r * 0.5;
        if (i <= 8) r2 = 0;
        if (o.x - r2 < -cylR && o.dx < 0) o.dx = -o.dx;
        if (o.x + r2 > cylR && o.dx > 0) o.dx = -o.dx;

        o.x += o.dx * tscale;
    }
};

var randir = function() {
    var d = Math.random() * 1 + 0.1;
    if (Math.random() < 0.5) d = -d;
    return d * 0.3 * scale;
};

var createblobs = function() {
    if (blobs.length > 0) return;
    for (var i = 0; i < 25; i++) {
        var o = new Object();
        o.r = (35 + Math.random() * 35) * scale;
        o.x = Math.random() * (cylW) - cylR;
        o.y = Math.random() * (50);
        if (i <= 8) {
            o.y = 0;
        }
        o.dx = randir();
        o.dy = 0;
        o.da = 0;
        o.dt = 0;
        o.t = 0.5;
        blobs.push(o);
    }
};

var afrequest = null;

var doAnimation = function() {
    moveblobs();
    afrequest = requestAnimFrame(doAnimation);
};

window.onresize = setcanvassize;
