'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { get } from './Get';
import { list } from './List';

export class Payouts extends Resource
{
	public get = get;
	public list = list;
};