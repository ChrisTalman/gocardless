'use strict';

// Internal Modules
import { Client } from 'src/Modules/Client';
import { Resource } from 'src/Modules/Resource';
import { create } from './Create';
import { Actions } from './Actions';

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
	public readonly actions: Actions;
	constructor({client}: {client: Client})
	{
		super({client});
		this.actions = new Actions({client});
	};
};