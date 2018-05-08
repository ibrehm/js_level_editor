<!-- (C) 2017 Ian Brehm -->
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/level_editor.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js"></script>	-->
	</head>
<body>

<?php

	echo("<script>");
	
	$file = "null";
	
	if(array_key_exists('file', $_GET)) {
		$file = "\"" . $_GET['file'] . "\"";
	}
	echo("var auto_load = " . $file . ";");
	
	echo("</script>");

?>

<!-- Menu items =============================================================================================== -->
<div id="file_selector" class="file_settings">

	<select id="canvas_type" name="canvas_type">
	</select><br>
	<div id="palette_holder" style="display: flex;">
			
			<div id="save" class="pal_btn save-btn"></div>
			<div id="load" class="pal_btn load-btn"></div>
			<div id="start" class="pal_btn start-btn"></div>
			
			<div id="text">
			</div>
		<span id='load_hide'><br><select id="level_list"></select><input id="load-btn" type=submit value="Load"></span>
		<span id='save_hide'><br>Level Name: <input id="level_name" type="text"> <input id="save-btn" type=submit value="Save"></span>
		
	</div>
	<br>Quick Travel: <form>
		<input id="GoToX" type="number" size=6>
		<input id="GoToY" type="number" size=6>
		<button id="QuickTravelGo" type="button">Go</button>
	</form>
	<br>New Canvas: <form>
		<input id="new_canvas_x" type="number" size=6>
		<input id="new_canvas_y" type="number" size=6>
		<button id="newCanvasGo" type="button">New</button>
	</form>
	<div id="file_tab" class="menu_moveable"></div>
</div>

<div id="palette_selector" class="palette_settings">
	<div id="palette_full" class="palette_full">
		<div id="palette_texture">
			<div id="palette_cover"></div>
		</div>
	</div>
	<div>
		Width:<input id="selector_width" type="number" min="1" max="9" value="1">
		<br>Height:<input id="selector_height" type="number" min="1" max="9" value="1">
		
		<br>Palette: <input id='texture_change' type='number' min='0' max='9999' value="0">
		
		<br><button id='add_layer' type='button'>Add Layer</button>
		<button id='remove_layer' type='button'>Remove Layer</button>
		
		<br><button id='move_up' type='button'>Move Up</button>
		<button id='move_down' type='button'>Move Down</button>
		
		<form id="layer-list">
		</form>

		<div id="current_tile"></div>
		<div id="grid-on-off" class="pal_btn grid-on-off"></div>
		
	</div>
	<div id="palette_tab" class="menu_moveable"></div>
</div>
<div id="links_selector" class="links_settings">
	<?php
	
		for($i = 0; $i < 27; $i++) {
			if($i == 0) {
				echo("Upper");
			}
			
			if($i == 9) {
				echo("\n\n\t<p />Middle");
			}
			
			if($i == 18) {
				echo("\n\n\t<p />Lower");
			}
			
			if($i%3 == 0) {
				echo("\n\t<br>");
			}
		
			echo("<input id='map_link_" . $i . "' type=text value='0'>");
		}
	
	?>
	<div id="links_tab" class="menu_moveable"></div>
</div>
<div id="objects_selector" class="objects_settings">
	<div id="objects_tab" class="menu_moveable"></div>
</div>
<div id="presets_selector" class="presets_settings">
	<div id="presets_tab" class="menu_moveable"></div>
</div>
<!-- End Menu items =============================================================================================== -->
<div id="container">
		
	<div id="canvas_container">
	
		<div id="grid_overlay"></div>
		<div id="level_canvas"></div>
		<div id="obj-layer" style="pointer-events: none;"></div>
		<div id="canvas_cover"></div>
	</div>
	<div id="text">
	<span id="message"> </span>
	<span id="debug"></span>
	<br><span id="debugii"></span>
	<br><span id="debugiii"></span>
</div>

<button id="clear_test" type=button>Clear</button>

<script src="./js/editor/settings.js"></script>
<!-- <script src="./js/include/pako/pako.min.js"></script> -->
<script src="./js/MapCompress.js"></script>
<script src="./js/List.js"></script>
<script src="./js/DynamicBytes.js"></script>
<script src="./js/utils.js"></script>
<script src="./js/editor/MapObject.js"></script>
<script src="./js/editor/managers.js"></script>
<script src="./js/editor/layer.js"></script>
<script src="./js/editor/layerManager.js"></script>
<script src="./js/editor/level_editor.js"></script>

</body>

</html>
