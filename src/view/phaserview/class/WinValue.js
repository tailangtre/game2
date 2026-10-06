var winvalueClass = function(game, group) {
  this._posLandscapeX = 640;   // centre of the board (was 454)
  this._posLandscapeY = 360;
  this._posPortraitX = 360;
  this._posPortraitY = 600;
  this._grpPosition = null;

  this._grpValue = null;
  this._sprBackground = null;
  this._txtWin = null;
  this._txtValue = null;
  this._tmrValue = null;

  this._countingCount = 0;
  this._countingSound = 0;

  this._currentValue = 0;
  this._totalValue = 0; 
  this._addValue = 0;
  this._sumValue = 0;

  this._soundCount = 0;
  this._soundTrigger = 5;

  this._multiply = 1;

  this._totalTime = 20; //10 = 1 sec

  this.create = function(value, multi,showTime,showAniPos) {
    this._style={
      font: "72px " + "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#8ff0d6",
      align: "center",
      dropShadow: true, dropShadowColor: "#000000", dropShadowAlpha: 0.65, dropShadowBlur: 6, dropShadowDistance: 2, padding: 12
    };
    this._grpPosition = game.add.group();
    group.addChild(this._grpPosition);

    this._grpValue = game.add.group();
    this._grpPosition.addChild(this._grpValue);
    this._totalTime = showTime/60;
    if (multi == undefined) {
      multi = 1;
    }
    this._multiply = multi;
    this._totalValue = value / this._multiply;
    GlobalClass.showNumber(game, this._grpValue, this._totalValue, this._totalTime, this.showNumberEnd, this, false, true);

    this.checkResolution();
  };

  this.drawScreen = function() {
    GlobalClass.showNumber(game, this._grpValue, this._totalValue, this._totalTime, this.showNumberEnd, this, false, true);
  
  };

  this.showNumberEnd=function(){
    TweenMax.to(this._grpValue,0.3, {
      alpha: 0,
      y:-120,
      delay: 0.7,
      ease: Linear.easeNone,
      useFrames: false
    });
  };

  this.checkResolution = function() {
    if (AppConstants.LANDSCAPE) {
      this.createLandscape();
    } else {
      this.createPortrait();
    }
  };

  this.createLandscape = function() {
    this._grpPosition.x = this._posLandscapeX;
    this._grpPosition.y = this._posLandscapeY;
    this._grpPosition.scale.set(1,1);
  };

  this.createPortrait = function() {
    this._grpPosition.x = this._posPortraitX;
    this._grpPosition.y = this._posPortraitY;
    this._grpPosition.scale.set(GlobalClass.PORTRAIT_SCALE,GlobalClass.PORTRAIT_SCALE);
  };

  

  this.remove = function() {

    if (this._tmrValue != null) {
      game.time.events.remove(this._tmrValue);
			this._tmrValue=null;
    }

    if (this._grpValue != null) {
      TweenMax.killTweensOf(this._grpValue);
      GlobalClass.deleteChildren(this._grpValue);
      this._grpValue.visible = false;
      //this._grpValue.destroy();
      //this._grpValue = null;
    }

    gameplayState._winValue = null;
  };

}
