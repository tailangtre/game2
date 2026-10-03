puremvc.define(
	// CLASS INFO
	{
		name: 'Slots.GameplayMediator',
		parent: puremvc.Mediator,
		constructor: function(viewObject) {
			this.viewObject = viewObject;
			// console.log('gameplay mediator');
			puremvc.Mediator.call(this, this.constructor.NAME);
		}
	},
	// INSTANCE MEMBERS
	{
		/** @override */
		listNotificationInterests: function() {
			return [
				SlotsEvents.SPIN_DATA_OK,
				SlotsEvents.FREE_SPINS_OK,
				SlotsEvents.NO_COIN,
				SlotsEvents.SHOW_NETWORK_WIN,
                SlotsEvents.SHOW_NETWORK_STATE,
				SlotsEvents.LOAD_HISTORY_OK
			];
		},

		/** @override */
		handleNotification: function(notification) {
			switch (notification.getName()) {
				
				case SlotsEvents.SPIN_DATA_OK:
					this.viewObject.finishSpinData();
					break;
				case SlotsEvents.NO_COIN:
					this.viewObject.noCoin();
					break;
				case SlotsEvents.FREE_SPINS_OK:
					this.viewObject.acceptFreeSpins(notification.getBody());
					break;
				case SlotsEvents.SHOW_NETWORK_WIN:
					this.viewObject.showNetworkWin(notification.getBody());
					break;
                case SlotsEvents.SHOW_NETWORK_STATE:
					this.viewObject.showNetworkState(notification.getBody());
					break;
				case SlotsEvents.LOAD_HISTORY_OK:
					this.viewObject.showHistory(notification.getBody());
					break;
				default:
					console.log('unknown notification');
					break;
			}
		},

		/** @override */
		onRegister: function() {
			// Handle creation and registration of any Mediators that can be initialized
			// at startup.

			this.initializeComponent();
		},

		initializeComponent: function() {

		},

		/** @override */
		onRemove: function() {

		}
	},
	// STATIC MEMBERS
	{
		viewObject: null,
		NAME: 'GameplayMediator'
	}
);
