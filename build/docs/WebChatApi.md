# platformClient.WebChatApi

All URIs are relative to *https://api.mypurecloud.com*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
[**deleteWebchatGuestConversationMember**](#deleteWebchatGuestConversationMember) | **DELETE** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId} | Remove a member from a chat conversation
[**getWebchatGuestConversationMediarequest**](#getWebchatGuestConversationMediarequest) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId} | Get a media request in the conversation
[**getWebchatGuestConversationMediarequests**](#getWebchatGuestConversationMediarequests) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/mediarequests | Get all media requests to the guest in the conversation
[**getWebchatGuestConversationMember**](#getWebchatGuestConversationMember) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId} | Get a web chat conversation member
[**getWebchatGuestConversationMembers**](#getWebchatGuestConversationMembers) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/members | Get the members of a chat conversation.
[**getWebchatGuestConversationMessage**](#getWebchatGuestConversationMessage) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/messages/{messageId} | Get a web chat conversation message
[**getWebchatGuestConversationMessages**](#getWebchatGuestConversationMessages) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/messages | Get the messages of a chat conversation.
[**patchWebchatGuestConversationMediarequest**](#patchWebchatGuestConversationMediarequest) | **PATCH** /api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId} | Update a media request in the conversation, setting the state to ACCEPTED/DECLINED/ERRORED
[**postWebchatGuestConversationMemberMessages**](#postWebchatGuestConversationMemberMessages) | **POST** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/messages | Send a message in a chat conversation.
[**postWebchatGuestConversationMemberTyping**](#postWebchatGuestConversationMemberTyping) | **POST** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/typing | Send a typing-indicator in a chat conversation.
[**postWebchatGuestConversations**](#postWebchatGuestConversations) | **POST** /api/v2/webchat/guest/conversations | Create an ACD chat conversation from an external customer.


## deleteWebchatGuestConversationMember

> void deleteWebchatGuestConversationMember(conversationId, memberId)



DELETE /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}

Remove a member from a chat conversation

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let memberId = "memberId_example"; // String | memberId

apiInstance.deleteWebchatGuestConversationMember(conversationId, memberId)
  .then(() => {
    console.log('deleteWebchatGuestConversationMember returned successfully.');
  })
  .catch((err) => {
    console.log('There was a failure calling deleteWebchatGuestConversationMember');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **memberId** | **String** | memberId |  |

### Return type

void (no response body)

## getWebchatGuestConversationMediarequest

> WebChatGuestMediaRequest getWebchatGuestConversationMediarequest(conversationId, mediaRequestId)



GET /api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId}

Get a media request in the conversation

This endpoint is deprecated. Please see the article https://help.mypurecloud.com/articles/deprecation-legacy-co-browse-and-screenshare/

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let mediaRequestId = "mediaRequestId_example"; // String | mediaRequestId

apiInstance.getWebchatGuestConversationMediarequest(conversationId, mediaRequestId)
  .then((data) => {
    console.log(`getWebchatGuestConversationMediarequest success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMediarequest');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **mediaRequestId** | **String** | mediaRequestId |  |

### Return type

**WebChatGuestMediaRequest**

## getWebchatGuestConversationMediarequests

> WebChatGuestMediaRequestEntityList getWebchatGuestConversationMediarequests(conversationId)



GET /api/v2/webchat/guest/conversations/{conversationId}/mediarequests

Get all media requests to the guest in the conversation

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId

apiInstance.getWebchatGuestConversationMediarequests(conversationId)
  .then((data) => {
    console.log(`getWebchatGuestConversationMediarequests success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMediarequests');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |

### Return type

**WebChatGuestMediaRequestEntityList**

## getWebchatGuestConversationMember

> WebChatMemberInfo getWebchatGuestConversationMember(conversationId, memberId)



GET /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}

Get a web chat conversation member

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let memberId = "memberId_example"; // String | memberId

apiInstance.getWebchatGuestConversationMember(conversationId, memberId)
  .then((data) => {
    console.log(`getWebchatGuestConversationMember success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMember');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **memberId** | **String** | memberId |  |

### Return type

**WebChatMemberInfo**

## getWebchatGuestConversationMembers

> WebChatMemberInfoEntityList getWebchatGuestConversationMembers(conversationId, opts)



GET /api/v2/webchat/guest/conversations/{conversationId}/members

Get the members of a chat conversation.

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let opts = { 
  'pageSize': 25, // Number | The number of entries to return per page, or omitted for the default.
  'pageNumber': 1, // Number | The page number to return, or omitted for the first page.
  'excludeDisconnectedMembers': false // Boolean | If true, the results will not contain members who have a DISCONNECTED state.
};

apiInstance.getWebchatGuestConversationMembers(conversationId, opts)
  .then((data) => {
    console.log(`getWebchatGuestConversationMembers success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMembers');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **pageSize** | **Number** | The number of entries to return per page, or omitted for the default. | [optional] [default to 25] |
 **pageNumber** | **Number** | The page number to return, or omitted for the first page. | [optional] [default to 1] |
 **excludeDisconnectedMembers** | **Boolean** | If true, the results will not contain members who have a DISCONNECTED state. | [optional] [default to false] |

### Return type

**WebChatMemberInfoEntityList**

## getWebchatGuestConversationMessage

> WebChatMessage getWebchatGuestConversationMessage(conversationId, messageId)



GET /api/v2/webchat/guest/conversations/{conversationId}/messages/{messageId}

Get a web chat conversation message

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let messageId = "messageId_example"; // String | messageId

apiInstance.getWebchatGuestConversationMessage(conversationId, messageId)
  .then((data) => {
    console.log(`getWebchatGuestConversationMessage success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMessage');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **messageId** | **String** | messageId |  |

### Return type

**WebChatMessage**

## getWebchatGuestConversationMessages

> WebChatMessageEntityList getWebchatGuestConversationMessages(conversationId, opts)



GET /api/v2/webchat/guest/conversations/{conversationId}/messages

Get the messages of a chat conversation.

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let opts = { 
  'after': "after_example", // String | If available, get the messages chronologically after the id of this message
  'before': "before_example", // String | If available, get the messages chronologically before the id of this message
  'sortOrder': "ascending", // String | Sort order
  'maxResults': 100 // Number | Limit the returned number of messages, up to a maximum of 100
};

apiInstance.getWebchatGuestConversationMessages(conversationId, opts)
  .then((data) => {
    console.log(`getWebchatGuestConversationMessages success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling getWebchatGuestConversationMessages');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **after** | **String** | If available, get the messages chronologically after the id of this message | [optional]  |
 **before** | **String** | If available, get the messages chronologically before the id of this message | [optional]  |
 **sortOrder** | **String** | Sort order | [optional] [default to ascending]<br />**Values**: ascending, descending |
 **maxResults** | **Number** | Limit the returned number of messages, up to a maximum of 100 | [optional] [default to 100] |

### Return type

**WebChatMessageEntityList**

## patchWebchatGuestConversationMediarequest

> WebChatGuestMediaRequest patchWebchatGuestConversationMediarequest(conversationId, mediaRequestId, body)



PATCH /api/v2/webchat/guest/conversations/{conversationId}/mediarequests/{mediaRequestId}

Update a media request in the conversation, setting the state to ACCEPTED/DECLINED/ERRORED

This endpoint is deprecated. Please see the article https://help.mypurecloud.com/articles/deprecation-legacy-co-browse-and-screenshare/

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let mediaRequestId = "mediaRequestId_example"; // String | mediaRequestId
let body = {}; // Object | Request

apiInstance.patchWebchatGuestConversationMediarequest(conversationId, mediaRequestId, body)
  .then((data) => {
    console.log(`patchWebchatGuestConversationMediarequest success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling patchWebchatGuestConversationMediarequest');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **mediaRequestId** | **String** | mediaRequestId |  |
 **body** | **Object** | Request |  |

### Return type

**WebChatGuestMediaRequest**

## postWebchatGuestConversationMemberMessages

> WebChatMessage postWebchatGuestConversationMemberMessages(conversationId, memberId, body)



POST /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/messages

Send a message in a chat conversation.

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let memberId = "memberId_example"; // String | memberId
let body = {}; // Object | Message

apiInstance.postWebchatGuestConversationMemberMessages(conversationId, memberId, body)
  .then((data) => {
    console.log(`postWebchatGuestConversationMemberMessages success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling postWebchatGuestConversationMemberMessages');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **memberId** | **String** | memberId |  |
 **body** | **Object** | Message |  |

### Return type

**WebChatMessage**

## postWebchatGuestConversationMemberTyping

> WebChatTyping postWebchatGuestConversationMemberTyping(conversationId, memberId)



POST /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/typing

Send a typing-indicator in a chat conversation.

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

// Set JWT from the create chat response
platformClient.ApiClient.instance.setJwt(chatInfo.jwt);

let apiInstance = new platformClient.WebChatApi();

let conversationId = "conversationId_example"; // String | conversationId
let memberId = "memberId_example"; // String | memberId

apiInstance.postWebchatGuestConversationMemberTyping(conversationId, memberId)
  .then((data) => {
    console.log(`postWebchatGuestConversationMemberTyping success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling postWebchatGuestConversationMemberTyping');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **conversationId** | **String** | conversationId |  |
 **memberId** | **String** | memberId |  |

### Return type

**WebChatTyping**

## postWebchatGuestConversations

> CreateWebChatConversationResponse postWebchatGuestConversations(body)



POST /api/v2/webchat/guest/conversations

Create an ACD chat conversation from an external customer.

This endpoint will create a new ACD Chat conversation under the specified Chat Deployment.  The conversation will begin with a guest member in it (with a role&#x3D;CUSTOMER) according to the customer information that is supplied. If the guest member is authenticated, the memberAuthToken field should include his JWT as generated by the POST /api/v2/signeddata resource; if the guest member is anonymous (and the Deployment permits it) this field can be omitted.  The returned data includes the IDs of the conversation created, along with a newly-create JWT token that you can supply to all future endpoints as authentication to perform operations against that conversation. After successfully creating a conversation, you should connect a websocket to the event stream named in the eventStreamUri field of the response; the conversation is not routed until the event stream is attached.

Requires  permissions: 




### Example Usage

```{"language":"javascript"}
// Browser
const platformClient = require('platformClient');
// Node
const platformClient = require('purecloud-guest-chat-client');

let apiInstance = new platformClient.WebChatApi();

let body = {}; // Object | CreateConversationRequest

apiInstance.postWebchatGuestConversations(body)
  .then((data) => {
    console.log(`postWebchatGuestConversations success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log('There was a failure calling postWebchatGuestConversations');
    console.error(err);
  });

```

### Parameters


| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
 **body** | **Object** | CreateConversationRequest |  |

### Return type

**CreateWebChatConversationResponse**


_purecloud-guest-chat-client@14.4.0_
