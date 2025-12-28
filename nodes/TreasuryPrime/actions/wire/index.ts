/**
 * Treasury Prime Wire Resource
 * 
 * Handles wire transfers including:
 * - Domestic wires (same-day settlement)
 * - International wires (SWIFT)
 * - Wire status tracking
 * - Fees and limits
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

export const wireOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['wire'],
			},
		},
		options: [
			{
				name: 'Create Domestic Wire',
				value: 'createDomestic',
				description: 'Create a domestic wire transfer',
				action: 'Create a domestic wire',
			},
			{
				name: 'Create International Wire',
				value: 'createInternational',
				description: 'Create an international wire transfer (SWIFT)',
				action: 'Create an international wire',
			},
			{
				name: 'Get Wire',
				value: 'get',
				description: 'Get wire transfer details by ID',
				action: 'Get a wire transfer',
			},
			{
				name: 'List Wires',
				value: 'list',
				description: 'List all wire transfers',
				action: 'List wire transfers',
			},
			{
				name: 'Cancel Wire',
				value: 'cancel',
				description: 'Cancel a pending wire transfer',
				action: 'Cancel a wire transfer',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get wire transfer status',
				action: 'Get wire status',
			},
			{
				name: 'Get Fees',
				value: 'getFees',
				description: 'Get wire transfer fee schedule',
				action: 'Get wire fees',
			},
			{
				name: 'Get Limits',
				value: 'getLimits',
				description: 'Get wire transfer limits for an account',
				action: 'Get wire limits',
			},
		],
		default: 'createDomestic',
	},
];

export const wireFields: INodeProperties[] = [
	// ----------------------------------
	//         Create Domestic Wire
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic', 'createInternational', 'getLimits'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The Treasury Prime account ID for the wire',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic', 'createInternational'],
			},
		},
		default: 0,
		description: 'The wire amount in cents (e.g., 100000 for $1,000.00)',
	},
	// Domestic Wire - Beneficiary Info
	{
		displayName: 'Beneficiary Name',
		name: 'beneficiaryName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic', 'createInternational'],
			},
		},
		default: '',
		description: 'Name of the wire beneficiary',
	},
	{
		displayName: 'Beneficiary Account Number',
		name: 'beneficiaryAccountNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic', 'createInternational'],
			},
		},
		default: '',
		description: 'Account number of the beneficiary',
	},
	{
		displayName: 'Beneficiary Routing Number',
		name: 'beneficiaryRoutingNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic'],
			},
		},
		default: '',
		description: 'ABA routing number of the beneficiary bank (9 digits)',
	},
	// International Wire - Additional Fields
	{
		displayName: 'Beneficiary SWIFT/BIC',
		name: 'beneficiarySwift',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createInternational'],
			},
		},
		default: '',
		placeholder: 'BOFAUS3N',
		description: 'SWIFT/BIC code of the beneficiary bank',
	},
	{
		displayName: 'Beneficiary Country',
		name: 'beneficiaryCountry',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createInternational'],
			},
		},
		default: '',
		placeholder: 'GB',
		description: 'ISO country code of the beneficiary (e.g., GB, DE, FR)',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createInternational'],
			},
		},
		options: [
			{ name: 'USD - US Dollar', value: 'USD' },
			{ name: 'EUR - Euro', value: 'EUR' },
			{ name: 'GBP - British Pound', value: 'GBP' },
			{ name: 'CAD - Canadian Dollar', value: 'CAD' },
			{ name: 'AUD - Australian Dollar', value: 'AUD' },
			{ name: 'JPY - Japanese Yen', value: 'JPY' },
			{ name: 'CHF - Swiss Franc', value: 'CHF' },
			{ name: 'CNY - Chinese Yuan', value: 'CNY' },
			{ name: 'MXN - Mexican Peso', value: 'MXN' },
			{ name: 'INR - Indian Rupee', value: 'INR' },
		],
		default: 'USD',
		description: 'Currency for the international wire',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['createDomestic', 'createInternational'],
			},
		},
		options: [
			{
				displayName: 'Purpose of Wire',
				name: 'purpose',
				type: 'string',
				default: '',
				description: 'Purpose/memo for the wire transfer',
			},
			{
				displayName: 'Beneficiary Address Line 1',
				name: 'beneficiary_address_line_1',
				type: 'string',
				default: '',
				description: 'Beneficiary street address',
			},
			{
				displayName: 'Beneficiary Address Line 2',
				name: 'beneficiary_address_line_2',
				type: 'string',
				default: '',
				description: 'Beneficiary address line 2',
			},
			{
				displayName: 'Beneficiary City',
				name: 'beneficiary_city',
				type: 'string',
				default: '',
				description: 'Beneficiary city',
			},
			{
				displayName: 'Beneficiary State',
				name: 'beneficiary_state',
				type: 'string',
				default: '',
				description: 'Beneficiary state/province',
			},
			{
				displayName: 'Beneficiary Postal Code',
				name: 'beneficiary_postal_code',
				type: 'string',
				default: '',
				description: 'Beneficiary postal/zip code',
			},
			{
				displayName: 'Beneficiary Bank Name',
				name: 'beneficiary_bank_name',
				type: 'string',
				default: '',
				description: 'Name of the beneficiary bank',
			},
			{
				displayName: 'Beneficiary Bank Address',
				name: 'beneficiary_bank_address',
				type: 'string',
				default: '',
				description: 'Address of the beneficiary bank',
			},
			{
				displayName: 'Intermediary Bank Name',
				name: 'intermediary_bank_name',
				type: 'string',
				default: '',
				description: 'Name of intermediary/correspondent bank',
			},
			{
				displayName: 'Intermediary Bank Routing',
				name: 'intermediary_bank_routing',
				type: 'string',
				default: '',
				description: 'Routing number of intermediary bank',
			},
			{
				displayName: 'Intermediary Bank SWIFT',
				name: 'intermediary_bank_swift',
				type: 'string',
				default: '',
				description: 'SWIFT/BIC of intermediary bank (for international)',
			},
			{
				displayName: 'Reference for Beneficiary',
				name: 'reference_for_beneficiary',
				type: 'string',
				default: '',
				description: 'Reference information for the beneficiary',
			},
			{
				displayName: 'Originator to Beneficiary Info',
				name: 'originator_to_beneficiary_info',
				type: 'string',
				default: '',
				description: 'Additional info from originator to beneficiary',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '',
				description: 'Unique key to prevent duplicate wires',
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
	//         Get/Cancel/Status
	// ----------------------------------
	{
		displayName: 'Wire ID',
		name: 'wireId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['get', 'cancel', 'getStatus'],
			},
		},
		default: '',
		placeholder: 'wire_xxx',
		description: 'The wire transfer ID',
	},
	{
		displayName: 'Cancellation Reason',
		name: 'cancelReason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['wire'],
				operation: ['cancel'],
			},
		},
		default: '',
		description: 'Reason for cancelling the wire transfer',
	},
	// ----------------------------------
	//         List Wires
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['wire'],
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
				resource: ['wire'],
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
				resource: ['wire'],
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
				displayName: 'Wire Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Domestic', value: 'domestic' },
					{ name: 'International', value: 'international' },
				],
				default: '',
				description: 'Filter by wire type',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Outgoing', value: 'outgoing' },
					{ name: 'Incoming', value: 'incoming' },
				],
				default: '',
				description: 'Filter by direction',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter wires from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter wires to this date',
			},
		],
	},
];

/**
 * Execute wire operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'createDomestic') {
		// Create domestic wire transfer
		const accountId = this.getNodeParameter('accountId', index) as string;
		const amount = this.getNodeParameter('amount', index) as number;
		const beneficiaryName = this.getNodeParameter('beneficiaryName', index) as string;
		const beneficiaryAccountNumber = this.getNodeParameter('beneficiaryAccountNumber', index) as string;
		const beneficiaryRoutingNumber = this.getNodeParameter('beneficiaryRoutingNumber', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			amount,
			type: 'domestic',
			beneficiary: {
				name: beneficiaryName,
				account_number: beneficiaryAccountNumber,
				routing_number: beneficiaryRoutingNumber,
			},
		};

		// Add beneficiary address if provided
		const beneficiaryAddress: IDataObject = {};
		if (additionalFields.beneficiary_address_line_1) {
			beneficiaryAddress.line_1 = additionalFields.beneficiary_address_line_1;
		}
		if (additionalFields.beneficiary_address_line_2) {
			beneficiaryAddress.line_2 = additionalFields.beneficiary_address_line_2;
		}
		if (additionalFields.beneficiary_city) {
			beneficiaryAddress.city = additionalFields.beneficiary_city;
		}
		if (additionalFields.beneficiary_state) {
			beneficiaryAddress.state = additionalFields.beneficiary_state;
		}
		if (additionalFields.beneficiary_postal_code) {
			beneficiaryAddress.postal_code = additionalFields.beneficiary_postal_code;
		}
		if (Object.keys(beneficiaryAddress).length > 0) {
			(body.beneficiary as IDataObject).address = beneficiaryAddress;
		}

		// Add beneficiary bank info
		if (additionalFields.beneficiary_bank_name) {
			(body.beneficiary as IDataObject).bank_name = additionalFields.beneficiary_bank_name;
		}
		if (additionalFields.beneficiary_bank_address) {
			(body.beneficiary as IDataObject).bank_address = additionalFields.beneficiary_bank_address;
		}

		// Add intermediary bank if provided
		if (additionalFields.intermediary_bank_name || additionalFields.intermediary_bank_routing) {
			body.intermediary_bank = {
				name: additionalFields.intermediary_bank_name,
				routing_number: additionalFields.intermediary_bank_routing,
			};
		}

		// Add other fields
		if (additionalFields.purpose) {
			body.purpose = additionalFields.purpose;
		}
		if (additionalFields.reference_for_beneficiary) {
			body.reference_for_beneficiary = additionalFields.reference_for_beneficiary;
		}
		if (additionalFields.originator_to_beneficiary_info) {
			body.originator_to_beneficiary_info = additionalFields.originator_to_beneficiary_info;
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
			'/wire',
			body,
			{},
			{ headers },
		);

	} else if (operation === 'createInternational') {
		// Create international wire transfer
		const accountId = this.getNodeParameter('accountId', index) as string;
		const amount = this.getNodeParameter('amount', index) as number;
		const beneficiaryName = this.getNodeParameter('beneficiaryName', index) as string;
		const beneficiaryAccountNumber = this.getNodeParameter('beneficiaryAccountNumber', index) as string;
		const beneficiarySwift = this.getNodeParameter('beneficiarySwift', index) as string;
		const beneficiaryCountry = this.getNodeParameter('beneficiaryCountry', index) as string;
		const currency = this.getNodeParameter('currency', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			amount,
			currency,
			type: 'international',
			beneficiary: {
				name: beneficiaryName,
				account_number: beneficiaryAccountNumber,
				swift_code: beneficiarySwift,
				country: beneficiaryCountry,
			},
		};

		// Add beneficiary address
		const beneficiaryAddress: IDataObject = {};
		if (additionalFields.beneficiary_address_line_1) {
			beneficiaryAddress.line_1 = additionalFields.beneficiary_address_line_1;
		}
		if (additionalFields.beneficiary_address_line_2) {
			beneficiaryAddress.line_2 = additionalFields.beneficiary_address_line_2;
		}
		if (additionalFields.beneficiary_city) {
			beneficiaryAddress.city = additionalFields.beneficiary_city;
		}
		if (additionalFields.beneficiary_state) {
			beneficiaryAddress.state = additionalFields.beneficiary_state;
		}
		if (additionalFields.beneficiary_postal_code) {
			beneficiaryAddress.postal_code = additionalFields.beneficiary_postal_code;
		}
		if (Object.keys(beneficiaryAddress).length > 0) {
			(body.beneficiary as IDataObject).address = beneficiaryAddress;
		}

		// Add beneficiary bank info
		if (additionalFields.beneficiary_bank_name) {
			(body.beneficiary as IDataObject).bank_name = additionalFields.beneficiary_bank_name;
		}
		if (additionalFields.beneficiary_bank_address) {
			(body.beneficiary as IDataObject).bank_address = additionalFields.beneficiary_bank_address;
		}

		// Add intermediary bank for international
		if (additionalFields.intermediary_bank_name || additionalFields.intermediary_bank_swift) {
			body.intermediary_bank = {
				name: additionalFields.intermediary_bank_name,
				swift_code: additionalFields.intermediary_bank_swift,
			};
		}

		// Add other fields
		if (additionalFields.purpose) {
			body.purpose = additionalFields.purpose;
		}
		if (additionalFields.reference_for_beneficiary) {
			body.reference_for_beneficiary = additionalFields.reference_for_beneficiary;
		}
		if (additionalFields.originator_to_beneficiary_info) {
			body.originator_to_beneficiary_info = additionalFields.originator_to_beneficiary_info;
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
			'/wire',
			body,
			{},
			{ headers },
		);

	} else if (operation === 'get') {
		// Get wire transfer by ID
		const wireId = this.getNodeParameter('wireId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/wire/${wireId}`);

	} else if (operation === 'list') {
		// List wire transfers
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.type) qs.type = filters.type;
		if (filters.direction) qs.direction = filters.direction;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;
		if ((filters.status as string[])?.length) {
			qs.status = (filters.status as string[]).join(',');
		}

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/wire',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/wire', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'cancel') {
		// Cancel a pending wire
		const wireId = this.getNodeParameter('wireId', index) as string;
		const cancelReason = this.getNodeParameter('cancelReason', index, '') as string;

		const body: IDataObject = { status: 'canceled' };
		if (cancelReason) {
			body.cancellation_reason = cancelReason;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'PATCH',
			`/wire/${wireId}`,
			body,
		);

	} else if (operation === 'getStatus') {
		// Get wire status
		const wireId = this.getNodeParameter('wireId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/wire/${wireId}`);
		
		responseData = {
			id: response.id,
			status: response.status,
			type: response.type,
			amount: response.amount,
			currency: response.currency,
			direction: response.direction,
			sent_at: response.sent_at,
			completed_at: response.completed_at,
			return_reason: response.return_reason,
			created_at: response.created_at,
			updated_at: response.updated_at,
		};

	} else if (operation === 'getFees') {
		// Get wire fee schedule
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/wire/fees');

	} else if (operation === 'getLimits') {
		// Get wire limits for account
		const accountId = this.getNodeParameter('accountId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'GET',
			`/account/${accountId}/wire_limits`,
		);
	}

	// Handle array responses
	if (Array.isArray(responseData)) {
		return responseData.map(item => ({ json: item }));
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...wireOperations,
	...wireFields,
];
