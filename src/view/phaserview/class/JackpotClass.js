/**
 * Created by kexin on 2018/3/13.
 */
var jackpotClass = function(game, group) {
    this._posLandscapeX = 0;
    this._posLandscapeY = 0;
    this._posPortraitX = 0;
    this._posPortraitY = 0;
    this._grpPosition = null;

    this._grpPoolPanel = null;
    this._grpPoolFX = null;
    this._grpPoolBanner = null;
    this._grpCoin = null;
    this._grpWinBanner = null;

    this._sprTubeMeterBar = null;
    this._wonJackpotIndex = 0;
    this._tubeHeight = 0;

    this._coinClass = null;
    this._timerCoin = null;
    this._lang = "en";
    this._langName = "jakpotWin";

    this._jackpotPools = [];

    this.create = function() {
        // if(GlobalClass.GAME_LANG=='zh'){
        //     this._lang = GlobalClass.GAME_LANG;
        //     this._langName = "jakpot_zh";
        // } else {
        //     this._lang = GlobalClass.GAME_LANG;
        // }
        this._grpPosition = game.add.group();
        group.addChild(this._grpPosition);

        this._grpTube = game.add.group();
        this._grpPosition.addChild(this._grpTube);

        this._grpPoolPanel = game.add.group();
        this._grpPosition.addChild(this._grpPoolPanel);

        this._grpPoolFX = game.add.group();
        this._grpPosition.addChild(this._grpPoolFX);

        this._grpGrandText = game.add.group();
        this._grpPosition.addChild(this._grpGrandText);

        this._grpMajorText = game.add.group();
        this._grpPosition.addChild(this._grpMajorText);

        this._grpMinorText = game.add.group();
        this._grpPosition.addChild(this._grpMinorText);

        this._grpMiniText = game.add.group();
        this._grpPosition.addChild(this._grpMiniText);

        this._grpPoolBanner = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpPoolBanner);
        gameplayState._transitionGroup.x = this._grpPosition.x;
        gameplayState._transitionGroup.y = this._grpPosition.y;

        this._grpCoin = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpCoin);

        
        this._grpStar = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpStar);

        this._grpWinBanner = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpWinBanner);

        this._style = {
            fontSize:"30px",
            fontFamily:"Times New Roman",
            fill: "#D4CE84",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center"
        };

        this._style2 = {
            fontSize:"60px",
            fontFamily:"Times New Roman",
            fill: "#D4CE84",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center",
            stroke:'#000',
            strokeThickness:3
        };

        this._wonJackpotIndex = 0;
        this._wonJackpots = [];
        this.checkResolution();
        this.updateValue();
    };

    this.hasConsecutiveZeros3 = function(number) {
        let regex = /000$/;
        return regex.test(number);
    }

    this.hasConsecutiveZeros6 = function(number) {
        let regex = /000000$/;
        return regex.test(number);
    }

    this.hasConsecutiveZeros9 = function(number) {
        let regex = /000000000$/;
        return regex.test(number);
    }

    this.writeImgText=function(x,y,val,txt,type,group){
        txt = txt.replace(/\s/g, "");        
        // if(game.device.desktop){
        //     x = x - 20;
        // }
        GlobalClass.deleteChildren(group);
        txt = txt.toString();

        var len = GlobalClass.currency().length;
        var scale = 0.6;
        if(len>=6){
            scale = 0.5;
        }

        if(!game.device.desktop){
            if (AppConstants.LANDSCAPE) {
                scale = 0.6;
            } else {
                scale = 0.7;
            }
        }
        
        var width = 0;
        var flag = 0;

        if (this.hasConsecutiveZeros9(val)) {
            // txt = val.toString().slice(0, -9);
            txt = GlobalClass.getFormatCurrency((val / 1000000000), true);
            txt += "B";
        } else if (this.hasConsecutiveZeros6(val)) {
            // txt = val.toString().slice(0, -6);
            txt = GlobalClass.getFormatCurrency((val / 1000000), true);
            txt += "M";
        } else if (this.hasConsecutiveZeros3(val)) {
            // txt = val.toString().slice(0, -3);
            txt = GlobalClass.getFormatCurrency((val / 1000), true);
            txt += "K";
        }
        
        // if (this.hasConsecutiveZeros9(this._jackpotPools[3]) && this.hasConsecutiveZeros9(this._jackpotPools[2]) && this.hasConsecutiveZeros9(this._jackpotPools[1]) && this.hasConsecutiveZeros9(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -11);
        //     txt += "B";
        // } else if (this.hasConsecutiveZeros6(this._jackpotPools[3]) && this.hasConsecutiveZeros6(this._jackpotPools[2]) && this.hasConsecutiveZeros6(this._jackpotPools[1]) && this.hasConsecutiveZeros6(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -7);
        //     txt += "M";
        // } else if (this.hasConsecutiveZeros3(this._jackpotPools[3]) && this.hasConsecutiveZeros3(this._jackpotPools[2]) && this.hasConsecutiveZeros3(this._jackpotPools[1]) && this.hasConsecutiveZeros3(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -3);
        //     txt += "K";
        // }
        
        for (var i = 0; i < txt.length; i++) {
            var name = txt[i] + "_" + type + ".png";
            var sy = 0;

            if (txt[i] == "B") {
                var str = game.add.sprite(width, sy, 'flags', "B-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else if (txt[i] == "M") {
                var str = game.add.sprite(width, sy, 'flags', "M-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else if (txt[i] == "K") {
                var str = game.add.sprite(width, sy, 'flags', "K-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else {
                // if(i<len - 1){ // ADDED -1
                if (/^[A-Za-z]/.test(name)) {
                    let letter = txt[i].toUpperCase();
                    name = letter + "-" + type + ".png";
                    try {
                        var str = game.add.sprite(width, sy, 'curency', name, group);
                        str.scale.set(scale - 0.1);
                    } catch (err) {}
                }
                else{
                    if(txt[i]=="."){
                        name = "dot_"+type+".png";
                        sy = 10;
                    }
                    else if(txt[i]==","){
                        name = "coma_"+type+".png";
                        sy = 10;
                    }

                    // if(flag==0){
                    //     width+=8;
                    //     flag = 1;
                    // }
                    
                    try {
                        var str = game.add.sprite(width, sy, 'jakpotWin', name,group);
                    } catch (e) {
                        var str = game.add.sprite(width, sy, 'jakpotWin', ".png",group);
                    }
                    str.scale.set(scale);
                }
                str.anchor.set(0, 0.5);
            }
            
            
            width+=str.width;
        }
        group.y = y;
        group.x = x-width/2+20;
        
    };

    this.drawScreen = function(){
        
        this.updateTube();
        GlobalClass.deleteChildren(this._grpPoolPanel);
        GlobalClass.deleteChildren(this._grpGrandText);
        GlobalClass.deleteChildren(this._grpMajorText);
        GlobalClass.deleteChildren(this._grpMinorText);
        GlobalClass.deleteChildren(this._grpMiniText);
        var lang = "";
        // if(this._lang!='en'){
        //     lang = this._lang;
        // }
        
        if(AppConstants.LANDSCAPE) {
            this._grpGrandText.scale.set(1);
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                this._sprGrandBoard = game.add.sprite(1100, 120, this._langName, 'GrandFrame'+lang+'.png', this._grpPoolPanel);
                this._sprGrandBoard.anchor.set(0.5, 0.5);

                this.writeImgText(this._sprGrandBoard.x - 5, this._sprGrandBoard.y + 30, 0, GlobalClass.getFormatCurrency(0, false),"grand",this._grpGrandText);

                this._sprMajorBoard = game.add.sprite(this._sprGrandBoard.x, this._sprGrandBoard.y + 140, this._langName, 'MajorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMajorBoard.anchor.set(0.5, 0.5);
                var txs = this._sprGrandBoard.animations.generateFrameNames("GrandIconAnim"+lang+"_", 0, 37, '.png', 3);
                this._sprGrandBoard.txs = txs;
                
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprGrandBoard.y + 160, 0, GlobalClass.getFormatCurrency(0, false),"major",this._grpMajorText);

                this._sprMinorBoard = game.add.sprite(this._sprGrandBoard.x, this._sprMajorBoard.y + 105, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprGrandBoard.y + 280, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprGrandBoard.x, this._sprMinorBoard.y + 90, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprGrandBoard.y + 370, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
            else{
                this._sprMinorBoard = game.add.sprite(1100, 260, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                this.writeImgText(this._sprMinorBoard.x - 5, this._sprMinorBoard.y+40, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y + 120, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                this.writeImgText(this._sprMiniBoard.x - 5, this._sprMiniBoard.y + 30, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
        }
        else{
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                this._sprGrandBoard = game.add.sprite(game.world.centerY/2-7, -30, this._langName, 'GrandFrame'+lang+'.png', this._grpPoolPanel);
                this._sprGrandBoard.anchor.set(0.5, 0);
                this._sprGrandBoard.scale.set(0.8);

                this._grpGrandText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x+50, this._sprGrandBoard.y+160, 0, GlobalClass.getFormatCurrency(0, false),"grand",this._grpGrandText);


                this._sprMajorBoard = game.add.sprite(this._sprGrandBoard.x, 260, this._langName, 'MajorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMajorBoard.anchor.set(0.5, 0.5);
                this._sprMajorBoard.scale.set(0.8);

                this._grpMajorText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprMajorBoard.y, 0, GlobalClass.getFormatCurrency(0, false),"major",this._grpMajorText);

                this._sprMinorBoard = game.add.sprite(this._sprGrandBoard.x+360, 100, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                this._sprMinorBoard.scale.set(0.8);

                this._grpMinorText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, 20 + 280, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y+150, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                this._sprMiniBoard.scale.set(0.8);

                this._grpMiniText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, 20 + 370, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
            else{
                this._sprMinorBoard = game.add.sprite(game.world.centerY/2-45, 100, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                //this._sprMinorBoard.scale.set(0.8);

                //this._grpMinorText.scale.set(0.8);
                this.writeImgText(this._sprMinorBoard.x - 5, this._sprMinorBoard.y + 50, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y+140, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
               // this._sprMiniBoard.scale.set(0.8);

                //this._grpMiniText.scale.set(0.8);
                this.writeImgText(this._sprMiniBoard.x - 5, this._sprMiniBoard.y + 30, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
        }

        var txs = this._sprGrandBoard.animations.generateFrameNames("GrandIconAnim"+lang+"_", 0, 17, '.png', 2);
        var textrues = [];
        this._sprGrandBoard.txs = textrues.concat(txs);

        var txs = this._sprMajorBoard.animations.generateFrameNames("MajorIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMajorBoard.txs = textrues.concat(txs);

        var txs = this._sprMinorBoard.animations.generateFrameNames("MinorIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMinorBoard.txs = textrues.concat(txs);

        var txs = this._sprMiniBoard.animations.generateFrameNames("MiniIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMiniBoard.txs = textrues.concat(txs);
        
		this.changeJackPot();
		/* if(gameplayState._updatedJackpotValue){
			this.changeJackPot();
		} */
    };

    this.updateTube=function(){
        GlobalClass.deleteChildren(this._grpTube);
        var obj = GlobalClass.getJackpotLevel();
        if(AppConstants.LANDSCAPE) {
            var sprTube = game.add.sprite(910-this._posLandscapeX, 342, 'ui', obj.level + 'betsFrame.png', this._grpTube);
            sprTube.anchor.set(0.5, 0.5);
            var y = sprTube.y + 151;
            var tmp = 11-obj.value
            if(tmp<=0){
                tmp = 0;
            }
            y = y - tmp;
            this._sprTubeMeterBar = game.add.sprite(sprTube.x - 1, y, 'ui', obj.level + 'MeterBar.png', this._grpTube);
            this._sprTubeMeterBar.anchor.set(0.5, 1);
            var height = this._sprTubeMeterBar.height;
            this._sprTubeMeterBar.height = height*obj.value/ GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1];

            this._sprMask = game.add.graphics();
            this._sprMask.beginFill(0xffffff);
            this._sprMask.drawRect(910 - this._posLandscapeX - 15, 342 + 140 - 295, 30, 295);
            this._sprMask.alpha = 0.5
            this._grpTube.addChild(this._sprMask);
            this._sprTubeMeterBar.mask = this._sprMask;
        }
        else{
            // var sprTube = game.add.sprite(game.world.centerX+155, 617, 'ui', obj.level + 'betsFrame.png', this._grpTube);
            // sprTube.anchor.set(0.5, 0.5);
            // sprTube.rotation = Math.atan2(1,0);
            // var x = sprTube.x + 165;
            var y = 782;
            var tmp = 11-obj.value
            if(tmp<=0){
                tmp = 0;
            }
            y = y - tmp;
            this._sprTubeMeterBar = game.add.sprite(710, y, 'ui', obj.level + 'MeterBar.png', this._grpTube);
            this._sprTubeMeterBar.anchor.set(0.5,1);
            this._sprTubeMeterBar.width = 16;
            this._sprTubeMeterBar.height = 392;
            var height = this._sprTubeMeterBar.height;
            this._sprTubeMeterBar.height = height*obj.value/  GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1];

            this._sprMask = game.add.graphics();
            this._sprMask.beginFill(0xffffff);
            this._sprMask.drawRect(710 - 15, y - 10 - 368, 30, 368);
            this._sprMask.alpha = 0.5
            this._grpTube.addChild(this._sprMask);
            this._sprTubeMeterBar.mask = this._sprMask;
        }
    };

    this.updateValue=function(type) {
        this.changeJackPot(type);
        if (this._wonJackpots.length > 0) {
            for (var i = 0; i < this._wonJackpots.length; i++) {
                var positions = this._wonJackpots[i].positions;
               // var linePath = GlobalClass.WIN_LINE[lineNo];
                var symbols = [];
                this._wonJackpots[i].symbols = symbols;
                for (var j = 0; j < positions.length; j++) {
                    var pos = positions[j];
                    var symbol = gameplayState._reelClass.getFXSymbol(pos[0], pos[1]);
                    symbols.push(symbol);
                }
            }
        }
    }

    this.changeJackPot=function(type,value){
        var jackpotPools = [];//GlobalClass.GAME_DATA.jackpotState.jackpotPool;
        this._jackpotPools = [];

        GlobalClass.GAME_DATA.jackpotState.jackpotPool.forEach((poolValue, index) => {
            // jackpotPools[index] = GlobalClass.getDenom() * GlobalClass.trueCoinValue() * poolValue.winAmount;

            // jackpot prize x (minbet/lines played) x denom
            jackpotPools[index] = poolValue.winAmount * (GlobalClass.GAME_BET[0] / GlobalClass.GAME_LINE) * GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        });

        this._jackpotPools = [...jackpotPools];

        if(AppConstants.LANDSCAPE) {
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                if(!type){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 30, jackpotPools[0], GlobalClass.getFormatCurrency(jackpotPools[0], false),"grand",this._grpGrandText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 160, jackpotPools[1], GlobalClass.getFormatCurrency(jackpotPools[1], false),"major",this._grpMajorText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 280, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 370, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 30, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 160, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 280, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 370, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
            else{
                if(!type){
                   // this.writeImgText(this._sprGrandBoard.x - 15, 20 + 30, jackpotPools[0], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[0])).format('0,0.00'),"grand",this._grpGrandText);
                   // this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 160, jackpotPools[1], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[1])).format('0,0.00'),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 20, this._sprMinorBoard.y+40, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 20, this._sprMiniBoard.y + 30, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 30, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 160, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 20, this._sprMinorBoard.y+40, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 20, this._sprMiniBoard.y + 30, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
        }
        else{
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                if(!type){
                    this.writeImgText(this._sprGrandBoard.x, this._sprGrandBoard.y+160, jackpotPools[0], GlobalClass.getFormatCurrency(jackpotPools[0], false),"grand",this._grpGrandText);
                    this.writeImgText(this._sprGrandBoard.x, this._sprMajorBoard.y+20, jackpotPools[1], GlobalClass.getFormatCurrency(jackpotPools[1], false),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y+30, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y+28, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x, this._sprGrandBoard.y+160, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x, this._sprMajorBoard.y+20, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y+30, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y+28, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
            else{
                if(!type){
                    //this.writeImgText(this._sprGrandBoard.x, 20 + 85,jackpotPools[0], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[0])).format('0,0.00'),"grand",this._grpGrandText);
                    //this.writeImgText(this._sprGrandBoard.x, 20 + 185,jackpotPools[1], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[1])).format('0,0.00'),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y + 40, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y + 30, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x, 20 + 85, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x, 20 + 185, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y + 40, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y + 30, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
        }
    };

    this.getWinAmountInDollar = function(jackpotPool){
        var tv = GlobalClass.trueCoinValue();
        var inDollar = jackpotPool.initialPrize * tv+jackpotPool.contribution;
        var winAmount = this.accDiv(inDollar,tv);
        inDollar = winAmount*tv;
        return inDollar;
    };

    // this.accDiv = function(arg1,arg2){ 
    //     var t1=0,t2=0,r1,r2; 
    //     try{t1=arg1.toString().split(".")[1].length}catch(e){}  
    //     try{t2=arg2.toString().split(".")[1].length}catch(e){}
    //     with(Math){ 
    //       r1=Number(arg1.toString().replace(".","")) 
    //       r2=Number(arg2.toString().replace(".","")) 
    //       return (r1/r2)*pow(10,t2-t1);   
    //     } 
    // } 
    this.accDiv = function(arg1, arg2){
        let t1 = 0, t2 = 0;

        try { t1 = arg1.toString().split(".")[1].length; } catch(e){}
        try { t2 = arg2.toString().split(".")[1].length; } catch(e){}

        // Buang semua titik
        let r1 = Number(arg1.toString().replace(/\./g, ""));
        let r2 = Number(arg2.toString().replace(/\./g, ""));

        return (r1 / r2) * Math.pow(10, t2 - t1);
    };

    this.showFX=function(){
        if(this._wonJackpots.length <=0){
            gameplayState.startAnimationSymbol();
            return;
        }

        if(this._wonJackpotIndex+1>this._wonJackpots.length){
            this._wonJackpotIndex = 0;
            //this.showBanner();
            //this.removeFX();
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
                soundClass.resumeBGM();
            }
            this.changeJackPot();
            //gameplayState.showTotalJackpotWin();
            gameplayState.startAnimationSymbol();
            return;
        }
        if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            soundClass.pauseBGM();
        }
        var wonJackpot = this._wonJackpots[this._wonJackpotIndex];
        var start = 2.3;
        if(wonJackpot.name.toLowerCase()=="MINI" || wonJackpot.name.toLowerCase()=="MAJOR"){
            start = 1.8;
        }
        else if(wonJackpot.name.toLowerCase()=="MINOR"){
            start = 1.5;
        }
        
        

        //var txt = wonJackpot.winAmount+" won "+wonJackpot.name.toLowerCase()+"!";
        gameplayState._informationClass.setText("jackpotwin",wonJackpot.name.toLowerCase(), GlobalClass.getFormatCurrency(wonJackpot.winAmountInDollar));

        //var name = wonJackpot.name;
        this._wonJackpotIndex++;
        // wonJackpot.symbols = [];
        // var symbol = gameplayState._reelClass.getFXSymbol(0, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(1, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(2, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(3, 1);
        // wonJackpot.symbols.push(symbol);
        
        soundClass.playSound("jackPotTrigger");
        if(wonJackpot.symbols!=null && wonJackpot.symbols.length>0){
            gameplayState._reelClass.addMask();
            for(var i=0;i<wonJackpot.symbols.length;i++){
                wonJackpot.symbols[i].showSymbolFX();
            }
        }

        this.changeJackPot(wonJackpot.name,wonJackpot.winAmountInDollar);
        this._timerFunc = game.time.events.add(1200, function(){
            soundClass.playSound("jackPot"+wonJackpot.name.toLowerCase());
        },this);
        
        this._timerFunc = game.time.events.add(1500, function(){
            //soundClass.playSound("jackPot"+wonJackpot.name.toLowerCase());
            this._tubeFX = game.add.sprite(this._sprTubeMeterBar.x, this._sprTubeMeterBar.y-145, 'interfaceFX', 'TubeFX_000.png', this._grpPoolFX);
            this._tubeFX.anchor.set(0.5, 0.5);
            var txs = this._tubeFX.animations.generateFrameNames("TubeFX_", 0, 8, '.png', 3);
            this._tubeFX.animations.add('anim', txs,false,0.2,function(){
                this.removeFX();
                this.playIconAnimations(wonJackpot);
            },this);
            this._tubeFX.animations.play('anim');
        },this);
        
        
    };

    this.playIconAnimations=function(wonJackpot){
        if(wonJackpot.name.toLowerCase()=='mini'){
            this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
                this.showBanner(wonJackpot);
            },this);
            this._sprMiniBoard.animations.play("anim");
        }
        else if(wonJackpot.name.toLowerCase()=='minor'){
            this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
                this.showBanner(wonJackpot);
            },this);
            this._sprMinorBoard.animations.play("anim");
            
        }
        else if(wonJackpot.name.toLowerCase()=='major'){
            this._sprMajorBoard.animations.add('anim',this._sprMajorBoard.txs,false,0.8,function(){
                this.showBanner(wonJackpot);
            },this);
            this._sprMajorBoard.animations.play("anim");
        }
        else if(wonJackpot.name.toLowerCase()=='grand'){
            this._sprGrandBoard.animations.add('anim',this._sprGrandBoard.txs,false,0.8,function(){
                this.showBanner(wonJackpot);
            },this);
            this._sprGrandBoard.animations.play("anim");
        }
    }


    // this.playIconAnimations=function(wonJackpot){
    //     if(wonJackpot.name.toLowerCase()=='mini'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this.showBanner(wonJackpot);
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='minor'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this.showBanner(wonJackpot);
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
            
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='major'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this._sprMajorBoard.animations.add('anim',this._sprMajorBoard.txs,false,0.8,function(){
    //                     this.showBanner(wonJackpot);
    //                 },this);
    //                 this._sprMajorBoard.animations.play("anim");
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='grand'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this._sprMajorBoard.animations.add('anim',this._sprMajorBoard.txs,false,0.8,function(){
    //                     this._sprGrandBoard.animations.add('anim',this._sprGrandBoard.txs,false,0.8,function(){
    //                         this.showBanner(wonJackpot);
    //                     },this);
    //                     this._sprGrandBoard.animations.play("anim");
    //                 },this);
    //                 this._sprMajorBoard.animations.play("anim");
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    // }

    this.showBanner=function(wonJackpot){ 
        
        var scale = 1.0;
        var centerX = 0;
        var centerY = 0;
        if(!AppConstants.LANDSCAPE){
            centerX = game.world.centerY;
            centerY = game.world.centerX;
            //this._poolBG = game.add.sprite(game.world.centerY, game.world.centerX, 'jakpotWin', 'jackpot-BG.jpg', this._grpPoolBanner);
            //this._poolBG.anchor.set(0.5, 0.5);
            //this._poolBG.rotation = Math.atan2(1,0);
            scale = 0.7;
            if(GlobalClass.GAME_LANG=='zh'){
                this._jackpotFont = game.add.sprite(game.world.centerY, game.world.centerX-300, 'ui_zh', 'jackpot-font-CH.png', this._grpPoolBanner);
            }
            else{
                this._jackpotFont = game.add.sprite(game.world.centerY, game.world.centerX-300, 'jakpotWin', 'jackpot-font.png', this._grpPoolBanner);
            }
            
        }
        else{
            centerX = game.world.centerX;
            centerY = game.world.centerY;
            //this._poolBG = game.add.sprite(game.world.centerX, game.world.centerY, 'jakpotWin', 'jackpot-BG.jpg', this._grpPoolBanner);
            //this._poolBG.anchor.set(0.5, 0.5);
            
            // if(GlobalClass.GAME_LANG=='zh'){
            //     this._jackpotFont = game.add.sprite(game.world.centerX, game.world.centerY-190, 'ui_zh', 'jackpot-font-CH.png', this._grpPoolBanner);
            // }
            // else{
                this._jackpotFont = game.add.sprite(game.world.centerX, game.world.centerY-190, 'jakpotWin', 'jackpot-font.png', this._grpPoolBanner);
            //}
        }

        this._jackpotFont.anchor.set(0.5, 0.5);
        this._jackpotFont.scale.set(0.0,0.0);


        //game.add.tween(this._jackpotFont.scale).to( { x:scale,y:scale }, 200, "Linear", true,0,0);



        TweenMax.to(this._jackpotFont.scale, 0.2, {
            x:scale,
            y:scale,
            ease: Linear.easeNone,
            useFrames: false
        });


        this._girl = game.add.sprite(centerX*2, centerY+60, 'jakpotWin', 'girl.png', this._grpPoolBanner);
        this._girl.anchor.set(0.5, 0.5);
        //game.add.tween(this._girl).to( { x:centerX}, 200, "Linear", true,0,0);

        TweenMax.to(this._girl, 0.2, {
            x:centerX,
            ease: Linear.easeNone,
            useFrames: false
        });


        //game.add.tween(this._jackpotFont.scale).to( { x:0.0,y:0.0 }, 200, "Linear", true,800,0);
        TweenMax.to(this._jackpotFont.scale, 0.2, {
            x:0,
            y:0,
            delay: 0.8,
            ease: Linear.easeNone,
            useFrames: false
        });


        //game.add.tween(this._girl).to( { x:centerX*-4}, 400, "Linear", true,800,0);
        TweenMax.to(this._girl, 0.4, {
            x:centerX*-4,
            delay: 0.8,
            ease: Linear.easeNone,
            useFrames: false
        });

        this._timerFunc = game.time.events.add(500, function(){
            this._grpWinBanner.x = centerX;
            this._grpWinBanner.y = centerY;
            this._grpWinBanner.scale.set(0.0,0.0);

            var wingLeft =  game.add.sprite(-220, -10, 'ui', "wing.png", this._grpWinBanner);
            wingLeft.anchor.set(1, 1);
            wingLeft.rotation = -3;
            //game.add.tween(wingLeft).to( { rotation:0},400, "Linear", true,0,0);

            TweenMax.to(wingLeft, 0.4, {
                rotation:0,
                ease: Linear.easeNone,
                useFrames: false
            });


            var wingRight =  game.add.sprite(220, -10, 'ui', "wing2.png", this._grpWinBanner);
            wingRight.anchor.set(0, 1);
            wingRight.rotation = 3;
           // game.add.tween(wingRight).to( { rotation:0},400, "Linear", true,0,0);

            TweenMax.to(wingRight, 0.4, {
                rotation:0,
                ease: Linear.easeNone,
                useFrames: false
            });

            var winBanner =  game.add.sprite(0, 0, 'jakpotWin', 'winbanner_000.png', this._grpWinBanner);
            winBanner.anchor.set(0.5, 0.5);
            var txs = winBanner.animations.generateFrameNames("winbanner_", 0, 3, '.png', 3);
            winBanner.animations.add('anim',txs,true,0.15);

            if(GlobalClass.GAME_LANG=='zh'){
                var name = wonJackpot.name.toLowerCase()+"-bannerCH.png";
                var titleBanner =  game.add.sprite(0, -97, 'ui_zh', name, this._grpWinBanner);
                titleBanner.anchor.set(0.5, 0.5);
            }
            else{
                var name = wonJackpot.name.toLowerCase()+"-banner.png";
                var titleBanner =  game.add.sprite(0, -97, 'jakpotWin', name, this._grpWinBanner);
                titleBanner.anchor.set(0.5, 0.5);
            }

            gameplayState.addFeatureTotalWin(wonJackpot.winAmount);

            var winAmount = game.add.text(titleBanner.x, titleBanner.y+85, GlobalClass.getFormatCurrency(wonJackpot.winAmountInDollar), this._style2);
            winAmount.anchor.set(0.5, 0.5);
            this._grpWinBanner.addChild(winAmount);


            TweenMax.to(this._grpWinBanner.scale, 0.5, {
                x:scale,
                y:scale,
                ease: Linear.easeNone,
                useFrames: false,
                callbackScope: this,
                onComplete: function(){
                    winBanner.animations.play('anim');
                    this._grpCoin.x = centerX;
                    this._grpCoin.y = centerY;

                    this._grpStar.x = centerX;
                    this._grpStar.y = centerY;

                    this._timerCoin = game.time.events.loop(20, this.createCoin, this);
                    this._timerStar = game.time.events.loop(50, this.createStar, this);
                    this._timerFunc = game.time.events.add(3000, function(){
                        GlobalClass.deleteChildren(gameplayState._reelClass._grpSymbolFXMask);
                        this.removeFX();
                        this.showFX();
                    },this);
                }
            });


            // var winBannerTween = game.add.tween(this._grpWinBanner.scale).to( { x:scale, y:scale},500, "Linear", true,0,0);
            // winBannerTween.onComplete.add(function(){
                
            // },this);

        },this);

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


    this.removeFX=function(){
        GlobalClass.deleteChildren(this._grpPoolFX);
        this._tubeFX = null;
        this._dynamiteFX = null;
        this._wireFX = null;
        this._prizeFX = null;
        GlobalClass.deleteChildren(this._grpPoolBanner);
        //this._poolBG = null;
        this._jackpotFont = null;
        this._girl = null;
        GlobalClass.deleteChildren(this._grpWinBanner);
        GlobalClass.deleteChildren(this._grpCoin);
        GlobalClass.deleteChildren(this._grpStar);
        

        if (this._timerFunc != null) {
            game.time.events.remove(this._timerFunc);
        }

        if (this._timerCoin != null) {
            game.time.events.remove(this._timerCoin);
        }
        if (this._timerStar != null) {
            game.time.events.remove(this._timerStar);
        }
    };

    this.checkResolution = function() {
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function() {
        this._posLandscapeX = -10;
        if(!game.device.desktop){
            this._posLandscapeX = this._posLandscapeX-23;
        }
        this._grpPosition.x = this._posLandscapeX;
        this._grpPosition.y = this._posLandscapeY;
        //this._grpPosition.scale.set(1,1);
        this.drawScreen();
    };

    this.createPortrait = function() {
        this._grpPosition.x = this._posPortraitX;
        this._grpPosition.y = this._posPortraitY;
        this.drawScreen();
    };
}


