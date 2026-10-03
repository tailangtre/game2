var informationClass = function(game, group) {
  this._posLandscapeX = 452;
  this._posLandscapeY = 570;
  this._posPortraitX = 360;
  this._posPortraitY = 796;
  this._maskWidth = 700;
  this._grpPosition = null;

  this._grpBar = null;
  this._sprBar = null;

  this._grpInfo = null;
  this._txtInfo = null;

  this._grpSymbol = null;
  this._sprSymbol = null;

  this._grpWin = null;
  this._txtWin1 = null;
  this._txtWin2 = null;
  this._txtWin3 = null;
  this._txtWin4 = null;

  this._grpFeature = null;
  this._txtFeature1 = null;
  this._txtFeature2 = null;
  this._txtFeature3 = null;

  this._textTimer = null;
  this._textIdlePos = -1;

  // STYLE TEXT
  this._style1 = null;
  this._style2 = null;

  this.create = function() {

    this._grpPosition = game.add.group();
    group.addChild(this._grpPosition);

    this._grpBar = game.add.group();
    this._grpPosition.addChild(this._grpBar);

    this._grpInfo = game.add.group();
    this._grpPosition.addChild(this._grpInfo);

    this._grpSymbol = game.add.group();
    this._grpPosition.addChild(this._grpSymbol);

    this._grpMask = game.add.group();
	  group.addChild(this._grpMask);

    this._style1 = {
      //font: "16px Arial",
      fontSize:"16px",
      fontFamily:"Arial",
      fill: "#FFFFFF",
      stroke: "#6699FF",
      strokeThickness: 4,
      align: "center"
    };

    this._style2 = {
      fontSize:"16px",
      fontFamily:"Arial",
      fill: "#FFFFFF",
      stroke: "#FF3333",
      strokeThickness: 4,
      align: "center"
    };

    this.drawScreen();
    this.checkResolution();
  };

  this.drawScreen = function() {
    this._txtInfo = game.add.text(0,15, "", this._style1, this._grpInfo);
    this._txtInfo.anchor.set(0.5, 0.5);

    this.setText("idle");
    
  };

  this.checkResolution = function() {
    if (AppConstants.LANDSCAPE) {
      this.createLandscape();
    } else {
      this.createPortrait();
    }
  };

  this.createLandscape = function() {
    GlobalClass.deleteChildren(this._grpMask);
    GlobalClass.deleteChildren(this._grpSymbol);
    this._maskWidth = 700;
    this._sprMask = game.add.graphics();
    this._sprMask.beginFill(0xffffff);
    this._sprMask.visible = false;
	  this._sprMask.drawRect(game.world.centerX - 535, 570,this._maskWidth, 27);
    this._grpMask.addChild(this._sprMask);

    this._sprMask.visible = true;
    this._grpSymbol.mask = this._sprMask;

    this._grpPosition.x = this._posLandscapeX;
    this._grpPosition.y = this._posLandscapeY;
  };

  this.createPortrait = function() {
    //TweenMax.killTweensOf(this._grpSymbol);
   // TweenMax.killTweensOf(this._grpMask);
    GlobalClass.deleteChildren(this._grpMask);
    GlobalClass.deleteChildren(this._grpSymbol);

    this._maskWidth = 570;
    this._sprMask = game.add.graphics();
    this._sprMask.beginFill(0x0000);
    this._sprMask.visible = false;
	  this._sprMask.drawRect(game.world.centerY - 280, 796,this._maskWidth, 27);
    this._grpMask.addChild(this._sprMask);

    this._sprMask.visible = true;
    this._grpSymbol.mask = this._sprMask;

    this._grpPosition.x = this._posPortraitX;
    this._grpPosition.y = this._posPortraitY;
  };

  this.setText = function(condition, winLine, winValue, symbolType, symbolTotal) {
    this._txtInfo.x = 0;
    switch (condition) {
      case "console":
        this.removeText();
        this._txtInfo.text = winLine;
        break;
      case "empty":
        this.removeText();
        break;
      case "nocoin":
        this.removeText();
        this._txtInfo.text = GlobalClass.getXMLByKey(game, 'infonocoin');
        break;
      case "idle":
        this._textTimer = game.time.events.add(Phaser.Timer.SECOND * 3, this.timerFunc, this);
        break;
      case "spin":
        this.removeText();
        var ran = GlobalClass.randomRange(1, 3);
        this._txtInfo.text = GlobalClass.getXMLByKey(game, 'infospin'+ran);
        break;
      case "win":
        this.removeText();
        if(GlobalClass.GAME_TOTAL_WIN < GlobalClass.totalBet()){
          winLine = 1;
        }
        this._txtInfo.text = GlobalClass.getXMLByKey(game, 'infowin'+winLine);
        break;
      case "nowin":
        this.removeText();
        var ran = GlobalClass.randomRange(1, 3);
        this._txtInfo.text = GlobalClass.getXMLByKey(game, 'infonowin'+ran);
        break;
      case "result":
        this.removeText();
        this.addTextWin(winLine, winValue, symbolType, symbolTotal);
        break;
      case "freegames":
        this.removeText();
        this.addTextFeature(gameplayState._gameFreeTotal - gameplayState._gameFreeLeft, gameplayState._gameFreeTotal);
        break;
      case "jackpotwin":
        this.removeText();
        var jackpotwinText = GlobalClass.getXMLByKey(game, 'jackpotwin');
        jackpotwinText = jackpotwinText.replace("#WINVALUE",winValue);
        jackpotwinText = jackpotwinText.replace("#JACKPOTNAME",winLine);
        this._txtInfo.text = jackpotwinText;
        break;
      default:
    }
  };

  this.timerFunc = function() {
    this.removeText();
    this._txtInfo.x = 0;

    var ran = GlobalClass.randomRange(1, 6);

    while (this._textIdlePos == ran) {
      ran = GlobalClass.randomRange(1, 6);
    }
    this._textIdlePos = ran;
    var totalWidth = 0;
    switch (ran) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        totalWidth = this.checkString(GlobalClass.getXMLByKey(game, 'infoidle'+ran), GlobalClass.getPosX(0), GlobalClass.getPosY(6), true, "small", "16px Arial", this._grpSymbol);
        break;
      case 7:
        totalWidth = this.checkString(GlobalClass.getXMLByKey(game, 'infoidle'+ran), GlobalClass.getPosX(39), GlobalClass.getPosY(6), true, "small", "14px Arial", this._grpSymbol);
        break;
      case 9:
        totalWidth = this.checkString(GlobalClass.getXMLByKey(game, 'infoidle'+ran), GlobalClass.getPosX(40), GlobalClass.getPosY(6), true, "mini", "15px Arial", this._grpSymbol);
        break;
      case 8:
      case 10:
        totalWidth = this.checkString(GlobalClass.getXMLByKey(game, 'infoidle'+ran), GlobalClass.getPosX(50), GlobalClass.getPosY(6), true, "small", "14px Arial", this._grpSymbol);
        break;
    }

    if(totalWidth > this._maskWidth){
      var x = (totalWidth-this._maskWidth)/2;
      var movetoX = this._grpSymbol.x - 2*x;
      this._grpSymbol.x = this._grpSymbol.x + x;
      TweenMax.to(this._grpSymbol,6, {
        x: movetoX,
        ease: Linear.easeNone,
        useFrames: false,
        callbackScope: this,
        onComplete: function(){
          this._textTimer = game.time.events.add(Phaser.Timer.SECOND *1, this.timerFunc, this);
        }
      });
    }
    else{
      this._textTimer = game.time.events.add(Phaser.Timer.SECOND *3, this.timerFunc, this);
    }
  };

  this.addTextWin = function(winLine, winValue, symbolType, symbolTotal) {
    this._grpWin = game.add.group();
    this._grpPosition.addChild(this._grpWin);

    if (winLine == 0) {
      this._txtWin1 = game.add.text( GlobalClass.getPosX(-130), GlobalClass.getPosY(17), "SCATTER WIN", this._style1);
      this._txtWin1.anchor.set(0.5, 0.5);
      this._grpWin.addChild(this._txtWin1);
    } else {
      this._txtWin1 = game.add.text(GlobalClass.getPosX(-130), GlobalClass.getPosY(17), "LINE", this._style1);
      this._txtWin1.anchor.set(0.5, 0.5);
      this._grpWin.addChild(this._txtWin1);

      this._txtWin2 = game.add.text(GlobalClass.getPosX(-100), GlobalClass.getPosY(17), String(winLine), this._style2);
      this._txtWin2.anchor.set(0, 0.5);
      this._grpWin.addChild(this._txtWin2);
    }

    this._txtWin3 = game.add.text(GlobalClass.getPosX(130), GlobalClass.getPosY(17), "WINS", this._style1);
    this._txtWin3.anchor.set(0.5, 0.5);
    this._grpWin.addChild(this._txtWin3);

    this._txtWin4 = game.add.text( GlobalClass.getPosX(160), GlobalClass.getPosY(17), GlobalClass.getFormatCurrency(winValue), this._style2);
    this._txtWin4.anchor.set(0, 0.5);
    this._grpWin.addChild(this._txtWin4);

    //this._grpSymbol = game.add.group();
    //this._grpPosition.addChild(this._grpSymbol);
    

    for (var i = 0; i < symbolTotal; i++) {
      if (symbolType == 0) {
        this._sprSymbol = game.add.sprite(GlobalClass.getPosX(-44) + (i * 30), GlobalClass.getPosY(15), 'symbols1', 'Wild_00.png');
      } else if (symbolType == 12) {
        this._sprSymbol = game.add.sprite(GlobalClass.getPosX(-44) + (i * 30), GlobalClass.getPosY(15), 'symbols1', 'Scatter_00.png');
      } else {
        var syb = GlobalClass.mathSymbol(symbolType);
        // console.log(syb.symbolPngName)
        this._sprSymbol = game.add.sprite(GlobalClass.getPosX(-44) + (i * 30), GlobalClass.getPosY(15), syb.assetName, '' + syb.symbolPngName);
      }
      this._sprSymbol.anchor.set(0.5, 0.5);
      this._sprSymbol.scale.set(0.18, 0.18);
      this._grpSymbol.addChild(this._sprSymbol);
    }
  };

  this.addTextFeature = function(left, total) {
    this._grpFeature = game.add.group();
    this._grpPosition.addChild(this._grpFeature);

    this._txtFeature1 = game.add.text(GlobalClass.getPosX(10), GlobalClass.getPosY(17), "OF          FREE GAMES", this._style1);
    this._txtFeature1.anchor.set(0.5, 0.5);
    this._grpFeature.addChild(this._txtFeature1);

    this._txtFeature2 = game.add.text(GlobalClass.getPosX(-100), GlobalClass.getPosY(17), String(left), this._style2);
    this._txtFeature2.anchor.set(0.5, 0.5);
    this._grpFeature.addChild(this._txtFeature2);

    this._txtFeature3 = game.add.text(GlobalClass.getPosX(-30), GlobalClass.getPosY(17), String(total), this._style2);
    this._txtFeature3.anchor.set(0.5, 0.5);
    this._grpFeature.addChild(this._txtFeature3);
  };

  this.removeText = function() {
    if (this._textTimer != null) {
      game.time.events.remove(this._textTimer);
      this._textTimer = null;
    }
    // if (this._grpInfo != null) {
    //     this._grpInfo.destroy();
    //     this._grpInfo = null;
    // }
    this._txtInfo.text = "";
    GlobalClass.deleteChildren(this._grpSymbol);
    this._grpSymbol.x = 0;
    // if (this._grpSymbol != null) {
    //   this._grpSymbol.destroy();
    //   this._grpSymbol = null;
    // }

    if (this._grpWin != null) {
      this._grpWin.destroy();
      this._grpWin = null;
    }

    if (this._grpFeature != null) {
      this._grpFeature.destroy();
      this._grpFeature = null;
    }
  };





  //~~~~~~~~~~~ ~~~~~~~~~~~
  //~~~~START TRANSLATE~~~~
  //~~~~~~~~~~~ ~~~~~~~~~~~
  this.countString = function(string, char) {
    if (string.indexOf(char) >= 0) {
      var re = new RegExp(char, "gi");
      return string.match(re).length;
    } else {
      return 0;
    }
  };

  this.checkString = function(sentence, sentenceX, sentenceY, middle, sizeSymbol, fontText, groupString) {
    var lengthWord = 0;
    var findWord = "";
    sentenceY = sentenceY - 2;
    var indexNo = 1000000;
    var atlasSymbol = "";
    var changeSymbol = "";

    var str = "";
    var txt = null;
    var symbol = null;

    var startX = sentenceX;
    var widthX = sentenceX;
    var totalWidth = 0;

    var symX = 0;
    var symY = 0;
    var symScl = 0;

    if (sizeSymbol == "small") {
      symX = 26; // fill
      symY = 11; // fill
      symScl = 0.15; // fill
    } else if (sizeSymbol == "large") {
      symX = 40; // fill
      symY = 4; // fill
      symScl = 0.2; // fill
    } else {
      symX = 8;
      symY = 10;
      symScl = 0.10;
    }

    var textFill = "#ffffff"; // fill
    var textFont = String(fontText); // fill
    var textWeight = "bold"; // fill
    var textStroke = "#6699FF"; // fill
    var textStrokeThickness = 4; // fill

    if (middle) {
      var iCurrent = 0;
      var iTotal = 0;

      str = sentence;

      iTotal = this.countString(str, "#SCATTER")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#SCATTER", "");
      }
      iTotal = this.countString(str, "#WILD")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#WILD", "");
      }

      iTotal = this.countString(str, "#A")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#A", "");
      }

      iTotal = this.countString(str, "#K")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#K", "");
      }
      iTotal = this.countString(str, "#Q")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#Q", "");
      }
      iTotal = this.countString(str, "#JAC")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#JAC", "");
      }
      iTotal = this.countString(str, "#10")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#10", "");
      }
      iTotal = this.countString(str, "#9")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#9", "");
      }

      iTotal = this.countString(str, "#GIRL")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#GIRL", "");
      }

      iTotal = this.countString(str, "#HORSE")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#HORSE", "");
      }

      iTotal = this.countString(str, "#GUN")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#GUN", "");
      }

      iTotal = this.countString(str, "#HANDWATCH")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#HANDWATCH", "");
      }


      iTotal = this.countString(str, "#JEWEL")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#JEWEL", "");
      }

      // iTotal = this.countString(str, "#MINI")
      // for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
      //   str = str.replace("#MINI", "");
      // }

      // iTotal = this.countString(str, "#MINOR")
      // for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
      //   str = str.replace("#MINOR", "");
      // }

      // iTotal = this.countString(str, "#MAJOR")
      // for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
      //   str = str.replace("#MAJOR", "");
      // }

      // iTotal = this.countString(str, "#GRAND")
      // for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
      //   str = str.replace("#GRAND", "");
      // }

      iTotal = this.countString(str, "#SPECIALFRAME")
      for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
        str = str.replace("#SPECIALFRAME", "");
      }

      txt = game.add.text(0, 0, str, {
        fill: textFill,
        font: textFont,
        fontWeight: textWeight,
        stroke: textStroke,
        strokeThickness: textStrokeThickness
      }, groupString);

      totalWidth = txt.width + (symX * this.countString(sentence, "#"));
      widthX -= totalWidth / 2;
      txt.destroy();

      str = sentence;
    }

    do {
      indexNo = 999999999;
      findWord = "";
      changeSymbol = "";

      if (sentence.indexOf("#SCATTER") >= 0 && sentence.indexOf("#SCATTER") < indexNo) {
        indexNo = sentence.indexOf("#SCATTER");
        lengthWord = "#SCATTER".length;
        findWord = "#SCATTER";
        atlasSymbol = "symbols1";
        changeSymbol = "Scatter_00.png";
      }

      if (sentence.indexOf("#WILD") >= 0 && sentence.indexOf("#WILD") < indexNo) {
        indexNo = sentence.indexOf("#WILD");
        lengthWord = "#WILD".length;
        findWord = "#WILD";
        atlasSymbol = "symbols1";
        changeSymbol = "Wild_00.png";
      }

      if (sentence.indexOf("#A") >= 0 && sentence.indexOf("#A") < indexNo) {
        indexNo = sentence.indexOf("#A");
        lengthWord = "#A".length;
        findWord = "#A";
        atlasSymbol = "symbols1";
        changeSymbol = "A_00.png";
      }

      if (sentence.indexOf("#Q") >= 0 && sentence.indexOf("#Q") < indexNo) {
        indexNo = sentence.indexOf("#Q");
        lengthWord = "#Q".length;
        findWord = "#Q";
        atlasSymbol = "symbols1";
        changeSymbol = "Q_00.png";
      }

      if (sentence.indexOf("#K") >= 0 && sentence.indexOf("#K") < indexNo) {
        indexNo = sentence.indexOf("#K");
        lengthWord = "#K".length;
        findWord = "#K";
        atlasSymbol = "symbols1";
        changeSymbol = "K_00.png";
      }

      if (sentence.indexOf("#JAC") >= 0 && sentence.indexOf("#JAC") < indexNo) {
        indexNo = sentence.indexOf("#JAC");
        lengthWord = "#JAC".length;
        findWord = "#JAC";
        atlasSymbol = "symbols1";
        changeSymbol = "J_00.png";
      }

      if (sentence.indexOf("#10") >= 0 && sentence.indexOf("#10") < indexNo) {
        indexNo = sentence.indexOf("#10");
        lengthWord = "#10".length;
        findWord = "#10";
        atlasSymbol = "symbols1";
        changeSymbol = "10_00.png";
      }

      if (sentence.indexOf("#9") >= 0 && sentence.indexOf("#9") < indexNo) {
        indexNo = sentence.indexOf("#9");
        lengthWord = "#9".length;
        findWord = "#9";
        atlasSymbol = "symbols1";
        changeSymbol = "9_00.png";
      }

      if (sentence.indexOf("#GIRL") >= 0 && sentence.indexOf("#GIRL") < indexNo) {
        indexNo = sentence.indexOf("#GIRL");
        lengthWord = "#GIRL".length;
        findWord = "#GIRL";
        atlasSymbol = "symbols2";
        changeSymbol = "pic1_00.png";
      }

      if (sentence.indexOf("#HORSE") >= 0 && sentence.indexOf("#HORSE") < indexNo) {
        indexNo = sentence.indexOf("#HORSE");
        lengthWord = "#HORSE".length;
        findWord = "#HORSE";
        atlasSymbol = "symbols2";
        changeSymbol = "Pic02_00.png";
      }

      if (sentence.indexOf("#GUN") >= 0 && sentence.indexOf("#GUN") < indexNo) {
        indexNo = sentence.indexOf("#GUN");
        lengthWord = "#GUN".length;
        findWord = "#GUN";
        atlasSymbol = "symbols2";
        changeSymbol = "Pic3_00.png";
      }

      if (sentence.indexOf("#HANDWATCH") >= 0 && sentence.indexOf("#HANDWATCH") < indexNo) {
        indexNo = sentence.indexOf("#HANDWATCH");
        lengthWord = "#HANDWATCH".length;
        findWord = "#HANDWATCH";
        atlasSymbol = "symbols2";
        changeSymbol = "Pic4_00.png";
      }

      if (sentence.indexOf("#JEWEL") >= 0 && sentence.indexOf("#JEWEL") < indexNo) {
        indexNo = sentence.indexOf("#JEWEL");
        lengthWord = "#JEWEL".length;
        findWord = "#JEWEL";
        atlasSymbol = "symbols2";
        changeSymbol = "pic05_00.png";
      }


      if (sentence.indexOf("#SPECIALFRAME") >= 0 && sentence.indexOf("#SPECIALFRAME") < indexNo) {
        indexNo = sentence.indexOf("#SPECIALFRAME");
        lengthWord = "#SPECIALFRAME".length;
        findWord = "#SPECIALFRAME";
        atlasSymbol = "ui";
        changeSymbol = "special-frame-mini.png";
      }

      str = sentence.slice(0, sentence.indexOf(findWord));
      txt = game.add.text(widthX, sentenceY, str, {
        fill: textFill,
        font: textFont,
        fontWeight: textWeight,
        stroke: textStroke,
        strokeThickness: textStrokeThickness
      }, groupString);

      widthX += txt.width;

      if (findWord != "") {
        symbol = game.add.sprite(0, 0, atlasSymbol, changeSymbol, groupString);
        if(atlasSymbol!='ui'){
          widthX += symX / 2;
          symbol.x = widthX;
          symbol.y = sentenceY + symY;
          symbol.anchor.set(0.5, 0.5);
          symbol.scale.set(symScl, symScl);
        }
        else if(changeSymbol=="special-frame-mini.png"){
          widthX += symX / 2;
          symbol.x = widthX+2;
          symbol.y = sentenceY + symY;
          symbol.anchor.set(0.5, 0.5);
          symbol.scale.set(0.16, 0.16);
        }
        else{
          symX = 50;
          widthX += symX / 2;
          symbol.x = widthX;
          symbol.y = sentenceY + symY;
          symbol.anchor.set(0.5, 0.5);
          symbol.scale.set(0.6, 0.6);
        }


        if (changeSymbol == "Scatter_00.png") {
          symbol.y = symbol.y - 3;
        }

        widthX += symX / 2;
      }

      sentence = sentence.substring(sentence.indexOf(findWord) + lengthWord, sentence.length)
    }
    while (sentence.indexOf("#") > 0);

    if (sentence.length > 0) {
      txt = game.add.text(widthX, sentenceY, sentence, {
        fill: textFill,
        font: textFont,
        fontWeight: textWeight,
        stroke: textStroke,
        strokeThickness: textStrokeThickness
      }, groupString);
    }
    return totalWidth;
  };
  //~~~~~~~~~~~ ~~~~~~~~~~~
  //~~~~END TRANSLATE~~~~
  //~~~~~~~~~~~ ~~~~~~~~~~~
}
