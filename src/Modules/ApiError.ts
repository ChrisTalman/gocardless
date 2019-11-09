'use strict';

// External Modules
import { RequestJsonError } from '@chris-talman/request';

// Types
interface ApiErrorPayload
{
	error: ApiErrorPayloadError;
};
interface ApiErrorPayloadError
{
	type: 'gocardless' | 'invalid_api_usage' | 'invalid_state' | 'validation_failed';
	code: number;
	errors: ApiErrorPayloadErrorErrors;
	message: string;
	documentation_url: string;
	request_id: string;
};
interface ApiErrorPayloadErrorErrors extends Array<ApiErrorPayloadErrorErrorsError> {};
type ApiErrorPayloadErrorErrorsError = ApiErrorPayloadErrorErrorsErrorStandard | ApiErrorPayloadErrorErrorsErrorValidation;
interface ApiErrorPayloadErrorErrorsErrorStandard
{
	message: string;
	reason: 'invalid_type' | 'path_not_found' | 'resource_not_found' | 'link_not_found' | 'unauthorized' | 'forbidden' | 'feature_disabled' | 'not_acceptable' | 'request_entity_too_large' | 'unsupported_media_type' | 'rate_limit_exceeded' | 'access_token_not_found' | 'access_token_not_active' | 'access_token_revoked' | 'missing_authorization_header' | 'invalid_authorization_header' | 'insufficient_permissions' | 'method_not_allowed' | 'bad_request' | 'idempotency_key_too_long' | 'invalid_document_structure' | 'invalid_content_type' | 'tls_required' | 'missing_version_header' | 'version_not_found' | 'invalid_filters' | 'request_body_not_allowed' | 'customer_data_removed' | 'cancellation_failed' | 'retry_failed' | 'disable_failed' | 'mandate_is_inactive' | 'mandate_replaced' | 'bank_account_disabled' | 'mandate_not_inactive' | 'refund_is_unreachable' | 'refund_payment_invalid_state' | 'total_amount_confirmation_invalid' | 'number_of_refunds_exceeded' | 'idempotent_creation_conflict' | 'customer_bank_account_token_used';
};
interface ApiErrorPayloadErrorErrorsErrorValidation
{
	message: string;
	field: string;
	request_pointer: string;
};

export class ApiError extends Error
{
	public readonly type: ApiErrorPayloadError['type'];
	public readonly code: number;
	public readonly message: string;
	public readonly documentationUrl: string;
	public readonly requestId: string;
	public readonly errors: ApiErrorPayloadErrorErrors;
	public readonly error: RequestJsonError <ApiErrorPayload>;
	constructor({error}: {error: RequestJsonError <ApiErrorPayload>})
	{
		const formattedMessage = 'GoCardless Error: ' + error.json.error.message;
		super(formattedMessage);
		this.type = error.json.error.type;
		this.code = error.json.error.code;
		this.documentationUrl = error.json.error.documentation_url;
		this.requestId = error.json.error.request_id;
		this.errors = error.json.error.errors;
		this.error = error;
	};
};

/** If promise rejects with an API error, the error is thrown in a more readable form. */
export async function throwRejectionApiError <GenericResolution> (promise: Promise<GenericResolution>)
{
	let result: GenericResolution;
	try
	{
		result = await promise;
	}
	catch (error)
	{
		throwApiError(error);
		throw new Error('throwApiError() failed');
	};
	return result;
};

export function throwApiError(error: any)
{
	const apiError: RequestJsonError <ApiErrorPayload> = error;
	if
	(
		apiError instanceof RequestJsonError &&
		typeof apiError.json.error.message === 'string' &&
		typeof apiError.json.error.type === 'string' &&
		typeof apiError.json.error.code === 'number' &&
		typeof apiError.json.error.documentation_url === 'string' &&
		typeof apiError.json.error.request_id === 'string' &&
		Array.isArray(apiError.json.error.errors)
	)
	{
		throw new ApiError({error: apiError});
	}
	else
	{
		throw error;
	};
};