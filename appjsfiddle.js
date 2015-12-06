var p1 = 0,
    p2 = 0,
    p3 = 0,
    p4 = 0,
    t1, t2, t3, t4,
    ig, cv, cd,
    aSin = [], 
    ti = 15, //lava density
    rad,
    i, j, x,
    idx;
//   var as = 2.6, fd = 0.4, as1 = 4.4, fd1 = 2.2, ps = -4.4, ps2 = 3.3;
    
var lavaParameters = {
    'as':2.6, 
    'fd':0.4, 
    'as1':4.4, 
    'fd1':2.2, 
    'ps':-4.4, 
    'ps2':3.3};


$(document).ready(function() {
	init();
	draw();  
});

function init(){
	ig = $("#lavacanvas")[0];
	ig.width = 640;
	ig.height = 480;

    cv = ig.getContext('2d');
    cd = cv.createImageData(640, 480);

	var i = 512;
	while (i--) {
		rad = (i * 0.703125) * 0.0174532;
		aSin[i] = Math.sin(rad) * 1024;
	}
	
	//$('#asRange').on("change mousemove", function() {
	//	console.log("as", $(this).val());
    //	$(this).next().html($(this).val());
	//});
	
	$('#as').on("change", function() {rangeChange( this.id, $(this).val())});
	$('#fd').on("change", function() {rangeChange( this.id, $(this).val())});
	$('#as1').on("change", function() {rangeChange( this.id, $(this).val())});
	$('#fd2').on("change", function() {rangeChange( this.id, $(this).val())});
	$('#ps').on("change", function() {rangeChange( this.id, $(this).val())});
	$('#ps2').on("change", function() {rangeChange( this.id, $(this).val())});
}

function rangeChange(idRange, value){
	console.log("rangeChange",idRange, value);
	lavaParameters[idRange] = value;
	$('#'+idRange).next().html(value);
}


if (!("createImageData" in CanvasRenderingContext2D.prototype)){
	CanvasRenderingContext2D.prototype.createImageData = function(sw,sh) { 
		return this.getImageData(0,0,sw,sh);
	}
}


function rand(va) {
  return Math.random(va);
}

document.onclick = function(){
  /*as = rand(300)*5;
  fd = rand(300)*10;
  as1 = rand(200)*50;
  fd2 = rand(300)*50;
  ps = (rand(200)*20)-10;
  ps2 = (rand(200)*40)-20; */
  lavaParameters.as = rand(300)*5;
  lavaParameters.fd = rand(300)*10;
  lavaParameters.as1 = rand(200)*50;
  lavaParameters.fd2 = rand(300)*50;
  lavaParameters.ps = (rand(200)*20)-10;
  lavaParameters.ps2 = (rand(200)*40)-20;
};

function draw() {
    
  cdData = cd.data;    
    
  t4 = p4;
  t3 = p3;
	
  i = 640; while(i--) {
    t1 = p1 + 5;
    t2 = p2 + 3;

    t3 &= 511;
    t4 &= 511;

    j = 480; while(j--) {
      t1 &= 511;
      t2 &= 511;

      x = aSin[t1] + aSin[t2] + aSin[t3] + aSin[t4];

      idx = (i + j * ig.width) * 4;
      
      cdData[idx] = x/lavaParameters.as;
      cdData[idx + 1] = x/lavaParameters.fd;
      cdData[idx + 2] = x/lavaParameters.ps;
      cdData[idx + 3] = 255;
      
      t1 += 5;
      t2 += 3;
    }

    t4 += lavaParameters.as1;
    t3 += lavaParameters.fd1;
    
  }
    
  cd.data = cdData;    

  cv.putImageData(cd, 0, 0);

  p1 += lavaParameters.ps;
  p3 += lavaParameters.ps2;
  console.log("cdData", cdData);
  setTimeout ( draw, ti);
}



