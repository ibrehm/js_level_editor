// (C) 2017 Ian Brehm
//-----------------------------------------------------------------------------------------------------------
// Layer Manager. Functions to manage the data.
var LayerManager = function(){
	var Manager = function() {
		var self = this;
		// layerCount tracks the amount of layers created (Never resets)
		// counter current tracks the amount of tiles drawn per screen Update
		this.local = {
			width: 0,
			height: 0,
			canvas_type: 0,
			layers: new List(),
			undo: new List(),
			redo: new List(),
			counter: 0
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.Width = function() {
		return parseInt(this.local.width);
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.Height = function() {
		return parseInt(this.local.height);
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.CanvasType = function() {
		return parseInt(this.local.canvas_type);
	};
	//---------------------------------------------------------------------------------------------------------------
	// Keeps track of the possible undo's the user can do
	Manager.prototype.Undo = function() {
		var main = this;
		if(main.local.undo.length != 0) {
			
			var info = main.local.undo.get(main.local.undo.length-1);
			
			var old_tile = main.GetDataXY(info.un_x, info.un_y, info.layer);
			
			if( (info.un_mode == DRAW_MODE_ROUND) || (info.un_mode == DRAW_MODE_SINGLE)) {
				main.Draw(info.un_x, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
			} else if(info.un_mode == DRAW_MODE_LINE) {
				
				for(var i = info.un_left; i <= info.un_right; i++) {
					main.Draw(i, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
				}
			}
			
			info.un_tile = old_tile;
			
			main.local.redo.push_back(info);
			main.local.undo.pop_back();
		}
	}
	//---------------------------------------------------------------------------------------------------------------
	// Keeps track of the possible redo's the user can do after using the undo function
	Manager.prototype.Redo = function() {
		var main = this;
		
		if(main.local.redo.length != 0) {
			var info = main.local.redo.get(main.local.redo.length-1);
			
			var old_tile = main.GetDataXY(info.un_x, info.un_y, info.layer);
			
			if(info.un_mode == DRAW_MODE_ROUND) {
				info.un_mode = DRAW_MODE_SINGLE;
				main.Draw(info.un_x, info.un_y, info.un_tile, info.un_mode, info.layer);
			} else if(info.un_mode == DRAW_MODE_LINE) {
				
				for(var i = info.un_left; i <= info.un_right; i++) {
					main.Draw(i, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
				}
				
			} else if(info.un_mode == DRAW_MODE_SINGLE) {
				main.Draw(info.un_x, info.un_y, info.un_tile, info.un_mode, info.layer);
			}
			
			info.un_tile = old_tile;
			
			main.local.undo.push_back(info);
			main.local.redo.pop_back();
		}
	}
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
		
		var y_reverse = (VIEWPORT_TILE_HEIGHT-1)-(y-Origins.getInstance().origin_y);
		
		var tile = this.GetDataXY(x_reverse, y_reverse, layer);
		var view_tile = this.GetTileRecord(x, y, layer);
		
		if(view_tile != tile) {
			//$('#debugiii').append("<font color=#FF0000>Drawing</font><br>");
			this.local.counter++;
			this.SetTileRecord(x, y, layer, tile);
			this.SingleDrawNS(x_reverse, y_reverse, tile, layer);
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Refreshes the screen.
	Manager.prototype.Update = function() {
		var main = this;
		
		for(var layer = 0; layer < this.local.layers.length; layer++) {
			for(var y = 0; y < VIEWPORT_TILE_HEIGHT; y++) {
				for(var x = 0; x < VIEWPORT_TILE_WIDTH; x++) {
					this.UpdateCanvasRegion(x, y, layer);
				}
			}
		}
		//alert(this.local.counter);
		$('#debugii').html("Wrote " + this.local.counter + " tiles.  " + ((this.local.counter/(VIEWPORT_TILE_HEIGHT*VIEWPORT_TILE_WIDTH))*100).toFixed(2) + "%");
		this.local.counter = 0;
		
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.ClearUpdateRecord = function() {
		var temp_length = VIEWPORT_TILE_WIDTH * VIEWPORT_TILE_HEIGHT;
		for(var layer = 0; layer < this.local.layers.length; layer++) {
			var i_layer = this.local.layers.get(layer);
			for(var i = 0; i < i_layer.drawRecord.length; i++) {
				i_layer.drawRecord[i] = -1;
			}
		}
	}
	//---------------------------------------------------------------------------------------------------------------
	// Adds a new layer. The ID of the layer created is returned.
	Manager.prototype.push_back = function(width, height, type, imgNum, default_val = 0) {
		var main = this;
		
		main.local.width = width;
		main.local.height = height;
		main.local.canvas_type = type;
		
		var newID = main.local.layers.length;
		
		$('#layer-list').append(
			"<span class='layer-tool'>" +
			"	<input class='layer-select' type='radio' name='layer-select' value=" + this.local.layers.length + ">Layer " + this.local.layers.length +
			"<input class='layer-toggle' type='checkbox' checked data-layer=" + this.local.layers.length + "><br>" +
			"</span>"
		);
		
		this.local.layers.push_back(new Layer(width, height, newID, imgNum, default_val));
		
		main.setTexture(newID, imgNum);
		
		//this.local.layers.get(newID).atlas.onload = function() {
		//	main.Update();
		//}
		
		return(newID);
	};
	//---------------------------------------------------------------------------------------------------------------
    // Changes the image used for the layer
    Manager.prototype.setTexture = function(num, imgNum) {
		var main = this;
		
		var temp_layer = main.local.layers.get(num);
		temp_layer.setTexture(imgNum);
		
		temp_layer.atlas.onload = function() {
			
			main.ClearUpdateRecord();
			main.Update();
		}
    }
    //---------------------------------------------------------------------------------------------------------------
    // Obtains the image used for the layer
    Manager.prototype.getTexture = function(num) {
		var main = this;
		
		var temp_layer = main.local.layers.get(num);
		
		return(temp_layer.imgNum);
    }
    //---------------------------------------------------------------------------------------------------------------
	// Clears the layers
	Manager.prototype.clear = function() {
		$('#layer-list').html('');
		$('#level_canvas').html('');
		this.local.layers.Clear();
		this.local.undo.Clear();
		this.local.redo.Clear();
	}
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
	// Deletes the most recently added layer
	Manager.prototype.remove = function(num = -1) {
		var main = this;
		if(main.local.layers.length > 0) {
			var deletion = main.local.layers.length-1;
			
			main.local.layers.get(deletion).elem.remove();
			
			if(num != -1) {
				deletion = num;
			}
			
			main.local.layers.remove(deletion);
			
			for(var i = deletion; i < main.local.layers.length; i++) {
				main.local.layers.get(i).UpdateElement(i);
			}
			
			var layerList = $('.layer-tool');
			layerList[layerList.length-1].remove();
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	Manager.prototype.Move = function(num, direction) {
		var main = this;
		if(direction == 'u') {
			if(num < (main.local.layers.length-1)) {
				main.local.layers.swap(num, num+1);
				main.local.layers.get(num).UpdateElement(num);
				main.local.layers.get(num+1).UpdateElement(num+1);
			}
		} else {
			if(num > 0) {
				main.local.layers.swap(num, num-1);
				main.local.layers.get(num).UpdateElement(num);
				main.local.layers.get(num-1).UpdateElement(num-1);
			}
		}
		main.Update();
	}
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
	//--------------------------------------------------------------
	Manager.prototype.TileDraw = function(x, y, paint_tile, mode, layer) {
		
		var main = this;
		
		var x_size = $('#selector_width').val();
		var y_size = $('#selector_height').val();
		
		for(var ys = 0; ys < y_size; ys++) {
			for(var xs = 0; xs < x_size; xs++) {
				
				var set_tile = paint_tile+xs;
				if(set_tile >= (TILES_PER_ROW*TILES_PER_ROW)) {
					set_tile = (TILES_PER_ROW * TILES_PER_ROW)-1;
				}
				
				var undo = main.Draw(x+xs, y-ys, set_tile, mode, layer);
				main.local.redo.Clear();
				
				if(undo != null) {
					main.local.undo.push_back(undo);
					if(main.local.undo.length > MAX_UNDO) {
						main.local.undo.remove(0);
					}
				}
			}
			paint_tile += TILES_PER_ROW;
		}
	}
	//---------------------------------------------------------------------------------------------------------------
	// Single Draw No Save. Draws a single tile to a canvas without touching the data.
	Manager.prototype.SingleDrawNS = function(x, y, paint_tile, layer) {
		var main = this;
		// Position of the tile relative to the canvas
        
		var x_correct = x-Origins.getInstance().origin_x;
		var y_correct = (VIEWPORT_TILE_HEIGHT-1)-(y-Origins.getInstance().origin_y);
		
		if(main.local.layers.length >= layer) {
				
			main.local.layers.get(layer).ctx.clearRect(x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);

			if( ( (x >= 0) && (x < main.local.width) ) && ( (y >= 0) && (y < main.local.height) ) ) {
				
				if(paint_tile >= 0) {
					var tile_x = paint_tile % TILES_PER_ROW;
					var tile_y = parseInt(paint_tile / TILES_PER_ROW);
				
					main.local.layers.get(layer).ctx.drawImage(main.local.layers.get(layer).atlas, tile_x*TILE_SIZE, tile_y*TILE_SIZE, TILE_SIZE, TILE_SIZE, x_correct*TILE_SIZE, y_correct*TILE_SIZE, TILE_SIZE, TILE_SIZE);
				}
				this.SetTileRecord(x_correct, y_correct, layer, paint_tile);
			}
		}
	};
	//---------------------------------------------------------------------------------------------------------------
	// Draws to the canvas, and will update the data within the layer. Drawing varies with mode.
	Manager.prototype.Draw = function(x, y, paint_tile, mode, layer) {
		
		var main = this;
		var rtrn_undo;
		
		if( ( (x >= 0) && (x < main.local.width) ) && ( (y >= 0) && (y < main.local.height) ) ) {
			
			var tile = main.GetDataXY(x, y, layer);

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
				
				if(tile != paint_tile) {
					var max_right = x;
					var max_left = x;
					
					// Filling right
					for(var i = (x+1); i < main.local.width; i++) {
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
				} else {
					rtrn_undo = null;
				}
				
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
		var main = this;
		if( (x >= 0 && x < main.local.width) && (y >= 0 && y < main.local.height) ) {
			var location = x+(y*main.local.width);
			return this.local.layers.get(layer).data[location];
		}
		return -1;
	};
	//--------------------------------------------------------------
	// Sets the tile ID at a specific X/Y coordinate
	Manager.prototype.SetDataXY = function(x, y, num, layer) {
		var main = this;
		if( (x >= 0 && x < main.local.width) && (y >= 0 && y < main.local.height) ) {
			var location = x+(y*main.local.width);
			this.local.layers.get(layer).data[location] = num;
		}
	};
	//--------------------------------------------------------------
	Manager.prototype.UpdateLvList = function() {
		var cmd = {
			action: 'level_list',
			save_loc: DATA_LOCATIONS[NAMES[$('#canvas_type').val()]]
		};
		
		var request = $.param(cmd);
		
		$.post("./server.php", request)
			.then( function(data) {
				
				var obj = $.parseJSON(data);
				
				var list = obj.list;
				
				var html = "";
				
				for(var i = 0; i < list.length; i++) {
					html += "<option value='" + list[i] + "'";
					
					if(list[i] == $('#level_name').val()) {
						html += " selected";
					}
					
					html += ">" + list[i] + "</option>";
				}
				
				$('#level_list').html(html);
				
			});
	}
	//--------------------------------------------------------------
	Manager.prototype.Save = function() {
		var main = this;
		
		var cmd = {
			action: 'level_save',
			lv_name: $('#level_name').val().replace([" "], ["_"]),
			canvas_type: main.local.canvas_type,
			save_loc: DATA_LOCATIONS[NAMES[main.local.canvas_type]]
		};
		// Update level name field in case changes were made
		$('#level_name').val(cmd.lv_name);
		
		var request = $.param(cmd);
		
		var data = JSON.stringify(main.ExportCompressed());
		
		request += "&data=" + data;
		
		$.ajax({
			'type': "POST",
			'global': false,
			'dataType': 'text',
			'url': "./server.php",
			'data': request,
			'processData': true,
			'success': function(data) {
				$('#message').html(data);
				main.UpdateLvList();
				$('#save_hide').hide();
			}
		});
		
	}
	//--------------------------------------------------------------
	Manager.prototype.Load = function(str = "") {
		
		var main = this;
		
		if(str == "") {
			str = $('#level_list').val();
		}
		
		var cmd = {
			action: 'level_load',
			lv_name: str,
			save_loc: DATA_LOCATIONS[NAMES[$('#canvas_type').val()]]
		};
		
		var request = $.param(cmd);
		
		$.ajax({
			'type': "POST",
			'global': false,
			'dataType': 'text',
			'url': "./server.php",
			'data': request,
			'processData': false,
			'success': function (data) {
				
				var obj = $.parseJSON(data);
				
				var message = obj['message'];
				
				$('#message').html(message);
				
				main.LoadCompressed(obj['data']);
				
				if(NAMES[main.CanvasType()] == "Objects") {
					Origins.getInstance().origin_x = -parseInt((VIEWPORT_TILE_WIDTH/2)-( main.Width() /2));
					Origins.getInstance().origin_y = -parseInt((VIEWPORT_TILE_HEIGHT/2)-( main.Height() /2));
					main.Update();
				}
				
				$('#level_name').val(cmd.lv_name);
				$('#load_hide').hide();
			}
		});
	}
	//--------------------------------------------------------------
	// Compresses all layers and returns a binary string
	Manager.prototype.ExportCompressed = function() {
		var main = this;
		var combine = new DynamicBytes();
		
		combine.push_back16(main.local.width);
		combine.push_back16(main.local.height);
		combine.push_back8(main.local.canvas_type);
		combine.push_back16(this.local.layers.length);
		
		for(var i = 0; i < LINK_TOTAL; i++) {
			var str = "#map_link_" + i;
			var value = $(str).val();
			combine.push_back16(value);
		}
		
		for(var i = 0; i < this.local.layers.length; i++) {
			
			var temp_layer = main.local.layers.get(i);
			// Store texture/tilemap number
			combine.push_back16(temp_layer.imgNum);
			combine.push_back8(temp_layer.above);
			
			// # My Compression
			var compressed = MapCompress.deflate(temp_layer.data);
			
			// Data length
			combine.push_back32(compressed.byteLength);
			
			combine.append(compressed);
		}
		
		var rtrn = combine.ExportCharArray();
		
		return rtrn;
	}
	//--------------------------------------------------------------
	// Takes in a compressed string and builds the data for the layers
	Manager.prototype.LoadCompressed = function(data) {
		
		var main = this;
		main.clear();
		
		var combine = new DynamicBytes();
		combine.appendCharArray(data);
		
		var width =  combine.get16();
		var height = combine.get16();
		var type = combine.get8();
		var layers = combine.get16();
		
		for(var i = 0; i < LINK_TOTAL; i++) {
			var value = combine.get16();
			var str = "#map_link_" + i;
			$(str).val(value);
		}
		
		for(var i = 0; i < layers; i++) {
			
			var tilemap = combine.get16();
			var above = combine.get8();
			var size = combine.get32();
			var data = combine.getUBytes(size);
			var length = (width * height);
			
			// # My decompression
			var layer_data = MapCompress.inflate(data, length);
			
			main.push_back(width, height, type, tilemap);
			
			var layer = main.local.layers.get( main.local.layers.length-1 );
			
			layer.data = layer_data;
			layer.above = above;
		}
		
		main.Update();
	}
	
	return Manager;
}();
//-----------------------------------------------------------------------------------------------------------
