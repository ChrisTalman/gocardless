'use strict';

// Internal Modules
import { Client } from './Client';

export class Resource
{
	public readonly _client: Client;
	constructor({client}: {client: Client})
	{
		this._client = client;
	};
};