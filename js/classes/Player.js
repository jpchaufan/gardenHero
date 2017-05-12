

var GardenHero = GardenHero || {};

GardenHero.Player = function(state, x, y, data ) {
	Phaser.Sprite.call(this, state.game, x, y, 'player');

	this.state = state;
	this.game = this.state.game;

	this.scale.setTo(2);

	this.row = data.row;
	this.col = data.col;

	this.state.game.camera.follow(this);

	// empty handed click to inspect soil.plant or access building,
	// click with item on hand to use item
	this.onHand = null;




	//add player to the world
	this.state.add.existing(this);

};

GardenHero.Player.prototype = Object.create(Phaser.Sprite.prototype);
GardenHero.Player.prototype.constructor = GardenHero.Player;



GardenHero.Player.prototype.update = function(){

	// no movement conditions
	if (this.state.UI.isAlert){ //  || this.state.UI.isDraggingItem
		return;
	}
	
	var leftKey = this.state.aKey.isDown || this.state.arrowKeys.left.isDown;
	var rightKey = this.state.dKey.isDown || this.state.arrowKeys.right.isDown;
	var upKey = this.state.wKey.isDown || this.state.arrowKeys.up.isDown;
	var downKey = this.state.sKey.isDown || this.state.arrowKeys.down.isDown;

	// Movement
	if ( !this.isWalking ){
		// LEFT
		if ( leftKey && this.col > 0){

			var tween = this.state.add.tween(this);
			tween.onComplete.add(function(){
				this.isWalking = false;
			}, this);

			this.isWalking = true;
			tween.to( {x: this.col*64-64}, 500 );
			tween.start();
			this.col -= 1;
		}
		// RIGHT
		else if ( rightKey && this.col < this.state.cols-1){

			var tween = this.state.add.tween(this);
			tween.onComplete.add(function(){
				this.isWalking = false;
			}, this);

			this.isWalking = true;
			tween.to( {x: this.col*64+64}, 500 );
			tween.start();
			this.col += 1;
		}
		// UP
		else if ( upKey && this.row > 0){

			var tween = this.state.add.tween(this);
			tween.onComplete.add(function(){
				this.isWalking = false;
			}, this);

			this.isWalking = true;
			tween.to( {y: this.row*64-64}, 500 );
			tween.start();
			this.row -= 1;
		}
		// DOWN
		else if ( downKey && this.row < this.state.rows-1){
			var tween = this.state.add.tween(this);
			tween.onComplete.add(function(){
				this.isWalking = false;
			}, this);

			this.isWalking = true;
			tween.to( {y: this.row*64+64}, 500 );
			tween.start();
			this.row += 1;
		}
	}
	
}

GardenHero.Player.prototype.getSq = function(r, c){
	return this.state.mapData[r][c];
}



