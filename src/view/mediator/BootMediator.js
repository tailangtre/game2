puremvc.define(
    // CLASS INFO
    {
        name: 'Slots.BootMediator',
        parent: puremvc.Mediator,
        constructor: function(viewComponent) {
            this.viewComponent = viewComponent;
            puremvc.Mediator.call(this, this.constructor.NAME);
        }
    },

    // INSTANCE MEMBERS
    {
        /** @override */
        listNotificationInterests: function() {
            return [

            ];
        },

        /** @override */
        handleNotification: function(notification) {

        },

        /** @override */
        onRegister: function() {

        },

        /** @override */
        onRemove: function() {}
    },

    // STATIC MEMBERS
    {
        viewComponent: null,
        orientated: false,
        desktop: false,
        NAME: 'BootMediator',

    }
);
