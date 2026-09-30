/**
 * @author Mike Britton
 * 
 * @class StartupCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define({
        name: 'Slots.StartupCommand',
        parent: puremvc.MacroCommand
    },

    // INSTANCE MEMBERS 
    {
        /** 
         * Add the sub-commands for this MacroCommand
         * @override
         */
        initializeMacroCommand: function () {
            this.addSubCommand(Slots.PrepControllerCommand);
            this.addSubCommand(Slots.PrepModelCommand);
            this.addSubCommand(Slots.PrepViewCommand );
        }
    }    
);
