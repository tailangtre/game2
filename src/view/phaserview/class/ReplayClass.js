var replayClass = function(game, group, parent, data, type) {
    this._parent = parent;
    this._data = data;
    this._type = type;

    this._grpBackground = null;
    this._grpPosition = null;
    this._grpPanel = null;
    this._grpInfo = null;

    this._posLandscapeX = 0;
    this._posLandscapeY = 0;
    this._posPortraitX = -120;
    this._posPortraitY = 400;

    this._styleContent = {
        fontFamily: "Arial",
        fontSize: "24px",
        fontWeight: "bold",
        fill: "#fff",
        align: "center"
    };
    
    this._styleInfo2 = {
        fontFamily: "Arial",
        fontSize: "24px",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center"
    };
    
    this._styleAuto = {
        fontFamily: "Arial",
        fontSize: "24px",
        fill: "#ffffff",
        wordWrap: true,
        wordWrapWidth: 300
    };

    this.create = function() {
        GlobalClass.GAME_OPTION = true;
        
        this.addGroup();
        this.drawScreen();
        this.checkResolution();
    };

    this.checkResolution = function(){
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function() {
        if (this._sprBackground != null) {
            this._sprBackground.width = GlobalClass.STAGE_WIDTH;
            this._sprBackground.height = GlobalClass.STAGE_HEIGHT;
        }

        this._grpPosition.scale.set(1,1);
        this._grpPosition.x = this._posLandscapeX;
        this._grpPosition.y = this._posLandscapeY;
    
        if (this._grpInfo != null) {
            this._grpInfo.y = 0;
        }
    };

    this.createPortrait = function() {
        if (this._sprBackground != null) {
            this._sprBackground.width = GlobalClass.STAGE_WIDTH;
            this._sprBackground.height = GlobalClass.STAGE_HEIGHT;
        }
    
        this._grpPosition.scale.set(0.75, 0.75);
        this._grpPosition.x = this._posPortraitX;
        this._grpPosition.y = this._posPortraitY;
    
        if (this._grpInfo != null) {
            this._grpInfo.y = -533;
        }
    };

    this.addGroup = function() {
        this._grpBackground = game.add.group();
        group.addChild(this._grpBackground);

        this._grpPosition = game.add.group();
        group.addChild(this._grpPosition);

        this._grpPanel = game.add.group();
        this._grpPosition.addChild(this._grpPanel);

        this._grpInfo = game.add.group();
        this._grpPosition.addChild(this._grpInfo);
    };

    this.drawScreen = function() {
        if (this._type == 1) {
            this._sprBackground = new PIXI.Graphics();
            this._sprBackground.beginFill(0x000000);
            this._sprBackground.drawRect(0, 0, GlobalClass.STAGE_MAX, GlobalClass.STAGE_MAX);
            this._sprBackground.alpha = 0.5;
            this._sprBackground.interactive = true;
            this._grpBackground.addChild(this._sprBackground);

            this._sprBanner = game.add.sprite(640, 360, "network","network-error-frame.png", this._grpPanel);
            this._sprBanner.anchor.set(0.5, 0.5);
    
            this._txtDesc = game.add.text(640, 280, GlobalClass.getXMLByKey(game, 'notif_replay_start'), this._styleContent, this._grpPanel);
            this._txtDesc.anchor.set(0.5, 0.5);
    
            this._txtTime = game.add.text(640, 310, this.convertTime(this._data.result.created), this._styleContent, this._grpPanel);
            this._txtTime.anchor.set(0.5, 0.5);
    
            this._txtBet = game.add.text(640, 350, `${GlobalClass.getXMLByKey(game, 'totalbet')} ${GlobalClass.getFormatCurrency(this._data.result.wagerCurrency)}`, this._styleContent, this._grpPanel);
            this._txtBet.anchor.set(0.5, 0.5);

            this._btnInfo = game.add.button(this._sprBanner.x, this._sprBanner.y + 60, 'network', this.bnClose, this, 'refresh.png', 'refresh-clk.png', 'refresh-clk.png', null, this._grpPanel);
            this._btnInfo.anchor.set(0.5, 0.5);
            this._btnInfo.scale.set(2.0, 1.5);
            
            this._txtInfo2 = game.add.text(this._sprBanner.x, this._sprBanner.y + 60, GlobalClass.getXMLByKey(game, 'notif_replay_only'), this._styleContent, this._grpPanel);
            this._txtInfo2.anchor.set(0.5, 0.5);
        } else {
            this._sprBackground = new PIXI.Graphics();
            this._sprBackground.beginFill(0x000000);
            this._sprBackground.drawRect(0, 0, GlobalClass.STAGE_MAX, GlobalClass.STAGE_MAX);
            this._sprBackground.alpha = 0.0;
            this._sprBackground.interactive = true;
            this._grpBackground.addChild(this._sprBackground);
    
            TweenMax.delayedCall(2, this.showFinish, [], this, false);
        }
    };

    this.showFinish = function() {
        this._sprBackground = new PIXI.Graphics();
        this._sprBackground.beginFill(0x000000);
        this._sprBackground.drawRect(0, 0, GlobalClass.STAGE_MAX, GlobalClass.STAGE_MAX);
        this._sprBackground.alpha = 0.0;
        this._sprBackground.interactive = true;
        this._grpBackground.addChild(this._sprBackground);
    
        TweenMax.delayedCall(2, this.showFinish2, [], this, false);
    };
    
    replayClass.prototype.showFinish2 = function() {
        GlobalClass.deleteChildren(this._grpInfo);
        this._sprBackground.alpha = 0.5;

        this._sprBanner = game.add.sprite(640, 360, "network","network-error-frame.png", this._grpPanel);
        this._sprBanner.anchor.set(0.5, 0.5);
    
        this._txtDescEnd = new PIXI.Text(GlobalClass.getXMLByKey(game, 'notif_replay_end'), this._styleContent);
        this._txtDescEnd.anchor.set(0.5, 0.5);
        this._txtDescEnd.x = 640;
        this._txtDescEnd.y = 280;
        this._grpPanel.addChild(this._txtDescEnd);
    
        this._txtBetEnd = new PIXI.Text(`${GlobalClass.getXMLByKey(game, 'totalbet')} ${GlobalClass.getFormatCurrency(this._data.result.wagerCurrency)}`, this._styleContent);
        this._txtBetEnd.anchor.set(0.5, 0.5);
        this._txtBetEnd.x = 640;
        this._txtBetEnd.y = 320;
        this._grpPanel.addChild(this._txtBetEnd);
    
        this._txtWinEnd = new PIXI.Text(`${GlobalClass.getXMLByKey(game, 'win')} ${GlobalClass.getFormatCurrency(this._data.result.winCurrency)}`, this._styleContent);
        this._txtWinEnd.anchor.set(0.5, 0.5);
        this._txtWinEnd.x = 640;
        this._txtWinEnd.y = 350;
        this._grpPanel.addChild(this._txtWinEnd);
    
        this._btnInfo = game.add.button(this._sprBanner.x, this._sprBanner.y + 60, 'network', this.refreshGame, this, 'refresh.png', 'refresh-clk.png', 'refresh-clk.png', null, this._grpPanel);
        this._btnInfo.anchor.set(0.5, 0.5);
        this._btnInfo.scale.set(2.0, 1.5);
        
        this._txtReplayAgain = new PIXI.Text(GlobalClass.getXMLByKey(game, 'notif_replay_again'), this._styleInfo2);
        this._txtReplayAgain.anchor.set(0.5, 0.5);
        this._txtReplayAgain.x = this._sprBanner.x;
        this._txtReplayAgain.y = this._sprBanner.y + 60;
        this._grpPanel.addChild(this._txtReplayAgain);
    };

    this.convertTime = function(str) {
        const originalDateTime = str;
        const date = new Date(originalDateTime);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        const formattedDateTime = `${year}-${month}-${day} / ${hours}:${minutes}:${seconds}`;
    
        return formattedDateTime;
    };

    this.changeLanguage = function() {
        if (this._txtReplay != null) {
            this._txtReplay.text = GlobalClass.getXMLByKey(this._game, 'notif_replay_again');
        }
    };

    this.refreshGame = function(){
        window.location.reload();
    };

    this.bnClose = function() {
        GlobalClass.GAME_OPTION = false;
    
        soundClass.playSound("soundbtnclick");
        // this._parent.removeChild(this);
        // GlobalClass.GAME_ROOT._replayClass = null;
    
        GlobalClass.deleteChildren(this._grpBackground);
        this._sprBackground = null;
        GlobalClass.deleteChildren(this._grpPanel);
        
        this._sprReplay = new PIXI.Graphics();
        this._sprReplay.beginFill(0x930000);
        this._sprReplay.drawRect(0, 0, GlobalClass.STAGE_MAX, 30);
        this._sprReplay.alpha = 0.5;
        this._sprReplay.interactive = true;
        this._grpInfo.addChild(this._sprReplay);
    
        this._txtReplay = new PIXI.Text(GlobalClass.getXMLByKey(game, 'notif_replay_only'), this._styleInfo2);
        this._txtReplay.anchor.set(0.5, 0.5);
        this._txtReplay.x = 640;
        this._txtReplay.y = 15;
        this._grpInfo.addChild(this._txtReplay);
    
        // TweenMax.to(this._grpInfo, 1, {
        //     alpha: 0.1,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: Sine.easeIn,
        //     useFrames: false,
        //     paused: false
        // });
    };
}

