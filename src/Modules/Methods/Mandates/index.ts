'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';

// Types
import { Metadata } from 'src/Modules/index';
export interface Mandate
{
	id: string;
	created_at: string;
	status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'active' | 'failed' | 'cancelled' | 'expired';
	metadata: Metadata;
};

export class Mandates extends Resource
{
	public get = get;
};