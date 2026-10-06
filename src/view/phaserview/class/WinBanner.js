var bannerClass = function(game, group) {
    this._posLandscapeX = 0;
    this._posLandscapeY = 0;
    this._posPortraitX = 0;
    this._posPortraitY = 0;
    this._grpPosition = null;

    this._posX = 0;
    this._posY = 0;

    this._grpValue = null;
    this._grpBanner = null;
    this._grpBannerAnim = null;
    this._grpShine = null;

    this._currentValue = 0;
    this._totalValue = 0;
    this._addValue = 0;
    this._sumValue = 0;

    this._grpStar = null;
    this._grpCoin = null;
    this._starClass = null;
    this._coinClass = null;

    this._bgBanner = null;

    this._typeWin = null;

    this._soundCount = 0;
    this._soundTrigger = 5;

    this.create = function(type, value) {
        this._grpPosition = game.add.group();
        group.addChild(this._grpPosition);

        this._grpBanner = game.add.group();
        this._grpPosition.addChild(this._grpBanner);

        this._grpFX = new PIXI.Container();               // light rays + flash behind the banner (tom 2026-10-04)
        this._grpPosition.addChild(this._grpFX);

        this._grpStar = game.add.group();
        this._grpPosition.addChild(this._grpStar);

        this._grpCoin = game.add.group();
        this._grpPosition.addChild(this._grpCoin);

        this._grpBannerAnim = game.add.group();
        this._grpPosition.addChild(this._grpBannerAnim);
        this._grpBannerAnim.x = game.world.centerX;
        this._grpBannerAnim.y = game.world.centerY;
        this._grpBannerAnim.scale.set(0.0,0.0);

        this._grpValue = game.add.group();
        this._grpPosition.addChild(this._grpValue);
        this._grpValue.x = game.world.centerX;

        this.checkResolution();

        this._style = {
			fontSize:"60px",
			fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#e4f7f2",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center",
      dropShadow: true, dropShadowColor: "#000000", dropShadowAlpha: 0.65, dropShadowBlur: 6, dropShadowDistance: 2, padding: 12
        };


        GlobalClass.GAME_BANNER = true;

        this._type = type;
        this._totalValue = value;

        this._bgBanner = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpBanner);
        this._bgBanner.width = GlobalClass.STAGE_WIDTH * 2;
        this._bgBanner.height = GlobalClass.STAGE_HEIGHT * 2;
        this._bgBanner.interactive = true;

        if(this._type==6){
            var fontSize = "48px";
            if (AppConstants.LANDSCAPE) {
                this._grpValue.x = game.world.centerX; 
                this._grpValue.y = game.world.centerY; 
            }
            else{
                fontSize = "36px";
                this._grpValue.x = game.world.centerY+80; 
                this._grpValue.y = game.world.centerX; 
            }
            
            var posX;
            var posY;
            if (AppConstants.LANDSCAPE) {
                posX = 0;
                posY = -20;
              } else {
                posX = 0;
                posY = 80;
              }
            this._grpValue.scale.set(0);
            this._txtInfo = game.add.text(posX,posY, GlobalClass.getXMLByKey(game, "infofreespin"), {
				fontSize:fontSize,
                fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
                fontWeight:"bold",
                fill: "#e4f7f2",
                boundsAlignH: "center",
                boundsAlignV: "middle",
                align: "center",
                dropShadow: true, dropShadowColor: "#000000", dropShadowAlpha: 0.65, dropShadowBlur: 6, dropShadowDistance: 2, padding: 12,
            },this._grpValue);
            this._txtInfo.anchor.set(0.5,0.5);

            // var tweenTxt = game.add.tween(this._grpValue.scale).to({
            //     x:1,y:1
			// }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0,false);

			TweenMax.to(this._grpValue.scale, 0.2, {
				x:1,
				y:1,
				ease: Linear.easeNone,
				useFrames: false
			});
			

            game.time.events.add(1800,function(){
                this.destroyWinning();
            },this);

            return;
        }

        var wingLeft =  game.add.sprite(-220, -10, 'ui', "wing.png", this._grpBannerAnim);
        wingLeft.anchor.set(1, 1);
        wingLeft.rotation = -3;
		//game.add.tween(wingLeft).to( { rotation:0},400, "Linear", true,0,0);
		
		TweenMax.to(wingLeft, 0.2, {
			rotation:0,
			ease: Linear.easeNone,
			useFrames: false
		});


        var wingRight =  game.add.sprite(220, -10, 'ui', "wing2.png", this._grpBannerAnim);
        wingRight.anchor.set(0, 1);
        wingRight.rotation = 3;
		//game.add.tween(wingRight).to( { rotation:0},400, "Linear", true,0,0);
		
		TweenMax.to(wingRight, 0.2, {
			rotation:0,
			ease: Linear.easeNone,
			useFrames: false
		});

        var winBanner =  game.add.sprite(0, 0, 'ui', 'winbanner_000.png', this._grpBannerAnim);
		winBanner.anchor.set(0.5, 0.5);
		var textures = winBanner.animations.generateFrameNames("winbanner_", 0, 3, '.png', 3);
        winBanner.animations.add('anim', textures,true,0.1);
        var winImgName = "ui";
        if(GlobalClass.GAME_LANG=='zh'){
            winImgName = "ui_zh";
        }
        var winTitle = "";
        switch (this._type) {
            case 1: // bigwin
                soundClass.playSound("soundwinbig");
                winTitle = "Big-win_font.png";
                if(GlobalClass.GAME_LANG=='zh'){
                    winTitle = "Big-Win-CH.png";
                }
                this._addValue = this._totalValue / 80; //8sec
                break;
            case 2: // hugewin
                soundClass.playSound("soundwinhuge");
                winTitle = "Huge-win-font.png";
                if(GlobalClass.GAME_LANG=='zh'){
                    winTitle = "Huge-Win-CH.png";
                }
                this._addValue = this._totalValue / 120; //14sec
                break;
            case 3: //massivewin
                soundClass.playSound("soundwinmassive");
                winTitle = "Massive-win-font.png";
                if(GlobalClass.GAME_LANG=='zh'){
                    winTitle = "Massive-Win-CH.png";
                }
                this._addValue = this._totalValue / 230; //20 sec
                break;
            case 4: //massivewin
                winTitle = "Total-win_font.png";
                if(GlobalClass.GAME_LANG=='zh'){
                    winTitle = "Total-Win-CH.png";
                }
                this._addValue = this._totalValue / 30; //20 sec
                break;
            case 5: //massivewin
                winTitle = "Total-Jackpot.png";
                if(GlobalClass.GAME_LANG=='zh'){
                    winTitle = "Total-jackpot-Win-CH.png";
                }
                this._addValue = this._totalValue / 100; //20 sec
                break;
        }

        // tier win banners (tom 2026-10-04): BIG / HUGE / MASSIVE each have their own full banner art
        // (title + window); the amount counts up inside the window
        var TIER_BANNER = { 1: ['banner-big.png', 85, 369], 2: ['banner-huge.png', 100, 380], 3: ['banner-massive.png', 96, 330], 4: ['banner-total.png', 73, 380] };   // window centre y + inner width (stage px), measured on the art
        var tb = GlobalClass.GAME_LANG != 'zh' ? TIER_BANNER[this._type] : null;
        var titleBanner, amountY;
        if (tb) {
            winBanner.visible = false;
            titleBanner = game.add.sprite(0, -20, 'ui', tb[0], this._grpBannerAnim);
            titleBanner.anchor.set(0.5, 0.5);
            titleBanner.scale.set(0.5);                                   // banner art is 2x (sharper)
            // soft glow behind the banner, breathing. A pre-faded glow texture (softGlowTexture, JackpotClass.js) instead of a
            // blurred copy: the BlurFilter was cut off at its bounds (tom 2026-10-06: "the aura ... still clipped at the edge")
            var bw = titleBanner.texture.width * 0.5, bh = titleBanner.texture.height * 0.5;
            var glowSpr = new PIXI.Sprite(softGlowTexture(0x3dffd0, Math.round(bw * 0.86), Math.round(bh * 0.72), 70, 90));
            glowSpr.anchor.set(0.5, 0.5); glowSpr.x = 0; glowSpr.y = -20;
            glowSpr.blendMode = PIXI.BLEND_MODES.ADD;
            glowSpr.alpha = 0.25;
            this._grpBannerAnim.addChildAt(glowSpr, this._grpBannerAnim.getChildIndex(titleBanner));   // behind the banner
            TweenMax.to(glowSpr, 0.9, { alpha: 0.75, repeat: -1, yoyo: true, ease: Sine.easeInOut });
            TweenMax.to(titleBanner.scale, 0.9, { x: 0.515, y: 0.515, repeat: -1, yoyo: true, ease: Sine.easeInOut });   // gentle pulse
            TweenMax.to(glowSpr.scale, 0.9, { x: 1.06, y: 1.06, repeat: -1, yoyo: true, ease: Sine.easeInOut });
            this._pulseTargets = [glowSpr, glowSpr.scale, titleBanner.scale];
            amountY = titleBanner.y + tb[1];
            // amount: engraved-gold serif, matching the jackpot values
            this._style = {
                fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: "bold", fontSize: "58px", letterSpacing: 2,
                fill: ["#fbf5e6", "#e8dcc2", "#a8916a"], fillGradientStops: [0, 0.55, 1], align: "center",
                dropShadow: true, dropShadowColor: "#140b02", dropShadowAlpha: 0.9, dropShadowBlur: 6, dropShadowDistance: 3, padding: 14
            };
        } else {
            titleBanner = game.add.sprite(0, -97, winImgName, winTitle, this._grpBannerAnim);
            titleBanner.anchor.set(0.5, 0.5);
            amountY = titleBanner.y + 105;
        }

        this._winAmountTxt = game.add.text(titleBanner.x, amountY, 0, this._style);
        this._winAmountTxt.anchor.set(0.5, 0.5);
        if (tb) {
            // the amount lives INSIDE the banner sprite, centred in its window, so it pulses and scales with it
            titleBanner.addChild(this._winAmountTxt);
            this._winAmountTxt.position.set(0, tb[1] / titleBanner.scale.x);
            this._amountFit = { maxW: tb[2] / titleBanner.scale.x, baseScale: 1 / titleBanner.scale.x, h: 70 / titleBanner.scale.x };
            this.fitAmount();
        } else {
            this._grpBannerAnim.addChild(this._winAmountTxt);
        }

        var scale = 0.8;
        if(AppConstants.LANDSCAPE){
            scale = 1.0;
		}
		

		if (tb) {
		    // fade the reels right down under the banner: drawn at full strength (masked reel layer) they showed through the
		    // glow as a hard-edged box (tom 2026-10-06: "the aura of the win banners still clipped a bit at the edge")
		    if (gameplayState._reelGroup) TweenMax.to(gameplayState._reelGroup, 0.3, { alpha: 0.25 });
		    this._grpBannerAnim.rotation = -0.06;
		    TweenMax.to(this._grpBannerAnim, 0.6, { rotation: 0, ease: Back.easeOut.config(2.2) });
		    this.dramaFX(this._type, scale);
		}
		TweenMax.to(this._grpBannerAnim.scale, tb ? 0.6 : 0.5, {
			x:scale,
			y:scale,
			ease: tb ? Back.easeOut.config(1.9) : Linear.easeNone,
			useFrames: false,
			callbackScope: this,
			onComplete:function(){
                if (!tb) winBanner.animations.play('anim');   // tier banners have their own art (the old frame loop drew a hard-edged glow box behind it)
                if(this._grpCoin){
                    if(AppConstants.LANDSCAPE){
                        this._grpCoin.x = game.world.centerX;
                        this._grpCoin.y = game.world.centerY;
                    }
                    else{
                        this._grpCoin.x = game.world.centerY;
                        this._grpCoin.y = game.world.centerX; 
                    }
                    // coin shower intensity by tier (tom 2026-10-04): BIG < HUGE < MASSIVE
                    var CT = { 1: [95, 0.36, 0.95], 2: [42, 0.46, 1.2], 3: [15, 0.56, 1.5], 4: [34, 0.48, 1.25] }[this._type] || [90, 0.4, 1];
                    this._coinTier = CT;
                    this._timerCoin = game.time.events.loop(CT[0], this.createCoin, this);
                    var RAIN = { 2: 110, 3: 40, 4: 80 }[this._type];   // HUGE and up: coins also rain from the top
                    if (RAIN && tb) this._timerRain = game.time.events.loop(RAIN, this.createRain, this);
                }
                
	
				if(false && this._grpStar){   // no gems any more (tom 2026-10-04)
                    
                    if(AppConstants.LANDSCAPE){
                        this._grpStar.x = game.world.centerX;
                        this._grpStar.y = game.world.centerY;
                    }
                    else{
                        this._grpStar.x = game.world.centerY;
                        this._grpStar.y = game.world.centerX; 
                    }

					this._timerStar = game.time.events.loop(150, this.createStar, this);
                }
                
				this._timerValue = game.time.events.loop(50, this.updateValue, this, type);
			}
		});

        // var winBannerTween = game.add.tween(this._grpBannerAnim.scale).to( { x:scale, y:scale},500, "Linear", true,0,0);
        // winBannerTween.onComplete.add(function(){
            
        // },this);

        
    };


    this.checkResolution = function() {
      if (AppConstants.LANDSCAPE) {
        this.createLandscape();
      } else {
        this.createPortrait();
      }
    };

    this.updateValue = function(type) {
        if (this._sumValue + this._addValue < this._totalValue) {
            if(this._type==4 || this._type==5){
                this._soundCount++;
                if (this._soundCount == this._soundTrigger) {
                    this._soundCount = 0;
                    soundClass.playSound("soundcoincounter");
                }
            }
            this._sumValue += this._addValue;
            this._currentValue = Math.floor(this._sumValue);
        } else {
            this._currentValue = this._totalValue;
            if (this._timerValue != null) {
                game.time.events.remove(this._timerValue);
            }
            if (this._timerCoin != null) {
                game.time.events.remove(this._timerCoin);
            }
            if (this._timerRain != null) {
                game.time.events.remove(this._timerRain);
            }
            if (this._timerStar != null) {
                game.time.events.remove(this._timerStar);
            }
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1 && type!=4){
                this._timerEnd = game.time.events.add(2000, this.destroyWinning, this);
            }else{
                this._timerEnd = game.time.events.add(2000, this.destroyWinning, this);
            }
            if (type == 4) {
                GlobalClass.GAME_FEATURE = false;
                gameplayState._buttonClass.setBalance();
            }
        }
        if(this._type!=5){
            this._winAmountTxt.text = GlobalClass.getFormatCurrency(this._currentValue);
            this.fitAmount();
        }
        else{
            this._winAmountTxt.text = GlobalClass.currency()+myNumeral(this._currentValue*GlobalClass.trueCoinValue()).format('0,0.00');
            this.fitAmount();
        }
    };


    this.createLandscape = function() {
        this._grpPosition.x = this._posLandscapeX;
        this._grpPosition.y = this._posLandscapeY;
        this._grpPosition.scale.set(1,1);
        this._grpBannerAnim.x = game.world.centerX;
        this._grpBannerAnim.y = game.world.centerY;
        this._grpValue.x = game.world.centerX;
    };

    this.createPortrait = function() {
        this._grpPosition.x = this._posPortraitX;
        this._grpPosition.y = this._posPortraitY;
        this._grpPosition.scale.set(GlobalClass.PORTRAIT_SCALE,GlobalClass.PORTRAIT_SCALE);
        this._grpBannerAnim.x = game.world.centerY+70;
        this._grpBannerAnim.y = game.world.centerX;
        this._grpValue.x = game.world.centerY;
    };

    this.createStar = function() {
        if(this._grpStar!=null){
            this._starClass = new starClass(game,this._grpStar);
            this._starClass.create();
        }
        else{
            if (this._timerStar != null) {
                game.time.events.remove(this._timerStar);
            }
        }
    };

    this.createCoin = function() {
        if(this._grpCoin!=null){
            this._coinClass = new coinClass(game,this._grpCoin);
            var ct = this._coinTier || [0, 0.4, 1];
            this._coinClass.create(ct[1], ct[2]);
        }
        else{
            if (this._timerCoin != null) {
                game.time.events.remove(this._timerCoin);
            }
            if (this._timerRain != null) {
                game.time.events.remove(this._timerRain);
            }
        }
    };

    // Drama per tier (tom 2026-10-04: "win banner effects need to be more dramatic"): rotating gold light rays and
    // a halo behind the banner, a flash + shockwave rings + screen shake as it lands, and an opening coin burst.
    var BANNER_FX = {
        1: { rays: 0.34, halo: 0.30, flash: 0.30, ring: 1, shake: 5,  burst: 16, spin: 16 },
        2: { rays: 0.48, halo: 0.40, flash: 0.42, ring: 2, shake: 9,  burst: 30, spin: 11 },
        3: { rays: 0.68, halo: 0.50, flash: 0.55, ring: 3, shake: 15, burst: 55, spin: 7 },
        4: { rays: 0.52, halo: 0.42, flash: 0.42, ring: 2, shake: 8,  burst: 34, spin: 10 }
    };
    this.dramaFX = function(type, scale) {
        var F = BANNER_FX[type]; if (!F || !this._grpFX) return;
        var layer = this._grpFX, self = this;
        var cx = AppConstants.LANDSCAPE ? game.world.centerX : game.world.centerY + 70;
        var cy = AppConstants.LANDSCAPE ? game.world.centerY : game.world.centerX;
        var tw = [];                                           // everything to kill on destroy
        // a deeper veil under the light, so the board and reels behind don't show through the glow as a box
        var veil = new PIXI.Graphics(); veil.beginFill(0x02070c, 1); veil.drawRect(-2000, -2000, 5280, 4720); veil.endFill();
        veil.alpha = 0; layer.addChild(veil);
        tw.push(TweenMax.to(veil, 0.4, { alpha: 0.45 }));
        var rays = new PIXI.Graphics(), n = 24, R = 900;
        for (var i = 0; i < n; i++) {
            var a0 = (i / n) * Math.PI * 2, a1 = a0 + Math.PI / n * (i % 2 ? 0.35 : 0.6);
            rays.beginFill(i % 2 ? 0x9ff7e2 : 0x3dffd0, 1); rays.moveTo(0, 0); rays.lineTo(Math.cos(a0) * R, Math.sin(a0) * R); rays.lineTo(Math.cos(a1) * R, Math.sin(a1) * R); rays.endFill();
        }
        rays.x = cx; rays.y = cy - 20; rays.alpha = 0; rays.scale.set(0.15);
        rays.blendMode = PIXI.BLEND_MODES.ADD; rays.filters = [new PIXI.filters.BlurFilter(18, 3)];
        layer.addChild(rays);
        var halo = new PIXI.Sprite(softGlowTexture(0x3dffd0, 520, 400, 200, 120)); halo.anchor.set(0.5, 0.5);   // no hard edge
        halo.x = cx; halo.y = cy - 20; halo.alpha = 0; halo.blendMode = PIXI.BLEND_MODES.ADD;
        layer.addChild(halo);
        var spin = { r: 0 };
        tw.push(TweenMax.to(spin, F.spin, { r: Math.PI * 2, repeat: -1, ease: Linear.easeNone, onUpdate: function () { rays.rotation = spin.r; } }));
        tw.push(TweenMax.to(rays, 0.5, { alpha: F.rays, ease: Power2.easeOut, delay: 0.25 }));
        tw.push(TweenMax.to(rays.scale, 0.9, { x: 1, y: 1, ease: Power3.easeOut, delay: 0.2 }));
        tw.push(TweenMax.to(rays, 1.1, { alpha: F.rays * 0.6, repeat: -1, yoyo: true, ease: Sine.easeInOut, delay: 0.75 }));
        tw.push(TweenMax.to(halo, 0.6, { alpha: F.halo, delay: 0.25 }));
        tw.push(TweenMax.to(halo.scale, 0.9, { x: 1.2, y: 1.2, repeat: -1, yoyo: true, ease: Sine.easeInOut }));
        // landing: flash, shockwave rings, shake, coin burst
        tw.push(TweenMax.delayedCall(0.32, function () {
            if (!self._grpFX) return;
            var flash = new PIXI.Graphics(); flash.beginFill(0xe0fff6, 1); flash.drawRect(-2000, -2000, 5280, 4720); flash.endFill();
            flash.blendMode = PIXI.BLEND_MODES.ADD; flash.alpha = F.flash; layer.addChild(flash);
            tw.push(TweenMax.to(flash, 0.5, { alpha: 0, ease: Power2.easeOut }));
            for (var r = 0; r < F.ring; r++) {
                var ring = new PIXI.Graphics(); ring.lineStyle(10, 0xbffbe9, 1); ring.drawCircle(0, 0, 120); ring.x = cx; ring.y = cy - 20;
                ring.blendMode = PIXI.BLEND_MODES.ADD; ring.filters = [new PIXI.filters.BlurFilter(4, 2)]; ring.alpha = 0.9; ring.scale.set(0.6);
                layer.addChild(ring);
                tw.push(TweenMax.to(ring.scale, 0.8, { x: 5, y: 5, ease: Power2.easeOut, delay: r * 0.14 }));
                tw.push(TweenMax.to(ring, 0.8, { alpha: 0, ease: Power1.easeIn, delay: r * 0.14 }));
            }
            var panel = gameplayState._panelGroup, pos = self._grpPosition;
            if (panel && pos) {
                var px = panel.x, py = panel.y, bx = pos.x, by = pos.y, sh = { v: 1 };
                tw.push(TweenMax.to(sh, 0.7, { v: 0, ease: Power1.easeOut, onUpdate: function () {
                    var dx = (Math.random() * 2 - 1) * F.shake * sh.v, dy = (Math.random() * 2 - 1) * F.shake * sh.v;
                    panel.x = px + dx; panel.y = py + dy;
                    if (self._grpPosition) { pos.x = bx + dx * 0.5; pos.y = by + dy * 0.5; }
                }, onComplete: function () { panel.x = px; panel.y = py; if (self._grpPosition) { pos.x = bx; pos.y = by; } } }));
                self._shakeHome = function () { panel.x = px; panel.y = py; };
            }
            if (self._grpCoin) {
                self._grpCoin.x = cx; self._grpCoin.y = cy;
                var ct = { 1: [0.36, 1.1], 2: [0.46, 1.35], 3: [0.56, 1.7], 4: [0.48, 1.4] }[type];
                for (var k = 0; k < F.burst; k++) new coinClass(game, self._grpCoin).create(ct[0], ct[1]);
            }
        }));
        this._fxStop = function () { tw.forEach(function (t) { t.kill(); }); if (self._shakeHome) self._shakeHome(); };
    };

    this.createRain = function() {
        if (this._grpCoin == null) { if (this._timerRain != null) game.time.events.remove(this._timerRain); return; }
        var size = (this._coinTier || [0, 0.4])[1];
        new coinClass(game, this._grpCoin).rain(size * 0.9, GlobalClass.STAGE_WIDTH || 1280, GlobalClass.STAGE_HEIGHT || 720);
    };

    /** keep the counting amount inside the banner window (shrinks only when the number gets too wide) */
    this.fitAmount = function() {
        var f = this._amountFit, t = this._winAmountTxt;
        if (!f || !t) return;
        if (t.updateText) t.updateText(true);
        var pad = (this._style.padding || 0) * 2;
        var w = t.texture.width - pad, h = t.texture.height - pad;
        var s = Math.min(1, f.maxW / (w * f.baseScale), f.h / (h * f.baseScale));
        t.scale.set(f.baseScale * s);
    };

    this.destroyWinning = function() {
        if (this._closed) return;                          // close once - closing moves the game flow on
        this._closed = true;
        if (gameplayState._reelGroup) { TweenMax.killTweensOf(gameplayState._reelGroup); gameplayState._reelGroup.alpha = 1; }
        if (this._timerEnd != null) game.time.events.remove(this._timerEnd);
        if (this._fxStop) { this._fxStop(); this._fxStop = null; }
        if (this._pulseTargets) { this._pulseTargets.forEach(function (t) { TweenMax.killTweensOf(t); }); this._pulseTargets = null; }
        if (this._grpBanner != null) {
            this._grpBanner.destroy();
            this._grpBanner = null;
        }
        if (this._grpBannerAnim != null) {
            this._grpBannerAnim.destroy();
            this._grpBannerAnim = null;
        }

        if (this._grpStar != null) {
            this._grpStar.destroy();
            this._grpStar = null;
        }
        if (this._grpCoin != null) {
            this._grpCoin.destroy();
            this._grpCoin = null;
        }
        if(this._grpPosition != null){
          this._grpPosition.destroy();
          this._grpPosition = null;
        }

        if (this._timerValue != null) {
            game.time.events.remove(this._timerValue);
        }
        if (this._timerCoin != null) {
            game.time.events.remove(this._timerCoin);
        }
        if (this._timerRain != null) {
            game.time.events.remove(this._timerRain);
        }
        if (this._timerStar != null) {
            game.time.events.remove(this._timerStar);
        }

        gameplayState._winBanner = null;
        GlobalClass.GAME_BANNER = false;

        switch (this._type) {
            case 1: // big win
            case 2:
            case 3:
                gameplayState.showPicASymbol();
                break;
            case 4:
                // game.notify.event.emit("sentMsgSolid","OTFEIM.addWin", GlobalClass.GAME_DATA.totalWin);
                gameplayState.changeScreen(1);
                break;
            case 5:
                gameplayState.startAnimationSymbol();
                break;
            case 6:
                break;

        }
    };
}
