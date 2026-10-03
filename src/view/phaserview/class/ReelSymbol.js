var reelsymbolClass = function(game, group) {
    this._parent = null;
    this._posX = 0;
    this._posY = 0;
    this._posRow = 0;
    this._posCol = 0;
    this._symbol = "";
    this._animSymbol = "";
    this._specialSymbol = '';

    this._speedSpinStart = 120;
    this._speedSpinLooping = 30;
    this._speedSpinFinish = 150;

    this._grpSymbol = null;
    this._sprSymbol = null;

    this._grpAnimSymbol = null;
    this._sprAnimSymbol = null;

    this._sprFrame = null;
    this._sprMask = null;

    this._symbolType = 3;

    this.create = function(parent, posX, posY, posRow, posCol, symbol,type,showAtReel) {
        this._parent = parent;
        this._posX = posX;
        this._posY = posY;
        this._posRow = posRow;
        this._posCol = posCol;
        this._symbol = symbol;
        if(type){
            this._symbolType = type;
        }

        this._grpSymbol = game.add.group();
        if(this._symbol=='Scatter' || this._symbol=='Wild'){
            this._parent._parent._grpScatter.addChild(this._grpSymbol);
        }
        else{
            group.addChild(this._grpSymbol);
        }
        //group.addChild(this._grpSymbol);
        this._animSymbol = this._symbol;
        var symbolPngName = "";
        if(this._symbolType!=2) {
			var syb = GlobalClass.mathSymbol(this._symbol);
            symbolPngName = syb.symbolPngName;
            this._sprSymbol = game.add.sprite(this._posX, this._posY, syb.assetName, syb.symbolPngName);
            this._sprSymbol.anchor.set(0.5, 0.5);
        }
        else{
            var name = GlobalClass.getSymbolName(this._symbol);
            if(name.indexOf("pic1")!=-1){
                name = "Pic1";
            }
            else if(name.indexOf("Pic02")!=-1){
                name = "Pic2";
            }
            else if(name.indexOf("Pic3")!=-1){
                name = "Pic3";
            }
            else if(name.indexOf("Pic4")!=-1){
                name = "Pic4";
            }
            else if(name.indexOf("pic05")!=-1){
                name = "Pic5";
            }
            this._sprSymbol = game.add.sprite(this._posX, this._posY, 'symbolFX', name+'Blur.png');
            this._sprSymbol.anchor.set(0.5, 0.5);
        }
		this._grpSymbol.addChild(this._sprSymbol);

       if(this._symbolType==1){
            var stop = 8;
            if(symbolPngName.indexOf("Wild")!=-1 || symbolPngName.indexOf("Scatter")!=-1){
                stop = 18;
			}
			var prefix = symbolPngName.replace("00.png","");
            var textures = this._sprSymbol.animations.generateFrameNames(prefix, 0, stop, '.png',2);
            this._sprSymbol.textures = textures;
			//this._sprSymbol.animations.add("anim", textures,false,0.2);
        }
        

        var obj = GlobalClass.getJackpotLevel();
        if((obj.name=='grand' && this._parent._posColumn==GlobalClass.TOTAL_COLUMN-1) || showAtReel){
            this.addSpecialFrames();
        }
    };
		
	this.move = function(type, func) {
        
        //this._sprSymbol.animations.destroyAll();
        let posY = this._sprSymbol.y;

		switch (type) {
			case 1: // start spin
				TweenMax.to(this._sprSymbol, 0.10, {
					y: posY - GlobalClass.SYMBOL_HEIGHT / 4,
					ease: Power2.easeOut,
					useFrames: false
				});
				TweenMax.to(this._sprSymbol, 0.10, {
					y: posY + GlobalClass.SYMBOL_HEIGHT,
					delay: 0.10,
					ease: Power2.easeIn,
					useFrames: false,
					callbackScope: this,
					onCompleteParams: [func],
					onComplete: this.moved
				});

                //console.log(this._sprFrame);
				if(this._sprFrame!=null){
					TweenMax.to(this._sprFrame, 0.10, {
						y: posY - GlobalClass.SYMBOL_HEIGHT / 4,
						ease: Power2.easeOut,
						useFrames: false
					});
					TweenMax.to(this._sprFrame, 0.10, {
						y: posY + GlobalClass.SYMBOL_HEIGHT,
						delay: 0.10,
						ease: Power2.easeIn,
						useFrames: false
					});
				}
				
				break;
			case 2: // loop spin
				TweenMax.to(this._sprSymbol, 0.03, {
					y: posY + GlobalClass.SYMBOL_HEIGHT,
					ease: Linear.easeNone,
					useFrames: false,
					callbackScope: this,
					onCompleteParams: [func],
					onComplete: this.moved
				});
				if(this._sprFrame!=null){
					TweenMax.to(this._sprFrame, 0.03, {
						y: posY + GlobalClass.SYMBOL_HEIGHT,
						ease: Linear.easeNone,
						useFrames: false
					});
				}
				break;
			case 3: // finish spin
				TweenMax.to(this._sprSymbol, 0.10, {
					y: posY + GlobalClass.SYMBOL_HEIGHT + (GlobalClass.SYMBOL_HEIGHT / 4),
					ease: Power2.easeOut,
					useFrames: false
				});
				TweenMax.to(this._sprSymbol, 0.10, {
					y: posY + GlobalClass.SYMBOL_HEIGHT,
					delay: 0.10,
					ease: Power2.easeIn,
					useFrames: false,
					callbackScope: this,
					onCompleteParams: [func],
					onComplete: this.moved
				});
				if(this._sprFrame!=null){
					TweenMax.to(this._sprFrame, 0.10, {
						y: posY + GlobalClass.SYMBOL_HEIGHT + (GlobalClass.SYMBOL_HEIGHT / 4),
						ease: Power2.easeOut,
						useFrames: false
					});
					TweenMax.to(this._sprFrame, 0.10, {
						y: posY + GlobalClass.SYMBOL_HEIGHT,
						delay: 0.10,
						ease: Power2.easeIn,
						useFrames: false
					});
				}
				break;
		}
		
    };
		
	this.finishResult1Func = function() {
        var tween = game.add.tween(this._sprSymbol);
        tween.to({
            y: this._sprSymbol.y - 80
        }, this._speedSpinFinish / 2, Phaser.Easing.Sinusoidal.In, true, 0, 0);
        tween.onComplete.add(this.finishResult2Func, this);
    };

    this.finishResult2Func = function() {
         this._sprSymbol.y = Math.ceil(this._sprSymbol.y);
        if (this._sprSymbol.y > this._posY + GlobalClass.SYMBOL_HEIGHT * 5) {
            this._sprSymbol.destroy();
            this._grpSymbol.destroy();
            this._parent.removeSymbol(this);
        }

        this._parent.finishResult();
    };

    this.moved = function(func) {
        this._sprSymbol.y = Math.ceil(this._sprSymbol.y);
        if (this._sprSymbol.y > this._posY + GlobalClass.SYMBOL_HEIGHT * 5) {
            this._sprSymbol.destroy();
            this._grpSymbol.destroy();
            this._parent.removeSymbol(this);
        }

        switch (func) {
            case "finishSpin": // after start spin
                this._parent.finishSpin();
                break;
            case "finishClean": // after loop spin
                this._parent.finishClean();
                break;
            case "finishResult": // after finish spin
                this._parent.finishResult();
                break;
            default:
                break;
        }
    };

    this.setAnimation = function(animationSpeed,times) {
        animationSpeed = animationSpeed || 0.2;
        times = times || 1;
        var txs = this._sprSymbol.textures;
        var textures = [];
        var newtextrues = [];
        if(times==3){
            newtextrues = textures.concat(txs,txs,txs);
        }
        else{
            newtextrues = txs;
        } 
        this._sprSymbol.animations.add("anim", newtextrues,false,animationSpeed,null,null,this._parent._parent._grpSymbolAnim);
        this._sprSymbol.animations.play('anim');
    };

    this.changeGrp = function () {
		this._sprSymbol.visible = true;
	};

    this.symbolBlow = function() {
        try {
            var textures = this._sprSymbol.animations.generateFrameNames("pic1_blow_", 0, 42, '.png',2);
            this._sprSymbol.animations.add("animBlow", textures,false,0.6,null,null,this._parent._parent._grpSymbolAnim);
            this._sprSymbol.animations.play('animBlow');

        } catch (error) {
            console.log(error);
        }
        
        // var pos = {};
        // pos.x = this._sprSymbol.x;
        // pos.y = this._sprSymbol.y;
        return this;
    };

    this.addSpecialFrames = function(){
        var obj = GlobalClass.getJackpotLevel();
        this._sprFrame = game.add.sprite(this._posX, this._posY, 'ui', 'special-frame-'+obj.name+'.png');
        this._sprFrame.anchor.set(0.5, 0.5);
        this._parent._parent._grpSpecialFrame.addChild(this._sprFrame);
    };

    this.addMask = function(){
        this._sprMask = game.add.sprite(this._posX, this._posY, 'uiPanel', 'BG_allBanners.png');
        this._sprMask.anchor.set(0.5, 0.5);
        this._sprMask.width = GlobalClass.SYMBOL_WIDTH;
        this._sprMask.height = GlobalClass.SYMBOL_HEIGHT;
        this._parent._parent._grpSymbolFXMask.addChild(this._sprMask);
    };

    this.showSymbolFX = function(){
        if(this._sprMask!=null){
            this._sprMask.destroy();
            this._sprMask = null;
        }
        if(this._parent._posColumn != GlobalClass.TOTAL_COLUMN-1){
            this.setAnimation(0.6,3);
            this._sprAnimSymbol = game.add.sprite(this._posX, this._posY, 'symbolFX', 'WinLine_000.png', this._parent._parent._grpSymbolFX);
            this._sprAnimSymbol.anchor.set(0.5, 0.5);
            var txs = this._sprAnimSymbol.animations.generateFrameNames("WinLine_", 0, 9, '.png', 3);
            var textrues = [];
            var newtextrues = textrues.concat(txs,txs,txs);
            this._sprAnimSymbol.animations.add('anim', newtextrues,false,0.25,function(){
                GlobalClass.deleteChildren(this._parent._parent._grpSymbolFX);
            },this);
            this._sprAnimSymbol.animations.play('anim');
        }
    };

    this.stopAnimation = function() {
        this._sprSymbol.visible = true;
        if (this._sprAnimSymbol != null) {
            this._sprAnimSymbol.destroy();
            this._sprAnimSymbol = null;
        }

        GlobalClass.deleteChildren(this._parent._parent._grpSymbolFX);
    };
}
