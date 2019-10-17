'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { create } from './Create';

// Types
export interface RedirectFlow
{
	id: string;
	confirmation_url: string;
	created_at: string;
	description: string;
	redirect_url: string;
	session_token: string;
	success_redirect_url: string;
};

export class RedirectFlows extends Resource
{
	public create = create;
};