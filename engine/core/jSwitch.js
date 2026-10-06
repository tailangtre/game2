function Jswitch(x, y,game) {
	PIXI.Container.call(this);
	this.x = x;
	this.y = y;
	this.game = game;
	this.creatUI();
}

Jswitch.prototype = Object.create(PIXI.Container.prototype);
Jswitch.prototype.constructor = Jswitch;
Jswitch.prototype._activeBg;
Jswitch.prototype._unActiveBg;
Jswitch.prototype.game;
Jswitch.prototype.group;
Jswitch.prototype._maxBetBtn;
Jswitch.prototype._maxBetOffBtn;
Jswitch.prototype._name;
Jswitch.prototype._icon;
Jswitch.prototype._maxBetFont;
Jswitch.prototype._betSettingStyle = {
	fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
	fontSize: "28px",
	fontWeight: "bold",
	fill: "#fff",
	boundsAlignH: "middle",
	boundsAlignV: "center",
	align: "center"
};


Object.defineProperty(Jswitch.prototype, "switchName", {
	get: function () {
		return this._name;
	},
	set: function (value) {

		this._name = value;
		this.setName();
	}

});
Object.defineProperty(Jswitch.prototype, "icon", {
	get: function () {
		return this._icon;
	},
	set: function (value) {
		this._icon = value;
		this._iconSpr = this.game.add.sprite(-240, 0, 'interface', this._icon, this);
		this._iconSpr.anchor.set(0.5, 0.5);
	}

});


Jswitch.prototype.creatUI = function () {
	this._maxBetBtn = this.game.add.button(0, 0, 'dataPrep', this.swutchOn, this, "switch_on", "switch_on", "switch_on",null, this);
	this._maxBetBtn.anchor.set(0.5, 0.5);
	this._maxBetBtn.visible = false;

	this._maxBetOffBtn = this.game.add.button(this._maxBetBtn.x, this._maxBetBtn.y, 'dataPrep', this.swutchOff, this, "switch_off", "switch_off", "switch_off", null,this);
	this._maxBetOffBtn.anchor.set(0.5, 0.5);

	// this._activeBg = new Sprite(this._maxBetBtn.x - 120, this._maxBetBtn.y, "interface", "background setting", this.game);
	// this._activeBg.anchor.set(0.5, 0.5);
	// this._activeBg.visible = false;
	// this.addChild(this._activeBg);

	// this._unActiveBg = new Sprite(this._maxBetBtn.x - 120, this._maxBetBtn.y, "interface", "background-setting_off", this.game);
	// this._unActiveBg.anchor.set(0.5, 0.5);
	// this.addChild(this._unActiveBg);


}

Jswitch.prototype.setName = function () {
	if (this._name) {
		if (this._maxBetFont) {
			this._maxBetFont.text = this._name;
		} else {
			this._maxBetFont = new PIXI.Text(this._name, this._betSettingStyle);
			this._maxBetFont.x = this._maxBetBtn.x - 20;
			this._maxBetFont.y = this._maxBetBtn.y;
			this._maxBetFont.anchor.set(0.5, 0.5);
			this.addChild(this._maxBetFont);
		}
	}
}


Jswitch.prototype.setIcon = function () {

}


Jswitch.prototype.swutchOn = function () {
	this.swutchStatus(false);
}

Jswitch.prototype.swutchOff = function () {
	this.swutchStatus(true);
}

Jswitch.prototype.swutchStatus = function (bl) {
	this._maxBetBtn.visible = bl;
	this._maxBetOffBtn.visible = !bl;
	//this._activeBg.visible = bl;
	//this._unActiveBg.visible = !bl;
	this.emit('statusChange', bl);
}