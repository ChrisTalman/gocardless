'use strict';

// External Modules
import { RequestJsonError } from '@ChrisTalman/request';

// Types
interface ApiErrorPayload
{
	error: ApiErrorPayloadError;
};
interface ApiErrorPayloadError
{
	type: string;
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
	field: string;
	request_pointer: string;
};
interface ApiErrorPayloadErrorErrorsErrorValidation
{
	message: string;
	reason: string;
};

export class ApiError extends Error
{
	public readonly type: string;
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