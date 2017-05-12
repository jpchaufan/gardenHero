

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
	this.setData(data);
	this.type = 'plant';

	

	//this.tint = 0xdd77dd; // for dehydration


	//add Plant to the world
	this.state.add.existing(this);

};

GardenHero.Plant.prototype = Object.create(Phaser.Sprite.prototype);
GardenHero.Plant.prototype.constructor = GardenHero.Plant;

GardenHero.Plant.prototype.setData = function(data){

	this.name = data.name;
	this.frame = this.baseFrame = data.baseFrame;
	this.latinName = data.latinName;
	this.cycle = data.cycle;
	this.family = data.family;
	this.growthData = data.growthData;
	this.harvestData = data.harvestData;
	this.lifeStages = data.lifeStages; //['baby', 'young', 'mature', 'flowering', 'fruiting', 'seeding'];
	this.replenish = data.replenish;

	this.lifeStageI = 0;
	this.lifeStage = 'baby';
	this.harvestDone = false;


	this.vitality = 0; // growth meter
}

GardenHero.Plant.prototype.age = function(){
	this.vitality += 3 * 
					( Math.random()*0.2+0.9 ); // 10% randomness

for (var i = 0; i < this.lifeStages.length; i++) {
	if (this.vitality >= this.growthData[i] && this.lifeStageI == i){
		this.lifeStageI++;
		this.lifeStage = this.lifeStages[this.lifeStageI];
		this.frame = this.baseFrame + i + 1;

		if (this.replenish){
			this.harvestDone = false;
		}
	}
};
	
	
}

// GardenHero.Plant.prototype.update = function(){}



