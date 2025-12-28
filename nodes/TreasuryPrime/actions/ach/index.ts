/**
 * Treasury Prime ACH Resource
 * 
 * Handles ACH (Automated Clearing House) transfers including:
 * - Standard and same-day ACH
 * - SEC codes (PPD, CCD, WEB, etc.)
 * - Returns and NOCs (Notifications of Change)
 * - Reversals
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
import { 
  ACH_SEC_CODE_OPTIONS, 
  ACH_RETURN_CODES, 
  ACH_NOC_CODE_OPTIONS,
} from '../../constants/achCodes';

export const achOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ach'],
			},
		},
		options: [
			{
				name: 'Create Transfer',
				value: 'create',
				description: 'Create a new ACH transfer',
				action: 'Create an ACH transfer',
			},
			{
				name: 'Get Transfer',
				value: 'get',
				description: 'Get ACH transfer details by ID',
				action: 'Get an ACH transfer',
			},
			{
				name: 'List Transfers',
				value: 'list',
				description: 'List all ACH transfers',
				action: 'List ACH transfers',
			},
			{
				name: 'Cancel Transfer',
				value: 'cancel',
				description: 'Cancel a pending ACH transfer',
				action: 'Cancel an ACH transfer',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get ACH transfer status',
				action: 'Get ACH transfer status',
			},
			{
				name: 'Get Returns',
				value: 'getReturns',
				description: 'Get ACH returns for a transfer',
				action: 'Get ACH returns',
			},
			{
				name: 'Get Return Codes',
				value: 'getReturnCodes',
				description: 'Get all ACH return codes with descriptions',
				action: 'Get ACH return codes',
			},
			{
				name: 'Create Same Day ACH',
				value: 'createSameDay',
				description: 'Create a same-day ACH transfer',
				action: 'Create same day ACH',
			},
			{
				name: 'Get Limits',
				value: 'getLimits',
				description: 'Get ACH transfer limits for an account',
				action: 'Get ACH limits',
			},
			{
				name: 'Create Reversal',
				value: 'createReversal',
				description: 'Create an ACH reversal for a completed transfer',
				action: 'Create ACH reversal',
			},
			{
				name: 'List NOCs',
				value: 'listNocs',
				description: 'List Notifications of Change received',
				action: 'List ACH NOCs',
			},
		],
		default: 'create',
	},
];

export const achFields: INodeProperties[] = [
	// ----------------------------------
	//         Create ACH Transfer
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay', 'getLimits'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The Treasury Prime account ID for the transfer',
	},
	{
		displayName: 'Counterparty ID',
		name: 'counterpartyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay'],
			},
		},
		default: '',
		placeholder: 'cp_xxx',
		description: 'The counterparty (external account) ID',
	},
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay'],
			},
		},
		options: [
			{ name: 'Credit (Push Funds Out)', value: 'credit' },
			{ name: 'Debit (Pull Funds In)', value: 'debit' },
		],
		default: 'credit',
		description: 'The direction of the ACH transfer',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay'],
			},
		},
		default: 0,
		description: 'The transfer amount in cents (e.g., 10000 for $100.00)',
	},
	{
		displayName: 'SEC Code',
		name: 'secCode',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay'],
			},
		},
		options: ACH_SEC_CODE_OPTIONS.map(opt => ({
			name: opt.name,
			value: opt.value,
			description: opt.description,
		})),
		default: 'PPD',
		description: 'The SEC (Standard Entry Class) code for the ACH',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['create', 'createSameDay'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the ACH transfer (max 10 chars for ACH)',
			},
			{
				displayName: 'Company Entry Description',
				name: 'company_entry_description',
				type: 'string',
				default: '',
				description: 'Company entry description (max 10 chars)',
			},
			{
				displayName: 'Company Name',
				name: 'company_name',
				type: 'string',
				default: '',
				description: 'Company name for the ACH batch',
			},
			{
				displayName: 'Individual ID',
				name: 'individual_id',
				type: 'string',
				default: '',
				description: 'Individual ID number (max 15 chars)',
			},
			{
				displayName: 'Individual Name',
				name: 'individual_name',
				type: 'string',
				default: '',
				description: 'Individual name (max 22 chars)',
			},
			{
				displayName: 'Effective Date',
				name: 'effective_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'The effective date for the ACH transfer',
			},
			{
				displayName: 'Addenda',
				name: 'addenda',
				type: 'string',
				default: '',
				description: 'Addenda record for additional information',
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
	//         Get/Cancel/Status/Reversal
	// ----------------------------------
	{
		displayName: 'ACH ID',
		name: 'achId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['get', 'cancel', 'getStatus', 'getReturns', 'createReversal'],
			},
		},
		default: '',
		placeholder: 'ach_xxx',
		description: 'The ACH transfer ID',
	},
	// ----------------------------------
	//         Cancel Reason
	// ----------------------------------
	{
		displayName: 'Cancellation Reason',
		name: 'cancelReason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['cancel'],
			},
		},
		default: '',
		description: 'Reason for cancelling the ACH transfer',
	},
	// ----------------------------------
	//         Reversal
	// ----------------------------------
	{
		displayName: 'Reversal Reason',
		name: 'reversalReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['createReversal'],
			},
		},
		options: [
			{ name: 'Duplicate Entry', value: 'duplicate' },
			{ name: 'Incorrect Amount', value: 'incorrect_amount' },
			{ name: 'Incorrect Account Number', value: 'incorrect_account' },
			{ name: 'Customer Request', value: 'customer_request' },
			{ name: 'Other', value: 'other' },
		],
		default: 'duplicate',
		description: 'Reason for the reversal',
	},
	{
		displayName: 'Reversal Description',
		name: 'reversalDescription',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['createReversal'],
			},
		},
		default: '',
		description: 'Additional description for the reversal',
	},
	// ----------------------------------
	//         List ACH Transfers
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['list', 'listNocs'],
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
				resource: ['ach'],
				operation: ['list', 'listNocs'],
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
				resource: ['ach'],
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
				type: 'multiOptions',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Sent', value: 'sent' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Returned', value: 'returned' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Failed', value: 'failed' },
				],
				default: [],
				description: 'Filter by status',
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
				description: 'Filter by direction',
			},
			{
				displayName: 'SEC Code',
				name: 'sec_code',
				type: 'options',
				options: ACH_SEC_CODE_OPTIONS.map(opt => ({
					name: opt.value,
					value: opt.value,
				})),
				default: '',
				description: 'Filter by SEC code',
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
			{
				displayName: 'Same Day Only',
				name: 'same_day',
				type: 'boolean',
				default: false,
				description: 'Whether to return only same-day ACH transfers',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'nocFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['ach'],
				operation: ['listNocs'],
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
				displayName: 'NOC Code',
				name: 'noc_code',
				type: 'options',
				options: ACH_NOC_CODE_OPTIONS.map(opt => ({
					name: opt.name,
					value: opt.value,
				})),
				default: '',
				description: 'Filter by NOC code',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter NOCs from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter NOCs to this date',
			},
		],
	},
];

/**
 * Execute ACH operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create' || operation === 'createSameDay') {
		// Create a new ACH transfer
		const accountId = this.getNodeParameter('accountId', index) as string;
		const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
		const direction = this.getNodeParameter('direction', index) as string;
		const amount = this.getNodeParameter('amount', index) as number;
		const secCode = this.getNodeParameter('secCode', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			counterparty_id: counterpartyId,
			direction,
			amount,
			sec_code: secCode,
		};

		// Flag for same-day ACH
		if (operation === 'createSameDay') {
			body.same_day = true;
		}

		// Add optional fields
		if (additionalFields.description) {
			body.description = (additionalFields.description as string).substring(0, 10);
		}
		if (additionalFields.company_entry_description) {
			body.company_entry_description = (additionalFields.company_entry_description as string).substring(0, 10);
		}
		if (additionalFields.company_name) {
			body.company_name = additionalFields.company_name;
		}
		if (additionalFields.individual_id) {
			body.individual_id = (additionalFields.individual_id as string).substring(0, 15);
		}
		if (additionalFields.individual_name) {
			body.individual_name = (additionalFields.individual_name as string).substring(0, 22);
		}
		if (additionalFields.effective_date) {
			body.effective_date = additionalFields.effective_date;
		}
		if (additionalFields.addenda) {
			body.addenda = additionalFields.addenda;
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
			'/ach',
			body,
			{},
			{ headers },
		);

	} else if (operation === 'get') {
		// Get ACH transfer by ID
		const achId = this.getNodeParameter('achId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/ach/${achId}`);

	} else if (operation === 'list') {
		// List ACH transfers
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.direction) qs.direction = filters.direction;
		if (filters.sec_code) qs.sec_code = filters.sec_code;
		if (filters.same_day) qs.same_day = filters.same_day;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;
		if ((filters.status as string[])?.length) {
			qs.status = (filters.status as string[]).join(',');
		}

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/ach',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/ach', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'cancel') {
		// Cancel a pending ACH transfer
		const achId = this.getNodeParameter('achId', index) as string;
		const cancelReason = this.getNodeParameter('cancelReason', index, '') as string;

		const body: IDataObject = { status: 'canceled' };
		if (cancelReason) {
			body.cancellation_reason = cancelReason;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'PATCH',
			`/ach/${achId}`,
			body,
		);

	} else if (operation === 'getStatus') {
		// Get ACH transfer status
		const achId = this.getNodeParameter('achId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/ach/${achId}`);
		
		responseData = {
			id: response.id,
			status: response.status,
			direction: response.direction,
			amount: response.amount,
			effective_date: response.effective_date,
			settlement_date: response.settlement_date,
			return_code: response.return_code,
			return_reason: response.return_reason,
			created_at: response.created_at,
			updated_at: response.updated_at,
		};

	} else if (operation === 'getReturns') {
		// Get ACH returns for a transfer
		const achId = this.getNodeParameter('achId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/ach/${achId}`);
		
		if (response.return_code) {
			const returnInfo = ACH_RETURN_CODES[response.return_code as string];
			responseData = {
				ach_id: response.id,
				return_code: response.return_code,
				return_reason: response.return_reason,
				return_description: returnInfo?.description || 'Unknown',
				is_retryable: returnInfo?.retryable || false,
				returned_at: response.returned_at,
			};
		} else {
			responseData = {
				ach_id: response.id,
				message: 'No return for this ACH transfer',
			};
		}

	} else if (operation === 'getReturnCodes') {
		// Get all ACH return codes
		responseData = Object.values(ACH_RETURN_CODES).map(code => ({
			code: code.code,
			description: code.description,
			retryable: code.retryable,
		})) as unknown as IDataObject[];

	} else if (operation === 'getLimits') {
		// Get ACH limits for an account
		const accountId = this.getNodeParameter('accountId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'GET',
			`/account/${accountId}/ach_limits`,
		);

	} else if (operation === 'createReversal') {
		// Create ACH reversal
		const achId = this.getNodeParameter('achId', index) as string;
		const reversalReason = this.getNodeParameter('reversalReason', index) as string;
		const reversalDescription = this.getNodeParameter('reversalDescription', index, '') as string;

		const body: IDataObject = {
			ach_id: achId,
			reason: reversalReason,
		};

		if (reversalDescription) {
			body.description = reversalDescription;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			'/ach/reversal',
			body,
		);

	} else if (operation === 'listNocs') {
		// List ACH Notifications of Change
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('nocFilters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.noc_code) qs.noc_code = filters.noc_code;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/ach/noc',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/ach/noc', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}
	}

	// Handle array responses
	if (Array.isArray(responseData)) {
		return responseData.map(item => ({ json: item }));
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...achOperations,
	...achFields,
];
