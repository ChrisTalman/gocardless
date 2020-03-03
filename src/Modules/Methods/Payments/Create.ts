'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { Currency, Metadata, RequestOptionsWrapper } from 'src/Modules';
import { Payment } from 'src/Modules/Methods/Payments';
interface Parameters extends RequestOptionsWrapper
{
	amount: number;
	currency: Currency;
	mandate: string;
	appFee?: number;
	retryIfPossible?: boolean;
	metadata?: Metadata;
};
interface ApiParameters
{
	payments:
	{
		amount: number;
		app_fee?: number;
		currency: string;
		retry_if_possible?: boolean;
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

export async function create(this: Resource, {amount, appFee, retryIfPossible, currency, metadata, mandate, options}: Parameters)
{
	const body: ApiParameters =
	{
		payments:
		{
			amount,
			currency,
			app_fee: appFee,
			retry_if_possible: retryIfPossible,
			metadata,
			links:
			{
				mandate
			}
		}
	};
	const result = await this._client.scheduleApiRequest <Result>
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