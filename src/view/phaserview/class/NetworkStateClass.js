var networkStateClass = function(game, group) {
    this._grpWin = null;
    
    this.create = function() {
        this._grpWin = game.add.group();
        group.addChild(this._grpWin);
    
        this.checkResolution();
    };

    this.checkResolution=function(){
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function() {
        GlobalClass.deleteChildren(this._grpWin);

        this.sprBG = game.add.graphics();
        this.sprBG.beginFill(0x000000);
        this.sprBG.drawRect(0,0,GlobalClass.STAGE_WIDTH, 40);
        this.sprBG.interactive = true;
        this._grpWin.addChild(this.sprBG);

        this.wifi = game.add.sprite(0, 0, 'network', 'wifi.png', this.sprBG);
        this.wifi.width = 40;
        this.wifi.height = 40;
        this.wifi.anchor.set(0);
        var title = GlobalClass.getXMLByKey(game, "networkstate");
        this.text = game.add.text(game.world.centerX, 20, title, {
            fontSize:"20px",
            fontFamily:"Arial",
            fill: "#FFFFFF",
            align: "center"
        }, this.sprBG);
        this.text.anchor.set(0.5);

        var closeBtn = game.add.button(GlobalClass.STAGE_WIDTH-20, 20, 'network', this.close, this, 'close-button.png', 'close-button.png', 'close-button.png', null, this.sprBG);
        closeBtn.scale.set(0.8);
        closeBtn.anchor.set(0.5, 0.5);
        
    };
    
    this.createPortrait = function() {
        GlobalClass.deleteChildren(this._grpWin);
        
        this.sprBG = game.add.graphics();
        this.sprBG.beginFill(0x000000);
        this.sprBG.drawRect(0,0,GlobalClass.STAGE_WIDTH, 70);
        this.sprBG.interactive = true;
        this._grpWin.addChild(this.sprBG);

        this.wifi = game.add.sprite(0, 0, 'network', 'wifi.png', this.sprBG);
        this.wifi.width = 70;
        this.wifi.height = 70;
        this.wifi.anchor.set(0);

        var title = GlobalClass.getXMLByKey(game, "networkstate");
        this.text = game.add.text(game.world.centerY, 35, title, {
            fontSize:"20px",
            fontFamily:"Arial",
            fill: "#FFFFFF",
            align: "center"
        }, this.sprBG);
        this.text.anchor.set(0.5);

        var closeBtn = game.add.button(GlobalClass.STAGE_HEIGHT-30, 35, 'network', this.close, this, 'close-button.png', 'close-button.png', 'close-button.png', null, this.sprBG);
        closeBtn.anchor.set(0.5, 0.5);
    };

    this.close = function(){
        this._grpWin.destroy();
        gameplayState._networkState = null;
    }

}

