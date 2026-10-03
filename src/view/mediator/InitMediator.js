puremvc.define(
    // CLASS INFO
    {
        name: 'Slots.InitMediator',
        parent: puremvc.Mediator,
        constructor: function (viewComponent) {
            this.viewComponent = viewComponent;
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },

    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function () {
            return [
                SlotsEvents.INIT_SPIN_OK
            ];
        },

        /** @override */
        handleNotification: function (notification) {
            switch (notification.getName()) {
                case SlotsEvents.INIT_SPIN_OK:
                    preloaderState.initMessage();
                    //gameplayState._gameEngine = notification.getBody();
                    //this.facade.game.state.start('Gameplay');
                    break;
            }
        },

        /** @override */
        onRegister: function () {
             // Handle creation and registration of any Mediators that can be initialized at startup.
             let _this = this;

            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1;
            
            if (isAndroid) {
                this.facade.app = new PIXI.Application({
                    width: 1280,
                    height: 720,
                    forceCanvas: false
                });
            } else {
                this.facade.app = new PIXI.Application({
                    width: 1280,
                    height: 720,
                    forceCanvas: false,
    
                    // resolution: window.devicePixelRatio,
                    // rootRenderTarget: {
                    //     resolution: window.devicePixelRatio
                    // }
    
                    // neutrino: {
                    //     texturesBasePath: 'textures/' // Prefix for textures
                    // }
                });
            }
            
            document.getElementById("app").appendChild(this.facade.app.view);
            GlobalClass.GAME_PIXI = this.facade.app;

            window.game = new Game();
            game.canvas = this.facade.app.view;

            this.facade.game = game;
            this.facade.game.app = this.facade.app;

            let state = new GameState(game);
            this.facade.game.state = state;
            this.facade.app.stage.addChild(state);

            this.facade.app.ticker.add(function(time) {
				let rafTime=Math.floor(time);
                game.update(rafTime);
			});
            
            this.facade.game.state.add('Boot', bootState);
            this.facade.game.state.add('Preloader', preloaderState);
            this.facade.game.state.add('Intro', introState);
            this.facade.game.state.add('Gameplay', gameplayState);


            function changeCanvas() {
                if (GlobalClass.GAME_ACTV != null) {
                    GlobalClass.scaleScene(GlobalClass.GAME_PIXI.renderer, GlobalClass.GAME_ACTV._pixiContainer);
                    GlobalClass.GAME_ACTV.checkResolution();
                }
			};
            
            window.onresize = function() {
				// changeCanvas();
                if (GlobalClass.TIMER_SCALE != null) {
                    clearInterval(GlobalClass.TIMER_SCALE);
                    GlobalClass.TIMER_SCALE = null;
                }
                GlobalClass.TIMER_SCALE = setInterval(changeCanvas, 100);
            };

            changeCanvas();


            
            window.addEventListener('visibilitychange', function() {
                if (document["hidden"]){
                    PIXI.sound.pauseAll();
                } else {
                    PIXI.sound.resumeAll();
                }
            });



            this.facade.registerMediator(new Slots.GameplayMediator(gameplayState));
            this.facade.game.state.start('Boot');

            this.initializeComponent();
        },
        initializeComponent: function () { },

        initMessage:function(){
            game.notify = {};
            game.notify.event =  new PIXI.Container();

            // let messageSolid = new MessageSolid();
            // messageSolid.init();

            // game.messageSolid = messageSolid;
        },

        /** @override */
        onRemove: function () { }
    },

    // STATIC MEMBERS
    {
        viewComponent: null,
        NAME: 'InitMediator',
    }
);
