var MessageSolidEvent = {
    PLAY_INTERRUPTED:'playInterrupted',//Tells the game that game play needs to be paused.blocks UI and Stops autoplay
    PLAY_RESUMED:'playResumed',//This event signals to the game that the player would like to continue playing. unblocks UI
    EXIT:'exit',//This event signals that the player would like to exit the game
    GO_TO_DEPOSIT:'goToDeposit',//This event is dispatched on Deposit button click.
    GAME_BUSY:'gameBusy',//This event dispatches after straight after player action (Spin, Deal..)
    GAME_NOT_BUSY:'gameNotBusy', //This event dispatches when buttons (Spin, Deal..)for player action becomes active.
    GAME_SETTING:'gameSetting',
    STOP_AUTOPLAY:'stop_autoplay'
};

var gameSoundState = 0;

function MessageSolid() {

}

MessageSolid.prototype.constructor = MessageSolid;

MessageSolid.prototype.init = function() {
    console.log("============================init message solid======================================");

    window.addEventListener("message", (event)=> {
        this.receiver(event);
    });

    game.notify.event.on("sentMsgSolid",this.sent,this);
    if (AppConstants.ACTIVE_RELAXFEIM) {
        this.initFEIM();
    } else if(AppConstants.ACTIVE_OTFETM) {
        this.initOTFEIM();
    }
}

MessageSolid.prototype.initOTFEIM = function() {
    let clientBaseUrl = this.getClientBaseUrl();
    var gatewayScriptPath = clientBaseUrl+"gateway-script/latest/dist/index.umd.min.js";
    window.__gatewayConfig = {
        modules: ["otfeim"],
        onReady: (isError) => this.onReady(isError),
        clientBaseUrl: clientBaseUrl
    };
    this.appendJs(clientBaseUrl, gatewayScriptPath);
}

MessageSolid.prototype.onReady = function(isError) {
    console.log("ready---------------------"+isError);
    if (!isError) {
        // const IS_LOCALHOST = true;

        const complianceConf = AppConstants.conf.compliance;
        const conf = {
            realityCheck: {
                enabled: complianceConf.responsibleGambling,
                lang:GlobalClass.GAME_LANG,
                currency:GlobalClass.CURRENCY,
                //currencyPrecision: 2,//TODO if the game support more then 2 digits after dot it can be set here
                devicePlatform: AppConstants.MOBILE_GAME ? 'mobile' : 'desktop',
                // rgPageUrl: complianceConf.rgUrl,
                // rgPageUrl: 'https://stage-core.onetouch.io/cmt/v1/game/rg-page/latest/dist/index.html',
                rgPageUrl: GlobalClass.GAME_DEBUG ? 'https://stage-core.onetouch.io/cmt/v1/game/rg-page/latest/dist/index.html' : AppConstants.conf.compliance.rgUrl,
                jurisdiction: complianceConf.jurisdiction,

                lossLimit: 0,
                lossLimitMax: GlobalClass.GAME_BALANCE,

                onShowHistory: () => this.ShowHistory(), //TODO open game history
                onExitToLobby: () => this.ExitToLobby(), //TODO redirect to lobby
                onReloadGame: () => this.ReloadGame(), //TODO reload the game
                onPageOpen: (pageId) => this.UpdateLayout(pageId) //TODO adjust layout for specific page. Disable keyboard event
            },
            gameTitle: {
                enabled: false,
                gameTitleText: "Wild Wild West 2120: Deluxe"
            },
            server: {
              baseUrl: AppConstants.SERVER_BASE_URL,
              authToken: GlobalClass.GAME_AUTH_TOKEN,
              configId: GlobalClass.GAME_CONFIG_ID,
              gameType: GlobalClass.GAME_TYPE
            },
            latencyCheck: {
              enabled: complianceConf.poorInternetConnection
            }
        }
        if (complianceConf.notificationInterval && complianceConf.notificationInterval.length > 0) {
            conf.realityCheck.notificationIntervals = complianceConf.notificationInterval;
            conf.realityCheck.notificationInterval = conf.realityCheck.notificationIntervals[0];
        }
        if (complianceConf.sessionDuration && complianceConf.sessionDuration.length > 0) {
            conf.realityCheck.sessionDurations = complianceConf.sessionDuration;
            conf.realityCheck.sessionDuration = conf.realityCheck.sessionDurations[0];
        }
        if (complianceConf.inactivityTimeout) {
            conf.inactivityCheck = {
                enabled: complianceConf.inactivityTimeout > 0,
                inactivityTimeout: (complianceConf.inactivityTimeout || 0) * 60// convert from min to sec
            };
        }

        const storageData = AppConstants.storageData;
        if (storageData){
            conf.storageData = storageData
        }

        OTFEIM.configure(conf);
        OTFEIM.setBalance(GlobalClass.GAME_BALANCE);
    }
}

