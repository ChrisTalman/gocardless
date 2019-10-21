'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';
import { throwRejectionApiError } from 'src/Modules/ApiError';

// Types
import { Mandate } from 'src/Modules/Methods/Mandates';
interface Parameters
{
	id: string;
};
interface Result
{
	mandates: Mandate;
};

export async function get(this: Resource, {id}: Parameters)
{
	const result = await throwRejectionApiError
	(
		this._client.domain.request <Result>
		(
			{
				method: 'POST',
				path: '/mandates/' + id,
				jsonResponseSuccess: true,
				jsonResponseError: true
			}
		)
	);
	if (result.json === undefined) throw new Error('JSON undefined');
	const { mandates: mandate } = result.json;
	return mandate;
};