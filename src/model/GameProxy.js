puremvc.define({
	name: 'Slots.GameProxy',
	parent: puremvc.Proxy,
	constructor: function() {
		puremvc.Proxy.call(this);
	}
},

// INSTANCE MEMBERS
{
	sysProxy: null,
	self:null,
	gameEngine:null,
	onRegister: function() {
		self = this;
		this.sysProxy = this.facade.retrieveProxy(Slots.SystemConfigProxy.NAME);
	},

	loginPlatform:function(){
		// if (AppConstants.PDX_OPERATOR_ID == "DEMO") {
		// 	this.initPDX();
		// } else {
			// axios.get(`https://${AppConstants.PDX_BASE_URL}:200/getSession`, {
			axios.get(`https://${AppConstants.PDX_BASE_URL}/api/v1/games/session`, {
				params: AppConstants.PDX_URL_PARAMETER
			})
			.then(response => {
				// console.log(response.data);
				// GlobalClass.convertSessionPDX(response.data);
				if (response.data.error != null) {
					AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, response);
				} else {
					if (response.data.operator_id == "DEMO" || response.data.operator_id == "demo") {
						GlobalClass.DEMO = true;
					}
					// AppConstants.PDX_GAME_DATA = response.data;
					AppConstants.PDX_GAME_DATA = response.data.result;
					this.initPDX();
				}
			})
			.catch(async error => {
				console.error(error);
				// AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, error);

				const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
					source: "SESSION",
					error: error,
					debug: true
				});

				if (pdxmInstruction.errorType == "N/A") {
					switch(pdxmInstruction.errorAction) {
						case "RESET":

							break;
						case "RECALL":
							this.loginPlatform();
							break;
						case "IGNORE":

							break;
					}
				} else {
					AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, [error, pdxmInstruction, () => {this.loginPlatform()}]);
				}
			});
		// }
		/*
		var req = new Object();
		req.action = "/api/v2/login/platform";
		req.method = HttpConnection.METHOD_POST;
		req.configId = GlobalClass.GAME_CONFIG_ID;
		req.sessionId = GlobalClass.SESSIONID;
		var data = {"userSession":{"userId":"1"}};
		//this.loginPlatformOk(data);
		this.sysProxy.send2server(req,this.loginPlatformOk);
		*/
	},

	initPDX: function() {
		let url = `https://${AppConstants.PDX_BASE_URL}/api/v1/games/initialize?`;
		for (const key in AppConstants.PDX_GAME_DATA) {
			if (AppConstants.PDX_GAME_DATA.hasOwnProperty(key)) {
				url += `${key}=${AppConstants.PDX_GAME_DATA[key]}&`;
			}
		}

		let dataInit;

		// axios.get(`https://${AppConstants.PDX_BASE_URL}/api/v1/games/initialize?user_id=${AppConstants.PDX_USER_ID}&operator_id=${AppConstants.PDX_OPERATOR_ID}&game_id=${AppConstants.PDX_GAME_ID}&session_id=${AppConstants.PDX_SESSION_ID}`)
		axios.get(url)
		.then(response => {
			// console.warn(response.data);
			dataInit = response.data;
			GlobalClass.convertInitPDX(response.data);

			if (AppConstants.PDX_ROUND_ID != "") {
				this.checkRound()
			} else {
				AppConstants.PDXM.initialize(response.data);
				// AppFacadeInstance.sendNotification(SlotsEvents.INIT_NETWORK_OK);
				AppFacadeInstance.sendNotification(SlotsEvents.INIT_SPIN_OK, response.data)
			}
		})
		.catch(async error => {
			console.error(error);
			// AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, error);

			const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
				source: "INITIALIZE",
				error: error,
				debug: true
			});

			if (pdxmInstruction.errorType == "N/A") {
				switch(pdxmInstruction.errorAction) {
					case "RESET":

						break;
					case "RECALL":
						this.initPDX();
						break;
					case "IGNORE":

						break;
				}
			} else {
				AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, [error, pdxmInstruction, () => {this.initPDX()}]);
			}
		});
	},

	checkRound: function() {
		axios.get(`https://${AppConstants.PDX_BASE_URL}/api/v1/games/history?rgs_round_id=${AppConstants.PDX_ROUND_ID}`)
		.then(response => {
			AppConstants.PDXM.initialize(response.data);
			GlobalClass.convertReplayPDX(response.data);
			// AppFacadeInstance.sendNotification(SlotsEvents.INIT_NETWORK_OK);
			AppFacadeInstance.sendNotification(SlotsEvents.INIT_SPIN_OK, response.data)
		})
		.catch(async error => {
			// console.error(error);
			// AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, error);

			const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
				source: "HISTORY",
				error: error,
				debug: true
			});

			if (pdxmInstruction.errorType == "N/A") {
				switch(pdxmInstruction.errorAction) {
					case "RESET":

						break;
					case "RECALL":
						this.checkRoundID();
						break;
					case "IGNORE":

						break;
				} 
			} else {
				AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, [error, pdxmInstruction, () => checkRound()]);
			}
		});
	},

	axiosPlayer: function() {
		let url = `https://${AppConstants.PDX_BASE_URL}/api/v1/games/player?`;
		for (const key in AppConstants.PDX_GAME_DATA) {
			if (AppConstants.PDX_GAME_DATA.hasOwnProperty(key)) {
				url += `${key}=${AppConstants.PDX_GAME_DATA[key]}&`;
			}
		}

		const playerData = {
			sound: GlobalClass.GAME_SOUND_BAR_X,
			quick: GlobalClass.CONFIG_QUICKSPIN,
			language: GlobalClass.GAME_LANG,
		};

		url += `player_data=${encodeURIComponent(JSON.stringify(playerData))}`;

		axios.get(url)
		.then(response => {
			// console.log('Response:', response.data);
		})
		.catch(async error => {
			// console.error('Error:', error);
			const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
				source: "PLAYER",
				error: error,
				debug: true
			});

			if (pdxmInstruction.errorType == "N/A") {
				switch(pdxmInstruction.errorAction) {
					case "RESET":
						
						break;
					case "RECALL":
						this.axiosPlayer();
						break;
					case "IGNORE":

						break;
				}
			} else {
				AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, [error, pdxmInstruction, () => {this.axiosPlayer()}]);
			}
		});
	},

	loginPlatformOk:function(data){
		console.log(data);
		var user = {};
		GlobalClass.ONETOUCH_PENDING_OFFERS = data.pendingOffers;
		user.objectId = data.userSession.userId;
		user.configId = data.userSession.configId;
		GlobalClass.GAME_USER = user;
		self.initSpin();
	},

	initSpin:function (params) {
		var req = new Object();
		req.action = "/api/v2/slots/www2120/get_state?configId="+GlobalClass.GAME_CONFIG_ID;
		req.method = HttpConnection.METHOD_GET;
		//var data = {"gameId":"S82tfAECEcmFQBvy","balance":5000,"balanceType":"WALLET","storageData":{},"state":"NO_GAME","nextSceneState":{"sceneId":"main","sceneWin":0},"config":{"id":"5ea9224415c38e0001044233","currency":"FUN","subPartnerId":"bitcasino","trackjstoken":"false","showRoundId":false,"disableFullscreen":false,"showRtp":false,"disableLobby":false,"disableDeposit":true,"disableProvider":false,"enablePostMessageAPI":false,"betLimit":{"min":0.01,"max":1000.0},"compliance":{"notificationInterval":[900,1800,2700]},"gameDefinitionId":"default","gameType":"WWW2120","betSizes":[20,40,60,80,100,200,300],"coinValues":[0.01,0.02,0.05,0.1,0.2,0.25,0.5,1],"betSizeIndex":1,"coinValueIndex":3,"paytable":{"main":{"TD":[0,0,10,50,125],"TE":[0,0,10,50,100],"A":[0,0,10,50,100],"Q":[0,0,5,20,50],"NINE":[0,2,5,20,50],"J":[0,0,5,20,50],"K":[0,0,5,20,50],"TEN":[0,0,5,20,50],"Scatter":[0,0,2,20,200],"TA":[0,5,20,100,250],"TB":[0,0,10,50,125],"TC":[0,0,10,50,125]}},"reels":{"main":[["Q","TEN","Scatter","Q","TEN","TA","Q","TEN","TA","Q","TEN","TA","Q","TEN","TE","A","J","TD","Q","TE","TEN","TB","NINE","TC","A","TD","Q","K","TE"],["TC","J","NINE","TB","J","K","TA","J","K","TE","Q","NINE","Scatter","J","NINE","TB","A","NINE","TC","A","K","TD","A","TEN","TB","A","J"],["A","TC","J","WL","TEN","TB","K","WL","K","TB","Q","WL","K","NINE","Scatter","TEN","K","TA","TE","K","TA","NINE","A","TA","Q","TB","TC","NINE","TA","TD","J"],["TB","NINE","WL","WL","WL","NINE","WL","WL","WL","TEN","WL","WL","K","WL","TEN","WL","K","J","Scatter","K","J","TA","TE","TEN","TD","K","TB","TC","Q","TD","A","TB","K","TD","TC","A"],["J","WL","WL","WL","J","WL","WL","WL","J","WL","WL","TEN","WL","WL","TEN","WL","NINE","WL","Q","NINE","Scatter","Q","NINE","TA","K","A","TB","K","A","TC","K","A","TC","TD","TEN","A","TE"]],"free":[["Q","TEN","Scatter","Q","TEN","TA","Q","TEN","TA","Q","TEN","TA","Q","Scatter","TEN","TE","A","Scatter","J","TD","Q","TE","TEN","TB","NINE","TC","A","TD","Q","Scatter","K","TE"],["TC","J","Scatter","NINE","TB","J","K","TA","J","K","TE","Q","NINE","Scatter","J","NINE","TB","A","Scatter","NINE","TC","A","K","TD","A","Scatter","TEN","TB","A","J"],["A","TC","J","WL","TEN","TB","K","WL","WL","K","WL","WL","TB","Q","WL","K","NINE","Scatter","TEN","K","TA","TE","K","TA","NINE","Scatter","A","TA","Q","TB","Scatter","TC","NINE","TA","TD","J","Scatter"],["WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL"],["WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL","WL"]]},"paylines":{"1":[[0,1],[1,1],[2,1],[3,1],[4,1]],"2":[[0,0],[1,0],[2,0],[3,0],[4,0]],"3":[[0,2],[1,2],[2,2],[3,2],[4,2]],"4":[[0,0],[1,1],[2,2],[3,1],[4,0]],"5":[[0,2],[1,1],[2,0],[3,1],[4,2]],"6":[[0,1],[1,0],[2,0],[3,0],[4,1]],"7":[[0,1],[1,2],[2,2],[3,2],[4,1]],"8":[[0,0],[1,0],[2,1],[3,2],[4,2]],"9":[[0,2],[1,2],[2,1],[3,0],[4,0]],"10":[[0,2],[1,1],[2,1],[3,1],[4,2]],"11":[[0,0],[1,1],[2,1],[3,1],[4,0]],"12":[[0,0],[1,1],[2,0],[3,1],[4,0]],"13":[[0,2],[1,1],[2,2],[3,1],[4,2]],"14":[[0,1],[1,0],[2,1],[3,0],[4,1]],"15":[[0,1],[1,2],[2,1],[3,2],[4,1]],"16":[[0,0],[1,2],[2,2],[3,2],[4,0]],"17":[[0,2],[1,0],[2,0],[3,0],[4,2]],"18":[[0,0],[1,2],[2,0],[3,2],[4,0]],"19":[[0,2],[1,2],[2,2],[3,1],[4,0]],"20":[[0,2],[1,1],[2,1],[3,1],[4,0]]},"sceneIds":["main","free"],"credits":{"main":20,"free":20},"jackpots":{"MINI":1000,"MINOR":2500,"MAJOR":25000,"GRAND":100000}},"featureStates":{},"protocolVersion":1};
		//this.initSpinOK(data);
		this.sysProxy.send2server(req,this.initSpinOK);
	},
	initSpinOK:function(data){
		console.log(data);
		self.refreshGame(data,true);
		AppFacadeInstance.sendNotification(SlotsEvents.INIT_SPIN_OK,data);
	},
	ping:function(){
		self.sysProxy.init();
	},
	doFreeSpins: function() {
		let req = new Object();
		req.action = "/api/v1/offers/accept?configId=" + GlobalClass.GAME_CONFIG_ID + "&offerId=" + GlobalClass.ONETOUCH_PENDING_OFFERS[0].id;
		req.method = HttpConnection.METHOD_GET;

		this.sysProxy.send2server(req,function(data){
			AppFacadeInstance.sendNotification(SlotsEvents.FREE_SPINS_OK, data);
		})
	},
	doSpin: function() {
		if (GlobalClass.GAME_JUDGEMENT.result.game_result != null) {
			if (GlobalClass.GAME_JUDGEMENT.result.game_result.gameResult.length > 1) {
				if (AppConstants.PDX_ROUND_ID != "") {
					GlobalClass.GAME_JUDGEMENT.result.game_result.gameResult.shift();
					GlobalClass.convertSpinPDX(GlobalClass.GAME_JUDGEMENT);
				} else {
					GlobalClass.GAME_JUDGEMENT.result.game_result.gameResult.shift();
					GlobalClass.convertSpinPDX(GlobalClass.GAME_JUDGEMENT);
				}
				AppFacadeInstance.sendNotification(SlotsEvents.SPIN_DATA_OK,  GlobalClass.GAME_JUDGEMENT);
			} else {
				this.doSpinPDX();
			}
		} else {
			this.doSpinPDX();
		}
		
		/*
		var req = new Object();
		req.action = "/api/v2/slots/www2120/play";
		if (GlobalClass.ONETOUCH_FREESPINS) { 
			req.coinValue = GlobalClass.ONETOUCH_FREESPINS_COINVALUE;
			req.betSize = GlobalClass.ONETOUCH_FREESPINS_BETCOIN;
			// req.configId = GlobalClass.ONETOUCH_CONFIG_ID;
			req.offerId = GlobalClass.ONETOUCH_OFFER_ID;
			req.type = "SPIN"
		} else {
			req.coinValue = GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
			req.betSize = GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS];
			req.type = "SPIN";
		}
		
		
		//  var d = '{"gameId":"jI8QXAsRD4rrHEHt","balance":4980,"balanceType":"WALLET","state":"RESOLVED","totalWin":0,"currentScene":"main","totalBet":4,"rewards":[],"events":[],"reelsView":{"reels":[["Q","Scatter","J","TD","TC"],["TEN","J","A","TC","K"],["TA","NINE","TC","A","A"]],"reelStops":[6,12,30,33,29],"reelId":"main"},"nextSceneState":{"sceneId":"main","sceneWin":0},"roundWin":0,"coinValue":0.1,"betSize":40,"featureStates":{},"protocolVersion":1}';
		//  var d = '{"gameId": "xiZMVTwY41ucMj33","balance": 5015.3,"balanceType": "WALLET","state": "RESOLVED","totalWin": 6,"currentScene": "main","totalBet": 24,"baseBet": 24,"rewards": [{"id": "lineWin","win": 6,"positions": [[0,2],[1,2],[2,1]],"payId": "J","lineId": 9}],"events": [{"id": "specialFrame",	"position": [4,0]}],"reelsView": {"reels": [["TE","K","J","K","WL"],["A","TA","WL","TD","J"],["J","J","TEN","TC","WL"]],"reelStops": [15,6,3,33,8],"reelId": "main"},"nextSceneState": {"sceneId": "main","sceneWin": 6},"roundWin": 6,"previousEventRoundWin": 0,"coinValue": 0.15,"betSize": 160,"featureStates": {},"additionalInfo": {"sceneSummary": {"scenes": {"main": {"winsPerSpin": [],"reelStopsPerSpin": [[14,5,2,32,7]]}},"totalFreeSpinsPlayed": 0}},"protocolVersion": 1}'
		// data = JSON.parse(d);

		//   self.refreshGame(data,false);
		//   AppFacadeInstance.sendNotification(SlotsEvents.SPIN_DATA_OK,data);

		this.sysProxy.send2server(req,function(data){
			console.log(data);
			data = self.refreshGame(data,false);
			AppFacadeInstance.sendNotification(SlotsEvents.SPIN_DATA_OK,data);
		});
		*/
	},
	doSpinPDX:function(LNWFreeSpins) {
		if (AppConstants.PDX_ROUND_ID != "") {
			GlobalClass.convertSpinPDX(GlobalClass.GAME_JUDGEMENT);
			AppFacadeInstance.sendNotification(SlotsEvents.SPIN_DATA_OK, GlobalClass.GAME_JUDGEMENT);
		} else {
			// const result = bigDecimal.multiply(String(GlobalClass.getCoinValueCurrency()), String(GlobalClass.getBetPerLineCurrency()));
			// let url = `https://${AppConstants.PDX_BASE_URL}/api/v1/games/spin?denom=${GlobalClass.GAME_BET_AMOUNT_COIN[GlobalClass.GAME_BET_AMOUNT_POS]}&wager=${result}&`;
			let url = `https://${AppConstants.PDX_BASE_URL}/api/v1/games/spin?denom=${GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS]}&wager=${GlobalClass.GAME_BET[GlobalClass.GAME_BET_POS]}&`;
			// url = `https://dev.pdxslots.us/api/v1/games/spin?denom=1&wager=50001&session_id=12345&user_id=PDXTEST&operator_id=PDX&game_id=wildwildwestdeluxe2120`;
			for (const key in AppConstants.PDX_GAME_DATA) {
				if (AppConstants.PDX_GAME_DATA.hasOwnProperty(key)) {
					url += `${key}=${AppConstants.PDX_GAME_DATA[key]}&`;
				}
			}

			if (LNWFreeSpins) {
				url += `free_spin=${LNWFreeSpins}&`;
			}

			// axios.get(`https://${AppConstants.PDX_BASE_URL}/api/v1/games/spin?user_id=${AppConstants.PDX_USER_ID}&operator_id=${AppConstants.PDX_OPERATOR_ID}&game_id=${AppConstants.PDX_GAME_ID}&session_id=${AppConstants.PDX_SESSION_ID}&denom=1&wager=30`)
			axios.get(url)
			.then(response => {
				// console.log(response.data);

				AppConstants.PDXM_SPIN = false;
				GlobalClass.startTimeout();
				GlobalClass.convertSpinPDX(response.data);
				AppConstants.PDXM.spinComplete(response.data);
				AppFacadeInstance.sendNotification(SlotsEvents.SPIN_DATA_OK, response.data);
			})
			.catch(async error => {
				console.error(error);
				// AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, error);
				const pdxmInstruction = await sendPDXMError(AppConstants.PDXM, {
					source: "SPIN",
					error: error,
					debug: true
				});

				if (pdxmInstruction.errorType == "N/A") {
					switch(pdxmInstruction.errorAction) {
						case "RESET":
							AppFacadeInstance.sendNotification(SlotsEvents.NO_COIN, error);
							break;
						case "RECALL":
							this.doSpinPDX(LNWFreeSpins);
							break;
						case "IGNORE":

							break;
					}
				} else {
					AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN, [error, pdxmInstruction, () => {this.doSpinPDX(LNWFreeSpins)}]);
				}
			});
		}
	},
	loadHistory:function(){
		var req = new Object();
		req.action = "/api/v2/slots/www2120/history";
		req.method = HttpConnection.METHOD_GET;
		this.sysProxy.send2server(req,this.loadHistoryOK);
	},
	loadHistoryOK:function(data){
		console.log(data);
		AppFacadeInstance.sendNotification(SlotsEvents.LOAD_HISTORY_OK,data);
	},
	loadCard: function(type) {
		var req = new Object();
		req.action = "game.spinGameable";
		req.game = GlobalClass.GAME_NAME;
		req.type = type;
		this.sysProxy.send2server(req,function(data){
			GlobalClass.GAME_BALANCE = data.user.balance;
			if(data.game.gameableFeature){
				GlobalClass.GAMEABLE_FEATURE = data.game.gameableFeature;
			}
			else{
				GlobalClass.GAMEABLE_FEATURE = null;
			}
			AppFacadeInstance.sendNotification(SlotsEvents.LOAD_CARD_DATA_OK);
		});
	},
	refreshGame:function(data,init){
		GlobalClass.GAME_JUDGEMENT = data;

		//data.balance = 2.22;
		GlobalClass.GAME_BALANCE = data.balance;
		// data.game.normal2Feature = true;
		// data.game.feature = true;
		// data.game.totalWin = 0;
		//GlobalClass.GAME_DATA = data.game;
		var game = {};
		game.freeGamesTotalWin = 0;
		GlobalClass.GAME_DATA = game;
		GlobalClass.GAME_RESP_DATA = data;
		GlobalClass.GAME_USER.currency = data.balanceType;
		GlobalClass.GAME_USER.balance = data.balance;
		game.normal2Feature = false;
		// game.normal2Feature
		game.freeGamesWon = 0;
		game.specialFrame = [false,false,false];

		game.freeGamesTotalWin = GlobalClass.coinValue(data.nextSceneState.sceneWin);

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
		GlobalClass.SPECIAL_FRAMES = game.specialFrame;

		game.freeGamesTotal = data.nextSceneState.totalSpins
		game.freeGamesLeft = data.nextSceneState.spins;

		GlobalClass.GAME_FEATURE = data.nextSceneState.sceneId =='free';
		//game.jackpotState = this.loadInitJackpot(data);

		GlobalClass.GAME_ACTIVE = data.state != 'RESOLVED';

		if(init){
			GlobalClass.GAME_LINE = 20;//data.config.paylines.length;
			GlobalClass.CURRENCY = data.config.currency;
			AppConstants.conf = data.config;

			if(data.hasOwnProperty("storageData")){
				AppConstants.storageData = data.storageData;
			}

			if(data.config.hasOwnProperty("disableLobby") /*&& !data.config.disableLobby*/){
				AppConstants.disableLobby = data.config.disableLobby;
                // AppConstants.GAME_LOBBY_URL = data.config.lobbyUrl;
			}

			if(data.config.hasOwnProperty("disableLangMenu") /*&& !data.config.disableLangMenu*/){
				AppConstants.disableLangMenu = data.config.disableLangMenu;
			}
			
			if(data.config.hasOwnProperty("compliance")){
				if (data.config.compliance.hasOwnProperty("responsibleGambling")){
					AppConstants.RESPONSIBLE_GAMBLING = data.config.compliance.responsibleGambling;
				}

				if(data.config.compliance.hasOwnProperty("clock")){
					AppConstants.SHOW_CLOCK = data.config.compliance.clock;
				}
	
				if(data.config.compliance.hasOwnProperty("poorInternetConnection")){
					AppConstants.SHOW_CONNECTION = data.config.compliance.poorInternetConnection;
				}
	
				if(data.config.compliance.hasOwnProperty("roundDuration")){
					AppConstants.ROUND_DURATION = data.config.compliance.roundDuration;
				}
				
				if(data.config.compliance.hasOwnProperty("autoplay")){
					AppConstants.AUTOPLAY = data.config.compliance.autoplay;
				}
	
				if(data.config.compliance.hasOwnProperty("turbo")){
					AppConstants.TURBO = data.config.compliance.turbo;
				}
				
				if(data.config.compliance.hasOwnProperty("turboModeDefaultOn")) {
					GlobalClass.CONFIG_QUICKSPIN = data.config.compliance.turboModeDefaultOn;
				}

				if(data.config.compliance.hasOwnProperty("continuousKeyboard")){
					AppConstants.CONTINUOUS_KEYBOARD = data.config.compliance.continuousKeyboard;
				}
			}
			
			if(data.config.hasOwnProperty("clientExternalModules")){
				if(data.config.clientExternalModules.length>0){
					if(data.config.clientExternalModules[0]=="relaxfeim"){
						AppConstants.ACTIVE_RELAXFEIM = true;
					}
					else if(data.config.clientExternalModules[0]=="otfeim"){
						AppConstants.ACTIVE_OTFETM = true;
					}
					
				}
			}

			//gameType = data.config.gameType;
			//gatewayScript = data.config.gatewayScript;

			if(data.config.hasOwnProperty("gameDefinitionId")){
				AppConstants.GAME_DEFINITION_ID = data.config.gameDefinitionId;
			}

			if(data.config.hasOwnProperty("showRtp")){
				AppConstants.showRtp = data.config.showRtp;
			}

			




			// if(AppConstants.ACTIVE_RELAXFEIM){
			// 	window.game.notify.event.emit("initFEIM");
			// }
			

	
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
			GlobalClass.GAME_CHEAT_ARR = [];
			GlobalClass.JACKPOT = this.loadInitJackpot(data);
			game.jackpotState = GlobalClass.JACKPOT;

			GlobalClass.loadSettings();

			GlobalClass.TOTAL_COLUMN = 5;
			GlobalClass.TOTAL_ROW = 3;
			
			GlobalClass.REEL_NORMAL = data.config.reels.main;
			GlobalClass.REEL_SPECIAL = data.config.reels.free;
			GlobalClass.GAME_PAYTABLE = data.config.paytable.main;

			if(GlobalClass.GAME_FEATURE){
				GlobalClass.GAME_REEL = GlobalClass.REEL_SPECIAL;
			}
			else{
				GlobalClass.GAME_REEL = GlobalClass.REEL_NORMAL;
			}
			//GlobalClass.SYMBOL_DATA = data.game.symbols;
			var linePaths = [];
			for(let i in data.config.paylines){
				var payLine = data.config.paylines[i];
				var path = [];
				for(var j = 0;j<payLine.length;j++){
					path.push(payLine[j][1]);
				}
				linePaths.push(path);
			}
			GlobalClass.WIN_LINE = linePaths;

			GlobalClass.GAME_BETLIMIT_MIN = data.config.betLimit.min;
			GlobalClass.GAME_BETLIMIT_MAX = data.config.betLimit.max;

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
		}
		else{
			 //GlobalClass.GAME_FEATURE = true;
			 //game.normal2Feature = true;
			GlobalClass.JACKPOT.wonJackpots = [];
			GlobalClass.JACKPOT.winAmount = 0;
			GlobalClass.JACKPOT.winAmountInDollar = 0;
			game.jackpotState = GlobalClass.JACKPOT;
			var stopCode = data.reelsView.reelStops;
			for(var i=0;i<stopCode.length;i++){
				var code = stopCode[i]+1;
				stopCode[i] = code%GlobalClass.GAME_REEL[i].length;
			}
			GlobalClass.GAME_STOPCODE = stopCode;//[2,12,1,2,3];//
			//data.totalWin = 5000;
			GlobalClass.GAME_TOTAL_WIN = GlobalClass.coinValue(data.totalWin);
			GlobalClass.GAME_DATA.totalWin = GlobalClass.coinValue(data.totalWin);
			GlobalClass.GAME_DATA.roundWinCredits = data.roundWin || 0;
			var lineWin = {};
			var lineWins = [];
			lineWin.lineWins = lineWins;

			var rd = {};
			rd.id = 'jackpot';
			rd.payId = 'MINOR';
			rd.win = 5000;
			var positions = [];
			rd.positions = positions;
			for(var i =0;i<5;i++){
				var pos = {};
				pos.row = 0;
				pos.col = i;
				positions.push(pos);
			}
			//data.rewards = [];
			//data.rewards.push(rd);

			if(data.rewards && data.rewards.length>0){
				for(var i=0;i<data.rewards.length;i++){
					var reward = data.rewards[i];
					if(reward.id=="lineWin"){
						var line = {};
						lineWins.push(line);
						line.lineNo = reward.lineId - 1;
						line.winAmount = GlobalClass.coinValue(reward.win);
						line.numOfSymbols = reward.positions.length;
						line.winningSymbol = reward.payId;
					}
					else if(reward.id=="win" && reward.payId == 'Scatter'){
						game.scWin = {};
						game.scWin.scatterPos = [];
						game.scWin.winAmount = GlobalClass.coinValue(reward.win);
						game.scWin.numOfScatter = reward.positions.length;
						for(var j=0;j<reward.positions.length;j++){
							var pos = {};
							pos.row = reward.positions[j][1];
							pos.col = reward.positions[j][0];
							pos.symId = 'Scatter';
							game.scWin.scatterPos.push(pos);
						}

					}
					else if(reward.id == 'jackpot'){
						var jackpot = {};
						jackpot.winAmount = GlobalClass.coinValue(reward.win);
						jackpot.numberOfSymbbols = reward.positions.length;
						jackpot.name = reward.payId;
						jackpot.contribution = 0;
						jackpot.winningSymbol = reward.positions.length;
						jackpot.lineNo = 0;
						jackpot.positions = reward.positions;
						jackpot.initialPrize = jackpot.winAmount;
						jackpot.winAmountInDollar = reward.win;
						game.jackpotState.wonJackpots.push(jackpot);
						game.jackpotState.winAmount += jackpot.winAmount;
						game.jackpotState.winAmountInDollar += jackpot.winAmountInDollar;
					}
				}
			}
			GlobalClass.GAME_DATA.lineWin = lineWin;
        }
		game.freeGamesTotalWin = GlobalClass.coinValue(data.roundWin);
		
		// game.normal2Feature = true;
		// game.freeGamesWon = 10;

		// game.freeGamesTotal = 10;//data.nextSceneState.totalSpins
		// game.freeGamesLeft = 8;//data.nextSceneState.spins;

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
				jackpot.winAmount = data.config.jackpots.GRAND;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==1){
				jackpot.name = 'MAJOR';
				jackpot.winAmount = data.config.jackpots.MAJOR;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==2){
				jackpot.name = 'MINOR';
				jackpot.winAmount = data.config.jackpots.MINOR;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			else if(i==3){
				jackpot.name = 'MINI';
				jackpot.winAmount = data.config.jackpots.MINI;
				jackpot.initialPrize = jackpot.winAmount;
				jackpot.winAmountInDollar = jackpot.winAmount*GlobalClass.trueCoinValue();
			}
			jackpotState.jackpotPool.push(jackpot);
		}

		return jackpotState;

	},
	loadGame: function(game) {

	},

	loadGameOk: function(content) {

	},

	preloadAsset: function() {

	}
},

// CLASS MEMBERS
{
	NAME: 'GameProxy'
}
);
