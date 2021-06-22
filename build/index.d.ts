import platformClient = require('purecloud-guest-chat-client');
import Configuration = require('./src/purecloud-guest-chat-client/configuration');

declare module 'purecloud-guest-chat-client' {
	export const ApiClient: ApiClientClass;
}

declare class ApiClientClass {
	instance: ApiClientClass;
	proxy: ProxyConfig;
	superagent: any;
	config: Configuration;

	callApi(path: string, httpMethod: string, pathParams: { [key: string]: string; }, queryParams: { [key: string]: object; }, headerParams: { [key: string]: object; }, formParams: { [key: string]: object; }, bodyParam: any, authNames: Array<string>, contentTypes: Array<string>, accepts: Array<string>): Promise<any>;
	setJwt(jwt: string): void;
	setEnvironment(environment: string): void;
	setPersistSettings(doPersist: boolean, prefix?: string): void;
	setReturnExtendedResponses(returnExtended: boolean): void;
	setStorageKey(storageKey: string): void;
}

declare class LoginImplicitGrantOptions {
	state?: string;
}

declare class AuthData {
	accessToken: string;
	state?: string;
	tokenExpiryTime: number;
	tokenExpiryTimeString: string;
}

declare class ProxyConfig {
	host: string;
	port: number;
	protocol: string;
}

declare class WebChatApi {  
  	deleteWebchatGuestConversationMember(conversationId: string, memberId: string): Promise<void>; 
  	getWebchatGuestConversationMediarequest(conversationId: string, mediaRequestId: string): Promise<Models.WebChatGuestMediaRequest>; 
  	getWebchatGuestConversationMediarequests(conversationId: string): Promise<Models.WebChatGuestMediaRequestEntityList>; 
  	getWebchatGuestConversationMember(conversationId: string, memberId: string): Promise<Models.WebChatMemberInfo>; 
  	getWebchatGuestConversationMembers(conversationId: string, opts?: WebChatApi.getWebchatGuestConversationMembersOptions): Promise<Models.WebChatMemberInfoEntityList>; 
  	getWebchatGuestConversationMessage(conversationId: string, messageId: string): Promise<Models.WebChatMessage>; 
  	getWebchatGuestConversationMessages(conversationId: string, opts?: WebChatApi.getWebchatGuestConversationMessagesOptions): Promise<Models.WebChatMessageEntityList>; 
  	patchWebchatGuestConversationMediarequest(conversationId: string, mediaRequestId: string, body: Models.WebChatGuestMediaRequest): Promise<Models.WebChatGuestMediaRequest>; 
  	postWebchatGuestConversationMemberMessages(conversationId: string, memberId: string, body: Models.CreateWebChatMessageRequest): Promise<Models.WebChatMessage>; 
  	postWebchatGuestConversationMemberTyping(conversationId: string, memberId: string): Promise<Models.WebChatTyping>; 
  	postWebchatGuestConversations(body: Models.CreateWebChatConversationRequest): Promise<Models.CreateWebChatConversationResponse>;
}

declare namespace WebChatApi { 
	export interface getWebchatGuestConversationMembersOptions { 
		"pageSize"?: number;
		"pageNumber"?: number;
		"excludeDisconnectedMembers"?: boolean;
	}
	export interface getWebchatGuestConversationMessagesOptions { 
		"after"?: string;
		"before"?: string;
		"sortOrder"?: string;
		"maxResults"?: number;
	}
}

declare namespace Models { 
	export interface CreateWebChatConversationRequest { 
		"organizationId": string;
		"deploymentId": string;
		"routingTarget": Models.WebChatRoutingTarget;
		"memberInfo": Models.GuestMemberInfo;
		"memberAuthToken"?: string;
		"journeyContext"?: Models.JourneyContext;
	}
	
	export interface CreateWebChatConversationResponse { 
		"id"?: string;
		"jwt"?: string;
		"eventStreamUri"?: string;
		"member"?: Models.WebChatMemberInfo;
	}
	
