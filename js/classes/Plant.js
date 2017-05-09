

var GardenHero = GardenHero || {};

GardenHero.Plant = function(state, x, y, row, col, data) {
	Phaser.Sprite.call(this, state.game, x, y, 'plants');

	this.scale.setTo(2);
	this.inputEnabled = true;

	this.state = state;
	this.game = this.state.game;

	this.row = row;
	this.col = col;

	// Basic Plant Data
	
	this.name = data.name;
	this.frame = this.baseFrame = data.baseFrame;
	this.latinName = data.latinName;
	this.cycle = data.cycle;
	this.family = data.family;



	this.lifeStage = 'baby'; // baby, young, mature, flowering, fruiting, seeding

	



	// Growth Cycle
	this.lifeTime = 0;
	this.game.time.events.loop(Phaser.Timer.SECOND * 10, this.age, this);

	




	//add Plant to the world
	this.state.add.existing(this);

};

GardenHero.Plant.prototype = Object.create(Phaser.Sprite.prototype);
GardenHero.Plant.prototype.constructor = GardenHero.Plant;

GardenHero.Plant.prototype.age = function(){
	this.lifeTime += 10;
	if (this.lifeStage == 'baby' && this.lifeTime > 9){
		this.lifeStage == 'young';
		this.frame = this.baseFrame+1;
	}
}

GardenHero.Plant.prototype.update = function(){

	
}



