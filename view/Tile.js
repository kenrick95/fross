
var TILE_SIZE = 32;

var TileState = {
	CLEAN: 1,
	CRACKED: 2,
	BROKEN: 3,
	properties: {
		1: {
			time: "clean",
			image: "assets/Tile_Clean.png",
			lifetime: Infinity
		},
		2: {
			name: "cracked",
			image: "assets/Tile_Cracked.png",
			lifetime: 3000
		},
		3: {
			name: "broken",
			image: "assets/Tile_Broken.png",
			lifetime: Infinity
		}
	}
};

if (Object.freeze) {
	Object.freeze(TileState);
}

/**
 * Draws a floor tile on the given canvas 
 * at position (x, y) (top-left corner)
 */
function Tile(posX, posY, canvas) {
	this.posX = posX;
	this.posY = posY;
	this.canvas = canvas;
	this.lastStateChange = Date.now();
	this.state = TileState.CLEAN;
}



// OBJECT METHODS

Tile.prototype.decrementLifetimeAndUpdateState = function() {
	var lifetime = TileState.properties[this.state].lifetime;
	if (lifetime === Infinity) return;

	var currentTime = Date.now();
	if (currentTime - this.lastStateChange >= lifetime) {
		this.setState(this.state + 1);
	}
};

Tile.prototype.logStateChange = function() {
	this.lastStateChange = Date.now();
};

Tile.prototype.setState = function(tileState) {
	if (tileState === TileState.CLEAN) { 
		this.state = TileState.CLEAN;
		this.logStateChange();
	} else if (tileState === TileState.CRACKED) { 
		this.state = TileState.CRACKED;
		this.logStateChange();
	} else if (tileState === TileState.BROKEN) { 
		this.state = TileState.BROKEN;
		this.logStateChange();
	} else { 
		console.error("The following object is not a valid TileState: ", tileState); 
	}
};

Tile.prototype.render = function() {
	if (Tile.prototype.isImagesLoaded) {
		var image = TileState.properties[this.state].image;
		var context = this.canvas.getContext("2d");
		var tile = this;
		context.drawImage(image, tile.posX, tile.posY, TILE_SIZE, TILE_SIZE);
	} else {
		Tile.prototype.prefetchImages();
		throw new Error("Tile images is not yet loaded! Loading now... Please retry rendering in a while.");
	}
};

Tile.prototype.stepIn = function() {
	if (this.state === TileState.CLEAN) {
		this.setState(TileState.CRACKED);
	}
};

Tile.prototype.stepOut = function() {
	this.setState(TileState.BROKEN);
};



// STATIC METHODS AND VARIABLES

Tile.prototype.isImagesLoaded = false;

Tile.prototype.prefetchImages = function() {
	if (Tile.prototype.isImagesLoaded) return;
	Tile.prototype.isImagesLoaded = true;

	for(var key in TileState.properties) {
		var image = new Image();
		image.src = TileState.properties[key].image;
		TileState.properties[key].image = image;
	}

};



// DEBUGGING VARIABLES

var canvas = document.getElementById("gp");
Tile.prototype.prefetchImages();
