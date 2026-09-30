var frameClass = function(game, group) {
  this._posLandscapeX = 5;
  this._posLandscapeY = 10;
  this._posPortraitX = 0;
  this._posPortraitY = 345;
  this._posX = 0;
  this._posY = 0;

  this._grpFrame = null;
  this._grpFreeSpin = null;

  this._frame = null;
  this._freegamebox = null;
  this._langName = "uiPanel";

  this.create = function() {
    // if(GlobalClass.GAME_LANG=='zh'){
    //   this._langName = "ui_zh";
    // }
    this._grpFrame = game.add.group();
    group.addChild(this._grpFrame);

    this._grpFreeSpin = game.add.group();
    group.addChild(this._grpFreeSpin);

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
    this._posX = this._posLandscapeX;
    this._posY = this._posLandscapeY;
    this._grpFrame.scale.set(1,1);
    this._grpFreeSpin.scale.set(1,1);
    GlobalClass.deleteChildren(this._grpFrame);
    GlobalClass.deleteChildren(this._grpFreeSpin);

    switch (GlobalClass.GAME_MODE) {
      case 0:
        this._frameBg = game.add.sprite(this._posX+20, this._posY+50, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 850;
        this._frameBg.height = 510;
        this._frame_t = game.add.sprite(this._posX+10, this._posY-3, this._langName, 'ReelFr-Base-T.png', this._grpFrame);
        this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Base-L.png', this._grpFrame);
        this._frame_r = game.add.sprite(this._frame_t.x+849, this._frame_t.y+66, this._langName, 'ReelFr-Base-R.png', this._grpFrame);
        this._frame_b = game.add.sprite(this._frame_t.x, this._frame_t.y+550, this._langName, 'ReelFr-Base-B.png', this._grpFrame);
        break;
      case 1:
        this._frameBg = game.add.sprite(this._posX+20, this._posY+50, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 850;
        this._frameBg.height = 510;
        this._frame_t = game.add.sprite(this._posX+10, this._posY-3, this._langName, 'ReelFr-Feat-T.png', this._grpFrame);
        this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Feat-L.png', this._grpFrame);
        this._frame_r = game.add.sprite(this._frame_t.x+849, this._frame_t.y+66, this._langName, 'ReelFr-Feat-R.png', this._grpFrame);
        this._frame_b = game.add.sprite(this._frame_t.x, this._frame_t.y+550, this._langName, 'ReelFr-Feat-B.png', this._grpFrame);
        break;
    }
    

  };

  this.createPortrait = function() {
    this._posX = this._posPortraitX;
    this._posY = this._posPortraitY;

    GlobalClass.deleteChildren(this._grpFrame);
    GlobalClass.deleteChildren(this._grpFreeSpin);
    switch (GlobalClass.GAME_MODE) {
      case 0:
      case 1:
        this._frameBg = game.add.sprite(this._posX, this._posY+20, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 710;
        this._frameBg.height = 440;
        // this._frame_t = game.add.sprite(this._posX, this._posY-13, this._langName, 'ReelFr-Base-T.png', this._grpFrame);
        // this._frame_t.width = 715;
        // this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Base-L.png', this._grpFrame);
        // this._frame_l.height = 385;
        this._frame_r = game.add.sprite(this._posX, this._posY+20, this._langName, 'reel-frame-potrait.png', this._grpFrame);
        //this._frame_r.height = 385;
        this._frame_b = game.add.sprite(this._posX, this._posY-13+450, this._langName, 'ReelFr-Base-B.png', this._grpFrame);
        this._frame_b.width = 715;
        break;
      case 2:
        this._frameBg = game.add.sprite(this._posX, this._posY+20, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 710;
        this._frameBg.height = 440;
        this._frame_t = game.add.sprite(this._posX, this._posY-13, this._langName, 'ReelFr-Feat-T.png', this._grpFrame);
        this._frame_t.width = 720;
        this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Feat-L.png', this._grpFrame);
        this._frame_l.height = 385;
        this._frame_r = game.add.sprite(this._frame_t.x+700, this._frame_t.y+66, this._langName, 'ReelFr-Feat-R.png', this._grpFrame);
        this._frame_r.height = 385;
        this._frame_b = game.add.sprite(this._frame_t.x, this._frame_t.y+450, this._langName, 'ReelFr-Feat-B.png', this._grpFrame);
        this._frame_b.width = 720;
        break;
    }
  };
}
