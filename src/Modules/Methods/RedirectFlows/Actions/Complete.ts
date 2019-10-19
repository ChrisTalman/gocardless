'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
interface Parameters
{
	redirectFlowId: string;
	session_token: string;
};
interface ApiParameters
{
	session_token: string;
};
interface Result
{
	redirect_flows: RedirectFlow;
};

export async function complete(this: Resource, {redirectFlowId, session_token}: Parameters)
{
	const body: ApiParameters =
	{
		session_token
	};
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'POST',
				path: '/redirect_flows/' + redirectFlowId + '/actions/complete',
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