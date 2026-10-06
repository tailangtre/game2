var coinClass = function(game,group){
  this._grpCoin = null;
  this._sprCoin = null;

  // Gold boar coins burst out of the origin and fall away on an arc (tom 2026-10-04: coins only, quantity and
  // intensity by tier). size: coin scale, power: burst strength (1 = normal).
  this.create = function(size, power){
    size = size || 0.4;
    power = power || 1;
    this._grpCoin = game.add.group();
    group.addChild(this._grpCoin);

    var c = this._sprCoin = game.add.sprite(0, 0, 'ui', 'Coin_01.png', this._grpCoin);
    c.anchor.set(0.5, 0.5);
    c.animations.add('coinAnim', c.animations.generateFrameNames('Coin_', 1, 8, '.png', 2), true, 0.25 + Math.random() * 0.2);
    c.animations.play('coinAnim');
    var anim = c.animations.animations.coinAnim;
    var s0 = size * (0.7 + Math.random() * 0.6);
    var ang = Math.random() * Math.PI * 2;
    var dist = (260 + Math.random() * 420) * power;
    var up = (220 + Math.random() * 260) * power;          // initial upward kick
    var dur = 1.1 + Math.random() * 0.7;
    var p = { t: 0 };
    var self = this;
    TweenMax.to(p, dur, { t: 1, ease: Linear.easeNone,
      onUpdate: function () {
        var t = p.t;
        var x = Math.cos(ang) * dist * t;
        var y = Math.sin(ang) * dist * 0.6 * t - up * t + 900 * t * t;   // gravity arc
        var k = s0 * (0.3 + Math.min(1, t * 4) * 0.7);
        [c, anim].forEach(function (o) { if (o && !o._destroyed) { o.x = x; o.y = y; o.scale.set(k); o.alpha = t > 0.8 ? (1 - t) / 0.2 : 1; } });
      },
      onComplete: function () { self.remove(); } });
  };

  // a coin falling from above the screen, tumbling down past the bottom (group sits at the screen centre)
  this.rain = function(size, w, h){
    this._grpCoin = game.add.group();
    group.addChild(this._grpCoin);
    var c = this._sprCoin = game.add.sprite(0, 0, 'ui', 'Coin_01.png', this._grpCoin);
    c.anchor.set(0.5, 0.5);
    c.animations.add('coinAnim', c.animations.generateFrameNames('Coin_', 1, 8, '.png', 2), true, 0.3 + Math.random() * 0.25);
    c.animations.play('coinAnim');
    var anim = c.animations.animations.coinAnim;
    var x0 = (Math.random() - 0.5) * w, y0 = -h / 2 - 80, y1 = h / 2 + 80;
    var sway = (Math.random() - 0.5) * 120, k = size * (0.6 + Math.random() * 0.7);
    var p = { t: 0 }, self = this;
    TweenMax.to(p, 1.5 + Math.random() * 0.9, { t: 1, ease: Power1.easeIn,
      onUpdate: function () {
        var x = x0 + sway * Math.sin(p.t * Math.PI), y = y0 + (y1 - y0) * p.t;
        [c, anim].forEach(function (o) { if (o && !o._destroyed) { o.x = x; o.y = y; o.scale.set(k); } });
      },
      onComplete: function () { self.remove(); } });
  };

  this.remove = function(){
    if(this._grpCoin != null){
      this._grpCoin.destroy();
    }
    TweenMax.killTweensOf(this._sprCoin);
    this._grpCoin = null;
  };
};
