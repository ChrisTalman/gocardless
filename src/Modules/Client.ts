'use strict';

// External Modules
import { Domain } from '@chris-talman/request';

// Internal Modules
import { Mandates } from './Methods/Mandates';
import { CustomerBankAccounts } from './Methods/CustomerBankAccounts';
import { Payments } from './Methods/Payments';
import { RedirectFlows } from './Methods/RedirectFlows';

export class Client
{
	public readonly subdomain: 'api' | 'api-sandbox';
	public readonly accessToken: string;
	public readonly version: string;
	public readonly domain: Domain;
	constructor({subdomain, accessToken, version}: {subdomain: Client['subdomain'], accessToken: Client['accessToken'], version: Client['version']})
	{
		this.subdomain = subdomain;
		this.accessToken = accessToken;
		this.version = version;
		const url = 'https://' + this.subdomain + '.gocardless.com';
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
	public mandates = new Mandates({client: this});
	public customerBankAccounts = new CustomerBankAccounts({client: this});
	public payments = new Payments({client: this});
	public redirectFlows = new RedirectFlows({client: this});
};