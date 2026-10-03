var preloaderState = {
	_grpPreload: null,
	_sprBackground: null,
	_sprLogo: null,
	_sprBarOut: null,
	_sprBarIn: null,

	logoDone: false,
	loadDone: false,
	_orientationClass: null,
	_orientationGroup: null,
	_networkGroup: null,

	initOk:false,

	pdxReady:false,
	gameplayScriptsLoaded: false,
	gameplayScriptsLoading: false,
	loadingBarWidth: 0,
	loadingBarHeight: 0,

	_networkWin: null,

	preload: function () {
		console.warn("newload");
		
		this.initPDXAsnyc();

		GlobalClass.GAME_ACTV_NAME = "preload";
		GlobalClass.GAME_ACTV = this;

		/*
		this._pixiContainer = this.game.add.group();
		
		this._grpPreload = this.game.add.group();
		//this.container.addChild(this._grpPreload);
		this._pixiContainer.addChild(this._grpPreload);

		this._orientationGroup = this.game.add.group();
		//	this.container.addChild(this._orientationGroup);
		this._pixiContainer.addChild(this._orientationGroup);

		this._networkGroup = this.game.add.group();
		this._pixiContainer.addChild(this._networkGroup);
		*/
		this._pixiContainer = this.game.add.group();

		this._grpPreload = new PIXI.Container();
		this._pixiContainer.addChild(this._grpPreload);

		this._grpBar = new PIXI.Container();
		this._pixiContainer.addChild(this._grpBar);

		this._orientationGroup = new PIXI.Container();
		this._pixiContainer.addChild(this._orientationGroup);
	
		this._networkGroup = new PIXI.Container();
		this._pixiContainer.addChild(this._networkGroup);

		this._grpVersion = new PIXI.Container();
		this._pixiContainer.addChild(this._grpVersion);

		this.drawScreen();
		this.loadGameplayScripts();

		if (AppConstants.BEST_OPERATOR) {
			window.addEventListener("message", this.receivePostMessage.bind(this));

            if ((typeof(leanderGMApi) != "undefined")) {
                // leanderGMApi.publishEvent(leanderGMApi.publications.PRELOADING_STARTED);
                leanderGMApi.publishEvent(leanderGMApi.publications.PRELOADING_ENDED);
            }
        }
		
		// this.game.scale.addOrientationChange(this.checkResolution, this);
		
		this.load.onLoadStart.add(this.loadSpine, this);
		this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);

		GlobalClass.scaleScene(GlobalClass.GAME_PIXI.renderer, this._pixiContainer);
		this.checkResolution();
		this.initLoadingProgress();

		console.warn("ver " + GlobalClass.GAME_VERSION);
		var verText = game.add.text(20, 10, "ver " + String(GlobalClass.GAME_VERSION), {
            fontSize:"24px",
            fontFamily:"Arial",
            fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 2,
            align: "center"
        }, this._grpVersion);

		this.initNetwork();
	},

	loadGameplayScripts: function () {
		if (this.gameplayScriptsLoaded || this.gameplayScriptsLoading) return;

		this.gameplayScriptsLoading = true;
		var gameplayScripts = [
			"src/view/phaserview/state/SoundClass.js",
			"src/view/phaserview/class/LogoClass.js",
			"src/view/phaserview/class/BackgroundClass.js",
			"src/view/phaserview/class/ButtonClass.js",
			"src/view/phaserview/class/ButtonMobileClass.js",
			"src/view/phaserview/class/CoinClass.js",
			"src/view/phaserview/class/FrameClass.js",
			"src/view/phaserview/class/InformationClass.js",
			"src/view/phaserview/class/PaytableClass.js",
			"src/view/phaserview/class/BetClass.js",
			"src/view/phaserview/class/ReelClass.js",
			"src/view/phaserview/class/ReelColumn.js",
			"src/view/phaserview/class/ReelSymbol.js",
			"src/view/phaserview/class/ReplayClass.js",
			"src/view/phaserview/class/StarClass.js",
			"src/view/phaserview/class/WinBanner.js",
			"src/view/phaserview/class/WinLine.js",
			"src/view/phaserview/class/WinScatter.js",
			"src/view/phaserview/class/WinValue.js",
			"src/view/phaserview/class/OrientationClass.js",
			"src/view/phaserview/class/OptionClass.js",
			"src/view/phaserview/class/map.js",
			"src/view/phaserview/class/JackpotClass.js",
			"src/view/phaserview/class/NetworkStateClass.js",
			"src/view/phaserview/class/HistoryClass.js",
			"src/view/phaserview/class/LanguageClass.js",
			"src/view/phaserview/class/TopAreaClass.js",
			"src/view/phaserview/class/FreeSpins.js"
		];

		var self = this;
		new JsLoader('', gameplayScripts, function () {
			self.gameplayScriptsLoading = false;
			self.gameplayScriptsLoaded = true;
			self.check();
		}).startLoad();
	},

	initLoadingProgress: function () {
		this.loadingBarWidth = this._sprBarIn.width;
		this.loadingBarHeight = this._sprBarIn.height;
		this._sprBarIn.visible = true;
		this.updateLoadingProgress(0);
	},

	updateLoadingProgress: function (assetProgress) {
		if (!this._sprBarIn || !this.loadingBarWidth) return;

		// Asset 0..100 dipetakan ke total 20..100. Nilai akhir tetap 100%.
		var totalProgress = 20 + (Math.max(0, Math.min(100, assetProgress)) * 0.8);
		var cropWidth = Math.max(1, Math.floor(this.loadingBarWidth * totalProgress / 100));
		this._sprBarIn.crop(new Rectangle(0, 0, cropWidth, this.loadingBarHeight));
		if (typeof window.updateBootProgress === "function") {
			window.updateBootProgress(totalProgress);
		}
	},

	initPDXAsnyc: async function() {
		try{
			await AppConstants.PDXM_READY_PROMISE;
		}catch(e){
			console.error("PDXM connect failed", e);
		} finally {
			// Always continue boot flow even if the early connect failed.
			this.pdxReady = true;
			this.check();
		}
	},

	initNetwork: async function() {
		if (navigator.onLine) {
			AppFacadeInstance.sendNotification(SlotsEvents.INIT_SPIN_REELS); // go to initSuccess();
		} else {
			// this.showNetworkWin("nointernet");

			const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
				source: "SESSION",
				error: "CONNECTION ERROR",
				debug: true
			});

			if (pdxmInstruction?.errorType == "N/A") {
				switch(pdxmInstruction.errorAction) {
					case "RESET":

						break;
					case "RECALL":
						this.initNetwork();
						break;
					case "IGNORE":

						break;
				}
			} else {
				AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, ["nointernet", pdxmInstruction, () => {this.initNetwork()}]);
			}
		}
	},

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

	initMessage:function(){
		game.notify = {};
		game.notify.event =  new PIXI.Container();

		// let messageSolid = new MessageSolid();
		// messageSolid.init();

		// game.messageSolid = messageSolid;

		this.startClass();

		this.initOk = true;
		this.check();
	},

	drawScreen: function () {
		this._sprBackground = this.game.add.graphics();
		this._sprBackground.beginFill(0x000000);
		this._sprBackground.drawRect(0, 0, GlobalClass.STAGE_WIDTH, GlobalClass.STAGE_HEIGHT);
		this._grpPreload.addChild(this._sprBackground);

		if (AppConstants.LOADING_PDX) {
			this._sprLogo = new Sprite(GlobalClass.STAGE_WIDTH / 2-40, GlobalClass.STAGE_HEIGHT / 2 - 75, 'loadingScreenPDX', 'bannerLogo.png', this.game);
			this._sprLogo.anchor.x = 0.5;
			this._sprLogo.anchor.y = 0.5;
			this._grpPreload.addChild(this._sprLogo);
			
			this._sprBarIn = new Sprite(GlobalClass.STAGE_WIDTH / 2-200, GlobalClass.STAGE_HEIGHT / 2 + 150, 'loadingScreenPDX', 'neonGlowLoader.png', this.game);
			this._sprBarIn.anchor.x = 0;
			this._sprBarIn.anchor.y = 0.5;
			this._sprBarIn.visible = false;
			this._grpBar.addChild(this._sprBarIn);

			this.logoDone = true;
		} else {
			this._sprLogo = new Sprite(GlobalClass.STAGE_WIDTH / 2-40, GlobalClass.STAGE_HEIGHT / 2 - 75, 'loadingScreen', "BWG_anm_00", this.game);
			this._grpPreload.addChild(this._sprLogo);
			var _textures = this._sprLogo.animations.generateFrameNames('BWG_anm_', 0, 74, '', 2);
			this._sprLogo.animations.add('anim', _textures, false, 0.6,this.animationStopped,this);
			this._sprLogo.animations.play('anim');
	
			this._sprBarIn = new Sprite(GlobalClass.STAGE_WIDTH / 2-200, GlobalClass.STAGE_HEIGHT / 2 + 150, 'bar', '', this.game);
			this._sprBarIn.anchor.x = 0;
			this._sprBarIn.anchor.y = 0.5;
			this._sprBarIn.visible = false;
			this._grpPreload.addChild(this._sprBarIn);
		}

		// this._touchLogo = new Sprite(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 +200, 'oneTouchLogo', "", this.game);
		// this._touchLogo.anchor.set(0.5);
		// this._grpPreload.addChild(this._touchLogo);

	},

	checkResolution: function () {
		// if (this.scale.isLandscape) {
		if (AppConstants.LANDSCAPE) {
			//this.scale.setGameSize(GlobalClass.STAGE_WIDTH, GlobalClass.STAGE_HEIGHT);
			//this.scale.refresh();
			this.createLandscape();

			if (this._networkWin != null) {
				this._networkWin.createLandscape();
			}
		} else {
			//this.scale.setGameSize(GlobalClass.STAGE_HEIGHT, GlobalClass.STAGE_WIDTH);
			//this.scale.refresh();
			this.createPortrait();

			if (this._networkWin != null) {
				this._networkWin.createPortrait();
			}
		}
	},

	createLandscape: function () {
		if (this._orientationClass != null) {
			this._orientationClass.remove();
		}

		this._sprBackground.width = GlobalClass.STAGE_WIDTH;
		this._sprBackground.height = GlobalClass.STAGE_HEIGHT;

		if (AppConstants.LOADING_PDX) {
			this._sprLogo.setPosition(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 - 0);

			this._sprBarIn.scale.set(1, 1);
			this._sprBarIn.x = GlobalClass.STAGE_WIDTH / 2 - 400
			this._sprBarIn.y = GlobalClass.STAGE_HEIGHT / 2 + 180;
		} else {
			this._sprLogo.setPosition(GlobalClass.STAGE_WIDTH / 2-40, GlobalClass.STAGE_HEIGHT / 2 - 75);
			
			this._sprBarIn.x = GlobalClass.STAGE_WIDTH / 2 - 200
			this._sprBarIn.y = GlobalClass.STAGE_HEIGHT / 2 + 100;
		}

		// this._touchLogo.setPosition(GlobalClass.STAGE_WIDTH / 2,GlobalClass.STAGE_HEIGHT / 2 + 200);

		
		
	},

	createPortrait: function () {
		this._sprBackground.width = GlobalClass.STAGE_WIDTH;
		this._sprBackground.height = GlobalClass.STAGE_HEIGHT;

		if (AppConstants.LOADING_PDX) {
			this._sprLogo.setPosition(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 - 0);
			
			this._sprBarIn.scale.set(0.828, 1);

			this._sprBarIn.x = GlobalClass.STAGE_WIDTH / 2 - 285;
			this._sprBarIn.y = GlobalClass.STAGE_HEIGHT / 2 + 180;
		} else {
			this._sprLogo.setPosition(GlobalClass.STAGE_WIDTH / 2, GlobalClass.STAGE_HEIGHT / 2 - 75);
			
			this._sprBarIn.scale.set(0.86, 0.75);

			this._sprBarIn.x = GlobalClass.STAGE_WIDTH / 2 - 140;
			this._sprBarIn.y = GlobalClass.STAGE_HEIGHT / 2 + 100;
		}

		

		// this._touchLogo.setPosition(GlobalClass.STAGE_WIDTH / 2,GlobalClass.STAGE_HEIGHT / 2 + 200);
	},

	startClass: function () {
		this._sprBarIn.visible = true;
		/*
		if (GlobalClass.XML_EN != undefined) {
			this.load.xml('language_en', GlobalClass.XML_EN);
		} else {
			this.load.xml('language_en', 'assets/xml/language_en.xml');
		}
		
		if (GlobalClass.XML_FR != undefined) {
			this.load.xml('language_fr', GlobalClass.XML_FR);
		} else {
			this.load.xml('language_fr', 'assets/xml/language_fr.xml');
		}

		if (GlobalClass.XML_SP != undefined) {
			this.load.xml('language_sp', GlobalClass.XML_SP);
		} else {
			this.load.xml('language_sp', 'assets/xml/language_sp.xml');
		}
		*/
		

		if(GlobalClass.GAME_LANG=='zh'){
			this.load.atlasJSONArray('jakpot_zh', 'assets/images/langs/jakpot_'+GlobalClass.GAME_LANG+'.png', 'assets/images/langs/jakpot_'+GlobalClass.GAME_LANG+'.json');
			this.load.atlasJSONArray('ui_zh', 'assets/images/langs/ui_'+GlobalClass.GAME_LANG+'.png', 'assets/images/langs/ui_'+GlobalClass.GAME_LANG+'.json');
			this.load.atlasJSONArray('symbol_zh', 'assets/images/langs/symbol_'+GlobalClass.GAME_LANG+'.png', 'assets/images/langs/symbol_'+GlobalClass.GAME_LANG+'.json');
		}

		this.load.image('bg-base', 'assets/images/Background-Base.jpg');
		this.load.image('bg-free', 'assets/images/Background-Feature.jpg');
		this.load.image('bg-potrait', 'assets/images/Bg-potrait.jpg');
		this.load.image('BGfeat-potrait', 'assets/images/BGfeat-potrait.jpg');
		// this.load.atlasJSONArray('network', 'assets/images/image/network.png', 'assets/images/image/network.json');
		this.load.atlasJSONArray('paytable', 'assets/images/image/paytable.png', 'assets/images/image/paytable.json');
		this.load.atlasJSONArray('ui', 'assets/images/image/ui.png','assets/images/image/ui.json');
		this.load.atlasJSONArray('flags', 'assets/images/image/flags.png','assets/images/image/flags.json');
		this.load.atlasJSONArray('interfaceFX', 'assets/images/image/interfaceFX.png','assets/images/image/interfaceFX.json');
		this.load.atlasJSONArray('jakpotWin', 'assets/images/image/jakpotWin.png','assets/images/image/jakpotWin.json');
		this.load.atlasJSONArray('mobile', 'assets/images/image/mobile.png','assets/images/image/mobile.json');
		this.load.atlasJSONArray('symbolFX', 'assets/images/image/symbolsFX.png','assets/images/image/symbolsFX.json');
		this.load.atlasJSONArray('symbols1', 'assets/images/image/symbols1.png','assets/images/image/symbols1.json');
		this.load.atlasJSONArray('symbols2', 'assets/images/image/symbols2.png','assets/images/image/symbols2.json');
		this.load.atlasJSONArray('plusmin', 'assets/images/image/plusmin.png','assets/images/image/plusmin.json');
		// this.load.atlasJSONArray('uiPanel', 'assets/images/image/uiPanel.png','assets/images/image/uiPanel.json');
		this.load.atlasJSONArray('introScreen', 'assets/images/introScreen/gameIntro.png','assets/images/introScreen/gameIntro.json');
		
		this.load.atlasJSONArray('curency', 'assets/images/image/curency.png','assets/images/image/curency.json');
		this.load.atlasJSONArray('crackFX1', 'assets/images/image/Crack1FX/crack1.png','assets/images/image/Crack1FX/crack1.json');
		this.load.atlasJSONArray('crackFX2', 'assets/images/image/Crack2FX/crack2.png','assets/images/image/Crack2FX/crack2.json');
		this.load.atlasJSONArray('crackFX3', 'assets/images/image/Crack3FX/crack3.png','assets/images/image/Crack3FX/crack3.json');
		this.load.atlasJSONArray('crackFX4', 'assets/images/image/Crack4FX/crack4.png','assets/images/image/Crack4FX/crack4.json');
		this.load.atlasJSONArray('crackFX5', 'assets/images/image/Crack5FX/crack5.png','assets/images/image/Crack5FX/crack5.json');

		this.load.atlasJSONArray('explo', 'assets/images/image/Explo/explo.png','assets/images/image/Explo/explo.json');

		this.load.atlasJSONArray('freespins', 'assets/images/image/freespins.png','assets/images/image/freespins.json');

		this.load.atlasJSONArray('responsible_gambling', 'assets/images/image/responsible_gambling.png','assets/images/image/responsible_gambling.json');
		this.load.start();
	},

	loadSpine:function() {
		// game.notify.event.emit("sentMsgSolid","FEIM.send.gameLoadStarted");
		var self = this;
		self.game.spineLoaded = false;
		// var mb = myBrowser();
		// if(mb=='opera'){
		// 	this.game.app.loader
		// 	.add('soundbgm','assets/sounds/mp3/WWW_FreeSpin_BGM.mp3')
		// 	.add('soundcoincounter','assets/sounds/mp3/coin_counter.mp3')
		// 	.add('soundbtnclick','assets/sounds/mp3/button_click.mp3')
		// 	.add('soundbtnover','assets/sounds/mp3/button_over.mp3')
		// 	.add('soundreeldelay','assets/sounds/mp3/reel_delay.mp3')
		// 	.add('soundreelspin','assets/sounds/mp3/WWW_BGM.mp3')
		// 	.add('soundreelstop','assets/sounds/mp3/reel_stop.mp3')
		// 	.add('soundreelteaser1','assets/sounds/mp3/WWW_Scatter_1.mp3')
		// 	.add('soundreelteaser2','assets/sounds/mp3/WWW_Scatter_2.mp3')
		// 	.add('soundreelteaser3','assets/sounds/mp3/WWW_Scatter_3.mp3')
		// 	.add('soundreelteaser4','assets/sounds/mp3/WWW_Scatter_4.mp3')
		// 	.add('soundreelteaser5','assets/sounds/mp3/WWW_Scatter_5.mp3')
		// 	.add('soundreelwild','assets/sounds/mp3/WWW_WildLand.mp3')
		// 	.add('soundreelpica','assets/sounds/mp3/pica_drop.mp3')
		// 	.add('soundwin', 'assets/sounds/mp3/win_sound.mp3')
		// 	.add('soundwinsmall','assets/sounds/mp3/WWW_Win_Small.mp3')
		// 	.add('soundwinbig','assets/sounds/mp3/WWW_Win_Big.mp3')
		// 	.add('soundwinhuge','assets/sounds/mp3/WWW_Win_Huge.mp3')
		// 	.add('soundwinmassive','assets/sounds/mp3/WWW_Win_Massive.mp3')
		// 	.add('FGTrigger','assets/sounds/mp3/WWW_Trigger.mp3')
		// 	.add('jackPotTrigger','assets/sounds/mp3/jackpotTrigger.mp3')
		// 	.add('jackPotgrand','assets/sounds/mp3/WWW_JackPot_Grand.mp3')
		// 	.add('jackPotmajor','assets/sounds/mp3/WWW_JackPot_Major.mp3')
		// 	.add('jackPotminor','assets/sounds/mp3/WWW_JackPot_Minor.mp3')
		// 	.add('jackPotmini','assets/sounds/mp3/WWW_JackPot_Mini.mp3')
		// 	.add('bom','assets/sounds/mp3/bom.mp3')
		// 	.load(function(loader,res){
		// 		self.game.spineRes = res;
		// 		self.game.spineLoaded = true;
		// 		self.check();
		// 	});
		// }
		// else{
			// if (GlobalClass.XML_EN != undefined) {
				// this.game.app.loader.add('language_en', GlobalClass.XML_EN);
			// } else {
				this.game.app.loader.add('language_en', 'assets/xml/language_en.xml');
			// }

			// if (GlobalClass.XML_FR != undefined) {
			// 	this.game.app.loader.add('language_fr', GlobalClass.XML_FR);
			// } else {
				this.game.app.loader.add('language_fr', 'assets/xml/language_fr.xml');
			// }
	
			// if (GlobalClass.XML_SP != undefined) {
			// 	this.game.app.loader.add('language_sp', GlobalClass.XML_SP);
			// } else {
				this.game.app.loader.add('language_sp', 'assets/xml/language_sp.xml');
			// }

			this.game.app.loader.add('language_id', 'assets/xml/language_id.xml');

			this.game.app.loader
			.add('soundbgm','assets/sounds/m4a/WWW_FreeSpin_BGM.m4a')
			.add('soundcoincounter','assets/sounds/m4a/coin_counter.m4a')
			.add('soundbtnclick','assets/sounds/m4a/button_click.m4a')
			.add('soundbtnover','assets/sounds/m4a/button_over.m4a')
			.add('soundreeldelay','assets/sounds/m4a/reel_delay.m4a')
			.add('soundreelspin','assets/sounds/m4a/WWW_BGM.m4a')
			.add('soundreelstop','assets/sounds/m4a/reel_stop.m4a')
			.add('soundreelteaser1','assets/sounds/m4a/WWW_Scatter_1.m4a')
			.add('soundreelteaser2','assets/sounds/m4a/WWW_Scatter_2.m4a')
			.add('soundreelteaser3','assets/sounds/m4a/WWW_Scatter_3.m4a')
			.add('soundreelteaser4','assets/sounds/m4a/WWW_Scatter_4.m4a')
			.add('soundreelteaser5','assets/sounds/m4a/WWW_Scatter_5.m4a')
			.add('soundreelwild','assets/sounds/m4a/WWW_WildLand.m4a')
			.add('soundreelpica','assets/sounds/m4a/pica_drop.m4a')
			.add('soundwin', 'assets/sounds/m4a/win_sound.m4a')
			.add('soundwinsmall','assets/sounds/m4a/WWW_Win_Small.m4a')
			.add('soundwinbig','assets/sounds/m4a/WWW_Win_Big.m4a')
			.add('soundwinhuge','assets/sounds/m4a/WWW_Win_Huge.m4a')
			.add('soundwinmassive','assets/sounds/m4a/WWW_Win_Massive.m4a')
			.add('FGTrigger','assets/sounds/m4a/WWW_Trigger.m4a')
			.add('jackPotTrigger','assets/sounds/m4a/jackpotTrigger.m4a')
			.add('jackPotgrand','assets/sounds/m4a/WWW_JackPot_Grand.m4a')
			.add('jackPotmajor','assets/sounds/m4a/WWW_JackPot_Major.m4a')
			.add('jackPotminor','assets/sounds/m4a/WWW_JackPot_Minor.m4a')
			.add('jackPotmini','assets/sounds/m4a/WWW_JackPot_Mini.m4a')
			.add('bom','assets/sounds/m4a/bom.m4a')
			.load(function(loader,res){
				self.game.spineRes = res;
				self.game.spineLoaded = true; 
				self.check();
			});
		// }
		
	},

	animationStopped: function () {
		this.logoDone = true;
		this.check();
	},

	fileComplete: function (progress) {
		this.updateLoadingProgress(progress);
		// game.notify.event.emit("sentMsgSolid","FEIM.send.gameLoadProgress",progress);
	},
	loadComplete: function () {
		this.updateLoadingProgress(100);
		this.loadDone = true;
		this.check();
		// game.notify.event.emit("sentMsgSolid","FEIM.send.gameLoadCompleted");
	},
	check: function () {
		if (this.initOk && this.logoDone && this.loadDone && this.game.spineLoaded && this.pdxReady && this.gameplayScriptsLoaded) {
			this.load.reset(true, true);
			// this.game.scale.removeOrientationChange();
			this.hideBootOverlay();
			this.state.start('Intro');
		}

	},
	hideBootOverlay: function () {
		var bootLogo = document.getElementById("logo");
		if (bootLogo) {
			bootLogo.style.display = "none";
		}
	},
	create: function () {
		let F1key = keyboard("F1");
		F1key.press = () => {
			this.game.scale.startFullScreen();
		};
	},
	showNetworkWin: function (data) {
		if (this._networkWin == null) {
			// The HTML boot overlay sits above the PIXI canvas (z-index: 10000).
			// Hide it before creating the in-canvas error notification.
			this.hideBootOverlay();

			// Keep the notification container above every other preloader group.
			this._pixiContainer.addChild(this._networkGroup);
			this._networkWin = new networkWinClass(this.game, this, this._networkGroup, data, true);
			this._networkWin.create();
		}
    },
}
