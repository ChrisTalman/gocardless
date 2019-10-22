'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
interface Parameters
{
	id: string;
	sessionToken: string;
};
interface ApiParameters
{
	data:
	{
		session_token: string;
	};
};
interface Result
{
	redirect_flows: RedirectFlow;
};

export async function complete(this: Resource, {id, sessionToken}: Parameters)
{
	const body: ApiParameters =
	{
		data:
		{
			session_token: sessionToken
		}
	};
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'POST',
				path: '/redirect_flows/' + id + '/actions/complete',
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