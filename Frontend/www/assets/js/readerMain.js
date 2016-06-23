(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var API_URL = "http://localhost:5050";

function backendGet(url, res_data) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            res_data(data);
        },
        fail: function() {
           // callback(new Error("Ajax Failed"));
            res_data({});
        }
    })
}

function backendPost(url, data, res_data) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            res_data(data);
        },
        fail: function() {
           // callback(new Error("Ajax Failed"));
            res_data({});
        }
    })
}
//get unique ObjectID for the document
exports.getById = function (data, res_data) {
    
		backendGet('/api/story/' + data, res_data);
	}
	//show all stories from the db 
exports.show = function (res_data) {
	backendGet('/api/show-stories/', res_data);
};
//show them sorted by title ascending
exports.showSorted = function (res_data) {
	backendGet('/api/showsorted/', res_data);
};
//show all sorted author ascending
exports.showSortedAuthorAsc = function (res_data) {
	backendGet('/api/showsorted-author-asc/', res_data);
};
exports.showSortedTitleDes = function (res_data) {
	backendGet('/api/showsorted-title-des/', res_data);
};
exports.showByGenre = function (data,res_data) {
	backendGet('/api/show-by-genre/'+data, res_data);
};

exports.showSortedAuthorDes = function (res_data) {
	backendGet('/api/showsorted-author-des', res_data);
};
//show all docs of one author
exports.showByAuthor = function (data, res_data) {

	backendGet('/api/show-by-author/' + data, res_data);
};
//show all docs with the same description 

exports.showByDescription = function (data, res_data) {
	backendGet('/api/show-by-description/' + data, res_data);
};

//show all dosc with the same title

exports.showByTitle = function (data, res_data) {
	backendGet('/api/show-by-title/' + data, res_data);
};

