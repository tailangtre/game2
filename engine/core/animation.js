function Animation(animatedSprite) {
    this.animations = {};
    this.animatedSprite = animatedSprite;
    this.game = animatedSprite.game;
}

Animation.prototype = Object.create(PIXI.Container.prototype);
Animation.prototype.constructor = Animation;
Animation.prototype.parent = null;
Animation.prototype.game = null;
Animation.prototype.animatedSprite = null;
Animation.prototype.currentAnim = null;

Animation.prototype.add = function (name, textures, loop, animationSpeed,completeFun,completeScope,group) {
    if(this.animations[name]){
        //console.log(this.animations[name]);
        //this.animations[name].destroy();
    }
    if(!this.animatedSprite){
        return;
    }
    let animate = new PIXI.AnimatedSprite(textures);
    // let animate = new PIXI.extras.AnimatedSprite(textures);
    animate.x = this.animatedSprite.x;
    animate.y = this.animatedSprite.y;
    animate.scale.set(this.animatedSprite.scale.x,this.animatedSprite.scale.y);
    animate.loop = loop || false;
    animate.name = name;
    animate.visible = false;
    animate.animationSpeed = animationSpeed || 0.15;
    animate.anchor.set(0.5);
    if(group){
        group.addChild(animate);
    }
    else{
        this.animatedSprite.parent.addChild(animate);
    }
    
    if (!this.currentAnim) {
        this.currentAnim = animate;
    };
    this.animations[name] = animate; 
    var self = this;
    animate.onComplete = function(){
        //self.animatedSprite.visible = true;
        //self.animations[name].visible = false;
        if(completeFun){
            completeFun.apply(completeScope);
        }
    }
    
};
Animation.prototype.play = function (name) {
    if (this.animations[name]) {
        this.animatedSprite.visible = false;
        this.currentAnim = this.animations[name];
        this.animations[name].visible = true;
        this.animations[name].play();
    }
};
Animation.prototype.getAnimateByName = function (name) {
    return this.animations[name];
};
Animation.prototype.stop = function (name) {
    if (name) {
        if (this.animations[name]) {
            this.animations[name].stop();
        }
    }
    else {
        this.currentAnim.stop();
    }

};
Animation.prototype.destroyAll = function () {
    this.animatedSprite.visible = true;
    for(var name in this.animations){
        this.animations[name].visible = false;
    }
}


Animation.prototype.generateFrameNames = function (frameNameStart, start, end, suffix, cnt) {
    var textures = [];
    var img = this.game.cache.getImage(this.animatedSprite.key, true);
    let frameData = this.game.cache.getFrameData(this.animatedSprite.key);
    var fromFrames = frameData._frames;
    var frameNames = {};
    for (let i = start; i <= end; i++) {
        var len = String(i).length;
        len = cnt - len;
        if (len < 0) {
            len = 0;
        }
        var st = "";
        for (var j = 0; j < len; j++) {
            st = st + "0";
        }
        var strNum = st + String(i);
        var name = frameNameStart + strNum + suffix;
        frameNames[name] = true;
    }

    for (let i = 0; i < fromFrames.length; i++) {
        let _frame = fromFrames[i];
        if (frameNames[_frame.name]) {
            let _texture = new PIXI.Texture(img.base, _frame);
            textures.push(_texture);
        }
    }
    return textures;
};


Animation.prototype.generateFrameNames2 = function (frameNameStart, start, end, suffix, cnt) {
    var textures = [];
   
    for (let i = start; i <= end; i++) {
        var len = String(i).length;
        len = cnt - len;
        if (len < 0) {
            len = 0;
        }
        var st = "";
        for (var j = 0; j < len; j++) {
            st = st + "0";
        }
        var strNum = st + String(i);
        var name = frameNameStart + strNum + suffix;


        var img = this.game.cache.getImage(name, true);
        let frameData = this.game.cache.getFrameData(name);
        var fromFrames = frameData._frames;

        let _texture = new PIXI.Texture(img.base, fromFrames[0]);
        textures.push(_texture);
    }
    return textures;
};