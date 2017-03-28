//-----------------------------------------------------------------------------------------------------------
// Data object for each individual layer.
var Layer = function(num, imgUrl, default_val = 0) {
	
	this.atlas = new Image();
	this.atlas.src = imgUrl;
	
	this.ctx;
	this.elem;
	
	this.drawRecord = new Int16Array( VIEWPORT_TILE_WIDTH * VIEWPORT_TILE_HEIGHT );
	this.data = new Int32Array( MAP_SIZE * MAP_SIZE );
	this.data.fill(default_val);
	
	for(var i = 0; i < this.drawRecord.length; i++) {
		this.drawRecord[i] = -1;
	}
	
	$('#level_canvas').append(
		"<canvas id='canvas_layer-" + num + "' class='canvas_layers' width='" + VIEWPORT_WIDTH + "' height='" + VIEWPORT_HEIGHT + "'>Your browser does not support the HTML5 canvas tag.</canvas>"
	);
	this.elem = $('#canvas_layer-' + num);
	this.ctx = this.elem[0].getContext('2d');
};

//-----------------------------------------------------------------------------------------------------------
// Layer Manager. Functions to manage the data.
var LayerManager = function(){
	var Manager = function() {
		var self = this;
		// layerCount tracks the amount of layers created (Never resets)
		// counter current tracks the amount of tiles drawn per screen Update
		this.local = {
			layers: new List(),
			layerCount: 0,
			counter: 0
		}
	};
	
	//---------------------------------------------------------------------------------------------------------------
	// Obtains the last known tile drawn to a specific X/Y coordinate in a layer
	Manager.prototype.GetTileRecord = function(x, y, layer) {
		var selected = x+(y*VIEWPORT_TILE_WIDTH);
		return this.local.layers.get(layer).drawRecord[selected];
	};
	//---------------------------------------------------------------------------------------------------------------
	// Sets the tile record in a specific X/Y coordinate in a layer
	Manager.prototype.SetTileRecord = function(x, y, layer, tile) {
		if( (x >= 0) && (x < VIEWPORT_TILE_WIDTH) && (y >= 0) && (y < VIEWPORT_TILE_HEIGHT) ) {
			var selected = x+(y*VIEWPORT_TILE_WIDTH);
			var length = this.local.layers.get(layer).drawRecord.length;
			this.local.layers.get(layer).drawRecord[selected] = tile;
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Updates a specific tile if the current data does not match the record
	Manager.prototype.UpdateCanvasRegion = function(x, y, layer) {
		// Get tile data
		var x_reverse = Origins.getInstance().origin_x + x;
		var y_reverse = 35-(y-Origins.getInstance().origin_y);
		
		var tile = this.GetDataXY(x_reverse, y_reverse, layer);
		var view_tile = this.GetTileRecord(x, y, layer);
		
		if(view_tile != tile) {
			this.local.counter++;
			this.SetTileRecord(x, y, layer, tile);
			this.SingleDrawNS(x_reverse, y_reverse, tile, layer);
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Refreshes the screen.
	Manager.prototype.Update = function() {
		
		for(var layer = 0; layer < this.local.layers.length; layer++) {
			for(var y = 0; y < VIEWPORT_TILE_HEIGHT; y++) {
				for(var x = 0; x < VIEWPORT_TILE_WIDTH; x++) {
					this.UpdateCanvasRegion(x, y, layer);
				}
			}
		}
		$('#debugii').html("Wrote " + this.local.counter + " tiles.  " + ((this.local.counter/(VIEWPORT_TILE_HEIGHT*VIEWPORT_TILE_WIDTH))*100).toFixed(2) + "%");
		this.local.counter = 0;
		
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.hideShow = function(layer) {
		//this.local.layers.get(layer).elem;
	}
	//---------------------------------------------------------------------------------------------------------------
	// Adds a new layer. The ID of the layer created is returned.
	Manager.prototype.push_back = function(imgUrl, default_val = 0) {
		var main = this;
		
		var newID = main.local.layerCount;
		
		$('#layer-list').append(
			"<span class='layer-tool'>" +
			"	<input class='layer-select' type='radio' name='layer-select' value=" + this.local.layers.length + ">Layer " + this.local.layers.length +
			"<input class='layer-toggle' type='checkbox' checked data-layer=" + this.local.layers.length + "><br>" +
			"</span>"
		);
		
		this.local.layers.push_back(new Layer(newID, imgUrl, default_val));
		
		this.local.layers.get(newID).atlas.onload = function() {
			main.Update();
		}
		
		this.local.layerCount++;
		
		return(newID);
	};
	//---------------------------------------------------------------------------------------------------------------
	// Deletes the most recently added layer
	Manager.prototype.pop_back = function() {
		var main = this;
		if(main.local.layers.length > 0) {
			var deletion = main.local.layers.length-1;
			
			main.local.layers.get(deletion).elem.remove();
			main.local.layers.remove(deletion);
			
			var layerList = $('.layer-tool');
			layerList[layerList.length-1].remove();
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Returns the element (<canvas>) associated with the specified layer
	Manager.prototype.rtrnLayer = function(num) {
		if( (num >= 0) && (num < this.local.layers.length) ) {
			//return this.local.layers[num].ctx;
			return this.local.layers.get(num);
		}
		
		return null;
	};
	//---------------------------------------------------------------------------------------------------------------
	// Returns number of layers
	Manager.prototype.size = function() {
		return this.local.layers.length;
	};
	//---------------------------------------------------------------------------------------------------------------
	// Single Draw No Save. Draws a single tile to a canvas without touching the data.
	Manager.prototype.SingleDrawNS = function(x, y, paint_tile, layer) {
		var main = this;
		// Position of the tile relative to the canvas
		var x_correct = x-Origins.getInstance().origin_x;
		var y_correct = 35-(y-Origins.getInstance().origin_y);
		
		if(main.local.layers.length >= layer) {
				
			main.local.layers.get(layer).ctx.clearRect(x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);

			if( ( (x >= 0) && (x < MAP_SIZE) ) && ( (y >= 0) && (y < MAP_SIZE) ) ) {
				
				if(paint_tile >= 0) {
					var tile_x = paint_tile % TILES_PER_ROW;
					var tile_y = parseInt(paint_tile / TILES_PER_ROW);
				
					//main.local.ctx.putImageData(main.local.atlasData, (x_correct*TILE_SIZE)-(paint_tile*TILE_SIZE), (y_correct*TILE_SIZE), (tile_x*TILE_SIZE), (tile_y*TILE_SIZE), TILE_SIZE, TILE_SIZE);
					main.local.layers.get(layer).ctx.drawImage(main.local.layers.get(layer).atlas, tile_x*TILE_SIZE, tile_y*TILE_SIZE, TILE_SIZE, TILE_SIZE, x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);
				}
				this.SetTileRecord(x_correct, y_correct, layer, paint_tile);
				
				if(x == main.local.start_x && y == main.local.start_y) {
					main.local.layers.get(layer).ctx.drawImage(main.local.start_img, 0, 0, TILE_SIZE, TILE_SIZE, x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);
				}
			}
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Draws to the canvas, and will update the data within the layer. Drawing varies with mode.
	Manager.prototype.Draw = function(x, y, paint_tile, mode, layer) {
		
		var main = this;
		var rtrn_undo;
		
		if( ( (x >= 0) && (x < MAP_SIZE) ) && ( (y >= 0) && (y < MAP_SIZE) ) ) {
			
			var tile = main.GetDataXY(x, y, layer);
			
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
					layer: layer,
					un_tile: tile
				};
				
				main.SingleDrawNS(x, y, paint_tile, layer);
				main.SetDataXY(x, y, paint_tile, layer);
			}
			
			if(mode == DRAW_MODE_LINE) {
				
				var max_right = x;
				var max_left = x;
				
				// Filling right
				for(var i = (x+1); i < MAP_SIZE; i++) {
					if(main.GetDataXY(i, y, layer) == tile) {
						main.SetDataXY(i, y, paint_tile, layer);
						
						var tile_x = paint_tile % TILES_PER_ROW;
						var tile_y = parseInt(paint_tile / TILES_PER_ROW);
						
						main.SingleDrawNS(i, y, paint_tile, layer);
						
						max_right++;
					} else {
						break;
					}
				}
				// Filling left
				for(var i = (x-1); i >= 0; i--) {
					if(main.GetDataXY(i, y, layer) == tile) {
						main.SetDataXY(i, y, paint_tile, layer);
						
						var tile_x = paint_tile % TILES_PER_ROW;
						var tile_y = parseInt(paint_tile / TILES_PER_ROW);
						
						main.SingleDrawNS(i, y, paint_tile, layer);
						
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
					un_mode: mode,
					layer: layer
				};
				
			} else if(mode == DRAW_MODE_ROUND) {
				
				var rtile = main.Edge(x, y, paint_tile, layer);
				
				if(rtile != null) {
					main.SetDataXY(x, y, rtile, layer);
					
					var tile_x = rtile % TILES_PER_ROW;
					var tile_y = parseInt(rtile / TILES_PER_ROW);
					
					main.SingleDrawNS(x, y, rtile, layer);
					
					var rtrn_undo = {
						un_x: x,
						un_y: y,
						un_mode: mode,
						layer: layer,
						un_tile: tile
					};
				} else {
					rtrn_undo = null;
				}
				
			}
		}
		
		return rtrn_undo;
	};
	//--------------------------------------------------------------
	// Replaces the currently selected tile with a different one depending on it's surroundings.
	// The purpose is to "round" the edges of maps.
	Manager.prototype.Edge = function(x, y, tile, layer) {
		var main = this;
		var rtrn = null;
		
		var selected = main.GetDataXY(x, y, layer);
		
		var found = 0;
		var total = 0;
		// Tracks the current iteration
		var inc = 1;
		
		if(selected == tile) {
			for(var j = -1; j <= 1; j+=2) {
				for(var i = 1; i >= -1; i-=2) {
					if( between(main.GetDataXY(x+i, y, layer), tile, tile+4) && between(main.GetDataXY(x, y+j, layer), tile, tile+4)) {
						found = inc;
						total++;
					}
					inc++;
				}
			}
		} else {
			for(var j = -1; j <= 1; j+=2) {
				for(var i = 1; i >= -1; i-=2) {
					if( (main.GetDataXY(x+i, y, layer) == tile) && (main.GetDataXY(x, y+j, layer)== tile)) {
						found = inc;
						total++;
					}
					inc++;
				}
			}
		}
		
		// Only change the tile if ONE possible rounded edge is found
		if(total == 1) {
			rtrn = tile+found;
		}
		
		return rtrn;
	};
	//---------------------------------------------------------------------------------------------------------------
	// Obtains the tile ID at a specific X/Y coordinate
	Manager.prototype.GetDataXY = function(x, y, layer) {
		if( (x >= 0 && x < MAP_SIZE) && (y >= 0 && y < MAP_SIZE) ) {
			var location = x+(y*MAP_SIZE);
			return this.local.layers.get(layer).data[location];
		}
		return -1;
	};
	//--------------------------------------------------------------
	// Sets the tile ID at a specific X/Y coordinate
	Manager.prototype.SetDataXY = function(x, y, num, layer) {
		if( (x >= 0 && x < MAP_SIZE) && (y >= 0 && y < MAP_SIZE) ) {
			var location = x+(y*MAP_SIZE);
			this.local.layers.get(layer).data[location] = num;
		}
	};
	//--------------------------------------------------------------
	// Compresses all layers and returns a binary string
	Manager.prototype.ExportCompressed = function() {
		
		var combine = new DynamicBytes();
		
		for(var i = 0; i < this.local.layers.length; i++) {
			// Data type
			combine.push_back32(0);
			
			var compressed = pako.deflate(this.local.layers.get(i).data);
			// Data length
			combine.push_back32(compressed.byteLength);
			
			combine.append(compressed);
		}
		
		//var rtrn = combine.Export8Bytes();
		var rtrn = combine.ExportCharArray();
		
		alert("Size: " + rtrn.length);
		
		return rtrn;
	}
	//--------------------------------------------------------------
	// Takes in a compressed string and builds the data for the layers
	Manager.prototype.LoadCompressed = function(data) {
		
	}
	
	return Manager;
}();
//-----------------------------------------------------------------------------------------------------------
