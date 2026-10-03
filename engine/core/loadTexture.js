// 读取本地资源转换成texture
LoadTexture = function(game) {
	/**
	 * Local reference to game.
	 * @property {Phaser.Game} game
	 * @protected
	 */
	this.game = game;

	/**
	 * Local reference to the Cache.
	 * @property {Cache} cache
	 * @protected
	 */
	this.cache = game.cache;

	/**
	 * If true all calls to Loader.reset will be ignored. Useful if you need to create a load queue before swapping to a preloader state.
	 * @property {boolean} resetLocked
	 * @default
	 */
	this.resetLocked = false;

	/**
	 * True if the Loader is in the process of loading the queue.
	 * @property {boolean} isLoading
	 * @default
	 */
	this.isLoading = false;

	/**
	 * True if all assets in the queue have finished loading.
	 * @property {boolean} hasLoaded
	 * @default
	 */
	this.hasLoaded = false;

	/**
	 * You can optionally link a progress sprite with {@link Loader#setPreloadSprite setPreloadSprite}.
	 *
	 * This property is an object containing: sprite, rect, direction, width and height
	 *
	 * @property {?object} preloadSprite
	 * @protected
	 */
	this.preloadSprite = null;

	/**
	 * The crossOrigin value applied to loaded images. Very often this needs to be set to 'anonymous'.
	 * @property {boolean|string} crossOrigin
	 * @default
	 */
	this.crossOrigin = false;

	/**
	 * If you want to append a URL before the path of any asset you can set this here.
	 * Useful if allowing the asset base url to be configured outside of the game code.
	 * The string _must_ end with a "/".
	 *
	 * @property {string} baseURL
	 */
	this.baseURL = '';

	/**
	 * The value of `path`, if set, is placed before any _relative_ file path given. For example:
	 *
	 * `load.path = "images/sprites/";
	 * load.image("ball", "ball.png");
	 * load.image("tree", "level1/oaktree.png");
	 * load.image("boom", "http://server.com/explode.png");`
	 *
	 * Would load the `ball` file from `images/sprites/ball.png` and the tree from
	 * `images/sprites/level1/oaktree.png` but the file `boom` would load from the URL
	 * given as it's an absolute URL.
	 *
	 * Please note that the path is added before the filename but *after* the baseURL (if set.)
	 *
	 * The string _must_ end with a "/".
	 *
	 * @property {string} path
	 */
	this.path = '';

	/**
	 * Used to map the application mime-types to to the Accept header in XHR requests.
	 * If you don't require these mappings, or they cause problems on your server, then
	 * remove them from the headers object and the XHR request will not try to use them.
	 *
	 * This object can also be used to set the `X-Requested-With` header to 
	 * `XMLHttpRequest` (or any other value you need). To enable this do:
	 *
	 * `this.load.headers.requestedWith = 'XMLHttpRequest'`
	 *
	 * before adding anything to the Loader. The XHR loader will then call:
	 *
	 * `setRequestHeader('X-Requested-With', this.headers['requestedWith'])`
	 * 
	 * @property {object} headers
	 * @default
	 */
	this.headers = {
		"requestedWith": false,
		"json": "application/json",
		"xml": "application/xml"
	};

	/**
	 * This event is dispatched when the loading process starts: before the first file has been requested,
	 * but after all the initial packs have been loaded.
	 *
	 * @property {Signal} onLoadStart
	 */
	this.onLoadStart = new Signal();

	/**
	 * This event is dispatched when the final file in the load queue has either loaded or failed.
	 *
	 * @property {Signal} onLoadComplete
	 */
	this.onLoadComplete = new Signal();

	/**
	 * This event is dispatched when an asset pack has either loaded or failed to load.
	 *
	 * This is called when the asset pack manifest file has loaded and successfully added its contents to the loader queue.
	 *
	 * Params: `(pack key, success?, total packs loaded, total packs)`
	 *
	 * @property {Signal} onPackComplete
	 */
	this.onPackComplete = new Signal();

	/**
	 * This event is dispatched immediately before a file starts loading.
	 * It's possible the file may fail (eg. download error, invalid format) after this event is sent.
	 *
	 * Params: `(progress, file key, file url)`
	 *
	 * @property {Signal} onFileStart
	 */
	this.onFileStart = new Signal();

	/**
	 * This event is dispatched when a file has either loaded or failed to load.
	 *
	 * Any function bound to this will receive the following parameters:
	 *
	 * progress, file key, success?, total loaded files, total files
	 *
	 * Where progress is a number between 1 and 100 (inclusive) representing the percentage of the load.
	 *
	 * @property {Signal} onFileComplete
	 */
	this.onFileComplete = new Signal();

	/**
	 * This event is dispatched when a file (or pack) errors as a result of the load request.
	 *
	 * For files it will be triggered before `onFileComplete`. For packs it will be triggered before `onPackComplete`.
	 *
	 * Params: `(file key, file)`
	 *
	 * @property {Signal} onFileError
	 */
	this.onFileError = new Signal();

	/**
	 * If true and if the browser supports XDomainRequest, it will be used in preference for XHR.
	 *
	 * This is only relevant for IE 9 and should _only_ be enabled for IE 9 clients when required by the server/CDN.
	 *
	 * @property {boolean} useXDomainRequest
	 * @deprecated This is only relevant for IE 9.
	 */
	this.useXDomainRequest = false;

	/**
	 * @private
	 * @property {boolean} _warnedAboutXDomainRequest - Control number of warnings for using XDR outside of IE 9.
	 */
	this._warnedAboutXDomainRequest = false;

	/**
	 * If true (the default) then parallel downloading will be enabled.
	 *
	 * To disable all parallel downloads this must be set to false prior to any resource being loaded.
	 *
	 * @property {boolean} enableParallel
	 */
	this.enableParallel = true;

	/**
	 * The number of concurrent / parallel resources to try and fetch at once.
	 *
	 * Many current browsers limit 6 requests per domain; this is slightly conservative.
	 *
	 * @property {integer} maxParallelDownloads
	 * @protected
	 */
	this.maxParallelDownloads = 4;

	/**
	 * A counter: if more than zero, files will be automatically added as a synchronization point.
	 * @property {integer} _withSyncPointDepth;
	 */
	this._withSyncPointDepth = 0;

	/**
	 * Contains all the information for asset files (including packs) to load.
	 *
	 * File/assets are only removed from the list after all loading completes.
	 *
	 * @property {file[]} _fileList
	 * @private
	 */
	this._fileList = [];

	/**
	 * Inflight files (or packs) that are being fetched/processed.
	 *
	 * This means that if there are any files in the flight queue there should still be processing
	 * going on; it should only be empty before or after loading.
	 *
	 * The files in the queue may have additional properties added to them,
	 * including `requestObject` which is normally the associated XHR.
	 *
	 * @property {file[]} _flightQueue
	 * @private
	 */
	this._flightQueue = [];

	/**
	 * The offset into the fileList past all the complete (loaded or error) entries.
	 *
	 * @property {integer} _processingHead
	 * @private
	 */
	this._processingHead = 0;

	/**
	 * True when the first file (not pack) has loading started.
	 * This used to to control dispatching `onLoadStart` which happens after any initial packs are loaded.
	 *
	 * @property {boolean} _initialPacksLoaded
	 * @private
	 */
	this._fileLoadStarted = false;

	/**
	 * Total packs seen - adjusted when a pack is added.
	 * @property {integer} _totalPackCount
	 * @private
	 */
	this._totalPackCount = 0;

	/**
	 * Total files seen - adjusted when a file is added.
	 * @property {integer} _totalFileCount
	 * @private
	 */
	this._totalFileCount = 0;

	/**
	 * Total packs loaded - adjusted just prior to `onPackComplete`.
	 * @property {integer} _loadedPackCount
	 * @private
	 */
	this._loadedPackCount = 0;

	/**
	 * Total files loaded - adjusted just prior to `onFileComplete`.
	 * @property {integer} _loadedFileCount
	 * @private
	 */
	this._loadedFileCount = 0;
	//_checkBrowser();

}



/**
 * @constant
 * @type {number}
 */
LoadTexture.TEXTURE_ATLAS_JSON_ARRAY = 0;

/**
 * @constant
 * @type {number}
 */
LoadTexture.TEXTURE_ATLAS_JSON_HASH = 1;

/**
 * @constant
 * @type {number}
 */
LoadTexture.TEXTURE_ATLAS_XML_STARLING = 2;

/**
 * @constant
 * @type {number}
 */
LoadTexture.PHYSICS_LIME_CORONA_JSON = 3;

/**
 * @constant
 * @type {number}
 */
LoadTexture.PHYSICS_PHASER_JSON = 4;

/**
 * @constant
 * @type {number}
 */
LoadTexture.TEXTURE_ATLAS_JSON_PYXEL = 5;



LoadTexture.prototype = {
	/**
	 * Set a Sprite to be a "preload" sprite by passing it to this method.
	 *
	 * A "preload" sprite will have its width or height crop adjusted based on the percentage of the loader in real-time.
	 * This allows you to easily make loading bars for games.
	 *
	 * The sprite will automatically be made visible when calling this.
	 *
	 * @method Phaser.Loader#setPreloadSprite
	 * @param {Phaser.Sprite|Phaser.Image} sprite - The sprite or image that will be cropped during the load.
	 * @param {number} [direction=0] - A value of zero means the sprite will be cropped horizontally, a value of 1 means its will be cropped vertically.
	 */
	setPreloadSprite: function(sprite, direction) {

		direction = direction || 0;

		this.preloadSprite = {
			sprite: sprite,
			direction: direction,
			width: sprite.width,
			height: sprite.height,
			rect: null
		};

		if (direction === 0) {
			//  Horizontal rect
			this.preloadSprite.rect = new Rectangle(0, 0, 1, sprite.height);
		} else {
			//  Vertical rect
			this.preloadSprite.rect = new Rectangle(0, 0, sprite.width, 1);
		}
		//this.preloadSprite.sprite.texture.frame=this.preloadSprite.rect
		sprite.crop(this.preloadSprite.rect);

		sprite.visible = true;

	},

	/**
	 * Called automatically by ScaleManager when the game resizes in RESIZE scalemode.
	 *
	 * This can be used to adjust the preloading sprite size, eg.
	 *
	 * @method Phaser.Loader#resize
	 * @protected
	 */
	resize: function() {

		if (this.preloadSprite && this.preloadSprite.height !== this.preloadSprite.sprite.height) {
			this.preloadSprite.rect.height = this.preloadSprite.sprite.height;
		}

	},

	/**
	 * Check whether a file/asset with a specific key is queued to be loaded.
	 *
	 * To access a loaded asset use Phaser.Cache, eg. {@link Phaser.Cache#checkImageKey}
	 *
	 * @method Phaser.Loader#checkKeyExists
	 * @param {string} type - The type asset you want to check.
	 * @param {string} key - Key of the asset you want to check.
	 * @return {boolean} Return true if exists, otherwise return false.
	 */
	checkKeyExists: function(type, key) {

		return this.getAssetIndex(type, key) > -1;

	},

	/**
	 * Get the queue-index of the file/asset with a specific key.
	 *
	 * Only assets in the download file queue will be found.
	 *
	 * @method Phaser.Loader#getAssetIndex
	 * @param {string} type - The type asset you want to check.
	 * @param {string} key - Key of the asset you want to check.
	 * @return {number} The index of this key in the filelist, or -1 if not found.
	 *     The index may change and should only be used immediately following this call
	 */
	getAssetIndex: function(type, key) {

		var bestFound = -1;

		for (var i = 0; i < this._fileList.length; i++) {
			var file = this._fileList[i];

			if (file.type === type && file.key === key) {
				bestFound = i;

				// An already loaded/loading file may be superceded.
				if (!file.loaded && !file.loading) {
					break;
				}
			}
		}

		return bestFound;

	},

	/**
	 * Find a file/asset with a specific key.
	 *
	 * Only assets in the download file queue will be found.
	 *
	 * @method Phaser.Loader#getAsset
	 * @param {string} type - The type asset you want to check.
	 * @param {string} key - Key of the asset you want to check.
	 * @return {any} Returns an object if found that has 2 properties: `index` and `file`; otherwise a non-true value is returned.
	 *     The index may change and should only be used immediately following this call.
	 */
	getAsset: function(type, key) {

		var fileIndex = this.getAssetIndex(type, key);

		if (fileIndex > -1) {
			return {
				index: fileIndex,
				file: this._fileList[fileIndex]
			};
		}

		return false;

	},

	/**
	 * Reset the loader and clear any queued assets. If `Loader.resetLocked` is true this operation will abort.
	 *
	 * This will abort any loading and clear any queued assets.
	 *
	 * Optionally you can clear any associated events.
	 *
	 * @method Phaser.Loader#reset
	 * @protected
	 * @param {boolean} [hard=false] - If true then the preload sprite and other artifacts may also be cleared.
	 * @param {boolean} [clearEvents=false] - If true then the all Loader signals will have removeAll called on them.
	 */
	reset: function(hard, clearEvents) {

		if (clearEvents === undefined) {
			clearEvents = false;
		}

		if (this.resetLocked) {
			return;
		}

		if (hard) {
			this.preloadSprite = null;
		}

		this.isLoading = false;

		this._processingHead = 0;
		this._fileList.length = 0;
		this._flightQueue.length = 0;

		this._fileLoadStarted = false;
		this._totalFileCount = 0;
		this._totalPackCount = 0;
		this._loadedPackCount = 0;
		this._loadedFileCount = 0;

		if (clearEvents) {
			this.onLoadStart.removeAll();
			this.onLoadComplete.removeAll();
			this.onPackComplete.removeAll();
			this.onFileStart.removeAll();
			this.onFileComplete.removeAll();
			this.onFileError.removeAll();
		}

	},

	/**
	 * Internal function that adds a new entry to the file list. Do not call directly.
	 *
	 * @method Phaser.Loader#addToFileList
	 * @protected
	 * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
	 * @param {string} key - The unique Cache ID key of this resource.
	 * @param {string} [url] - The URL the asset will be loaded from.
	 * @param {object} [properties=(none)] - Any additional properties needed to load the file. These are added directly to the added file object and overwrite any defaults.
	 * @param {boolean} [overwrite=false] - If true then this will overwrite a file asset of the same type/key. Otherwise it will only add a new asset. If overwrite is true, and the asset is already being loaded (or has been loaded), then it is appended instead.
	 * @param {string} [extension] - If no URL is given the Loader will sometimes auto-generate the URL based on the key, using this as the extension.
	 * @return {Phaser.Loader} This instance of the Phaser Loader.
	 */
	addToFileList: function(type, key, url, properties, overwrite, extension) {

		if (overwrite === undefined) {
			overwrite = false;
		}

		if (key === undefined || key === '') {
			console.warn("Phaser.Loader: Invalid or no key given of type " + type);
			return this;
		}

		if (url === undefined || url === null) {
			if (extension) {
				url = key + extension;
			} else {
				console.warn("Phaser.Loader: No URL given for file type: " + type + " key: " + key);
				return this;
			}
		}

		var file = {
			type: type,
			key: key,
			path: this.path,
			url: url,
			syncPoint: this._withSyncPointDepth > 0,
			data: null,
			loading: false,
			loaded: false,
			error: false
		};

		if (properties) {
			for (var prop in properties) {
				file[prop] = properties[prop];
			}
		}

		var fileIndex = this.getAssetIndex(type, key);

		if (overwrite && fileIndex > -1) {
			var currentFile = this._fileList[fileIndex];

			if (!currentFile.loading && !currentFile.loaded) {
				this._fileList[fileIndex] = file;
			} else {
				this._fileList.push(file);
				this._totalFileCount++;
			}
		} else if (fileIndex === -1) {
			this._fileList.push(file);
			this._totalFileCount++;
		}

		return this;

	},

	/**
	 * Internal function that replaces an existing entry in the file list with a new one. Do not call directly.
	 *
	 * @method Phaser.Loader#replaceInFileList
	 * @protected
	 * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
	 * @param {string} key - The unique Cache ID key of this resource.
	 * @param {string} url - The URL the asset will be loaded from.
	 * @param {object} properties - Any additional properties needed to load the file.
	 */
	replaceInFileList: function(type, key, url, properties) {

		return this.addToFileList(type, key, url, properties, true);

	},

	/**
	 * Add a JSON resource pack ('packfile') to the Loader.
	 *
	 * A packfile is a JSON file that contains a list of assets to the be loaded.
	 * Please see the example 'loader/asset pack' in the Phaser Examples repository.
	 *
	 * Packs are always put before the first non-pack file that is not loaded / loading.
	 *
	 * This means that all packs added before any loading has started are added to the front
	 * of the file queue, in the order added.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * The URL of the packfile can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * @method Phaser.Loader#pack
	 * @param {string} key - Unique asset key of this resource pack.
	 * @param {string} [url] - URL of the Asset Pack JSON file. If you wish to pass a json object instead set this to null and pass the object as the data parameter.
	 * @param {object} [data] - The Asset Pack JSON data. Use this to pass in a json data object rather than loading it from a URL. TODO
	 * @param {object} [callbackContext=(loader)] - Some Loader operations, like Binary and Script require a context for their callbacks. Pass the context here.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	pack: function(key, url, data, callbackContext) {
		if (url === undefined) {
			url = null;
		}
		if (data === undefined) {
			data = null;
		}
		if (callbackContext === undefined) {
			callbackContext = null;
		}

		if (!url && !data) {
			console.warn('LoadTexture.pack - Both url and data are null. One must be set.');

			return this;
		}

		var pack = {
			type: 'packfile',
			key: key,
			url: url,
			path: this.path,
			syncPoint: true,
			data: null,
			loading: false,
			loaded: false,
			error: false,
			callbackContext: callbackContext
		};

		//  A data object has been given
		if (data) {
			if (typeof data === 'string') {
				data = JSON.parse(data);
			}

			pack.data = data || {};

			//  Already consider 'loaded'
			pack.loaded = true;
		}

		// Add before first non-pack/no-loaded ~ last pack from start prior to loading
		// (Read one past for splice-to-end)
		for (var i = 0; i < this._fileList.length + 1; i++) {
			var file = this._fileList[i];

			if (!file || (!file.loaded && !file.loading && file.type !== 'packfile')) {
				this._fileList.splice(i, 0, pack);
				this._totalPackCount++;
				break;
			}
		}

		return this;

	},

	/**
	 * Adds an Image to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the image via `Cache.getImage(key)`
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#image
	 * @param {string} key - Unique asset key of this image file.
	 * @param {string} [url] - URL of an image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	image: function(key, url, overwrite) {

		return this.addToFileList('image', key, url, undefined, overwrite, '.png');

	},

	/**
	 * Adds an array of images to the current load queue.
	 *
	 * It works by passing each element of the array to the Loader.image method.
	 *
	 * The files are **not** loaded immediately after calling this method. The files are added to the queue ready to be loaded when the loader starts.
	 *
	 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
	 *
	 * The keys must be unique Strings. They are used to add the files to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the images via `Cache.getImage(key)`
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#images
	 * @param {array} keys - An array of unique asset keys of the image files.
	 * @param {array} [urls] - Optional array of URLs. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png". If provided the URLs array length must match the keys array length.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	images: function(keys, urls) {

		if (Array.isArray(urls)) {
			for (var i = 0; i < keys.length; i++) {
				this.image(keys[i], urls[i]);
			}
		} else {
			for (var i = 0; i < keys.length; i++) {
				this.image(keys[i]);
			}
		}

		return this;

	},

	/**
	 * Adds a Text file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getText(key)`
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.txt". It will always add `.txt` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#text
	 * @param {string} key - Unique asset key of the text file.
	 * @param {string} [url] - URL of the text file. If undefined or `null` the url will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
	 * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	text: function(key, url, overwrite) {

		return this.addToFileList('text', key, url, undefined, overwrite, '.txt');

	},

	/**
	 * Adds a JSON file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getJSON(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.json". It will always add `.json` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#json
	 * @param {string} key - Unique asset key of the json file.
	 * @param {string} [url] - URL of the JSON file. If undefined or `null` the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
	 * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	json: function(key, url, overwrite) {

		return this.addToFileList('json', key, url, undefined, overwrite, '.json');

	},

	/**
	 * Adds a fragment shader file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getShader(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "blur"
	 * and no URL is given then the Loader will set the URL to be "blur.frag". It will always add `.frag` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#shader
	 * @param {string} key - Unique asset key of the fragment file.
	 * @param {string} [url] - URL of the fragment file. If undefined or `null` the url will be set to `<key>.frag`, i.e. if `key` was "blur" then the URL will be "blur.frag".
	 * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	shader: function(key, url, overwrite) {

		return this.addToFileList('shader', key, url, undefined, overwrite, '.frag');

	},

	/**
	 * Adds an XML file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getXML(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.xml". It will always add `.xml` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#xml
	 * @param {string} key - Unique asset key of the xml file.
	 * @param {string} [url] - URL of the XML file. If undefined or `null` the url will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
	 * @param {boolean} [overwrite=false] - If an unloaded file with a matching key already exists in the queue, this entry will overwrite it.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	xml: function(key, url, overwrite) {

		return this.addToFileList('xml', key, url, undefined, overwrite, '.xml');

	},

	/**
	 * Adds a JavaScript file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.js". It will always add `.js` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * Upon successful load the JavaScript is automatically turned into a script tag and executed, so be careful what you load!
	 *
	 * A callback, which will be invoked as the script tag has been created, can also be specified.
	 * The callback must return relevant `data`.
	 *
	 * @method Phaser.Loader#script
	 * @param {string} key - Unique asset key of the script file.
	 * @param {string} [url] - URL of the JavaScript file. If undefined or `null` the url will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
	 * @param {function} [callback=(none)] - Optional callback that will be called after the script tag has loaded, so you can perform additional processing.
	 * @param {object} [callbackContext=(loader)] - The context under which the callback will be applied. If not specified it will use the Phaser Loader as the context.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	script: function(key, url, callback, callbackContext) {

		if (callback === undefined) {
			callback = false;
		}

		if (callback !== false && callbackContext === undefined) {
			callbackContext = this;
		}

		return this.addToFileList('script', key, url, {
			syncPoint: true,
			callback: callback,
			callbackContext: callbackContext
		}, false, '.js');

	},

	/**
	 * Adds a binary file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getBinary(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.bin". It will always add `.bin` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * It will be loaded via xhr with a responseType of "arraybuffer". You can specify an optional callback to process the file after load.
	 * When the callback is called it will be passed 2 parameters: the key of the file and the file data.
	 *
	 * WARNING: If a callback is specified the data will be set to whatever it returns. Always return the data object, even if you didn't modify it.
	 *
	 * @method Phaser.Loader#binary
	 * @param {string} key - Unique asset key of the binary file.
	 * @param {string} [url] - URL of the binary file. If undefined or `null` the url will be set to `<key>.bin`, i.e. if `key` was "alien" then the URL will be "alien.bin".
	 * @param {function} [callback=(none)] - Optional callback that will be passed the file after loading, so you can perform additional processing on it.
	 * @param {object} [callbackContext] - The context under which the callback will be applied. If not specified it will use the callback itself as the context.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	binary: function(key, url, callback, callbackContext) {

		if (callback === undefined) {
			callback = false;
		}

		// Why is the default callback context the ..callback?
		if (callback !== false && callbackContext === undefined) {
			callbackContext = callback;
		}

		return this.addToFileList('binary', key, url, {
			callback: callback,
			callbackContext: callbackContext
		}, false, '.bin');

	},

	/**
	 * Adds a Sprite Sheet to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * To clarify the terminology that Phaser uses: A Sprite Sheet is an image containing frames, usually of an animation, that are all equal
	 * dimensions and often in sequence. For example if the frame size is 32x32 then every frame in the sprite sheet will be that size.
	 * Sometimes (outside of Phaser) the term "sprite sheet" is used to refer to a texture atlas.
	 * A Texture Atlas works by packing together images as best it can, using whatever frame sizes it likes, often with cropping and trimming
	 * the frames in the process. Software such as Texture Packer, Flash CC or Shoebox all generate texture atlases, not sprite sheets.
	 * If you've got an atlas then use `Loader.atlas` instead.
	 *
	 * The key must be a unique String. It is used to add the image to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getImage(key)`. Sprite sheets, being image based, live in the same Cache as all other Images.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
	 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension.
	 * If you do not desire this action then provide a URL.
	 *
	 * @method Phaser.Loader#spritesheet
	 * @param {string} key - Unique asset key of the sheet file.
	 * @param {string} url - URL of the sprite sheet file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {number} frameWidth - Width in pixels of a single frame in the sprite sheet.
	 * @param {number} frameHeight - Height in pixels of a single frame in the sprite sheet.
	 * @param {number} [frameMax=-1] - How many frames in this sprite sheet. If not specified it will divide the whole image into frames.
	 * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
	 * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	spritesheet: function(key, url, frameWidth, frameHeight, frameMax, margin, spacing) {

		if (frameMax === undefined) {
			frameMax = -1;
		}
		if (margin === undefined) {
			margin = 0;
		}
		if (spacing === undefined) {
			spacing = 0;
		}

		return this.addToFileList('spritesheet', key, url, {
			frameWidth: frameWidth,
			frameHeight: frameHeight,
			frameMax: frameMax,
			margin: margin,
			spacing: spacing
		}, false, '.png');

	},

	/**
	 * Adds an audio file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getSound(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * Mobile warning: There are some mobile devices (certain iPad 2 and iPad Mini revisions) that cannot play 48000 Hz audio.
	 * When they try to play the audio becomes extremely distorted and buzzes, eventually crashing the sound system.
	 * The solution is to use a lower encoding rate such as 44100 Hz.
	 *
	 * @method Phaser.Loader#audio
	 * @param {string} key - Unique asset key of the audio file.
	 * @param {string|string[]|object[]} urls - Either a single string or an array of URIs or pairs of `{uri: .., type: ..}`.
	 *    If an array is specified then the first URI (or URI + mime pair) that is device-compatible will be selected.
	 *    For example: `"jump.mp3"`, `['jump.mp3', 'jump.ogg', 'jump.m4a']`, or `[{uri: "data:<opus_resource>", type: 'opus'}, 'fallback.mp3']`.
	 *    BLOB and DATA URIs can be used but only support automatic detection when used in the pair form; otherwise the format must be manually checked before adding the resource.
	 * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
	 *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	audio: function(key, urls, autoDecode) {

		// 		if (this.game.sound.noAudio) {
		// 			return this;
		// 		}

		if (autoDecode === undefined) {
			autoDecode = true;
		}

		if (typeof urls === 'string') {
			urls = [urls];
		}

		return this.addToFileList('audio', key, urls, {
			buffer: null,
			autoDecode: autoDecode
		});

	},

	/**
	 * Adds an audio sprite file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Audio Sprites are a combination of audio files and a JSON configuration.
	 *
	 * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
	 *
	 * Retrieve the file via `Cache.getSoundData(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * @method Phaser.Loader#audioSprite
	 * @param {string} key - Unique asset key of the audio file.
	 * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'audiosprite.mp3', 'audiosprite.ogg', 'audiosprite.m4a' ] or a single string containing just one URL.
	 * @param {string} [jsonURL=null] - The URL of the audiosprite configuration JSON object. If you wish to pass the data directly set this parameter to null.
	 * @param {string|object} [jsonData=null] - A JSON object or string containing the audiosprite configuration data. This is ignored if jsonURL is not null.
	 * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
	 *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	audioSprite: function(key, urls, jsonURL, jsonData, autoDecode) {

		// 		if (this.game.sound.noAudio) {
		// 			return this;
		// 		}

		if (jsonURL === undefined) {
			jsonURL = null;
		}
		if (jsonData === undefined) {
			jsonData = null;
		}
		if (autoDecode === undefined) {
			autoDecode = true;
		}
		
		if (jsonURL) {
			this.json(key + '-audioatlas', jsonURL);
		} else if (jsonData) {
			if (typeof jsonData === 'string') {
				jsonData = JSON.parse(jsonData);
			}
		
			this.cache.addJSON(key + '-audioatlas', '', jsonData);
		} else {
			console.warn('LoadTexture.audiosprite - You must specify either a jsonURL or provide a jsonData object');
		}
		
		this.audio(key, urls, autoDecode);

		

		return this;

	},

	/**
	 * A legacy alias for Loader.audioSprite. Please see that method for documentation.
	 *
	 * @method Phaser.Loader#audiosprite
	 * @param {string} key - Unique asset key of the audio file.
	 * @param {Array|string} urls - An array containing the URLs of the audio files, i.e.: [ 'audiosprite.mp3', 'audiosprite.ogg', 'audiosprite.m4a' ] or a single string containing just one URL.
	 * @param {string} [jsonURL=null] - The URL of the audiosprite configuration JSON object. If you wish to pass the data directly set this parameter to null.
	 * @param {string|object} [jsonData=null] - A JSON object or string containing the audiosprite configuration data. This is ignored if jsonURL is not null.
	 * @param {boolean} [autoDecode=true] - When using Web Audio the audio files can either be decoded at load time or run-time.
	 *    Audio files can't be played until they are decoded and, if specified, this enables immediate decoding. Decoding is a non-blocking async process, however it consumes huge amounts of CPU time on mobiles especially.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	audiosprite: function(key, urls, jsonURL, jsonData, autoDecode) {

		return this.audioSprite(key, urls, jsonURL, jsonData, autoDecode);

	},

	/**
	 * Adds a video file to the current load queue.
	 *
	 * The file is **not** loaded immediately after calling this method. The file is added to the queue ready to be loaded when the loader starts.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getVideo(key)`.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * You don't need to preload a video in order to play it in your game. See `Video.createVideoFromURL` for details.
	 *
	 * @method Phaser.Loader#video
	 * @param {string} key - Unique asset key of the video file.
	 * @param {string|string[]|object[]} urls - Either a single string or an array of URIs or pairs of `{uri: .., type: ..}`.
	 *    If an array is specified then the first URI (or URI + mime pair) that is device-compatible will be selected.
	 *    For example: `"boom.mp4"`, `['boom.mp4', 'boom.ogg', 'boom.webm']`, or `[{uri: "data:<opus_resource>", type: 'opus'}, 'fallback.mp4']`.
	 *    BLOB and DATA URIs can be used but only support automatic detection when used in the pair form; otherwise the format must be manually checked before adding the resource.
	 * @param {string} [loadEvent='canplaythrough'] - This sets the Video source event to listen for before the load is considered complete.
	 *    'canplaythrough' implies the video has downloaded enough, and bandwidth is high enough that it can be played to completion.
	 *    'canplay' implies the video has downloaded enough to start playing, but not necessarily to finish.
	 *    'loadeddata' just makes sure that the video meta data and first frame have downloaded. Phaser uses this value automatically if the
	 *    browser is detected as being Firefox and no `loadEvent` is given, otherwise it defaults to `canplaythrough`.
	 * @param {boolean} [asBlob=false] - Video files can either be loaded via the creation of a video element which has its src property set.
	 *    Or they can be loaded via xhr, stored as binary data in memory and then converted to a Blob. This isn't supported in IE9 or Android 2.
	 *    If you need to have the same video playing at different times across multiple Sprites then you need to load it as a Blob.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	video: function(key, urls, loadEvent, asBlob) {

		if (loadEvent === undefined) {
			if (this.game.device.firefox) {
				loadEvent = 'loadeddata';
			} else {
				loadEvent = 'canplaythrough';
			}
		}

		if (asBlob === undefined) {
			asBlob = false;
		}

		if (typeof urls === 'string') {
			urls = [urls];
		}

		return this.addToFileList('video', key, urls, {
			buffer: null,
			asBlob: asBlob,
			loadEvent: loadEvent
		});

	},

	/**
	 * Adds a Tile Map data file to the current load queue.
	 *
	 * Phaser can load data in two different formats: CSV and Tiled JSON.
	 * 
	 * Tiled is a free software package, specifically for creating tilemaps, and is available from http://www.mapeditor.org
	 *
	 * You can choose to either load the data externally, by providing a URL to a json file.
	 * Or you can pass in a JSON object or String via the `data` parameter.
	 * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
	 *
	 * If a URL is provided the file is **not** loaded immediately after calling this method, but is added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getTilemapData(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified and no data is given then the Loader will take the key and create a filename from that.
	 * For example if the key is "level1" and no URL or data is given then the Loader will set the URL to be "level1.json".
	 * If you set the format to be Tilemap.CSV it will set the URL to be "level1.csv" instead.
	 *
	 * If you do not desire this action then provide a URL or data object.
	 *
	 * @method Phaser.Loader#tilemap
	 * @param {string} key - Unique asset key of the tilemap data.
	 * @param {string} [url] - URL of the tile map file. If undefined or `null` and no data is given the url will be set to `<key>.json`, i.e. if `key` was "level1" then the URL will be "level1.json".
	 * @param {object|string} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for map data instead.
	 * @param {number} [format=Phaser.Tilemap.CSV] - The format of the map data. Either Phaser.Tilemap.CSV or Phaser.Tilemap.TILED_JSON.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	tilemap: function(key, url, data, format) {

		if (url === undefined) {
			url = null;
		}
		if (data === undefined) {
			data = null;
		}
		if (format === undefined) {
			format = Phaser.Tilemap.CSV;
		}

		if (!url && !data) {
			if (format === Phaser.Tilemap.CSV) {
				url = key + '.csv';
			} else {
				url = key + '.json';
			}
		}

		//  A map data object has been given
		if (data) {
			switch (format) {
				//  A csv string or object has been given
				case Phaser.Tilemap.CSV:
					break;

					//  A json string or object has been given
				case Phaser.Tilemap.TILED_JSON:

					if (typeof data === 'string') {
						data = JSON.parse(data);
					}
					break;
			}

			this.cache.addTilemap(key, null, data, format);
		} else {
			this.addToFileList('tilemap', key, url, {
				format: format
			});
		}

		return this;

	},

	/**
	 * Adds a physics data file to the current load queue.
	 *
	 * The data must be in `Lime + Corona` JSON format. [Physics Editor](https://www.codeandweb.com) by code'n'web exports in this format natively.
	 *
	 * You can choose to either load the data externally, by providing a URL to a json file.
	 * Or you can pass in a JSON object or String via the `data` parameter.
	 * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
	 *
	 * If a URL is provided the file is **not** loaded immediately after calling this method, but is added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getJSON(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the text file as needed.
	 *
	 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the URL isn't specified and no data is given then the Loader will take the key and create a filename from that.
	 * For example if the key is "alien" and no URL or data is given then the Loader will set the URL to be "alien.json".
	 * It will always use `.json` as the extension.
	 *
	 * If you do not desire this action then provide a URL or data object.
	 *
	 * @method Phaser.Loader#physics
	 * @param {string} key - Unique asset key of the physics json data.
	 * @param {string} [url] - URL of the physics data file. If undefined or `null` and no data is given the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
	 * @param {object|string} [data] - An optional JSON data object. If given then the url is ignored and this JSON object is used for physics data instead.
	 * @param {string} [format=Phaser.Physics.LIME_CORONA_JSON] - The format of the physics data.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	physics: function(key, url, data, format) {

		if (url === undefined) {
			url = null;
		}
		if (data === undefined) {
			data = null;
		}
		if (format === undefined) {
			format = Phaser.Physics.LIME_CORONA_JSON;
		}

		if (!url && !data) {
			url = key + '.json';
		}

		//  A map data object has been given
		if (data) {
			if (typeof data === 'string') {
				data = JSON.parse(data);
			}

			this.cache.addPhysicsData(key, null, data, format);
		} else {
			this.addToFileList('physics', key, url, {
				format: format
			});
		}

		return this;

	},

	/**
	 * Adds Bitmap Font files to the current load queue.
	 *
	 * To create the Bitmap Font files you can use:
	 *
	 * BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
	 * Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
	 * Littera (Web-based, free): http://kvazars.com/littera/
	 *
	 * You can choose to either load the data externally, by providing a URL to an xml file.
	 * Or you can pass in an XML object or String via the `xmlData` parameter.
	 * If you pass a String the data is automatically run through `Loader.parseXML` and then immediately added to the Phaser.Cache.
	 *
	 * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getBitmapFont(key)`. XML files are automatically parsed upon load.
	 * If you need to control when the XML is parsed then use `Loader.text` instead and parse the XML file as needed.
	 *
	 * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
	 * For example if the key is "megaFont" and textureURL is null then the Loader will set the URL to be "megaFont.png".
	 * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
	 * set the atlasURL to be the key. For example if the key is "megaFont" the atlasURL will be set to "megaFont.xml".
	 *
	 * If you do not desire this action then provide URLs and / or a data object.
	 *
	 * @method Phaser.Loader#bitmapFont
	 * @param {string} key - Unique asset key of the bitmap font.
	 * @param {string} textureURL -  URL of the Bitmap Font texture file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "megaFont" then the URL will be "megaFont.png".
	 * @param {string} atlasURL - URL of the Bitmap Font atlas file (xml/json). If undefined or `null` AND `atlasData` is null, the url will be set to `<key>.xml`, i.e. if `key` was "megaFont" then the URL will be "megaFont.xml".
	 * @param {object} atlasData - An optional Bitmap Font atlas in string form (stringified xml/json).
	 * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
	 * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	bitmapFont: function(key, textureURL, atlasURL, atlasData, xSpacing, ySpacing) {

		if (textureURL === undefined || textureURL === null) {
			textureURL = key + '.png';
		}

		if (atlasURL === undefined) {
			atlasURL = null;
		}
		if (atlasData === undefined) {
			atlasData = null;
		}

		if (atlasURL === null && atlasData === null) {
			atlasURL = key + '.xml';
		}

		if (xSpacing === undefined) {
			xSpacing = 0;
		}
		if (ySpacing === undefined) {
			ySpacing = 0;
		}

		//  A URL to a json/xml atlas has been given
		if (atlasURL) {
			this.addToFileList('bitmapfont', key, textureURL, {
				atlasURL: atlasURL,
				xSpacing: xSpacing,
				ySpacing: ySpacing
			});
		} else {
			//  A stringified xml/json atlas has been given
			if (typeof atlasData === 'string') {
				var json, xml;

				try {
					json = JSON.parse(atlasData);
				} catch (e) {
					xml = this.parseXml(atlasData);
				}

				if (!xml && !json) {
					throw new Error("LoadTexture. Invalid Bitmap Font atlas given");
				}

				this.addToFileList('bitmapfont', key, textureURL, {
					atlasURL: null,
					atlasData: json || xml,
					atlasType: (!!json ? 'json' : 'xml'),
					xSpacing: xSpacing,
					ySpacing: ySpacing
				});
			}
		}

		return this;

	},

	/**
	 * Adds a Texture Atlas file to the current load queue.
	 *
	 * Unlike `Loader.atlasJSONHash` this call expects the atlas data to be in a JSON Array format.
	 *
	 * To create the Texture Atlas you can use tools such as:
	 *
	 * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
	 * [Shoebox](http://renderhjs.net/shoebox/)
	 *
	 * If using Texture Packer we recommend you enable "Trim sprite names".
	 * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
	 *
	 * You can choose to either load the data externally, by providing a URL to a json file.
	 * Or you can pass in a JSON object or String via the `atlasData` parameter.
	 * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
	 *
	 * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
	 *
	 * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
	 * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
	 * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
	 * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
	 *
	 * If you do not desire this action then provide URLs and / or a data object.
	 *
	 * @method Phaser.Loader#atlasJSONArray
	 * @param {string} key - Unique asset key of the texture atlas file.
	 * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
	 * @param {object} [atlasData] - A JSON data object. You don't need this if the data is being loaded from a URL.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	atlasJSONArray: function(key, textureURL, atlasURL, atlasData) {

		return this.atlas(key, textureURL, atlasURL, atlasData, LoadTexture.TEXTURE_ATLAS_JSON_ARRAY);

	},

	/**
	 * Adds a Texture Atlas file to the current load queue.
	 *
	 * Unlike `Loader.atlas` this call expects the atlas data to be in a JSON Hash format.
	 *
	 * To create the Texture Atlas you can use tools such as:
	 *
	 * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
	 * [Shoebox](http://renderhjs.net/shoebox/)
	 *
	 * If using Texture Packer we recommend you enable "Trim sprite names".
	 * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
	 *
	 * You can choose to either load the data externally, by providing a URL to a json file.
	 * Or you can pass in a JSON object or String via the `atlasData` parameter.
	 * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
	 *
	 * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
	 *
	 * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
	 * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
	 * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
	 * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
	 *
	 * If you do not desire this action then provide URLs and / or a data object.
	 *
	 * @method Phaser.Loader#atlasJSONHash
	 * @param {string} key - Unique asset key of the texture atlas file.
	 * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
	 * @param {object} [atlasData] - A JSON data object. You don't need this if the data is being loaded from a URL.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	atlasJSONHash: function(key, textureURL, atlasURL, atlasData) {

		return this.atlas(key, textureURL, atlasURL, atlasData, LoadTexture.TEXTURE_ATLAS_JSON_HASH);

	},

	/**
	 * Adds a Texture Atlas file to the current load queue.
	 *
	 * This call expects the atlas data to be in the Starling XML data format.
	 *
	 * To create the Texture Atlas you can use tools such as:
	 *
	 * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
	 * [Shoebox](http://renderhjs.net/shoebox/)
	 *
	 * If using Texture Packer we recommend you enable "Trim sprite names".
	 * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
	 *
	 * You can choose to either load the data externally, by providing a URL to an xml file.
	 * Or you can pass in an XML object or String via the `atlasData` parameter.
	 * If you pass a String the data is automatically run through `Loader.parseXML` and then immediately added to the Phaser.Cache.
	 *
	 * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getImage(key)`. XML files are automatically parsed upon load.
	 * If you need to control when the XML is parsed then use `Loader.text` instead and parse the XML file as needed.
	 *
	 * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
	 * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
	 * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
	 * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.xml".
	 *
	 * If you do not desire this action then provide URLs and / or a data object.
	 *
	 * @method Phaser.Loader#atlasXML
	 * @param {string} key - Unique asset key of the texture atlas file.
	 * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.xml".
	 * @param {object} [atlasData] - An XML data object. You don't need this if the data is being loaded from a URL.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	atlasXML: function(key, textureURL, atlasURL, atlasData) {

		if (atlasURL === undefined) {
			atlasURL = null;
		}
		if (atlasData === undefined) {
			atlasData = null;
		}

		if (!atlasURL && !atlasData) {
			atlasURL = key + '.xml';
		}

		return this.atlas(key, textureURL, atlasURL, atlasData, LoadTexture.TEXTURE_ATLAS_XML_STARLING);

	},

	/**
	 * Adds a Texture Atlas file to the current load queue.
	 *
	 * To create the Texture Atlas you can use tools such as:
	 *
	 * [Texture Packer](https://www.codeandweb.com/texturepacker/phaser)
	 * [Shoebox](http://renderhjs.net/shoebox/)
	 *
	 * If using Texture Packer we recommend you enable "Trim sprite names".
	 * If your atlas software has an option to "rotate" the resulting frames, you must disable it.
	 *
	 * You can choose to either load the data externally, by providing a URL to a json file.
	 * Or you can pass in a JSON object or String via the `atlasData` parameter.
	 * If you pass a String the data is automatically run through `JSON.parse` and then immediately added to the Phaser.Cache.
	 *
	 * If URLs are provided the files are **not** loaded immediately after calling this method, but are added to the load queue.
	 *
	 * The key must be a unique String. It is used to add the file to the Phaser.Cache upon successful load.
	 *
	 * Retrieve the file via `Cache.getImage(key)`. JSON files are automatically parsed upon load.
	 * If you need to control when the JSON is parsed then use `Loader.text` instead and parse the JSON file as needed.
	 *
	 * The URLs can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
	 *
	 * If the textureURL isn't specified then the Loader will take the key and create a filename from that.
	 * For example if the key is "player" and textureURL is null then the Loader will set the URL to be "player.png".
	 * The same is true for the atlasURL. If atlasURL isn't specified and no atlasData has been provided then the Loader will
	 * set the atlasURL to be the key. For example if the key is "player" the atlasURL will be set to "player.json".
	 *
	 * If you do not desire this action then provide URLs and / or a data object.
	 *
	 * @method Phaser.Loader#atlas
	 * @param {string} key - Unique asset key of the texture atlas file.
	 * @param {string} [textureURL] - URL of the texture atlas image file. If undefined or `null` the url will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
	 * @param {string} [atlasURL] - URL of the texture atlas data file. If undefined or `null` and no atlasData is given, the url will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
	 * @param {object} [atlasData] - A JSON or XML data object. You don't need this if the data is being loaded from a URL.
	 * @param {number} [format] - The format of the data. Can be LoadTexture.TEXTURE_ATLAS_JSON_ARRAY (the default), LoadTexture.TEXTURE_ATLAS_JSON_HASH or LoadTexture.TEXTURE_ATLAS_XML_STARLING.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	atlas: function(key, textureURL, atlasURL, atlasData, format) {

		if (textureURL === undefined || textureURL === null) {
			textureURL = key + '.png';
		}

		if (atlasURL === undefined) {
			atlasURL = null;
		}
		if (atlasData === undefined) {
			atlasData = null;
		}
		if (format === undefined) {
			format = LoadTexture.TEXTURE_ATLAS_JSON_ARRAY;
		}

		if (!atlasURL && !atlasData) {
			if (format === LoadTexture.TEXTURE_ATLAS_XML_STARLING) {
				atlasURL = key + '.xml';
			} else {
				atlasURL = key + '.json';
			}
		}

		//  A URL to a json/xml file has been given
		if (atlasURL) {
			this.addToFileList('textureatlas', key, textureURL, {
				atlasURL: atlasURL,
				format: format
			});
		} else {
			switch (format) {
				//  A json string or object has been given
				case LoadTexture.TEXTURE_ATLAS_JSON_ARRAY:

					if (typeof atlasData === 'string') {
						atlasData = JSON.parse(atlasData);
					}
					break;

					//  An xml string or object has been given
				case LoadTexture.TEXTURE_ATLAS_XML_STARLING:

					if (typeof atlasData === 'string') {
						var xml = this.parseXml(atlasData);

						if (!xml) {
							throw new Error("LoadTexture. Invalid Texture Atlas XML given");
						}

						atlasData = xml;
					}
					break;
			}

			this.addToFileList('textureatlas', key, textureURL, {
				atlasURL: null,
				atlasData: atlasData,
				format: format
			});

		}

		return this;

	},

	/**
	 * Add a synchronization point to the assets/files added within the supplied callback.
	 *
	 * A synchronization point denotes that an asset _must_ be completely loaded before
	 * subsequent assets can be loaded. An asset marked as a sync-point does not need to wait
	 * for previous assets to load (unless they are sync-points). Resources, such as packs, may still
	 * be downloaded around sync-points, as long as they do not finalize loading.
	 *
	 * @method Phaser.Loader#withSyncPoints
	 * @param {function} callback - The callback is invoked and is supplied with a single argument: the loader.
	 * @param {object} [callbackContext=(loader)] - Context for the callback.
	 * @return {Phaser.Loader} This Loader instance.
	 */
	withSyncPoint: function(callback, callbackContext) {

		this._withSyncPointDepth++;

		try {
			callback.call(callbackContext || this, this);
		} finally {
			this._withSyncPointDepth--;
		}

		return this;
	},

	/**
	 * Add a synchronization point to a specific file/asset in the load queue.
	 *
	 * This has no effect on already loaded assets.
	 *
	 * @method Phaser.Loader#addSyncPoint
	 * @param {string} type - The type of resource to turn into a sync point (image, audio, xml, etc).
	 * @param {string} key - Key of the file you want to turn into a sync point.
	 * @return {Phaser.Loader} This Loader instance.
	 * @see {@link Phaser.Loader#withSyncPoint withSyncPoint}
	 */
	addSyncPoint: function(type, key) {

		var asset = this.getAsset(type, key);

		if (asset) {
			asset.file.syncPoint = true;
		}

		return this;
	},

	/**
	 * Remove a file/asset from the loading queue.
	 *
	 * A file that is loaded or has started loading cannot be removed.
	 *
	 * @method Phaser.Loader#removeFile
	 * @protected
	 * @param {string} type - The type of resource to add to the list (image, audio, xml, etc).
	 * @param {string} key - Key of the file you want to remove.
	 */
	removeFile: function(type, key) {

		var asset = this.getAsset(type, key);

		if (asset) {
			if (!asset.loaded && !asset.loading) {
				this._fileList.splice(asset.index, 1);
			}
		}

	},

	/**
	 * Remove all file loading requests - this is _insufficient_ to stop current loading. Use `reset` instead.
	 *
	 * @method Phaser.Loader#removeAll
	 * @protected
	 */
	removeAll: function() {

		this._fileList.length = 0;
		this._flightQueue.length = 0;

	},

	/**
	 * Start loading the assets. Normally you don't need to call this yourself as the StateManager will do so.
	 *
	 * @method Phaser.Loader#start
	 */
	start: function() {
		// console.log("读取开始 "+this.isLoading)
		if (this.isLoading) {
			return;
		}

		this.hasLoaded = false;
		this.isLoading = true;
		this.updateProgress();

		this.processLoadQueue();

	},

	/**
	 * Process the next item(s) in the file/asset queue.
	 *
	 * Process the queue and start loading enough items to fill up the inflight queue.
	 *
	 * If a sync-file is encountered then subsequent asset processing is delayed until it completes.
	 * The exception to this rule is that packfiles can be downloaded (but not processed) even if
	 * there appear other sync files (ie. packs) - this enables multiple packfiles to be fetched in parallel.
	 * such as during the start phaser.
	 *
	 * @method Phaser.Loader#processLoadQueue
	 * @private
	 */
	processLoadQueue: function() {

		if (!this.isLoading) {
			console.warn('Phaser.Loader - active loading canceled / reset');

			this.finishedLoading(true);
			return;
		}

		// Empty the flight queue as applicable
		for (var i = 0; i < this._flightQueue.length; i++) {
			var file = this._flightQueue[i];

			if (file.loaded || file.error) {
				this._flightQueue.splice(i, 1);
				i--;

				file.loading = false;
				file.requestUrl = null;
				file.requestObject = null;

				if (file.error) {
					this.onFileError.dispatch(file.key, file);
				}

				if (file.type !== 'packfile') {
					this._loadedFileCount++;
					this.onFileComplete.dispatch(this.progress, file.key, !file.error, this._loadedFileCount, this._totalFileCount);
				} else if (file.type === 'packfile' && file.error) {
					// Non-error pack files are handled when processing the file queue
					this._loadedPackCount++;
					this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
				}

			}
		}

		// When true further non-pack file downloads are suppressed
		var syncblock = false;

		var inflightLimit = this.enableParallel ? Phaser.Math.clamp(this.maxParallelDownloads, 1, 12) : 1;

		for (var i = this._processingHead; i < this._fileList.length; i++) {
			var file = this._fileList[i];

			// Pack is fetched (ie. has data) and is currently at the start of the process queue.
			if (file.type === 'packfile' && !file.error && file.loaded && i === this._processingHead) {
				// Processing the pack / adds more files
				this.processPack(file);

				this._loadedPackCount++;
				this.onPackComplete.dispatch(file.key, !file.error, this._loadedPackCount, this._totalPackCount);
			}

			if (file.loaded || file.error) {
				// Item at the start of file list finished, can skip it in future
				if (i === this._processingHead) {
					this._processingHead = i + 1;
				}
			} else if (!file.loading && this._flightQueue.length < inflightLimit) {
				// -> not loaded/failed, not loading
				if (file.type === 'packfile' && !file.data) {
					// Fetches the pack data: the pack is processed above as it reaches queue-start.
					// (Packs do not trigger onLoadStart or onFileStart.)
					this._flightQueue.push(file);
					file.loading = true;
					// 					console.log("file.type === 'packfile' && !file.data")
					// 					console.log("this.isLoading "+this.isLoading)
					this.loadFile(file);
				} else if (!syncblock) {
					if (!this._fileLoadStarted) {
						this._fileLoadStarted = true;
						this.onLoadStart.dispatch();
					}

					this._flightQueue.push(file);
					file.loading = true;
					this.onFileStart.dispatch(this.progress, file.key, file.url);
					// console.log("this.onFileStart.dispatch(this.progress, file.key, file.url);")
					this.loadFile(file);
				}
			}

			if (!file.loaded && file.syncPoint) {
				syncblock = true;
			}

			// Stop looking if queue full - or if syncblocked and there are no more packs.
			// (As only packs can be loaded around a syncblock)
			if (this._flightQueue.length >= inflightLimit ||
				(syncblock && this._loadedPackCount === this._totalPackCount)) {
				break;
			}
		}

		this.updateProgress();

		// True when all items in the queue have been advanced over
		// (There should be no inflight items as they are complete - loaded/error.)
		if (this._processingHead >= this._fileList.length) {
			// console.log("finishedLoading==========================this._processingHead >= this._fileList.length")
			this.finishedLoading();
		} else if (!this._flightQueue.length) {
			// Flight queue is empty but file list is not done being processed.
			// This indicates a critical internal error with no known recovery.
			console.warn("Phaser.Loader - aborting: processing queue empty, loading may have stalled");

			var _this = this;

			setTimeout(function() {
				// console.log("finishedLoading=========================setTimeout")
				_this.finishedLoading(true);
			}, 2000);
		}
		// 		console.log("方法结束")
		// 		console.log("this.isLoading "+this.isLoading)
	},

	/**
	 * The loading is all finished.
	 *
	 * @method Phaser.Loader#finishedLoading
	 * @private
	 * @param {boolean} [abnormal=true] - True if the loading finished abnormally.
	 */
	finishedLoading: function(abnormal) {

		if (this.hasLoaded) {
			return;
		}

		this.hasLoaded = true;
		this.isLoading = false;

		// If there were no files make sure to trigger the event anyway, for consistency
		if (!abnormal && !this._fileLoadStarted) {
			this._fileLoadStarted = true;
			this.onLoadStart.dispatch();
		}

		this.onLoadComplete.dispatch();

		//this.game.state.loadComplete();

		this.reset();

	},

	/**
	 * Informs the loader that the given file resource has been fetched and processed;
	 * or such a request has failed.
	 *
	 * @method Phaser.Loader#asyncComplete
	 * @private
	 * @param {object} file
	 * @param {string} [error=''] - The error message, if any. No message implies no error.
	 */
	asyncComplete: function(file, errorMessage) {

		if (errorMessage === undefined) {
			errorMessage = '';
		}

		file.loaded = true;
		file.error = !!errorMessage;

		if (errorMessage) {
			file.errorMessage = errorMessage;

			console.warn('Phaser.Loader - ' + file.type + '[' + file.key + ']' + ': ' + errorMessage);
			// debugger;
		}

		this.processLoadQueue();

	},

	/**
	 * Process pack data. This will usually modify the file list.
	 *
	 * @method Phaser.Loader#processPack
	 * @private
	 * @param {object} pack
	 */
	processPack: function(pack) {

		var packData = pack.data[pack.key];

		if (!packData) {
			console.warn('Phaser.Loader - ' + pack.key + ': pack has data, but not for pack key');
			return;
		}

		for (var i = 0; i < packData.length; i++) {
			var file = packData[i];

			switch (file.type) {
				case "image":
					this.image(file.key, file.url, file.overwrite);
					break;

				case "text":
					this.text(file.key, file.url, file.overwrite);
					break;

				case "json":
					this.json(file.key, file.url, file.overwrite);
					break;

				case "xml":
					this.xml(file.key, file.url, file.overwrite);
					break;

				case "script":
					this.script(file.key, file.url, file.callback, pack.callbackContext || this);
					break;

				case "binary":
					this.binary(file.key, file.url, file.callback, pack.callbackContext || this);
					break;

				case "spritesheet":
					this.spritesheet(file.key, file.url, file.frameWidth, file.frameHeight, file.frameMax, file.margin, file.spacing);
					break;

				case "video":
					this.video(file.key, file.urls);
					break;

				case "audio":
					this.audio(file.key, file.urls, file.autoDecode);
					break;

				case "audiosprite":
					this.audiosprite(file.key, file.urls, file.jsonURL, file.jsonData, file.autoDecode);
					break;

				case "tilemap":
					this.tilemap(file.key, file.url, file.data, Phaser.Tilemap[file.format]);
					break;

				case "physics":
					this.physics(file.key, file.url, file.data, LoadTexture[file.format]);
					break;

				case "bitmapFont":
					this.bitmapFont(file.key, file.textureURL, file.atlasURL, file.atlasData, file.xSpacing, file.ySpacing);
					break;

				case "atlasJSONArray":
					this.atlasJSONArray(file.key, file.textureURL, file.atlasURL, file.atlasData);
					break;

				case "atlasJSONHash":
					this.atlasJSONHash(file.key, file.textureURL, file.atlasURL, file.atlasData);
					break;

				case "atlasXML":
					this.atlasXML(file.key, file.textureURL, file.atlasURL, file.atlasData);
					break;

				case "atlas":
					this.atlas(file.key, file.textureURL, file.atlasURL, file.atlasData, LoadTexture[file.format]);
					break;

				case "shader":
					this.shader(file.key, file.url, file.overwrite);
					break;
			}
		}

	},

	/**
	 * Transforms the asset URL.
	 *
	 * The default implementation prepends the baseURL if the url doesn't begin with http or //
	 *
	 * @method Phaser.Loader#transformUrl
	 * @protected
	 * @param {string} url - The url to transform.
	 * @param {object} file - The file object being transformed.
	 * @return {string} The transformed url. In rare cases where the url isn't specified it will return false instead.
	 */
	transformUrl: function(url, file) {

		if (!url) {
			return false;
		}

		if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/)) {
			return url;
		} else {
			return this.baseURL + file.path + url;
		}

	},

	/**
	 * Start fetching a resource.
	 *
	 * All code paths, async or otherwise, from this function must return to `asyncComplete`.
	 *
	 * @method Phaser.Loader#loadFile
	 * @private
	 * @param {object} file
	 */
	loadFile: function(file) {
		//console.log("进来 读取文件 " + file.type);
		//  Image or Data?
		switch (file.type) {
			case 'packfile':
				// console.log("packfile this.isLoading "+this.isLoading)
				this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.fileComplete);
				break;

			case 'image':
			case 'spritesheet':
			case 'textureatlas':
			case 'bitmapfont':
				this.loadImageTag(file);
				break;

			case 'audio':
				file.url = this.getAudioURL(file.url);

				if (file.url) {
					//  WebAudio or Audio Tag?
					//if (this.game.sound.usingWebAudio) {
					this.xhrLoad(file, this.transformUrl(file.url, file), 'arraybuffer', this.fileComplete);
					// 					} else if (this.game.sound.usingAudioTag) {
					// 						this.loadAudioTag(file);
					// 					}
				} else {
					this.fileError(file, null, 'No supported audio URL specified or device does not have audio playback support');
				}
				break;

			case 'video':
				file.url = this.getVideoURL(file.url);

				if (file.url) {
					if (file.asBlob) {
						this.xhrLoad(file, this.transformUrl(file.url, file), 'blob', this.fileComplete);
					} else {
						this.loadVideoTag(file);
					}
				} else {
					this.fileError(file, null, 'No supported video URL specified or device does not have video playback support');
				}
				break;

			case 'json':			
				this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.jsonLoadComplete);
				break;

			case 'xml':
				this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.xmlLoadComplete);
				break;

			case 'tilemap':

				if (file.format === Phaser.Tilemap.TILED_JSON) {
					this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.jsonLoadComplete);
				} else if (file.format === Phaser.Tilemap.CSV) {
					this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.csvLoadComplete);
				} else {
					this.asyncComplete(file, "invalid Tilemap format: " + file.format);
				}
				break;

			case 'text':
			case 'script':
			case 'shader':
			case 'physics':
				this.xhrLoad(file, this.transformUrl(file.url, file), 'text', this.fileComplete);
				break;

			case 'binary':
				this.xhrLoad(file, this.transformUrl(file.url, file), 'arraybuffer', this.fileComplete);
				break;
		}

	},

	/**
	 * Continue async loading through an Image tag.
	 * @private
	 */
	loadImageTag: function(file) {

		var _this = this;

		file.data = new Image();
		file.data.name = file.key;

		if (this.crossOrigin) {
			console.log(this.crossOrigin);
			file.data.crossOrigin = this.crossOrigin;
		}

		file.data.onload = function() {
			if (file.data.onload) {
				file.data.onload = null;
				file.data.onerror = null;
				_this.fileComplete(file);
			}
		};

		file.data.onerror = function() {
			if (file.data.onload) {
				file.data.onload = null;
				file.data.onerror = null;
				_this.fileError(file);
			}
		};

		file.data.src = this.transformUrl(file.url, file);


		// Image is immediately-available/cached
		if (file.data.complete && file.data.width && file.data.height) {
			file.data.onload = null;
			file.data.onerror = null;
			this.fileComplete(file);
		}

	},

	/**
	 * Continue async loading through a Video tag.
	 * @private
	 */
	loadVideoTag: function(file) {

		var _this = this;

		file.data = document.createElement("video");
		file.data.name = file.key;
		file.data.controls = false;
		file.data.autoplay = false;

		var videoLoadEvent = function() {

			file.data.removeEventListener(file.loadEvent, videoLoadEvent, false);
			file.data.onerror = null;
			file.data.canplay = true;
			Phaser.GAMES[_this.game.id].load.fileComplete(file);

		};

		file.data.onerror = function() {
			file.data.removeEventListener(file.loadEvent, videoLoadEvent, false);
			file.data.onerror = null;
			file.data.canplay = false;
			_this.fileError(file);
		};

		file.data.addEventListener(file.loadEvent, videoLoadEvent, false);

		file.data.src = this.transformUrl(file.url, file);
		file.data.load();

	},

	/**
	 * Continue async loading through an Audio tag.
	 * @private
	 */
	loadAudioTag: function(file) {

		var _this = this;

		// 		if (this.game.sound.touchLocked) {
		// 			//  If audio is locked we can't do this yet, so need to queue this load request. Bum.
		// 			file.data = new Audio();
		// 			file.data.name = file.key;
		// 			file.data.preload = 'auto';
		// 			file.data.src = this.transformUrl(file.url, file);
		// 
		// 			this.fileComplete(file);
		// 		} else {
		file.data = new Audio();
		file.data.name = file.key;

		var playThroughEvent = function() {
			file.data.removeEventListener('canplaythrough', playThroughEvent, false);
			file.data.onerror = null;
			_this.fileComplete(file);
		};

		file.data.onerror = function() {
			file.data.removeEventListener('canplaythrough', playThroughEvent, false);
			file.data.onerror = null;
			_this.fileError(file);
		};

		file.data.preload = 'auto';
		file.data.src = this.transformUrl(file.url, file);
		file.data.addEventListener('canplaythrough', playThroughEvent, false);
		file.data.load();
		// }

	},

	/**
	 * Starts the xhr loader.
	 *
	 * This is designed specifically to use with asset file processing.
	 *
	 * @method Phaser.Loader#xhrLoad
	 * @private
	 * @param {object} file - The file/pack to load.
	 * @param {string} url - The URL of the file.
	 * @param {string} type - The xhr responseType.
	 * @param {function} onload - The function to call on success. Invoked in `this` context and supplied with `(file, xhr)` arguments.
	 * @param {function} [onerror=fileError]  The function to call on error. Invoked in `this` context and supplied with `(file, xhr)` arguments.
	 */
	xhrLoad: function(file, url, type, onload, onerror) {

		if (this.useXDomainRequest && window.XDomainRequest) {
			this.xhrLoadWithXDR(file, url, type, onload, onerror);
			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = type;

		if (this.headers['requestedWith'] !== false) {
			xhr.setRequestHeader('X-Requested-With', this.headers['requestedWith']);
		}

		if (this.headers[file.type]) {
			xhr.setRequestHeader('Accept', this.headers[file.type]);
		}

		onerror = onerror || this.fileError;

		var _this = this;

		xhr.onload = function() {

			try {
				if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599) { // Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
					return onerror.call(_this, file, xhr);
				} else {
					return onload.call(_this, file, xhr);
				}
			} catch (e) {

				//  If this was the last file in the queue and an error is thrown in the create method
				//  then it's caught here, so be sure we don't carry on processing it

				if (!_this.hasLoaded) {
					_this.asyncComplete(file, e.message || 'Exception');
				} else {
					if (window['console']) {
						console.error(e);
					}
				}
			}
		};

		xhr.onerror = function() {

			try {

				return onerror.call(_this, file, xhr);

			} catch (e) {

				if (!_this.hasLoaded) {
					_this.asyncComplete(file, e.message || 'Exception');
				} else {
					if (window['console']) {
						console.error(e);
					}
				}

			}
		};

		file.requestObject = xhr;
		file.requestUrl = url;

		xhr.send();

	},

	/**
	 * Starts the xhr loader - using XDomainRequest.
	 * This should _only_ be used with IE 9. Phaser does not support IE 8 and XDR is deprecated in IE 10.
	 *
	 * This is designed specifically to use with asset file processing.
	 *
	 * @method Phaser.Loader#xhrLoad
	 * @private
	 * @param {object} file - The file/pack to load.
	 * @param {string} url - The URL of the file.
	 * @param {string} type - The xhr responseType.
	 * @param {function} onload - The function to call on success. Invoked in `this` context and supplied with `(file, xhr)` arguments.
	 * @param {function} [onerror=fileError]  The function to call on error. Invoked in `this` context and supplied with `(file, xhr)` arguments.
	 * @deprecated This is only relevant for IE 9.
	 */
	xhrLoadWithXDR: function(file, url, type, onload, onerror) {

		// Special IE9 magic .. only
		if (!this._warnedAboutXDomainRequest &&
			(!this.game.device.ie || this.game.device.ieVersion >= 10)) {
			this._warnedAboutXDomainRequest = true;
			console.warn("Phaser.Loader - using XDomainRequest outside of IE 9");
		}

		// Ref: http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
		var xhr = new window.XDomainRequest();
		xhr.open('GET', url, true);
		xhr.responseType = type;

		// XDomainRequest has a few quirks. Occasionally it will abort requests
		// A way to avoid this is to make sure ALL callbacks are set even if not used
		// More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
		xhr.timeout = 3000;

		onerror = onerror || this.fileError;

		var _this = this;

		xhr.onerror = function() {
			try {
				return onerror.call(_this, file, xhr);
			} catch (e) {
				_this.asyncComplete(file, e.message || 'Exception');
			}
		};

		xhr.ontimeout = function() {
			try {
				return onerror.call(_this, file, xhr);
			} catch (e) {
				_this.asyncComplete(file, e.message || 'Exception');
			}
		};

		xhr.onprogress = function() {};

		xhr.onload = function() {
			try {
				if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599) { // Handle HTTP status codes of 4xx and 5xx as errors, even if xhr.onerror was not called.
					return onerror.call(_this, file, xhr);
				} else {
					return onload.call(_this, file, xhr);
				}
				return onload.call(_this, file, xhr);
			} catch (e) {
				_this.asyncComplete(file, e.message || 'Exception');
			}
		};

		file.requestObject = xhr;
		file.requestUrl = url;

		//  Note: The xdr.send() call is wrapped in a timeout to prevent an issue with the interface where some requests are lost
		//  if multiple XDomainRequests are being sent at the same time.
		setTimeout(function() {
			xhr.send();
		}, 0);

	},

	/**
	 * Give a bunch of URLs, return the first URL that has an extension this device thinks it can play.
	 *
	 * It is assumed that the device can play "blob:" or "data:" URIs - There is no mime-type checking on data URIs.
	 *
	 * @method Phaser.Loader#getVideoURL
	 * @private
	 * @param {object[]|string[]} urls - See {@link #video} for format.
	 * @return {string} The URL to try and fetch; or null.
	 */
	getVideoURL: function(urls) {

		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var videoType;

			if (url.uri) // {uri: .., type: ..} pair
			{
				videoType = url.type;
				url = url.uri;

				if (this.game.device.canPlayVideo(videoType)) {
					return url;
				}
			} else {
				// Assume direct-data URI can be played if not in a paired form; select immediately
				if (url.indexOf("blob:") === 0 || url.indexOf("data:") === 0) {
					return url;
				}

				if (url.indexOf("?") >= 0) // Remove query from URL
				{
					url = url.substr(0, url.indexOf("?"));
				}

				var extension = url.substr((Math.max(0, url.lastIndexOf(".")) || Infinity) + 1);

				videoType = extension.toLowerCase();

				if (this.game.device.canPlayVideo(videoType)) {
					return urls[i];
				}
			}
		}

		return null;

	},

	/**
	 * Give a bunch of URLs, return the first URL that has an extension this device thinks it can play.
	 *
	 * It is assumed that the device can play "blob:" or "data:" URIs - There is no mime-type checking on data URIs.
	 *
	 * @method Phaser.Loader#getAudioURL
	 * @private
	 * @param {object[]|string[]} urls - See {@link #audio} for format.
	 * @return {string} The URL to try and fetch; or null.
	 */
	getAudioURL: function(urls) {

		// 		if (this.game.sound.noAudio) {
		// 			return null;
		// 		}

		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var audioType;

			if (url.uri) // {uri: .., type: ..} pair
			{
				audioType = url.type;
				url = url.uri;

				if (this.game.device.canPlayAudio(audioType)) {
					return url;
				}
			} else {
				// Assume direct-data URI can be played if not in a paired form; select immediately
				if (url.indexOf("blob:") === 0 || url.indexOf("data:") === 0) {
					return url;
				}

				if (url.indexOf("?") >= 0) // Remove query from URL
				{
					url = url.substr(0, url.indexOf("?"));
				}

				var extension = url.substr((Math.max(0, url.lastIndexOf(".")) || Infinity) + 1);

				audioType = extension.toLowerCase();

				if (this.game.device.canPlayAudio(audioType)) {
					return urls[i];
				}
			}
		}

		return null;

	},

	/**
	 * Error occurred when loading a file.
	 *
	 * @method Phaser.Loader#fileError
	 * @private
	 * @param {object} file
	 * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
	 * @param {string} reason
	 */
	fileError: function(file, xhr, reason) {

		var url = file.requestUrl || this.transformUrl(file.url, file);
		var message = 'error loading asset from URL ' + url;

		if (!reason && xhr) {
			reason = xhr.status;
		}

		if (reason) {
			message = message + ' (' + reason + ')';
		}

		this.asyncComplete(file, message);

	},

	/**
	 * Called when a file/resources had been downloaded and needs to be processed further.
	 *
	 * @method Phaser.Loader#fileComplete
	 * @private
	 * @param {object} file - File loaded
	 * @param {?XMLHttpRequest} xhr - XHR request, unspecified if loaded via other means (eg. tags)
	 */
	fileComplete: function(file, xhr) {

		var loadNext = true;
		// 		console.log("fileComplete ")
		// 		console.log("this.isLoading "+this.isLoading)
		switch (file.type) {
			case 'packfile':

				// Pack data must never be false-ish after it is fetched without error
				var data = JSON.parse(xhr.responseText);
				file.data = data || {};
				break;

			case 'image':

				this.cache.addImage(file.key, file.url, file.data);
				break;

			case 'spritesheet':

				this.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax, file.margin,
					file.spacing);
				break;

			case 'textureatlas':

				if (file.atlasURL == null) {
					this.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
				} else {
					//  Load the JSON or XML before carrying on with the next file
					loadNext = false;

					if (file.format === LoadTexture.TEXTURE_ATLAS_JSON_ARRAY || file.format === LoadTexture.TEXTURE_ATLAS_JSON_HASH ||
						file.format === LoadTexture.TEXTURE_ATLAS_JSON_PYXEL) {
						this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', this.jsonLoadComplete);
					} else if (file.format === LoadTexture.TEXTURE_ATLAS_XML_STARLING) {
						this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', this.xmlLoadComplete);
					} else {
						throw new Error("LoadTexture. Invalid Texture Atlas format: " + file.format);
					}
				}
				break;

			case 'bitmapfont':

				if (!file.atlasURL) {
					this.cache.addBitmapFont(file.key, file.url, file.data, file.atlasData, file.atlasType, file.xSpacing, file.ySpacing);
				} else {
					//  Load the XML before carrying on with the next file
					loadNext = false;
					this.xhrLoad(file, this.transformUrl(file.atlasURL, file), 'text', function(file, xhr) {
						var json;

						try {
							// Try to parse as JSON, if it fails, then it's hopefully XML
							json = JSON.parse(xhr.responseText);
						} catch (e) {}

						if (!!json) {
							file.atlasType = 'json';
							this.jsonLoadComplete(file, xhr);
						} else {
							file.atlasType = 'xml';
							this.xmlLoadComplete(file, xhr);
						}
					});
				}
				break;

			case 'video':

				if (file.asBlob) {
					try {
						file.data = xhr.response;
					} catch (e) {
						throw new Error("LoadTexture. Unable to parse video file as Blob: " + file.key);
					}
				}

				this.cache.addVideo(file.key, file.url, file.data, file.asBlob);
				break;

			case 'audio':
				//if (this.game.sound.usingWebAudio) {
				file.data = xhr.response;
				this.game.soundMgr.addSound(file.key, file.url, file.data)
				// 				this.cache.addSound(file.key, file.url, file.data, true, false);
				// 
				// 				if (file.autoDecode) {
				// 					this.game.sound.decode(file.key);
				// 				}
				// 				} else {
				// 					this.cache.addSound(file.key, file.url, file.data, false, true);
				// 				}
				break;

			case 'text':
				file.data = xhr.responseText;
				this.cache.addText(file.key, file.url, file.data);
				break;

			case 'shader':
				file.data = xhr.responseText;
				this.cache.addShader(file.key, file.url, file.data);
				break;

			case 'physics':
				var data = JSON.parse(xhr.responseText);
				this.cache.addPhysicsData(file.key, file.url, data, file.format);
				break;

			case 'script':
				file.data = document.createElement('script');
				file.data.language = 'javascript';
				file.data.type = 'text/javascript';
				file.data.defer = false;
				file.data.text = xhr.responseText;
				document.head.appendChild(file.data);
				if (file.callback) {
					file.data = file.callback.call(file.callbackContext, file.key, xhr.responseText);
				}
				break;

			case 'binary':
				if (file.callback) {
					file.data = file.callback.call(file.callbackContext, file.key, xhr.response);
				} else {
					file.data = xhr.response;
				}

				this.cache.addBinary(file.key, file.data);

				break;
		}

		if (loadNext) {
			this.asyncComplete(file);
		}

	},

	/**
	 * Successfully loaded a JSON file - only used for certain types.
	 *
	 * @method Phaser.Loader#jsonLoadComplete
	 * @private
	 * @param {object} file - File associated with this request
	 * @param {XMLHttpRequest} xhr
	 */
	jsonLoadComplete: function(file, xhr) {

		var data = JSON.parse(xhr.responseText);

		if (file.type === 'tilemap') {
			this.cache.addTilemap(file.key, file.url, data, file.format);
		} else if (file.type === 'bitmapfont') {
			this.cache.addBitmapFont(file.key, file.url, file.data, data, file.atlasType, file.xSpacing, file.ySpacing);
		} else if (file.type === 'json') {
			this.cache.addJSON(file.key, file.url, data);
		} else {
			this.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
		}

		this.asyncComplete(file);
	},

	/**
	 * Successfully loaded a CSV file - only used for certain types.
	 *
	 * @method Phaser.Loader#csvLoadComplete
	 * @private
	 * @param {object} file - File associated with this request
	 * @param {XMLHttpRequest} xhr
	 */
	csvLoadComplete: function(file, xhr) {

		var data = xhr.responseText;

		this.cache.addTilemap(file.key, file.url, data, file.format);

		this.asyncComplete(file);

	},

	/**
	 * Successfully loaded an XML file - only used for certain types.
	 *
	 * @method Phaser.Loader#xmlLoadComplete
	 * @private
	 * @param {object} file - File associated with this request
	 * @param {XMLHttpRequest} xhr
	 */
	xmlLoadComplete: function(file, xhr) {

		// Always try parsing the content as XML, regardless of actually response type
		var data = xhr.responseText;
		var xml = this.parseXml(data);

		if (!xml) {
			var responseType = xhr.responseType || xhr.contentType; // contentType for MS-XDomainRequest
			console.warn('Phaser.Loader - ' + file.key + ': invalid XML (' + responseType + ')');
			this.asyncComplete(file, "invalid XML");
			return;
		}

		if (file.type === 'bitmapfont') {
			this.cache.addBitmapFont(file.key, file.url, file.data, xml, file.atlasType, file.xSpacing, file.ySpacing);
		} else if (file.type === 'textureatlas') {
			this.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
		} else if (file.type === 'xml') {
			this.cache.addXML(file.key, file.url, xml);
		}

		this.asyncComplete(file);

	},

	/**
	 * Parses string data as XML.
	 *
	 * @method Phaser.Loader#parseXml
	 * @private
	 * @param {string} data - The XML text to parse
	 * @return {?XMLDocument} Returns the xml document, or null if such could not parsed to a valid document.
	 */
	parseXml: function(data) {

		var xml;

		try {
			if (window['DOMParser']) {
				var domparser = new DOMParser();
				xml = domparser.parseFromString(data, "text/xml");
			} else {
				xml = new ActiveXObject("Microsoft.XMLDOM");
				// Why is this 'false'?
				xml.async = 'false';
				xml.loadXML(data);
			}
		} catch (e) {
			xml = null;
		}

		if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
			return null;
		} else {
			return xml;
		}

	},

	/**
	 * Update the loading sprite progress.
	 *
	 * @method Phaser.Loader#nextFile
	 * @private
	 * @param {object} previousFile
	 * @param {boolean} success - Whether the previous asset loaded successfully or not.
	 */
	updateProgress: function() {

		if (this.preloadSprite) {

			if (this.preloadSprite.direction === 0) {
				
				this.preloadSprite.rect.width = Math.floor((this.preloadSprite.width / 100) * (this.progress));
			} else {
				this.preloadSprite.rect.height = Math.floor((this.preloadSprite.height / 100) * this.progress);
			}

			if (this.preloadSprite.sprite) {
				this.preloadSprite.sprite.updateCrop();
			} else {
				this.preloadSprite = null;
			}
		}

	},

	/**
	 * Returns the number of files that have already been loaded, even if they errored.
	 *
	 * @method Phaser.Loader#totalLoadedFiles
	 * @protected
	 * @return {number} The number of files that have already been loaded (even if they errored)
	 */
	totalLoadedFiles: function() {

		return this._loadedFileCount;

	},

	/**
	 * Returns the number of files still waiting to be processed in the load queue. This value decreases as each file in the queue is loaded.
	 *
	 * @method Phaser.Loader#totalQueuedFiles
	 * @protected
	 * @return {number} The number of files that still remain in the load queue.
	 */
	totalQueuedFiles: function() {

		return this._totalFileCount - this._loadedFileCount;

	},

	/**
	 * Returns the number of asset packs that have already been loaded, even if they errored.
	 *
	 * @method Phaser.Loader#totalLoadedPacks
	 * @protected
	 * @return {number} The number of asset packs that have already been loaded (even if they errored)
	 */
	totalLoadedPacks: function() {

		return this._totalPackCount;

	},

	/**
	 * Returns the number of asset packs still waiting to be processed in the load queue. This value decreases as each pack in the queue is loaded.
	 *
	 * @method Phaser.Loader#totalQueuedPacks
	 * @protected
	 * @return {number} The number of asset packs that still remain in the load queue.
	 */
	totalQueuedPacks: function() {

		return this._totalPackCount - this._loadedPackCount;

	}
}
Object.defineProperty(LoadTexture.prototype, "progressFloat", {
	get: function() {
		var progress = (this._loadedFileCount / this._totalFileCount) * 100;
		return clamp(progress || 0, 0, 100);
	}

});
Object.defineProperty(LoadTexture.prototype, "progress", {
	get: function() {
		return Math.round(this.progressFloat);
	}

});
LoadTexture.prototype.constructor = LoadTexture;


/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * FrameData is a container for Frame objects, which are the internal representation of animation data in 
 *
 * @class FrameData
 * @constructor
 */
FrameData = function() {

	/**
	 * @property {Array} _frames - Local array of frames.
	 * @private
	 */
	this._frames = [];

	/**
	 * @property {Array} _frameNames - Local array of frame names for name to index conversions.
	 * @private
	 */
	this._frameNames = [];

};

FrameData.prototype = {

	/**
	 * Adds a new Frame to this FrameData collection. Typically called by the Animation.Parser and not directly.
	 *
	 * @method FrameData#addFrame
	 * @param {Frame} frame - The frame to add to this FrameData set.
	 * @return {Frame} The frame that was just added.
	 */
	addFrame: function(frame) {

		frame.index = this._frames.length;

		this._frames.push(frame);

		if (frame.name !== '') {
			this._frameNames[frame.name] = frame.index;
		}

		return frame;

	},

	/**
	 * Get a Frame by its numerical index.
	 *
	 * @method FrameData#getFrame
	 * @param {number} index - The index of the frame you want to get.
	 * @return {Frame} The frame, if found.
	 */
	getFrame: function(index) {

		if (index >= this._frames.length) {
			index = 0;
		}

		return this._frames[index];

	},

	/**
	 * Get a Frame by its frame name.
	 *
	 * @method FrameData#getFrameByName
	 * @param {string} name - The name of the frame you want to get.
	 * @return {Frame} The frame, if found.
	 */
	getFrameByName: function(name) {

		if (typeof this._frameNames[name] === 'number') {
			return this._frames[this._frameNames[name]];
		}

		return null;

	},

	/**
	 * Check if there is a Frame with the given name.
	 *
	 * @method FrameData#checkFrameName
	 * @param {string} name - The name of the frame you want to check.
	 * @return {boolean} True if the frame is found, otherwise false.
	 */
	checkFrameName: function(name) {

		if (this._frameNames[name] == null) {
			return false;
		}

		return true;

	},

	/**
	 * Makes a copy of this FrameData including copies (not references) to all of the Frames it contains.
	 *
	 * @method FrameData#clone
	 * @return {FrameData} A clone of this object, including clones of the Frame objects it contains.
	 */
	clone: function() {

		var output = new FrameData();

		//  No input array, so we loop through all frames
		for (var i = 0; i < this._frames.length; i++) {
			output._frames.push(this._frames[i].clone());
		}

		for (var p in this._frameNames) {
			if (this._frameNames.hasOwnProperty(p)) {
				output._frameNames.push(this._frameNames[p]);
			}
		}

		return output;

	},

	/**
	 * Returns a range of frames based on the given start and end frame indexes and returns them in an Array.
	 *
	 * @method FrameData#getFrameRange
	 * @param {number} start - The starting frame index.
	 * @param {number} end - The ending frame index.
	 * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
	 * @return {Array} An array of Frames between the start and end index values, or an empty array if none were found.
	 */
	getFrameRange: function(start, end, output) {

		if (output === undefined) {
			output = [];
		}

		for (var i = start; i <= end; i++) {
			output.push(this._frames[i]);
		}

		return output;

	},

	/**
	 * Returns all of the Frames in this FrameData set where the frame index is found in the input array.
	 * The frames are returned in the output array, or if none is provided in a new Array object.
	 *
	 * @method FrameData#getFrames
	 * @param {Array} [frames] - An Array containing the indexes of the frames to retrieve. If the array is empty or undefined then all frames in the FrameData are returned.
	 * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
	 * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
	 * @return {Array} An array of all Frames in this FrameData set matching the given names or IDs.
	 */
	getFrames: function(frames, useNumericIndex, output) {

		if (useNumericIndex === undefined) {
			useNumericIndex = true;
		}
		if (output === undefined) {
			output = [];
		}

		if (frames === undefined || frames.length === 0) {
			//  No input array, so we loop through all frames
			for (var i = 0; i < this._frames.length; i++) {
				//  We only need the indexes
				output.push(this._frames[i]);
			}
		} else {
			//  Input array given, loop through that instead
			for (var i = 0; i < frames.length; i++) {
				//  Does the input array contain names or indexes?
				if (useNumericIndex) {
					//  The actual frame
					output.push(this.getFrame(frames[i]));
				} else {
					//  The actual frame
					output.push(this.getFrameByName(frames[i]));
				}
			}
		}

		return output;

	},

	/**
	 * Returns all of the Frame indexes in this FrameData set.
	 * The frames indexes are returned in the output array, or if none is provided in a new Array object.
	 *
	 * @method FrameData#getFrameIndexes
	 * @param {Array} [frames] - An Array containing the indexes of the frames to retrieve. If undefined or the array is empty then all frames in the FrameData are returned.
	 * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings? (false)
	 * @param {Array} [output] - If given the results will be appended to the end of this array otherwise a new array will be created.
	 * @return {Array} An array of all Frame indexes matching the given names or IDs.
	 */
	getFrameIndexes: function(frames, useNumericIndex, output) {

		if (useNumericIndex === undefined) {
			useNumericIndex = true;
		}
		if (output === undefined) {
			output = [];
		}

		if (frames === undefined || frames.length === 0) {
			//  No frames array, so we loop through all frames
			for (var i = 0; i < this._frames.length; i++) {
				output.push(this._frames[i].index);
			}
		} else {
			//  Input array given, loop through that instead
			for (var i = 0; i < frames.length; i++) {
				//  Does the frames array contain names or indexes?
				if (useNumericIndex && this._frames[frames[i]]) {
					output.push(this._frames[frames[i]].index);
				} else {
					if (this.getFrameByName(frames[i])) {
						output.push(this.getFrameByName(frames[i]).index);
					}
				}
			}
		}

		return output;

	},

	/**
	 * Destroys this FrameData collection by nulling the _frames and _frameNames arrays.
	 *
	 * @method FrameData#destroy
	 */
	destroy: function() {

		this._frames = null;
		this._frameNames = null;

	}

};

FrameData.prototype.constructor = FrameData;

/**
 * @name FrameData#total
 * @property {number} total - The total number of frames in this FrameData set.
 * @readonly
 */
Object.defineProperty(FrameData.prototype, "total", {

	get: function() {
		return this._frames.length;
	}

});





//tool

function clamp(v, min, max) {
	if (v < min) {
		return min;
	} else if (max < v) {
		return max;
	} else {
		return v;
	}

}





//缓存类
Cache = function(game) {
	/**
	 * @property {Game} game - Local reference to game.
	 */
	this.game = game;

	/**
	 * Automatically resolve resource URLs to absolute paths for use with the Cache.getURL method.
	 * @property {boolean} autoResolveURL
	 */
	this.autoResolveURL = false;

	/**
	 * The main cache object into which all resources are placed.
	 * @property {object} _cache
	 * @private
	 */
	this._cache = {
		canvas: {},
		image: {},
		texture: {},
		sound: {},
		video: {},
		text: {},
		json: {},
		xml: {},
		physics: {},
		tilemap: {},
		binary: {},
		bitmapData: {},
		bitmapFont: {},
		shader: {},
		renderTexture: {}
	};

	/**
	 * @property {object} _urlMap - Maps URLs to resources.
	 * @private
	 */
	this._urlMap = {};

	/**
	 * @property {Image} _urlResolver - Used to resolve URLs to the absolute path.
	 * @private
	 */
	this._urlResolver = new Image();

	/**
	 * @property {string} _urlTemp - Temporary variable to hold a resolved url.
	 * @private
	 */
	this._urlTemp = null;

	/**
	 * @property {Signal} onSoundUnlock - This event is dispatched when the sound system is unlocked via a touch event on cellular devices.
	 */
	this.onSoundUnlock = new Signal();

	/**
	 * @property {array} _cacheMap - Const to cache object look-up array.
	 * @private
	 */
	this._cacheMap = [];

	this._cacheMap[Cache.CANVAS] = this._cache.canvas;
	this._cacheMap[Cache.IMAGE] = this._cache.image;
	this._cacheMap[Cache.TEXTURE] = this._cache.texture;
	this._cacheMap[Cache.SOUND] = this._cache.sound;
	this._cacheMap[Cache.TEXT] = this._cache.text;
	this._cacheMap[Cache.PHYSICS] = this._cache.physics;
	this._cacheMap[Cache.TILEMAP] = this._cache.tilemap;
	this._cacheMap[Cache.BINARY] = this._cache.binary;
	this._cacheMap[Cache.BITMAPDATA] = this._cache.bitmapData;
	this._cacheMap[Cache.BITMAPFONT] = this._cache.bitmapFont;
	this._cacheMap[Cache.JSON] = this._cache.json;
	this._cacheMap[Cache.XML] = this._cache.xml;
	this._cacheMap[Cache.VIDEO] = this._cache.video;
	this._cacheMap[Cache.SHADER] = this._cache.shader;
	this._cacheMap[Cache.RENDER_TEXTURE] = this._cache.renderTexture;

	this.addDefaultImage();
	this.addMissingImage();

};

/**
 * @constant
 * @type {number}
 */
Cache.CANVAS = 1;

/**
 * @constant
 * @type {number}
 */
Cache.IMAGE = 2;

/**
 * @constant
 * @type {number}
 */
Cache.TEXTURE = 3;

/**
 * @constant
 * @type {number}
 */
Cache.SOUND = 4;

/**
 * @constant
 * @type {number}
 */
Cache.TEXT = 5;

/**
 * @constant
 * @type {number}
 */
Cache.PHYSICS = 6;

/**
 * @constant
 * @type {number}
 */
Cache.TILEMAP = 7;

/**
 * @constant
 * @type {number}
 */
Cache.BINARY = 8;

/**
 * @constant
 * @type {number}
 */
Cache.BITMAPDATA = 9;

/**
 * @constant
 * @type {number}
 */
Cache.BITMAPFONT = 10;

/**
 * @constant
 * @type {number}
 */
Cache.JSON = 11;

/**
 * @constant
 * @type {number}
 */
Cache.XML = 12;

/**
 * @constant
 * @type {number}
 */
Cache.VIDEO = 13;

/**
 * @constant
 * @type {number}
 */
Cache.SHADER = 14;

/**
 * @constant
 * @type {number}
 */
Cache.RENDER_TEXTURE = 15;

/**
 * The default image used for a texture when no other is specified.
 * @constant
 * @type {PIXI.Texture}
 */
Cache.DEFAULT = null;

/**
 * The default image used for a texture when the source image is missing.
 * @constant
 * @type {PIXI.Texture}
 */
Cache.MISSING = null;

Cache.prototype = {

	//////////////////
	//  Add Methods //
	//////////////////

	/**
	 * Add a new canvas object in to the cache.
	 *
	 * @method Cache#addCanvas
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {HTMLCanvasElement} canvas - The Canvas DOM element.
	 * @param {CanvasRenderingContext2D} [context] - The context of the canvas element. If not specified it will default go `getContext('2d')`.
	 */
	addCanvas: function(key, canvas, context) {

		if (context === undefined) {
			context = canvas.getContext('2d');
		}

		this._cache.canvas[key] = {
			canvas: canvas,
			context: context
		};

	},

	/**
	 * Adds an Image file into the Cache. The file must have already been loaded, typically via Loader, but can also have been loaded into the DOM.
	 * If an image already exists in the cache with the same key then it is removed and destroyed, and the new image inserted in its place.
	 *
	 * @method Cache#addImage
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra image data.
	 * @return {object} The full image object that was added to the cache.
	 */
	addImage: function(key, url, data) {

		if (this.checkImageKey(key)) {
			this.removeImage(key);
		}

		var img = {
			key: key,
			url: url,
			data: data,
			base: new PIXI.BaseTexture(data),
			frame: new Frame(0, 0, 0, data.width, data.height, key),
			frameData: new FrameData()
		};

		img.frameData.addFrame(new Frame(0, 0, 0, data.width, data.height, url));

		this._cache.image[key] = img;

		this._resolveURL(url, img);

		if (key === '__default') {
			Cache.DEFAULT = new PIXI.Texture(img.base);
		} else if (key === '__missing') {
			Cache.MISSING = new PIXI.Texture(img.base);
		}

		return img;

	},

	/**
	 * Adds a default image to be used in special cases such as WebGL Filters.
	 * It uses the special reserved key of `__default`.
	 * This method is called automatically when the Cache is created.
	 * This image is skipped when `Cache.destroy` is called due to its internal requirements.
	 *
	 * @method Cache#addDefaultImage
	 * @protected
	 */
	addDefaultImage: function() {

		var img = new Image();

		img.src =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==";

		var obj = this.addImage('__default', null, img);

		//  Because we don't want to invalidate the sprite batch for an invisible texture
		obj.base.skipRender = true;

		//  Make it easily available within the rest of Phaser / Pixi
		Cache.DEFAULT = new PIXI.Texture(obj.base);

	},

	/**
	 * Adds an image to be used when a key is wrong / missing.
	 * It uses the special reserved key of `__missing`.
	 * This method is called automatically when the Cache is created.
	 * This image is skipped when `Cache.destroy` is called due to its internal requirements.
	 *
	 * @method Cache#addMissingImage
	 * @protected
	 */
	addMissingImage: function() {

		var img = new Image();

		img.src =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";

		var obj = this.addImage('__missing', null, img);

		//  Make it easily available within the rest of Phaser / Pixi
		Cache.MISSING = new PIXI.Texture(obj.base);

	},

	/**
	 * Adds a Sound file into the Cache. The file must have already been loaded, typically via Loader.
	 *
	 * @method Cache#addSound
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra sound data.
	 * @param {boolean} webAudio - True if the file is using web audio.
	 * @param {boolean} audioTag - True if the file is using legacy HTML audio.
	 */
	addSound: function(key, url, data, webAudio, audioTag) {

		if (webAudio === undefined) {
			webAudio = true;
			audioTag = false;
		}
		if (audioTag === undefined) {
			webAudio = false;
			audioTag = true;
		}

		var decoded = false;

		if (audioTag) {
			decoded = true;
		}

		this._cache.sound[key] = {
			url: url,
			data: data,
			isDecoding: false,
			decoded: decoded,
			webAudio: webAudio,
			audioTag: audioTag,
			locked: false
		};

		this._resolveURL(url, this._cache.sound[key]);

	},

	/**
	 * Add a new text data.
	 *
	 * @method Cache#addText
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra text data.
	 */
	addText: function(key, url, data) {

		this._cache.text[key] = {
			url: url,
			data: data
		};

		this._resolveURL(url, this._cache.text[key]);

	},

	/**
	 * Add a new physics data object to the Cache.
	 *
	 * @method Cache#addPhysicsData
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} JSONData - The physics data object (a JSON file).
	 * @param {number} format - The format of the physics data.
	 */
	addPhysicsData: function(key, url, JSONData, format) {

		this._cache.physics[key] = {
			url: url,
			data: JSONData,
			format: format
		};

		this._resolveURL(url, this._cache.physics[key]);

	},

	/**
	 * Add a new tilemap to the Cache.
	 *
	 * @method Cache#addTilemap
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} mapData - The tilemap data object (either a CSV or JSON file).
	 * @param {number} format - The format of the tilemap data.
	 */
	addTilemap: function(key, url, mapData, format) {

		this._cache.tilemap[key] = {
			url: url,
			data: mapData,
			format: format
		};

		this._resolveURL(url, this._cache.tilemap[key]);

	},

	/**
	 * Add a binary object in to the cache.
	 *
	 * @method Cache#addBinary
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {object} binaryData - The binary object to be added to the cache.
	 */
	addBinary: function(key, binaryData) {

		this._cache.binary[key] = binaryData;

	},

	/**
	 * Add a BitmapData object to the cache.
	 *
	 * @method Cache#addBitmapData
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {BitmapData} bitmapData - The BitmapData object to be addded to the cache.
	 * @param {FrameData|null} [frameData=(auto create)] - Optional FrameData set associated with the given BitmapData. If not specified (or `undefined`) a new FrameData object is created containing the Bitmap's Frame. If `null` is supplied then no FrameData will be created.
	 * @return {BitmapData} The BitmapData object to be addded to the cache.
	 */
	addBitmapData: function(key, bitmapData, frameData) {

		bitmapData.key = key;

		if (frameData === undefined) {
			frameData = new FrameData();
			frameData.addFrame(bitmapData.textureFrame);
		}

		this._cache.bitmapData[key] = {
			data: bitmapData,
			frameData: frameData
		};

		return bitmapData;

	},

	/**
	 * Add a new Bitmap Font to the Cache.
	 *
	 * @method Cache#addBitmapFont
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra font data.
	 * @param {object} atlasData - Texture atlas frames data.
	 * @param {string} [atlasType='xml'] - The format of the texture atlas ( 'json' or 'xml' ).
	 * @param {number} [xSpacing=0] - If you'd like to add additional horizontal spacing between the characters then set the pixel value here.
	 * @param {number} [ySpacing=0] - If you'd like to add additional vertical spacing between the lines then set the pixel value here.
	 */
	addBitmapFont: function(key, url, data, atlasData, atlasType, xSpacing, ySpacing) {

		var obj = {
			url: url,
			data: data,
			font: null,
			base: new PIXI.BaseTexture(data)
		};

		if (xSpacing === undefined) {
			xSpacing = 0;
		}
		if (ySpacing === undefined) {
			ySpacing = 0;
		}

		if (atlasType === 'json') {
			obj.font = LoaderParser.jsonBitmapFont(atlasData, obj.base, xSpacing, ySpacing);
		} else {
			obj.font = LoaderParser.xmlBitmapFont(atlasData, obj.base, xSpacing, ySpacing);
		}

		this._cache.bitmapFont[key] = obj;

		this._resolveURL(url, obj);

	},

	/**
	 * Add a new json object into the cache.
	 *
	 * @method Cache#addJSON
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra json data.
	 */
	addJSON: function(key, url, data) {

		this._cache.json[key] = {
			url: url,
			data: data
		};

		this._resolveURL(url, this._cache.json[key]);

	},

	/**
	 * Add a new xml object into the cache.
	 *
	 * @method Cache#addXML
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra text data.
	 */
	addXML: function(key, url, data) {

		this._cache.xml[key] = {
			url: url,
			data: data
		};

		this._resolveURL(url, this._cache.xml[key]);

	},

	/**
	 * Adds a Video file into the Cache. The file must have already been loaded, typically via Loader.
	 *
	 * @method Cache#addVideo
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra video data.
	 * @param {boolean} isBlob - True if the file was preloaded via xhr and the data parameter is a Blob. false if a Video tag was created instead.
	 */
	addVideo: function(key, url, data, isBlob) {

		this._cache.video[key] = {
			url: url,
			data: data,
			isBlob: isBlob,
			locked: true
		};

		this._resolveURL(url, this._cache.video[key]);

	},

	/**
	 * Adds a Fragment Shader in to the Cache. The file must have already been loaded, typically via Loader.
	 *
	 * @method Cache#addShader
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra shader data.
	 */
	addShader: function(key, url, data) {

		this._cache.shader[key] = {
			url: url,
			data: data
		};

		this._resolveURL(url, this._cache.shader[key]);

	},

	/**
	 * Add a new RenderTexture in to the cache.
	 *
	 * @method Cache#addRenderTexture
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {RenderTexture} texture - The texture to use as the base of the RenderTexture.
	 */
	addRenderTexture: function(key, texture) {

		this._cache.renderTexture[key] = {
			texture: texture,
			frame: new Frame(0, 0, 0, texture.width, texture.height, '', '')
		};

	},

	/**
	 * Add a new sprite sheet in to the cache.
	 *
	 * @method Cache#addSpriteSheet
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra sprite sheet data.
	 * @param {number} frameWidth - Width of the sprite sheet.
	 * @param {number} frameHeight - Height of the sprite sheet.
	 * @param {number} [frameMax=-1] - How many frames stored in the sprite sheet. If -1 then it divides the whole sheet evenly.
	 * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
	 * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
	 */
	addSpriteSheet: function(key, url, data, frameWidth, frameHeight, frameMax, margin, spacing) {

		if (frameMax === undefined) {
			frameMax = -1;
		}
		if (margin === undefined) {
			margin = 0;
		}
		if (spacing === undefined) {
			spacing = 0;
		}

		var obj = {
			key: key,
			url: url,
			data: data,
			frameWidth: frameWidth,
			frameHeight: frameHeight,
			margin: margin,
			spacing: spacing,
			base: new PIXI.BaseTexture(data),
			frameData: AnimationParser.spriteSheet(this.game, data, frameWidth, frameHeight, frameMax, margin, spacing)
		};

		this._cache.image[key] = obj;

		this._resolveURL(url, obj);

	},

	/**
	 * Add a new texture atlas to the Cache.
	 *
	 * @method Cache#addTextureAtlas
	 * @param {string} key - The key that this asset will be stored in the cache under. This should be unique within this cache.
	 * @param {string} url - The URL the asset was loaded from. If the asset was not loaded externally set to `null`.
	 * @param {object} data - Extra texture atlas data.
	 * @param {object} atlasData  - Texture atlas frames data.
	 * @param {number} format - The format of the texture atlas.
	 */
	addTextureAtlas: function(key, url, data, atlasData, format) {

		var obj = {
			key: key,
			url: url,
			data: data,
			base: new PIXI.BaseTexture(data)
		};

		if (format === LoadTexture.TEXTURE_ATLAS_XML_STARLING) {
			obj.frameData = AnimationParser.XMLData(this.game, atlasData, key);
		} else if (format === LoadTexture.TEXTURE_ATLAS_JSON_PYXEL) {
			obj.frameData = AnimationParser.JSONDataPyxel(this.game, atlasData, key);
		} else {
			//  Let's just work it out from the frames array
			if (Array.isArray(atlasData.frames)) {
				obj.frameData = AnimationParser.JSONData(this.game, atlasData, key);
			} else {
				obj.frameData = AnimationParser.JSONDataHash(this.game, atlasData, key);
			}
		}

		this._cache.image[key] = obj;

		this._resolveURL(url, obj);

	},

	////////////////////////////
	//  Sound Related Methods //
	////////////////////////////

	/**
	 * Reload a Sound file from the server.
	 *
	 * @method Cache#reloadSound
	 * @param {string} key - The key of the asset within the cache.
	 */
	reloadSound: function(key) {

		var _this = this;

		var sound = this.getSound(key);

		if (sound) {
			sound.data.src = sound.url;

			sound.data.addEventListener('canplaythrough', function() {
				return _this.reloadSoundComplete(key);
			}, false);

			sound.data.load();
		}

	},

	/**
	 * Fires the onSoundUnlock event when the sound has completed reloading.
	 *
	 * @method Cache#reloadSoundComplete
	 * @param {string} key - The key of the asset within the cache.
	 */
	reloadSoundComplete: function(key) {

		var sound = this.getSound(key);

		if (sound) {
			sound.locked = false;
			this.onSoundUnlock.dispatch(key);
		}

	},

	/**
	 * Updates the sound object in the cache.
	 *
	 * @method Cache#updateSound
	 * @param {string} key - The key of the asset within the cache.
	 */
	updateSound: function(key, property, value) {

		var sound = this.getSound(key);

		if (sound) {
			sound[property] = value;
		}

	},

	/**
	 * Add a new decoded sound.
	 *
	 * @method Cache#decodedSound
	 * @param {string} key - The key of the asset within the cache.
	 * @param {object} data - Extra sound data.
	 */
	decodedSound: function(key, data) {

		var sound = this.getSound(key);

		sound.data = data;
		sound.decoded = true;
		sound.isDecoding = false;

	},

	/**
	 * Check if the given sound has finished decoding.
	 *
	 * @method Cache#isSoundDecoded
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} The decoded state of the Sound object.
	 */
	isSoundDecoded: function(key) {

		var sound = this.getItem(key, Cache.SOUND, 'isSoundDecoded');

		if (sound) {
			return sound.decoded;
		}

	},

	/**
	 * Check if the given sound is ready for playback.
	 * A sound is considered ready when it has finished decoding and the device is no longer touch locked.
	 *
	 * @method Cache#isSoundReady
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the sound is decoded and the device is not touch locked.
	 */
	isSoundReady: function(key) {

		var sound = this.getItem(key, Cache.SOUND, 'isSoundDecoded');

		if (sound) {
			return (sound.decoded);
		}

	},

	////////////////////////
	//  Check Key Methods //
	////////////////////////

	/**
	 * Checks if a key for the given cache object type exists.
	 *
	 * @method Cache#checkKey
	 * @param {integer} cache - The cache to search. One of the Cache consts such as `Cache.IMAGE` or `Cache.SOUND`.
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists, otherwise false.
	 */
	checkKey: function(cache, key) {

		if (this._cacheMap[cache][key]) {
			return true;
		}

		return false;

	},

	/**
	 * Checks if the given URL has been loaded into the Cache.
	 * This method will only work if Cache.autoResolveURL was set to `true` before any preloading took place.
	 * The method will make a DOM src call to the URL given, so please be aware of this for certain file types, such as Sound files on Firefox
	 * which may cause double-load instances.
	 *
	 * @method Cache#checkURL
	 * @param {string} url - The url to check for in the cache.
	 * @return {boolean} True if the url exists, otherwise false.
	 */
	checkURL: function(url) {

		if (this._urlMap[this._resolveURL(url)]) {
			return true;
		}

		return false;

	},

	/**
	 * Checks if the given key exists in the Canvas Cache.
	 *
	 * @method Cache#checkCanvasKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkCanvasKey: function(key) {

		return this.checkKey(Cache.CANVAS, key);

	},

	/**
	 * Checks if the given key exists in the Image Cache. Note that this also includes Texture Atlases, Sprite Sheets and Retro Fonts.
	 *
	 * @method Cache#checkImageKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkImageKey: function(key) {

		return this.checkKey(Cache.IMAGE, key);

	},

	/**
	 * Checks if the given key exists in the Texture Cache.
	 *
	 * @method Cache#checkTextureKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkTextureKey: function(key) {

		return this.checkKey(Cache.TEXTURE, key);

	},

	/**
	 * Checks if the given key exists in the Sound Cache.
	 *
	 * @method Cache#checkSoundKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkSoundKey: function(key) {

		return this.checkKey(Cache.SOUND, key);

	},

	/**
	 * Checks if the given key exists in the Text Cache.
	 *
	 * @method Cache#checkTextKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkTextKey: function(key) {

		return this.checkKey(Cache.TEXT, key);

	},

	/**
	 * Checks if the given key exists in the Physics Cache.
	 *
	 * @method Cache#checkPhysicsKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkPhysicsKey: function(key) {

		return this.checkKey(Cache.PHYSICS, key);

	},

	/**
	 * Checks if the given key exists in the Tilemap Cache.
	 *
	 * @method Cache#checkTilemapKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkTilemapKey: function(key) {

		return this.checkKey(Cache.TILEMAP, key);

	},

	/**
	 * Checks if the given key exists in the Binary Cache.
	 *
	 * @method Cache#checkBinaryKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkBinaryKey: function(key) {

		return this.checkKey(Cache.BINARY, key);

	},

	/**
	 * Checks if the given key exists in the BitmapData Cache.
	 *
	 * @method Cache#checkBitmapDataKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkBitmapDataKey: function(key) {

		return this.checkKey(Cache.BITMAPDATA, key);

	},

	/**
	 * Checks if the given key exists in the BitmapFont Cache.
	 *
	 * @method Cache#checkBitmapFontKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkBitmapFontKey: function(key) {

		return this.checkKey(Cache.BITMAPFONT, key);

	},

	/**
	 * Checks if the given key exists in the JSON Cache.
	 *
	 * @method Cache#checkJSONKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkJSONKey: function(key) {

		return this.checkKey(Cache.JSON, key);

	},

	/**
	 * Checks if the given key exists in the XML Cache.
	 *
	 * @method Cache#checkXMLKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkXMLKey: function(key) {

		return this.checkKey(Cache.XML, key);

	},

	/**
	 * Checks if the given key exists in the Video Cache.
	 *
	 * @method Cache#checkVideoKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkVideoKey: function(key) {

		return this.checkKey(Cache.VIDEO, key);

	},

	/**
	 * Checks if the given key exists in the Fragment Shader Cache.
	 *
	 * @method Cache#checkShaderKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkShaderKey: function(key) {

		return this.checkKey(Cache.SHADER, key);

	},

	/**
	 * Checks if the given key exists in the Render Texture Cache.
	 *
	 * @method Cache#checkRenderTextureKey
	 * @param {string} key - The key of the asset within the cache.
	 * @return {boolean} True if the key exists in the cache, otherwise false.
	 */
	checkRenderTextureKey: function(key) {

		return this.checkKey(Cache.RENDER_TEXTURE, key);

	},

	////////////////
	//  Get Items //
	////////////////

	/**
	 * Get an item from a cache based on the given key and property.
	 *
	 * This method is mostly used internally by other Cache methods such as `getImage` but is exposed
	 * publicly for your own use as well.
	 *
	 * @method Cache#getItem
	 * @param {string} key - The key of the asset within the cache.
	 * @param {integer} cache - The cache to search. One of the Cache consts such as `Cache.IMAGE` or `Cache.SOUND`.
	 * @param {string} [method] - The string name of the method calling getItem. Can be empty, in which case no console warning is output.
	 * @param {string} [property] - If you require a specific property from the cache item, specify it here.
	 * @return {object} The cached item if found, otherwise `null`. If the key is invalid and `method` is set then a console.warn is output.
	 */
	getItem: function(key, cache, method, property) {

		if (!this.checkKey(cache, key)) {
			if (method) {
				console.warn('Cache.' + method + ': Key "' + key + '" not found in Cache.');
			}
		} else {
			if (property === undefined) {
				return this._cacheMap[cache][key];
			} else {
				return this._cacheMap[cache][key][property];
			}
		}

		return null;

	},

	/**
	 * Gets a Canvas object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getCanvas
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The canvas object or `null` if no item could be found matching the given key.
	 */
	getCanvas: function(key) {

		return this.getItem(key, Cache.CANVAS, 'getCanvas', 'canvas');

	},

	/**
	 * Gets a Image object from the cache. This returns a DOM Image object, not a Image object.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * Only the Image cache is searched, which covers images loaded via Loader.image, Sprite Sheets and Texture Atlases.
	 *
	 * If you need the image used by a bitmap font or similar then please use those respective 'get' methods.
	 *
	 * @method Cache#getImage
	 * @param {string} [key] - The key of the asset to retrieve from the cache. If not given or null it will return a default image. If given but not found in the cache it will throw a warning and return the missing image.
	 * @param {boolean} [full=false] - If true the full image object will be returned, if false just the HTML Image object is returned.
	 * @return {Image} The Image object if found in the Cache, otherwise `null`. If `full` was true then a JavaScript object is returned.
	 */
	getImage: function(key, full) {

		if (key === undefined || key === null) {
			key = '__default';
		}

		if (full === undefined) {
			full = false;
		}

		var img = this.getItem(key, Cache.IMAGE, 'getImage');

		if (img === null) {
			img = this.getItem('__missing', Cache.IMAGE, 'getImage');
		}

		if (full) {
			return img;
		} else {
			return img.data;
		}

	},

	/**
	 * Get a single texture frame by key.
	 *
	 * You'd only do this to get the default Frame created for a non-atlas / spritesheet image.
	 *
	 * @method Cache#getTextureFrame
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {Frame} The frame data.
	 */
	getTextureFrame: function(key) {

		return this.getItem(key, Cache.TEXTURE, 'getTextureFrame', 'frame');

	},

	/**
	 * Gets a Sound object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getSound
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {Sound} The sound object.
	 */
	getSound: function(key) {

		return this.getItem(key, Cache.SOUND, 'getSound');

	},

	/**
	 * Gets a raw Sound data object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getSoundData
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The sound data.
	 */
	getSoundData: function(key) {

		return this.getItem(key, Cache.SOUND, 'getSoundData', 'data');

	},

	/**
	 * Gets a Text object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getText
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The text data.
	 */
	getText: function(key) {

		return this.getItem(key, Cache.TEXT, 'getText', 'data');

	},

	/**
	 * Gets a Physics Data object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * You can get either the entire data set, a single object or a single fixture of an object from it.
	 *
	 * @method Cache#getPhysicsData
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @param {string} [object=null] - If specified it will return just the physics object that is part of the given key, if null it will return them all.
	 * @param {string} fixtureKey - Fixture key of fixture inside an object. This key can be set per fixture with the Phaser Exporter.
	 * @return {object} The requested physics object data if found.
	 */
	getPhysicsData: function(key, object, fixtureKey) {

		var data = this.getItem(key, Cache.PHYSICS, 'getPhysicsData', 'data');

		if (data === null || object === undefined || object === null) {
			return data;
		} else {
			if (data[object]) {
				var fixtures = data[object];

				//  Try to find a fixture by its fixture key if given
				if (fixtures && fixtureKey) {
					for (var fixture in fixtures) {
						//  This contains the fixture data of a polygon or a circle
						fixture = fixtures[fixture];

						//  Test the key
						if (fixture.fixtureKey === fixtureKey) {
							return fixture;
						}
					}

					//  We did not find the requested fixture
					console.warn('Cache.getPhysicsData: Could not find given fixtureKey: "' + fixtureKey + ' in ' + key + '"');
				} else {
					return fixtures;
				}
			} else {
				console.warn('Cache.getPhysicsData: Invalid key/object: "' + key + ' / ' + object + '"');
			}
		}

		return null;

	},

	/**
	 * Gets a raw Tilemap data object from the cache. This will be in either CSV or JSON format.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getTilemapData
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The raw tilemap data in CSV or JSON format.
	 */
	getTilemapData: function(key) {

		return this.getItem(key, Cache.TILEMAP, 'getTilemapData');

	},

	/**
	 * Gets a binary object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getBinary
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The binary data object.
	 */
	getBinary: function(key) {

		return this.getItem(key, Cache.BINARY, 'getBinary');

	},

	/**
	 * Gets a BitmapData object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getBitmapData
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {BitmapData} The requested BitmapData object if found, or null if not.
	 */
	getBitmapData: function(key) {

		return this.getItem(key, Cache.BITMAPDATA, 'getBitmapData', 'data');

	},

	/**
	 * Gets a Bitmap Font object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getBitmapFont
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {BitmapFont} The requested BitmapFont object if found, or null if not.
	 */
	getBitmapFont: function(key) {

		return this.getItem(key, Cache.BITMAPFONT, 'getBitmapFont');

	},

	/**
	 * Gets a JSON object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * You can either return the object by reference (the default), or return a clone
	 * of it by setting the `clone` argument to `true`.
	 *
	 * @method Cache#getJSON
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @param {boolean} [clone=false] - Return a clone of the original object (true) or a reference to it? (false)
	 * @return {object} The JSON object, or an Array if the key points to an Array property. If the property wasn't found, it returns null.
	 */
	getJSON: function(key, clone) {

		var data = this.getItem(key, Cache.JSON, 'getJSON', 'data');

		if (data) {
			if (clone) {
				return Utils.extend(true, Array.isArray(data) ? [] : {}, data);
			} else {
				return data;
			}
		} else {
			return null;
		}

	},

	/**
	 * Gets an XML object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getXML
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {object} The XML object.
	 */
	getXML: function(key) {

		return this.getItem(key, Cache.XML, 'getXML', 'data');

	},

	/**
	 * Gets a Video object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getVideo
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {Video} The video object.
	 */
	getVideo: function(key) {

		return this.getItem(key, Cache.VIDEO, 'getVideo');

	},

	/**
	 * Gets a fragment shader object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getShader
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {string} The shader object.
	 */
	getShader: function(key) {

		return this.getItem(key, Cache.SHADER, 'getShader', 'data');

	},

	/**
	 * Gets a RenderTexture object from the cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getRenderTexture
	 * @param {string} key - The key of the asset to retrieve from the cache.
	 * @return {Object} The object with RenderTexture and Frame.
	 */
	getRenderTexture: function(key) {

		return this.getItem(key, Cache.RENDER_TEXTURE, 'getRenderTexture');

	},

	////////////////////////////
	//  Frame Related Methods //
	////////////////////////////

	/**
	 * Gets a PIXI.BaseTexture by key from the given Cache.
	 *
	 * @method Cache#getBaseTexture
	 * @param {string} key - Asset key of the image for which you want the BaseTexture for.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search for the item in.
	 * @return {PIXI.BaseTexture} The BaseTexture object.
	 */
	getBaseTexture: function(key, cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		return this.getItem(key, cache, 'getBaseTexture', 'base');

	},

	/**
	 * Get a single frame by key. You'd only do this to get the default Frame created for a non-atlas/spritesheet image.
	 *
	 * @method Cache#getFrame
	 * @param {string} key - Asset key of the frame data to retrieve from the Cache.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search for the item in.
	 * @return {Frame} The frame data.
	 */
	getFrame: function(key, cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		return this.getItem(key, cache, 'getFrame', 'frame');

	},

	/**
	 * Get the total number of frames contained in the FrameData object specified by the given key.
	 *
	 * @method Cache#getFrameCount
	 * @param {string} key - Asset key of the FrameData you want.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search for the item in.
	 * @return {number} Then number of frames. 0 if the image is not found.
	 */
	getFrameCount: function(key, cache) {

		var data = this.getFrameData(key, cache);

		if (data) {
			return data.total;
		} else {
			return 0;
		}

	},

	/**
	 * Gets a FrameData object from the Image Cache.
	 *
	 * The object is looked-up based on the key given.
	 *
	 * Note: If the object cannot be found a `console.warn` message is displayed.
	 *
	 * @method Cache#getFrameData
	 * @param {string} key - Asset key of the frame data to retrieve from the Cache.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search for the item in.
	 * @return {FrameData} The frame data.
	 */
	getFrameData: function(key, cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		return this.getItem(key, cache, 'getFrameData', 'frameData');

	},

	/**
	 * Check if the FrameData for the given key exists in the Image Cache.
	 *
	 * @method Cache#hasFrameData
	 * @param {string} key - Asset key of the frame data to retrieve from the Cache.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search for the item in.
	 * @return {boolean} True if the given key has frameData in the cache, otherwise false.
	 */
	hasFrameData: function(key, cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		return (this.getItem(key, cache, '', 'frameData') !== null);

	},

	/**
	 * Replaces a set of frameData with a new FrameData object.
	 *
	 * @method Cache#updateFrameData
	 * @param {string} key - The unique key by which you will reference this object.
	 * @param {number} frameData - The new FrameData.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search. One of the Cache consts such as `Cache.IMAGE` or `Cache.SOUND`.
	 */
	updateFrameData: function(key, frameData, cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		if (this._cacheMap[cache][key]) {
			this._cacheMap[cache][key].frameData = frameData;
		}

	},

	/**
	 * Get a single frame out of a frameData set by key.
	 *
	 * @method Cache#getFrameByIndex
	 * @param {string} key - Asset key of the frame data to retrieve from the Cache.
	 * @param {number} index - The index of the frame you want to get.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search. One of the Cache consts such as `Cache.IMAGE` or `Cache.SOUND`.
	 * @return {Frame} The frame object.
	 */
	getFrameByIndex: function(key, index, cache) {

		var data = this.getFrameData(key, cache);

		if (data) {
			return data.getFrame(index);
		} else {
			return null;
		}

	},

	/**
	 * Get a single frame out of a frameData set by key.
	 *
	 * @method Cache#getFrameByName
	 * @param {string} key - Asset key of the frame data to retrieve from the Cache.
	 * @param {string} name - The name of the frame you want to get.
	 * @param {integer} [cache=Cache.IMAGE] - The cache to search. One of the Cache consts such as `Cache.IMAGE` or `Cache.SOUND`.
	 * @return {Frame} The frame object.
	 */
	getFrameByName: function(key, name, cache) {

		var data = this.getFrameData(key, cache);

		if (data) {
			return data.getFrameByName(name);
		} else {
			return null;
		}

	},

	/**
	 * Get a cached object by the URL.
	 * This only returns a value if you set Cache.autoResolveURL to `true` *before* starting the preload of any assets.
	 * Be aware that every call to this function makes a DOM src query, so use carefully and double-check for implications in your target browsers/devices.
	 *
	 * @method Cache#getURL
	 * @param {string} url - The url for the object loaded to get from the cache.
	 * @return {object} The cached object.
	 */
	getURL: function(url) {

		var url = this._resolveURL(url);

		if (url) {
			return this._urlMap[url];
		} else {
			console.warn('Cache.getUrl: Invalid url: "' + url + '" or Cache.autoResolveURL was false');
			return null;
		}

	},

	/**
	 * Gets all keys used in the requested Cache.
	 *
	 * @method Cache#getKeys
	 * @param {integer} [cache=Cache.IMAGE] - The Cache you wish to get the keys from. Can be any of the Cache consts such as `Cache.IMAGE`, `Cache.SOUND` etc.
	 * @return {Array} The array of keys in the requested cache.
	 */
	getKeys: function(cache) {

		if (cache === undefined) {
			cache = Cache.IMAGE;
		}

		var out = [];

		if (this._cacheMap[cache]) {
			for (var key in this._cacheMap[cache]) {
				if (key !== '__default' && key !== '__missing') {
					out.push(key);
				}
			}
		}

		return out;

	},

	/////////////////////
	//  Remove Methods //
	/////////////////////

	/**
	 * Removes a canvas from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeCanvas
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeCanvas: function(key) {

		delete this._cache.canvas[key];

	},

	/**
	 * Removes an image from the cache.
	 *
	 * You can optionally elect to destroy it as well. This calls BaseTexture.destroy on it.
	 *
	 * Note that this only removes it from the Phaser Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeImage
	 * @param {string} key - Key of the asset you want to remove.
	 * @param {boolean} [destroyBaseTexture=true] - Should the BaseTexture behind this image also be destroyed?
	 */
	removeImage: function(key, destroyBaseTexture) {

		if (destroyBaseTexture === undefined) {
			destroyBaseTexture = true;
		}

		var img = this.getImage(key, true);

		if (destroyBaseTexture && img.base) {
			img.base.destroy();
		}

		delete this._cache.image[key];

	},

	/**
	 * Removes a sound from the cache.
	 *
	 * If any `Sound` objects use the audio file in the cache that you remove with this method, they will
	 * _automatically_ destroy themselves. If you wish to have full control over when Sounds are destroyed then
	 * you must finish your house-keeping and destroy them all yourself first, before calling this method.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeSound
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeSound: function(key) {

		delete this._cache.sound[key];

	},

	/**
	 * Removes a text file from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeText
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeText: function(key) {

		delete this._cache.text[key];

	},

	/**
	 * Removes a physics data file from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removePhysics
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removePhysics: function(key) {

		delete this._cache.physics[key];

	},

	/**
	 * Removes a tilemap from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeTilemap
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeTilemap: function(key) {

		delete this._cache.tilemap[key];

	},

	/**
	 * Removes a binary file from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeBinary
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeBinary: function(key) {

		delete this._cache.binary[key];

	},

	/**
	 * Removes a bitmap data from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeBitmapData
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeBitmapData: function(key) {

		delete this._cache.bitmapData[key];

	},

	/**
	 * Removes a bitmap font from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeBitmapFont
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeBitmapFont: function(key) {

		delete this._cache.bitmapFont[key];

	},

	/**
	 * Removes a json object from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeJSON
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeJSON: function(key) {

		delete this._cache.json[key];

	},

	/**
	 * Removes a xml object from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeXML
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeXML: function(key) {

		delete this._cache.xml[key];

	},

	/**
	 * Removes a video from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeVideo
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeVideo: function(key) {

		delete this._cache.video[key];

	},

	/**
	 * Removes a shader from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeShader
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeShader: function(key) {

		delete this._cache.shader[key];

	},

	/**
	 * Removes a Render Texture from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeRenderTexture
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeRenderTexture: function(key) {

		delete this._cache.renderTexture[key];

	},

	/**
	 * Removes a Sprite Sheet from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeSpriteSheet
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeSpriteSheet: function(key) {

		delete this._cache.spriteSheet[key];

	},

	/**
	 * Removes a Texture Atlas from the cache.
	 *
	 * Note that this only removes it from the Cache. If you still have references to the data elsewhere
	 * then it will persist in memory.
	 *
	 * @method Cache#removeTextureAtlas
	 * @param {string} key - Key of the asset you want to remove.
	 */
	removeTextureAtlas: function(key) {

		delete this._cache.atlas[key];

	},

	/**
	 * Empties out all of the GL Textures from Images stored in the cache.
	 * This is called automatically when the WebGL context is lost and then restored.
	 *
	 * @method Cache#clearGLTextures
	 * @protected
	 */
	clearGLTextures: function() {

		for (var key in this._cache.image) {
			this._cache.image[key].base._glTextures = [];
		}

	},

	/**
	 * Resolves a URL to its absolute form and stores it in Cache._urlMap as long as Cache.autoResolveURL is set to `true`.
	 * This is then looked-up by the Cache.getURL and Cache.checkURL calls.
	 *
	 * @method Cache#_resolveURL
	 * @private
	 * @param {string} url - The URL to resolve. This is appended to Loader.baseURL.
	 * @param {object} [data] - The data associated with the URL to be stored to the URL Map.
	 * @return {string} The resolved URL.
	 */
	_resolveURL: function(url, data) {

		if (!this.autoResolveURL) {
			return null;
		}

		this._urlResolver.src = this.game.load.baseURL + url;

		this._urlTemp = this._urlResolver.src;

		//  Ensure no request is actually made
		this._urlResolver.src = '';

		//  Record the URL to the map
		if (data) {
			this._urlMap[this._urlTemp] = data;
		}

		return this._urlTemp;

	},

	/**
	 * Clears the cache. Removes every local cache object reference.
	 * If an object in the cache has a `destroy` method it will also be called.
	 *
	 * @method Cache#destroy
	 */
	destroy: function() {

		for (var i = 0; i < this._cacheMap.length; i++) {
			var cache = this._cacheMap[i];

			for (var key in cache) {
				if (key !== '__default' && key !== '__missing') {
					if (cache[key]['destroy']) {
						cache[key].destroy();
					}

					delete cache[key];
				}
			}
		}

		this._urlMap = null;
		this._urlResolver = null;
		this._urlTemp = null;

	}
}




AnimationParser = {

	/**
	 * Parse a Sprite Sheet and extract the animation frame data from it.
	 *
	 * @method AnimationParser.spriteSheet
	 * @param {Game} game - A reference to the currently running game.
	 * @param {string|Image} key - The Game.Cache asset key of the Sprite Sheet image or an actual HTML Image element.
	 * @param {number} frameWidth - The fixed width of each frame of the animation.
	 * @param {number} frameHeight - The fixed height of each frame of the animation.
	 * @param {number} [frameMax=-1] - The total number of animation frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
	 * @param {number} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
	 * @param {number} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
	 * @return {FrameData} A FrameData object containing the parsed frames.
	 */
	spriteSheet: function(game, key, frameWidth, frameHeight, frameMax, margin, spacing) {

		var img = key;

		if (typeof key === 'string') {
			img = game.cache.getImage(key);
		}

		if (img === null) {
			return null;
		}

		var width = img.width;
		var height = img.height;

		if (frameWidth <= 0) {
			frameWidth = Math.floor(-width / Math.min(-1, frameWidth));
		}

		if (frameHeight <= 0) {
			frameHeight = Math.floor(-height / Math.min(-1, frameHeight));
		}

		var row = Math.floor((width - margin) / (frameWidth + spacing));
		var column = Math.floor((height - margin) / (frameHeight + spacing));
		var total = row * column;

		if (frameMax !== -1) {
			total = frameMax;
		}

		//  Zero or smaller than frame sizes?
		if (width === 0 || height === 0 || width < frameWidth || height < frameHeight || total === 0) {
			console.warn("AnimationParser.spriteSheet: '" + key +
				"'s width/height zero or width/height < given frameWidth/frameHeight");
			return null;
		}

		//  Let's create some frames then
		var data = new FrameData();
		var x = margin;
		var y = margin;

		for (var i = 0; i < total; i++) {
			data.addFrame(new Frame(i, x, y, frameWidth, frameHeight, ''));

			x += frameWidth + spacing;

			if (x + frameWidth > width) {
				x = margin;
				y += frameHeight + spacing;
			}
		}

		return data;

	},

	/**
	 * Parse the JSON data and extract the animation frame data from it.
	 *
	 * @method AnimationParser.JSONData
	 * @param {Game} game - A reference to the currently running game.
	 * @param {object} json - The JSON data from the Texture Atlas. Must be in Array format.
	 * @return {FrameData} A FrameData object containing the parsed frames.
	 */
	JSONData: function(game, json) {

		//  Malformed?
		if (!json['frames']) {
			console.warn("AnimationParser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");

			return;
		}

		//  Let's create some frames then
		var data = new FrameData();

		//  By this stage frames is a fully parsed array
		var frames = json['frames'];
		var newFrame;

		for (var i = 0; i < frames.length; i++) {
			newFrame = data.addFrame(new Frame(
				i,
				frames[i].frame.x,
				frames[i].frame.y,
				frames[i].frame.w,
				frames[i].frame.h,
				frames[i].filename
			));

			if (frames[i].trimmed) {
				newFrame.setTrim(
					frames[i].trimmed,
					frames[i].sourceSize.w,
					frames[i].sourceSize.h,
					frames[i].spriteSourceSize.x,
					frames[i].spriteSourceSize.y,
					frames[i].spriteSourceSize.w,
					frames[i].spriteSourceSize.h
				);
			}
		}

		return data;

	},

	/**
	 * Parse the JSON data and extract the animation frame data from it.
	 *
	 * @method AnimationParser.JSONDataPyxel
	 * @param {Game} game - A reference to the currently running game.
	 * @param {object} json - The JSON data from the Texture Atlas. Must be in Pyxel JSON format.
	 * @return {FrameData} A FrameData object containing the parsed frames.
	 */
	JSONDataPyxel: function(game, json) {

		//  Malformed? There are a few keys to check here.
		var signature = ['layers', 'tilewidth', 'tileheight', 'tileswide', 'tileshigh'];

		signature.forEach(function(key) {
			if (!json[key]) {
				console.warn('AnimationParser.JSONDataPyxel: Invalid Pyxel Tilemap JSON given, missing "' + key +
					'" key.');

				return;
			}
		});

		// For this purpose, I only care about parsing tilemaps with a single layer.
		if (json['layers'].length !== 1) {
			console.warn('AnimationParser.JSONDataPyxel: Too many layers, this parser only supports flat Tilemaps.');

			return;
		}

		var data = new FrameData();

		var tileheight = json['tileheight'];
		var tilewidth = json['tilewidth'];

		var frames = json['layers'][0]['tiles'];
		var newFrame;

		for (var i = 0; i < frames.length; i++) {
			newFrame = data.addFrame(new Frame(
				i,
				frames[i].x,
				frames[i].y,
				tilewidth,
				tileheight,
				"frame_" + i // No names are included in pyxel tilemap data.
			));

			// No trim data is included.
			newFrame.setTrim(false);
		}

		return data;

	},

	/**
	 * Parse the JSON data and extract the animation frame data from it.
	 *
	 * @method AnimationParser.JSONDataHash
	 * @param {Game} game - A reference to the currently running game.
	 * @param {object} json - The JSON data from the Texture Atlas. Must be in JSON Hash format.
	 * @return {FrameData} A FrameData object containing the parsed frames.
	 */
	JSONDataHash: function(game, json) {

		//  Malformed?
		if (!json['frames']) {
			console.warn("AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");

			return;
		}

		//  Let's create some frames then
		var data = new FrameData();

		//  By this stage frames is a fully parsed array
		var frames = json['frames'];
		var newFrame;
		var i = 0;

		for (var key in frames) {
			newFrame = data.addFrame(new Frame(
				i,
				frames[key].frame.x,
				frames[key].frame.y,
				frames[key].frame.w,
				frames[key].frame.h,
				key
			));

			if (frames[key].trimmed) {
				newFrame.setTrim(
					frames[key].trimmed,
					frames[key].sourceSize.w,
					frames[key].sourceSize.h,
					frames[key].spriteSourceSize.x,
					frames[key].spriteSourceSize.y,
					frames[key].spriteSourceSize.w,
					frames[key].spriteSourceSize.h
				);
			}

			i++;
		}

		return data;

	},

	/**
	 * Parse the XML data and extract the animation frame data from it.
	 *
	 * @method AnimationParser.XMLData
	 * @param {Game} game - A reference to the currently running game.
	 * @param {object} xml - The XML data from the Texture Atlas. Must be in Starling XML format.
	 * @return {FrameData} A FrameData object containing the parsed frames.
	 */
	XMLData: function(game, xml) {

		//  Malformed?
		if (!xml.getElementsByTagName('TextureAtlas')) {
			console.warn("AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
			return;
		}

		//  Let's create some frames then
		var data = new FrameData();
		var frames = xml.getElementsByTagName('SubTexture');
		var newFrame;

		var name;
		var frame;
		var x;
		var y;
		var width;
		var height;
		var frameX;
		var frameY;
		var frameWidth;
		var frameHeight;

		for (var i = 0; i < frames.length; i++) {
			frame = frames[i].attributes;

			name = frame.name.value;
			x = parseInt(frame.x.value, 10);
			y = parseInt(frame.y.value, 10);
			width = parseInt(frame.width.value, 10);
			height = parseInt(frame.height.value, 10);

			frameX = null;
			frameY = null;

			if (frame.frameX) {
				frameX = Math.abs(parseInt(frame.frameX.value, 10));
				frameY = Math.abs(parseInt(frame.frameY.value, 10));
				frameWidth = parseInt(frame.frameWidth.value, 10);
				frameHeight = parseInt(frame.frameHeight.value, 10);
			}

			newFrame = data.addFrame(new Frame(i, x, y, width, height, name));

			//  Trimmed?
			if (frameX !== null || frameY !== null) {
				newFrame.setTrim(true, width, height, frameX, frameY, frameWidth, frameHeight);
			}
		}

		return data;

	}

};


LoaderParser = {

	/**
	 * Alias for xmlBitmapFont, for backwards compatibility.
	 * 
	 * @method LoaderParser.bitmapFont
	 * @param {object} xml - XML data you want to parse.
	 * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
	 * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
	 * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
	 * @return {object} The parsed Bitmap Font data.
	 */
	bitmapFont: function(xml, baseTexture, xSpacing, ySpacing) {

		return this.xmlBitmapFont(xml, baseTexture, xSpacing, ySpacing);

	},

	/**
	 * Parse a Bitmap Font from an XML file.
	 *
	 * @method LoaderParser.xmlBitmapFont
	 * @param {object} xml - XML data you want to parse.
	 * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
	 * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
	 * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
	 * @return {object} The parsed Bitmap Font data.
	 */
	xmlBitmapFont: function(xml, baseTexture, xSpacing, ySpacing) {

		var data = {};
		var info = xml.getElementsByTagName('info')[0];
		var common = xml.getElementsByTagName('common')[0];

		data.font = info.getAttribute('face');
		data.size = parseInt(info.getAttribute('size'), 10);
		data.lineHeight = parseInt(common.getAttribute('lineHeight'), 10) + ySpacing;
		data.chars = {};

		var letters = xml.getElementsByTagName('char');

		for (var i = 0; i < letters.length; i++) {
			var charCode = parseInt(letters[i].getAttribute('id'), 10);

			data.chars[charCode] = {
				x: parseInt(letters[i].getAttribute('x'), 10),
				y: parseInt(letters[i].getAttribute('y'), 10),
				width: parseInt(letters[i].getAttribute('width'), 10),
				height: parseInt(letters[i].getAttribute('height'), 10),
				xOffset: parseInt(letters[i].getAttribute('xoffset'), 10),
				yOffset: parseInt(letters[i].getAttribute('yoffset'), 10),
				xAdvance: parseInt(letters[i].getAttribute('xadvance'), 10) + xSpacing,
				kerning: {}
			};
		}

		var kernings = xml.getElementsByTagName('kerning');

		for (i = 0; i < kernings.length; i++) {
			var first = parseInt(kernings[i].getAttribute('first'), 10);
			var second = parseInt(kernings[i].getAttribute('second'), 10);
			var amount = parseInt(kernings[i].getAttribute('amount'), 10);

			data.chars[second].kerning[first] = amount;
		}

		return this.finalizeBitmapFont(baseTexture, data);

	},

	/**
	 * Parse a Bitmap Font from a JSON file.
	 *
	 * @method LoaderParser.jsonBitmapFont
	 * @param {object} json - JSON data you want to parse.
	 * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
	 * @param {number} [xSpacing=0] - Additional horizontal spacing between the characters.
	 * @param {number} [ySpacing=0] - Additional vertical spacing between the characters.
	 * @return {object} The parsed Bitmap Font data.
	 */
	jsonBitmapFont: function(json, baseTexture, xSpacing, ySpacing) {

		var data = {
			font: json.font.info._face,
			size: parseInt(json.font.info._size, 10),
			lineHeight: parseInt(json.font.common._lineHeight, 10) + ySpacing,
			chars: {}
		};

		json.font.chars["char"].forEach(

			function parseChar(letter) {

				var charCode = parseInt(letter._id, 10);

				data.chars[charCode] = {
					x: parseInt(letter._x, 10),
					y: parseInt(letter._y, 10),
					width: parseInt(letter._width, 10),
					height: parseInt(letter._height, 10),
					xOffset: parseInt(letter._xoffset, 10),
					yOffset: parseInt(letter._yoffset, 10),
					xAdvance: parseInt(letter._xadvance, 10) + xSpacing,
					kerning: {}
				};
			}

		);

		if (json.font.kernings && json.font.kernings.kerning) {

			json.font.kernings.kerning.forEach(

				function parseKerning(kerning) {

					data.chars[kerning._second].kerning[kerning._first] = parseInt(kerning._amount, 10);

				}

			);

		}

		return this.finalizeBitmapFont(baseTexture, data);

	},

	/**
	 * Finalize Bitmap Font parsing.
	 *
	 * @method LoaderParser.finalizeBitmapFont
	 * @private
	 * @param {PIXI.BaseTexture} baseTexture - The BaseTexture this font uses.
	 * @param {object} bitmapFontData - Pre-parsed bitmap font data.
	 * @return {object} The parsed Bitmap Font data.
	 */
	finalizeBitmapFont: function(baseTexture, bitmapFontData) {

		Object.keys(bitmapFontData.chars).forEach(

			function addTexture(charCode) {

				var letter = bitmapFontData.chars[charCode];

				letter.texture = new PIXI.Texture(baseTexture, new Rectangle(letter.x, letter.y, letter.width, letter.height));

			}

		);

		return bitmapFontData;

	}
};


/**
 * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters.
 * If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
 *
 * @class Rectangle
 * @constructor
 * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
 * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
 */
Rectangle = function(x, y, width, height) {

	x = x || 0;
	y = y || 0;
	width = width || 0;
	height = height || 0;

	/**
	 * @property {number} x - The x coordinate of the top-left corner of the Rectangle.
	 */
	this.x = x;

	/**
	 * @property {number} y - The y coordinate of the top-left corner of the Rectangle.
	 */
	this.y = y;

	/**
	 * @property {number} width - The width of the Rectangle. This value should never be set to a negative.
	 */
	this.width = width;

	/**
	 * @property {number} height - The height of the Rectangle. This value should never be set to a negative.
	 */
	this.height = height;

	/**
	 * @property {number} type - The const type of this object.
	 * @readonly
	 */
	this.type = 22;

};

Rectangle.prototype = {

	/**
	 * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
	 * @method Rectangle#offset
	 * @param {number} dx - Moves the x value of the Rectangle object by this amount.
	 * @param {number} dy - Moves the y value of the Rectangle object by this amount.
	 * @return {Rectangle} This Rectangle object.
	 */
	offset: function(dx, dy) {

		this.x += dx;
		this.y += dy;

		return this;

	},

	/**
	 * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
	 * @method Rectangle#offsetPoint
	 * @param {Point} point - A Point object to use to offset this Rectangle object.
	 * @return {Rectangle} This Rectangle object.
	 */
	offsetPoint: function(point) {

		return this.offset(point.x, point.y);

	},

	/**
	 * Sets the members of Rectangle to the specified values.
	 * @method Rectangle#setTo
	 * @param {number} x - The x coordinate of the top-left corner of the Rectangle.
	 * @param {number} y - The y coordinate of the top-left corner of the Rectangle.
	 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
	 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
	 * @return {Rectangle} This Rectangle object
	 */
	setTo: function(x, y, width, height) {

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		return this;

	},

	/**
	 * Scales the width and height of this Rectangle by the given amounts.
	 * 
	 * @method Rectangle#scale
	 * @param {number} x - The amount to scale the width of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the width, etc.
	 * @param {number} [y] - The amount to scale the height of the Rectangle by. A value of 0.5 would reduce by half, a value of 2 would double the height, etc.
	 * @return {Rectangle} This Rectangle object
	 */
	scale: function(x, y) {

		if (y === undefined) {
			y = x;
		}

		this.width *= x;
		this.height *= y;

		return this;

	},

	/**
	 * Centers this Rectangle so that the center coordinates match the given x and y values.
	 *
	 * @method Rectangle#centerOn
	 * @param {number} x - The x coordinate to place the center of the Rectangle at.
	 * @param {number} y - The y coordinate to place the center of the Rectangle at.
	 * @return {Rectangle} This Rectangle object
	 */
	centerOn: function(x, y) {

		this.centerX = x;
		this.centerY = y;

		return this;

	},

	/**
	 * Runs Math.floor() on both the x and y values of this Rectangle.
	 * @method Rectangle#floor
	 */
	floor: function() {

		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

	},

	/**
	 * Runs Math.floor() on the x, y, width and height values of this Rectangle.
	 * @method Rectangle#floorAll
	 */
	floorAll: function() {

		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.width = Math.floor(this.width);
		this.height = Math.floor(this.height);

	},

	/**
	 * Runs Math.ceil() on both the x and y values of this Rectangle.
	 * @method Rectangle#ceil
	 */
	ceil: function() {

		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);

	},

	/**
	 * Runs Math.ceil() on the x, y, width and height values of this Rectangle.
	 * @method Rectangle#ceilAll
	 */
	ceilAll: function() {

		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.width = Math.ceil(this.width);
		this.height = Math.ceil(this.height);

	},

	/**
	 * Copies the x, y, width and height properties from any given object to this Rectangle.
	 * @method Rectangle#copyFrom
	 * @param {any} source - The object to copy from.
	 * @return {Rectangle} This Rectangle object.
	 */
	copyFrom: function(source) {

		return this.setTo(source.x, source.y, source.width, source.height);

	},

	/**
	 * Copies the x, y, width and height properties from this Rectangle to any given object.
	 * @method Rectangle#copyTo
	 * @param {any} source - The object to copy to.
	 * @return {object} This object.
	 */
	copyTo: function(dest) {

		dest.x = this.x;
		dest.y = this.y;
		dest.width = this.width;
		dest.height = this.height;

		return dest;

	},

	/**
	 * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
	 * @method Rectangle#inflate
	 * @param {number} dx - The amount to be added to the left side of the Rectangle.
	 * @param {number} dy - The amount to be added to the bottom side of the Rectangle.
	 * @return {Rectangle} This Rectangle object.
	 */
	inflate: function(dx, dy) {

		return Rectangle.inflate(this, dx, dy);

	},

	/**
	 * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
	 * @method Rectangle#size
	 * @param {Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
	 * @return {Point} The size of the Rectangle object.
	 */
	size: function(output) {

		return Rectangle.size(this, output);

	},

	/**
	 * Resize the Rectangle by providing a new width and height.
	 * The x and y positions remain unchanged.
	 * 
	 * @method Rectangle#resize
	 * @param {number} width - The width of the Rectangle. Should always be either zero or a positive value.
	 * @param {number} height - The height of the Rectangle. Should always be either zero or a positive value.
	 * @return {Rectangle} This Rectangle object
	 */
	resize: function(width, height) {

		this.width = width;
		this.height = height;

		return this;

	},

	/**
	 * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
	 * @method Rectangle#clone
	 * @param {Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
	 * @return {Rectangle}
	 */
	clone: function(output) {

		return Rectangle.clone(this, output);

	},

	/**
	 * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
	 * @method Rectangle#contains
	 * @param {number} x - The x coordinate of the point to test.
	 * @param {number} y - The y coordinate of the point to test.
	 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
	 */
	contains: function(x, y) {

		return Rectangle.contains(this, x, y);

	},

	/**
	 * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
	 * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
	 * @method Rectangle#containsRect
	 * @param {Rectangle} b - The second Rectangle object.
	 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
	 */
	containsRect: function(b) {

		return Rectangle.containsRect(b, this);

	},

	/**
	 * Determines whether the two Rectangles are equal.
	 * This method compares the x, y, width and height properties of each Rectangle.
	 * @method Rectangle#equals
	 * @param {Rectangle} b - The second Rectangle object.
	 * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
	 */
	equals: function(b) {

		return Rectangle.equals(this, b);

	},

	/**
	 * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
	 * @method Rectangle#intersection
	 * @param {Rectangle} b - The second Rectangle object.
	 * @param {Rectangle} out - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
	 * @return {Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
	 */
	intersection: function(b, out) {

		return Rectangle.intersection(this, b, out);

	},

	/**
	 * Determines whether this Rectangle and another given Rectangle intersect with each other.
	 * This method checks the x, y, width, and height properties of the two Rectangles.
	 * 
	 * @method Rectangle#intersects
	 * @param {Rectangle} b - The second Rectangle object.
	 * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
	 */
	intersects: function(b) {

		return Rectangle.intersects(this, b);

	},

	/**
	 * Determines whether the coordinates given intersects (overlaps) with this Rectangle.
	 *
	 * @method Rectangle#intersectsRaw
	 * @param {number} left - The x coordinate of the left of the area.
	 * @param {number} right - The right coordinate of the area.
	 * @param {number} top - The y coordinate of the area.
	 * @param {number} bottom - The bottom coordinate of the area.
	 * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
	 * @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
	 */
	intersectsRaw: function(left, right, top, bottom, tolerance) {

		return Rectangle.intersectsRaw(this, left, right, top, bottom, tolerance);

	},

	/**
	 * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
	 * @method Rectangle#union
	 * @param {Rectangle} b - The second Rectangle object.
	 * @param {Rectangle} [out] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
	 * @return {Rectangle} A Rectangle object that is the union of the two Rectangles.
	 */
	union: function(b, out) {

		return Rectangle.union(this, b, out);

	},

	/**
	 * Returns a uniformly distributed random point from anywhere within this Rectangle.
	 * 
	 * @method Rectangle#random
	 * @param {Point|object} [out] - A Point, or any object with public x/y properties, that the values will be set in.
	 *     If no object is provided a new Point object will be created. In high performance areas avoid this by re-using an existing object.
	 * @return {Point} An object containing the random point in its `x` and `y` properties.
	 */
	random: function(out) {

		if (out === undefined) {
			out = new Point();
		}

		out.x = this.randomX;
		out.y = this.randomY;

		return out;

	},

	/**
	 * Returns a point based on the given position constant, which can be one of:
	 * 
	 * `TOP_LEFT`, `TOP_CENTER`, `TOP_RIGHT`, `LEFT_CENTER`,
	 * `CENTER`, `RIGHT_CENTER`, `BOTTOM_LEFT`, `BOTTOM_CENTER` 
	 * and `BOTTOM_RIGHT`.
	 *
	 * This method returns the same values as calling Rectangle.bottomLeft, etc, but those
	 * calls always create a new Point object, where-as this one allows you to use your own.
	 * 
	 * @method Rectangle#getPoint
	 * @param {integer} [position] - One of the Phaser position constants, such as `TOP_RIGHT`.
	 * @param {Point} [out] - A Point that the values will be set in.
	 *     If no object is provided a new Point object will be created. In high performance areas avoid this by re-using an existing object.
	 * @return {Point} An object containing the point in its `x` and `y` properties.
	 */
	getPoint: function(position, out) {

		if (out === undefined) {
			out = new Point();
		}

		switch (position) {
			default:
			case TOP_LEFT:
				return out.set(this.x, this.y);

			case TOP_CENTER:
				return out.set(this.centerX, this.y);

			case TOP_RIGHT:
				return out.set(this.right, this.y);

			case LEFT_CENTER:
				return out.set(this.x, this.centerY);

			case CENTER:
				return out.set(this.centerX, this.centerY);

			case RIGHT_CENTER:
				return out.set(this.right, this.centerY);

			case BOTTOM_LEFT:
				return out.set(this.x, this.bottom);

			case BOTTOM_CENTER:
				return out.set(this.centerX, this.bottom);

			case BOTTOM_RIGHT:
				return out.set(this.right, this.bottom);
		}

	},

	/**
	 * Returns a string representation of this object.
	 * @method Rectangle#toString
	 * @return {string} A string representation of the instance.
	 */
	toString: function() {

		return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" +
			this.empty + ")}]";

	}

};

/**
 * @name Rectangle#halfWidth
 * @property {number} halfWidth - Half of the width of the Rectangle.
 * @readonly
 */
Object.defineProperty(Rectangle.prototype, "halfWidth", {

	get: function() {
		return Math.round(this.width / 2);
	}

});

/**
 * @name Rectangle#halfHeight
 * @property {number} halfHeight - Half of the height of the Rectangle.
 * @readonly
 */
Object.defineProperty(Rectangle.prototype, "halfHeight", {

	get: function() {
		return Math.round(this.height / 2);
	}

});

/**
 * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
 * @name Rectangle#bottom
 * @property {number} bottom - The sum of the y and height properties.
 */
Object.defineProperty(Rectangle.prototype, "bottom", {

	get: function() {
		return this.y + this.height;
	},

	set: function(value) {

		if (value <= this.y) {
			this.height = 0;
		} else {
			this.height = value - this.y;
		}

	}

});

/**
 * The location of the Rectangles bottom left corner as a Point object.
 * @name Rectangle#bottomLeft
 * @property {Point} bottomLeft - Gets or sets the location of the Rectangles bottom left corner as a Point object.
 */
Object.defineProperty(Rectangle.prototype, "bottomLeft", {

	get: function() {
		return new Point(this.x, this.bottom);
	},

	set: function(value) {
		this.x = value.x;
		this.bottom = value.y;
	}

});

/**
 * The location of the Rectangles bottom right corner as a Point object.
 * @name Rectangle#bottomRight
 * @property {Point} bottomRight - Gets or sets the location of the Rectangles bottom right corner as a Point object.
 */
Object.defineProperty(Rectangle.prototype, "bottomRight", {

	get: function() {
		return new Point(this.right, this.bottom);
	},

	set: function(value) {
		this.right = value.x;
		this.bottom = value.y;
	}

});

/**
 * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
 * @name Rectangle#left
 * @property {number} left - The x coordinate of the left of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "left", {

	get: function() {
		return this.x;
	},

	set: function(value) {
		if (value >= this.right) {
			this.width = 0;
		} else {
			this.width = this.right - value;
		}
		this.x = value;
	}

});

/**
 * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties, however it does affect the width property.
 * @name Rectangle#right
 * @property {number} right - The sum of the x and width properties.
 */
Object.defineProperty(Rectangle.prototype, "right", {

	get: function() {
		return this.x + this.width;
	},

	set: function(value) {
		if (value <= this.x) {
			this.width = 0;
		} else {
			this.width = value - this.x;
		}
	}

});

/**
 * The volume of the Rectangle derived from width * height.
 * @name Rectangle#volume
 * @property {number} volume - The volume of the Rectangle derived from width * height.
 * @readonly
 */
Object.defineProperty(Rectangle.prototype, "volume", {

	get: function() {
		return this.width * this.height;
	}

});

/**
 * The perimeter size of the Rectangle. This is the sum of all 4 sides.
 * @name Rectangle#perimeter
 * @property {number} perimeter - The perimeter size of the Rectangle. This is the sum of all 4 sides.
 * @readonly
 */
Object.defineProperty(Rectangle.prototype, "perimeter", {

	get: function() {
		return (this.width * 2) + (this.height * 2);
	}

});

/**
 * The x coordinate of the center of the Rectangle.
 * @name Rectangle#centerX
 * @property {number} centerX - The x coordinate of the center of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "centerX", {

	get: function() {
		return this.x + this.halfWidth;
	},

	set: function(value) {
		this.x = value - this.halfWidth;
	}

});

/**
 * The y coordinate of the center of the Rectangle.
 * @name Rectangle#centerY
 * @property {number} centerY - The y coordinate of the center of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "centerY", {

	get: function() {
		return this.y + this.halfHeight;
	},

	set: function(value) {
		this.y = value - this.halfHeight;
	}

});

/**
 * A random value between the left and right values (inclusive) of the Rectangle.
 *
 * @name Rectangle#randomX
 * @property {number} randomX - A random value between the left and right values (inclusive) of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "randomX", {

	get: function() {

		return this.x + (Math.random() * this.width);

	}

});

/**
 * A random value between the top and bottom values (inclusive) of the Rectangle.
 *
 * @name Rectangle#randomY
 * @property {number} randomY - A random value between the top and bottom values (inclusive) of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "randomY", {

	get: function() {

		return this.y + (Math.random() * this.height);

	}

});

/**
 * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
 * However it does affect the height property, whereas changing the y value does not affect the height property.
 * @name Rectangle#top
 * @property {number} top - The y coordinate of the top of the Rectangle.
 */
Object.defineProperty(Rectangle.prototype, "top", {

	get: function() {
		return this.y;
	},

	set: function(value) {
		if (value >= this.bottom) {
			this.height = 0;
			this.y = value;
		} else {
			this.height = (this.bottom - value);
		}
	}

});

/**
 * The location of the Rectangles top left corner as a Point object.
 * @name Rectangle#topLeft
 * @property {Point} topLeft - The location of the Rectangles top left corner as a Point object.
 */
Object.defineProperty(Rectangle.prototype, "topLeft", {

	get: function() {
		return new Point(this.x, this.y);
	},

	set: function(value) {
		this.x = value.x;
		this.y = value.y;
	}

});

/**
 * The location of the Rectangles top right corner as a Point object.
 * @name Rectangle#topRight
 * @property {Point} topRight - The location of the Rectangles top left corner as a Point object.
 */
Object.defineProperty(Rectangle.prototype, "topRight", {

	get: function() {
		return new Point(this.x + this.width, this.y);
	},

	set: function(value) {
		this.right = value.x;
		this.y = value.y;
	}

});

/**
 * Determines whether or not this Rectangle object is empty. A Rectangle object is empty if its width or height is less than or equal to 0.
 * If set to true then all of the Rectangle properties are set to 0.
 * @name Rectangle#empty
 * @property {boolean} empty - Gets or sets the Rectangles empty state.
 */
Object.defineProperty(Rectangle.prototype, "empty", {

	get: function() {
		return (!this.width || !this.height);
	},

	set: function(value) {

		if (value === true) {
			this.setTo(0, 0, 0, 0);
		}

	}

});

Rectangle.prototype.constructor = Rectangle;

/**
 * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
 * @method Rectangle.inflate
 * @param {Rectangle} a - The Rectangle object.
 * @param {number} dx - The amount to be added to the left side of the Rectangle.
 * @param {number} dy - The amount to be added to the bottom side of the Rectangle.
 * @return {Rectangle} This Rectangle object.
 */
Rectangle.inflate = function(a, dx, dy) {

	a.x -= dx;
	a.width += 2 * dx;
	a.y -= dy;
	a.height += 2 * dy;

	return a;

};

/**
 * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
 * @method Rectangle.inflatePoint
 * @param {Rectangle} a - The Rectangle object.
 * @param {Point} point - The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
 * @return {Rectangle} The Rectangle object.
 */
Rectangle.inflatePoint = function(a, point) {

	return Rectangle.inflate(a, point.x, point.y);

};

/**
 * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
 * @method Rectangle.size
 * @param {Rectangle} a - The Rectangle object.
 * @param {Point} [output] - Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
 * @return {Point} The size of the Rectangle object
 */
Rectangle.size = function(a, output) {

	if (output === undefined || output === null) {
		output = new Point(a.width, a.height);
	} else {
		output.setTo(a.width, a.height);
	}

	return output;

};

/**
 * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
 * @method Rectangle.clone
 * @param {Rectangle} a - The Rectangle object.
 * @param {Rectangle} [output] - Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
 * @return {Rectangle}
 */
Rectangle.clone = function(a, output) {

	if (output === undefined || output === null) {
		output = new Rectangle(a.x, a.y, a.width, a.height);
	} else {
		output.setTo(a.x, a.y, a.width, a.height);
	}

	return output;

};

/**
 * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
 * @method Rectangle.contains
 * @param {Rectangle} a - The Rectangle object.
 * @param {number} x - The x coordinate of the point to test.
 * @param {number} y - The y coordinate of the point to test.
 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
 */
Rectangle.contains = function(a, x, y) {

	if (a.width <= 0 || a.height <= 0) {
		return false;
	}

	return (x >= a.x && x < a.right && y >= a.y && y < a.bottom);

};

/**
 * Determines whether the specified coordinates are contained within the region defined by the given raw values.
 * @method Rectangle.containsRaw
 * @param {number} rx - The x coordinate of the top left of the area.
 * @param {number} ry - The y coordinate of the top left of the area.
 * @param {number} rw - The width of the area.
 * @param {number} rh - The height of the area.
 * @param {number} x - The x coordinate of the point to test.
 * @param {number} y - The y coordinate of the point to test.
 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
 */
Rectangle.containsRaw = function(rx, ry, rw, rh, x, y) {

	return (x >= rx && x < (rx + rw) && y >= ry && y < (ry + rh));

};

/**
 * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
 * @method Rectangle.containsPoint
 * @param {Rectangle} a - The Rectangle object.
 * @param {Point} point - The point object being checked. Can be Point or any object with .x and .y values.
 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
 */
Rectangle.containsPoint = function(a, point) {

	return Rectangle.contains(a, point.x, point.y);

};

/**
 * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
 * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
 * @method Rectangle.containsRect
 * @param {Rectangle} a - The first Rectangle object.
 * @param {Rectangle} b - The second Rectangle object.
 * @return {boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
 */
Rectangle.containsRect = function(a, b) {

	//  If the given rect has a larger volume than this one then it can never contain it
	if (a.volume > b.volume) {
		return false;
	}

	return (a.x >= b.x && a.y >= b.y && a.right < b.right && a.bottom < b.bottom);

};

/**
 * Determines whether the two Rectangles are equal.
 * This method compares the x, y, width and height properties of each Rectangle.
 * @method Rectangle.equals
 * @param {Rectangle} a - The first Rectangle object.
 * @param {Rectangle} b - The second Rectangle object.
 * @return {boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
 */
Rectangle.equals = function(a, b) {

	return (a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height);

};

/**
 * Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
 * @method Rectangle.sameDimensions
 * @param {Rectangle-like} a - The first Rectangle object.
 * @param {Rectangle-like} b - The second Rectangle object.
 * @return {boolean} True if the object have equivalent values for the width and height properties.
 */
Rectangle.sameDimensions = function(a, b) {

	return (a.width === b.width && a.height === b.height);

};

/**
 * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
 * @method Rectangle.intersection
 * @param {Rectangle} a - The first Rectangle object.
 * @param {Rectangle} b - The second Rectangle object.
 * @param {Rectangle} [output] - Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
 * @return {Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
 */
Rectangle.intersection = function(a, b, output) {

	if (output === undefined) {
		output = new Rectangle();
	}

	if (Rectangle.intersects(a, b)) {
		output.x = Math.max(a.x, b.x);
		output.y = Math.max(a.y, b.y);
		output.width = Math.min(a.right, b.right) - output.x;
		output.height = Math.min(a.bottom, b.bottom) - output.y;
	}

	return output;

};

/**
 * Determines whether the two Rectangles intersect with each other.
 * This method checks the x, y, width, and height properties of the Rectangles.
 * @method Rectangle.intersects
 * @param {Rectangle} a - The first Rectangle object.
 * @param {Rectangle} b - The second Rectangle object.
 * @return {boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
 */
Rectangle.intersects = function(a, b) {

	if (a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) {
		return false;
	}

	return !(a.right < b.x || a.bottom < b.y || a.x > b.right || a.y > b.bottom);

};

/**
 * Determines whether the object specified intersects (overlaps) with the given values.
 * @method Rectangle.intersectsRaw
 * @param {number} left - The x coordinate of the left of the area.
 * @param {number} right - The right coordinate of the area.
 * @param {number} top - The y coordinate of the area.
 * @param {number} bottom - The bottom coordinate of the area.
 * @param {number} tolerance - A tolerance value to allow for an intersection test with padding, default to 0
 * @return {boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
 */
Rectangle.intersectsRaw = function(a, left, right, top, bottom, tolerance) {

	if (tolerance === undefined) {
		tolerance = 0;
	}

	return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top -
		tolerance);

};

/**
 * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
 * @method Rectangle.union
 * @param {Rectangle} a - The first Rectangle object.
 * @param {Rectangle} b - The second Rectangle object.
 * @param {Rectangle} [output] - Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
 * @return {Rectangle} A Rectangle object that is the union of the two Rectangles.
 */
Rectangle.union = function(a, b, output) {

	if (output === undefined) {
		output = new Rectangle();
	}

	return output.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right) - Math.min(a.left, b.left),
		Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top));

};

/**
 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
 *
 * @method Rectangle#aabb
 * @param {Point[]} points - The array of one or more points.
 * @param {Rectangle} [out] - Optional Rectangle to store the value in, if not supplied a new Rectangle object will be created.
 * @return {Rectangle} The new Rectangle object.
 * @static
 */
Rectangle.aabb = function(points, out) {

	if (out === undefined) {
		out = new Rectangle();
	}

	var xMax = Number.NEGATIVE_INFINITY,
		xMin = Number.POSITIVE_INFINITY,
		yMax = Number.NEGATIVE_INFINITY,
		yMin = Number.POSITIVE_INFINITY;

	points.forEach(function(point) {
		if (point.x > xMax) {
			xMax = point.x;
		}
		if (point.x < xMin) {
			xMin = point.x;
		}

		if (point.y > yMax) {
			yMax = point.y;
		}
		if (point.y < yMin) {
			yMin = point.y;
		}
	});

	out.setTo(xMin, yMin, xMax - xMin, yMax - yMin);

	return out;
};

//   Because PIXI uses its own Rectangle, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.Rectangle = Rectangle;
PIXI.EmptyRectangle = new Rectangle(0, 0, 0, 0);


Pointer = function(game, id, pointerMode) {

	/**
	 * @property {Game} game - A reference to the currently running game.
	 */
	this.game = game;

	/**
	 * @property {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
	 */
	this.id = id;

	/**
	 * @property {number} type - The const type of this object.
	 * @readonly
	 */
	this.type = POINTER;

	/**
	 * @property {boolean} exists - A Pointer object that exists is allowed to be checked for physics collisions and overlaps.
	 * @default
	 */
	this.exists = true;

	/**
	 * @property {number} identifier - The identifier property of the Pointer as set by the DOM event when this Pointer is started.
	 * @default
	 */
	this.identifier = 0;

	/**
	 * @property {number} pointerId - The pointerId property of the Pointer as set by the DOM event when this Pointer is started. The browser can and will recycle this value.
	 * @default
	 */
	this.pointerId = null;

	/**
	 * @property {PointerMode} pointerMode - The operational mode of this pointer.
	 */
	this.pointerMode = pointerMode || (PointerMode.CURSOR | PointerMode.CONTACT);

	/**
	 * @property {any} target - The target property of the Pointer as set by the DOM event when this Pointer is started.
	 * @default
	 */
	this.target = null;

	/**
	 * The button property of the most recent DOM event when this Pointer is started.
	 * You should not rely on this value for accurate button detection, instead use the Pointer properties
	 * `leftButton`, `rightButton`, `middleButton` and so on.
	 * @property {any} button
	 * @default
	 */
	this.button = null;

	/**
	 * If this Pointer is a Mouse or Pen / Stylus then you can access its left button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 * 
	 * @property {DeviceButton} leftButton
	 * @default
	 */
	this.leftButton = new DeviceButton(this, Pointer.LEFT_BUTTON);

	/**
	 * If this Pointer is a Mouse or Pen / Stylus then you can access its middle button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 *
	 * Please see the DeviceButton docs for details on browser button limitations.
	 * 
	 * @property {DeviceButton} middleButton
	 * @default
	 */
	this.middleButton = new DeviceButton(this, Pointer.MIDDLE_BUTTON);

	/**
	 * If this Pointer is a Mouse or Pen / Stylus then you can access its right button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 *
	 * Please see the DeviceButton docs for details on browser button limitations.
	 * 
	 * @property {DeviceButton} rightButton
	 * @default
	 */
	this.rightButton = new DeviceButton(this, Pointer.RIGHT_BUTTON);

	/**
	 * If this Pointer is a Mouse or Pen / Stylus then you can access its X1 (back) button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 *
	 * Please see the DeviceButton docs for details on browser button limitations.
	 * 
	 * @property {DeviceButton} backButton
	 * @default
	 */
	this.backButton = new DeviceButton(this, Pointer.BACK_BUTTON);

	/**
	 * If this Pointer is a Mouse or Pen / Stylus then you can access its X2 (forward) button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 *
	 * Please see the DeviceButton docs for details on browser button limitations.
	 * 
	 * @property {DeviceButton} forwardButton
	 * @default
	 */
	this.forwardButton = new DeviceButton(this, Pointer.FORWARD_BUTTON);

	/**
	 * If this Pointer is a Pen / Stylus then you can access its eraser button directly through this property.
	 * 
	 * The DeviceButton has its own properties such as `isDown`, `duration` and methods like `justReleased` for more fine-grained
	 * button control.
	 *
	 * Please see the DeviceButton docs for details on browser button limitations.
	 * 
	 * @property {DeviceButton} eraserButton
	 * @default
	 */
	this.eraserButton = new DeviceButton(this, Pointer.ERASER_BUTTON);

	/**
	 * @property {boolean} _holdSent - Local private variable to store the status of dispatching a hold event.
	 * @private
	 * @default
	 */
	this._holdSent = false;

	/**
	 * @property {array} _history - Local private variable storing the short-term history of pointer movements.
	 * @private
	 */
	this._history = [];

	/**
	 * @property {number} _nextDrop - Local private variable storing the time at which the next history drop should occur.
	 * @private
	 */
	this._nextDrop = 0;

	/**
	 * @property {boolean} _stateReset - Monitor events outside of a state reset loop.
	 * @private
	 */
	this._stateReset = false;

	/**
	 * @property {boolean} withinGame - true if the Pointer is over the game canvas, otherwise false.
	 */
	this.withinGame = false;

	/**
	 * @property {number} clientX - The horizontal coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
	 */
	this.clientX = -1;

	/**
	 * @property {number} clientY - The vertical coordinate of the Pointer within the application's client area at which the event occurred (as opposed to the coordinates within the page).
	 */
	this.clientY = -1;

	/**
	 * @property {number} pageX - The horizontal coordinate of the Pointer relative to whole document.
	 */
	this.pageX = -1;

	/**
	 * @property {number} pageY - The vertical coordinate of the Pointer relative to whole document.
	 */
	this.pageY = -1;

	/**
	 * @property {number} screenX - The horizontal coordinate of the Pointer relative to the screen.
	 */
	this.screenX = -1;

	/**
	 * @property {number} screenY - The vertical coordinate of the Pointer relative to the screen.
	 */
	this.screenY = -1;

	/**
	 * @property {number} rawMovementX - The horizontal raw relative movement of the Pointer in pixels since last event.
	 * @default
	 */
	this.rawMovementX = 0;

	/**
	 * @property {number} rawMovementY - The vertical raw relative movement of the Pointer in pixels since last event.
	 * @default
	 */
	this.rawMovementY = 0;

	/**
	 * @property {number} movementX - The horizontal processed relative movement of the Pointer in pixels since last event.
	 * @default
	 */
	this.movementX = 0;

	/**
	 * @property {number} movementY - The vertical processed relative movement of the Pointer in pixels since last event.
	 * @default
	 */
	this.movementY = 0;

	/**
	 * @property {number} x - The horizontal coordinate of the Pointer. This value is automatically scaled based on the game scale.
	 * @default
	 */
	this.x = -1;

	/**
	 * @property {number} y - The vertical coordinate of the Pointer. This value is automatically scaled based on the game scale.
	 * @default
	 */
	this.y = -1;

	/**
	 * @property {boolean} isMouse - If the Pointer is a mouse or pen / stylus this is true, otherwise false.
	 */
	this.isMouse = (id === 0);

	/**
	 * If the Pointer is touching the touchscreen, or *any* mouse or pen button is held down, isDown is set to true.
	 * If you need to check a specific mouse or pen button then use the button properties, i.e. Pointer.rightButton.isDown.
	 * @property {boolean} isDown
	 * @default
	 */
	this.isDown = false;

	/**
	 * If the Pointer is not touching the touchscreen, or *all* mouse or pen buttons are up, isUp is set to true.
	 * If you need to check a specific mouse or pen button then use the button properties, i.e. Pointer.rightButton.isUp.
	 * @property {boolean} isUp
	 * @default
	 */
	this.isUp = true;

	/**
	 * @property {number} timeDown - A timestamp representing when the Pointer first touched the touchscreen.
	 * @default
	 */
	this.timeDown = 0;

	/**
	 * @property {number} timeUp - A timestamp representing when the Pointer left the touchscreen.
	 * @default
	 */
	this.timeUp = 0;

	/**
	 * @property {number} previousTapTime - A timestamp representing when the Pointer was last tapped or clicked.
	 * @default
	 */
	this.previousTapTime = 0;

	/**
	 * @property {number} totalTouches - The total number of times this Pointer has been touched to the touchscreen.
	 * @default
	 */
	this.totalTouches = 0;

	/**
	 * @property {number} msSinceLastClick - The number of milliseconds since the last click or touch event.
	 * @default
	 */
	this.msSinceLastClick = Number.MAX_VALUE;

	/**
	 * @property {any} targetObject - The Game Object this Pointer is currently over / touching / dragging.
	 * @default
	 */
	this.targetObject = null;

	/**
	 * This array is erased and re-populated every time this Pointer is updated. It contains references to all
	 * of the Game Objects that were considered as being valid for processing by this Pointer, this frame. To be
	 * valid they must have suitable a `priorityID`, be Input enabled, visible and actually have the Pointer over
	 * them. You can check the contents of this array in events such as `onInputDown`, but beware it is reset
	 * every frame.
	 * @property {array} interactiveCandidates
	 * @default
	 */
	this.interactiveCandidates = [];

	/**
	 * @property {boolean} active - An active pointer is one that is currently pressed down on the display. A Mouse is always active.
	 * @default
	 */
	this.active = false;

	/**
	 * @property {boolean} dirty - A dirty pointer needs to re-poll any interactive objects it may have been over, regardless if it has moved or not.
	 * @default
	 */
	this.dirty = false;

	/**
	 * @property {Point} position - A Point object containing the current x/y values of the pointer on the display.
	 */
	this.position = new Point();

	/**
	 * @property {Point} positionDown - A Point object containing the x/y values of the pointer when it was last in a down state on the display.
	 */
	this.positionDown = new Point();

	/**
	 * @property {Point} positionUp - A Point object containing the x/y values of the pointer when it was last released.
	 */
	this.positionUp = new Point();

	/**
	 * A Circle that is centered on the x/y coordinates of this pointer, useful for hit detection.
	 * The Circle size is 44px (Apples recommended "finger tip" size).
	 * @property {Circle} circle
	 */
	this.circle = new Circle(0, 0, 44);

	/**
	 * Click trampolines associated with this pointer. See `addClickTrampoline`.
	 * @property {object[]|null} _clickTrampolines
	 * @private
	 */
	this._clickTrampolines = null;

	/**
	 * When the Pointer has click trampolines the last target object is stored here
	 * so it can be used to check for validity of the trampoline in a post-Up/'stop'.
	 * @property {object} _trampolineTargetObject
	 * @private
	 */
	this._trampolineTargetObject = null;

};
/**
 * No buttons at all.
 * @constant
 * @type {number}
 */
Pointer.NO_BUTTON = 0;

/**
 * The Left Mouse button, or in PointerEvent devices a Touch contact or Pen contact.
 * @constant
 * @type {number}
 */
Pointer.LEFT_BUTTON = 1;

/**
 * The Right Mouse button, or in PointerEvent devices a Pen contact with a barrel button.
 * @constant
 * @type {number}
 */
Pointer.RIGHT_BUTTON = 2;

/**
 * The Middle Mouse button.
 * @constant
 * @type {number}
 */
Pointer.MIDDLE_BUTTON = 4;

/**
 * The X1 button. This is typically the mouse Back button, but is often reconfigured.
 * On Linux (GTK) this is unsupported. On Windows if advanced pointer software (such as IntelliPoint) is installed this doesn't register.
 * @constant
 * @type {number}
 */
Pointer.BACK_BUTTON = 8;

/**
 * The X2 button. This is typically the mouse Forward button, but is often reconfigured.
 * On Linux (GTK) this is unsupported. On Windows if advanced pointer software (such as IntelliPoint) is installed this doesn't register.
 * @constant
 * @type {number}
 */
Pointer.FORWARD_BUTTON = 16;

/**
 * The Eraser pen button on PointerEvent supported devices only.
 * @constant
 * @type {number}
 */
Pointer.ERASER_BUTTON = 32;
Pointer.prototype = {

	/**
	 * Resets the states of all the button booleans.
	 * 
	 * @method Pointer#resetButtons
	 * @protected
	 */
	resetButtons: function() {

		this.isDown = false;
		this.isUp = true;

		if (this.isMouse) {
			this.leftButton.reset();
			this.middleButton.reset();
			this.rightButton.reset();
			this.backButton.reset();
			this.forwardButton.reset();
			this.eraserButton.reset();
		}

	},

	/**
	 * Called by updateButtons.
	 * 
	 * @method Pointer#processButtonsDown
	 * @private
	 * @param {integer} buttons - The DOM event.buttons property.
	 * @param {MouseEvent} event - The DOM event.
	 */
	processButtonsDown: function(buttons, event) {

		//  Note: These are bitwise checks, not booleans

		if (Pointer.LEFT_BUTTON & buttons) {
			this.leftButton.start(event);
		}

		if (Pointer.RIGHT_BUTTON & buttons) {
			this.rightButton.start(event);
		}

		if (Pointer.MIDDLE_BUTTON & buttons) {
			this.middleButton.start(event);
		}

		if (Pointer.BACK_BUTTON & buttons) {
			this.backButton.start(event);
		}

		if (Pointer.FORWARD_BUTTON & buttons) {
			this.forwardButton.start(event);
		}

		if (Pointer.ERASER_BUTTON & buttons) {
			this.eraserButton.start(event);
		}

	},

	/**
	 * Called by updateButtons.
	 * 
	 * @method Pointer#processButtonsUp
	 * @private
	 * @param {integer} buttons - The DOM event.buttons property.
	 * @param {MouseEvent} event - The DOM event.
	 */
	processButtonsUp: function(button, event) {

		//  Note: These are bitwise checks, not booleans

		if (button === Mouse.LEFT_BUTTON) {
			this.leftButton.stop(event);
		}

		if (button === Mouse.RIGHT_BUTTON) {
			this.rightButton.stop(event);
		}

		if (button === Mouse.MIDDLE_BUTTON) {
			this.middleButton.stop(event);
		}

		if (button === Mouse.BACK_BUTTON) {
			this.backButton.stop(event);
		}

		if (button === Mouse.FORWARD_BUTTON) {
			this.forwardButton.stop(event);
		}

		if (button === 5) {
			this.eraserButton.stop(event);
		}

	},

	/**
	 * Called when the event.buttons property changes from zero.
	 * Contains a button bitmask.
	 * 
	 * @method Pointer#updateButtons
	 * @protected
	 * @param {MouseEvent} event - The DOM event.
	 */
	updateButtons: function(event) {

		this.button = event.button;

		var down = (event.type.toLowerCase().substr(-4) === 'down');

		if (event.buttons !== undefined) {
			if (down) {
				this.processButtonsDown(event.buttons, event);
			} else {
				this.processButtonsUp(event.button, event);
			}
		} else {
			//  No buttons property (like Safari on OSX when using a trackpad)
			if (down) {
				this.leftButton.start(event);
			} else {
				this.leftButton.stop(event);
				this.rightButton.stop(event);
			}
		}

		//  On OS X (and other devices with trackpads) you have to press CTRL + the pad
		//  to initiate a right-click event, so we'll check for that here ONLY if
		//  event.buttons = 1 (i.e. they only have a 1 button mouse or trackpad)

		if (event.buttons === 1 && event.ctrlKey && this.leftButton.isDown) {
			this.leftButton.stop(event);
			this.rightButton.start(event);
		}

		this.isUp = true;
		this.isDown = false;

		if (this.leftButton.isDown || this.rightButton.isDown || this.middleButton.isDown || this.backButton.isDown || this
			.forwardButton.isDown || this.eraserButton.isDown) {
			this.isUp = false;
			this.isDown = true;
		}

	},

	/**
	 * Called when the Pointer is pressed onto the touchscreen.
	 * @method Pointer#start
	 * @param {any} event - The DOM event from the browser.
	 */
	start: function(event) {

		var input = this.game.input;

		if (event['pointerId']) {
			this.pointerId = event.pointerId;
		}

		this.identifier = event.identifier;
		this.target = event.target;

		if (this.isMouse) {
			this.updateButtons(event);
		} else {
			this.isDown = true;
			this.isUp = false;
		}

		this.active = true;
		this.withinGame = true;
		this.dirty = false;

		this._history = [];
		this._clickTrampolines = null;
		this._trampolineTargetObject = null;

		//  Work out how long it has been since the last click
		this.msSinceLastClick = this.game.time.time - this.timeDown;
		this.timeDown = this.game.time.time;
		this._holdSent = false;

		//  This sets the x/y and other local values
		this.move(event, true);

		// x and y are the old values here?
		this.positionDown.setTo(this.x, this.y);

		if (input.multiInputOverride === Input.MOUSE_OVERRIDES_TOUCH ||
			input.multiInputOverride === Input.MOUSE_TOUCH_COMBINE ||
			(input.multiInputOverride === Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0)) {
			input.x = this.x;
			input.y = this.y;
			input.position.setTo(this.x, this.y);
			input.onDown.dispatch(this, event);
			input.resetSpeed(this.x, this.y);
		}

		this._stateReset = false;

		this.totalTouches++;

		if (this.targetObject !== null) {
			this.targetObject._touchedHandler(this);
		}

		return this;

	},

	/**
	 * Called by the Input Manager.
	 * @method Pointer#update
	 */
	update: function() {

		var input = this.game.input;

		if (this.active) {
			//  Force a check?
			if (this.dirty) {
				if (input.interactiveItems.total > 0) {
					this.processInteractiveObjects(false);
				}

				this.dirty = false;
			}

			if (this._holdSent === false && this.duration >= input.holdRate) {
				if (input.multiInputOverride === Input.MOUSE_OVERRIDES_TOUCH ||
					input.multiInputOverride === Input.MOUSE_TOUCH_COMBINE ||
					(input.multiInputOverride === Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0)) {
					input.onHold.dispatch(this);
				}

				this._holdSent = true;
			}

			//  Update the droppings history
			if (input.recordPointerHistory && this.game.time.time >= this._nextDrop) {
				this._nextDrop = this.game.time.time + input.recordRate;

				this._history.push({
					x: this.position.x,
					y: this.position.y
				});

				if (this._history.length > input.recordLimit) {
					this._history.shift();
				}
			}
		}

	},

	/**
	 * Called when the Pointer is moved.
	 * 
	 * @method Pointer#move
	 * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
	 * @param {boolean} [fromClick=false] - Was this called from the click event?
	 */
	move: function(event, fromClick) {

		var input = this.game.input;

		if (input.pollLocked) {
			return;
		}

		if (fromClick === undefined) {
			fromClick = false;
		}

		if (event.button !== undefined) {
			this.button = event.button;
		}

		if (fromClick && this.isMouse) {
			this.updateButtons(event);
		}

		this.clientX = event.clientX;
		this.clientY = event.clientY;

		this.pageX = event.pageX;
		this.pageY = event.pageY;

		this.screenX = event.screenX;
		this.screenY = event.screenY;

		if (this.isMouse && input.mouse.locked && !fromClick) {
			this.rawMovementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			this.rawMovementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			this.movementX += this.rawMovementX;
			this.movementY += this.rawMovementY;
		}

		this.x = (this.pageX - this.game.scale.offset.x) * input.scale.x;
		this.y = (this.pageY - this.game.scale.offset.y) * input.scale.y;

		this.position.setTo(this.x, this.y);
		this.circle.x = this.x;
		this.circle.y = this.y;

		if (input.multiInputOverride === Input.MOUSE_OVERRIDES_TOUCH ||
			input.multiInputOverride === Input.MOUSE_TOUCH_COMBINE ||
			(input.multiInputOverride === Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0)) {
			input.activePointer = this;
			input.x = this.x;
			input.y = this.y;
			input.position.setTo(input.x, input.y);
			input.circle.x = input.x;
			input.circle.y = input.y;
		}

		this.withinGame = this.game.scale.bounds.contains(this.pageX, this.pageY);

		//  If the game is paused we don't process any target objects or callbacks
		if (this.game.paused) {
			return this;
		}

		var i = input.moveCallbacks.length;

		while (i--) {
			input.moveCallbacks[i].callback.call(input.moveCallbacks[i].context, this, this.x, this.y, fromClick);
		}

		//  Easy out if we're dragging something and it still exists
		if (this.targetObject !== null && this.targetObject.isDragged === true) {
			if (this.targetObject.update(this) === false) {
				this.targetObject = null;
			}
		} else if (input.interactiveItems.total > 0) {
			this.processInteractiveObjects(fromClick);
		}

		return this;

	},

	/**
	 * Process all interactive objects to find out which ones were updated in the recent Pointer move.
	 * 
	 * @method Pointer#processInteractiveObjects
	 * @protected
	 * @param {boolean} [fromClick=false] - Was this called from the click event?
	 * @return {boolean} True if this method processes an object (i.e. a Sprite becomes the Pointers currentTarget), otherwise false.
	 */
	processInteractiveObjects: function(fromClick) {

		//  Work out which object is on the top
		var highestRenderOrderID = 0;
		var highestInputPriorityID = -1;
		var candidateTarget = null;

		//  First pass gets all objects that the pointer is over that DON'T use pixelPerfect checks and get the highest ID
		//  We know they'll be valid for input detection but not which is the top just yet

		var currentNode = this.game.input.interactiveItems.first;

		this.interactiveCandidates = [];

		while (currentNode) {
			//  Reset checked status
			currentNode.checked = false;

			if (currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, false)) {
				//  Flag it as checked so we don't re-scan it on the next phase
				currentNode.checked = true;

				if ((fromClick && currentNode.checkPointerDown(this, true)) ||
					(!fromClick && currentNode.checkPointerOver(this, true))) {
					highestRenderOrderID = currentNode.sprite.renderOrderID;
					highestInputPriorityID = currentNode.priorityID;
					candidateTarget = currentNode;
					this.interactiveCandidates.push(currentNode);
				}
			}

			currentNode = this.game.input.interactiveItems.next;
		}

		//  Then in the second sweep we process ONLY the pixel perfect ones that are checked and who have a higher ID
		//  because if their ID is lower anyway then we can just automatically discount them
		//  (A node that was previously checked did not request a pixel-perfect check.)

		currentNode = this.game.input.interactiveItems.first;

		while (currentNode) {
			if (!currentNode.checked &&
				currentNode.validForInput(highestInputPriorityID, highestRenderOrderID, true)) {
				if ((fromClick && currentNode.checkPointerDown(this, false)) ||
					(!fromClick && currentNode.checkPointerOver(this, false))) {
					highestRenderOrderID = currentNode.sprite.renderOrderID;
					highestInputPriorityID = currentNode.priorityID;
					candidateTarget = currentNode;
					this.interactiveCandidates.push(currentNode);
				}
			}

			currentNode = this.game.input.interactiveItems.next;
		}

		if (this.game.input.customCandidateHandler) {
			candidateTarget = this.game.input.customCandidateHandler.call(this.game.input.customCandidateHandlerContext, this,
				this.interactiveCandidates, candidateTarget);
		}

		this.swapTarget(candidateTarget, false);

		return (this.targetObject !== null);

	},

	/**
	 * This will change the `Pointer.targetObject` object to be the one provided.
	 * 
	 * This allows you to have fine-grained control over which object the Pointer is targeting.
	 *
	 * Note that even if you set a new Target here, it is still able to be replaced by any other valid
	 * target during the next Pointer update.
	 *
	 * @method Pointer#swapTarget
	 * @param {InputHandler} newTarget - The new target for this Pointer. Note this is an `InputHandler`, so don't pass a Sprite, instead pass `sprite.input` to it.
	 * @param {boolean} [silent=false] - If true the new target AND the old one will NOT dispatch their `onInputOver` or `onInputOut` events.
	 */
	swapTarget: function(newTarget, silent) {

		if (silent === undefined) {
			silent = false;
		}

		//  Now we know the top-most item (if any) we can process it
		if (newTarget === null) {
			//  The pointer isn't currently over anything, check if we've got a lingering previous target
			if (this.targetObject) {
				this.targetObject._pointerOutHandler(this, silent);
				this.targetObject = null;
			}
		} else {
			if (this.targetObject === null) {
				//  And now set the new one
				this.targetObject = newTarget;
				newTarget._pointerOverHandler(this, silent);
			} else {
				//  We've got a target from the last update
				if (this.targetObject === newTarget) {
					//  Same target as before, so update it
					if (newTarget.update(this) === false) {
						this.targetObject = null;
					}
				} else {
					//  The target has changed, so tell the old one we've left it
					this.targetObject._pointerOutHandler(this, silent);

					//  And now set the new one
					this.targetObject = newTarget;
					this.targetObject._pointerOverHandler(this, silent);
				}
			}
		}

	},

	/**
	 * Called when the Pointer leaves the target area.
	 *
	 * @method Pointer#leave
	 * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
	 */
	leave: function(event) {

		this.withinGame = false;
		this.move(event, false);

	},

	/**
	 * Called when the Pointer leaves the touchscreen.
	 *
	 * @method Pointer#stop
	 * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
	 */
	stop: function(event) {

		var input = this.game.input;

		if (this._stateReset && this.withinGame) {
			event.preventDefault();
			return;
		}

		this.timeUp = this.game.time.time;

		if (input.multiInputOverride === Input.MOUSE_OVERRIDES_TOUCH ||
			input.multiInputOverride === Input.MOUSE_TOUCH_COMBINE ||
			(input.multiInputOverride === Input.TOUCH_OVERRIDES_MOUSE && input.totalActivePointers === 0)) {
			input.onUp.dispatch(this, event);

			//  Was it a tap?
			if (this.duration >= 0 && this.duration <= input.tapRate) {
				//  Was it a double-tap?
				if (this.timeUp - this.previousTapTime < input.doubleTapRate) {
					//  Yes, let's dispatch the signal then with the 2nd parameter set to true
					input.onTap.dispatch(this, true);
				} else {
					//  Wasn't a double-tap, so dispatch a single tap signal
					input.onTap.dispatch(this, false);
				}

				this.previousTapTime = this.timeUp;
			}
		}

		if (this.isMouse) {
			this.updateButtons(event);
		} else {
			this.isDown = false;
			this.isUp = true;
		}

		//  Mouse is always active
		if (this.id > 0) {
			this.active = false;
		}

		this.withinGame = this.game.scale.bounds.contains(event.pageX, event.pageY);
		this.pointerId = null;
		this.identifier = null;

		this.positionUp.setTo(this.x, this.y);

		if (this.isMouse === false) {
			input.currentPointers--;
		}

		input.interactiveItems.callAll('_releasedHandler', this);

		if (this._clickTrampolines) {
			this._trampolineTargetObject = this.targetObject;
		}

		this.targetObject = null;

		return this;

	},

	/**
	 * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate.
	 * Note that calling justPressed doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
	 * If you wish to check if the Pointer was pressed down just once then see the Sprite.events.onInputDown event.
	 * @method Pointer#justPressed
	 * @param {number} [duration] - The time to check against. If none given it will use InputManager.justPressedRate.
	 * @return {boolean} true if the Pointer was pressed down within the duration given.
	 */
	justPressed: function(duration) {

		duration = duration || this.game.input.justPressedRate;

		return (this.isDown === true && (this.timeDown + duration) > this.game.time.time);

	},

	/**
	 * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
	 * Note that calling justReleased doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
	 * If you wish to check if the Pointer was released just once then see the Sprite.events.onInputUp event.
	 * @method Pointer#justReleased
	 * @param {number} [duration] - The time to check against. If none given it will use InputManager.justReleasedRate.
	 * @return {boolean} true if the Pointer was released within the duration given.
	 */
	justReleased: function(duration) {

		duration = duration || this.game.input.justReleasedRate;

		return (this.isUp && (this.timeUp + duration) > this.game.time.time);

	},

	/**
	 * Add a click trampoline to this pointer.
	 *
	 * A click trampoline is a callback that is run on the DOM 'click' event; this is primarily
	 * needed with certain browsers (ie. IE11) which restrict some actions like requestFullscreen
	 * to the DOM 'click' event and rejects it for 'pointer*' and 'mouse*' events.
	 *
	 * This is used internally by the ScaleManager; click trampoline usage is uncommon.
	 * Click trampolines can only be added to pointers that are currently down.
	 *
	 * @method Pointer#addClickTrampoline
	 * @protected
	 * @param {string} name - The name of the trampoline; must be unique among active trampolines in this pointer.
	 * @param {function} callback - Callback to run/trampoline.
	 * @param {object} callbackContext - Context of the callback.
	 * @param {object[]|null} callbackArgs - Additional callback args, if any. Supplied as an array.
	 */
	addClickTrampoline: function(name, callback, callbackContext, callbackArgs) {

		if (!this.isDown) {
			return;
		}

		var trampolines = (this._clickTrampolines = this._clickTrampolines || []);

		for (var i = 0; i < trampolines.length; i++) {
			if (trampolines[i].name === name) {
				trampolines.splice(i, 1);
				break;
			}
		}

		trampolines.push({
			name: name,
			targetObject: this.targetObject,
			callback: callback,
			callbackContext: callbackContext,
			callbackArgs: callbackArgs
		});

	},

	/**
	 * Fire all click trampolines for which the pointers are still referring to the registered object.
	 * @method Pointer#processClickTrampolines
	 * @private
	 */
	processClickTrampolines: function() {

		var trampolines = this._clickTrampolines;

		if (!trampolines) {
			return;
		}

		for (var i = 0; i < trampolines.length; i++) {
			var trampoline = trampolines[i];

			if (trampoline.targetObject === this._trampolineTargetObject) {
				trampoline.callback.apply(trampoline.callbackContext, trampoline.callbackArgs);
			}
		}

		this._clickTrampolines = null;
		this._trampolineTargetObject = null;

	},

	/**
	 * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
	 * @method Pointer#reset
	 */
	reset: function() {

		if (this.isMouse === false) {
			this.active = false;
		}

		this.pointerId = null;
		this.identifier = null;
		this.dirty = false;
		this.totalTouches = 0;
		this._holdSent = false;
		this._history.length = 0;
		this._stateReset = true;

		this.resetButtons();

		if (this.targetObject) {
			this.targetObject._releasedHandler(this);
		}

		this.targetObject = null;

	},

	/**
	 * Resets the movementX and movementY properties. Use in your update handler after retrieving the values.
	 * @method Pointer#resetMovement
	 */
	resetMovement: function() {

		this.movementX = 0;
		this.movementY = 0;

	}

};

Pointer.prototype.constructor = Pointer;

/**
 * How long the Pointer has been depressed on the touchscreen or *any* of the mouse buttons have been held down.
 * If not currently down it returns -1.
 * If you need to test a specific mouse or pen button then access the buttons directly, i.e. `Pointer.rightButton.duration`.
 * 
 * @name Pointer#duration
 * @property {number} duration
 * @readonly
 */
Object.defineProperty(Pointer.prototype, "duration", {

	get: function() {

		if (this.isUp) {
			return -1;
		}

		return this.game.time.time - this.timeDown;

	}

});

/**
 * Gets the X value of this Pointer in world coordinates based on the world camera.
 * @name Pointer#worldX
 * @property {number} worldX - The X value of this Pointer in world coordinates based on the world camera.
 * @readonly
 */
Object.defineProperty(Pointer.prototype, "worldX", {

	get: function() {

		return this.game.world.camera.x + this.x;

	}

});

/**
 * Gets the Y value of this Pointer in world coordinates based on the world camera.
 * @name Pointer#worldY
 * @property {number} worldY - The Y value of this Pointer in world coordinates based on the world camera.
 * @readonly
 */
Object.defineProperty(Pointer.prototype, "worldY", {

	get: function() {

		return this.game.world.camera.y + this.y;

	}

});

//
Signal = function() {};

Signal.prototype = {

	/**
	 * @property {?Array.<SignalBinding>} _bindings - Internal variable.
	 * @private
	 */
	_bindings: null,

	/**
	 * @property {any} _prevParams - Internal variable.
	 * @private
	 */
	_prevParams: null,

	/**
	 * Memorize the previously dispatched event?
	 *
	 * If an event has been memorized it is automatically dispatched when a new listener is added with {@link #add} or {@link #addOnce}.
	 * Use {@link #forget} to clear any currently memorized event.
	 *
	 * @property {boolean} memorize
	 */
	memorize: false,

	/**
	 * @property {boolean} _shouldPropagate
	 * @private
	 */
	_shouldPropagate: true,

	/**
	 * Is the Signal active? Only active signals will broadcast dispatched events.
	 *
	 * Setting this property during a dispatch will only affect the next dispatch. To stop the propagation of a signal from a listener use {@link #halt}.
	 *
	 * @property {boolean} active
	 * @default
	 */
	active: true,

	/**
	 * @property {function} _boundDispatch - The bound dispatch function, if any.
	 * @private
	 */
	_boundDispatch: false,

	/**
	 * @method Signal#validateListener
	 * @param {function} listener - Signal handler function.
	 * @param {string} fnName - Function name.
	 * @private
	 */
	validateListener: function(listener, fnName) {

		if (typeof listener !== 'function') {
			throw new Error('Signal: listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
		}

	},

	/**
	 * @method Signal#_registerListener
	 * @private
	 * @param {function} listener - Signal handler function.
	 * @param {boolean} isOnce - Should the listener only be called once?
	 * @param {object} [listenerContext] - The context under which the listener is invoked.
	 * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0).
	 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	_registerListener: function(listener, isOnce, listenerContext, priority, args) {

		var prevIndex = this._indexOfListener(listener, listenerContext);
		var binding;

		if (prevIndex !== -1) {
			binding = this._bindings[prevIndex];

			if (binding.isOnce() !== isOnce) {
				throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') +
					'() the same listener without removing the relationship first.');
			}
		} else {
			binding = new SignalBinding(this, listener, isOnce, listenerContext, priority, args);
			this._addBinding(binding);
		}

		if (this.memorize && this._prevParams) {
			binding.execute(this._prevParams);
		}

		return binding;

	},

	/**
	 * @method Signal#_addBinding
	 * @private
	 * @param {SignalBinding} binding - An Object representing the binding between the Signal and listener.
	 */
	_addBinding: function(binding) {

		if (!this._bindings) {
			this._bindings = [];
		}

		//  Simplified insertion sort
		var n = this._bindings.length;

		do {
			n--;
		}
		while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);

		this._bindings.splice(n + 1, 0, binding);

	},

	/**
	 * @method Signal#_indexOfListener
	 * @private
	 * @param {function} listener - Signal handler function.
	 * @param {object} [context=null] - Signal handler function.
	 * @return {number} The index of the listener within the private bindings array.
	 */
	_indexOfListener: function(listener, context) {

		if (!this._bindings) {
			return -1;
		}

		if (context === undefined) {
			context = null;
		}

		var n = this._bindings.length;
		var cur;

		while (n--) {
			cur = this._bindings[n];

			if (cur._listener === listener && cur.context === context) {
				return n;
			}
		}

		return -1;

	},

	/**
	 * Check if a specific listener is attached.
	 *
	 * @method Signal#has
	 * @param {function} listener - Signal handler function.
	 * @param {object} [context] - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @return {boolean} If Signal has the specified listener.
	 */
	has: function(listener, context) {

		return this._indexOfListener(listener, context) !== -1;

	},

	/**
	 * Add an event listener for this signal.
	 *
	 * An event listener is a callback with a related context and priority.
	 *
	 * You can optionally provide extra arguments which will be passed to the callback after any internal parameters.
	 *
	 * For example: `Key.onDown` when dispatched will send the Key object that caused the signal as the first parameter.
	 * Any arguments you've specified after `priority` will be sent as well:
	 *
	 * `fireButton.onDown.add(shoot, this, 0, 'lazer', 100);`
	 *
	 * When onDown dispatches it will call the `shoot` callback passing it: `Key, 'lazer', 100`.
	 *
	 * Where the first parameter is the one that Key.onDown dispatches internally and 'lazer', 
	 * and the value 100 were the custom arguments given in the call to 'add'.
	 *
	 * @method Signal#add
	 * @param {function} listener - The function to call when this Signal is dispatched.
	 * @param {object} [listenerContext] - The context under which the listener will be executed (i.e. the object that should represent the `this` variable).
	 * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added (default = 0)
	 * @param {...any} [args=(none)] - Additional arguments to pass to the callback (listener) function. They will be appended after any arguments usually dispatched.
	 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	add: function(listener, listenerContext, priority) {

		this.validateListener(listener, 'add');

		var args = [];

		if (arguments.length > 3) {
			for (var i = 3; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
		}

		return this._registerListener(listener, false, listenerContext, priority, args);

	},

	/**
	 * Add a one-time listener - the listener is automatically removed after the first execution.
	 *
	 * If there is as {@link Signal#memorize memorized} event then it will be dispatched and
	 * the listener will be removed immediately.
	 *
	 * @method Signal#addOnce
	 * @param {function} listener - The function to call when this Signal is dispatched.
	 * @param {object} [listenerContext] - The context under which the listener will be executed (i.e. the object that should represent the `this` variable).
	 * @param {number} [priority] - The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added (default = 0)
	 * @param {...any} [args=(none)] - Additional arguments to pass to the callback (listener) function. They will be appended after any arguments usually dispatched.
	 * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	 */
	addOnce: function(listener, listenerContext, priority) {

		this.validateListener(listener, 'addOnce');

		var args = [];

		if (arguments.length > 3) {
			for (var i = 3; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
		}

		return this._registerListener(listener, true, listenerContext, priority, args);

	},

	/**
	 * Remove a single event listener.
	 *
	 * @method Signal#remove
	 * @param {function} listener - Handler function that should be removed.
	 * @param {object} [context=null] - Execution context (since you can add the same handler multiple times if executing in a different context).
	 * @return {function} Listener handler function.
	 */
	remove: function(listener, context) {

		this.validateListener(listener, 'remove');

		var i = this._indexOfListener(listener, context);

		if (i !== -1) {
			this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
			this._bindings.splice(i, 1);
		}

		return listener;

	},

	/**
	 * Remove all event listeners.
	 *
	 * @method Signal#removeAll
	 * @param {object} [context=null] - If specified only listeners for the given context will be removed.
	 */
	removeAll: function(context) {

		if (context === undefined) {
			context = null;
		}

		if (!this._bindings) {
			return;
		}

		var n = this._bindings.length;

		while (n--) {
			if (context) {
				if (this._bindings[n].context === context) {
					this._bindings[n]._destroy();
					this._bindings.splice(n, 1);
				}
			} else {
				this._bindings[n]._destroy();
			}
		}

		if (!context) {
			this._bindings.length = 0;
		}

	},

	/**
	 * Gets the total number of listeners attached to this Signal.
	 *
	 * @method Signal#getNumListeners
	 * @return {integer} Number of listeners attached to the Signal.
	 */
	getNumListeners: function() {

		return this._bindings ? this._bindings.length : 0;

	},

	/**
	 * Stop propagation of the event, blocking the dispatch to next listener on the queue.
	 *
	 * This should be called only during event dispatch as calling it before/after dispatch won't affect another broadcast.
	 * See {@link #active} to enable/disable the signal entirely.
	 *
	 * @method Signal#halt
	 */
	halt: function() {

		this._shouldPropagate = false;

	},

	/**
	 * Dispatch / broadcast the event to all listeners.
	 *
	 * To create an instance-bound dispatch for this Signal, use {@link #boundDispatch}.
	 *
	 * @method Signal#dispatch
	 * @param {any} [params] - Parameters that should be passed to each handler.
	 */
	dispatch: function() {

		if (!this.active || !this._bindings) {
			return;
		}

		var paramsArr = Array.prototype.slice.call(arguments);
		var n = this._bindings.length;
		var bindings;

		if (this.memorize) {
			this._prevParams = paramsArr;
		}

		if (!n) {
			//  Should come after memorize
			return;
		}

		bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
		this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

		//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
		//reverse loop since listeners with higher priority will be added at the end of the list
		do {
			n--;
		}
		while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);

	},

	/**
	 * Forget the currently {@link Signal#memorize memorized} event, if any.
	 *
	 * @method Signal#forget
	 */
	forget: function() {

		if (this._prevParams) {
			this._prevParams = null;
		}

	},

	/**
	 * Dispose the signal - no more events can be dispatched.
	 *
	 * This removes all event listeners and clears references to external objects.
	 * Calling methods on a disposed objects results in undefined behavior.
	 *
	 * @method Signal#dispose
	 */
	dispose: function() {

		this.removeAll();

		this._bindings = null;
		if (this._prevParams) {
			this._prevParams = null;
		}

	},

	/**
	 * A string representation of the object.
	 *
	 * @method Signal#toString
	 * @return {string} String representation of the object.
	 */
	toString: function() {

		return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';

	}

};

/**
 * Create a `dispatch` function that maintains a binding to the original Signal context.
 *
 * Use the resulting value if the dispatch function needs to be passed somewhere
 * or called independently of the Signal object.
 *
 * @memberof Signal
 * @property {function} boundDispatch
 */
Object.defineProperty(Signal.prototype, "boundDispatch", {

	get: function() {
		var _this = this;
		return this._boundDispatch || (this._boundDispatch = function() {
			return _this.dispatch.apply(_this, arguments);
		});
	}

});

Signal.prototype.constructor = Signal;

/**
 * @author       Miller Medeiros http://millermedeiros.github.com/js-signals/
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Object that represents a binding between a Signal and a listener function.
 * This is an internal constructor and shouldn't be created directly.
 * Inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
 * 
 * @class SignalBinding
 * @constructor
 * @param {Signal} signal - Reference to Signal object that listener is currently bound to.
 * @param {function} listener - Handler function bound to the signal.
 * @param {boolean} isOnce - If binding should be executed just once.
 * @param {object} [listenerContext=null] - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
 * @param {number} [priority] - The priority level of the event listener. (default = 0).
 * @param {...any} [args=(none)] - Additional arguments to pass to the callback (listener) function. They will be appended after any arguments usually dispatched.
 */
SignalBinding = function(signal, listener, isOnce, listenerContext, priority, args) {

	/**
	 * @property {Game} _listener - Handler function bound to the signal.
	 * @private
	 */
	this._listener = listener;

	if (isOnce) {
		this._isOnce = true;
	}

	if (listenerContext != null) /* not null/undefined */ {
		this.context = listenerContext;
	}

	/**
	 * @property {Signal} _signal - Reference to Signal object that listener is currently bound to.
	 * @private
	 */
	this._signal = signal;

	if (priority) {
		this._priority = priority;
	}

	if (args && args.length) {
		this._args = args;
	}

};

SignalBinding.prototype = {

	/**
	 * @property {?object} context - Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 */
	context: null,

	/**
	 * @property {boolean} _isOnce - If binding should be executed just once.
	 * @private
	 */
	_isOnce: false,

	/**
	 * @property {number} _priority - Listener priority.
	 * @private
	 */
	_priority: 0,

	/**
	 * @property {array} _args - Listener arguments.
	 * @private
	 */
	_args: null,

	/**
	 * @property {number} callCount - The number of times the handler function has been called.
	 */
	callCount: 0,

	/**
	 * If binding is active and should be executed.
	 * @property {boolean} active
	 * @default
	 */
	active: true,

	/**
	 * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute` (curried parameters).
	 * @property {array|null} params
	 * @default
	 */
	params: null,

	/**
	 * Call listener passing arbitrary parameters.
	 * If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.
	 * @method SignalBinding#execute
	 * @param {any[]} [paramsArr] - Array of parameters that should be passed to the listener.
	 * @return {any} Value returned by the listener.
	 */
	execute: function(paramsArr) {

		var handlerReturn, params;

		if (this.active && !!this._listener) {
			params = this.params ? this.params.concat(paramsArr) : paramsArr;

			if (this._args) {
				params = params.concat(this._args);
			}

			handlerReturn = this._listener.apply(this.context, params);

			this.callCount++;

			if (this._isOnce) {
				this.detach();
			}
		}

		return handlerReturn;

	},

	/**
	 * Detach binding from signal.
	 * alias to: @see mySignal.remove(myBinding.getListener());
	 * @method SignalBinding#detach
	 * @return {function|null} Handler function bound to the signal or `null` if binding was previously detached.
	 */
	detach: function() {
		return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
	},

	/**
	 * @method SignalBinding#isBound
	 * @return {boolean} True if binding is still bound to the signal and has a listener.
	 */
	isBound: function() {
		return (!!this._signal && !!this._listener);
	},

	/**
	 * @method SignalBinding#isOnce
	 * @return {boolean} If SignalBinding will only be executed once.
	 */
	isOnce: function() {
		return this._isOnce;
	},

	/**
	 * @method SignalBinding#getListener
	 * @return {function} Handler function bound to the signal.
	 */
	getListener: function() {
		return this._listener;
	},

	/**
	 * @method SignalBinding#getSignal
	 * @return {Signal} Signal that listener is currently bound to.
	 */
	getSignal: function() {
		return this._signal;
	},

	/**
	 * Delete instance properties
	 * @method SignalBinding#_destroy
	 * @private
	 */
	_destroy: function() {
		delete this._signal;
		delete this._listener;
		delete this.context;
	},

	/**
	 * @method SignalBinding#toString
	 * @return {string} String representation of the object.
	 */
	toString: function() {
		return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
	}

};

SignalBinding.prototype.constructor = SignalBinding;
//
/**
 * A Frame is a single frame of an animation and is part of a FrameData collection.
 *
 * @class Frame
 * @constructor
 * @param {number} index - The index of this Frame within the FrameData set it is being added to.
 * @param {number} x - X position of the frame within the texture image.
 * @param {number} y - Y position of the frame within the texture image.
 * @param {number} width - Width of the frame within the texture image.
 * @param {number} height - Height of the frame within the texture image.
 * @param {string} name - The name of the frame. In Texture Atlas data this is usually set to the filename.
 */
Frame = function(index, x, y, width, height, name) {

	/**
	 * @property {number} index - The index of this Frame within the FrameData set it is being added to.
	 */
	this.index = index;

	/**
	 * @property {number} x - X position within the image to cut from.
	 */
	this.x = x;

	/**
	 * @property {number} y - Y position within the image to cut from.
	 */
	this.y = y;

	/**
	 * @property {number} width - Width of the frame.
	 */
	this.width = width;

	/**
	 * @property {number} height - Height of the frame.
	 */
	this.height = height;

	/**
	 * @property {string} name - Useful for Texture Atlas files (is set to the filename value).
	 */
	this.name = name;

	/**
	 * @property {number} centerX - Center X position within the image to cut from.
	 */
	this.centerX = Math.floor(width / 2);

	/**
	 * @property {number} centerY - Center Y position within the image to cut from.
	 */
	this.centerY = Math.floor(height / 2);

	/**
	 * @property {number} distance - The distance from the top left to the bottom-right of this Frame.
	 */
	this.distance = Phaser.Math.distance(0, 0, width, height);

	/**
	 * @property {boolean} rotated - Rotated? (not yet implemented)
	 * @default
	 */
	this.rotated = false;

	/**
	 * @property {string} rotationDirection - Either 'cw' or 'ccw', rotation is always 90 degrees.
	 * @default 'cw'
	 */
	this.rotationDirection = 'cw';

	/**
	 * @property {boolean} trimmed - Was it trimmed when packed?
	 * @default
	 */
	this.trimmed = false;

	/**
	 * @property {number} sourceSizeW - Width of the original sprite before it was trimmed.
	 */
	this.sourceSizeW = width;

	/**
	 * @property {number} sourceSizeH - Height of the original sprite before it was trimmed.
	 */
	this.sourceSizeH = height;

	/**
	 * @property {number} spriteSourceSizeX - X position of the trimmed sprite inside original sprite.
	 * @default
	 */
	this.spriteSourceSizeX = 0;

	/**
	 * @property {number} spriteSourceSizeY - Y position of the trimmed sprite inside original sprite.
	 * @default
	 */
	this.spriteSourceSizeY = 0;

	/**
	 * @property {number} spriteSourceSizeW - Width of the trimmed sprite.
	 * @default
	 */
	this.spriteSourceSizeW = 0;

	/**
	 * @property {number} spriteSourceSizeH - Height of the trimmed sprite.
	 * @default
	 */
	this.spriteSourceSizeH = 0;

	/**
	 * @property {number} right - The right of the Frame (x + width).
	 */
	this.right = this.x + this.width;

	/**
	 * @property {number} bottom - The bottom of the frame (y + height).
	 */
	this.bottom = this.y + this.height;

};

Frame.prototype = {

	/**
	 * Adjusts of all the Frame properties based on the given width and height values.
	 *
	 * @method Frame#resize
	 * @param {integer} width - The new width of the Frame.
	 * @param {integer} height - The new height of the Frame.
	 */
	resize: function(width, height) {

		this.width = width;
		this.height = height;
		this.centerX = Math.floor(width / 2);
		this.centerY = Math.floor(height / 2);
		this.distance = Math.distance(0, 0, width, height);
		this.sourceSizeW = width;
		this.sourceSizeH = height;
		this.right = this.x + width;
		this.bottom = this.y + height;

	},

	/**
	 * If the frame was trimmed when added to the Texture Atlas this records the trim and source data.
	 *
	 * @method Frame#setTrim
	 * @param {boolean} trimmed - If this frame was trimmed or not.
	 * @param {number} actualWidth - The width of the frame before being trimmed.
	 * @param {number} actualHeight - The height of the frame before being trimmed.
	 * @param {number} destX - The destination X position of the trimmed frame for display.
	 * @param {number} destY - The destination Y position of the trimmed frame for display.
	 * @param {number} destWidth - The destination width of the trimmed frame for display.
	 * @param {number} destHeight - The destination height of the trimmed frame for display.
	 */
	setTrim: function(trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {

		this.trimmed = trimmed;

		if (trimmed) {
			this.sourceSizeW = actualWidth;
			this.sourceSizeH = actualHeight;
			this.centerX = Math.floor(actualWidth / 2);
			this.centerY = Math.floor(actualHeight / 2);
			this.spriteSourceSizeX = destX;
			this.spriteSourceSizeY = destY;
			this.spriteSourceSizeW = destWidth;
			this.spriteSourceSizeH = destHeight;
		}

	},

	/**
	 * Clones this Frame into a new Frame object and returns it.
	 * Note that all properties are cloned, including the name, index and UUID.
	 *
	 * @method Frame#clone
	 * @return {Frame} An exact copy of this Frame object.
	 */
	clone: function() {

		var output = new Frame(this.index, this.x, this.y, this.width, this.height, this.name);

		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				output[prop] = this[prop];
			}
		}

		return output;

	},

	/**
	 * Returns a Rectangle set to the dimensions of this Frame.
	 *
	 * @method Frame#getRect
	 * @param {Rectangle} [out] - A rectangle to copy the frame dimensions to.
	 * @return {Rectangle} A rectangle.
	 */
	getRect: function(out) {

		if (out === undefined) {
			out = new Rectangle(this.x, this.y, this.width, this.height);
		} else {
			out.setTo(this.x, this.y, this.width, this.height);
		}

		return out;

	}

};

Frame.prototype.constructor = Frame;
//
/**
 * A collection of useful mathematical functions.
 *
 * These are normally accessed through `game.math`.
 *
 * @class Math
 * @static
 * @see {@link Utils}
 * @see {@link ArrayUtils}
 */
var Phaser = Phaser || {}
Phaser.Math = {

	/**
	 * Twice PI.
	 * @property {number} Phaser.Math#PI2
	 * @default ~6.283
	 */
	PI2: Math.PI * 2,

	/**
	 * Returns a number between the `min` and `max` values.
	 *
	 * @method Phaser.Math#between
	 * @param {number} min - The minimum value. Must be positive, and less than 'max'.
	 * @param {number} max - The maximum value. Must be position, and greater than 'min'.
	 * @return {number} A value between the range min to max.
	 */
	between: function(min, max) {

		return Math.floor(Math.random() * (max - min + 1) + min);

	},

	/**
	 * Two number are fuzzyEqual if their difference is less than epsilon.
	 *
	 * @method Phaser.Math#fuzzyEqual
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if |a-b|<epsilon
	 */
	fuzzyEqual: function(a, b, epsilon) {

		if (epsilon === undefined) {
			epsilon = 0.0001;
		}

		return Math.abs(a - b) < epsilon;

	},

	/**
	 * `a` is fuzzyLessThan `b` if it is less than b + epsilon.
	 *
	 * @method Phaser.Math#fuzzyLessThan
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if a<b+epsilon
	 */
	fuzzyLessThan: function(a, b, epsilon) {

		if (epsilon === undefined) {
			epsilon = 0.0001;
		}

		return a < b + epsilon;

	},

	/**
	 * `a` is fuzzyGreaterThan `b` if it is more than b - epsilon.
	 *
	 * @method Phaser.Math#fuzzyGreaterThan
	 * @param {number} a - The first number to compare.
	 * @param {number} b - The second number to compare.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {boolean} True if a>b+epsilon
	 */
	fuzzyGreaterThan: function(a, b, epsilon) {

		if (epsilon === undefined) {
			epsilon = 0.0001;
		}

		return a > b - epsilon;

	},

	/**
	 * Applies a fuzzy ceil to the given value.
	 * 
	 * @method Phaser.Math#fuzzyCeil
	 * @param {number} val - The value to ceil.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {number} ceiling(val-epsilon)
	 */
	fuzzyCeil: function(val, epsilon) {

		if (epsilon === undefined) {
			epsilon = 0.0001;
		}

		return Math.ceil(val - epsilon);

	},

	/**
	 * Applies a fuzzy floor to the given value.
	 * 
	 * @method Phaser.Math#fuzzyFloor
	 * @param {number} val - The value to floor.
	 * @param {number} [epsilon=0.0001] - The epsilon (a small value used in the calculation)
	 * @return {number} floor(val+epsilon)
	 */
	fuzzyFloor: function(val, epsilon) {

		if (epsilon === undefined) {
			epsilon = 0.0001;
		}

		return Math.floor(val + epsilon);

	},

	/**
	 * Averages all values passed to the function and returns the result.
	 *
	 * @method Phaser.Math#average
	 * @params {...number} The numbers to average
	 * @return {number} The average of all given values.
	 */
	average: function() {

		var sum = 0;
		var len = arguments.length;

		for (var i = 0; i < len; i++) {
			sum += (+arguments[i]);
		}

		return sum / len;

	},

	/**
	 * @method Phaser.Math#shear
	 * @param {number} n
	 * @return {number} n mod 1
	 */
	shear: function(n) {

		return n % 1;

	},

	/**
	 * Snap a value to nearest grid slice, using rounding.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10 whereas 14 will snap to 15.
	 *
	 * @method Phaser.Math#snapTo
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	snapTo: function(input, gap, start) {

		if (start === undefined) {
			start = 0;
		}

		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.round(input / gap);

		return start + input;

	},

	/**
	 * Snap a value to nearest grid slice, using floor.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 10.
	 * As will 14 snap to 10... but 16 will snap to 15.
	 *
	 * @method Phaser.Math#snapToFloor
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	snapToFloor: function(input, gap, start) {

		if (start === undefined) {
			start = 0;
		}

		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.floor(input / gap);

		return start + input;

	},

	/**
	 * Snap a value to nearest grid slice, using ceil.
	 *
	 * Example: if you have an interval gap of 5 and a position of 12... you will snap to 15.
	 * As will 14 will snap to 15... but 16 will snap to 20.
	 *
	 * @method Phaser.Math#snapToCeil
	 * @param {number} input - The value to snap.
	 * @param {number} gap - The interval gap of the grid.
	 * @param {number} [start=0] - Optional starting offset for gap.
	 * @return {number} The snapped value.
	 */
	snapToCeil: function(input, gap, start) {

		if (start === undefined) {
			start = 0;
		}

		if (gap === 0) {
			return input;
		}

		input -= start;
		input = gap * Math.ceil(input / gap);

		return start + input;

	},

	/**
	 * Round to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 *
	 *     e.g. 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
	 *
	 *     roundTo(2000/7,3) === 0
	 *     roundTo(2000/7,2) == 300
	 *     roundTo(2000/7,1) == 290
	 *     roundTo(2000/7,0) == 286
	 *     roundTo(2000/7,-1) == 285.7
	 *     roundTo(2000/7,-2) == 285.71
	 *     roundTo(2000/7,-3) == 285.714
	 *     roundTo(2000/7,-4) == 285.7143
	 *     roundTo(2000/7,-5) == 285.71429
	 *
	 *     roundTo(2000/7,3,2)  == 288       -- 100100000
	 *     roundTo(2000/7,2,2)  == 284       -- 100011100
	 *     roundTo(2000/7,1,2)  == 286       -- 100011110
	 *     roundTo(2000/7,0,2)  == 286       -- 100011110
	 *     roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
	 *     roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
	 *     roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
	 *     roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
	 *     roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
	 *
	 * Note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
	 * because we are rounding 100011.1011011011011011 which rounds up.
	 *
	 * @method Phaser.Math#roundTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	roundTo: function(value, place, base) {

		if (place === undefined) {
			place = 0;
		}
		if (base === undefined) {
			base = 10;
		}

		var p = Math.pow(base, -place);

		return Math.round(value * p) / p;

	},

	/**
	 * Floors to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 * 
	 * @method Phaser.Math#floorTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	floorTo: function(value, place, base) {

		if (place === undefined) {
			place = 0;
		}
		if (base === undefined) {
			base = 10;
		}

		var p = Math.pow(base, -place);

		return Math.floor(value * p) / p;

	},

	/**
	 * Ceils to some place comparative to a `base`, default is 10 for decimal place.
	 * The `place` is represented by the power applied to `base` to get that place.
	 * 
	 * @method Phaser.Math#ceilTo
	 * @param {number} value - The value to round.
	 * @param {number} [place=0] - The place to round to.
	 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
	 * @return {number} The rounded value.
	 */
	ceilTo: function(value, place, base) {

		if (place === undefined) {
			place = 0;
		}
		if (base === undefined) {
			base = 10;
		}

		var p = Math.pow(base, -place);

		return Math.ceil(value * p) / p;

	},

	/**
	 * Rotates currentAngle towards targetAngle, taking the shortest rotation distance.
	 * The lerp argument is the amount to rotate by in this call.
	 * 
	 * @method Phaser.Math#rotateToAngle
	 * @param {number} currentAngle - The current angle, in radians.
	 * @param {number} targetAngle - The target angle to rotate to, in radians.
	 * @param {number} [lerp=0.05] - The lerp value to add to the current angle.
	 * @return {number} The adjusted angle.
	 */
	rotateToAngle: function(currentAngle, targetAngle, lerp) {

		if (lerp === undefined) {
			lerp = 0.05;
		}

		if (currentAngle === targetAngle) {
			return currentAngle;
		}

		if (Math.abs(targetAngle - currentAngle) <= lerp || Math.abs(targetAngle - currentAngle) >= (Phaser.Math.PI2 - lerp)) {
			currentAngle = targetAngle;
		} else {
			if (Math.abs(targetAngle - currentAngle) > Math.PI) {
				if (targetAngle < currentAngle) {
					targetAngle += Phaser.Math.PI2;
				} else {
					targetAngle -= Phaser.Math.PI2;
				}
			}

			if (targetAngle > currentAngle) {
				currentAngle += lerp;
			} else if (targetAngle < currentAngle) {
				currentAngle -= lerp;
			}
		}

		return currentAngle;

	},

	/**
	 * Gets the shortest angle between `angle1` and `angle2`.
	 * Both angles must be in the range -180 to 180, which is the same clamped
	 * range that `sprite.angle` uses, so you can pass in two sprite angles to
	 * this method, and get the shortest angle back between the two of them.
	 *
	 * The angle returned will be in the same range. If the returned angle is
	 * greater than 0 then it's a counter-clockwise rotation, if < 0 then it's
	 * a clockwise rotation.
	 * 
	 * @method Phaser.Math#getShortestAngle
	 * @param {number} angle1 - The first angle. In the range -180 to 180.
	 * @param {number} angle2 - The second angle. In the range -180 to 180.
	 * @return {number} The shortest angle, in degrees. If greater than zero it's a counter-clockwise rotation.
	 */
	getShortestAngle: function(angle1, angle2) {

		var difference = angle2 - angle1;

		if (difference === 0) {
			return 0;
		}

		var times = Math.floor((difference - (-180)) / 360);

		return difference - (times * 360);

	},

	/**
	 * Find the angle of a segment from (x1, y1) -> (x2, y2).
	 * 
	 * @method Phaser.Math#angleBetween
	 * @param {number} x1 - The x coordinate of the first value.
	 * @param {number} y1 - The y coordinate of the first value.
	 * @param {number} x2 - The x coordinate of the second value.
	 * @param {number} y2 - The y coordinate of the second value.
	 * @return {number} The angle, in radians.
	 */
	angleBetween: function(x1, y1, x2, y2) {

		return Math.atan2(y2 - y1, x2 - x1);

	},

	/**
	 * Find the angle of a segment from (x1, y1) -> (x2, y2).
	 * 
	 * The difference between this method and Math.angleBetween is that this assumes the y coordinate travels
	 * down the screen.
	 *
	 * @method Phaser.Math#angleBetweenY
	 * @param {number} x1 - The x coordinate of the first value.
	 * @param {number} y1 - The y coordinate of the first value.
	 * @param {number} x2 - The x coordinate of the second value.
	 * @param {number} y2 - The y coordinate of the second value.
	 * @return {number} The angle, in radians.
	 */
	angleBetweenY: function(x1, y1, x2, y2) {

		return Math.atan2(x2 - x1, y2 - y1);

	},

	/**
	 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	 * 
	 * @method Phaser.Math#angleBetweenPoints
	 * @param {Phaser.Point} point1 - The first point.
	 * @param {Phaser.Point} point2 - The second point.
	 * @return {number} The angle between the two points, in radians.
	 */
	angleBetweenPoints: function(point1, point2) {

		return Math.atan2(point2.y - point1.y, point2.x - point1.x);

	},

	/**
	 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
	 * @method Phaser.Math#angleBetweenPointsY
	 * @param {Phaser.Point} point1
	 * @param {Phaser.Point} point2
	 * @return {number} The angle, in radians.
	 */
	angleBetweenPointsY: function(point1, point2) {

		return Math.atan2(point2.x - point1.x, point2.y - point1.y);

	},

	/**
	 * Reverses an angle.
	 * @method Phaser.Math#reverseAngle
	 * @param {number} angleRad - The angle to reverse, in radians.
	 * @return {number} The reverse angle, in radians.
	 */
	reverseAngle: function(angleRad) {

		return this.normalizeAngle(angleRad + Math.PI, true);

	},

	/**
	 * Normalizes an angle to the [0,2pi) range.
	 * @method Phaser.Math#normalizeAngle
	 * @param {number} angleRad - The angle to normalize, in radians.
	 * @return {number} The angle, fit within the [0,2pi] range, in radians.
	 */
	normalizeAngle: function(angleRad) {

		angleRad = angleRad % (2 * Math.PI);
		return angleRad >= 0 ? angleRad : angleRad + 2 * Math.PI;

	},

	/**
	 * Adds the given amount to the value, but never lets the value go over the specified maximum.
	 *
	 * @method Phaser.Math#maxAdd
	 * @param {number} value - The value to add the amount to.
	 * @param {number} amount - The amount to add to the value.
	 * @param {number} max - The maximum the value is allowed to be.
	 * @return {number} The new value.
	 */
	maxAdd: function(value, amount, max) {

		return Math.min(value + amount, max);

	},

	/**
	 * Subtracts the given amount from the value, but never lets the value go below the specified minimum.
	 *
	 * @method Phaser.Math#minSub
	 * @param {number} value - The base value.
	 * @param {number} amount - The amount to subtract from the base value.
	 * @param {number} min - The minimum the value is allowed to be.
	 * @return {number} The new value.
	 */
	minSub: function(value, amount, min) {

		return Math.max(value - amount, min);

	},

	/**
	 * Ensures that the value always stays between min and max, by wrapping the value around.
	 *
	 * If `max` is not larger than `min` the result is 0.
	 *
	 * @method Phaser.Math#wrap
	 * @param {number} value - The value to wrap.
	 * @param {number} min - The minimum the value is allowed to be.
	 * @param {number} max - The maximum the value is allowed to be, should be larger than `min`.
	 * @return {number} The wrapped value.
	 */
	wrap: function(value, min, max) {

		var range = max - min;

		if (range <= 0) {
			return 0;
		}

		var result = (value - min) % range;

		if (result < 0) {
			result += range;
		}

		return result + min;

	},

	/**
	 * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
	 *
	 * Values _must_ be positive integers, and are passed through Math.abs. See {@link Phaser.Math#wrap} for an alternative.
	 *
	 * @method Phaser.Math#wrapValue
	 * @param {number} value - The value to add the amount to.
	 * @param {number} amount - The amount to add to the value.
	 * @param {number} max - The maximum the value is allowed to be.
	 * @return {number} The wrapped value.
	 */
	wrapValue: function(value, amount, max) {

		var diff;
		value = Math.abs(value);
		amount = Math.abs(amount);
		max = Math.abs(max);
		diff = (value + amount) % max;

		return diff;

	},

	/**
	 * Returns true if the number given is odd.
	 *
	 * @method Phaser.Math#isOdd
	 * @param {integer} n - The number to check.
	 * @return {boolean} True if the given number is odd. False if the given number is even.
	 */
	isOdd: function(n) {

		// Does not work with extremely large values
		return !!(n & 1);

	},

	/**
	 * Returns true if the number given is even.
	 *
	 * @method Phaser.Math#isEven
	 * @param {integer} n - The number to check.
	 * @return {boolean} True if the given number is even. False if the given number is odd.
	 */
	isEven: function(n) {

		// Does not work with extremely large values
		return !(n & 1);

	},

	/**
	 * Variation of Math.min that can be passed either an array of numbers or the numbers as parameters.
	 *
	 * Prefer the standard `Math.min` function when appropriate.
	 *
	 * @method Phaser.Math#min
	 * @return {number} The lowest value from those given.
	 * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
	 */
	min: function() {

		if (arguments.length === 1 && typeof arguments[0] === 'object') {
			var data = arguments[0];
		} else {
			var data = arguments;
		}

		for (var i = 1, min = 0, len = data.length; i < len; i++) {
			if (data[i] < data[min]) {
				min = i;
			}
		}

		return data[min];

	},

	/**
	 * Variation of Math.max that can be passed either an array of numbers or the numbers as parameters.
	 *
	 * Prefer the standard `Math.max` function when appropriate.
	 *
	 * @method Phaser.Math#max
	 * @return {number} The largest value from those given.
	 * @see {@link http://jsperf.com/math-s-min-max-vs-homemade}
	 */
	max: function() {

		if (arguments.length === 1 && typeof arguments[0] === 'object') {
			var data = arguments[0];
		} else {
			var data = arguments;
		}

		for (var i = 1, max = 0, len = data.length; i < len; i++) {
			if (data[i] > data[max]) {
				max = i;
			}
		}

		return data[max];

	},

	/**
	 * Variation of Math.min that can be passed a property and either an array of objects or the objects as parameters.
	 * It will find the lowest matching property value from the given objects.
	 *
	 * @method Phaser.Math#minProperty
	 * @return {number} The lowest value from those given.
	 */
	minProperty: function(property) {

		if (arguments.length === 2 && typeof arguments[1] === 'object') {
			var data = arguments[1];
		} else {
			var data = arguments.slice(1);
		}

		for (var i = 1, min = 0, len = data.length; i < len; i++) {
			if (data[i][property] < data[min][property]) {
				min = i;
			}
		}

		return data[min][property];

	},

	/**
	 * Variation of Math.max that can be passed a property and either an array of objects or the objects as parameters.
	 * It will find the largest matching property value from the given objects.
	 *
	 * @method Phaser.Math#maxProperty
	 * @return {number} The largest value from those given.
	 */
	maxProperty: function(property) {

		if (arguments.length === 2 && typeof arguments[1] === 'object') {
			var data = arguments[1];
		} else {
			var data = arguments.slice(1);
		}

		for (var i = 1, max = 0, len = data.length; i < len; i++) {
			if (data[i][property] > data[max][property]) {
				max = i;
			}
		}

		return data[max][property];

	},

	/**
	 * Keeps an angle value between -180 and +180; or -PI and PI if radians.
	 *
	 * @method Phaser.Math#wrapAngle
	 * @param {number} angle - The angle value to wrap
	 * @param {boolean} [radians=false] - Set to `true` if the angle is given in radians, otherwise degrees is expected.
	 * @return {number} The new angle value; will be the same as the input angle if it was within bounds.
	 */
	wrapAngle: function(angle, radians) {

		return radians ? this.wrap(angle, -Math.PI, Math.PI) : this.wrap(angle, -180, 180);

	},

	/**
	 * A Linear Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method Phaser.Math#linearInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	linearInterpolation: function(v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);

		if (k < 0) {
			return this.linear(v[0], v[1], f);
		}

		if (k > 1) {
			return this.linear(v[m], v[m - 1], m - f);
		}

		return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	/**
	 * A Bezier Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method Phaser.Math#bezierInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	bezierInterpolation: function(v, k) {

		var b = 0;
		var n = v.length - 1;

		for (var i = 0; i <= n; i++) {
			b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
		}

		return b;

	},

	/**
	 * A Catmull Rom Interpolation Method, mostly used by Phaser.Tween.
	 *
	 * @method Phaser.Math#catmullRomInterpolation
	 * @param {Array} v - The input array of values to interpolate between.
	 * @param {number} k - The percentage of interpolation, between 0 and 1.
	 * @return {number} The interpolated value
	 */
	catmullRomInterpolation: function(v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);

		if (v[0] === v[m]) {
			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
		} else {
			if (k < 0) {
				return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
		}

	},

	/**
	 * Calculates a linear (interpolation) value over t.
	 *
	 * @method Phaser.Math#linear
	 * @param {number} p0
	 * @param {number} p1
	 * @param {number} t - A value between 0 and 1.
	 * @return {number}
	 */
	linear: function(p0, p1, t) {

		return (p1 - p0) * t + p0;

	},

	/**
	 * @method Phaser.Math#bernstein
	 * @protected
	 * @param {number} n
	 * @param {number} i
	 * @return {number}
	 */
	bernstein: function(n, i) {

		return this.factorial(n) / this.factorial(i) / this.factorial(n - i);

	},

	/**
	 * @method Phaser.Math#factorial
	 * @param {number} value - the number you want to evaluate
	 * @return {number}
	 */
	factorial: function(value) {

		if (value === 0) {
			return 1;
		}

		var res = value;

		while (--value) {
			res *= value;
		}

		return res;

	},

	/**
	 * Calculates a catmum rom value.
	 *
	 * @method Phaser.Math#catmullRom
	 * @protected
	 * @param {number} p0
	 * @param {number} p1
	 * @param {number} p2
	 * @param {number} p3
	 * @param {number} t
	 * @return {number}
	 */
	catmullRom: function(p0, p1, p2, p3, t) {

		var v0 = (p2 - p0) * 0.5,
			v1 = (p3 - p1) * 0.5,
			t2 = t * t,
			t3 = t * t2;

		return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

	},

	/**
	 * The absolute difference between two values.
	 *
	 * @method Phaser.Math#difference
	 * @param {number} a - The first value to check.
	 * @param {number} b - The second value to check.
	 * @return {number} The absolute difference between the two values.
	 */
	difference: function(a, b) {

		return Math.abs(a - b);

	},

	/**
	 * Round to the next whole number _away_ from zero.
	 *
	 * @method Phaser.Math#roundAwayFromZero
	 * @param {number} value - Any number.
	 * @return {integer} The rounded value of that number.
	 */
	roundAwayFromZero: function(value) {

		// "Opposite" of truncate.
		return (value > 0) ? Math.ceil(value) : Math.floor(value);

	},

	/**
	 * Generate a sine and cosine table simultaneously and extremely quickly.
	 * The parameters allow you to specify the length, amplitude and frequency of the wave.
	 * This generator is fast enough to be used in real-time.
	 * Code based on research by Franky of scene.at
	 *
	 * @method Phaser.Math#sinCosGenerator
	 * @param {number} length - The length of the wave
	 * @param {number} sinAmplitude - The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 * @param {number} cosAmplitude - The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 * @param {number} frequency  - The frequency of the sine and cosine table data
	 * @return {{sin:number[], cos:number[]}} Returns the table data.
	 */
	sinCosGenerator: function(length, sinAmplitude, cosAmplitude, frequency) {

		if (sinAmplitude === undefined) {
			sinAmplitude = 1.0;
		}
		if (cosAmplitude === undefined) {
			cosAmplitude = 1.0;
		}
		if (frequency === undefined) {
			frequency = 1.0;
		}

		var sin = sinAmplitude;
		var cos = cosAmplitude;
		var frq = frequency * Math.PI / length;

		var cosTable = [];
		var sinTable = [];

		for (var c = 0; c < length; c++) {

			cos -= sin * frq;
			sin += cos * frq;

			cosTable[c] = cos;
			sinTable[c] = sin;

		}

		return {
			sin: sinTable,
			cos: cosTable,
			length: length
		};

	},

	/**
	 * Returns the euclidian distance between the two given set of coordinates.
	 *
	 * @method Phaser.Math#distance
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {number} The distance between the two sets of coordinates.
	 */
	distance: function(x1, y1, x2, y2) {

		var dx = x1 - x2;
		var dy = y1 - y2;

		return Math.sqrt(dx * dx + dy * dy);

	},

	/**
	 * Returns the euclidean distance squared between the two given set of
	 * coordinates (cuts out a square root operation before returning).
	 *
	 * @method Phaser.Math#distanceSq
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @return {number} The distance squared between the two sets of coordinates.
	 */
	distanceSq: function(x1, y1, x2, y2) {

		var dx = x1 - x2;
		var dy = y1 - y2;

		return dx * dx + dy * dy;

	},

	/**
	 * Returns the distance between the two given set of coordinates at the power given.
	 *
	 * @method Phaser.Math#distancePow
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} [pow=2]
	 * @return {number} The distance between the two sets of coordinates.
	 */
	distancePow: function(x1, y1, x2, y2, pow) {

		if (pow === undefined) {
			pow = 2;
		}

		return Math.sqrt(Math.pow(x2 - x1, pow) + Math.pow(y2 - y1, pow));

	},

	/**
	 * Force a value within the boundaries by clamping it to the range `min`, `max`.
	 *
	 * @method Phaser.Math#clamp
	 * @param {float} v - The value to be clamped.
	 * @param {float} min - The minimum bounds.
	 * @param {float} max - The maximum bounds.
	 * @return {number} The clamped value.
	 */
	clamp: function(v, min, max) {

		if (v < min) {
			return min;
		} else if (max < v) {
			return max;
		} else {
			return v;
		}

	},

	/**
	 * Clamp `x` to the range `[a, Infinity)`.
	 * Roughly the same as `Math.max(x, a)`, except for NaN handling.
	 *
	 * @method Phaser.Math#clampBottom
	 * @param {number} x
	 * @param {number} a
	 * @return {number}
	 */
	clampBottom: function(x, a) {

		return x < a ? a : x;

	},

	/**
	 * Checks if two values are within the given tolerance of each other.
	 *
	 * @method Phaser.Math#within
	 * @param {number} a - The first number to check
	 * @param {number} b - The second number to check
	 * @param {number} tolerance - The tolerance. Anything equal to or less than this is considered within the range.
	 * @return {boolean} True if a is <= tolerance of b.
	 * @see {@link Phaser.Math.fuzzyEqual}
	 */
	within: function(a, b, tolerance) {

		return (Math.abs(a - b) <= tolerance);

	},

	/**
	 * Linear mapping from range <a1, a2> to range <b1, b2>
	 *
	 * @method Phaser.Math#mapLinear
	 * @param {number} x - The value to map
	 * @param {number} a1 - First endpoint of the range <a1, a2>
	 * @param {number} a2 - Final endpoint of the range <a1, a2>
	 * @param {number} b1 - First endpoint of the range <b1, b2>
	 * @param {number} b2 - Final endpoint of the range  <b1, b2>
	 * @return {number}
	 */
	mapLinear: function(x, a1, a2, b1, b2) {

		return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

	},

	/**
	 * Smoothstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	 *
	 * @method Phaser.Math#smoothstep
	 * @param {float} x - The input value.
	 * @param {float} min - The left edge. Should be smaller than the right edge.
	 * @param {float} max - The right edge.
	 * @return {float} A value between 0 and 1.
	 */
	smoothstep: function(x, min, max) {

		// Scale, bias and saturate x to 0..1 range
		x = Math.max(0, Math.min(1, (x - min) / (max - min)));

		// Evaluate polynomial
		return x * x * (3 - 2 * x);

	},

	/**
	 * Smootherstep function as detailed at http://en.wikipedia.org/wiki/Smoothstep
	 *
	 * @method Phaser.Math#smootherstep
	 * @param {float} x - The input value.
	 * @param {float} min - The left edge. Should be smaller than the right edge.
	 * @param {float} max - The right edge.
	 * @return {float} A value between 0 and 1.
	 */
	smootherstep: function(x, min, max) {

		x = Math.max(0, Math.min(1, (x - min) / (max - min)));

		return x * x * x * (x * (x * 6 - 15) + 10);

	},

	/**
	 * A value representing the sign of the value: -1 for negative, +1 for positive, 0 if value is 0.
	 *
	 * This works differently from `Math.sign` for values of NaN and -0, etc.
	 *
	 * @method Phaser.Math#sign
	 * @param {number} x
	 * @return {integer} An integer in {-1, 0, 1}
	 */
	sign: function(x) {

		return (x < 0) ? -1 : ((x > 0) ? 1 : 0);

	},

	/**
	 * Work out what percentage value `a` is of value `b` using the given base.
	 *
	 * @method Phaser.Math#percent
	 * @param {number} a - The value to work out the percentage for.
	 * @param {number} b - The value you wish to get the percentage of.
	 * @param {number} [base=0] - The base value.
	 * @return {number} The percentage a is of b, between 0 and 1.
	 */
	percent: function(a, b, base) {

		if (base === undefined) {
			base = 0;
		}

		if (a > b || base > b) {
			return 1;
		} else if (a < base || base > a) {
			return 0;
		} else {
			return (a - base) / b;
		}

	}

};

var degreeToRadiansFactor = Math.PI / 180;
var radianToDegreesFactor = 180 / Math.PI;

/**
 * Convert degrees to radians.
 *
 * @method Phaser.Math#degToRad
 * @param {number} degrees - Angle in degrees.
 * @return {number} Angle in radians.
 */
Phaser.Math.degToRad = function degToRad(degrees) {
	return degrees * degreeToRadiansFactor;
};

/**
 * Convert radians to degrees.
 *
 * @method Phaser.Math#radToDeg
 * @param {number} radians - Angle in radians.
 * @return {number} Angle in degrees
 */
Phaser.Math.radToDeg = function radToDeg(radians) {
	return radians * radianToDegreesFactor;
};


//
function loadTexture(key, frame, stopAnimation) {


	this.key = key;
	this.customRender = false;
	var cache = this.game.cache;

	var setFrame = true;
	var smoothed = !this.texture.baseTexture.scaleMode;

	if (Phaser.RenderTexture && key instanceof Phaser.RenderTexture) {
		this.key = key.key;
		this.setTexture(key);
	} else if (Phaser.BitmapData && key instanceof Phaser.BitmapData) {
		this.customRender = true;

		this.setTexture(key.texture);

		if (cache.hasFrameData(key.key, Phaser.Cache.BITMAPDATA)) {
			setFrame = !this.animations.loadFrameData(cache.getFrameData(key.key, Phaser.Cache.BITMAPDATA), frame);
		} else {
			setFrame = !this.animations.loadFrameData(key.frameData, 0);
		}
	} else if (key instanceof PIXI.Texture) {
		this.setTexture(key);
	} else {
		var img = cache.getImage(key, true);

		this.key = img.key;
		this.setTexture(new PIXI.Texture(img.base));

		if (key === '__default') {
			this.texture.baseTexture.skipRender = true;
		} else {
			this.texture.baseTexture.skipRender = false;
		}

		setFrame = !this.animations.loadFrameData(img.frameData, frame);
	}

	if (setFrame) {
		this._frame = Phaser.Rectangle.clone(this.texture.frame);
	}

	if (!smoothed) {
		this.texture.baseTexture.scaleMode = 1;
	}

}
//

/* 时间 */
Phaser.Time = function(game) {

	/**
	 * @property {Phaser.Game} game - Local reference to game.
	 * @protected
	 */
	this.game = game;

	/**
	 * The `Date.now()` value when the time was last updated.
	 * @property {integer} time
	 * @protected
	 */
	this.time = 0;

	/**
	 * The `now` when the previous update occurred.
	 * @property {number} prevTime
	 * @protected
	 */
	this.prevTime = 0;

	/**
	 * An increasing value representing cumulative milliseconds since an undisclosed epoch.
	 *
	 * While this value is in milliseconds and can be used to compute time deltas,
	 * it must must _not_ be used with `Date.now()` as it may not use the same epoch / starting reference.
	 *
	 * The source may either be from a high-res source (eg. if RAF is available) or the standard Date.now;
	 * the value can only be relied upon within a particular game instance.
	 *
	 * @property {number} now
	 * @protected
	 */
	this.now = 0;

	/**
	 * Elapsed time since the last time update, in milliseconds, based on `now`.
	 *
	 * This value _may_ include time that the game is paused/inactive.
	 *
	 * _Note:_ This is updated only once per game loop - even if multiple logic update steps are done.
	 * Use {@link Phaser.Timer#physicsTime physicsTime} as a basis of game/logic calculations instead.
	 *
	 * @property {number} elapsed
	 * @see Phaser.Time.time
	 * @protected
	 */
	this.elapsed = 0;

	/**
	 * The time in ms since the last time update, in milliseconds, based on `time`.
	 *
	 * This value is corrected for game pauses and will be "about zero" after a game is resumed.
	 *
	 * _Note:_ This is updated once per game loop - even if multiple logic update steps are done.
	 * Use {@link Phaser.Timer#physicsTime physicsTime} as a basis of game/logic calculations instead.
	 *
	 * @property {integer} elapsedMS
	 * @protected
	 */
	this.elapsedMS = 0;

	/**
	 * The physics update delta, in fractional seconds.
	 *
	 * This should be used as an applicable multiplier by all logic update steps (eg. `preUpdate/postUpdate/update`)
	 * to ensure consistent game timing. Game/logic timing can drift from real-world time if the system
	 * is unable to consistently maintain the desired FPS.
	 *
	 * With fixed-step updates this is normally equivalent to `1.0 / desiredFps`.
	 *
	 * @property {number} physicsElapsed
	 */
	this.physicsElapsed = 1 / 60;

	/**
	 * The physics update delta, in milliseconds - equivalent to `physicsElapsed * 1000`.
	 *
	 * @property {number} physicsElapsedMS
	 */
	this.physicsElapsedMS = (1 / 60) * 1000;

	/**
	 * The desiredFps multiplier as used by Game.update.
	 * @property {integer} desiredFpsMult
	 * @protected
	 */
	this.desiredFpsMult = 1.0 / 60;

	/**
	 * The desired frame rate of the game.
	 *
	 * This is used is used to calculate the physic/logic multiplier and how to apply catch-up logic updates.
	 *
	 * @property {number} _desiredFps
	 * @private
	 * @default
	 */
	this._desiredFps = 60;

	/**
	 * The suggested frame rate for your game, based on an averaged real frame rate.
	 * This value is only populated if `Time.advancedTiming` is enabled.
	 *
	 * _Note:_ This is not available until after a few frames have passed; until then
	 * it's set to the same value as desiredFps.
	 *
	 * @property {number} suggestedFps
	 * @default
	 */
	this.suggestedFps = this.desiredFps;

	/**
	 * Scaling factor to make the game move smoothly in slow motion
	 * - 1.0 = normal speed
	 * - 2.0 = half speed
	 * @property {number} slowMotion
	 * @default
	 */
	this.slowMotion = 1.0;

	/**
	 * If true then advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated.
	 * @property {boolean} advancedTiming
	 * @default
	 */
	this.advancedTiming = false;

	/**
	 * Advanced timing result: The number of render frames record in the last second.
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * @property {integer} frames
	 * @readonly
	 */
	this.frames = 0;

	/**
	 * Advanced timing result: Frames per second.
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * @property {number} fps
	 * @readonly
	 */
	this.fps = 0;

	/**
	 * Advanced timing result: The lowest rate the fps has dropped to.
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * This value can be manually reset.
	 * @property {number} fpsMin
	 */
	this.fpsMin = 1000;

	/**
	 * Advanced timing result: The highest rate the fps has reached (usually no higher than 60fps).
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * This value can be manually reset.
	 * @property {number} fpsMax
	 */
	this.fpsMax = 0;

	/**
	 * Advanced timing result: The minimum amount of time the game has taken between consecutive frames.
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * This value can be manually reset.
	 * @property {number} msMin
	 * @default
	 */
	this.msMin = 1000;

	/**
	 * Advanced timing result: The maximum amount of time the game has taken between consecutive frames.
	 *
	 * Only calculated if {@link Phaser.Time#advancedTiming advancedTiming} is enabled.
	 * This value can be manually reset.
	 * @property {number} msMax
	 */
	this.msMax = 0;

	/**
	 * Records how long the game was last paused, in milliseconds.
	 * (This is not updated until the game is resumed.)
	 * @property {number} pauseDuration
	 */
	this.pauseDuration = 0;

	/**
	 * @property {number} timeToCall - The value that setTimeout needs to work out when to next update
	 * @protected
	 */
	this.timeToCall = 0;

	/**
	 * @property {number} timeExpected - The time when the next call is expected when using setTimer to control the update loop
	 * @protected
	 */
	this.timeExpected = 0;

	/**
	 * A {@link Phaser.Timer} object bound to the master clock (this Time object) which events can be added to.
	 * @property {Phaser.Timer} events
	 */
	this.events = new Phaser.Timer(this.game, false);

	/**
	 * @property {number} _frameCount - count the number of calls to time.update since the last suggestedFps was calculated
	 * @private
	 */
	this._frameCount = 0;

	/**
	 * @property {number} _elapsedAcumulator - sum of the elapsed time since the last suggestedFps was calculated
	 * @private
	 */
	this._elapsedAccumulator = 0;

	/**
	 * @property {number} _started - The time at which the Game instance started.
	 * @private
	 */
	this._started = 0;

	/**
	 * @property {number} _timeLastSecond - The time (in ms) that the last second counter ticked over.
	 * @private
	 */
	this._timeLastSecond = 0;

	/**
	 * @property {number} _pauseStarted - The time the game started being paused.
	 * @private
	 */
	this._pauseStarted = 0;

	/**
	 * @property {boolean} _justResumed - Internal value used to recover from the game pause state.
	 * @private
	 */
	this._justResumed = false;

	/**
	 * @property {Phaser.Timer[]} _timers - Internal store of Phaser.Timer objects.
	 * @private
	 */
	this._timers = [];

};

Phaser.Time.prototype = {

	/**
	 * Called automatically by Phaser.Game after boot. Should not be called directly.
	 *
	 * @method Phaser.Time#boot
	 * @protected
	 */
	boot: function() {

		this._started = Date.now();
		this.time = Date.now();
		this.events.start();
		this.timeExpected = this.time;

	},

	/**
	 * Adds an existing Phaser.Timer object to the Timer pool.
	 *
	 * @method Phaser.Time#add
	 * @param {Phaser.Timer} timer - An existing Phaser.Timer object.
	 * @return {Phaser.Timer} The given Phaser.Timer object.
	 */
	add: function(timer) {

		this._timers.push(timer);

		return timer;

	},

	/**
	 * Creates a new stand-alone Phaser.Timer object.
	 *
	 * @method Phaser.Time#create
	 * @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
	 * @return {Phaser.Timer} The Timer object that was created.
	 */
	create: function(autoDestroy) {

		if (autoDestroy === undefined) {
			autoDestroy = true;
		}

		var timer = new Phaser.Timer(this.game, autoDestroy);

		this._timers.push(timer);

		return timer;

	},

	/**
	 * Remove all Timer objects, regardless of their state and clears all Timers from the {@link Phaser.Time#events events} timer.
	 *
	 * @method Phaser.Time#removeAll
	 */
	removeAll: function() {

		for (var i = 0; i < this._timers.length; i++) {
			this._timers[i].destroy();
		}

		this._timers = [];

		this.events.removeAll();

	},

	/**
	 * Refreshes the Time.time and Time.elapsedMS properties from the system clock.
	 *
	 * @method Phaser.Time#refresh
	 */
	refresh: function() {

		//  Set to the old Date.now value
		var previousDateNow = this.time;

		// this.time always holds a Date.now value
		this.time = Date.now();

		//  Adjust accordingly.
		this.elapsedMS = this.time - previousDateNow;

	},

	/**
	 * Updates the game clock and if enabled the advanced timing data. This is called automatically by Phaser.Game.
	 *
	 * @method Phaser.Time#update
	 * @protected
	 * @param {number} time - The current relative timestamp; see {@link Phaser.Time#now now}.
	 */
	update: function(time) {

		//  Set to the old Date.now value
		var previousDateNow = this.time;

		// this.time always holds a Date.now value
		this.time = Date.now();

		//  Adjust accordingly.
		this.elapsedMS = this.time - previousDateNow;

		// 'now' is currently still holding the time of the last call, move it into prevTime
		this.prevTime = this.now;

		// update 'now' to hold the current time
		// this.now may hold the RAF high resolution time value if RAF is available (otherwise it also holds Date.now)
		this.now = time;

		// elapsed time between previous call and now - this could be a high resolution value
		this.elapsed = this.now - this.prevTime;

		//         if (this.game.raf._isSetTimeOut)
		//         {
		//             // console.log('Time isSet', this._desiredFps, 'te', this.timeExpected, 'time', time);
		// 
		//             // time to call this function again in ms in case we're using timers instead of RequestAnimationFrame to update the game
		//             this.timeToCall = Math.floor(Math.max(0, (1000.0 / this._desiredFps) - (this.timeExpected - time)));
		// 
		//             // time when the next call is expected if using timers
		//             this.timeExpected = time + this.timeToCall;
		// 
		//             // console.log('Time expect', this.timeExpected);
		//         }

		if (this.advancedTiming) {
			this.updateAdvancedTiming();
		}

		//  Paused but still running?
		if (!this.game.paused) {
			//  Our internal Phaser.Timer
			this.events.update(this.time);

			if (this._timers.length) {
				this.updateTimers();
			}
		}

	},

	/**
	 * Handles the updating of the Phaser.Timers (if any)
	 * Called automatically by Time.update.
	 *
	 * @method Phaser.Time#updateTimers
	 * @private
	 */
	updateTimers: function() {

		//  Any game level timers
		var i = 0;
		var len = this._timers.length;

		while (i < len) {
			if (this._timers[i].update(this.time)) {
				i++;
			} else {
				//  Timer requests to be removed
				this._timers.splice(i, 1);
				len--;
			}
		}

	},

	/**
	 * Handles the updating of the advanced timing values (if enabled)
	 * Called automatically by Time.update.
	 *
	 * @method Phaser.Time#updateAdvancedTiming
	 * @private
	 */
	updateAdvancedTiming: function() {

		// count the number of time.update calls
		this._frameCount++;
		this._elapsedAccumulator += this.elapsed;

		// occasionally recalculate the suggestedFps based on the accumulated elapsed time
		if (this._frameCount >= this._desiredFps * 2) {
			// this formula calculates suggestedFps in multiples of 5 fps
			this.suggestedFps = Math.floor(200 / (this._elapsedAccumulator / this._frameCount)) * 5;
			this._frameCount = 0;
			this._elapsedAccumulator = 0;
		}

		this.msMin = Math.min(this.msMin, this.elapsed);
		this.msMax = Math.max(this.msMax, this.elapsed);

		this.frames++;

		if (this.now > this._timeLastSecond + 1000) {
			this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
			this.fpsMin = Math.min(this.fpsMin, this.fps);
			this.fpsMax = Math.max(this.fpsMax, this.fps);
			this._timeLastSecond = this.now;
			this.frames = 0;
		}

	},

	/**
	 * Called when the game enters a paused state.
	 *
	 * @method Phaser.Time#gamePaused
	 * @private
	 */
	gamePaused: function() {

		this._pauseStarted = Date.now();

		this.events.pause();

		var i = this._timers.length;

		while (i--) {
			this._timers[i]._pause();
		}

	},

	/**
	 * Called when the game resumes from a paused state.
	 *
	 * @method Phaser.Time#gameResumed
	 * @private
	 */
	gameResumed: function() {

		// Set the parameter which stores Date.now() to make sure it's correct on resume
		this.time = Date.now();

		this.pauseDuration = this.time - this._pauseStarted;

		this.events.resume();

		var i = this._timers.length;

		while (i--) {
			this._timers[i]._resume();
		}

	},

	/**
	 * The number of seconds that have elapsed since the game was started.
	 *
	 * @method Phaser.Time#totalElapsedSeconds
	 * @return {number} The number of seconds that have elapsed since the game was started.
	 */
	totalElapsedSeconds: function() {
		return (this.time - this._started) * 0.001;
	},

	/**
	 * How long has passed since the given time.
	 *
	 * @method Phaser.Time#elapsedSince
	 * @param {number} since - The time you want to measure against.
	 * @return {number} The difference between the given time and now.
	 */
	elapsedSince: function(since) {
		return this.time - since;
	},

	/**
	 * How long has passed since the given time (in seconds).
	 *
	 * @method Phaser.Time#elapsedSecondsSince
	 * @param {number} since - The time you want to measure (in seconds).
	 * @return {number} Duration between given time and now (in seconds).
	 */
	elapsedSecondsSince: function(since) {
		return (this.time - since) * 0.001;
	},

	/**
	 * Resets the private _started value to now and removes all currently running Timers.
	 *
	 * @method Phaser.Time#reset
	 */
	reset: function() {

		this._started = this.time;
		this.removeAll();

	}

};

/**
 * The desired frame rate of the game.
 *
 * This is used is used to calculate the physic / logic multiplier and how to apply catch-up logic updates.
 * 
 * @name Phaser.Time#desiredFps
 * @property {integer} desiredFps - The desired frame rate of the game. Defaults to 60.
 */
Object.defineProperty(Phaser.Time.prototype, "desiredFps", {

	get: function() {

		return this._desiredFps;

	},

	set: function(value) {

		this._desiredFps = value;

		//  Set the physics elapsed time... this will always be 1 / this.desiredFps 
		//  because we're using fixed time steps in game.update
		this.physicsElapsed = 1 / value;

		this.physicsElapsedMS = this.physicsElapsed * 1000;

		this.desiredFpsMult = 1.0 / value;

	}

});

Phaser.Time.prototype.constructor = Phaser.Time;
Phaser.Timer = function(game, autoDestroy) {

	if (autoDestroy === undefined) {
		autoDestroy = true;
	}

	/**
	 * @property {Phaser.Game} game - Local reference to game.
	 * @protected
	 */
	this.game = game;

	/**
	 * True if the Timer is actively running.
	 *
	 * Do not modify this boolean - use {@link Phaser.Timer#pause pause} (and {@link Phaser.Timer#resume resume}) to pause the timer.
	 * @property {boolean} running
	 * @default
	 * @readonly
	 */
	this.running = false;

	/**
	 * If true, the timer will automatically destroy itself after all the events have been dispatched (assuming no looping events).
	 * @property {boolean} autoDestroy
	 */
	this.autoDestroy = autoDestroy;

	/**
	 * @property {boolean} expired - An expired Timer is one in which all of its events have been dispatched and none are pending.
	 * @readonly
	 * @default
	 */
	this.expired = false;

	/**
	 * @property {number} elapsed - Elapsed time since the last frame (in ms).
	 * @protected
	 */
	this.elapsed = 0;

	/**
	 * @property {Phaser.TimerEvent[]} events - An array holding all of this timers Phaser.TimerEvent objects. Use the methods add, repeat and loop to populate it.
	 */
	this.events = [];

	/**
	 * This signal will be dispatched when this Timer has completed which means that there are no more events in the queue.
	 *
	 * The signal is supplied with one argument, `timer`, which is this Timer object.
	 *
	 * @property {Phaser.Signal} onComplete
	 */
	this.onComplete = new Signal();

	/**
	 * @property {number} nextTick - The time the next tick will occur.
	 * @readonly
	 * @protected
	 */
	this.nextTick = 0;

	/**
	 * @property {number} timeCap - If the difference in time between two frame updates exceeds this value, the event times are reset to avoid catch-up situations.
	 */
	this.timeCap = 1000;

	/**
	 * @property {boolean} paused - The paused state of the Timer. You can pause the timer by calling Timer.pause() and Timer.resume() or by the game pausing.
	 * @readonly
	 * @default
	 */
	this.paused = false;

	/**
	 * @property {boolean} _codePaused - Was the Timer paused by code or by Game focus loss?
	 * @private
	 */
	this._codePaused = false;

	/**
	 * @property {number} _started - The time at which this Timer instance started running.
	 * @private
	 * @default
	 */
	this._started = 0;

	/**
	 * @property {number} _pauseStarted - The time the game started being paused.
	 * @private
	 */
	this._pauseStarted = 0;

	/**
	 * @property {number} _pauseTotal - Total paused time.
	 * @private
	 */
	this._pauseTotal = 0;

	/**
	 * @property {number} _now - The current start-time adjusted time.
	 * @private
	 */
	this._now = Date.now();

	/**
	 * @property {number} _len - Temp. array length variable.
	 * @private
	 */
	this._len = 0;

	/**
	 * @property {number} _marked - Temp. counter variable.
	 * @private
	 */
	this._marked = 0;

	/**
	 * @property {number} _i - Temp. array counter variable.
	 * @private
	 */
	this._i = 0;

	/**
	 * @property {number} _diff - Internal cache var.
	 * @private
	 */
	this._diff = 0;

	/**
	 * @property {number} _newTick - Internal cache var.
	 * @private
	 */
	this._newTick = 0;

};

/**
 * Number of milliseconds in a minute.
 * @constant
 * @type {integer}
 */
Phaser.Timer.MINUTE = 60000;

/**
 * Number of milliseconds in a second.
 * @constant
 * @type {integer}
 */
Phaser.Timer.SECOND = 1000;

/**
 * Number of milliseconds in half a second.
 * @constant
 * @type {integer}
 */
Phaser.Timer.HALF = 500;

/**
 * Number of milliseconds in a quarter of a second.
 * @constant
 * @type {integer}
 */
Phaser.Timer.QUARTER = 250;

Phaser.Timer.prototype = {

	/**
	 * Creates a new TimerEvent on this Timer.
	 *
	 * Use {@link Phaser.Timer#add}, {@link Phaser.Timer#repeat}, or {@link Phaser.Timer#loop} methods to create a new event.
	 *
	 * @method Phaser.Timer#create
	 * @private
	 * @param {integer} delay - The number of milliseconds, in {@link Phaser.Time game time}, before the timer event occurs.
	 * @param {boolean} loop - Should the event loop or not?
	 * @param {number} repeatCount - The number of times the event will repeat.
	 * @param {function} callback - The callback that will be called when the timer event occurs.
	 * @param {object} callbackContext - The context in which the callback will be called.
	 * @param {any[]} arguments - The values to be sent to your callback function when it is called.
	 * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
	 */
	create: function(delay, loop, repeatCount, callback, callbackContext, args) {

		delay = Math.round(delay);

		var tick = delay;

		if (this._now === 0) {
			tick += this.game.time.time;
		} else {
			tick += this._now;
		}

		var event = new Phaser.TimerEvent(this, delay, tick, repeatCount, loop, callback, callbackContext, args);

		this.events.push(event);

		this.order();

		this.expired = false;

		return event;

	},

	/**
	 * Adds a new Event to this Timer.
	 *
	 * The event will fire after the given amount of `delay` in milliseconds has passed, once the Timer has started running.
	 * The delay is in relation to when the Timer starts, not the time it was added. If the Timer is already running the delay will be calculated based on the timers current time.
	 *
	 * Make sure to call {@link Phaser.Timer#start start} after adding all of the Events you require for this Timer.
	 *
	 * @method Phaser.Timer#add
	 * @param {integer} delay - The number of milliseconds, in {@link Phaser.Time game time}, before the timer event occurs.
	 * @param {function} callback - The callback that will be called when the timer event occurs.
	 * @param {object} callbackContext - The context in which the callback will be called.
	 * @param {...*} arguments - Additional arguments that will be supplied to the callback.
	 * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
	 */
	add: function(delay, callback, callbackContext) {

		return this.create(delay, false, 0, callback, callbackContext, Array.prototype.slice.call(arguments, 3));

	},

	/**
	 * Adds a new TimerEvent that will always play through once and then repeat for the given number of iterations.
	 *
	 * The event will fire after the given amount of `delay` in milliseconds has passed, once the Timer has started running.
	 * The delay is in relation to when the Timer starts, not the time it was added.
	 * If the Timer is already running the delay will be calculated based on the timers current time.
	 *
	 * Make sure to call {@link Phaser.Timer#start start} after adding all of the Events you require for this Timer.
	 *
	 * @method Phaser.Timer#repeat
	 * @param {integer} delay - The number of milliseconds, in {@link Phaser.Time game time}, before the timer event occurs.
	 * @param {number} repeatCount - The number of times the event will repeat once is has finished playback. A repeatCount of 1 means it will repeat itself once, playing the event twice in total.
	 * @param {function} callback - The callback that will be called when the timer event occurs.
	 * @param {object} callbackContext - The context in which the callback will be called.
	 * @param {...*} arguments - Additional arguments that will be supplied to the callback.
	 * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
	 */
	repeat: function(delay, repeatCount, callback, callbackContext) {

		return this.create(delay, false, repeatCount, callback, callbackContext, Array.prototype.slice.call(arguments, 4));

	},

	/**
	 * Adds a new looped Event to this Timer that will repeat forever or until the Timer is stopped.
	 *
	 * The event will fire after the given amount of `delay` in milliseconds has passed, once the Timer has started running.
	 * The delay is in relation to when the Timer starts, not the time it was added. If the Timer is already running the delay will be calculated based on the timers current time.
	 *
	 * Make sure to call {@link Phaser.Timer#start start} after adding all of the Events you require for this Timer.
	 *
	 * @method Phaser.Timer#loop
	 * @param {integer} delay - The number of milliseconds, in {@link Phaser.Time game time}, before the timer event occurs.
	 * @param {function} callback - The callback that will be called when the timer event occurs.
	 * @param {object} callbackContext - The context in which the callback will be called.
	 * @param {...*} arguments - Additional arguments that will be supplied to the callback.
	 * @return {Phaser.TimerEvent} The Phaser.TimerEvent object that was created.
	 */
	loop: function(delay, callback, callbackContext) {

		return this.create(delay, true, 0, callback, callbackContext, Array.prototype.slice.call(arguments, 3));

	},

	/**
	 * Starts this Timer running.
	 * @method Phaser.Timer#start
	 * @param {integer} [delay=0] - The number of milliseconds, in {@link Phaser.Time game time}, that should elapse before the Timer will start.
	 */
	start: function(delay) {

		if (this.running) {
			return;
		}

		this._started = this.game.time.time + (delay || 0);

		this.running = true;

		for (var i = 0; i < this.events.length; i++) {
			this.events[i].tick = this.events[i].delay + this._started;
		}

	},

	/**
	 * Stops this Timer from running. Does not cause it to be destroyed if autoDestroy is set to true.
	 * @method Phaser.Timer#stop
	 * @param {boolean} [clearEvents=true] - If true all the events in Timer will be cleared, otherwise they will remain.
	 */
	stop: function(clearEvents) {

		this.running = false;

		if (clearEvents === undefined) {
			clearEvents = true;
		}

		if (clearEvents) {
			this.events.length = 0;
		}

	},

	/**
	 * Removes a pending TimerEvent from the queue.
	 * @param {Phaser.TimerEvent} event - The event to remove from the queue.
	 * @method Phaser.Timer#remove
	 */
	remove: function(event) {

		for (var i = 0; i < this.events.length; i++) {
			if (this.events[i] === event) {
				this.events[i].pendingDelete = true;
				return true;
			}
		}

		return false;

	},

	/**
	 * Orders the events on this Timer so they are in tick order.
	 * This is called automatically when new events are created.
	 * @method Phaser.Timer#order
	 * @protected
	 */
	order: function() {

		if (this.events.length > 0) {
			//  Sort the events so the one with the lowest tick is first
			this.events.sort(this.sortHandler);

			this.nextTick = this.events[0].tick;
		}

	},

	/**
	 * Sort handler used by Phaser.Timer.order.
	 * @method Phaser.Timer#sortHandler
	 * @private
	 */
	sortHandler: function(a, b) {

		if (a.tick < b.tick) {
			return -1;
		} else if (a.tick > b.tick) {
			return 1;
		}

		return 0;

	},

	/**
	 * Clears any events from the Timer which have pendingDelete set to true and then resets the private _len and _i values.
	 *
	 * @method Phaser.Timer#clearPendingEvents
	 * @protected
	 */
	clearPendingEvents: function() {

		this._i = this.events.length;

		while (this._i--) {
			if (this.events[this._i].pendingDelete) {
				this.events.splice(this._i, 1);
			}
		}

		this._len = this.events.length;
		this._i = 0;

	},

	/**
	 * The main Timer update event, called automatically by Phaser.Time.update.
	 *
	 * @method Phaser.Timer#update
	 * @protected
	 * @param {number} time - The time from the core game clock.
	 * @return {boolean} True if there are still events waiting to be dispatched, otherwise false if this Timer can be destroyed.
	 */
	update: function(time) {

		if (this.paused) {
			return true;
		}

		this.elapsed = time - this._now;
		this._now = time;

		//  spike-dislike
		if (this.elapsed > this.timeCap) {
			//  For some reason the time between now and the last time the game was updated was larger than our timeCap.
			//  This can happen if the Stage.disableVisibilityChange is true and you swap tabs, which makes the raf pause.
			//  In this case we need to adjust the TimerEvents and nextTick.
			this.adjustEvents(time - this.elapsed);
		}

		this._marked = 0;

		//  Clears events marked for deletion and resets _len and _i to 0.
		this.clearPendingEvents();

		if (this.running && this._now >= this.nextTick && this._len > 0) {
			while (this._i < this._len && this.running) {
				if (this._now >= this.events[this._i].tick && !this.events[this._i].pendingDelete) {
					//  (now + delay) - (time difference from last tick to now)
					this._newTick = (this._now + this.events[this._i].delay) - (this._now - this.events[this._i].tick);

					if (this._newTick < 0) {
						this._newTick = this._now + this.events[this._i].delay;
					}

					if (this.events[this._i].loop === true) {
						this.events[this._i].tick = this._newTick;
						this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
					} else if (this.events[this._i].repeatCount > 0) {
						this.events[this._i].repeatCount--;
						this.events[this._i].tick = this._newTick;
						this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
					} else {
						this._marked++;
						this.events[this._i].pendingDelete = true;
						this.events[this._i].callback.apply(this.events[this._i].callbackContext, this.events[this._i].args);
					}

					this._i++;
				} else {
					break;
				}
			}

			//  Are there any events left?
			if (this.events.length > this._marked) {
				this.order();
			} else {
				this.expired = true;
				this.onComplete.dispatch(this);
			}
		}

		if (this.expired && this.autoDestroy) {
			return false;
		} else {
			return true;
		}

	},

	/**
	 * Pauses the Timer and all events in the queue.
	 * @method Phaser.Timer#pause
	 */
	pause: function() {

		if (!this.running) {
			return;
		}

		this._codePaused = true;

		if (this.paused) {
			return;
		}

		this._pauseStarted = this.game.time.time;

		this.paused = true;

	},

	/**
	 * Internal pause/resume control - user code should use Timer.pause instead.
	 * @method Phaser.Timer#_pause
	 * @private
	 */
	_pause: function() {

		if (this.paused || !this.running) {
			return;
		}

		this._pauseStarted = this.game.time.time;

		this.paused = true;

	},

	/**
	 * Adjusts the time of all pending events and the nextTick by the given baseTime.
	 *
	 * @method Phaser.Timer#adjustEvents
	 * @protected
	 */
	adjustEvents: function(baseTime) {

		for (var i = 0; i < this.events.length; i++) {
			if (!this.events[i].pendingDelete) {
				//  Work out how long there would have been from when the game paused until the events next tick
				var t = this.events[i].tick - baseTime;

				if (t < 0) {
					t = 0;
				}

				//  Add the difference on to the time now
				this.events[i].tick = this._now + t;
			}
		}

		var d = this.nextTick - baseTime;

		if (d < 0) {
			this.nextTick = this._now;
		} else {
			this.nextTick = this._now + d;
		}

	},

	/**
	 * Resumes the Timer and updates all pending events.
	 *
	 * @method Phaser.Timer#resume
	 */
	resume: function() {

		if (!this.paused) {
			return;
		}

		var now = this.game.time.time;
		this._pauseTotal += now - this._now;
		this._now = now;

		this.adjustEvents(this._pauseStarted);

		this.paused = false;
		this._codePaused = false;

	},

	/**
	 * Internal pause/resume control - user code should use Timer.resume instead.
	 * @method Phaser.Timer#_resume
	 * @private
	 */
	_resume: function() {

		if (this._codePaused) {
			return;
		} else {
			this.resume();
		}

	},

	/**
	 * Removes all Events from this Timer and all callbacks linked to onComplete, but leaves the Timer running.    
	 * The onComplete callbacks won't be called.
	 *
	 * @method Phaser.Timer#removeAll
	 */
	removeAll: function() {

		this.onComplete.removeAll();
		this.events.length = 0;
		this._len = 0;
		this._i = 0;

	},

	/**
	 * Destroys this Timer. Any pending Events are not dispatched.
	 * The onComplete callbacks won't be called.
	 *
	 * @method Phaser.Timer#destroy
	 */
	destroy: function() {

		this.onComplete.removeAll();
		this.running = false;
		this.events = [];
		this._len = 0;
		this._i = 0;

	}

};

/**
 * @name Phaser.Timer#next
 * @property {number} next - The time at which the next event will occur.
 * @readonly
 */
Object.defineProperty(Phaser.Timer.prototype, "next", {

	get: function() {
		return this.nextTick;
	}

});

/**
 * @name Phaser.Timer#duration
 * @property {number} duration - The duration in ms remaining until the next event will occur.
 * @readonly
 */
Object.defineProperty(Phaser.Timer.prototype, "duration", {

	get: function() {

		if (this.running && this.nextTick > this._now) {
			return this.nextTick - this._now;
		} else {
			return 0;
		}

	}

});

/**
 * @name Phaser.Timer#length
 * @property {number} length - The number of pending events in the queue.
 * @readonly
 */
Object.defineProperty(Phaser.Timer.prototype, "length", {

	get: function() {
		return this.events.length;
	}

});

/**
 * @name Phaser.Timer#ms
 * @property {number} ms - The duration in milliseconds that this Timer has been running for.
 * @readonly
 */
Object.defineProperty(Phaser.Timer.prototype, "ms", {

	get: function() {

		if (this.running) {
			return this._now - this._started - this._pauseTotal;
		} else {
			return 0;
		}

	}

});

/**
 * @name Phaser.Timer#seconds
 * @property {number} seconds - The duration in seconds that this Timer has been running for.
 * @readonly
 */
Object.defineProperty(Phaser.Timer.prototype, "seconds", {

	get: function() {

		if (this.running) {
			return this.ms * 0.001;
		} else {
			return 0;
		}

	}

});

Phaser.Timer.prototype.constructor = Phaser.Timer;

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A TimerEvent is a single event that is processed by a Phaser.Timer.
 *
 * It consists of a delay, which is a value in milliseconds after which the event will fire.
 * When the event fires it calls a specific callback with the specified arguments.
 * 
 * TimerEvents are removed by their parent timer once finished firing or repeating.
 * 
 * Use {@link Phaser.Timer#add}, {@link Phaser.Timer#repeat}, or {@link Phaser.Timer#loop} methods to create a new event.
 *
 * @class Phaser.TimerEvent
 * @constructor
 * @param {Phaser.Timer} timer - The Timer object that this TimerEvent belongs to.
 * @param {number} delay - The delay in ms at which this TimerEvent fires.
 * @param {number} tick - The tick is the next game clock time that this event will fire at.
 * @param {number} repeatCount - If this TimerEvent repeats it will do so this many times.
 * @param {boolean} loop - True if this TimerEvent loops, otherwise false.
 * @param {function} callback - The callback that will be called when the TimerEvent occurs.
 * @param {object} callbackContext - The context in which the callback will be called.
 * @param {any[]} arguments - Additional arguments to be passed to the callback.
 */
Phaser.TimerEvent = function(timer, delay, tick, repeatCount, loop, callback, callbackContext, args) {

	/**
	 * @property {Phaser.Timer} timer - The Timer object that this TimerEvent belongs to.
	 * @protected
	 * @readonly
	 */
	this.timer = timer;

	/**
	 * @property {number} delay - The delay in ms at which this TimerEvent fires.
	 */
	this.delay = delay;

	/**
	 * @property {number} tick - The tick is the next game clock time that this event will fire at.
	 */
	this.tick = tick;

	/**
	 * @property {number} repeatCount - If this TimerEvent repeats it will do so this many times.
	 */
	this.repeatCount = repeatCount - 1;

	/**
	 * @property {boolean} loop - True if this TimerEvent loops, otherwise false.
	 */
	this.loop = loop;

	/**
	 * @property {function} callback - The callback that will be called when the TimerEvent occurs.
	 */
	this.callback = callback;

	/**
	 * @property {object} callbackContext - The context in which the callback will be called.
	 */
	this.callbackContext = callbackContext;

	/**
	 * @property {any[]} arguments - Additional arguments to be passed to the callback.
	 */
	this.args = args;

	/**
	 * @property {boolean} pendingDelete - A flag that controls if the TimerEvent is pending deletion.
	 * @protected
	 */
	this.pendingDelete = false;

};

Phaser.TimerEvent.prototype.constructor = Phaser.TimerEvent;
/* 时间结束 */

/* 补间动画 */
/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A Tween allows you to alter one or more properties of a target object over a defined period of time.
 * This can be used for things such as alpha fading Sprites, scaling them or motion.
 * Use `Tween.to` or `Tween.from` to set-up the tween values. You can create multiple tweens on the same object
 * by calling Tween.to multiple times on the same Tween. Additional tweens specified in this way become "child" tweens and
 * are played through in sequence. You can use Tween.timeScale and Tween.reverse to control the playback of this Tween and all of its children.
 *
 * @class Phaser.Tween
 * @constructor
 * @param {object} target - The target object, such as a Phaser.Sprite or Phaser.Sprite.scale.
 * @param {Phaser.Game} game - Current game instance.
 * @param {Phaser.TweenManager} manager - The TweenManager responsible for looking after this Tween.
 */
Phaser.Tween = function(target, game, manager) {

	/**
	 * @property {Phaser.Game} game - A reference to the currently running Game.
	 */
	this.game = game;

	/**
	 * @property {object} target - The target object, such as a Phaser.Sprite or property like Phaser.Sprite.scale.
	 */
	this.target = target;

	/**
	 * @property {Phaser.TweenManager} manager - Reference to the TweenManager responsible for updating this Tween.
	 */
	this.manager = manager;

	/**
	 * @property {Array} timeline - An Array of TweenData objects that comprise the different parts of this Tween.
	 */
	this.timeline = [];

	/**
	 * If set to `true` the current tween will play in reverse.
	 * If the tween hasn't yet started this has no effect.
	 * If there are child tweens then all child tweens will play in reverse from the current point.
	 * @property {boolean} reverse
	 * @default
	 */
	this.reverse = false;

	/**
	 * The speed at which the tweens will run. A value of 1 means it will match the game frame rate. 0.5 will run at half the frame rate. 2 at double the frame rate, etc.
	 * If a tweens duration is 1 second but timeScale is 0.5 then it will take 2 seconds to complete.
	 *
	 * @property {number} timeScale
	 * @default
	 */
	this.timeScale = 1;

	/**
	 * @property {number} repeatCounter - If the Tween and any child tweens are set to repeat this contains the current repeat count.
	 */
	this.repeatCounter = 0;

	/**
	 * @property {boolean} pendingDelete - True if this Tween is ready to be deleted by the TweenManager.
	 * @default
	 * @readonly
	 */
	this.pendingDelete = false;

	/**
	 * The onStart event is fired when the Tween begins. If there is a delay before the tween starts then onStart fires after the delay is finished.
	 * It will be sent 2 parameters: the target object and this tween.
	 * @property {Phaser.Signal} onStart
	 */
	this.onStart = new Phaser.Signal();

	/**
	 * The onLoop event is fired if the Tween, or any child tweens loop.
	 * It will be sent 2 parameters: the target object and this tween.
	 * 
	 * @property {Phaser.Signal} onLoop
	 */
	this.onLoop = new Phaser.Signal();

	/**
	 * The onRepeat event is fired if the Tween and all of its children repeats. If this tween has no children this will never be fired.
	 * It will be sent 2 parameters: the target object and this tween.
	 * @property {Phaser.Signal} onRepeat
	 */
	this.onRepeat = new Phaser.Signal();

	/**
	 * The onChildComplete event is fired when the Tween or any of its children completes.
	 * Fires every time a child completes unless a child is set to repeat forever.
	 * It will be sent 2 parameters: the target object and this tween.
	 * @property {Phaser.Signal} onChildComplete
	 */
	this.onChildComplete = new Phaser.Signal();

	/**
	 * The onComplete event is fired when the Tween and all of its children completes. Does not fire if the Tween is set to loop or repeatAll(-1).
	 * It will be sent 2 parameters: the target object and this tween.
	 * @property {Phaser.Signal} onComplete
	 */
	this.onComplete = new Phaser.Signal();

	/**
	 * @property {boolean} isRunning - If the tween is running this is set to true, otherwise false. Tweens that are in a delayed state or waiting to start are considered as being running.
	 * @default
	 */
	this.isRunning = false;

	/**
	 * @property {number} current - The current Tween child being run.
	 * @default
	 * @readonly
	 */
	this.current = 0;

	/**
	 * @property {object} properties - Target property cache used when building the child data values.
	 */
	this.properties = {};

	/**
	 * @property {Phaser.Tween} chainedTween - If this Tween is chained to another this holds a reference to it.
	 */
	this.chainedTween = null;

	/**
	 * @property {boolean} isPaused - Is this Tween paused or not?
	 * @default
	 */
	this.isPaused = false;

	/**
	 * Is this Tween frame or time based? A frame based tween will use the physics elapsed timer when updating. This means
	 * it will retain the same consistent frame rate, regardless of the speed of the device. The duration value given should
	 * be given in frames.
	 *
	 * If the Tween uses a time based update (which is the default) then the duration is given in milliseconds.
	 * In this situation a 2000ms tween will last exactly 2 seconds, regardless of the device and how many visual updates the tween
	 * has actually been through. For very short tweens you may wish to experiment with a frame based update instead.
	 *
	 * The default value is whatever you've set in TweenManager.frameBased.
	 *
	 * @property {boolean} frameBased
	 * @default
	 */
	this.frameBased = manager.frameBased;

	/**
	 * @property {function} _onUpdateCallback - An onUpdate callback.
	 * @private
	 * @default null
	 */
	this._onUpdateCallback = null;

	/**
	 * @property {object} _onUpdateCallbackContext - The context in which to call the onUpdate callback.
	 * @private
	 * @default null
	 */
	this._onUpdateCallbackContext = null;

	/**
	 * @property {number} _pausedTime - Private pause timer.
	 * @private
	 * @default
	 */
	this._pausedTime = 0;

	/**
	 * @property {boolean} _codePaused - Was the Tween paused by code or by Game focus loss?
	 * @private
	 */
	this._codePaused = false;

	/**
	 * @property {boolean} _hasStarted - Internal var to track if the Tween has started yet or not.
	 * @private
	 */
	this._hasStarted = false;
};

Phaser.Tween.prototype = {

	/**
	 * Sets this tween to be a `to` tween on the properties given. A `to` tween starts at the current value and tweens to the destination value given.
	 * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
	 * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
	 * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
	 *
	 * @method Phaser.Tween#to
	 * @param {object} properties - An object containing the properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
	 * @param {number} [duration=1000] - Duration of this tween in ms. Or if `Tween.frameBased` is true this represents the number of frames that should elapse.
	 * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
	 * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
	 * @param {number} [delay=0] - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
	 * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this individual tween, not any chained tweens.
	 * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
	 * @return {Phaser.Tween} This Tween object.
	 */
	to: function(properties, duration, ease, autoStart, delay, repeat, yoyo) {

		if (duration === undefined || duration <= 0) {
			duration = 1000;
		}
		if (ease === undefined || ease === null) {
			ease = Phaser.Easing.Default;
		}
		if (autoStart === undefined) {
			autoStart = false;
		}
		if (delay === undefined) {
			delay = 0;
		}
		if (repeat === undefined) {
			repeat = 0;
		}
		if (yoyo === undefined) {
			yoyo = false;
		}

		if (typeof ease === 'string' && this.manager.easeMap[ease]) {
			ease = this.manager.easeMap[ease];
		}

		if (this.isRunning) {
			console.warn('Phaser.Tween.to cannot be called after Tween.start');
			return this;
		}

		this.timeline.push(new Phaser.TweenData(this).to(properties, duration, ease, delay, repeat, yoyo));

		if (autoStart) {
			this.start();
		}

		return this;

	},

	/**
	 * Sets this tween to be a `from` tween on the properties given. A `from` tween sets the target to the destination value and tweens to its current value.
	 * For example a Sprite with an `x` coordinate of 100 tweened from `x` 500 would be set to `x` 500 and then tweened to `x` 100 by giving a properties object of `{ x: 500 }`.
	 * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
	 * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
	 *
	 * @method Phaser.Tween#from
	 * @param {object} properties - An object containing the properties you want to tween., such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
	 * @param {number} [duration=1000] - Duration of this tween in ms. Or if `Tween.frameBased` is true this represents the number of frames that should elapse.
	 * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
	 * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
	 * @param {number} [delay=0] - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
	 * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this individual tween, not any chained tweens.
	 * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
	 * @return {Phaser.Tween} This Tween object.
	 */
	from: function(properties, duration, ease, autoStart, delay, repeat, yoyo) {

		if (duration === undefined) {
			duration = 1000;
		}
		if (ease === undefined || ease === null) {
			ease = Phaser.Easing.Default;
		}
		if (autoStart === undefined) {
			autoStart = false;
		}
		if (delay === undefined) {
			delay = 0;
		}
		if (repeat === undefined) {
			repeat = 0;
		}
		if (yoyo === undefined) {
			yoyo = false;
		}

		if (typeof ease === 'string' && this.manager.easeMap[ease]) {
			ease = this.manager.easeMap[ease];
		}

		if (this.isRunning) {
			console.warn('Phaser.Tween.from cannot be called after Tween.start');
			return this;
		}

		this.timeline.push(new Phaser.TweenData(this).from(properties, duration, ease, delay, repeat, yoyo));

		if (autoStart) {
			this.start();
		}

		return this;

	},

	/**
	 * Starts the tween running. Can also be called by the autoStart parameter of `Tween.to` or `Tween.from`.
	 * This sets the `Tween.isRunning` property to `true` and dispatches a `Tween.onStart` signal.
	 * If the Tween has a delay set then nothing will start tweening until the delay has expired.
	 *
	 * @method Phaser.Tween#start
	 * @param {number} [index=0] - If this Tween contains child tweens you can specify which one to start from. The default is zero, i.e. the first tween created.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	start: function(index) {

		if (index === undefined) {
			index = 0;
		}

		if (this.game === null || this.target === null || this.timeline.length === 0 || this.isRunning) {
			return this;
		}

		//  Populate the tween data
		for (var i = 0; i < this.timeline.length; i++) {
			//  Build our master property list with the starting values
			for (var property in this.timeline[i].vEnd) {
				this.properties[property] = this.target[property] || 0;

				if (!Array.isArray(this.properties[property])) {
					//  Ensures we're using numbers, not strings
					this.properties[property] *= 1.0;
				}
			}
		}

		for (var i = 0; i < this.timeline.length; i++) {
			this.timeline[i].loadValues();
		}

		this.manager.add(this);

		this.isRunning = true;

		if (index < 0 || index > this.timeline.length - 1) {
			index = 0;
		}

		this.current = index;

		this.timeline[this.current].start();

		return this;

	},

	/**
	 * Stops the tween if running and flags it for deletion from the TweenManager.
	 * If called directly the `Tween.onComplete` signal is not dispatched and no chained tweens are started unless the complete parameter is set to `true`.
	 * If you just wish to pause a tween then use Tween.pause instead.
	 *
	 * @method Phaser.Tween#stop
	 * @param {boolean} [complete=false] - Set to `true` to dispatch the Tween.onComplete signal.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	stop: function(complete) {

		if (complete === undefined) {
			complete = false;
		}

		this.isRunning = false;

		this._onUpdateCallback = null;
		this._onUpdateCallbackContext = null;

		if (complete) {
			this.onComplete.dispatch(this.target, this);
			this._hasStarted = false;

			if (this.chainedTween) {
				this.chainedTween.start();
			}
		}

		this.manager.remove(this);

		return this;

	},

	/**
	 * Updates either a single TweenData or all TweenData objects properties to the given value.
	 * Used internally by methods like Tween.delay, Tween.yoyo, etc. but can also be called directly if you know which property you want to tweak.
	 * The property is not checked, so if you pass an invalid one you'll generate a run-time error.
	 *
	 * @method Phaser.Tween#updateTweenData
	 * @param {string} property - The property to update.
	 * @param {number|function} value - The value to set the property to.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the delay on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	updateTweenData: function(property, value, index) {

		if (this.timeline.length === 0) {
			return this;
		}

		if (index === undefined) {
			index = 0;
		}

		if (index === -1) {
			for (var i = 0; i < this.timeline.length; i++) {
				this.timeline[i][property] = value;
			}
		} else {
			this.timeline[index][property] = value;
		}

		return this;

	},

	/**
	 * Sets the delay in milliseconds before this tween will start. If there are child tweens it sets the delay before the first child starts.
	 * The delay is invoked as soon as you call `Tween.start`. If the tween is already running this method doesn't do anything for the current active tween.
	 * If you have not yet called `Tween.to` or `Tween.from` at least once then this method will do nothing, as there are no tweens to delay.
	 * If you have child tweens and pass -1 as the index value it sets the delay across all of them.
	 *
	 * @method Phaser.Tween#delay
	 * @param {number} duration - The amount of time in ms that the Tween should wait until it begins once started is called. Set to zero to remove any active delay.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the delay on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	delay: function(duration, index) {

		return this.updateTweenData('delay', duration, index);

	},

	/**
	 * Sets the number of times this tween will repeat.
	 * If you have not yet called `Tween.to` or `Tween.from` at least once then this method will do nothing, as there are no tweens to repeat.
	 * If you have child tweens and pass -1 as the index value it sets the number of times they'll repeat across all of them.
	 * If you wish to define how many times this Tween and all children will repeat see Tween.repeatAll.
	 *
	 * @method Phaser.Tween#repeat
	 * @param {number} total - How many times a tween should repeat before completing. Set to zero to remove an active repeat. Set to -1 to repeat forever.
	 * @param {number} [repeat=0] - This is the amount of time to pause (in ms) before the repeat will start.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the repeat value on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	repeat: function(total, repeatDelay, index) {

		if (repeatDelay === undefined) {
			repeatDelay = 0;
		}

		this.updateTweenData('repeatCounter', total, index);

		return this.updateTweenData('repeatDelay', repeatDelay, index);

	},

	/**
	 * Sets the delay in milliseconds before this tween will repeat itself.
	 * The repeatDelay is invoked as soon as you call `Tween.start`. If the tween is already running this method doesn't do anything for the current active tween.
	 * If you have not yet called `Tween.to` or `Tween.from` at least once then this method will do nothing, as there are no tweens to set repeatDelay on.
	 * If you have child tweens and pass -1 as the index value it sets the repeatDelay across all of them.
	 *
	 * @method Phaser.Tween#repeatDelay
	 * @param {number} duration - The amount of time in ms that the Tween should wait until it repeats or yoyos once start is called. Set to zero to remove any active repeatDelay.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the repeatDelay on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	repeatDelay: function(duration, index) {

		return this.updateTweenData('repeatDelay', duration, index);

	},

	/**
	 * A Tween that has yoyo set to true will run through from its starting values to its end values and then play back in reverse from end to start.
	 * Used in combination with repeat you can create endless loops.
	 * If you have not yet called `Tween.to` or `Tween.from` at least once then this method will do nothing, as there are no tweens to yoyo.
	 * If you have child tweens and pass -1 as the index value it sets the yoyo property across all of them.
	 * If you wish to yoyo this Tween and all of its children then see Tween.yoyoAll.
	 *
	 * @method Phaser.Tween#yoyo
	 * @param {boolean} enable - Set to true to yoyo this tween, or false to disable an already active yoyo.
	 * @param {number} [yoyoDelay=0] - This is the amount of time to pause (in ms) before the yoyo will start.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set yoyo on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	yoyo: function(enable, yoyoDelay, index) {

		if (yoyoDelay === undefined) {
			yoyoDelay = 0;
		}

		this.updateTweenData('yoyo', enable, index);

		return this.updateTweenData('yoyoDelay', yoyoDelay, index);

	},

	/**
	 * Sets the delay in milliseconds before this tween will run a yoyo (only applies if yoyo is enabled).
	 * The repeatDelay is invoked as soon as you call `Tween.start`. If the tween is already running this method doesn't do anything for the current active tween.
	 * If you have not yet called `Tween.to` or `Tween.from` at least once then this method will do nothing, as there are no tweens to set repeatDelay on.
	 * If you have child tweens and pass -1 as the index value it sets the repeatDelay across all of them.
	 *
	 * @method Phaser.Tween#yoyoDelay
	 * @param {number} duration - The amount of time in ms that the Tween should wait until it repeats or yoyos once start is called. Set to zero to remove any active yoyoDelay.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the yoyoDelay on all the children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	yoyoDelay: function(duration, index) {

		return this.updateTweenData('yoyoDelay', duration, index);

	},

	/**
	 * Set easing function this tween will use, i.e. Phaser.Easing.Linear.None.
	 * The ease function allows you define the rate of change. You can pass either a function such as Phaser.Easing.Circular.Out or a string such as "Circ".
	 * ".easeIn", ".easeOut" and "easeInOut" variants are all supported for all ease types.
	 * If you have child tweens and pass -1 as the index value it sets the easing function defined here across all of them.
	 *
	 * @method Phaser.Tween#easing
	 * @param {function|string} ease - The easing function this tween will use, i.e. Phaser.Easing.Linear.None.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the easing function on all children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	easing: function(ease, index) {

		if (typeof ease === 'string' && this.manager.easeMap[ease]) {
			ease = this.manager.easeMap[ease];
		}

		return this.updateTweenData('easingFunction', ease, index);

	},

	/**
	 * Sets the interpolation function the tween will use. By default it uses Phaser.Math.linearInterpolation.
	 * Also available: Phaser.Math.bezierInterpolation and Phaser.Math.catmullRomInterpolation.
	 * The interpolation function is only used if the target properties is an array.
	 * If you have child tweens and pass -1 as the index value and it will set the interpolation function across all of them.
	 *
	 * @method Phaser.Tween#interpolation
	 * @param {function} interpolation - The interpolation function to use (Phaser.Math.linearInterpolation by default)
	 * @param {object} [context] - The context under which the interpolation function will be run.
	 * @param {number} [index=0] - If this tween has more than one child this allows you to target a specific child. If set to -1 it will set the interpolation function on all children.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	interpolation: function(interpolation, context, index) {

		if (context === undefined) {
			context = Phaser.Math;
		}

		this.updateTweenData('interpolationFunction', interpolation, index);

		return this.updateTweenData('interpolationContext', context, index);

	},

	/**
	 * Set how many times this tween and all of its children will repeat.
	 * A tween (A) with 3 children (B,C,D) with a `repeatAll` value of 2 would play as: ABCDABCD before completing.
	 *
	 * @method Phaser.Tween#repeatAll
	 * @param {number} [total=0] - How many times this tween and all children should repeat before completing. Set to zero to remove an active repeat. Set to -1 to repeat forever.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	repeatAll: function(total) {

		if (total === undefined) {
			total = 0;
		}

		this.repeatCounter = total;

		return this;

	},

	/**
	 * This method allows you to chain tweens together. Any tween chained to this tween will have its `Tween.start` method called
	 * as soon as this tween completes. If this tween never completes (i.e. repeatAll or loop is set) then the chain will never progress.
	 * Note that `Tween.onComplete` will fire when *this* tween completes, not when the whole chain completes.
	 * For that you should listen to `onComplete` on the final tween in your chain.
	 *
	 * If you pass multiple tweens to this method they will be joined into a single long chain.
	 * For example if this is Tween A and you pass in B, C and D then B will be chained to A, C will be chained to B and D will be chained to C.
	 * Any previously chained tweens that may have been set will be overwritten.
	 *
	 * @method Phaser.Tween#chain
	 * @param {...Phaser.Tween} tweens - One or more tweens that will be chained to this one.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	chain: function() {

		var i = arguments.length;

		while (i--) {
			if (i > 0) {
				arguments[i - 1].chainedTween = arguments[i];
			} else {
				this.chainedTween = arguments[i];
			}
		}

		return this;

	},

	/**
	 * Enables the looping of this tween. The tween will loop forever, and onComplete will never fire.
	 *
	 * If `value` is `true` then this is the same as setting `Tween.repeatAll(-1)`.
	 * If `value` is `false` it is the same as setting `Tween.repeatAll(0)` and will reset the `repeatCounter` to zero.
	 *
	 * Usage:
	 * game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Linear.None, true)
	 * .to({ y: 300 }, 1000, Phaser.Easing.Linear.None)
	 * .to({ x: 0 }, 1000, Phaser.Easing.Linear.None)
	 * .to({ y: 0 }, 1000, Phaser.Easing.Linear.None)
	 * .loop();
	 * @method Phaser.Tween#loop
	 * @param {boolean} [value=true] - If `true` this tween will loop once it reaches the end. Set to `false` to remove an active loop.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	loop: function(value) {

		if (value === undefined) {
			value = true;
		}

		this.repeatCounter = (value) ? -1 : 0;

		return this;

	},

	/**
	 * Sets a callback to be fired each time this tween updates.
	 *
	 * @method Phaser.Tween#onUpdateCallback
	 * @param {function} callback - The callback to invoke each time this tween is updated. Set to `null` to remove an already active callback.
	 * @param {object} callbackContext - The context in which to call the onUpdate callback.
	 * @return {Phaser.Tween} This tween. Useful for method chaining.
	 */
	onUpdateCallback: function(callback, callbackContext) {

		this._onUpdateCallback = callback;
		this._onUpdateCallbackContext = callbackContext;

		return this;

	},

	/**
	 * Pauses the tween. Resume playback with Tween.resume.
	 *
	 * @method Phaser.Tween#pause
	 */
	pause: function() {

		this.isPaused = true;

		this._codePaused = true;

		this._pausedTime = this.game.time.time;

	},

	/**
	 * This is called by the core Game loop. Do not call it directly, instead use Tween.pause.
	 *
	 * @private
	 * @method Phaser.Tween#_pause
	 */
	_pause: function() {

		if (!this._codePaused) {
			this.isPaused = true;

			this._pausedTime = this.game.time.time;
		}

	},

	/**
	 * Resumes a paused tween.
	 *
	 * @method Phaser.Tween#resume
	 */
	resume: function() {

		if (this.isPaused) {
			this.isPaused = false;

			this._codePaused = false;

			for (var i = 0; i < this.timeline.length; i++) {
				if (!this.timeline[i].isRunning) {
					this.timeline[i].startTime += (this.game.time.time - this._pausedTime);
				}
			}
		}

	},

	/**
	 * This is called by the core Game loop. Do not call it directly, instead use Tween.pause.
	 * @method Phaser.Tween#_resume
	 * @private
	 */
	_resume: function() {

		if (this._codePaused) {
			return;
		} else {
			this.resume();
		}

	},

	/**
	 * Core tween update function called by the TweenManager. Does not need to be invoked directly.
	 *
	 * @method Phaser.Tween#update
	 * @param {number} time - A timestamp passed in by the TweenManager.
	 * @return {boolean} false if the tween and all child tweens have completed and should be deleted from the manager, otherwise true (still active).
	 */
	update: function(time) {

		if (this.pendingDelete || !this.target) {
			return false;
		}

		if (this.isPaused) {
			return true;
		}

		var status = this.timeline[this.current].update(time);

		if (status === Phaser.TweenData.PENDING) {
			return true;
		} else if (status === Phaser.TweenData.RUNNING) {
			if (!this._hasStarted) {
				this.onStart.dispatch(this.target, this);
				this._hasStarted = true;
			}

			if (this._onUpdateCallback !== null) {
				this._onUpdateCallback.call(this._onUpdateCallbackContext, this, this.timeline[this.current].value, this.timeline[
					this.current]);
			}

			//  In case the update callback modifies this tween
			return this.isRunning;
		} else if (status === Phaser.TweenData.LOOPED) {
			if (this.timeline[this.current].repeatCounter === -1) {
				this.onLoop.dispatch(this.target, this);
			} else {
				this.onRepeat.dispatch(this.target, this);
			}

			return true;
		} else if (status === Phaser.TweenData.COMPLETE) {
			var complete = false;

			//  What now?
			if (this.reverse) {
				this.current--;

				if (this.current < 0) {
					this.current = this.timeline.length - 1;
					complete = true;
				}
			} else {
				this.current++;

				if (this.current === this.timeline.length) {
					this.current = 0;
					complete = true;
				}
			}

			if (complete) {
				//  We've reached the start or end of the child tweens (depending on Tween.reverse), should we repeat it?
				if (this.repeatCounter === -1) {
					this.timeline[this.current].start();
					this.onLoop.dispatch(this.target, this);
					return true;
				} else if (this.repeatCounter > 0) {
					this.repeatCounter--;

					this.timeline[this.current].start();
					this.onRepeat.dispatch(this.target, this);
					return true;
				} else {
					//  No more repeats and no more children, so we're done
					this.isRunning = false;
					this.onComplete.dispatch(this.target, this);
					this._hasStarted = false;

					if (this.chainedTween) {
						this.chainedTween.start();
					}

					return false;
				}
			} else {
				//  We've still got some children to go
				this.onChildComplete.dispatch(this.target, this);
				this.timeline[this.current].start();
				return true;
			}
		}

	},

	/**
	 * This will generate an array populated with the tweened object values from start to end.
	 * It works by running the tween simulation at the given frame rate based on the values set-up in Tween.to and Tween.from.
	 * It ignores delay and repeat counts and any chained tweens, but does include child tweens.
	 * Just one play through of the tween data is returned, including yoyo if set.
	 *
	 * @method Phaser.Tween#generateData
	 * @param {number} [frameRate=60] - The speed in frames per second that the data should be generated at. The higher the value, the larger the array it creates.
	 * @param {array} [data] - If given the generated data will be appended to this array, otherwise a new array will be returned.
	 * @return {array} An array of tweened values.
	 */
	generateData: function(frameRate, data) {

		if (this.game === null || this.target === null) {
			return null;
		}

		if (frameRate === undefined) {
			frameRate = 60;
		}
		if (data === undefined) {
			data = [];
		}

		//  Populate the tween data
		for (var i = 0; i < this.timeline.length; i++) {
			//  Build our master property list with the starting values
			for (var property in this.timeline[i].vEnd) {
				this.properties[property] = this.target[property] || 0;

				if (!Array.isArray(this.properties[property])) {
					//  Ensures we're using numbers, not strings
					this.properties[property] *= 1.0;
				}
			}
		}

		for (var i = 0; i < this.timeline.length; i++) {
			this.timeline[i].loadValues();
		}

		for (var i = 0; i < this.timeline.length; i++) {
			data = data.concat(this.timeline[i].generateData(frameRate));
		}

		return data;

	}

};

/**
 * @name Phaser.Tween#totalDuration
 * @property {Phaser.TweenData} totalDuration - Gets the total duration of this Tween, including all child tweens, in milliseconds.
 */
Object.defineProperty(Phaser.Tween.prototype, 'totalDuration', {

	get: function() {

		var total = 0;

		for (var i = 0; i < this.timeline.length; i++) {
			total += this.timeline[i].duration;
		}

		return total;

	}

});

Phaser.Tween.prototype.constructor = Phaser.Tween;

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A Phaser.Tween contains at least one TweenData object. It contains all of the tween data values, such as the
 * starting and ending values, the ease function, interpolation and duration. The Tween acts as a timeline manager for
 * TweenData objects and can contain multiple TweenData objects.
 *
 * @class Phaser.TweenData
 * @constructor
 * @param {Phaser.Tween} parent - The Tween that owns this TweenData object.
 */
Phaser.TweenData = function(parent) {

	/**
	 * @property {Phaser.Tween} parent - The Tween which owns this TweenData.
	 */
	this.parent = parent;

	/**
	 * @property {Phaser.Game} game - A reference to the currently running Game.
	 */
	this.game = parent.game;

	/**
	 * @property {object} vStart - An object containing the values at the start of the tween.
	 * @private
	 */
	this.vStart = {};

	/**
	 * @property {object} vStartCache - Cached starting values.
	 * @private
	 */
	this.vStartCache = {};

	/**
	 * @property {object} vEnd - An object containing the values at the end of the tween.
	 * @private
	 */
	this.vEnd = {};

	/**
	 * @property {object} vEndCache - Cached ending values.
	 * @private
	 */
	this.vEndCache = {};

	/**
	 * @property {number} duration - The duration of the tween in ms.
	 * @default
	 */
	this.duration = 1000;

	/**
	 * @property {number} percent - A value between 0 and 1 that represents how far through the duration this tween is.
	 * @readonly
	 */
	this.percent = 0;

	/**
	 * @property {number} value - The current calculated value.
	 * @readonly
	 */
	this.value = 0;

	/**
	 * @property {number} repeatCounter - If the Tween is set to repeat this contains the current repeat count.
	 */
	this.repeatCounter = 0;

	/**
	 * @property {number} repeatDelay - The amount of time in ms between repeats of this tween.
	 */
	this.repeatDelay = 0;

	/**
	 * @property {number} repeatTotal - The total number of times this Tween will repeat.
	 * @readonly
	 */
	this.repeatTotal = 0;

	/**
	 * @property {boolean} interpolate - True if the Tween will use interpolation (i.e. is an Array to Array tween)
	 * @default
	 */
	this.interpolate = false;

	/**
	 * @property {boolean} yoyo - True if the Tween is set to yoyo, otherwise false.
	 * @default
	 */
	this.yoyo = false;

	/**
	 * @property {number} yoyoDelay - The amount of time in ms between yoyos of this tween.
	 */
	this.yoyoDelay = 0;

	/**
	 * @property {boolean} inReverse - When a Tween is yoyoing this value holds if it's currently playing forwards (false) or in reverse (true).
	 * @default
	 */
	this.inReverse = false;

	/**
	 * @property {number} delay - The amount to delay by until the Tween starts (in ms). Only applies to the start, use repeatDelay to handle repeats.
	 * @default
	 */
	this.delay = 0;

	/**
	 * @property {number} dt - Current time value.
	 */
	this.dt = 0;

	/**
	 * @property {number} startTime - The time the Tween started or null if it hasn't yet started.
	 */
	this.startTime = null;

	/**
	 * @property {function} easingFunction - The easing function used for the Tween.
	 * @default Phaser.Easing.Default
	 */
	this.easingFunction = Phaser.Easing.Default;

	/**
	 * @property {function} interpolationFunction - The interpolation function used for the Tween.
	 * @default Phaser.Math.linearInterpolation
	 */
	this.interpolationFunction = Phaser.Math.linearInterpolation;

	/**
	 * @property {object} interpolationContext - The interpolation function context used for the Tween.
	 * @default Phaser.Math
	 */
	this.interpolationContext = Phaser.Math;

	/**
	 * @property {boolean} isRunning - If the tween is running this is set to `true`. Unless Phaser.Tween a TweenData that is waiting for a delay to expire is *not* considered as running.
	 * @default
	 */
	this.isRunning = false;

	/**
	 * @property {boolean} isFrom - Is this a from tween or a to tween?
	 * @default
	 */
	this.isFrom = false;

};

/**
 * @constant
 * @type {number}
 */
Phaser.TweenData.PENDING = 0;

/**
 * @constant
 * @type {number}
 */
Phaser.TweenData.RUNNING = 1;

/**
 * @constant
 * @type {number}
 */
Phaser.TweenData.LOOPED = 2;

/**
 * @constant
 * @type {number}
 */
Phaser.TweenData.COMPLETE = 3;

Phaser.TweenData.prototype = {

	/**
	 * Sets this tween to be a `to` tween on the properties given. A `to` tween starts at the current value and tweens to the destination value given.
	 * For example a Sprite with an `x` coordinate of 100 could be tweened to `x` 200 by giving a properties object of `{ x: 200 }`.
	 *
	 * @method Phaser.TweenData#to
	 * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
	 * @param {number} [duration=1000] - Duration of this tween in ms.
	 * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden at will.
	 * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
	 * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This ignores any chained tweens.
	 * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
	 * @return {Phaser.TweenData} This Tween object.
	 */
	to: function(properties, duration, ease, delay, repeat, yoyo) {

		this.vEnd = properties;
		this.duration = duration;
		this.easingFunction = ease;
		this.delay = delay;
		this.repeatTotal = repeat;
		this.yoyo = yoyo;

		this.isFrom = false;

		return this;

	},

	/**
	 * Sets this tween to be a `from` tween on the properties given. A `from` tween sets the target to the destination value and tweens to its current value.
	 * For example a Sprite with an `x` coordinate of 100 tweened from `x` 500 would be set to `x` 500 and then tweened to `x` 100 by giving a properties object of `{ x: 500 }`.
	 *
	 * @method Phaser.TweenData#from
	 * @param {object} properties - The properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
	 * @param {number} [duration=1000] - Duration of this tween in ms.
	 * @param {function} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden at will.
	 * @param {number} [delay=0] - Delay before this tween will start, defaults to 0 (no delay). Value given is in ms.
	 * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This ignores any chained tweens.
	 * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
	 * @return {Phaser.TweenData} This Tween object.
	 */
	from: function(properties, duration, ease, delay, repeat, yoyo) {

		this.vEnd = properties;
		this.duration = duration;
		this.easingFunction = ease;
		this.delay = delay;
		this.repeatTotal = repeat;
		this.yoyo = yoyo;

		this.isFrom = true;

		return this;

	},

	/**
	 * Starts the Tween running.
	 *
	 * @method Phaser.TweenData#start
	 * @return {Phaser.TweenData} This Tween object.
	 */
	start: function() {

		this.startTime = this.game.time.time + this.delay;

		if (this.parent.reverse) {
			this.dt = this.duration;
		} else {
			this.dt = 0;
		}

		if (this.delay > 0) {
			this.isRunning = false;
		} else {
			this.isRunning = true;
		}

		if (this.isFrom) {
			//  Reverse them all and instant set them
			for (var property in this.vStartCache) {
				this.vStart[property] = this.vEndCache[property];
				this.vEnd[property] = this.vStartCache[property];
				this.parent.target[property] = this.vStart[property];
			}
		}

		this.value = 0;
		this.yoyoCounter = 0;
		this.repeatCounter = this.repeatTotal;

		return this;

	},

	/**
	 * Loads the values from the target object into this Tween.
	 *
	 * @private
	 * @method Phaser.TweenData#loadValues
	 * @return {Phaser.TweenData} This Tween object.
	 */
	loadValues: function() {

		for (var property in this.parent.properties) {
			//  Load the property from the parent object
			this.vStart[property] = this.parent.properties[property];

			//  Check if an Array was provided as property value
			if (Array.isArray(this.vEnd[property])) {
				if (this.vEnd[property].length === 0) {
					continue;
				}

				if (this.percent === 0) {
					//  Put the start value at the beginning of the array
					//  but we only want to do this once, if the Tween hasn't run before
					this.vEnd[property] = [this.vStart[property]].concat(this.vEnd[property]);
				}
			}

			if (typeof this.vEnd[property] !== 'undefined') {
				if (typeof this.vEnd[property] === 'string') {
					//  Parses relative end values with start as base (e.g.: +10, -3)
					this.vEnd[property] = this.vStart[property] + parseFloat(this.vEnd[property], 10);
				}

				this.parent.properties[property] = this.vEnd[property];
			} else {
				//  Null tween
				this.vEnd[property] = this.vStart[property];
			}

			this.vStartCache[property] = this.vStart[property];
			this.vEndCache[property] = this.vEnd[property];
		}

		return this;

	},

	/**
	 * Updates this Tween. This is called automatically by Phaser.Tween.
	 *
	 * @protected
	 * @method Phaser.TweenData#update
	 * @param {number} time - A timestamp passed in by the Tween parent.
	 * @return {number} The current status of this Tween. One of the Phaser.TweenData constants: PENDING, RUNNING, LOOPED or COMPLETE.
	 */
	update: function(time) {

		if (!this.isRunning) {
			if (time >= this.startTime) {
				this.isRunning = true;
			} else {
				return Phaser.TweenData.PENDING;
			}
		} else {
			//  Is Running, but is waiting to repeat
			if (time < this.startTime) {
				return Phaser.TweenData.RUNNING;
			}
		}

		var ms = (this.parent.frameBased) ? this.game.time.physicsElapsedMS : this.game.time.elapsedMS;

		if (this.parent.reverse) {
			this.dt -= ms * this.parent.timeScale;
			this.dt = Math.max(this.dt, 0);
		} else {
			this.dt += ms * this.parent.timeScale;
			this.dt = Math.min(this.dt, this.duration);
		}

		this.percent = this.dt / this.duration;

		this.value = this.easingFunction(this.percent);

		for (var property in this.vEnd) {
			var start = this.vStart[property];
			var end = this.vEnd[property];

			if (Array.isArray(end)) {
				this.parent.target[property] = this.interpolationFunction.call(this.interpolationContext, end, this.value);
			} else {
				this.parent.target[property] = start + ((end - start) * this.value);
			}
		}

		if ((!this.parent.reverse && this.percent === 1) || (this.parent.reverse && this.percent === 0)) {
			return this.repeat();
		}

		return Phaser.TweenData.RUNNING;

	},

	/**
	 * This will generate an array populated with the tweened object values from start to end.
	 * It works by running the tween simulation at the given frame rate based on the values set-up in Tween.to and Tween.from.
	 * Just one play through of the tween data is returned, including yoyo if set.
	 *
	 * @method Phaser.TweenData#generateData
	 * @param {number} [frameRate=60] - The speed in frames per second that the data should be generated at. The higher the value, the larger the array it creates.
	 * @return {array} An array of tweened values.
	 */
	generateData: function(frameRate) {

		if (this.parent.reverse) {
			this.dt = this.duration;
		} else {
			this.dt = 0;
		}

		var data = [];
		var complete = false;
		var fps = (1 / frameRate) * 1000;

		do {
			if (this.parent.reverse) {
				this.dt -= fps;
				this.dt = Math.max(this.dt, 0);
			} else {
				this.dt += fps;
				this.dt = Math.min(this.dt, this.duration);
			}

			this.percent = this.dt / this.duration;

			this.value = this.easingFunction(this.percent);

			var blob = {};

			for (var property in this.vEnd) {
				var start = this.vStart[property];
				var end = this.vEnd[property];

				if (Array.isArray(end)) {
					blob[property] = this.interpolationFunction(end, this.value);
				} else {
					blob[property] = start + ((end - start) * this.value);
				}
			}

			data.push(blob);

			if ((!this.parent.reverse && this.percent === 1) || (this.parent.reverse && this.percent === 0)) {
				complete = true;
			}

		} while (!complete);

		if (this.yoyo) {
			var reversed = data.slice();
			reversed.reverse();
			data = data.concat(reversed);
		}

		return data;

	},

	/**
	 * Checks if this Tween is meant to repeat or yoyo and handles doing so.
	 *
	 * @private
	 * @method Phaser.TweenData#repeat
	 * @return {number} Either Phaser.TweenData.LOOPED or Phaser.TweenData.COMPLETE.
	 */
	repeat: function() {

		//  If not a yoyo and repeatCounter = 0 then we're done
		if (this.yoyo) {
			//  We're already in reverse mode, which means the yoyo has finished and there's no repeats, so end
			if (this.inReverse && this.repeatCounter === 0) {
				//  Restore the properties
				for (var property in this.vStartCache) {
					this.vStart[property] = this.vStartCache[property];
					this.vEnd[property] = this.vEndCache[property];
				}

				this.inReverse = false;

				return Phaser.TweenData.COMPLETE;
			}

			this.inReverse = !this.inReverse;
		} else {
			if (this.repeatCounter === 0) {
				return Phaser.TweenData.COMPLETE;
			}
		}

		if (this.inReverse) {
			//  If inReverse we're going from vEnd to vStartCache
			for (var property in this.vStartCache) {
				this.vStart[property] = this.vEndCache[property];
				this.vEnd[property] = this.vStartCache[property];
			}
		} else {
			//  If not inReverse we're just repopulating the cache again
			for (var property in this.vStartCache) {
				this.vStart[property] = this.vStartCache[property];
				this.vEnd[property] = this.vEndCache[property];
			}

			//  -1 means repeat forever, otherwise decrement the repeatCounter
			//  We only decrement this counter if the tween isn't doing a yoyo, as that doesn't count towards the repeat total
			if (this.repeatCounter > 0) {
				this.repeatCounter--;
			}
		}

		this.startTime = this.game.time.time;

		if (this.yoyo && this.inReverse) {
			this.startTime += this.yoyoDelay;
		} else if (!this.inReverse) {
			this.startTime += this.repeatDelay;
		}

		if (this.parent.reverse) {
			this.dt = this.duration;
		} else {
			this.dt = 0;
		}

		return Phaser.TweenData.LOOPED;

	}

};

Phaser.TweenData.prototype.constructor = Phaser.TweenData;

/* jshint curly: false */

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * A collection of easing methods defining ease-in and ease-out curves.
 *
 * @class Phaser.Easing
 */
Phaser.Easing = {

	/**
	 * Linear easing.
	 *
	 * @class Phaser.Easing.Linear
	 */
	Linear: {

		/**
		 * Linear Easing (no variation).
		 *
		 * @method Phaser.Easing.Linear#None
		 * @param {number} k - The value to be tweened.
		 * @returns {number} k.
		 */
		None: function(k) {

			return k;

		}

	},

	/**
	 * Quadratic easing.
	 *
	 * @class Phaser.Easing.Quadratic
	 */
	Quadratic: {

		/**
		 * Ease-in.
		 *
		 * @method Phaser.Easing.Quadratic#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} k^2.
		 */
		In: function(k) {

			return k * k;

		},

		/**
		 * Ease-out.
		 *
		 * @method Phaser.Easing.Quadratic#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} k* (2-k).
		 */
		Out: function(k) {

			return k * (2 - k);

		},

		/**
		 * Ease-in/out.
		 *
		 * @method Phaser.Easing.Quadratic#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if ((k *= 2) < 1) return 0.5 * k * k;
			return -0.5 * (--k * (k - 2) - 1);

		}

	},

	/**
	 * Cubic easing.
	 *
	 * @class Phaser.Easing.Cubic
	 */
	Cubic: {

		/**
		 * Cubic ease-in.
		 *
		 * @method Phaser.Easing.Cubic#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return k * k * k;

		},

		/**
		 * Cubic ease-out.
		 *
		 * @method Phaser.Easing.Cubic#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			return --k * k * k + 1;

		},

		/**
		 * Cubic ease-in/out.
		 *
		 * @method Phaser.Easing.Cubic#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k;
			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	/**
	 * Quartic easing.
	 *
	 * @class Phaser.Easing.Quartic
	 */
	Quartic: {

		/**
		 * Quartic ease-in.
		 *
		 * @method Phaser.Easing.Quartic#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return k * k * k * k;

		},

		/**
		 * Quartic ease-out.
		 *
		 * @method Phaser.Easing.Quartic#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			return 1 - (--k * k * k * k);

		},

		/**
		 * Quartic ease-in/out.
		 *
		 * @method Phaser.Easing.Quartic#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k * k;
			return -0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	/**
	 * Quintic easing.
	 *
	 * @class Phaser.Easing.Quintic
	 */
	Quintic: {

		/**
		 * Quintic ease-in.
		 *
		 * @method Phaser.Easing.Quintic#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return k * k * k * k * k;

		},

		/**
		 * Quintic ease-out.
		 *
		 * @method Phaser.Easing.Quintic#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			return --k * k * k * k * k + 1;

		},

		/**
		 * Quintic ease-in/out.
		 *
		 * @method Phaser.Easing.Quintic#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	/**
	 * Sinusoidal easing.
	 *
	 * @class Phaser.Easing.Sinusoidal
	 */
	Sinusoidal: {

		/**
		 * Sinusoidal ease-in.
		 *
		 * @method Phaser.Easing.Sinusoidal#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			if (k === 0) return 0;
			if (k === 1) return 1;
			return 1 - Math.cos(k * Math.PI / 2);

		},

		/**
		 * Sinusoidal ease-out.
		 *
		 * @method Phaser.Easing.Sinusoidal#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			if (k === 0) return 0;
			if (k === 1) return 1;
			return Math.sin(k * Math.PI / 2);

		},

		/**
		 * Sinusoidal ease-in/out.
		 *
		 * @method Phaser.Easing.Sinusoidal#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if (k === 0) return 0;
			if (k === 1) return 1;
			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	/**
	 * Exponential easing.
	 *
	 * @class Phaser.Easing.Exponential
	 */
	Exponential: {

		/**
		 * Exponential ease-in.
		 *
		 * @method Phaser.Easing.Exponential#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		/**
		 * Exponential ease-out.
		 *
		 * @method Phaser.Easing.Exponential#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

		},

		/**
		 * Exponential ease-in/out.
		 *
		 * @method Phaser.Easing.Exponential#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if (k === 0) return 0;
			if (k === 1) return 1;
			if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);

		}

	},

	/**
	 * Circular easing.
	 *
	 * @class Phaser.Easing.Circular
	 */
	Circular: {

		/**
		 * Circular ease-in.
		 *
		 * @method Phaser.Easing.Circular#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		/**
		 * Circular ease-out.
		 *
		 * @method Phaser.Easing.Circular#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			return Math.sqrt(1 - (--k * k));

		},

		/**
		 * Circular ease-in/out.
		 *
		 * @method Phaser.Easing.Circular#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	/**
	 * Elastic easing.
	 *
	 * @class Phaser.Easing.Elastic
	 */
	Elastic: {

		/**
		 * Elastic ease-in.
		 *
		 * @method Phaser.Easing.Elastic#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			var s, a = 0.1,
				p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		/**
		 * Elastic ease-out.
		 *
		 * @method Phaser.Easing.Elastic#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			var s, a = 0.1,
				p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		/**
		 * Elastic ease-in/out.
		 *
		 * @method Phaser.Easing.Elastic#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			var s, a = 0.1,
				p = 0.4;
			if (k === 0) return 0;
			if (k === 1) return 1;
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else s = p * Math.asin(1 / a) / (2 * Math.PI);
			if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	/**
	 * Back easing.
	 *
	 * @class Phaser.Easing.Back
	 */
	Back: {

		/**
		 * Back ease-in.
		 *
		 * @method Phaser.Easing.Back#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			var s = 1.70158;
			return k * k * ((s + 1) * k - s);

		},

		/**
		 * Back ease-out.
		 *
		 * @method Phaser.Easing.Back#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;

		},

		/**
		 * Back ease-in/out.
		 *
		 * @method Phaser.Easing.Back#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	/**
	 * Bounce easing.
	 *
	 * @class Phaser.Easing.Bounce
	 */
	Bounce: {

		/**
		 * Bounce ease-in.
		 *
		 * @method Phaser.Easing.Bounce#In
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		In: function(k) {

			return 1 - Phaser.Easing.Bounce.Out(1 - k);

		},

		/**
		 * Bounce ease-out.
		 *
		 * @method Phaser.Easing.Bounce#Out
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		Out: function(k) {

			if (k < (1 / 2.75)) {

				return 7.5625 * k * k;

			} else if (k < (2 / 2.75)) {

				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;

			} else if (k < (2.5 / 2.75)) {

				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;

			} else {

				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;

			}

		},

		/**
		 * Bounce ease-in/out.
		 *
		 * @method Phaser.Easing.Bounce#InOut
		 * @param {number} k - The value to be tweened.
		 * @returns {number} The tweened value.
		 */
		InOut: function(k) {

			if (k < 0.5) return Phaser.Easing.Bounce.In(k * 2) * 0.5;
			return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

Phaser.Easing.Default = Phaser.Easing.Linear.None;
Phaser.Easing.Power0 = Phaser.Easing.Linear.None;
Phaser.Easing.Power1 = Phaser.Easing.Quadratic.Out;
Phaser.Easing.Power2 = Phaser.Easing.Cubic.Out;
Phaser.Easing.Power3 = Phaser.Easing.Quartic.Out;
Phaser.Easing.Power4 = Phaser.Easing.Quintic.Out;

/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Phaser.Game has a single instance of the TweenManager through which all Tween objects are created and updated.
 * Tweens are hooked into the game clock and pause system, adjusting based on the game state.
 *
 * TweenManager is based heavily on tween.js by http://soledadpenades.com.
 * The difference being that tweens belong to a games instance of TweenManager, rather than to a global TWEEN object.
 * It also has callbacks swapped for Signals and a few issues patched with regard to properties and completion errors.
 * Please see https://github.com/sole/tween.js for a full list of contributors.
 * 
 * @class Phaser.TweenManager
 * @constructor
 * @param {Phaser.Game} game - A reference to the currently running game.
 */
Phaser.TweenManager = function(game) {

	/**
	 * @property {Phaser.Game} game - Local reference to game.
	 */
	this.game = game;

	/**
	 * Are all newly created Tweens frame or time based? A frame based tween will use the physics elapsed timer when updating. This means
	 * it will retain the same consistent frame rate, regardless of the speed of the device. The duration value given should
	 * be given in frames.
	 * 
	 * If the Tween uses a time based update (which is the default) then the duration is given in milliseconds.
	 * In this situation a 2000ms tween will last exactly 2 seconds, regardless of the device and how many visual updates the tween
	 * has actually been through. For very short tweens you may wish to experiment with a frame based update instead.
	 * @property {boolean} frameBased
	 * @default
	 */
	this.frameBased = false;

	/**
	 * @property {array<Phaser.Tween>} _tweens - All of the currently running tweens.
	 * @private
	 */
	this._tweens = [];

	/**
	 * @property {array<Phaser.Tween>} _add - All of the tweens queued to be added in the next update.
	 * @private
	 */
	this._add = [];

	this.easeMap = {

		"Power0": Phaser.Easing.Power0,
		"Power1": Phaser.Easing.Power1,
		"Power2": Phaser.Easing.Power2,
		"Power3": Phaser.Easing.Power3,
		"Power4": Phaser.Easing.Power4,

		"Linear": Phaser.Easing.Linear.None,
		"Quad": Phaser.Easing.Quadratic.Out,
		"Cubic": Phaser.Easing.Cubic.Out,
		"Quart": Phaser.Easing.Quartic.Out,
		"Quint": Phaser.Easing.Quintic.Out,
		"Sine": Phaser.Easing.Sinusoidal.Out,
		"Expo": Phaser.Easing.Exponential.Out,
		"Circ": Phaser.Easing.Circular.Out,
		"Elastic": Phaser.Easing.Elastic.Out,
		"Back": Phaser.Easing.Back.Out,
		"Bounce": Phaser.Easing.Bounce.Out,

		"Quad.easeIn": Phaser.Easing.Quadratic.In,
		"Cubic.easeIn": Phaser.Easing.Cubic.In,
		"Quart.easeIn": Phaser.Easing.Quartic.In,
		"Quint.easeIn": Phaser.Easing.Quintic.In,
		"Sine.easeIn": Phaser.Easing.Sinusoidal.In,
		"Expo.easeIn": Phaser.Easing.Exponential.In,
		"Circ.easeIn": Phaser.Easing.Circular.In,
		"Elastic.easeIn": Phaser.Easing.Elastic.In,
		"Back.easeIn": Phaser.Easing.Back.In,
		"Bounce.easeIn": Phaser.Easing.Bounce.In,

		"Quad.easeOut": Phaser.Easing.Quadratic.Out,
		"Cubic.easeOut": Phaser.Easing.Cubic.Out,
		"Quart.easeOut": Phaser.Easing.Quartic.Out,
		"Quint.easeOut": Phaser.Easing.Quintic.Out,
		"Sine.easeOut": Phaser.Easing.Sinusoidal.Out,
		"Expo.easeOut": Phaser.Easing.Exponential.Out,
		"Circ.easeOut": Phaser.Easing.Circular.Out,
		"Elastic.easeOut": Phaser.Easing.Elastic.Out,
		"Back.easeOut": Phaser.Easing.Back.Out,
		"Bounce.easeOut": Phaser.Easing.Bounce.Out,

		"Quad.easeInOut": Phaser.Easing.Quadratic.InOut,
		"Cubic.easeInOut": Phaser.Easing.Cubic.InOut,
		"Quart.easeInOut": Phaser.Easing.Quartic.InOut,
		"Quint.easeInOut": Phaser.Easing.Quintic.InOut,
		"Sine.easeInOut": Phaser.Easing.Sinusoidal.InOut,
		"Expo.easeInOut": Phaser.Easing.Exponential.InOut,
		"Circ.easeInOut": Phaser.Easing.Circular.InOut,
		"Elastic.easeInOut": Phaser.Easing.Elastic.InOut,
		"Back.easeInOut": Phaser.Easing.Back.InOut,
		"Bounce.easeInOut": Phaser.Easing.Bounce.InOut

	};

	this.game.onPause.add(this._pauseAll, this);
	this.game.onResume.add(this._resumeAll, this);

};

Phaser.TweenManager.prototype = {

	/**
	 * Get all the tween objects in an array.
	 * @method Phaser.TweenManager#getAll
	 * @returns {Phaser.Tween[]} Array with all tween objects.
	 */
	getAll: function() {

		return this._tweens;

	},

	/**
	 * Remove all tweens running and in the queue. Doesn't call any of the tween onComplete events.
	 * @method Phaser.TweenManager#removeAll
	 */
	removeAll: function() {

		for (var i = 0; i < this._tweens.length; i++) {
			this._tweens[i].pendingDelete = true;
		}

		this._add = [];

	},

	/**
	 * Remove all tweens from a specific object, array of objects or Group.
	 * 
	 * @method Phaser.TweenManager#removeFrom
	 * @param {object|object[]|Phaser.Group} obj - The object you want to remove the tweens from.
	 * @param {boolean} [children=true] - If passing a group, setting this to true will remove the tweens from all of its children instead of the group itself.
	 */
	removeFrom: function(obj, children) {

		if (children === undefined) {
			children = true;
		}

		var i;
		var len;

		if (Array.isArray(obj)) {
			for (i = 0, len = obj.length; i < len; i++) {
				this.removeFrom(obj[i]);
			}
		} else if (obj.type === Phaser.GROUP && children) {
			for (var i = 0, len = obj.children.length; i < len; i++) {
				this.removeFrom(obj.children[i]);
			}
		} else {
			for (i = 0, len = this._tweens.length; i < len; i++) {
				if (obj === this._tweens[i].target) {
					this.remove(this._tweens[i]);
				}
			}

			for (i = 0, len = this._add.length; i < len; i++) {
				if (obj === this._add[i].target) {
					this.remove(this._add[i]);
				}
			}
		}

	},

	/**
	 * Add a new tween into the TweenManager.
	 *
	 * @method Phaser.TweenManager#add
	 * @param {Phaser.Tween} tween - The tween object you want to add.
	 * @returns {Phaser.Tween} The tween object you added to the manager.
	 */
	add: function(tween) {

		tween._manager = this;
		this._add.push(tween);

	},

	/**
	 * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
	 *
	 * @method Phaser.TweenManager#create
	 * @param {object} object - Object the tween will be run on.
	 * @returns {Phaser.Tween} The newly created tween object.
	 */
	create: function(object) {

		return new Phaser.Tween(object, this.game, this);

	},

	/**
	 * Remove a tween from this manager.
	 *
	 * @method Phaser.TweenManager#remove
	 * @param {Phaser.Tween} tween - The tween object you want to remove.
	 */
	remove: function(tween) {

		var i = this._tweens.indexOf(tween);

		if (i !== -1) {
			this._tweens[i].pendingDelete = true;
		} else {
			i = this._add.indexOf(tween);

			if (i !== -1) {
				this._add[i].pendingDelete = true;
			}
		}

	},

	/**
	 * Update all the tween objects you added to this manager.
	 *
	 * @method Phaser.TweenManager#update
	 * @returns {boolean} Return false if there's no tween to update, otherwise return true.
	 */
	update: function() {

		var addTweens = this._add.length;
		var numTweens = this._tweens.length;

		if (numTweens === 0 && addTweens === 0) {
			return false;
		}

		var i = 0;

		while (i < numTweens) {
			if (this._tweens[i].update(this.game.time.time)) {
				i++;
			} else {
				this._tweens.splice(i, 1);

				numTweens--;
			}
		}

		//  If there are any new tweens to be added, do so now - otherwise they can be spliced out of the array before ever running
		if (addTweens > 0) {
			this._tweens = this._tweens.concat(this._add);
			this._add.length = 0;
		}

		return true;

	},

	/**
	 * Checks to see if a particular Sprite is currently being tweened.
	 *
	 * @method Phaser.TweenManager#isTweening
	 * @param {object} object - The object to check for tweens against.
	 * @returns {boolean} Returns true if the object is currently being tweened, false if not.
	 */
	isTweening: function(object) {

		return this._tweens.some(function(tween) {
			return tween.target === object;
		});

	},

	/**
	 * Private. Called by game focus loss. Pauses all currently running tweens.
	 *
	 * @method Phaser.TweenManager#_pauseAll
	 * @private
	 */
	_pauseAll: function() {

		for (var i = this._tweens.length - 1; i >= 0; i--) {
			this._tweens[i]._pause();
		}

	},

	/**
	 * Private. Called by game focus loss. Resumes all currently paused tweens.
	 *
	 * @method Phaser.TweenManager#_resumeAll
	 * @private
	 */
	_resumeAll: function() {

		for (var i = this._tweens.length - 1; i >= 0; i--) {
			this._tweens[i]._resume();
		}

	},

	/**
	 * Pauses all currently running tweens.
	 *
	 * @method Phaser.TweenManager#pauseAll
	 */
	pauseAll: function() {

		for (var i = this._tweens.length - 1; i >= 0; i--) {
			this._tweens[i].pause();
		}

	},

	/**
	 * Resumes all currently paused tweens.
	 *
	 * @method Phaser.TweenManager#resumeAll
	 */
	resumeAll: function() {

		for (var i = this._tweens.length - 1; i >= 0; i--) {
			this._tweens[i].resume(true);
		}

	}

};

Phaser.TweenManager.prototype.constructor = Phaser.TweenManager;
/* 补间动画结束 */

/* 设备 */
Phaser.Device = function() {
	/**
	 * The time the device became ready.
	 * @property {integer} deviceReadyAt
	 * @protected
	 */
	this.deviceReadyAt = 0;

	/**
	 * The time as which initialization has completed.
	 * @property {boolean} initialized
	 * @protected
	 */
	this.initialized = false;

	//  Browser / Host / Operating System

	/**
	 * @property {boolean} desktop - Is running on a desktop?
	 * @default
	 */
	this.desktop = false;

	/**
	 * @property {boolean} iOS - Is running on iOS?
	 * @default
	 */
	this.iOS = false;

	/**
	 * @property {number} iOSVersion - If running in iOS this will contain the major version number.
	 * @default
	 */
	this.iOSVersion = 0;

	/**
	 * @property {boolean} cocoonJS - Is the game running under CocoonJS?
	 * @default
	 */
	this.cocoonJS = false;

	/**
	 * @property {boolean} cocoonJSApp - Is this game running with CocoonJS.App?
	 * @default
	 */
	this.cocoonJSApp = false;

	/**
	 * @property {boolean} cordova - Is the game running under Apache Cordova?
	 * @default
	 */
	this.cordova = false;

	/**
	 * @property {boolean} node - Is the game running under Node.js?
	 * @default
	 */
	this.node = false;

	/**
	 * @property {boolean} nodeWebkit - Is the game running under Node-Webkit?
	 * @default
	 */
	this.nodeWebkit = false;

	/**
	 * @property {boolean} electron - Is the game running under GitHub Electron?
	 * @default
	 */
	this.electron = false;

	/**
	 * @property {boolean} ejecta - Is the game running under Ejecta?
	 * @default
	 */
	this.ejecta = false;

	/**
	 * @property {boolean} crosswalk - Is the game running under the Intel Crosswalk XDK?
	 * @default
	 */
	this.crosswalk = false;

	/**
	 * @property {boolean} android - Is running on android?
	 * @default
	 */
	this.android = false;

	/**
	 * @property {boolean} chromeOS - Is running on chromeOS?
	 * @default
	 */
	this.chromeOS = false;

	/**
	 * @property {boolean} linux - Is running on linux?
	 * @default
	 */
	this.linux = false;

	/**
	 * @property {boolean} macOS - Is running on macOS?
	 * @default
	 */
	this.macOS = false;

	/**
	 * @property {boolean} windows - Is running on windows?
	 * @default
	 */
	this.windows = false;

	/**
	 * @property {boolean} windowsPhone - Is running on a Windows Phone?
	 * @default
	 */
	this.windowsPhone = false;

	//  Features

	/**
	 * @property {boolean} canvas - Is canvas available?
	 * @default
	 */
	this.canvas = false;

	/**
	 * @property {?boolean} canvasBitBltShift - True if canvas supports a 'copy' bitblt onto itself when the source and destination regions overlap.
	 * @default
	 */
	this.canvasBitBltShift = null;

	/**
	 * @property {boolean} webGL - Is webGL available?
	 * @default
	 */
	this.webGL = false;

	/**
	 * @property {boolean} file - Is file available?
	 * @default
	 */
	this.file = false;

	/**
	 * @property {boolean} fileSystem - Is fileSystem available?
	 * @default
	 */
	this.fileSystem = false;

	/**
	 * @property {boolean} localStorage - Is localStorage available?
	 * @default
	 */
	this.localStorage = false;

	/**
	 * @property {boolean} worker - Is worker available?
	 * @default
	 */
	this.worker = false;

	/**
	 * @property {boolean} css3D - Is css3D available?
	 * @default
	 */
	this.css3D = false;

	/**
	 * @property {boolean} pointerLock - Is Pointer Lock available?
	 * @default
	 */
	this.pointerLock = false;

	/**
	 * @property {boolean} typedArray - Does the browser support TypedArrays?
	 * @default
	 */
	this.typedArray = false;

	/**
	 * @property {boolean} vibration - Does the device support the Vibration API?
	 * @default
	 */
	this.vibration = false;

	/**
	 * @property {boolean} getUserMedia - Does the device support the getUserMedia API?
	 * @default
	 */
	this.getUserMedia = true;

	/**
	 * @property {boolean} quirksMode - Is the browser running in strict mode (false) or quirks mode? (true)
	 * @default
	 */
	this.quirksMode = false;

	//  Input

	/**
	 * @property {boolean} touch - Is touch available?
	 * @default
	 */
	this.touch = false;

	/**
	 * @property {boolean} mspointer - Is mspointer available?
	 * @default
	 */
	this.mspointer = false;

	/**
	 * @property {?string} wheelType - The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
	 * @default
	 * @protected
	 */
	this.wheelEvent = null;

	//  Browser

	/**
	 * @property {boolean} arora - Set to true if running in Arora.
	 * @default
	 */
	this.arora = false;

	/**
	 * @property {boolean} chrome - Set to true if running in Chrome.
	 * @default
	 */
	this.chrome = false;

	/**
	 * @property {number} chromeVersion - If running in Chrome this will contain the major version number.
	 * @default
	 */
	this.chromeVersion = 0;

	/**
	 * @property {boolean} epiphany - Set to true if running in Epiphany.
	 * @default
	 */
	this.epiphany = false;

	/**
	 * @property {boolean} firefox - Set to true if running in Firefox.
	 * @default
	 */
	this.firefox = false;

	/**
	 * @property {number} firefoxVersion - If running in Firefox this will contain the major version number.
	 * @default
	 */
	this.firefoxVersion = 0;

	/**
	 * @property {boolean} ie - Set to true if running in Internet Explorer.
	 * @default
	 */
	this.ie = false;

	/**
	 * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Device.trident and Device.tridentVersion.
	 * @default
	 */
	this.ieVersion = 0;

	/**
	 * @property {boolean} trident - Set to true if running a Trident version of Internet Explorer (IE11+)
	 * @default
	 */
	this.trident = false;

	/**
	 * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See {@link http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx}
	 * @default
	 */
	this.tridentVersion = 0;

	/**
	 * @property {boolean} edge - Set to true if running in Microsoft Edge browser.
	 * @default
	 */
	this.edge = false;

	/**
	 * @property {boolean} mobileSafari - Set to true if running in Mobile Safari.
	 * @default
	 */
	this.mobileSafari = false;

	/**
	 * @property {boolean} midori - Set to true if running in Midori.
	 * @default
	 */
	this.midori = false;

	/**
	 * @property {boolean} opera - Set to true if running in Opera.
	 * @default
	 */
	this.opera = false;

	/**
	 * @property {boolean} safari - Set to true if running in Safari.
	 * @default
	 */
	this.safari = false;

	/**
	 * @property {number} safariVersion - If running in Safari this will contain the major version number.
	 * @default
	 */
	this.safariVersion = 0;

	/**
	 * @property {boolean} webApp - Set to true if running as a WebApp, i.e. within a WebView
	 * @default
	 */
	this.webApp = false;

	/**
	 * @property {boolean} silk - Set to true if running in the Silk browser (as used on the Amazon Kindle)
	 * @default
	 */
	this.silk = false;

	//  Audio

	/**
	 * @property {boolean} audioData - Are Audio tags available?
	 * @default
	 */
	this.audioData = false;

	/**
	 * @property {boolean} webAudio - Is the WebAudio API available?
	 * @default
	 */
	this.webAudio = false;

	/**
	 * @property {boolean} ogg - Can this device play ogg files?
	 * @default
	 */
	this.ogg = false;

	/**
	 * @property {boolean} opus - Can this device play opus files?
	 * @default
	 */
	this.opus = false;

	/**
	 * @property {boolean} mp3 - Can this device play mp3 files?
	 * @default
	 */
	this.mp3 = false;

	/**
	 * @property {boolean} wav - Can this device play wav files?
	 * @default
	 */
	this.wav = false;

	/**
	 * Can this device play m4a files?
	 * @property {boolean} m4a - True if this device can play m4a files.
	 * @default
	 */
	this.m4a = false;

	/**
	 * @property {boolean} webm - Can this device play webm files?
	 * @default
	 */
	this.webm = false;

	/**
	 * @property {boolean} dolby - Can this device play EC-3 Dolby Digital Plus files?
	 * @default
	 */
	this.dolby = false;

	//  Video

	/**
	 * @property {boolean} oggVideo - Can this device play ogg video files?
	 * @default
	 */
	this.oggVideo = false;

	/**
	 * @property {boolean} h264Video - Can this device play h264 mp4 video files?
	 * @default
	 */
	this.h264Video = false;

	/**
	 * @property {boolean} mp4Video - Can this device play h264 mp4 video files?
	 * @default
	 */
	this.mp4Video = false;

	/**
	 * @property {boolean} webmVideo - Can this device play webm video files?
	 * @default
	 */
	this.webmVideo = false;

	/**
	 * @property {boolean} vp9Video - Can this device play vp9 video files?
	 * @default
	 */
	this.vp9Video = false;

	/**
	 * @property {boolean} hlsVideo - Can this device play hls video files?
	 * @default
	 */
	this.hlsVideo = false;

	//  Device

	/**
	 * @property {boolean} iPhone - Is running on iPhone?
	 * @default
	 */
	this.iPhone = false;

	/**
	 * @property {boolean} iPhone4 - Is running on iPhone4?
	 * @default
	 */
	this.iPhone4 = false;

	/**
	 * @property {boolean} iPad - Is running on iPad?
	 * @default
	 */
	this.iPad = false;

	// Device features

	/**
	 * @property {number} pixelRatio - PixelRatio of the host device?
	 * @default
	 */
	this.pixelRatio = 0;

	/**
	 * @property {boolean} littleEndian - Is the device big or little endian? (only detected if the browser supports TypedArrays)
	 * @default
	 */
	this.littleEndian = false;

	/**
	 * @property {boolean} LITTLE_ENDIAN - Same value as `littleEndian`.
	 * @default
	 */
	this.LITTLE_ENDIAN = false;

	/**
	 * @property {boolean} support32bit - Does the device context support 32bit pixel manipulation using array buffer views?
	 * @default
	 */
	this.support32bit = false;

	/**
	 * @property {boolean} fullscreen - Does the browser support the Full Screen API?
	 * @default
	 */
	this.fullscreen = false;

	/**
	 * @property {string} requestFullscreen - If the browser supports the Full Screen API this holds the call you need to use to activate it.
	 * @default
	 */
	this.requestFullscreen = '';

	/**
	 * @property {string} cancelFullscreen - If the browser supports the Full Screen API this holds the call you need to use to cancel it.
	 * @default
	 */
	this.cancelFullscreen = '';

	/**
	 * @property {boolean} fullscreenKeyboard - Does the browser support access to the Keyboard during Full Screen mode?
	 * @default
	 */
	this.fullscreenKeyboard = false;

	this._initialize();

}

Phaser.Device.prototype._initialize = function() {

	var device = this;

	/**
	 * Check which OS is game running on.
	 */
	function _checkOS() {

		var ua = navigator.userAgent;

		if (/Playstation Vita/.test(ua)) {
			device.vita = true;
		} else if (/Kindle/.test(ua) || /\bKF[A-Z][A-Z]+/.test(ua) || /Silk.*Mobile Safari/.test(ua)) {
			device.kindle = true;
			// This will NOT detect early generations of Kindle Fire, I think there is no reliable way...
			// E.g. "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
		} else if (/Android/.test(ua)) {
			device.android = true;
		} else if (/CrOS/.test(ua)) {
			device.chromeOS = true;
		} else if (/iP[ao]d|iPhone/i.test(ua)) {
			device.iOS = true;
			(navigator.appVersion).match(/OS (\d+)/);
			device.iOSVersion = parseInt(RegExp.$1, 10);
		} else if (/Linux/.test(ua)) {
			device.linux = true;
		} else if (/Mac OS/.test(ua)) {
			device.macOS = true;
		} else if (/Windows/.test(ua)) {
			device.windows = true;
		}

		if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
			device.android = false;
			device.iOS = false;
			device.macOS = false;
			device.windows = true;
			device.windowsPhone = true;
		}

		var silk = /Silk/.test(ua); // detected in browsers

		if (device.windows || device.macOS || (device.linux && !silk) || device.chromeOS) {
			device.desktop = true;
		}

		//  Windows Phone / Table reset
		if (device.windowsPhone || ((/Windows NT/i.test(ua)) && (/Touch/i.test(ua)))) {
			device.desktop = false;
		}

	}





	/**
	 * Checks for support of the Full Screen API.
	 */
	function _checkFullScreenSupport() {

		var fs = [
			'requestFullscreen',
			'requestFullScreen',
			'webkitRequestFullscreen',
			'webkitRequestFullScreen',
			'msRequestFullscreen',
			'msRequestFullScreen',
			'mozRequestFullScreen',
			'mozRequestFullscreen'
		];

		var element = document.createElement('div');

		for (var i = 0; i < fs.length; i++) {
			if (element[fs[i]]) {
				device.fullscreen = true;
				device.requestFullscreen = fs[i];
				break;
			}
		}

		var cfs = [
			'cancelFullScreen',
			'exitFullscreen',
			'webkitCancelFullScreen',
			'webkitExitFullscreen',
			'msCancelFullScreen',
			'msExitFullscreen',
			'mozCancelFullScreen',
			'mozExitFullscreen'
		];

		if (device.fullscreen) {
			for (var i = 0; i < cfs.length; i++) {
				if (document[cfs[i]]) {
					device.cancelFullscreen = cfs[i];
					break;
				}
			}
		}

		//  Keyboard Input?
		if (window['Element'] && Element['ALLOW_KEYBOARD_INPUT']) {
			device.fullscreenKeyboard = true;
		}

	}

	/**
	 * Check what browser is game running in.
	 */
	function _checkBrowser() {

		var ua = navigator.userAgent;

		if (/Arora/.test(ua)) {
			device.arora = true;
		} else if (/Edge\/\d+/.test(ua)) {
			device.edge = true;
		} else if (/Chrome\/(\d+)/.test(ua) && !device.windowsPhone) {
			device.chrome = true;
			device.chromeVersion = parseInt(RegExp.$1, 10);
		} else if (/Epiphany/.test(ua)) {
			device.epiphany = true;
		} else if (/Firefox\D+(\d+)/.test(ua)) {
			device.firefox = true;
			device.firefoxVersion = parseInt(RegExp.$1, 10);
		} else if (/AppleWebKit/.test(ua) && device.iOS) {
			device.mobileSafari = true;
		} else if (/MSIE (\d+\.\d+);/.test(ua)) {
			device.ie = true;
			device.ieVersion = parseInt(RegExp.$1, 10);
		} else if (/Midori/.test(ua)) {
			device.midori = true;
		} else if (/Opera/.test(ua)) {
			device.opera = true;
		} else if (/Safari\/(\d+)/.test(ua) && !device.windowsPhone) {
			device.safari = true;

			if (/Version\/(\d+)\./.test(ua)) {
				device.safariVersion = parseInt(RegExp.$1, 10);
			}
		} else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
			device.ie = true;
			device.trident = true;
			device.tridentVersion = parseInt(RegExp.$1, 10);
			device.ieVersion = parseInt(RegExp.$3, 10);
		}

		//  Silk gets its own if clause because its ua also contains 'Safari'
		if (/Silk/.test(ua)) {
			device.silk = true;
		}

		//  WebApp mode in iOS
		if (navigator['standalone']) {
			device.webApp = true;
		}

		if (typeof window.cordova !== 'undefined') {
			device.cordova = true;
		}

		if (typeof process !== 'undefined' && typeof require !== 'undefined') {
			device.node = true;
		}

		if (device.node && typeof process.versions === 'object') {
			device.nodeWebkit = !!process.versions['node-webkit'];

			device.electron = !!process.versions.electron;
		}

		if (navigator['isCocoonJS']) {
			device.cocoonJS = true;
		}

		if (device.cocoonJS) {
			try {
				device.cocoonJSApp = (typeof CocoonJS !== 'undefined');
			} catch (error) {
				device.cocoonJSApp = false;
			}
		}

		if (typeof window.ejecta !== 'undefined') {
			device.ejecta = true;
		}

		if (/Crosswalk/.test(ua)) {
			device.crosswalk = true;
		}

	}

	/**
	 * Check video support.
	 */
	function _checkVideo() {

		var videoElement = document.createElement("video");
		var result = false;

		try {
			if (result = !!videoElement.canPlayType) {
				if (videoElement.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '')) {
					device.oggVideo = true;
				}

				if (videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '')) {
					// Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
					device.h264Video = true;
					device.mp4Video = true;
				}

				if (videoElement.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '')) {
					device.webmVideo = true;
				}

				if (videoElement.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '')) {
					device.vp9Video = true;
				}

				if (videoElement.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, '')) {
					device.hlsVideo = true;
				}
			}
		} catch (e) {}
	}

	/**
	 * Check audio support.
	 */
	function _checkAudio() {

		device.audioData = !!(window['Audio']);
		device.webAudio = !!(window['AudioContext'] || window['webkitAudioContext']);
		var audioElement = document.createElement('audio');
		var result = false;

		try {
			if (result = !!audioElement.canPlayType) {
				if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
					device.ogg = true;
				}

				if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') || audioElement.canPlayType(
						'audio/opus;').replace(/^no$/, '')) {
					device.opus = true;
				}

				if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
					device.mp3 = true;
				}

				// Mimetypes accepted:
				//   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
				//   bit.ly/iphoneoscodecs
				if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
					device.wav = true;
				}

				if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
					device.m4a = true;
				}

				if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
					device.webm = true;
				}

				if (audioElement.canPlayType('audio/mp4;codecs="ec-3"') !== '') {
					if (device.edge) {
						device.dolby = true;
					} else if (device.safari && device.safariVersion >= 9) {
						if (/Mac OS X (\d+)_(\d+)/.test(navigator.userAgent)) {
							var major = parseInt(RegExp.$1, 10);
							var minor = parseInt(RegExp.$2, 10);

							if ((major === 10 && minor >= 11) || major > 10) {
								device.dolby = true;
							}
						}
					}
				}
			}
		} catch (e) {}

	}

	/**
	 * Check Little or Big Endian system.
	 *
	 * @author Matt DesLauriers (@mattdesl)
	 */
	function _checkIsLittleEndian() {

		var a = new ArrayBuffer(4);
		var b = new Uint8Array(a);
		var c = new Uint32Array(a);

		b[0] = 0xa1;
		b[1] = 0xb2;
		b[2] = 0xc3;
		b[3] = 0xd4;

		if (c[0] === 0xd4c3b2a1) {
			return true;
		}

		if (c[0] === 0xa1b2c3d4) {
			return false;
		} else {
			//  Could not determine endianness
			return null;
		}

	}



	/**
	 * Check PixelRatio, iOS device, Vibration API, ArrayBuffers and endianess.
	 */
	function _checkDevice() {

		device.pixelRatio = window['devicePixelRatio'] || 1;
		device.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1;
		device.iPhone4 = (device.pixelRatio === 2 && device.iPhone);
		device.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') !== -1;

		if (typeof Int8Array !== 'undefined') {
			device.typedArray = true;
		} else {
			device.typedArray = false;
		}

		if (typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined' && typeof Uint32Array !== 'undefined') {
			device.littleEndian = _checkIsLittleEndian();
			device.LITTLE_ENDIAN = device.littleEndian;
		}

		device.support32bit = (typeof ArrayBuffer !== 'undefined' && typeof Uint8ClampedArray !== 'undefined' && typeof Int32Array !==
			'undefined' && device.littleEndian !== null);

		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

		if (navigator.vibrate) {
			device.vibration = true;
		}

	}


	/**
	 * Check whether the host environment support 3D CSS.
	 */
	function _checkCSS3D() {

		var el = document.createElement('p');
		var has3d;
		var transforms = {
			'webkitTransform': '-webkit-transform',
			'OTransform': '-o-transform',
			'msTransform': '-ms-transform',
			'MozTransform': '-moz-transform',
			'transform': 'transform'
		};

		// Add it to the body to get the computed style.
		document.body.insertBefore(el, null);

		for (var t in transforms) {
			if (el.style[t] !== undefined) {
				el.style[t] = "translate3d(1px,1px,1px)";
				has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			}
		}

		document.body.removeChild(el);
		device.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");

	}

	//  Run the checks
	_checkOS();
	_checkBrowser();
	_checkAudio();
	_checkVideo();
	_checkCSS3D();
	_checkDevice();
	_checkFullScreenSupport();

};

Phaser.Device.prototype.canPlayAudio = function(type) {

	if (type === 'mp3' && this.mp3) {
		return true;
	} else if (type === 'ogg' && (this.ogg || this.opus)) {
		return true;
	} else if (type === 'm4a' && this.m4a) {
		return true;
	} else if (type === 'opus' && this.opus) {
		return true;
	} else if (type === 'wav' && this.wav) {
		return true;
	} else if (type === 'webm' && this.webm) {
		return true;
	} else if (type === 'mp4' && this.dolby) {
		return true;
	}

	return false;

};

Phaser.Device.prototype.canPlayVideo = function(type) {

	if (type === 'webm' && (this.webmVideo || this.vp9Video)) {
		return true;
	} else if (type === 'mp4' && (this.mp4Video || this.h264Video)) {
		return true;
	} else if ((type === 'ogg' || type === 'ogv') && this.oggVideo) {
		return true;
	} else if (type === 'mpeg' && this.hlsVideo) {
		return true;
	}

	return false;

};

/**
 * Check whether the console is open.
 * Note that this only works in Firefox with Firebug and earlier versions of Chrome.
 * It used to work in Chrome, but then they removed the ability: {@link http://src.chromium.org/viewvc/blink?view=revision&revision=151136}
 *
 * @method isConsoleOpen
 * @memberof Phaser.Device.prototype
 */
Phaser.Device.prototype.isConsoleOpen = function() {

	if (window.console && window.console['firebug']) {
		return true;
	}

	if (window.console) {
		console.profile();
		console.profileEnd();

		if (console.clear) {
			console.clear();
		}

		if (console['profiles']) {
			return console['profiles'].length > 0;
		}
	}

	return false;

};

/**
 * Detect if the host is a an Android Stock browser.
 * This is available before the device "ready" event.
 *
 * Authors might want to scale down on effects and switch to the CANVAS rendering method on those devices.
 *
 * @example
 * var defaultRenderingMode = Phaser.Device.isAndroidStockBrowser() ? Phaser.CANVAS : Phaser.AUTO;
 * 
 * @method isAndroidStockBrowser
 * @memberof Phaser.Device.prototype
 */
Phaser.Device.prototype.isAndroidStockBrowser = function() {
	var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
	return matches && matches[1] < 537;

};

/* 设备结束 */

//声音
function soundMgr(game) {
	this.game = game;
	this.soundList = [];
	this.config;
}

soundMgr.prototype.mute = function() {

}
soundMgr.prototype.unmute = function() {

}
soundMgr.prototype.volume = function() {

}
soundMgr.prototype.soundBGM;

soundMgr.prototype.stopBgm = function(id) {
	if(this.soundBGM && this.soundBGM.playing())this.soundBGM.pause();
}
soundMgr.prototype.restoreBgm = function(id) {
	if(this.soundBGM && !this.soundBGM.playing())this.soundBGM.play();
}
soundMgr.prototype.playBgm = function(id) {
	this.soundList.forEach(element => {
		var _audioGameType= 'MUSIC';
		if (element.soundID == id) {
			if (_audioGameType === 'MUSIC' && !GlobalClass.GAME_MUSIC) {
				//break;
			} else {
				if(this.soundBGM)this.soundBGM.stop();
				this.soundBGM=element.sound;
				this.soundBGM.loop(true);
				this.soundBGM.play();
			}
			return;
		}
	})
}
soundMgr.prototype.play = function(id, loop = false,isBmlow=false) {
	let _this=this
	this.soundList.forEach(element => {
		var _audioGameType;
		if (id.indexOf("_MUSIC") != -1) {
			_audioGameType = 'MUSIC';
		} else if (id.indexOf("_FX") != -1) {
			_audioGameType = 'FX';
		} else if (id.indexOf("_SOUND") != -1) {
			_audioGameType = 'SOUND';
		}


		if (element.type === 'audioSprite') {
			element.sprites.forEach(audio => {
				if (audio === id) {
					if (_audioGameType === 'FX' && !GlobalClass.GAME_SOUND_FX) {
						//break;
					} else if (_audioGameType === 'SOUND' && !GlobalClass.GAME_SOUND_FX) {
						//break;
					} else {
						if(isBmlow){
							
							element.sound.on('play',function() {
								_this.soundBGM.volume(0.1)
							})
							element.sound.on('end',function() {
								_this.soundBGM.volume(1)
							})
						}
						element.sound.loop(loop);
						element.sound.play(id);
						//console.log(element.sound)
						return element.sound;
					}
					
				}
			})
// 			element.sound.loop(loop);
// 			element.sound.play(id);
		} else {
			if (element.soundID == id) {
				if (_audioGameType === 'MUSIC' && !GlobalClass.GAME_MUSIC) {
					//break;
				} else {
					if(isBmlow){
						element.sound.on('play',function() {
							_this.soundBGM.volume(0.1)
						})
						element.sound.on('end',function() {
							_this.soundBGM.volume(1)
						})
					}
					element.sound.loop(loop);
					element.sound.play();
					//console.log(element.sound)
					return element.sound;

				}
			}
		}

	});
}

soundMgr.prototype.addSound = function(key, url, data) {
	this.config = this.game.cache.getJSON(key + '-audioatlas');
	var extension = url.substr((Math.max(0, url.lastIndexOf(".")) || Infinity) + 1);
	var audioType = extension.toLowerCase();
	var arrayBuffer = base64ArrayBuffer(data);
	var base64Array = 'data:audio/' + audioType + ';base64,' + arrayBuffer;
	var audioGameType = "";
		
	if (this.config) {
		var _sprite = {};
		var _keyArry = [];

		for (var k in this.config.spritemap) {
			var marker = this.config.spritemap[k];
			var loop = marker.loop;
			_sprite[k] = [Math.floor(marker.start * 1000), Math.floor((marker.end-marker.start) * 1000)];
			_keyArry.push(k)
		}
		audio = new Howl({
			src: [base64Array],
			sprite: _sprite
		});

		var SoundInfo = {
			soundID: key,
			sound: audio,
			sprites: _keyArry,
			type: 'audioSprite'
		}
		this.soundList.push(SoundInfo);
	} else {
		audio = new Howl({
			src: [base64Array]
		});
		var SoundInfo = {
			soundID: key,
			sound: audio,
			sprites: [],
			type: 'audio'
		}
		this.soundList.push(SoundInfo);
	}
}


soundMgr.prototype.preSounds = function(key) {
	this.config = this.game.cache.getJSON(key + '-audioatlas');

	var audio;
	var sound = this.game.cache.getSound(key);
	var url = sound.url
	var extension = url.substr((Math.max(0, url.lastIndexOf(".")) || Infinity) + 1);
	var audioType = extension.toLowerCase();
	var arrayBuffer = base64ArrayBuffer(sound.data);
	var base64Array = 'data:audio/' + audioType + ';base64,' + arrayBuffer;
	var audioGameType = "";




	if (this.config) {
		//是AudioSprite
		var _sprite = {};
		var _keyArry = [];

		for (var k in this.config.spritemap) {
			var marker = this.config.spritemap[k];
			var loop = marker.loop;
			_sprite[k] = [Math.floor(marker.start * 1000), Math.floor((marker.end-marker.start) * 1000)];
			_keyArry.push(k)
		}

		console.log(_sprite)
		audio = new Howl({
			src: [base64Array],
			sprite: _sprite
		});

		var SoundInfo = {
			soundID: key,
			sound: audio,
			sprites: _keyArry,
			type: 'audioSprite'
		}
		this.soundList.push(SoundInfo);
	} else {
		//单独的音乐
		audio = new Howl({
			src: [base64Array]
		});
		var SoundInfo = {
			soundID: key,
			sound: audio,
			sprites: [],
			type: 'audio'
		}
		this.soundList.push(SoundInfo);
	}

}
//声音结束


Game = function() {
	this.world = {
		centerX: 640,
		centerY: 360
	}
	this.cache = new Cache(this);
	this.load = new LoadTexture(this);
	this.time = new Phaser.Time(this);
	this.time.boot();
	this.device = new Phaser.Device();
	this.soundMgr = new soundMgr(this);
};
Game.prototype.restLoad = function() {
	this.load = new LoadTexture(this);
}
Game.prototype.update = function(raftime) {
	this.time.update(raftime);
}
RECTANGLE = 22;




function keyboard(keyCode) {
	let key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = event => {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	//The `upHandler`
	key.upHandler = event => {
		if (event.keyCode === key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	//Attach event listeners
	window.addEventListener(
		"keydown", key.downHandler.bind(key), false
	);
	window.addEventListener(
		"keyup", key.upHandler.bind(key), false
	);
	return key;
}



function base64ArrayBuffer(arrayBuffer) {
	var binary = '';
    var bytes = new Uint8Array(arrayBuffer);
    for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
