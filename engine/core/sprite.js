function Sprite(x, y, key, frame, _game) {


	PIXI.Sprite.call(this, Cache.DEFAULT);
	this.game = _game;


	let _img = this.game.cache.getImage(key, true);
	if (frame != '') {
		this._frame = this.game.cache.getFrameByName(key, frame);
		this.texture = new PIXI.Texture(_img.base);
		this.texture.frame = this._frame;
		
	} else {
		this._frame = this.game.cache.getFrame(key);
		this.texture = new PIXI.Texture(_img.base);
		this.texture.frame = this._frame;
	}
	this.x = x;
	this.y = y;
	this.key = key;
	this.frame= frame;
	
	this.animations = new Animation(this);
}
Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;
Sprite.prototype.game;
Sprite.prototype.key;
Sprite.prototype.cropRect = null;
Sprite.prototype._crop = null;
Sprite.prototype._frame = null;
Sprite.prototype.animations = null;

Sprite.prototype.destroyAll = function () {
	for (var animName in this.animations.animations) {
		this.animations.animations[animName].destroy();
	}
	this.animations = null;
	this.destroy();
};

Sprite.prototype.crop = function (rect, copy) {
	if (copy === undefined) {
		copy = false;
	}
	if (rect) {
		if (copy && this.cropRect !== null) {
			this.cropRect.setTo(rect.x, rect.y, rect.width, rect.height);
		} else if (copy && this.cropRect === null) {
			this.cropRect = new Rectangle(rect.x, rect.y, rect.width, rect.height);
		} else {
			this.cropRect = rect;
		}

		this.updateCrop();
	} else {
		this._crop = null;
		this.cropRect = null;

		this.resetFrame();
	}
}

Sprite.prototype.setPosition=function(x,y){
	this.x = x;
	this.y = y;
	if(this.animations){
		for(var name in this.animations.animations){
			this.animations.animations[name].x = x;
			this.animations.animations[name].y = y;
		}
	}
} 

Sprite.prototype.updateCrop = function () {
	if (!this.cropRect) {
		return;
	}
	var oldX = this.texture.x;
	var oldY = this.texture.y;
	var oldW = this.texture.width;
	var oldH = this.texture.height;

	this._crop = Rectangle.clone(this.cropRect, this._crop);
	this._crop.x += this._frame.x;
	this._crop.y += this._frame.y;

	var cx = Math.max(this._frame.x, this._crop.x);
	var cy = Math.max(this._frame.y, this._crop.y);
	var cw = Math.min(this._frame.right, this._crop.right) - cx;
	var ch = Math.min(this._frame.bottom, this._crop.bottom) - cy;

	this.texture.x = cx;
	this.texture.y = cy;
	this.texture.width = cw;
	this.texture.height = ch;

	this.texture.frame.width = Math.min(cw, this.cropRect.width);
	this.texture.frame.height = Math.min(ch, this.cropRect.height);

	this.texture.width = this.texture.frame.width;
	this.texture.height = this.texture.frame.height;

	this.texture.updateUvs();
	// this.texture._updateUvs();

	if (this.tint !== 0xffffff && (oldX !== cx || oldY !== cy || oldW !== cw || oldH !== ch)) {
		this.texture.requiresReTint = true;
	}
}