MessageSolid.prototype.ShowHistory = function() {
    console.log("ShowHistory");
    if (GlobalClass.GAME_ACTV_NAME == "intro" || GlobalClass.GAME_ACTV_NAME == "gameplay") {
        AppFacadeInstance.sendNotification(SlotsEvents.LOAD_HISTORY_DATA);
    }
}

MessageSolid.prototype.ExitToLobby = function() {
    console.log("ExitToLobby");
    // if (GlobalClass.GAME_ACTV_NAME == "gameplay") {
    //     GlobalClass.GAME_ACTV._buttonClass.bnHome();
    // } else {
        // game.notify.event.emit("sentMsgSolid",MessageSolidEvent.EXIT,{});

        if(AppConstants.GAME_LOBBY_URL){
            if( window.parent){
                window.parent.location.href = AppConstants.GAME_LOBBY_URL;
            } else {
                window.location.href = AppConstants.GAME_LOBBY_URL;
            }
        }
    // }
}

MessageSolid.prototype.ReloadGame = function() {
    console.log("ReloadGame ");
    window.location.reload();
}

MessageSolid.prototype.UpdateLayout = function(pageId) {
    console.log("UpdateLayout " + pageId);
    if (GlobalClass.GAME_ACTV_NAME == "gameplay") {
        switch (pageId) {
            case "setupPage":
            case "warningPage": {
                //Disable keyboard
                GlobalClass.CONFIG_SPACEBAR = false;
                break;
            }
            case "empty": {
                //Enable keyboard
                GlobalClass.CONFIG_SPACEBAR = true;
                break;
            }
        }
    }
}

MessageSolid.prototype.showHandHistory = function() {
    console.log("showHandHistory");
}

MessageSolid.prototype.exitToLobby = function() {
    console.log("exitToLobby");
} 

MessageSolid.prototype.updateLayout = function() {
    console.log("updateLayout");
}

MessageSolid.prototype.onLoad = function() {
    console.log("onLoad");
}

MessageSolid.prototype.getClientBaseUrl = function() {
    const divider = "/game/";
    if (window.location.href.indexOf(divider) > -1) {
        return window.location.href.split(divider)[0] + divider;
    } else {
        return "https://stage-core.onetouch.io/cmt/v1/game/";
    }
}

MessageSolid.prototype.appendJs = function(clientBaseUrl,gatewayScriptPath) {
     const queryDebugKey = "client_base_url=";
     const tmpArr = window.location.href.split(queryDebugKey);
     if (tmpArr.length > 1) {
         clientBaseUrl = tmpArr[1].split("&")[0];
     }
     let scriptPath;
     if (gatewayScriptPath.indexOf("http") === 0) {
         scriptPath = gatewayScriptPath;
     } else {
         scriptPath = clientBaseUrl + gatewayScriptPath;
     }

     scriptPath = decodeURIComponent(scriptPath);
     let script = document.createElement('script');
     script.type = 'text/javascript';
     script.onload = () => this.onLoad();
     script.onerror = () => this.onReady(true);
     script.src = scriptPath;
     document.head.appendChild(script);
}

