var networkWinClass = function(game, parent, group, data, session) {
    this._grpWin = null;
    this._data = data[0];
    this._pdxmInstruction = data[1];
    this._onRetry = data[2];

    this.create = function() {
        this._grpWin = game.add.group();
        group.addChild(this._grpWin);
    
        // Popup network/error tidak boleh mengubah setting audio pemain.
        // Kode mute lama dipertahankan sebagai referensi, tetapi dinonaktifkan.
        // if (this._data != "nointernet" || session) {
        //     PIXI.sound.volumeAll = 0;
        // }
        
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
        this._maskBG = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpWin);
        this._maskBG.width = GlobalClass.STAGE_WIDTH * 2;
        this._maskBG.height = GlobalClass.STAGE_HEIGHT * 2;
        this._maskBG.interactive = true;

        if (this._data == "session" || this._data == "nointernet") {
            this._maskBG.alpha = 0.7;
        }

        var frame = game.add.sprite(game.world.centerX,game.world.centerY,"network","network-error-frame.png", this._grpWin);
        frame.anchor.set(0.5, 0.5);

        // var errorFont = game.add.sprite(frame.x,frame.y-50,"network","network-error-font.png", this._grpWin);
        // errorFont.anchor.set(0.5, 0.5);
        let str;

        if (this._pdxmInstruction?.errorMessage == null) {
            if (this._data == "session") {
                if (GlobalClass.getXMLByKey(game, "notif_session_timeout") == "null") {
                    str = "SESSION TIMEOUT";
                } else {
                    str = GlobalClass.getXMLByKey(game, "notif_session_timeout")
                }
            } else if (this._data == "nointernet") {
                if (GlobalClass.getXMLByKey(game, "notif_no_internet") == "null") {
                    str = "NO INTERNET CONNECTION";
                } else {
                    str = GlobalClass.getXMLByKey(game, "notif_no_internet")
                }

                // str = "The amount you selected exceeds your weekly spending limit.The amount you selected exceeds your weekly spending limit.The amount you selected exceeds your weekly spending limit.The amount you selected exceeds your weekly spending limit.The amount you selected exceeds your weekly spending limit. The amount you selected exceeds your weekly spending limit.The amount you selected exceeds your weekly spending limit. You will be able to take CAD 121836 (amount) to the game. Limits can be changed in the 'responsible gaming' account page."
            }  else {
                if (this._data?.response?.data?.responseException?.exceptionMessage != null) {
                    str = this._data.response.data.responseException.exceptionMessage;
                } else if (this._data?.data?.error != null) {
                    str = this._data.data.error;
                } else {
                    if (GlobalClass.getXMLByKey(game, "notif_error_code") == "null") {
                        str = "ERROR CODE: 404";
                    } else {
                        str = GlobalClass.getXMLByKey(game, "notif_error_code")
                    }
                }
            }
        } else {
            str = this._pdxmInstruction.errorMessage;
        }
        
        // this._txtInfo1 = new PIXI.Text(str, {
        //     fontFamily: "Arial",
        //     fontSize: "20px",
        //     fill: "#FFFFFF",
        //     stroke: "#000000",
        //     strokeThickness: 2,
        //     align: "center",
        //     wordWrap: true,
        //     wordWrapWidth: 550
        // });

        let maxHeight = 110;
        let minFont = 10;       // batas aman agar tidak terlalu kecil
        let fontSize = 20;      // font awal

        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: fontSize,
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 1,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 550
        });

        // buat dulu
        this._txtInfo1 = new PIXI.Text(str, style);

        // proses shrinking
        while (this._txtInfo1.height > maxHeight && fontSize > minFont) {
            fontSize -= 1;
            style.fontSize = fontSize;
            this._txtInfo1.style = style;   // apply ulang
        }

        this._txtInfo1.anchor.set(0.5, 0.5);
        this._txtInfo1.x = frame.x;
        this._txtInfo1.y = frame.y - 50;
        this._grpWin.addChild(this._txtInfo1);

        // const maxHeight = 110;     // batas tinggi yang kamu mau
        // const textHeight = this._txtInfo1.height;

        // if (textHeight > maxHeight) {
        //     const scale = maxHeight / textHeight;
        //     this._txtInfo1.scale.set(scale);
        // }

        
        var btnRefresh = game.add.button(frame.x, frame.y+60, 'network', this.refreshGame, this, 'refresh-hov.png', 'refresh.png', 'refresh-clk.png', null, this._grpWin);
        btnRefresh.scale.set(1.5, 1.5);
        btnRefresh.anchor.set(0.5, 0.5);

        // var refreshFont = game.add.sprite(btnRefresh.x,btnRefresh.y,"network","refresh-font.png", this._grpWin);
        // refreshFont.anchor.set(0.5, 0.5);
        let text;
        if (this._pdxmInstruction?.errorAction == null) {
            if (this._data == "nointernet") {
                if (session) {
                    if (GlobalClass.getXMLByKey(game, "notif_retry") == "null") {
                        text = "RETRY";
                    } else {
                        text = GlobalClass.getXMLByKey(game, "notif_retry")
                    }
                } else {
                    if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                        text = "CLOSE";
                    } else {
                        text = GlobalClass.getXMLByKey(game, "notif_close")
                    }
                }
            } else {
                // if (GlobalClass.getXMLByKey(game, "notif_refresh") == "null") {
                //     text = "REFRESH";
                // } else {
                //     text = GlobalClass.getXMLByKey(game, "notif_refresh")
                // }
                if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            }
        } else { 
            if (this._pdxmInstruction?.errorAction === "IGNORE") {
                if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            } else if (this._pdxmInstruction?.errorAction === "RESET") {
                 if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            } else if (this._pdxmInstruction?.errorAction === "RECALL") {
                if (GlobalClass.getXMLByKey(game, "notif_retry") == "null") {
                    text = "RETRY";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_retry")
                }
            }
        }

        this._txtInfo2 = new PIXI.Text(text, {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            align: "center"
        });
        this._txtInfo2.anchor.set(0.5, 0.5);
        this._txtInfo2.x = frame.x;
        this._txtInfo2.y = frame.y + 60;
        this._grpWin.addChild(this._txtInfo2);
        
        if (this._pdxmInstruction?.errorType === "NONRECOVERABLE") {
            btnRefresh.visible = false;
            this._txtInfo2.visible = false;
        }
    };
    
    this.createPortrait = function() {
        GlobalClass.deleteChildren(this._grpWin);
        this._maskBG = game.add.sprite(gameplayState._bannerMaskX, gameplayState._bannerMaskY, 'uiPanel', 'BG_allBanners.png', this._grpWin);
        this._maskBG.width = GlobalClass.STAGE_WIDTH * 2;
        this._maskBG.height = GlobalClass.STAGE_HEIGHT * 2;
        this._maskBG.interactive = true;

        var frame = game.add.sprite(game.world.centerY,game.world.centerX,"network","network-error-frame.png", this._grpWin);
        frame.anchor.set(0.5, 0.5);

        // var errorFont = game.add.sprite(frame.x,frame.y-50,"network","network-error-font.png", this._grpWin);
        // errorFont.anchor.set(0.5, 0.5);
        let str;

        if (this._pdxmInstruction?.errorMessage == null) {
            if (this._data == "session") {
                if (GlobalClass.getXMLByKey(game, "notif_session_timeout") == "null") {
                    str = "SESSION TIMEOUT";
                } else {
                    str = GlobalClass.getXMLByKey(game, "notif_session_timeout")
                }
            } else if (this._data == "nointernet") {
                if (GlobalClass.getXMLByKey(game, "notif_no_internet") == "null") {
                    str = "NO INTERNET CONNECTION";
                } else {
                    str = GlobalClass.getXMLByKey(game, "notif_no_internet")
                }
            }  else {
                if (this._data?.response?.data?.responseException?.exceptionMessage != null) {
                    str = this._data.response.data.responseException.exceptionMessage;
                } else if (this._data?.data?.error != null) {
                    str = this._data.data.error;
                } else {
                    if (GlobalClass.getXMLByKey(game, "notif_error_code") == "null") {
                        str = "ERROR CODE: 404";
                    } else {
                        str = GlobalClass.getXMLByKey(game, "notif_error_code")
                    }
                }
            }
        } else {
            str = this._pdxmInstruction.errorMessage;
        }
        

        // this._txtInfo1 = new PIXI.Text(str, {
        //     fontFamily: "Arial",
        //     fontSize: "20px",
        //     fill: "#FFFFFF",
        //     stroke: "#000000",
        //     strokeThickness: 2,
        //     align: "center",
        //     wordWrap: true,
        //     wordWrapWidth: 550
        // });
        // this._txtInfo1.anchor.set(0.5, 0.5);
        // this._txtInfo1.x = frame.x;
        // this._txtInfo1.y = frame.y - 50;
        // this._grpWin.addChild(this._txtInfo1);


        let maxHeight = 110;
        let minFont = 10;       // batas aman agar tidak terlalu kecil
        let fontSize = 20;      // font awal

        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: fontSize,
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 1,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 550
        });

        // buat dulu
        this._txtInfo1 = new PIXI.Text(str, style);

        // proses shrinking
        while (this._txtInfo1.height > maxHeight && fontSize > minFont) {
            fontSize -= 1;
            style.fontSize = fontSize;
            this._txtInfo1.style = style;   // apply ulang
        }

        this._txtInfo1.anchor.set(0.5, 0.5);
        this._txtInfo1.x = frame.x;
        this._txtInfo1.y = frame.y - 50;
        this._grpWin.addChild(this._txtInfo1);

        // const maxHeight = 110;     // batas tinggi yang kamu mau
        // const textHeight = this._txtInfo1.height;

        // if (textHeight > maxHeight) {
        //     const scale = maxHeight / textHeight;
        //     this._txtInfo1.scale.set(scale);
        // }

        
        var btnRefresh = game.add.button(frame.x, frame.y+60, 'network', this.refreshGame, this, 'refresh-hov.png', 'refresh.png', 'refresh-clk.png', null, this._grpWin);
        btnRefresh.scale.set(1.5, 1.5);
        btnRefresh.anchor.set(0.5, 0.5);

        // var refreshFont = game.add.sprite(btnRefresh.x,btnRefresh.y,"network","refresh-font.png", this._grpWin);
        // refreshFont.anchor.set(0.5, 0.5);
        let text;
        if (this._pdxmInstruction?.errorAction == null) {   
            if (this._data == "nointernet") {
                if (session) {
                    if (GlobalClass.getXMLByKey(game, "notif_retry") == "null") {
                        text = "RETRY";
                    } else {
                        text = GlobalClass.getXMLByKey(game, "notif_retry")
                    }
                } else {
                    if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                        text = "CLOSE";
                    } else {
                        text = GlobalClass.getXMLByKey(game, "notif_close")
                    }
                }
            } else {
                // if (GlobalClass.getXMLByKey(game, "notif_refresh") == "null") {
                //     text = "REFRESH";
                // } else {
                //     text = GlobalClass.getXMLByKey(game, "notif_refresh")
                // }
                if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            }
        } else { 
            if (this._pdxmInstruction?.errorAction === "IGNORE") {
                if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            } else if (this._pdxmInstruction?.errorAction === "RESET") {
                 if (GlobalClass.getXMLByKey(game, "notif_close") == "null") {
                    text = "CLOSE";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_close")
                }
            } else if (this._pdxmInstruction?.errorAction === "RECALL") {
                if (GlobalClass.getXMLByKey(game, "notif_retry") == "null") {
                    text = "RETRY";
                } else {
                    text = GlobalClass.getXMLByKey(game, "notif_retry")
                }
            }
        }

        this._txtInfo2 = new PIXI.Text(text, {
            fontFamily: "Arial",
            fontSize: "24px",
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeThickness: 3,
            align: "center"
        });
        this._txtInfo2.anchor.set(0.5, 0.5);
        this._txtInfo2.x = frame.x;
        this._txtInfo2.y = frame.y + 60;
        this._grpWin.addChild(this._txtInfo2);

        if (this._pdxmInstruction.errorType === "NONRECOVERABLE") {
            btnRefresh.visible = false;
            this._txtInfo2.visible = false;
        }
    };

    this.refreshGame = function(){
        // window.location.reload();
        try {
            soundClass.playSound("soundbtnclick");
        } catch (err) {}

        if (this._pdxmInstruction?.errorAction == null) {
            if (this._data === "nointernet") {
                this._grpWin.destroy();
                this._grpWin = null;
                parent._networkWin = null;

                if (session) {
                    TweenMax.delayedCall(3, parent.initNetwork, [], parent, false);
                }
            } else if (this._data === "session") {
                window.location.reload();
            } else {
                this._grpWin.destroy();
                this._grpWin = null;
                parent._networkWin = null;
            }
        } else {
            if (this._pdxmInstruction?.errorAction === "IGNORE") {   
                this._onRetry();
            } else if (this._pdxmInstruction?.errorAction === "RESET") {
                AppFacadeInstance.sendNotification(SlotsEvents.NO_COIN);
            } else if (this._pdxmInstruction?.errorAction === "RECALL") {
                this._onRetry();
            }

            this._grpWin.destroy();
            this._grpWin = null;
            parent._networkWin = null;
        }
    }
}

