var scale = function(game){
    this.game = game;
    this.isLandscape = true;
    this.orientationChangeFun = null;
    this.orientationChangeScope = null;
    this.addOrientationChange=function(orientationChangeFun,orientationChangeScope){
        this.orientationChangeFun = orientationChangeFun;
        this.orientationChangeScope = orientationChangeScope;
    };
    this.removeOrientationChange=function(){
        this.orientationChangeFun = null;
        this.orientationChangeScope = null;
    };
    this.orientationChange=function(){
        if (this.game.device.desktop) {
            return;
        }
        var orientation = window.orientation;
        this.isLandscape = false;
        if(orientation==90 || orientation==-90){
            this.isLandscape = true;
        }

        if(this.isLandscape){
            this.game.canvas.width = GlobalClass.STAGE_WIDTH;
            this.game.canvas.height = GlobalClass.STAGE_HEIGHT;
            //this.game.world.centerX = this.game.canvas.width/2;
            //this.game.world.centerY = this.game.canvas.height/2;

        }
        else{
            this.game.canvas.width = GlobalClass.STAGE_HEIGHT;
            this.game.canvas.height = GlobalClass.STAGE_WIDTH;
            //this.game.world.centerX = this.game.canvas.width/2;
            //this.game.world.centerY = this.game.canvas.height/2;

        }
        if(this.orientationChangeFun){
            this.orientationChangeFun.call(this.orientationChangeScope);
        }
    }
}