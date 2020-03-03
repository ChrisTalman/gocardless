'use strict';

// External Modules
import nanoid from 'nanoid/async';
import { Definition as RequestDefinition, Result as RequestResult } from '@chris-talman/request';
import { PromiseController } from '@chris-talman/isomorphic-utilities';

// Internal Modules
import { ApiError } from './ApiError';
import { Client } from './Client';

// Types
import { RequestOptions } from 'src/Modules';

export class ScheduledRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson> = RequestResult<GenericResultJson>>
{
	public readonly client: Client;
	private idempotencyKey?: string;
	private readonly request: RequestDefinition;
	public readonly options: RequestOptions;
	public readonly promiseController: PromiseController <RequestResult<GenericResultJson>>;
	private executing = false;
	private executed = false;
	constructor({request, options, client}: {request: RequestDefinition, options: RequestOptions, client: Client})
	{
		if (options.idempotencyKey)
		{
			this.idempotencyKey = options.idempotencyKey;
		};
		this.request = request;
		this.options = options;
		this.client = client;
		this.promiseController = new PromiseController();
		this.execute();
	};
	public async execute()
	{
		if (this.executing || this.executed) return;
		this.executing = true;
		let rateLimitConsumed = false;
		try
		{
			rateLimitConsumed = await this.client.consumeRateLimit(this);
		}
		catch (error)
		{
			this.reject(error);
		};
		if (!rateLimitConsumed)
		{
			this.executing = false;
			return;
		};
		const { request } = this;
		if (!this.request.headers) this.request.headers = {};
		this.request.headers['Idempotency-Key'] = await this.guaranteeIdempotencyKey();
		let result: GenericResult;
		try
		{
			result = await this.client.executeApiRequest({request});
		}
		catch (error)
		{
			if (error instanceof ApiError && error.type === 'invalid_api_usage' && error.errors.some(error => 'reason' in error && error.reason === 'rate_limit_exceeded'))
			{
				this.executing = false;
				this.client.guaranteeQueueItem(this);
			}
			else
			{
				this.reject(error);
			};
			return;
		};
		this.client.removeQueueItem(this);
		this.promiseController.resolve(result);
		this.markExecuted();
	};
	private reject(error: any)
	{
		this.client.removeQueueItem(this);
		this.promiseController.reject(error);
		this.markExecuted();
	};
	private markExecuted()
	{
		this.executed = true;
		this.executing = false;
	};
	private async guaranteeIdempotencyKey()
	{
		if (!this.idempotencyKey)
		{
			this.idempotencyKey = await nanoid();
		};
		return this.idempotencyKey;
	};
};