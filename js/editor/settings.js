// (C) 2017 Ian Brehm
//-----------------------------------------------------------------------------------------------------------
// Predefined values and constants
var TEXTURE_SIZE = 512;
var TILE_SIZE = 20;
var MAP_SIZE_W = 100;
var MAP_SIZE_H = 100;
var LINK_TOTAL = (3*3)*3;

//-----------------------------------------------------------------------------------------------------------
// File locations
var NAMES = [];
NAMES[NAMES.length] = "Tilemaps";
NAMES[NAMES.length] = "Objects";
NAMES[NAMES.length] = "Animations";

var IMG_LOCATIONS = [];
var DATA_LOCATIONS = [];

for(var i = 0; i < NAMES.length; i++) {
	$('#canvas_type').append("<option value='" + i + "'>" + NAMES[i] + "</option>");
	IMG_LOCATIONS[NAMES[i]] = ("./img/" + NAMES[i].toLowerCase() + "/");
	DATA_LOCATIONS[NAMES[i]] = ("./data/" + NAMES[i].toLowerCase() + "/");
}

//-----------------------------------------------------------------------------------------------------------
// Determines the usable width/height of the texture based on it's size and the size of the tiles
var TEXTURE_HIGHEST = (TEXTURE_SIZE - (TEXTURE_SIZE % TILE_SIZE));
// Tiles per row within the texture size given
var TILES_PER_ROW = parseInt(TEXTURE_SIZE / TILE_SIZE);

// Various drawing modes
var DRAW_MODE_START = -1;
var DRAW_MODE_SINGLE = 0;
var DRAW_MODE_LINE = 1;
var DRAW_MODE_ROUND = 2;
var DRAW_MODE_ERASE = 3;

// Canvas/Viewport settings

var VIEWPORT_WIDTH = 1280;//parseInt(screen.width/TILE_SIZE)*TILE_SIZE;
var VIEWPORT_HEIGHT = 720;

if( (VIEWPORT_WIDTH % TILE_SIZE) != 0 ) {
	VIEWPORT_WIDTH+=(VIEWPORT_WIDTH % TILE_SIZE);
}

if( (VIEWPORT_HEIGHT % TILE_SIZE) != 0 ) {
	VIEWPORT_HEIGHT+=(VIEWPORT_HEIGHT % TILE_SIZE);
}

var VIEWPORT_TILE_WIDTH = parseInt(VIEWPORT_WIDTH / TILE_SIZE);
var VIEWPORT_TILE_HEIGHT = parseInt(VIEWPORT_HEIGHT / TILE_SIZE);

// Amount of undo/redos available
var MAX_UNDO = 200;

// Keypress values
var pressed = {};

var keys = {
	UP_ARROW: 38,
	DOWN_ARROW: 40,
	LEFT_ARROW: 37,
	RIGHT_ARROW: 39,
	
	CTRL: 17,
	ALT: 18,
	E: 69,
	F: 70,
	D: 68,
	R: 82,
	Z: 90,
	X: 88,
	T: 84,
	P: 80,
	ESC: 27
	
};

$('#current_tile').css({
	'width': TILE_SIZE,
	'height': TILE_SIZE
});

$('#canvas_container').css({
	'width': VIEWPORT_WIDTH,
	'height': VIEWPORT_HEIGHT
});

$('#grid_overlay').css({
	'width': VIEWPORT_WIDTH,
	'height': VIEWPORT_HEIGHT
});

$('.palette_full').css({
	'background-image':"url( './img/background_grid" + TILE_SIZE + ".png' )"
});

$('#canvas_container').css({
	'background-image':"url( './img/background_grid" + TILE_SIZE + ".png' )"
});

