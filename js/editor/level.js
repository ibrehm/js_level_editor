//-----------------------------------------------------------------------------------------------------------
var Level = function() {
	var local = {
		data: null,
		undo: new List(),
		redo: new List(),
		start_x: -1,
		start_y: -1,
		//atlas: new Image(),
		start_img: new Image(),
		layers: new LayerManager(),
		//ctx: $('#canvas_layer-0')[0].getContext('2d')
	};
	
	var self = this;
	
	var id = local.layers.push_back("./img/texture_atlas.png");
	
	//local.atlas.src = "./img/texture_atlas.png";
	local.start_img.src = "./img/start.png";
	
	local.data = new Array(MAP_SIZE*MAP_SIZE);
	
	//local.atlas.onload = function() {
	
		// The concept if the current data variable is that each tile is a list, for potential efficiency with layers.
		// ex: local.data[tile_array][layer] = tile data
		// May not keep it this way though.
		//for(var i = 0; i < (MAP_SIZE*MAP_SIZE); i++) {
		//	//local.data[i] = 0;
		//	local.data[i] = [];
		//	local.data[i].push(0);
			
		//	var cell_x = i % MAP_SIZE;
		//	var cell_y = 35-parseInt(i / MAP_SIZE);
			
		//	SingleDrawNS(cell_x, cell_y, 0);
		//}
	//}
	
	//---------------------------------------------------------------------------------------------------------------
	// Single Draw (No Save)
	//function SingleDrawNS(x, y, paint_tile, layer = 0) {
	//	local.layers.SingleDrawNS(x, y, paint_tile, layer);
	//}
	//--------------------------------------------------------------
	self.AddLayer = function() {
		local.layers.push_back("./img/texture_atlas.png", -1);
	}
	//--------------------------------------------------------------
	self.RemoveLayer = function() {
		local.layers.pop_back();
	}
	//--------------------------------------------------------------
	self.UpdateWindow = function(keyPress = []) {
		
		/*
		var x_diff = 0;
		var y_diff = 0;
		
		if(keyPress[keys.UP_ARROW]) {
			y_diff++;
		} else if(keyPress[keys.DOWN_ARROW]) {
			y_diff--;
		}
		
		if(keyPress[keys.RIGHT_ARROW]) {
			x_diff--;
		} else if(keyPress[keys.LEFT_ARROW]) {
			x_diff++;
		}
		local.imgData = local.ctx.getImageData(x_diff*TILE_SIZE, y_diff*TILE_SIZE, 1260, 700);
		local.ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
		
		local.ctx.putImageData(local.imgData, 0, 0);
		*/
		
		local.layers.Update();
		
		/*
		
		for(var l = 0; l < local.layers.size(); l++) {
			for(var i = Origins.getInstance().origin_x; i < Origins.getInstance().origin_x+ VIEWPORT_TILE_WIDTH; i++) {
				for(var j = Origins.getInstance().origin_y; j < Origins.getInstance().origin_y+ VIEWPORT_TILE_HEIGHT; j++) {
					local.layers.SingleDrawNS(i, j, self.GetDataXY(i, j), l);
				}
			}
		}
		*/
		
	}
	//--------------------------------------------------------------
	self.Undo = function() {
		if(local.undo.length != 0) {
			
			var info = local.undo.get(local.undo.length-1);
			
			//var cell = self.rtrn_cell(info.un_x, info.un_y);
			var old_tile = local.layers.GetDataXY(info.un_x, info.un_y, info.layer);
			
			if( (info.un_mode == DRAW_MODE_ROUND) || (info.un_mode == DRAW_MODE_SINGLE)) {
				local.layers.Draw(info.un_x, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
			} else if(info.un_mode == DRAW_MODE_LINE) {
				
				for(var i = info.un_left; i <= info.un_right; i++) {
					local.layers.Draw(i, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
				}
			}
			
			info.un_tile = old_tile;
			
			local.redo.push_back(info);
			local.undo.pop_back();
		}
	}
	//--------------------------------------------------------------
	self.Redo = function() {
		if(local.redo.length != 0) {
			var info = local.redo.get(local.redo.length-1);
			
			//var cell = self.rtrn_cell(info.un_x, info.un_y);
			var old_tile = local.layers.GetDataXY(info.un_x, info.un_y, info.layer);
			
			if(info.un_mode == DRAW_MODE_ROUND) {
				info.un_mode = DRAW_MODE_SINGLE;
				local.layers.Draw(info.un_x, info.un_y, info.un_tile, info.un_mode, info.layer);
			} else if(info.un_mode == DRAW_MODE_LINE) {
				
				for(var i = info.un_left; i <= info.un_right; i++) {
					local.layers.Draw(i, info.un_y, info.un_tile, DRAW_MODE_SINGLE, info.layer);
				}
				
			} else if(info.un_mode == DRAW_MODE_SINGLE) {
				local.layers.Draw(info.un_x, info.un_y, info.un_tile, info.un_mode, info.layer);
			}
			
			info.un_tile = old_tile;
			
			local.undo.push_back(info);
			local.redo.pop_back();
		}
	}
	//--------------------------------------------------------------
	self.rtrn_cell = function(x, y) {
		var str = '#cell-' + x + '-' + y;
		
		return $(str);
	}
	//--------------------------------------------------------------
	self.TileDraw = function(x, y, paint_tile, mode, layer) {
		
		var x_size = $('#selector_width').val();
		var y_size = $('#selector_height').val();
		
		for(var ys = 0; ys < y_size; ys++) {
			for(var xs = 0; xs < x_size; xs++) {
				
				var set_tile = paint_tile+xs;
				if(set_tile >= (TILES_PER_ROW*TILES_PER_ROW)) {
					set_tile = (TILES_PER_ROW * TILES_PER_ROW)-1;
				}
				
				var undo = local.layers.Draw(x+xs, y-ys, set_tile, mode, layer);
				local.redo.Clear();
				
				if(undo != null) {
					local.undo.push_back(undo);
					if(local.undo.length > MAX_UNDO) {
						local.undo.remove(0);
					}
				}
			}
			paint_tile += TILES_PER_ROW;
		}
	}
	
	self.PlaceStart = function(x, y) {
		local.start_x = x;
		local.start_y = y;
	}
	//--------------------------------------------------------------
	self.MapSize = function() {
		return MAP_SIZE;
	}
	//--------------------------------------------------------------
	self.GetData = function(i) {
		return local.data[i][0];
	}
	//--------------------------------------------------------------
	self.SetData = function(i, num) {
		local.data[i][0] = num;
	}
	//--------------------------------------------------------------
	self.UpdateLvList = function() {
		var cmd = {
			action: 'level_list'
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
	self.ViewData = function() {
		alert(JSON.stringify(local.data));
	}
	//--------------------------------------------------------------
	self.Save = function() {
		var cmd = {
			action: 'level_save',
			lv_name: $('#level_name').val().replace([" "], ["_"]),
			//data: JSON.stringify(Array.from(local.layers.rtrnLayer(0).data)),
			start_x: local.start_x,
			start_y: local.start_y
		};
		// Update level name field in case changes were made
		$('#level_name').val(cmd.lv_name);
		
		var request = $.param(cmd);
		//[dataCompressed], {type: "application/octet-stream"}
		//var test = new Uint8Array(local.layers.rtrnLayer(0).data.buffer);
		request += "&data=" + new TextDecoder("utf-8").decode(local.layers.rtrnLayer(0).data);;
		alert(request);
		
		$.ajax({
			'type': "POST",
			'global': false,
			'dataType': 'text',
			'url': "./server.php",
			'data': request,
			'processData': false,
			'success': function(data) {
				$('#message').html(data);
				self.UpdateLvList();
				$('#save_hide').hide();
			}
		});
			
		/*
		$.post("./server.php", request)
			.done( function(data) {
				$('#message').html(data);
				self.UpdateLvList();
				$('#save_hide').hide();
			});
		*/
	}
	//--------------------------------------------------------------
	self.Load = function() {
		
		local.undo.Clear();
		local.redo.Clear();
		
		var cmd = {
			action: 'level_load',
			lv_name: $('#level_list').val()
		};
		
		var request = $.param(cmd);
		var layer = local.layers.rtrnLayer(0);
		
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
				//local.data = obj['data'];
				
				$('#message').html(message);
				
				for(var i = 0; i < (obj['data'].length-2); i++) {
					layer.data[i] = obj['data'][i];
					//local.data[i][0] = obj['data'][i];
					
					/*
					var cell_x = i % MAP_SIZE;
					var cell_y = parseInt(i / MAP_SIZE);
					
					var value = local.data[i];
					
					Draw(cell_x, cell_y, value, DRAW_MODE_SINGLE);
					*/
				}
				self.UpdateWindow();
				
				local.start_x = obj['data'][obj['data'].length-2];
				local.start_y = obj['data'][obj['data'].length-1];
				
				$('#level_name').val(cmd.lv_name);
				$('#load_hide').hide();
			}
		});
		
		/*
		$.post("./server.php", request)
			.done( function(data) {
				
				var obj = $.parseJSON(data);
				
				var message = obj['message'];
				//local.data = obj['data'];
				
				$('#message').html(message);
				
				for(var i = 0; i < (obj['data'].length-2); i++) {
					layer.data[i] = obj['data'][i];
					//local.data[i][0] = obj['data'][i];
					
					//var cell_x = i % MAP_SIZE;
					//var cell_y = parseInt(i / MAP_SIZE);
					
					//var value = local.data[i];
					
					//Draw(cell_x, cell_y, value, DRAW_MODE_SINGLE);
				}
				self.UpdateWindow();
				
				local.start_x = obj['data'][obj['data'].length-2];
				local.start_y = obj['data'][obj['data'].length-1];
				
				$('#level_name').val(cmd.lv_name);
				$('#load_hide').hide();
				
			});
		*/
	}
	//--------------------------------------------------------------
}