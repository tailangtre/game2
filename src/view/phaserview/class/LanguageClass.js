var languageClass = function(game, group) {
    this._grpLang = null;
    this._sprLang = null;

    this._sprSelected = null;
    this._posYSelected = 0;

    this.create = function() {
      GlobalClass.GAME_OPTION = true;

      this._grpLang = game.add.group();
      group.addChild(this._grpLang);
      this.checkResolution();
    };
    
    this.drawScreen = function() {
      GlobalClass.deleteChildren(this._grpLang);
      var bgTransparent = game.add.sprite(0, 0, 'uiPanel', 'BG_allBanners.png', this._grpLang);
      bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
      bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
      bgTransparent.interactive = true;

      var bg = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpLang);
      bg.width = 20000
      bg.height = 20000;
      bg.alpha = 0.1;
      bg.interactive = true;
      this.createWindow();
    };
  
    this.checkResolution = function() {
      if (AppConstants.LANDSCAPE) {
        this.createLandscape();
      } else {
        this.createPortrait();
      }
    };

    this.createWindow = function(){
        if (AppConstants.LANDSCAPE) {
            this._autospinFrame = game.add.sprite(120, 480, 'network', 'Language-select-frame.png');
        } else {
            this._autospinFrame = game.add.sprite(120, 1000, 'network', 'Language-select-frame.png');
        }  
        
        this._autospinFrame.scale.x *= -1.5;
        this._autospinFrame.scale.y = 1.5;
        this._autospinFrame.anchor.set(0.5, 0.5);
        // this._autospinFrame.scale.set(1.20);
        this._grpLang.addChild(this._autospinFrame);

        var closeBtn = game.add.button(this._autospinFrame.x + this._autospinFrame.width/2, this._autospinFrame.y - this._autospinFrame.height/2, 'network', this.btnClick, this, "close-button.png", "close-button.png", "close-button.png", "closeWin", this._grpLang);
        closeBtn.anchor.set(0.5, 0.5);
        closeBtn.scale.set(1.5);

        var startX = this._autospinFrame.x - 31;
        var startY = this._autospinFrame.y - 58;
        this._posYSelected = startY;
  
        for(var i=0;i<GlobalClass.GAME_LANGS.length;i++){
            var langText = GlobalClass.GAME_LANGS[i];
            //var country = GlobalClass.GAME_COUNTRY[i];
            var x = startX + 18;
            var y = 0;
            // if(i%2==1){
            //   x = startX+80;
            //   var s = i-1;
            //   y = startY + s/2*54;
            // }
            // else{
              // y = startY + i/2*54;
            // }

            y = startY + i * 65 - 10;

            // let key = "network";
            // if (langText != "en") {
              key = "flags"
            // }

            var langBtn = game.add.button(x, y, key, this.btnClick, this, langText+'.png', langText+'.png', langText+'.png',langText);
            langBtn.anchor.set(0.5, 0.5);
            langBtn.scale.set(1.5);
            this._grpLang.addChild(langBtn);

            // if(langText==GlobalClass.GAME_LANG){
            //   var add = 0;
            //   if(i%2==1){
            //     add = 4;
            //   }
              
            // }
            
          
    
            // var lang =  game.add.text(langBtn.x, langBtn.y, country, {
            //     fontSize:"20px",
            //     fontFamily:"Arial",
            //     fontWeight:"bold",
            //     fill: "#fff",
            //     align: "center"
            // });
            // lang.anchor.set(0.5, 0.5);
            // this._grpLang.addChild(lang);
        }

        this._sprSelected = game.add.sprite(startX + 114, 0, 'network', 'selected-marker.png', this._grpLang);
        this._sprSelected.anchor.set(0.5, 0.5);
        this._sprSelected.scale.set(1.5);

        this.setSelectedPositionY();
    };
    
    this.setSelectedPositionY = function() {
      switch (GlobalClass.GAME_LANG) {
        case "en":
          this._sprSelected.y = this._posYSelected - 13;
          break;
        case "fr":
          this._sprSelected.y = this._posYSelected + 58;
          break;
        case "sp":
          this._sprSelected.y = this._posYSelected + 121;
          break;
      }
    };

    this.createLandscape = function() {
      this.drawScreen();
    };
  
    this.createPortrait = function() {
      this.drawScreen();
    };

    this.btnClick = function(btn){
        soundClass.playSound("soundbtnclick");
        if("closeWin"==btn.btnKey){
            this.close();
        } else{
            // switchLang(btn.btnKey);
            this.changeLanguage(btn.btnKey);
        }
        
    };
    this.changeLanguage = function(lang) {
      GlobalClass.GAME_LANG = lang;
      this.setSelectedPositionY();
      // GlobalClass.GAME_ROOT._buttonClass.changeLanguage();
      // GlobalClass.GAME_ROOT._informationClass.changeLanguage();
      // if (GlobalClass.GAME_ROOT._replayClass != null) {
      //     GlobalClass.GAME_ROOT._replayClass.changeLanguage();
      // }
      // GlobalClass.GAME_ROOT.networkStateLanguage();
      gameplayState._buttonClass.changeLanguage();
    };
    this.close = function() {
      AppFacadeInstance.sendNotification(SlotsEvents.SAVE_DATA);
      
      GlobalClass.GAME_OPTION = false;

        if (this._grpLang != null) {
            this._grpLang.destroy();
            this._grpLang = null;
        }

        gameplayState._languageClass = null;
    };
}




  