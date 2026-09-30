/**
 * Created by admin on 2016/3/14.
 */
puremvc.define
(
    // CLASS INFO
    {
        name: 'Slots.PrepModelCommand',
        parent:puremvc.SimpleCommand
    },
    // INSTANCE MEMBERS
    {
        /** @override */
        execute: function (notification)
        {
        	this.facade.registerProxy(new Slots.SystemConfigProxy());
            this.facade.registerProxy(new Slots.PlayerProxy());
            this.facade.registerProxy(new Slots.GameProxy());
        }
    },
    // STATIC MEMBERS
    {
        NAME: 'PrepModelCommand'
    }
);
