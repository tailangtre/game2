
/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define ({
        name: 'Slots.GameCommand',
        parent: puremvc.SimpleCommand
    },

    // INSTANCE MEMBERS
    {
        /**
         * Perform business logic (in this case, based on Notification name)
         * @override
         */
        execute: function (note) {
            var proxy = this.facade.retrieveProxy(Slots.GameProxy.NAME);
            switch(note.getName()) {
                case SlotsEvents.LOAD_SPIN_DATA:
                    proxy.doSpin();
                    break;
                case SlotsEvents.SAVE_DATA:
                    proxy.axiosPlayer();
                    break;
                case SlotsEvents.LOAD_HISTORY_DATA:
                    proxy.loadHistory();
                    break;
                case SlotsEvents.LOAD_SPIN_DATA_SECOND:
                    proxy.doSpinSecond();
                    break;
                case SlotsEvents.LOAD_CARD_DATA:
                    proxy.loadCard(note.getBody());
                    break;
                case SlotsEvents.INIT_SPIN_REELS:
                    proxy.loginPlatform();
                    break;
                case SlotsEvents.FREE_SPINS:
                    proxy.doFreeSpins();
                    break;
                case SlotsEvents.PING:
                    proxy.ping();
                    break;
                default:
                    console.log('TodoCommand received an unsupported Notification' + note.getName());
                    console.log(note.getBody());
                    console.log("END BODY");
                break;
            }
        }
    }
);
