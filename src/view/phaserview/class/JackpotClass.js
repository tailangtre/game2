// Soft glow baked into a canvas texture: a rounded shape whose edge fades smoothly to nothing. A PIXI BlurFilter
// gets cut off at its filter bounds (tom 2026-10-05: "the auras of the jackpots getting clipped at the edge").
var softGlowTexture = (function () {
    var cache = {};
    return function (color, w, h, radius, blur) {
        var key = [color, w, h, radius, blur].join('_');
        if (cache[key]) return cache[key];
        var m = Math.ceil(blur * 1.6), cw = Math.ceil(w + m * 2), ch = Math.ceil(h + m * 2);
        var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
        var c = cv.getContext('2d'), off = cw + 50;
        var hex = '#' + ('000000' + color.toString(16)).slice(-6);
        c.shadowColor = hex; c.shadowBlur = blur; c.shadowOffsetX = off;      // draw off-canvas, keep only the shadow
        c.fillStyle = hex;
        var x = m - off, y = m, r = Math.min(radius, w / 2, h / 2);
        c.beginPath();
        c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
        c.fill(); c.fill();                                                    // twice: a fuller core
        return (cache[key] = PIXI.Texture.from(cv));
    };
})();

/**
 * Created by kexin on 2018/3/13.
 */
