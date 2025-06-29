import { default as axios } from 'axios';
import Configuration from './configuration.js';

/**
 * @module purecloud-guest-chat-client/ApiClient
 * @version 15.4.0
 */
class ApiClient {
	/**
	 * Singleton getter
	 */
	get instance() {
		return ApiClient.instance;
	}

	/**
	 * Singleton setter
	 */
	set instance(value) {
		ApiClient.instance = value;
	}

	/**
	 * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
	 * application to use this class directly - the *Api and model classes provide the public API for the service. The
	 * contents of this file should be regarded as internal but are documented for completeness.
	 * @alias module:purecloud-guest-chat-client/ApiClient
	 * @class
	 */
	constructor() {
		/**
		 * @description The default API client implementation.
		 * @type {module:purecloud-guest-chat-client/ApiClient}
		 */
		if(!ApiClient.instance){
			ApiClient.instance = this;
		}

		/**
		 * Enumeration of collection format separator strategies.
		 * @enum {String} 
		 * @readonly
		 */
		this.CollectionFormatEnum = {
			/**
			 * Comma-separated values. Value: <code>csv</code>
			 * @const
			 */
			CSV: ',',
			/**
			 * Space-separated values. Value: <code>ssv</code>
			 * @const
			 */
			SSV: ' ',
			/**
			 * Tab-separated values. Value: <code>tsv</code>
			 * @const
			 */
			TSV: '\t',
			/**
			 * Pipe(|)-separated values. Value: <code>pipes</code>
			 * @const
			 */
			PIPES: '|',
			/**
			 * Native array. Value: <code>multi</code>
			 * @const
			 */
			MULTI: 'multi'
		};

		/**
		 * @description Value is `true` if local storage exists. Otherwise, false.
		 */
		try {
			localStorage.setItem('purecloud_local_storage_test', 'purecloud_local_storage_test');
			localStorage.removeItem('purecloud_local_storage_test');
			this.hasLocalStorage = true;
		} catch(e) {
			this.hasLocalStorage = false;
		}

		/**
		 * Create configuration instance for ApiClient and prepare logger.
		 */
		this.config = new Configuration();

		/**
		 * The base URL against which to resolve every API call's (relative) path.
		 * @type {String}
		 * @default https://api.mypurecloud.com
		 */
		this.setEnvironment('https://api.mypurecloud.com');

		/**
		 * The authentication methods to be included for all API calls.
		 * @type {Array.<String>}
		 */
		this.authentications = {
			'Guest Chat JWT': {type: 'apiKey', 'in': 'header', name: 'Authorization', apiKeyPrefix: 'Bearer' },
			'PureCloud OAuth': {type: 'oauth2'}
		};
		/**
		 * The default HTTP headers to be included for all API calls.
		 * @type {Array.<String>}
		 * @default {}
		 */
		this.defaultHeaders = {};

		/**
		 * The default HTTP timeout for all API calls.
		 * @type {Number}
		 * @default 60000
		 */
		this.timeout = 16000;

		this.authData = {};
		this.settingsPrefix = 'purecloud';

		if (typeof(window) !== 'undefined') window.ApiClient = this;
	}

	/**
	 * @description If set to `true`, the response object will contain additional information about the HTTP response. When `false` (default) only the body object will be returned.
	 * @param {boolean} returnExtended - `true` to return extended responses
	 */
	setReturnExtendedResponses(returnExtended) {
		this.returnExtended = returnExtended;
	}

	/**
	 * @description When `true`, persists the auth token to local storage to avoid a redirect to the login page on each page load. Defaults to `false`.
	 * @param {boolean} doPersist - `true` to persist the auth token to local storage
	 * @param {string} prefix - (Optional, default 'purecloud') The name prefix used for the local storage key
	 */
	setPersistSettings(doPersist, prefix) {
		this.persistSettings = doPersist;
		this.settingsPrefix = prefix ? prefix.replace(/\W+/g, '_') : 'purecloud';
	}

