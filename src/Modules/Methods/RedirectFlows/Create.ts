'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

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
	session_token: string;
	success_redirect_url: string;
	description: string;
};
interface Result
{
	redirect_flows: RedirectFlow;
};

export async function create(this: Resource, {sessionToken, successRedirectUrl, description}: Parameters)
{
	const body: ApiParameters =
	{
		session_token: sessionToken,
		success_redirect_url: successRedirectUrl,
		description
	};
	const result = await this._client.domain.request <Result>
	(
		{
			method: 'POST',
			path: '/redirect_flows',
			body,
			jsonResponseSuccess: true,
			jsonResponseError: true
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	return result.json;
};