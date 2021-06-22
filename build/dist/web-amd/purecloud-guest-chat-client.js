define(['superagent'], function (superagent) { 'use strict';

	superagent = superagent && superagent.hasOwnProperty('default') ? superagent['default'] : superagent;

	var PureCloudRegionHosts = {
		us_east_1: 'mypurecloud.com',
		eu_west_1: 'mypurecloud.ie',
		ap_southeast_2: 'mypurecloud.com.au',
		ap_northeast_1: 'mypurecloud.jp',
		eu_central_1: 'mypurecloud.de',
		us_west_2: 'usw2.pure.cloud',
		ca_central_1: 'cac1.pure.cloud',
		ap_northeast_2: 'apne2.pure.cloud',
		eu_west_2: 'euw2.pure.cloud',
		ap_south_1: 'aps1.pure.cloud',
		us_east_2: 'use2.us-gov-pure.cloud',
	};

	const logLevels = {
		levels: {
			none: 0,
			error: 1,
			debug: 2,
			trace: 3,
		},
	};

	const logLevelEnum = {
		level: {
			LNone: 'none',
			LError: 'error',
			LDebug: 'debug',
			LTrace: 'trace',
		},
	};

	const logFormatEnum = {
		formats: {
			JSON: 'json',
			TEXT: 'text',
		},
	};

	class Logger {
		get logLevelEnum() {
			return logLevelEnum;
		}

		get logFormatEnum() {
			return logFormatEnum;
		}

		constructor() {
			this.log_level = logLevelEnum.level.LNone;
			this.log_format = logFormatEnum.formats.TEXT;
			this.log_to_console = true;
			this.log_file_path;
			this.log_response_body = false;
			this.log_request_body = false;

			this.setLogger();
		}

		setLogger() {
			if(typeof window === 'undefined') {
				const winston = require('winston');
				this.logger = winston.createLogger({
					levels: logLevels.levels,
					level: this.log_level,
				});
				if (this.log_file_path && this.log_file_path !== '') {
					if (this.log_format === logFormatEnum.formats.JSON) {
						this.logger.add(new winston.transports.File({ format: winston.format.json(), filename: this.log_file_path }));
					} else {
						this.logger.add(
							new winston.transports.File({
								format: winston.format.combine(
									winston.format((info) => {
										info.level = info.level.toUpperCase();
										return info;
									})(),
									winston.format.simple()
								),
								filename: this.log_file_path,
							})
						);
					}
				}
				if (this.log_to_console) {
					if (this.log_format === logFormatEnum.formats.JSON) {
						this.logger.add(new winston.transports.Console({ format: winston.format.json() }));
					} else {
						this.logger.add(
							new winston.transports.Console({
								format: winston.format.combine(
									winston.format((info) => {
										info.level = info.level.toUpperCase();
										return info;
									})(),
									winston.format.simple()
								),
							})
						);
					}
				}
			}
		}

		log(level, statusCode, method, url, requestHeaders, responseHeaders, requestBody, responseBody) {
			var content = this.formatLog(level, statusCode, method, url, requestHeaders, responseHeaders, requestBody, responseBody);
			if (typeof window !== 'undefined') {
				var shouldLog = this.calculateLogLevel(level);
				if (shouldLog > 0 && this.log_to_console === true) {
					if(this.log_format === this.logFormatEnum.formats.JSON) {
						console.log(content);
					} else {
				 		console.log(`${level.toUpperCase()}: ${content}`);
					}
				}
			} else {
				if (this.logger.transports.length > 0) this.logger.log(level, content);
			}
		}

		calculateLogLevel(level) {
			switch (this.log_level) {
				case this.logLevelEnum.level.LError:
					if (level !== this.logLevelEnum.level.LError) {
						return -1;
					}
					return 1;
				case this.logLevelEnum.level.LDebug:
					if (level === this.logLevelEnum.level.LTrace) {
						return -1;
					}
					return 1;
				case this.logLevelEnum.level.LTrace:
					return 1;
				default:
					return -1;
			}
		}

		formatLog(level, statusCode, method, url, requestHeaders, responseHeaders, requestBody, responseBody) {
			var result;
			if (requestHeaders) requestHeaders['Authorization'] = '[REDACTED]';
			if (!this.log_request_body) requestBody = undefined;
			if (!this.log_response_body) responseBody = undefined;
			if (this.log_format && this.log_format === logFormatEnum.formats.JSON) {
				result = {
					level: level,
					date: new Date().toISOString(),
					method: method,
					url: decodeURIComponent(url),
					correlationId: responseHeaders ? (responseHeaders['inin-correlation-id'] ? responseHeaders['inin-correlation-id'] : '') : '',
					statusCode: statusCode,
				};
				if (requestHeaders) result.requestHeaders = requestHeaders;
				if (responseHeaders) result.responseHeaders = responseHeaders;
				if (requestBody) result.requestBody = requestBody;
				if (responseBody) result.responseBody = responseBody;
			} else {
				result = `${new Date().toISOString()}
=== REQUEST === 
${this.formatValue('URL', decodeURIComponent(url))}${this.formatValue('Method', method)}${this.formatValue(
				'Headers',
				this.formatHeaderString(requestHeaders)
			)}${this.formatValue('Body', requestBody ? JSON.stringify(requestBody, null, 2) : '')}
=== RESPONSE ===
${this.formatValue('Status', statusCode)}${this.formatValue('Headers', this.formatHeaderString(responseHeaders))}${this.formatValue(
				'CorrelationId',
				responseHeaders ? (responseHeaders['inin-correlation-id'] ? responseHeaders['inin-correlation-id'] : '') : ''
			)}${this.formatValue('Body', responseBody ? JSON.stringify(responseBody, null, 2) : '')}`;
			}

			return result;
		}

		formatHeaderString(headers) {
			var headerString = '';
			if (!headers) return headerString;
			for (const [key, value] of Object.entries(headers)) {
				headerString += `\n\t${key}: ${value}`;
			}
			return headerString;
		}

		formatValue(key, value) {
			if (!value || value === '' || value === '{}') return '';
			return `${key}: ${value}\n`;
		}

		getLogLevel(level) {
			switch (level) {
				case 'error':
					return logLevelEnum.level.LError;
				case 'debug':
					return logLevelEnum.level.LDebug;
				case 'trace':
					return logLevelEnum.level.LTrace;
				default:
					return logLevelEnum.level.LNone;
			}
		}

		getLogFormat(format) {
			switch (format) {
				case 'json':
					return logFormatEnum.formats.JSON;
				default:
					return logFormatEnum.formats.TEXT;
			}
		}
	}

	class Configuration {
		/**
		 * Singleton getter
		 */
		get instance() {
			return Configuration.instance;
		}

		/**
		 * Singleton setter
		 */
		set instance(value) {
			Configuration.instance = value;
		}

		constructor() {
			if (!Configuration.instance) {
				Configuration.instance = this;
			}

			if (typeof window !== 'undefined') {
				this.configPath = '';
			} else {
				const os = require('os');
				const path = require('path');
				this.configPath = path.join(os.homedir(), '.genesyscloudjavascript-guest', 'config');
			}

			this.live_reload_config = true;
			this.host;
			this.environment;
			this.basePath;
			this.authUrl;
			this.config;
			this.logger = new Logger();
			this.setEnvironment();
			this.liveLoadConfig();
		}

		liveLoadConfig() {
			// If in browser, don't read config file, use default values
			if (typeof window !== 'undefined') {
				this.configPath = '';
				return;
			}

			this.updateConfigFromFile();

			if (this.live_reload_config && this.live_reload_config === true) {
				try {
					const fs = require('fs');
					fs.watchFile(this.configPath, { persistent: false }, (eventType, filename) => {
						this.updateConfigFromFile();
						if (!this.live_reload_config) {
							fs.unwatchFile(this.configPath);
						}
					});
				} catch (err) {
					// do nothing
				}
			}
		}

		setConfigPath(path) {
			if (path && path !== this.configPath) {
				this.configPath = path;
				this.liveLoadConfig();
			}
		}

		updateConfigFromFile() {
			const ConfigParser = require('configparser');
			var configparser = new ConfigParser();

			try {
				configparser.read(this.configPath); // If no error catched, indicates it's INI format
				this.config = configparser;
			} catch (error) {
				if (error.name && error.name === 'MissingSectionHeaderError') {
					// Not INI format, see if it's JSON format
					const fs = require('fs');
					var configData = fs.readFileSync(this.configPath, 'utf8');
					this.config = {
						_sections: JSON.parse(configData), // To match INI data format
					};
				}
			}

			if (this.config) this.updateConfigValues();
		}

		updateConfigValues() {
			this.logger.log_level = this.logger.getLogLevel(this.getConfigString('logging', 'log_level'));
			this.logger.log_format = this.logger.getLogFormat(this.getConfigString('logging', 'log_format'));
			this.logger.log_to_console =
				this.getConfigBoolean('logging', 'log_to_console') !== undefined
					? this.getConfigBoolean('logging', 'log_to_console')
					: this.logger.log_to_console;
			this.logger.log_file_path =
				this.getConfigString('logging', 'log_file_path') !== undefined
					? this.getConfigString('logging', 'log_file_path')
					: this.logger.log_file_path;
			this.logger.log_response_body =
				this.getConfigBoolean('logging', 'log_response_body') !== undefined
					? this.getConfigBoolean('logging', 'log_response_body')
					: this.logger.log_response_body;
			this.logger.log_request_body =
				this.getConfigBoolean('logging', 'log_request_body') !== undefined
					? this.getConfigBoolean('logging', 'log_request_body')
					: this.logger.log_request_body;
			this.live_reload_config =
				this.getConfigBoolean('general', 'live_reload_config') !== undefined
					? this.getConfigBoolean('general', 'live_reload_config')
					: this.live_reload_config;
			this.host = this.getConfigString('general', 'host') !== undefined ? this.getConfigString('general', 'host') : this.host;

			this.setEnvironment();

			// Update logging configs
			this.logger.setLogger();
		}

		setEnvironment(env) {
			// Default value
			if (env) this.environment = env;
			else this.environment = this.host ? this.host : 'mypurecloud.com';

			// Strip trailing slash
			this.environment = this.environment.replace(/\/+$/, '');

			// Strip protocol and subdomain
			if (this.environment.startsWith('https://')) this.environment = this.environment.substring(8);
			if (this.environment.startsWith('http://')) this.environment = this.environment.substring(7);
			if (this.environment.startsWith('api.')) this.environment = this.environment.substring(4);

			this.basePath = `https://api.${this.environment}`;
			this.authUrl = `https://login.${this.environment}`;
		}

		getConfigString(section, key) {
			if (this.config._sections[section]) return this.config._sections[section][key];
		}

		getConfigBoolean(section, key) {
			if (this.config._sections[section] && this.config._sections[section][key] !== undefined) {
				if (typeof this.config._sections[section][key] === 'string') {
					return this.config._sections[section][key] === 'true';
				} else return this.config._sections[section][key];
			}
		}
	}

	/**
	 * @module purecloud-guest-chat-client/ApiClient
	 * @version 8.0.0
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
				'PureCloud OAuth': {type: 'oauth2'},
				'Guest Chat JWT': {type: 'apiKey', 'in': 'header', name: 'Authorization', apiKeyPrefix: 'Bearer' }
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

			// Expose superagent module for use with superagent-proxy
			this.superagent = superagent;

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
					// return the array directly as SuperAgent will handle it as expected
					return param.map(this.paramToString);
				default:
					throw new Error(`Unknown collection format: ${collectionFormat}`);
			}
		}

		/**
		 * Applies authentication headers to the request.
		 * @param {Object} request The request object created by a <code>superagent()</code> call.
		 * @param {Array.<String>} authNames An array of authentication method names.
		 */
		applyAuthToRequest(request, authNames) {
			authNames.forEach((authName) => {
				var auth = this.authentications[authName];
				switch (auth.type) {
					case 'basic':
						if (auth.username || auth.password) {
							request.auth(auth.username || '', auth.password || '');
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
								request.set(data);
							} else {
								request.query(data);
							}
						}
						break;
					case 'oauth2':
						if (auth.accessToken) {
							request.set({'Authorization': `Bearer ${auth.accessToken}`});
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
			var request = superagent(httpMethod, url);

			if (this.proxy && request.proxy) {
				request.proxy(this.proxy);
			}

			// apply authentications
			this.applyAuthToRequest(request, authNames);

			// set query parameters
			request.query(this.normalizeParams(queryParams));

			// set header parameters
			request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));
			//request.set({ 'purecloud-sdk': '8.0.0' });

			// set request timeout
			request.timeout(this.timeout);

			var contentType = this.jsonPreferredMime(contentTypes);
			if (contentType) {
				request.type(contentType);
			} else if (!request.header['Content-Type']) {
				request.type('application/json');
			}

			if (contentType === 'application/x-www-form-urlencoded') {
				request.send(this.normalizeParams(formParams));
			} else if (contentType == 'multipart/form-data') {
				var _formParams = this.normalizeParams(formParams);
				for (var key in _formParams) {
					if (_formParams.hasOwnProperty(key)) {
						if (this.isFileParam(_formParams[key])) {
							// file field
							request.attach(key, _formParams[key]);
						} else {
							request.field(key, _formParams[key]);
						}
					}
				}
			} else if (bodyParam) {
				request.send(bodyParam);
			}

			var accept = this.jsonPreferredMime(accepts);
			if (accept) {
				request.accept(accept);
			}

			return new Promise((resolve, reject) => {
				request.end((error, response) => {
					if (error) {
						if (!response) {
							reject({
								status: 0,
								statusText: 'error',
								headers: [],
								body: {},
								text: 'error',
								error: error
							});
							return;
						}
					}

					// Build response object
					var data = (this.returnExtended === true || error) ? {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers,
						body: response.body,
						text: response.text,
						error: error
					} : response.body ? response.body : response.text;

					// Debug logging
					this.config.logger.log('trace', response.statusCode, httpMethod, url, request.header, response.headers, bodyParam, undefined);
					this.config.logger.log('debug', response.statusCode, httpMethod, url, request.header, undefined, bodyParam, undefined);

					// Resolve promise
					if (error) {
						// Log error
						this.config.logger.log(
							'error',
							response.statusCode,
							httpMethod,
							url,
							request.header,
							response.headers,
							bodyParam,
							response.body
						);
						reject(data);
					} else {
						resolve(data);
					}
				});
			});
		}
	}

	class WebChatApi {
		/**
		 * WebChat service.
		 * @module purecloud-guest-chat-client/api/WebChatApi
		 * @version 8.0.0
		 */

		/**
		 * Constructs a new WebChatApi. 
		 * @alias module:purecloud-guest-chat-client/api/WebChatApi
		 * @class
		 * @param {module:purecloud-guest-chat-client/ApiClient} apiClient Optional API client implementation to use,
		 * default to {@link module:purecloud-guest-chat-client/ApiClient#instance} if unspecified.
		 */
		constructor(apiClient) {
			this.apiClient = apiClient || ApiClient.instance;
		}


		/**
		 * Remove a member from a chat conversation
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} memberId memberId
		 */
		deleteWebchatGuestConversationMember(conversationId, memberId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling deleteWebchatGuestConversationMember';
			}
			// verify the required parameter 'memberId' is set
			if (memberId === undefined || memberId === null) {
				throw 'Missing the required parameter "memberId" when calling deleteWebchatGuestConversationMember';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}', 
				'DELETE', 
				{ 'conversationId': conversationId,'memberId': memberId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get a media request in the conversation
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} mediaRequestId mediaRequestId
		 */
		getWebchatGuestConversationMediarequest(conversationId, mediaRequestId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMediarequest';
			}
			// verify the required parameter 'mediaRequestId' is set
			if (mediaRequestId === undefined || mediaRequestId === null) {
				throw 'Missing the required parameter "mediaRequestId" when calling getWebchatGuestConversationMediarequest';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId}', 
				'GET', 
				{ 'conversationId': conversationId,'mediaRequestId': mediaRequestId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get all media requests to the guest in the conversation
		 * 
		 * @param {String} conversationId conversationId
		 */
		getWebchatGuestConversationMediarequests(conversationId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMediarequests';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/mediarequests', 
				'GET', 
				{ 'conversationId': conversationId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get a web chat conversation member
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} memberId memberId
		 */
		getWebchatGuestConversationMember(conversationId, memberId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMember';
			}
			// verify the required parameter 'memberId' is set
			if (memberId === undefined || memberId === null) {
				throw 'Missing the required parameter "memberId" when calling getWebchatGuestConversationMember';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}', 
				'GET', 
				{ 'conversationId': conversationId,'memberId': memberId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get the members of a chat conversation.
		 * 
		 * @param {String} conversationId conversationId
		 * @param {Object} opts Optional parameters
		 * @param {Number} opts.pageSize The number of entries to return per page, or omitted for the default. (default to 25)
		 * @param {Number} opts.pageNumber The page number to return, or omitted for the first page. (default to 1)
		 * @param {Boolean} opts.excludeDisconnectedMembers If true, the results will not contain members who have a DISCONNECTED state. (default to false)
		 */
		getWebchatGuestConversationMembers(conversationId, opts) { 
			opts = opts || {};
			
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMembers';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/members', 
				'GET', 
				{ 'conversationId': conversationId }, 
				{ 'pageSize': opts['pageSize'],'pageNumber': opts['pageNumber'],'excludeDisconnectedMembers': opts['excludeDisconnectedMembers'] }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get a web chat conversation message
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} messageId messageId
		 */
		getWebchatGuestConversationMessage(conversationId, messageId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMessage';
			}
			// verify the required parameter 'messageId' is set
			if (messageId === undefined || messageId === null) {
				throw 'Missing the required parameter "messageId" when calling getWebchatGuestConversationMessage';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/messages/{messageId}', 
				'GET', 
				{ 'conversationId': conversationId,'messageId': messageId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Get the messages of a chat conversation.
		 * 
		 * @param {String} conversationId conversationId
		 * @param {Object} opts Optional parameters
		 * @param {String} opts.after If available, get the messages chronologically after the id of this message
		 * @param {String} opts.before If available, get the messages chronologically before the id of this message
		 * @param {Object} opts.sortOrder Sort order (default to ascending)
		 * @param {Number} opts.maxResults Limit the returned number of messages, up to a maximum of 100 (default to 100)
		 */
		getWebchatGuestConversationMessages(conversationId, opts) { 
			opts = opts || {};
			
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling getWebchatGuestConversationMessages';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/messages', 
				'GET', 
				{ 'conversationId': conversationId }, 
				{ 'after': opts['after'],'before': opts['before'],'sortOrder': opts['sortOrder'],'maxResults': opts['maxResults'] }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Update a media request in the conversation, setting the state to ACCEPTED/DECLINED/ERRORED
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} mediaRequestId mediaRequestId
		 * @param {Object} body Request
		 */
		patchWebchatGuestConversationMediarequest(conversationId, mediaRequestId, body) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling patchWebchatGuestConversationMediarequest';
			}
			// verify the required parameter 'mediaRequestId' is set
			if (mediaRequestId === undefined || mediaRequestId === null) {
				throw 'Missing the required parameter "mediaRequestId" when calling patchWebchatGuestConversationMediarequest';
			}
			// verify the required parameter 'body' is set
			if (body === undefined || body === null) {
				throw 'Missing the required parameter "body" when calling patchWebchatGuestConversationMediarequest';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId}', 
				'PATCH', 
				{ 'conversationId': conversationId,'mediaRequestId': mediaRequestId }, 
				{  }, 
				{  }, 
				{  }, 
				body, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Send a message in a chat conversation.
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} memberId memberId
		 * @param {Object} body Message
		 */
		postWebchatGuestConversationMemberMessages(conversationId, memberId, body) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling postWebchatGuestConversationMemberMessages';
			}
			// verify the required parameter 'memberId' is set
			if (memberId === undefined || memberId === null) {
				throw 'Missing the required parameter "memberId" when calling postWebchatGuestConversationMemberMessages';
			}
			// verify the required parameter 'body' is set
			if (body === undefined || body === null) {
				throw 'Missing the required parameter "body" when calling postWebchatGuestConversationMemberMessages';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/messages', 
				'POST', 
				{ 'conversationId': conversationId,'memberId': memberId }, 
				{  }, 
				{  }, 
				{  }, 
				body, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Send a typing-indicator in a chat conversation.
		 * 
		 * @param {String} conversationId conversationId
		 * @param {String} memberId memberId
		 */
		postWebchatGuestConversationMemberTyping(conversationId, memberId) { 
			// verify the required parameter 'conversationId' is set
			if (conversationId === undefined || conversationId === null) {
				throw 'Missing the required parameter "conversationId" when calling postWebchatGuestConversationMemberTyping';
			}
			// verify the required parameter 'memberId' is set
			if (memberId === undefined || memberId === null) {
				throw 'Missing the required parameter "memberId" when calling postWebchatGuestConversationMemberTyping';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/typing', 
				'POST', 
				{ 'conversationId': conversationId,'memberId': memberId }, 
				{  }, 
				{  }, 
				{  }, 
				null, 
				['Guest Chat JWT'], 
				['application/json'], 
				['application/json']
			);
		}

		/**
		 * Create an ACD chat conversation from an external customer.
		 * This endpoint will create a new ACD Chat conversation under the specified Chat Deployment.  The conversation will begin with a guest member in it (with a role=CUSTOMER) according to the customer information that is supplied. If the guest member is authenticated, the &#39;memberAuthToken&#39; field should include his JWT as generated by the &#39;POST /api/v2/signeddata&#39; resource; if the guest member is anonymous (and the Deployment permits it) this field can be omitted.  The returned data includes the IDs of the conversation created, along with a newly-create JWT token that you can supply to all future endpoints as authentication to perform operations against that conversation. After successfully creating a conversation, you should connect a websocket to the event stream named in the &#39;eventStreamUri&#39; field of the response; the conversation is not routed until the event stream is attached.
		 * @param {Object} body CreateConversationRequest
		 */
		postWebchatGuestConversations(body) { 
			// verify the required parameter 'body' is set
			if (body === undefined || body === null) {
				throw 'Missing the required parameter "body" when calling postWebchatGuestConversations';
			}

			return this.apiClient.callApi(
				'/api/v2/webchat/guest/conversations', 
				'POST', 
				{  }, 
				{  }, 
				{  }, 
				{  }, 
				body, 
				[], 
				['application/json'], 
				['application/json']
			);
		}

	}

	/**
	 * A JavaScript library to interface with the PureCloud Platform API.<br>
	 * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
	 * <p>
	 * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
	 * <pre>
	 * var platformClient = require('purecloud-guest-chat-client/index'); // See note below*.
	 * var xxxSvc = new platformClient.XxxApi(); // Allocate the API class we're going to use.
	 * var yyyModel = new platformClient.Yyy(); // Construct a model instance.
	 * yyyModel.someProperty = 'someValue';
	 * ...
	 * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
	 * ...
	 * </pre>
	 * <em>*NOTE: For a top-level AMD script, use require(['purecloud-guest-chat-client/index'], function(){...})
	 * and put the application logic within the callback function.</em>
	 * </p>
	 * <p>
	 * A non-AMD browser application (discouraged) might do something like this:
	 * <pre>
	 * var xxxSvc = new platformClient.XxxApi(); // Allocate the API class we're going to use.
	 * var yyy = new platformClient.Yyy(); // Construct a model instance.
	 * yyyModel.someProperty = 'someValue';
	 * ...
	 * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
	 * ...
	 * </pre>
	 * </p>
	 * @module purecloud-guest-chat-client/index
	 * @version 8.0.0
	 */
	class platformClient {
		constructor() {
			/**
			 * The ApiClient constructor.
			 * @property {module:purecloud-guest-chat-client/ApiClient}
			 */
			this.ApiClient = new ApiClient();
			/**
			 * The WebChatApi service constructor.
			 * @property {module:purecloud-guest-chat-client/api/WebChatApi}
			 */
			this.WebChatApi = WebChatApi;
			/**
			 * The PureCloudRegionsHost Object.
			 * @property {module:purecloud-guest-chat-client/MyPureCloudRegionHost}
			 */
			this.PureCloudRegionHosts = PureCloudRegionHosts;
		}
	}

	//export default platformClient;
	var index = new platformClient();

	return index;

});