MessageSolid.prototype.receiver = function(event) {
    console.log("===================================receive event===================================");
    console.log(event);
    let data = {};
    var self = this;
    if (AppConstants.ACTIVE_RELAXFEIM) {
        if (event.data.rgMessage == "oprg_GamePause") {
            if (event.data.payload.autoPlayOnly) {
                data.eventName = MessageSolidEvent.STOP_AUTOPLAY;
            } else {
                if (GlobalClass.GAME_FEATURE) {
                    GlobalClass.GAME_UI_BLOCKED = 3;
                    return;
                }
                if (gameSoundState == 1) {
                    GlobalClass.GAME_UI_BLOCKED = 1;
                    return;
                }
                data.eventName = MessageSolidEvent.PLAY_INTERRUPTED;
            }
        } else if (event.data.rgMessage == "oprg_GameResume") {
            data.eventName = MessageSolidEvent.PLAY_RESUMED;
        } else if (event.data.rgMessage == "oprg_Ping") {

        } else if (event.data.rgMessage == "oprg_UpdateBalance") {
            FEIM.send.balanceUpdate(GlobalClass.GAME_BALANCE);
        } else if (event.data.rgMessage == "oprg_SetSounds") {
            if (event.data.payload.enableSounds) {
                GlobalClass.GAME_SOUND_BAR_X = 1;
                PIXI.sound.volumeAll = 1;
            } else {
                GlobalClass.GAME_SOUND_BAR_X = 0;
                PIXI.sound.volumeAll = 0;
            }
        }
    } else {
        data = event.data;
    }

    if (event.data.eventName == MessageSolidEvent.PLAY_INTERRUPTED && (game.state.currentScene.stateName == 'Boot' || game.state.currentScene.stateName == 'Preloader')) {
        GlobalClass.GAME_UI_BLOCKED = 1;
    }
    // game.notify.event.emit("receiveMsgSolid",data);
}

MessageSolid.prototype.initFEIM = function() {
    FEIM.configure({
        p2pConfig: {currency: GlobalClass.CURRENCY},
        handleRgPostMessageAPI: true,
        //handleFeaturePause: true,
        logLevel: FEIM.LogLevel.ALL_MESSAGES_AND_PAYLOADS,
        clientExternalModules:'relaxfeim',
    });
    FEIM.send.balanceUpdate(GlobalClass.GAME_BALANCE);

    FEIM.on.updateSettings((newSetting) => {
        if (newSetting.sounds !== undefined) {
            if (newSetting.sounds) {
                PIXI.sound.volumeAll = 1;
                GlobalClass.GAME_SOUND_BAR_X = 1;
            } else {
                GlobalClass.GAME_SOUND_BAR_X = 0;
                PIXI.sound.volumeAll = 0;
            }
        }
    });
}

