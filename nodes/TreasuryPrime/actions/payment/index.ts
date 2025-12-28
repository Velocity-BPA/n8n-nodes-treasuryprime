/**
 * Treasury Prime Payment Actions
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const paymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['payment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new payment',
				action: 'Create a payment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a payment by ID',
				action: 'Get a payment',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all payments',
				action: 'List payments',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a payment',
				action: 'Cancel a payment',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get payment status',
				action: 'Get payment status',
			},
			{
				name: 'Schedule',
				value: 'schedule',
				description: 'Schedule a payment',
				action: 'Schedule a payment',
			},
			{
				name: 'Get Recurring',
				value: 'getRecurring',
				description: 'Get recurring payments',
				action: 'Get recurring payments',
			},
			{
				name: 'Create Recurring',
				value: 'createRecurring',
				description: 'Create a recurring payment',
				action: 'Create a recurring payment',
			},
			{
				name: 'Cancel Recurring',
				value: 'cancelRecurring',
				description: 'Cancel a recurring payment',
				action: 'Cancel a recurring payment',
			},
		],
		default: 'list',
	},
];

export const paymentFields: INodeProperties[] = [
	// Payment ID
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['get', 'cancel', 'getStatus'],
			},
		},
		default: '',
		description: 'The ID of the payment (starts with pmt_)',
	},
	// Recurring Payment ID
	{
		displayName: 'Recurring Payment ID',
		name: 'recurringPaymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['cancelRecurring'],
			},
		},
		default: '',
		description: 'The ID of the recurring payment (starts with rpmt_)',
	},
	// Account ID for create/schedule
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['create', 'schedule', 'createRecurring', 'getRecurring'],
			},
		},
		default: '',
		description: 'The ID of the source account (starts with acct_)',
	},
	// Counterparty ID
	{
		displayName: 'Counterparty ID',
		name: 'counterpartyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['create', 'schedule', 'createRecurring'],
			},
		},
		default: '',
		description: 'The ID of the counterparty (starts with cpty_)',
	},
	// Amount
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['create', 'schedule', 'createRecurring'],
			},
		},
		default: 0,
		description: 'Payment amount in cents (e.g., 1000 for $10.00)',
	},
	// Payment method
	{
		displayName: 'Payment Method',
		name: 'paymentMethod',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['create', 'schedule', 'createRecurring'],
			},
		},
		options: [
			{ name: 'ACH', value: 'ach' },
			{ name: 'Wire', value: 'wire' },
			{ name: 'Book Transfer', value: 'book' },
		],
		default: 'ach',
		description: 'Method for the payment',
	},
	// Schedule date
	{
		displayName: 'Schedule Date',
		name: 'scheduleDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['schedule'],
			},
		},
		default: '',
		description: 'Date when the payment should be executed',
	},
	// Recurring frequency
	{
		displayName: 'Frequency',
		name: 'frequency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createRecurring'],
			},
		},
		options: [
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Bi-Weekly', value: 'biweekly' },
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Annually', value: 'annually' },
		],
		default: 'monthly',
		description: 'Frequency of the recurring payment',
	},
	// Start date for recurring
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createRecurring'],
			},
		},
		default: '',
		description: 'Start date for the recurring payment',
	},
	// Return all
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['list', 'getRecurring'],
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
				resource: ['payment'],
				operation: ['list', 'getRecurring'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	// Additional fields for create
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['create', 'schedule'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the payment',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'External reference for the payment',
			},
			{
				displayName: 'Memo',
				name: 'memo',
				type: 'string',
				default: '',
				description: 'Memo for the payment (visible to recipient)',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '',
				description: 'Unique key to prevent duplicate payments',
			},
		],
	},
	// Additional fields for recurring
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createRecurring'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the recurring payment',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'End date for the recurring payment (optional)',
			},
			{
				displayName: 'Max Occurrences',
				name: 'max_occurrences',
				type: 'number',
				default: '',
				description: 'Maximum number of occurrences',
			},
		],
	},
	// Filters for list
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				description: 'Filter by account ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Failed', value: 'failed' },
				],
				default: '',
				description: 'Filter by payment status',
			},
			{
				displayName: 'Payment Method',
				name: 'payment_method',
				type: 'options',
				options: [
					{ name: 'ACH', value: 'ach' },
					{ name: 'Wire', value: 'wire' },
					{ name: 'Book Transfer', value: 'book' },
				],
				default: '',
				description: 'Filter by payment method',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter payments from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter payments up to this date',
			},
		],
	},
];

export async function executePaymentOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const paymentMethod = this.getNodeParameter('paymentMethod', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				counterparty_id: counterpartyId,
				amount,
				payment_method: paymentMethod,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				ENDPOINTS.PAYMENT,
				body,
			);
			break;
		}

		case 'get': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYMENT}/${paymentId}`,
			);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const qs: IDataObject = { ...filters };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					ENDPOINTS.PAYMENT,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.PAYMENT,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'cancel': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENT}/${paymentId}/cancel`,
			);
			break;
		}

		case 'getStatus': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			const response = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYMENT}/${paymentId}`,
			);
			responseData = { id: paymentId, status: (response as IDataObject).status };
			break;
		}

		case 'schedule': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const paymentMethod = this.getNodeParameter('paymentMethod', index) as string;
			const scheduleDate = this.getNodeParameter('scheduleDate', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				counterparty_id: counterpartyId,
				amount,
				payment_method: paymentMethod,
				scheduled_date: scheduleDate,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENT}/schedule`,
				body,
			);
			break;
		}

		case 'getRecurring': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = { account_id: accountId };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`${ENDPOINTS.PAYMENT}/recurring`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`${ENDPOINTS.PAYMENT}/recurring`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'createRecurring': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const paymentMethod = this.getNodeParameter('paymentMethod', index) as string;
			const frequency = this.getNodeParameter('frequency', index) as string;
			const startDate = this.getNodeParameter('startDate', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				counterparty_id: counterpartyId,
				amount,
				payment_method: paymentMethod,
				frequency,
				start_date: startDate,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENT}/recurring`,
				body,
			);
			break;
		}

		case 'cancelRecurring': {
			const recurringPaymentId = this.getNodeParameter('recurringPaymentId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENT}/recurring/${recurringPaymentId}/cancel`,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for payment resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executePaymentOperation;
