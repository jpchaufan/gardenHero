var GardenHero = GardenHero || {};

GardenHero.GameState = {

	create: function(){

		// Background
		this.game.stage.backgroundColor = "#3B240B";

		// Keys
		this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

		this.arrowKeys = this.game.input.keyboard.createCursorKeys();

		// Get Plant DB
		this.plantDB = this.cache.getJSON('plantDB');
		
		// Click Time
		this.clicked = 0;

		// Level Data
		var levelData = this.cache.getJSON('level-1');

		// Map
		this.rows = levelData.rows;
		this.cols = levelData.cols;
		this.game.world.setBounds(0 , 0, this.cols*64, this.rows*64+64);
		this.mapData = this.createMapData(levelData.map);

		// Map Click
		this.game.input.onDown.add(this.mapClick, this);

		// Player
		this.player = new GardenHero.Player(this, levelData.player.col*64, levelData.player.row*64, {
			row: levelData.player.row,
			col: levelData.player.col
		});

		
		


		


	},



	update: function(){

	},


	createMapData: function(map){
		

		var mapData = [];
		var sq;
		for (var r = 0; r < this.rows; r++) {
			mapData.push([]); // Add Rows
			for (var c = 0; c < this.cols; c++) {
				mapData[r].push( { ground: undefined, item: undefined} ); // Add Squares

				// sq info from json
				sq = map[r][c]; 

				// create ground
				mapData[r][c].ground = new GardenHero[sq.ground.type](this, c*64, r*64, r, c);

				// create item
				if (sq.item.type == 'Plant'){
					mapData[r][c].item = new GardenHero.Plant(this, c*64, r*64, r, c, this.getPlantData(sq.item.name));	
				}
				
			};
		};

		return mapData;



		// var rows = this.rows;
		// var cols = this.cols;
		// for (var r = 0; r < rows; r++) {
		// 	this.mapData.push([]);
		// 	for (var c = 0; c < cols; c++) {
		// 		this.mapData[r].push( {ground: undefined, item: undefined} );
		// 		// add ground
		// 		this.mapData[r][c].ground = new GardenHero[](this, c*64, r*64, r, c);
		// 		// add item
		// 		
		// 	};
		// };
	},




	mapClick: function(){ // do click action on map square
		var x = this.game.input.activePointer.x;
		var c = Math.floor((x-64)/64);
		var r;
		if (c >= 0 && c < 5){
			var y = this.game.input.activePointer.y;
			r = Math.floor( y / 64 );
			if ( r >= 0 && r < 5 ){
				console.log(r, c, this.mapData[r][c]);		
			}
		}
	},






	createUIButton: function(data){
		this[data.name+'Btn'] = this.add.button(data.x, data.y, 'icons');
		this[data.name+'Btn'].anchor.setTo(0.5);
		this[data.name+'Btn'].scale.setTo(1.5);
		this[data.name+'Btn'].frame = data.frame;
		this[data.name+'Btn'].alpha = 0.6;
		this[data.name+'Btn'].events.onInputDown.add(this.setMode, this);
		this[data.name+'Btn'].events.onInputOver.add(this.btnTooltipShow, this);
		this[data.name+'Btn'].events.onInputOut.add(this.btnTooltipHide, this);
	},

	getPlantData: function(key, property){ // find plant where plant.property == key
		property = property || 'name';
		for (var i = 0; i < this.plantDB.length; i++) {
			if (this.plantDB[i][property] == key){
				return this.plantDB[i];
			}
			throw "failed search for plant where "+property+": "+key;
		};
	}



	
	// ,render: function(){
	// 	this.game.debug.body(this.player);  
	// 	//this.game.debug.bodyInfo(this.player, 5, 10);
	// }

}






