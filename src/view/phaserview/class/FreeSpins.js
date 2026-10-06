var FreeSpins = function(game, group, type, data) {
    this._grpPanel = null;
    this._clickAble = true;

    this._type = type;
    this._data = data;

    this.create = function() {
        GlobalClass.GAME_OPTION = true;
        // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_ACTIVE");

        this._grpBackground = game.add.group();
        group.addChild(this._grpBackground);

        this._grpPanel = game.add.group();
        group.addChild(this._grpPanel);

        this._styleTitle = {
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "22px",
            fontWeight: "bold",
            fill: "#fff",
            align: "center"
        };

        this._styleContent = {
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "20px",
            fill: "#fff",
            align: "left",
            lineHeight: 25,
            wordWrap: true,
            wordWrapWidth: 400
        };

        this._styleValue = {
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "20px",
            fill: "#8ff0d6",
        };

        let bgTransparent = game.add.sprite(0, 0, 'uiPanel', 'BG_allBanners.png', this._grpBackground);
        bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
        bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
        bgTransparent.interactive = true;

        let sprPanel = game.add.sprite(640, 360, 'freespins', 'freespins.png', this._grpPanel);
        sprPanel.anchor.set(0.5);

        if (this._type == 0) {
            const totalBet = this._data.customFields.betValue;
            for (const coin of GlobalClass.GAME_COIN_VALUE) {
                const betSize = Math.floor(totalBet / coin);
                // const n1 = new bigDecimal(String(totalBet));
                // const n2 = new bigDecimal(String(coin));
                // const betSize = n1.multiply(n2);
                if (GlobalClass.GAME_BET.indexOf(betSize) > -1) {
                // if (GlobalClass.GAME_BET.indexOf(parseInt(betSize.value)) > -1) {
                    GlobalClass.ONETOUCH_FREESPINS_COINVALUE = coin;
                    break;
                }
            }

            this._txtInfo = game.add.text(440, 260, "", this._styleContent, this._grpPanel);
            this._txtInfo.text = GlobalClass.getXMLByKey(game, "freespins1");
            this._txtInfo.text = this._txtInfo.text.replace(/#XX/g, String(this._data.customFields.initialBets));
            this._txtInfo.text = this._txtInfo.text.replace(/#YY/g, `${this._data.customFields.betValue / GlobalClass.ONETOUCH_FREESPINS_COINVALUE} coins (${GlobalClass.currency()} ${numeral(this._data.customFields.betValue).format('0,0.00')})`);
            
            let mySimpleDateFormatter = new simpleDateFormat('MM/d/yyyy');
            let endDate = mySimpleDateFormatter.format(this._data.endDate)
    
            this._txtExpired = game.add.text(440, 440, "", this._styleContent, this._grpPanel);
            this._txtExpired.text = GlobalClass.getXMLByKey(game, "freespins2");
            this._txtExpired.text = this._txtExpired.text.replace(/#ZZ/g, endDate);
    
    
            this._btnCancel = game.add.button(sprPanel.x - 50, sprPanel.y + 180, 'freespins', this.btnClick, this, 'cancel icon.png', 'cancel icon.png', 'cancel icon.png', "cancel");
            this._btnCancel.anchor.set(0.5);
            this._grpPanel.addChild(this._btnCancel);
    
            this._btnAccept = game.add.button(sprPanel.x + 50, sprPanel.y + 180, 'freespins', this.btnClick, this, 'agree icon.png', 'agree icon.png', 'agree icon.png', "accept");
            this._btnAccept.anchor.set(0.5);
            this._grpPanel.addChild(this._btnAccept);
        } else {
            if (this._data.custom_fields.win_amount <= 0) {
                this._txtInfo = game.add.text(440, 260, "", this._styleContent, this._grpPanel);
                this._txtInfo.text = GlobalClass.getXMLByKey(game, "freespins3");
            } else {
                this._txtInfo = game.add.text(sprPanel.x, sprPanel.y - 100, "", this._styleTitle, this._grpPanel);
                this._txtInfo.anchor.set(0.5, 0.0);
                this._txtInfo.text = GlobalClass.getXMLByKey(game, "freespins4");

                this._txtInfo1 = game.add.text(sprPanel.x, sprPanel.y - 50, "", this._styleContent, this._grpPanel);
                this._txtInfo1.anchor.set(0.5, 0.0);
                this._txtInfo1.text = GlobalClass.getXMLByKey(game, "freespins5");

                this._txtInfo2 = game.add.text(sprPanel.x, sprPanel.y - 20, "", this._styleValue, this._grpPanel);
                this._txtInfo2.anchor.set(0.5, 0.0);
                this._txtInfo2.text = `${this._data.custom_fields.win_amount / GlobalClass.ONETOUCH_FREESPINS_COINVALUE} coins (${GlobalClass.currency()} ${numeral(this._data.custom_fields.win_amount).format('0,0.00')})`;

                this._txtInfo3 = game.add.text(sprPanel.x, sprPanel.y + 20, "", this._styleContent, this._grpPanel);
                this._txtInfo3.anchor.set(0.5, 0.0);
                this._txtInfo3.text = GlobalClass.getXMLByKey(game, "freespins6");

                this._txtInfo4 = game.add.text(sprPanel.x - 200, sprPanel.y + 70, "", this._styleContent, this._grpPanel);
                this._txtInfo4.text = GlobalClass.getXMLByKey(game, "freespins7");
                this._txtInfo4.text = this._txtInfo4.text.replace(/#XX/g, String(this._data.custom_fields.initial_bets));
            }

            this._btnAccept = game.add.button(sprPanel.x, sprPanel.y + 180, 'freespins', this.btnClick, this, 'agree icon.png', 'agree icon.png', 'agree icon.png', "accept2");
            this._btnAccept.anchor.set(0.5);
            this._grpPanel.addChild(this._btnAccept);
        }

        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    }

    this.createLandscape = function() {
        this._grpPanel.x = 0;
        this._grpPanel.y = 0;
    };

    this.createPortrait = function() {
        this._grpPanel.x = -280;
        this._grpPanel.y = 320;
    };

    this.btnClick = function(cButton) {
        if (!this._clickAble){
            return;
        }
        
        this._clickAble = false;
        soundClass.playSound("soundbtnclick");

        switch (cButton.btnKey) {
            case "cancel":
                this.remove();
                break;
            case "accept":
                GlobalClass.ONETOUCH_FREESPINS_BETCOIN = this._data.customFields.betValue * GlobalClass.ONETOUCH_FREESPINS_COINVALUE;
                GlobalClass.ONETOUCH_FREESPINS_BETCURRENCY = this._data.customFields.betValue;
                AppFacadeInstance.sendNotification(SlotsEvents.FREE_SPINS);
                break;
            case "accept2":
                GlobalClass.ONETOUCH_FREESPINS = false;
                gameplayState._buttonClass.setBalance();
                gameplayState._buttonClass.btnBetEnable();
                this.remove();
            break;
        }
    };

    this.remove = function() {
        GlobalClass.GAME_OPTION = false;
        // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_INACTIVE");

        if (this._grpBackground != null) {
            this._grpBackground.destroy();
            this._grpBackground = null;
        }

        if (this._grpPanel != null) {
            this._grpPanel.destroy();
            this._grpPanel = null;
        }

        gameplayState._freeSpins = null;
    }
}