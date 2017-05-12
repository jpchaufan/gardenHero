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

		// Get Item DB
		this.itemDB = this.cache.getJSON('itemDB');

		// Plant Recycler Group
		this.plantGroup = this.add.group();
		
		// Click Time
		this.clicked = 0;

		// Level Data
		var levelData = this.cache.getJSON('level-1');

		// Map
		this.rows = levelData.rows;
		this.cols = levelData.cols;
		this.game.world.setBounds(0 , 0, this.cols*64, this.rows*64+64);
		this.mapData = this.createMapData(levelData.map);

		// Player
		this.player = new GardenHero.Player(this, levelData.player.col*64, levelData.player.row*64, {
			row: levelData.player.row,
			col: levelData.player.col
		});

		// UI
		this.UI = new GardenHero.UI(this);

		// Game Timer
		this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.tick, this);


		// Starting Items
		this.UI.createItemInInv('Shears');
		this.UI.createItemInInv('Shovel');
		//this.UI.createItemInInv('Dandelion Seed', 5);
		


		


	},

	tick: function(){
		for (var r = 0; r < this.mapData.length; r++) {
			for (var c = 0; c < this.mapData[r].length; c++) {
				// Age everything with an age function
				if (this.mapData[r][c].item && this.mapData[r][c].item.age){
					this.mapData[r][c].item.age();
				}
			};
		};
	},



	update: function(){
		this.UI.update();
	},


	createMapData: function(map){
		
		// create rect for clicking
		var rect = this.add.bitmapData(64, 64);
	    rect.ctx.fillStyle = '#000';
	    rect.ctx.fillRect(0, 0, 64, 64);

		var mapData = [];
		var sq;
		for (var r = 0; r < this.rows; r++) {
			mapData.push([]); // Add Rows
			for (var c = 0; c < this.cols; c++) {
				mapData[r].push( {} ); // Add Squares

				// sq info from json
				sq = map[r][c]; 

				// create ground
				mapData[r][c].ground = new GardenHero[sq.ground.type](this, c*64, r*64, r, c);

				// create item
				if (!sq.item){
					mapData[r][c].item = null;
				}
				else if (sq.item.type == 'Plant'){
					mapData[r][c].item = this.addPlant(r, c, sq.item.name);	
				}

				//create click square
				var clickSq = this.add.sprite(c*64, r*64, rect);
				clickSq.row = r;
				clickSq.col = c;
				clickSq.alpha = 0;
				clickSq.inputEnabled = true;
				clickSq.events.onInputDown.add(this.clickSqClicked, this);

				mapData[r][c].clickSq = clickSq;
				
			};
		};

		return mapData;

	},




	

	clickSqClicked: function(sprite, event){
		// cant click conditions
		var blockedByUI = sprite.y < (this.camera.view.height + this.camera.view.y - 64);
		if (!blockedByUI || this.UI.isAlert){
			return;
		}

		// can only click in range from player
		var range = Math.abs(this.player.row - sprite.row) + Math.abs(this.player.col - sprite.col);
		if (range > 2){
			this.UI.alert('That spot is too far away! Move closer.');
			return;
		}

		var sq = this.mapData[sprite.row][sprite.col];

		if (this.UI.isDraggingItem){ // if holding item, use item
			// use depends on item
			if ( this.UI.isDraggingItem.type == 'seed' ){ // SEED
				if (sq.item){
					this.UI.alert("Can't plant here, "+sq.item.name+" is in the way.");
				} else { //plant seed
					sq.item = this.addPlant(sprite.row, sprite.col, this.UI.isDraggingItem.for);
					
					if (this.UI.isDraggingItem.quantity > 1){ // lower quantity
						this.UI.isDraggingItem.changeQuantity(-1);
					} else {
						this.UI.isDraggingItem.destroy();
						this.UI.isDraggingItem = null;
					}
					sq.item.sendToBack();
					sq.ground.sendToBack();
				}
			} else if ( this.UI.isDraggingItem.name == 'Shovel' ){ // SHOVEL
				if (!sq.item){ // dig hole

				} else if (sq.item.type == 'plant') {
					sq.item.destroy();
					sq.item = null;
				}
			} else if ( this.UI.isDraggingItem.name = "Shears" ){ // SHEARS
				if ( sq.item && sq.item.type == "plant" ){
					// check plants harvest data to see if it is currently harvestable
					if ( sq.item.harvestData[sq.item.lifeStage] ){ 
						if ( sq.item.harvestDone ){ 
							this.UI.alert("Nothing left to harvest.");
						} else { // check if theres space
							if ( this.UI.invIsFull() ){
								this.UI.alert("Make room first.");
							} else { // Harvest the thing
								sq.item.harvestDone = true;
								this.UI.createItemInInv( 
									sq.item.harvestData[sq.item.lifeStage], 
									Math.ceil(Math.random()*3) //quantity harvested
								 );
							}
						}
					} else { // nothing to harvest
						this.UI.alert("Nothing to harvest right now.");
					}
				}
			}


		} else { // if empty handed, inspect
			if (!sq.item){
				this.UI.alert('The soil is '+sq.ground.quality+'y.');
			} else {
				this.UI.alert('The soil is '+sq.ground.quality+'y. A '+sq.item.lifeStage+' plant is growing here. '+sq.item.vitality);
			}
		}
	},

	addPlant: function(r, c, name){
		//look for a dead element
	    var newPlant = this.plantGroup.getFirstDead();

	    //if there are no dead ones, create a new one
	    if(!newPlant) {
	    	newPlant = new GardenHero.Plant(this, c*64, r*64, r, c, this.getPlantData(name));
	    }
	    else {
	      newPlant.reset(c*64, r*64);
	      newPlant.row = r;
	      newPlant.col = c;
	      newPlant.setData( this.state.getPlantData(name) );
	    }

	    return newPlant;
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
		};
		throw "failed search for plant where "+property+": "+key;
	},

	getItemData: function(key, property){ // find item where item.property == key
		property = property || 'name';
		for (var i = 0; i < this.itemDB.length; i++) {
			if (this.itemDB[i][property] == key){
				return this.itemDB[i];
			}
		};
		throw "failed search for item where "+property+": "+key;
	}

	
	// ,render: function(){
	// 	this.game.debug.body(this.player);  
	// 	//this.game.debug.bodyInfo(this.player, 5, 10);
	// }

}






