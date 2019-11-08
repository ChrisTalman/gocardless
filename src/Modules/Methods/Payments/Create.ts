'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { Currency, Metadata, RequestOptionsWrapper } from 'src/Modules';
import { Payment } from 'src/Modules/Methods/Payments';
interface Parameters extends RequestOptionsWrapper
{
	amount: number;
	appFee?: number;
	currency: Currency;
	metadata?: Metadata;
	mandate: string;
};
interface ApiParameters
{
	payments:
	{
		amount: number;
		app_fee?: number;
		currency: string;
		metadata?: Metadata;
		links: ApiParametersLinks;
	};
};
interface ApiParametersLinks
{
	mandate: string;
};
interface Result
{
	payments: Payment;
};

export async function create(this: Resource, {amount, appFee, currency, metadata, mandate, options}: Parameters)
{
	const body: ApiParameters =
	{
		payments:
		{
			amount,
			currency,
			app_fee: appFee,
			metadata,
			links:
			{
				mandate
			}
		}
	};
	const result = await this._client.executeApiRequest <Result>
	(
		{
			request:
			{
				method: 'POST',
				path: '/payments',
				body,
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