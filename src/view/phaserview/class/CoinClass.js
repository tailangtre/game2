var coinClass = function(game,group){
  this._grpCoin = null;
  this._sprCoin = null;

  this.create = function(){
    this._grpCoin = game.add.group();
    group.addChild(this._grpCoin);

    this._sprCoin = game.add.sprite(0, 0, 'ui', 'Coin_01.png', this._grpCoin);
    this._sprCoin.anchor.set(0.5, 0.5);
    this._sprCoin.scale.set(0.5, 0.5);
    this._sprCoin.animations.add('coinAnim', this._sprCoin.animations.generateFrameNames('Coin_', 1, 8, '.png', 2), true,0.15);
    this._sprCoin.animations.play('coinAnim');


    TweenMax.to(this._sprCoin.scale, 0.8, {
      x: 0.5,
      y: 0.5,
      ease: Linear.easeNone
  });

    TweenMax.to(this._sprCoin, 0.8, {
      angle: Math.random() * 360,
      ease: Linear.easeNone
  });

    var coinWidth = 100;
    var coinHeight = 100;

    var tweenCoin;

    switch (Math.floor(Math.random() * 4)) {
        case 0: //up

            TweenMax.to(this._sprCoin, Math.floor(Math.random() * 500 + 1000)/1000, {
              x: Math.floor(Math.random() * 1280 - 640),
                y: 0 - coinHeight - 640,
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete:this.remove
          });

            break;
        case 1: // down
           


            TweenMax.to(this._sprCoin, Math.floor(Math.random() * 500 + 1000)/1000, {
              x: Math.floor(Math.random() * 1280 - 640),
                y: 640 + coinHeight,
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete:this.remove
          });

            break;
        case 2: // left

            TweenMax.to(this._sprCoin, Math.floor(Math.random() * 500 + 1000)/1000, {
              x: 0 - coinWidth - 640,
                y: Math.floor(Math.random() * 1280 - 640),
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete:this.remove
          });

            break;
        case 3: // right

            TweenMax.to(this._sprCoin, Math.floor(Math.random() * 500 + 1000)/1000, {
              x: 640 + coinWidth,
                y: Math.floor(Math.random() * 1280 - 640),
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete:this.remove
          });
            break;
        default:
    }
  };

  this.remove = function(){
    if(this._grpCoin != null){
      this._grpCoin.destroy();
    }
    TweenMax.killTweensOf(this._sprCoin);
  };
};
