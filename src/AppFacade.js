
puremvc.define(
    // CLASS INFO
    {
        name: 'AppFacade',
        parent: puremvc.Facade,

        constructor: function (multitonKey) {
            puremvc.Facade.call(this, multitonKey);
        }
    },
    // INSTANCE MEMBERS
    {
        initializeController: function () {
            puremvc.Facade.prototype.initializeController.call(this);
            this.registerCommand(AppFacade.STARTUP, Slots.StartupCommand);
        },
        initializeModel: function () {
            puremvc.Facade.prototype.initializeModel.call(this);
        },
        initializeView: function () {
            puremvc.Facade.prototype.initializeView.call(this);
        },

        startup: function (gameComponent) {
            this.game = gameComponent;
            this.sendNotification(AppFacade.STARTUP);
        }
    },
    // STATIC MEMBERS
    {
        getInstance: function(multitonKey) {
            var instanceMap = puremvc.Facade.instanceMap;
            var instance = instanceMap[multitonKey];
            if(instance) {
                return instance;
            }
            return instanceMap[multitonKey] = new AppFacade(multitonKey);
        },

        orientated: false,
        desktop:false,
        game: null,
        app:null,

        // RATIO: 1,
        // NEW_RATIO : 1,
        // NEW_WIDTH : 1920,
        // NEW_HEIGHT : 1080,
        // TARGET_WIDTH : 1920,
        // TARGET_HEIGHT : 1080,
        NAME: 'AppFacade',
        STARTUP: 'Startup'
    }
);
