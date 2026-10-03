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

	this.showPicaSymbol=function(){
		var maskBG = game.add.button(0, 0, 'network', this.btnClick, this, "blank.png", "blank.png", "blank.png", "", this._grpTransparent);
    	maskBG.width = GlobalClass.STAGE_WIDTH * 20;
		maskBG.height = GlobalClass.STAGE_HEIGHT * 20;
		maskBG.alpha = 0;


		this.bom = game.add.sprite(this._bomX-100,this._bomY, 'explo', 'explo_11.png', this._grpBlow);
		this.bom.anchor.set(0.5, 0.5);
		this.bom.scale.set(3);
		this.bom.visible = false;
		this._timerFunc = game.time.events.add(400, function(){
			this.bom.visible = false;
			this.showAwardSymbol();
		},this);
	};

	this.btnClick=function(){
		this.endBomFun();
	};

	this.endBomFun = function(){
		soundClass.stopSound("bom");
		TweenMax.killTweensOf(this._grpBlow);
		TweenMax.killAll(false, true, false, false);
		this.endBom();
		this.remove();
	};

	this.showAwardSymbol=function(){
		var blows = [];
		if(!GlobalClass.GAME_DATA.awardSymbols){
			this.endBom();
			return;
		}
		soundClass.playSound("bom");
		for(var i=0;i<GlobalClass.GAME_DATA.awardSymbols.length;i++){
			var smy = GlobalClass.GAME_DATA.awardSymbols[i];
			var symbol = gameplayState._reelClass.symbolBlow(smy.col,smy.row);
			var x = gameplayState._reelClass.sx+symbol._posX;
			var y = gameplayState._reelClass.sy+symbol._posY;
			var blow = game.add.sprite(x,y, 'interfaceFX', 'sparkFX_060.png', this._grpBlow);
			blow.anchor.set(0.5, 0.5);
			blow.visible = false;
			blows.push(blow);
		}

		this._timerFunc = game.time.events.add(1550, function(){
			
			for(var j=0;j<blows.length;j++){
				var blow = blows[j];
				blow.visible = true;

				TweenMax.to(blow,0.4, {
					x: this._bomX-100,
					y: this._bomY+100,
					ease: Linear.easeNone,
					useFrames: false
				});
			}
			this._timerFunc = game.time.events.add(500, function(){
			
				for(var j=0;j<blows.length;j++){
					var blow = blows[j];
					TweenMax.killTweensOf(blow);
					blow.destroy();
					blow = null;
				}

				this.bom.visible = true;
				var textures = this.bom.animations.generateFrameNames("explo_", 0, 11, '.png',2);
				this.bom.animations.add("anim", textures,false,0.4,function(){
					this.endBom();
				},this);
				this.bom.animations.play('anim');

				

			},this);

		}, this);
	};


	this.endBom = function(){
		if (this._timerFunc != null) {
			game.time.events.remove(this._timerFunc);
		}
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
			fontFamily:"Times New Roman",
			fontWeight:"bold",
			fill: "#ffffac",
			boundsAlignH: "center",
			boundsAlignV: "middle",
			align: "center",
			stroke:'#5a2800',
			strokeThickness:5,
			// fontFamily:"Times New Roman",
			// fill: "#eda02f",
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

	  this._bomX = game.world.centerX*1.4+300;
	  this._bomY = game.world.centerY+50;

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
  