

var GardenHero = GardenHero || {};

GardenHero.Item = function(state, x, y, data, quantity) {
	Phaser.Image.call(this, state.game, x, y, 'items');

	this.scale.setTo(2);
	this.inputEnabled = true;
	this.fixedToCamera = true;

	this.state = state;
	this.game = this.state.game;

	// Basic Item Data

	this.setData(data, quantity);

	//add Item to the world
	this.state.add.existing(this);

};

GardenHero.Item.prototype = Object.create(Phaser.Sprite.prototype);
GardenHero.Item.prototype.constructor = GardenHero.Item;

GardenHero.Item.prototype.setData = function(data, quantity){
	this.name = data.name;
	this.type = data.type;
	this.frame = data.frame;
	this.for = data.for;
	this.stackable = data.stackable; // can stack in piles 
	this.quantity = quantity || 1;

	// stack counter
	if (this.stackable){
		this.stackCounter = this.state.UI.addText(0, 0, this.quantity, {font: "12px Arial", fill: "white"});
	}
}

GardenHero.Item.prototype.update = function(){
	if (this.stackable){
		this.stackCounter.x = this.x + 10;
		this.stackCounter.y = this.y + 55;
	}
}

GardenHero.Item.prototype.destroy = function(){
	Phaser.Sprite.prototype.destroy.call(this);
	this.stackCounter.destroy();
}

GardenHero.Item.prototype.changeQuantity = function(n){
	this.quantity += n;
	this.stackCounter.text = this.quantity;
}



