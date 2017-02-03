<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/level_editor.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js"></script>	
	</head>
<body>

<div id="container">
		
	<div id="canvas_container">
	
		<div id="palette_selector" class="palette_settings">
			<div id="palette_full" class="palette_full">
				<div id="palette_texture">
					<div id="palette_cover"></div>
				</div>
			</div>
			<div>
				Width:<input id="selector_width" type="number" min="1" max="9" value="1">
				<br>Height:<input id="selector_height" type="number" min="1" max="9" value="1">
				<br><button id='add_layer' type='button'>Add Layer</button>
				<br><button id='remove_layer' type='button'>Remove Layer</button>
				<br>Target Layer:<input id="target_layer" type="number" value="0">
			</div>
			<div id="palette_tab"></div>
		</div>
		<div id="grid_overlay"></div>
		<div id="level_canvas">
			
		</div>
		<div id="current_tile"></div>
	</div>
	<div id="palette_holder" style="display: flex;">
			<div id="save" class="pal_btn save-btn"></div>
			<div id="load" class="pal_btn load-btn"></div>
			<div id="start" class="pal_btn start-btn"></div>
			<div id="grid-on-off" class="pal_btn grid-on-off"></div>
			
			<div id="text">
			</div>
		<span id="message"> </span>
		<span id='load_hide'><br><select id="level_list"></select><input id="load-btn" type=submit value="Load"></span>
		<span id='save_hide'><br>Level Name: <input id="level_name" type="text"> <input id="save-btn" type=submit value="Save"></span>
		<span id="debug"></span>
		<span id="debugii"></span>
	</div>
</div>

<script src="./js/List.js"></script>
<script src="./js/editor/managers.js"></script>
<script src="./js/editor/settings.js"></script>
<script src="./js/editor/layers.js"></script>
<script src="./js/editor/level.js"></script>
<script src="./js/editor/level_editor.js"></script>

<?php
	/*
	function GetScript($str) {
		echo("<script>");
		
		readfile($str);
		
		echo("</script>");
	}
	

	GetScript("./js/List.js");
	GetScript("./js/editor/settings.js");
	GetScript("./js/editor/layers.js");
	GetScript("./js/editor/level.js");
	GetScript("./js/editor/level_editor.js");
	*/
	
?>
</body>

</html>