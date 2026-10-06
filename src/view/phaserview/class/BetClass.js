var betClass = function (game, group) {
    this._grpBet = null;
    this._grpPage = null;
    this._grpArrow = null;

    this._pageCount = 1;
    this._pageMax = 8;

    this._startX = 0;
    this._endX = 0;
    this._moving = false;
    this.startPoint = {};
    this.endPoint = {};

    this.create = function () {
        GlobalClass.GAME_OPTION = true;
        // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_ACTIVE");

        this._grpBet = game.add.group();
        group.addChild(this._grpBet);

        this._grpPage = game.add.group();
        group.addChild(this._grpPage);

        this._grpMask = game.add.group();
        group.addChild(this._grpMask);

        this._grpTime = game.add.group();
        group.addChild(this._grpTime);

        this._style1 = {
            fontSize: "16px",
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#ffffff",
            align: "center"
        };


        this._style4 = {
            fontSize: "20px",
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#ffffff",
            align: "center"
        };

        this._style2 = {
            fontSize: "20px",
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#8ff0d6",
            align: "center"
        };

        this._style3 = {
            fontSize: "22px",
            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#ffffff",
            align: "center"
        };
        this.titleStyle = {
            "fill": "#8ff0d6",
            "fontSize": 32,
            "stroke": "#0a0f1a",
            "strokeThickness": 3
        };

        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function () {
        this._pageCount = 1;
        this._pageMax = 11;
        GlobalClass.deleteChildren(this._grpPaytable);
        GlobalClass.deleteChildren(this._grpMask);
        GlobalClass.deleteChildren(this._grpPage);
        GlobalClass.deleteChildren(this._grpTime);
        if(this._timerRepeat){
            clearInterval(this._timerRepeat);
        }
        this._grpPage.x = 0;
        this._grpPaytable.scale.set(1, 1);
        var bgTransparent = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpPaytable);
        bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
        bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
        bgTransparent.interactive = true;

        this._backgroundWinplan = game.add.sprite(game.world.centerX, 320, 'paytable', 'Paytable-Frame.png', this._grpPaytable);
        this._backgroundWinplan.anchor.set(0.5, 0.5);
        //this._backgroundWinplan.scale.set(1.1,1);

        var verText = game.add.text(game.world.centerX + 360, 100, "ver " + String(GlobalClass.GAME_VERSION), {
            fontSize:"20px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#FFFFFF",
            align: "center"
        }, this._grpPaytable);
        verText.anchor.set(0.5);
        
        var logo = game.add.sprite(game.world.centerX + 8, 40, 'ui', 'Title.png', this._grpPaytable);
        logo.anchor.set(0.5, 0.5);

        var deluxe = game.add.sprite(logo.x, logo.y+32, 'ui', 'deluxe-font.png', this._grpPaytable);
        deluxe.anchor.set(0.5, 0.5);

        this.createPageLandscape();

        this._sprMask = game.add.graphics();
        this._sprMask.beginFill(0xffffff);
        this._sprMask.drawRect(game.world.centerX - 425, 73, 850, 510);
        this._grpMask.addChild(this._sprMask);
        this._grpPage.mask = this._sprMask;

        this.bindSwip(this._sprMask);

        this._buttonClose = game.add.button(this._backgroundWinplan.x + this._backgroundWinplan.width / 2 - 80, this._backgroundWinplan.y - this._backgroundWinplan.height / 2 + 32, 'ui', this.closePage, this, "close-button-hov.png", "close-button.png", "close-button-clk.png", null, this._grpPaytable);
        this._buttonClose.anchor.set(0.5, 0.5);
        this._grpPaytable.addChild(this._buttonClose);


        // this.timeText = game.add.text(this._buttonClose.x - 180, this._buttonClose.y + 10, "", {
        //     fontSize: "18px",
        //     fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        //     fill: "#ffffff",
        //     align: "center"});
        // this._grpTime.addChild(this.timeText);

        // var self = this;
        // this.timeHeart();
        // this._timerRepeat = setInterval(function(){
        //     self.timeHeart();
        // },1000);


        this._arrowLeft = game.add.button(this._backgroundWinplan.x - this._backgroundWinplan.width / 2 + 36, this._backgroundWinplan.y - 5, 'ui', this.prevPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);

        this._arrowLeft.anchor.set(0.5, 0.5);

        this._arrowRight = game.add.button(this._backgroundWinplan.x + this._backgroundWinplan.width / 2 - 37, this._backgroundWinplan.y - 6, 'ui', this.nextPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);

        this._arrowRight.anchor.set(0.5, 0.5);
        this._arrowRight.rotation = 3.14;
        this._bulletObj = {};
        for (var i = 1; i <= this._pageMax; i++) {
            this._bulletObj["bullet" + i] = game.add.sprite(game.world.centerX + (i - 6) * 40, this._backgroundWinplan.y + this._backgroundWinplan.height / 2 - 30, 'ui', 'Bullet-inactive.png', this._grpPaytable);
            this._bulletObj["bullet" + i].anchor.set(0.5, 0.5);
            this._bulletObj["bulletActive" + i] = game.add.sprite(game.world.centerX + (i - 6) * 40, this._backgroundWinplan.y + this._backgroundWinplan.height / 2 - 30, 'ui', 'Bullet-active.png', this._grpPaytable);
            this._bulletObj["bulletActive" + i].anchor.set(0.5, 0.5);
        }
        //this.changePageLandscape(this._pageCount);
        this.checkButton();
    };

    // this.timeHeart = function () {
    //     var result = new Date().format("yyyy-MM-dd hh:mm:ss");
    //     this.timeText.text = result;

    // }

    this.bindSwip = function (panel) {
        var self = this;
        panel.interactive = true;
        panel.buttonMode = true;
        panel.on('pointerdown', (event) => {

            self.startPoint = {};
            self.startPoint.x = event.data.global.x;
            self.startPoint.y = event.data.global.y;
        });
        panel.on('pointerup', (event) => {

            self.endPoint = event.data.global;
            var threshold = 40;
            if ((self.startPoint.x - self.endPoint.x) < -1 * threshold) {
                self.prevPaytable(true);
            }
            else if ((self.startPoint.x - self.endPoint.x) > threshold) {
                self.nextPaytable(true);
            }
        });
    };

    this.createPortrait = function () {
        this._pageCount = 1;
        this._pageMax = 11;
        GlobalClass.deleteChildren(this._grpPaytable);
        GlobalClass.deleteChildren(this._grpMask);
        GlobalClass.deleteChildren(this._grpPage);
        GlobalClass.deleteChildren(this._grpTime);
        if(this._timerRepeat){
            clearInterval(this._timerRepeat);
        }
        this._grpPage.x = 0;
        this._grpPaytable.scale.set(1, 1);
        var bgTransparent = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpPaytable);
        bgTransparent.width = GlobalClass.STAGE_WIDTH * 2;
        bgTransparent.height = GlobalClass.STAGE_HEIGHT * 2;
        bgTransparent.interactive = true;

        this._backgroundWinplan = game.add.sprite(game.world.centerY, game.world.centerX, 'paytable', 'frame.png', this._grpPaytable);
        this._backgroundWinplan.anchor.set(0.5, 0.5);

        var verText = game.add.text(game.world.centerY + 200, 250, "ver " + String(GlobalClass.GAME_VERSION), {
            fontSize:"20px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#FFFFFF",
            align: "center"
        }, this._grpPaytable);
        verText.anchor.set(0.5);

        var logo = game.add.sprite(game.world.centerY, 50, 'ui', 'Title.png', this._grpPaytable);
        logo.anchor.set(0.5, 0.5);

        var deluxe = game.add.sprite(logo.x, logo.y+32, 'ui', 'deluxe-font.png', this._grpPaytable);
        deluxe.anchor.set(0.5, 0.5);

        this.createPagePotrait();

        this._sprMask = game.add.graphics();
        this._sprMask.beginFill(0xffffff);
        this._sprMask.drawRect(game.world.centerY - 255, game.world.centerX - 415, 508, 847);
        this._grpMask.addChild(this._sprMask);
        this._grpPage.mask = this._sprMask;

        this.bindSwip(this._sprMask);

        this._buttonClose = game.add.button(this._backgroundWinplan.x + this._backgroundWinplan.width / 2 - 80 - 6, this._backgroundWinplan.y - this._backgroundWinplan.height / 2 + 32 - 6, 'paytable', this.closePage, this, "close-button-hov.png", "close-button.png", "close-button-clk.png", null, this._grpPaytable);
        this._buttonClose.anchor.set(0.5, 0.5);

        // this.timeText = game.add.text(this._buttonClose.x - 180, this._buttonClose.y + 10, "", {
        //     fontSize: "18px",
        //     fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
        //     fill: "#ffffff",
        //     align: "center"});
        // this._grpTime.addChild(this.timeText);

        // var self = this;
        // this.timeHeart();
        // this._timerRepeat = setInterval(function(){
        //     self.timeHeart();
        // },1000);

        this._arrowLeft = game.add.button(this._backgroundWinplan.x - this._backgroundWinplan.width / 2 + 36, this._backgroundWinplan.y + 13, 'paytable', this.prevPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
        this._arrowLeft.anchor.set(0.5, 0.5);

        this._arrowRight = game.add.button(this._backgroundWinplan.x + this._backgroundWinplan.width / 2 - 37, this._backgroundWinplan.y + 13, 'paytable', this.nextPaytable, this, "arrow-button-hov.png", "arrow-button.png", "arrow-button-clk.png", null, this._grpPaytable);
        this._arrowRight.anchor.set(0.5, 0.5);
        this._arrowRight.rotation = 3.14;

        this._bulletObj = {};
        for (var i = 1; i <= this._pageMax; i++) {
            this._bulletObj["bullet" + i] = game.add.sprite(game.world.centerY + (i - 6) * 40, this._backgroundWinplan.y + this._backgroundWinplan.height / 2 - 30, 'paytable', 'Bullet-inactive.png', this._grpPaytable);
            this._bulletObj["bullet" + i].anchor.set(0.5, 0.5);
            this._bulletObj["bulletActive" + i] = game.add.sprite(game.world.centerY + (i - 6) * 40, this._backgroundWinplan.y + this._backgroundWinplan.height / 2 - 30, 'paytable', 'Bullet-active.png', this._grpPaytable);
            this._bulletObj["bulletActive" + i].anchor.set(0.5, 0.5);
        }
        this.checkButton();
    };

    this.createPageLandscape = function () {
        var ass = "paytable";
        for (var i = 1; i <= this._pageMax; i++) {
            var x = game.world.centerX + (i - 1) * 850 - 425;
            if (GlobalClass.GAME_LANG != 'en' && i < 6) {
                ass = "lang";
            }
            else {
                ass = "paytable";
            }

            var page = game.add.group();

            page.x = x;
            page.y = 320;
            this._grpPage.addChild(page);
            if (i == 1) {

                var wildFrame = game.add.sprite(425, 0, 'paytable', 'page1-InfoFrame.png', page);
                wildFrame.anchor.set(0.5, 0.5);

                var wildFont = game.add.sprite(wildFrame.x, wildFrame.y - 190, 'paytable', 'Wild-Font.png', page);
                wildFont.anchor.set(0.5, 0.5);

                var wild = game.add.sprite(wildFrame.x, wildFrame.y - 70, 'symbols1', 'Wild_00.png', page);
                wild.anchor.set(0.5, 0.5);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line1');
                if (GlobalClass.GAME_LANG == 'ja') {
                    var text1 = wildDescXML.substring(0, 19);
                    var text2 = wildDescXML.replace(text1, "");
                    GlobalClass.checkString(text1, wildFrame.x - 180, wildFrame.y + 50, false, "small", "15px Arial", page, this._style1);
                    GlobalClass.checkString(text2, wildFrame.x - 180, wildFrame.y + 80, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line2');
                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 110, false, "small", "15px Arial", page, this._style1);
                }
                else {

                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 50, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line2');
                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 80, false, "small", "15px Arial", page, this._style1);
                }
            }
            else if (i == 2) {
                var frame = game.add.sprite(425, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);

                var scatterFont = game.add.sprite(frame.x, frame.y - 190, 'paytable', 'scatter-font.png', page);
                scatterFont.anchor.set(0.5, 0.5);

                var scatter = game.add.sprite(frame.x, frame.y - 70, 'symbols1', 'Scatter_00.png', page);
                scatter.anchor.set(0.5, 0.5);



                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (sym.symbolPngName.indexOf("Scatter") == -1) {
                        continue;
                    }

                    var pays = paytable[symbol];
                    var j = 5;
                    for (var k = 0; k < pays.length; k++) {
                        var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                        if (value == 0) {
                            continue;
                        }
                        GlobalClass.checkString(j + "x", frame.x - 100, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style4);

                        GlobalClass.checkString("" + value, frame.x + 40, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style2);
                        j--;
                    }
                }


                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line3');
                GlobalClass.checkString(wildDescXML, frame.x / 2 + 40, wildFrame.y + 100, false, "small", "15px Arial", page, this._style1);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line4');
                GlobalClass.checkString(wildDescXML, frame.x / 2 + 40, wildFrame.y + 120, false, "small", "15px Arial", page, this._style1);





            }
            else if (i == 3) {
                var frame = game.add.sprite(425, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);

                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (sym.symbolPngName.indexOf("pic1") == -1) {
                        continue;
                    }

                    var symbolSpr = game.add.sprite(frame.x, frame.y - 70, sym.assetName, sym.symbolPngName, page);
                    symbolSpr.anchor.set(0.5, 0.5);


                    var fx = 130;
                    if (GlobalClass.GAME_LANG == 'ja') {
                        fx = 150;
                    }




                    var pays = paytable[symbol];
                    var j = 5;
                    for (var k = 0; k < pays.length; k++) {
                        var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                        if (value == 0) {
                            continue;
                        }
                        GlobalClass.checkString(j + "x", frame.x - 100, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style4);

                        GlobalClass.checkString("" + value, frame.x + 40, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style2);
                        j--;
                    }

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line1');
                    GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 100, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line2');
                    GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 120, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line3');
                    GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 140, false, "small", "15px Arial", page, this._style1);
                }

            }
            else if (i > 3 && i <= 7) {

                var frame = game.add.sprite(425, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);
                var pays = [];
                var show = false;
                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (i == 4) {
                        if (sym.symbolPngName.indexOf("Pic02") == -1 && sym.symbolPngName.indexOf("Pic3") == -1 && sym.symbolPngName.indexOf("Pic4") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }
                        if (sym.symbolPngName.indexOf("Pic02") != -1) {
                            var symbol1 = game.add.sprite(frame.x, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("Pic3") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.5);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.5);
                        }

                    }
                    else if (i == 5) {
                        if (sym.symbolPngName.indexOf("pic05") == -1 && sym.symbolPngName.indexOf("A") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        if (sym.symbolPngName.indexOf("pic05") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 80, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.8);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 80, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.8);
                        }

                    }
                    else if (i == 6) {
                        if (sym.symbolPngName.indexOf("10") == -1 && sym.symbolPngName.indexOf("J") == -1
                            && sym.symbolPngName.indexOf("Q") == -1 && sym.symbolPngName.indexOf("K") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        if (sym.symbolPngName.indexOf("K") != -1) {
                            var symbol1 = game.add.sprite(frame.x - 50, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("Q") != -1) {
                            var symbol1 = game.add.sprite(frame.x + 50, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("J") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.5);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.5);
                        }

                    }
                    else if (i == 7) {
                        if (sym.symbolPngName.indexOf("9") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        var symbol1 = game.add.sprite(frame.x, frame.y - 70, sym.assetName, sym.symbolPngName, page);
                        symbol1.anchor.set(0.5, 0.5);

                    }
                    if (!show) {
                        show = true;
                        pays = paytable[symbol];
                        var j = 5;
                        for (var k = 0; k < pays.length; k++) {
                            var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                            if (value == 0) {
                                continue;
                            }
                            GlobalClass.checkString(j + "x", frame.x - 60, frame.y + 30 + k * 30, false, "small", "18px Arial", page, this._style4);

                            GlobalClass.checkString("" + value, frame.x, frame.y + 30 + k * 30, false, "small", "18px Arial", page, this._style2);
                            j--;
                        }
                    }

                }
            }
            else if (i == 8) {
                page.y = 60;
                var title = game.add.text(425, 50, GlobalClass.getXMLByKey(game, "jackportfeatrue"), this.titleStyle, page);

                title.anchor.set(0.5, 0.5);
                var y = title.y;
                for (var j = 1; j <= 8; j++) {
                    wildDescXML = "";
                    if(j<=5){
                        wildDescXML =  GlobalClass.getXMLByKey(game, '[id="3"] line' + j);
                    }
                    else if(j==6){
                        wildDescXML = "#LISTITEM " + GlobalClass.getXMLByKey(game, "minbet") + ": " + GlobalClass.currency()+" "+myNumeral(GlobalClass.minBet()).format('0,0.00')+"."
                    }
                    else if(j==7){
                        wildDescXML = "#LISTITEM " + GlobalClass.getXMLByKey(game, "maxbet") + ": " + GlobalClass.currency()+" "+myNumeral(GlobalClass.maxBet()).format('0,0.00')+"."
                    }
                    else if(j==8 && AppConstants.showRtp){
                        var rtp = GlobalClass.getRTP();
                        wildDescXML = "#LISTITEM " + GlobalClass.getXMLByKey(game, "rtp") + ": " + rtp+"%."
                    }
                    
                    if(wildDescXML==""){
                        continue;
                    }
                    
                    if (GlobalClass.GAME_LANG == "ja" || GlobalClass.GAME_LANG == "ko") {
                        y = GlobalClass.checkString(wildDescXML, 0, y + 30, false, "small", "15px Arial", page, {
                            fontSize: "18px",
                            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
                            fill: "#ffffff",
                            align: "center"
                        }, {
                            wordWrapWidth: 840,
                            lineHeight: 35
                        });
                    } else {
                        y = GlobalClass.checkString(wildDescXML, 0, y + 40, false, "small", "15px Arial", page, {
                            fontSize: "18px",
                            fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
                            fill: "#ffffff",
                            align: "center"
                        }, {
                            wordWrapWidth: 840,
                            lineHeight: 35
                        });
                    }
                }


            }
            else if (i == 9) {
                page.y = 60;
                var title = game.add.text(425, 50, GlobalClass.getXMLByKey(game, "freegamesfeature"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var y = title.y;
                for (var j = 1; j <= 4; j++) {
                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="4"] line' + j);
                    y = GlobalClass.checkString(wildDescXML, 5, y + 50, false, "small", "15px Arial", page, this._style3, {
                        wordWrapWidth: 840,
                        lineHeight: 50
                    });
                }
            }
            else if (i == 10) {
                page.y = 60;
                var title = game.add.text(425, 50, GlobalClass.getXMLByKey(game, "gamerule"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var y = title.y;
                for (var j = 1; j <= 7; j++) {
                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="5"] line' + j);
                    y = GlobalClass.checkString(wildDescXML, 5, y + 50, false, "small", "15px Arial", page, this._style3, {
                        wordWrapWidth: 840,
                        lineHeight: 50
                    });
                }
            }
            else if (i == 11) {
                page.y = 60;
                var title = game.add.text(425, 50, GlobalClass.getXMLByKey(game, "winline"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var line = game.add.sprite(425, 85, 'paytable', 'payline1-30.png', page);
                line.anchor.set(0.5, 0);

            }
        }
    };

    this.createPagePotrait = function () {
        for (var i = 1; i <= this._pageMax; i++) {
            var x = game.world.centerY + (i - 1) * 508;
            if (i == 3) {
                x = x + 30;
            }
            var page = game.add.group();
            page.x = x;
            page.y = 320;
            this._grpPage.addChild(page);
            if (i == 1) {
                page.y = game.world.centerX;
                var wildFrame = game.add.sprite(0, 0, 'paytable', 'page1-InfoFrame.png', page);
                wildFrame.anchor.set(0.5, 0.5);

                var wildFont = game.add.sprite(wildFrame.x, wildFrame.y - 190, 'paytable', 'Wild-Font.png', page);
                wildFont.anchor.set(0.5, 0.5);

                var wild = game.add.sprite(wildFrame.x, wildFrame.y - 70, 'symbols1', 'Wild_00.png', page);
                wild.anchor.set(0.5, 0.5);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line1');


                if (GlobalClass.GAME_LANG == 'ja') {
                    var text1 = wildDescXML.substring(0, 19);
                    var text2 = wildDescXML.replace(text1, "");
                    GlobalClass.checkString(text1, wildFrame.x - 180, wildFrame.y + 50, false, "small", "15px Arial", page, this._style1);
                    GlobalClass.checkString(text2, wildFrame.x - 180, wildFrame.y + 80, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line2');
                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 110, false, "small", "15px Arial", page, this._style1);
                }
                else {

                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 50, false, "small", "15px Arial", page, this._style1);

                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line2');
                    GlobalClass.checkString(wildDescXML, wildFrame.x - 180, wildFrame.y + 80, false, "small", "15px Arial", page, this._style1);
                }




            }
            else if (i == 2) {
                page.y = game.world.centerX;
                var frame = game.add.sprite(0, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);

                var scatterFont = game.add.sprite(frame.x, frame.y - 190, 'paytable', 'scatter-font.png', page);
                scatterFont.anchor.set(0.5, 0.5);

                var scatter = game.add.sprite(frame.x, frame.y - 70, 'symbols1', 'Scatter_00.png', page);
                scatter.anchor.set(0.5, 0.5);

                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (sym.symbolPngName.indexOf("Scatter") == -1) {
                        continue;
                    }

                    var pays = paytable[symbol];
                    var j = 5;
                    for (var k = 0; k < pays.length; k++) {
                        var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                        if (value == 0) {
                            continue;
                        }
                        GlobalClass.checkString(j + "x", frame.x - 100, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style4);

                        GlobalClass.checkString("" + value, frame.x + 40, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style2);
                        j--;
                    }
                }


                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line3');
                GlobalClass.checkString(wildDescXML, frame.x - 180, wildFrame.y + 100, false, "small", "15px Arial", page, this._style1);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="1"] line4');
                GlobalClass.checkString(wildDescXML, frame.x - 180, wildFrame.y + 140, false, "small", "15px Arial", page, this._style1);

            }
            else if (i == 3) {
                page.y = game.world.centerX;
                var frame = game.add.sprite(0, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);

                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (sym.symbolPngName.indexOf("pic1") == -1) {
                        continue;
                    }

                    var symbolSpr = game.add.sprite(frame.x, frame.y - 70, sym.assetName, sym.symbolPngName, page);
                    symbolSpr.anchor.set(0.5, 0.5);
                    var fx = 130;
                    if (GlobalClass.GAME_LANG == 'ja') {
                        fx = 150;
                    }

                    var pays = paytable[symbol];
                    var j = 5;
                    for (var k = 0; k < pays.length; k++) {
                        var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                        if (value == 0) {
                            continue;
                        }
                        GlobalClass.checkString(j + "x", frame.x - 100, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style4);

                        GlobalClass.checkString("" + value, frame.x + 40, frame.y + 20 + k * 20, false, "small", "18px Arial", page, this._style2);
                        j--;
                    }
                }

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line1');
                GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 100, false, "small", "15px Arial", page, this._style1);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line2');
                GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 120, false, "small", "15px Arial", page, this._style1);

                wildDescXML = GlobalClass.getXMLByKey(game, '[id="2"] line3');
                GlobalClass.checkString(wildDescXML, frame.x - fx, wildFrame.y + 140, false, "small", "15px Arial", page, this._style1);

            }
            else if (i > 3 && i <= 7) {
                page.y = game.world.centerX;
                var frame = game.add.sprite(0, 0, 'paytable', 'page1-InfoFrame.png', page);
                frame.anchor.set(0.5, 0.5);
                var pays = [];
                var show = false;
                var paytable = GlobalClass.GAME_PAYTABLE;
                for (var symbol in paytable) {
                    var sym = GlobalClass.mathSymbol(symbol);
                    if (i == 4) {
                        if (sym.symbolPngName.indexOf("Pic02") == -1 && sym.symbolPngName.indexOf("Pic3") == -1 && sym.symbolPngName.indexOf("Pic4") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }
                        if (sym.symbolPngName.indexOf("Pic02") != -1) {
                            var symbol1 = game.add.sprite(frame.x, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("Pic3") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.5);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.5);
                        }

                    }
                    else if (i == 5) {
                        if (sym.symbolPngName.indexOf("pic05") == -1 && sym.symbolPngName.indexOf("A") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        if (sym.symbolPngName.indexOf("pic05") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 80, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.8);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 80, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.8);
                        }

                    }
                    else if (i == 6) {
                        if (sym.symbolPngName.indexOf("10") == -1 && sym.symbolPngName.indexOf("J") == -1
                            && sym.symbolPngName.indexOf("Q") == -1 && sym.symbolPngName.indexOf("K") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        if (sym.symbolPngName.indexOf("K") != -1) {
                            var symbol1 = game.add.sprite(frame.x - 50, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("Q") != -1) {
                            var symbol1 = game.add.sprite(frame.x + 50, frame.y - 120, sym.assetName, sym.symbolPngName, page);
                            symbol1.anchor.set(0.5, 0.5);
                            symbol1.scale.set(0.5);
                        }
                        else if (sym.symbolPngName.indexOf("J") != -1) {
                            var symbol2 = game.add.sprite(frame.x - 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol2.anchor.set(0.5, 0.5);
                            symbol2.scale.set(0.5);
                        }
                        else {
                            var symbol3 = game.add.sprite(frame.x + 50, frame.y - 30, sym.assetName, sym.symbolPngName, page);
                            symbol3.anchor.set(0.5, 0.5);
                            symbol3.scale.set(0.5);
                        }

                    }
                    else if (i == 7) {
                        if (sym.symbolPngName.indexOf("9") == -1) {
                            continue;
                        }

                        if (pays.length <= 0) {
                            pays = paytable[symbol];
                        }

                        var symbol1 = game.add.sprite(frame.x, frame.y - 70, sym.assetName, sym.symbolPngName, page);
                        symbol1.anchor.set(0.5, 0.5);

                    }
                    if (!show) {
                        show = true;
                        pays = paytable[symbol];
                        var j = 5;
                        for (var k = 0; k < pays.length; k++) {
                            var value = pays[j - 1] * GlobalClass.betPerLine1() / GlobalClass.GAME_LINE;
                            if (value == 0) {
                                continue;
                            }
                            GlobalClass.checkString(j + "x", frame.x - 60, frame.y + 30 + k * 30, false, "small", "18px Arial", page, this._style4);

                            GlobalClass.checkString("" + value, frame.x, frame.y + 30 + k * 30, false, "small", "18px Arial", page, this._style2);
                            j--;
                        }
                    }

                }
            }
            else if (i == 8) {
                var y = 290;
                var lineHeight = 45;
                if (GlobalClass.GAME_LANG == 'ja' || GlobalClass.GAME_LANG == 'ko') {
                    lineHeight = 30;
                    y = 250;
                }
                page.x = page.x - 250;
                page.y = y;
                var title = game.add.text(252, 10, GlobalClass.getXMLByKey(game, "jackportfeatrue"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var y = title.y;

                for (var j = 1; j <= 8; j++) {
                    wildDescXML = "";
                    if(j<=5){
                        wildDescXML = GlobalClass.getXMLByKey(game, '[id="3"] line' + j);
                    }
                    else if(j==6){
                        wildDescXML = "#LISTITEM " + GlobalClass.getXMLByKey(game, "minbet") + ": " + GlobalClass.currency()+" "+myNumeral(GlobalClass.minBet()).format('0,0.00')+"."
                    }
                    else if(j==7){
                        wildDescXML = "#LISTITEM " + GlobalClass.getXMLByKey(game, "maxbet") + ": " + GlobalClass.currency()+" "+myNumeral(GlobalClass.maxBet()).format('0,0.00')+"."
                    }
                    else if(AppConstants.showRtp){
                        var rtp = GlobalClass.getRTP();
                        wildDescXML = "#LISTITEM  " + GlobalClass.getXMLByKey(game, "rtp") + ": " + rtp+"%."
                    }
                    if(wildDescXML==""){
                        continue;
                    }
                    y = GlobalClass.checkString(wildDescXML, 0, y + lineHeight, false, "small", "15px Arial", page, {
                        fontSize: "20px",
                        fontFamily: "'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        fill: "#ffffff",
                        align: "center"
                    }, {
                        wordWrapWidth: 450,
                        lineHeight: lineHeight
                    });
                }


            }
            else if (i == 9) {
                page.x = page.x - 250;
                page.y = 330;
                var title = game.add.text(252, 10, GlobalClass.getXMLByKey(game, "freegamesfeature"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var y = title.y;
                for (var j = 1; j <= 4; j++) {
                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="4"] line' + j);
                    y = GlobalClass.checkString(wildDescXML, 10, y + 70, false, "small", "15px Arial", page, this._style3, {
                        wordWrapWidth: 490,
                        lineHeight: 70
                    });
                }
            }
            else if (i == 10) {
                page.x = page.x - 250;
                page.y = 330;
                var title = game.add.text(252, 10, GlobalClass.getXMLByKey(game, "gamerule"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);
                var y = title.y;
                for (var j = 1; j <= 7; j++) {
                    wildDescXML = GlobalClass.getXMLByKey(game, '[id="5"] line' + j);
                    y = GlobalClass.checkString(wildDescXML, 20, y + 56, false, "small", "15px Arial", page, this._style3, {
                        wordWrapWidth: 490,
                        lineHeight: 56
                    });
                }
            }
            else if (i == 11) {
                page.x = page.x - 280;
                page.y = 330;
                var title = game.add.text(252, 10, GlobalClass.getXMLByKey(game, "winline"), this.titleStyle, page);
                title.anchor.set(0.5, 0.5);

                var line = game.add.sprite(272, 85, 'paytable', 'payline1-30.png', page);
                line.anchor.set(0.5, 0);
                line.scale.set(0.87);

            }

        }
    };

    this.pageDown = function () {
        this._startX = game.input.x;
    };

    this.pageUp = function () {
        this._endX = game.input.x;
        var distance = this._endX - this._startX;
        var direction = '';
        if (distance > 50) {
            this.prevPaytable(true);
        }
        else if (distance < -50) {
            this.nextPaytable(true);
        }
    };

    this.changePageLandscape = function (direction) {
        var x = 0;
        if (direction == 'l') {
            x = this._grpPage.x - 850;
        }
        else if (direction == 'r') {
            x = this._grpPage.x + 850;
        }

        TweenMax.to(this._grpPage, 0.2, {
            x: x,
            ease: Linear.easeNone,
            useFrames: false,
            callbackScope: this,
            onComplete: function () {
                this._moving = false;
            }
        });
    };

    //   var pageTween = game.add.tween(this._grpPage).to({
    // 	x: x
    //   }, 200, "Linear", true, 0, 0);
    //   pageTween.onComplete.add(function(){
    // 	this._moving =false;
    //   }, this);
    // };

    this.changePagePotrait = function (direction) {
        var x = 0;
        if (direction == 'l') {
            x = this._grpPage.x - 508;
        }
        else if (direction == 'r') {
            x = this._grpPage.x + 508;
        }

        TweenMax.to(this._grpPage, 0.2, {
            x: x,
            ease: Linear.easeNone,
            useFrames: false,
            callbackScope: this,
            onComplete: function () {
                this._moving = false;
            }
        });

        //   var pageTween = game.add.tween(this._grpPage).to({
        // 	x: x
        //   }, 200, "Linear", true, 0, 0);
        //   pageTween.onComplete.add(function(){
        // 	this._moving =false;
        //   }, this);
    };

    this.nextPaytable = function (noSound) {
        if (this._moving) {
            return;
        }
        if (!noSound) {
            soundClass.playSound("soundbtnclick");
        }
        this._pageCount++;
        if (this._pageCount > this._pageMax) {
            this._pageCount = this._pageMax;
            return;
        }

        this.checkButton();
        this._moving = true;
        if (AppConstants.LANDSCAPE) {
            this.changePageLandscape('l');
        } else {
            this.changePagePotrait('l');
        }
    };

    this.prevPaytable = function (noSound) {
        if (this._moving) {
            return;
        }

        if (!noSound) {
            soundClass.playSound("soundbtnclick");
        }
        this._pageCount--;
        if (this._pageCount < 1) {
            this._pageCount = 1;
            return;
        }
        this.checkButton();
        this._moving = true;
        if (AppConstants.LANDSCAPE) {
            this.changePageLandscape('r');
        } else {
            this.changePagePotrait('r');
        }
    };

    this.checkButton = function () {
        if (this._pageCount >= this._pageMax) {
            this._pageCount = this._pageMax;
        }

        if (this._pageCount <= 1) {
            this._pageCount = 1;
        }
        this.setBullet();
    };

    this.setBullet = function () {
        for (var i = 1; i <= this._pageMax; i++) {
            if (i == this._pageCount) {
                this._bulletObj["bullet" + i].visible = false;
                this._bulletObj["bulletActive" + i].visible = true;
            }
            else {
                this._bulletObj["bullet" + i].visible = true;
                this._bulletObj["bulletActive" + i].visible = false;
            }
        }
    }

    this.closePage = function () {
        GlobalClass.GAME_OPTION = false;
        // game.notify.event.emit("sentMsgSolid","OTFEIM.POPUP_INACTIVE");
        soundClass.playSound("soundbtnclick");

        if (this._grpPaytable != null) {
            this._grpPaytable.destroy();
            this._grpPaytable = null;
        }

        if (this._grpPage != null) {
            this._grpPage.destroy();
            this._grpPage = null;
        }

        if (this._grpMask != null) {
            this._grpMask.destroy();
            this._grpMask = null;
        }

        if (this._grpTime != null) {
            this._grpTime.destroy();
            this._grpTime = null;
        }

        if (this._timerRepeat) {
            clearInterval(this._timerRepeat);
            this._timerRepeat = null;
        }
        gameplayState._paytableClass = null;
    };
}
