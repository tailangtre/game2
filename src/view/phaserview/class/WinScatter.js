var winscatterClass = function(game, group) {
	this._posLandscapeX = 640;
	this._posLandscapeY = 320;
	this._posPortraitX = 360;
	this._posPortraitY = 460;
	this._grpPosition = null;
  
	this._grpBanner = null;
	this._grpTimeBanner = null;
  
	this._grpTransparent = null;
	this._sprTransparent = null;
	this._transition = null;
  
	this.wonText = "";
	this.type = 1;
  
	this.create = function(win,type) {
	  this._grpTransparent = game.add.group();
	  group.addChild(this._grpTransparent);
  
	  this._grpPosition = game.add.group();
	  group.addChild(this._grpPosition);

	  this._grpBlow = game.add.group();
	  group.addChild(this._grpBlow);
  
	  this._grpBanner = game.add.group();
	  this._grpPosition.addChild(this._grpBanner);
  
	  GlobalClass.GAME_BANNER = true;

	  this._bomX = 0;
	  this._bomY = 0;
	  this.type = type;

	  this.wonText = win + " " + GlobalClass.getXMLByKey(game, "bannerfreegameswon");
	  if(GlobalClass.GAME_LANG=='zh'){
		this.wonText = "赢得"+win+"次免费游戏";
	  }
		this.checkResolution();
	 
		if(this.type>1){
			if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
				this.showPicaSymbol();
			}
			else{
				if(this.type==2){
					gameplayState.gameFinish(1);
				}
				else{
					gameplayState.checkJackpot();
				}
			}
		}
		else{
			this.drawScreen();
		}
		
	};

	// Piggy bank (pic1) presentation (tom 2026-10-03): no sparks flying to the jackpots, no explosion.
	// Every landed piggy slowly CHARGES (grows, with a gentle wobble); if this spin triggers the free spins
	// it then plays its burst animation, otherwise it settles back to normal size.
	var PIGGY_CHARGE_S = 1.6;      // charge / grow time
	var PIGGY_CHARGE_SCALE = 1.22; // size reached while charging
	var PIGGY_SETTLE_S = 0.45;     // shrink back when nothing triggers
	var PIGGY_BURST_MS = 1300;     // pic1_blow length at 0.6 speed (44 frames)

	this.showPicaSymbol=function(){
		var maskBG = game.add.button(0, 0, 'network', this.btnClick, this, "blank.png", "blank.png", "blank.png", "", this._grpTransparent);
		maskBG.width = GlobalClass.STAGE_WIDTH * 20;
		maskBG.height = GlobalClass.STAGE_HEIGHT * 20;
		maskBG.alpha = 0;
		this.showAwardSymbol();
	};

	this.btnClick=function(){
		this.endBomFun();
	};

	this.endBomFun = function(){
		if (this._bomEnded) return;
		soundClass.stopSound("bom");
		TweenMax.killTweensOf(this._grpBlow);
		TweenMax.killAll(false, true, false, false);
		this.endBom();
		this.remove();
	};

	this.piggyTriggers = function(){
		var d = GlobalClass.GAME_DATA || {};
		return !!(d.normal2Feature || (d.freeGamesWon && d.freeGamesWon > 0));
	};

	this.showAwardSymbol=function(){
		if(!GlobalClass.GAME_DATA.awardSymbols){
			this.endBom();
			return;
		}
		var reel = gameplayState._reelClass;
		var charged = [];
		for(var i=0;i<GlobalClass.GAME_DATA.awardSymbols.length;i++){
			var smy = GlobalClass.GAME_DATA.awardSymbols[i];
			var symbol = reel._reelColumnArr[smy.col]._reelSymbolArr[smy.row + 2];
			var src = symbol._sprSymbol;
			// a stand-in on the unclipped animation layer, so the grown piggy is never cut by the reel window
			var spr = game.add.sprite(src.x, src.y, 'symbols2', 'pic1_00.png', reel._grpSymbolAnim);
			spr.anchor.set(0.5, 0.5);
			src.visible = false;
			// simple warm glow that builds up while the piggy charges (tom 2026-10-04)
			var glw = game.add.sprite(src.x, src.y, 'symbols2', 'pic1_00.png', reel._grpSymbolAnim);
			glw.anchor.set(0.5, 0.5);
			glw.tint = 0xffc560;
			glw.blendMode = PIXI.BLEND_MODES.ADD;
			glw.filters = [new PIXI.filters.BlurFilter(10, 3)];
			glw.alpha = 0;
			reel._grpSymbolAnim.addChildAt(glw, reel._grpSymbolAnim.getChildIndex(spr));   // behind the piggy
			TweenMax.to(glw, PIGGY_CHARGE_S, { alpha: 0.9, ease: Power1.easeIn });
			TweenMax.to(glw.scale, PIGGY_CHARGE_S, { x: PIGGY_CHARGE_SCALE * 1.08, y: PIGGY_CHARGE_SCALE * 1.08, ease: Power1.easeIn });
			charged.push({ symbol: symbol, src: src, spr: spr, glw: glw });
			TweenMax.to(spr.scale, PIGGY_CHARGE_S, { x: PIGGY_CHARGE_SCALE, y: PIGGY_CHARGE_SCALE, ease: Power1.easeIn });
			TweenMax.fromTo(spr, 0.12, { rotation: -0.03 }, { rotation: 0.03, repeat: Math.round(PIGGY_CHARGE_S / 0.12), yoyo: true, ease: Sine.easeInOut, delay: PIGGY_CHARGE_S * 0.35 });
		}
		var self = this;
		this._timerFunc = game.time.events.add(PIGGY_CHARGE_S * 1000, function(){
			var triggers = self.piggyTriggers();
			for (var j = 0; j < charged.length; j++) {
				var c = charged[j];
				TweenMax.killTweensOf(c.spr); TweenMax.killTweensOf(c.spr.scale);
				(function (g) {   // the glow fades away (burst or settle)
					TweenMax.killTweensOf(g); TweenMax.killTweensOf(g.scale);
					TweenMax.to(g, 0.35, { alpha: 0, onComplete: function () { if (!g._destroyed && g.parent) g.destroy(); } });
				})(c.glw);
				c.spr.rotation = 0;
				if (triggers) {
					if (!c.spr._destroyed) c.spr.destroy();
					c.src.visible = true;
					c.symbol.symbolBlow();                                   // burst (pic1_blow frames)
					var anim = c.src.animations && c.src.animations.animations && c.src.animations.animations.animBlow;
					if (anim) anim.scale.set(PIGGY_CHARGE_SCALE);
				} else {
					(function (cc) {
						TweenMax.to(cc.spr.scale, PIGGY_SETTLE_S, { x: 1, y: 1, ease: Back.easeOut, onComplete: function () { if (cc.src && !cc.src._destroyed) cc.src.visible = true; if (cc.spr && !cc.spr._destroyed && cc.spr.parent) cc.spr.destroy(); } });
					})(c);
				}
			}
			if (triggers) soundClass.playSound("bom");
			self._timerFunc = game.time.events.add(triggers ? PIGGY_BURST_MS : PIGGY_SETTLE_S * 1000 + 100, function(){
				self.endBom();
			}, self);
		}, this);
	};


	this.endBom = function(){
		if (this._bomEnded) return;                       // only once - it starts the jackpot sequence
		this._bomEnded = true;
		if (this._timerFunc != null) {
			game.time.events.remove(this._timerFunc);
		}
		if (this._grpTransparent) GlobalClass.deleteChildren(this._grpTransparent);   // drop the tap-to-skip layer
		gameplayState._reelClass.reloadReel();
		GlobalClass.deleteChildren(this._grpBlow);
		gameplayState._backgroundClass.changeBackgroundImage(true);
		if(this.type==2){
			gameplayState.gameFinish(1);
		}
		else{
			gameplayState.checkJackpot();
		}
	};

  
	this.drawScreen = function() {

	  this._bgTransparent = game.add.sprite(0, 0, 'uiPanel', 'BG_allBanners.png', this._grpTransparent);
	  this._bgTransparent.anchor.set(0.5, 0.5);
	  this._bgTransparent.width = game.world.width * 5;
	  this._bgTransparent.height = game.world.height * 5;
	  this._bgTransparent.interactive = true;

	  this._grpBanner.scale.set(0);
	
	  if (AppConstants.LANDSCAPE) {
		//this._valueWon = game.add.sprite(game.world.centerX,game.world.centerY, 'ui', this.wonText, this._grpBanner);
		this._grpBanner.x = game.world.centerX;
		this._grpBanner.y = game.world.centerY;
	  }
	  else{
		//this._valueWon = game.add.sprite(game.world.centerY,game.world.centerX, 'ui', this.wonText, this._grpBanner);
		this._grpBanner.y = game.world.centerX;
		this._grpBanner.x = game.world.centerY;
	  }
	  
	  var posX;
	  var posY;
	  
	  if (AppConstants.LANDSCAPE) {
		posX = 0;
		posY = 0;
	  } else {
		posX = 0;
		posY = -60;
	  }
	  this._valueWon = game.add.text(posX,posY,this.wonText, {		
			fontSize:"48px",
			fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
			fontWeight:"bold",
			fill: "#e4f7f2",
			boundsAlignH: "center",
			boundsAlignV: "middle",
			align: "center",
			dropShadow: true, dropShadowColor: "#000000", dropShadowAlpha: 0.65, dropShadowBlur: 6, dropShadowDistance: 2, padding: 12,
			// fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
			// fill: "#8ff0d6",
			// boundsAlignH: "center",
			// boundsAlignV: "middle",
			// align: "center",
			// stroke:'#ffffff',
			// strokeThickness:3,
	  },this._grpBanner);
	  this._valueWon.anchor.set(0.5, 0.5);
  

	  TweenMax.to(this._grpBanner.scale, 0.6, {
			x: 1,
			y: 1,
			ease: Linear.easeNone,
			useFrames: false,
			callbackScope: this,
			onComplete: function(){
				this._timerFunc = game.time.events.add(800, function(){
					this.goToFeature();
				}, this);
			}
		});

	};
  
	this.goToFeature = function(data1, data2) {
	  this.removeBanner();
	};
  
	this.removeBanner = function(data1, data2, bgBanner) {
  
	  this.remove();
	  GlobalClass.GAME_BANNER = false;
	  gameplayState.changeScreen(2);
	};
  
	this.remove = function() {
	  if (this._grpPosition != null) {
		this._grpPosition.destroy();
		this._grpPosition = null;
	  }
  
	  if (this._grpTransparent != null) {
		this._grpTransparent.destroy();
		this._grpTransparent = null;
	  }
  
	  if (this._grpTimeBanner != null) {
		this._grpTimeBanner.destroy();
		this._grpTimeBanner = null;
	  }
  
	  gameplayState._winScatter = null;
	};
  
  
  
  
  
	// landscape and portrait
	this.checkResolution = function() {
	  if (AppConstants.LANDSCAPE) {
		this.createLandscape();
	  } else {
		this.createPortrait();
	  }
	};
  
	this.createLandscape = function() {

	  // RAGNAROK layout: jackpot sparks fly to the jackpot column on the left (the vault is gone)
	  this._bomX = 207;
	  this._bomY = 150;

	  //this._grpPosition.x = this._posLandscapeX;
	 // this._grpPosition.y = this._posLandscapeY;
	 // this._grpPosition.scale.set(1,1);
  
	  //this._sprTransparent.width = GlobalClass.STAGE_WIDTH;
	  //this._sprTransparent.height = GlobalClass.STAGE_HEIGHT;
	};
  
	this.createPortrait = function() {

	  this._bomX = game.world.centerY*2 - 100;
	  this._bomY = 150;
	 // this._grpPosition.x = this._posPortraitX;
	 // this._grpPosition.y = this._posPortraitY;
	 // this._grpPosition.scale.set(GlobalClass.PORTRAIT_SCALE,GlobalClass.PORTRAIT_SCALE);
	  //this._sprTransparent.width = GlobalClass.STAGE_HEIGHT;
	  //this._sprTransparent.height = GlobalClass.STAGE_WIDTH;
	};
  }
  