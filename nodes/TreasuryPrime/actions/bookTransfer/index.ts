/**
 * Treasury Prime Book Transfer Resource
 * 
 * Handles internal book transfers between accounts within the same bank.
 * These are immediate transfers with no external clearing.
 * 
 * @copyright Velocity BPA 2025
 * @license BSL-1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';

import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';

export const bookTransferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
			},
		},
		options: [
			{
				name: 'Create Transfer',
				value: 'create',
				description: 'Create a new internal book transfer',
				action: 'Create a book transfer',
			},
			{
				name: 'Get Transfer',
				value: 'get',
				description: 'Get book transfer details by ID',
				action: 'Get a book transfer',
			},
			{
				name: 'List Transfers',
				value: 'list',
				description: 'List all book transfers',
				action: 'List book transfers',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get book transfer status',
				action: 'Get book transfer status',
			},
		],
		default: 'create',
	},
];

export const bookTransferFields: INodeProperties[] = [
	// ----------------------------------
	//         Create Book Transfer
	// ----------------------------------
	{
		displayName: 'From Account ID',
		name: 'fromAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The source account ID for the transfer',
	},
	{
		displayName: 'To Account ID',
		name: 'toAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The destination account ID for the transfer',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'The transfer amount in cents (e.g., 5000 for $50.00)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description/memo for the transfer',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'External reference number',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '',
				description: 'Unique key to prevent duplicate transfers',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata as JSON',
			},
		],
	},
	// ----------------------------------
	//         Get Transfer
	// ----------------------------------
	{
		displayName: 'Book Transfer ID',
		name: 'bookTransferId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['get', 'getStatus'],
			},
		},
		default: '',
		placeholder: 'book_xxx',
		description: 'The book transfer ID',
	},
	// ----------------------------------
	//         List Transfers
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['bookTransfer'],
				operation: ['list'],
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
				resource: ['bookTransfer'],
				operation: ['list'],
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
				resource: ['bookTransfer'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				description: 'Filter by account ID (source or destination)',
			},
			{
				displayName: 'From Account ID',
				name: 'from_account_id',
				type: 'string',
				default: '',
				description: 'Filter by source account ID',
			},
			{
				displayName: 'To Account ID',
				name: 'to_account_id',
				type: 'string',
				default: '',
				description: 'Filter by destination account ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
				],
				default: '',
				description: 'Filter by status',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter transfers from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter transfers to this date',
			},
		],
	},
];

/**
 * Execute book transfer operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		// Create a book transfer
		const fromAccountId = this.getNodeParameter('fromAccountId', index) as string;
		const toAccountId = this.getNodeParameter('toAccountId', index) as string;
		const amount = this.getNodeParameter('amount', index) as number;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			from_account_id: fromAccountId,
			to_account_id: toAccountId,
			amount,
		};

		if (additionalFields.description) {
			body.description = additionalFields.description;
		}
		if (additionalFields.reference) {
			body.reference = additionalFields.reference;
		}
		if (additionalFields.metadata) {
			body.metadata = typeof additionalFields.metadata === 'string'
				? JSON.parse(additionalFields.metadata)
				: additionalFields.metadata;
		}

		const headers: IDataObject = {};
		if (additionalFields.idempotency_key) {
			headers['Idempotency-Key'] = additionalFields.idempotency_key;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			'/book',
			body,
			{},
			{ headers },
		);

	} else if (operation === 'get') {
		// Get book transfer by ID
		const bookTransferId = this.getNodeParameter('bookTransferId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/book/${bookTransferId}`);

	} else if (operation === 'list') {
		// List book transfers
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.from_account_id) qs.from_account_id = filters.from_account_id;
		if (filters.to_account_id) qs.to_account_id = filters.to_account_id;
		if (filters.status) qs.status = filters.status;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/book',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/book', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'getStatus') {
		// Get book transfer status
		const bookTransferId = this.getNodeParameter('bookTransferId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/book/${bookTransferId}`);
		
		responseData = {
			id: response.id,
			status: response.status,
			from_account_id: response.from_account_id,
			to_account_id: response.to_account_id,
			amount: response.amount,
			completed_at: response.completed_at,
			created_at: response.created_at,
			updated_at: response.updated_at,
		};
	}

	// Handle array responses
	if (Array.isArray(responseData)) {
		return responseData.map(item => ({ json: item }));
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...bookTransferOperations,
	...bookTransferFields,
];
