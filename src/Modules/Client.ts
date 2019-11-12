'use strict';

// External Modules
import { Domain, Definition as RequestDefinition, Result as RequestResult, RequestJsonError } from '@chris-talman/request';
import { delay, PromiseController } from '@chris-talman/isomorphic-utilities';

// Internal Modules
import { RateLimitError, QueueTimeoutError } from './Errors';
import { ApiError } from './ApiError';
import { throwRejectionApiError } from 'src/Modules/ApiError';
import { Mandates } from './Methods/Mandates';
import { CustomerBankAccounts } from './Methods/CustomerBankAccounts';
import { Payments } from './Methods/Payments';
import { RedirectFlows } from './Methods/RedirectFlows';

// Types
import { RequestOptions } from 'src/Modules';
interface RateLimit
{
	limit: number;
	remaining: number;
	reset: number;
};
type RateLimitVariant = RateLimit | undefined;
interface Queue extends Array<ScheduledRequest<any>> {};

// Constants
const DEFAULT_RATE_LIMIT = 1000;
const MINUTE_MILLISECONDS = 1000 * 60;

export class Client
{
	public readonly subdomain: 'api' | 'api-sandbox';
	public readonly accessToken: string;
	public readonly version: string;
	public readonly domain: Domain;
	private readonly queue: Queue = [];
	private rateLimit: RateLimitVariant;
	/**
		Callback invoked before every request to validate that the rate limit has not been exceeded.
		If returns `true`, request will proceed.
		If returns `false`, request will not proceed, and `RateLimitError` will throw, unless `options.useQueue` is enabled.
	*/
	public validateRateLimit?: (rateLimit: RateLimitVariant) => Promise<boolean>;
	private rateLimitResetTimeout?: NodeJS.Timeout;
	private queueItemTimeoutMilliseconds = 180000;
	constructor
	(
		{ subdomain, accessToken, version, queueItemTimeoutMilliseconds }:
		{ subdomain: Client['subdomain'], accessToken: Client['accessToken'], version: Client['version'], queueItemTimeoutMilliseconds?: number }
	)
	{
		this.subdomain = subdomain;
		this.accessToken = accessToken;
		this.version = version;
		const url = 'https://' + this.subdomain + '.gocardless.com';
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => 'Bearer ' + accessToken,
				headers:
				{
					'GoCardless-Version': version
				}
			}
		);
		if (typeof queueItemTimeoutMilliseconds === 'number') this.queueItemTimeoutMilliseconds = queueItemTimeoutMilliseconds;
	};
	public async scheduleApiRequest <GenericResultJson> ({request, options = {}}: {request: RequestDefinition, options?: RequestOptions})
	{
		const scheduledRequest = new ScheduledRequest <GenericResultJson> ({request, options, client: this});
		const result = await scheduledRequest.promiseController.promise;
		return result;
	};
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		let result: GenericResult;
		try
		{
			result = await throwRejectionApiError(this.domain.request(request));
		}
		catch (error)
		{
			if (error instanceof RequestJsonError)
			{
				this.recordRateLimit(error.response);
			}
			else if (error instanceof ApiError)
			{
				this.recordRateLimit(error.error.response);
			};
			throw error;
		};
		this.recordRateLimit(result.response);
		return result;
	};
	private recordRateLimit(response: RequestResult<any>['response'])
	{
		const { headers } = response;
		const rawLimit = headers.get('RateLimit-Limit');
		const rawRemaining = headers.get('RateLimit-Remaining');
		const rawReset = headers.get('RateLimit-Reset');
		if (rawLimit === null || rawRemaining === null || rawReset === null) throw new Error('Rate limit headers not found');
		const limit = parseInt(rawLimit);
		const remaining = parseInt(rawRemaining);
		const reset = (new Date(rawReset)).valueOf();
		const rateLimit: RateLimit =
		{
			limit,
			remaining,
			reset
		};
		this.rateLimit = rateLimit;
	};
	public async consumeRateLimit <GenericScheduledRequest extends ScheduledRequest<any>> (scheduledRequest: GenericScheduledRequest)
	{
		if (this.validateRateLimit)
		{
			const valid = await this.validateRateLimit(this.rateLimit);
			if (!valid)
			{
				if (!scheduledRequest.options.useQueue)
				{
					throw new RateLimitError();
				};
			};
		};
		if (this.rateLimit === undefined || this.rateLimit.remaining > 0)
		{
			this.recordRateLimitConsumed();
			return;
		};
		if (!scheduledRequest.options.useQueue)
		{
			throw new RateLimitError();
		};
		this.guaranteeQueueItem(scheduledRequest);
		this.timeoutQueueItem(scheduledRequest);
		this.guaranteeRateLimitResetTimeout();
	};
	private async timeoutQueueItem <GenericScheduledRequest extends ScheduledRequest<any>> (item: GenericScheduledRequest)
	{
		await delay(this.queueItemTimeoutMilliseconds);
		const timeoutError = new QueueTimeoutError();
		item.promiseController.reject(timeoutError);
	};
	private guaranteeRateLimitResetTimeout()
	{
		if (this.rateLimitResetTimeout) return;
		const delay = this.generateRateLimitResetDelay();
		this.rateLimitResetTimeout = setTimeout(this.processQueue, delay);
	};
	private generateRateLimitResetDelay()
	{
		if (this.rateLimit === undefined) throw new Error('Rate limit undefined');
		let delay = this.rateLimit.reset - Date.now();
		if (delay < 0)
		{
			delay = 0;
		};
		return delay;
	};
	private processQueue()
	{
		if (this.rateLimit === undefined) throw new Error('Rate limit undefined');
		const processable = this.queue.slice(0, this.rateLimit.limit);
		for (let item of processable)
		{
			item.execute();
		};
		this.guaranteeRateLimitResetTimeout();
	};
	private recordRateLimitConsumed()
	{
		if (this.rateLimit === undefined)
		{
			this.rateLimit =
			{
				limit: DEFAULT_RATE_LIMIT,
				remaining: DEFAULT_RATE_LIMIT,
				reset: Date.now() + MINUTE_MILLISECONDS
			};
		};
		this.rateLimit.remaining -= 1;
	};
	public guaranteeQueueItem <GenericScheduledRequest extends ScheduledRequest<any>> (item: GenericScheduledRequest)
	{
		const queueItem = this.queue.find(currentItem => currentItem === item);
		if (queueItem) return;
		this.queue.push(item);
	};
	public removeQueueItem <GenericScheduledRequest extends ScheduledRequest<any>> (item: GenericScheduledRequest)
	{
		const queueItemIndex = this.queue.findIndex(currentItem => currentItem === item);
		if (queueItemIndex === -1) return;
		this.queue.splice(queueItemIndex, 1);
	};
	public mandates = new Mandates({client: this});
	public customerBankAccounts = new CustomerBankAccounts({client: this});
	public payments = new Payments({client: this});
	public redirectFlows = new RedirectFlows({client: this});
};

export class ScheduledRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson> = RequestResult<GenericResultJson>>
{
	public readonly client: Client;
	public readonly request: RequestDefinition;
	public readonly options: RequestOptions;
	public readonly promiseController: PromiseController <RequestResult<GenericResultJson>>;
	private executing = false;
	constructor({request, options, client}: {request: RequestDefinition, options: RequestOptions, client: Client})
	{
		this.request = request;
		this.options = options;
		this.client = client;
		this.promiseController = new PromiseController();
		this.execute();
	};
	public async execute()
	{
		if (this.executing) return;
		this.executing = true;
		try
		{
			await this.client.consumeRateLimit(this);
		}
		catch (error)
		{
			this.reject(error);
		};
		const { request } = this;
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
	};
	private reject(error: any)
	{
		this.client.removeQueueItem(this);
		this.promiseController.reject(error);
	};
};