	/**
	 * @description Saves the auth token to local storage, if enabled.
	 */
	_saveSettings(opts) {
		try {
			this.authData.apiKey = opts.apiKey;
			this.authentications['Guest Chat JWT'].apiKey = opts.apiKey;

			if (opts.state) {
				this.authData.state = opts.state;
			}

			if (opts.tokenExpiryTime) {
				this.authData.tokenExpiryTime = opts.tokenExpiryTime;
				this.authData.tokenExpiryTimeString = opts.tokenExpiryTimeString;
			}

			// Don't save settings if we aren't supposed to be persisting them
			if (this.persistSettings !== true) return;

			// Ensure we can access local storage
			if (!this.hasLocalStorage) {
				return;
			}

			// Remove state from data so it's not persisted
			let tempData = JSON.parse(JSON.stringify(this.authData));
			delete tempData.state;

			// Save updated auth data
			localStorage.setItem(`${this.settingsPrefix}_auth_data`, JSON.stringify(tempData));
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * @description Loads settings from local storage, if enabled.
	 */
	_loadSettings() {
		// Don't load settings if we aren't supposed to be persisting them
		if (this.persistSettings !== true) return;

		// Ensure we can access local storage
		if (!this.hasLocalStorage) {
			return;
		}

		// Load current auth data
		const tempState = this.authData.state;
		this.authData = localStorage.getItem(`${this.settingsPrefix}_auth_data`);
		if (!this.authData) 
			this.authData = {};
		else
			this.authData = JSON.parse(this.authData);
		if (this.authData.apiKey) this.setJwt(this.authData.apiKey);
		this.authData.state = tempState;
	}

	/**
	 * @description Sets the environment used by the session
	 * @param {string} environment - (Optional, default "mypurecloud.com") Environment the session use, e.g. mypurecloud.ie, mypurecloud.com.au, etc.
	 */
	setEnvironment(environment) {
		this.config.setEnvironment(environment);
	}

	/**
	 * @description Loads token from storage, if enabled, and checks to ensure it works.
	 */
	_testTokenAccess() {
		return new Promise((resolve, reject) => {
			// Load from storage
			this._loadSettings();

			// Check if there is a token to test
			if (!this.authentications['Guest Chat JWT'].apiKey) {
				reject(new Error('Token is not set'));
				return;
			}

			// Test token
			this.callApi('/api/v2/authorization/permissions', 'GET', 
				null, null, null, null, null, ['Guest Chat JWT'], ['application/json'], ['application/json'])
				.then(() => {
					resolve();
				})
				.catch((error) => {
					this._saveSettings({ apiKey: undefined });
					reject(error);
				});
		});
	}

	/**
	 * @description Sets the access token to be used with requests
	 * @param {string} token - The access token
	 */
	setJwt(jwt) {
		this._saveSettings({ apiKey: jwt });
	}

	/**
	 * @description Sets the storage key to use when persisting the access token
	 * @param {string} storageKey - The storage key name
	 */
	setStorageKey(storageKey) {
		// Set storage key
		this.storageKey = storageKey;

		// Trigger storage of current token
		this.setJwt(this.authentications['Guest Chat JWT'].apiKey);
	}

	/**
	 * @description Constructs a URL to the auth server
	 * @param {string} path - The path for the URL
	 * @param {object} query - An object of key/value pairs to use for querystring keys/values
	 */
	_buildAuthUrl(path, query) {
		if (!query) query = {};
		return Object.keys(query).reduce((url, key) => !query[key] ? url : `${url}&${key}=${query[key]}`, `${this.config.authUrl}/${path}?`);
	}

	/**
	 * Returns a string representation for an actual parameter.
	 * @param param The actual parameter.
	 * @returns {String} The string representation of <code>param</code>.
	 */
	paramToString(param) {
		if (!param) {
			return '';
		}
		if (param instanceof Date) {
			return param.toJSON();
		}
		return param.toString();
	}

	/**
	 * Returns query parameters serialized in the format needed for an axios request.
	 * @param param The unserialized query parameters.
	 * @returns {Object} The serialized representation the query parameters.
	 */
	serialize(obj) {
		var result = {};
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				result[encodeURIComponent(p)] = Array.isArray(obj[p]) ? obj[p].join(",") : this.paramToString(obj[p]);
			}
		}
		return result
	}

	/**
	 * Adds headers onto an existing header object (may be empty)
	 * @param existingHeaders The existing header object.
	 * @param newHeaders New headers.
	 * @returns {Object} The combination of all headers.
	 */
	addHeaders(existingHeaders, ...newHeaders) {
		if (existingHeaders) {
			existingHeaders = Object.assign(existingHeaders, ...newHeaders);
		} else {
			existingHeaders = Object.assign(...newHeaders);
		}
		return existingHeaders;
	}

