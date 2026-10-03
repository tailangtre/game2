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
			fontFamily:"Times New Roman",
            fill: "#D4CE84",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center",
            stroke:'#000',
            strokeThickness:3
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
                fontFamily:"Times New Roman",
                fontWeight:"bold",
                fill: "#ffffac",
                boundsAlignH: "center",
                boundsAlignV: "middle",
                align: "center",
                stroke:'#5a2800',
                strokeThickness:5,
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

        var titleBanner =  game.add.sprite(0, -97,winImgName, winTitle, this._grpBannerAnim);
        titleBanner.anchor.set(0.5, 0.5);

        this._winAmountTxt = game.add.text(titleBanner.x, titleBanner.y + 105, 0, this._style);
        this._winAmountTxt.anchor.set(0.5, 0.5);
        this._grpBannerAnim.addChild(this._winAmountTxt);

        var scale = 0.8;
        if(AppConstants.LANDSCAPE){
            scale = 1.0;
		}
		

		TweenMax.to(this._grpBannerAnim.scale, 0.5, {
			x:scale, 
			y:scale,
			ease: Linear.easeNone,
			useFrames: false,
			callbackScope: this,
			onComplete:function(){
                winBanner.animations.play('anim');
                if(this._grpCoin){
                    if(AppConstants.LANDSCAPE){
                        this._grpCoin.x = game.world.centerX;
                        this._grpCoin.y = game.world.centerY;
                    }
                    else{
                        this._grpCoin.x = game.world.centerY;
                        this._grpCoin.y = game.world.centerX; 
                    }
                    this._timerCoin = game.time.events.loop(100, this.createCoin, this);
                }
                
	
				if(this._type!=1 && this._grpStar){
                    
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
        }
        else{
            this._winAmountTxt.text = GlobalClass.currency()+myNumeral(this._currentValue*GlobalClass.trueCoinValue()).format('0,0.00');
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
            this._coinClass.create();
        }
        else{
            if (this._timerCoin != null) {
                game.time.events.remove(this._timerCoin);
            }
        }
    };

    this.destroyWinning = function() {
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
