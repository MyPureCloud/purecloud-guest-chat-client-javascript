# Guest Chat Client - JavaScript

## Resources

[![GitHub release](https://img.shields.io/github/release/mypurecloud/purecloud-guest-chat-client-javascript.svg)](https://github.com/MyPureCloud/purecloud-guest-chat-client-javascript)
[![npm](https://img.shields.io/npm/v/purecloud-guest-chat-client.svg)](https://www.npmjs.com/package/purecloud-guest-chat-client)
[![Release Notes Badge](https://developer-content.genesys.cloud/images/sdk-release-notes.png)](https://github.com/MyPureCloud/purecloud-guest-chat-client-javascript/blob/master/releaseNotes.md)

[Platform release notes](releaseNotes.md)

* **Documentation** https://mypurecloud.github.io/purecloud-guest-chat-client-javascript/
* **Source** https://github.com/MyPureCloud/purecloud-guest-chat-client-javascript
* **Guest chat documentation** https://developer.genesys.cloud/commdigital/digital/webchat/guestchat

Documentation version purecloud-guest-chat-client@15.4.0

## CommonJS

For node.js via [NPM](https://www.npmjs.com/package/purecloud-guest-chat-client):

```sh
npm install purecloud-guest-chat-client
```

```javascript
// Obtain a reference to the platformClient object
const platformClient = require('purecloud-guest-chat-client');
```

For direct use in a browser script:

```html
<!-- Include the CJS SDK -->
<script src="https://sdk-cdn.mypurecloud.com/javascript-guest/15.4.0/purecloud-guest-chat-client.min.js"></script>

<script type="text/javascript">
  // Obtain a reference to the platformClient object
  const platformClient = require('platformClient');
</script>
```


## AMD

```html
<!-- Include requirejs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.min.js"></script>

<script type="text/javascript">
  // Obtain a reference to the platformClient object
  requirejs(['https://sdk-cdn.mypurecloud.com/javascript-guest/amd/15.4.0/purecloud-guest-chat-client.min.js'], (platformClient) => {
    console.log(platformClient);
  });
</script>
```

## ES6 Classes and Other Entry Points

The node package's [package.json](https://github.com/MyPureCloud/purecloud-guest-chat-client-javascript/blob/master/build/package.json) file contains the following entry points for use with various packaging systems:

* **jsnext:main** and **module**
  * Entry point: src/purecloud-guest-chat-client/index.js
  * The main ES6 class in the source code
* **main**
  * Entry point: dist/node/purecloud-guest-chat-client.js
  * The CJS module for node apps
* **browser**
  * Entry point: dist/web-cjs/purecloud-guest-chat-client.min.js
  * The [Browserify](http://browserify.org/)ed CJS module for standalone use in a browser

## Using the "latest" SDK

Want your app to always use the most recent version of the SDK? To do this, simply use `latest` instead of the version number: 

* CJS: `https://sdk-cdn.mypurecloud.com/javascript-guest/latest/purecloud-guest-chat-client.min.js`
* AMD: `https://sdk-cdn.mypurecloud.com/javascript-guest/amd/latest/purecloud-guest-chat-client.min.js`


## Using the SDK

### Creating a chat

The guest chat APIs do not require standard Genesys Cloud authentication, but do require the JWT to be set for all API calls other than creating a new chat.  

```javascript
const client = platformClient.ApiClient.instance;
let chatInfo, socket;

// Create API instance
const webChatApi = new platformClient.WebChatApi();

const createChatBody = {
  organizationId: '12b1a3fe-7a80-4b50-45fs-df88c0f9efad',
  deploymentId: 'a3e316a7-ec8b-4fe9-5a49-dded9dcc097e',
  routingTarget: {
    targetType: 'QUEUE',
    targetAddress: 'Chat Queue',
  },
  memberInfo: {
    displayName: 'JavaScript Guest',
    profileImageUrl: 'http://yoursite.com/path/to/guest/image.png',
    customFields: {
      firstName: 'John', 
      lastName: 'Doe'
    }
  }
};

// Create chat
webChatApi.postWebchatGuestConversations(createChatBody)
  .then((createChatResponse) => {
    // Store chat info
    chatInfo = createChatResponse;

    // Set JWT
    client.setJwt(chatInfo.jwt);

    // Connect to notifications
    socket = new WebSocket(chatInfo.eventStreamUri);

    // Connection opened
    socket.addEventListener('open', function (event) {
      console.log('WebSocket connected');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      const message = JSON.parse(event.data);

      // Chat message
      if (message.metadata) {
        switch(message.metadata.type) {
          case 'message': {
            // Handle message from member
            break;
          }
          case 'member-change': {
            // Handle member state change
            break;
          }
          default: {
            console.log('Unknown message type: ' + message.metadata.type);
          }
        }
      }

    });
  })
  .catch(console.error);
```

## SDK Logging

Logging of API requests and responses can be controlled by a number of parameters on the `Configuration`'s `Logger` instance.

`log_level` values:
1. LTrace (HTTP Method, URL, Request Body, HTTP Status Code, Request Headers, Response Headers)
2. LDebug (HTTP Method, URL, Request Body, HTTP Status Code, Request Headers)
3. LError (HTTP Method, URL, Request Body, Response Body, HTTP Status Code, Request Headers, Response Headers)
4. LNone - default

`log_format` values:
1. JSON
2. TEXT - default

By default, the request and response bodies are not logged because these can contain PII. Be mindful of this data if choosing to log it.  
To log to a file, provide a `log_file_path` value. SDK users are responsible for the rotation of the log file. This feature is not available in browser-based applications.

Example logging configuration:

```javascript
client.config.logger.log_level = client.config.logger.logLevelEnum.level.LTrace;
client.config.logger.log_format = client.config.logger.logFormatEnum.formats.JSON;
client.config.logger.log_request_body = true;
client.config.logger.log_response_body = true;
client.config.logger.log_to_console = true;
client.config.logger.log_file_path = "/var/log/javascriptguestsdk.log";

client.config.logger.setLogger(); // To apply above changes
```

#### Configuration file

**Note:** This feature is not available in browser-based applications

A number of configuration parameters can be applied using a configuration file. There are two sources for this file:

1. The SDK will look for `%USERPROFILE%\.genesyscloudjavascript-guest\config` on Windows if the environment variable USERPROFILE is defined, otherwise uses the path to the profile directory of the current user as home, or `$HOME/.genesyscloudjavascript-guest/config` on Unix.
2. Provide a valid file path to `client.config.setConfigPath()`

The SDK will constantly check to see if the config file has been updated, regardless of whether a config file was present at start-up. To disable this behaviour, set `client.config.live_reload_config` to false.  
INI and JSON formats are supported. See below for examples of configuration values in both formats:

INI:

```ini
[logging]
log_level = trace
log_format = text
log_to_console = false
log_file_path = /var/log/javascriptguestsdk.log
log_response_body = false
log_request_body = false
[general]
live_reload_config = true
host = https://api.mypurecloud.com
```

JSON:

```json
{
    "logging": {
        "log_level": "trace",
        "log_format": "text",
        "log_to_console": false,
        "log_file_path": "/var/log/javascriptguestsdk.log",
        "log_response_body": false,
        "log_request_body": false
    },
    "general": {
        "live_reload_config": true,
        "host": "https://api.mypurecloud.com"
    }
}
```

## Environments

If connecting to a Genesys Cloud environment other than mypurecloud.com (e.g. mypurecloud.ie), set the environment on the `ApiClient` instance.

```javascript
const client = platformClient.ApiClient.instance;
client.setEnvironment(platformClient.PureCloudRegionHosts.eu_west_1);
```


## Making Requests

All API requests return a Promise which resolves to the response body, otherwise it rejects with an error. After setting the JWT, the following code will make an authenticated request:

```javascript
// Create API instance
const webChatApi = new platformClient.WebChatApi();

// Authenticate
webChatApi.postWebchatGuestConversations(createChatBody)
  .then(() => { 
    // Set JWT
    platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

    // Send a message
    return webChatApi.postWebchatGuestConversationMemberMessages(chatInfo.id, chatInfo.member.id, { 
      body: 'Message from chat guest' 
    });
  })
  .then(() => {
    // Message sent
  })
  .catch((err) => {
    // Handle failure response
    console.log(err);
  });
```


### Extended Responses

By default, the SDK will return only the response body as the result of an API function call. To retrieve additional information about the response, enable extended responses. This will return the extended response for all API function calls:

```javascript
const client = platformClient.ApiClient.instance;
client.setReturnExtendedResponses(true);
```

Extended response object example (`body` and `text` have been truncated):

```json
{
  "status": 200,
  "statusText": "",
  "headers": {
    "pragma": "no-cache",
    "inin-correlation-id": "ec35f2a8-289b-42d4-8893-c50eaf81a3c1",
    "content-type": "application/json",
    "cache-control": "no-cache, no-store, must-revalidate",
    "expires": "0"
  },
  "body": {},
  "text": "",
  "error": null
}
```


### Using a Proxy (Node.js only)

Using a proxy is accomplished by setting the proxy settings on the `client` object

NOTE: SDK proxy configuration is only available in the node.js package due to the axios proxy incompatibility with browsers.

```javascript
const client = platformClient.ApiClient.instance;
// Documentation: https://axios-http.com/docs/req_config
client.proxy = {
  host: '172.1.1.100',
  port: 443,
  protocol: 'https',
  auth: {
    username: 'john_doe',
    password: 'abc123'
  }
};
```


### Error Responses

Error responses will always be thrown as an extended response object. Note that the `error` property will contain a JavaScript [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) object.

Example error response object:

```json
{
  "status": 404,
  "statusText": "",
  "headers": {
    "pragma": "no-cache",
    "inin-correlation-id": "d11bd3b3-ab7e-4fd4-9687-d04af9f30a63",
    "content-type": "application/json",
    "cache-control": "no-cache, no-store, must-revalidate",
    "expires": "0"
  },
  "body": {
    "status": 404,
    "code": "not.found",
    "message": "The requested operation failed with status 404",
    "contextId": "d11bd3b3-ab7e-4fd4-9687-d04af9f30a63",
    "details": [],
    "errors": []
  },
  "text": "{\"status\":404,\"code\":\"not.found\",\"message\":\"The requested operation failed with status 404\",\"contextId\":\"d11bd3b3-ab7e-4fd4-9687-d04af9f30a63\",\"details\":[],\"errors\":[]}",
  "error": {
    "original": null
  }
}
```


## Versioning

The SDK's version is incremented according to the [Semantic Versioning Specification](https://semver.org/). The decision to increment version numbers is determined by [diffing the Platform API's swagger](https://github.com/purecloudlabs/platform-client-sdk-common/blob/master/modules/swaggerDiff.js) for automated builds, and optionally forcing a version bump when a build is triggered manually (e.g. releasing a bugfix).


## Support

This package is intended to be forwards compatible with v2 of Genesys Cloud's Platform API. While the general policy for the API is not to introduce breaking changes, there are certain additions and changes to the API that cause breaking changes for the SDK, often due to the way the API is expressed in its swagger definition. Because of this, the SDK can have a major version bump while the API remains at major version 2. While the SDK is intended to be forward compatible, patches will only be released to the latest version. For these reasons, it is strongly recommended that all applications using this SDK are kept up to date and use the latest version of the SDK.

For any issues, questions, or suggestions for the SDK, visit the [Genesys Cloud Developer Community](https://community.genesys.com/communities/community-home1/digestviewer?CommunityKey=a39cc4d6-857e-43cb-be7b-019581ab9f38).
