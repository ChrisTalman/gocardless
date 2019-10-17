'use strict';

// External Modules
import { Domain } from '@ChrisTalman/request';

// Internal Modules
import { Payments } from './Methods/Payments';
import { RedirectFlows } from './Methods/RedirectFlows';

export class Client
{
	public readonly baseSubdomain: 'api' | 'api-sandbox';
	public readonly accessToken: string;
	public readonly version: string;
	public readonly domain: Domain;
	constructor({baseSubdomain, accessToken, version}: {baseSubdomain: Client['baseSubdomain'], accessToken: Client['accessToken'], version: Client['version']})
	{
		this.baseSubdomain = baseSubdomain;
		this.accessToken = accessToken;
		this.version = version;
		const url = 'https://' + this.baseSubdomain + '.gocardless.com';
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => 'Bearer ' + accessToken,
				headers:
				{
					'GoCardless-Version': version
				}
			}
		);
	};
	public payments = new Payments({client: this});
	public redirectFlows = new RedirectFlows({client: this});
};
// DEBUG