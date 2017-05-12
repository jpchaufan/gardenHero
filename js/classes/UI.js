var GardenHero = GardenHero || {};

GardenHero.UI = function (state){
	this.state = state;

	// Game Condition
	// keep track of what UI elements are happening to determine what actions player can take now
	this.isAlert;
	this.isDraggingItem;


	// create square for UI background
		//	Create our bitmapData which we'll use as a Sprite texture
		var bmd = this.state.game.add.bitmapData(64*9, 64);

		//	Fill it
	    var grd = bmd.context.createLinearGradient(0, 0, 0, 64);

	    grd.addColorStop(0, '#222'); //#004CB3
	    grd.addColorStop(1, '#666'); //#8ED6FF
	    bmd.context.fillStyle = grd;
	    bmd.context.fillRect(0, 0, 64*9, 64);

	// create UI menu bg
	this.bg = this.state.add.sprite(0, 64*5, bmd);
	this.bg.fixedToCamera = true;

	// 4 UI buttons
	this.btn = {};
	this.btn.build = this.addBtn(10, 64*5+10, 0);
	this.btn.build = this.addBtn(10+64, 64*5+10, 1);
	this.btn.build = this.addBtn(10+64*7, 64*5+10, 2);
	this.btn.build = this.addBtn(10+64*8, 64*5+10, 3);

	// Inventory
	this.inventory = [
		this.addInvSq(64*2, 64*5, 0),
		this.addInvSq(64*3, 64*5, 1),
		this.addInvSq(64*4, 64*5, 2),
		this.addInvSq(64*5, 64*5, 3),
		this.addInvSq(64*6, 64*5, 4)
	];

	// // Box Recycler Group
	// this.boxGroup = this.state.add.group();

	// // Text Recycler Group
	// this.textGroup = this.state.add.group();
	// this.state.game.world.bringToTop( this.textGroup );

	// Item Recycler Group
	this.itemGroup = this.state.add.group();


	// this.createItemInInv('Shears');
	// this.createItemInInv('Shovel');
	// this.createItemInInv('Sunflower Seeds');


}

GardenHero.UI.prototype.addBtn = function(x, y, frame){
	var newBtn = this.state.add.button(x, y, 'icons');
	newBtn.frame = frame;
	newBtn.scale.setTo(1.5);
	newBtn.fixedToCamera = true;
	return newBtn;
}

GardenHero.UI.prototype.addInvSq = function(x, y, index){
	var newInvSq = this.state.add.sprite(x, y, 'icons');
	newInvSq.frame = 4;
	newInvSq.scale.setTo(2);
	newInvSq.index = index
	newInvSq.item = null;
	newInvSq.fixedToCamera = true;
	newInvSq.inputEnabled = true;
	newInvSq.events.onInputDown.add(this.clickInv, this);
	return newInvSq;
}

GardenHero.UI.prototype.clickInv = function(sprite, event){
	if (this.isAlert){ // disabled conditions
		return;
	}


	if (this.isDraggingItem){ 
		if (sprite.item){ // if another item is here, switch em
			var placeHolder = sprite.item;
			sprite.item = this.isDraggingItem;
			this.isDraggingItem = placeHolder;
		} else { // if another item is not here, place here
			sprite.item = this.isDraggingItem;
			this.isDraggingItem = null;
		}
		// do this in both cases
		sprite.item.x = sprite.x-this.state.camera.view.x+5;
		sprite.item.y = sprite.y-this.state.camera.view.y;
		sprite.item.fixedToCamera = true;
		sprite.bringToTop();
	} else { // not holding an item. pick up item if one is here
		if (sprite.item){
			this.isDraggingItem = sprite.item;
			sprite.item = null;
		}
	}
	//this.invToTop();
}

// GardenHero.UI.prototype.invToTop = function(){
// 	for (var i = 0; i < this.inventory.length; i++) {
// 		this.inventory[i].bringToTop();
// 	};
// }

