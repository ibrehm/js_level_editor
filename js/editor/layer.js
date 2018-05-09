// (C) 2018 Ian Brehm
//-----------------------------------------------------------------------------------------------------------
// Data object for each individual layer.
var Layer = function(width, height, num, imgNum, default_val = 0) {
	
	this.atlas = new Image();
	this.atlas.src = IMG_LOCATIONS[NAMES[0]] + imgNum + ".png";
	this.imgNum = imgNum;
	
	this.ctx;
	this.elem;
	
	this.drawRecord = new Int32Array( VIEWPORT_TILE_WIDTH * VIEWPORT_TILE_HEIGHT );
	this.data = new Int32Array( width * height );
	this.above = 0;
	this.data.fill(default_val);
	
	var self = this;
	
	for(var i = 0; i < this.drawRecord.length; i++) {
		this.drawRecord[i] = -1;
	}
	
	$('#level_canvas').append(
		"<canvas id='canvas_layer-" + num + "' class='canvas_layers' width='" + VIEWPORT_WIDTH + "' height='" + VIEWPORT_HEIGHT + "'>Your browser does not support the HTML5 canvas tag.</canvas>"
	);
	this.elem = $('#canvas_layer-' + num);
	this.ctx = this.elem[0].getContext('2d');
	
	this.setTexture = function(imgNum) {
		self.atlas = new Image();
		self.atlas.src = IMG_LOCATIONS[NAMES[0]] + imgNum + ".png";
		self.imgNum = imgNum;
	}
	
	this.UpdateElement = function(newID) {
		self.elem = $('#canvas_layer-' + newID);
		self.ctx = this.elem[0].getContext('2d');
		// Reset draw record since we're changing canvas IDs
		for(var i = 0; i < this.drawRecord.length; i++) {
			this.drawRecord[i] = -2;
		}
	}
};
