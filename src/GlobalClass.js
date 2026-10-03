/**
 * ...
 * @author
 */
var GlobalClass = {
    // for slotgame
    GAME_NAME: "Www2120Deluxe",
    GAME_ACTV_NAME: "none",

    GAME_PIXI: null,
    GAME_ACTV: null,

    TIMER_SCALE: null,

    ONETOUCH_PENDING_OFFERS: [],
    ONETOUCH_FREESPINS_DATA: [],
    ONETOUCH_FREESPINS: false,
    // ONETOUCH_CONFIG_ID: "",
    ONETOUCH_OFFER_ID: "",
    ONETOUCH_FREESPINS_LEFT: 0,
    ONETOUCH_FREESPINS_COINVALUE: 0,
    ONETOUCH_FREESPINS_BETCOIN: 0,
    ONETOUCH_FREESPINS_BETCURRENCY: 0,

    GAME_DURATION: 0,
    GAME_DURATION_FINISH: false,
    GAME_DURATION_TIMER: null,
    GAME_OPTION: false,
    GAME_TYPE: "",
    GAME_ENGINE: null,
    GAME_DATA: null,
    GAME_RESP_DATA:null,
    GAME_INIT_DATA: null,

    GAME_VERSION: "1.0.9",
    GAME_DEBUG: false,

    GAME_USER: {
        currency: "",
        balance: 0,
    },
    SERVER_DEBUG: true,
    SIDE_BET: true,
    GAME_SOUND_BAR_X: 1,
    GAME_SOUND_BAR_X_PREV: 1,
    FREE_GAME_AUTO_SPIN: false,
    GAME_LANG: 'en',
    GAME_CONFIG_ID: '',
    GAME_AUTH_TOKEN: '',
    SESSIONID:'',
    JACKPOT:null,

    GAME_BUSY:false,

    SCALE_FACTOR: 1,
    STAGE_MAX: 1280,
    STAGE_WIDTH: 1280,
    STAGE_HEIGHT: 720,
    PORTRAIT_SCALE: 0.82,
    UI_SCALE_X: 1280 / 1920,
    UI_SCALE_Y: 720 / 1080,
    SYMBOL_WIDTH: 170,
    SYMBOL_HEIGHT: 170,
    TOTAL_COLUMN: 5,
    TOTAL_ROW: 3,
    ROW_START_POS: 140,
    SYMBOL_POSITION_DELETE: 786,
    SYMBOL_POSITION_APPEAR: [598, 781, 962, 1147, 1330],

    // for sound
    GAME_SOUND_ENABLE: true,
    GAME_SOUND_FX: true,
    GAME_MUSIC: true,
    GAME_SHOW_COINS: true,
    GAME_SOUND_VOLUME: 1,
    // for gameplay
    GAME_BALANCE: 100000,
    GAME_TOTALBET: 100,
    // GAME_LANGS: ['en','zh','ja','ko','vi','id'],
    // GAME_COUNTRY: ['English','中文','日本語','한국어','Tiếng Việt','Bahasa Indonesia'],
    GAME_LANGS: ["en", "fr", "sp"],

    GAMEABLE_FEATURE: null,

    GAME_UI_BLOCKED:0,//0:unblocked,1:waitting blocked,2:blocked

    GAME_REEL: [],
    GAME_STOPCODE: [0, 0, 0, 0, 0],
    GAME_CHEAT_ARR: [],
    GAME_PAYTABLE:{},

    GAME_COIN_POS: 0,
    GAME_COIN_VALUE: [1, 2, 5, 10, 20, 50, 100],
    GAME_BET: [10],
    GAME_BET_POS: 0,
    SPECIAL_FRAMES: [],
    //GAME_BET_MIN: 1,
    //GAME_BET_MAX: 10,
    GAME_LINE: 20,
    GAME_LINE_MIN: 1,
    GAME_LINE_MAX: 20,

    GAME_BETLIMIT_MIN: 1,
    GAME_BETLIMIT_MAX: 100,

    GAME_CHEAT: '',
    GAME_CHEAT_ENDLESS: '',

    GAME_ROTATION: true,
    GAME_TRANSLATE:false,

    GAME_MODE: 0,
    GAME_MODE_NORMAL: 0,
    GAME_MODE_FEATURE1: 1,
    GAME_MODE_FEATURE2: 2,

    GAME_CONDITION: 0,
    GAME_CONDITION_PREPARE: 0,
    GAME_CONDITION_IDLE: 1,
    GAME_CONDITION_USE_CHEAT: 2,
    GAME_CONDITION_SPIN: 3,
    GAME_CONDITION_STOP: 4,
    GAME_CONDITION_STOP_RESPIN: 5,
    GAME_CONDITION_ANIMATIONS: 6,
    GAME_CONDITION_ANIMATION_ALL: 7,
    GAME_CONDITION_ANIMATION_SYMBOL: 8,
    GAME_CONDITION_ANIMATION_ALL_RESPIN: 9,
    GAME_CONDITION_ANIMATION_SYMBOL_RESPIN: 10,
    GAME_CONDITION_FREE_END: 11,
    GAME_CONDITION_SKIP_LINE_WIN: 12,
    GAME_CONDITION_SKIP_DYNAMITE: 13,

    // HUD
    CONFIG_QUICKSPIN: false,
    CONFIG_SPACEBAR: false,

    CONFIG_AUTO_REMAINING: 0,
    CONFIG_AUTO_SINGLE_VALUE: 0,
    CONFIG_AUTO_INCREASE_VALUE: 0,
    CONFIG_AUTO_DECREASE_VALUE: 0,
    CONFIG_AUTO_ANYWIN_ACTIVE: false,
    CONFIG_AUTO_FREESPIN_ACTIVE: false,
    CONFIG_AUTO_SINGLE_ACTIVE: false,
    CONFIG_AUTO_INCREASE_ACTIVE: false,
    CONFIG_AUTO_DECREASE_ACTIVE: false,

    AUTO_PLAY_BALANCE: 0,

    networkState:1,

    // for judgement
    GAME_RULES: null,
    GAME_JUDGEMENT: null,
    GAME_SPECIAL_VALUE: new Array(),

    FREEGAMES_GET: [0, 0, 10, 15, 25],

    // GAME_ROOT: null,
    //GAME_AUTOSPIN								: false,
    GAME_BANNER: false,
    GAME_FEATURE: false,
    GAME_ACTIVE: false,
    //GAME_FEATURE_GET							: false,
    GAME_FEATURE_TOTAL: 0,
    GAME_FEATURE_LEFT: 0,
    GAME_FEATURE_TYPE: 0,
    GAME_FEATURE_TOTALWIN: 0,

    GAME_DECIMALS: 2,
    GAME_CONFIG_SKIP: true,

    GAME_COIN_TEMP: 0,
    GAME_TOTAL_WIN: 0,
    TOTAL_WIN: 0,

    GAME_WIN_SOUND: [10, 20, 40, 60, 80],

    MULTIPLIER_FEATURE: 1,
    MULTIPLIER_WILD_FEATURE: 2,
    MULTIPLIER_WILD_NORMAL: 2,

    MIN_SCATTER: 3,
    SCATTER_WIN_SKIP: true,
    FEATURE_RETRIGGER: false,
    JUDGEMENT_LEFT_TO_RIGHT: false,
    JUDGEMENT_RIGHT_TO_LEFT: false,
    GAME_CHEAT_STOP_CODE: "",
    CURRENCY:"",

    // for infromation
    TEXT_SPIN: new Array("Good Luck"),
    TEXT_MAXBEAT_REACH: new Array("Max Bet Reached"),
    TEXT_NOCOIN: new Array("Not Enough Credit"),
    TEXT_RESULT_NOWIN: new Array("I feel your luck is about to change"),
    TEXT_RESULT_WIN: ["Nice spin",
        "Nice spin",
        "That's a nice win!",
        "Charming Casino!",
        "Hand pay !! Someone call the attendant please!"
    ],
    TEXT_IDLE: ['Real Slots. Real Players. Real Deal.',
        "Press Spin to Play.",
        "Press Space bar to Play.",
        "3 or more scattered #SCATTER awards 10 free games.",
        "Collect #WILD to extend your free games.",
        "Each #WILD award 1 extra free games with a feature multiplier of x2, x3, x4, x5, or x10."
    ],


    // for reel and symbol
    SYMBOL_DATA: [],
    REEL_NORMAL: [],
    REEL_SPECIAL: [],
    WIN_LINE: [],

    RTP: "96%",
    GAME_AUTO_VALUES: [50, 100, 250],
    XML_EN: null,
    XML_FR: null,
    XML_SP: null,
    XML_ID: null,

    GAME_SESSION_BALANCE_ACTIVE: false,
    GAME_SESSION_BALANCE: 0,

    DEMO: false,
    REPLAY: false,
    FIRST: true,

    SESSION_TIMEOUT: null,
    SESSION_TIMER: 840000,

    startTimeout: function() {
        if (this.SESSION_TIMEOUT != null) {
            clearTimeout(this.SESSION_TIMEOUT);
            this.SESSION_TIMEOUT = null;
        }

        this.SESSION_TIMEOUT = setTimeout(() => {this.endTimeout()}, this.SESSION_TIMER); 
    },

    stopTimeout: function() {
        if (this.SESSION_TIMEOUT != null) {
            clearTimeout(this.SESSION_TIMEOUT);
            this.SESSION_TIMEOUT = null;
        }
    },

    endTimeout: async function() {
        this.stopTimeout();

        if (GlobalClass.CONFIG_AUTO_REMAINING > 0) {
            GlobalClass.CONFIG_AUTO_REMAINING = 0;
            
            try {
                gameplayState._buttonClass.stopAutoSpin();
            } catch (err) {}
        }
        
        // AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, "session");

        const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
            source: "SESSION TIMEOUT",
            error: "",
            debug: true
        });

         if (pdxmInstruction.errorType == "N/A") {

        } else {
            AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, ["session", pdxmInstruction]);
        }
    },

    convertSessionPDX: function(data) {
        this.startTimeout();

        AppConstants.PDX_SESSION_ID = data.session_id;
        if (data.user_id != undefined) {
            AppConstants.PDX_USER_ID = data.user_id;
        }
    },

    convertReplayPDX: function(data) {
        this.startTimeout();
        GlobalClass.GAME_JUDGEMENT = data;

        /*
        const jsonString = data.result.gameResult;
        // const unescapedString = jsonString.replace(/\\/g, '');
        // const jsonObject = JSON.parse(unescapedString);
        const jsonObject = JSON.parse(jsonString);
        this.GAME_JUDGEMENT.result.game_result = jsonObject;
        this.GAME_JUDGEMENT.result.game_result.gameResult.unshift(null);
        */
        this.GAME_JUDGEMENT.result.game_result = data.result.gameResult;
        this.GAME_JUDGEMENT.result.game_result.gameResult.unshift(null);


        GlobalClass.GAME_BALANCE = data.result.fundsStart;

        /*
        // GlobalClass.GAME_BET = [data.result.wager];
        // GlobalClass.GAME_BET_POS = 0;

        // GlobalClass.GAME_COIN_VALUE = [data.result.wagerCurrency / data.result.wager];
        // GlobalClass.GAME_COIN_POS = 0;

        // GlobalClass.GAME_BET = data.result.bets.split(",").map(item => item.trim());
        const isDefaultBetSet = GlobalClass.GAME_BET.includes(String(data.result.wager));
        GlobalClass.GAME_BET_POS = isDefaultBetSet ? GlobalClass.GAME_BET.indexOf(String(data.result.wager)) : 0;
        // GlobalClass.GAME_COIN_VALUE = data.result.denominations.split(",").map(item => item.trim());
        const isDefaultDenomSet = GlobalClass.GAME_COIN_VALUE.includes(String(data.result.wagerCurrency / data.result.wager));
        GlobalClass.GAME_COIN_POS = isDefaultDenomSet ? GlobalClass.GAME_COIN_VALUE.indexOf(String(data.result.wagerCurrency / data.result.wager)) : 0;
        */

        this.GAME_BET = [data.result.wager];
        this.GAME_COIN_VALUE = [data.result.denomination];
        
        this.GAME_BET_POS = 0;
        this.GAME_COIN_POS = 0;

        AppConstants.AUTOPLAY = false;
    },

    convertInitPDX: function(data) {
        // console.log(data); 
        this.startTimeout();

        GlobalClass.GAME_JUDGEMENT = data;
        GlobalClass.GAME_BALANCE = data.result.current_balance;

        var game = {};
        GlobalClass.GAME_DATA = game;
        GlobalClass.GAME_RESP_DATA = data;
        if (["id", "idr", "rp", "rupiah"].includes(String(AppConstants.PDX_CURRENCY_IDR).toLowerCase())) {
            GlobalClass.GAME_USER.currency = "Rp";
        } else {
            GlobalClass.GAME_USER.currency = data.result.custom_config.DenomSymbol;
        }
        GlobalClass.GAME_USER.balance = data.result.current_balance;

        game.freeGamesTotalWin = 0;
        game.freeGamesWon = 0;
        game.normal2Feature = false;
        game.specialFrame = [false,false,false];
        
        /*
        if(data.events && data.events.length>0){
            for(var i=0;i<data.events.length;i++){
                var event = data.events[i];
                if(event.id=="startScene" && event.sceneId=='free'){
                    game.normal2Feature = true;
                    game.freeGamesWon = event.spins;
                }
                else if(event.id=="endScene"){
                    game.freeGamesTotalWin = GlobalClass.coinValue(event.sceneWin);
                }
                else if(event.id=="specialFrame"){
                    game.specialFrame[event.position[1]] = true;
                    //event.position //4,1
                }
                else if(event.id=='addFreeSpins'){
                    //event.positions symbol 
                    
                    game.freeGamesWon = event.spins;
                }
            }	
        }
        */
       
        GlobalClass.SPECIAL_FRAMES = game.specialFrame;

        // game.freeGamesTotal = data.nextSceneState.totalSpins
        // game.freeGamesLeft = data.nextSceneState.spins;
        game.freeGamesTotal = 0;
        game.freeGamesLeft = 0;

        // GlobalClass.GAME_FEATURE = data.nextSceneState.sceneId =='free';
        GlobalClass.GAME_FEATURE = false;

        // GlobalClass.GAME_ACTIVE = data.state != 'RESOLVED';
        GlobalClass.GAME_ACTIVE = false;
        
        // new
        GlobalClass.RTP = data.result.custom_config.rtp;

        GlobalClass.XML_EN = data.result.custom_config.en_xml;
        GlobalClass.XML_FR = data.result.custom_config.fr_xml;
        GlobalClass.XML_SP = data.result.custom_config.sp_xml;
        // GlobalClass.XML_ID = data.result.custom_config.id_xml;

        if (data.result?.custom_config?.session_balance != null) { // default false
            GlobalClass.GAME_SESSION_BALANCE_ACTIVE = String(data.result.custom_config.session_balance).toLowerCase() === "true"; 
        }

        // AppConstants.TURBO = Boolean(data.result.custom_config.fastspin);
        // if (data.result?.custom_config?.skip != null) {
        //     GlobalClass.GAME_CONFIG_SKIP = Boolean(data.result.custom_config.skip);
            
        //     if (!GlobalClass.GAME_CONFIG_SKIP) {
        //         AppConstants.TURBO = false;
        //     }
        // }

        // Set skip configuration - default true
        if (data.result?.custom_config?.skip != null) {
            GlobalClass.GAME_CONFIG_SKIP = String(data.result.custom_config.skip).toLowerCase() === "true";
        }

        // Set turbo configuration - default false
        if (data.result?.custom_config?.fastspin != null) {
            const fastspinEnabled = String(data.result.custom_config.fastspin).toLowerCase() === "true";
            // Turbo hanya aktif jika fastspin true DAN skip diizinkan
            AppConstants.TURBO = fastspinEnabled && GlobalClass.GAME_CONFIG_SKIP;
        } else {
            AppConstants.TURBO = false;
        }


        if (data.result.custom_config.decimal != null) {
            GlobalClass.GAME_DECIMALS = Number(data.result.custom_config.decimal);
        }

        if (data.result.custom_config.default_lang != null) {
            if (GlobalClass.GAME_LANGS.includes(data.result.custom_config.default_lang.toLowerCase())) {
                GlobalClass.GAME_LANG = data.result.custom_config.default_lang.toLowerCase();
            }
        }

        if (data.result?.player_data != null) {
            if (data.result?.player_data?.sound != null) {
                this.GAME_SOUND_BAR_X = data.result.player_data.sound;
                PIXI.sound.volumeAll = this.GAME_SOUND_BAR_X;
            }
    
            if (data.result?.player_data?.quick != null) {
                this.CONFIG_QUICKSPIN = Boolean(data.result.player_data.quick);
            }
    
            if (data.result?.player_data?.language != null) {
                GlobalClass.GAME_LANG = data.result.player_data.language;
            }
        }

        if (data.result.custom_config.autospin == "true" || data.result.custom_config.autospin == true) {
            AppConstants.AUTOPLAY = true;
        } else {
            AppConstants.AUTOPLAY = false;
        }
        
        if (data.result?.custom_config?.autospin_values != null) {
            if (data.result.custom_config.autospin_values.length > 3) {
                GlobalClass.GAME_AUTO_VALUES = data.result.custom_config.autospin_values.split(",").map(item => item.trim());
            }
        }

        if (!GlobalClass.DEMO) {
            if (data.result.custom_config.demo == "true" || data.result.custom_config.demo == true) {
                GlobalClass.DEMO = true;
            }
        }
                if (AppConstants.BEST_OPERATOR) {
                    AppConstants.disableLangMenu = true;
                } else {
                    AppConstants.disableLangMenu = false;
                }

                GlobalClass.GAME_LINE = 20;//data.config.paylines.length;
                if (["id", "idr", "rp", "rupiah"].includes(String(AppConstants.PDX_CURRENCY_IDR).toLowerCase())) {
                    GlobalClass.CURRENCY = "Rp";
                    GlobalClass.GAME_LANG = "id";
                    AppConstants.disableLangMenu = true;
                } else {
                    GlobalClass.CURRENCY = data.result.custom_config.DenomSymbol;
                    
                    if (["id", "idr", "rp", "rupiah"].includes(String(GlobalClass.CURRENCY).toLowerCase())) {
                        GlobalClass.CURRENCY = "Rp";
                        GlobalClass.GAME_LANG = "id";
                        AppConstants.disableLangMenu = true;
                    }
                }

                AppConstants.conf = data.config;

                AppConstants.storageData = null;
                AppConstants.disableLobby = true;
                
               
                
                AppConstants.RESPONSIBLE_GAMBLING = false;
                AppConstants.SHOW_CLOCK = false;
                AppConstants.SHOW_CONNECTION = false;
                AppConstants.ROUND_DURATION = 0;
                // AppConstants.AUTOPLAY = true;
                // AppConstants.TURBO = true;
                // GlobalClass.CONFIG_QUICKSPIN = false;
                AppConstants.CONTINUOUS_KEYBOARD = false;
                AppConstants.ACTIVE_RELAXFEIM = false;
                AppConstants.ACTIVE_OTFETM = false;
                AppConstants.showRtp = true;
                
                

                /*
                GlobalClass.GAME_COIN_VALUE = data.config.coinValues.slice(0,8);
                GlobalClass.GAME_COIN_POS = data.config.coinValueIndex;
                var bets = data.config.betSizes.slice(0,8);
                GlobalClass.GAME_TYPE = data.config.gameType;
                
    
                GlobalClass.GAME_BET = [];
                for(var i=0;i<bets.length;i++){
                    GlobalClass.GAME_BET.push(bets[i]);
                }
                //GlobalClass.GAME_BET = data.config.betSizes.slice(0,8);
                GlobalClass.GAME_BET_POS = data.config.betSizeIndex;
                */
               
                GlobalClass.GAME_BET = data.result.bets.split(",").map(item => item.trim());
                const isDefaultBetSet = GlobalClass.GAME_BET.includes(String(data.result.custom_config.default_bet));
                GlobalClass.GAME_BET_POS = isDefaultBetSet ? GlobalClass.GAME_BET.indexOf(String(data.result.custom_config.default_bet)) : 0;

                GlobalClass.GAME_COIN_VALUE = data.result.denominations.split(",").map(item => item.trim());
                const isDefaultDenomSet = GlobalClass.GAME_COIN_VALUE.includes(String(data.result.custom_config.default_denom));
                GlobalClass.GAME_COIN_POS = isDefaultDenomSet ? GlobalClass.GAME_COIN_VALUE.indexOf(String(data.result.custom_config.default_denom)) : 0;

                GlobalClass.GAME_CHEAT_ARR = [];
                GlobalClass.JACKPOT = this.loadInitJackpot(data);
                game.jackpotState = GlobalClass.JACKPOT;

                // GlobalClass.loadSettings();

                GlobalClass.TOTAL_COLUMN = 5;
                GlobalClass.TOTAL_ROW = 3;

                GlobalClass.REEL_NORMAL = data.result.custom_config.reels.main;
                GlobalClass.REEL_SPECIAL = data.result.custom_config.reels.free;
                GlobalClass.GAME_PAYTABLE = data.result.custom_config.paytable.main;

                if (GlobalClass.GAME_FEATURE) {
                    GlobalClass.GAME_REEL = GlobalClass.REEL_SPECIAL;
                } else {
                    GlobalClass.GAME_REEL = GlobalClass.REEL_NORMAL;
                }

                var linePaths = [];
                for(let i in data.result.custom_config.paylines){
                    var payLine = data.result.custom_config.paylines[i];
                    var path = [];
                    for(var j = 0;j<payLine.length;j++){
                        path.push(payLine[j][1]);
                    }
                    linePaths.push(path);
                }
                GlobalClass.WIN_LINE = linePaths;

                GlobalClass.GAME_BETLIMIT_MIN = GlobalClass.minBet();
                GlobalClass.GAME_BETLIMIT_MAX = GlobalClass.maxBet();

                /*
                if (data.hasOwnProperty("balanceAdditionalFields")) {
                    GlobalClass.ONETOUCH_FREESPINS = true;
                    GlobalClass.ONETOUCH_FREESPINS_DATA = data.balanceAdditionalFields;
    
                    // GlobalClass.ONETOUCH_CONFIG_ID = data.config.id;
                    GlobalClass.ONETOUCH_OFFER_ID = data.offerId;
    
                    GlobalClass.ONETOUCH_FREESPINS_LEFT = data.balanceAdditionalFields.bets_left;
    
                    const totalBet = data.balanceAdditionalFields.bet_value;
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
    
                    console.log(GlobalClass.ONETOUCH_FREESPINS_COINVALUE);
    
                    GlobalClass.ONETOUCH_FREESPINS_BETCOIN = data.balanceAdditionalFields.bet_value / GlobalClass.ONETOUCH_FREESPINS_COINVALUE;
                    GlobalClass.ONETOUCH_FREESPINS_BETCURRENCY = data.balanceAdditionalFields.bet_value;
                }
                */   
    },

    convertSpinPDX: function(data) {
        if (this.FIRST) {
            this.FIRST = false;

        }
        // console.log(data);
        this.GAME_JUDGEMENT = data;

        var game = {};
        GlobalClass.GAME_DATA = game;
        GlobalClass.GAME_RESP_DATA = data;
        GlobalClass.GAME_USER.currency = GlobalClass.CURRENCY;// data.result.custom_config.DenomSymbol;
        if (AppConstants.PDX_ROUND_ID != "") {
            GlobalClass.GAME_BALANCE = data.result.fundsEnd;
            GlobalClass.GAME_USER.balance = data.result.fundsEnd;
        } else {
            GlobalClass.GAME_BALANCE = data.result.current_balance;
            GlobalClass.GAME_USER.balance = data.result.current_balance;
        }
        
        game.freeGamesTotalWin = data.result.game_result.gameResult[0].freeGamesTotalWinInDollar;
        game.freeGamesWon = data.result.game_result.gameResult[0].freeGamesWon;
        game.normal2Feature = data.result.game_result.gameResult[0].normal2Feature;
        game.specialFrame = [...data.result.game_result.gameResult[0].specialFrame];
    
        GlobalClass.SPECIAL_FRAMES = [...data.result.game_result.gameResult[0].specialFrame];

        game.freeGamesTotal = data.result.game_result.gameResult[0].freeGamesTotal;
		game.freeGamesLeft = data.result.game_result.gameResult[0].freeGamesLeft;

        GlobalClass.GAME_FEATURE = data.result.game_result.gameResult[0].feature;

        GlobalClass.GAME_ACTIVE = false;

        GlobalClass.JACKPOT.wonJackpots = [];
        GlobalClass.JACKPOT.winAmount = 0;
        GlobalClass.JACKPOT.winAmountInDollar = 0;
        game.jackpotState = GlobalClass.JACKPOT;

        GlobalClass.GAME_STOPCODE = [...data.result.game_result.gameResult[0].stopCode];
        GlobalClass.GAME_TOTAL_WIN = data.result.game_result.gameResult[0].totalWinInDollar;
        GlobalClass.GAME_DATA.totalWin = data.result.game_result.gameResult[0].totalWinInDollar;
        GlobalClass.GAME_DATA.roundWinCredits = data.result.game_result.gameResult[0].totalWinInDollar;
    
        var lineWin = {};
        var lineWins = [];
        lineWin.lineWins = lineWins;

        var rd = {};
        rd.id = 'jackpot';
        rd.payId = 'MINOR';
        rd.win = 5000;
        var positions = [];
        rd.positions = positions;
        for(var i =0; i< 5;i++){
            var pos = {};
            pos.row = 0;
            pos.col = i;
            positions.push(pos);
        }

        // var reward; = data.rewards[i];
        if (data.result.game_result.gameResult[0].lineWin != null) {
            for (var i = 0; i < data.result.game_result.gameResult[0].lineWin.lineWins.length; i++) {
                var line = {};
                lineWins.push(line);
                line.lineNo = data.result.game_result.gameResult[0].lineWin.lineWins[i].lineNo;
                line.winAmount = data.result.game_result.gameResult[0].lineWin.lineWins[i].winAmountInDollar;
                line.numOfSymbols = data.result.game_result.gameResult[0].lineWin.lineWins[i].numOfSymbols;
                line.winningSymbol =  data.result.game_result.gameResult[0].lineWin.lineWins[i].winningSymbol;
            }
        }

        if (data.result.game_result.gameResult[0].scWin != null) {
            game.scWin = {};
            game.scWin.scatterPos = [];
            game.scWin.winAmount = data.result.game_result.gameResult[0].scWin.winAmountInDollar;
            game.scWin.numOfScatter = data.result.game_result.gameResult[0].scWin.numOfScatter;
            
            for(var j = 0; j < data.result.game_result.gameResult[0].scWin.scatterPos.length; j++){
                var pos = {};
                pos.row = data.result.game_result.gameResult[0].scWin.scatterPos[j].row;
                pos.col = data.result.game_result.gameResult[0].scWin.scatterPos[j].col;
                pos.symId = 12;
                game.scWin.scatterPos.push(pos);
            }
        }

        for (var i = 0; i < data.result.game_result.gameResult[0].jackpotState.wonJackpots.length; i++) {
            var jackpot = {};
            jackpot.winAmount = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].winAmountInDollar;
            jackpot.winAmountInDollar = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].winAmountInDollar;
            jackpot.numberOfSymbbols = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].numberOfSymbbols;
            jackpot.name = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].name;
            jackpot.contribution = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].contribution;
            jackpot.winningSymbol = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].winningSymbol;
            jackpot.lineNo = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].lineNo;
            jackpot.positions = 0;
            // jackpot.initialPrize = data.result.game_result.gameResult[0].jackpotState.wonJackpots[i].winAmount;
            game.jackpotState.wonJackpots.push(jackpot);
            game.jackpotState.winAmount += jackpot.winAmountInDollar;
            game.jackpotState.winAmountInDollar += jackpot.winAmountInDollar;
        }
        GlobalClass.GAME_DATA.lineWin = lineWin;
    },

    loadInitJackpot:function(data){
		var jackpotState = {};
		jackpotState.winAmountInDollar = 0;
		jackpotState.winAmount = 0;
		jackpotState.wonJackpots = [];
		jackpotState.jackpotPool = [];
		for(var i=0;i<4;i++){
			var jackpot = {};
			jackpot.numberOfSymbbols = 0;
			jackpot.contribution = 0;
			jackpot.winningSymbol = 0;
			jackpot.lineNo = 0;
			if(i==0){
				jackpot.name = 'GRAND';
				jackpot.winAmount = data.result.custom_config.jackpots.GRAND;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==1){
				jackpot.name = 'MAJOR';
				jackpot.winAmount = data.result.custom_config.jackpots.MAJOR;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==2){
				jackpot.name = 'MINOR';
				jackpot.winAmount = data.result.custom_config.jackpots.MINOR;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==3){
				jackpot.name = 'MINI';
				jackpot.winAmount = data.result.custom_config.jackpots.MINI;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			jackpotState.jackpotPool.push(jackpot);
		}

		return jackpotState;

	},

    /* 
    Bet per line = wager / min bet 
    Denom = (wager / 20) / bet per line
    Line win = pay x bet per line x denom x bet multiplier
    Scatter win = pay x 20 x bet per line x denom x bet multiplier
    Jackpot = pay x denom x bet multiplier
    */



    // for function
    getBetPerLine: function get() {
        /*
        var key = "WWW2120DeluxeBet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var bet = myLocalStorage.getItem(key);
        if(!bet){
            bet = GlobalClass.GAME_BET_POS;
        }
        bet = parseInt(bet);
        if(bet>GlobalClass.GAME_BET.length-1){
            bet = GlobalClass.GAME_BET.length-1;
            myLocalStorage.setItem(key,bet);
        }

        return GlobalClass.GAME_LINE * GlobalClass.GAME_BET[bet];
        */

        return GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS] / GlobalClass.minBet();
    },

    getDenom: function get() {
        return GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS] / GlobalClass.GAME_LINE / GlobalClass.getBetPerLine();
    },

    betPerLine1: function get() {
        /*
        var key = "WWW2120DeluxeBet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var bet = myLocalStorage.getItem(key);
        if(!bet){
            bet = GlobalClass.GAME_BET_POS;
        }
        bet = parseInt(bet);
        if(bet>GlobalClass.GAME_BET.length-1){
            bet = GlobalClass.GAME_BET.length-1;
            myLocalStorage.setItem(key,bet);
        }
        
        return GlobalClass.GAME_BET[bet];
        */
        return Number(GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]);
    },
    trueCoinValue: function get() {
        var coinValue = Number(GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS] * 1000);
        return Number(coinValue / 1000);
    },
    coinValue: function get(winValue) {
        winValue = winValue/GlobalClass.trueCoinValue();
        winValue = Math.round(winValue * 100) / 100
        return winValue;
    },
    loadCountry:function(lang){
        var index = GlobalClass.GAME_LANGS.indexOf(lang);
        return GlobalClass.GAME_COUNTRY[index];
    },
    totalBet: function get() {
        let value1 = GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS];
        let value2 = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        let valueResult12 = bigDecimal.multiply(String(value1),String(value2));
        return valueResult12;
    },
    OldtotalBet: function get() { // not used anymore change to new totalBet();
        var m = 1;
        if (GlobalClass.SIDE_BET) {
            m = 1;
        }
        /*
        var key = "WWW2120DeluxeBet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var bet = myLocalStorage.getItem(key);
        if(!bet){
            bet = GlobalClass.GAME_BET_POS;
        }
        */
        let bet = GlobalClass.GAME_BET_POS;
        bet = parseInt(bet);
        if(bet>GlobalClass.GAME_BET.length-1){
            bet = GlobalClass.GAME_BET.length-1;
            // myLocalStorage.setItem(key,bet);
        }
        
        // return GlobalClass.GAME_LINE * GlobalClass.GAME_BET[bet] * m;// * coinValue / 1000;
        return GlobalClass.GAME_BET[bet] * GlobalClass.trueCoinValue() * m;// * coinValue / 1000;

    },
    minBet: function () {
        return GlobalClass.GAME_BET[0] * GlobalClass.GAME_COIN_VALUE[0];
    },
    maxBet: function () {
        return GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1] * GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_VALUE.length - 1];
        // return GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1];
    },
    updateSettings:function(type,value){
        // var key = "WWW2120Deluxe"+type+"_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        // myLocalStorage.setItem(key,value);
    },
    /*
    loadSettings:function(){
		var key = "WWW2120DeluxeBet_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var bet = myLocalStorage.getItem(key);
        if(bet){
            GlobalClass.GAME_BET_POS = parseInt(bet);
        }
		
		var key = "WWW2120DeluxeCoinValue_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var value = myLocalStorage.getItem(key);
        if(value){
            GlobalClass.GAME_COIN_POS = parseInt(value);
		}

		var key = "WWW2120DeluxeSound_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var value = myLocalStorage.getItem(key);
        if(value){
            GlobalClass.GAME_SOUND_BAR_X = value;
            GlobalClass.GAME_SOUND_BAR_X_PREV = GlobalClass.GAME_SOUND_BAR_X;
		    PIXI.sound.volumeAll = value;
		}

		var key = "WWW2120DeluxeQkSpin_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var value = myLocalStorage.getItem(key);
        if(value){
            if(value=="true"){
                // GlobalClass.CONFIG_QUICKSPIN = true;
            }
            else{
                // GlobalClass.CONFIG_QUICKSPIN = false;
            }
        }
        else{
            // GlobalClass.CONFIG_QUICKSPIN = false;
        }

        var key = "WWW2120DeluxeSP_"+GlobalClass.GAME_USER.objectId+"_"+GlobalClass.GAME_USER.configId;
        var value = myLocalStorage.getItem(key);
        if(value){
            if(value=="true"){
                // GlobalClass.CONFIG_SPACEBAR = true;
            }
            else{
                // GlobalClass.CONFIG_SPACEBAR = false;
            }
        }
        else{
            // GlobalClass.CONFIG_SPACEBAR = false;
        }
	},
    */

    // for resolution
    setScaleFactor: function () {

    },
    getPosX: function (value) {
        return value * this.SCALE_FACTOR;
    },
    getPosY: function (value) {
        return value * this.SCALE_FACTOR;
    },


    // ?????
    randomRange: function (min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    },

    formatNumber: function (number) { // give comma ---> trace ( String("100000000000000").replace( /\d{1,3}(?:(\d{3})+(?!\d))/g , "$&,") ),
        var numString = number.toString();
        var result = '';
        var result2 = '.00';

        if (numString.indexOf(".") != -1) {
            result2 = numString.substring(numString.indexOf("."), numString.length);
            numString = numString.substring(0, numString.indexOf("."));
        }

        while (numString.length > 3) {
            var chunk = numString.substr(-3);
            numString = numString.substr(0, numString.length - 3);
            result = ',' + chunk + result;
        }

        if (numString.length > 0) {
            result = numString + result;
        }
        return result + result2;
    },

    deleteChildren: function (group) {
        if (!group) {
            return;
        }
        for (var i = group.children.length - 1; i >= 0; i--) {
            group.children[i].destroy();
        }
    },
    init2dArray: function (row, col, value) {
        var res = [];
        for (var i = 0; i < row; i++) {
            var arr = [];
            for (var j = 0; j < col; j++) {
                arr[j] = value;
            }
            res[i] = arr;
        }
        return res;
    },

    getWinValue: function (symbolId, index) {
        var symbol = GlobalClass.SYMBOL_DATA[symbolId];
        var pay = "";
        if (GlobalClass.GAME_SHOW_COINS) {
            pay = symbol.pay[index - 1] * GlobalClass.betPerLine1();
        }
        else {
            pay = GlobalClass.currency() + " " + symbol.pay[index - 1] * GlobalClass.betPerLine1() * GlobalClass.trueCoinValue();
        }
        return pay;
    },

    isFullWild: function (col, pos, reelData, fullWild) {

        if (!fullWild) {
            fullWild = false;
            var currSymbol = reelData[pos];
            var nextCode = pos - 1;
            var pCode = pos + 1;


            if (currSymbol == 0) {
                if (nextCode < 0) {
                    nextCode = reelData.length - 1;
                }
                if (pCode >= reelData.length) {
                    pCode = 0
                }

                if (reelData[nextCode] == 0 && reelData[pCode] == 0) {
                    fullWild = true;
                }
            }

        }


        if (!fullWild) {
            return -1;
        }

        if (fullWild && col == 4) {
            //left yg
            return 1;
        }

        if (fullWild && col == 1) {
            //right yg
            return 2;
        }

        if (fullWild && col == 3) {
            //xln
            return 3;
        }
    },

    getJackpotLevel:function(){
        var res = {};
        res.value = GlobalClass.betPerLine1();

        let point = Math.floor(GlobalClass.GAME_BET.length / 3);
        
        if(GlobalClass.betPerLine1() == Number(GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1])){
            res.name = "grand";
            res.level = "Max";
            return res;
        }
        
        if(GlobalClass.betPerLine1() > Number(GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - point])){
            res.name = "major";
            res.level = "High";
            return res;
        }

        if(GlobalClass.betPerLine1() > Number(GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - (point * 2)])){
            res.name = "minor";
            res.level = "Med";
            return res;
        }

        res.name = "mini";
        res.level = "Low";
        return res;
    },

    getSymbolName:function(symbol) {
        var symbolName = symbol;
        // console.warn("symbol = " + symbol);
        switch (String(symbol)) {
            case "1":
                symbolName = 'pic1';
                break;
            case "2":
                symbolName = 'Pic02';
                break;
            case "3":
                symbolName = 'Pic3';
                break;
            case "4":
                symbolName = 'Pic4';
                break;
            case "5":
                symbolName = 'pic05';
                break
            case "6":
                symbolName = 'A';
                break
            case "7":
                symbolName = 'K';
                break
            case "8":
                symbolName = 'Q';
                break
            case "9":
                symbolName = 'J';
                break
            case "10":
                symbolName = '10';
                break
            case "11":
                symbolName = '9';
                break
            case "12":
                symbolName = 'Scatter';
                break
            case "13":
                symbolName = 'Wild';
                break
            case 'NINE':
                symbolName = '9';
                break;
            case 'TEN':
                symbolName = '10';
                break;
            case 'TA':
                symbolName = 'pic1';
                break;
            case 'TB':
                symbolName = 'Pic02';
                break;
            case 'TC':
                symbolName = 'Pic3';
                break;
            case 'TD':
                symbolName = 'Pic4';
                break;
            case 'TE':
                symbolName = 'pic05';
                break;
            case 'WL':
                symbolName = 'Wild';
                break;
        }

        return symbolName;
    },

    mathSymbol: function (symbol) {
        var symbolObj = new Object();
        var symbolName = GlobalClass.getSymbolName(symbol);
        if(symbolName=='9' || symbolName=='10' || symbolName=='J' || symbolName=='Q' || symbolName=='K' || symbolName=='A' || symbolName=='Wild' || symbolName=='Scatter'){
            symbolObj.assetName = 'symbols1';
        }
        else{
            symbolObj.assetName = 'symbols2';
        }

        symbolObj.symbolPngName = symbolName + "_00.png";
        if(GlobalClass.GAME_LANG=='zh' && (symbolName=='Scatter' || symbolName == 'Wild')){
            symbolObj.assetName = 'symbol_'+GlobalClass.GAME_LANG;
            symbolObj.symbolPngName = symbolName + " CH_00.png";
        }
        
        
        return symbolObj;
    },

    currency: function () {
        var res = GlobalClass.CURRENCY.toUpperCase();
        // switch (GlobalClass.GAME_LANG) {
        //     case "zh":
        //     case "ja":
        //         res = "¥";
        //         break;
        //     case "de":
        //     case "fr":
        //     case "pt_BR":
        //     case "es":
        //         res = "€";
        //         break;
        //     case "id":
        //         res = "Rp";
        //         break;
        //     case "ko":
        //         res = "₩";
        //         break;
        //     case "ru":
        //         res = "р.";
        //         break;
        //     case "th":
        //         res = "฿";
        //         break;
        //     case "vi":
        //         res = "₫";
        //         break;
        //     case "en":
        //         res = "$";
        //         break;
                
        //     default:
        //         res = "$";
        //         break;
        // }
        return res;
    },
    showNumber: function (game, group, totalValue, time, callback, scope, nosound, isWinBanner) {
        var soundCount = 0;
        var soundTrigger = 5;
        var totalTime = time / 60;
        var addValue = totalValue / totalTime;
        var sumValue = 0;
        if (!isWinBanner) { isWinBanner = false }
        var tmrValue = game.time.events.loop(50, function () {
            if (sumValue + addValue < totalValue) {
                soundCount++;
                if (soundCount == soundTrigger) {
                    soundCount = 0;
                    if (!nosound) {
                        soundClass.playSound("soundcoincounter");
                    }
                }

                sumValue += addValue;
                var currentValue = Math.floor(sumValue);
                this.drawNumber(game, group, currentValue, isWinBanner);
            } else {
                var currentValue = totalValue;
                if (tmrValue != null) {
                    game.time.events.remove(tmrValue);
                }
                this.drawNumber(game, group, currentValue, isWinBanner);
                if (callback) {
                    callback.apply(scope);
                }
            }
        }, this);
    },

    drawNumber: function (game, group, num, isWinBanner) {
        if (!isWinBanner) {
            isWinBanner = false;
        }
        if (group != null) {
            GlobalClass.deleteChildren(group);
        }
        // if (!GlobalClass.GAME_SHOW_COINS) {
        //     num = myNumeral(num * GlobalClass.trueCoinValue()).format('00.000');
        // }
        // var txt = num.toString();
        var txt = GlobalClass.getFormatCurrency(num, false, true);

        if(group==null){
            return;
        }
        var width = 0;
        for (var i = 0; i < txt.length; i++) {
            var name = txt[i]+"_grand.png";
            var sy = 0;
            if(txt[i]=="."){
                name = "dot_grand.png";
                sy = 10;
            } else if(txt[i]==","){
                name = "coma_grand.png";
                sy = 10;
            }
            var str = game.add.sprite(width, sy, 'jakpotWin', name,group);
            str.anchor.set(0, 0.5);
            width += str.width;
        }
        try {
            group.x = group.x-width/2;
        } catch (error) {
            console.log(error);
        }
    },
    checkString: function (sentence, sentenceX, sentenceY, middle, sizeSymbol, fontText, groupString,style,option) {
        var lengthWord = 0;
        var findWord = "";

        var indexNo = 1000000;
        var atlasSymbol = "";
        var changeSymbol = "";

        var str = "";
        var txt = null;
        var symbol = null;

        var widthX = sentenceX;
        var startX = sentenceX;
        var totalWidth = 0;

        var symX = 0;
        var symY = 0;
        var symScl = 0;
        if (sizeSymbol == "small") {
            symX = 6; // fill
            symY = 4; // fill
            symScl = 0.15; // fill
        } else if (sizeSymbol == "large") {
            symX = 20; // fill
            symY = 4; // fill
            symScl = 0.2; // fill
        } else {
            symX = 20;
            symY = 4;
            symScl = 1;
        }
        var textFill;
        var textFont;
        var textWeight;
        if (typeof fontText == "string") {
            textFill = "#010100"; // fill
            textFont = String(fontText); // fill
            textWeight = "normal"; // fill
        } else {
            textFill = fontText.fill; // fill
            textFont = fontText.font; // fill
            textWeight = "normal"; // fill
        }

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

            iTotal = this.countString(str, "#SPECIALFRAME")
            for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
                str = str.replace("#SPECIALFRAME", "");
            }

            iTotal = this.countString(str, "#LISTITEM")
            for (iCurrent = 0; iCurrent < iTotal; iCurrent++) {
                str = str.replace("#LISTITEM", "");
            }

            txt = AppFacadeInstance.game.add.text(0, 0, str, style, groupString);

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

            if (sentence.indexOf("#LISTITEM") >= 0 && sentence.indexOf("#LISTITEM") < indexNo) {
                indexNo = sentence.indexOf("#LISTITEM");
                lengthWord = "#LISTITEM".length;
                findWord = "#LISTITEM";
                atlasSymbol = "paytable";
                changeSymbol = "Bullet-active.png";
            }
      
            str = sentence.slice(0, sentence.indexOf(findWord));
            if(option){
                var point = GlobalClass.richText(str,widthX, sentenceY,style,startX, option.wordWrapWidth,option.lineHeight, groupString);
                widthX = point.x + 10;
                sentenceY = point.y;
            }
            else{
                txt = AppFacadeInstance.game.add.text(widthX, sentenceY, str, style, groupString);
                widthX += txt.width+10;
            }
           
           // 
      
            if (findWord != "") {
              symbol = AppFacadeInstance.game.add.sprite(0, 0, atlasSymbol, changeSymbol, groupString);
              if(atlasSymbol!='ui'){
                widthX += symX / 2;
                symbol.x = widthX;
                symbol.y = sentenceY + symY;
                symbol.anchor.set(0.5, 0.5);
                if(changeSymbol=="Bullet-active.png"){
                    symbol.scale.set(0.4);
                    symbol.y =  symbol.y+8;
                }
                else{
                    symbol.scale.set(symScl, symScl);
                }
                
              }
              else if(changeSymbol=="special-frame-mini.png"){
                // the text is drawn top-anchored, so centre the frame on it by half the font size
                var framePx = parseInt((style && style.fontSize) || 16, 10) || 16;
                widthX += symX / 2;
                symbol.x = widthX+2;
                symbol.y = sentenceY + Math.round(framePx * 0.55);
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
      
              widthX += symX / 2 + 10;
            }
      
            sentence = sentence.substring(sentence.indexOf(findWord) + lengthWord, sentence.length);
          }
          while (sentence.indexOf("#") > 0);

        if (sentence.length > 0) {
            if(option){
                var point = GlobalClass.richText(sentence,widthX, sentenceY,style,startX, option.wordWrapWidth,option.lineHeight, groupString);
                widthX = point.x + 10;
                sentenceY = point.y;
            }
            else{
                AppFacadeInstance.game.add.text(widthX, sentenceY, sentence, style, groupString);
            }
        }

        return sentenceY;
    },
    richText:function(text,x,y,style,startX,wordWrapWidth,lineHeight,group){
        var txt = AppFacadeInstance.game.add.text(x, y, text, style, group);
        var width = x+txt.width - startX;
        if(width<=wordWrapWidth){
            return {x:width,y:y};
        }
        txt.destroy();

        var startIndex = 1;
        if(GlobalClass.GAME_LANG=='zh' || GlobalClass.GAME_LANG=='ja'){
            var str = text.substring(0, startIndex);
        }
        else{
            var index = text.indexOf(" ",startIndex);
            var str = text.substring(0, index+1);
        }
       
        txt = AppFacadeInstance.game.add.text(x, y, str, style, group);
        width = x+txt.width-startX;
        var lastIndex = startIndex;
        while(width < wordWrapWidth){
            txt.destroy();
            lastIndex = startIndex;
            if(GlobalClass.GAME_LANG=='zh' || GlobalClass.GAME_LANG=='ja'){
                startIndex++;
                str = text.substring(0, startIndex);
            }
            else{
                
                startIndex = index+1;
                index = text.indexOf(" ",startIndex);
                if(index==-1){
                    str = text;
                }
                else{
                    str = text.substring(0, index+1);
                }
            }
            
            
            txt = AppFacadeInstance.game.add.text(x, y, str, style, group);
            width = x+txt.width;
        }

        txt.destroy();
        if(GlobalClass.GAME_LANG=='zh' || GlobalClass.GAME_LANG=='ja'){
            str = text.substring(0, lastIndex);
        }
        else{
            index = text.indexOf(" ",lastIndex);
            str = text.substring(0, index+1);
        }
        
        txt = AppFacadeInstance.game.add.text(x, y, str, style, group);

        x = startX+40;
        y = y+lineHeight;
        str = text.replace(str,"");

        return GlobalClass.richText(str,x,y,style,startX,wordWrapWidth,lineHeight,group); 
    },
    countString: function (string, char) {
        if (string.indexOf(char) >= 0) {
            var re = new RegExp(char, "gi");
            return string.match(re).length;
        } else {
            return 0;
        }
    },
    renderValue: function (content, values) {
        for (var i = 0; i < values.length; i++) {
            content = content.replace('{' + i + '}', values[i]);
        }

        return content;
    },
    getXMLByKey: function (game, key) {
        let language = "language_" + GlobalClass.GAME_LANG;
        let txt = "null";

        try {
            // txt = game.cache.getXML(language).querySelector(key).textContent;
            // txt = GlobalClass.GAME_PIXI.loader.resources[language].data.getElementsByTagName(key)[0].childNodes[0].nodeValue;
            txt = GlobalClass.GAME_PIXI.loader.resources[language].data.querySelector(key).textContent;
            // Do something with 'value' here (e.g., use it in your game)
        } catch (error) {
            // Handle the error gracefully
            console.warn("Error occurred while accessing the value:", key);
            // You can also provide a default value or perform alternative actions here
        }

        return txt;
    },
    indexOf: function (arr, item) {
        var index = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != item) {
                continue;
            }
            index = i;
            return index;
        }
        return index;
    },
    getRTP:function(){
        return GlobalClass.RTP;
        /*
        if(AppConstants.GAME_DEFINITION_ID=="default"){
            return "96.77";
        }

        if(AppConstants.GAME_DEFINITION_ID=="www_deluxe_94"){
            return "94.71";
        }

        if(AppConstants.GAME_DEFINITION_ID=="www_deluxe_95"){
            return "95.91";
        }

        return "96.77";
        */
    },
    
    scaleScene: function(renderer, sceneContainer) {
        if (this.TIMER_SCALE != null) {
            clearInterval(this.TIMER_SCALE);
            this.TIMER_SCALE = null;
        }
        window.scrollTo(0, 1); 

        let gameWidth;
        let gameHeight;

        if (window.matchMedia("(orientation: portrait)").matches && AppConstants.MOBILE_GAME)  {
            AppConstants.LANDSCAPE = false;
            this.STAGE_WIDTH = 720;
            this.STAGE_HEIGHT = 1280;
            gameWidth = 720;
            gameHeight = 1280;
        } else {
            AppConstants.LANDSCAPE = true;
            this.STAGE_WIDTH = 1280;
            this.STAGE_HEIGHT = 720;
            gameWidth = 1280;
            gameHeight = 720;
        }
        
        const gameOrientation = gameWidth > gameHeight ? 'landscape' : 'portrait';
        const gameLandscapeScreenRatio = gameWidth / gameHeight;
        const gamePortraitScreenRatio = gameHeight / gameWidth;
    
        const isScreenPortrait = window.innerHeight >= window.innerWidth;
        const isScreenLandscape = !isScreenPortrait;
        const screenRatio = window.innerWidth / window.innerHeight;
        
        let newWidth;
        let newHeight;

        let iOS = window.navigator.userAgent.match(/iPhone/i);
        let iOSBottomBar = 0;
        if (iOS) {
            iOSBottomBar = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
        }
        let iOSFixContainerY = 0;
        
        if ( (gameOrientation === 'landscape' && isScreenLandscape) || (gameOrientation === 'portrait' && isScreenPortrait) ) {
            if ( screenRatio < gameLandscapeScreenRatio ) {
                newWidth = gameWidth;
                newHeight = Math.round( gameWidth / screenRatio );
            } else {
                newWidth = Math.round( gameHeight * screenRatio );
                newHeight = gameHeight;
            }
        } else {
            if ( screenRatio < gamePortraitScreenRatio ) {
                // newWidth = gameHeight;
                // newHeight = Math.round( gameHeight / screenRatio );
                newWidth = gameWidth;
                newHeight = Math.round( gameWidth / screenRatio );
            } else {
                // newWidth = Math.round( gameWidth * screenRatio );
                // newHeight = gameWidth;
                newWidth = gameWidth;
                newHeight = Math.round( gameWidth / screenRatio );
            }
        }

        if (iOS && AppConstants.LANDSCAPE) {
            if (this.iPhoneSafari() && (getiPhoneModel() == "iPhone 6, 6s, 7 or 8" || getiPhoneModel() == "iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus")) {
                if (window.innerHeight != window.screen.availWidth) {
                    newWidth = 667 * 2.052307;
                    newHeight = 667 * 2.052307 / 1280 * 720 + 55;
                    
                    iOSFixContainerY = 55;
                }
            } else {
                if (iOSBottomBar > 0) {
                    newHeight = newHeight + (iOSBottomBar * window.devicePixelRatio);

                    iOSFixContainerY = iOSBottomBar;
                }
            }
        } else if (iOS && !AppConstants.LANDSCAPE) {
            if (this.iPhoneSafari() && (getiPhoneModel() == "iPhone 6, 6s, 7 or 8" || getiPhoneModel() == "iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus")) {
                if (window.innerHeight != window.screen.availHeight) {
                    newWidth = 720;
                    newHeight = 1280;
                }
            }
        }

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
            .test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test(navigator.userAgent.substr(0, 4))) {
                // if (window.innerHeight == screen.height || !window.screenTop && !window.screenY) {
                if(window.innerWidth == screen.width && window.innerHeight == screen.height) {
                    AppConstants.FULL_SCREEN = true;
                    
                } else {
                    AppConstants.FULL_SCREEN = false;
                }

                if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
                    // browser is almost certainly fullscreen
                }
                
                if (GlobalClass.GAME_ACTV_NAME == "gameplay") {
                    // GlobalClass.GAME_ACTV.toggleFullScreen();
                }
        } else {
            // var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        }

        renderer.resize( newWidth, newHeight );
        
        sceneContainer.x = (newWidth - gameWidth) / 2;
        sceneContainer.y = (newHeight - gameHeight) / 2;
    },

    iPhoneSafari: function() {
        var ua = window.navigator.userAgent;
        // var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var iOS = !!ua.match(/iPhone/i);
        var webkit = !!ua.match(/WebKit/i);
        var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

        return iOSSafari;
    },

    /*
    getFormatCurrency: function(value, removeDecimal, removeCurrency) {
        let val;
        let currency;
    
        if (removeCurrency) {
            currency = "";
        } else {
            currency = GlobalClass.CURRENCY + "";
        }
        if (removeDecimal) {
            val = currency + numeral(value).format('0,0');
        } else {
            switch (GlobalClass.GAME_DECIMALS) {
                case 0:
                    val = currency + numeral(value).format('0,0');
                    break;
                case 1:
                    val = currency + numeral(value).format('0,0.0');
                    break;
                case 2:
                    val = currency + numeral(value).format('0,0.00');
                    break;
                case 3:
                    val = currency + numeral(value).format('0,0.000');
                    break;
                case 4:
                    val = currency + numeral(value).format('0,0.0000');
                    break;
                case 5:
                    val = currency + numeral(value).format('0,0.00000');
                    break;
                case 6:
                    val = currency + numeral(value).format('0,0.000000');
                    break;
                case 7:
                    val = currency + numeral(value).format('0,0.0000000');
                    break;
                case 8:
                    val = currency + numeral(value).format('0,0.00000000');
                    break;
                case 9:
                    val = currency + numeral(value).format('0,0.0000000000');
                    break;
                default:
                    val = currency + numeral(value).format('0,0.00');
                    break;
            }
        }
    
        return val;
    }
    */
    getFormatCurrency(value, removeDecimal, removeCurrency) {
        let val;
        let currency = "";
        let decimals = GlobalClass.GAME_DECIMALS ?? 2;
        let curr = (GlobalClass.CURRENCY || "").toLowerCase();

        // Cek apakah currency Indonesia
        const isIndonesianCurrency = ["id", "idr", "rp", "rupiah"].includes(curr);

        // Tentukan simbol mata uang
        if (!removeCurrency && GlobalClass.CURRENCY !== "") {
            currency = isIndonesianCurrency ? "Rp " : GlobalClass.CURRENCY + " ";
        }

        // Tentukan format dasar angka
        let format = "0,0"; // default tanpa desimal
        if (!removeDecimal && decimals > 0) {
            format += "." + "0".repeat(decimals);
        }

        // Gunakan numeral.js untuk format awal
        val = numeral(value).format(format);

        // Jika Indonesia, ubah titik/koma
        if (isIndonesianCurrency) {
            val = val.replace(/,/g, "#").replace(/\./g, ",").replace(/#/g, ".");
        }

        // Gabungkan dengan simbol
        return currency + val;
    },
};

