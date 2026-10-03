var reelcolumnClass = function(game, group) {
    this._parent = null;
    this._posX = 0;
    this._posY = 0;
    this._posColumn = 0;

    this._reelSymbol = null;
    this._reelSymbolArr = [];
    this._reelUsed = [];
    this._reelResult = [];

    this._positionNow = 0;
    this._positionStop = 0;

    this._loopSpin = 0;
    this._totalSpin = 0;

    this._currentClean = 0;
    this._totalClean = 1;

    this._getScatter = false;
    this._getScatterPos = -1;
    this._getWild = false;
    this._getPicA = false;
    this._getWildPos = -1;

    this._reelSpinning = false;

    this._grpColumn = null;

    this.create = function(parent, posX, posY, posColumn) {
        this._parent = parent;
        this._posX = posX + GlobalClass.SYMBOL_WIDTH / 2;
        this._posY = posY + GlobalClass.SYMBOL_HEIGHT / 2;
        this._posColumn = posColumn; // 0, 1, 2, 3, 4

        this._grpColumn = game.add.group();
        group.addChild(this._grpColumn);
        this._reelUsed = clone(GlobalClass.GAME_REEL[this._posColumn]);
        this._positionStop = clone(GlobalClass.GAME_STOPCODE[this._posColumn]);
        this._positionNow = this._positionStop;

        var i = 0;
        var j = 0;
        var k = 0;
        var specialWild = false;

        this.changePositionNow(true, 4);
        for (i = 4; i >= -2; i--) {
            this.changePositionNow(false, 1);
            var showAtReel = false;
            if(this._posColumn == GlobalClass.TOTAL_COLUMN-1){
                if(GlobalClass.SPECIAL_FRAMES[i]){
                    showAtReel = true;
                }
            }
            this.addSymbol(this._posX, this._posY + GlobalClass.SYMBOL_HEIGHT * i, i, this._reelUsed[this._positionNow],1,showAtReel);
        }
    };

    this.showDarkMask=function(){
        this._sprMask = game.add.sprite(this._posX, this._posY+GlobalClass.SYMBOL_HEIGHT, 'uiPanel', 'BG_allBanners.png');
        this._sprMask.anchor.set(0.5, 0.5);
        this._sprMask.width = GlobalClass.SYMBOL_WIDTH;
        this._sprMask.height = GlobalClass.SYMBOL_HEIGHT*3;
        this._parent._grpReelMask.addChild(this._sprMask);
    };

    this.showDarkMaskSymbol = function (maskGrp) {
		for (var row = 0; row < 3; row++) {
			this._reelSymbolArr[row + 2].changeGrp();
		}
		this._sprMask = game.add.sprite(this._posX, this._posY + GlobalClass.SYMBOL_HEIGHT, 'uiPanel', 'BG_allBanners.png');
		this._sprMask.anchor.set(0.5, 0.5);
		this._sprMask.width = GlobalClass.SYMBOL_WIDTH + 2;
		this._sprMask.height = GlobalClass.SYMBOL_HEIGHT * 3 + 20;
		this._sprMask.alpha = 0.8;
		//this._parent._grpReelMask.addChild(this._sprMask);
		maskGrp.addChild(this._sprMask);
	};

    this.changePositionNow = function(plus, value) {
        if (plus) {
            this._positionNow += value;
        } else {
            this._positionNow -= value;
        }
        if (this._positionNow >= this._reelUsed.length) {
            this._positionNow = this._positionNow - this._reelUsed.length;
        } else if (this._positionNow < 0) {
            this._positionNow = this._reelUsed.length + this._positionNow;
        }
    };

    this.setPositionStop = function(value, short, massive) {
        if (massive == undefined) {
            massive = false;
        }

        if (short) {
            this._loopSpin = 1;
        } else {
            this._loopSpin = 80;
        }

        this._positionStop = value;
        this._reelSpinning = false;
        this._massiveSymbol = massive;
    };

    this.addSymbol = function(posX, posY, posRow, symbol,type,showAtReel) {
        this._reelSymbol = new reelsymbolClass(game, this._grpColumn);
        this._reelSymbol.create(this, posX, posY, this._posColumn, posRow, symbol,type,showAtReel);
        this._reelSymbolArr.unshift(this._reelSymbol);
    };

    this.removeSymbol = function(symbol) {
        for (var i = 0; i < this._reelSymbolArr.length; i++) {
            if (this._reelSymbolArr[i] == symbol) {
                this._reelSymbolArr[i] = null;
                this._reelSymbolArr.splice(i, 1);
            }
        }
    };

    this.startSpin = function() {
        this._reelSpinning = true;

        for (var i = 0; i < this._reelSymbolArr.length; i++) {
            this._totalSpin++;
            this._reelSymbolArr[i].move(1, "finishSpin");
        }
    };

    this.finishSpin = function() {
        this._totalSpin--;

        if (this._totalSpin == 0) {
            if (this._reelSpinning == true) { // loop
                this.loopSpin();
            } else { // finish
                this._loopSpin--;

                if (this._loopSpin <= 0) {
                    this._positionNow = this._positionStop;

                    this._currentClean = 0;
                    this.startClean();
                } else {
                    this.loopSpin();
                }
            }
        }
    };

    this.loopSpin = function() {
        this.changePositionNow(false, 3);
        this.addSymbol(this._posX, this._posY - GlobalClass.SYMBOL_HEIGHT * 2, -1, this._reelUsed[this._positionNow],2);

        for (var i = 0; i < this._reelSymbolArr.length; i++) {
            this._totalSpin++;
            this._reelSymbolArr[i].move(2, "finishSpin");
        }
    };

    this.startClean = function() {
        for (var i = 0; i < this._reelSymbolArr.length; i++) {
            this._totalSpin++;
            this._reelSymbolArr[i].move(2, "finishClean");
        }
    };

    this.finishClean = function() {
        this._totalSpin--;

        if (this._totalSpin == 0) {
            this._currentClean++;

            if (this._currentClean == this._totalClean) {
                this._reelUsed = clone(GlobalClass.GAME_REEL[this._posColumn]);
                this.setPositionResult();
                this.startResult();
            } else {
                this.startClean();
            }
        }
    };

    this.setPositionResult = function() {
        this._reelResult = new Array();
        this._positionNow = this._positionStop;
        this._getScatter = false;
        this._getScatterPos = -1;
        this._getWild = false;
        this._getPicA = false;
        this._getWildPos = -1;

        // top result
        this.changePositionNow(true, 3);
        this._reelResult.push(this._reelUsed[this._positionNow]);
        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);

        // reel result
        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);
        if (this._reelUsed[this._positionNow] == 'Wild') {
            this._getWild = true;
            this._getWildPos = 2;
        } else if (this._reelUsed[this._positionNow] == 'Scatter') {
            this._getScatter = true;
            this._getScatterPos = 2;
        }
        else if (this._reelUsed[this._positionNow] == 'TA') {
            var symbol = {};
            symbol.row = 2;
            symbol.col = this._posColumn;
            this._parent._picaSymbols.push(symbol);
            this._getPicA = true;
        }

        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);
        if (this._reelUsed[this._positionNow] == 'Wild') {
            this._getWild = true;
            this._getWildPos =1;
        } else if (this._reelUsed[this._positionNow] == 'Scatter') {
            this._getScatter = true;
            this._getScatterPos = 1; 
        }
        else if (this._reelUsed[this._positionNow] == 'TA') {
            var symbol = {};
            symbol.row = 1;
            symbol.col = this._posColumn;
            this._parent._picaSymbols.push(symbol);
            this._getPicA = true;
        }
        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);
        if (this._reelUsed[this._positionNow] == 'Wild') {
            this._getWild = true;
            this._getWildPos = 0;
        } else if (this._reelUsed[this._positionNow] == 'Scatter') {
            this._getScatter = true;
            this._getScatterPos = 0;
        }
        else if (this._reelUsed[this._positionNow] == 'TA') {
            var symbol = {};
            symbol.row = 0;
            symbol.col = this._posColumn;
            this._parent._picaSymbols.push(symbol);
            this._getPicA = true;
        }

        // bottom result
        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);
        this.changePositionNow(false, 1);
        this._reelResult.push(this._reelUsed[this._positionNow]);
    };

    this.startResult = function() {
        if (this._reelResult.length > 2) {
            var showAtReel =false;
            if(this._posColumn == GlobalClass.TOTAL_COLUMN-1){
                if(this._reelResult.length>=3 && this._reelResult.length<=5){
                    var index = this._reelResult.length - 3;
                    if(GlobalClass.SPECIAL_FRAMES[index]){
                        showAtReel =true;
                    }
                }
            }
            this.addSymbol(this._posX, this._posY - GlobalClass.SYMBOL_HEIGHT, -1, this._reelResult[0],3,showAtReel);
            this._reelResult.splice(0, 1);

            if (this._reelResult.length == 2) {
                this.addSymbol(this._posX, this._posY - GlobalClass.SYMBOL_HEIGHT * 2, -1, this._reelResult[0],3);
                this._reelResult.splice(0, 1);
                this.addSymbol(this._posX, this._posY - GlobalClass.SYMBOL_HEIGHT * 3, -1, this._reelResult[0],3);
                this._reelResult.splice(0, 1);
            }

            for (var i = 0; i < this._reelSymbolArr.length; i++) {
                this._totalSpin++;

                if (this._reelResult.length <= 2) {
                    this._reelSymbolArr[i].move(3, 'finishResult');
                } else {
                    this._reelSymbolArr[i].move(2, 'finishResult');
                }
            }

            // for Sound Reel
            if (this._reelResult.length == 3) {
                this._parent.soundReel(this._posColumn, this._getScatter, this._getWild,this._getPicA);
            }
        } else {
            this.finishResult2();
        }
    };

    this.finishResult = function() {
        this._totalSpin--;

        if (this._totalSpin == 0) {
            this.startResult();
        }
    };

    this.finishResult2 = function() {
        if (GlobalClass.GAME_MODE != GlobalClass.GAME_MODE_FEATURE1) {
            this._parent.reelFinish(this._posColumn, this._getScatter, this._getWild,this._getPicA);
        } else {
            this._parent.reelFinish(this._posColumn, this._getScatter, this._getWild,this._getPicA);
        }
    };

    this.setAnimation = function(row, loop) {
        this._reelSymbolArr[row + 2].setAnimation();
    };

    this.symbolBlow = function(row) {
        return this._reelSymbolArr[row + 2].symbolBlow();
    };

    this.getFXSymbol = function(row) {
        return this._reelSymbolArr[row + 2];
    };

    this.addMask=function(){
        for(var row=0;row<3;row++){
            this._reelSymbolArr[row + 2].addMask();
        }
    };

    this.addSpecialFrames = function(row) {
        this._reelSymbolArr[row + 2].addSpecialFrames();
    };

    this.setReel = function() {
        this._reelUsed = clone(GlobalClass.GAME_REEL[this._posColumn]);
    };

    this.remove = function() {
        if (this._grpColumn != null) {
            this._grpColumn.destroy();
            this._grpColumn = null;
        }
    };
}
