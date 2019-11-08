'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
import { RequestOptionsWrapper } from 'src/Modules';
import { Mandate } from 'src/Modules/Methods/Mandates';
interface Parameters extends RequestOptionsWrapper
{
	id: string;
};
interface Result
{
	mandates: Mandate;
};

export async function get(this: Resource, {id, options}: Parameters)
{
	const result = await this._client.executeApiRequest <Result>
	(
		{
			request:
			{
				method: 'GET',
				path: '/mandates/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			},
			options
		}
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { mandates: mandate } = result.json;
	return mandate;
};