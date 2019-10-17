'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { create } from './Create';

export class Payments extends Resource
{
	public create = create;
};