var jackpotClass = function(game, group) {
    this._posLandscapeX = 0;
    this._posLandscapeY = 0;
    this._posPortraitX = 0;
    this._posPortraitY = 0;
    this._grpPosition = null;

    this._grpPoolPanel = null;
    this._grpPoolFX = null;
    this._grpPoolBanner = null;
    this._grpCoin = null;
    this._grpWinBanner = null;

    this._sprTubeMeterBar = null;
    this._wonJackpotIndex = 0;
    this._tubeHeight = 0;

    this._coinClass = null;
    this._timerCoin = null;
    this._lang = "en";
    this._langName = "jakpotWin";

    this._jackpotPools = [];

    this.create = function() {
        // if(GlobalClass.GAME_LANG=='zh'){
        //     this._lang = GlobalClass.GAME_LANG;
        //     this._langName = "jakpot_zh";
        // } else {
        //     this._lang = GlobalClass.GAME_LANG;
        // }
        this._grpPosition = game.add.group();
        group.addChild(this._grpPosition);

        this._grpTube = game.add.group();
        this._grpPosition.addChild(this._grpTube);

        this._grpPoolPanel = game.add.group();
        this._grpPosition.addChild(this._grpPoolPanel);

        this._grpPoolFX = game.add.group();
        this._grpPosition.addChild(this._grpPoolFX);

        this._grpGrandText = game.add.group();
        this._grpPosition.addChild(this._grpGrandText);

        this._grpMajorText = game.add.group();
        this._grpPosition.addChild(this._grpMajorText);

        this._grpMinorText = game.add.group();
        this._grpPosition.addChild(this._grpMinorText);

        this._grpMiniText = game.add.group();
        this._grpPosition.addChild(this._grpMiniText);

        this._grpPoolBanner = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpPoolBanner);
        gameplayState._transitionGroup.x = this._grpPosition.x;
        gameplayState._transitionGroup.y = this._grpPosition.y;

        this._grpCoin = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpCoin);

        
        this._grpStar = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpStar);

        this._grpWinBanner = game.add.group();
        gameplayState._transitionGroup.addChild(this._grpWinBanner);

        this._style = {
            fontSize:"30px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#e4f7f2",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center"
        };

        this._style2 = {
            fontSize:"60px",
            fontFamily:"'Segoe UI Variable Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fill: "#e4f7f2",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            align: "center",
      dropShadow: true, dropShadowColor: "#000000", dropShadowAlpha: 0.65, dropShadowBlur: 6, dropShadowDistance: 2, padding: 12
        };

        this._wonJackpotIndex = 0;
        this._wonJackpots = [];
        this.checkResolution();
        this.updateValue();
    };

    this.hasConsecutiveZeros3 = function(number) {
        let regex = /000$/;
        return regex.test(number);
    }

    this.hasConsecutiveZeros6 = function(number) {
        let regex = /000000$/;
        return regex.test(number);
    }

    this.hasConsecutiveZeros9 = function(number) {
        let regex = /000000000$/;
        return regex.test(number);
    }

    // Jackpot values (tom 2026-10-04): clean, theme-matching text - engraved-gold serif, the full amount
    // (no K/M/B abbreviation), centred in the plaque's window. Portrait keeps the bitmap digits.
    this.JP_VALUE_STYLE = {
        fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: "bold", fontSize: 24, letterSpacing: 1,
        fill: ["#fbf5e6", "#e8dcc2", "#a8916a"], fillGradientStops: [0, 0.55, 1],
        dropShadow: true, dropShadowColor: "#140b02", dropShadowAlpha: 0.85, dropShadowBlur: 4, dropShadowDistance: 2, padding: 10
    };
    // window centre offset (stage px, relative to the plaque centre at its normal size) and inner width,
    // measured on the plaque art (tom 2026-10-04: numbers centred inside the frame)
    this.JP_WINDOW = { grand: [0, 16.2, 107], major: [0, 17, 109], minor: [0, 21.3, 113], mini: [0, 16.6, 101] };   // measured on the Phantom Tide plaques
    this.writeValueText = function(y, txt, type, group) {
        GlobalClass.deleteChildren(group);
        var t = new PIXI.Text(String(txt).trim(), this.JP_VALUE_STYLE);
        t.anchor.set(0.5, 0.5);
        var win = this.JP_WINDOW[type] || [0, 0, 110];
        t._fit = Math.min(1, win[2] / t.width, 26 / (t.height - 2 * (this.JP_VALUE_STYLE.padding || 0)));
        group.addChild(t);
        this['_val' + type] = t;
        this.syncValue(type);
        if (!this._syncing) {                             // keep every value glued to its plaque, every frame
            this._syncing = true;
            var self = this;
            game.app.ticker.add(function () { ['grand', 'major', 'minor', 'mini'].forEach(function (k) { self.syncValue(k); }); });
        }
    };
    /** place a value in its plaque's window, following the plaque's position, scale and pulse */
    this.syncValue = function(type) {
        var t = this['_val' + type];
        var cap = type.charAt(0).toUpperCase() + type.slice(1);
        var board = this['_spr' + cap + 'Board'];
        if (!t || t._destroyed || !board || board._destroyed || !AppConstants.LANDSCAPE) return;
        var disp = board, pulse = 1;
        var anim = board.animations && board.animations.animations && board.animations.animations.anim;
        if (anim && anim.visible && anim.parent && !board.visible) {
            disp = anim;                                      // the glow frames are drawn 1 + 0.04*sin(pi*t) larger
            var n = Math.max(1, anim.totalFrames - 1);
            pulse = 1 + 0.04 * Math.sin(Math.PI * anim.currentFrame / n);
        }
        var k = disp.scale.x / 0.5;                          // plaque art is drawn at 0.5 at its normal size
        var win = this.JP_WINDOW[type] || [0, 0, 110];
        t.x = disp.x + win[0] * k * pulse;
        t.y = disp.y + win[1] * k * pulse;
        t.scale.set(t._fit * k * pulse);
        t.visible = board.visible || disp !== board;
    };

    this.writeImgText=function(x,y,val,txt,type,group){
        if (AppConstants.LANDSCAPE) { this.writeValueText(y, txt, type, group); return; }
        txt = txt.replace(/\s/g, "");        
        // if(game.device.desktop){
        //     x = x - 20;
        // }
        GlobalClass.deleteChildren(group);
        txt = txt.toString();

        var len = GlobalClass.currency().length;
        var scale = 0.6;
        if(len>=6){
            scale = 0.5;
        }

        if(!game.device.desktop){
            if (AppConstants.LANDSCAPE) {
                scale = 0.6;
            } else {
                scale = 0.7;
            }
        }
        if (AppConstants.LANDSCAPE) {
            scale = len >= 6 ? 0.36 : 0.42;   // digits fit the jackpot plaque windows (tom 2026-10-03)
        }
        
        var width = 0;
        var flag = 0;

        if (this.hasConsecutiveZeros9(val)) {
            // txt = val.toString().slice(0, -9);
            txt = GlobalClass.getFormatCurrency((val / 1000000000), true);
            txt += "B";
        } else if (this.hasConsecutiveZeros6(val)) {
            // txt = val.toString().slice(0, -6);
            txt = GlobalClass.getFormatCurrency((val / 1000000), true);
            txt += "M";
        } else if (this.hasConsecutiveZeros3(val)) {
            // txt = val.toString().slice(0, -3);
            txt = GlobalClass.getFormatCurrency((val / 1000), true);
            txt += "K";
        }
        
        // if (this.hasConsecutiveZeros9(this._jackpotPools[3]) && this.hasConsecutiveZeros9(this._jackpotPools[2]) && this.hasConsecutiveZeros9(this._jackpotPools[1]) && this.hasConsecutiveZeros9(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -11);
        //     txt += "B";
        // } else if (this.hasConsecutiveZeros6(this._jackpotPools[3]) && this.hasConsecutiveZeros6(this._jackpotPools[2]) && this.hasConsecutiveZeros6(this._jackpotPools[1]) && this.hasConsecutiveZeros6(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -7);
        //     txt += "M";
        // } else if (this.hasConsecutiveZeros3(this._jackpotPools[3]) && this.hasConsecutiveZeros3(this._jackpotPools[2]) && this.hasConsecutiveZeros3(this._jackpotPools[1]) && this.hasConsecutiveZeros3(this._jackpotPools[0])) {
        //     txt = txt.slice(0, -3);
        //     txt += "K";
        // }
        
        for (var i = 0; i < txt.length; i++) {
            var name = txt[i] + "_" + type + ".png";
            var sy = 0;

            if (txt[i] == "B") {
                var str = game.add.sprite(width, sy, 'flags', "B-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else if (txt[i] == "M") {
                var str = game.add.sprite(width, sy, 'flags', "M-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else if (txt[i] == "K") {
                var str = game.add.sprite(width, sy, 'flags', "K-" + type + ".png", group);
                str.scale.set(scale);
                str.anchor.set(0, 0.5);
            } else {
                // if(i<len - 1){ // ADDED -1
                if (/^[A-Za-z]/.test(name)) {
                    let letter = txt[i].toUpperCase();
                    name = letter + "-" + type + ".png";
                    try {
                        var str = game.add.sprite(width, sy, 'curency', name, group);
                        str.scale.set(scale - 0.1);
                    } catch (err) {}
                }
                else{
                    if(txt[i]=="."){
                        name = "dot_"+type+".png";
                        sy = 10;
                    }
                    else if(txt[i]==","){
                        name = "coma_"+type+".png";
                        sy = 10;
                    }

                    // if(flag==0){
                    //     width+=8;
                    //     flag = 1;
                    // }
                    
                    try {
                        var str = game.add.sprite(width, sy, 'jakpotWin', name,group);
                    } catch (e) {
                        var str = game.add.sprite(width, sy, 'jakpotWin', ".png",group);
                    }
                    str.scale.set(scale);
                }
                str.anchor.set(0, 0.5);
            }
            
            
            width+=str.width;
        }
        group.y = y;
        group.x = x-width/2+20;
        
    };

    this.drawScreen = function(){
        
        this.updateTube();
        GlobalClass.deleteChildren(this._grpPoolPanel);
        GlobalClass.deleteChildren(this._grpGrandText);
        GlobalClass.deleteChildren(this._grpMajorText);
        GlobalClass.deleteChildren(this._grpMinorText);
        GlobalClass.deleteChildren(this._grpMiniText);
        var lang = "";
        // if(this._lang!='en'){
        //     lang = this._lang;
        // }
        
        if(AppConstants.LANDSCAPE) {
            this._grpGrandText.scale.set(1);
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                this._sprGrandBoard = game.add.sprite(128, 70, this._langName, 'GrandFrame'+lang+'.png', this._grpPoolPanel);
                this._sprGrandBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprGrandBoard.scale.set(0.5);   // plaque art is 2x (sharper)

                this.writeImgText(this._sprGrandBoard.x - 5, this._sprGrandBoard.y + 22, 0, GlobalClass.getFormatCurrency(0, false),"grand",this._grpGrandText);

                this._sprMajorBoard = game.add.sprite(this._sprGrandBoard.x, this._sprGrandBoard.y + 145, this._langName, 'MajorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMajorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMajorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                var txs = this._sprGrandBoard.animations.generateFrameNames("GrandIconAnim"+lang+"_", 0, 37, '.png', 3);
                this._sprGrandBoard.txs = txs;
                
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprMajorBoard.y + 19, 0, GlobalClass.getFormatCurrency(0, false),"major",this._grpMajorText);

                this._sprMinorBoard = game.add.sprite(this._sprGrandBoard.x, this._sprMajorBoard.y + 196, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMinorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprMinorBoard.y + 20, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprGrandBoard.x, this._sprMinorBoard.y + 141, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMiniBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprMiniBoard.y + 14, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
            else{
                this._sprMinorBoard = game.add.sprite(128, 200, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMinorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this.writeImgText(this._sprMinorBoard.x - 5, this._sprMinorBoard.y+20, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y + 141, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMiniBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this.writeImgText(this._sprMiniBoard.x - 5, this._sprMiniBoard.y + 14, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
        }
        else{
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                this._sprGrandBoard = game.add.sprite(game.world.centerY/2-7, -30, this._langName, 'GrandFrame'+lang+'.png', this._grpPoolPanel);
                this._sprGrandBoard.anchor.set(0.5, 0);
                this._sprGrandBoard.scale.set(0.8);

                this._grpGrandText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x+50, this._sprGrandBoard.y+160, 0, GlobalClass.getFormatCurrency(0, false),"grand",this._grpGrandText);


                this._sprMajorBoard = game.add.sprite(this._sprGrandBoard.x, 260, this._langName, 'MajorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMajorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMajorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this._sprMajorBoard.scale.set(0.8);

                this._grpMajorText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, this._sprMajorBoard.y, 0, GlobalClass.getFormatCurrency(0, false),"major",this._grpMajorText);

                this._sprMinorBoard = game.add.sprite(this._sprGrandBoard.x+360, 100, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMinorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this._sprMinorBoard.scale.set(0.8);

                this._grpMinorText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, 20 + 280, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y+150, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMiniBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                this._sprMiniBoard.scale.set(0.8);

                this._grpMiniText.scale.set(0.8);
                this.writeImgText(this._sprGrandBoard.x - 5, 20 + 370, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
            else{
                this._sprMinorBoard = game.add.sprite(game.world.centerY/2-45, 100, this._langName, 'MinorFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMinorBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMinorBoard.scale.set(0.5);   // plaque art is 2x (sharper)
                //this._sprMinorBoard.scale.set(0.8);

                //this._grpMinorText.scale.set(0.8);
                this.writeImgText(this._sprMinorBoard.x - 5, this._sprMinorBoard.y + 50, 0, GlobalClass.getFormatCurrency(0, false),"minor",this._grpMinorText);


                this._sprMiniBoard = game.add.sprite(this._sprMinorBoard.x, this._sprMinorBoard.y+140, this._langName, 'MiniFrame'+lang+'.png', this._grpPoolPanel);
                this._sprMiniBoard.anchor.set(0.5, 0.5);
                if (AppConstants.LANDSCAPE) this._sprMiniBoard.scale.set(0.5);   // plaque art is 2x (sharper)
               // this._sprMiniBoard.scale.set(0.8);

                //this._grpMiniText.scale.set(0.8);
                this.writeImgText(this._sprMiniBoard.x - 5, this._sprMiniBoard.y + 30, 0, GlobalClass.getFormatCurrency(0, false),"mini",this._grpMiniText);
            }
        }

        var txs = this._sprGrandBoard.animations.generateFrameNames("GrandIconAnim"+lang+"_", 0, 17, '.png', 2);
        var textrues = [];
        this._sprGrandBoard.txs = textrues.concat(txs);

        var txs = this._sprMajorBoard.animations.generateFrameNames("MajorIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMajorBoard.txs = textrues.concat(txs);

        var txs = this._sprMinorBoard.animations.generateFrameNames("MinorIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMinorBoard.txs = textrues.concat(txs);

        var txs = this._sprMiniBoard.animations.generateFrameNames("MiniIconAnim"+lang+"_", 0, 17, '.png', 2);
        textrues = [];
        this._sprMiniBoard.txs = textrues.concat(txs);
        
		this.changeJackPot();
		/* if(gameplayState._updatedJackpotValue){
			this.changeJackPot();
		} */
    };

    this.updateTube=function(){
        GlobalClass.deleteChildren(this._grpTube);
        var obj = GlobalClass.getJackpotLevel();
        if(AppConstants.LANDSCAPE) {
            // RAGNAROK layout: the bet-level tube lies on its side under the jackpot column (drawn around 0,0, see below)
            var sprTube = game.add.sprite(0, 0, 'ui', obj.level + 'betsFrame.png', this._grpTube);
            sprTube.anchor.set(0.5, 0.5);
            var y = sprTube.y + 151;
            var tmp = 11-obj.value
            if(tmp<=0){
                tmp = 0;
            }
            y = y - tmp;
            this._sprTubeMeterBar = game.add.sprite(sprTube.x - 1, y, 'ui', obj.level + 'MeterBar.png', this._grpTube);
            this._sprTubeMeterBar.anchor.set(0.5, 1);
            var height = this._sprTubeMeterBar.height;
            this._sprTubeMeterBar.height = height*obj.value/ GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1];

            this._sprMask = game.add.graphics();
            this._sprMask.beginFill(0xffffff);
            this._sprMask.drawRect(-15, 140 - 295, 30, 295);
            this._sprMask.alpha = 0.5
            this._grpTube.addChild(this._sprMask);
            this._sprTubeMeterBar.mask = this._sprMask;
            this._grpTube.x = 128 - this._posLandscapeX;
            this._grpTube.y = 606;
            this._grpTube.rotation = -Math.PI / 2;
            this._grpTube.scale.set(0.42);
            this._grpTube.visible = false;   // tom 2026-10-04: no bet-intensity bar above the balance
        }
        else{
            this._grpTube.visible = true;
            this._grpTube.x = 0;
            this._grpTube.y = 0;
            this._grpTube.rotation = 0;
            this._grpTube.scale.set(1);
            // var sprTube = game.add.sprite(game.world.centerX+155, 617, 'ui', obj.level + 'betsFrame.png', this._grpTube);
            // sprTube.anchor.set(0.5, 0.5);
            // sprTube.rotation = Math.atan2(1,0);
            // var x = sprTube.x + 165;
            var y = 782;
            var tmp = 11-obj.value
            if(tmp<=0){
                tmp = 0;
            }
            y = y - tmp;
            this._sprTubeMeterBar = game.add.sprite(710, y, 'ui', obj.level + 'MeterBar.png', this._grpTube);
            this._sprTubeMeterBar.anchor.set(0.5,1);
            this._sprTubeMeterBar.width = 16;
            this._sprTubeMeterBar.height = 392;
            var height = this._sprTubeMeterBar.height;
            this._sprTubeMeterBar.height = height*obj.value/  GlobalClass.GAME_BET[GlobalClass.GAME_BET.length - 1];

            this._sprMask = game.add.graphics();
            this._sprMask.beginFill(0xffffff);
            this._sprMask.drawRect(710 - 15, y - 10 - 368, 30, 368);
            this._sprMask.alpha = 0.5
            this._grpTube.addChild(this._sprMask);
            this._sprTubeMeterBar.mask = this._sprMask;
        }
    };

    this.updateValue=function(type) {
        this.changeJackPot(type);
        if (this._wonJackpots.length > 0) {
            for (var i = 0; i < this._wonJackpots.length; i++) {
                var positions = this._wonJackpots[i].positions;
               // var linePath = GlobalClass.WIN_LINE[lineNo];
                var symbols = [];
                this._wonJackpots[i].symbols = symbols;
                for (var j = 0; j < positions.length; j++) {
                    var pos = positions[j];
                    var symbol = gameplayState._reelClass.getFXSymbol(pos[0], pos[1]);
                    symbols.push(symbol);
                }
            }
        }
    }

    this.changeJackPot=function(type,value){
        var jackpotPools = [];//GlobalClass.GAME_DATA.jackpotState.jackpotPool;
        this._jackpotPools = [];

        GlobalClass.GAME_DATA.jackpotState.jackpotPool.forEach((poolValue, index) => {
            // jackpotPools[index] = GlobalClass.getDenom() * GlobalClass.trueCoinValue() * poolValue.winAmount;

            // jackpot prize x (minbet/lines played) x denom
            jackpotPools[index] = poolValue.winAmount * (GlobalClass.GAME_BET[0] / GlobalClass.GAME_LINE) * GlobalClass.GAME_COIN_VALUE[GlobalClass.GAME_COIN_POS];
        });

        this._jackpotPools = [...jackpotPools];

        if(AppConstants.LANDSCAPE) {
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                if(!type){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 22, jackpotPools[0], GlobalClass.getFormatCurrency(jackpotPools[0], false),"grand",this._grpGrandText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMajorBoard.y + 19, jackpotPools[1], GlobalClass.getFormatCurrency(jackpotPools[1], false),"major",this._grpMajorText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMinorBoard.y + 20, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMiniBoard.y + 14, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 22, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMajorBoard.y + 19, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMinorBoard.y + 20, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMiniBoard.y + 14, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
            else{
                if(!type){
                   // this.writeImgText(this._sprGrandBoard.x - 15, 20 + 30, jackpotPools[0], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[0])).format('0,0.00'),"grand",this._grpGrandText);
                   // this.writeImgText(this._sprGrandBoard.x - 20, this._sprMajorBoard.y + 19, jackpotPools[1], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[1])).format('0,0.00'),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 20, this._sprMinorBoard.y+20, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 20, this._sprMiniBoard.y + 14, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprGrandBoard.y + 22, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x - 20, this._sprMajorBoard.y + 19, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 20, this._sprMinorBoard.y+20, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 20, this._sprMiniBoard.y + 14, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
        }
        else{
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_NORMAL){
                if(!type){
                    this.writeImgText(this._sprGrandBoard.x, this._sprGrandBoard.y+160, jackpotPools[0], GlobalClass.getFormatCurrency(jackpotPools[0], false),"grand",this._grpGrandText);
                    this.writeImgText(this._sprGrandBoard.x, this._sprMajorBoard.y+20, jackpotPools[1], GlobalClass.getFormatCurrency(jackpotPools[1], false),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y+30, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y+28, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x, this._sprGrandBoard.y+160, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x, this._sprMajorBoard.y+20, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y+30, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y+28, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
            else{
                if(!type){
                    //this.writeImgText(this._sprGrandBoard.x, 20 + 85,jackpotPools[0], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[0])).format('0,0.00'),"grand",this._grpGrandText);
                    //this.writeImgText(this._sprGrandBoard.x, 20 + 185,jackpotPools[1], GlobalClass.currency()+ myNumeral(this.getWinAmountInDollar(jackpotPools[1])).format('0,0.00'),"major",this._grpMajorText);
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y + 40, jackpotPools[2], GlobalClass.getFormatCurrency(jackpotPools[2], false),"minor",this._grpMinorText);
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y + 30, jackpotPools[3], GlobalClass.getFormatCurrency(jackpotPools[3], false),"mini",this._grpMiniText);
                }
                else if(type==-1){
                    this._wonJackpots = GlobalClass.GAME_DATA.jackpotState.wonJackpots;
                }
                else if(type=='GRAND'){
                    this.writeImgText(this._sprGrandBoard.x, 20 + 85, value, GlobalClass.getFormatCurrency(value, false),"grand",this._grpGrandText);
                }
                else if(type=='MAJOR'){
                    //this._majorValue.text = GlobalClass.currency()+ myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprGrandBoard.x, 20 + 185, value, GlobalClass.getFormatCurrency(value, false),"major",this._grpMajorText);
                }
                else if(type=='MINOR'){
                    //this._minorValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMinorBoard.x - 10, this._sprMinorBoard.y + 40, value, GlobalClass.getFormatCurrency(value, false),"minor",this._grpMinorText);
                }
                else if(type=='MINI'){
                    //this._miniValue.text = GlobalClass.currency() + myNumeral(value).format('0,0.00');
                    this.writeImgText(this._sprMiniBoard.x - 10, this._sprMiniBoard.y + 30, value, GlobalClass.getFormatCurrency(value, false),"mini",this._grpMiniText);
                }
            }
        }
    };

    this.getWinAmountInDollar = function(jackpotPool){
        var tv = GlobalClass.trueCoinValue();
        var inDollar = jackpotPool.initialPrize * tv+jackpotPool.contribution;
        var winAmount = this.accDiv(inDollar,tv);
        inDollar = winAmount*tv;
        return inDollar;
    };

    // this.accDiv = function(arg1,arg2){ 
    //     var t1=0,t2=0,r1,r2; 
    //     try{t1=arg1.toString().split(".")[1].length}catch(e){}  
    //     try{t2=arg2.toString().split(".")[1].length}catch(e){}
    //     with(Math){ 
    //       r1=Number(arg1.toString().replace(".","")) 
    //       r2=Number(arg2.toString().replace(".","")) 
    //       return (r1/r2)*pow(10,t2-t1);   
    //     } 
    // } 
    this.accDiv = function(arg1, arg2){
        let t1 = 0, t2 = 0;

        try { t1 = arg1.toString().split(".")[1].length; } catch(e){}
        try { t2 = arg2.toString().split(".")[1].length; } catch(e){}

        // Buang semua titik
        let r1 = Number(arg1.toString().replace(/\./g, ""));
        let r2 = Number(arg2.toString().replace(/\./g, ""));

        return (r1 / r2) * Math.pow(10, t2 - t1);
    };

    // One presentation per tier (tom 2026-10-05: "that still happen in freespins"): with the wild reels a free spin
    // can hit the same jackpot on several lines, and each line comes back as its own entry - the plaque then flew
    // in again and again. Same-tier hits are merged (amounts summed) and each tier plays once, biggest first.
    var JP_ORDER = { GRAND: 0, MAJOR: 1, MINOR: 2, MINI: 3 };
    this.mergeJackpots = function(list) {
        var byName = {}, out = [];
        (list || []).forEach(function (j) {
            var k = String(j.name).toUpperCase(), m = byName[k];
            if (!m) {
                m = byName[k] = {}; for (var f in j) m[f] = j[f];
                m.symbols = j.symbols ? j.symbols.slice() : null; m.hits = 1;
                out.push(m);
            } else {
                m.winAmount = (m.winAmount || 0) + (j.winAmount || 0);
                m.winAmountInDollar = (m.winAmountInDollar || 0) + (j.winAmountInDollar || 0);
                if (j.symbols) m.symbols = (m.symbols || []).concat(j.symbols);
                m.hits++;
            }
        });
        out.sort(function (a, b) { return (JP_ORDER[String(a.name).toUpperCase()] || 9) - (JP_ORDER[String(b.name).toUpperCase()] || 9); });
        return out;
    };
    this.showFX=function(){
        if (this._wonJackpotIndex == 0) this._jpPlay = this.mergeJackpots(this._wonJackpots);
        var plays = this._jpPlay || [];
        if(plays.length <=0){
            this._sequenceRunning = false;
            gameplayState.startAnimationSymbol();
            return;
        }

        if(this._wonJackpotIndex+1>plays.length){
            this._wonJackpotIndex = 0;
            this._sequenceRunning = false;
            //this.showBanner();
            //this.removeFX();
            if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
                soundClass.resumeBGM();
            }
            this.changeJackPot();
            //gameplayState.showTotalJackpotWin();
            gameplayState.startAnimationSymbol();
            return;
        }
        if(GlobalClass.GAME_MODE == GlobalClass.GAME_MODE_FEATURE1){
            soundClass.pauseBGM();
        }
        var wonJackpot = plays[this._wonJackpotIndex];
        var start = 2.3;
        if(wonJackpot.name.toLowerCase()=="MINI" || wonJackpot.name.toLowerCase()=="MAJOR"){
            start = 1.8;
        }
        else if(wonJackpot.name.toLowerCase()=="MINOR"){
            start = 1.5;
        }
        
        

        //var txt = wonJackpot.winAmount+" won "+wonJackpot.name.toLowerCase()+"!";
        gameplayState._informationClass.setText("jackpotwin",wonJackpot.name.toLowerCase(), GlobalClass.getFormatCurrency(wonJackpot.winAmountInDollar));

        //var name = wonJackpot.name;
        this._wonJackpotIndex++;
        // wonJackpot.symbols = [];
        // var symbol = gameplayState._reelClass.getFXSymbol(0, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(1, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(2, 1);
        // wonJackpot.symbols.push(symbol);

        // symbol = gameplayState._reelClass.getFXSymbol(3, 1);
        // wonJackpot.symbols.push(symbol);
        
        soundClass.playSound("jackPotTrigger");
        if(wonJackpot.symbols!=null && wonJackpot.symbols.length>0){
            gameplayState._reelClass.addMask();
            for(var i=0;i<wonJackpot.symbols.length;i++){
                wonJackpot.symbols[i].showSymbolFX();
            }
        }

        this.changeJackPot(wonJackpot.name,wonJackpot.winAmountInDollar);
        this._timerFunc = game.time.events.add(1200, function(){
            soundClass.playSound("jackPot"+wonJackpot.name.toLowerCase());
        },this);
        
        this._timerFunc = game.time.events.add(1500, function(){
            if (AppConstants.LANDSCAPE) { this.removeFX(); this.playIconAnimations(wonJackpot); return; }   // no tube light (tom 2026-10-04)
            this._tubeFX = game.add.sprite(this._sprTubeMeterBar.x, this._sprTubeMeterBar.y-145, 'interfaceFX', 'TubeFX_000.png', this._grpPoolFX);
            this._tubeFX.anchor.set(0.5, 0.5);
            var txs = this._tubeFX.animations.generateFrameNames("TubeFX_", 0, 8, '.png', 3);
            this._tubeFX.animations.add('anim', txs,false,0.2,function(){
                this.removeFX();
                this.playIconAnimations(wonJackpot);
            },this);
            this._tubeFX.animations.play('anim');
        },this);
        
        
    };

    // Jackpot hit (tom 2026-10-04): the won plaque grows and moves to the middle of the screen, plays its glow
    // there, then goes back to its place in the jackpot column; the win banner follows.
    var JP_FOCUS_SCALE = 2.2, JP_FOCUS_IN_S = 0.6, JP_FOCUS_HOLD_S = 0.6, JP_FOCUS_OUT_S = 0.5;
    // drama per tier (tom 2026-10-04: "make the effects of the jackpots more dramatic"):
    // focus scale, dim, light-ray strength, flash, screen shake (px), coins, coin size/power
    var JP_DRAMA = {
        mini:  { scale: 2.0, dim: 0.45, rays: 0.30, flash: 0.35, shake: 4,  coins: 14, coinSize: 0.30, power: 0.8 },
        minor: { scale: 2.15, dim: 0.52, rays: 0.42, flash: 0.45, shake: 7,  coins: 24, coinSize: 0.34, power: 0.95 },
        major: { scale: 2.35, dim: 0.60, rays: 0.58, flash: 0.6,  shake: 11, coins: 40, coinSize: 0.40, power: 1.15 },
        grand: { scale: 2.6, dim: 0.70, rays: 0.80, flash: 0.8,  shake: 16, coins: 70, coinSize: 0.48, power: 1.4 }
    };
    var JP_COLOR = { grand: 0xe8d38a, major: 0x9b5cff, minor: 0xff4b3e, mini: 0x22e3ff };

    /** dim + rotating light rays + flash + shake + coin burst around a plaque in the middle; returns a stop() */
    this.jackpotDrama = function(tier, local, parent) {
        var D = JP_DRAMA[tier] || JP_DRAMA.mini, col = JP_COLOR[tier] || 0xffc446;
        var layer = new PIXI.Container();
        this._grpPosition.addChild(layer);                                    // over everything in the jackpot layer
        var dim = new PIXI.Graphics(); dim.beginFill(0x000000, 1); dim.drawRect(-2000, -2000, 5280, 4720); dim.endFill();
        dim.alpha = 0; layer.addChild(dim);
        var rays = new PIXI.Graphics(); var n = 28, R = 760;
        for (var i = 0; i < n; i++) {
            var a0 = (i / n) * Math.PI * 2, a1 = a0 + Math.PI / n * 0.45;
            rays.beginFill(col, 1); rays.moveTo(0, 0); rays.lineTo(Math.cos(a0) * R, Math.sin(a0) * R); rays.lineTo(Math.cos(a1) * R, Math.sin(a1) * R); rays.endFill();
        }
        rays.x = local.x; rays.y = local.y; rays.alpha = 0; rays.scale.set(0.2);
        rays.blendMode = PIXI.BLEND_MODES.ADD; rays.filters = [new PIXI.filters.BlurFilter(22, 4)];
        layer.addChild(rays);
        var halo = new PIXI.Sprite(softGlowTexture(col, 480, 480, 240, 110)); halo.anchor.set(0.5, 0.5);
        halo.x = local.x; halo.y = local.y; halo.alpha = 0; halo.blendMode = PIXI.BLEND_MODES.ADD;
        layer.addChild(halo);
        var coins = new PIXI.Container(); coins.x = local.x; coins.y = local.y; layer.addChild(coins);
        var flash = new PIXI.Graphics(); flash.beginFill(0xe0fff6, 1); flash.drawRect(-2000, -2000, 5280, 4720); flash.endFill();
        flash.alpha = 0; flash.blendMode = PIXI.BLEND_MODES.ADD; layer.addChild(flash);

        TweenMax.to(dim, 0.6, { alpha: D.dim, ease: Sine.easeInOut });
        TweenMax.to(rays, 0.5, { alpha: D.rays * 0.4, ease: Power2.easeOut });
        TweenMax.to(rays.scale, 1.0, { x: 1, y: 1, ease: Power3.easeOut });
        var spin = { r: 0 };
        TweenMax.to(spin, 12, { r: Math.PI * 2, repeat: -1, ease: Linear.easeNone, onUpdate: function () { rays.rotation = spin.r; } });
        TweenMax.to(halo, 0.5, { alpha: 0.2 + D.rays * 0.3 });
        TweenMax.to(halo.scale, 0.6, { x: 1.25, y: 1.25, repeat: -1, yoyo: true, ease: Sine.easeInOut });
        // arrival: flash, shake, coin burst
        var panel = gameplayState._panelGroup, px = panel.x, py = panel.y, sh = { v: 1 };
        var arrive = function () {
            flash.alpha = D.flash; TweenMax.to(flash, 0.45, { alpha: 0, ease: Power2.easeOut });
            TweenMax.to(rays, 0.5, { alpha: D.rays, ease: Power2.easeOut });
            TweenMax.to(sh, 0.6, { v: 0, ease: Power1.easeOut, onUpdate: function () {
                panel.x = px + (Math.random() * 2 - 1) * D.shake * sh.v; panel.y = py + (Math.random() * 2 - 1) * D.shake * sh.v;
            }, onComplete: function () { panel.x = px; panel.y = py; } });
            var made = 0;
            var burst = function () {
                var k = Math.min(D.coins - made, Math.ceil(D.coins / 6));
                for (var j = 0; j < k; j++) { var cc = new coinClass(game, coins); cc.create(D.coinSize, D.power); }
                made += k;
                if (made < D.coins) layer._coinTimer = TweenMax.delayedCall(0.09, burst);
            };
            burst();
        };
        layer._arrive = TweenMax.delayedCall(JP_IN_S * 0.8, arrive);   // as the plaque settles in the middle
        return function stop() {
            if (layer._arrive) layer._arrive.kill(); if (layer._coinTimer) layer._coinTimer.kill();
            TweenMax.killTweensOf(spin); TweenMax.killTweensOf(halo.scale);
            TweenMax.to([dim, rays, halo], 0.7, { alpha: 0, ease: Sine.easeInOut, onComplete: function () {
                TweenMax.killTweensOf(rays); TweenMax.killTweensOf(rays.scale);
                if (layer.parent) layer.parent.removeChild(layer);
                setTimeout(function () { layer.destroy({ children: true }); }, 2500);   // let flying coins finish
            } });
        };
    };
    // One continuous motion (tom 2026-10-04: "the jackpots animation need to be smoother"): the plaque stays the
    // same sprite the whole time (no swap to the frame animation), every step runs on the same TweenMax clock,
    // and the glow is a soft additive copy of the plaque that breathes with it.
    var JP_IN_S = 0.85, JP_BEATS = 3, JP_BEAT_S = 0.32, JP_OUT_S = 0.8;
    this.playIconAnimations=function(wonJackpot){
        var tier = wonJackpot.name.toLowerCase();
        var cap = tier.charAt(0).toUpperCase() + tier.slice(1);
        var board = this['_spr' + cap + 'Board'];
        var text = this['_grp' + cap + 'Text'];
        if (!board) { this.showBanner(wonJackpot); return; }
        var self = this;
        var home = { x: board.x, y: board.y, s: board.scale.x };
        var parent = board.parent, textParent = text && text.parent;
        var mid = new PIXI.Point(AppConstants.LANDSCAPE ? game.world.centerX : game.world.centerY, AppConstants.LANDSCAPE ? game.world.centerY : game.world.centerX);
        var local = parent.toLocal(gameplayState._panelGroup.toGlobal(mid));
        var FOCUS = (JP_DRAMA[tier] || {}).scale || JP_FOCUS_SCALE;
        var lift = AppConstants.LANDSCAPE;
        var stopDrama = lift ? this.jackpotDrama(tier, local, parent) : function () {};
        // work in the lifting layer's space so nothing jumps when the plaque changes parent
        var host = lift ? this._grpPosition : parent;
        var toHost = function (pt) { return host.toLocal(parent.toGlobal(new PIXI.Point(pt.x, pt.y))); };
        var from = toHost(home), to = toHost(local);
        // two glow layers (tom 2026-10-04: "the glow around the jackpots need to be bigger"): a wide soft aura + a tighter rim
        // a plaque-shaped light in the tier colour, heavily blurred (the plaque art itself is too dark to glow)
        var gw = board.texture.width * 0.86, gh = board.texture.height * 0.8;
        var mkGlow = function (blur) {
            var g = new PIXI.Sprite(softGlowTexture(JP_COLOR[tier] || 0xffc446, gw, gh, 40, blur));
            g.anchor.set(0.5, 0.5); g.alpha = 0; g.blendMode = PIXI.BLEND_MODES.ADD;
            host.addChild(g); return g;
        };
        var aura = mkGlow(120), glow = mkGlow(40);
        if (board.parent) board.parent.removeChild(board);
        host.addChild(board);
        if (text) { if (text.parent) text.parent.removeChild(text); host.addChild(text); }   // value above everything
        // a path with a gentle lift (bezier) instead of a straight slide
        var st = { t: 0, s: 1, beat: 1, g: 0 };
        var place = function (a, b, t, arc) {
            var cx = (a.x + b.x) / 2, cy = Math.min(a.y, b.y) - arc;
            var u = 1 - t;
            board.x = u * u * a.x + 2 * u * t * cx + t * t * b.x;
            board.y = u * u * a.y + 2 * u * t * cy + t * t * b.y;
        };
        var render = function (a, b, arc) {
            place(a, b, st.t, arc);
            var k = home.s * st.s * st.beat;
            board.scale.set(k);
            glow.x = aura.x = board.x; glow.y = aura.y = board.y;
            glow.scale.set(k * (1.0 + 0.05 * st.g)); glow.alpha = 0.9 * st.g;
            aura.scale.set(k * (1.15 + 0.12 * st.g) * (1 + (st.beat - 1) * 2.5)); aura.alpha = 0.7 * st.g;
            self.syncValue(tier);
        };
        TweenMax.to(st, JP_IN_S, { t: 1, ease: Power3.easeInOut, onUpdate: function () { render(from, to, 60); } });
        TweenMax.to(st, JP_IN_S, { s: FOCUS, ease: Power3.easeInOut });   // grows while it travels
        TweenMax.to(st, JP_IN_S * 0.8, { g: 1, ease: Sine.easeInOut, delay: JP_IN_S * 0.4 });
        // heartbeat while it sits in the middle
        TweenMax.to(st, JP_BEAT_S, { beat: 1.08, ease: Sine.easeInOut, repeat: JP_BEATS * 2 - 1, yoyo: true, delay: JP_IN_S,
            onUpdate: function () { render(from, to, 60); } });
        var holdEnd = JP_IN_S + JP_BEATS * 2 * JP_BEAT_S;
        TweenMax.delayedCall(holdEnd - 0.15, function () { stopDrama(); });
        TweenMax.delayedCall(holdEnd, function () {
            st.t = 0;
            TweenMax.to(st, JP_OUT_S, { t: 1, ease: Power3.easeInOut, onUpdate: function () { render(to, from, 30); }, onComplete: function () {
                [glow, aura].forEach(function (g) { if (g.parent) g.parent.removeChild(g); g.destroy(); });
                board.scale.set(home.s);
                if (board.parent) board.parent.removeChild(board);
                parent.addChild(board); board.x = home.x; board.y = home.y;            // back in its own layer
                if (text && textParent) { if (text.parent) text.parent.removeChild(text); textParent.addChild(text); }
                self.syncValue(tier);
                self.showBanner(wonJackpot);
            } });
            TweenMax.to(st, JP_OUT_S, { s: 1, ease: Power3.easeInOut });
            TweenMax.to(st, JP_OUT_S * 0.7, { g: 0, ease: Sine.easeOut });
        });
    }


    // this.playIconAnimations=function(wonJackpot){
    //     if(wonJackpot.name.toLowerCase()=='mini'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this.showBanner(wonJackpot);
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='minor'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this.showBanner(wonJackpot);
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
            
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='major'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this._sprMajorBoard.animations.add('anim',this._sprMajorBoard.txs,false,0.8,function(){
    //                     this.showBanner(wonJackpot);
    //                 },this);
    //                 this._sprMajorBoard.animations.play("anim");
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    //     else if(wonJackpot.name.toLowerCase()=='grand'){
    //         this._sprMiniBoard.animations.add('anim',this._sprMiniBoard.txs,false,0.8,function(){
    //             this._sprMinorBoard.animations.add('anim',this._sprMinorBoard.txs,false,0.8,function(){
    //                 this._sprMajorBoard.animations.add('anim',this._sprMajorBoard.txs,false,0.8,function(){
    //                     this._sprGrandBoard.animations.add('anim',this._sprGrandBoard.txs,false,0.8,function(){
    //                         this.showBanner(wonJackpot);
    //                     },this);
    //                     this._sprGrandBoard.animations.play("anim");
    //                 },this);
    //                 this._sprMajorBoard.animations.play("anim");
    //             },this);
    //             this._sprMinorBoard.animations.play("anim");
    //         },this);
    //         this._sprMiniBoard.animations.play("anim");
    //     }
    // }

    this.showBanner=function(wonJackpot){ 
        // tom 2026-10-04: no win banner after a jackpot hit - the plaque's trip to the middle is the presentation.
        // Keep the bookkeeping (feature total win) and move on to the next won jackpot.
        if (AppConstants.LANDSCAPE) {
            gameplayState.addFeatureTotalWin(wonJackpot.winAmount);
            this._timerFunc = game.time.events.add(400, function(){
                GlobalClass.deleteChildren(gameplayState._reelClass._grpSymbolFXMask);
                this.removeFX();
                this.showFX();
            }, this);
            return;
        }
        
        var scale = 1.0;
        var centerX = 0;
        var centerY = 0;
        if(!AppConstants.LANDSCAPE){
            centerX = game.world.centerY;
            centerY = game.world.centerX;
            //this._poolBG = game.add.sprite(game.world.centerY, game.world.centerX, 'jakpotWin', 'jackpot-BG.jpg', this._grpPoolBanner);
            //this._poolBG.anchor.set(0.5, 0.5);
            //this._poolBG.rotation = Math.atan2(1,0);
            scale = 0.7;
            if(GlobalClass.GAME_LANG=='zh'){
                this._jackpotFont = game.add.sprite(game.world.centerY, game.world.centerX-300, 'ui_zh', 'jackpot-font-CH.png', this._grpPoolBanner);
            }
            else{
                this._jackpotFont = game.add.sprite(game.world.centerY, game.world.centerX-300, 'jakpotWin', 'jackpot-font.png', this._grpPoolBanner);
            }
            
        }
        else{
            centerX = game.world.centerX;
            centerY = game.world.centerY;
            //this._poolBG = game.add.sprite(game.world.centerX, game.world.centerY, 'jakpotWin', 'jackpot-BG.jpg', this._grpPoolBanner);
            //this._poolBG.anchor.set(0.5, 0.5);
            
            // if(GlobalClass.GAME_LANG=='zh'){
            //     this._jackpotFont = game.add.sprite(game.world.centerX, game.world.centerY-190, 'ui_zh', 'jackpot-font-CH.png', this._grpPoolBanner);
            // }
            // else{
                this._jackpotFont = game.add.sprite(game.world.centerX, game.world.centerY-190, 'jakpotWin', 'jackpot-font.png', this._grpPoolBanner);
            //}
        }

        this._jackpotFont.anchor.set(0.5, 0.5);
        this._jackpotFont.scale.set(0.0,0.0);


        //game.add.tween(this._jackpotFont.scale).to( { x:scale,y:scale }, 200, "Linear", true,0,0);



        TweenMax.to(this._jackpotFont.scale, 0.2, {
            x:scale,
            y:scale,
            ease: Linear.easeNone,
            useFrames: false
        });


        // (no character sliding through the middle any more - tom 2026-10-04)
        //game.add.tween(this._jackpotFont.scale).to( { x:0.0,y:0.0 }, 200, "Linear", true,800,0);
        TweenMax.to(this._jackpotFont.scale, 0.2, {
            x:0,
            y:0,
            delay: 0.8,
            ease: Linear.easeNone,
            useFrames: false
        });

        this._timerFunc = game.time.events.add(500, function(){
            this._grpWinBanner.x = centerX;
            this._grpWinBanner.y = centerY;
            this._grpWinBanner.scale.set(0.0,0.0);

            var wingLeft =  game.add.sprite(-220, -10, 'ui', "wing.png", this._grpWinBanner);
            wingLeft.anchor.set(1, 1);
            wingLeft.rotation = -3;
            //game.add.tween(wingLeft).to( { rotation:0},400, "Linear", true,0,0);

            TweenMax.to(wingLeft, 0.4, {
                rotation:0,
                ease: Linear.easeNone,
                useFrames: false
            });


            var wingRight =  game.add.sprite(220, -10, 'ui', "wing2.png", this._grpWinBanner);
            wingRight.anchor.set(0, 1);
            wingRight.rotation = 3;
           // game.add.tween(wingRight).to( { rotation:0},400, "Linear", true,0,0);

            TweenMax.to(wingRight, 0.4, {
                rotation:0,
                ease: Linear.easeNone,
                useFrames: false
            });

            var winBanner =  game.add.sprite(0, 0, 'jakpotWin', 'winbanner_000.png', this._grpWinBanner);
            winBanner.anchor.set(0.5, 0.5);
            var txs = winBanner.animations.generateFrameNames("winbanner_", 0, 3, '.png', 3);
            winBanner.animations.add('anim',txs,true,0.15);

            if(GlobalClass.GAME_LANG=='zh'){
                var name = wonJackpot.name.toLowerCase()+"-bannerCH.png";
                var titleBanner =  game.add.sprite(0, -97, 'ui_zh', name, this._grpWinBanner);
                titleBanner.anchor.set(0.5, 0.5);
            }
            else{
                var name = wonJackpot.name.toLowerCase()+"-banner.png";
                var titleBanner =  game.add.sprite(0, -97, 'jakpotWin', name, this._grpWinBanner);
                titleBanner.anchor.set(0.5, 0.5);
            }

            gameplayState.addFeatureTotalWin(wonJackpot.winAmount);

            var winAmount = game.add.text(titleBanner.x, titleBanner.y+85, GlobalClass.getFormatCurrency(wonJackpot.winAmountInDollar), this._style2);
            winAmount.anchor.set(0.5, 0.5);
            this._grpWinBanner.addChild(winAmount);


            TweenMax.to(this._grpWinBanner.scale, 0.5, {
                x:scale,
                y:scale,
                ease: Linear.easeNone,
                useFrames: false,
                callbackScope: this,
                onComplete: function(){
                    winBanner.animations.play('anim');
                    this._grpCoin.x = centerX;
                    this._grpCoin.y = centerY;

                    this._grpStar.x = centerX;
                    this._grpStar.y = centerY;

                    this._timerCoin = game.time.events.loop(20, this.createCoin, this);
                    this._timerStar = game.time.events.loop(50, this.createStar, this);
                    this._timerFunc = game.time.events.add(3000, function(){
                        GlobalClass.deleteChildren(gameplayState._reelClass._grpSymbolFXMask);
                        this.removeFX();
                        this.showFX();
                    },this);
                }
            });


            // var winBannerTween = game.add.tween(this._grpWinBanner.scale).to( { x:scale, y:scale},500, "Linear", true,0,0);
            // winBannerTween.onComplete.add(function(){
                
            // },this);

        },this);

    };

    this.createCoin = function() {
        if(this._grpCoin!=null){
            this._coinClass = new coinClass(game,this._grpCoin);
            this._coinClass.create();
        }
        else{
            if (this._timerCoin != null) {
                game.time.events.remove(this._timerCoin);
            }
        }
    };

    this.createStar = function() {
        if(this._grpStar!=null){
            this._starClass = new starClass(game,this._grpStar);
            this._starClass.create();
        }
        else{
            if (this._timerStar != null) {
                game.time.events.remove(this._timerStar);
            }
        }
    };


    this.removeFX=function(){
        GlobalClass.deleteChildren(this._grpPoolFX);
        this._tubeFX = null;
        this._dynamiteFX = null;
        this._wireFX = null;
        this._prizeFX = null;
        GlobalClass.deleteChildren(this._grpPoolBanner);
        //this._poolBG = null;
        this._jackpotFont = null;
        this._girl = null;
        GlobalClass.deleteChildren(this._grpWinBanner);
        GlobalClass.deleteChildren(this._grpCoin);
        GlobalClass.deleteChildren(this._grpStar);
        

        if (this._timerFunc != null) {
            game.time.events.remove(this._timerFunc);
        }

        if (this._timerCoin != null) {
            game.time.events.remove(this._timerCoin);
        }
        if (this._timerStar != null) {
            game.time.events.remove(this._timerStar);
        }
    };

    this.checkResolution = function() {
        if (AppConstants.LANDSCAPE) {
            this.createLandscape();
        } else {
            this.createPortrait();
        }
    };

    this.createLandscape = function() {
        this._posLandscapeX = -10;
        if(!game.device.desktop){
            this._posLandscapeX = this._posLandscapeX-23;
        }
        this._grpPosition.x = this._posLandscapeX;
        this._grpPosition.y = this._posLandscapeY;
        //this._grpPosition.scale.set(1,1);
        this.drawScreen();
    };

    this.createPortrait = function() {
        this._grpPosition.x = this._posPortraitX;
        this._grpPosition.y = this._posPortraitY;
        this.drawScreen();
    };
}


