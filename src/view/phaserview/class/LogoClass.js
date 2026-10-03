
var logoClass = function(game, group) {
  this._grpLogo = null;
  this._sprLogo = null;
  this._langName = "ui";

  this.create = function() {
    if(GlobalClass.GAME_LANG=='zh'){
      this._langName = "ui_zh";
    }
    this._grpLogo = game.add.group();
    group.addChild(this._grpLogo);
    this.checkResolution();
  };
  
  this.drawScreen = function() {
    GlobalClass.deleteChildren(this._grpLogo);

		if (AppConstants.LANDSCAPE) {
      this._sprLogo = game.add.sprite(game.world.centerY+30,52, "ui", 'deluxe-font.png', this._grpLogo);
      this._sprLogo.anchor.set(0, 0);
		}
		else{
      this._sprLogo = game.add.sprite(game.world.centerY,2, 'ui',"Title.png", this._grpLogo);
      this._sprLogo.anchor.set(0.5, 0);
      this._sprLogo.scale.set(0.6);

      this.deluxefont = game.add.sprite(game.world.centerY,40, "ui","deluxe-font.png", this._grpLogo);
      this.deluxefont.anchor.set(0.5, 0);
		}
		
  };

  this.checkResolution = function() {
    if (AppConstants.LANDSCAPE) {
      this.createLandscape();
    } else {
      this.createPortrait();
    }
  };

  this.createLandscape = function() {
    this.drawScreen();
  }

  this.createPortrait = function() {
    this.drawScreen();
  };

  this.setAlpha = function(value) {

    TweenMax.to(this._sprLogo,1, {
        alpha: value,
        ease: Linear.easeNone,
        useFrames: false
    });
  }
}
