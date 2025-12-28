/**
 * Treasury Prime Alert Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';

export const alertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alert'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new alert',
				action: 'Create an alert',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an alert',
				action: 'Delete an alert',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an alert by ID',
				action: 'Get an alert',
			},
			{
				name: 'Get by Account',
				value: 'getByAccount',
				description: 'Get alerts for an account',
				action: 'Get alerts by account',
			},
			{
				name: 'Get Types',
				value: 'getTypes',
				description: 'Get available alert types',
				action: 'Get alert types',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all alerts',
				action: 'List all alerts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an alert',
				action: 'Update an alert',
			},
		],
		default: 'list',
	},
];

export const alertFields: INodeProperties[] = [
	// ----------------------------------
	//         alert: create
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		description: 'The ID of the account to create the alert for',
	},
	{
		displayName: 'Alert Type',
		name: 'alertType',
		type: 'options',
		required: true,
		default: 'balance_threshold',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Balance Threshold',
				value: 'balance_threshold',
				description: 'Alert when balance crosses a threshold',
			},
			{
				name: 'Large Transaction',
				value: 'large_transaction',
				description: 'Alert for transactions above a certain amount',
			},
			{
				name: 'Low Balance',
				value: 'low_balance',
				description: 'Alert when balance falls below threshold',
			},
			{
				name: 'Transaction',
				value: 'transaction',
				description: 'Alert for any transaction',
			},
			{
				name: 'ACH Return',
				value: 'ach_return',
				description: 'Alert for ACH returns',
			},
			{
				name: 'Wire Received',
				value: 'wire_received',
				description: 'Alert for incoming wires',
			},
			{
				name: 'Check Cashed',
				value: 'check_cashed',
				description: 'Alert when a check is cashed',
			},
			{
				name: 'Card Transaction',
				value: 'card_transaction',
				description: 'Alert for card transactions',
			},
		],
		description: 'The type of alert to create',
	},
	{
		displayName: 'Notification Method',
		name: 'notificationMethod',
		type: 'options',
		required: true,
		default: 'email',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Email',
				value: 'email',
			},
			{
				name: 'SMS',
				value: 'sms',
			},
			{
				name: 'Webhook',
				value: 'webhook',
			},
			{
				name: 'Push Notification',
				value: 'push',
			},
		],
		description: 'How the alert notification should be delivered',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Amount Threshold (Cents)',
				name: 'amountThreshold',
				type: 'number',
				default: 0,
				description: 'Amount threshold in cents for balance or transaction alerts',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Both', value: 'both' },
					{ name: 'Credit', value: 'credit' },
					{ name: 'Debit', value: 'debit' },
				],
				default: 'both',
				description: 'Transaction direction to monitor',
			},
			{
				displayName: 'Email Address',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address for notifications',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for SMS notifications',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				description: 'Webhook URL for notifications',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the alert',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the alert is enabled',
			},
		],
	},

	// ----------------------------------
	//         alert: get
	// ----------------------------------
	{
		displayName: 'Alert ID',
		name: 'alertId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the alert',
	},

	// ----------------------------------
	//         alert: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount Threshold (Cents)',
				name: 'amountThreshold',
				type: 'number',
				default: 0,
				description: 'Amount threshold in cents',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the alert',
			},
			{
				displayName: 'Email Address',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address for notifications',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the alert is enabled',
			},
			{
				displayName: 'Notification Method',
				name: 'notificationMethod',
				type: 'options',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Webhook', value: 'webhook' },
					{ name: 'Push Notification', value: 'push' },
				],
				default: 'email',
				description: 'How the alert notification should be delivered',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for SMS notifications',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				description: 'Webhook URL for notifications',
			},
		],
	},

	// ----------------------------------
	//         alert: getByAccount
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['getByAccount'],
			},
		},
		description: 'The ID of the account',
	},

	// ----------------------------------
	//         alert: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['alert'],
				operation: ['list', 'getByAccount'],
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
				resource: ['alert'],
				operation: ['list', 'getByAccount'],
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
				resource: ['alert'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Alert Type',
				name: 'alertType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Balance Threshold', value: 'balance_threshold' },
					{ name: 'Large Transaction', value: 'large_transaction' },
					{ name: 'Low Balance', value: 'low_balance' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'ACH Return', value: 'ach_return' },
					{ name: 'Wire Received', value: 'wire_received' },
					{ name: 'Check Cashed', value: 'check_cashed' },
					{ name: 'Card Transaction', value: 'card_transaction' },
				],
				default: '',
				description: 'Filter by alert type',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Filter by enabled status',
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
			const accountId = this.getNodeParameter('accountId', index) as string;
			const alertType = this.getNodeParameter('alertType', index) as string;
			const notificationMethod = this.getNodeParameter('notificationMethod', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				type: alertType,
				notification_method: notificationMethod,
			};

			if (additionalFields.amountThreshold !== undefined) {
				body.amount_threshold = additionalFields.amountThreshold;
			}
			if (additionalFields.direction) {
				body.direction = additionalFields.direction;
			}
			if (additionalFields.email) {
				body.email = additionalFields.email;
			}
			if (additionalFields.phone) {
				body.phone = additionalFields.phone;
			}
			if (additionalFields.webhookUrl) {
				body.webhook_url = additionalFields.webhookUrl;
			}
			if (additionalFields.description) {
				body.description = additionalFields.description;
			}
			if (additionalFields.enabled !== undefined) {
				body.enabled = additionalFields.enabled;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/alert', body);
			break;
		}

		case 'get': {
			const alertId = this.getNodeParameter('alertId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/alert/${alertId}`);
			break;
		}

		case 'update': {
			const alertId = this.getNodeParameter('alertId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};

			if (updateFields.amountThreshold !== undefined) {
				body.amount_threshold = updateFields.amountThreshold;
			}
			if (updateFields.description) {
				body.description = updateFields.description;
			}
			if (updateFields.email) {
				body.email = updateFields.email;
			}
			if (updateFields.enabled !== undefined) {
				body.enabled = updateFields.enabled;
			}
			if (updateFields.notificationMethod) {
				body.notification_method = updateFields.notificationMethod;
			}
			if (updateFields.phone) {
				body.phone = updateFields.phone;
			}
			if (updateFields.webhookUrl) {
				body.webhook_url = updateFields.webhookUrl;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'PATCH', `/alert/${alertId}`, body);
			break;
		}

		case 'delete': {
			const alertId = this.getNodeParameter('alertId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(this, 'DELETE', `/alert/${alertId}`);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;

			const qs: IDataObject = {};

			if (filters.alertType) {
				qs.type = filters.alertType;
			}
			if (filters.enabled !== undefined) {
				qs.enabled = filters.enabled;
			}

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(this, 'GET', '/alert', {}, qs);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.page_size = limit;
				const response = await treasuryPrimeApiRequest.call(this, 'GET', '/alert', {}, qs);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'getByAccount': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`/account/${accountId}/alert`,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`/account/${accountId}/alert`,
					{},
					{ page_size: limit },
				);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'getTypes': {
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/alert/types');
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