	/**
	 * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
	 * NOTE: query parameters are not handled here.
	 * @param {String} path The path to append to the base URL.
	 * @param {Object} pathParams The parameter values to append.
	 * @returns {String} The encoded path with parameter values substituted.
	 */
	buildUrl(path, pathParams) {
		if (!path.match(/^\//)) {
			path = `/${path}`;
		}
		var url = this.config.basePath + path;
		url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
			var value;
			if (pathParams.hasOwnProperty(key)) {
				value = this.paramToString(pathParams[key]);
			} else {
				value = fullMatch;
			}
			return encodeURIComponent(value);
		});
		return url;
	}

	/**
	 * Checks whether the given content type represents JSON.<br>
	 * JSON content type examples:<br>
	 * <ul>
	 * <li>application/json</li>
	 * <li>application/json; charset=UTF8</li>
	 * <li>APPLICATION/JSON</li>
	 * </ul>
	 * @param {String} contentType The MIME content type to check.
	 * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
	 */
	isJsonMime(contentType) {
		return Boolean(contentType && contentType.match(/^application\/json(;.*)?$/i));
	}

	/**
	 * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
	 * @param {Array.<String>} contentTypes
	 * @returns {String} The chosen content type, preferring JSON.
	 */
	jsonPreferredMime(contentTypes) {
		for (var i = 0; i < contentTypes.length; i++) {
			if (this.isJsonMime(contentTypes[i])) {
				return contentTypes[i];
			}
		}
		return contentTypes[0];
	}

	/**
	 * Checks whether the given parameter value represents file-like content.
	 * @param param The parameter to check.
	 * @returns {Boolean} <code>true</code> if <code>param</code> represents a file. 
	 */
	isFileParam(param) {
		// fs.ReadStream in Node.js (but not in runtime like browserify)
		if (typeof window === 'undefined' &&
				typeof require === 'function' &&
				require('fs') &&
				param instanceof require('fs').ReadStream) {
			return true;
		}
		// Buffer in Node.js
		if (typeof Buffer === 'function' && param instanceof Buffer) {
			return true;
		}
		// Blob in browser
		if (typeof Blob === 'function' && param instanceof Blob) {
			return true;
		}
		// File in browser (it seems File object is also instance of Blob, but keep this for safe)
		if (typeof File === 'function' && param instanceof File) {
			return true;
		}
		return false;
	}

	/**
	 * Normalizes parameter values:
	 * <ul>
	 * <li>remove nils</li>
	 * <li>keep files and arrays</li>
	 * <li>format to string with `paramToString` for other cases</li>
	 * </ul>
	 * @param {Object.<String, Object>} params The parameters as object properties.
	 * @returns {Object.<String, Object>} normalized parameters.
	 */
	normalizeParams(params) {
		var newParams = {};
		for (var key in params) {
			if (params.hasOwnProperty(key) && params[key] !== undefined) {
				var value = params[key];
				if (this.isFileParam(value) || Array.isArray(value)) {
					newParams[key] = value;
				} else {
					newParams[key] = this.paramToString(value);
				}
			}
		}
		return newParams;
	}

	/**
	 * Builds a string representation of an array-type actual parameter, according to the given collection format.
	 * @param {Array} param An array parameter.
	 * @param {module:purecloud-guest-chat-client/ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
	 * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
	 * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
	 */
	buildCollectionParam(param, collectionFormat) {
		if (!param) return;

		switch (collectionFormat) {
			case 'csv':
				return param.map(this.paramToString).join(',');
			case 'ssv':
				return param.map(this.paramToString).join(' ');
			case 'tsv':
				return param.map(this.paramToString).join('\t');
			case 'pipes':
				return param.map(this.paramToString).join('|');
			case 'multi':
				// return the array directly as axios will handle it as expected
				return param.map(this.paramToString);
			default:
				throw new Error(`Unknown collection format: ${collectionFormat}`);
		}
	}

	/**
	 * Applies authentication headers to the request.
	 * @param {Object} request The axios request config object.
	 * @param {Array.<String>} authNames An array of authentication method names.
	 */
	applyAuthToRequest(request, authNames) {
		authNames.forEach((authName) => {
			var auth = this.authentications[authName];
			switch (auth.type) {
				case 'basic':
					if (auth.username || auth.password) {
						request.auth = {
							username: auth.username || '',
							password: auth.password || ''
						};
					}
					break;
				case 'apiKey':
					if (auth.apiKey) {
						var data = {};
						if (auth.apiKeyPrefix) {
							data[auth.name] = `${auth.apiKeyPrefix} ${auth.apiKey}`;
						} else {
							data[auth.name] = auth.apiKey;
						}
						if (auth['in'] === 'header') {
							request.headers = this.addHeaders(request.headers, data);
						} else {
							request.params = this.serialize(data);
						}
					}
					break;
				case 'oauth2':
					if (auth.accessToken) {
						request.headers = this.addHeaders(request.headers, {'Authorization': `Bearer ${auth.accessToken}`});
					}
					break;
				default:
					throw new Error(`Unknown authentication type: ${auth.type}`);
			}
		});
	}

	/**
	 * Invokes the REST service using the supplied settings and parameters.
	 * @param {String} path The base URL to invoke.
	 * @param {String} httpMethod The HTTP method to use.
	 * @param {Object.<String, String>} pathParams A map of path parameters and their values.
	 * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
	 * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
	 * @param {Object.<String, Object>} formParams A map of form parameters and their values.
	 * @param {Object} bodyParam The value to pass as the request body.
	 * @param {Array.<String>} authNames An array of authentication type names.
	 * @param {Array.<String>} contentTypes An array of request MIME types.
	 * @param {Array.<String>} accepts An array of acceptable response MIME types.types or the
	 * constructor for a complex type.
	 * @returns {Promise} A Promise object.
	 */
	callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts) {
		var url = this.buildUrl(path, pathParams);
		var request = {
			method: httpMethod,
			url: url,
			proxy: this.proxy,
			timeout: this.timeout,
			params: this.serialize(queryParams)
		};

		// apply authentications
		this.applyAuthToRequest(request, authNames);

		// set header parameters
		const defaultHeaders = this.defaultHeaders;
		const normalizedHeaderParams = this.normalizeParams(headerParams);
		request.headers = this.addHeaders(request.headers, defaultHeaders, normalizedHeaderParams);

		var contentType = this.jsonPreferredMime(contentTypes);
		if (contentType) {
			request.headers['Content-Type'] = contentType;
		} else if (!request.headers['Content-Type']) {
			request.headers['Content-Type'] = 'application/json';
		}

		if (contentType === 'application/x-www-form-urlencoded') {
			request.data = this.normalizeParams(formParams);
		} else if (contentType == 'multipart/form-data') {
			var _formParams = this.normalizeParams(formParams);
			for (var key in _formParams) {
				if (_formParams.hasOwnProperty(key)) {
					// Looks like axios handles files and forms the same way
					var formData = new FormData();
					formData.set(key, _formParams[key]);
					request.data = formData;
				}
			}
		} else if (bodyParam) {
			request.data = bodyParam;
		}

		var accept = this.jsonPreferredMime(accepts);
		if (accept) {
			request.headers['Accept'] = accept;
		}

		return new Promise((resolve, reject) => {
			axios.request(request)
				.then((response) => {
					// Build response object
					var data = (this.returnExtended === true) ? {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
						body: response.data,
						text: response.text,
						error: null
					} : response.data ? response.data : response.text;

					// Debug logging
					this.config.logger.log('trace', response.status, httpMethod, url, request.headers, response.headers, bodyParam, undefined);
					this.config.logger.log('debug', response.status, httpMethod, url, request.headers, undefined, bodyParam, undefined);

					// Resolve promise
					resolve(data);
				})
				.catch((error) => {
					var data = error
					if (error.response) {
						// Log error
						this.config.logger.log(
							'error',
							error.response.status,
							httpMethod,
							url,
							request.headers,
							error.response.headers,
							bodyParam,
							error.response.data
						);
						data = (this.returnExtended === true) ? {
							status: error.response.status,
							statusText: error.response.statusText,
							headers: error.response.headers,
							body: error.response.data,
							text: error.response.text,
							error: error
						} : error.response.data ? error.response.data : error.response.text;
					}
					reject(data);
				});
		});
	}
}

export default ApiClient;