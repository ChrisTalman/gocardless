'use strict';

// Types
export type Currency = 'AUD' | 'CAD' | 'DKK' | 'EUR' | 'GBP' | 'NZD' | 'SEK' | 'USD';
export interface Metadata
{
	[key: string]: string;
};
export interface RequestOptions
{
	/**
		Pass an idempotency key to the API.
		If a key is not specified, one will be generated automatically and passed to the API in any case.
	*/
	idempotencyKey?: string;
	useQueue?: boolean;
};
export interface RequestOptionsWrapper
{
	options?: RequestOptions;
};

// Exports
export { Client } from './Client';
export { ApiError } from './ApiError';