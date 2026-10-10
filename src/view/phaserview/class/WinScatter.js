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
	var PIGGY_CHARGE_S = 2.0;      // charge / grow time (tom 2026-10-06: more dramatic powder-keg charge)
	var PIGGY_CHARGE_SCALE = 1.32; // size reached while charging
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
			symbol._charging = true;                                   // no win-line animation on it while it charges
			if (src.animations && src.animations.animations) {         // ...and hide one left on screen (tom 2026-10-10: two kegs)
				for (var an in src.animations.animations) { var A = src.animations.animations[an]; if (A) { A.stop && A.stop(); A.visible = false; } }
			}
			// the powder keg charges (tom 2026-10-06: "more dramatic"): it swells, shakes harder and harder, glows
			// coral-red with a quickening heartbeat, the fuse throws sparks, and it flashes white just before it blows
			var glw = new PIXI.Sprite(softGlowTexture(0xff4b3e, 120, 120, 60, 70));
			glw.anchor.set(0.5, 0.5); glw.x = src.x; glw.y = src.y; glw.alpha = 0;
			// normal blend: an additive glow lit up the cell panel under it as a hard-edged square
			reel._grpSymbolAnim.addChildAt(glw, reel._grpSymbolAnim.getChildIndex(spr));   // behind the keg
			var sparks = new PIXI.Container(); reel._grpSymbolAnim.addChild(sparks);
			var c0 = { symbol: symbol, src: src, spr: spr, glw: glw, sparks: sparks, p: { v: 0, t: 0 } };
			charged.push(c0);
			(function (c) {
				var bx = c.src.x, by = c.src.y;
				var spark = function (k) {
					var g = new PIXI.Graphics(); var hot = Math.random() < 0.5;
					g.beginFill(hot ? 0xffd27a : 0xff6a3d, 1); g.drawCircle(0, 0, 2 + Math.random() * 3 * (0.6 + k)); g.endFill();
					g.blendMode = PIXI.BLEND_MODES.ADD;
					var s0 = c.spr.scale.x;
					g.x = bx + 34 * s0; g.y = by - 40 * s0;                         // the fuse tip (top right of the keg)
					c.sparks.addChild(g);
					var ang = -Math.PI / 2 + (Math.random() - 0.3) * 1.8, sp = 40 + Math.random() * 90 * (0.5 + k);
					TweenMax.to(g, 0.45 + Math.random() * 0.35, { x: g.x + Math.cos(ang) * sp, y: g.y + Math.sin(ang) * sp + 20, alpha: 0, ease: Power2.easeOut,
						onComplete: function () { if (g.parent) g.parent.removeChild(g); g.destroy(); } });
				};
				TweenMax.to(c.p, PIGGY_CHARGE_S, { v: 1, t: PIGGY_CHARGE_S, ease: Linear.easeNone, onUpdate: function () {
					if (c.spr._destroyed) return;
					var v = c.p.v, e = v * v;                                        // builds up slowly, then fast
					var k = 1 + (PIGGY_CHARGE_SCALE - 1) * (0.3 * v + 0.7 * e);
					var amp = 0.5 + 7 * e, rot = 0.07 * e;
					c.spr.scale.set(k);
					c.spr.x = bx + (Math.random() * 2 - 1) * amp; c.spr.y = by + (Math.random() * 2 - 1) * amp;
					c.spr.rotation = (Math.random() * 2 - 1) * rot;
					var beat = 0.75 + 0.25 * Math.sin(c.p.t * (6 + 26 * v));         // a quickening heartbeat
					c.glw.scale.set(k * (1.0 + 0.25 * v) * (0.95 + 0.1 * beat));
					c.glw.alpha = (0.1 + 0.6 * v) * beat;
					if (Math.random() < 0.25 + 1.6 * v) spark(v);
					if (v > 0.93 && !c.flashed) {                                     // white flash just before the burst
						c.flashed = true;
						var fl = new PIXI.Sprite(softGlowTexture(0xffffff, 140, 140, 70, 60)); fl.anchor.set(0.5, 0.5);
						fl.x = bx; fl.y = by; fl.blendMode = PIXI.BLEND_MODES.ADD; fl.alpha = 0; fl.scale.set(k);
						c.sparks.addChild(fl);
						TweenMax.to(fl, 0.12, { alpha: 1, yoyo: true, repeat: 1, onComplete: function () { if (fl.parent) fl.parent.removeChild(fl); fl.destroy(); } });
					}
				} });
			})(c0);
		}
		var self = this;
		this._timerFunc = game.time.events.add(PIGGY_CHARGE_S * 1000, function(){
			var triggers = self.piggyTriggers();
			for (var j = 0; j < charged.length; j++) {
				var c = charged[j];
				TweenMax.killTweensOf(c.spr); TweenMax.killTweensOf(c.spr.scale); TweenMax.killTweensOf(c.p);
				c.symbol._charging = false;
				if (!c.spr._destroyed) { c.spr.x = c.src.x; c.spr.y = c.src.y; c.spr.tint = 0xffffff; }
				(function (sp) { setTimeout(function () { sp.children.slice().forEach(function (ch) { TweenMax.killTweensOf(ch); }); if (sp.parent) sp.parent.removeChild(sp); sp.destroy({ children: true }); }, 900); })(c.sparks);
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
  