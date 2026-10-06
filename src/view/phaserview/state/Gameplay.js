var gameplayState = {
    _backgroundGroup: null,
    _backgroundClass: null,

    _reelGroup: null,
    _reelClass: null,



    _frameGroup: null,
    _frameClass: null,


    _logoGroup: null,
    _logoClass: null,

    _jackpotGroup: null,
    _jackpotClass: null,

    _buttonGroup: null,
    _buttonClass: null,

    _informationGroup: null,
    _informationClass: null,

    _bannerGroup: null,
    _bannerClass: null,



    _paytableGroup: null,
    _paytableClass: null,

    _historyGroup: null,
    _historyClass: null,

    _languageGroup: null,
    _languageClass: null,

    _optionGroup: null,
    _optionClass: null,

    _winScatter: null,
    __winScatterGroup: null,

    _transitionGroup: null,

    _orientationClass: null,
    _orientationGroup: null,


    _topGroup: null,

    // animation winning group
    _winGroup: null,
    _winLine: null,
    _winValue: null,
    _winFeature: null,

    _winValueGroup: null,

    // check spinning
    _finishSpinData: false,
    _finishSpinReel: false,

    // for winning animation
    _countWinSlot: 0,
    _totalIcon: 0,
    _animationLineNo: [],
    _animationTotalIcon: [],
    //_animationAllSlots: [],
    //_animationScatsPos: [],

    // for special game
    _gameCountWild: -1,
    _gameFreeLeft: 0,
    _gameFreeLeftSpecial: 0,
    _gameFreeTotal: 0,

    _now: 0,

    _featureSpecialRow: 0,
    _featureSpecialCol: 0,

    _getFreeGameLineWin: [],
    _getFreeGameStopCode: [],

    _firstFreeSpin: true,


    _randomWildReplace: null,

    _endlessMovie: null,

    _panelGroup: null,
    _bannerMaskX: 0,
    _bannerMaskY: 0,

    _timerSpacebar: null,

    _networkWin: null,

    _firstAnimation: 0,

    pdxmRound: false,

    preload: function () {
        // add group
        GlobalClass.GAME_ACTV_NAME = "gameplay";
        GlobalClass.GAME_ACTV = this;

        this._pixiContainer = this.game.add.group();

        this._gameBackgroundGroup = this.game.add.group();
        this._pixiContainer.addChild(this._gameBackgroundGroup);

        this._backgroundGroup = this.game.add.group();
        this._pixiContainer.addChild(this._backgroundGroup);

        this._panelGroup = this.game.add.group();
        this._pixiContainer.addChild(this._panelGroup);

        this._mainNetworkStateGroup = this.game.add.group();
        this._pixiContainer.addChild(this._mainNetworkStateGroup);


        this._frameGroup = this.game.add.group();
        this._panelGroup.addChild(this._frameGroup);
        this._winGroup = this.game.add.group();
        this._panelGroup.addChild(this._winGroup);
        this._reelGroup = this.game.add.group();
        this._panelGroup.addChild(this._reelGroup);
        this._jackpotGroup = this.game.add.group();
        this._panelGroup.addChild(this._jackpotGroup);
        this._logoGroup = this.game.add.group();
        this._panelGroup.addChild(this._logoGroup);
        this._informationGroup = this.game.add.group();
        this._panelGroup.addChild(this._informationGroup);
        this._buttonGroup = this.game.add.group();
        this._panelGroup.addChild(this._buttonGroup);
        this._winValueGroup = this.game.add.group();
        this._panelGroup.addChild(this._winValueGroup);
        this._bannerGroup = this.game.add.group();
        this._panelGroup.addChild(this._bannerGroup);
        this._paytableGroup = this.game.add.group();
        this._panelGroup.addChild(this._paytableGroup);
        this._betGroup = this.game.add.group();
        this._panelGroup.addChild(this._betGroup);
        this._historyGroup = this.game.add.group();
        this._panelGroup.addChild(this._historyGroup);
        this._languageGroup = this.game.add.group();
        this._panelGroup.addChild(this._languageGroup);
        this._optionGroup = this.game.add.group();
        this._panelGroup.addChild(this._optionGroup);
        this._transitionGroup = this.game.add.group();
        this._panelGroup.addChild(this._transitionGroup);
        this._orientationGroup = this.game.add.group();
        this._panelGroup.addChild(this._orientationGroup);
        this._tipWinGroup = this.game.add.group();
        this._panelGroup.addChild(this._tipWinGroup);
        this.topGroup = this.game.add.group();
        this._panelGroup.addChild(this.topGroup);

        this.networkStateGroup = this.game.add.group();
        this._mainNetworkStateGroup.addChild(this.networkStateGroup);
    
        this.blocksUIGroup = this.game.add.group();
        this.blocksUIGroup.visible = false;
        this._pixiContainer.addChild(this.blocksUIGroup);

        // add game rules
        GlobalClass.GAME_ENGINE = this.game;
        //GlobalClass.GAME_JUDGEMENT = new SlotsGameJudgement();
        GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
        //GlobalClass.GAME_REEL = clone(GlobalClass.REEL_NORMAL);
        this.game.load.start();
        // game.notify.event.removeListener("receiveMsgSolid");
        // game.notify.event.on("receiveMsgSolid", this.receiveMsgSolid, this);
    },


    reRender: function () {
        /*
        this.game.width = 1280;
        this.game.height = 720;
        var centerX = this.game.world.centerX;
        // if (!this.scale.isLandscape) {
        if (AppConstants.LANDSCAPE) {
            this.game.width = 720;
            this.game.height = 1280;
            var centerX = this.game.world.centerY;
        }

        var canvasHeight = window.innerHeight;//parseInt($(this.game.canvas).css("height").replace("px", ""));
        var canvasWidth = window.innerWidth;//parseInt($(this.game.canvas).css("width").replace("px", ""));
        var cc = parseInt($(this.game.canvas).css("height").replace("px", ""));

        // if (!this.scale.isLandscape) {
        if (AppConstants.LANDSCAPE) {
            cc = canvasHeight;
        }

        var currScale = canvasWidth / canvasHeight;
        var gameScale = this.game.width / this.game.height;

        if (currScale >= gameScale) {
            var scale = (this.game.width * canvasHeight) / (this.game.height * canvasWidth);
            this._panelGroup.x = centerX - this.game.width * scale / 2;
            this._panelGroup.y = 0;
            var grpX = this._panelGroup.x;
            this._bannerMaskX = -1 * grpX - 100;
            //console.log(currScale+"---"+scale);
            this._panelGroup.scale.set(scale, canvasHeight / cc);
        }
        else {
            var scale = currScale / gameScale;//canvasWidth/1280;//this.game.height / this.game.width * canvasWidth / canvasHeight;
            //var grpY = (1-scale)*canvasHeight/2*scale;
            //this._panelGroup.y = 0;//(canvasHeight-this.game.height * scale)/2;this.game.world.centerY - this.game.height * scale / 2-250;

            this._panelGroup.scale.set(1, scale);

            var y = (canvasHeight - canvasHeight * scale) / 2;
            this._panelGroup.y = y;
            var grpY = this._panelGroup.y;
            this._panelGroup.x = 0;
            this._bannerMaskY = grpY * -1 - 100;

        }
        */
    },
    create: function () {
        // if (this.game.device.desktop) {
        // 	this.gameBg = this.game.add.sprite(this.game.width/2, this.game.height/2, 'uiPanel', 'BG-crack1.jpg', this._gameBackgroundGroup);
        // 	this.gameBg.width = this.game.width;
        // 	this.gameBg.height = this.game.height;
        // 	this.gameBg.anchor.set(0.5, 0.5);
        // }
        /*
        var key = "WWW2120Bet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var bet = myLocalStorage.getItem(key);
        if (bet) {
            bet = parseInt(bet);
            if (bet > GlobalClass.GAME_BET.length - 1) {
                bet = GlobalClass.GAME_BET.length - 1;
                // myLocalStorage.setItem(key, bet);
            }
            GlobalClass.GAME_BET_POS = bet;
        }
        */

        this._backgroundClass = new backgroundClass(this.game, this._backgroundGroup);
        this._backgroundClass.create();

        this._frameClass = new frameClass(this.game, this._frameGroup);
        this._frameClass.create();

        this._reelClass = new reelClass(this.game, this._reelGroup);
        this._reelClass.create();

        this._logoClass = new logoClass(this.game, this._logoGroup);
        this._logoClass.create();

        this._jackpotClass = new jackpotClass(this.game, this._jackpotGroup);
        this._jackpotClass.create();

        // if (!AppConstants.MOBILE_GAME) {
        //     this._buttonClass = new buttonClass(this.game, this._buttonGroup);
        //     this._buttonClass.create();
        // } else {
            this._buttonClass = new buttonMobileClass(this.game, this._buttonGroup);
            this._buttonClass.create();
        // }

        this._informationClass = new informationClass(this.game, this._informationGroup);
        this._informationClass.create();

        this._topAreaClass = new topAreaClass(this.game, this.topGroup);
        this._topAreaClass.create();

        if (GlobalClass.DEMO) {
            this._txtValue = new PIXI.Text('Demo', {
                fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
                fontSize: "32px",
                fontWeight: "bolder",
                fill: "#85cc14",
                stroke: "#000000",
                strokeThickness: 6,
            });
            this._txtValue.anchor.set(0.0);
            this._txtValue.x = 20;
            this._txtValue.y = 20;
            this.topGroup.addChild(this._txtValue);
        }

        var self = this;
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32 && GlobalClass.CONFIG_SPACEBAR /* && AppConstants.CONTINUOUS_KEYBOARD */) {
                self.keyCheat();

                // if (AppConstants.CONTINUOUS_KEYBOARD) {
                //     this._timerSpacebar = game.time.events.loop(1000, self.keyCheat, this);
                // }
            }
        }

        document.onkeyup = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                AppConstants.SPACE_BAR_STATUS = 1;
            }

            // if (this._timerSpacebar != null) {
            //     game.time.events.remove(this._timerSpacebar);
            // }
        }

        GlobalClass.scaleScene(GlobalClass.GAME_PIXI.renderer, this._pixiContainer);
        this.checkResolution();

        // this.game.scale.addOrientationChange(this.checkResolution, this);
        // var self = this;
        // window.addEventListener("resize", function () {
            // self.checkResolution();
        // }, false);

        if (GlobalClass.GAME_UI_BLOCKED == 1) {
            this.blocksUI(1);
        }
        
        if (GlobalClass.GAME_FEATURE) {
            if(!GlobalClass.GAME_BUSY){
                // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_BUSY,{});
            }
            this.changeScreen(2);
        }
        else {
            soundClass.playBGM("soundreelspin");

            if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                if ((typeof(leanderGMApi) != "undefined")) {
                    leanderGMApi.publishEvent(leanderGMApi.publications.INITIALIZED);
                    leanderGMApi.publishEvent(leanderGMApi.publications.TOTALBET_UPDATED, GlobalClass.totalBet());
                    // leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                
                    this.setListenersPostMessages();
                }
            }

            if (GlobalClass.ONETOUCH_FREESPINS) {
                this.setFreeSpins();
            } else if (GlobalClass.ONETOUCH_PENDING_OFFERS.length > 0) {
                // this._buttonClass.pendingOffersEnable();
            }
        }

        if (AppConstants.PDX_ROUND_ID != "") {
            this._replayClass = new replayClass(this.game, this._optionGroup, this, GlobalClass.GAME_JUDGEMENT, 1);
            this._replayClass.create();
        }

        if (PIXI.sound.volumeAll == 0) {
            AppConstants.PDXM.toggleAction("mute", true);
        } else {
            AppConstants.PDXM.toggleAction("mute", false);
        }

        AppConstants.PDXM.onUpdateBalance = ({ newBalance }) => {
            try {
                GlobalClass.GAME_BALANCE = Number(newBalance);
                this._buttonClass.setBalance();
            } catch (err) {}
        };

        AppConstants.PDXM.onToggleAction = ({ action, newValue }) => {
            console.log("action = " + action + "  -  " + "newValue = " + newValue)
            switch (action) {
                case "mute":
                    if (newValue) {
                        PIXI.sound.volumeAll = 0;

                        if (this._optionClass != null) {
                            try {
                                this._optionClass.btnClick({ btnKey: "soundOFF" }, "true");
                            } catch (err) {}
                        }
                    } else {
                        PIXI.sound.volumeAll = 1;

                        if (this._optionClass != null) {
                            try {
                                this._optionClass.btnClick({ btnKey: "soundON" }, "true");
                            } catch (err) {}
                        }
                    }
                    
                    break;
                case "paytable":
                    if (newValue)  {
                        this.addPaytable();
                    } else {
                        if (this._paytableClass != null) {
                            this._paytableClass.closePage();
                        }
                    }
                    break;
                case "help":
                     if (newValue)  {
                        this.addPaytable();
                    } else {
                        if (this._paytableClass != null) {
                            this._paytableClass.closePage();
                        }
                    }
                    break;
                case "regulation":
                    if (newValue)  {
                        this.addPaytable();
                    } else {
                        if (this._paytableClass != null) {
                            this._paytableClass.closePage();
                        }
                    }
                    break;
            }
        };
    },

    setListenersPostMessages: function(){
        var that = this;
        if (window.addEventListener){
            window.addEventListener("message", function(event){ that.receivePostMessage(event); }, {passive: true});
        } else{
            window.attachEvent("onmessage", function(event){ that.receivePostMessage(event); });
        }
    },

    receivePostMessage: function(event){
        // Events from Casino
        // if (event.origin === this.windowCasinoOrigin || this.doNotValidateOrigin){
            if (event.data){
                try{
                    var messageJSON = JSON.parse(event.data);
    
                    if (messageJSON.msgId == "xc2rgMusicStatusChanged") {
                        if (messageJSON.status) {
                           
                        } else {
                            
                        }
                    }
    
                    if (messageJSON.msgId == "xc2rgSoundEffectsStatusChanged") {
                        if (messageJSON.status) {
                            PIXI.sound.volumeAll = 1;

                            if (this._optionClass != null) {
                                try {
                                    this._optionClass.btnClick("soundON");
                                } catch (err) {}
                            }
                        }  else {
                            PIXI.sound.volumeAll = 0;

                            if (this._optionClass != null) {
                                try {
                                    this._optionClass.btnClick("soundOFF");
                                } catch (err) {}
                            }
                        }
    
                        
                    }
                } catch(e){
                    // Do nothing
                    // Not readable message from the game
                }
            }
        // }
    
        return;
    },

    showFreeSpins: function() {
        this._freeSpins = new FreeSpins(this.game, this._bannerGroup, 0, GlobalClass.ONETOUCH_PENDING_OFFERS[0]);
        this._freeSpins.create();
    },

    showFreeSpinsFinish: function() {
        this._freeSpins = new FreeSpins(this.game, this._bannerGroup, 1, GlobalClass.GAME_JUDGEMENT.endedOffer);
        this._freeSpins.create();
    },

    acceptFreeSpins: function() {
        // last
        this._freeSpins.remove();
        this._buttonClass.pendingOffersDisable();

        GlobalClass.ONETOUCH_FREESPINS = true;
        GlobalClass.ONETOUCH_FREESPINS_DATA = data.additional_fields;

        // this.ONETOUCH_CONFIG_ID = data.config.id;
        GlobalClass.ONETOUCH_OFFER_ID = data.offer_id;

        GlobalClass.ONETOUCH_FREESPINS_LEFT = data.additional_fields.bets_left;

        const totalBet = data.additional_fields.bet_value;
        for (const coin of GlobalClass.GAME_COIN_VALUE) {
            const betSize = Math.floor(totalBet / coin);
            // const n1 = new bigDecimal(String(totalBet));
            // const n2 = new bigDecimal(String(coin));
            // const betSize = n1.multiply(n2);
            if (GlobalClass.GAME_BET_VALUE.indexOf(betSize) > -1) {
            // if (GlobalClass.GAME_BET_VALUE.indexOf(parseInt(betSize.value)) > -1) {
                GlobalClass.ONETOUCH_FREESPINS_COINVALUE = coin;
                break;
            }
        }

        GlobalClass.ONETOUCH_FREESPINS_BETCOIN = data.additional_fields.bet_value / GlobalClass.ONETOUCH_FREESPINS_COINVALUE;
        GlobalClass.ONETOUCH_FREESPINS_BETCURRENCY = data.additional_fields.bet_value;

        this.setFreeSpins();
    },

    setFreeSpins: function() {
        this._buttonClass.setFreeSpins();
        this._buttonClass.btnBetDisable();
    },

    checkResolution: function () {
        // this.reRender();
        if (GlobalClass.GAME_ROTATION == true) {
            // if (this.scale.isLandscape) {
            if (AppConstants.LANDSCAPE) {
                // $("#mode1").width(430);
                // $("#mode2").width(430);
                if (this._backgroundClass != null) {
                    this._backgroundClass.createLandscape();
                }

                if (this._reelClass != null) {
                    this._reelClass.createLandscape();
                }

                if (this._frameClass != null) {
                    this._frameClass.createLandscape();
                }

                if (this._logoClass != null) {
                    this._logoClass.createLandscape();
                }

                if (this._jackpotClass != null) {
                    this._jackpotClass.createLandscape();
                }

                if (this._informationClass != null) {
                    this._informationClass.createLandscape();
                }


                if (this._winLine != null) {
                    this._winLine.createLandscape();
                }
                if (this._winValue != null) {
                    this._winValue.createLandscape();
                }
                if (this._winScatter != null) {
                    this._winScatter.createLandscape();
                }
                if (this._winBanner != null) {
                    this._winBanner.createLandscape();
                }
                if (this._paytableClass != null) {
                    this._paytableClass.createLandscape();
                }
                if (this._optionClass != null) {
                    this._optionClass.createLandscape();
                }
                if (AppConstants.MOBILE_GAME) {
                    this._buttonClass.createLandscape();
                }

                if (this._historyClass != null) {
                    this._historyClass.createLandscape();
                }

                if (this._languageClass != null) {
                    this._languageClass.createLandscape();
                }

                if (this._freeSpins != null) {
                    this._freeSpins.createLandscape();
                }

                if (this._networkState !=null) {
                    this._networkState.createLandscape();
                }

                if (this._networkWin != null) {
                    this._networkWin.createLandscape();
                }

                if (this._topAreaClass != null) {
                    this._topAreaClass.createLandscape();
                }

                this.addFeatureSpinLeft(this._gameFreeLeft);
                this.addFeatureTotalWin();
            } else {
                // $("#mode1").width(100);
                // $("#mode2").width(100);
                if (this._backgroundClass != null) {
                    this._backgroundClass.createPortrait();
                }
                if (this._reelClass != null) {
                    this._reelClass.createPortrait();
                }
                if (this._frameClass != null) {
                    this._frameClass.createPortrait();
                }
                if (this._jackpotClass != null) {
                    this._jackpotClass.createPortrait();
                }

                if (this._informationClass != null) {
                    this._informationClass.createPortrait();
                }
                if (this._logoClass != null) {
                    this._logoClass.createPortrait();
                }
               
                if (AppConstants.MOBILE_GAME) {
                    this._buttonClass.createPortrait();
                }

                if (this._winLine != null) {
                    this._winLine.createPortrait();
                }
                if (this._winValue != null) {
                    this._winValue.createPortrait();
                }
                if (this._winScatter != null) {
                    this._winScatter.createPortrait();
                }
                if (this._winBanner != null) {
                    this._winBanner.createPortrait();
                }
                if (this._paytableClass != null) {
                    this._paytableClass.createPortrait();
                }
                if (this._historyClass != null) {
                    this._historyClass.createPortrait();
                }

                if (this._languageClass != null) {
                    this._languageClass.createPortrait();
                }

                if (this._freeSpins != null) {
                    this._freeSpins.createPortrait();
                }


                if (this._optionClass != null) {
                    this._optionClass.createPortrait();
                }

                if (this._networkState!=null) {
                    this._networkState.createPortrait();
                }

                if (this._networkWin != null) {
                    this._networkWin.createPortrait();
                }

                if (this._topAreaClass != null) {
                    this._topAreaClass.createPortrait();
                }

                this.addFeatureSpinLeft(this._gameFreeLeft);
                this.addFeatureTotalWin();
            }
        }
    },

    keyCheat: function (data, type) {
        if(GlobalClass.GAME_UI_BLOCKED != 0){
            return;
        }

        if(AppConstants.SPACE_BAR_STATUS == 0){
            return;
        }

        if(GlobalClass.GAME_OPTION) {
            return;
        }

        if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_IDLE || GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL) {
            if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                this.checkFreeGames(true);
            }
            else {
                this.startSpin(true);
            }
        }
        else if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_SKIP_DYNAMITE) {
            if (this._winScatter != null) {
                this._winScatter.endBomFun();
            }
        }
        if(!AppConstants.CONTINUOUS_KEYBOARD){
            AppConstants.SPACE_BAR_STATUS = 0;
        }
        
    },

    // ~~~~~~~~~~ ~~~~~~~~~~ start ~~~~~~~~~~ ~~~~~~~~~~
    // Public function from ButtonClass
    // ~~~~~~~~~~ ~~~~~~~~~~ ~~~~~ ~~~~~~~~~~ ~~~~~~~~~~
    isStartSpin: false,
    startSpin: async function (useCoin) {
        // console.warn("~~~~~~~~~~TIME start:~~~~~~~~~~")
        // console.time();

        this._firstAnimation = 0;

        if (GlobalClass.ONETOUCH_FREESPINS) {
            useCoin = false;
            
            if (!GlobalClass.GAME_BUSY) {
                GlobalClass.GAME_BUSY = true;
                // game.notify.event.emit("sentMsgSolid", MessageSolidEvent.GAME_BUSY, {});
            }
    
            GlobalClass.ONETOUCH_FREESPINS_LEFT--;
            this._buttonClass.setFreeSpins();
        }

        this._buttonClass.hideValueFrame();
        TweenMax.killAll(false, true, false, false);
        this.isStartSpin = true;
        this._featureSpecialCol = 0;
        this._featureSpecialRow = 0;
        
        if (useCoin) {
            /*
            if (AppConstants.ACTIVE_OTFETM) {
                let bet = GlobalClass.betPerLine1() * GlobalClass.trueCoinValue();
                let minBet = AppConstants.conf.betSizes[0] * AppConstants.conf.coinValues[0];
                let isMinBet = bet <= minBet ? true : false;
                if (!OTFEIM.realityCheckBetValidation(bet, isMinBet)) {
                    // not enough credit
                    GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
                    this.cleanScreen();

                    GlobalClass.CONFIG_AUTO_REMAINING = 0;

                    this._buttonClass.useAutoSpin();
                    this._buttonClass.setButton();
                    return;
                }
            }
            */

            if (!navigator.onLine && AppConstants.PDX_ROUND_ID == "") {
                // this.showNetworkWin("nointernet");

                const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
                    source: "SPIN",
                    error: "CONNECTION ERROR",
                    debug: true
                });

                if (pdxmInstruction?.errorType == "N/A") {
                    switch(pdxmInstruction.errorAction) {
                        case "RESET":

                            break;
                        case "RECALL":
                            this.startSpin(useCoin);
                            break;
                        case "IGNORE":

                            break;
                    }
                } else {
                    AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, ["nointernet", pdxmInstruction, () => {this.startSpin(useCoin)}]);
                }
                return;
            }

            if (AppConstants.PDX_ROUND_ID != "") {
                if (GlobalClass.REPLAY) {
                    return;
                }
    
                GlobalClass.REPLAY = true;
            }

            if (!GlobalClass.GAME_BUSY) {
                GlobalClass.GAME_BUSY = true;
                // game.notify.event.emit("sentMsgSolid", MessageSolidEvent.GAME_BUSY, {});
            }

            this.cleanScreen();
            this._getFreeGameLineWin = null;
            this._getFreeGameStopCode = null;

            if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                if ((typeof(leanderGMApi) != "undefined")) {
                    leanderGMApi.publishEvent(leanderGMApi.publications.TOTALBET_UPDATED, GlobalClass.totalBet());
                    leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameOpenPlay")
                }
            }

            // if (GlobalClass.GAME_BALANCE >= GlobalClass.totalBet()) {
                //if(GlobalClass.networkState == 1){
                    // GlobalClass.GAME_BALANCE -= GlobalClass.totalBet();
                    /*
                    const n1 = new bigDecimal(GlobalClass.GAME_BALANCE);
                    const n2 = new bigDecimal(GlobalClass.totalBet());
                    const balance = n1.subtract(n2);
                    GlobalClass.GAME_BALANCE = Number(balance.value);
                    */
                //}
                
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_SPIN;
                this.cleanScreen();

                if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                    GlobalClass.CONFIG_AUTO_REMAINING--;

                    this._buttonClass.useAutoSpin();
                }

                // this._scrollClass.setListener(false);

                this._informationClass.setText("spin");

                this._finishSpinData = false;
                this._finishSpinReel = false;

                this.reloadReel();
                this.startRoundDuration();
                this._buttonClass.setButton();
                // this._buttonClass.setBalance();
                // this._buttonClass.setSessionBalance(GlobalClass.totalBet(), "-");
                this._buttonClass.setWinValue(0);
                this._reelClass.startSpin();

                // ===============================
                // NORMAL MODE (PDXM FLOW)
                // ===============================
                // 1️⃣ Notify PDXM
                this.pdxmRound = true;
                AppConstants.PDXM_SPIN = true;
                AppConstants.PDXM.startSpin();
                // 2️⃣ WAIT setBonusInfo (IMPORTANT)
                // await AppConstants.PDXM.waitBonusInfo();
                // 3️⃣ AFTER bonus info confirmed
                const isFreeSpin = AppConstants.PDXM.isFreeSpinActive();
                const freeSpinFeature = AppConstants.PDXM.getFreeSpinParam();

                if (!isFreeSpin) { 
                    if (GlobalClass.GAME_BALANCE >= GlobalClass.totalBet()) {
                        const n1 = new bigDecimal(GlobalClass.GAME_BALANCE);
                        const n2 = new bigDecimal(GlobalClass.totalBet());
                        const balance = n1.subtract(n2);
                        GlobalClass.GAME_BALANCE = Number(balance.value);

                        this._buttonClass.setBalance();
                        this._buttonClass.setSessionBalance(GlobalClass.totalBet(), "-");
                    }
                }

                if (freeSpinFeature) {
                    AppFacadeInstance.sendNotification(SlotsEvents.LOAD_SPIN_DATA, freeSpinFeature);
                } else {
                    AppFacadeInstance.sendNotification(SlotsEvents.LOAD_SPIN_DATA);
                }
                
            /*
            } else {
                // not enough credit

                if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                    if ((typeof(leanderGMApi) != "undefined")) {
                        leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                    }
                }

                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
                this.cleanScreen();

                GlobalClass.CONFIG_AUTO_REMAINING = 0;

                this._buttonClass.useAutoSpin();
                this._buttonClass.setButton();

                // this._scrollClass.setListener(true);

                this._informationClass.setText("nocoin");
                this._informationClass.setText("idle");
            }
            */
        } else {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_SPIN;
            this.cleanScreen();

            // this._scrollClass.setListener(false);

            if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                this._informationClass.setText("freegames");
            } else {
                this._informationClass.setText("spin");
            }

            this._finishSpinData = false;
            this._finishSpinReel = false;

            this.reloadReel();
            this.startRoundDuration();
            this._buttonClass.setButton();
            this._buttonClass.setWinValue(0);
            this._reelClass.startSpin();
            AppFacadeInstance.sendNotification(SlotsEvents.LOAD_SPIN_DATA);
        }
    },

    noCoin: function() {
        if (AppConstants.PDXM_SPIN) {
            AppConstants.PDXM_SPIN = false;

            if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                if ((typeof(leanderGMApi) != "undefined")) {
                    leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                }
            }

            TweenMax.killAll(false, true, false, false);
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
            this.cleanScreen();
            this.reloadReel();

            GlobalClass.CONFIG_AUTO_REMAINING = 0;

            this._buttonClass.useAutoSpin();
            this._buttonClass.setButton();

            this._informationClass.setText("nocoin");
            this._informationClass.setText("idle");
        }
    },

    startRoundDuration: function() {
        GlobalClass.GAME_DURATION_FINISH = false;

        if (AppConstants.ROUND_DURATION > 0) {
            GlobalClass.GAME_DURATION = (AppConstants.ROUND_DURATION * 1000);
        } else {
            GlobalClass.GAME_DURATION = 1;
        }

        GlobalClass.GAME_DURATION_TIMER = game.time.events.loop(100, this.setRoundDuration, this);
    },

    setRoundDuration: function() {
        GlobalClass.GAME_DURATION -= 100;

        if (GlobalClass.GAME_DURATION < 0) {
            GlobalClass.GAME_DURATION = 0;
            GlobalClass.GAME_DURATION_FINISH = true;

            if (GlobalClass.GAME_DURATION_TIMER != null) {
                game.time.events.remove(GlobalClass.GAME_DURATION_TIMER);
                GlobalClass.GAME_DURATION_TIMER = null;
            }
        }
    },

    finishSpinReel: function () {
        if (this._finishSpinReel) {
            return;
        }
        this._finishSpinReel = true;
        this.checkSpin();
    },

    finishSpinData: function (check) {
        if (this._finishSpinData) {
            return;
        }

        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL && GlobalClass.GAME_FEATURE && GlobalClass.GAME_DATA.normal2Feature){
            GlobalClass.GAME_BUSY = false;
        }

        const coinValue = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        const betSize = GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS];
        const totalBet = betSize * coinValue
        // game.notify.event.emit("sentMsgSolid","FEIM.send.betUpdate",totalBet);
        if (!GlobalClass.GAME_ACTIVE) {
            // game.notify.event.emit("sentMsgSolid", "OTFEIM.addWin", GlobalClass.GAME_DATA.roundWinCredits);
        }

        //this._buttonClass.setBalance();
        gameplayState._updatedJackpotValue = true;
        GlobalClass.SPECIAL_FRAMES = GlobalClass.GAME_DATA.specialFrame;
        this._finishSpinData = true;
        GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_STOP;
        this._buttonClass.setButton();
        this.checkSpin();
    },

    checkSpin: function () {
        if (this._finishSpinData && this._finishSpinReel) {
            this.reelPrepareStop();
        }
    },

    reelPrepareStop: function () {
        this._reelClass.prepareStop();
    },

    stopAnimation: function () {
        TweenMax.killAll(false, true, false, false);
        this.cleanScreen();
        this.reloadReel();
        this.checkWinSpin();
    },

    cleanScreen: function () {

        //TweenMax.killAll(false, true, false, false);
        this._jackpotClass.removeFX();
        this._jackpotClass._sequenceRunning = false;

        if (this._timerFunc != null) {
            this.game.time.events.remove(this._timerFunc);
        }

        if (this._winScatter != null) {
            this._winScatter.remove();
            this._winScatter = null;
        }

        if (this._winBanner != null) {
            this._winBanner.destroyWinning();
            this._winBanner = null;
        }

        if (this._winLine != null) {
            this._winLine.remove();
            this._winLine = null;
        }

        if (this._winValue != null) {
            this._winValue.remove();
        }

    },

    reloadReel: function () {
        this._reelClass.reloadReel();
    },

    // ~~~~~~~~~~ ~~~~~~~~~~ start ~~~~~~~~~~ ~~~~~~~~~~
    // CheckWinSpin & Animation Symbol
    // ~~~~~~~~~~ ~~~~~~~~~~ ~~~~~ ~~~~~~~~~~ ~~~~~~~~~~
    checkWinSpin: function () {
        // console.warn("~~~~~~~~~~TIME end:~~~~~~~~~~")
        // console.timeEnd();

        TweenMax.killAll(false, true, false, false);
        GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_ALL;
        this._buttonClass.setButton();
        //soundClass.stopSoundReel();
        if (GlobalClass.GAME_DATA.jackpotState.winAmount > 0) {
            this._jackpotClass.updateValue(-1);
        }
        else {
            this._jackpotClass.updateValue();
        }

        //this._buttonClass.startOrStopGear(false);

        if (this._tipWinClass != null) {
            this._tipWinClass.changeFreeSpins();
        }

        GlobalClass.GAME_DATA.awardSymbols = this._reelClass._picaSymbols;
        this.addJackpotLines();

        if (!GlobalClass.GAME_DATA.awardSymbols || GlobalClass.GAME_DATA.awardSymbols.length <= 0) {
            this._backgroundClass.changeBackgroundImage(true);
        }


        if (GlobalClass.GAME_DATA.totalWin <= 0 && !GlobalClass.GAME_DATA.scWin) {
            
            //game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});
            this.checkAutoPlay();
            if (GlobalClass.GAME_DATA.awardSymbols && GlobalClass.GAME_DATA.awardSymbols.length > 0) {
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_SKIP_DYNAMITE;
                this._buttonClass.setButton();
                this._winScatter = new winscatterClass(this.game, this._bannerGroup);
                this._winScatter.create(0, 2);
            }
            else {
                this.gameFinish(1);
            }

            if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL) {
                if (GlobalClass.GAME_DATA.normal2Feature) {
                    this._informationClass.setText("empty");
                } else {
                    this._informationClass.setText("nowin");
                }
            }

            // game.notify.event.emit("sentMsgSolid","FEIM.send.balanceUpdate");
        } else {
            if (GlobalClass.GAME_DATA.scWin && GlobalClass.GAME_DATA.scWin.scatterPos.length > 0) {
                for (var i = 0; i < GlobalClass.GAME_DATA.scWin.scatterPos.length; i++) {
                    var scatter = GlobalClass.GAME_DATA.scWin.scatterPos[i];
                    gameplayState._reelClass.setAnimation(scatter.col, scatter.row, false);
                }
            }

            this.doAnimationAll();
            this.checkAutoPlay();
        }
    },
    // Jackpot lines join the end-of-spin line display (tom 2026-10-05: "show the jackpot lines at the end of a spin
    // with other lines"). A jackpot is a 5 of a kind on a lit line; the server reports it apart from the line wins,
    // so it was never drawn. Each won jackpot's line is added once (skipped when that line is already listed).
    addJackpotLines: function () {
        var d = GlobalClass.GAME_DATA;
        if (!d || d._jackpotLinesAdded || !d.jackpotState || !d.jackpotState.wonJackpots || !d.jackpotState.wonJackpots.length) return;
        d._jackpotLinesAdded = true;
        if (!d.lineWin) d.lineWin = { lineWins: [] };
        var lines = d.lineWin.lineWins, have = {};
        lines.forEach(function (l) { have[l.lineNo] = l; });
        var lineFromPositions = function (pos) {           // [[col,row], ...] -> index into WIN_LINE
            if (!pos || !pos.length || !Array.isArray(pos[0])) return -1;
            for (var n = 0; n < GlobalClass.WIN_LINE.length; n++) {
                var ok = true;
                for (var k = 0; k < pos.length && ok; k++) ok = GlobalClass.WIN_LINE[n][pos[k][0]] == pos[k][1];
                if (ok) return n;
            }
            return -1;
        };
        d.jackpotState.wonJackpots.forEach(function (j) {
            var no = lineFromPositions(j.positions);
            if (no < 0) no = j.lineNo;
            if (no == null || !GlobalClass.WIN_LINE[no]) return;
            var amt = j.winAmountInDollar != null ? j.winAmountInDollar : j.winAmount;
            if (have[no]) {                                   // the line also paid normally: show both
                if (!have[no].jackpot) { have[no].jackpot = j.name; have[no].jackpotAmount = amt; }
                return;
            }
            have[no] = lines[lines.push({ lineNo: no, winAmount: 0, numOfSymbols: j.numberOfSymbbols || 5,
                winningSymbol: j.winningSymbol, jackpot: j.name, jackpotAmount: amt }) - 1];
        });
    },
    doAnimationAll: function () {
        this.cleanScreen();
        this._now = new Date().getTime();
        soundClass.pauseBGM();
        
        //game.notify.event.emit("sentMsgSolid",MessageSolidEvent.GAME_NOT_BUSY,{});
        if (GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet() * 7) { // normal win
            this._winLine = new winlineClass(this.game, this._winGroup);
            this._winLine.createMulti();
            this._informationClass.setText("win", 1);
            //this._now = -1;
            if (GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet()) {
                soundClass.playSound("soundwin");
            } else {
                soundClass.playSound("soundwinsmall");
            }
            this._time = 3000;
            if (GlobalClass.GAME_DATA.lineWin && GlobalClass.GAME_DATA.lineWin.lineWins.length > 0) {
                this._time = GlobalClass.GAME_DATA.lineWin.lineWins.length * 850;
            }
            this._winValue = new winvalueClass(this.game, this._winValueGroup);
            this._winValue.create(GlobalClass.GAME_TOTAL_WIN, null, this._time);

            this._timerFunc = this.game.time.events.add(this._time + 200, this.showPicASymbol, this);
        }
        else if (GlobalClass.GAME_TOTAL_WIN >= GlobalClass.totalBet() * 7 && GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet() * 13) { // big win
            this._winLine = new winlineClass(this.game, this._winGroup);
            this._winLine.createMulti();
            this._informationClass.setText("win", 2);
            soundClass.playSound("soundwinbig");
            this._timerFunc = this.game.time.events.add(500, this.addBannerResult, this, 1, GlobalClass.GAME_TOTAL_WIN);
        } else if (GlobalClass.GAME_TOTAL_WIN >= GlobalClass.totalBet() * 13 && GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet() * 25) { // huge win
            this._winLine = new winlineClass(this.game, this._winGroup);
            this._winLine.createMulti();
            this._informationClass.setText("win", 3);
            soundClass.playSound("soundwinhuge");
            this._timerFunc = this.game.time.events.add(500, this.addBannerResult, this, 2, GlobalClass.GAME_TOTAL_WIN);
        } else if (GlobalClass.GAME_TOTAL_WIN >= GlobalClass.totalBet() * 25) { // massive win
            this._informationClass.setText("win", 4);
            soundClass.playSound("soundwinmassive");
            this._timerFunc = this.game.time.events.add(500, this.addBannerResult, this, 3, GlobalClass.GAME_TOTAL_WIN);
        }
    },

    showPicASymbol: function () {
        if (GlobalClass.GAME_DATA.awardSymbols && GlobalClass.GAME_DATA.awardSymbols.length > 0) {
            this._buttonClass.setWinValue(GlobalClass.GAME_DATA.totalWin);
            
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_SKIP_DYNAMITE;
            this._buttonClass.setButton();
            this._winScatter = new winscatterClass(this.game, this._bannerGroup);
            this._winScatter.create(0, 3);
        }
        else {
            this.checkJackpot();
        }
    },
    checkJackpot: function () {
        if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_SKIP_DYNAMITE) {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_ALL;
            this._buttonClass.setButton();
        }
        
        if (GlobalClass.GAME_DATA.jackpotState.wonJackpots.length > 0) {
            if (this._jackpotClass._sequenceRunning) return;    // already presenting (tom 2026-10-05: jackpot played twice)
            this._jackpotClass._sequenceRunning = true;
            this._informationClass.setText("win", 5);
            this._jackpotClass.showFX();
        }
        else {
            //   if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            // 	soundClass.resumeBGM();
            //   }
            this.startAnimationSymbol();      
            
        }
    },
    startAnimationSymbol: async function () {
        this._buttonClass.setBalance();
        this._buttonClass.setWinValue(GlobalClass.GAME_DATA.totalWin);

        if (this._firstAnimation == 0) {
            this._buttonClass.setSessionBalance(GlobalClass.GAME_DATA.totalWin, "+");
        }
        // game.notify.event.emit("sentMsgSolid","FEIM.send.balanceUpdate");
        // game.notify.event.emit("sentMsgSolid","FEIM.send.winUpdate",{win:GlobalClass.GAME_DATA.totalWin*100});

        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
            this.addFeatureTotalWin();
        }

        if (this._now > 0) {
            var st = this._time - 12000;
            if (st > 0) {
                this._now = -1;
                this._timerFunc = this.game.time.events.add(st + 100, this.startAnimationSymbol, this);
                return;
            }
        }
        soundClass.resumeBGM();
        if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL && GlobalClass.GAME_FEATURE && GlobalClass.GAME_DATA.normal2Feature) {
            if (GlobalClass.GAME_DATA.lineWin) {
                this._getFreeGameLineWin = GlobalClass.GAME_DATA.lineWin.lineWins;
            }
            else {
                this._getFreeGameLineWin = [];
            }
            this._getFreeGameStopCode = GlobalClass.GAME_STOPCODE;
            this.gameFinish(2);
        }
        else {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL;

            this._firstAnimation++;
            if (this._firstAnimation == 1) {
                if (!GlobalClass.GAME_FEATURE && !GlobalClass.GAME_DATA.normal2Feature) {
                    if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                        if ((typeof(leanderGMApi) != "undefined")) {
                            leanderGMApi.publishEvent(leanderGMApi.publications.TOTALWIN_UPDATED, GlobalClass.GAME_DATA.totalWin);
                            leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                        }
                    }

                    if (this.pdxmRound) {
                        this.pdxmRound = false;

                        await AppConstants.PDXM.animationComplete();
                        await Promise.resolve();
                        const isActive = AppConstants.PDXM.isFreeSpinActive();
                        AppConstants.PDXM_BONUS_ACTIVE = isActive;
                    }
                    
                }
            }

            this._buttonClass.setButton();
            this._countWinSlot = 0;
            this.checkAnimationSymbol();
        }
    },

    checkAnimationSymbol: function () {
        if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_FREE_END || GlobalClass.GAME_UI_BLOCKED == 2) {
            return;
        }

        // if(GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet()){
        //     this.gameFinish(2);
        //     return;
        // }

        if (GlobalClass.GAME_DATA.lineWin && GlobalClass.GAME_DATA.lineWin.lineWins.length > this._countWinSlot) {
            this.doAnimationSymbol(this._countWinSlot, 1);
        }
        else if (GlobalClass.GAME_DATA.scWin && GlobalClass.GAME_DATA.scWin.scatterPos.length) {
            this.doAnimationScatterSymbol();
        }
        else {
            this.gameFinish(2);
        }
    },
    doAnimationSymbol: function (value, type) {
        this._countWinSlot++;
        var line = null;
        if (type == 1) {
            line = GlobalClass.GAME_DATA.lineWin.lineWins[value];
        }
        else {
            line = this._getFreeGameLineWin[value];
        }
        var winLine = line.lineNo + 1;
        var winValue = line.winAmount;
        var symbolType = line.winningSymbol;

        this.cleanScreen();

        this._buttonClass.setButton();

        this._winLine = new winlineClass(this.game, this._winGroup);
        this._winLine.create(line);

        if (type == 1) {
            this._timerFunc = this.game.time.events.add(1800, this.checkAnimationSymbol, this);
        }
        else {
            //this._timerFunc = this.game.time.events.add(1800, this.checkFreeAnimationSymbol, this);
        }
        this._informationClass.setText("result", winLine, winValue, symbolType, line.numOfSymbols, line);

    },
    doAnimationScatterSymbol: function () {
        this.cleanScreen();
        this._buttonClass.setButton();

        var symbolType = 'Scatter';
        var winValue = GlobalClass.GAME_DATA.scWin.winAmount;
        var symbolTotal = GlobalClass.GAME_DATA.scWin.numOfScatter;
        if (GlobalClass.GAME_DATA.scWin && GlobalClass.GAME_DATA.scWin.scatterPos.length > 0) {
            for (var i = 0; i < GlobalClass.GAME_DATA.scWin.scatterPos.length; i++) {
                var scatter = GlobalClass.GAME_DATA.scWin.scatterPos[i];
                gameplayState._reelClass.setAnimation(scatter.col, scatter.row, false);
                symbolType = scatter.symId;
            }
        }
        this._timerFunc = this.game.time.events.add(3000, this.gameFinish, this, 2);
        this._informationClass.setText("result", 0, winValue, symbolType, symbolTotal);
    },


    gameFinish: async function (type) {
        // if (GlobalClass.GAME_UI_BLOCKED == 1) {
        //     this.blocksUI(1);
        // }
        /* type:
         * 1. No Win - Normal
         * 2. Win - Normal
         * 3. Go Back to Normal After Feature
         */
        this.cleanScreen();
        switch (type) {
            case 1: // no win
                this._buttonClass.setBalance();
                if (GlobalClass.GAME_FEATURE && GlobalClass.GAME_DATA.normal2Feature) { // feature
                    this.addScatterResult();
                }
                else if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) { // feature
                    this.checkFreeGames();
                } else { // normal
                    GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;

                    if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                        if ((typeof(leanderGMApi) != "undefined")) {
                            leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                        }
                    }

                    if (this.pdxmRound) {
                        this.pdxmRound = false;

                        await AppConstants.PDXM.animationComplete();
                        await Promise.resolve();
                        const isActive = AppConstants.PDXM.isFreeSpinActive();
                        AppConstants.PDXM_BONUS_ACTIVE = isActive;
                    }
                    


                    this._buttonClass.setButton();
                    this._informationClass.setText("nowin");
                    this._informationClass.setText("idle");
                    if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                        this.startSpin(true);
                    } else { // game finish

                    }

                    if (AppConstants.PDX_ROUND_ID != "") {
                        this._replayClass.showFinish();
                    }
                }
                break;
            case 2:
                if (GlobalClass.GAME_FEATURE && GlobalClass.GAME_DATA.normal2Feature) { // feature
                    this.addScatterResult();
                } else if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    if (GlobalClass.GAME_DATA.freeGamesWon > 0) {
                        this.addScatterResult();
                    } else {
                        this.checkFreeGames();
                    }
                } else {
                    
                    if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                        this.startSpin(true);
                    } else {
                        if (this.pdxmRound) {
                            this.pdxmRound = false;

                            await AppConstants.PDXM.animationComplete();
                            await Promise.resolve();
                            const isActive = AppConstants.PDXM.isFreeSpinActive();
                            AppConstants.PDXM_BONUS_ACTIVE = isActive;
                        };

                        if (AppConstants.PDX_ROUND_ID != "") {
                            this._replayClass.showFinish();
                        } else {
                            // if(GlobalClass.GAME_TOTAL_WIN >= GlobalClass.totalBet()){
                            this.startAnimationSymbol();
                            // }
                        }
                    }
                }
                break;
            case 3: // Go Back to Normal After Feature
                if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                    this.startSpin(true);
                } else {
                    GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
                    
                    if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                        if ((typeof(leanderGMApi) != "undefined")) {
                            leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                        }
                    }

                    if (this.pdxmRound) {
                        this.pdxmRound = false;

                        await AppConstants.PDXM.animationComplete();
                        await Promise.resolve();
                        const isActive = AppConstants.PDXM.isFreeSpinActive();
                        AppConstants.PDXM_BONUS_ACTIVE = isActive;
                    }



                    this._buttonClass.setButton();
                    // this._scrollClass.setListener(true);

                    this._informationClass.setText("empty");
                    this._informationClass.setText("idle");

                    if (AppConstants.PDX_ROUND_ID != "") {
                        this._replayClass.showFinish();
                    }
                }
                break;
            case 4:
                if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
                    this.startSpin(true);
                } else {
                    this.startNormalGames();
                }
                break;
        }
    },

    checkAutoPlay: function () {
        if (GlobalClass.CONFIG_AUTO_ANYWIN_ACTIVE) {
            this._buttonClass.stopAutoPlay();
        } else if (GlobalClass.CONFIG_AUTO_FREESPIN_ACTIVE) {
            if (GlobalClass.GAME_DATA.normal2Feature) {
                this._buttonClass.stopAutoPlay();
            }
        } else if (GlobalClass.CONFIG_AUTO_SINGLE_ACTIVE) {
            if (GlobalClass.GAME_DATA.totalWin * GlobalClass.trueCoinValue() >= GlobalClass.CONFIG_AUTO_SINGLE_VALUE) {
                this._buttonClass.stopAutoPlay();
            }
        } else if (GlobalClass.CONFIG_AUTO_INCREASE_ACTIVE) {
            if (GlobalClass.AUTO_PLAY_BALANCE + GlobalClass.CONFIG_AUTO_INCREASE_VALUE <= GlobalClass.GAME_BALANCE) {
                this._buttonClass.stopAutoPlay();
            }
        } else if (GlobalClass.CONFIG_AUTO_DECREASE_ACTIVE) {
            if (GlobalClass.AUTO_PLAY_BALANCE - GlobalClass.CONFIG_AUTO_DECREASE_VALUE >= GlobalClass.GAME_BALANCE) {
                this._buttonClass.stopAutoPlay();
            }
        }
    },

    addBannerResult: function (type, value) {

        this._buttonClass.disableOption();
        this._winBanner = new bannerClass(this.game, this._bannerGroup);
        this._winBanner.create(type, value);
    },

    addScatterResult: function () {

        this._winScatter = new winscatterClass(this.game, this._bannerGroup);
        this._winScatter.create(GlobalClass.GAME_DATA.freeGamesWon, 1);

    },

    loadHistory: function () {
        AppFacadeInstance.sendNotification(SlotsEvents.LOAD_HISTORY_DATA);
    },

    showHistory: function (data) {
        if (GlobalClass.GAME_ACTV_NAME == "intro") {
            introState.showHistory(data);
        } else if (GlobalClass.GAME_ACTV_NAME == "gameplay") {
            this._historyClass = new historyClass(this.game, this._historyGroup, data);
            this._historyClass.create();
        }
    },

    openLangWindow: function (data) {
        this._languageClass = new languageClass(this.game, this._historyGroup, data);
        this._languageClass.create();
    },

    addPaytable: function () {
        if (this._paytableClass == null) {
            this._paytableClass = new paytableClass(this.game, this._paytableGroup);
            this._paytableClass.create();
        }
    },

    adddBetScreen: function() {
        this._betClass = new betClass(this.game, this._betGroup);
        this._betClass.create();
    },

    showNetworkWin: function (data) {
        this.noCoin();
        
        if (GlobalClass.GAME_ACTV_NAME == "preload") {
            preloaderState.showNetworkWin(data);
        } else if (GlobalClass.GAME_ACTV_NAME == "intro") {
            introState.showNetworkWin(data);
        } else {
            if (this._networkWin == null) {
                this._networkWin = new networkWinClass(this.game, this, this._optionGroup, data, false);
                this._networkWin.create();
            }
        }
    },

    showNetworkState: function (data) {
        if(!AppConstants.SHOW_CONNECTION){
            return;
        }
        /*
        if (AppConstants.ACTIVE_OTFETM) {
            return;
        }
        */
        if(data.rtt>500){
            if(this._networkState==null){
                this._networkState = new networkStateClass(this.game, this.networkStateGroup);
                this._networkState.create();
            }
        }
        else{
            if(this._networkState!=null){
                this._networkState.close();
            }
        }
    },

    addOption: function () {
        //this.showNetworkState({rtt:600});

        //this.addBannerResult(6,0);

        this._optionClass = new optionClass(this.game, this._optionGroup);
        this._optionClass.create();

        // this._winScatter = new winscatterClass(this.game, this._bannerGroup);
        // this._winScatter.create(5,1);

        // GlobalClass.GAME_DATA.jackpotState.wonJackpots = [];
        // var obj = {};
        // obj.name = "grand";
        // obj.winAmountInDollar = 10;
        // obj.winAmount = 100;
        // obj.lineNo = 2;
        // obj.numberOfSymbbols = 5;


        // GlobalClass.GAME_DATA.jackpotState.wonJackpots.push(obj);

        // var obj = {};
        // obj.name = "mini";
        // obj.winAmountInDollar = 10;
        // obj.winAmount = 100;

        // GlobalClass.GAME_DATA.jackpotState.wonJackpots.push(obj);
        // this._jackpotClass._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
        // this._jackpotClass.showFX();

        //this.addBannerResult(1,200);
    },

    addFeatureTotalWin: function () {
        GlobalClass.TOTAL_WIN = GlobalClass.GAME_DATA.freeGamesTotalWin; // --> ??
        this._buttonClass.setTotalWin(GlobalClass.GAME_DATA.freeGamesTotalWin);
    },

    addFeatureSpinLeft: function (value) {
        this._buttonClass.setSpinLeft(value);
        //this._frameClass.updateFreeSpin(value);
    },

    changeScreen: async function (type) { //1-->101 to normal game;2-->102 to free game
        var tweenReel;
        var tweenShadow;
        var tweenFrame;
        var tweenLogo;
        var tweenScroll;
        var tweenBotton;
        var tweenInformation;
        var tweenFramefrontBackgroundGroup;
        this.isCanShowLine = false;
        switch (type) {
            case 2:
                if (GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                    this.checkFreeGames();
                    return;
                }

                GlobalClass.GAME_BUSY = false;
                this.lockScreen(true);
                GlobalClass.TOTAL_WIN = 0; // --> ??
                this._logoClass.setAlpha(0);
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_ALL;
                this._buttonClass.setButton();
                GlobalClass.GAME_ROTATION = false;
                GlobalClass.GAME_TRANSLATE = true;


                TweenMax.to(this._jackpotGroup, 0.8, {
                    alpha: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._reelGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._frameGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._buttonGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._informationGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false,
                    onCompleteParams: [type],
                    callbackScope: this,
                    onComplete: this.changeBackground
                });


                break;
            case 1:
                if (AppConstants.BEST_OPERATOR && !GlobalClass.DEMO) {
                    if ((typeof(leanderGMApi) != "undefined")) {
                        // leanderGMApi.publishEvent(leanderGMApi.publications.TOTALWIN_UPDATED, GlobalClass.TOTAL_WIN + GlobalClass.GAME_DATA.freeGamesTotalWin);
                        leanderGMApi.publishEvent(leanderGMApi.publications.TOTALWIN_UPDATED, GlobalClass.GAME_DATA.freeGamesTotalWin);
                        leanderGMApi.publishEvent(leanderGMApi.publications.GAME_STATUS_CHANGED, "gameSettlePlay");
                    }
                }

                if (this.pdxmRound) {
                    this.pdxmRound = false;

                    await AppConstants.PDXM.animationComplete();
                    await Promise.resolve();
                    const isActive = AppConstants.PDXM.isFreeSpinActive();
                    AppConstants.PDXM_BONUS_ACTIVE = isActive;
                }
                    
                
                GlobalClass.GAME_BUSY = true;
                this._logoClass.setAlpha(0);
                this.lockScreen(true);
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_ALL;
                this._buttonClass.setButton();
                this._buttonClass.setBalance();

                GlobalClass.GAME_TRANSLATE = true;

                TweenMax.to(this._jackpotGroup, 0.8, {
                    alpha: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });
                TweenMax.to(this._reelGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._frameGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._buttonGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._informationGroup, 0.8, {
                    y: GlobalClass.STAGE_MAX,
                    ease: Linear.easeNone,
                    useFrames: false,
                    callbackScope: this,
                    onCompleteParams: [type],
                    onComplete: this.changeBackground
                });
                break;
            case 101:
                this._logoClass.setAlpha(1);
                this._backgroundClass.changeBackgroundImage(false, 1);
                GlobalClass.GAME_REEL = GlobalClass.REEL_NORMAL;
                if (this._getFreeGameStopCode && this._getFreeGameStopCode.length > 0) {
                    GlobalClass.GAME_STOPCODE = this._getFreeGameStopCode;
                }
                //this.initTestModeData(true);

                this._informationClass.setText("empty");

                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATIONS;
                GlobalClass.GAME_MODE = GlobalClass.GAME_MODE_NORMAL;
                GlobalClass.GAME_FEATURE = false;
                GlobalClass.GAME_FEATURE_TYPE = 0;

                // game.notify.event.emit("sentMsgSolid","FEIM.send.featureFinished");

                this.reloadReel();
                soundClass.playBGM("soundreelspin");
                //soundClass.stopBGM();

                this._buttonClass.setMode(false);
                this._frameClass.checkResolution();
                this._reelClass.checkResolution();
                this._jackpotClass.checkResolution();

                TweenMax.to(this._jackpotGroup, 1.5, {
                    alpha: 1,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._reelGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });
                TweenMax.to(this._frameGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._buttonGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._informationGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false,
                    callbackScope: this,
                    onCompleteParams: [0],
                    onComplete: this.startNormalGames
                });
                break;
            case 102:
                this._logoClass.setAlpha(1);
                GlobalClass.GAME_REEL = GlobalClass.REEL_SPECIAL;
                this._firstFreeSpin = true;
                GlobalClass.GAME_MODE = GlobalClass.GAME_MODE_FEATURE1;
                GlobalClass.GAME_FEATURE_TYPE = 1;
                this.reloadReel();


                // game.notify.event.emit("sentMsgSolid","FEIM.send.featureStarted");

                this._buttonClass.setMode(true);
                this._frameClass.checkResolution();
                this._reelClass.checkResolution();
                this._jackpotClass.checkResolution();
                //this.initTestModeData(false);
                this.startFreeGames(2);

                TweenMax.to(this._jackpotGroup, 1.5, {
                    alpha: 1,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._reelGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });
                TweenMax.to(this._frameGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });


                TweenMax.to(this._buttonGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false
                });

                TweenMax.to(this._informationGroup, 0.8, {
                    y: 0,
                    ease: Linear.easeNone,
                    useFrames: false,
                    callbackScope: this,
                    onCompleteParams: [0],
                    onComplete: this.changeScreenFinish
                });
                break;
        }
    },

    lockScreen: function (bool) {

    },

    changeScreenFinish: function () {
        this._jackpotGroup.alpha = 1;
        this.lockScreen(false);
        GlobalClass.GAME_TRANSLATE = false;

        GlobalClass.GAME_ROTATION = true;

        this.checkResolution();
        this.checkFreeGames();
    },

    changeBackground: function (type) {
        this._backgroundClass.changeBackground(type);
    },

    checkFeature: function () {
        GlobalClass.GAME_FEATURE_TOTAL = GlobalClass.GAME_DATA.freeGamesTotal;
        this._gameFreeTotal = GlobalClass.GAME_FEATURE_TOTAL;
        GlobalClass.GAME_FEATURE_LEFT = GlobalClass.GAME_DATA.freeGamesLeft;
    },

    startNormalGames: async function () {
        this._jackpotGroup.alpha = 1;
        GlobalClass.GAME_ROTATION = true;
        GlobalClass.GAME_TRANSLATE = false;
        this.checkResolution();

        if (this._getFreeGameLineWin && this._getFreeGameLineWin.length > 0) {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL;

            if (this.pdxmRound) {
                this.pdxmRound = false;

                await AppConstants.PDXM.animationComplete();
                await Promise.resolve();
                const isActive = AppConstants.PDXM.isFreeSpinActive();
                AppConstants.PDXM_BONUS_ACTIVE = isActive;
            }

            this._buttonClass.setButton();
            this._countWinSlot = 0;
            //this.checkFreeAnimationSymbol();
            if (AppConstants.PDX_ROUND_ID != "") {
                this._replayClass.showFinish();
            }
        } else {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;

            this._buttonClass.setButton();
            this.gameFinish(3);
        }
    },

    startFreeGames: function (type) {
        //soundClass.stopMusic();
        soundClass.playBGM("soundbgm");

        this.checkFeature();

        this._gameFreeTotal = GlobalClass.GAME_FEATURE_TOTAL;
        this._gameFreeLeft = GlobalClass.GAME_FEATURE_LEFT;

        this._informationClass.setText("freegames");
        this.addFeatureSpinLeft(this._gameFreeLeft);
        this.addFeatureTotalWin();
    },
    checkFreeGames: function (spin) {
        this.checkFeature();
        if (GlobalClass.GAME_FEATURE_LEFT > 0) {
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_IDLE;
            this._buttonClass.setButton();

            if (GlobalClass.FREE_GAME_AUTO_SPIN || spin) {
                this._gameFreeLeft = GlobalClass.GAME_FEATURE_LEFT - 1;
                this.addFeatureSpinLeft(this._gameFreeLeft);
                this._firstFreeSpin = false;
                this.startSpin(false);
            }
            else {
                this.addFeatureSpinLeft(GlobalClass.GAME_FEATURE_LEFT);

                if (this._firstFreeSpin) {
                    this.addBannerResult(6, 0);
                }
                else if (GlobalClass.GAME_DATA.totalWin > 0) {
                    this.startAnimationSymbol();
                }
            }
        }
        else {
            if (GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_FREE_END) {
                return;
            }

            GlobalClass.FREE_GAME_AUTO_SPIN = false;
            GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_FREE_END;
            this._buttonClass.setButton();
            this.addWinTotal();
        }
    },
    addWinTotal: function () {
        soundClass.pauseBGM();
        this._winBanner = new bannerClass(this.game, this._bannerGroup);
        // var v = GlobalClass.TOTAL_WIN + GlobalClass.GAME_DATA.freeGamesTotalWin;
        this._winBanner.create(4, GlobalClass.GAME_DATA.freeGamesTotalWin);
    },

    showTotalJackpotWin: function () {
        this._winBanner = new bannerClass(this.game, this._bannerGroup);
        this._winBanner.create(5, GlobalClass.GAME_DATA.jackpotState.winAmount);
    },

    setTotalBet: function () {
        this._buttonClass.setTotalBet();
    },

    showTipWin: function (type, message) {
        if (this._tipWinClass != null) {
            this._tipWinClass.close();
        }
        this._tipWinClass = new tipWin(this.game, this._tipWinGroup);
        this._tipWinClass.create(type, message);
    },
    receiveMsgSolid: function (data) {
        switch (data.eventName) {
            case MessageSolidEvent.PLAY_INTERRUPTED:
                this.blocksUI(1);
                break;
            case MessageSolidEvent.PLAY_RESUMED:
                
                this.unBlocksUI();
                
                break;
            case MessageSolidEvent.STOP_AUTOPLAY:
                this._buttonClass.stopAutoSpin(); 
                break;
        }
    },

    blocksUI: function (immediately) {
        if ((GlobalClass.GAME_UI_BLOCKED == 1 || GlobalClass.GAME_UI_BLOCKED == 2) && immediately <= 0) {
            return;
        }

        if (immediately == 1 || GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_IDLE || GlobalClass.GAME_CONDITION == GlobalClass.GAME_CONDITION_ANIMATION_SYMBOL) {

            GlobalClass.GAME_UI_BLOCKED = 2;

            this.blocksUIGroup.visible = true;
            if (this.blocksUIMask == null) {
                this.blocksUIMask = game.add.graphics();
                this.blocksUIMask.beginFill(0x000000);
                this.blocksUIMask.drawRect(0, 0, GlobalClass.STAGE_WIDTH, GlobalClass.STAGE_HEIGHT);
                this.blocksUIMask.alpha = 0.5;
                this.blocksUIMask.interactive = true;
                this.blocksUIGroup.addChild(this.blocksUIMask);
            }
            this._buttonClass.stopAutoSpin();
            //TweenMax.killAll(false, true, false, false);
            //this.cleanScreen();
        }
        else {
            GlobalClass.GAME_UI_BLOCKED = 1;
        }
    },

    unBlocksUI: function () {
        if (GlobalClass.GAME_UI_BLOCKED == 0) {
            return;
        }
        GlobalClass.GAME_UI_BLOCKED = 0;
        this.blocksUIGroup.visible = false;
    }
}



