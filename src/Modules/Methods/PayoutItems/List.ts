'use strict';

// External Modules
import { guaranteeResultJson } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { generateQueryParameters } from 'src/Modules/QueryParameters';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
interface Parameters extends RequestOptionsWrapper
{
	payoutId: string;
	after?: string;
	before?: string;
	limit?: number;
};
interface ApiParameters
{
	payout: string;
	after?: string;
	before?: string;
	limit?: number;
};
interface Result
{
	payout_items: object;
};

export async function list(this: Resource, {after, before, payoutId, limit, options}: Parameters)
{
	const body: ApiParameters =
	{
		payout: payoutId,
		after,
		before,
		limit
	};
	const queryParameters = generateQueryParameters(body);
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: `/payout_items?${queryParameters}`,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	const json = guaranteeResultJson(result);
	return json;
};