function silderBtn(x, y, key, frame, game) {
	Sprite.call(this, x, y, key, frame,game);
	this.game = game;

	this.buttonMode = true;
	this.interactive = true;
	this.x = x;
	this.y = y;
	this.anchor.set(0.5);

	this
		// events for drag start
		.on('mousedown', this.onDragStart)
		.on('touchstart', this.onDragStart)
		// events for drag end
		.on('mouseup', this.onDragEnd)
		.on('mouseupoutside', this.onDragEnd)
		.on('touchend', this.onDragEnd)
		.on('touchendoutside', this.onDragEnd)
		// events for drag move
		.on('mousemove', this.onDragMove)
		.on('touchmove', this.onDragMove);

	//parent.addChild(this);
}

silderBtn.prototype = Object.create(Sprite.prototype);
silderBtn.prototype.constructor = silderBtn;
silderBtn.prototype.game;
silderBtn.prototype._boundsRect2;
silderBtn.prototype.data;
silderBtn.prototype.dragging = false;

Object.defineProperty(silderBtn.prototype, "addMoveCallback", {
	get: function() {
		return this._addMoveCallback;
	},
	set: function(value) {
		this._addMoveCallback = value;
	}

});

Object.defineProperty(silderBtn.prototype, "boundsRect2", {
	get: function() {
		return this._boundsRect2;
	},
	set: function(value) {
		this._boundsRect2 = value;
	}

});
silderBtn.prototype.onDragStart = function(event) {
	this.data = event.data;
	// this.alpha = 0.5;
	this.dragging = true;
}

silderBtn.prototype.onDragEnd = function(event) {
	// this.alpha = 1;
	this.dragging = false;
	this.data = null;
}

silderBtn.prototype.disable = function(){
	this.buttonMode = false;
	this.interactive = false;
}

silderBtn.prototype.onDragMove = function(event) {
	if (this.dragging) {
		let  newPosition = this.data.getLocalPosition(this.parent);


		if(newPosition.x<this._boundsRect2.left){
			this.position.x  = this._boundsRect2.x;
		}else if(newPosition.x> this._boundsRect2.right){
			this.position.x  =this._boundsRect2.right;
		}else{
			this.position.x  =newPosition.x;
		}

		let _point=  new PIXI.Point(this.x,this.y)
		this.emit('dragUpdate', _point);
	}
}
