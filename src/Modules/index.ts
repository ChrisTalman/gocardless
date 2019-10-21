'use strict';

// Types
export type Currency = 'AUD' | 'CAD' | 'DKK' | 'EUR' | 'GBP' | 'NZD' | 'SEK' | 'USD';
export interface Metadata
{
	[key: string]: string;
};

// Exports
export { Client } from './Client';
export { ApiError } from './ApiError';