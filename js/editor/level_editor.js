//---------------------------------------------------------------------------------------------------------------
$(document).ready( function() {
	
	var app = (function() {
		
		function App() {
			
			var local = {
				map: new Level(),
				y_row: 0,
				background: '',
				paint_tile: 0,
				target_layer: 0,
				mode: 0,
				last_x: -1,
				last_y: -1,
			
				mousedown: false,
				isTyping: false,
				startPlace: false,
				grid_display: true
			};
			
			var self = this;
			
			//---------------------------------------------------------------------------------------------------------------
			function Palette_Movement() {
				var select = $('#palette_selector');
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
			/*
			function UpdatePalette(row = 0) {
				$('#palette').html("");
				for(var x = 0; x < TILES_PER_ROW; x++) {
					$('#palette').append("<div class='atlas' data-tile='" + ((row*TILES_PER_ROW) + x) + "' style='background-position: " + (-x * TILE_SIZE) + "px " + (-row * TILE_SIZE) + "px;'></div>");
				}
				$('.atlas').on('click', function(event) {
					local.paint_tile = $(this).data('tile');
					local.background = $(this).css('background-position');
					//alert(local.paint_tile);
					$('#current_tile').css({'background-position':local.background});
				});
			}
			*/
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
				$('#palette_cover').css({
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
					$('#palette_cover').css({
						"width": (TILE_SIZE*value)-1 + "px"
					});
					$('#current_tile').css({
						"width": (TILE_SIZE*value) + "px"
					});
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#selector_height').on('change', function(event) {
					var value = $(this).val();
					$('#palette_cover').css({
						"height": (TILE_SIZE*value)-1 + "px"
					});
					$('#current_tile').css({
						"height": (TILE_SIZE*value) + "px"
					});
				});
				//---------------------------------------------------------------------------------------------------------------
				$("#layer-list").on('change', "input:radio[name='layer-select']:checked", function(event) {
					var value = parseInt($(this).val());
						
					local.target_layer = value;
				});
				
				$('#layer-list').on('change', '.layer-toggle', function(event) {
					var value = $(this).data('layer');
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
					
					Palette_Movement();
					
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
							local.map.UpdateWindow(pressed);
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
						
						if(pressed[keys.T]) {
							local.map.ViewData();
						}
						
						//$('#debug').html("<br>" + local.origin_x + ", " + local.origin_y + "<br>" + local.TilePool.length);
						
					}
					
					if(pressed[keys.ESC]) {
						Palette_Movement();
					}
					
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#palette_tab').on('click', function(event) {
					Palette_Movement();
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
					local.map.AddLayer();
					/*
					$("input:radio[name='layer-select']:checked").on('change', function(event) {
						var value = $(this).val();
						
						alert(value);
						
						local.target_layer = value;
					});
					*/
				});
				//---------------------------------------------------------------------------------------------------------------
				$('#remove_layer').on('click', function(event) {
					
					var layers = $('.layer-tool');
					
					if( (layers.length-1) == local.target_layer) {
						if(local.target_layer > 0) {
							local.target_layer--;
							$("input[name=layer-select]").val([local.target_layer]);
						}
					}
					
					local.map.RemoveLayer();
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
					
					if(local.mousedown) {
						if( (x != local.last_x) || (y != local.last_y)) {
							local.map.TileDraw(x, y, local.paint_tile, local.mode, local.target_layer);
							local.last_x = x;
							local.last_y = y;
						}
					}
					$('#debug').html("<br>X: " + x + ", Y: " + y);
				});
				//---------------------------------------------------------------------------------------------------------------
				$("#level_canvas").mousedown( function(event) {
					
					event.preventDefault();
					$("#level_name").blur();
// 					$('#message').html("");
					local.mousedown = true;
				});
				//---------------------------------------------------------------------------------------------------------------
				$(document).mouseup( function(event) {
					local.mousedown = false;
				});
				//---------------------------------------------------------------------------------------------------------------
				
				local.map.UpdateLvList();
				
				$('#save_hide').hide();
				$('#load_hide').hide();
				$('#pool').hide();
				
			};
			
		};
		return new App();
		
	})().init();
});
