'use strict';

// External Modules
import { guaranteeResultJson } from '@chris-talman/request';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
interface Parameters extends RequestOptionsWrapper
{
	after?: string;
	before?: string;
	createdAt?: ParametersCreatedAt;
	creditor?: string;
	creditorBankAccount?: string;
	currency?: string;
	limit?: number;
	payoutType?: string;
	reference?: string;
	status?: 'pending' | 'paid' | 'bounced';
};
interface ParametersCreatedAt
{
	greaterThan?: string;
	greaterThanOrEqual?: string;
	lessThan?: string;
	lessThanOrEqual?: string;
};
interface ApiParameters
{
	payouts:
	{
		after?: string;
		before?: string;
		created_at?: ApiParametersCreatedAt;
		creditor?: string;
		creditor_bank_account?: string;
		currency?: string;
		limit?: number;
		payout_type?: string;
		reference?: string;
		status?: 'pending' | 'paid' | 'bounced';
	};
};
interface ApiParametersCreatedAt
{
	gt?: string;
	gte?: string;
	lt?: string;
	lte?: string;
};
interface Result
{
	payouts: Array<object>;
};

export async function list(this: Resource, {after, before, createdAt, creditor, creditorBankAccount, currency, limit, payoutType, reference, status, options}: Parameters = {})
{
	const body: ApiParameters =
	{
		payouts:
		{
			after,
			before,
			created_at:
				createdAt
				?
					{
						gt: createdAt.greaterThan,
						gte: createdAt.greaterThanOrEqual,
						lt: createdAt.lessThan,
						lte: createdAt.lessThanOrEqual
					}
				:
				undefined,
			creditor,
			creditor_bank_account: creditorBankAccount,
			currency,
			limit,
			payout_type: payoutType,
			reference,
			status
		}
	};
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/payouts/',
				body,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	const { payouts } = guaranteeResultJson(result);
	return payouts;
};