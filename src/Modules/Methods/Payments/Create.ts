'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { Metadata } from 'src/Modules/index';
export interface PaymentsCreateParameters
{
	amount: number;
	currency: string;
	metadata?: Metadata;
	mandate: string;
};
export interface PaymentsCreateApiParameters
{
	amount: number;
	currency: string;
	metadata?: Metadata;
	links: PaymentsCreateApiParametersLinks;
};
export interface PaymentsCreateApiParametersLinks
{
	mandate: string;
};
export interface PaymentsCreateResult
{
	payments: PaymentsCreateResultPayments;
};
export interface PaymentsCreateResultPayments
{
	id: string;
	created_at: string;
	charge_date: string;
	amount: number;
	currency: string;
	status: string;
	reference: string;
	metadata: Metadata;
	amount_refunded: number;
};

export async function create(this: Resource, {amount, currency, metadata, mandate}: PaymentsCreateParameters)
{
	const body: PaymentsCreateApiParameters =
	{
		amount,
		currency,
		metadata,
		links:
		{
			mandate
		}
	};
	const result = await this._client.domain.request <PaymentsCreateResult>
	(
		{
			method: 'POST',
			path: '/payments',
			body,
			jsonResponseSuccess: true,
			jsonResponseError: true
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	return result.json;
};