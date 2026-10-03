var bootState = {
  preload: function () {
    // this.load.image('oneTouchLogo', 'assets/images/oneTouchLogo.png');
    if (AppConstants.LOADING_PDX) {
      this.load.atlasJSONArray('loadingScreenPDX', 'assets/images/loadingScreen/loadingPdx/loadingscreenpdx.png', 'assets/images/loadingScreen/loadingPdx/loadingscreenpdx.json');
    } else {
      this.load.image('bar', 'assets/images/Bar.png');
      this.load.atlasJSONArray('loadingScreen', 'assets/images/loadingScreen/loadingBwg/loadingBwg.png', 'assets/images/loadingScreen/loadingBwg/loadingBwg.json');
    }
    this.load.atlasJSONArray('uiPanel', 'assets/images/image/uiPanel.png','assets/images/image/uiPanel.json');
    this.load.atlasJSONArray('network', 'assets/images/image/network.png', 'assets/images/image/network.json');
    this.load.start();
  },

  create: function () {
    this.state.start('Preloader');
  }
};
