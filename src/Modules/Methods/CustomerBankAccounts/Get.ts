'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { CustomerBankAccount } from 'src/Modules/Methods/CustomerBankAccounts';
interface Parameters
{
	id: string;
};
interface Result
{
	customer_bank_accounts: CustomerBankAccount;
};

export async function get(this: Resource, {id}: Parameters)
{
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'GET',
				path: '/customer_bank_accounts/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		)
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { customer_bank_accounts: customerBankAccount } = result.json;
	return customerBankAccount;
};