var historyClass = function(game, group,data) {
	this._grpPaytable = null;
	this._grpPage = null;
	this._grpArrow = null;
  
    this._pageCount = 1;
    this.pageSize = 4;
    
    this.data = data;
  
    this._pageMax = (data.length-1)/this.pageSize+1;

	this._startX = 0;
	this._endX = 0;
	this._moving = false;
	this.startPoint = {};
	this.endPoint = {};
  
	this.create = function() {
		GlobalClass.GAME_OPTION = true;
		// game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_ACTIVE");
	
	  this._grpPaytable = game.add.group();
	  group.addChild(this._grpPaytable);
  
	  this._grpPage = game.add.group();
	  group.addChild(this._grpPage);
  
	  this._grpMask = game.add.group();
	  group.addChild(this._grpMask);

	  this._style1 = {
		fontSize:"18px",
		fontFamily:"Times New Roman",
		fill: "#ffffff",
		align: "center"
	};


	this._style4 = {
		fontSize:"20px",
		fontFamily:"Times New Roman",
		fill: "#ffffff",
		align: "center"
	};

	this._style2 = {
		fontSize:"20px",
		fontFamily:"Times New Roman",
		fill: "#da9f33",
		align: "center"
	};

	this._style3 = {
		fontSize:"22px",
		fontFamily:"Times New Roman",
		fill: "#ffffff",
		align: "center"
	};
  
	  if (AppConstants.LANDSCAPE) {
		this.createLandscape();
	  } else {
		this.createPortrait();
	  }
	};
  
	this.createLandscape = function() {
	  this._pageCount = 1;
	  GlobalClass.deleteChildren(this._grpPaytable);
	  GlobalClass.deleteChildren(this._grpMask);
	  GlobalClass.deleteChildren(this._grpPage);
	  this._grpPage.x = 0;
	  this._grpPaytable.scale.set(1,1);
	  var bgTransparent = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpPaytable);
	  bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
	  bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
	  bgTransparent.interactive = true;
  
	  this._backgroundWinplan = game.add.sprite(game.world.centerX, 320, 'paytable', 'Paytable-Frame.png', this._grpPaytable);
	  this._backgroundWinplan.anchor.set(0.5, 0.5);
  
	//   var logo = game.add.sprite(game.world.centerX+8, 40, 'ui', 'Title.png', this._grpPaytable);
	//   logo.anchor.set(0.5, 0.5);
  
	  this.createPageLandscape();
  
	  this._sprMask = game.add.graphics();
	  this._sprMask.beginFill(0xffffff);
	  this._sprMask.drawRect(game.world.centerX - 425, 73,850, 510);
	  this._grpMask.addChild(this._sprMask);
	  this._grpPage.mask = this._sprMask;
	  
	  this.bindSwip(this._sprMask);
  
	  this._buttonClose = game.add.button(this._backgroundWinplan.x+this._backgroundWinplan.width/2-80, this._backgroundWinplan.y-this._backgroundWinplan.height/2+32, 'ui', this.closePage, this, "close-button-hov.png", "close-button.png", "close-button-clk.png", null, this._grpPaytable);
	  this._buttonClose.anchor.set(0.5, 0.5);
	  this._grpPaytable.addChild(this._buttonClose);
  
	  this._arrowLeft = game.add.button(this._backgroundWinplan.x-this._backgroundWinplan.width/2+36, this._backgroundWinplan.y-5, 'ui', this.prevPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
  
	  this._arrowLeft.anchor.set(0.5, 0.5);
  
	  this._arrowRight = game.add.button(this._backgroundWinplan.x+this._backgroundWinplan.width/2-37, this._backgroundWinplan.y-6, 'ui', this.nextPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
  
	  this._arrowRight.anchor.set(0.5, 0.5);
	  this._arrowRight.rotation = 3.14;
	//   this._bulletObj = {};
	//   for(var i=1;i<=this._pageMax;i++){
	// 	this._bulletObj["bullet"+i] = game.add.sprite(game.world.centerX+(i-6)*40, this._backgroundWinplan.y+this._backgroundWinplan.height/2-30, 'ui', 'Bullet-inactive.png', this._grpPaytable);
	// 	this._bulletObj["bullet"+i].anchor.set(0.5, 0.5);
	// 	this._bulletObj["bulletActive"+i] = game.add.sprite(game.world.centerX+(i-6)*40, this._backgroundWinplan.y+this._backgroundWinplan.height/2-30, 'ui', 'Bullet-active.png', this._grpPaytable);
	// 	this._bulletObj["bulletActive"+i].anchor.set(0.5, 0.5);
	//   }
	  //this.changePageLandscape(this._pageCount);
	  this.checkButton();
	};

	this.bindSwip = function(panel){
		var self = this;
		panel.interactive = true;
		panel.buttonMode = true;
		panel.on('pointerdown', (event) => {
			self.startPoint = {};
			self.startPoint.x = event.data.global.x;
			self.startPoint.y = event.data.global.y;
		});
		panel.on('pointerup', (event) => {
			self.endPoint = event.data.global;
			var threshold = 40;
			if((self.startPoint.x - self.endPoint.x)<-1*threshold){
				self.prevPaytable(true);
			}
			else if((self.startPoint.x - self.endPoint.x)>threshold){
				self.nextPaytable(true);
			}
		});
	};
  
	this.createPortrait = function() {
	  this._pageCount = 1;
	  GlobalClass.deleteChildren(this._grpPaytable);
	  GlobalClass.deleteChildren(this._grpMask);
	  GlobalClass.deleteChildren(this._grpPage);
	  this._grpPage.x = 0;
	  this._grpPaytable.scale.set(1,1);
	  var bgTransparent = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpPaytable);
	  bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
	  bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
	  bgTransparent.interactive = true;
  
	  this._backgroundWinplan = game.add.sprite(game.world.centerY, game.world.centerX, 'paytable', 'frame.png', this._grpPaytable);
	  this._backgroundWinplan.anchor.set(0.5, 0.5);
  
	  var logo = game.add.sprite(game.world.centerY, 50, 'ui', 'Title.png', this._grpPaytable);
	  logo.anchor.set(0.5, 0.5);
  
	  this.createPagePotrait();
  
	  this._sprMask = game.add.graphics();
	  this._sprMask.beginFill(0xffffff);
	  this._sprMask.drawRect(game.world.centerY - 255, game.world.centerX-415,508, 847);
	  this._grpMask.addChild(this._sprMask);
	  this._grpPage.mask = this._sprMask;

	  this.bindSwip(this._sprMask);
  
	  this._buttonClose = game.add.button(this._backgroundWinplan.x+this._backgroundWinplan.width/2-80-6, this._backgroundWinplan.y-this._backgroundWinplan.height/2+32-6, 'paytable', this.closePage, this, "close-button-hov.png", "close-button.png", "close-button-clk.png", null, this._grpPaytable);
	  this._buttonClose.anchor.set(0.5, 0.5);
  
	  this._arrowLeft = game.add.button(this._backgroundWinplan.x-this._backgroundWinplan.width/2+36, this._backgroundWinplan.y+13, 'paytable', this.prevPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
	  this._arrowLeft.anchor.set(0.5, 0.5);
  
	  this._arrowRight = game.add.button(this._backgroundWinplan.x+this._backgroundWinplan.width/2-37, this._backgroundWinplan.y+13, 'paytable', this.nextPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
	  this._arrowRight.anchor.set(0.5, 0.5);
	  this._arrowRight.rotation = 3.14;

    //   this._bulletObj = {};
    //   var t = this._pageMax/2;
	//   for(var i=1;i<=this._pageMax;i++){
	// 	this._bulletObj["bullet"+i] = game.add.sprite(game.world.centerY+(i-t)*40, this._backgroundWinplan.y+this._backgroundWinplan.height/2-30, 'paytable', 'Bullet-inactive.png', this._grpPaytable);
	// 	this._bulletObj["bullet"+i].anchor.set(0.5, 0.5);
	// 	this._bulletObj["bulletActive"+i] = game.add.sprite(game.world.centerY+(i-t)*40, this._backgroundWinplan.y+this._backgroundWinplan.height/2-30, 'paytable', 'Bullet-active.png', this._grpPaytable);
	// 	this._bulletObj["bulletActive"+i].anchor.set(0.5, 0.5);
	//   }
	  this.checkButton();
	};
  
	this.createPageLandscape = function(){
	  if(this._pageMax<1){
		this._pageMax = 1;
	  }
	  for(var i=1;i<=this._pageMax;i++){
		var x = game.world.centerX + (i-1)*850-425;
		var page = game.add.group();
		page.x = x;
		page.y = 0;
        this._grpPage.addChild(page);
        var start = (i-1)*this.pageSize;
        var lineX = 0;
        var lineY = 100;

		var roundid = GlobalClass.getXMLByKey(game,"history roundid");
		var coinvalue = GlobalClass.getXMLByKey(game,"history coinvalue");
		var totalbet = GlobalClass.getXMLByKey(game,"history totalbet");
		var totalwin = GlobalClass.getXMLByKey(game,"history totalwin");
		var reelview = GlobalClass.getXMLByKey(game,"history reelview");
		
		GlobalClass.checkString(roundid,lineX+20,lineY,false,"small", "15px Arial", page,this._style2);
		GlobalClass.checkString(coinvalue,lineX+240,lineY,false,"small", "15px Arial", page,this._style2);
		GlobalClass.checkString(totalbet,lineX+380,lineY,false,"small", "15px Arial", page,this._style2);
		GlobalClass.checkString(totalwin,lineX+520,lineY,false,"small", "15px Arial", page,this._style2);
		GlobalClass.checkString(reelview,lineX+660,lineY,false,"small", "15px Arial", page,this._style2);
		
        

        lineY = 150;
        for(var k=0;k<this.pageSize;k++){
            if(start+k>this.data.length-1){
                continue;
            }
            var item = this.data[start+k];
            GlobalClass.checkString(item.gameId,lineX+20,lineY+k*115,false,"small", "15px Arial", page,this._style1);
            GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.coinValue).format('0,0.00')+"",lineX+240,lineY+k*115,false,"small", "15px Arial", page,this._style1);
            GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.totalBet).format('0,0.00')+"",lineX+380,lineY+k*115,false,"small", "15px Arial", page,this._style1);
            GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.totalWin).format('0,0.00')+"",lineX+520,lineY+k*115,false,"small", "15px Arial", page,this._style1);
            
            var reelViewGrp = game.add.group();
            reelViewGrp.x = lineX+650;
            reelViewGrp.y = lineY+k*115;
            page.addChild(reelViewGrp);
            var symbolY = 0;
            for(var j=0;j<item.reelsView.reels.length;j++){
                var reel = item.reelsView.reels[j];
                var symbolX = 0;
                for(var h=0;h<reel.length;h++){
                    var syb = GlobalClass.mathSymbol(reel[h]);
                    var sprSymbol = game.add.sprite(symbolX+h*35, symbolY+j*30, syb.assetName, syb.symbolPngName,reelViewGrp);
                    sprSymbol.anchor.set(0);
                    sprSymbol.scale.set(0.15);
                }
            }
        }

		
	  }
	};
  
	this.createPagePotrait = function(){
		if(this._pageMax<1){
			this._pageMax = 1;
		  }
		for(var i=1;i<=this._pageMax;i++){
		    var x = game.world.centerY + (i-1)*508 - 254;
		    var page = game.add.group();
			page.x = x;
			page.y = 320;
			this._grpPage.addChild(page);
			var start = (i-1)*this.pageSize;
            var lineX = 0;
			var lineY = 100;
			
			var coinvalue = GlobalClass.getXMLByKey(game,"history coinvalue");
			var totalbet = GlobalClass.getXMLByKey(game,"history totalbet");
			var totalwin = GlobalClass.getXMLByKey(game,"history totalwin");
			var reelview = GlobalClass.getXMLByKey(game,"history reelview");

            GlobalClass.checkString(coinvalue,lineX-10,lineY,false,"small", "15px Arial", page,this._style2);
            GlobalClass.checkString(totalbet,lineX+140,lineY,false,"small", "15px Arial", page,this._style2);
            GlobalClass.checkString(totalwin,lineX+260,lineY,false,"small", "15px Arial", page,this._style2);
            GlobalClass.checkString(reelview,lineX+380,lineY,false,"small", "15px Arial", page,this._style2);

            lineY = 150;
            for(var k=0;k<this.pageSize;k++){
                if(start+k>this.data.length-1){
                    continue;
                }
                var item = this.data[start+k];
                GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.coinValue).format('0,0.00'),lineX+10,lineY+k*115,false,"small", "15px Arial", page,this._style1);
                GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.totalBet).format('0,0.00'),lineX+110,lineY+k*115,false,"small", "15px Arial", page,this._style1);
                GlobalClass.checkString(GlobalClass.currency()+ myNumeral(item.totalWin).format('0,0.00'),lineX+230,lineY+k*115,false,"small", "15px Arial", page,this._style1);
                
                var reelViewGrp = game.add.group();
                reelViewGrp.x = lineX+330;
                reelViewGrp.y = lineY+k*115;
                page.addChild(reelViewGrp);
                var symbolY = 0;
                for(var j=0;j<item.reelsView.reels.length;j++){
                    var reel = item.reelsView.reels[j];
                    var symbolX = 0;
                    for(var h=0;h<reel.length;h++){
                        var syb = GlobalClass.mathSymbol(reel[h]);
                        var sprSymbol = game.add.sprite(symbolX+h*35, symbolY+j*30, syb.assetName, syb.symbolPngName,reelViewGrp);
                        sprSymbol.anchor.set(0);
                        sprSymbol.scale.set(0.15);
                    }
                }
            }
			
		} 
	};
  
	this.pageDown=function(){
	  this._startX = game.input.x;
	};
  
	this.pageUp=function(){
	  this._endX = game.input.x;
	  var distance = this._endX - this._startX;
	  var direction = '';
	  if(distance>50){
		this.prevPaytable(true);
	  }
	  else if(distance<-50){
		this.nextPaytable(true);
	  }
	};
  
	this.changePageLandscape = function(direction) {
	  var x = 0;
	  if(direction=='l'){
		x = this._grpPage.x-850;
	  }
	  else if(direction=='r'){
		x = this._grpPage.x+850;
	  }

	  TweenMax.to(this._grpPage, 0.2, {
			x: x,
			ease: Linear.easeNone,
			useFrames: false,
			callbackScope: this,
			onComplete: function(){
				this._moving =false;
			}
		});
	};

	//   var pageTween = game.add.tween(this._grpPage).to({
	// 	x: x
	//   }, 200, "Linear", true, 0, 0);
	//   pageTween.onComplete.add(function(){
	// 	this._moving =false;
	//   }, this);
	// };
  
	this.changePagePotrait = function(direction) {
	  var x = 0;
	  if(direction=='l'){
		x = this._grpPage.x-508;
	  }
	  else if(direction=='r'){
		x = this._grpPage.x+508;
	  }

	  TweenMax.to(this._grpPage, 0.2, {
			x: x,
			ease: Linear.easeNone,
			useFrames: false,
			callbackScope: this,
			onComplete: function(){
				this._moving =false;
			}
		});

	//   var pageTween = game.add.tween(this._grpPage).to({
	// 	x: x
	//   }, 200, "Linear", true, 0, 0);
	//   pageTween.onComplete.add(function(){
	// 	this._moving =false;
	//   }, this);
	};
  
	this.nextPaytable = function(noSound) {
	  if(this._moving){
		return;
	  }
	  if(!noSound){
		soundClass.playSound("soundbtnclick");
	  }
	  this._pageCount++;
	  if(this._pageCount>this._pageMax){
		this._pageCount = this._pageMax;
		return;
	  }
  
	  this.checkButton();
	  this._moving = true;
	  if (AppConstants.LANDSCAPE) {
		this.changePageLandscape('l');
	  } else {
		this.changePagePotrait('l');
	  }
	};
  
	this.prevPaytable = function(noSound) {
	  if(this._moving){
		  return;
	  }
  
	  if(!noSound){
		soundClass.playSound("soundbtnclick");
	  }
	  this._pageCount--;
	  if(this._pageCount<1){
		this._pageCount = 1;
		return;
	  }
	  this.checkButton();
	  this._moving = true;
	  if (AppConstants.LANDSCAPE) {
		this.changePageLandscape('r');
	  } else {
		this.changePagePotrait('r');
	  }
	};
  
	this.checkButton = function() {
	  if (this._pageCount >= this._pageMax) {
		this._pageCount = this._pageMax;
	  }
  
	  if (this._pageCount <= 1) {
		this._pageCount = 1;
	  }
	  this.setBullet();
	};
  
	this.setBullet=function(){
	//   for(var i=1;i<=this._pageMax;i++){
	// 	if(i==this._pageCount){
	// 	  this._bulletObj["bullet"+i].visible = false;
	// 	  this._bulletObj["bulletActive"+i].visible = true;
	// 	}
	// 	else{
	// 	  this._bulletObj["bullet"+i].visible = true;
	// 	  this._bulletObj["bulletActive"+i].visible = false;
	// 	}
	//   }
	}
  
	this.closePage = function() {
		GlobalClass.GAME_OPTION = false;
		// game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_INACTIVE");
	  soundClass.playSound("soundbtnclick");
  
	  if (this._grpPaytable != null) {
		this._grpPaytable.destroy();
		this._grpPaytable = null;
	  }
  
	  if (this._grpPage != null) {
		this._grpPage.destroy();
		this._grpPage = null;
	  }
  
	  if (this._grpMask != null) {
		this._grpMask.destroy();
		this._grpMask = null;
	  }
	  gameplayState._historyClass = null;
	};
  }
  