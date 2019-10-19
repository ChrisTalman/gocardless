'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/Error';

// Types
import { Metadata } from 'src/Modules/index';
import { Payment} from 'src/Modules/Methods/Payments';
interface Parameters
{
	amount: number;
	currency: string;
	metadata?: Metadata;
	mandate: string;
};
interface ApiParameters
{
	amount: number;
	currency: string;
	metadata?: Metadata;
	links: ApiParametersLinks;
};
interface ApiParametersLinks
{
	mandate: string;
};
interface Result
{
	payments: Payment;
};

export async function create(this: Resource, {amount, currency, metadata, mandate}: Parameters)
{
	const body: ApiParameters =
	{
		amount,
		currency,
		metadata,
		links:
		{
			mandate
		}
	};
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'POST',
				path: '/payments',
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		)
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { payments: payment } = result.json;
	return payment;
};