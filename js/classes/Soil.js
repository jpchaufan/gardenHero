

var GardenHero = GardenHero || {};

GardenHero.Soil = function(state, x, y, row, col, data) {
	Phaser.Sprite.call(this, state.game, x, y, 'ground-tiles');

	this.scale.setTo(2);


	this.state = state;
	this.game = this.state.game;

	this.row = row;
	this.col = col;

	this.name = "soil";
	this.quality = 'loam'; // sand, clay, loam
	// this.wetness = data.wetness || 'damp'; // very dry, dry, damp, wet, very wet;
	// //this.nitrogen
	// this.organicMatter = data.organicMatter || 3; // in %





	//add Soil to the world
	this.state.add.existing(this);

};

GardenHero.Soil.prototype = Object.create(Phaser.Sprite.prototype);
GardenHero.Soil.prototype.constructor = GardenHero.Soil;

GardenHero.Soil.prototype.clicked = function(){
	console.log('This soil is '+this.quality+'y and '+this.wetness+'!');
}


GardenHero.Soil.prototype.update = function(){

	
}



