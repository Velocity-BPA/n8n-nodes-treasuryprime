/**
 * Treasury Prime Counterparty Resource
 * 
 * Handles counterparty (external account) management for ACH transfers.
 * Counterparties represent bank accounts at other financial institutions.
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

export const counterpartyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
			},
		},
		options: [
			{
				name: 'Create Counterparty',
				value: 'create',
				description: 'Create a new counterparty (external account)',
				action: 'Create a counterparty',
			},
			{
				name: 'Get Counterparty',
				value: 'get',
				description: 'Get counterparty details by ID',
				action: 'Get a counterparty',
			},
			{
				name: 'Update Counterparty',
				value: 'update',
				description: 'Update counterparty details',
				action: 'Update a counterparty',
			},
			{
				name: 'List Counterparties',
				value: 'list',
				description: 'List all counterparties',
				action: 'List counterparties',
			},
			{
				name: 'Delete Counterparty',
				value: 'delete',
				description: 'Delete a counterparty',
				action: 'Delete a counterparty',
			},
			{
				name: 'Verify Counterparty',
				value: 'verify',
				description: 'Verify counterparty with micro-deposits',
				action: 'Verify a counterparty',
			},
			{
				name: 'Get by Account Number',
				value: 'getByAccountNumber',
				description: 'Find counterparty by account and routing number',
				action: 'Get counterparty by account number',
			},
		],
		default: 'create',
	},
];

export const counterpartyFields: INodeProperties[] = [
	// ----------------------------------
	//         Create Counterparty
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The Treasury Prime account ID that owns this counterparty',
	},
	{
		displayName: 'Name on Account',
		name: 'nameOnAccount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name on the external bank account',
	},
	{
		displayName: 'Routing Number',
		name: 'routingNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create', 'getByAccountNumber'],
			},
		},
		default: '',
		description: 'ABA routing number of the external bank (9 digits)',
	},
	{
		displayName: 'Account Number',
		name: 'accountNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create', 'getByAccountNumber'],
			},
		},
		default: '',
		description: 'Account number at the external bank',
	},
	{
		displayName: 'Account Type',
		name: 'accountType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Checking', value: 'checking' },
			{ name: 'Savings', value: 'savings' },
		],
		default: 'checking',
		description: 'Type of external account',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'Friendly name for the counterparty',
			},
			{
				displayName: 'Verification Method',
				name: 'verification_method',
				type: 'options',
				options: [
					{ name: 'Micro Deposits', value: 'micro_deposits' },
					{ name: 'Plaid', value: 'plaid' },
					{ name: 'Manual', value: 'manual' },
					{ name: 'None', value: 'none' },
				],
				default: 'none',
				description: 'How to verify ownership of the external account',
			},
			{
				displayName: 'Plaid Token',
				name: 'plaid_token',
				type: 'string',
				default: '',
				description: 'Plaid public token for instant verification',
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
	//         Get/Update/Delete/Verify
	// ----------------------------------
	{
		displayName: 'Counterparty ID',
		name: 'counterpartyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['get', 'update', 'delete', 'verify'],
			},
		},
		default: '',
		placeholder: 'cp_xxx',
		description: 'The counterparty ID',
	},
	// ----------------------------------
	//         Update Counterparty
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name on Account',
				name: 'name_on_account',
				type: 'string',
				default: '',
				description: 'Updated name on account',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'Updated nickname',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Updated metadata as JSON',
			},
		],
	},
	// ----------------------------------
	//         Verify Counterparty
	// ----------------------------------
	{
		displayName: 'Verification Amounts (Cents)',
		name: 'verificationAmounts',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['counterparty'],
				operation: ['verify'],
			},
		},
		default: {},
		options: [
			{
				name: 'amounts',
				displayName: 'Amounts',
				values: [
					{
						displayName: 'Amount 1 (Cents)',
						name: 'amount_1',
						type: 'number',
						required: true,
						default: 0,
						description: 'First micro-deposit amount in cents',
					},
					{
						displayName: 'Amount 2 (Cents)',
						name: 'amount_2',
						type: 'number',
						required: true,
						default: 0,
						description: 'Second micro-deposit amount in cents',
					},
				],
			},
		],
	},
	// ----------------------------------
	//         List Counterparties
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['counterparty'],
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
				resource: ['counterparty'],
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
				resource: ['counterparty'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				description: 'Filter by Treasury Prime account ID',
			},
			{
				displayName: 'Verification Status',
				name: 'verification_status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Verified', value: 'verified' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Unverified', value: 'unverified' },
				],
				default: '',
				description: 'Filter by verification status',
			},
			{
				displayName: 'Account Type',
				name: 'account_type',
				type: 'options',
				options: [
					{ name: 'Checking', value: 'checking' },
					{ name: 'Savings', value: 'savings' },
				],
				default: '',
				description: 'Filter by account type',
			},
		],
	},
];

/**
 * Execute counterparty operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		// Create a counterparty
		const accountId = this.getNodeParameter('accountId', index) as string;
		const nameOnAccount = this.getNodeParameter('nameOnAccount', index) as string;
		const routingNumber = this.getNodeParameter('routingNumber', index) as string;
		const accountNumber = this.getNodeParameter('accountNumber', index) as string;
		const accountType = this.getNodeParameter('accountType', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			name_on_account: nameOnAccount,
			routing_number: routingNumber,
			account_number: accountNumber,
			account_type: accountType,
		};

		if (additionalFields.nickname) {
			body.nickname = additionalFields.nickname;
		}
		if (additionalFields.verification_method) {
			body.verification_method = additionalFields.verification_method;
		}
		if (additionalFields.plaid_token) {
			body.plaid_token = additionalFields.plaid_token;
		}
		if (additionalFields.metadata) {
			body.metadata = typeof additionalFields.metadata === 'string'
				? JSON.parse(additionalFields.metadata)
				: additionalFields.metadata;
		}

		responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/counterparty', body);

	} else if (operation === 'get') {
		// Get counterparty by ID
		const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/counterparty/${counterpartyId}`);

	} else if (operation === 'update') {
		// Update counterparty
		const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name_on_account) {
			body.name_on_account = updateFields.name_on_account;
		}
		if (updateFields.nickname) {
			body.nickname = updateFields.nickname;
		}
		if (updateFields.metadata) {
			body.metadata = typeof updateFields.metadata === 'string'
				? JSON.parse(updateFields.metadata)
				: updateFields.metadata;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'PATCH',
			`/counterparty/${counterpartyId}`,
			body,
		);

	} else if (operation === 'list') {
		// List counterparties
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.verification_status) qs.verification_status = filters.verification_status;
		if (filters.account_type) qs.account_type = filters.account_type;

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/counterparty',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/counterparty', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'delete') {
		// Delete counterparty
		const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'DELETE',
			`/counterparty/${counterpartyId}`,
		);

	} else if (operation === 'verify') {
		// Verify counterparty with micro-deposits
		const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
		const verificationAmounts = this.getNodeParameter('verificationAmounts', index) as IDataObject;

		const amounts = verificationAmounts.amounts as IDataObject;
		const body: IDataObject = {
			amounts: [amounts.amount_1, amounts.amount_2],
		};

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/counterparty/${counterpartyId}/verify`,
			body,
		);

	} else if (operation === 'getByAccountNumber') {
		// Find counterparty by account/routing number
		const routingNumber = this.getNodeParameter('routingNumber', index) as string;
		const accountNumber = this.getNodeParameter('accountNumber', index) as string;

		const qs: IDataObject = {
			routing_number: routingNumber,
			account_number: accountNumber,
		};

		const response = await treasuryPrimeApiRequest.call(this, 'GET', '/counterparty', {}, qs);
		const data = (response.data as IDataObject[]) || response;
		
		if (Array.isArray(data) && data.length > 0) {
			responseData = data[0];
		} else {
			responseData = { message: 'No counterparty found with the specified account details' };
		}
	}

	// Handle array responses
	if (Array.isArray(responseData)) {
		return responseData.map(item => ({ json: item }));
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...counterpartyOperations,
	...counterpartyFields,
];
