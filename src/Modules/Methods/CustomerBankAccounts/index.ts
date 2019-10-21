'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';

// Types
import { Currency, Metadata } from 'src/Modules/index';
export interface CustomerBankAccount
{
	id: string;
	created_at: string;
	account_holder_name: string;
	account_number_ending: string;
	bank_name: string;
	currency: Currency;
	metadata: Metadata;
};

export class CustomerBankAccounts extends Resource
{
	public get = get;
};