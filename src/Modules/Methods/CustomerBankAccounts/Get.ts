'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { CustomerBankAccount } from 'src/Modules/Methods/CustomerBankAccounts';
interface Parameters extends RequestOptionsWrapper
{
	id: string;
};
interface Result
{
	customer_bank_accounts: CustomerBankAccount;
};

export async function get(this: Resource, {id, options}: Parameters)
{
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/customer_bank_accounts/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { customer_bank_accounts: customerBankAccount } = result.json;
	return customerBankAccount;
};