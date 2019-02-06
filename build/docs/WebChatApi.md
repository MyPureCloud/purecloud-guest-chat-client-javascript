---
title: WebChatApi
ispreview: true
---
# platformClient.WebChatApi

All URIs are relative to *https://api.mypurecloud.com*

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
[**deleteWebchatGuestConversationMember**](WebChatApi.html#deleteWebchatGuestConversationMember) | **DELETE** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId} | Remove a member from a chat conversation
[**getWebchatGuestConversationMember**](WebChatApi.html#getWebchatGuestConversationMember) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId} | Get a web chat conversation member
[**getWebchatGuestConversationMembers**](WebChatApi.html#getWebchatGuestConversationMembers) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/members | Get the members of a chat conversation.
[**getWebchatGuestConversationMessage**](WebChatApi.html#getWebchatGuestConversationMessage) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/messages/{messageId} | Get a web chat conversation message
[**getWebchatGuestConversationMessages**](WebChatApi.html#getWebchatGuestConversationMessages) | **GET** /api/v2/webchat/guest/conversations/{conversationId}/messages | Get the messages of a chat conversation.
[**postWebchatGuestConversationMemberMessages**](WebChatApi.html#postWebchatGuestConversationMemberMessages) | **POST** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/messages | Send a message in a chat conversation.
[**postWebchatGuestConversationMemberTyping**](WebChatApi.html#postWebchatGuestConversationMemberTyping) | **POST** /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/typing | Send a typing-indicator in a chat conversation.
[**postWebchatGuestConversations**](WebChatApi.html#postWebchatGuestConversations) | **POST** /api/v2/webchat/guest/conversations | Create an ACD chat conversation from an external customer.
{: class="table table-striped"}

<a name="deleteWebchatGuestConversationMember"></a>

# void deleteWebchatGuestConversationMember(conversationId, memberId)



DELETE /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}

Remove a member from a chat conversation



Requires NO permissions: 




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
{: class="table table-striped"}

### Return type

void (no response body)

<a name="getWebchatGuestConversationMember"></a>

# WebChatMemberInfo getWebchatGuestConversationMember(conversationId, memberId)



GET /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}

Get a web chat conversation member



Requires NO permissions: 




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
{: class="table table-striped"}

### Return type

**WebChatMemberInfo**

<a name="getWebchatGuestConversationMembers"></a>

# WebChatMemberInfoEntityList getWebchatGuestConversationMembers(conversationId, opts)



GET /api/v2/webchat/guest/conversations/{conversationId}/members

Get the members of a chat conversation.



Requires NO permissions: 




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
{: class="table table-striped"}

### Return type

**WebChatMemberInfoEntityList**

<a name="getWebchatGuestConversationMessage"></a>

# WebChatMessage getWebchatGuestConversationMessage(conversationId, messageId)



GET /api/v2/webchat/guest/conversations/{conversationId}/messages/{messageId}

Get a web chat conversation message



Requires NO permissions: 




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
{: class="table table-striped"}

### Return type

**WebChatMessage**

<a name="getWebchatGuestConversationMessages"></a>

# WebChatMessageEntityList getWebchatGuestConversationMessages(conversationId, opts)



GET /api/v2/webchat/guest/conversations/{conversationId}/messages

Get the messages of a chat conversation.



Requires NO permissions: 




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
  'before': "before_example" // String | If available, get the messages chronologically before the id of this message
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
{: class="table table-striped"}

### Return type

**WebChatMessageEntityList**

<a name="postWebchatGuestConversationMemberMessages"></a>

# WebChatMessage postWebchatGuestConversationMemberMessages(conversationId, memberId, body)



POST /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/messages

Send a message in a chat conversation.



Requires NO permissions: 



### Request Body Schema

<script type="text/javascript">
	function copyCreateWebChatMessageRequestExample() {
		let temp = $("<textarea>");
		$("body").append(temp);
		temp.val($('#CreateWebChatMessageRequestExample').text()).select();
		document.execCommand("copy");
		temp.remove();
		return false;
	}
</script>

CreateWebChatMessageRequest <a href="#" onclick="return copyCreateWebChatMessageRequestExample()">Copy</a>

<div id="CreateWebChatMessageRequestExample">

```{"language":"json", "maxHeight": "250px"}
{ 
  "body": String, 
}
```

</div>


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
{: class="table table-striped"}

### Return type

**WebChatMessage**

<a name="postWebchatGuestConversationMemberTyping"></a>

# WebChatTyping postWebchatGuestConversationMemberTyping(conversationId, memberId)



POST /api/v2/webchat/guest/conversations/{conversationId}/members/{memberId}/typing

Send a typing-indicator in a chat conversation.



Requires NO permissions: 




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
{: class="table table-striped"}

### Return type

**WebChatTyping**

<a name="postWebchatGuestConversations"></a>

# CreateWebChatConversationResponse postWebchatGuestConversations(body)



POST /api/v2/webchat/guest/conversations

Create an ACD chat conversation from an external customer.



Requires NO permissions: 



### Request Body Schema

<script type="text/javascript">
	function copyCreateWebChatConversationRequestExample() {
		let temp = $("<textarea>");
		$("body").append(temp);
		temp.val($('#CreateWebChatConversationRequestExample').text()).select();
		document.execCommand("copy");
		temp.remove();
		return false;
	}
</script>

CreateWebChatConversationRequest <a href="#" onclick="return copyCreateWebChatConversationRequestExample()">Copy</a>

<div id="CreateWebChatConversationRequestExample">

```{"language":"json", "maxHeight": "250px"}
{ 
  "organizationId": String, 
  "deploymentId": String, 
  "routingTarget": { 
    "targetType": String, 
    "targetAddress": String, 
    "skills": [String], 
    "language": String, 
    "priority": Number, 
  },  
  "memberInfo": { 
    "id": String, 
    "displayName": String, 
    "profileImageUrl": String, 
    "role": String, 
    "joinDate": Date, 
    "leaveDate": Date, 
    "authenticatedGuest": Boolean, 
    "customFields": {String: String}, 
    "state": String, 
  },  
  "memberAuthToken": String, 
}
```

</div>


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
{: class="table table-striped"}

### Return type

**CreateWebChatConversationResponse**

