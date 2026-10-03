function Jsilder(x, y, parent) {
	PIXI.Container.call(this);
	this.x = x;
	this.y = y;
	this.game = parent.game;
	parent.addChild(this);


	this.game;
	this._betMeterFrame;
	this._betMeter;
	this._silderBtn;
	this._betBounds;
	this._maxBetWidth;
	this._txtBarBetMin;
	this._txtBarBetMax;
	this._txtSliderBet;
	this._txtSliderBet;

	this.creatUI()


}
Jsilder.prototype = Object.create(PIXI.Container.prototype);
Jsilder.prototype.constructor = Jsilder;
Jsilder.prototype._betSettingStyle3 = {
	fontFamily: "Arial",
	fontSize: "28px",
	fill: "#fff",
	boundsAlignH: "middle",
	boundsAlignV: "center",
	align: "center"
};

Object.defineProperty(Jsilder.prototype, "max", {
	set: function (value) {
		this._txtBarBetMax.text = value;
	}
});

Object.defineProperty(Jsilder.prototype, "mini", {
	set: function (value) {
		this._txtBarBetMin.text = value;
	}
});

Object.defineProperty(Jsilder.prototype, "bet", {
	set: function (value) {
		this._txtSliderBet.text = value;
	}
});


Jsilder.prototype.creatUI = function () {
	this._txtBarBetMin = new PIXI.Text('', this._betSettingStyle3);
	this._txtBarBetMin.x = 0;
	this._txtBarBetMin.y = 0;
	this._txtBarBetMin.anchor.set(1, 0.5);
	this.addChild(this._txtBarBetMin);

	this._betMeterFrame = new Sprite(this._txtBarBetMin.x + 20, 0, 'interface', 'betcoinvalue bar.png', this.game);
	this._betMeterFrame.anchor.set(0, 0.5);
	this._maxBetWidth = this._betMeterFrame.width;
	this.addChild(this._betMeterFrame)

	this._betMeter = new Sprite(this._txtBarBetMin.x + 20, 0, 'interface', 'betcoinvalue bar color.png', this.game);

	this._betMeter.anchor.set(0, 0.5);


	this._txtBarBetMax = new PIXI.Text('', this._betSettingStyle3);
	this._txtBarBetMax.x = this._txtBarBetMin.x + 430;
	this._txtBarBetMax.y = this._txtBarBetMin.y;
	this._txtBarBetMax.anchor.set(0.5, 0.5);
	this.addChild(this._txtBarBetMax);

	this._betMeter.width = 0;
	this.addChild(this._betMeter)




	this._betBounds = new PIXI.Rectangle(20, 0, this._betMeterFrame.width, this._betMeterFrame.height);

	this._silderBtn = new silderBtn(20, 0, 'interface', 'icon drag bar.png', this);
	this._silderBtn.boundsRect2 = this._betBounds;
	this._silderBtn.on("dragUpdate", this.onBetDragUpdate, this);


	this._txtSliderBet = new PIXI.Text('', this._betSettingStyle3);
	this._txtSliderBet.x = this._silderBtn.x;
	this._txtSliderBet.y = this._silderBtn.y - 30;
	this._txtSliderBet.anchor.set(0.5, 0.5);
	this.addChild(this._txtSliderBet);

}

Jsilder.prototype.onBetDragUpdate = function (point) {
	let _x = point.x;
	let percentage = Math.floor((_x - this._betMeter.x) / this._betMeterFrame.width * 100);
	this._betMeter.width = this._maxBetWidth * percentage / 100;
	this._txtSliderBet.x = this._silderBtn.x;


	this.emit('silderChange', percentage);
}

Jsilder.prototype.setPercentage = function (value) {
	this._betMeter.width = this._maxBetWidth * value / 100;
	this._silderBtn.position.x = this._betMeter.width + 20;
	this._txtSliderBet.x = this._silderBtn.x;
}
