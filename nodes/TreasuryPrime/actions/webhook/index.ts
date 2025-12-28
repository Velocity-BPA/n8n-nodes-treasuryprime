/**
 * Treasury Prime Webhook Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';
import { computeWebhookSignature } from '../../utils/signatureUtils';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook by ID',
				action: 'Get a webhook',
			},
			{
				name: 'Get Deliveries',
				value: 'getDeliveries',
				description: 'Get webhook delivery attempts',
				action: 'Get webhook deliveries',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get events for a webhook',
				action: 'Get webhook events',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhooks',
				action: 'List all webhooks',
			},
			{
				name: 'Retry',
				value: 'retry',
				description: 'Retry a failed webhook delivery',
				action: 'Retry webhook delivery',
			},
			{
				name: 'Test',
				value: 'test',
				description: 'Send a test event to the webhook',
				action: 'Test a webhook',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
			},
			{
				name: 'Verify Signature',
				value: 'verifySignature',
				description: 'Verify a webhook signature',
				action: 'Verify webhook signature',
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook: create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The URL where webhook events will be sent',
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'multiOptions',
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			// Account events
			{ name: 'Account Created', value: 'account.created' },
			{ name: 'Account Updated', value: 'account.updated' },
			{ name: 'Account Closed', value: 'account.closed' },
			{ name: 'Account Status Changed', value: 'account.status_changed' },
			// Application events
			{ name: 'Application Created', value: 'account_application.created' },
			{ name: 'Application Submitted', value: 'account_application.submitted' },
			{ name: 'Application Approved', value: 'account_application.approved' },
			{ name: 'Application Denied', value: 'account_application.denied' },
			// Person events
			{ name: 'Person Created', value: 'person.created' },
			{ name: 'Person Updated', value: 'person.updated' },
			{ name: 'Person KYC Status Changed', value: 'person.kyc_status_changed' },
			// Business events
			{ name: 'Business Created', value: 'business.created' },
			{ name: 'Business Updated', value: 'business.updated' },
			{ name: 'Business KYB Status Changed', value: 'business.kyb_status_changed' },
			// ACH events
			{ name: 'ACH Created', value: 'ach.created' },
			{ name: 'ACH Pending', value: 'ach.pending' },
			{ name: 'ACH Sent', value: 'ach.sent' },
			{ name: 'ACH Completed', value: 'ach.completed' },
			{ name: 'ACH Returned', value: 'ach.returned' },
			{ name: 'ACH Canceled', value: 'ach.canceled' },
			{ name: 'ACH NOC Received', value: 'ach.noc_received' },
			// Wire events
			{ name: 'Wire Created', value: 'wire.created' },
			{ name: 'Wire Pending', value: 'wire.pending' },
			{ name: 'Wire Sent', value: 'wire.sent' },
			{ name: 'Wire Completed', value: 'wire.completed' },
			{ name: 'Wire Returned', value: 'wire.returned' },
			{ name: 'Wire Canceled', value: 'wire.canceled' },
			// Book transfer events
			{ name: 'Book Transfer Created', value: 'book.created' },
			{ name: 'Book Transfer Completed', value: 'book.completed' },
			// Check events
			{ name: 'Check Created', value: 'check.created' },
			{ name: 'Check Mailed', value: 'check.mailed' },
			{ name: 'Check Cashed', value: 'check.cashed' },
			{ name: 'Check Voided', value: 'check.voided' },
			{ name: 'Check Returned', value: 'check.returned' },
			{ name: 'Check Deposit Created', value: 'check_deposit.created' },
			{ name: 'Check Deposit Cleared', value: 'check_deposit.cleared' },
			{ name: 'Check Deposit Returned', value: 'check_deposit.returned' },
			// Card events
			{ name: 'Card Created', value: 'card.created' },
			{ name: 'Card Activated', value: 'card.activated' },
			{ name: 'Card Locked', value: 'card.locked' },
			{ name: 'Card Unlocked', value: 'card.unlocked' },
			{ name: 'Card Transaction', value: 'card.transaction' },
			// Transaction events
			{ name: 'Transaction Created', value: 'transaction.created' },
			{ name: 'Transaction Posted', value: 'transaction.posted' },
			{ name: 'Transaction Pending', value: 'transaction.pending' },
			// All events
			{ name: 'All Events (*)', value: '*' },
		],
		description: 'The event types to subscribe to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret used to sign webhook payloads',
			},
		],
	},

	// ----------------------------------
	//         webhook: get, update, delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test', 'getEvents', 'getDeliveries'],
			},
		},
		description: 'The ID of the webhook',
	},

	// ----------------------------------
	//         webhook: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Event Types',
				name: 'eventTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Account Created', value: 'account.created' },
					{ name: 'Account Updated', value: 'account.updated' },
					{ name: 'ACH Completed', value: 'ach.completed' },
					{ name: 'ACH Returned', value: 'ach.returned' },
					{ name: 'Wire Completed', value: 'wire.completed' },
					{ name: 'Card Transaction', value: 'card.transaction' },
					{ name: 'All Events (*)', value: '*' },
				],
				default: [],
				description: 'The event types to subscribe to',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret used to sign webhook payloads',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL where webhook events will be sent',
			},
		],
	},

	// ----------------------------------
	//         webhook: test
	// ----------------------------------
	{
		displayName: 'Event Type',
		name: 'testEventType',
		type: 'options',
		required: true,
		default: 'account.created',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['test'],
			},
		},
		options: [
			{ name: 'Account Created', value: 'account.created' },
			{ name: 'ACH Completed', value: 'ach.completed' },
			{ name: 'Wire Completed', value: 'wire.completed' },
			{ name: 'Card Transaction', value: 'card.transaction' },
			{ name: 'Ping', value: 'ping' },
		],
		description: 'The type of test event to send',
	},

	// ----------------------------------
	//         webhook: retry
	// ----------------------------------
	{
		displayName: 'Delivery ID',
		name: 'deliveryId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['retry'],
			},
		},
		description: 'The ID of the delivery to retry',
	},

	// ----------------------------------
	//         webhook: verifySignature
	// ----------------------------------
	{
		displayName: 'Payload',
		name: 'payload',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		description: 'The raw webhook payload',
	},
	{
		displayName: 'Signature',
		name: 'signature',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		description: 'The signature from the X-Treasury-Prime-Signature header',
	},
	{
		displayName: 'Secret',
		name: 'secret',
		type: 'string',
		required: true,
		typeOptions: {
			password: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['verifySignature'],
			},
		},
		description: 'The webhook secret',
	},

	// ----------------------------------
	//         webhook: list, getEvents, getDeliveries
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list', 'getEvents', 'getDeliveries'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list', 'getEvents', 'getDeliveries'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 25,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getDeliveries'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Success', value: 'success' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
				],
				default: '',
				description: 'Filter by delivery status',
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Filter deliveries from this date',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Filter deliveries until this date',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'create': {
			const url = this.getNodeParameter('url', index) as string;
			const eventTypes = this.getNodeParameter('eventTypes', index) as string[];
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				url,
				event_types: eventTypes,
			};

			if (additionalFields.description) {
				body.description = additionalFields.description;
			}
			if (additionalFields.enabled !== undefined) {
				body.enabled = additionalFields.enabled;
			}
			if (additionalFields.secret) {
				body.secret = additionalFields.secret;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/webhook', body);
			break;
		}

		case 'get': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/webhook/${webhookId}`);
			break;
		}

		case 'update': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};

			if (updateFields.description) {
				body.description = updateFields.description;
			}
			if (updateFields.enabled !== undefined) {
				body.enabled = updateFields.enabled;
			}
			if (updateFields.eventTypes) {
				body.event_types = updateFields.eventTypes;
			}
			if (updateFields.secret) {
				body.secret = updateFields.secret;
			}
			if (updateFields.url) {
				body.url = updateFields.url;
			}

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'PATCH',
				`/webhook/${webhookId}`,
				body,
			);
			break;
		}

		case 'delete': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(this, 'DELETE', `/webhook/${webhookId}`);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(this, 'GET', '/webhook');
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					'/webhook',
					{},
					{ page_size: limit },
				);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'test': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const testEventType = this.getNodeParameter('testEventType', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/webhook/${webhookId}/test`,
				{ event_type: testEventType },
			);
			break;
		}

		case 'getEvents': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`/webhook/${webhookId}/event`,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`/webhook/${webhookId}/event`,
					{},
					{ page_size: limit },
				);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'getDeliveries': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;

			const qs: IDataObject = {};

			if (filters.status) {
				qs.status = filters.status;
			}
			if (filters.fromDate) {
				qs.from_date = filters.fromDate;
			}
			if (filters.toDate) {
				qs.to_date = filters.toDate;
			}

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`/webhook/${webhookId}/delivery`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.page_size = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`/webhook/${webhookId}/delivery`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'retry': {
			const deliveryId = this.getNodeParameter('deliveryId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/webhook/delivery/${deliveryId}/retry`,
			);
			break;
		}

		case 'verifySignature': {
			const payload = this.getNodeParameter('payload', index) as string;
			const signature = this.getNodeParameter('signature', index) as string;
			const secret = this.getNodeParameter('secret', index) as string;

			const expectedSignature = computeWebhookSignature(payload, secret);
			const isValid = signature === expectedSignature;

			responseData = {
				valid: isValid,
				expectedSignature,
				providedSignature: signature,
			};
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
