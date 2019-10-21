'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { create } from './Create';

// Types
import { Currency, Metadata } from 'src/Modules/index';
export interface Payment
{
	id: string;
	created_at: string;
	charge_date: string;
	amount: number;
	currency: Currency;
	status: string;
	reference: string;
	metadata: Metadata;
	amount_refunded: number;
};

export class Payments extends Resource
{
	public create = create;
};