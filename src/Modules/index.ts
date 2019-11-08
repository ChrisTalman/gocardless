'use strict';

// Types
export type Currency = 'AUD' | 'CAD' | 'DKK' | 'EUR' | 'GBP' | 'NZD' | 'SEK' | 'USD';
export interface Metadata
{
	[key: string]: string;
};
export interface RequestOptions
{
	useQueue?: boolean;
};
export interface RequestOptionsWrapper
{
	options?: RequestOptions;
};

// Exports
export { Client } from './Client';
export { ApiError } from './ApiError';