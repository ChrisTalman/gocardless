'use strict';

// Types
export interface Metadata
{
	[key: string]: string;
};

// DEBUG
// import { Client } from './Client';
// const gocardless = new Client({baseSubdomain: 'api-sandbox', accessToken: '123', version: 'abc'});
// gocardless.payments.create({amount: 123, currency: 'abc'});
// DEBUG

// Exports
export { Client } from './Client';