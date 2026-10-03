var introState = {
    _grpIntro: null,
    _logoIndex: 0,
    _sprInterface: null,
    _grpInterface: null,
    _timerFunc: null,

    _networkWin: null,

    pdxReady: false,

    preload: function () {
        GlobalClass.GAME_ACTV_NAME = "intro";
        GlobalClass.GAME_ACTV = this;

        game.notify.event.removeListener("receiveMsgSolid");
        game.notify.event.on("receiveMsgSolid", this.receiveMsgSolid, this);

        this._pixiContainer = this.game.add.group();

        this._grpInterface = this.game.add.group();
        this._pixiContainer.addChild(this._grpInterface);
        this._grpIntro = this.game.add.group();
        this._pixiContainer.addChild(this._grpIntro);
        this._historyGroup = this.game.add.group();
        this._pixiContainer.addChild(this._historyGroup);
        this._networkGroup = this.game.add.group();
        this._pixiContainer.addChild(this._networkGroup);

        this._grpVersion = new PIXI.Container();
		this._pixiContainer.addChild(this._grpVersion);

        this.blocksUIGroup = this.game.add.group();
        this.blocksUIGroup.visible = false;
        this._pixiContainer.addChild(this.blocksUIGroup);

        // this.game.scale.addOrientationChange(this.checkResolution, this);
        GlobalClass.scaleScene(GlobalClass.GAME_PIXI.renderer, this._pixiContainer);
        this.checkResolution();

        var verText = game.add.text(20, 10, "ver " + String(GlobalClass.GAME_VERSION), {
            fontSize:"24px",
            fontFamily:"Arial",
            fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 2,
            align: "center"
        }, this._grpVersion);

        if (AppConstants.BEST_OPERATOR) { 
            window.addEventListener("message", this.receivePostMessage.bind(this));
        }

        this.checkFreeGames();
    },

    checkFreeGames: async function(event) {
        // this.btnContinue.disabled();

        try {
            // await Promise.race([
            //     AppConstants.PDXM.gameLoaded(),
            //     new Promise(resolve => setTimeout(resolve, 2000))
            // ]);
            await AppConstants.PDXM.gameLoaded();

            // const bonus = await AppConstants.PDXM.waitBonusInfo();
            const bonus = AppConstants.PDXM.bonusInfo;
            
            if (bonus) {
                const betLevelFromServer = Number(bonus.bet_level);

                const bets = GlobalClass.GAME_BET.map(Number);
                const coins = GlobalClass.GAME_COIN_VALUE.map(Number);

                let found = false;

                for (let b = 0; b < bets.length; b++) {
                    for (let c = 0; c < coins.length; c++) {

                        const calculatedBet = bets[b] * coins[c];

                        if (Math.abs(calculatedBet - betLevelFromServer) < 0.0001) {
                            GlobalClass.GAME_BET_POS = b;
                            GlobalClass.GAME_COIN_POS = c;

                            found = true;
                            break;
                        }
                    }

                    if (found) break;
                }

                if (!found) {
                    console.warn("Bet level not found:", betLevelFromServer);

                    AppConstants.PDXM.sendError({
                        source: "BONUS",
                        rgsCode: 400,
                        exceptionMsg: "FREEROUNDS_INVALID_BET_LEVEL"
                    });
                    this.pdxReady = true;
                    // this.btnContinue.enabled();
                    return;
                }

                const validBetLevels = [];

                for (let b = 0; b < bets.length; b++) {
                    for (let c = 0; c < coins.length; c++) {
                        validBetLevels.push(bets[b] * coins[c]);
                    }
                }

                const isValid = AppConstants.PDXM.validateFreeSpinBetLevel(validBetLevels);

                if (!isValid) {
                    this.pdxReady = true;
                    this.btnContinue.visible = true;
                    this.continueTxt.text = GlobalClass.getXMLByKey(this.game, "button continue");
                    return;
                }

                AppConstants.PDXM_BONUS_ACTIVE = true;
            }

            this.pdxReady = true;
            this.btnContinue.visible = true;
            this.continueTxt.text = GlobalClass.getXMLByKey(this.game, "button continue");
        } catch (err) {
            console.warn("checkFreeGames error:", err);

            this.pdxReady = true;
            this.btnContinue.visible = true;
            this.continueTxt.text = GlobalClass.getXMLByKey(this.game, "button continue");
        }
    },
    
    /*
    checkFreeGames: function () {
        Promise.race([
            AppConstants.PDXM.gameLoaded(),
            new Promise(function(resolve){
                setTimeout(resolve, 2000);
            })
        ])
        .then(() => {
            return AppConstants.PDXM.waitBonusInfo();
        })
        .then((bonus) => {

            if (!bonus) return;

            const betLevelFromServer = Number(bonus.bet_level);

            const bets = GlobalClass.GAME_BET.map(Number);
            const coins = GlobalClass.GAME_COIN_VALUE.map(Number);

            let found = false;

            for (let b = 0; b < bets.length; b++) {

                for (let c = 0; c < coins.length; c++) {

                    const calculatedBet = bets[b] * coins[c];

                    if (Math.abs(calculatedBet - betLevelFromServer) < 0.0001) {

                        GlobalClass.GAME_BET_POS = b;
                        GlobalClass.GAME_COIN_POS = c;

                        found = true;
                        break;
                    }
                }

                if (found) break;
            }

            if (!found) {

                console.warn("Bet level not found:", betLevelFromServer);

                AppConstants.PDXM.sendError({
                    source: "BONUS",
                    rgsCode: 400,
                    exceptionMsg: "FREEROUNDS_INVALID_BET_LEVEL"
                });

                return;
            }

            const validBetLevels = [];

            for (let b = 0; b < bets.length; b++) {
                for (let c = 0; c < coins.length; c++) {
                    validBetLevels.push(bets[b] * coins[c]);
                }
            }

            const isValid = AppConstants.PDXM.validateFreeSpinBetLevel(validBetLevels);

            if (!isValid) return;

            AppConstants.PDXM_BONUS_ACTIVE = true;

            console.warn("BONUS BET FOUND");

        })
        .catch((err) => {

            console.warn("checkFreeGames error:", err);

        })
        .finally(() => {

            if (this._sprButton && this._sprButton.enabled) {
                this._sprButton.enabled();
            }

        });

    },
    */

    receivePostMessage:function(event) {
		if (event.data && GlobalClass.GAME_ACTV == this) {
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
					} else {
						PIXI.sound.volumeAll = 0;
					}
				}
			} catch(e){
				// Do nothing
				// Not readable message from the game
			}
		}
	},

    checkResolution: function () {
        // if (this.scale.isLandscape) {
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
            if (this._networkWin != null) {
				this._networkWin.createLandscape();
			}
        } else {
            this.createPortrait();
            if (this._networkWin != null) {
				this._networkWin.createPortrait();
			}
        }
        if (GlobalClass.GAME_UI_BLOCKED == 1) {
            this.blocksUI(1);
        }
    },

    createLandscape: function () {
        GlobalClass.deleteChildren(this._grpIntro);

        var sprBackground = this.game.add.sprite(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 + 250, 'introScreen', 'Continue-button-frame.png', this._grpIntro);
        sprBackground.anchor.set(0.5, 0.5);

        this.btnContinue = this.game.add.button(sprBackground.x, sprBackground.y, 'introScreen', this.btnContinueClick, this, 'Continue-button_hov.png', 'Continue-button.png', 'Continue-button_clk.png', null, this._grpIntro);
        this.btnContinue.anchor.set(0.5, 0.5);
        //btnContinue.scale.set(1.55,1.5);

        this.continueTxt = this.game.add.text(this.btnContinue.x, this.btnContinue.y + 2, GlobalClass.getXMLByKey(this.game, "button continue"), {
            fontSize: "24px",
            fontFamily: "Times New Roman",
            fill: "#FFFFFF",
            align: "center"
        });
        this.continueTxt.anchor.set(0.5, 0.5);
        this._grpIntro.addChild(this.continueTxt);

        if (!this.pdxReady) {
            this.btnContinue.visible = false;
            this.continueTxt.text = "";
        }

        this.createLogo();

        /* var btnContinueTxt = this.game.add.sprite(0, 0, 'introScreen', 'Text_button_bar.png', this._grpIntro);
         btnContinueTxt.scale.set(GlobalClass.UI_SCALE_X,GlobalClass.UI_SCALE_Y);*/
    },

    createPortrait: function () {
        GlobalClass.deleteChildren(this._grpIntro);

        var sprBackground = this.game.add.sprite(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 + 150, 'introScreen', 'Continue-button-frame.png', this._grpIntro);
        sprBackground.anchor.set(0.5, 0.5);
        sprBackground.scale.set(0.75, 0.75)

        this.btnContinue = this.game.add.button(sprBackground.x, sprBackground.y, 'introScreen', this.btnContinueClick, this, 'Continue-button_hov.png', 'Continue-button.png', 'Continue-button_clk.png', null, this._grpIntro);
        this.btnContinue.anchor.set(0.5, 0.5);
        this.btnContinue.scale.set(0.75);

        this.continueTxt = this.game.add.text(this.btnContinue.x, this.btnContinue.y + 4, GlobalClass.getXMLByKey(this.game, "button continue"), {
            fontSize: "24px",
            fontFamily: "Times New Roman",
            fill: "#FFFFFF",
            align: "center"
        });
        this.continueTxt.anchor.set(0.5, 0.5);
        this._grpIntro.addChild(this.continueTxt);

        if (!this.pdxReady) {
            this.btnContinue.visible = false;
            this.continueTxt.text = "";
        }

        this.createLogo();
    },

    createLogo: function () {
        GlobalClass.deleteChildren(this._grpInterface);
        // if (this._sprInterface != null) {
        //     this._sprInterface.destroy();
        //     this._sprInterface = null;
        // }
        if (this._logoIndex > 2) {
            this._logoIndex = 0;
        }
        this._logoIndex++;
        var imgName = "game-intro-1.jpg";
        if (this._logoIndex == 1) {
            imgName = "game-intro-1.jpg";
        }
        else if (this._logoIndex == 2) {
            imgName = "game-intro-2.jpg";
        }
        else if (this._logoIndex == 3) {
            imgName = "game-intro-3.jpg";
        }

        // if (this.scale.isLandscape) {
        if (AppConstants.LANDSCAPE) {
            this._sprInterface = this.game.add.sprite(0, 0, 'introScreen', imgName, this._grpInterface);
            this._sprInterface.scale.set(1, 1)
            if (this._logoIndex <= 2) {
                var text = GlobalClass.getXMLByKey(this.game, "intro" + this._logoIndex);
                this._textSpr = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 160, text, {
                    "align": "center",
                    "breakWords": true,
                    "fill": "#76edff",
                    "fontSize": 32,
                    "strokeThickness": 3,
                    "wordWrap": true,
                    "wordWrapWidth": 1200
                });
                this._textSpr.anchor.set(0.5, 0.5);
                this._sprInterface.addChild(this._textSpr);
            }
        } else {
            this._sprInterface = this.game.add.sprite(this.game.world.centerY, this.game.world.centerX, 'introScreen', imgName, this._grpInterface);
            this._sprInterface.anchor.set(0.5, 0.5);
            this._sprInterface.scale.set(0.5625, 0.5625)
            if (this._logoIndex <= 2) {
                var text = GlobalClass.getXMLByKey(this.game, "intro" + this._logoIndex);
                this._textSpr = this.game.add.text(this.game.world.centerY, this.game.world.centerX + 80, text, {
                    "align": "center",
                    "breakWords": true,
                    "fill": "#76edff",
                    "fontSize": 24,
                    "stroke": "#5a2800",
                    "strokeThickness": 2,
                    "wordWrap": true,
                    "wordWrapWidth": 700
                });
                this._textSpr.anchor.set(0.5, 0.5);
                this._textSpr.scale.set(0.5625, 0.5625)
                this._grpInterface.addChild(this._textSpr);
            }
        }

        if (this._timerFunc != null) {
            this.game.time.events.remove(this._timerFunc);
        }
        this._timerFunc = this.game.time.events.add(5000, this.createLogo, this);
    },

    create: function () {
        // empty
    },

    btnContinueClick: function () {
        if (this.pdxReady) {
            // this.game.scale.removeOrientationChange();
            
            if (this._timerFunc != null) {
                this.game.time.events.remove(this._timerFunc);
            }
            soundClass.playSound("soundbtnclick");
            if (AppConstants.MOBILE_GAME) {
                // fullscreen();
            }
            // this.btnContinue.disabled();
            game.notify.event.removeListener("receiveMsgSolid");

            this.state.start('Gameplay');
            AppFacadeInstance.sendNotification(SlotsEvents.PING);
        }
    },

    showHistory: function (data) {
        this._historyClass = new historyClass(this.game, this._historyGroup, data);
        this._historyClass.create();
    },

    showNetworkWin: function (data) {
        if (this._networkWin == null) {
            this._networkWin = new networkWinClass(this.game, this, this._networkGroup, data);
            this._networkWin.create();
        }
    },
    receiveMsgSolid: function (data) {
        switch (data.eventName) {
            case MessageSolidEvent.PLAY_INTERRUPTED:
                this.blocksUI(0);
                break;
            case MessageSolidEvent.PLAY_RESUMED:
                this.unBlocksUI();
                break;
        }
    },

    blocksUI: function () {
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
    },

    unBlocksUI: function () {
        if (GlobalClass.GAME_UI_BLOCKED == 0) {
            return;
        }
        GlobalClass.GAME_UI_BLOCKED = 0;
        this.blocksUIGroup.visible = false;
    }
}

