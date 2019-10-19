'use strict';

// External Modules
import { RequestJsonError } from '@ChrisTalman/request';

// Types
interface ApiErrorPayload
{
	type: string;
	code: number;
	message: string;
	documentation_url: string;
	request_id: string;
};

export class ApiError extends Error
{
	public readonly type: string;
	public readonly code: number;
	public readonly message: string;
	public readonly documentationUrl: string;
	public readonly requestId: string;
	public readonly error: RequestJsonError <ApiErrorPayload>;
	constructor({error}: {error: RequestJsonError <ApiErrorPayload>})
	{
		const formattedMessage = 'GoCardless Error: ' + error.json.message;
		super(formattedMessage);
		this.type = error.json.type;
		this.code = error.json.code;
		this.documentationUrl = error.json.documentation_url;
		this.requestId = error.json.request_id;
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
		typeof apiError.json.type === 'string' &&
		typeof apiError.json.code === 'number' &&
		typeof apiError.json.documentation_url === 'string' &&
		typeof apiError.json.request_id === 'string'
	)
	{
		throw new ApiError({error: apiError});
	}
	else
	{
		throw error;
	};
};