//-----------------------------------------------------------------------------------------------------------
// Predefined values and constants
var TEXTURE_SIZE = 512;
var TILE_SIZE = 20;
var MAP_SIZE = 100;

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
var VIEWPORT_WIDTH = 1280;
var VIEWPORT_HEIGHT = 720;

var VIEWPORT_TILE_WIDTH = (VIEWPORT_WIDTH / TILE_SIZE);
var VIEWPORT_TILE_HEIGHT = (VIEWPORT_HEIGHT / TILE_SIZE);

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
	ESC: 27
	
}; 
