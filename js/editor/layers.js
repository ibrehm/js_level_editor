//-----------------------------------------------------------------------------------------------------------
// Data object for each individual layer.
var Layer = function(num, imgUrl, default_val = 0) {
	
	this.atlas = new Image();
	this.atlas.src = imgUrl;
	
	this.drawRecord = new Int16Array( VIEWPORT_TILE_WIDTH * VIEWPORT_TILE_HEIGHT );
	this.data = new Int32Array( MAP_SIZE * MAP_SIZE );
	this.data.fill(default_val);
	
	for(var i = 0; i < this.drawRecord.length; i++) {
		this.drawRecord[i] = -1;
	}
	
	this.ctx;
	this.elem;
	
	$('#level_canvas').append(
		"<canvas id='canvas_layer-" + num + "' class='canvas_layers' width='" + VIEWPORT_WIDTH + "' height='" + VIEWPORT_HEIGHT + "'>Your browser does not support the HTML5 canvas tag.</canvas>"
	);
	this.elem = $('#canvas_layer-' + num);
	this.ctx = this.elem[0].getContext('2d');
}

//-----------------------------------------------------------------------------------------------------------
// Layer Manager. Functions to manage the data.
var LayerManager = function() {
	var self = this;
	var local = {
		layers: [],
		counter: 0
	}
	//------------------------------------------------------
	// Private Functions
	//------------------------------------------------------
	function GetTileRecord(x, y, layer) {
		var selected = x+(y*VIEWPORT_TILE_WIDTH);
		return local.layers[layer].drawRecord[selected];
	}
	//------------------------------------------------------
	function SetTileRecord(x, y, layer, tile) {
		if( (x >= 0) && (x < VIEWPORT_TILE_WIDTH) && (y >= 0) && (y < VIEWPORT_TILE_HEIGHT) ) {
			var selected = x+(y*VIEWPORT_TILE_WIDTH);
			var length = local.layers[layer].drawRecord.length;
			local.layers[layer].drawRecord[selected] = tile;
		}
	}
	//------------------------------------------------------
	function UpdateCanvasRegion(x, y, layer) {
		// Get tile data, if there is any.
		var x_reverse = Origins.getInstance().origin_x + x;
		var y_reverse = 35-(y-Origins.getInstance().origin_y);
		
		var tile = self.GetDataXY(x_reverse, y_reverse, layer);
		var view_tile = GetTileRecord(x, y, layer);
		//alert("Finding " + x_reverse + ", " + y_reverse + "... MapData: " + tile + ", TileData: " + view_tile);
		
		if(view_tile != tile) {
			local.counter++;
			SetTileRecord(x, y, layer, tile);
			self.SingleDrawNS(x_reverse, y_reverse, tile, layer);
		}
	}
	//------------------------------------------------------
	// Public functions
	//------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------------
	self.Update = function() {
		
		for(var layer = 0; layer < local.layers.length; layer++) {
			for(var y = 0; y < VIEWPORT_TILE_HEIGHT; y++) {
				for(var x = 0; x < VIEWPORT_TILE_WIDTH; x++) {
					UpdateCanvasRegion(x, y, layer);
				}
			}
		}
		$('#debugii').html("Wrote " + local.counter + " tiles.  " + ((local.counter/(VIEWPORT_TILE_HEIGHT*VIEWPORT_TILE_WIDTH))*100).toFixed(2) + "%");
		local.counter = 0;
		
		/*
		for(var i = Origins.getInstance().origin_x; i < Origins.getInstance().origin_x+ VIEWPORT_TILE_WIDTH; i++) {
			for(var j = Origins.getInstance().origin_y; j < Origins.getInstance().origin_y+ VIEWPORT_TILE_HEIGHT; j++) {
				self.SingleDrawNS(i, j, self.GetDataXY(i, j, layer), layer);
			}
		}
		*/
	}
	//---------------------------------------------------------------------------------------------------------------
	self.push_back = function(imgUrl, default_val = 0) {
		var newID = local.layers.length;
		local.layers[newID] = new Layer(local.layers.length, imgUrl, default_val);
		
		local.layers[newID].atlas.onload = function() {
			self.Update(newID);
		}
		
		return(newID);
	}
	//---------------------------------------------------------------------------------------------------------------
	self.pop_back = function() {
		local.layers[local.layers.length-1].elem.remove();
		local.layers.length--;
	}
	//---------------------------------------------------------------------------------------------------------------
	self.rtrnLayer = function(num) {
		if( (num >= 0) && (num < local.layers.length) ) {
			//return local.layers[num].ctx;
			return local.layers[num];
		}
		return null;
	}
	//---------------------------------------------------------------------------------------------------------------
	self.size = function() {
		return local.layers.length;
	}
	//---------------------------------------------------------------------------------------------------------------
 	self.SingleDrawNS = function(x, y, paint_tile, layer = 0) {
		// Position of the tile relative to the canvas
		var x_correct = x-Origins.getInstance().origin_x;
		var y_correct = 35-(y-Origins.getInstance().origin_y);
		
		if(local.layers.length >= layer) {
				
			local.layers[layer].ctx.clearRect(x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);

			if( ( (x >= 0) && (x < MAP_SIZE) ) && ( (y >= 0) && (y < MAP_SIZE) ) ) {
				
				if(paint_tile >= 0) {
					var tile_x = paint_tile % TILES_PER_ROW;
					var tile_y = parseInt(paint_tile / TILES_PER_ROW);
				
					//local.ctx.putImageData(local.atlasData, (x_correct*TILE_SIZE)-(paint_tile*TILE_SIZE), (y_correct*TILE_SIZE), (tile_x*TILE_SIZE), (tile_y*TILE_SIZE), TILE_SIZE, TILE_SIZE);
					local.layers[layer].ctx.drawImage(local.layers[layer].atlas, tile_x*TILE_SIZE, tile_y*TILE_SIZE, TILE_SIZE, TILE_SIZE, x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);
				}
				SetTileRecord(x_correct, y_correct, layer, paint_tile);
				
				if(x == local.start_x && y == local.start_y) {
					local.layers[layer].ctx.drawImage(local.start_img, 0, 0, TILE_SIZE, TILE_SIZE, x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);
				}
			}
		}
	}
	//---------------------------------------------------------------------------------------------------------------
	self.Draw = function(x, y, paint_tile, mode, layer) {
		
		var rtrn_undo;
		
		if( ( (x >= 0) && (x < MAP_SIZE) ) && ( (y >= 0) && (y < MAP_SIZE) ) ) {
			
			var tile = self.GetDataXY(x, y, layer);
			
			var x_correct = x-Origins.getInstance().origin_x;
			var y_correct = 35-(y-Origins.getInstance().origin_y);

			if(mode == DRAW_MODE_LINE || mode == DRAW_MODE_SINGLE || mode == DRAW_MODE_ERASE) {
				
				if(mode == DRAW_MODE_ERASE) {
					paint_tile = -1;
				}
				
				var rtrn_undo = {
					un_x: x,
					un_y: y,
					un_mode: mode,
					un_tile: tile
				};
				
				self.SingleDrawNS(x, y, paint_tile, layer);
				self.SetDataXY(x, y, paint_tile, layer);
			}
			
			if(mode == DRAW_MODE_LINE) {
				
				var max_right = x;
				var max_left = x;
				
				// Filling right
				for(var i = (x+1); i < MAP_SIZE; i++) {
					if(self.GetDataXY(i, y, layer) == tile) {
						self.SetDataXY(i, y, paint_tile, layer);
						
						var tile_x = paint_tile % TILES_PER_ROW;
						var tile_y = parseInt(paint_tile / TILES_PER_ROW);
						
						self.SingleDrawNS(i, y, paint_tile, layer);
						
						max_right++;
					} else {
						break;
					}
				}
				// Filling left
				for(var i = (x-1); i >= 0; i--) {
					if(self.GetDataXY(i, y, layer) == tile) {
						self.SetDataXY(i, y, paint_tile, layer);
						
						var tile_x = paint_tile % TILES_PER_ROW;
						var tile_y = parseInt(paint_tile / TILES_PER_ROW);
						
						self.SingleDrawNS(i, y, paint_tile, layer);
						
						max_left--;
					} else {
						break;
					}
				}
				
				rtrn_undo = {
					un_y: y,
					un_x: x,
					un_left: max_left,
					un_right: max_right,
					un_tile: tile,
					un_mode: mode
				};
				
			} else if(mode == DRAW_MODE_ROUND) {
				
				var rtile = self.Edge(x, y, tile);
				
				if(rtile != null) {
					self.SetDataXY(x, y, rtile, layer);
					
					var tile_x = rtile % TILES_PER_ROW;
					var tile_y = parseInt(rtile / TILES_PER_ROW);
					
					self.SingleDrawNS(x, y, rtile);
					
					var rtrn_undo = {
						un_x: x,
						un_y: y,
						un_mode: mode,
						un_tile: tile
					};
				} else {
					rtrn_undo = null;
				}
				
			}
		}
		
		return rtrn_undo;
	}
	//--------------------------------------------------------------
	self.Edge = function(x, y, tile) {
		var rtrn = null;
		
		// When clicking on grass or water
		if( (tile == 6) || (tile == 0) ) {
			var dl = tile+1;
			var dr = tile+2;
			var ul = tile+3;
			var ur = tile+4;
		
			if( (self.GetDataXY(x, y-1) == 5) && (self.GetDataXY(x+1, y) == 5) ) {
				rtrn = ul;
			} else if( (self.GetDataXY(x, y+1) == 5) && (self.GetDataXY(x+1, y) == 5) ) {
				rtrn = dl;
			} else if( (self.GetDataXY(x, y-1) == 5) && (self.GetDataXY(x-1, y) == 5) ) {
				rtrn = ur;
			} else if( (self.GetDataXY(x, y+1) == 5) && (self.GetDataXY(x-1, y) == 5) ) {
				rtrn = dr;
			}
		// When clicking on sand
		} else if(tile == 5) {
			var dl = tile+1;
			var dr = tile+2;
			var ul = tile+3;
			var ur = tile+4;
			
			// Check if grass
			if( (self.GetDataXY(x, y-1) == 6) && (self.GetDataXY(x+1, y) == 6) ) {
				rtrn = dr+1;
			} else if( (self.GetDataXY(x, y+1) == 6) && (self.GetDataXY(x+1, y) == 6) ) {
				rtrn = ur+1;
			} else if( (self.GetDataXY(x, y-1) == 6) && (self.GetDataXY(x-1, y) == 6) ) {
				rtrn = dl+1;
			} else if( (self.GetDataXY(x, y+1) == 6) && (self.GetDataXY(x-1, y) == 6) ) {
				rtrn = ul+1;
			}
			// Check if water
			//-------------------------------------------------------------------------------------------
			else if( (self.GetDataXY(x, y-1) == 0) && (self.GetDataXY(x+1, y) == 0) ) {
				rtrn = dr-5;
			} else if( (self.GetDataXY(x, y+1) == 0) && (self.GetDataXY(x+1, y) == 0) ) {
				rtrn = ur-5;
			} else if( (self.GetDataXY(x, y-1) == 0) && (self.GetDataXY(x-1, y) == 0) ) {
				rtrn = dl-5;
			} else if( (self.GetDataXY(x, y+1) == 0) && (self.GetDataXY(x-1, y) == 0) ) {
				rtrn = ul-5;
			}
		}
		
		return rtrn;
	}
	//---------------------------------------------------------------------------------------------------------------
	self.GetDataXY = function(x, y, layer = 0) {
		if( (x >= 0 && x < MAP_SIZE) && (y >= 0 && y < MAP_SIZE) ) {
			var location = x+(y*MAP_SIZE);
			return local.layers[layer].data[location];
		}
		return -1;
	}
	//--------------------------------------------------------------
	self.SetDataXY = function(x, y, num, layer = 0) {
		if( (x >= 0 && x < MAP_SIZE) && (y >= 0 && y < MAP_SIZE) ) {
			var location = x+(y*MAP_SIZE);
			local.layers[layer].data[location] = num;
		}
	}
};
//-----------------------------------------------------------------------------------------------------------
