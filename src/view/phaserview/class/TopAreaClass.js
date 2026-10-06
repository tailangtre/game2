var topAreaClass = function(game, group) {
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
        this.sprBG.alpha = 0;
        this.sprBG.interactive = true;
        //this.sprBG.buttonMode = true;
        this._grpWin.addChild(this.sprBG);

        this.timeText = game.add.text(GlobalClass.STAGE_WIDTH - 60, 20, '', {
            fontSize:"20px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#FFFFFF",
            align: "center"
        }, this._grpWin);
        this.timeText.anchor.set(0.5);

        if(!AppConstants.SHOW_CLOCK){
            this.timeText.visible = false;
        }

        if(this._timerRepeat){
            clearInterval(this._timerRepeat);
        }

        var self = this;
        this.showTime();
        this._timerRepeat = setInterval(function(){
            self.showTime();
        },60000);

        this.sprBG.on('pointerup', (event) => {
            toggleFullscreen();
        });
        
    };
    
    this.createPortrait = function() {
        GlobalClass.deleteChildren(this._grpWin);
        this.sprBG = game.add.graphics();
        this.sprBG.beginFill(0x000000);
        this.sprBG.drawRect(0,0,GlobalClass.STAGE_WIDTH, 40);
        this.sprBG.interactive = true;
        //this.sprBG.buttonMode = true;
        this.sprBG.alpha = 0;
        this._grpWin.addChild(this.sprBG);

        this.timeText = game.add.text(GlobalClass.STAGE_WIDTH-50, 20, '', {
            fontSize:"20px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#FFFFFF",
            align: "center"
        }, this._grpWin);
        this.timeText.anchor.set(0.5);

        if(!AppConstants.SHOW_CLOCK){
            this.timeText.visible = false;
        }

        if(this._timerRepeat){
            clearInterval(this._timerRepeat);
        }

        var self = this;
        this.showTime();
        this._timerRepeat = setInterval(function(){
            self.showTime();
        },60000);

        this.sprBG.on('pointerup', (event) => {
            toggleFullscreen();
        });
    };

    this.close = function(){
        this._grpWin.destroy();
        gameplayState._networkState = null;
    }

    this.showTime = function(){
        var result = new Date().format("hh:mm");
        this.timeText.text = result;
    }

}

