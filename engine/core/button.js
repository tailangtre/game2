function Button(x, y, key, clickFunction, _this, textureButton, textureButtonDown, textureButtonOver, _game,btnKey) {


	PIXI.Sprite.call(this, Cache.DEFAULT);

	if (_game.game) {
		this._game = _game.game;
		_game.addChild(this)
	} else {
		this._game = _game;
	}

	let _img = this._game.cache.getImage(key, true);
	this.texture = new PIXI.Texture(_img.base);

	this.textureButton = this._game.cache.getFrameByName(key, textureButton);//textureButton;
	this.textureButtonDown = this._game.cache.getFrameByName(key, textureButtonDown);//textureButtonDown;
	this.textureButtonOver = this._game.cache.getFrameByName(key, textureButtonOver);//textureButtonOver;
	this.texture.frame = this.textureButton;
	this.clickFunction = clickFunction;
	this.x = x;
	this.y = y;
	this._this = _this;
	this.anchor.set(0.5, 0.5);
	this.btnKey = btnKey;
    this.disable = false;
	this.init();
}

Button.prototype = Object.create(PIXI.Sprite.prototype);
Button.prototype.constructor = Button;
Button.prototype._frame = null;
Button.prototype.value = null;
Button.prototype.textureButton = null;
Button.prototype.textureButtonDown = null;
Button.prototype.textureButtonOver = null;
Button.prototype.isOver = false;
Button.prototype.isdown = false;
Button.prototype.clickFunction = null;
Button.prototype._this;
Button.prototype.btnKey;
Button.prototype.pointerdownTime = 0;

Button.prototype.init = function () {
	this.buttonMode = true;
	this.interactive = true;
	this
		// Mouse & touch events are normalized into
		// the pointer* events for handling different
		// button events.
		.on('pointerdown', this.onButtonDown)
		.on('pointerup', this.onButtonUp)
		//.on('pointerupoutside', this.onButtonUp)
		.on('pointerover', this.onButtonOver)
		.on('pointerout', this.onButtonOut);
}
Object.defineProperty(Button.prototype, "canClick", {
	set: function (value) {
		this.buttonMode = value;
		this.interactive = value;
		this.texture.frame = this.textureButton;
	}
});

Button.prototype.addButtonDown = function (clickFunction,btnKey) {
	this.clickFunction = clickFunction;
	this.btnKey = btnKey;
}

Button.prototype.setBtnKey = function (btnKey) {
	this.btnKey = btnKey;
}

Button.prototype.onButtonDown = function () {
    if(this.disable){
        return;
    }
    if(GlobalClass.GAME_UI_BLOCKED == 2){
		return;
	}
	this.pointerdownTime = new Date().getTime();
	this.isdown = true;
	this.texture.frame = this.textureButtonDown;
	this.alpha = 1;
}
Button.prototype.onButtonUp = function () {
	if(this.disable){
        return;
    }
	
    if(!this.isdown){
        return;
    }

	this.isdown = false;
	if (this.isOver) {
		this.texture.frame = this.textureButtonOver;
	}
	else {
		this.texture.frame = this.textureButton;
	}

	if(GlobalClass.GAME_TRANSLATE ||  GlobalClass.GAME_UI_BLOCKED == 2){
		return;
	}

	var now = new Date().getTime();

	if(gameLastClikeTime>0){
		
		var t = now - gameLastClikeTime;
		
		if(t<300){
			return;
		}
		gameLastClikeTime = new Date().getTime();
		this.clickFunction.call(this._this, this);
	}
	else{
		gameLastClikeTime = new Date().getTime();
		this.clickFunction.call(this._this, this);
	}
	
}
Button.prototype.onButtonOver = function () {
    if(this.disable){
        return;
    }
    if(GlobalClass.GAME_UI_BLOCKED == 2){
		return;
	}
	this.isOver = true;
	if (this.isdown) {
		return;
	}
	this.texture.frame = this.textureButtonOver;
}
Button.prototype.onButtonOut = function () {
    if(this.disable){
        return;
    }
    if(GlobalClass.GAME_UI_BLOCKED == 2){
		return;
	}
	this.isOver = false;
	if (this.isdown) {
		return;
	}
	this.texture.frame = this.textureButton;
}

Button.prototype.disabled = function () {
    this.disable = true;
}