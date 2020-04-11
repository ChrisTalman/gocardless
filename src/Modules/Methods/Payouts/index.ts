'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { list } from './List';

export class Payouts extends Resource
{
	public list = list;
};