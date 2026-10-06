var frameClass = function(game, group) {
  this._posLandscapeX = 5;     // laid out as originally, then moved/scaled with the board (see createLandscape)
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
    // follow the board transform: original reel origin (27,57) -> ReelClass window (336.7,177.4) at scale 0.715
    var bs = 0.7138, bx = 336.4 - 27 * bs, by = 172.8 - 57 * bs;
    this._grpFrame.scale.set(bs, bs); this._grpFrame.x = bx; this._grpFrame.y = by;
    this._grpFreeSpin.scale.set(bs, bs); this._grpFreeSpin.x = bx; this._grpFreeSpin.y = by;
    GlobalClass.deleteChildren(this._grpFrame);
    GlobalClass.deleteChildren(this._grpFreeSpin);

    switch (GlobalClass.GAME_MODE) {
      case 0:
        this._frameBg = game.add.sprite(this._posX+20, this._posY+50, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 850;
        this._frameBg.height = 510;
        this._frameBg.visible = false;   // the generated board has its own cell slots
        this.addBoard('board-base', 200, 9);
        this._frame_t = game.add.sprite(this._posX+10, this._posY-3, this._langName, 'ReelFr-Base-T.png', this._grpFrame);
        this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Base-L.png', this._grpFrame);
        this._frame_r = game.add.sprite(this._frame_t.x+849, this._frame_t.y+66, this._langName, 'ReelFr-Base-R.png', this._grpFrame);
        this._frame_b = game.add.sprite(this._frame_t.x, this._frame_t.y+550, this._langName, 'ReelFr-Base-B.png', this._grpFrame);
        break;
      case 1:
        this._frameBg = game.add.sprite(this._posX+20, this._posY+50, 'uiPanel', 'BG_allBanners.png', this._grpFrame);
        this._frameBg.width = 850;
        this._frameBg.height = 510;
        this._frameBg.visible = false;   // the generated board has its own cell slots
        this.addBoard('board-free', 186, 7);
        this._frame_t = game.add.sprite(this._posX+10, this._posY-3, this._langName, 'ReelFr-Feat-T.png', this._grpFrame);
        this._frame_l = game.add.sprite(this._frame_t.x-12, this._frame_t.y+66, this._langName, 'ReelFr-Feat-L.png', this._grpFrame);
        this._frame_r = game.add.sprite(this._frame_t.x+849, this._frame_t.y+66, this._langName, 'ReelFr-Feat-R.png', this._grpFrame);
        this._frame_b = game.add.sprite(this._frame_t.x, this._frame_t.y+550, this._langName, 'ReelFr-Feat-B.png', this._grpFrame);
        break;
    }
    

  };

  /** The board image (stage px, top-left at sx,sy on the 1280x720 stage - see _reskin_work build.py
   *  boards.json) placed inside the scaled frame group, so it slides with the reels. */
  this.addBoard = function(key, sx, sy) {
    var bs = this._grpFrame.scale.x;
    var b = game.add.sprite((sx - this._grpFrame.x) / bs, (sy - this._grpFrame.y) / bs, key, '', this._grpFrame);
    b.scale.set(0.5 / bs, 0.5 / bs);   // board images are exported at 2x the stage size (sharper on hi-dpi)
    this._board = b;
  };

  this.createPortrait = function() {
    this._posX = this._posPortraitX;
    this._posY = this._posPortraitY;
    this._grpFrame.scale.set(1, 1); this._grpFrame.x = 0; this._grpFrame.y = 0;
    this._grpFreeSpin.scale.set(1, 1); this._grpFreeSpin.x = 0; this._grpFreeSpin.y = 0;

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
