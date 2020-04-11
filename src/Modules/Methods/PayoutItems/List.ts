'use strict';

// External Modules
import { guaranteeResultJson } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

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
	payout_items:
	{
		payout: string;
		after?: string;
		before?: string;
		limit?: number;
	};
};
interface Result
{
	payout_items: object;
};

export async function list(this: Resource, {after, before, payoutId, limit, options}: Parameters)
{
	const body: ApiParameters =
	{
		payout_items:
		{
			payout: payoutId,
			after,
			before,
			limit
		}
	};
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/payout_items/',
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	const { payout_items: payoutItems } = guaranteeResultJson(result);
	return payoutItems;
};