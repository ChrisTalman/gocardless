'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
export interface RedirectFlowsCreateParameters
{
	session_token: string;
	success_redirect_url: string;
	description: string;
};
export interface RedirectFlowsCreateResult
{
	redirect_flows: RedirectFlow;
};

export async function create(this: Resource, {session_token, success_redirect_url, description}: RedirectFlowsCreateParameters)
{
	const body: RedirectFlowsCreateParameters =
	{
		session_token,
		success_redirect_url,
		description
	};
	const result = await this._client.domain.request <RedirectFlowsCreateResult>
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