var winlineClass = function(game, group) {
  this._posLandscapeX = 0;
  this._posLandscapeY = 0;
  this._posPortraitX = -20;
  this._posPortraitY = 330;
  this._grpPosition = null;

  this._grpLine = null;
  this._lineDraw = null;

  this._grpMask = null;
  this._sprMask = null;
  this._pathLines = [];
  this._currShowLine = 0;
  this._timerFunc=null;

  this._lineStart = [{
    x: 111,
    y: 146
  }, {
    x: 111,
    y: 316
  }, {
    x: 111,
    y: 486
  }];

  this.create = function(lineObj) {
    if (this._grpPosition == null) {
      this._grpPosition = game.add.group();
      group.addChild(this._grpPosition);
    }

    if (lineObj != null) {
      //this.createMask(maskArr);
      this.createLine(lineObj,1);
    }

    this.checkResolution();
  };

  this.createMulti = function() {
    if (this._grpPosition == null) {
      this._grpPosition = game.add.group();
      group.addChild(this._grpPosition);
    }
    this._currShowLine = 0;
    this.preCreateLine();
    this.checkResolution();
  };

  this.checkResolution = function() {
    if (AppConstants.LANDSCAPE) {
      this.createLandscape();
    } else {
      this.createPortrait();
    }
  };

  this.createLandscape = function() {
    if (this._grpPosition != null) {
      this._grpPosition.x = this._posLandscapeX;
      this._grpPosition.y = this._posLandscapeY;
      this._grpPosition.scale.set(1, 1);
    }
  };

  this.createPortrait = function() {
    if (this._grpPosition != null) {
      this._grpPosition.x = this._posPortraitX;
      this._grpPosition.y = this._posPortraitY;
      this._grpPosition.scale.set(GlobalClass.PORTRAIT_SCALE,GlobalClass.PORTRAIT_SCALE);
    }
  };
  this.preCreateLine=function(){
    if(GlobalClass.GAME_DATA.lineWin && GlobalClass.GAME_DATA.lineWin.lineWins.length>0){
      if(this._currShowLine>=GlobalClass.GAME_DATA.lineWin.lineWins.length){
        if (this._timerFunc != null) {
          game.time.events.remove(this._timerFunc);
        }
        return;
      }

      var lineObj = GlobalClass.GAME_DATA.lineWin.lineWins[this._currShowLine++];
      this.createLine(lineObj,2);
    }
  }

  this.createLine = function(lineObj,showType) {

    this._pathLines = [];
    if (this._grpLine == null) {
      this._grpLine = game.add.group();
      this._grpPosition.addChild(this._grpLine);
    }
    var linePath =  GlobalClass.WIN_LINE[lineObj.lineNo];
    if (showType == 1) {
      gameplayState._reelClass.darkenedSymbol();
    }
    var start = {};
    for(var i=0;i<linePath.length;i++){

      var index = linePath[i];
      if(i<lineObj.numOfSymbols){
        gameplayState._reelClass.setAnimation(i, index, showType);
      }
      if(i==0){
        start = {x:this._lineStart[index].x,y:this._lineStart[index].y};
        continue;
      }
      var end = {x:this._lineStart[index].x+i*GlobalClass.SYMBOL_WIDTH,y:this._lineStart[index].y};

      var sx = end.x-start.x;
      var sy = end.y-start.y;

      this._lineDraw = game.add.sprite(start.x,start.y, 'ui', 'line.png');
      this._lineDraw.alpha = 0.0;
      this._lineDraw.to = end;
      this._lineDraw.index = i;
      this._lineDraw.anchor.set(0,0.5);
      this._lineDraw.rotation = Math.atan2(sy,sx);
      this._lineDraw.width = Math.sqrt(sx*sx + sy*sy);
      this._grpLine.addChild(this._lineDraw);
      this._pathLines.push(this._lineDraw);
      start = end;
    }

    this.showLines(showType);
    if(showType==2){
      this._timerFunc = game.time.events.add(650,this.preCreateLine,this);
    }
    else{
      if(this.winValue!=null){
        this.winValue.remove();
      }
      this.winValue = new winvalueClass(game, gameplayState._winValueGroup);
      this.winValue.create(lineObj.winAmount,null,1000,linePath[2]);
    }
  };
  this.showLines =function(type){
    for (var i = 0; i < this._pathLines.length; i++) {
      if (type == 1) {
        TweenMax.to(this._pathLines[i], 0.7, {
          alpha: 1.0,
          delay: i * 50/1000,
          ease: Linear.easeNone,
          useFrames: false
        });
        TweenMax.to(this._pathLines[i], 0.7, {
          alpha: 0,
          delay:0.75,
          ease: Linear.easeNone,
          useFrames: false
        });
      }
      else {
        var w = this._pathLines[i].width;
        this._pathLines[i].width = 0.0;
        //var t = game.add.tween(this._pathLines[i]).to({ alpha: 1.0, width: w }, 50, "Linear", true, i * 50, 0);
        TweenMax.to(this._pathLines[i], 0.05, {
          alpha: 1.0,
          width: w,
          delay: i * 50/1000,
          ease: Linear.easeNone,
          useFrames: false,
          callbackScope: this,
					onCompleteParams: [this._pathLines[i]],
					onComplete: this.showComplete
        });
        
      }
    }
  };
  this.showComplete = function (line){
    line.position.set(line.to.x,line.to.y);
    line.anchor.set(1,0.5);
    //game.add.tween(line).to( { alpha:0.0,width:0 }, 100, "Linear", true,150,0);
    TweenMax.to(line, 0.1, {
      alpha: 0.0,
      delay: 0.15,
      ease: Linear.easeNone,
      useFrames: false
    });
  };
  this.remove = function() {
    if (this._grpLine != null) {
      this._grpLine.destroy();
      this._grpLine = null;
    }
    if (this._timerFunc != null) {
      game.time.events.remove(this._timerFunc);
    }
    gameplayState._winLine = null;
    if(this.winValue!=null){
      this.winValue.remove();
    }
  };
}

