'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { list } from './List';

// Types
export interface Creditor
{
	id: string;
	created_at: string;
	verification_status: 'successful' | 'in_review' | 'action_required';
};

export class Creditors extends Resource
{
	public list = list;
};