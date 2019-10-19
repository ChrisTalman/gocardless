// External Modules
import { Domain } from '@ChrisTalman/request';

declare module '@ChrisTalman/gocardless'
{
	// Client
	export class Client
	{
		public readonly subdomain: 'api' | 'api-sandbox';
		public readonly accessToken: string;
		public readonly version: string;
		public readonly domain: Domain;
		constructor({subdomain, accessToken, version}: {subdomain: Client['subdomain'], accessToken: Client['accessToken'], version: Client['version']});
		public readonly payments: Payments;
		public readonly redirectFlows: RedirectFlows;
	}
	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}
	// Payments
	export class Payments extends Resource
	{
		public create(parameters: PaymentsCreateParameters): Promise<PaymentsCreateResult>;
	}
	// Payments: Create
	export interface PaymentsCreateParameters
	{
		amount: number;
		currency: string;
		metadata: Metadata;
		mandate: string;
	}
	export interface PaymentsCreateResult
	{
		payments: Payment;
	}
	export interface Payment
	{
		id: string;
		created_at: string;
		charge_date: string;
		amount: number;
		currency: string;
		status: string;
		reference: string;
		metadata: Metadata;
		amount_refunded: number;
	}
	// Redirect Flows
	export class RedirectFlows extends Resource
	{
		public create(parameters: RedirectFlowsCreateParameters): Promise<RedirectFlowsCreateResult>;
		public actions: Actions;
	}
	// Redirect Flows: Create
	export interface RedirectFlowsCreateParameters
	{
		sessionToken: string;
		successRedirectUrl: string;
		description: string;
	}
	export interface RedirectFlowsCreateResult
	{
		payments: RedirectFlow;
	}
	export interface RedirectFlow
	{
		id: string;
		created_at: string;
		charge_date: string;
		amount: number;
		currency: string;
		status: string;
		reference: string;
		metadata: Metadata;
		amount_refunded: number;
	}
	// Redirect Flows: Actions
	export class Actions extends Resource
	{
		public complete(parameters: RedirectFlowsActionsCompleteParameters): Promise<RedirectFlowsActionsCompleteResult>;
	}
	// Redirect Flows: Actions: Create
	export interface RedirectFlowsActionsCompleteParameters
	{
		sessionToken: string;
		successRedirectUrl: string;
		description: string;
	}
	export interface RedirectFlowsActionsCompleteResult
	{
		payments: RedirectFlow;
	}
	// Metadata
	interface Metadata
	{
		[key: string]: string;
	}
}