'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { Payment } from 'src/Modules/Methods/Payments';
interface Parameters
{
	id: string;
};
interface Result
{
	payments: Payment;
};

export async function get(this: Resource, {id}: Parameters)
{
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'GET',
				path: '/payments/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		)
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { payments: payment } = result.json;
	return payment;
};