	export interface CreateWebChatMessageRequest { 
		"body": string;
		"bodyType"?: string;
	}
	
	export interface Detail { 
		"errorCode"?: string;
		"fieldName"?: string;
		"entityId"?: string;
		"entityName"?: string;
	}
	
	export interface ErrorBody { 
		"message"?: string;
		"code"?: string;
		"status"?: number;
		"entityId"?: string;
		"entityName"?: string;
		"messageWithParams"?: string;
		"messageParams"?: { [key: string]: string; };
		"contextId"?: string;
		"details"?: Array<Models.Detail>;
		"errors"?: Array<Models.ErrorBody>;
	}
	
	export interface GuestMemberInfo { 
		"displayName": string;
		"firstName"?: string;
		"lastName"?: string;
		"email"?: string;
		"phoneNumber"?: string;
		"avatarImageUrl"?: string;
		"customFields"?: { [key: string]: string; };
	}
	
	export interface JourneyAction { 
		"id": string;
		"actionMap": Models.JourneyActionMap;
	}
	
	export interface JourneyActionMap { 
		"id": string;
		"version": number;
	}
	
	export interface JourneyContext { 
		"customer": Models.JourneyCustomer;
		"customerSession"?: Models.JourneyCustomerSession;
		"triggeringAction"?: Models.JourneyAction;
	}
	
	export interface JourneyCustomer { 
		"id": string;
		"idType": string;
	}
	
	export interface JourneyCustomerSession { 
		"id": string;
		"type": string;
	}
	
	export interface WebChatConversation { 
		"id"?: string;
		"name"?: string;
		"member"?: Models.WebChatMemberInfo;
		"selfUri"?: string;
	}
	
	export interface WebChatGuestMediaRequest { 
		"id"?: string;
		"name"?: string;
		"types": Array<string>;
		"state": string;
		"communicationId"?: string;
		"securityKey"?: string;
		"selfUri"?: string;
	}
	
	export interface WebChatGuestMediaRequestEntityList { 
		"entities"?: Array<Models.WebChatGuestMediaRequest>;
	}
	
	export interface WebChatMemberInfo { 
		"id"?: string;
		"displayName"?: string;
		"firstName"?: string;
		"lastName"?: string;
		"email"?: string;
		"phoneNumber"?: string;
		"avatarImageUrl"?: string;
		"role": string;
		"joinDate"?: string;
		"leaveDate"?: string;
		"authenticatedGuest"?: boolean;
		"customFields"?: { [key: string]: string; };
		"state"?: string;
	}
	
	export interface WebChatMemberInfoEntityList { 
		"entities"?: Array<Models.WebChatMemberInfo>;
		"pageSize"?: number;
		"pageNumber"?: number;
		"total"?: number;
		"firstUri"?: string;
		"previousUri"?: string;
		"lastUri"?: string;
		"selfUri"?: string;
		"nextUri"?: string;
		"pageCount"?: number;
	}
	
	export interface WebChatMessage { 
		"id"?: string;
		"name"?: string;
		"conversation": Models.WebChatConversation;
		"sender": Models.WebChatMemberInfo;
		"body": string;
		"bodyType": string;
		"timestamp": string;
		"selfUri"?: string;
	}
	
	export interface WebChatMessageEntityList { 
		"pageSize"?: number;
		"entities"?: Array<Models.WebChatMessage>;
		"previousPage"?: string;
		"next"?: string;
		"selfUri"?: string;
	}
	
	export interface WebChatRoutingTarget { 
		"targetType": string;
		"targetAddress": string;
		"skills"?: Array<string>;
		"language"?: string;
		"priority"?: number;
	}
	
	export interface WebChatTyping { 
		"id": string;
		"conversation": Models.WebChatConversation;
		"sender": Models.WebChatMemberInfo;
		"timestamp": string;
	}
	
}
