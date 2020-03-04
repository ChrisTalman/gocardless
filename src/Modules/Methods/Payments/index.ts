'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';
import { create } from './Create';
import { cancel } from './Cancel';

// Types
import { Currency, Metadata } from 'src/Modules/index';
export interface Payment
{
	id: string;
	created_at: string;
	charge_date: string;
	amount: number;
	currency: Currency;
	status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'confirmed' | 'paid_out' | 'cancelled' | 'customer_approval_denied' | 'failed' | 'charged_back';
	reference: string;
	metadata: Metadata;
	amount_refunded: number;
};

export class Payments extends Resource
{
	public get = get;
	public create = create;
	public cancel = cancel;
};