var optionClass = function (game, group) {
  this._grpOption = null;
  this._isMuted = null;
  
  this.create = function () {
    GlobalClass.GAME_OPTION = true;
    // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_ACTIVE");

    this._grpHidden = game.add.group();
    group.addChild(this._grpHidden);
    this._grpHidden.visible = false;

    this._grpOption = game.add.group();
    group.addChild(this._grpOption);


    this._betSettingStyle = {
      fontSize: "32px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "bold",
      fill: "#fff",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    };
    this._betSettingStyle2 = {
      fontSize: "20px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "bold",
      fill: "#8ff0d6",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    };
    this._betSettingStyle3 = {
      fontSize: "24px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    };

    // if (game.device.desktop) {
    //   this.createDesk();
    // }
    // else {
      if (AppConstants.LANDSCAPE) {
        this.createLandscape();
      } else {
        this.createPortrait();
      }
    // }
  };

  this.startBetPro = function () {
    var len1 = parseInt(GlobalClass.GAME_BET_POS) + 1;
    var len2 = GlobalClass.GAME_BET.length;
    var res = len1 / len2;
    return res;
  };

  this.startCoinPro = function () {
    var res = (GlobalClass.GAME_COIN_POS + 1) / GlobalClass.GAME_COIN_VALUE.length;
    return res;
  };

  this.createLandscape = function () {
    this._maskBG = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpOption);
    this._maskBG.width = GlobalClass.STAGE_WIDTH * 2;
    this._maskBG.height = GlobalClass.STAGE_HEIGHT * 2;
    this._maskBG.interactive = true;

    var frame = game.add.sprite(game.world.centerX, game.world.centerY, 'mobile', 'settingFilter-resize2fullscreen.png', this._grpOption);
    frame.anchor.set(0.5, 0.5);
    frame.width = game.world.centerX * 2;
    frame.height = game.world.centerY * 2;

    var title = game.add.text(game.world.centerX, 40, GlobalClass.getXMLByKey(game, "optionwin setting"), {
      fontSize: "38px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpOption);
    title.anchor.set(0.5);

    var closeBtn = game.add.button(frame.x + 600, frame.y - 300, 'mobile', this.btnClick, this, "x_button.png", "x_button.png", "x_button.png", "closeWin", this._grpOption);
    closeBtn.anchor.set(0.5, 0.5);


    var settingvalueFrame = game.add.sprite(222, 140, 'mobile', 'setting-value-frame.png', this._grpHidden);
    settingvalueFrame.anchor.set(0.5, 0.5);

    var betTitle = game.add.text(settingvalueFrame.x, settingvalueFrame.y - 40, GlobalClass.getXMLByKey(game, "optionwin bet"), {
      fontSize: "24px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpHidden);
    betTitle.anchor.set(0.5);

    
    var settingFrame = game.add.sprite(game.world.centerX + 122, 140, 'mobile', 'setting-meter-frame.png', this._grpHidden);
    settingFrame.anchor.set(0.5, 0.5);

    this._txtBarBetMin = game.add.text(GlobalClass.getPosY(390 + 20), GlobalClass.getPosY(140 + 40), GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[0]), this._betSettingStyle3);
    this._txtBarBetMin.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtBarBetMin);

    this._txtBarBetMax = game.add.text(this._txtBarBetMin.x + 762 - 40, this._txtBarBetMin.y, GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1]), this._betSettingStyle3);
    this._txtBarBetMax.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtBarBetMax);

    this._betMeter = game.add.sprite(this._txtBarBetMin.x + 12 - 20, this._txtBarBetMin.y - 2 - 40, 'mobile', 'setting-meter.png', this._grpHidden);
    this._betMeter.anchor.set(0, 0.5);
    this._maxBetWidth = this._betMeter.width;
    this._betMeter.width = this._betMeter.width * this.startBetPro();

    this._bounds = new PIXI.Rectangle(this._betMeter.x, this._betMeter.y - 22, 723, 45);

    this._betBullet = new silderBtn(403 + 723 * this.startBetPro(), this._bounds.y + 23, 'mobile', 'slider-button.png', game);
    this._betBullet.boundsRect2 = this._bounds;
    this._betBullet.on("dragUpdate", this.onBetDragUpdate, this);
    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1 || AppConstants.PDX_ROUND_ID != "") {
      this._betBullet.disable();
    }

    this._grpHidden.addChild(this._betBullet);

    this._txtSliderBet = game.add.text(this._betBullet.x, this._betBullet.y - 40, GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]), this._betSettingStyle2);
    this._txtSliderBet.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtSliderBet);

    this._valueTotalBetOption = game.add.text(215, settingFrame.y + 13, GlobalClass.getFormatCurrency(GlobalClass.betPerLine1()), this._betSettingStyle);
    this._valueTotalBetOption.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._valueTotalBetOption);
    

    // ////////coins value

    var settingvalueFrame = game.add.sprite(222, this._txtBarBetMin.y + 148, 'mobile', 'setting-value-frame.png', this._grpHidden);
    settingvalueFrame.anchor.set(0.5, 0.5);

    var betTitle = game.add.text(settingvalueFrame.x, settingvalueFrame.y - 30, GlobalClass.getXMLByKey(game, "optionwin coinvalue"), {
      fontSize: "24px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpHidden);
    betTitle.anchor.set(0.5);

    var settingcFrame = game.add.sprite(game.world.centerX + 122, this._txtBarBetMin.y + 148, 'mobile', 'setting-meter-frame.png', this._grpHidden);
    settingcFrame.anchor.set(0.5, 0.5);


    this._txtBarCoinMin = game.add.text(this._txtBarBetMin.x - 10 + 20, this._txtBarBetMin.y + 148 + 40, GlobalClass.GAME_COIN_VALUE[0], this._betSettingStyle3);
    this._txtBarCoinMin.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtBarCoinMin);

    this._txtBarCoinMax = game.add.text(this._txtBarCoinMin.x + 770 - 60, this._txtBarCoinMin.y, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_VALUE.length - 1], this._betSettingStyle3);
    this._txtBarCoinMax.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtBarCoinMax);

    this._coinMeter = game.add.sprite(this._txtBarCoinMin.x + 22 - 40, this._txtBarCoinMin.y - 2 - 40, 'mobile', 'setting-meter.png', this._grpHidden);
    this._coinMeter.anchor.set(0, 0.5);
    this._maxCoinWidth = this._coinMeter.width;
    this._coinMeter.width = this._coinMeter.width * this.startCoinPro();

    this._cbounds = new PIXI.Rectangle(this._coinMeter.x, this._coinMeter.y - 22, 723, 45);

    this._coinBullet = new silderBtn(403 + 723 * this.startCoinPro(), this._cbounds.y + 23, 'mobile', 'slider-button.png', game);
    this._coinBullet.boundsRect2 = this._cbounds;
    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1 || AppConstants.PDX_ROUND_ID != "") {
      this._coinBullet.disable();
    }
    this._coinBullet.on("dragUpdate", this.onCoinDragUpdate, this);

    this._grpHidden.addChild(this._coinBullet);

    this._txtSliderCoin = game.add.text(this._coinBullet.x, this._coinBullet.y - 40, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS], this._betSettingStyle2);
    this._txtSliderCoin.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtSliderCoin);

    this._valueTotalCoinOption = game.add.text(225, settingcFrame.y + 23, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS], {
      fontSize: "42px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "bold",
      fill: "#fff",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    });
    this._valueTotalCoinOption.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._valueTotalCoinOption);


    this._soundON = game.add.button(222, settingcFrame.y + 180 - 250, 'mobile', this.btnClick, this, "sound-on.png", "sound-on.png", "sound-on.png", "soundOFF", this._grpOption);
    this._soundON.anchor.set(0.5, 0.5);

    this._soundOFF = game.add.button(this._soundON.x, this._soundON.y, 'mobile', this.btnClick, this, "sound-off.png", "sound-off.png", "sound-off.png", "soundON", this._grpOption);
    this._soundOFF.anchor.set(0.5, 0.5);
    this._soundOFF.visible = false;

    var settingsFrame = game.add.sprite(game.world.centerX + 122, this._txtBarCoinMin.y + 150 - 250, 'mobile', 'setting-meter-frame.png', this._grpOption);
    settingsFrame.anchor.set(0.5, 0.5);


    this._soundMeter = game.add.sprite(this._txtBarCoinMin.x + 22 - 40, this._txtBarCoinMin.y + 150 - 250, 'mobile', 'setting-meter.png', this._grpOption);
    this._soundMeter.anchor.set(0, 0.5);
    this._maxWidth = this._soundMeter.width;

    this._sbounds = new PIXI.Rectangle(this._soundMeter.x, this._soundMeter.y - 22, 723, 45);
    var x = this._soundMeter.x + 723;
    if (GlobalClass.GAME_SOUND_BAR_X != -1) {
      if (GlobalClass.GAME_SOUND_BAR_X == 0) {
        x = 402;
      }
      else {
        x = this._soundMeter.x + 723 * GlobalClass.GAME_SOUND_BAR_X;
      }
    }

    this._volumeBullet = new silderBtn(x, this._sbounds.y + 23, 'mobile', 'slider-button.png', game);
    this._volumeBullet.boundsRect2 = this._sbounds;
    this._volumeBullet.on("dragUpdate", this.onVolumeDragUpdate, this);
    this._grpOption.addChild(this._volumeBullet);

    this._txtSliderSound = game.add.text(this._volumeBullet.x, this._volumeBullet.y - 40, 100, this._betSettingStyle2);
    this._txtSliderSound.anchor.set(0.5, 0.5);
    this._grpOption.addChild(this._txtSliderSound);

    this.onVolumeDragUpdate();

    if (AppConstants.TURBO) {
      this._qsONBtn = game.add.button(game.world.centerX, this._soundMeter.y + 140 + 60, 'mobile', this.btnClick, this, "on.png", "on.png", "on.png", "qsOFF", this._grpOption);
      this._qsONBtn.anchor.set(0.5, 0.5);

      this._qsOFFBtn = game.add.button(this._qsONBtn.x,  this._qsONBtn.y, 'mobile', this.btnClick, this, "off.png", "off.png", "off.png", "qsON", this._grpOption);
      this._qsOFFBtn.anchor.set(0.5, 0.5);

      var qsText = game.add.text(this._qsONBtn.x, this._qsONBtn.y - 35, GlobalClass.getXMLByKey(game, "optionwin quickspin"), {
        fontSize: "32px",
        fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fill: "#ffffff",
        align: "center"
      }, this._grpOption);
      qsText.anchor.set(0.5);

      if (GlobalClass.CONFIG_QUICKSPIN) {
        this._qsONBtn.visible = true;
        this._qsOFFBtn.visible = false;
      }
      else {
        this._qsONBtn.visible = false;
        this._qsOFFBtn.visible = true;
      }
    }

    // this._stsONBtn = game.add.button(game.world.centerX+180,this._soundMeter.y+150, 'mobile', this.btnClick, this, "on.png", "on.png", "on.png", "stsOFF", this._grpOption);
    // this._stsONBtn.anchor.set(0.5, 0.5);

    // this._stsOFFBtn = game.add.button(game.world.centerX+180,this._soundMeter.y+150, 'mobile', this.btnClick, this, "off.png", "off.png", "off.png", "stsON", this._grpOption);
    // this._stsOFFBtn.anchor.set(0.5, 0.5);

    // var stsText = game.add.text(this._stsONBtn.x,this._stsONBtn.y-35,GlobalClass.getXMLByKey(game,"optionwin spacebar"),{
    //   fontSize:"22px",
    //   fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
    //   fill: "#ffffff",
    //   align: "center"
    // },this._grpOption);
    // stsText.anchor.set(0.5);

    // if(GlobalClass.CONFIG_SPACEBAR){
    //   this._stsONBtn.visible = true;
    //   this._stsOFFBtn.visible = false;
    // }
    // else{
    //   this._stsONBtn.visible = false;
    //   this._stsOFFBtn.visible = true;
    // }

  };

  this.createDesk = function () {
    this._maskBG = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpOption);
    this._maskBG.width = GlobalClass.STAGE_WIDTH * 2;
    this._maskBG.height = GlobalClass.STAGE_HEIGHT * 2;
    this._maskBG.interactive = true;

    // if(GlobalClass.GAME_LANG=='zh'){
    //   var frame = game.add.sprite(game.world.centerX, game.world.centerY-50, 'ui_zh', 'option-frame.png', this._grpOption);
    //   frame.anchor.set(0.5, 0.5);
    // }
    // else{
    //   var frame = game.add.sprite(game.world.centerX, game.world.centerY-50, 'uiPanel', 'option-frame.png', this._grpOption);
    //   frame.anchor.set(0.5, 0.5);
    // }
    var frame = game.add.sprite(game.world.centerX, game.world.centerY - 50, 'uiPanel', 'option-frame.png', this._grpOption);
    frame.anchor.set(0.5, 0.5);

    this._title = game.add.text(frame.x, frame.y - 130, GlobalClass.getXMLByKey(game, "optionwin options"), {
      fontSize: "32px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "bold",
      fill: "#e4f7f2",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    });
    this._title.anchor.set(0.5, 0.5);
    this._grpOption.addChild(this._title);

    var closeBtn = game.add.button(frame.x + 313, frame.y - 178, 'ui', this.btnClick, this, "close-button-hov.png", "close-button.png", "close-button-clk.png", "closeWin", this._grpOption);
    closeBtn.anchor.set(0.5, 0.5);

    this._soundON = game.add.button(frame.x + 210, frame.y - 60, 'ui', this.btnClick, this, "sound-on.png", "sound-on.png", "sound-on.png", "soundOFF", this._grpOption);
    this._soundON.anchor.set(0.5, 0.5);

    this._soundOFF = game.add.button(frame.x + 210, this._soundON.y, 'ui', this.btnClick, this, "sound-off.png", "sound-off.png", "sound-off.png", "soundON", this._grpOption);
    this._soundOFF.anchor.set(0.5, 0.5);
    this._soundOFF.visible = false;

    var soundFrame = game.add.sprite(game.world.centerX - 36, this._soundON.y, 'ui', 'volume-frame.png', this._grpOption);
    soundFrame.anchor.set(0.5, 0.5);

    this._soundMeter = game.add.sprite(soundFrame.x - 201, this._soundON.y - 2, 'ui', 'volume-meter.png', this._grpOption);
    this._soundMeter.anchor.set(0, 0.5);
    this._maxWidth = this._soundMeter.width - 10;

    var bounds = new PIXI.Rectangle(frame.x - 240, this._soundON.y - 15, 400, 30);

    var x = frame.x + 130;
    if (GlobalClass.GAME_SOUND_BAR_X != -1) {
      if (GlobalClass.GAME_SOUND_BAR_X == 0) {
        x = 400;
      }
      else {
        x = this._soundMeter.x + 380 * GlobalClass.GAME_SOUND_BAR_X;
      }
    }

    this._volumeBullet = new silderBtn(x, bounds.y + 13, 'ui', 'volume-slider.png', game);
    this._volumeBullet.boundsRect2 = bounds;
    this._volumeBullet.on("dragUpdate", this.onVolumeDragUpdate, this);
    this._grpOption.addChild(this._volumeBullet);
    this.onVolumeDragUpdate();

    // quick button
    if (AppConstants.TURBO) {
      this._qspin = game.add.text(frame.x - 30, frame.y + 35, GlobalClass.getXMLByKey(game, "optionwin quickspin"), {
        fontSize: "24px",
        fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "bold",
        fill: "#e4f7f2",
        boundsAlignH: "middle",
        boundsAlignV: "center",
        align: "center"
      });
      this._qspin.anchor.set(0.5, 0.5);
      this._grpOption.addChild(this._qspin);

      this._qsONBtn = game.add.button(frame.x + 210, (frame.y - 60) + 95, 'ui', this.btnClick, this, "ON.png", "ON.png", "ON.png", "qsOFF", this._grpOption);
      this._qsONBtn.anchor.set(0.5, 0.5);

      this._qsOFFBtn = game.add.button(this._qsONBtn.x, this._qsONBtn.y, 'ui', this.btnClick, this, "OFF.png", "OFF.png", "OFF.png", "qsON", this._grpOption);
      this._qsOFFBtn.anchor.set(0.5, 0.5);

      if (GlobalClass.CONFIG_QUICKSPIN) {
        this._qsONBtn.visible = true;
        this._qsOFFBtn.visible = false;
      }
      else {
        this._qsONBtn.visible = false;
        this._qsOFFBtn.visible = true;
      }
    }

    // spacebar button
    // if (AppConstants.CONTINUOUS_KEYBOARD) {
      this._stspin = game.add.text(frame.x - 35, frame.y + 130, GlobalClass.getXMLByKey(game, "optionwin spacebar"), {
        fontSize: "24px",
        fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontWeight: "bold",
        fill: "#e4f7f2",
        boundsAlignH: "middle",
        boundsAlignV: "center",
        align: "center"
      });
      this._stspin.anchor.set(0.5, 0.5);
      this._grpOption.addChild(this._stspin);

      this._stsONBtn = game.add.button(frame.x + 210, ((frame.y - 60) + 95) + 91, 'ui', this.btnClick, this, "ON.png", "ON.png", "ON.png", "stsOFF", this._grpOption);
      this._stsONBtn.anchor.set(0.5, 0.5);

      this._stsOFFBtn = game.add.button(this._stsONBtn.x, this._stsONBtn.y, 'ui', this.btnClick, this, "OFF.png", "OFF.png", "OFF.png", "stsON", this._grpOption);
      this._stsOFFBtn.anchor.set(0.5, 0.5);
      
      if (GlobalClass.CONFIG_SPACEBAR) {
        this._stsONBtn.visible = true;
        this._stsOFFBtn.visible = false;
      }
      else {
        this._stsONBtn.visible = false;
        this._stsOFFBtn.visible = true;
      }
    // }
  };

  this.onVolumeDragUpdate = function (pdxm) {
    var percentage = 0;
    // if (game.device.desktop) {
    //   percentage = (this._volumeBullet.x - 400) / 380 * 100;
    // }
    // else {
      this._txtSliderSound.x = this._volumeBullet.x;

      if (AppConstants.LANDSCAPE) {
        percentage = Math.floor((this._volumeBullet.x - 402) / 723 * 100);
      } else {
        percentage = Math.floor((this._volumeBullet.x - 60) / 600 * 100);
      }

      if (percentage > 100) {
        percentage = 100;
      }
      else if (percentage < 0) {
        percentage = 0;
      }

      this._txtSliderSound.text = percentage;
    // }

    var value = (percentage * (1 - 0) / 100) + 0;
    if (value > 1) {
      value = 1;
    }
    GlobalClass.GAME_SOUND_BAR_X = value;
    this._soundMeter.width = this._maxWidth * value;

    PIXI.sound.volumeAll = value;

    if (value == 0) {
      this._soundON.visible = false;
      this._soundOFF.visible = true;

      if (this._isMuted !== true && pdxm != "true") {
        AppConstants.PDXM.toggleAction("mute", true);
        this._isMuted = true;
      }
    } else {
      this._soundON.visible = true;
      this._soundOFF.visible = false;
      //GlobalClass.GAME_SOUND_BAR_X = this._volumeBullet.x;
      if (this._isMuted !== false && pdxm != "true") {
        AppConstants.PDXM.toggleAction("mute", false);
        this._isMuted = false;
      }
    }

    GlobalClass.updateSettings("Sound", GlobalClass.GAME_SOUND_BAR_X);
  };

  this.onCoinDragUpdate = function () {

    this._txtSliderCoin.x = this._coinBullet.x;
    var percentage = 0;
    if (AppConstants.LANDSCAPE) {
      percentage = Math.floor((this._coinBullet.x - 402) / 723 * 100);
    } else {
      percentage = Math.floor((this._coinBullet.x - 44) / 600 * 100);
    }
    if (percentage > 100) {
      percentage = 100;
    }
    else if (percentage < 0) {
      percentage = 0;
    }
    this._coinMeter.width = this._maxCoinWidth * percentage / 100;

    GlobalClass.GAME_COIN_POS = Math.floor((percentage * (GlobalClass.GAME_COIN_VALUE.length - 1) / 100));
    this._txtSliderCoin.text = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
    this._valueTotalCoinOption.text = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
    gameplayState._buttonClass.setCoin();

    GlobalClass.updateSettings("CoinValue", GlobalClass.GAME_COIN_POS);
  };

  this.onBetDragUpdate = function () {
    this._txtSliderBet.x = this._betBullet.x;
    var percentage = 0;
    if (AppConstants.LANDSCAPE) {
      percentage = Math.floor((this._betBullet.x - 402) / 723 * 100);
    } else {
      percentage = Math.floor((this._betBullet.x - 60) / 600 * 100);
    }

    if (percentage > 100) {
      percentage = 100;
    }
    else if (percentage < 0) {
      percentage = 0;
    }

    this._betMeter.width = this._maxBetWidth * percentage / 100;

    GlobalClass.GAME_BET_POS = Math.floor((percentage * (GlobalClass.GAME_BET.length - 1) / 100));
    this._txtSliderBet.text = GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]);
    this._valueTotalBetOption.text = GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]);
    gameplayState._buttonClass.setBet();

    GlobalClass.updateSettings("bet", GlobalClass.GAME_BET_POS);

  };

  this.btnClick = function (cButton, pdxm) {
    soundClass.playSound("soundbtnclick");
    switch (cButton.btnKey) {
      case "closeWin":
        this.close();
        break;
      case "soundOFF":
        if (game.device.desktop) {
          this._volumeBullet.x = 400;
        }
        else {
          if (AppConstants.LANDSCAPE) {
            this._volumeBullet.x = 400;
          } else {
            this._volumeBullet.x = 60;
          }
        }

        this.onVolumeDragUpdate(pdxm);

        // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_SETTING,{sounds:false});
        break;
      case "soundON":
        if (game.device.desktop) {
          this._volumeBullet.x = 1125;
        }
        else {
          if (AppConstants.LANDSCAPE) {
            this._volumeBullet.x = 1125;
          } else {
            this._volumeBullet.x = 660;
          }
        }
        this.onVolumeDragUpdate(pdxm);
        // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_SETTING,{sounds:true});
        break;
      case "qsON":
        if(AppConstants.TURBO){
          GlobalClass.CONFIG_QUICKSPIN = true;
          this._qsONBtn.visible = true;
          this._qsOFFBtn.visible = false;
          GlobalClass.updateSettings("QkSpin", true);
          //game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_SETTING,{fastPlay:true});
        }
        
        break;
      case "qsOFF":
        if(AppConstants.TURBO){
          GlobalClass.CONFIG_QUICKSPIN = false;
          this._qsONBtn.visible = false;
          this._qsOFFBtn.visible = true;
          GlobalClass.updateSettings("QkSpin", false);
          //game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_SETTING,{fastPlay:false});
        }
        
        break;
      case "stsON":
        // if(AppConstants.CONTINUOUS_KEYBOARD){
          GlobalClass.CONFIG_SPACEBAR = true;
          this._stsONBtn.visible = true;
          this._stsOFFBtn.visible = false;
          GlobalClass.updateSettings("SP", true);
        // }
        
        break;
      case "stsOFF":
        // if(AppConstants.CONTINUOUS_KEYBOARD){
          GlobalClass.CONFIG_SPACEBAR = false;
          this._stsONBtn.visible = false;
          this._stsOFFBtn.visible = true;
          GlobalClass.updateSettings("SP", false);
        // }
        break;
    }
  }

  this.createPortrait = function () {
    this._maskBG = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpOption);
    this._maskBG.width = GlobalClass.STAGE_WIDTH * 2;
    this._maskBG.height = GlobalClass.STAGE_HEIGHT * 2;
    this._maskBG.interactive = true;

    var frame = game.add.sprite(game.world.centerY, game.world.centerX, 'mobile', 'settingFilter-resize2fullscreen.png', this._grpOption);
    frame.anchor.set(0.5, 0.5);
    frame.width = game.world.centerY * 2;
    frame.height = game.world.centerX * 2;

    var title = game.add.text(game.world.centerY, 100, GlobalClass.getXMLByKey(game, "optionwin setting"), {
      fontSize: "38px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpOption);
    title.anchor.set(0.5);


    var settingvalueFrame = game.add.sprite(game.world.centerY, 220, 'mobile', 'setting-value-frame.png', this._grpHidden);
    settingvalueFrame.anchor.set(0.5, 0.5);

    var betTitle = game.add.text(settingvalueFrame.x, settingvalueFrame.y - 30, GlobalClass.getXMLByKey(game, "optionwin bet"), {
      fontSize: "24px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpHidden);
    betTitle.anchor.set(0.5);

    var settingFrame = game.add.sprite(60, 370, 'mobile', 'setting-meter-frame.png', this._grpHidden);
    settingFrame.anchor.set(0.0, 0.5);
    settingFrame.width = 600;

    this._valueTotalBetOption = game.add.text(355, 235, GlobalClass.getFormatCurrency(GlobalClass.betPerLine1()), this._betSettingStyle);
    this._valueTotalBetOption.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._valueTotalBetOption);

    this._txtBarBetMin = game.add.text(50, GlobalClass.getPosY(370 + 40), GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[0]), this._betSettingStyle3);
    this._txtBarBetMin.anchor.set(0.0, 0.5);
    this._grpHidden.addChild(this._txtBarBetMin);

    this._txtBarBetMax = game.add.text(670, this._txtBarBetMin.y, GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1]), this._betSettingStyle3);
    this._txtBarBetMax.anchor.set(1.0, 0.5);
    this._grpHidden.addChild(this._txtBarBetMax);

    this._betMeter = game.add.sprite(60, this._txtBarBetMin.y - 2 - 40, 'mobile', 'setting-meter.png', this._grpHidden);
    this._betMeter.anchor.set(0, 0.5);
    this._betMeter.width = 600;
    this._maxBetWidth = 600;
    this._betMeter.width = this._betMeter.width * this.startBetPro();

    this._bounds = new PIXI.Rectangle(this._betMeter.x, this._betMeter.y - 22, 600, 45);

    this._betBullet = new silderBtn(60 + 600 * this.startBetPro(), this._bounds.y + 23, 'mobile', 'slider-button.png', game);
    this._betBullet.boundsRect2 = this._bounds;
    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1 || AppConstants.PDX_ROUND_ID != "") {
      this._betBullet.disable();
    }
    this._betBullet.on("dragUpdate", this.onBetDragUpdate, this);
    this._grpHidden.addChild(this._betBullet);

    this._txtSliderBet = game.add.text(this._betBullet.x, this._betBullet.y - 40, GlobalClass.getFormatCurrency(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]), this._betSettingStyle2);
    this._txtSliderBet.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtSliderBet);


    ////////coins value
    var settingvalueFrame = game.add.sprite(game.world.centerY, 535, 'mobile', 'setting-value-frame.png', this._grpHidden);
    settingvalueFrame.anchor.set(0.5, 0.5);

    var betTitle = game.add.text(settingvalueFrame.x, settingvalueFrame.y - 40, GlobalClass.getXMLByKey(game, "optionwin coinvalue"), {
      fontSize: "24px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fill: "#ffffff",
      align: "center"
    }, this._grpHidden);
    betTitle.anchor.set(0.5);

    var settingFrame = game.add.sprite(60, this._txtBarBetMin.y + 340 - 60, 'mobile', 'setting-meter-frame.png', this._grpHidden);
    settingFrame.anchor.set(0.0, 0.5);
    settingFrame.width = 600;

    this._txtBarCoinMin = game.add.text(50, this._txtBarBetMin.y + 340 - 20, GlobalClass.GAME_COIN_VALUE[0], this._betSettingStyle3);
    this._txtBarCoinMin.anchor.set(0.0, 0.5);
    this._grpHidden.addChild(this._txtBarCoinMin);

    this._txtBarCoinMax = game.add.text(670, this._txtBarCoinMin.y, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_VALUE.length - 1], this._betSettingStyle3);
    this._txtBarCoinMax.anchor.set(1.0, 0.5);
    this._grpHidden.addChild(this._txtBarCoinMax);

    this._coinMeter = game.add.sprite(60, this._txtBarCoinMin.y - 2 - 40, 'mobile', 'setting-meter.png', this._grpHidden);
    this._coinMeter.anchor.set(0, 0.5);
    this._coinMeter.width = 600;
    this._maxCoinWidth = 600;
    this._coinMeter.width = this._coinMeter.width * this.startCoinPro();

    this._cbounds = new PIXI.Rectangle(this._coinMeter.x, this._coinMeter.y - 22, 600, 45);

    this._coinBullet = new silderBtn(60 + 604 * this.startCoinPro(), this._cbounds.y + 23, 'mobile', 'slider-button.png', game);
    this._coinBullet.boundsRect2 = this._cbounds;
    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1 || AppConstants.PDX_ROUND_ID != "") {
      this._coinBullet.disable();
    }
    this._coinBullet.on("dragUpdate", this.onCoinDragUpdate, this);
    this._grpHidden.addChild(this._coinBullet);

    this._txtSliderCoin = game.add.text(this._coinBullet.x, this._coinBullet.y - 40, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS], this._betSettingStyle2);
    this._txtSliderCoin.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._txtSliderCoin);

    this._valueTotalCoinOption = game.add.text(this._valueTotalBetOption.x, this._valueTotalBetOption.y + 327, GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS], {
      fontSize: "42px",
      fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontWeight: "bold",
      fill: "#fff",
      boundsAlignH: "middle",
      boundsAlignV: "center",
      align: "center"
    });
    this._valueTotalCoinOption.anchor.set(0.5, 0.5);
    this._grpHidden.addChild(this._valueTotalCoinOption);


    var settingvalueFrame = game.add.sprite(this._valueTotalCoinOption.x + 5, this._valueTotalCoinOption.y + 298, 'mobile', 'setting-value-frame.png', this._grpHidden);
    settingvalueFrame.anchor.set(0.5, 0.5);


    var settingFrame = game.add.sprite(60, this._coinMeter.y + 305, 'mobile', 'setting-meter-frame.png', this._grpHidden);
    settingFrame.anchor.set(0.0, 0.5);
    settingFrame.width = 600;


    this._soundON = game.add.button(this._valueTotalCoinOption.x + 5, this._valueTotalCoinOption.y + 298 - 400, 'mobile', this.btnClick, this, "sound-on.png", "sound-on.png", "sound-on.png", "soundOFF", this._grpOption);
    this._soundON.anchor.set(0.5, 0.5);

    this._soundOFF = game.add.button(this._soundON.x, this._soundON.y, 'mobile', this.btnClick, this, "sound-off.png", "sound-off.png", "sound-off.png", "soundON", this._grpOption);
    this._soundOFF.anchor.set(0.5, 0.5);
    this._soundOFF.visible = false;


    this._soundMeter = game.add.sprite(this._coinMeter.x, this._coinMeter.y + 305 - 400, 'mobile', 'setting-meter.png', this._grpOption);
    this._soundMeter.anchor.set(0, 0.5);
    this._soundMeter.width = 600;
    this._maxWidth = 600;

    this._sbounds = new PIXI.Rectangle(this._soundMeter.x, this._soundMeter.y - 22, 600, 45);
    var x = this._soundMeter.x + 600;
    if (GlobalClass.GAME_SOUND_BAR_X != -1) {
      x = this._soundMeter.x + 600 * GlobalClass.GAME_SOUND_BAR_X;
      if (GlobalClass.GAME_SOUND_BAR_X == 0) {
        x = 44;
      }
      else {
        x = this._soundMeter.x + 600 * GlobalClass.GAME_SOUND_BAR_X;
      }
    }

    this._volumeBullet = new silderBtn(x, this._sbounds.y + 23, 'mobile', 'slider-button.png', game);
    this._volumeBullet.boundsRect2 = this._sbounds;
    this._volumeBullet.on("dragUpdate", this.onVolumeDragUpdate, this);
    this._grpOption.addChild(this._volumeBullet);


    this._txtSliderSound = game.add.text(this._volumeBullet.x, this._volumeBullet.y - 40, 100, this._betSettingStyle2);
    this._txtSliderSound.anchor.set(0.5, 0.5);
    this._grpOption.addChild(this._txtSliderSound);

    this.onVolumeDragUpdate();

    if (AppConstants.TURBO) {
      this._qsONBtn = game.add.button(game.world.centerY, this._soundMeter.y + 150 + 150, 'mobile', this.btnClick, this, "on.png", "on.png", "on.png", "qsOFF", this._grpOption);
      this._qsONBtn.anchor.set(0.5, 0.5);

      this._qsOFFBtn = game.add.button(game.world.centerY, this._soundMeter.y + 150 + 150, 'mobile', this.btnClick, this, "off.png", "off.png", "off.png", "qsON", this._grpOption);
      this._qsOFFBtn.anchor.set(0.5, 0.5);

      var qsText = game.add.text(this._qsONBtn.x, this._qsONBtn.y - 35, GlobalClass.getXMLByKey(game, "optionwin quickspin"), {
        fontSize: "32px",
        fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fill: "#ffffff",
        align: "center"
      }, this._grpOption);
      qsText.anchor.set(0.5);

      if (GlobalClass.CONFIG_QUICKSPIN) {
        this._qsONBtn.visible = true;
        this._qsOFFBtn.visible = false;
      }
      else {
        this._qsONBtn.visible = false;
        this._qsOFFBtn.visible = true;
      }
    }

    var closeBtn = game.add.button(640, 100, 'mobile', this.btnClick, this, "x_button.png", "x_button.png", "x_button.png", "closeWin", this._grpOption);
    closeBtn.anchor.set(0.5, 0.5);

    // this._stsONBtn = game.add.button(game.world.centerY+180,this._soundMeter.y+150, 'mobile', this.btnClick, this, "on.png", "on.png", "on.png", "stsOFF", this._grpOption);
    // this._stsONBtn.anchor.set(0.5, 0.5);

    // this._stsOFFBtn = game.add.button(game.world.centerY+180,this._soundMeter.y+150, 'mobile', this.btnClick, this, "off.png", "off.png", "off.png", "stsON", this._grpOption);
    // this._stsOFFBtn.anchor.set(0.5, 0.5);

    // var stsText = game.add.text(this._stsONBtn.x,this._stsONBtn.y-35,GlobalClass.getXMLByKey(game,"optionwin spacebar"),{
    //   fontSize:"22px",
    //   fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
    //   fill: "#ffffff",
    //   align: "center"
    // },this._grpOption);
    // stsText.anchor.set(0.5);

    // if(GlobalClass.CONFIG_SPACEBAR){
    //   this._stsONBtn.visible = true;
    //   this._stsOFFBtn.visible = false;
    // }
    // else{
    //   this._stsONBtn.visible = false;
    //   this._stsOFFBtn.visible = true;
    // }

  };

  this.close = function () {
    AppFacadeInstance.sendNotification(SlotsEvents.SAVE_DATA);
    
    GlobalClass.GAME_OPTION = false;
    // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_INACTIVE");

    if (this._grpOption != null) {
      this._grpOption.destroy();
      this._grpOption = null;
    }

    gameplayState._optionClass = null;
  };
}
