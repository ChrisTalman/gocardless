'use strict';

// External Modules
import { URLSearchParams } from 'url';

// Types
interface Paths extends Array<Path> {};
interface Path
{
	string: string;
	value: any;
};

export function generateQueryParameters(object: object)
{
	const queryParameters = new URLSearchParams();
	for (let [ key, value] of Object.entries(object))
	{
		if (typeof value === 'object' && value !== null)
		{
			const paths = resolveChildPaths(value);
			for (let path of paths)
			{
				const pathKey = `${key}${path.string}`;
				if (path.value !== undefined)
				{
					queryParameters.set(pathKey, path.value);
				};
			};
		}
		else
		{
			if (value !== undefined)
			{
				queryParameters.set(key, value);
			};
		};
	};
	const queryParametersString = queryParameters.toString();
	return queryParametersString;
};

function resolveChildPaths(object: object)
{
	const paths: Paths = [];
	for (let [ key, value] of Object.entries(object))
	{
		if (typeof value === 'object' && value !== null)
		{
			for (let childPath of resolveChildPaths(value))
			{
				const path: Path =
				{
					string: `[${key}]${childPath.string}`,
					value: childPath.value
				};
				paths.push(path);
			};
		}
		else
		{
			const path: Path =
			{
				string: `[${key}]`,
				value: value
			};
			paths.push(path);
		};
	};
	return paths;
};