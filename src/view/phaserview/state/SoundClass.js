var soundClass = {
    _soundBGM: null,
    _soundEffect: null,
    _soundJingles: null,
    _soundReel:null,

    playBGM: function (name) {
        if (GlobalClass.GAME_MUSIC) {
            if (this._soundBGM != null) {
                if (name != this._soundBGM.name) {
                    this.stopBGM();
                    this._soundBGM = AppFacadeInstance.game.spineRes[name].sound;
                    this._soundBGM.name = name;
                    PIXI.sound.volume(name,GlobalClass.GAME_SOUND_VOLUME * 0.2);
                    this._soundBGM.play({loop:true});
                }
                else {
                    this.resumeBGM();
                }
            }
            else {
                
                this._soundBGM = AppFacadeInstance.game.spineRes[name].sound;//AppFacadeInstance.game.add.audio(name, GlobalClass.GAME_SOUND_VOLUME * 0.2, true);
                this._soundBGM.name = name;
                PIXI.sound.volume(name,GlobalClass.GAME_SOUND_VOLUME * 0.2);
                this._soundBGM.play({loop:true});
            }
        }
    },
    playSoundReel:function(name){
        if (GlobalClass.GAME_MUSIC) {
            if (this._soundReel != null) {
                if (name != this._soundReel.name) {
                    this.stopBGM();
                    this._soundReel = AppFacadeInstance.game.spineRes[name].sound;
                    this._soundReel.name = name;
                    PIXI.sound.volume(name,GlobalClass.GAME_SOUND_VOLUME * 0.2);
                    this._soundReel.play({loop:true});
                }
                else {
                    this._soundReel.resume();
                }
            }
            else {
                
                this._soundReel = AppFacadeInstance.game.spineRes[name].sound;//AppFacadeInstance.game.add.audio(name, GlobalClass.GAME_SOUND_VOLUME * 0.2, true);
                this._soundReel.name = name;
                PIXI.sound.volume(name,GlobalClass.GAME_SOUND_VOLUME * 0.2);
                this._soundReel.play({loop:true});
            }
        }
    },
    stopSoundReel: function () {
        if (this._soundReel != null) {
            this._soundReel.pause();
        }
    },
    
    stopBGM: function () {
        if (this._soundBGM != null) {
            this._soundBGM.stop();
            this._soundBGM = null;
        }
    },
    pauseBGM: function () {
        if (this._soundBGM != null) {
            this._soundBGM.pause();
        }
    },
    resumeBGM: function () {
        if (this._soundBGM != null) {
            this._soundBGM.resume();
        }
    },
    playJingles: function (name) {
        if (GlobalClass.GAME_SOUND_FX) {
            PIXI.sound.play(name);
        }
    },
    jinglesStopped: function () {
        // AppFacadeInstance.game.time.events.add(500, function () {
        //     if (this._soundBGM != null && this._soundBGM.isPlaying) {
        //         this._soundBGM.volume = GlobalClass.GAME_SOUND_VOLUME;
        //     }
        // }, this);
    },
    playSound: function (name,start) {
        if(!start){
            start = 0;
        }
        if (GlobalClass.GAME_SOUND_ENABLE) {
            PIXI.sound.play(name,{start:start});
        }
    },
    stopSound: function (name) {
        AppFacadeInstance.game.spineRes[name].sound.stop();
    },
};
