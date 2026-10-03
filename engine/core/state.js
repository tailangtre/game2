function GameState(game){
    this.game = game
    PIXI.Container.call(this);

}

GameState.prototype = Object.create(PIXI.Container.prototype);
GameState.prototype.constructor = GameState;





GameState.prototype.currentScene = null;
GameState.prototype.states ={};
GameState.prototype.add = function(stateName,stateObj){
    GameState.prototype.states[stateName] = stateObj;
};
GameState.prototype.start=function(stateName){
    if(this.currentScene){
        this.removeChild(this.currentScene);
    }
    var scene = this.states[stateName];
    scene.game = this.game;
    scene.load = this.game.load;
    scene.scale = this.game.scale;
    scene.state = this;
    this.currentScene = new SceneContainer(scene);
    this.currentScene.stateName = stateName;
    this.game.add = this.currentScene;
    this.addChild(this.currentScene);

    this.currentScene.scene.preload();

    this.game.load.onLoadComplete.add(this.loadComplete, this);
};
GameState.prototype.loadComplete=function(){
    this.game.load.reset(true, true);
    this.game.restLoad();
    this.currentScene.scene.create();
};

function SceneContainer(scene){
    this.scene = scene;
    this.scene.container = this;
    PIXI.Container.call(this);
};



SceneContainer.prototype = Object.create(PIXI.Container.prototype);
SceneContainer.prototype.constructor = SceneContainer;

SceneContainer.prototype.sprite=function(x,y,key,frame,group){
    var spr = new Sprite(x,y,key,frame, this.scene.game);
    if(group){
        group.addChild(spr);
    }
    
    return spr;
};

SceneContainer.prototype.button=function(x, y, key, clickFunction, _this, textureButton, textureButtonDown, textureButtonOver,btnKey,group){
    
    var btn = new Button(x, y, key, clickFunction, _this,textureButton, textureButtonDown, textureButtonOver,this.scene.game,btnKey);
    if(group){
        group.addChild(btn);
    }
    
    return btn;
};
SceneContainer.prototype.spine=function(x,y,spineKey,group){
    var spineData = this.scene.game.spineRes[spineKey].spineData;
    const spine = new PIXI.spine.Spine(spineData);	
    spine.x = x;
    spine.y = y;
    if(group){
        group.addChild(spine);
    }
    return spine;
};
SceneContainer.prototype.text=function(x, y,text,style,group){
    if(style.font){
        var sts = style.font.split(" ");
        if(sts.length==2){
            for(var i=0;i<sts.length;i++){
                if(i==0){
                    style.fontSize = sts[i];
                }
                else if(i==1){
                    style.fontFamily = sts[i];
                }
            }
        }else if(sts.length==3){
            for(var i=0;i<sts.length;i++){
                if(i==0){
                    style.fontWeight = sts[i];
                }
                else if(i==1){
                    style.fontSize = sts[i];
                }
                else if(i==2){
                    style.fontFamily = sts[i];
                }
            }
        }
        
    }
    var txt = new PIXI.Text(text,style);
	txt.x = x;
	txt.y = y;
    if(group){
        group.addChild(txt);
    }
    
    return txt;
};


SceneContainer.prototype.group=function(){
    var group = new PIXI.Container();
    this.addChild(group);
    return group;
};

SceneContainer.prototype.graphics=function(){
    var graphics = new PIXI.Graphics();
   // this.addChild(graphics);
    return graphics;
};