GardenHero.UI.prototype.addText = function(x, y, text, style){ // Text Recycler
	// Text Recycler Group
	this.textGroup = this.textGroup || this.state.add.group();
	// this.state.game.world.bringToTop( this.textGroup );

	//look for a dead element
    var newText = this.textGroup.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newText) {
      newText = this.state.game.add.text(x, y, text, style || {
      	wordWrap: true,
      	wordWrapWidth: 64*6.5,
      	align: "center",
      	font: "18px Ariel"
      }, this.textGroup);
      newText.anchor.setTo(0.5);
    }
    else {
      newText.reset(x, y);
      newText.Text = text;
    }

    return newText;
}

GardenHero.UI.prototype.addBox = function(x, y, w, h, fill){ // Box Recycler

	// Box Recycler Group
	this.boxGroup = this.boxGroup || this.state.add.group();

	//look for a dead element
    var newBox = this.boxGroup.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newBox) {
     	bmd = this.state.game.add.bitmapData(64, 64);
		bmd.context.fillStyle = fill || '#cdcdcd';
		bmd.context.fillRect(0, 0, 64, 64);
		newBox = this.state.add.image(x, y, bmd);
		newBox.anchor.setTo(0.5);
    }
    else {
      newBox.reset(x, y);
    }
    newBox.scale.setTo(w, h);

    return newBox.moveDown();
}

GardenHero.UI.prototype.addItem = function(x, y, itemData, quantity){ // Item Recycler
	//look for a dead element
    var newItem = this.itemGroup.getFirstDead();

    //if there are no dead ones, create a new one
    if(!newItem) {
    	newItem = new GardenHero.Item( this.state, x, y, itemData, quantity || 1 );
    }
    else {
      newItem.reset(x, y);
      newItem.setData( itemData );
    }

    return newItem;
}


GardenHero.UI.prototype.alert = function(text){

	this.isAlert = true;
	this.msgBoxBox = this.addBox(64*4.5+this.state.camera.view.x, 64*2.5+this.state.camera.view.y, 7, 3).moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown();
	this.msgBoxText = this.addText(64*4.5+this.state.camera.view.x, 64*2+this.state.camera.view.y, text).bringToTop();
	
	this.msgBoxOk = this.addBox(64*4.5+this.state.camera.view.x, 64*3.5+this.state.camera.view.y, 1, 0.5, '#a1a1a1').moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown().moveDown();
	this.msgBoxOk.inputEnabled = true;
	this.msgBoxOk.events.onInputDown.add(this.alertClose, this);

	this.msgBoxOKText = this.addText(64*4.5+this.state.camera.view.x, 64*3.5+this.state.camera.view.y, 'OK').bringToTop();

}

GardenHero.UI.prototype.alertClose = function(text){
	this.isAlert = false;
	this.msgBoxBox.destroy();
	this.msgBoxText.destroy();
	this.msgBoxOk.destroy();
	this.msgBoxOKText.destroy();
}

GardenHero.UI.prototype.createItemInInv = function(itemName, quantity){ // quantity for stacking items only
	var i;
	// get item data
	var item = this.state.getItemData(itemName);

	// first, check for stacking potential if item is stackable
	if (item.stackable){
		for (i = 0; i < this.inventory.length; i++) {
			if ( this.inventory[i].item && this.inventory[i].item.name == item.name ){ // stackable item is here! add quantity
				this.inventory[i].item.changeQuantity(quantity || 1);
				return; // our work here is done
			}
		};
	}

	// make sure there is space
	
	for (i = 0; i < this.inventory.length; i++) {
		if (!this.inventory[i].item){
			// Add item
			this.inventory[i].item = this.addItem((2+i)*65+this.state.camera.view.x, 64*5+this.state.camera.view.y, item, quantity || 1);
			this.inventory[i].bringToTop();
			return;
		}
	};
	// no room!
		this.alert("You have no room for "+itemName+".");
}

GardenHero.UI.prototype.update = function(){
	if (this.isDraggingItem){
		if (this.isDraggingItem.fixedToCamera){
	 		this.isDraggingItem.fixedToCamera = false;
	 	}
	 	this.isDraggingItem.x = this.state.input.activePointer.x + this.state.camera.view.x+1;
	 	this.isDraggingItem.y = this.state.input.activePointer.y + this.state.camera.view.y+1;
	}


}

GardenHero.UI.prototype.invIsFull = function(){ // check if inv is full
	for (var i = 0; i < this.inventory.length; i++) {
		if (this.inventory[i].item == null){
			return false;
		}
	};
	return true;;
}


