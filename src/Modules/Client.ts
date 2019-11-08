'use strict';

// External Modules
import { Domain, Definition as RequestDefinition } from '@chris-talman/request';
import { delay, PromiseController } from '@chris-talman/isomorphic-utilities';

// Internal Modules
import { RateLimitError, QueueTimeoutError } from './Errors';
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
	cluster?: RateLimitCluster;
};
interface RateLimitCluster
{
	/** Number of nodes in cluster. */
	nodes: number;
	/** Number of requests in queue in cluster. */
	queue: number;
};
interface Queue extends Array<QueueItem> {};
type QueueItem = PromiseController;

export class Client
{
	public readonly subdomain: 'api' | 'api-sandbox';
	public readonly accessToken: string;
	public readonly version: string;
	public readonly domain: Domain;
	private readonly queue: Queue = [];
	private rateLimit: RateLimit | undefined;
	private fetchRateLimit?: () => Promise<RateLimit>;
	private onRateLimitConsumed?: (rateLimit: RateLimit) => any;
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
	public async executeApiRequest <GenericResult> ({request: requestDefinition, options}: {request: RequestDefinition, options?: RequestOptions})
	{
		const { useQueue } = generateDefaultRequestOptions(options);
		await this.consumeRateLimit({useQueue: useQueue === true});
		const result = await throwRejectionApiError(this.domain.request<GenericResult>(requestDefinition));
		const { headers } = result.response;
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
		return result;
	};
	public async consumeRateLimit({useQueue}: {useQueue: boolean})
	{
		const rateLimit = this.fetchRateLimit ? await this.fetchRateLimit() : this.rateLimit;
		if (rateLimit === undefined) return;
		if (rateLimit.remaining > 0)
		{
			this.recordRateLimitConsumed();
			return;
		}
		if (!useQueue)
		{
			throw new RateLimitError();
		};
		const queueItem = new PromiseController();
		this.queue.push(queueItem);
		this.timeoutQueueItem(queueItem);
		this.guaranteeRateLimitResetTimeout();
		await queueItem.promise;
	};
	private async timeoutQueueItem(item: QueueItem)
	{
		await delay(this.queueItemTimeoutMilliseconds);
		const timeoutError = new QueueTimeoutError();
		item.reject(timeoutError);
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
		let processableTotal = this.rateLimit.limit;
		if (this.rateLimit.cluster)
		{
			processableTotal = Math.floor(this.rateLimit.limit / this.rateLimit.cluster.nodes);
		};
		const processableQueue = this.queue.slice(0, processableTotal);
		for (let item of processableQueue)
		{
			item.resolve(undefined);
			this.recordRateLimitConsumed();
		};
		this.guaranteeRateLimitResetTimeout();
	};
	private recordRateLimitConsumed()
	{
		if (this.rateLimit === undefined) throw new Error('Rate limit undefined');
		this.rateLimit.remaining -= 1;
		this.dispatchRateLimitConsumedEvent();
	};
	private dispatchRateLimitConsumedEvent()
	{
		if (!this.onRateLimitConsumed) return;
		if (this.rateLimit === undefined) throw new Error('Rate limit undefined');
		this.onRateLimitConsumed(this.rateLimit);
	};
	public mandates = new Mandates({client: this});
	public customerBankAccounts = new CustomerBankAccounts({client: this});
	public payments = new Payments({client: this});
	public redirectFlows = new RedirectFlows({client: this});
};

function generateDefaultRequestOptions(options: RequestOptions | undefined)
{
	if (options === undefined)
	{
		options =
		{
			useQueue: false
		};
	};
	return options;
};