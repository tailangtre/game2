var buttonClass = function(game, group) {
    this._groupButton = null;
    this._groupNormal = null;
    this._groupOption = null;
    this._betValueCarry = GlobalClass.GAME_BET_MAX;
    this._coinValueCarry = GlobalClass.GAME_COIN_POS;
  
    // MODE FEATURE
    this._grpFeature = null;
  
    // STYLE TEXT
    this._style1 = null;
    this._style2 = null;
    this._style3 = null;
    this._style4 = null;
  
    //hide button spin stop
    this._spinHide = false;
    this._stopHide = false;
    this.btnClicking = false;
  
    //checkVolume
    this._checkSoundMute = false;
  
    //checkAutoPlay
    this._checkAutoPlayOpen = false;
    this._btnStopAutoSpinOpen = false;
    this._sprTransparentCheck = false;
  
    // for hold spin button autoplay
    this._holdTimer = 0;
    this._betMinVal = GlobalClass.GAME_BET_MIN; //1;
    this._betMaxVal = GlobalClass.GAME_BET_MAX; //10;
    this._betLandScapeMinPos = 1146;
    this._betLandScapeMaxPos = 443;
    this._betPortraitMinPos = 447.5;
    this._betPortraitMaxPos = 1135.5;
    this._autoSpinActive = false;
  
  
    this._holderValueWin = 0;
    this._holderFeatureTotalWin = 0;
    this._holderFeatureFreeSpinLeft = 0;
  
    this.create = function() {
        this._groupButton = game.add.group();
        group.addChild(this._groupButton);
  
        this._grpNormal = game.add.group();
        group.addChild(this._grpNormal);
  
        this._grpFeature = game.add.group();
        group.addChild(this._grpFeature);
        this._grpFeature.visible = false;
  
        this._grpFont = game.add.group();
        group.addChild(this._grpFont);
  
        this._groupOption = game.add.group();
        gameplayState._transitionGroup.addChild(this._groupOption);
  
        this._grpCoinsValue = game.add.group();
        group.addChild(this._grpCoinsValue);
        this._grpCoinsValue.visible =false;

        this._grpBetValue = game.add.group();
        group.addChild(this._grpBetValue);
        this._grpBetValue.visible =false;

        this._groupAutoPlay = game.add.group();
        group.addChild(this._groupAutoPlay);

        
  
        this._style1 = {
            fontSize:"28px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._style2 = {
            fontSize:"32px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._style3 = {
            fontSize:"20px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._style4 = {
            fontSize:"40px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#fff",
            align: "center"
        };
  
        this._style5 = {
            fontSize:"30px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._style6 = {
            fontSize:"34px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._styleFeature = {
            fontSize:"16px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ffffff",
            align: "center"
        };
  
        this._styleValue = {
            fontSize:"18px",
            fontFamily:"Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center"
        };
  
        this._styleCoins = {
            fontSize:"18px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center"
        };
        this.createLandscape();
    };
  
  
  
    this.createLandscape = function(){
        GlobalClass.deleteChildren(this._grpNormal);
        GlobalClass.deleteChildren(this._groupButton);
        GlobalClass.deleteChildren(this._grpFeature);
        GlobalClass.deleteChildren(this._groupOption);
        GlobalClass.deleteChildren(this._groupAutoPlay);
  
  
  
        this._autoSpinStyle = {
            fontSize:"14px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#000",
            align: "center"
        };

        this._styleFrameValue = {
            font: "12px Arial",
            fontWeight: "bold",
            fill: "#000",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center"
        };


        var homeBtn = game.add.button(GlobalClass.STAGE_WIDTH - 40, 70, 'network', this.btnClick, this, 'home-button.png', 'home-button-clk.png', 'home-button-Hov.png',"home");        
        homeBtn.anchor.set(0.5);
        this._groupButton.addChild(homeBtn);
        if(AppConstants.disableLobby){
            homeBtn.visible = false;
        }

        this.rgBtn = game.add.button(GlobalClass.STAGE_WIDTH - 320, 70, 'responsible_gambling', this.btnClick, this, 'Button_RG_small.png', 'Button_RG_small_over.png', 'Button_RG_small_over.png',"rg", this._groupButton);        
        this.rgBtn.anchor.set(0.5);
        this.rgBtn.visible = false;
        this.rgDisabledBtn = game.add.sprite(this.rgBtn.x, this.rgBtn.y, 'responsible_gambling', 'Button_RG_disable.png', this._groupButton);
        this.rgDisabledBtn.anchor.set(0.5);
        this.rgDisabledBtn.visible = false;

        this._btnFreespins = game.add.button(GlobalClass.STAGE_WIDTH - 320, 540, 'freespins', this.btnClick, this, 'Coins icon.png', 'Coins icon.png', 'Coins icon.png', 'freespins', this._groupButton);
        this._btnFreespins.anchor.set(0.5);
        this._btnFreespins.visible = false;

        // this.history =  game.add.button(30, 640, 'network', this.btnClick, this, "history-button.png", "history-button-CLK.png", "history-button-HOV.png", "history", this._groupButton);
        // this.history.anchor.set(0.5, 0.5);

        // this.historyDisable = game.add.sprite(this.history.x, this.history.y, 'network', 'history-button-grey.png', this._groupButton);
        // this.historyDisable.anchor.set(0.5, 0.5);
        // this.historyDisable.visible = false;
  
        this._infoBtn =  game.add.button(150, 640, 'ui', this.btnClick, this, "info-button.png", "info-button-Clk.png", "info-button-Hov.png", "information", this._groupButton);
        this._infoBtn.anchor.set(0.5, 0.5);
  
        this._infoBtnDisable = game.add.sprite(this._infoBtn.x, this._infoBtn.y, 'ui', 'info-button_grey.png', this._groupButton);
        this._infoBtnDisable.anchor.set(0.5, 0.5);
        this._infoBtnDisable.visible = false;
  
        this._settingBtn = game.add.button(100, 640, 'ui', this.btnClick, this, "setting-button.png", "setting-button-Clk.png", "setting-button-Hov.png", "setting", this._groupButton);
        this._settingBtn.anchor.set(0.5, 0.5);
  
        this._settingBtnDisable = game.add.sprite(this._settingBtn.x, this._settingBtn.y, 'ui', 'setting-button-grey.png', this._groupButton);
        this._settingBtnDisable.anchor.set(0.5, 0.5);
        this._settingBtnDisable.visible = false;
  
        this._langName = "ui";
        if(GlobalClass.GAME_LANG=='zh'){
            this._langName = "ui_zh";
        }
  
        this._coinValueFrame = game.add.sprite(this._settingBtn.x + 221, this._settingBtn.y+2, 'ui', 'Value-Column.png', this._grpNormal);
        this._coinValueFrame.anchor.set(0.5, 0.5);

        this._coinValueBtn = game.add.button(this._settingBtn.x + 140, this._settingBtn.y, this._langName, this.btnClick, this, "Coin-Value-Button.png", "Coin-Value-Button_clk.png", "Coin-Value-Button_hov.png", "coins", this._grpNormal);
        this._coinValueBtn.anchor.set(0.5, 0.5);

        this._coinValueBtnDisable = game.add.sprite(this._coinValueBtn.x, this._coinValueBtn.y, this._langName, 'Coin-Value-Button_grey.png', this._grpNormal);
        this._coinValueBtnDisable.anchor.set(0.5, 0.5);
        this._coinValueBtnDisable.visible = false;
  
        this._coinValueTxt =  game.add.text(this._coinValueFrame.x+22,this._coinValueFrame.y, GlobalClass.currency()+GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS], this._styleCoins, this._grpNormal);
        this._coinValueTxt.anchor.set(0.5, 0.5);

        this._txtCoinValueObj = {};
        var len = GlobalClass.GAME_COIN_VALUE.length;
        for(var i=0;i<len-1;i++){
            var hudu = (2*Math.PI / 360) * (140+52.5*i);
            var x = this._coinValueBtn.x + Math.sin(hudu) * 51;
            var y = this._coinValueBtn.y - Math.cos(hudu) * 51;

            var coinsValueFrameBtn = game.add.button(x, y, 'ui', this.btnClick, this, "value-frame.png", "value-frame.png", "value-frame.png", "chooseCoinValue", this._grpCoinsValue);
            coinsValueFrameBtn.anchor.set(0.5, 0.5);
            coinsValueFrameBtn.index = i;

            this._txtCoinValueObj['txtCoinValue'+i] = game.add.text(x,y+2, '', this._styleFrameValue, this._grpCoinsValue);
            this._txtCoinValueObj['txtCoinValue'+i].anchor.set(0.5, 0.5);
        }

  
        this._betValueTxtFrame = game.add.sprite(this._coinValueFrame.x+245, this._coinValueFrame.y, 'ui', 'Value-Column.png', this._grpNormal);
        this._betValueTxtFrame.anchor.set(0.5, 0.5);
  
        // this._betFont = game.add.sprite(this._betValueTxtFrame.x, this._coinValueFont.y, 'ui', 'bet-font.png', this._grpNormal);
        // this._betFont.anchor.set(0.5, 0.5);

        this._betValueBtn = game.add.button(this._betValueTxtFrame.x-81, this._settingBtn.y, this._langName, this.btnClick, this, "Bet-Button.png", "Bet-Button_clk.png", "Bet-Button_hov.png", "bet", this._grpNormal);
        this._betValueBtn.anchor.set(0.5, 0.5);

        this._betValueBtnDisable = game.add.sprite(this._betValueBtn.x, this._betValueBtn.y, this._langName, 'Bet-Button_grey.png', this._grpNormal);
        this._betValueBtnDisable.anchor.set(0.5, 0.5);
        this._betValueBtnDisable.visible = false;
  
        this._betValueTxt =  game.add.text(this._betValueTxtFrame.x+22,this._betValueTxtFrame.y,GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS], this._styleCoins, this._grpNormal);
        this._betValueTxt.anchor.set(0.5, 0.5);

        this._txtBetValueObj = {};
        for(var i=0;i<GlobalClass.GAME_BET.length-1;i++){
            var hudu = (2*Math.PI / 360) * (140+52.5*i);
            var x = this._betValueBtn.x + Math.sin(hudu) * 51;
            var y = this._betValueBtn.y - Math.cos(hudu) * 51;

            var betValueFrameBtn = game.add.button(x, y, 'ui', this.btnClick, this, "value-frame.png", "value-frame.png", "value-frame.png", "chooseBetValue", this._grpBetValue);
            betValueFrameBtn.anchor.set(0.5, 0.5);
            //betValueFrameBtn.scale.set(0.7);
            betValueFrameBtn.index = i;

            this._txtBetValueObj['txtBetValue'+i] = game.add.text(x,y+2, '', this._styleFrameValue, this._grpBetValue);
            this._txtBetValueObj['txtBetValue'+i].anchor.set(0.5, 0.5);
        }
  
  
        //free game mode
        this._totalWinFrame = game.add.sprite(this._settingBtn.x+180, this._settingBtn.y+8, this._langName, 'total-win-column.png', this._grpFeature);
        this._totalWinFrame.anchor.set(0.5, 0.5);
  
        // this._totalWinFont = game.add.sprite(this._coinValueFrame.x, this._settingBtn.y-32, 'ui', 'total-win.png', this._grpFeature);
        // this._totalWinFont.anchor.set(0.5, 0.5);
  
        this._totalWinTxt =  game.add.text(this._coinValueFrame.x+10,this._coinValueFrame.y+10,myNumeral(0), this._styleCoins, this._grpFeature);
        this._totalWinTxt.anchor.set(0.5, 0.5);
  
        this._freeSpinFrame = game.add.sprite(this._coinValueFrame.x+280, this._coinValueFrame.y,this._langName, 'Free-spin-column.png', this._grpFeature);
        this._freeSpinFrame.anchor.set(0.5, 0.5);
  
        // this._freeSpinFont = game.add.sprite(this._betValueTxtFrame.x, this._coinValueFont.y, 'ui', 'free-spin-font.png', this._grpFeature);
        // this._freeSpinFont.anchor.set(0.5, 0.5);
  
        this._freeSpinValueTxt =  game.add.text(this._betValueTxtFrame.x+22,this._betValueTxtFrame.y+5,myNumeral(0), this._styleCoins, this._grpFeature);
        this._freeSpinValueTxt.anchor.set(0.5, 0.5);
  
   
  
        this._maxBetFrame = game.add.sprite(this._betValueTxtFrame.x+240, this._betValueTxtFrame.y, 'ui', 'Maxbet-frame.png', this._grpNormal);
        this._maxBetFrame.anchor.set(0.5, 0.5);
        this._maxBetFrame.scale.set(1.2);
  
        this._maxBetBtn = game.add.button(this._maxBetFrame.x, this._maxBetFrame.y, this._langName, this.btnClick, this, "Maxbet-button.png", "Maxbet-button_Clk.png", "Maxbet-button_Hov.png", "maxBet", this._grpNormal);
        this._maxBetBtn.anchor.set(0.5, 0.5);
        this._maxBetBtn.scale.set(1.2);
  
        this._maxBetBtnDisable = game.add.sprite(this._maxBetBtn.x, this._maxBetBtn.y, this._langName, 'Maxbet-button.png', this._grpNormal);
        this._maxBetBtnDisable.anchor.set(0.5, 0.5);
        this._maxBetBtnDisable.scale.set(1.2);
  
  
        this._spinBbuttonFrame = game.add.sprite(this._maxBetFrame.x+217, this._maxBetFrame.y-19, 'ui', 'spin-button-frame.png', this._groupButton);
        this._spinBbuttonFrame.anchor.set(0.5, 0.5);
        this._spinBbuttonFrame.scale.set(0.57);
  
  
        this._autoSpinBtn = game.add.button(this._spinBbuttonFrame.x-64, this._spinBbuttonFrame.y+18, 'ui', this.btnClick, this, "Auto-Spin-button.png", "Auto-Spin-button.png", "Auto-Spin-button_Hov.png", "autoplay", this._groupButton);
        this._autoSpinBtn.anchor.set(0.5, 0.5);
        //this._autoSpinBtn.scale.set(1.6,1.6);
  
  
        this._autoSpinBtnDisable = game.add.sprite(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', 'Auto-Spin-button_Grey.png', this._groupButton);
        this._autoSpinBtnDisable.anchor.set(0.5, 0.5);
        //this._autoSpinBtnDisable.scale.set(1.6,1.6);
        this._autoSpinBtnDisable.visible = false;
  
        /*this._autoSpinBtnTxt = game.add.sprite(this._autospinFrame.x, this._autospinFrame.y, 'ui', 'Auto-Spin-font.png', this._groupButton);
        this._autoSpinBtnTxt.anchor.set(0.5, 0.5);*/
  
        this._autoSpinBtnTxt = game.add.text(this._autoSpinBtn.x, this._autoSpinBtn.y+5, GlobalClass.getXMLByKey(game,"button autospin"), {
            fontSize:"14px",
            fontFamily:"Times New Roman",
            fill: "#000000",
            align: "center"
        }, this._groupButton);
        this._autoSpinBtnTxt.anchor.set(0.5, 0.5);

        if(!AppConstants.AUTOPLAY){
            this._autoSpinBtnDisable.visible = true;
            this._autoSpinBtn.visible = false;
        }
  
        this._stopBtn = game.add.button(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', this.btnClick, this, "Stop-Button.png", "Stop-Button_clk.png", "Stop-Button_hov.png", "stopautospin", this._groupButton);
        this._stopBtn.anchor.set(0.5, 0.5);
        this._stopBtn.visible = false;
        this._stopBtn.scale.set(0.7);
  
        this._stopBtnDisable = game.add.sprite(this._stopBtn.x, this._stopBtn.y, 'ui', 'Stop-Button_grey.png', this._groupButton);
        this._stopBtnDisable.anchor.set(0.5, 0.5);
        this._stopBtnDisable.scale.set(0.7);
        this._stopBtnDisable.visible = false;
  
        this._freeLeftCnt = game.add.text(this._stopBtn.x, this._stopBtn.y, '', this._autoSpinStyle, this._grpFeature);
        this._freeLeftCnt.anchor.set(0.5, 0.5);
        this._freeLeftCnt.visible = false;
  
  
  
        this._spinBtn = game.add.button(this._stopBtn.x+93, this._stopBtn.y-24, 'ui', this.btnClick, this, "Spin-button.png", "Spin-button_clk.png", "Spin-button_hov.png", "spin", this._groupButton);
        this._spinBtn.anchor.set(0.5, 0.5);
       // this._spinBtn.scale.set(1.6,1.6);
  
        this._spinBtnDisable = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'Spin-button_grey.png', this._groupButton);
        this._spinBtnDisable.anchor.set(0.5, 0.5);
        //this._spinBtnDisable.scale.set(1.6,1.6);
        this._spinBtnDisable.visible = false;
  
        this._skipBtn = game.add.button(this._spinBtn.x, this._spinBtn.y, 'ui', this.btnClick, this, "Skip-button.png", "Skip-button_clk.png", "Skip-button_hov.png", "skip", this._groupButton);
        this._skipBtn.anchor.set(0.5, 0.5);
        //this._skipBtn.scale.set(1.6,1.6);
        this._skipBtn.visible = false;
  
        this._skipBtnDisable = game.add.sprite(this._skipBtn.x, this._skipBtn.y, 'ui', 'Skip-button_grey.png', this._groupButton);
        this._skipBtnDisable.anchor.set(0.5, 0.5);
       // this._skipBtnDisable.scale.set(1.6,1.6);
        this._skipBtnDisable.visible = false;
  
  


        // this._spinFX = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'spin Fx_007.png', this._grpFrame);
        // this._spinFX.anchor.set(0.5, 0.5);
  
        // var textures = this._spinFX.animations.generateFrameNames("spin Fx_", 7, 18, '.png', 3);
        // this._spinFX.animations.add("anim", textures,false,0.2,function(){
        //     this._spinFX.visible = false;
        // },this);
        // this._spinFX.visible = false;
  
  
        this._spinFX = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'spin Fx_007.png', this._groupButton);
        this._spinFX.anchor.set(0.5, 0.5);
        
        var textures = this._spinFX.animations.generateFrameNames("spin Fx_", 7, 18, '.png', 3);
        this._spinFX.textures = textures;
        this._spinFX.visible = false;

        var langBtn = game.add.button(50, 640, 'network', this.btnClick, this, 'language-button.png', 'language-button-clk.png', 'language-button-hov.png',"openLangWindow");
        langBtn.anchor.set(0.5, 0.5);
        if(AppConstants.disableLangMenu){
            langBtn.visible = false;
        }
        this._groupButton.addChild(langBtn);
        
        // var country = GlobalClass.loadCountry(GlobalClass.GAME_LANG);
        // this.langText = game.add.text(langBtn.x,langBtn.y, country,{
        //     fontSize:"16px",
        //     fontFamily:"Times New Roman",
        //     fill: "#ffffff",
        //     align: "center"
        // },this._groupButton);
        // this.langText.anchor.set(0.5, 0.5);
  
  
        this._bottomPanel = game.add.sprite(0, GlobalClass.STAGE_HEIGHT, 'uiPanel', 'BG_allBanners.png', this._groupButton);
        this._bottomPanel.anchor.set(0,1);
        this._bottomPanel.width = GlobalClass.STAGE_WIDTH;
        this._bottomPanel.height = 35;
  
        this._balanceTxt = game.add.text(20,GlobalClass.STAGE_HEIGHT - 7, '', this._styleValue, this._groupButton);
        this._balanceTxt.anchor.set(0, 1);
        this.setBalance();

        this._winTxt = game.add.text(GlobalClass.STAGE_WIDTH / 2,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._winTxt.anchor.set(0.5, 1);
        this.setWinValue(0);

        this._totalBetTxt = game.add.text(GlobalClass.STAGE_WIDTH - 20,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._totalBetTxt.anchor.set(1, 1);
        this.setTotalBet();

        this.createAutoPlay();
  
  
        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
            this.setMode(true);
        } else {
            this.setMode(false);
        }
        this.setButton();
    };

    this.showCoinsValue = function(){
        /*
        if(this._coinsValueShowed){
            this._coinsValueShowed = false;
            this._grpCoinsValue.visible = false;
        }
        else{
            this._coinsValueShowed = true;
            this._coinsValueTmp = clone(GlobalClass.GAME_COIN_VALUE);
            this._coinsValueTmp.splice(GlobalClass.GAME_COIN_POS,1);
            for(var i=0;i<this._coinsValueTmp.length;i++){

                this._txtCoinValueObj['txtCoinValue'+i].text = this._coinsValueTmp[i];
            }
            this._grpCoinsValue.visible = true;
        }
        */
    };

    this.chooseCoinValue = function(index){
        this._coinsValueShowed = false;
        this._grpCoinsValue.visible = false;
        var cv = this._coinsValueTmp[index];
        GlobalClass.GAME_COIN_POS = GlobalClass.GAME_COIN_VALUE.indexOf(cv);
        this.setCoin();
    };

    this.showBetValue = function(){
        /*
        if(this._betValueShowed){
            this._betValueShowed = false;
            this._grpBetValue.visible = false;
        }
        else{
            this._betValueShowed = true;
            this._betValueTmp = clone(GlobalClass.GAME_BET);
            this._betValueTmp.splice(GlobalClass.GAME_BET_POS,1);
            for(var i=0;i<this._betValueTmp.length;i++){
                this._txtBetValueObj['txtBetValue'+i].text = this._betValueTmp[i];
            }
            this._grpBetValue.visible = true;
        }
        */
    };

    this.chooseBetValue = function(index){
        this._betValueShowed = false;
        this._grpBetValue.visible = false;
        var cv = this._betValueTmp[index];
        GlobalClass.GAME_BET_POS = GlobalClass.GAME_BET.indexOf(cv);
        this.setBet();
    };

    this.hideValueFrame = function(){
        this._coinsValueShowed = false;
        this._grpCoinsValue.visible = false;
        this._betValueShowed = false;
        this._grpBetValue.visible = false;
    };
  
  
    this.createAutoPlay = function(){
        this._sprAutoBackground = game.add.sprite(0, 0, 'uiPanel', 'BG_allBanners.png');
        this._sprAutoBackground.width = GlobalClass.STAGE_WIDTH;
        this._sprAutoBackground.height = GlobalClass.STAGE_HEIGHT;
        this._sprAutoBackground.buttonMode = true;
        this._sprAutoBackground.interactive = true;
        this._sprAutoBackground.alpha = 0.5;
        this._sprAutoBackground.on('pointerup', this.removeAuto, this);
        this._groupAutoPlay.addChild(this._sprAutoBackground);

        this._autospinFrame = game.add.sprite(this._spinBtn.x - 320, this._spinBtn.y -260, 'mobile', 'auto-spin-settin-frame-frame.png');
        this._autospinFrame.anchor.set(0.5, 0.5);
        this._autospinFrame.scale.set(1.19);
        this._autospinFrame.interactive = true;
        this._groupAutoPlay.addChild(this._autospinFrame);
  
        this._autoSpinButton50 = game.add.button(this._autospinFrame.x, this._autospinFrame.y - 160, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin20");
        this._autoSpinButton50.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton50);
  
        this._txt50 =  game.add.text(this._autoSpinButton50.x, this._autoSpinButton50.y, "20", this._style4);
        this._txt50.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txt50);
  
        this._autoSpinButton100 = game.add.button(this._autospinFrame.x, this._autospinFrame.y - 10, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin50");
        this._autoSpinButton100.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton100);
  
        this._txt100 = game.add.text(this._autoSpinButton100.x, this._autoSpinButton100.y, "50", this._style4);
        this._txt100.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txt100);
  
        this._autoSpinButton250 = game.add.button(this._autospinFrame.x, this._autospinFrame.y + 140, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin100");
        this._autoSpinButton250.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton250);
  
        this._txt250 = game.add.text(this._autoSpinButton250.x, this._autoSpinButton250.y, "100", this._style4);
        this._txt250.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txt250);
  
        /*this._txtQuickSpin = new Phaser.Text(game, this._autospinFrame.x - 50, this._autospinFrame.y + 230, "Quick Spin", this._style3);
        this._txtQuickSpin.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txtQuickSpin);*/
  
        // this._btnQuickSpinOn = game.add.button( this._autospinFrame.x + 74, this._autospinFrame.y + 226, 'mobile', this.btnClick, this, 'Quickplay-on.png', 'Quickplay-on.png', 'Quickplay-on.png',"quickspinon");
        // this._btnQuickSpinOn.anchor.set(0.5, 0.5);
        // this._groupAutoPlay.addChild(this._btnQuickSpinOn);
        // this._btnQuickSpinOn.visible = false;
        // this._btnQuickSpinOff = game.add.button(this._btnQuickSpinOn.x, this._btnQuickSpinOn.y, 'mobile', this.btnClick, this, 'Quickplay-off.png', 'Quickplay-off.png', 'Quickplay-off.png',"quickspinoff");
        // this._btnQuickSpinOff.anchor.set(0.5, 0.5);
        // this._btnQuickSpinOff.visible = true;
        // this._groupAutoPlay.addChild(this._btnQuickSpinOff);
  
         this._checkAutoPlayOpen = false;
         this._groupAutoPlay.visible = false;
    };

    this.removeAuto = function() {
        soundClass.playSound("soundbtnclick");
        GlobalClass.GAME_OPTION = false;
        this._checkAutoPlayOpen = false;
        this._groupAutoPlay.visible = false;
    };
  
    this.checkSoundMute = function(){
        if(this._checkSoundMute == true){
            //this._soundBtn.visible = false;
            //this._soundBtnDisable.visible = true;
        } else {
           // this._soundBtn.visible = true;
            //this._soundBtnDisable.visible = false;
        }
    };
  
    this.checkButtonStopAutoSpin = function(){
        if(this._btnStopAutoSpinOpen){
            this._grpNormal.visible = false;
            this.checkButtonStopAutoSpinPosition();
        } else {
            this._grpNormal.visible = true;
        }
    };
  
    this.checkButtonStopAutoSpinPosition = function(){
        if(this._btnStop != null){
          this._btnStop.x = this._btnSpin.x;
          this._btnStop.y = this._btnSpin.y;
          this._txtSpinLeft.x = this._autoSpinBtn.x;
          this._txtSpinLeft.y = this._autoSpinBtn.y;
        }
    };
  
  
    this.setMode = function(feature) { 
        if (feature) {
            this._grpNormal.visible = false;
            this._grpFeature.visible = true;
            if(this._groupOptionAutoSpin){
                this._groupOptionAutoSpin.visible = false;
            }
            this._freeLeftCnt.visible = false;
            this._maxBetBtn.visible = false;
            this._maxBetBtnDisable.visible = true;
            this._spinBtn.visible = false;
            this._spinBtnDisable.visible = true;
            this._stopBtn.visible = false;
            this._stopBtnDisable.visible = false;
            this._skipBtn.visible = false;
            this._skipBtnDisable.visible = false;

            if(AppConstants.AUTOPLAY){
                this._autoSpinBtn.visible = true;
                this._autoSpinBtnTxt.visible =true;
                this._autoSpinBtnDisable.visible = false;
            }
            
            this._grpFont.visible = false;
            this.hideValueFrame();
  
        } else {
            this._grpNormal.visible = true;
            this._grpFeature.visible = false;
            if (GlobalClass.CONFIG_AUTO_REMAINING > 0 && this._groupOptionAutoSpin){
                this._groupOptionAutoSpin.visible = true;
                this._stopBtn.visible = true;
                this._stopBtnDisable.visible = false;
            }
            else{
                this._stopBtn.visible = false;
                this._stopBtnDisable.visible = false;
            }
            this._spinBtn.visible = true;
            this._spinBtnDisable.visible = false;
            this._skipBtn.visible = false;
            this._skipBtnDisable.visible = false;

            if(AppConstants.AUTOPLAY){
                this._autoSpinBtnDisable.visible = false;
                this._autoSpinBtn.visible = true;
            }
            
            this._grpFont.visible = true;
            this._maxBetBtn.visible = true;
            this._maxBetBtnDisable.visible = false;
        }
    };
  
    this.disableOption = function() {
        this._groupOption.visible = false;
        gameplayState._informationGroup.visible = true;
    };
  
    this.btnClick = function(cButton) {
        if(this.btnClicking){
            return;
        }
        this.btnClicking = true;
        if(cButton.btnKey!='quickspinon' && cButton.btnKey != 'quickspinoff' && cButton.btnKey != 'autoplay'){
            if(this._checkAutoPlayOpen){
                GlobalClass.GAME_OPTION = false;
                this._groupAutoPlay.visible = false;
                this._checkAutoPlayOpen = false;
            }
        }

        soundClass.playSound("soundbtnclick");
        // console.log(cButton.btnKey);
        switch (cButton.btnKey) {
            case "rg":
                if (!GlobalClass.GAME_BUSY) {
                    // game.notify.event.emit("sentMsgSolid","FEIM.showRCStatement", {});
                }
                break;
            case "freespins":
                if(GlobalClass.GAME_CONDITION==GlobalClass.GAME_CONDITION_IDLE || GlobalClass.GAME_CONDITION==GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL){
                    gameplayState.showFreeSpins();
                }
                break;
            case "history":
                gameplayState.loadHistory();
                break;
            case "chooseCoinValue":
                this.chooseCoinValue(cButton.index);
                break;
            case "coins":
                // this.showCoinsValue();
                // gameplayState.adddBetScreen();
                gameplayState.addOption();
                break;
            case "chooseBetValue":
                this.chooseBetValue(cButton.index);
                break;
            case "bet":
                // this.showBetValue();
                // gameplayState.adddBetScreen();
                gameplayState.addOption();
                break;
            case "setting":
                gameplayState.addOption();
                break;
            case "information":
                gameplayState.addPaytable();
                break;
            case "openLangWindow":
                gameplayState.openLangWindow();
                break;
            /*case "volumeoff":
                this._checkSoundMute = true;
  
                this._soundBtn.visible = false;
                this._soundBtnDisable.visible = true;
  
                game.sound.mute = true;
                break;
            case "volumeon":
                this._checkSoundMute = false;
  
                this._soundBtn.visible = true;
                this._soundBtnDisable.visible = false;
  
                game.sound.mute = false;
                break;*/
            /*case "option":
                //this._groupOption.visible = true;
                gameplayState._informationGroup.visible = false;
                this.setOption();
                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL) {
                    this._btnSliderBet.visible = true;
                    this._btnSliderCoin.visible = true;
                } else {
                    this._btnSliderBet.visible = false;
                    this._btnSliderCoin.visible = false;
                }
                break;*/
            case "autoplay":
                if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
                    if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_IDLE || GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL) {
                        GlobalClass.FREE_GAME_AUTO_SPIN = true;
                        this._stopBtnDisable.visible = false;
                        this._stopBtn.visible = true;
                        this._freeLeftCnt.visible = true;
                        this.prepareSpin(false);
                    }
                }
                else{
                    if(this._checkAutoPlayOpen){
                        GlobalClass.GAME_OPTION = false;
                        this._groupAutoPlay.visible = false;
                        this._checkAutoPlayOpen = false;
                    }
                    else{
                        GlobalClass.GAME_OPTION = true;
                        this._groupAutoPlay.visible = true;
                        this._checkAutoPlayOpen = true;
                    }
                }
                break;
            case "skip":
                if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_STOP && GlobalClass.GAME_DURATION_FINISH) {
                    this.disableButton();
                    GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_ALL;
		            this.setButton();
                    gameplayState.stopAnimation();
                }
                break;
            case "spin":
                if (GlobalClass.GAME_CONDITION != GlobalClass.GAME_CONDITION_IDLE) {
                }
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_SPIN;
                this.setButton();
                //this.startOrStopGear(true);
                //this._spinFX.visible = true;
                //this._spinFX.animations.play('anim');
                this._spinFX.visible = true;
                this._spinFX.animations.add("anim", this._spinFX.textures,false,0.2,function(){
                    this._spinFX.visible = false;
                    this._spinFX.animations.currentAnim.visible = false;
                },this);
                this._spinFX.animations.play('anim');
                this.prepareSpin(false);
                /*if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL) {
                    if (GlobalClass.GAME_DATA.normal2Feature) {
                        this.prepareFeature();
                    } else {
                        this.prepareSpin(false);
                    }
                } else {
                    this.prepareSpin(false);
                }*/
                break;
            case "quickspinon":
                this._btnQuickSpinOn.visible = false;
                this._btnQuickSpinOff.visible = true;
  
                GlobalClass.CONFIG_QUICKSPIN = false;
                break;
            case "quickspinoff":
                this._btnQuickSpinOn.visible = true;
                this._btnQuickSpinOff.visible = false;
  
                GlobalClass.CONFIG_QUICKSPIN = true;
                break;
            case "spinalpha":
                this._sprBackground.visible = true;
                this._sprBackgroundStop.visible = false;
  
                if (this._spinHide) {
                    this._spinHide = false;
                    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                        this._grpNormal.visible = false;
                    } else {
                        this._grpNormal.visible = true;
                    }
                } else {
                    this._spinHide = true;
                    if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                        this._grpNormal.visible = false;
                    } else {
                        this._grpNormal.visible = false;
                    }
                }
                break;
            case "stopalpha":
                this._sprBackground.visible = false;
                this._sprBackgroundStop.visible = true;
                if (this._stopHide) {
                    this._stopHide = false;
                    this._groupOptionAutoSpin.visible = true;
                } else {
                    this._stopHide = true;
                    this._groupOptionAutoSpin.visible = false;
                }
                break;
            case "spin20":
                this._autoSpinActive = true;
                GlobalClass.CONFIG_AUTO_REMAINING = 20;
                this.btnStopAutoSpin();
                break;
            case "spin50":
                this._autoSpinActive = true;
                GlobalClass.CONFIG_AUTO_REMAINING = 50;
                this.btnStopAutoSpin();
                break;
            case "spin100":
                this._autoSpinActive = true;
                GlobalClass.CONFIG_AUTO_REMAINING = 100;
                this.btnStopAutoSpin();
                break;
            case "stopautospin":
                this.stopAutoSpin();
                break;
            case "maxBet":
                if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL) {
                    if (GlobalClass.GAME_DATA.normal2Feature) {
                        this.prepareFeature();
                    } else {
                        this.prepareSpin(true);
                    }
                } else {
                    this.prepareSpin(true);
                }
                break;
            case "home":
                if(!AppConstants.disableLobby){
                   this.bnHome();
                }
                break;
            default:
            // console.log("Default: " + type);
        }
        this.btnClicking = false;
    };
  
    this.bnHome = function() {
        // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.EXIT,{});

        if(AppConstants.GAME_LOBBY_URL){
            if(window.parent){
                window.parent.location.href = AppConstants.GAME_LOBBY_URL;
            }
            else{
                window.location.href = AppConstants.GAME_LOBBY_URL;
            }
        }
    };
  
    this.removeTimer = function() {
        if (this._timer != null) {
            game.time.events.remove(this._timer);
            this._timer = null;
        }
    };
  
    this.checkAutoPlayStop = function(){
        if(this._checkStopAutoPlay == true){
            this.btnStopAutoSpin();
        }
    };
  
    this.btnStopAutoSpin = function() {
        this._groupOptionAutoSpin = game.add.group();
        group.addChild(this._groupOptionAutoSpin);
  
        if (this._groupAutoPlay != null) {
            GlobalClass.GAME_OPTION = false;
            this._groupAutoPlay.visible = false;
            this._checkAutoPlayOpen = false;
        }
        
        // game.notify.event.emit("sentMsgSolid","FEIM.send.autoPlayStarted");

        this._spinBtn.visible = false;
        this._spinBtnDisable.visible = false;
        this._stopBtn.visible = true;
        this._stopBtnDisable.visible = false;
        this._skipBtn.visible = false;
        this._skipBtnDisable.visible = false;
        this._autoSpinBtn.visible = false;
        this._autoSpinBtnTxt.visible =false;
        this._autoSpinBtnDisable.visible = true;
  
        this._txtSpinLeft = game.add.text(this._autoSpinBtn.x, this._autoSpinBtn.y, GlobalClass.CONFIG_AUTO_REMAINING, this._autoSpinStyle)
        this._txtSpinLeft.anchor.set(0.5, 0.5);
        this._groupOptionAutoSpin.addChild(this._txtSpinLeft);

        this._btnStopAutoSpinOpen = true;
  
        this.prepareAutoSpin();
    };
  
    this.useAutoSpin = function() {
        if(this._txtSpinLeft){
            this._txtSpinLeft.text = GlobalClass.CONFIG_AUTO_REMAINING;
        }
  
  
        if (GlobalClass.CONFIG_AUTO_REMAINING == 0) {
            this.stopAutoSpin();
        }
    };
  
    this.stopAutoSpin = function() {
        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
            GlobalClass.FREE_GAME_AUTO_SPIN = false;
            this._stopBtnDisable.visible = false;
            this._stopBtn.visible = false;
            this._freeLeftCnt.visible = false;
        }
        else {
            this._autoSpinActive = false;
            GlobalClass.CONFIG_AUTO_REMAINING = 0;
            if (this._groupOptionAutoSpin != null) {
                this._groupOptionAutoSpin.destroy();
                this._groupOptionAutoSpin = null;
            }

            // game.notify.event.emit("sentMsgSolid","FEIM.send.autoPlayFinished");

            if(AppConstants.AUTOPLAY){
                this._autoSpinBtn.visible = true;
                this._autoSpinBtnTxt.visible =true;
                this._autoSpinBtnDisable.visible = false;
            }

            this._btnStopAutoSpinOpen = false;
            this._stopBtn.visible = false;
            this._stopBtnDisable.visible = false;
            this.setButton();
        }
    };
  
    this.prepareSpin = function(maxBet) {
        if (maxBet) {
            // var bc = GlobalClass.GAME_LINE * GlobalClass.maxBet()*GlobalClass.trueCoinValue();
            var bc = GlobalClass.betPerLine1() * GlobalClass.trueCoinValue();
            if (GlobalClass.GAME_BALANCE < bc) {
                gameplayState._informationClass.setText("nocoin");
                gameplayState._informationClass.setText("idle");
                return;
            }
            else{
                GlobalClass.GAME_BET_POS = GlobalClass.GAME_BET.length-1;
                this.setBet();
                this.setTotalBet();
            }   
        }
        if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            gameplayState.checkFreeGames(true);
        }
        else{
            gameplayState.startSpin(true);
        }
  
    };
  
    this.prepareFeature = function() {
        this.disableButton();
  
        gameplayState.reloadReel();
        gameplayState.cleanScreen();
        gameplayState.addScatterResult();
    };
  
    this.disableButton = function() {
        
    };
  
    this.setButton = function() {
        switch (GlobalClass.GAME_CONDITION) {
            case GlobalClass.GAME_CONDITION_IDLE:

                // if(GlobalClass.GAME_UI_BLOCKED==1){
                //     gameplayState.blocksUI(1);
                // }

                if(GlobalClass.GAME_BUSY && !GlobalClass.GAME_FEATURE){
                    GlobalClass.GAME_BUSY = false;
                    // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});

                    if (GlobalClass.ONETOUCH_FREESPINS) {
                        if (GlobalClass.ONETOUCH_FREESPINS_LEFT <= 0) {
                            gameplayState.showFreeSpinsFinish();
                        }
                    }
                }
                this._infoBtn.visible = true;
                this._infoBtnDisable.visible = false;
                this._settingBtn.visible = true;
                this._settingBtnDisable.visible = false;

                // this.history.visible = true;
                // this.historyDisable.visible = false;
                this._coinValueBtn.visible = true;
                this._coinValueBtnDisable.visible = false;
                this._betValueBtn.visible = true;
                this._betValueBtnDisable.visible = false;

                this._maxBetBtn.visible = true;
                this._maxBetBtnDisable.visible = false;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = true;
                    this._autoSpinBtnDisable.visible = false;
                }
                
                this._spinBtn.visible = true;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;

                break;
            case GlobalClass.GAME_CONDITION_SPIN:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                this._coinValueBtn.visible = false;
                this._coinValueBtnDisable.visible = true;
                this._betValueBtn.visible = false;
                this._betValueBtnDisable.visible = true;


                this._maxBetBtn.visible = false;
                this._maxBetBtnDisable.visible = true;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }
                
                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = true;
                break;
            case GlobalClass.GAME_CONDITION_STOP:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                this._coinValueBtn.visible = false;
                this._coinValueBtnDisable.visible = true;
                this._betValueBtn.visible = false;
                this._betValueBtnDisable.visible = true;

                this._maxBetBtn.visible = false;
                this._maxBetBtnDisable.visible = true;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }

                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = true;
                this._skipBtnDisable.visible = false;
                break;
            case GlobalClass.GAME_CONDITION_ANIMATIONS:
                // do nothing
                break;
            case GlobalClass.GAME_CONDITION_ANIMATION_ALL:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                this._coinValueBtn.visible = false;
                this._coinValueBtnDisable.visible = true;
                this._betValueBtn.visible = false;
                this._betValueBtnDisable.visible = true;

                this._maxBetBtn.visible = false;
                this._maxBetBtnDisable.visible = true;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }

                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = true;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;
                break;
            case GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL:

                // if(GlobalClass.GAME_UI_BLOCKED==1){
                //     gameplayState.blocksUI(1);
                // }
                if(GlobalClass.GAME_BUSY && !GlobalClass.GAME_FEATURE){
                    GlobalClass.GAME_BUSY = false;
                    // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});

                    if (GlobalClass.ONETOUCH_FREESPINS) {
                        if (GlobalClass.ONETOUCH_FREESPINS_LEFT <= 0) {
                            gameplayState.showFreeSpinsFinish();
                        }
                    }
                }
                this._infoBtn.visible = true;
                this._infoBtnDisable.visible = false;
                this._settingBtn.visible = true;
                this._settingBtnDisable.visible = false;

                // this.history.visible = true;
                // this.historyDisable.visible = false;
                this._coinValueBtn.visible = true;
                this._coinValueBtnDisable.visible = false;
                this._betValueBtn.visible = true;
                this._betValueBtnDisable.visible = false;

                this._maxBetBtn.visible = true;
                this._maxBetBtnDisable.visible = false;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = true;
                    this._autoSpinBtnDisable.visible = false;
                }

                this._spinBtn.visible = true;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;
                break;
            case GlobalClass.GAME_CONDITION_FREE_END:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                this._coinValueBtn.visible = false;
                this._coinValueBtnDisable.visible = true;
                this._betValueBtn.visible = false;
                this._betValueBtnDisable.visible = true;

                this._maxBetBtn.visible = false;
                this._maxBetBtnDisable.visible = true;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }
                
                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = true;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;
                this._stopBtn.visible = false;
                this._stopBtnDisable.visible = true;
                break;
            case GlobalClass.GAME_CONDITION_SKIP_DYNAMITE:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                this._coinValueBtn.visible = false;
                this._coinValueBtnDisable.visible = true;
                this._betValueBtn.visible = false;
                this._betValueBtnDisable.visible = true;

                this._maxBetBtn.visible = false;
                this._maxBetBtnDisable.visible = true;

                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }

                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = true;
                this._skipBtnDisable.visible = false;
                break;
            default:
                // console.log("ButtonClass-setButton: Error, GameCondition");
                break;
        }

        if (AppConstants.RESPONSIBLE_GAMBLING) {
            if (GlobalClass.GAME_BUSY || GlobalClass.GAME_FEATURE) {
                this.rgBtn.visible = false;
                this.rgDisabledBtn.visible = true;
            } else {
                this.rgBtn.visible = true;
                this.rgDisabledBtn.visible = false;
            }
        } else {
            this.rgBtn.visible = false;
            this.rgDisabledBtn.visible = false;
        }

        if (GlobalClass.ONETOUCH_PENDING_OFFERS.length > 0 && !GlobalClass.GAME_FEATURE) {
            this._btnFreespins.visible = true;
        } else {
            this._btnFreespins.visible = false;
        }
    };
  
    this.prepareAutoSpin = function() {
        if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_IDLE) {
            this.prepareSpin(false);
        } else if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL && !GlobalClass.GAME_FEATURE) {
            if (GlobalClass.GAME_DATA.normal2Feature) {
                this.prepareFeature();
            } else {
                this.prepareSpin(false);
            }
        }
    };
  
    this.setFeatureMode = function() {
  
    };
  
    this.setCoin = function() {
        this._coinValueTxt.text = GlobalClass.currency()+GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];

        GlobalClass.updateSettings("CoinValue",GlobalClass.GAME_COIN_POS);

        this.setTotalBet();
        this.setBalance();
        this.setWinValue(0);
        gameplayState._jackpotClass.changeJackPot();
  
    };
  
    this.setBet = function() {
        // var key = "WWW2120Bet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        // myLocalStorage.setItem(key,GlobalClass.GAME_BET_POS);
        
        this._betValueTxt.text = GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS];
        this.setTotalBet();
        gameplayState._jackpotClass.updateTube();
        gameplayState._reelClass.updateSpecialFrame();

        // game.notify.event.emit("sentMsgSolid","FEIM.send.betUpdate",GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]);
    };
  
    this.setTotalBet = function() {
        // this._totalBetTxt.text =GlobalClass.getXMLByKey(game,"bet")+": "+GlobalClass.betPerLine1()+" coins ("+GlobalClass.currency() + " " + myNumeral(GlobalClass.betPerLine1()*GlobalClass.trueCoinValue()).format('0,0.00')+")";
        this._totalBetTxt.text = `${GlobalClass.getXMLByKey(game, "bet")}: ${GlobalClass.getFormatCurrency(GlobalClass.betPerLine1() * GlobalClass.trueCoinValue())}`;
    };
  
    this.setBalance = function(value) {
        // if (GlobalClass.ONETOUCH_FREESPINS) {
        //     return;
        // }
        // var b = GlobalClass.coinValue(GlobalClass.GAME_BALANCE);
        // this._balanceTxt.text = GlobalClass.getXMLByKey(game,"balance")+": "+myNumeral(b)+" coins ("+GlobalClass.currency() + " " + myNumeral(GlobalClass.GAME_BALANCE).format('0,0.00')+")";
        this._balanceTxt.text = `${GlobalClass.getXMLByKey(game, "balance")}: ${GlobalClass.getFormatCurrency(GlobalClass.GAME_BALANCE)}`;
    };
  
    this.setWinValue = function(value) {
        // if (value != 0) {
        //     game.notify.event.emit("sentMsgSolid","OTFEIM.addWin",value);
        // }
        // this._winTxt.text = GlobalClass.getXMLByKey(game,"win")+": "+value+" coins ("+GlobalClass.currency() + " " +  myNumeral(value*GlobalClass.trueCoinValue()).format('0,0.00')+")";
        this._winTxt.text = `${GlobalClass.getXMLByKey(game, "win")}: ${GlobalClass.getFormatCurrency(value)}`;
    };
  
    // MODE FEATURE
    this.setTotalWin = function(value) {
        this._totalWinTxt.text = myNumeral(value).format('0');
    };
  
    this.setSpinLeft = function(value) {
        this._freeSpinValueTxt.text = myNumeral(value).format('0');
        this._freeLeftCnt.text = myNumeral(value).format('0');
    };
  
    this.startOrStopGear = function(start){
        if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            return;
        }
        if(start && GlobalClass.GAME_BALANCE < GlobalClass.totalBet()/**GlobalClass.trueCoinValue()*/){
            return;
        }
        if(!this._gear1Tween.isRunning && start){
            this._gear1Tween.start();
            this._gear3Tween.start();
        }
        else if(this._gear1Tween.isPaused && this._gear1Tween.isRunning && start){
            this._gear1Tween.resume();
            this._gear3Tween.resume();
        }
        else if(!this._gear1Tween.isPaused && this._gear1Tween.isRunning){
            this._gear1Tween.pause();
            this._gear3Tween.pause();
        }
    };

    this.pendingOffersEnable = function() {
        // this._btnFreespins.visible = true;
    };
    
    this.pendingOffersDisable = function() {
        // this._btnFreespins.visible = false;
    };

    this.bnFreespins = function() {
        // if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_IDLE || (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL && GlobalClass.GAME_BONUS == GlobalClass.GAME_BONUS_NORMAL || !GlobalClass.GAME_AUTO)) {
        //     this._game.soundMgr.play('click');
        //     GlobalClass.GAME_ROOT.showFreeSpins();
        // }
    };

    this.setFreeSpins = function() {
        this._balanceTxt.text = `${GlobalClass.getXMLByKey(game, "freespins8")} : ${String(GlobalClass.ONETOUCH_FREESPINS_LEFT)}`;
       
        this._winTxt.text = `${GlobalClass.getXMLByKey(game, "win")}: ${GlobalClass.ONETOUCH_FREESPINS_DATA.win_amount * GlobalClass.ONETOUCH_FREESPINS_COINVALUE} coins (${String(GlobalClass.currency())} ${numeral(GlobalClass.ONETOUCH_FREESPINS_DATA.win_amount).format('0,0.00')})`;

        this._totalBetTxt.text = `${GlobalClass.getXMLByKey(game," bet")}: ${GlobalClass.ONETOUCH_FREESPINS_BETCOIN} coins (${String(GlobalClass.currency())} ${numeral(GlobalClass.ONETOUCH_FREESPINS_BETCURRENCY).format('0,0.00')})`
    };

    this.btnBetDisable = function() {
        this._coinValueBtn.visible = false;
        this._coinValueBtnDisable.visible = true;

        this._betValueBtn.visible = false;
        this._betValueBtnDisable.visible = true;
        
        this._maxBetBtn.visible = false;
        this._maxBetBtnDisable.visible = true;

        this._autoSpinBtn.visible = false;
        this._autoSpinBtnDisable.visible = true;
    };
    
    this.btnBetEnable = function() {
        this._coinValueBtn.visible = true;
        this._coinValueBtnDisable.visible = false;

        this._betValueBtn.visible = true;
        this._betValueBtnDisable.visible = false;
        
        this._maxBetBtn.visible = true;
        this._maxBetBtnDisable.visible = false;

        this._autoSpinBtn.visible = true;
        this._autoSpinBtnDisable.visible = false;
    };
  }
  