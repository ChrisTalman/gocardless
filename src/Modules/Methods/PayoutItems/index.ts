'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { list } from './List';

export class PayoutItems extends Resource
{
	public list = list;
};