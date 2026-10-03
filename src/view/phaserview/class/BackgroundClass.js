var backgroundClass = function(game, group) {
  this._grpBackground1 = null;
  this._grpBackground2 = null;

  this._sprBgNormal = null;
  this._sprBgFeature1 = null;
  this._sprBgFeature1Gate = null;
  this._sprBgFeature2 = null;
  this._sprFreeGameTouch = null;

  this._animation = false;

  this.create = function() {
    this._grpBackground1 = game.add.group();
    group.addChild(this._grpBackground1);
    this._grpBackground2 = game.add.group();
    group.addChild(this._grpBackground2);

    this.checkResolution();
  };

  this.checkResolution = function() {
    if (AppConstants.LANDSCAPE) {
      this.createLandscape();
    } else {
      this.createPortrait();
    }
  };

  this.createLandscape = function() {
    switch (GlobalClass.GAME_MODE) {
      case GlobalClass.GAME_MODE_NORMAL:
        this.createNormalLandscape();
        break;
      case GlobalClass.GAME_MODE_FEATURE1:
        this.createFeature1Landscape();
        break;
    }
  };

  this.createPortrait = function() {
    switch (GlobalClass.GAME_MODE) {
      case GlobalClass.GAME_MODE_NORMAL:
        this.createNormalPortrait();
        break;
      case GlobalClass.GAME_MODE_FEATURE1:
        this.createFeature1Portrait();
        break;
    }
  };

  this.createNormalLandscape = function() {
    this.removeBackground();
    //document.body.style.background = "url('assets/images/Base_BG_Blured.png')";
    this._sprBgNormal = game.add.sprite(game.world.centerX, game.world.centerY, 'bg-base', '', this._grpBackground1);
    this._sprBgNormal.anchor.set(0.5, 0.5);

    // this._crack = game.add.sprite(game.world.centerX+200, game.world.centerY-80, 'uiPanel', 'crack-1.png', this._grpBackground1);
    // this._crack.anchor.set(0.5, 0.5);
    this.changeBackgroundImage(false);

    // this.coinsForeground = game.add.sprite(game.world.centerX, game.world.centerY*2, 'uiPanel', 'Coins-Foreground.png', this._grpBackground1);
    // this.coinsForeground.anchor.set(0.5, 1);
  };

  this.createFeature1Landscape = function() {
    this.removeBackground();
    //document.body.style.background = "url('assets/images/Background-Base.jpg')";
    this._sprBgFeature1Gate = game.add.sprite(game.world.centerX, game.world.centerY, 'bg-free', '');
    this._sprBgFeature1Gate.anchor.set(0.5, 0.5);
    this._grpBackground1.addChild(this._sprBgFeature1Gate);
    
    this.coinsForeground = game.add.sprite(game.world.centerX, game.world.centerY*2, 'uiPanel', 'Coins-Foreground.png', this._grpBackground1);
    this.coinsForeground.anchor.set(0.5, 1);
  };

  this.createNormalPortrait = function() {
    this.removeBackground();
    this._sprBgNormal = game.add.sprite(game.world.centerY, 0, 'bg-potrait', '', this._grpBackground1);
    this._sprBgNormal.anchor.set(0.5, 0);
    // this.foreground = game.add.sprite(game.world.centerY,game.world.centerX*2, 'mobile', 'Foreground.png', this._grpBackground1);
    // this.foreground.anchor.set(0.5, 1);

    this.changeBackgroundImage(false);
  };

  this.createFeature1Portrait = function() {
    this.removeBackground();
    this._sprBgFeature1 = game.add.sprite(game.world.centerY, 0, 'bg-potrait', '', this._grpBackground1);
    this._sprBgFeature1.anchor.set(0.5, 0);

    this._crack = game.add.sprite(game.world.centerY, 0, 'BGfeat-potrait', '', this._grpBackground1);
    this._crack.anchor.set(0.5, 0);
    
  };

  this.changeBackground = function(type) {
    switch (type) {
      case 1:
        if (AppConstants.LANDSCAPE) {
          this.reverseFeature2();
        } else {
          this.reverseFeature2Portrait();
        }
        break;
      case 2:
        if (AppConstants.LANDSCAPE) {
          this.changeFeature1();
        } else {
          this.changeFeature1Portrait();
        }
        break;
    }
  };

  // ~~~~~~~~~~ for landscape ~~~~~~~~~~
  this.changeFeature1 = function() {
    this.changeFeature1b();
  };

  this.changeFeature1b = function() {
    TweenMax.to(this._sprBgNormal,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false
    });

    TweenMax.to(this._crack,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false
    });


    if(this._sprBgFeature1Gate!=null){
      //this._sprBgFeature1Gate.destroy();
      this._sprBgFeature1Gate = null;
    }
    this._sprBgFeature1Gate = game.add.sprite(game.world.centerX, game.world.centerY, 'bg-free', '',this._grpBackground1);
    this._sprBgFeature1Gate.alpha = 0.0;
    this._sprBgFeature1Gate.anchor.set(0.5, 0.5);

    TweenMax.to(this._sprBgFeature1Gate,1, {
      alpha:1,
      ease: Linear.easeNone,
      useFrames: false,
      callbackScope: this,
      onCompleteParams: [0],
      onComplete: this.changeFeature1Finish
    });
  };

  this.changeFeature1Finish = function() {
    //this.createFeature1Landscape();
    gameplayState.changeScreen(102);
  }


  this.reverseFeature2 = function() {
    this.reverseFeature2b();
  };

  this.reverseFeature2b = function() {
    if(this._sprBgNormal!=null){
      this._sprBgNormal = null;
    }
    this._sprBgNormal = game.add.sprite(game.world.centerX, game.world.centerY, 'bg-base', '', this._grpBackground1);
    this._sprBgNormal.anchor.set(0.5, 0.5);
    this._sprBgNormal.alpha = 0.0;

    TweenMax.to(this._sprBgNormal,1, {
      alpha:1,
      ease: Linear.easeNone,
      useFrames: false,
      callbackScope: this
    });


    TweenMax.to(this._sprBgFeature1Gate,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false,
      callbackScope: this,
      onComplete: this.reverseFeature2Finish
    });

  };


  this.reverseFeature2Finish = function() {
    //this.createNormalLandscape();
    gameplayState.changeScreen(101);
  };
  // ~~~~~~~~~~ end landscape ~~~~~~~~~~



  // ~~~~~~~~~~ for portrait ~~~~~~~~~~
  this.changeFeature1Portrait = function() {
    this.changeFeature1bPortrait();
  };

  this.changeFeature1bPortrait = function() {

    TweenMax.to(this._sprBgNormal,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false
    });

    TweenMax.to(this._crack,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false
    });

    if(this._sprBgFeature1Gate!=null){
      this._sprBgFeature1Gate = null;
    }
    this._sprBgFeature1Gate = game.add.sprite(game.world.centerY,0, 'bg-potrait', '',this._grpBackground1);
    this._sprBgFeature1Gate.alpha = 0.0;
    this._sprBgFeature1Gate.anchor.set(0.5, 0);


    TweenMax.to(this._sprBgFeature1Gate,1, {
      alpha:1,
      ease: Linear.easeNone,
      useFrames: false,
      callbackScope: this,
      onComplete: this.changeFeature1bFinish
    });

  };

  this.changeFeature1bFinish = function() {
    this.createFeature1Portrait();
    gameplayState.changeScreen(102);
  };


  this.reverseFeature2Portrait = function() {
    this.reverseFeature2bPortrait();
  };

  this.reverseFeature2bPortrait = function() {
    if(this._sprBgNormal!=null){
      this._sprBgNormal = null;
    }
    this._sprBgNormal = game.add.sprite(game.world.centerY, 0, 'bg-potrait', '', this._grpBackground1);
    this._sprBgNormal.anchor.set(0.5, 0);
    this._sprBgNormal.alpha = 0.0;

    TweenMax.to(this._sprBgNormal,1, {
      alpha:1,
      ease: Linear.easeNone,
      useFrames: false
    });

    TweenMax.to(this._sprBgFeature1Gate,1, {
      alpha:0,
      ease: Linear.easeNone,
      useFrames: false,
      callbackScope: this,
      onComplete: this.reverseFeature2PortraitFinish
    });
  };

  this.reverseFeature2PortraitFinish = function() {
    this.createNormalPortrait();
    gameplayState.changeScreen(101);
  };


  this.changeBackgroundImage=function(add,times){
    // var key = "WWW2120DeluxeBG_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
    // if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
    //   myLocalStorage.setItem(key,0);
    //   return;
    // }
    
    // var spinInfo = myLocalStorage.getItem(key);
    let spinInfo = null;
    
    if(!spinInfo){
        spinInfo = 0;
    }
    spinInfo = parseInt(spinInfo);
    if(add){
      spinInfo++;
    }
    if(times){
      spinInfo = times;
    }
    // myLocalStorage.setItem(key,spinInfo);


    var index = Math.floor(spinInfo/50)+1;
    if(index>4){
        index = 4;
    }
    
    if(AppConstants.LANDSCAPE){
      this._crack = game.add.sprite(game.world.centerX+290, game.world.centerY-40, 'uiPanel', 'crack-'+index+'.png', this._grpBackground1);
      this._crack.anchor.set(0.5, 0.5);
      var x = 0;
      var y = 0;
      var scale = 1;
      if(index ==1){
          x = game.world.centerX*2-170;
          y = game.world.centerY-25;
      }
      else if(index ==2){
        x = game.world.centerX*2-225;
        y = game.world.centerY-20;
        scale = 1.5;
      }
      else if(index ==3){
        x = game.world.centerX*2-225;
        y = game.world.centerY-28;
        scale = 1.8;
      }
      else if(index == 4){
        x = game.world.centerX*2-330;
        y = game.world.centerY-35;
        scale = 1.8;
      }
      else if(index ==5){
        x = game.world.centerX*2-350;
        y = game.world.centerY-28;
        scale = 1.8;
      }
      this.crackFX = game.add.sprite(x, y, 'crackFX'+index, 'Crack'+index+'FX_00.png', this._grpBackground1);
      this.crackFX.anchor.set(1, 0.5);
      this.crackFX.scale.set(scale);
      var textures = this.crackFX.animations.generateFrameNames('Crack'+index+'FX_', 0, 8, '.png',2);
      this.crackFX.animations.add("anim", textures,true,0.15);
      this.crackFX.animations.play('anim');

      this.coinsForeground = game.add.sprite(game.world.centerX, game.world.centerY*2, 'uiPanel', 'Coins-Foreground.png', this._grpBackground1);
      this.coinsForeground.anchor.set(0.5, 1);
    }
    else{
      this._crack = game.add.sprite(game.world.centerX-158, game.world.centerY-170 /*-185*/, 'uiPanel', 'crack-'+index+'.png', this._grpBackground1);
      this._crack.anchor.set(0.5, 0.5);
      this._crack.scale.set(0.64);
      // this.foreground = game.add.sprite(game.world.centerY,game.world.centerX*2, 'mobile', 'Foreground.png', this._grpBackground1);
      // this.foreground.anchor.set(0.5, 1);
    }


  };

  // ~~~~~~~~~~ end portrait ~~~~~~~~~~

  this.removeBackground = function() {
    GlobalClass.deleteChildren(this._grpBackground1);
    GlobalClass.deleteChildren(this._grpBackground2);
  };
}
