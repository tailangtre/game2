var reelClass = function (game, group) {
    this._posLandscapeX = 27;
    this._posLandscapeY = 57;
    this._posPortraitX = 0;
    this._posPortraitY = 372;
    this._posX = 0;
    this._posY = 0;

    this.sx = 0;
    this.sy = 0;

    this._grpPosition = null;

    this._grpBackground = null;
    this._sprBackground = null;

    this._grpReel = null;
    this._reelColumn = null;
    this._reelColumnArr = [];
    this._grpDelayFx = null;
    this._sprDelayFx = null;

    this._grpScatter = null;
    this._grpSymbolFX = null;

    this._grpReelMask = null;
    this._grpSpecialFrame = null;
    this._grpSymbolFXMask = null;

    this._grpDelay = null;

    this._grpMask = null;
    this._sprMask = null;
    this._grpSpeReel = null;
    this._statusColumn = [0, 0, 0, 0, 0];
    this._statusRow = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    this._picaSymbols = [];

    this.startTime = 0;

    this.create = function () {
        this._grpPosition = game.add.group();
        group.addChild(this._grpPosition);

        this._grpBackground = game.add.group();
        this._grpPosition.addChild(this._grpBackground);
        this._grpReel = game.add.group();
        this._grpPosition.addChild(this._grpReel);
        this._grpSpeReel = game.add.group();
        this._grpPosition.addChild(this._grpSpeReel);
        this._grpMask = game.add.group();
        this._grpPosition.addChild(this._grpMask);

        this._grpReelMask = game.add.group();
        this._grpPosition.addChild(this._grpReelMask);

        this._grpDelay = game.add.group();
        this._grpPosition.addChild(this._grpDelay);

        this._grpScatter = game.add.group();
        this._grpPosition.addChild(this._grpScatter);

        this._grpGreySymbol = game.add.group();
        this._grpPosition.addChild(this._grpGreySymbol);

        this._grpSymbolAnim = game.add.group();
        this._grpPosition.addChild(this._grpSymbolAnim);

        this._grpSymbolFX = game.add.group();
        this._grpPosition.addChild(this._grpSymbolFX);

        this._grpSpecialFrame = game.add.group();
        this._grpPosition.addChild(this._grpSpecialFrame);

        this._grpSymbolFXMask = game.add.group();
        this._grpPosition.addChild(this._grpSymbolFXMask);

        this.drawScreen();
        this.checkResolution();
    };

    this.drawScreen = function () {
        this._sprMask = game.add.graphics();
        this._sprMask.beginFill(0xffffff);
        this._sprMask.drawRect(this._posX - 2, this._posY - 1, GlobalClass.SYMBOL_WIDTH * GlobalClass.TOTAL_COLUMN + 2, GlobalClass.SYMBOL_HEIGHT * GlobalClass.TOTAL_ROW + 2);
        this._grpMask.addChild(this._sprMask);
        this._grpReel.mask = this._sprMask;
        this._grpScatter.mask = this._sprMask;
        this._grpSymbolFX.mask = this._sprMask;
        this._grpSpecialFrame.mask = this._sprMask;
        this._grpSymbolFXMask.mask = this._sprMask;
        this._grpReelMask.mask = this._sprMask;
        this._grpGreySymbol.mask = this._sprMask;
        this._grpSymbolAnim.mask = this._sprMask;

        this.setTheme(1);
        this.reloadReel();
        this.updateSpecialFrame();
    };

    this.updateSpecialFrame = function (specialFrames) {
        if (specialFrames == null || specialFrames.length <= 0) {
            return;
            // specialFrames = [];
            // if(GlobalClass.betPerLine1()==15){
            //   specialFrames[0] = true;
            //   specialFrames[1] = true;
            //   specialFrames[2] = true;

            // }
            // else{
            //   var hasTrue = false;
            //   for(var i=0;i<3;i++){
            // 	var ran = GlobalClass.randomRange(0, 1);
            // 	if(ran==0){
            // 	  specialFrames.push(false);
            // 	}
            // 	else{
            // 	  hasTrue = true;
            // 	  specialFrames.push(true);
            // 	}
            //   }
            //   if(!hasTrue){
            // 	var ran = GlobalClass.randomRange(0, 2);
            // 	specialFrames[ran] = true;
            //   }
            // }
        }
        GlobalClass.deleteChildren(this._grpSpecialFrame);
        GlobalClass.SPECIAL_FRAMES[i] = specialFrames;
        for (var i = 0; i < specialFrames.length; i++) {
            if (specialFrames[i]) {
                this._reelColumnArr[GlobalClass.TOTAL_COLUMN - 1].addSpecialFrames(i);
            }
        }
        this._specialFrames = specialFrames;
    };

    this.checkResolution = function () {
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function () {
        this._grpPosition.x = this._posLandscapeX;
        this._grpPosition.y = this._posLandscapeY;
        this.sx = this._posLandscapeX;
        this.sy = this._posLandscapeY;
        this._grpPosition.scale.set(1, 1);

    };

    this.createPortrait = function () {
        this._grpPosition.x = this._posPortraitX;
        this._grpPosition.y = this._posPortraitY;
        this.sx = this._posPortraitX;
        this.sy = this._posPortraitY;

        this._grpPosition.scale.set(GlobalClass.PORTRAIT_SCALE, GlobalClass.PORTRAIT_SCALE);
    };

    this.setTheme = function (type) {
        this.removeBackground();

        switch (type) {
            case 1:
                //this._sprBackground = game.add.sprite(this._posX - 8, this._posY - 8, 'bgreelnormal', '', this._grpBackground);
                break;
            case 2:
            case 3:
                //this._sprBackground = game.add.sprite(this._posX - 8, this._posY - 8, 'bgreelfeature', '', this._grpBackground);
                break;
        }
    };

    this.test = function () {

    };

    this.removeBackground = function () {
        if (this._sprBackground != null) {
            this._sprBackground.destroy();
            this._sprBackground = null;
        }
    };

    this.reloadReel = function () {
        if (this._timerRepeat != null) {
            game.time.events.remove(this._timerRepeat);
        }
        TweenMax.killTweensOf(this._grpReel);
        GlobalClass.deleteChildren(this._grpReel);
        GlobalClass.deleteChildren(this._grpSpeReel);
        GlobalClass.deleteChildren(this._grpScatter);
        GlobalClass.deleteChildren(this._grpSymbolFX);
        GlobalClass.deleteChildren(this._grpGreySymbol);
        GlobalClass.deleteChildren(this._grpSymbolAnim);
        GlobalClass.deleteChildren(this._grpSpecialFrame);
        GlobalClass.deleteChildren(this._grpReelMask);


        if (this._grpDelayFx != null) {
            this._grpDelayFx.destroy();
            this._grpDelayFx = null;
        }

        for (var i = GlobalClass.TOTAL_COLUMN - 1; i >= 0; i--) {
            this._reelColumn = new reelcolumnClass(game, this._grpReel);
            this._reelColumn.create(this, this._posX + (i * GlobalClass.SYMBOL_WIDTH), this._posY, i);
            this._reelColumnArr[i] = this._reelColumn;
        }
        //this.updateSpecialFrame(this._specialFrames);
    };

    this.startSpin = function () {
        this.startTime = new Date().getTime();
        this._isSoundScatValue = 0;
        this._isSoundScatPossible = GlobalClass.TOTAL_COLUMN;
        this._isSoundScatChance = true;

        this._countReelSpin = -1;
        this._countFinishSpin = -1;
        this._picaSymbols = [];

        /* special status for fox
         * 0 = normal
         * 1 = massivesymbol
         * 2 = random wild
         * 3 = full wild
         */
        this._statusColumn = [0, 0, 0, 0, 0];
        this._statusRow = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        this._countReelSpin = -1;

        if (GlobalClass.CONFIG_QUICKSPIN && AppConstants.TURBO) {
            this._quickSpin = true;

            this.rowSpin();
            this.rowSpin();
            this.rowSpin();
            this.rowSpin();
            this.rowSpin();
        } else {
            this._quickSpin = false;
            this.rowSpin();
            this._timerRepeat = game.time.events.repeat(Phaser.Timer.SECOND * 0.2, GlobalClass.TOTAL_COLUMN - 1, this.rowSpin, this);
        }
    };

    this.rowThreeSpin = function () {
        this._countReelSpin++;
        this._reelColumnArr[this._countReelSpin].startSpin();
        this._countReelSpin++;
        this._reelColumnArr[this._countReelSpin].startSpin();
        this._countReelSpin++;
        this._reelColumnArr[this._countReelSpin].startSpin();
    };

    this.rowSpin = function () {
        this._countReelSpin++;
        this._reelColumnArr[this._countReelSpin].startSpin();

        if (this._countReelSpin == GlobalClass.TOTAL_COLUMN - 1) {
            this._countReelSpin = -1;
            gameplayState.finishSpinReel(); // continue to this.nextStop(true);
        }
    };

    this.prepareStop = function () {
        this._timerRepeat = game.time.events.add(GlobalClass.GAME_DURATION, this.prepareStop2, this, true);
    };

    this.prepareStop2 = function() {
        if (this._quickSpin) {
            this._timerRepeat = game.time.events.repeat(Phaser.Timer.SECOND * 0.1, 5, this.nextStop, this, true);
        } else {
            this.nextStop(true);
        }
    };

    this.nextStop = function (short) {
        this._countReelSpin++;
        if (this._statusColumn[this._countReelSpin] == 0) { // normal spin + found fullwild
            this._reelColumnArr[this._countReelSpin].setPositionStop(GlobalClass.GAME_STOPCODE[this._countReelSpin], short);

            if (!short) {
                this.darkenedReel(this._countReelSpin);
                soundClass.playSound("soundreeldelay");
                if (this._grpDelayFx != null) {

                    //var tw = game.add.tween(this._sprDelayFx).to( { x:this._posX + GlobalClass.SYMBOL_WIDTH * (this._countReelSpin)}, 200, "Linear", true,0,0);

                    TweenMax.to(this._sprDelayFx, 0.2, {
                        x: this._posX + GlobalClass.SYMBOL_WIDTH * (this._countReelSpin) + 85,
                        ease: Linear.easeNone,
                        useFrames: false,
                        callbackScope: this,
                        onComplete: function () {
                            this._sprDelayFx.animations.play('anim');
                        }
                    });
                }
                else {
                    this._grpDelayFx = game.add.group();
                    this._grpDelay.addChild(this._grpDelayFx);
                    this._sprDelayFx = game.add.sprite(this._posX + GlobalClass.SYMBOL_WIDTH * (this._countReelSpin) + 85, this._posY + 255, 'symbolFX', 'ScrDelayFX_00.png');
                    this._grpDelayFx.addChild(this._sprDelayFx);

                    var textures = this._sprDelayFx.animations.generateFrameNames('ScrDelayFX_', 0, 8, '.png', 2);
                    this._sprDelayFx.animations.add("anim", textures, true, 0.2);
                    this._sprDelayFx.animations.play('anim');
                }
            }
            else {
                GlobalClass.deleteChildren(this._grpDelay);
            }
        } else {
            GlobalClass.deleteChildren(this._grpReelMask);
            //GlobalClass.deleteChildren(this._grpScatter);
            if (this._grpDelayFx != null) {
                this._grpDelayFx.destroy();
                this._grpDelayFx = null;
            }
            this.reelFinish(this._countReelSpin, false, true);
        }
    };

    this.darkenedReel = function (reelIndex) {
        GlobalClass.deleteChildren(this._grpReelMask);
        for (var i = 0; i < GlobalClass.TOTAL_COLUMN; i++) {
            if (i == reelIndex) {
                continue;
            }
            this._reelColumnArr[i].showDarkMask();
        }
    };

    this.darkenedSymbol = function () {
        GlobalClass.deleteChildren(this._grpSymbolAnim);
        GlobalClass.deleteChildren(this._grpGreySymbol);
        for (var i = 0; i < GlobalClass.TOTAL_COLUMN; i++) {
            this._reelColumnArr[i].showDarkMaskSymbol(this._grpGreySymbol);
        }
    };

    this.reelFinish = function (column, getScatter, getWild) {
        this._countFinishSpin++;

        if (GlobalClass.SCATTER_WIN_SKIP == true) {
            if (this._isSoundScatPossible < GlobalClass.MIN_SCATTER) {
                this._isSoundScatChance = false;
            }
        }
        if (GlobalClass.SCATTER_WIN_SKIP == false) {
            if (column == 0 && getScatter == false) {
                this._isSoundScatChance = false;
            }
            if (column == 1 && getScatter == false) {
                this._isSoundScatChance = false;
            }
            if (column == 2 && getScatter == false) {
                this._isSoundScatChance = false;
            }
            if (column == 3 && getScatter == false) {
                this._isSoundScatChance = false;
            }
        }

        if (this._countFinishSpin < GlobalClass.TOTAL_COLUMN - 1) {
            if (this._quickSpin) {
                // do nothing
            } else {
                if (this._isSoundScatValue >= 2 && this._isSoundScatChance) {
                    if (this._countReelSpin + 1 > 2 && GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1) {
                        this.nextStop(true);
                    }
                    else {
                        this.nextStop(false);
                    }

                } else {
                    this.nextStop(true);
                }
            }
        } else {
            this.reloadReel();

            if (this._isSoundScatValue >= 3) {
                GlobalClass.GAME_CONDITION = GlobalClass.GAME_CONDITION_ANIMATIONS;
                soundClass.playSound("FGTrigger");
                //soundClass.playSound("soundreeltrigger");

                gameplayState.checkWinSpin();
            } else {
                gameplayState.checkWinSpin();
            }
        }
    };

    this.soundReel = function (column, getScatter, getWild, getPICA) {
        if (getScatter && this._isSoundScatChance) {
            this._isSoundScatValue++;
            var sName = "soundreelstop";
            if (column <= 2 || (column > 2 && column - this._isSoundScatValue <= 1)) {
                sName = "soundreelteaser" + this._isSoundScatValue;
            }
            soundClass.playSound(sName);
            // switch (this._isSoundScatValue) {
            //   case 1:
            // 	soundClass.playSound("soundreelteaser1");
            // 	break;
            //   case 2:
            // 	soundClass.playSound("soundreelteaser2");
            // 	break;
            //   case 3:
            // 	soundClass.playSound("soundreelteaser3");
            // 	break;
            //   case 4:
            // 	soundClass.playSound("soundreelteaser4");
            // 	break;
            //   case 5:
            // 	soundClass.playSound("soundreelteaser5");
            // 	break;
            //   default:
            // 	soundClass.playSound("soundreelstop");
            // 	break;
            // }
        } else if (getWild) {
            //soundClass.playSound("soundreelwild");
            soundClass.playSound("soundreelstop");
        }
        else if (getPICA && GlobalClass.GAME_MODE != GlobalClass.GAME_MODE_FEATURE1) {
            soundClass.playSound("soundreelpica");
        }
        else {
            soundClass.playSound("soundreelstop");
        }

        this._isSoundScatPossible = GlobalClass.TOTAL_COLUMN - column + this._isSoundScatValue - 1;
    };

    this.setReel = function () { // not used

    };

    this.setAnimation = function (column, row, loop) {
        this._reelColumnArr[column].setAnimation(row, loop);
    };

    this.symbolBlow = function (column, row) {
        return this._reelColumnArr[column].symbolBlow(row);
    }

    this.addMask = function () {
        for (var i = 0; i < this._reelColumnArr.length; i++) {
            this._reelColumnArr[i].addMask();
        }
    };

    this.getFXSymbol = function (column, row) {
        return this._reelColumnArr[column].getFXSymbol(row);
    };


    this.setFoxFullWild = function (column) {
        this._statusColumn[column] = -1;
        this._reelColumnArr[column].remove();
    };

    this.setFoxRandomWild = function (column, row) { // not used
    };

    this.setMassiveSymbol = function (column, row) { // not used
    };
}
