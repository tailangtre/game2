/**
 * @author Mike Britton, Cliff Hall
 *
 * @class PrepControllerCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define({
        name: 'Slots.PrepControllerCommand',
        parent: puremvc.SimpleCommand
    },

    // INSTANCE MEMBERS
    {
        /**
         * Register Commands with the Controller
         * @override
         */
        execute: function (note) {
            this.facade.registerCommand(SlotsEvents.LOAD_SPIN_DATA, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.LOAD_SPIN_DATA_SECOND, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.SAVE_DATA, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.LOAD_HISTORY_DATA, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.INIT_SPIN_REELS, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.FREE_SPINS, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.PING, Slots.GameCommand);
            this.facade.registerCommand(SlotsEvents.LOAD_CARD_DATA, Slots.GameCommand);
        }
    }
);
