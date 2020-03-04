'use strict';

// External Modules
import { guaranteeResultJson } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { Metadata, RequestOptionsWrapper } from 'src/Modules';
import { Payment } from 'src/Modules/Methods/Payments';
interface Parameters extends RequestOptionsWrapper
{
	id: string;
	metadata?: Metadata;
};
interface ApiParameters
{
	data:
	{
		metadata?: Metadata;
	};
};
interface Result
{
	payments: Payment;
};

export async function cancel(this: Resource, {id, metadata, options}: Parameters)
{
	const body: ApiParameters =
	{
		data:
		{
			metadata
		}
	};
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'POST',
				path: `/payments/${id}/actions/cancel`,
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	const payments = guaranteeResultJson(result);
	const { payments: payment } = payments;
	return payment;
};