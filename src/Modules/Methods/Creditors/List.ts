'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { Creditor } from 'src/Modules/Methods/Creditors';
interface Parameters extends RequestOptionsWrapper {};
interface Result
{
	creditors: Array<Creditor>;
};

export async function list(this: Resource, {options}: Parameters = {})
{
	const result = await this._client.scheduleApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/creditors/',
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { creditors: creditor } = result.json;
	return creditor;
};