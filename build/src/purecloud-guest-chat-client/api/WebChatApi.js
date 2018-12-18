import ApiClient from '../ApiClient.js';


class WebChatApi {
	/**
	 * WebChat service.
	 * @module purecloud-guest-chat-client/api/WebChatApi
	 * @version 1.0.0
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
			{ 'after': opts['after'],'before': opts['before'] }, 
			{  }, 
			{  }, 
			null, 
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
	 * 
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


export default WebChatApi;