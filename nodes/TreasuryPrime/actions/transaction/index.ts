/**
 * Treasury Prime Transaction Actions
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

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a transaction by ID',
				action: 'Get a transaction',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all transactions',
				action: 'List transactions',
			},
			{
				name: 'Get By Account',
				value: 'getByAccount',
				description: 'Get transactions by account',
				action: 'Get transactions by account',
			},
			{
				name: 'Get By Date Range',
				value: 'getByDateRange',
				description: 'Get transactions by date range',
				action: 'Get transactions by date range',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search transactions',
				action: 'Search transactions',
			},
			{
				name: 'Get Pending',
				value: 'getPending',
				description: 'Get pending transactions',
				action: 'Get pending transactions',
			},
			{
				name: 'Get Posted',
				value: 'getPosted',
				description: 'Get posted transactions',
				action: 'Get posted transactions',
			},
			{
				name: 'Export',
				value: 'export',
				description: 'Export transactions',
				action: 'Export transactions',
			},
			{
				name: 'Categorize',
				value: 'categorize',
				description: 'Categorize a transaction',
				action: 'Categorize a transaction',
			},
		],
		default: 'list',
	},
];

export const transactionFields: INodeProperties[] = [
	// Transaction ID for get operation
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['get', 'categorize'],
			},
		},
		default: '',
		description: 'The ID of the transaction (starts with txn_)',
	},
	// Account ID for getByAccount
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getByAccount', 'getPending', 'getPosted', 'export'],
			},
		},
		default: '',
		description: 'The ID of the account (starts with acct_)',
	},
	// Date range fields
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getByDateRange', 'export'],
			},
		},
		default: '',
		description: 'Start date for the date range',
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getByDateRange', 'export'],
			},
		},
		default: '',
		description: 'End date for the date range',
	},
	// Search query
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['search'],
			},
		},
		default: '',
		description: 'Search query for transactions (description, reference, etc.)',
	},
	// Category for categorize
	{
		displayName: 'Category',
		name: 'category',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['categorize'],
			},
		},
		default: '',
		description: 'Category to assign to the transaction',
	},
	// Export format
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['export'],
			},
		},
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
			{ name: 'OFX', value: 'ofx' },
			{ name: 'QFX', value: 'qfx' },
		],
		default: 'csv',
		description: 'Format for the exported transactions',
	},
	// Return all for list operations
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['list', 'getByAccount', 'getByDateRange', 'search', 'getPending', 'getPosted'],
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
				resource: ['transaction'],
				operation: ['list', 'getByAccount', 'getByDateRange', 'search', 'getPending', 'getPosted'],
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
	// Filters
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['list', 'getByAccount', 'search'],
			},
		},
		options: [
			{
				displayName: 'Transaction Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'ACH', value: 'ach' },
					{ name: 'Book Transfer', value: 'book' },
					{ name: 'Card', value: 'card' },
					{ name: 'Check', value: 'check' },
					{ name: 'Fee', value: 'fee' },
					{ name: 'Interest', value: 'interest' },
					{ name: 'Wire', value: 'wire' },
				],
				default: '',
				description: 'Filter by transaction type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Posted', value: 'posted' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Returned', value: 'returned' },
				],
				default: '',
				description: 'Filter by transaction status',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Credit', value: 'credit' },
					{ name: 'Debit', value: 'debit' },
				],
				default: '',
				description: 'Filter by transaction direction',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter transactions from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter transactions up to this date',
			},
			{
				displayName: 'Min Amount (Cents)',
				name: 'min_amount',
				type: 'number',
				default: '',
				description: 'Minimum transaction amount in cents',
			},
			{
				displayName: 'Max Amount (Cents)',
				name: 'max_amount',
				type: 'number',
				default: '',
				description: 'Maximum transaction amount in cents',
			},
		],
	},
];

export async function executeTransactionOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'get': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.TRANSACTION}/${transactionId}`,
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
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getByAccount': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const qs: IDataObject = { account_id: accountId, ...filters };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getByDateRange': {
			const fromDate = this.getNodeParameter('fromDate', index) as string;
			const toDate = this.getNodeParameter('toDate', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = {
				from_date: fromDate,
				to_date: toDate,
			};

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'search': {
			const searchQuery = this.getNodeParameter('searchQuery', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const qs: IDataObject = { q: searchQuery, ...filters };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`${ENDPOINTS.TRANSACTION}/search`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`${ENDPOINTS.TRANSACTION}/search`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getPending': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = { account_id: accountId, status: 'pending' };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getPosted': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = { account_id: accountId, status: 'posted' };

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.TRANSACTION,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'export': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const fromDate = this.getNodeParameter('fromDate', index) as string;
			const toDate = this.getNodeParameter('toDate', index) as string;
			const exportFormat = this.getNodeParameter('exportFormat', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.TRANSACTION}/export`,
				{
					account_id: accountId,
					from_date: fromDate,
					to_date: toDate,
					format: exportFormat,
				},
			);
			break;
		}

		case 'categorize': {
			const transactionId = this.getNodeParameter('transactionId', index) as string;
			const category = this.getNodeParameter('category', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'PATCH',
				`${ENDPOINTS.TRANSACTION}/${transactionId}`,
				{ category },
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for transaction resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeTransactionOperation;
