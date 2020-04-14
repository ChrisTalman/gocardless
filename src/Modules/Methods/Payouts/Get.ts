'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
interface Parameters extends RequestOptionsWrapper
{
	id: string;
};
interface Result
{
	payouts: object;
};

export async function get(this: Resource, {id, options}: Parameters)
{
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: `/mandates/${id}`,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { payouts: payout } = result.json;
	return payout;
};