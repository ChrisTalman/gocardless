'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
export interface Parameters
{
	redirectFlowId: string;
	session_token: string;
};
export interface ApiParameters
{
	session_token: string;
};
export interface Result
{
	redirect_flows: RedirectFlow;
};

export async function complete(this: Resource, {redirectFlowId, session_token}: Parameters)
{
	const body: ApiParameters =
	{
		session_token
	};
	const result = await this._client.domain.request <Result>
	(
		{
			method: 'POST',
			path: '/redirect_flows/' + redirectFlowId + '/actions/complete',
			body,
			jsonResponseSuccess: true,
			jsonResponseError: true
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	return result.json;
};