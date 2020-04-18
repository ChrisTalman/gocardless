// External Modules
import { Uniform } from '@chris-talman/types-helpers';
import { Domain, RequestJsonError } from '@chris-talman/request';

declare module '@chris-talman/gocardless'
{
	// Client
	export class Client
	{
		public readonly subdomain: 'api' | 'api-sandbox';
		public readonly accessToken: string;
		public readonly version: string;
		public readonly domain: Domain;
		/**
			Callback invoked before every request to validate that the rate limit has not been exceeded.
			If returns `true`, request will proceed.
			If returns `false`, request will not proceed, and `RateLimitError` will throw, unless `options.useQueue` is enabled.
		*/
		public validateRateLimit?: (rateLimit: RateLimitVariant) => Promise<boolean>;
		constructor
		(
			{ subdomain, accessToken, version, queueItemTimeoutMilliseconds }:
			{ subdomain: Client['subdomain'], accessToken: Client['accessToken'], version: Client['version'], queueItemTimeoutMilliseconds?: number }
		);
		public readonly creditors: Creditors;
		public readonly mandates: Mandates;
		public readonly customerBankAccounts: CustomerBankAccounts;
		public readonly payments: Payments;
		public readonly payouts: Payouts;
		public readonly payoutItems: PayoutItems;
		public readonly redirectFlows: RedirectFlows;
	}
	interface RateLimit
	{
		limit: number;
		remaining: number;
		reset: number;
	}
	type RateLimitVariant = RateLimit | undefined;

	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}

	// Creditors
	export class Creditors extends Resource
	{
		public list <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters?: CreditorsListParameters): Promise<Array<Creditor>>;
	}
	export interface Creditor
	{
		id: string;
		created_at: string;
		verification_status: 'successful' | 'in_review' | 'action_required';
	}
	// Creditors: List
	export interface CreditorsListParameters extends RequestOptionsWrapper {}

	// Mandates
	export class Mandates extends Resource
	{
		public get <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters: MandatesCreateParameters): Promise<Mandate<GenericMetadata>>;
	}
	// Mandates: Get
	export interface MandatesCreateParameters extends RequestOptionsWrapper
	{
		id: string;
	}
	export interface Mandate <GenericMetadata extends Metadata<GenericMetadata> = {}>
	{
		id: string;
		created_at: string;
		status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'active' | 'failed' | 'cancelled' | 'expired';
		metadata: GenericMetadata;
		links: MandateLinks;
	}
	export interface MandateLinks
	{
		creditor: string;
		customer: string;
		customer_bank_account: string;
		new_mandate?: string;
	}

	// Customer Bank Accounts
	export class CustomerBankAccounts extends Resource
	{
		public get <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters: CustomerBankAccountsGetParameters): Promise<CustomerBankAccount<GenericMetadata>>;
	}
	// Customer Bank Accounts: Get
	export interface CustomerBankAccountsGetParameters extends RequestOptionsWrapper
	{
		id: string;
	}
	export interface CustomerBankAccount <GenericMetadata extends Metadata<GenericMetadata> = {}>
	{
		id: string;
		created_at: string;
		account_holder_name: string;
		account_number_ending: string;
		bank_name: string;
		currency: Currency;
		metadata: GenericMetadata;
		links: CustomerBankAccountLinks;
	}
	export interface CustomerBankAccountLinks
	{
		customer: string;
	}

	// Payments
	export class Payments extends Resource
	{
		public get <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters: PaymentsGetParameters<GenericMetadata>): Promise<Payment<GenericMetadata>>;
		public create <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters: PaymentsCreateParameters<GenericMetadata>): Promise<Payment<GenericMetadata>>;
		public cancel <GenericMetadata extends Metadata<GenericMetadata> = {}> (parameters: PaymentsCancelParameters<GenericMetadata>): Promise<Payment<GenericMetadata>>;
	}
	// Payments: Get
	export interface PaymentsGetParameters <GenericMetadata extends Metadata<GenericMetadata> = {}> extends RequestOptionsWrapper
	{
		id: string;
	}
	// Payments: Create
	export interface PaymentsCreateParameters <GenericMetadata extends Metadata<GenericMetadata> = {}> extends RequestOptionsWrapper
	{
		amount: number;
		currency: Currency;
		mandate: string;
		appFee?: number;
		retryIfPossible?: boolean;
		metadata?: GenericMetadata;
	}
	export interface Payment <GenericMetadata extends Metadata<GenericMetadata> = {}>
	{
		id: string;
		created_at: string;
		charge_date: string;
		amount: number;
		currency: Currency;
		status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'confirmed' | 'paid_out' | 'cancelled' | 'customer_approval_denied' | 'failed' | 'charged_back';
		reference: string;
		metadata: GenericMetadata;
		amount_refunded: number;
		links: PaymentLinks;
	}
	export interface PaymentLinks
	{
		creditor: string;
		mandate: string;
		payout?: string;
		subscription?: string;
	}
	// Payments: Cancel
	interface PaymentsCancelParameters <GenericMetadata extends Metadata<GenericMetadata> = {}> extends RequestOptionsWrapper
	{
		id: string;
		metadata?: GenericMetadata;
	}

	// Payouts
	export class Payouts extends Resource
	{
		public get(parameters: PayoutsGetParameters): Promise<Payout>;
		public list(parameters?: PayoutsListParameters): Promise<PayoutsList>;
	}
	export interface Payout
	{
		id: string;
		amount: number;
		arrival_date: string | null;
		created_at: string;
		currency: Currency;
		deducted_fees: number;
		payout_type: string;
		reference: string;
		status: 'pending' | 'paid' | 'bounced';
		fx: PayoutFx;
		links: PayoutLinks;
	}
	export interface PayoutFx
	{
		estimated_exchange_rate: string;
		exchange_rate: string;
		fx_amount: string;
		fx_currency: string;
	}
	export interface PayoutLinks
	{
		creditor: string;
		creditor_bank_account: string;
	}
	// Mandates: Get
	export interface PayoutsGetParameters extends RequestOptionsWrapper
	{
		id: string;
	}
	// Payouts: List
	export interface PayoutsListParameters extends RequestOptionsWrapper
	{
		after?: string;
		before?: string;
		createdAt?: PayoutsListParametersCreatedAt;
		creditor?: string;
		creditorBankAccount?: string;
		currency?: Payout['currency'];
		limit?: number;
		payoutType?: Payout['payout_type'];
		reference?: Payout['reference'];
		status?: Payout['status'];
	}
	interface PayoutsListParametersCreatedAt
	{
		greaterThan?: string;
		greaterThanOrEqual?: string;
		lessThan?: string;
		lessThanOrEqual?: string;
	}
	export interface PayoutsList extends BaseList
	{
		payouts: Array<Payout>;
	}

	// Payout Items
	export class PayoutItems extends Resource
	{
		public list(parameters: PayoutItemsListParameters): Promise<PayoutItemsList>;
	}
	export interface PayoutItem
	{
		amount: string;
		type:
			'payment_paid_out' |
			'payment_failed' |
			'payment_charged_back' |
			'payment_refunded' |
			'refund' |
			'refund_funds_returned' |
			'gocardless_fee' |
			'app_fee' |
			'revenue_share' |
			'surcharge_fee'
		;
		links: PayoutItemLinks;
	}
	export interface PayoutItemLinks
	{
		payment: string;
		mandate?: string;
	}
	export interface PayoutItemsList extends BaseList
	{
		payout_items: Array<PayoutItem>;
	}
	// Payout Items: List
	interface PayoutItemsListParameters extends RequestOptionsWrapper
	{
		payoutId: string;
		after?: string;
		before?: string;
		limit?: number;
	}

	// Redirect Flows
	export class RedirectFlows extends Resource
	{
		public create(parameters: RedirectFlowsCreateParameters): Promise<RedirectFlow>;
		public actions: Actions;
	}
	// Redirect Flows: Create
	export interface RedirectFlowsCreateParameters extends RequestOptionsWrapper
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
		currency: Currency;
		status: string;
		reference: string;
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
	export interface RedirectFlowsActionsCompleteParameters extends RequestOptionsWrapper
	{
		id: string;
		sessionToken: string;
	}

	// Events
	export interface EventsList
	{
		events: Events;
	}
	export interface Events extends Array<Event> {}
	export type Event = MandateEvent | PaymentEvent | PayoutEvent;
	export interface BaseEvent <GenericMetadata extends Metadata<GenericMetadata> = {}>
	{
		id: string;
		action: string;
		created_at: string;
		details: EventDetails;
		metadata: GenericMetadata;
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
	export interface MandateEvent <GenericMetadata extends Metadata<GenericMetadata> = {}> extends BaseEvent <GenericMetadata>
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
			'mandate_replaced' |
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
	export interface PaymentEvent <GenericMetadata extends Metadata<GenericMetadata> = {}> extends BaseEvent <GenericMetadata>
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

	// Events: Payout
	export interface PayoutEvent <GenericMetadata extends Metadata<GenericMetadata> = {}> extends BaseEvent <GenericMetadata>
	{
		resource_type: 'payouts';
		details: PayoutEventDetails;
	}
	export interface PayoutEventDetails extends EventDetails
	{
		cause:
			'payout_paid' |
			'payout_fx_rate_confirmed'
		;
	}

	// Request Options
	export interface RequestOptions
	{
		/**
			Pass an idempotency key to the API.
			If a key is not specified, one will be generated automatically and passed to the API in any case.
		*/
		idempotencyKey?: string;
		useQueue?: boolean;
	}
	export interface RequestOptionsWrapper
	{
		options?: RequestOptions;
	}

	// Lists
	export interface BaseList
	{
		meta: ListMeta;
	}
	export interface ListMeta
	{
		cursors: ListMetaCursors;
		limit: number;
	}
	export interface ListMetaCursors
	{
		before: string | null;
		after: string | null;
	}

	// Currency
	export type Currency = 'AUD' | 'CAD' | 'DKK' | 'EUR' | 'GBP' | 'NZD' | 'SEK' | 'USD';

	// Metadata
	export type Metadata <GenericMetadata> = Uniform<GenericMetadata, string>;

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
		reason:
			'invalid_type' |
			'path_not_found' |
			'resource_not_found' |
			'link_not_found' |
			'unauthorized' |
			'forbidden' |
			'feature_disabled' |
			'not_acceptable' |
			'request_entity_too_large' |
			'unsupported_media_type' |
			'rate_limit_exceeded' |
			'access_token_not_found' |
			'access_token_not_active' |
			'access_token_revoked' |
			'missing_authorization_header' |
			'invalid_authorization_header' |
			'insufficient_permissions' |
			'method_not_allowed' |
			'bad_request' |
			'idempotency_key_too_long' |
			'invalid_document_structure' |
			'invalid_content_type' |
			'tls_required' |
			'missing_version_header' |
			'version_not_found' |
			'invalid_filters' |
			'request_body_not_allowed' |
			'customer_data_removed' |
			'cancellation_failed' |
			'retry_failed' |
			'disable_failed' |
			'mandate_is_inactive' |
			'mandate_replaced' |
			'bank_account_disabled' |
			'mandate_not_inactive' |
			'refund_is_unreachable' |
			'refund_payment_invalid_state' |
			'total_amount_confirmation_invalid' |
			'number_of_refunds_exceeded' |
			'idempotent_creation_conflict' |
			'customer_bank_account_token_used'
		;
		links?: ApiErrorPayloadErrorErrorsErrorStandardLinks;
	}
	interface ApiErrorPayloadErrorErrorsErrorStandardLinks
	{
		new_mandate?: string;
	}
	interface ApiErrorPayloadErrorErrorsErrorValidation
	{
		message: string;
		field: string;
		request_pointer: string;
	}
}