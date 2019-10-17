// External Modules
import { Domain } from '@ChrisTalman/request';

declare module '@ChrisTalman/gocardless'
{
	// Client
	export class Client
	{
		public readonly baseSubdomain: 'api' | 'api-sandbox';
		public readonly accessToken: string;
		public readonly version: string;
		public readonly domain: Domain;
		constructor({baseSubdomain, accessToken, version}: {baseSubdomain: Client['baseSubdomain'], accessToken: Client['accessToken'], version: Client['version']});
	}
	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}
	// Payments
	export class Payments extends Resource
	{
		public create(parameters: PaymentsCreateParameters): Promise<PaymentsCreateResult>;
	}
	// Payments: Create
	export interface PaymentsCreateParameters
	{
		amount: number;
		currency: string;
		metadata: Metadata;
		links: PaymentsCreateParametersLinks;
	}
	export interface PaymentsCreateParametersLinks
	{
		mandate: string;
	}
	export interface PaymentsCreateResult
	{
		payments: PaymentsCreateResultPayments;
	}
	export interface PaymentsCreateResultPayments
	{
		id: string;
		created_at: string;
		charge_date: string;
		amount: number;
		currency: string;
		status: string;
		reference: string;
		metadata: Metadata;
		amount_refunded: number;
	}
	// Metadata
	interface Metadata
	{
		[key: string]: string;
	}
}