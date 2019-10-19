'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
interface Parameters
{
	sessionToken: string;
	successRedirectUrl: string;
	description: string;
};
interface ApiParameters
{
	redirect_flows:
	{
		session_token: string;
		success_redirect_url: string;
		description: string;
	};
};
interface Result
{
	redirect_flows: RedirectFlow;
};

export async function create(this: Resource, {sessionToken, successRedirectUrl, description}: Parameters)
{
	const body: ApiParameters =
	{
		redirect_flows:
		{
			session_token: sessionToken,
			success_redirect_url: successRedirectUrl,
			description
		}
	};
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'POST',
				path: '/redirect_flows',
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		)
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { redirect_flows: redirectFlow } = result.json;
	return redirectFlow;
};