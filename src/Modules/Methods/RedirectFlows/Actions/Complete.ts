'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { RedirectFlow } from 'src/Modules/Methods/RedirectFlows';
interface Parameters extends RequestOptionsWrapper
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

export async function complete(this: Resource, {id, sessionToken, options}: Parameters)
{
	const body: ApiParameters =
	{
		data:
		{
			session_token: sessionToken
		}
	};
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'POST',
				path: '/redirect_flows/' + id + '/actions/complete',
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