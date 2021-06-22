import PureCloudRegionHosts from './PureCloudRegionHosts.js';
import ApiClient from './ApiClient.js';
import WebChatApi from './api/WebChatApi.js';


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
export default new platformClient();
