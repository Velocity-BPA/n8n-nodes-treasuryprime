/**
 * Treasury Prime Bill Pay Actions
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

export const billPayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
			},
		},
		options: [
			{
				name: 'Create Bill Payment',
				value: 'create',
				description: 'Create a new bill payment',
				action: 'Create a bill payment',
			},
			{
				name: 'Get Bill Payment',
				value: 'get',
				description: 'Get a bill payment by ID',
				action: 'Get a bill payment',
			},
			{
				name: 'List Bill Payments',
				value: 'list',
				description: 'List all bill payments',
				action: 'List bill payments',
			},
			{
				name: 'Cancel Bill Payment',
				value: 'cancel',
				description: 'Cancel a bill payment',
				action: 'Cancel a bill payment',
			},
			{
				name: 'Get Billers',
				value: 'getBillers',
				description: 'Get available billers',
				action: 'Get available billers',
			},
			{
				name: 'Search Billers',
				value: 'searchBillers',
				description: 'Search for billers',
				action: 'Search for billers',
			},
			{
				name: 'Add Biller',
				value: 'addBiller',
				description: 'Add a biller to account',
				action: 'Add a biller to account',
			},
			{
				name: 'Remove Biller',
				value: 'removeBiller',
				description: 'Remove a biller from account',
				action: 'Remove a biller from account',
			},
		],
		default: 'list',
	},
];

export const billPayFields: INodeProperties[] = [
	// Bill Payment ID
	{
		displayName: 'Bill Payment ID',
		name: 'billPaymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['get', 'cancel'],
			},
		},
		default: '',
		description: 'The ID of the bill payment (starts with bpmt_)',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['create', 'getBillers', 'addBiller', 'removeBiller'],
			},
		},
		default: '',
		description: 'The ID of the source account (starts with acct_)',
	},
	// Biller ID
	{
		displayName: 'Biller ID',
		name: 'billerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['create', 'removeBiller'],
			},
		},
		default: '',
		description: 'The ID of the biller (starts with blr_)',
	},
	// Amount
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Payment amount in cents (e.g., 1000 for $10.00)',
	},
	// Account number for biller
	{
		displayName: 'Biller Account Number',
		name: 'billerAccountNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['create', 'addBiller'],
			},
		},
		default: '',
		description: 'Your account number with the biller',
	},
	// Search query for billers
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['searchBillers'],
			},
		},
		default: '',
		description: 'Search query for biller name',
	},
	// Biller name for addBiller
	{
		displayName: 'Biller Name',
		name: 'billerName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['addBiller'],
			},
		},
		default: '',
		description: 'Name of the biller to add',
	},
	// Return all
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['list', 'getBillers', 'searchBillers'],
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
				resource: ['billPay'],
				operation: ['list', 'getBillers', 'searchBillers'],
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
				resource: ['billPay'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Memo',
				name: 'memo',
				type: 'string',
				default: '',
				description: 'Memo for the bill payment',
			},
			{
				displayName: 'Payment Date',
				name: 'payment_date',
				type: 'dateTime',
				default: '',
				description: 'Date to process the payment (defaults to today)',
			},
			{
				displayName: 'Delivery Method',
				name: 'delivery_method',
				type: 'options',
				options: [
					{ name: 'Electronic', value: 'electronic' },
					{ name: 'Check', value: 'check' },
				],
				default: 'electronic',
				description: 'How to deliver the payment to the biller',
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
	// Additional fields for addBiller
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['billPay'],
				operation: ['addBiller'],
			},
		},
		options: [
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'Friendly name for the biller',
			},
			{
				displayName: 'Biller Address Line 1',
				name: 'address_line_1',
				type: 'string',
				default: '',
				description: 'Biller address line 1',
			},
			{
				displayName: 'Biller Address Line 2',
				name: 'address_line_2',
				type: 'string',
				default: '',
				description: 'Biller address line 2',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'Biller city',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Biller state (2-letter code)',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				description: 'Biller postal code',
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
				resource: ['billPay'],
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
				displayName: 'Biller ID',
				name: 'biller_id',
				type: 'string',
				default: '',
				description: 'Filter by biller ID',
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

export async function executeBillPayOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const billerId = this.getNodeParameter('billerId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const billerAccountNumber = this.getNodeParameter('billerAccountNumber', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				biller_id: billerId,
				amount,
				biller_account_number: billerAccountNumber,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				ENDPOINTS.BILL_PAY,
				body,
			);
			break;
		}

		case 'get': {
			const billPaymentId = this.getNodeParameter('billPaymentId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.BILL_PAY}/${billPaymentId}`,
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
					ENDPOINTS.BILL_PAY,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.BILL_PAY,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'cancel': {
			const billPaymentId = this.getNodeParameter('billPaymentId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.BILL_PAY}/${billPaymentId}/cancel`,
			);
			break;
		}

		case 'getBillers': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = { account_id: accountId };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`${ENDPOINTS.BILL_PAY}/billers`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`${ENDPOINTS.BILL_PAY}/billers`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'searchBillers': {
			const searchQuery = this.getNodeParameter('searchQuery', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = { q: searchQuery };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`${ENDPOINTS.BILL_PAY}/billers/search`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`${ENDPOINTS.BILL_PAY}/billers/search`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'addBiller': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const billerName = this.getNodeParameter('billerName', index) as string;
			const billerAccountNumber = this.getNodeParameter('billerAccountNumber', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				name: billerName,
				account_number: billerAccountNumber,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.BILL_PAY}/billers`,
				body,
			);
			break;
		}

		case 'removeBiller': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const billerId = this.getNodeParameter('billerId', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'DELETE',
				`${ENDPOINTS.BILL_PAY}/billers/${billerId}`,
				{},
				{ account_id: accountId },
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for billPay resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeBillPayOperation;