//delete all documents
exports.deleteAll = function (res_data) {
	backendGet('/api/delete-all/', res_data);
};
//create one doc from data object(StoryObject)
exports.create = function (data, res_data) {
	backendPost("/api/save-story/", data, res_data);
};
//delete one doc using _id  
exports.delete = function (data, res_data) {
	backendGet('/api/delete/' + data, res_data);
}; //update one doc using _id
//ONE SHOULD IMPORT ONLY JSON OBJECTS WITH _ID HERE
exports.update = function (data, res_data) {
	backendPost('/api/update/', data, res_data);
};


},{}],2:[function(require,module,exports){
//dependencies
var storage = require('./storage');
var api = require('./api');

//global
var STORY = null;
var ROUTE = [];
var CURRENT = null;
var MAX_CHILDREN = 3;

var init = function () {
	var idFromStorage = storage.get('currentReqId');
    
   
    console.log("ALERT:"+idFromStorage);
	if (idFromStorage){
        console.log(idFromStorage);
		api.getById(idFromStorage, function (data) {
			console.warn(data);
			if (Object.keys(data).length > 0) {
				console.log(data);
				STORY = data;
				storage.set('currentStory', STORY);
				console.log("TREE_ROOT = data")
				CURRENT = STORY.root;
				$('#story-name').html(STORY.title);
				$('#story-author').html(STORY.author);

				load(CURRENT);
			} else {
				//MUST BE ENBETTERED!
				console.log('invalid story id req');
			}
		});
    }
	else {
		//MUST BE ENBETTERED!
		console.log('no data in storage');
		//alert('invalid page load!');
	}

	//this thing is for testing only!!!
	/*STORY = {
			title: 'Story about a book',
			root: {
				id: 0,
				children: [
					{
						id: 1,
						children: [
							{
								id: 5,
								children: [],
								message: 'Cool! that\'s great!',
								title: 'Read it',
								offset: 0,
								x: 0,
								y: 0
	},
							{
								id: 4,
								children: [],
								message: 'You\'re right! it\'s better to wait a bit',
								title: 'Not to read it',
								offset: 0,
								x: 0,
								y: 0
		},
							{
								id: 6,
								children: [],
								message: 'Shame on you',
								title: 'Throw it away!',
								offset: 0,
								x: 0,
								y: 0
		}
	],
						message: 'You\'ve taken the book! what\'s next?',
						title: 'Take the book',
						offset: 0,
						x: 0,
						y: 0
	},
					{
						id: 3,
						children: [],
						message: 'You lost your chance for a good story',
						title: 'Not to take the book',
						offset: 0,
						x: 0,
						y: 0
	}],
				message: 'You\'ve found a book in the street. What you\'ll decide to do?',
				title: 'Story about a book',
				offset: 0,
				x: 0,
				y: 0
			},
			author: 'Ivan Franko',
			description: 'Some description here',
			genre: "Drama",
		}*/
	//end of for-testing-only
};

var _nodeById = function (id) {
	//counting route
	var route = [];
	while (id > 0) {
		route.push(id);
		--id;
		id = Math.floor(id / MAX_CHILDREN);
	}
	//getting node from tree by route
	var currentN = STORY.root;
	for (var i = route.length - 1; i >= 0; --i) {
		currentN = $.grep(currentN.children, function (e) {
			return e.id == route[i];
		})[0];
	}
	return currentN;
}

var load = function (node) {
	$('#variants').html('');
	$('#node-title').html(node.title);
	$('#node-text').html(node.message);
	node.children.forEach(function (item) {
		var $var = $('<div class="btn btn-primary btn-xs navigation-variant" id="' + item.id + '">' + item.title + '</div><br/>');
		$('#variants').append($var);
	});
	$('.navigation-variant').click(function () {
		var id = $(this).attr('id');
		ROUTE.push(CURRENT.id);
		CURRENT = $.grep(CURRENT.children, function (e) {
			return e.id == id;
		})[0];
		load(CURRENT);
	});
	//animations should be here!
}

$('#navigation-back').click(function () {
	CURRENT = _nodeById(ROUTE.pop());
	load(CURRENT);
});

$('#btn-atm').click(function () {
	var $body = $('#body-elem');
	if ($body.hasClass('original')) {
		switch (STORY.genre) {
			case "Drama":
				$body.removeClass('original');
				$body.addClass('drama-colors');
				break;
			case "Romantic":
				$body.removeClass('original');
				$body.addClass('romantic-colors');
				break;
			case "Fairy Tale":
				$body.removeClass('original');
				$body.addClass('fairy-tale-colors');
				break;
			case "Detective":
				$body.removeClass('original');
				$body.addClass('detective-colors');
				break;
			case "Fantasy":
				$body.removeClass('original');
				$body.addClass('fantasy-colors');
				break;
			case "Horror":
				$body.removeClass('original');
				$body.addClass('horror-colors');
				break;
			case "Adventure":
				$body.removeClass('original');
				$body.addClass('adventure-colors');
				break;
		}
	} else {
		$body.removeAttr('class');
		$body.addClass('original');
	}
});

$(document).ready(function () {


	//onload
	init();
});

},{"./api":1,"./storage":3}],3:[function(require,module,exports){
var basil = require('basil.js');
basil = new basil();

exports.get = function (key) {
	return basil.get(key);
};

exports.set = function (key, value) {
	return basil.set(key, value);
};

},{"basil.js":4}],4:[function(require,module,exports){
(function () {
	// Basil
	var Basil = function (options) {
		return Basil.utils.extend({}, Basil.plugins, new Basil.Storage().init(options));
	};

	// Version
	Basil.version = '0.4.2';

	// Utils
	Basil.utils = {
		extend: function () {
			var destination = typeof arguments[0] === 'object' ? arguments[0] : {};
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] && typeof arguments[i] === 'object')
					for (var property in arguments[i])
						destination[property] = arguments[i][property];
			}
			return destination;
		},
		each: function (obj, fnIterator, context) {
			if (this.isArray(obj)) {
				for (var i = 0; i < obj.length; i++)
					if (fnIterator.call(context, obj[i], i) === false) return;
			} else if (obj) {
				for (var key in obj)
					if (fnIterator.call(context, obj[key], key) === false) return;
			}
		},
		tryEach: function (obj, fnIterator, fnError, context) {
			this.each(obj, function (value, key) {
				try {
					return fnIterator.call(context, value, key);
				} catch (error) {
					if (this.isFunction(fnError)) {
						try {
							fnError.call(context, value, key, error);
						} catch (error) {}
					}
				}
			}, this);
		},
		registerPlugin: function (methods) {
			Basil.plugins = this.extend(methods, Basil.plugins);
		}
	};
  	// Add some isType methods: isArguments, isBoolean, isFunction, isString, isArray, isNumber, isDate, isRegExp.
	var types = ['Arguments', 'Boolean', 'Function', 'String', 'Array', 'Number', 'Date', 'RegExp']
	for (var i = 0; i < types.length; i++) {
		Basil.utils['is' + types[i]] = (function (type) {
			return function (obj) {
				return Object.prototype.toString.call(obj) === '[object ' + type + ']';
			};
		})(types[i]);
	}

	// Plugins
	Basil.plugins = {};

	// Options
	Basil.options = Basil.utils.extend({
		namespace: 'b45i1',
		storages: ['local', 'cookie', 'session', 'memory'],
		expireDays: 365
	}, window.Basil ? window.Basil.options : {});

	// Storage
	Basil.Storage = function () {
		var _salt = 'b45i1' + (Math.random() + 1)
				.toString(36)
				.substring(7),
			_storages = {},
			_toStoragesArray = function (storages) {
				if (Basil.utils.isArray(storages))
					return storages;
				return Basil.utils.isString(storages) ? [storages] : [];
			},
			_toStoredKey = function (namespace, path) {
				var key = '';
				if (Basil.utils.isString(path) && path.length)
					path = [path];
				if (Basil.utils.isArray(path) && path.length)
					key = path.join('.');
				return key && namespace ? namespace + '.' + key : key;
			},
			_toKeyName = function (namespace, key) {
				if (!namespace)
					return key;
				return key.replace(new RegExp('^' + namespace + '.'), '');
			},
			_toStoredValue = function (value) {
				return JSON.stringify(value);
			},
			_fromStoredValue = function (value) {
				return value ? JSON.parse(value) : null;
			};

		// HTML5 web storage interface
		var webStorageInterface = {
			engine: null,
			check: function () {
				try {
					window[this.engine].setItem(_salt, true);
					window[this.engine].removeItem(_salt);
				} catch (e) {
					return false;
				}
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				window[this.engine].setItem(key, value);
			},
			get: function (key) {
				return window[this.engine].getItem(key);
			},
			remove: function (key) {
				window[this.engine].removeItem(key);
			},
			reset: function (namespace) {
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0) {
						this.remove(key);
						i--;
					}
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		// local storage
		_storages.local = Basil.utils.extend({}, webStorageInterface, {
			engine: 'localStorage'
		});
		// session storage
		_storages.session = Basil.utils.extend({}, webStorageInterface, {
			engine: 'sessionStorage'
		});

		// memory storage
		_storages.memory = {
			_hash: {},
			check: function () {
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				this._hash[key] = value;
			},
			get: function (key) {
				return this._hash[key] || null;
			},
			remove: function (key) {
				delete this._hash[key];
			},
			reset: function (namespace) {
				for (var key in this._hash) {
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var key in this._hash)
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				return keys;
			}
		};

		// cookie storage
		_storages.cookie = {
			check: function () {
				return navigator.cookieEnabled;
			},
			set: function (key, value, options) {
				if (!this.check())
					throw Error('cookies are disabled');
				options = options || {};
				if (!key)
					throw Error('invalid key');
				var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
				// handle expiration days
				if (options.expireDays) {
					var date = new Date();
					date.setTime(date.getTime() + (options.expireDays * 24 * 60 * 60 * 1000));
					cookie += '; expires=' + date.toGMTString();
				}
				// handle domain
				if (options.domain && options.domain !== document.domain) {
					var _domain = options.domain.replace(/^\./, '');
					if (document.domain.indexOf(_domain) === -1 || _domain.split('.').length <= 1)
						throw Error('invalid domain');
					cookie += '; domain=' + options.domain;
				}
				// handle secure
				if (options.secure === true) {
					cookie += '; secure';
				}
				document.cookie = cookie + '; path=/';
			},
			get: function (key) {
				if (!this.check())
					throw Error('cookies are disabled');
				var encodedKey = encodeURIComponent(key);
				var cookies = document.cookie ? document.cookie.split(';') : [];
				// retrieve last updated cookie first
				for (var i = cookies.length - 1, cookie; i >= 0; i--) {
					cookie = cookies[i].replace(/^\s*/, '');
					if (cookie.indexOf(encodedKey + '=') === 0)
						return decodeURIComponent(cookie.substring(encodedKey.length + 1, cookie.length));
				}
				return null;
			},
			remove: function (key) {
				// remove cookie from main domain
				this.set(key, '', { expireDays: -1 });
				// remove cookie from upper domains
				var domainParts = document.domain.split('.');
				for (var i = domainParts.length; i >= 0; i--) {
					this.set(key, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
				}
			},
			reset: function (namespace) {
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = cookie.substr(0, cookie.indexOf('='));
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				if (!this.check())
					throw Error('cookies are disabled');
				var keys = [],
					cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = decodeURIComponent(cookie.substr(0, cookie.indexOf('=')));
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		return {
			init: function (options) {
				this.setOptions(options);
				return this;
			},
			setOptions: function (options) {
				this.options = Basil.utils.extend({}, this.options || Basil.options, options);
			},
			support: function (storage) {
				return _storages.hasOwnProperty(storage);
			},
			check: function (storage) {
				if (this.support(storage))
					return _storages[storage].check();
				return false;
			},
			set: function (key, value, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return false;
				value = options.raw === true ? value : _toStoredValue(value);
				var where = null;
				// try to set key/value in first available storage
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					_storages[storage].set(key, value, options);
					where = storage;
					return false; // break;
				}, null, this);
				if (!where) {
					// key has not been set anywhere
					return false;
				}
				// remove key from all other storages
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (storage !== where)
						_storages[storage].remove(key);
				}, null, this);
				return true;
			},
			get: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return null;
				var value = null;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (value !== null)
						return false; // break if a value has already been found.
					value = _storages[storage].get(key, options) || null;
					value = options.raw === true ? value : _fromStoredValue(value);
				}, function (storage, index, error) {
					value = null;
				}, this);
				return value;
			},
			remove: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key)))
					return;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].remove(key);
				}, null, this);
			},
			reset: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].reset(options.namespace);
				}, null, this);
			},
			keys: function (options) {
				options = options || {};
				var keys = [];
				for (var key in this.keysMap(options))
					keys.push(key);
				return keys;
			},
			keysMap: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				var map = {};
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					Basil.utils.each(_storages[storage].keys(options.namespace), function (key) {
						map[key] = Basil.utils.isArray(map[key]) ? map[key] : [];
						map[key].push(storage);
					}, this);
				}, null, this);
				return map;
			}
		};
	};

	// Access to native storages, without namespace or basil value decoration
	Basil.memory = new Basil.Storage().init({ storages: 'memory', namespace: null, raw: true });
	Basil.cookie = new Basil.Storage().init({ storages: 'cookie', namespace: null, raw: true });
	Basil.localStorage = new Basil.Storage().init({ storages: 'local', namespace: null, raw: true });
	Basil.sessionStorage = new Basil.Storage().init({ storages: 'session', namespace: null, raw: true });

	// browser export
	window.Basil = Basil;

	// AMD export
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Basil;
		});
	// commonjs export
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Basil;
	}

})();

},{}]},{},[2]);
