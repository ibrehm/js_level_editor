// (C) 2018 Ian Brehm
//-----------------------------------------------------------------------------------------------------------
// Level Editor mostly handles the events on the page
$(document).ready( function() {
	
	var app = (function() {
		
		function App() {
			
			var local = {
				//map: new Level(),
				map: new LayerManager(),
				y_row: 0,
				background: '',
				paint_tile: 0,
				target_layer: 0,
				mode: 0,
				last_x: -1,
				last_y: -1,
				last_menu: '#file_selector',
				
				changes: false,
				mousedown: false,
				isTyping: false,
				startPlace: false,
				grid_display: true
			};
			
			$('#obj-layer').html("<canvas id='obj-layer' class='canvas_layers' width='" + VIEWPORT_WIDTH + "' height='" + VIEWPORT_HEIGHT + "'></canvas>");
            
			$("#grid_overlay").append("<table>");
            for(var i = 0; i < VIEWPORT_TILE_HEIGHT; i++) {
				$("#grid_overlay").append("<tr>");
				for(var j = 0; j < VIEWPORT_TILE_WIDTH; j++) {
					$("#grid_overlay").append(
						"<td style='padding: 0px 0px 0px 0px;" +
						"border-bottom: 1px solid rgba(0, 0, 0, 0.45);" +
						"border-left: 1px solid rgba(0, 0, 0, 0.45);" + 
						"width: " + (TILE_SIZE-1) + "px;" +
						"height: " + (TILE_SIZE-1) + "px;'" +
						"></td>"
					);
				}
				$("#grid_overlay").append("</tr>");
            }
            $("#grid_overlay").append("</table>");
			
			var self = this;
			
			//---------------------------------------------------------------------------------------------------------------
			function Menu_Movement(id) {
				if(id != local.last_menu) {
					last = $(local.last_menu);
					if(last.hasClass('palette_show')) {
						last.toggleClass("palette_hidden", true);
						last.toggleClass("palette_show", false);
						local.isTyping = false;
					}
					local.last_menu = id;
				}
				var select = $(id);
				if(select.hasClass('palette_show')) {
					select.toggleClass("palette_hidden", true);
					select.toggleClass("palette_show", false);
					local.isTyping = false;
				} else {
					select.toggleClass("palette_hidden", false);
					select.toggleClass("palette_show", true);
					local.isTyping = true;
				}
			}
			//---------------------------------------------------------------------------------------------------------------
			self.init = function() {
				
				//UpdatePalette(0);
				$('#palette_texture').css({
					"width": TEXTURE_HIGHEST + "px",
					"height": TEXTURE_HIGHEST + "px"
				});
				$('#palette_full').css({
					"width": TEXTURE_HIGHEST + "px",
					"height": TEXTURE_HIGHEST + "px"
				});
				$('#canvas_cover,#palette_cover').css({
					"width": TILE_SIZE-1 + "px",
					"height": TILE_SIZE-1 + "px"
				});
				$('#current_tile').css({
					"width": TILE_SIZE + "px",
					"height": TILE_SIZE + "px"
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#selector_width').on('change', function(event) {
					var value = $(this).val();
					$('#palette_cover,#canvas_cover').css({
						"width": (TILE_SIZE*value)-1 + "px"
					});
					$('#current_tile').css({
						"width": (TILE_SIZE*value) + "px"
					});
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#selector_height').on('change', function(event) {
					var value = $(this).val();
					$('#palette_cover,#canvas_cover').css({
						"height": (TILE_SIZE*value)-1 + "px"
					});
					$('#current_tile').css({
						"height": (TILE_SIZE*value) + "px"
					});
				});
                //---------------------------------------------------------------------------------------------------------------
				$('#texture_change').on('change', function(event) {
					var value = $(this).val();
					$('#palette_texture').css({
						"background-image": "url('" + IMG_LOCATIONS[NAMES[0]] + value + ".png')"
					});
					$('#current_tile').css({
						"background-image": "url('" + IMG_LOCATIONS[NAMES[0]] + value + ".png')"
					});
                    local.map.setTexture(local.target_layer, value);
				});
				//---------------------------------------------------------------------------------------------------------------
				$("#layer-list").on('change', "input:radio[name='layer-select']:checked", function(event) {
					var value = parseInt($(this).val());
					
					var texture = local.map.getTexture(value);
					$('#texture_change').val(texture);
					$('#palette_texture').css({
						"background-image": "url('" + IMG_LOCATIONS[NAMES[0]] + texture + ".png')"
					});
					
					$('#current_tile').css({
						"background-image": "url('" + IMG_LOCATIONS[NAMES[0]] + texture + ".png')"
					});
						
					local.target_layer = value;
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#layer-list').on('change', '.layer-toggle', function(event) {
					var value = $(this).data('layer');
					
					$("#canvas_layer-" + value).toggle();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#move_up').on('click', function(event) {
					local.map.Move(local.target_layer, 'u');
					if(local.target_layer < ($('.layer-tool').length-1)) {
						local.target_layer++;
						$("input[name=layer-select]").val([local.target_layer]);
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#move_down').on('click', function(event) {
					local.map.Move(local.target_layer, 'd');
					if(local.target_layer > 0) {
						local.target_layer--;
						$("input[name=layer-select]").val([local.target_layer]);
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#palette_texture').mousemove( function(event) {
					var pos = $(this).offset();
					var x = parseInt((event.pageX-pos.left));
					var y = parseInt((event.pageY-pos.top));
					
					$('#palette_cover').css({
						"top": parseInt(y/TILE_SIZE)*TILE_SIZE + "px",
						"left": parseInt(x/TILE_SIZE)*TILE_SIZE + "px"
						
					});
				});
				$('#palette_texture').on('click', function(event) {
					var pos = $(this).offset();
					var x = parseInt((event.pageX-pos.left)/TILE_SIZE);
					var y = parseInt((event.pageY-pos.top)/TILE_SIZE);
					
					local.paint_tile = x+(y*(TEXTURE_HIGHEST/TILE_SIZE));
					local.background = (x*-TILE_SIZE) + "px " + (y*-TILE_SIZE) + "px";
					$('#current_tile').css({'background-position':local.background});
					
					//Menu_Movement('#palette_selector');
					
				});
				$('#palette_texture').hover(function(event) {
					$('#palette_cover').show();
				}, function(event) {
					$('#palette_cover').hide();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#level_name').on('focusin', function(event) {
					local.isTyping = true;
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#level_name').on('focusout', function(event) {
					local.isTyping = false;
				});
				//---------------------------------------------------------------------------------------------------------------
				$(document).keydown(function(event) {
					
					pressed[event.which] = true;
					if(local.isTyping == false ) {
						
						$('#message').html("");
						
						if(NAMES[local.map.CanvasType()] == "Tilemaps") {
							if(pressed[keys.UP_ARROW]) {
								Origins.getInstance().origin_y++;
							} else if(pressed[keys.DOWN_ARROW]) {
								Origins.getInstance().origin_y--;
							}
							
							if(pressed[keys.LEFT_ARROW]) {
								Origins.getInstance().origin_x--;
							} else if(pressed[keys.RIGHT_ARROW]) {
								Origins.getInstance().origin_x++;
							}
							
							
							if(pressed[keys.UP_ARROW] || pressed[keys.DOWN_ARROW] || pressed[keys.LEFT_ARROW] || pressed[keys.RIGHT_ARROW]) {
								local.map.Update();
							}
						}
						
						if(pressed[keys.D]) {
							local.startPlace = false;
							local.mode = DRAW_MODE_SINGLE;
							$('#current_mode').html("Draw");
						} else if(pressed[keys.F]) {
							local.startPlace = false;
							local.mode = DRAW_MODE_LINE;
							$('#current_mode').html("Horizontal Fill");
						} else if(pressed[keys.R]) {
							local.startPlace = false;
							local.mode = DRAW_MODE_ROUND;
							$('#current_mode').html("Rounding");
						} else if(pressed[keys.E]) {
							local.mode = DRAW_MODE_ERASE;
							$('#current_mode').html("Erase");
						} else if(pressed[keys.Z]) {
							local.map.Undo();
						} else if(pressed[keys.X]) {
							local.map.Redo();
						}
						
					}
					
					if(pressed[keys.ESC]) {
						Menu_Movement(local.last_menu);
					}
					
				});
				//---------------------------------------------------------------------------------------------------------------
				$('.menu_moveable').on('click', function(event) {
					var id = "#" + $(this).parent().attr('id');
					Menu_Movement(id);
				});
				//---------------------------------------------------------------------------------------------------------------
				$(document).keyup(function(event) {
					delete pressed[event.which];
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#save').on('click', function(event) {
					
					if($('#save_hide').css("display") == "none") {
						$('#save_hide').show();
					} else {
						$('#save_hide').hide();
					}
					
					if($('#load_hide').css("display") != "none") {
						$('#load_hide').hide();
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#load').on('click', function(event) {
					local.map.UpdateLvList();
					
					if($('#load_hide').css("display") == "none") {
						$('#load_hide').show();
					} else {
						$('#load_hide').hide();
					}
					
					if($('#save_hide').css("display") != "none") {
						$('#save_hide').hide();
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#save-btn').on('click', function(event) {
					local.map.Save();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#load-btn').on('click', function(event) {
					local.map.Load();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#start').on('click', function(event) {
					if(local.startPlace == false) {
						local.startPlace = true;
						$('#current_mode').html("Start Placement");
						local.mode = DRAW_MODE_START;
					} else {
						local.startPlace = false;
						local.mode = DRAW_MODE_SINGLE;
						$('#current_mode').html("Draw");
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#QuickTravelGo').on('click', function(event) {
					var x_val = parseInt($('#GoToX').val());
					var y_val = parseInt($('#GoToY').val());
					
					Origins.getInstance().origin_x = x_val;
					Origins.getInstance().origin_y = y_val;
					
					local.map.Update();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#newCanvasGo').on('click', function(event) {
					var x_val = parseInt($('#new_canvas_x').val());
					var y_val = parseInt($('#new_canvas_y').val());
					var type = $('#canvas_type').val();
					
					if(x_val < 1) {
						x_val = 1;
					}
					if(y_val < 1) {
						y_val = 1;
					}
					
					if(NAMES[type] == "Tilemaps") {
						
					} else if(NAMES[type] == "Objects") {
						Origins.getInstance().origin_x = -parseInt((VIEWPORT_TILE_WIDTH/2)-(x_val/2));
						Origins.getInstance().origin_y = -parseInt((VIEWPORT_TILE_HEIGHT/2)-(y_val/2));
					}
					
					local.map.clear();
					
					$('#level_name').val("");
					
					local.map.push_back(x_val, y_val, type, 0, 0);
					
					local.map.Update();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#grid-on-off').on('click', function(event) {
					if(local.grid_display) {
						$('#grid_overlay').hide();
					} else {
						$('#grid_overlay').show();
					}
					local.grid_display = !local.grid_display;
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#add_layer').on('click', function(event) {
					local.map.push_back(local.map.Width(), local.map.Height(), local.map.CanvasType(), 0, -1);
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#remove_layer').on('click', function(event) {
					
					var layers = $('.layer-tool');
					local.map.remove(local.target_layer);
					
					if( (layers.length-1) == local.target_layer) {
						if(local.target_layer > 0) {
							local.target_layer--;
							$("input[name=layer-select]").val([local.target_layer]);
						}
					}
					local.map.Update();
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#level_canvas').mousedown( function(event) {
					local.mousedown = true;
					var pos = $(this).offset();
					// x and y are positions for the data in memory
					var x = parseInt((event.pageX-pos.left)/ TILE_SIZE)+Origins.getInstance().origin_x;
					var y = parseInt(( (VIEWPORT_HEIGHT-1)-(event.pageY-pos.top))/ TILE_SIZE)+Origins.getInstance().origin_y;
					
					local.last_x = x;
					local.last_y = y;
					
					if(local.mode != DRAW_MODE_START) {
						local.map.TileDraw(x, y, local.paint_tile, local.mode, local.target_layer);
					} else {
						local.map.TileDraw(x, y, -1, local.mode, local.target_layer);
						local.startPlace = false;
						local.mode = DRAW_MODE_SINGLE;
						$('#current_mode').html("Draw");
					}
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#level_canvas').mouseup( function(event) {
					local.mousedown = false;
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#level_canvas').mousemove( function(event) {
					var pos = $(this).offset();
					var x = parseInt((event.pageX-pos.left)/ TILE_SIZE )+Origins.getInstance().origin_x;
					var y = parseInt(( (VIEWPORT_HEIGHT-1)-(event.pageY-pos.top)) / TILE_SIZE)+Origins.getInstance().origin_y;
					
					var one = parseInt((event.pageY-pos.top)/TILE_SIZE);
					var two = parseInt((event.pageX-pos.left)/TILE_SIZE);
					$('#canvas_cover').css({
						'top': parseInt((event.pageY-pos.top)/TILE_SIZE)*TILE_SIZE-1 + "px",
						'left': parseInt((event.pageX-pos.left)/TILE_SIZE)*TILE_SIZE + "px"
					});
					
					if(local.mousedown) {
						if( (x != local.last_x) || (y != local.last_y)) {
							local.map.TileDraw(x, y, local.paint_tile, local.mode, local.target_layer);
							local.last_x = x;
							local.last_y = y;
						}
					}
					$('#debug').html("<br>X: " + x + ", Y: " + y);
					$('#debugiii').html(one + ", " + two);
				});
				//---------------------------------------------------------------------------------------------------------------
				$("#level_canvas").mousedown( function(event) {
					
					event.preventDefault();
					$("#level_name").blur();
					local.mousedown = true;
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#clear_test').click(function(event) {
					local.map.clear();
				});
				//---------------------------------------------------------------------------------------------------------------
				$(document).mouseup( function(event) {
					local.mousedown = false;
				});
				//---------------------------------------------------------------------------------------------------------------
				
				if(auto_load == null) {
					local.map.push_back(MAP_SIZE_W, MAP_SIZE_H, 0, 0, 0);
				} else {
					local.map.Load(auto_load);
				}
				local.map.UpdateLvList();
				
				$('#save_hide').hide();
				$('#load_hide').hide();
				$('#pool').hide();
				
			};
			
		};
		return new App();
		
	})().init();
});
