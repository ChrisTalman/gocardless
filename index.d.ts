// External Modules
import { Domain, RequestJsonError } from '@ChrisTalman/request';

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
		public create(parameters: PaymentsCreateParameters): Promise<Payment>;
	}
	// Payments: Create
	export interface PaymentsCreateParameters
	{
		amount: number;
		currency: string;
		metadata: Metadata;
		mandate: string;
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
		public create(parameters: RedirectFlowsCreateParameters): Promise<RedirectFlow>;
		public actions: Actions;
	}
	// Redirect Flows: Create
	export interface RedirectFlowsCreateParameters
	{
		sessionToken: string;
		successRedirectUrl: string;
		description: string;
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
		public complete(parameters: RedirectFlowsActionsCompleteParameters): Promise<RedirectFlow>;
	}
	// Redirect Flows: Actions: Create
	export interface RedirectFlowsActionsCompleteParameters
	{
		sessionToken: string;
		successRedirectUrl: string;
		description: string;
	}
	// Events
	export interface Event
	{
		id: string;
		action: string;
		created_at: string;
		details: EventDetails;
		metadata: object;
		resource_type: 'payments' | 'mandates' | 'payouts' | 'refunds' | 'subscriptions';
		links: EventLinks;
	}
	export interface EventDetails
	{
		cause: string;
		description: string;
		origin: 'bank' | 'gocardless' | 'api' | 'customer';
	}
	export interface EventLinks
	{
		mandate?: string;
		new_customer_bank_account?: string;
		new_mandate?: string;
		organisation?: string;
		parent_event?: string;
		payment?: string;
		payout?: string;
		previous_customer_bank_account?: string;
		refund?: string;
		subscription?: string;
	}
	// Metadata
	interface Metadata
	{
		[key: string]: string;
	}
	// API Error
	export class ApiError extends Error
	{
		public readonly type: string;
		public readonly code: number;
		public readonly message: string;
		public readonly documentationUrl: string;
		public readonly requestId: string;
		public readonly errors: ApiErrorPayloadErrorErrors;
		public readonly error: RequestJsonError <ApiErrorPayload>;
		constructor({error}: {error: RequestJsonError <ApiErrorPayload>});
	}
	interface ApiErrorPayload
	{
		error: ApiErrorPayloadError;
	}
	interface ApiErrorPayloadError
	{
		type: string;
		code: number;
		errors: ApiErrorPayloadErrorErrors;
		message: string;
		documentation_url: string;
		request_id: string;
	}
	interface ApiErrorPayloadErrorErrors extends Array<ApiErrorPayloadErrorErrorsError> {}
	type ApiErrorPayloadErrorErrorsError = ApiErrorPayloadErrorErrorsErrorStandard | ApiErrorPayloadErrorErrorsErrorValidation;
	interface ApiErrorPayloadErrorErrorsErrorStandard
	{
		message: string;
		field: string;
		request_pointer: string;
	}
	interface ApiErrorPayloadErrorErrorsErrorValidation
	{
		message: string;
		reason: string;
	}
}