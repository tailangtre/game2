/**
 * Created by zhanwen on 2016/3/12.
 */
puremvc.define ({
        name: 'Slots.PrepViewCommand',
        parent: puremvc.SimpleCommand
    },

    // INSTANCE MEMBERS
    {
        /**
         * Register Mediators with the View
         * @override
         */
        execute: function (note) {
            this.facade.registerMediator(new Slots.InitMediator());

        }
    }
);
