'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
interface Parameters extends RequestOptionsWrapper
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

export async function create(this: Resource, {sessionToken, successRedirectUrl, description, options}: Parameters)
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
	const result = await this._client.executeApiRequest <Result>
	(
		{
			request:
			{
				method: 'POST',
				path: '/redirect_flows',
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { redirect_flows: redirectFlow } = result.json;
	return redirectFlow;
};