MessageSolid.prototype.sent = function(eventName,data) {
    console.log("sent eventName:"+eventName);
    if (AppConstants.ACTIVE_RELAXFEIM) {
        var dt = {};
        var n1 = null;  //new bigDecimal('4896.86');
        var n2 = null;  //new bigDecimal('100');
        var quotient = null; //n1.multiply(n2);

        // dt.balance = GlobalClass.GAME_BALANCE * 100;
        n1 = new bigDecimal(String(GlobalClass.GAME_BALANCE));
        n2 = new bigDecimal('100');
        quotient = n1.multiply(n2);
        dt.balance = quotient.value;

        if (eventName==MessageSolidEvent.GAME_BUSY) {
            FEIM.send.roundStarted(dt);
            gameSoundState = 1;
        } else if (eventName == MessageSolidEvent.GAME_NOT_BUSY) {
            if (GlobalClass.GAME_RESP_DATA) {
                var jackpotWin = 0;
                if (GlobalClass.GAME_DATA.jackpotState) {
                    // jackpotWin = GlobalClass.GAME_DATA.jackpotState.winAmountInDollar*100;
                    n1 = new bigDecimal(String(GlobalClass.GAME_DATA.jackpotState.winAmountInDollar));
                    n2 = new bigDecimal('100');
                    quotient = n1.multiply(n2);
                    jackpotWin = quotient.value;
                }
                
                // dt.bet = GlobalClass.GAME_RESP_DATA.totalBet*100;
                n1 = new bigDecimal(String(GlobalClass.GAME_RESP_DATA.totalBet));
                n2 = new bigDecimal('100');
                quotient = n1.multiply(n2);
                dt.bet = quotient.value;

                // dt.win = {
                //     win:GlobalClass.GAME_RESP_DATA.totalWin*100,
                //     jackpotWin:jackpotWin
                // }
                n1 = new bigDecimal(String(GlobalClass.GAME_RESP_DATA.totalWin));
                n2 = new bigDecimal('100');
                quotient = n1.multiply(n2);
                dt.win = {
                    win:quotient.value,
                    jackpotWin:jackpotWin
                }
            }
            FEIM.send.roundFinished(dt);
            gameSoundState = 0;

            if (GlobalClass.GAME_UI_BLOCKED == 1 || GlobalClass.GAME_UI_BLOCKED == 3) {
                data.eventName = MessageSolidEvent.PLAY_INTERRUPTED;
                // game.notify.event.emit("receiveMsgSolid",data);
            }
        } else if (eventName == MessageSolidEvent.EXIT) {
            FEIM.send.exitGame();
        } else if (eventName == MessageSolidEvent.GAME_SETTING) {
            FEIM.send.updateSettings(data);
        } else if (eventName.indexOf("FEIM.send")!=-1) {
            if (typeof data == 'object') {
                data = JSON.stringify(data);
            } else if (typeof data == 'number') {

            } else if (typeof data == 'string') {
                data = "'"+data+"'";
            } else {
                data = "";
            }

            if (data!="") {
                eval(eventName+"("+data+")");
            } else {
                eval(eventName+"()");
            }
        }
    } else if (AppConstants.ACTIVE_OTFETM) {
        if (eventName == MessageSolidEvent.GAME_BUSY ) {
            OTFEIM.setGameBusy(true);
            OTFEIM.setRoundActive(true);
        }  else if (eventName == MessageSolidEvent.GAME_NOT_BUSY) {
            OTFEIM.setGameBusy(false);
            OTFEIM.setRoundActive(false);
        } else if (eventName == MessageSolidEvent.EXIT) {
           // FEIM.send.exitGame();
        } else if (eventName == MessageSolidEvent.GAME_SETTING) {
            //FEIM.send.updateSettings(data);
        } else if (eventName == "OTFEIM.POPUP_ACTIVE") {
            OTFEIM.setGameBusy(true); 
        } else if (eventName == "OTFEIM.POPUP_INACTIVE") {
            OTFEIM.setGameBusy(false);
        } else if (eventName == "FEIM.send.betUpdate") {
            OTFEIM.addBet(data);
        } else if (eventName == "OTFEIM.addWin") {
            OTFEIM.addWin(data);
        } else if (eventName == "FEIM.send.balanceUpdate") {
            OTFEIM.setBalance(GlobalClass.GAME_BALANCE);
        } else if (eventName == "FEIM.showRCStatement") {
            OTFEIM.showRCStatement();
        } else if (eventName == "OTFEIM.realityCheckBetValidation") {
            let bet = GlobalClass.betPerLine1() * GlobalClass.trueCoinValue();
            let minBet = AppConstants.conf.betSizes[0] * AppConstants.conf.coinValues[0];
            let isMinBet = bet <= minBet ? true : false;
            return OTFEIM.realityCheckBetValidation(bet, isMinBet);
        }
    } else {
        window.parent.postMessage({source:'game',eventName:eventName,data:data}, '*');
    }
}