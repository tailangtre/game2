var rosePetalClass = function(game,group){
  this._grpCoin = null;
  this._sprCoin = null;
  this._coinX=null;
	
  this.create = function(){
    this._grpCoin = game.add.group();
    group.addChild(this._grpCoin);
    _coinX=Math.floor(Math.random() * 965);
		var _name='Rose Petal.png';
		var _random = Math.floor(Math.random() * (1 - 0+1)) + 0;
		if(_random!=0){
			_name="Rose Petal_Blur.png"
		}
		
    this._sprCoin = game.add.sprite(_coinX, 0, 'love', _name, this._grpCoin);
    this._sprCoin.anchor.set(0.5, 0.5);
    this._sprCoin.scale.set(0.5, 0.5);

    TweenMax.to(this._sprCoin, 2, {
        angle: Math.random() * 360,
        ease: Linear.easeNone,
        useFrames: false
    });
    TweenMax.to(this._sprCoin, Math.floor(Math.random() * 500 + 1000)/1000, {
        y: 740,
        ease: Linear.easeNone,
        useFrames: false,
        callbackScope: this,
        onComplete: this.remove
    });
  };

  this.remove = function(){
    if(this._grpCoin != null){
      this._grpCoin.destroy();
    }
    TweenMax.killTweensOf(this._sprCoin);
  };
};
