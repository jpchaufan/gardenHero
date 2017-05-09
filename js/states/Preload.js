var GardenHero = GardenHero || {};

GardenHero.PreloadState = {
	preload: function(){

		//scaling options
	    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    
	    //have the game centered horizontally
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;

	    //disable popup menu on right click
	    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }


		//load images
	    this.load.spritesheet('ground-tiles', 'assets/images/ground-tiles.png', 32, 32, 1);
	    this.load.spritesheet('plants', 'assets/images/plants.png', 32, 32, 6);
	    this.load.spritesheet('icons', 'assets/images/icons.png', 32, 32, 2);
	    this.load.spritesheet('player', 'assets/images/player.png', 32, 32, 1);

	    // load json
	    this.load.json('plantDB', 'assets/data/plantDB.json');
	    this.load.json('level-1', 'assets/data/level-1.json');
	    
	},
	create: function() {
	    this.state.start('Game');
	}
}