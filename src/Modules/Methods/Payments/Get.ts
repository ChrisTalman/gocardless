'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { Payment } from 'src/Modules/Methods/Payments';
interface Parameters extends RequestOptionsWrapper
{
	id: string;
};
interface Result
{
	payments: Payment;
};

export async function get(this: Resource, {id, options}: Parameters)
{
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/payments/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { payments: payment } = result.json;
	return payment;
};