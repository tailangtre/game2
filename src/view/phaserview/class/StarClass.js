var starClass = function(game,group){
  this._grpStar = null;
  this._star = null;

  this.create = function(){
    this._grpStar = game.add.group();
    group.addChild(this._grpStar);

    var index = Math.floor(Math.random() * 4)+1
    var pngName = "Diamond_0"+index+".png";
    this._star = game.add.sprite(0,0, 'ui', pngName, this._grpStar);
    this._star.anchor.set(0.5, 0.5);
    this._star.scale.set(0.2, 0.2);

    // var starScale = game.add.tween(this._star.scale).to({
    //     x: 0.8,
    //     y: 0.8
    // }, 800, Phaser.Easing.Linear.None, true, 0, 0);

    TweenMax.to(this._star.scale, 0.8, {
        x: 0.8,
        y: 0.8,
        ease: Linear.easeNone,
        useFrames: false
    });

    var starHeight = 100;
    var starWidth = 100;


    var starTween;

    switch (Math.floor(Math.random() * 4)) {
        case 0: //up
           

            TweenMax.to(this._star,  Math.floor(Math.random() * 500 + 1000)/1000, {
              x: Math.floor(Math.random() * 1280 - 640),
              y: 0 - starHeight - 640,
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete: this.destroyStar
          });

            break;
        case 1: // down
           

            TweenMax.to(this._star,  Math.floor(Math.random() * 500 + 1000)/1000, {
              x: Math.floor(Math.random() * 1280 - 640),
              y: 640 + starHeight,
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete: this.destroyStar
          });

            break;
        case 2: // left
          //  starTween = game.add.tween(this._star).to({
          //       x: 0 - starWidth - 640,
          //       y: Math.floor(Math.random() * 1280 - 640)
          //   }, Math.floor(Math.random() * 500 + 1000), Phaser.Easing.Linear.None, true);
          //   starTween.onComplete.add(this.destroyStar,this);
            TweenMax.to(this._star,  Math.floor(Math.random() * 500 + 1000)/1000, {
              x: 0 - starWidth - 640,
              y: Math.floor(Math.random() * 1280 - 640),
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete: this.destroyStar
          });

            break;
        case 3: // right
          //  starTween = game.add.tween(this._star).to({
          //       x: 640 + starWidth,
          //       y: Math.floor(Math.random() * 1280 - 640)
          //   }, Math.floor(Math.random() * 500 + 1000), Phaser.Easing.Linear.None, true);
          //   starTween.onComplete.add(this.destroyStar,this);

            TweenMax.to(this._star,  Math.floor(Math.random() * 500 + 1000)/1000, {
              x: 640 + starWidth,
              y: Math.floor(Math.random() * 1280 - 640),
              ease: Linear.easeNone,
              useFrames: false,
              callbackScope: this,
              onComplete: this.destroyStar
          });
            break;
        default:
    }
  };

  this.destroyStar = function(){
    if(this._grpStar != null){
      this._grpStar.destroy();
    }
    TweenMax.killTweensOf(this._grpStar);
  };

};

