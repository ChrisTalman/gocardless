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
		public readonly mandates: Mandates;
		public readonly customerBankAccounts: CustomerBankAccounts;
		public readonly payments: Payments;
		public readonly redirectFlows: RedirectFlows;
	}
	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}
	// Mandates
	export class Mandates extends Resource
	{
		public get(parameters: MandatesCreateParameters): Promise<Mandate>;
	}
	// Mandates: Get
	export interface MandatesCreateParameters
	{
		id: string;
	}
	export interface Mandate
	{
		id: string;
		created_at: string;
		status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'active' | 'failed' | 'cancelled' | 'expired';
		metadata: Metadata;
	}
	// Customer Bank Accounts
	export class CustomerBankAccounts extends Resource
	{
		public get(parameters: CustomerBankAccountsGetParameters): Promise<Mandate>;
	}
	// Customer Bank Accounts: Get
	export interface CustomerBankAccountsGetParameters
	{
		id: string;
	}
	export interface CustomerBankAccount
	{
		id: string;
		created_at: string;
		bank_name: string;
		account_number_ending: string;
		currency: string;
		metadata: Metadata;
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
		links: RedirectFlowLinks;
	}
	export interface RedirectFlowLinks
	{
		creditor: string;
		customer?: string;
		customer_bank_account?: string;
		mandate?: string;
	}
	// Redirect Flows: Actions
	export class Actions extends Resource
	{
		public complete(parameters: RedirectFlowsActionsCompleteParameters): Promise<RedirectFlow>;
	}
	// Redirect Flows: Actions: Create
	export interface RedirectFlowsActionsCompleteParameters
	{
		redirectFlowId: string;
		sessionToken: string;
	}
	// Events
	export interface EventsList
	{
		events: Events;
	}
	export interface Events extends Array<Event> {}
	export type Event = MandateEvent | PaymentEvent;
	export interface BaseEvent
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
	// Events: Mandate
	export interface MandateEvent extends BaseEvent
	{
		resource_type: 'mandates';
		details: MandateEventDetails;
	}
	export interface MandateEventDetails extends EventDetails
	{
		cause:
			'mandate_created' |
			'customer_approval_granted' |
			'customer_approval_skipped' |
			'mandate_submitted' |
			'mandate_activated' |
			'mandate_cancelled' |
			'mandate_expired' |
			'resubmission_requested' |
			'mandate_reinstated' |
			'bank_account_closed' |
			'invalid_bank_details' |
			'direct_debit_not_enabled' |
			'bank_account_transferred' |
			'authorisation_disputed' |
			'scheme_identifier_changed'
		;
	}
	// Events: Payment
	export interface PaymentEvent extends BaseEvent
	{
		resource_type: 'payments';
		details: PaymentEventDetails;
	}
	export interface PaymentEventDetails extends EventDetails
	{
		cause:
			'payment_created' |
			'customer_approval_granted' |
			'customer_approval_denied' |
			'payment_cancelled' |
			'payment_submitted' |
			'payment_confirmed' |
			'payment_paid_out' |
			'payment_retried' |
			'payment_autoretried' |
			'late_failure_settled' |
			'chargeback_settled' |
			'test_failure' |
			'insufficient_funds' |
			'refer_to_payer' |
			'bank_account_closed' |
			'direct_debit_not_enabled' |
			'invalid_bank_details' |
			'bank_account_transferred' |
			'mandate_cancelled' |
			'mandate_expired' |
			'authorisation_disputed' |
			'refund_requested'
		;
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