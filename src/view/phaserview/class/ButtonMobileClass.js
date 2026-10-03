var buttonMobileClass = function(game, group) {
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


    this._balanceValue;
    this._winValue;
    this._totalBetValue;

    this.create = function() {
        this._langName = "ui";
        if(GlobalClass.GAME_LANG=='zh'){
            this._langName = "ui_zh";
        }
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

        this._styleText = {
            fontSize:"18px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
            strokeThickness: 4,
        };

        this._styleCoins = {
            fontSize:"24px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4"
        };
        this.checkResolution();
    };

    this.checkResolution = function(){
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };


    this.createLandscape = function(){
        GlobalClass.deleteChildren(this._grpNormal);
        GlobalClass.deleteChildren(this._groupButton);
        GlobalClass.deleteChildren(this._grpFeature);
        GlobalClass.deleteChildren(this._groupOption);
        GlobalClass.deleteChildren(this._groupAutoPlay);

        this._autoSpinStyle = {
            fontSize:"24px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#000",
            align: "center"
        };
        
        var homeBtn = game.add.button(GlobalClass.STAGE_WIDTH - 40, 70, 'network', this.btnClick, this, 'home-button.png', 'home-button-clk.png', 'home-button-Hov.png',"home");        
        homeBtn.anchor.set(0.5);
        homeBtn.scale.set(1.2);
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

        // this.history = game.add.button(45, 640, 'network', this.btnClick, this, "history-button.png", "history-button-CLK.png", "history-button-HOV.png", "history", this._groupButton);
        // this.history.anchor.set(0.5, 0.5);
        // this.history.scale.set(1.8,1.8);

        // this.historyDisable = game.add.sprite(this.history.x, this.history.y, 'network', 'history-button-grey.png', this._groupButton);
        // this.historyDisable.anchor.set(0.5, 0.5);
        // this.historyDisable.scale.set(1.8,1.8);
        // this.historyDisable.visible = false;

        
        this._settingBtn = game.add.button(120, 640, 'ui', this.btnClick, this, "setting-button.png", "setting-button-Clk.png", "setting-button-Hov.png", "setting", this._groupButton);
        this._settingBtn.anchor.set(0.5, 0.5);
        this._settingBtn.scale.set(1.5,1.5);

        this._settingBtnDisable = game.add.sprite(this._settingBtn.x, this._settingBtn.y, 'ui', 'setting-button-grey.png', this._groupButton);
        this._settingBtnDisable.anchor.set(0.5, 0.5);
        this._settingBtnDisable.scale.set(1.5,1.5);
        this._settingBtnDisable.visible = false;


        this._infoBtn =  game.add.button(200, 640, 'ui', this.btnClick, this, "info-button.png", "info-button-Clk.png", "info-button-Hov.png", "information", this._groupButton);
        this._infoBtn.anchor.set(0.5, 0.5);
        this._infoBtn.scale.set(1.5,1.5);

        this._infoBtnDisable = game.add.sprite(this._infoBtn.x, this._infoBtn.y, 'ui', 'info-button_grey.png', this._groupButton);
        this._infoBtnDisable.anchor.set(0.5, 0.5);
        this._infoBtnDisable.scale.set(1.5,1.5);
        this._infoBtnDisable.visible = false;



        this._coinValueFrame = game.add.sprite(370, 648, 'ui', 'column.png',this._grpNormal);
        this._coinValueFrame.anchor.set(0.5, 0.5);

        this._betValueTxtFrame = game.add.sprite(this._coinValueFrame.x + 265, this._coinValueFrame.y, 'ui', 'column.png',this._grpNormal);
        this._betValueTxtFrame.anchor.set(0.5, 0.5);

        // can't read
        // this.bgTransparent = game.add.sprite(this._coinValueFrame.x - 100, this._coinValueFrame.y - 48, 'uiPanel', 'BG_allBanners.png', this._grpNormal);
        // this.bgTransparent.width = 450;
        // this.bgTransparent.height = 30;

        this._coinValueFont = game.add.text(this._coinValueFrame.x, this._coinValueFrame.y - 35, GlobalClass.getXMLByKey(game, "bottombetmultiplier"), this._styleText, this._grpNormal);
        this._coinValueFont.anchor.set(0.5, 0.5);

        this._coinValueTxt = game.add.text(this._coinValueFrame.x,this._coinValueFrame.y, "0", this._styleCoins, this._grpNormal);
        this._coinValueTxt.anchor.set(0.5, 0.5);
        if (GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS] > 100) {
            this._coinValueTxt.text = numeral(GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS]).format('0,0', Math.floor);
        } else {
            this._coinValueTxt.text = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        }

        this._betFont = game.add.text(this._betValueTxtFrame.x, this._betValueTxtFrame.y - 35, GlobalClass.getXMLByKey(game, "bottombet"), this._styleText, this._grpNormal);
        this._betFont.anchor.set(0.5, 0.5);

        this._betValueTxt = game.add.text(this._betValueTxtFrame.x,this._betValueTxtFrame.y, numeral(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]).format('0,0', Math.floor), this._styleCoins, this._grpNormal);
        this._betValueTxt.anchor.set(0.5, 0.5);


        this.coinMinBtn = game.add.button(270, 650, 'plusmin', this.btnClick, this, '--button.png', '--button-clk.png', '--button-hov.png', "minusCoin");
        this.coinMinBtn.anchor.set(0.5, 0.5);
        this.coinMinBtn.scale.set(1.3);
        this._grpNormal.addChild(this.coinMinBtn);

        this.coinMinBtnDisable = game.add.sprite (270, 650, 'plusmin', '--button-disable.png');
        this.coinMinBtnDisable.anchor.set(0.5, 0.5);
        this.coinMinBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.coinMinBtnDisable);

        this.coinPlusBtn = game.add.button(470, 650, 'plusmin', this.btnClick, this, '+-button.png', '+-button-clk.png', '+-button-hov.png', "plusCoin");
        this.coinPlusBtn.anchor.set(0.5, 0.5);
        this.coinPlusBtn.scale.set(1.3);
        this._grpNormal.addChild(this.coinPlusBtn);

        this.coinPlusBtnDisable = game.add.sprite (470, 650, 'plusmin', '+-button-disable.png');
        this.coinPlusBtnDisable.anchor.set(0.5, 0.5);
        this.coinPlusBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.coinPlusBtnDisable);

        this.betMinBtn = game.add.button(535, 650, 'plusmin', this.btnClick, this, '--button.png', '--button-clk.png', '--button-hov.png', "minusBet");
        this.betMinBtn.anchor.set(0.5, 0.5);
        this.betMinBtn.scale.set(1.3);
        this._grpNormal.addChild(this.betMinBtn);

        this.betMinBtnDisable = game.add.sprite (535, 650, 'plusmin', '--button-disable.png');
        this.betMinBtnDisable.anchor.set(0.5, 0.5);
        this.betMinBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.betMinBtnDisable)

        this.betPlusBtn = game.add.button(735, 650, 'plusmin', this.btnClick, this, '+-button.png', '+-button-clk.png', '+-button-hov.png', "plusBet");
        this.betPlusBtn.anchor.set(0.5, 0.5);
        this.betPlusBtn.scale.set(1.3);
        this._grpNormal.addChild(this.betPlusBtn);

        this.betPlusBtnDisable = game.add.sprite (735, 650, 'plusmin', '+-button-disable.png');
        this.betPlusBtnDisable.anchor.set(0.5, 0.5);
        this.betPlusBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.betPlusBtnDisable);


        //free game mode
        this._totalWinFrame = game.add.sprite(380, 648, this._langName, 'total-win-column.png', this._grpFeature);
        this._totalWinFrame.anchor.set(0.5, 0.5);

        // this._totalWinFont = game.add.sprite(this._coinValueFrame.x, this._settingBtn.y-32, 'ui', 'total-win.png', this._grpFeature);
        // this._totalWinFont.anchor.set(0.5, 0.5);

        this._freeSpinFrame = game.add.sprite(this._totalWinFrame.x + 255, this._totalWinFrame.y, this._langName, 'Free-spin-column.png', this._grpFeature);
        this._freeSpinFrame.anchor.set(0.5, 0.5);

        // this._freeSpinFont = game.add.sprite(this._betValueTxtFrame.x, this._coinValueFont.y, 'ui', 'free-spin-font.png', this._grpFeature);
        // this._freeSpinFont.anchor.set(0.5, 0.5);

        // can't read
        // this.bgTransparent = game.add.sprite(this._coinValueFrame.x - 100, this._coinValueFrame.y - 48, 'uiPanel', 'BG_allBanners.png', this._grpFeature);
        // this.bgTransparent.width = 450;
        // this.bgTransparent.height = 30;

        this._totalWinFrameFont = game.add.text(this._totalWinFrame.x, this._totalWinFrame.y - 24, GlobalClass.getXMLByKey(game, "bottomtotalwin"), this._styleText, this._grpFeature);
        this._totalWinFrameFont.anchor.set(0.5, 0.5);

        this._freeSpinFrameFont = game.add.text(this._freeSpinFrame.x, this._freeSpinFrame.y - 24, GlobalClass.getXMLByKey(game, "bottomfreespins"), this._styleText, this._grpFeature);
        this._freeSpinFrameFont.anchor.set(0.5, 0.5);
        
        if(GlobalClass.GAME_LANG=='zh'){
            this._totalWinTxt =  game.add.text(this._totalWinFrame.x, this._totalWinFrame.y + 6, GlobalClass.getFormatCurrency(0), this._styleCoins, this._grpFeature);
            this._totalWinTxt.anchor.set(0.5, 0.5);
        } else {
            this._totalWinTxt =  game.add.text(this._totalWinFrame.x, this._totalWinFrame.y + 6, GlobalClass.getFormatCurrency(0), this._styleCoins, this._grpFeature);
            this._totalWinTxt.anchor.set(0.5, 0.5);
        }

        if(GlobalClass.GAME_LANG=='zh'){
            this._freeSpinValueTxt =  game.add.text(this._freeSpinFrame.x, this._freeSpinFrame.y + 6, myNumeral(0), this._styleCoins, this._grpFeature);
            this._freeSpinValueTxt.anchor.set(0.5, 0.5);
        } else{
            this._freeSpinValueTxt =  game.add.text(this._freeSpinFrame.x, this._freeSpinFrame.y + 6, myNumeral(0), this._styleCoins, this._grpFeature);
            this._freeSpinValueTxt.anchor.set(0.5, 0.5);
        }

        //BUTTON OPTION
        /*this._optionBtn = new Phaser.Button(game, this._infoBtn.x+740, this._infoBtn.y, 'ui', null, this, 'bet-setting-hov.png', 'bet-setting.png', 'bet-setting-clk.png');
        this._optionBtn.anchor.set(0.5, 0.5);
        //this._optionBtn.scale.set(1.8,1.8);
        this._optionBtn.events.onInputDown.add(this.btnClick, this, 0, "option");
        this._groupButton.addChild(this._optionBtn);

        this._optionBtnDisable = game.add.sprite(this._optionBtn.x, this._optionBtn.y, 'ui', 'bet-setting-clk.png', this._groupButton);
        this._optionBtnDisable.anchor.set(0.5, 0.5);
        //this._optionBtnDisable.scale.set(1.8,1.8);
        this._optionBtnDisable.visible = false;*/

        this._maxBetFrame = game.add.sprite(this._betValueTxtFrame.x+240, this._betValueTxtFrame.y, 'ui', 'Maxbet-frame.png', this._grpNormal);
        this._maxBetFrame.anchor.set(0.5, 0.5);
        this._maxBetFrame.scale.set(1.2);

        this._maxBetBtn = game.add.button(this._maxBetFrame.x, this._maxBetFrame.y, this._langName, this.btnClick, this, "Maxbet-button.png", "Maxbet-button_Clk.png", "Maxbet-button_Hov.png", "maxBet", this._grpNormal);
        this._maxBetBtn.anchor.set(0.5, 0.5);
        this._maxBetBtn.scale.set(1.2);

        this._maxBetBtnDisable = game.add.sprite(this._maxBetBtn.x, this._maxBetBtn.y, this._langName, 'Maxbet-button.png', this._grpNormal);
        this._maxBetBtnDisable.anchor.set(0.5, 0.5);
        this._maxBetBtnDisable.scale.set(1.2);
        this._maxBetBtnDisable.tint = 0x777777;

        // var maxBetTxt = game.add.text(this._maxBetBtn.x,this._maxBetBtn.y+3,GlobalClass.getXMLByKey(game,"button maxbet"), {
        //     fontSize:"18px",
        //     fontFamily:"Times New Roman",
        //     fill: "#FFFFFF",
        //     align: "center"
        // });
        // maxBetTxt.anchor.set(0.5, 0.5);
        // this._grpFont.addChild(maxBetTxt);

        /*this._spinFrame = game.add.sprite(1080, 595, 'ui', 'Spin-Frame.png', this._groupButton);
        this._spinFrame.anchor.set(0.5, 0.5);
        this._spinFrame.scale.set(2);*/

        // this._gear1 = game.add.sprite(1137, 569, 'ui', 'gear1.png', this._groupButton);
        // this._gear1.anchor.set(0.5, 0.5);
        // this._gear1.scale.set(2);


        // this._gear1Tween = game.add.tween(this._gear1).to( { angle:360}, 5000, "Linear", false,0,-1);

        // this._spinButtonFrame = game.add.sprite(this._gear1.x+1.6, this._gear1.y+1.6, 'ui', 'Spin-button-Frame.png', this._groupButton);
        // this._spinButtonFrame.anchor.set(0.5, 0.5);
        // this._spinButtonFrame.scale.set(2);

        this._spinBbuttonFrame = game.add.sprite(this._maxBetFrame.x+245, this._maxBetFrame.y-45, 'ui', 'spin-button-frame.png', this._groupButton);
        this._spinBbuttonFrame.anchor.set(0.5, 0.5);
        this._spinBbuttonFrame.scale.set(0.8);


        // this._gear3 = game.add.sprite(this._gear1.x-115.2, this._gear1.y-46.4, 'ui', 'gear3.png', this._groupButton);
        // this._gear3.anchor.set(0.5, 0.5);
        // this._gear3.scale.set(1.6,1.6);
        // this._gear3Tween = game.add.tween(this._gear3).to( { angle:-360}, 2000, "Linear", false,0,-1);

        // this._gear2 = game.add.sprite(this._gear1.x-144, this._gear1.y+36.8, 'ui', 'gear2.png', this._groupButton);
        // this._gear2.anchor.set(0.5, 0.5);
        // this._gear2.scale.set(1.6,1.6);

        // this._autospinFrame = game.add.sprite(this._gear2.x, this._gear2.y, 'ui', 'autospin-frame.png', this._groupButton);
        // this._autospinFrame.anchor.set(0.5, 0.5);
        // this._autospinFrame.scale.set(1.6,1.6);

        this._autoSpinBtn = game.add.button(this._spinBbuttonFrame.x-88, this._spinBbuttonFrame.y+23, 'ui', this.btnClick, this, "Auto-Spin-button.png", "Auto-Spin-button_Hov.png", "Auto-Spin-button_Hov.png", "autoplay", this._groupButton);
        this._autoSpinBtn.anchor.set(0.5, 0.5);
        this._autoSpinBtn.scale.set(1.5);


        this._autoSpinBtnDisable = game.add.sprite(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', 'Auto-Spin-button_Grey.png', this._groupButton);
        this._autoSpinBtnDisable.anchor.set(0.5, 0.5);
        this._autoSpinBtnDisable.scale.set(1.5);
        this._autoSpinBtnDisable.visible = false;

        /*this._autoSpinBtnTxt = game.add.sprite(this._autospinFrame.x, this._autospinFrame.y, 'ui', 'Auto-Spin-font.png', this._groupButton);
        this._autoSpinBtnTxt.anchor.set(0.5, 0.5);*/

        this._autoSpinBtnTxt = game.add.text(this._autoSpinBtn.x, this._autoSpinBtn.y+3, GlobalClass.getXMLByKey(game,"button autospin"), {
            fontSize:"16px",
            fontFamily:"Times New Roman",
            fill: "#000000",
            align: "center"
        }, this._groupButton);
        this._autoSpinBtnTxt.anchor.set(0.5, 0.5);

        if(!AppConstants.AUTOPLAY){
            this._autoSpinBtnDisable.visible = false;
            this._autoSpinBtn.visible = false;
            this._autoSpinBtnTxt.text = "";
        }

        this._stopBtn = game.add.button(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', this.btnClick, this, "Stop-Button.png", "Stop-Button_clk.png", "Stop-Button_hov.png", "stopautospin", this._groupButton);
        this._stopBtn.anchor.set(0.5, 0.5);
        this._stopBtn.visible = false;
        this._stopBtn.scale.set(1);

        this._stopBtnDisable = game.add.sprite(this._stopBtn.x, this._stopBtn.y, 'ui', 'Stop-Button_grey.png', this._groupButton);
        this._stopBtnDisable.anchor.set(0.5, 0.5);
        this._stopBtnDisable.scale.set(1);
        this._stopBtnDisable.visible = false;

        this._freeLeftCnt = game.add.text(this._stopBtn.x, this._stopBtn.y, '', this._autoSpinStyle, this._grpFeature);
        this._freeLeftCnt.anchor.set(0.5, 0.5);
        this._freeLeftCnt.visible = false;



        this._spinBtn = game.add.button(this._stopBtn.x+128, this._stopBtn.y-30, 'ui', this.btnClick, this, "Spin-button.png", "Spin-button_clk.png", "Spin-button_hov.png", "spin", this._groupButton);
        this._spinBtn.anchor.set(0.5, 0.5);
        this._spinBtn.scale.set(1.6);

        this._spinBtnDisable = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'Spin-button_grey.png', this._groupButton);
        this._spinBtnDisable.anchor.set(0.5, 0.5);
        this._spinBtnDisable.scale.set(1.6);
        this._spinBtnDisable.visible = false;

        this._skipBtn = game.add.button(this._spinBtn.x, this._spinBtn.y, 'ui', this.btnClick, this, "Skip-button.png", "Skip-button_clk.png", "Skip-button_hov.png", "skip", this._groupButton);
        this._skipBtn.anchor.set(0.5, 0.5);
        this._skipBtn.scale.set(1.6);
        this._skipBtn.visible = false;

        this._skipBtnDisable = game.add.sprite(this._skipBtn.x, this._skipBtn.y, 'ui', 'Skip-button_grey.png', this._groupButton);
        this._skipBtnDisable.anchor.set(0.5, 0.5);
        this._skipBtnDisable.scale.set(1.6);
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
        this._spinFX.scale.set(1.5);

        var textures = this._spinFX.animations.generateFrameNames("spin Fx_", 7, 18, '.png', 3);
        this._spinFX.textures = textures;
        this._spinFX.visible = false;

        var langBtn = game.add.button(40, 640, 'network', this.btnClick, this, 'language-button.png', 'language-button-clk.png', 'language-button-hov.png',"openLangWindow");
        langBtn.anchor.set(0.5, 0.5);
        langBtn.scale.set(1.5);
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

        this._balanceTxt = game.add.text(60, GlobalClass.STAGE_HEIGHT - 7, '', this._styleValue, this._groupButton);
        this._balanceTxt.anchor.set(0, 1);
        this.setBalance();

        this._winTxt = game.add.text(GlobalClass.STAGE_WIDTH / 2,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._winTxt.anchor.set(0, 1);
        this.setWinValue(0);
        
        this._totalBetTxt = game.add.text(GlobalClass.STAGE_WIDTH - 60,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._totalBetTxt.anchor.set(1, 1);
        this.setTotalBet();

        this.createAutoPlay();


        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
            this.setMode(true);
        } else {
            this.setMode(false);
            if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                this.btnStopAutoSpin();
            }
        }


        
        this._sprSessionBalance = game.add.sprite(980, 550, 'ui', 'column.png',this._groupButton);
        this._sprSessionBalance.anchor.set(0.5);
        this._sprSessionBalance.scale.set(0.75);

        this._txtSessionBalance = game.add.text(this._sprSessionBalance.x, this._sprSessionBalance.y - 25, `${GlobalClass.getXMLByKey(game, "session_balance")}`, {
            fontSize:"14px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
            strokeThickness: 4,
        }, this._groupButton);
        this._txtSessionBalance.anchor.set(0.5);

        this._txtSessionBalanceValue = game.add.text(this._sprSessionBalance.x, this._sprSessionBalance.y, `${GlobalClass.getFormatCurrency(GlobalClass.GAME_SESSION_BALANCE)}`, {
            fontSize:"18px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
        }, this._groupButton);
        this._txtSessionBalanceValue.anchor.set(0.5);

        let scl = 1;
        this._txtSessionBalanceValue.scale.set(1);
        do {
            scl -= 0.01;
            this._txtSessionBalanceValue.scale.set(scl);
        } while (this._txtSessionBalanceValue.width > 110)

        if (!GlobalClass.GAME_SESSION_BALANCE_ACTIVE) {
            this._sprSessionBalance.visible = false;
            this._txtSessionBalance.visible = false;
            this._txtSessionBalanceValue.visible = false;
        }


        this.setButton(); 
    };

    this.createPortrait = function(){
        GlobalClass.deleteChildren(this._grpNormal);
        GlobalClass.deleteChildren(this._groupButton);
        GlobalClass.deleteChildren(this._grpFeature);
        GlobalClass.deleteChildren(this._groupOption);
        GlobalClass.deleteChildren(this._groupAutoPlay);

        this._autoSpinStyle = {
            fontSize:"16px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#000",
            align: "center"
        };

        var homeBtn = game.add.button(GlobalClass.STAGE_WIDTH - 40, 70, 'network', this.btnClick, this, 'home-button.png', 'home-button-clk.png', 'home-button-Hov.png',"home");
        homeBtn.anchor.set(0.5);
        homeBtn.scale.set(1.2);
        this._groupButton.addChild(homeBtn);
        if(AppConstants.disableLobby){
            homeBtn.visible = false;
        }

        this.rgBtn = game.add.button(GlobalClass.STAGE_WIDTH - 200, 70, 'responsible_gambling', this.btnClick, this, 'Button_RG_small.png', 'Button_RG_small.png', 'Button_RG_small.png',"rg", this._groupButton);        
        this.rgBtn.anchor.set(0.5);
        this.rgBtn.visible = false;
        this.rgDisabledBtn = game.add.sprite(this.rgBtn.x, this.rgBtn.y, 'responsible_gambling', 'Button_RG_disable.png', this._groupButton);
        this.rgDisabledBtn.anchor.set(0.5);
        this.rgDisabledBtn.visible = false;

        this._btnFreespins = game.add.button(60, 1100, 'freespins', this.btnClick, this, 'Coins icon.png', 'Coins icon.png', 'Coins icon.png', 'freespins', this._groupButton);
        this._btnFreespins.anchor.set(0.5);
        this._btnFreespins.visible = false;

        // this.history = game.add.button(60, game.world.centerX+540, 'network', this.btnClick, this, "history-button.png", "history-button-CLK.png", "history-button-HOV.png", "history", this._groupButton);
        // this.history.anchor.set(0.5, 0.5);
        // this.history.scale.set(1.2,1.2);

        // this.historyDisable = game.add.sprite(this.history.x, this.history.y, 'network', 'history-button-grey.png', this._groupButton);
        // this.historyDisable.anchor.set(0.5, 0.5);
        // this.historyDisable.scale.set(1.2,1.2);
        // this.historyDisable.visible = false;

        this._infoBtn =  game.add.button(210, 1180, 'ui', this.btnClick, this, "info-button.png", "info-button-Clk.png", "info-button-Hov.png", "information", this._groupButton);
        this._infoBtn.anchor.set(0.5, 0.5);
        this._infoBtn.scale.set(1.5,1.5);

        this._infoBtnDisable = game.add.sprite(this._infoBtn.x, this._infoBtn.y, 'ui', 'info-button_grey.png', this._groupButton);
        this._infoBtnDisable.anchor.set(0.5, 0.5);
        this._infoBtnDisable.scale.set(1.5,1.5);
        this._infoBtnDisable.visible = false;

        this._settingBtn = game.add.button(130, 1180, 'ui', this.btnClick, this, "setting-button.png", "setting-button-Clk.png", "setting-button-Hov.png", "setting", this._groupButton);
        this._settingBtn.anchor.set(0.5, 0.5);
        this._settingBtn.scale.set(1.5,1.5);

        this._settingBtnDisable = game.add.sprite(this._settingBtn.x, this._settingBtn.y, 'ui', 'setting-button-grey.png', this._groupButton);
        this._settingBtnDisable.anchor.set(0.5, 0.5);
        this._settingBtnDisable.scale.set(1.5,1.5);
        this._settingBtnDisable.visible = false;

        

        // var maxBetTxt = game.add.text(this._maxBetBtn.x,this._maxBetBtn.y+3,GlobalClass.getXMLByKey(game,"button maxbet"), {
        //     fontSize:"18px",
        //     fontFamily:"Times New Roman",
        //     fill: "#FFFFFF",
        //     align: "center"
        // });
        // maxBetTxt.anchor.set(0.5, 0.5);
        // this._grpFont.addChild(maxBetTxt);

        this._coinValueFrame = game.add.button(game.world.centerY, this._infoBtn.y, 'ui',  this.btnClick, this,'column.png','column.png','column.png', "none",this._grpNormal);
        this._coinValueFrame.anchor.set(0.5, 0.5);
        this._coinValueFrame.scale.set(0.85,0.85);

        this._coinValueFont = game.add.text(this._coinValueFrame.x, this._coinValueFrame.y - 35, GlobalClass.getXMLByKey(game, "bottombetmultiplier"), this._styleText, this._grpNormal);
        this._coinValueFont.anchor.set(0.5, 0.5);

        this._coinValueTxt =  game.add.text(this._coinValueFrame.x,this._coinValueFrame.y, "0", this._styleCoins, this._grpNormal);
        this._coinValueTxt.anchor.set(0.5, 0.5);
        this._coinValueTxt.scale.set(0.85,0.85);
        if (GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS] > 100) {
            this._coinValueTxt.text = numeral(GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS]).format('0,0', Math.floor);
        } else {
            this._coinValueTxt.text = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        }

        this._betValueTxtFrame = game.add.button(this._coinValueFrame.x+240, this._coinValueFrame.y, 'ui', this.btnClick, this,'column.png','column.png','column.png', "none",this._grpNormal);
        this._betValueTxtFrame.anchor.set(0.5, 0.5);
        this._betValueTxtFrame.scale.set(0.85,0.85);

        this._betFont = game.add.text(this._betValueTxtFrame.x, this._betValueTxtFrame.y - 35, GlobalClass.getXMLByKey(game, "bottombet"), this._styleText, this._grpNormal);
        this._betFont.anchor.set(0.5, 0.5);

        this._betValueTxt =  game.add.text(this._betValueTxtFrame.x,this._betValueTxtFrame.y, numeral(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]).format('0,0', Math.floor), this._styleCoins, this._grpNormal);
        this._betValueTxt.anchor.set(0.5, 0.5);
        this._betValueTxt.scale.set(0.85,0.85);


        this.coinMinBtn = game.add.button(280, 1180, 'plusmin', this.btnClick, this, '--button.png', '--button-clk.png', '--button-hov.png', "minusCoin");
        this.coinMinBtn.anchor.set(0.5, 0.5);
        this.coinMinBtn.scale.set(1.3);
        this._grpNormal.addChild(this.coinMinBtn);

        this.coinMinBtnDisable = game.add.sprite (280, 1180, 'plusmin', '--button-disable.png');
        this.coinMinBtnDisable.anchor.set(0.5, 0.5);
        this.coinMinBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.coinMinBtnDisable);

        this.coinPlusBtn = game.add.button(440, 1180, 'plusmin', this.btnClick, this, '+-button.png', '+-button-clk.png', '+-button-hov.png', "plusCoin");
        this.coinPlusBtn.anchor.set(0.5, 0.5);
        this.coinPlusBtn.scale.set(1.3);
        this._grpNormal.addChild(this.coinPlusBtn);

        this.coinPlusBtnDisable = game.add.sprite (440, 1180, 'plusmin', '+-button-disable.png');
        this.coinPlusBtnDisable.anchor.set(0.5, 0.5);
        this.coinPlusBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.coinPlusBtnDisable);

        this.betMinBtn = game.add.button(510, 1180, 'plusmin', this.btnClick, this, '--button.png', '--button-clk.png', '--button-hov.png', "minusBet");
        this.betMinBtn.anchor.set(0.5, 0.5);
        this.betMinBtn.scale.set(1.3);
        this._grpNormal.addChild(this.betMinBtn);

        this.betMinBtnDisable = game.add.sprite (510, 1180, 'plusmin', '--button-disable.png');
        this.betMinBtnDisable.anchor.set(0.5, 0.5);
        this.betMinBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.betMinBtnDisable)

        this.betPlusBtn = game.add.button(680, 1180, 'plusmin', this.btnClick, this, '+-button.png', '+-button-clk.png', '+-button-hov.png', "plusBet");
        this.betPlusBtn.anchor.set(0.5, 0.5);
        this.betPlusBtn.scale.set(1.3);
        this._grpNormal.addChild(this.betPlusBtn);

        this.betPlusBtnDisable = game.add.sprite (680, 1180, 'plusmin', '+-button-disable.png');
        this.betPlusBtnDisable.anchor.set(0.5, 0.5);
        this.betPlusBtnDisable.scale.set(1.3);
        this._grpNormal.addChild(this.betPlusBtnDisable)



        //free game mode
        this._freeSpinFrame = game.add.sprite(this._betValueTxtFrame.x, this._betValueTxtFrame.y, this._langName, 'Free-spin-column.png', this._grpFeature);
        this._freeSpinFrame.anchor.set(0.5, 0.5);
        this._freeSpinFrame.scale.set(0.85,0.85);

        if(GlobalClass.GAME_LANG=='zh'){
            this._freeSpinValueTxt =  game.add.text(this._freeSpinFrame.x,this._freeSpinFrame.y+6,myNumeral(0), this._styleCoins, this._grpFeature);
            this._freeSpinValueTxt.anchor.set(0.5, 0.5);
            this._freeSpinValueTxt.scale.set(0.85,0.85);
         }else {
            this._freeSpinValueTxt =  game.add.text(this._freeSpinFrame.x,this._freeSpinFrame.y+6,myNumeral(0), this._styleCoins, this._grpFeature);
            this._freeSpinValueTxt.anchor.set(0.5, 0.5);
            this._freeSpinValueTxt.scale.set(0.85,0.85);
        }

        this._totalWinFrame = game.add.sprite(this._coinValueFrame.x, this._coinValueFrame.y, this._langName, 'total-win-column.png', this._grpFeature);
        this._totalWinFrame.anchor.set(0.5, 0.5);
        this._totalWinFrame.scale.set(0.85,0.85);

        if(GlobalClass.GAME_LANG=='zh'){
            this._totalWinTxt =  game.add.text(this._totalWinFrame.x,this._totalWinFrame.y+4, GlobalClass.getFormatCurrency(0), this._styleCoins, this._grpFeature);
            this._totalWinTxt.anchor.set(0.5, 0.5);
            this._totalWinTxt.scale.set(0.85,0.85);
        } else {
            this._totalWinTxt =  game.add.text(this._totalWinFrame.x,this._totalWinFrame.y+4, GlobalClass.getFormatCurrency(0), this._styleCoins, this._grpFeature);
            this._totalWinTxt.anchor.set(0.5, 0.5);
            this._totalWinTxt.scale.set(0.85,0.85);
        }

        this._spinButtonFrame = game.add.sprite(game.world.centerY,game.world.centerX+340, 'mobile', 'spin-frame-mobile.png', this._groupButton);
        this._spinButtonFrame.anchor.set(0.5, 0.5);


        this._maxBetBtn = game.add.button(this._spinButtonFrame.x-198, this._spinButtonFrame.y+25, 'mobile', this.btnClick, this, "maxbetButton-potrait.png", "maxbetButton-potrait-clk.png", "maxbetButton-potrait-hov.png", "maxBet", this._groupButton);
        this._maxBetBtn.anchor.set(0.5, 0.5);


        this._maxBetBtnDisable = game.add.sprite(this._maxBetBtn.x, this._maxBetBtn.y, 'mobile', 'maxbetButton-potrait-clk.png', this._groupButton);
        this._maxBetBtnDisable.anchor.set(0.5, 0.5);
        this._maxBetBtnDisable.visible = false;
        this._maxBetBtnDisable.tint = 0x777777;

        if(GlobalClass.GAME_LANG=='zh'){
            this._maxBetText = game.add.sprite(this._maxBetBtn.x, this._maxBetBtn.y,"mobile","maxbetFont-potrait-ch.png",this._groupButton);
            this._maxBetText.anchor.set(0.5, 0.5);
        } else {
            this._maxBetText = game.add.sprite(this._maxBetBtn.x, this._maxBetBtn.y,"mobile","maxbetFont-potrait.png",this._groupButton);
            this._maxBetText.anchor.set(0.5, 0.5);
        }

        this._autoSpinBtn = game.add.button(this._maxBetBtn.x+395, this._maxBetBtn.y, 'ui', this.btnClick, this, "Auto-Spin-button.png", "Auto-Spin-button_Hov.png", "Auto-Spin-button_Hov.png", "autoplay", this._groupButton);
        this._autoSpinBtn.anchor.set(0.5, 0.5);
        this._autoSpinBtn.scale.set(1.55);


        this._autoSpinBtnDisable = game.add.sprite(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', 'Auto-Spin-button_Grey.png', this._groupButton);
        this._autoSpinBtnDisable.anchor.set(0.5, 0.5);
        this._autoSpinBtnDisable.scale.set(1.55);
        this._autoSpinBtnDisable.visible = false;

        this._autoSpinBtnTxt = game.add.text(this._autoSpinBtn.x, this._autoSpinBtn.y+3, GlobalClass.getXMLByKey(game,"button autospin"), {
            fontSize:"12px",
            fontFamily:"Times New Roman",
            fill: "#000000",
            align: "center"
        }, this._groupButton);
        this._autoSpinBtnTxt.anchor.set(0.5, 0.5);

        if(!AppConstants.AUTOPLAY){
            this._autoSpinBtnDisable.visible = false;
            this._autoSpinBtn.visible = false;
            this._autoSpinBtnTxt.text = "";
        }
        
        var langBtn = game.add.button(50, 1180, 'network', this.btnClick, this, 'language-button.png', 'language-button-clk.png', 'language-button-hov.png',"openLangWindow");
        langBtn.anchor.set(0.5, 0.5);
        langBtn.scale.set(1.5);
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


        this._stopBtn = game.add.button(this._autoSpinBtn.x, this._autoSpinBtn.y, 'ui', this.btnClick, this, "Stop-Button.png", "Stop-Button_clk.png", "Stop-Button_hov.png", "stopautospin", this._groupButton);
        this._stopBtn.anchor.set(0.5, 0.5);
        this._stopBtn.visible = false;
        //this._stopBtn.scale.set(0.55);

        this._stopBtnDisable = game.add.sprite(this._stopBtn.x, this._stopBtn.y, 'ui', 'Stop-Button_grey.png', this._groupButton);
        this._stopBtnDisable.anchor.set(0.5, 0.5);
        this._stopBtnDisable.visible = false;
        //this._stopBtnDisable.scale.set(0.55);

        this._freeLeftCnt = game.add.text(this._stopBtn.x, this._stopBtn.y, '', this._autoSpinStyle, this._grpFeature);
        this._freeLeftCnt.anchor.set(0.5, 0.5);
        this._freeLeftCnt.visible = false;


        this._spinBtn = game.add.button(game.world.centerY,game.world.centerX+330, 'ui', this.btnClick, this, "Spin-button.png", "Spin-button_clk.png", "Spin-button_hov.png", "spin", this._groupButton);
        this._spinBtn.anchor.set(0.5, 0.5);
        this._spinBtn.scale.set(1.8);

        this._spinBtnDisable = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'Spin-button_grey.png', this._groupButton);
        this._spinBtnDisable.anchor.set(0.5, 0.5);
        this._spinBtnDisable.visible = false;
        this._spinBtnDisable.scale.set(1.8);

        this._skipBtn = game.add.button(this._spinBtn.x, this._spinBtn.y, 'ui', this.btnClick, this, "Skip-button.png", "Skip-button_clk.png", "Skip-button_hov.png", "skip", this._groupButton);
        this._skipBtn.anchor.set(0.5, 0.5);
        this._skipBtn.visible = false;
        this._skipBtn.scale.set(1.8);

        this._skipBtnDisable = game.add.sprite(this._skipBtn.x, this._skipBtn.y, 'ui', 'Skip-button_grey.png', this._groupButton);
        this._skipBtnDisable.anchor.set(0.5, 0.5);
        this._skipBtnDisable.visible = false;
        this._skipBtnDisable.scale.set(1.8);


        this._spinFX = game.add.sprite(this._spinBtn.x, this._spinBtn.y, 'ui', 'spin Fx_007.png', this._groupButton);
        this._spinFX.anchor.set(0.5, 0.5);
        this._spinFX.scale.set(1.8);
        
        var textures = this._spinFX.animations.generateFrameNames("spin Fx_", 7, 18, '.png', 3);
        this._spinFX.textures = textures;
        this._spinFX.visible = false;

        this._bottomPanel = game.add.sprite(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT, 'uiPanel', 'BG_allBanners.png', this._groupButton);
        this._bottomPanel.anchor.set(0.5,1);
        this._bottomPanel.width = GlobalClass.STAGE_WIDTH;
        this._bottomPanel.height = 35;

        this._balanceTxt = game.add.text(10, 1280 - 7, '', this._styleValue, this._groupButton);
        this._balanceTxt.anchor.set(0, 1);
        this.setBalance();

        this._winTxt = game.add.text(380,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._winTxt.anchor.set(0.5, 1);
        this.setWinValue(0);

        this._totalBetTxt = game.add.text(720 - 10,this._balanceTxt.y, '', this._styleValue, this._groupButton);
        this._totalBetTxt.anchor.set(1, 1);
        this.setTotalBet();

        /*this._gameLogo = game.add.sprite(this._totalBetTxt.x+350, GlobalClass.STAGE_WIDTH-5, 'ui', 'gameLogo.png', this._groupButton);
        this._gameLogo.anchor.set(0, 1);
        this._gameLogo.scale.set(0.2, 0.2);*/


        // FOR AUTOPLAY
        this.createAutoPlay();

        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
            this.setMode(true);
        } else {
            this.setMode(false);
            if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                this.btnStopAutoSpin();
            }
        }
        

        this._sprSessionBalance = game.add.sprite(600, 870, 'ui', 'column.png',this._groupButton);
        this._sprSessionBalance.anchor.set(0.5);
        this._sprSessionBalance.scale.set(0.75);

        this._txtSessionBalance = game.add.text(this._sprSessionBalance.x, this._sprSessionBalance.y - 25, 'SESSION BALANCE', {
            fontSize:"14px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
            strokeThickness: 4,
        }, this._groupButton);
        this._txtSessionBalance.anchor.set(0.5);

        this._txtSessionBalanceValue = game.add.text(this._sprSessionBalance.x, this._sprSessionBalance.y, `${GlobalClass.getFormatCurrency(GlobalClass.GAME_SESSION_BALANCE)}`, {
            fontSize:"18px",
            fontFamily:"Arial",
            fontWeight:"bold",
            fill: "#ff4",
        }, this._groupButton);
        this._txtSessionBalanceValue.anchor.set(0.5);

        let scl = 1;
        this._txtSessionBalanceValue.scale.set(1);
        do {
            scl -= 0.01;
            this._txtSessionBalanceValue.scale.set(scl);
        } while (this._txtSessionBalanceValue.width > 110)

        if (!GlobalClass.GAME_SESSION_BALANCE_ACTIVE) {
            this._sprSessionBalance.visible = false;
            this._txtSessionBalance.visible = false;
            this._txtSessionBalanceValue.visible = false;
        }


        this.setButton();
    };

    this.createAutoPlay = function(){
        var bgTransparent = game.add.sprite(0, 0, 'uiPanel', 'BG_allBanners.png', this._groupAutoPlay);
        bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
        bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
        bgTransparent.buttonMode = true;
        bgTransparent.interactive = true;
        bgTransparent.on('pointerup', this.btnAutoClose, this);

        if(AppConstants.LANDSCAPE){
             this._autospinFrame = game.add.sprite(this._spinBtn.x - 320, this._spinBtn.y -260, 'mobile', 'auto-spin-settin-frame-frame.png');
             this._autospinFrame.anchor.set(0.5, 0.5);
             this._autospinFrame.scale.set(1.19);
             this._groupAutoPlay.addChild(this._autospinFrame);
         } else {
            this._autospinFrame = game.add.sprite(game.world.centerY, game.world.centerX+200, 'mobile', 'auto-spin-settin-frame-frame.png');
            this._autospinFrame.anchor.set(0.5, 0.5);
            this._autospinFrame.scale.set(1.19);
            this._groupAutoPlay.addChild(this._autospinFrame);
         }

        this._autoSpinButton50 = game.add.button(this._autospinFrame.x, this._autospinFrame.y - 160, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin20");
        this._autoSpinButton50.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton50);

        this._txt50 =  game.add.text(this._autoSpinButton50.x, this._autoSpinButton50.y,  GlobalClass.GAME_AUTO_VALUES[0], this._style4);
        this._txt50.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txt50);

        this._autoSpinButton100 = game.add.button(this._autospinFrame.x, this._autospinFrame.y - 10, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin50");
        this._autoSpinButton100.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton100);

        this._txt100 = game.add.text(this._autoSpinButton100.x, this._autoSpinButton100.y,  GlobalClass.GAME_AUTO_VALUES[1], this._style4);
        this._txt100.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._txt100);

        this._autoSpinButton250 = game.add.button(this._autospinFrame.x, this._autospinFrame.y + 140, 'mobile', this.btnClick, this, 'Auto-spin-number-button-tap.png', 'Auto-spin-number-button.png', 'Auto-spin-number-button.png',"spin100");
        this._autoSpinButton250.anchor.set(0.5, 0.5);
        this._groupAutoPlay.addChild(this._autoSpinButton250);

        this._txt250 = game.add.text(this._autoSpinButton250.x, this._autoSpinButton250.y, GlobalClass.GAME_AUTO_VALUES[2], this._style4);
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
            if(AppConstants.LANDSCAPE){
                this._btnStop.x = this._btnSpin.x;
                this._btnStop.y = this._btnSpin.y;
                this._txtSpinLeft.x = this._autoSpinBtn.x;
                this._txtSpinLeft.y = this._autoSpinBtn.y;
            } else {
                this._btnStop.x = this._btnSpin.x;
                this._btnStop.y = this._btnSpin.y;
                this._txtSpinLeft.x = this._autoSpinBtn.x;
                this._txtSpinLeft.y = this._autoSpinBtn.y;
            }
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
            this._spinBtn.visible = false;
            this._spinBtnDisable.visible = true;
            this._stopBtn.visible = false;
            this._stopBtnDisable.visible = false;
            this._skipBtn.visible = false;
            this._skipBtnDisable.visible = false;
            this._autoSpinBtn.visible = true;
            if(AppConstants.AUTOPLAY){
                this._autoSpinBtnTxt.visible = true;
                this._autoSpinBtnDisable.visible = false;
            }
            
            this._grpFont.visible = false;
            this._maxBetBtn.visible = false;
            this._maxBetBtnDisable.visible = true;
            if(GlobalClass.FREE_GAME_AUTO_SPIN){
                this._stopBtnDisable.visible = false;
                this._stopBtn.visible = true;
                this._freeLeftCnt.visible = true;
            }

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

    this.btnAutoClose = function() {
        soundClass.playSound("soundbtnclick");
        this._groupAutoPlay.visible = false;
        this._checkAutoPlayOpen = false;
    };

    this.btnClick = function(cButton) {
        if (cButton.btnKey == "none") {
            return;
        }
        if(this.btnClicking){
            return;
        }
        this.btnClicking = true;
        if(cButton.btnKey!='quickspinon' && cButton.btnKey != 'quickspinoff' && cButton.btnKey != 'autoplay'){
            if(this._checkAutoPlayOpen){
                this._groupAutoPlay.visible = false;
                this._checkAutoPlayOpen = false;
            }
        }
        
        soundClass.playSound("soundbtnclick");
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
            case "setting":
                if(GlobalClass.GAME_CONDITION==GlobalClass.GAME_CONDITION_IDLE || GlobalClass.GAME_CONDITION==GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL){
                    gameplayState.addOption();
                }
                break;
            case "information":
                gameplayState.addPaytable();
                break;
            case "openLangWindow":
                gameplayState.openLangWindow();
                break;
            case "minusCoin":
                if (GlobalClass.GAME_COIN_POS > 0) {
                    GlobalClass.GAME_COIN_POS--;
                    this.setCoin();
                    // this.setTotalBet();
                }
                break;
            case "plusCoin":
                if (GlobalClass.GAME_COIN_POS < GlobalClass.GAME_COIN_VALUE.length - 1) {
                    GlobalClass.GAME_COIN_POS++;
                    this.setCoin();
                    // this.setTotalBet();
                }
                break;
            case "minusBet":
                if (GlobalClass.GAME_BET_POS > 0) {
                    GlobalClass.GAME_BET_POS--;
                    this.setBet();
                    // this.setTotalBet();
                }
                break;
            case "plusBet":
                if (GlobalClass.GAME_BET_POS < GlobalClass.GAME_BET.length - 1) {
                    GlobalClass.GAME_BET_POS++;
                    this.setBet();
                    // this.setTotalBet();
                }
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
                        this._groupAutoPlay.visible = false;
                        this._checkAutoPlayOpen = false;
                    }
                    else{
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
                GlobalClass.CONFIG_AUTO_REMAINING = GlobalClass.GAME_AUTO_VALUES[0];
                this.btnStopAutoSpin();
                break;
            case "spin50":
                this._autoSpinActive = true;
                GlobalClass.CONFIG_AUTO_REMAINING = GlobalClass.GAME_AUTO_VALUES[1];
                this.btnStopAutoSpin();
                break;
            case "spin100":
                this._autoSpinActive = true;
                GlobalClass.CONFIG_AUTO_REMAINING = GlobalClass.GAME_AUTO_VALUES[2];
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
        if(this._groupOptionAutoSpin!=null){
            GlobalClass.deleteChildren(this._groupOptionAutoSpin);
            this._groupOptionAutoSpin.destroy();
            this._groupOptionAutoSpin = null;
        }
        this._groupOptionAutoSpin = game.add.group();
        group.addChild(this._groupOptionAutoSpin);

        if (this._groupAutoPlay != null) {
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
            // game.notify.event.emit("sentMsgSolid","FEIM.send.autoPlayFinished");

            this._autoSpinActive = false;
            GlobalClass.CONFIG_AUTO_REMAINING = 0;
            if (this._groupOptionAutoSpin != null) {
                this._groupOptionAutoSpin.destroy();
                this._groupOptionAutoSpin = null;
            }
            if(AppConstants.AUTOPLAY){
                this._autoSpinBtn.visible = true;
                this._autoSpinBtnTxt.visible = true;
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
            // var bc = GlobalClass.maxBet();
            // if (GlobalClass.GAME_BALANCE < bc) {
            //     gameplayState._informationClass.setText("nocoin");
            //     gameplayState._informationClass.setText("idle");
            //     return;
            // }
            // else{
                GlobalClass.GAME_COIN_POS = GlobalClass.GAME_COIN_VALUE.length - 1;
                GlobalClass.GAME_BET_POS = GlobalClass.GAME_BET.length - 1;
                this.setCoin();
                this.setBet();
                // this.setTotalBet();
            // }

            return
        }
        if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            gameplayState.checkFreeGames(true);
        }
        else{
            gameplayState.startSpin(true);
        }

    };

    this.hideValueFrame=function(){

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
                if(GlobalClass.GAME_BUSY){
                    GlobalClass.GAME_BUSY = false;
                    // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});
                }
                
                this._infoBtn.visible = true;
                this._infoBtnDisable.visible = false;
                this._settingBtn.visible = true;
                this._settingBtnDisable.visible = false;

                /*
                this.betMinBtn.visible = true;
                this.coinMinBtn.visible = true;
                this.betPlusBtn.visible = true;
                this.coinPlusBtn.visible = true;
                this.betMinBtnDisable.visible = false;
                this.coinMinBtnDisable.visible = false;
                this.betPlusBtnDisable.visible = false;
                this.coinPlusBtnDisable.visible = false;
                */

                // this.history.visible = true;
                // this.historyDisable.visible = false;

                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = true;
                    this._maxBetBtnDisable.visible = false;
                }
                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = true;
                    this._autoSpinBtnDisable.visible = false;
                }
                
                this._spinBtn.visible = true;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;

                this.checkBnBet();
                break;
            case GlobalClass.GAME_CONDITION_SPIN:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                this.betMinBtn.visible = false;
                this.coinMinBtn.visible = false;
                this.betPlusBtn.visible = false;
                this.coinPlusBtn.visible = false;
                this.betMinBtnDisable.visible = true;
                this.coinMinBtnDisable.visible = true;
                this.betPlusBtnDisable.visible = true;
                this.coinPlusBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;

                 if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
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

                this.betMinBtn.visible = false;
                this.coinMinBtn.visible = false;
                this.betPlusBtn.visible = false;
                this.coinPlusBtn.visible = false;
                this.betMinBtnDisable.visible = true;
                this.coinMinBtnDisable.visible = true;
                this.betPlusBtnDisable.visible = true;
                this.coinPlusBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = false;
                    this._autoSpinBtnDisable.visible = true;
                }
                this._spinBtn.visible = false;
                this._spinBtnDisable.visible = false;
                if (GlobalClass.GAME_CONFIG_SKIP) {
                    this._skipBtn.visible = true;
                    this._skipBtnDisable.visible = false;
                } else {
                    this._skipBtn.visible = false;
                    this._skipBtnDisable.visible = true;
                }
                break;
            case GlobalClass.GAME_CONDITION_ANIMATIONS:
                // do nothing
                break;
            case GlobalClass.GAME_CONDITION_ANIMATION_ALL:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                this.betMinBtn.visible = false;
                this.coinMinBtn.visible = false;
                this.betPlusBtn.visible = false;
                this.coinPlusBtn.visible = false;
                this.betMinBtnDisable.visible = true;
                this.coinMinBtnDisable.visible = true;
                this.betPlusBtnDisable.visible = true;
                this.coinPlusBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;

                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
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
                if(GlobalClass.GAME_BUSY){
                    GlobalClass.GAME_BUSY = false;
                    // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});
                }

                /*
                this._infoBtn.visible = true;
                this._infoBtnDisable.visible = false;
                this._settingBtn.visible = true;
                this._settingBtnDisable.visible = false;

                this.betMinBtn.visible = true;
                this.coinMinBtn.visible = true;
                this.betPlusBtn.visible = true;
                this.coinPlusBtn.visible = true;
                this.betMinBtnDisable.visible = false;
                this.coinMinBtnDisable.visible = false;
                this.betPlusBtnDisable.visible = false;
                this.coinPlusBtnDisable.visible = false;
                */

                // this.history.visible = true;
                // this.historyDisable.visible = false;

                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = true;
                    this._maxBetBtnDisable.visible = false;
                }
                if(AppConstants.AUTOPLAY){
                    this._autoSpinBtn.visible = true;
                    this._autoSpinBtnDisable.visible = false;
                }
                this._spinBtn.visible = true;
                this._spinBtnDisable.visible = false;
                this._skipBtn.visible = false;
                this._skipBtnDisable.visible = false;
                
                if(GlobalClass.CONFIG_AUTO_REMAINING == 0){
                    this._infoBtn.visible = true;
                    this._infoBtnDisable.visible = false;
                    this._settingBtn.visible = true;
                    this._settingBtnDisable.visible = false;

                    this.checkBnBet();
                }
                break;
            case GlobalClass.GAME_CONDITION_FREE_END:
                this._infoBtn.visible = false;
                this._infoBtnDisable.visible = true;
                this._settingBtn.visible = false;
                this._settingBtnDisable.visible = true;

                this.betMinBtn.visible = false;
                this.coinMinBtn.visible = false;
                this.betPlusBtn.visible = false;
                this.coinPlusBtn.visible = false;
                this.betMinBtnDisable.visible = true;
                this.coinMinBtnDisable.visible = true;
                this.betPlusBtnDisable.visible = true;
                this.coinPlusBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;

                 if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
                else{
                    this._maxBetBtn.visible = false;
                    this._maxBetBtnDisable.visible = true;
                }
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

                this.betMinBtn.visible = false;
                this.coinMinBtn.visible = false;
                this.betPlusBtn.visible = false;
                this.coinPlusBtn.visible = false;
                this.betMinBtnDisable.visible = true;
                this.coinMinBtnDisable.visible = true;
                this.betPlusBtnDisable.visible = true;
                this.coinPlusBtnDisable.visible = true;

                // this.history.visible = false;
                // this.historyDisable.visible = true;
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

        if (AppConstants.PDXM_BONUS_ACTIVE) {
            this.betMinBtn.visible = false;
            this.coinMinBtn.visible = false;
            this.betPlusBtn.visible = false;
            this.coinPlusBtn.visible = false;
            this.betMinBtnDisable.visible = true;
            this.coinMinBtnDisable.visible = true;
            this.betPlusBtnDisable.visible = true;
            this.coinPlusBtnDisable.visible = true;

            this._maxBetBtn.visible = false;
            this._maxBetBtnDisable.visible = true;

            this._autoSpinBtn.visible = false;
            this._autoSpinBtnDisable.visible = true;

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
        if (GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS] > 100) {
            this._coinValueTxt.text = numeral(GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS]).format('0,0', Math.floor);
        } else {
            this._coinValueTxt.text = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        }
        
        this.setTotalBet();
        this.setBalance();
        this.setWinValue(0);
        gameplayState._jackpotClass.changeJackPot();

    };

    this.setBet = function() {
        // var key = "WWW2120Bet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        // myLocalStorage.setItem(key,GlobalClass.GAME_BET_POS);
        
        this._betValueTxt.text = numeral(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]).format('0,0', Math.floor);
        this.setTotalBet();
        gameplayState._jackpotClass.updateTube();
        gameplayState._reelClass.updateSpecialFrame();
    };

    this.setBalance = function(value) {
        if (value) {
            GlobalClass.GAME_BALANCE = value;
            this._balanceValue = GlobalClass.GAME_BALANCE;
            this._balanceTxt.text = `${GlobalClass.getXMLByKey(game, "balance")}: ${GlobalClass.getFormatCurrency(this._balanceValue)}`;
            return;
        }

        
        if (GlobalClass.normal2Feature || GlobalClass.GAME_FEATURE) {
            return;
        }
        // if (GlobalClass.ONETOUCH_FREESPINS) {
        //     return;
        // }
        // var b = GlobalClass.coinValue(GlobalClass.GAME_BALANCE);
        // this._balanceTxt.text = GlobalClass.getXMLByKey(game,"balance")+": "+myNumeral(b).format('0')+" ("+GlobalClass.currency()   + myNumeral(GlobalClass.GAME_BALANCE).format('0,0.00')+")";
        this._balanceValue = GlobalClass.GAME_BALANCE;
        this._balanceTxt.text = `${GlobalClass.getXMLByKey(game, "balance")}: ${GlobalClass.getFormatCurrency(this._balanceValue)}`;
    };

    this.setSessionBalance = function(value, type) {
        const cleanValue1 = String(GlobalClass.GAME_SESSION_BALANCE).replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '');
        const cleanValue2 = String(value).replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '');
    
        const n1 = new bigDecimal(cleanValue1);
        const n2 = new bigDecimal(cleanValue2);
        let result;
    
        switch (type) {
            case "+":
                result = n1.add(n2);
                GlobalClass.GAME_SESSION_BALANCE = result.getValue();
                break;
            case "-":
                result = n1.subtract(n2);
                GlobalClass.GAME_SESSION_BALANCE = result.getValue();
                break;
            case "*":
                result = n1.multiply(n2);
                GlobalClass.GAME_SESSION_BALANCE = result.getValue();
                break;
            case ":":
            case "/":
                if (n2.compareTo(new bigDecimal("0")) === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                result = n1.divide(n2, 10); // 10 decimal places for precision
                GlobalClass.GAME_SESSION_BALANCE = result.getValue();
                break;
            default:
                GlobalClass.GAME_SESSION_BALANCE = cleanValue2;
        }
    
        this._txtSessionBalanceValue.text = GlobalClass.getFormatCurrency(GlobalClass.GAME_SESSION_BALANCE);
        // this._txtSessionBalanceValue.text = this.formatCurrency(this._txtSessionBalanceValue.text);
        
        let scl = 1;
        this._txtSessionBalanceValue.scale.set(1);
        do {
            scl -= 0.01;
            this._txtSessionBalanceValue.scale.set(scl);
        } while (this._txtSessionBalanceValue.width > 110)
    };

    this.formatCurrency = function(text) {
        // Hapus semua karakter kecuali angka, koma, titik, dan tanda minus
        let cleanedText = text.replace(/[^0-9,.-]/g, "");

        // Pastikan hanya ada satu tanda negatif di depan angka
        let isNegative = cleanedText.startsWith("-");
        cleanedText = cleanedText.replace(/-/g, ""); // Hapus semua tanda '-' dulu

        // Jika ada lebih dari satu titik atau koma, perbaiki dengan mengambil yang terakhir sebagai desimal
        let parts = cleanedText.split(/[,\.]/);
        let lastPart = parts.pop(); // Ambil bagian terakhir sebagai desimal
        let numberPart = parts.join(""); // Gabungkan sisa angka tanpa pemisah

        // Gabungkan kembali sebagai angka desimal yang valid
        let validNumber = numberPart + "." + lastPart;

        // Konversi ke angka float
        let number = parseFloat(validNumber);

        if (isNaN(number)) return text; // Jika tidak bisa diubah ke angka, kembalikan teks asli

        let formatted = number.toFixed(2); // Pastikan dua desimal

        return (isNegative ? "-$" : "$") + formatted;
    };

    this.setWinValue = function(value) {
        // if (value != 0) {
        //     game.notify.event.emit("sentMsgSolid","OTFEIM.addWin",value);
        // }
        // this._winTxt.text = GlobalClass.getXMLByKey(game,"win")+": "+value+" ("+GlobalClass.currency() + myNumeral(value*GlobalClass.trueCoinValue()).format('0,0.00')+")";
        // console.log("value " + value);
        this._winValue = value;
        this._winTxt.text =  `${GlobalClass.getXMLByKey(game, "win")}: ${GlobalClass.getFormatCurrency(this._winValue)}`;
    };

    this.setTotalBet = function() {
        // this._totalBetTxt.text =GlobalClass.getXMLByKey(game,"totalbet")+": "+GlobalClass.betPerLine1()+" ("+GlobalClass.currency()+ myNumeral(GlobalClass.betPerLine1()*GlobalClass.trueCoinValue()).format('0,0.00')+")";
        
        AppConstants.PDXM.updateWager({ bet: GlobalClass.betPerLine1(), denom: GlobalClass.trueCoinValue() });
        this._totalBetValue = GlobalClass.betPerLine1() * GlobalClass.trueCoinValue();
        this._totalBetTxt.text = `${GlobalClass.getXMLByKey(game, "totalbet")}: ${GlobalClass.getFormatCurrency(this._totalBetValue)}`;

        this.checkBnBet();
    };

    this.checkBnBet = function() {
        // Perbaikan untuk coin buttons
        if (GlobalClass.GAME_COIN_VALUE.length <= 1) {
            // Jika hanya ada 1 atau tidak ada coin value, disable semua button
            this.coinMinBtn.visible = false;
            this.coinMinBtnDisable.visible = true;
            this.coinPlusBtn.visible = false;
            this.coinPlusBtnDisable.visible = true;
        } else if (GlobalClass.GAME_COIN_POS == 0) {
            // Di posisi pertama, disable minus button
            this.coinMinBtn.visible = false;
            this.coinMinBtnDisable.visible = true;
            this.coinPlusBtn.visible = true;
            this.coinPlusBtnDisable.visible = false;
        } else if (GlobalClass.GAME_COIN_POS == GlobalClass.GAME_COIN_VALUE.length - 1) {
            // Di posisi terakhir, disable plus button
            this.coinMinBtn.visible = true;
            this.coinMinBtnDisable.visible = false;
            this.coinPlusBtn.visible = false;
            this.coinPlusBtnDisable.visible = true;
        } else {
            // Di posisi tengah, enable semua button
            this.coinMinBtn.visible = true;
            this.coinMinBtnDisable.visible = false;
            this.coinPlusBtn.visible = true;
            this.coinPlusBtnDisable.visible = false;
        }

        // Perbaikan untuk bet buttons
        if (GlobalClass.GAME_BET.length <= 1) {
            // Jika hanya ada 1 atau tidak ada bet value, disable semua button
            this.betMinBtn.visible = false;
            this.betMinBtnDisable.visible = true;
            this.betPlusBtn.visible = false;
            this.betPlusBtnDisable.visible = true;
        } else if (GlobalClass.GAME_BET_POS == 0) {
            // Di posisi pertama, disable minus button
            this.betMinBtn.visible = false;
            this.betMinBtnDisable.visible = true;
            this.betPlusBtn.visible = true;
            this.betPlusBtnDisable.visible = false;
        } else if (GlobalClass.GAME_BET_POS == GlobalClass.GAME_BET.length - 1) {
            // Di posisi terakhir, disable plus button
            this.betMinBtn.visible = true;
            this.betMinBtnDisable.visible = false;
            this.betPlusBtn.visible = false;
            this.betPlusBtnDisable.visible = true;
        } else {
            // Di posisi tengah, enable semua button
            this.betMinBtn.visible = true;
            this.betMinBtnDisable.visible = false;
            this.betPlusBtn.visible = true;
            this.betPlusBtnDisable.visible = false;
        }

        if (AppConstants.PDXM_BONUS_ACTIVE) {
            this.betMinBtn.visible = false;
            this.coinMinBtn.visible = false;
            this.betPlusBtn.visible = false;
            this.coinPlusBtn.visible = false;
            this.betMinBtnDisable.visible = true;
            this.coinMinBtnDisable.visible = true;
            this.betPlusBtnDisable.visible = true;
            this.coinPlusBtnDisable.visible = true;

            this._maxBetBtn.visible = false;
            this._maxBetBtnDisable.visible = true;

            this._autoSpinBtn.visible = false;
            this._autoSpinBtnDisable.visible = true;

            this._btnFreespins.visible = false;
        }
    }

    // MODE FEATURE
    this.setTotalWin = function(value) {
        this._totalWinTxt.text = GlobalClass.getFormatCurrency(value);
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

    this.changeLanguage = function() {
        this._coinValueFont.text = GlobalClass.getXMLByKey(game, "bottombetmultiplier");
        this._betFont.text = GlobalClass.getXMLByKey(game, "bottombet");

        this._balanceTxt.text = `${GlobalClass.getXMLByKey(game, "balance")}: ${GlobalClass.getFormatCurrency(this._balanceValue)}`;
        this._winTxt.text =  `${GlobalClass.getXMLByKey(game, "win")}: ${GlobalClass.getFormatCurrency(this._winValue)}`;
        this._totalBetTxt.text = `${GlobalClass.getXMLByKey(game, "totalbet")}: ${GlobalClass.getFormatCurrency(this._totalBetValue)}`;
        this._txtSessionBalance.text = `${GlobalClass.getXMLByKey(game, "session_balance")}`;
    };
}
