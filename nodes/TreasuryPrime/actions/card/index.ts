/**
 * Treasury Prime Card Resource
 * 
 * Handles card issuing and management including:
 * - Card creation (debit, prepaid, virtual)
 * - Card activation, locking, replacement
 * - PIN management
 * - Transaction controls and limits
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

export const cardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['card'],
			},
		},
		options: [
			{
				name: 'Create Card',
				value: 'create',
				description: 'Create a new card',
				action: 'Create a card',
			},
			{
				name: 'Get Card',
				value: 'get',
				description: 'Get card details by ID',
				action: 'Get a card',
			},
			{
				name: 'List Cards',
				value: 'list',
				description: 'List all cards',
				action: 'List cards',
			},
			{
				name: 'Activate Card',
				value: 'activate',
				description: 'Activate a card',
				action: 'Activate a card',
			},
			{
				name: 'Lock Card',
				value: 'lock',
				description: 'Lock a card (temporary freeze)',
				action: 'Lock a card',
			},
			{
				name: 'Unlock Card',
				value: 'unlock',
				description: 'Unlock a locked card',
				action: 'Unlock a card',
			},
			{
				name: 'Replace Card',
				value: 'replace',
				description: 'Replace a card (lost/stolen/damaged)',
				action: 'Replace a card',
			},
			{
				name: 'Close Card',
				value: 'close',
				description: 'Close/cancel a card permanently',
				action: 'Close a card',
			},
			{
				name: 'Get PIN',
				value: 'getPin',
				description: 'Get card PIN (secure)',
				action: 'Get card PIN',
			},
			{
				name: 'Set PIN',
				value: 'setPin',
				description: 'Set or change card PIN',
				action: 'Set card PIN',
			},
			{
				name: 'Update Limits',
				value: 'updateLimits',
				description: 'Update card spending limits',
				action: 'Update card limits',
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get card transactions',
				action: 'Get card transactions',
			},
		],
		default: 'create',
	},
];

export const cardFields: INodeProperties[] = [
	// ----------------------------------
	//         Create Card
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The account ID to link the card to',
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'psn_xxx',
		description: 'The person ID for the cardholder',
	},
	{
		displayName: 'Card Type',
		name: 'cardType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Debit', value: 'debit' },
			{ name: 'Prepaid', value: 'prepaid' },
			{ name: 'Virtual', value: 'virtual' },
			{ name: 'Credit', value: 'credit' },
		],
		default: 'debit',
		description: 'The type of card to create',
	},
	{
		displayName: 'Card Product',
		name: 'cardProduct',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The card product ID (if applicable)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name on Card',
				name: 'name_on_card',
				type: 'string',
				default: '',
				description: 'Name to print on the card (max 26 chars)',
			},
			{
				displayName: 'Shipping Address',
				name: 'shipping_address',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'address',
						displayName: 'Address',
						values: [
							{
								displayName: 'Street Address',
								name: 'line_1',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Address Line 2',
								name: 'line_2',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Code',
								name: 'postal_code',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: 'US',
							},
						],
					},
				],
			},
			{
				displayName: 'Daily Spending Limit (Cents)',
				name: 'daily_spending_limit',
				type: 'number',
				default: 0,
				description: 'Daily spending limit in cents',
			},
			{
				displayName: 'Monthly Spending Limit (Cents)',
				name: 'monthly_spending_limit',
				type: 'number',
				default: 0,
				description: 'Monthly spending limit in cents',
			},
			{
				displayName: 'Single Transaction Limit (Cents)',
				name: 'single_transaction_limit',
				type: 'number',
				default: 0,
				description: 'Per-transaction limit in cents',
			},
			{
				displayName: 'ATM Withdrawal Limit (Cents)',
				name: 'atm_withdrawal_limit',
				type: 'number',
				default: 0,
				description: 'Daily ATM withdrawal limit in cents',
			},
			{
				displayName: 'Allow ATM Withdrawals',
				name: 'allow_atm',
				type: 'boolean',
				default: true,
				description: 'Whether to allow ATM withdrawals',
			},
			{
				displayName: 'Allow International',
				name: 'allow_international',
				type: 'boolean',
				default: false,
				description: 'Whether to allow international transactions',
			},
			{
				displayName: 'Expedited Shipping',
				name: 'expedited_shipping',
				type: 'boolean',
				default: false,
				description: 'Whether to use expedited shipping',
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
	//         Get/Activate/Lock/etc
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['get', 'activate', 'lock', 'unlock', 'replace', 'close', 'getPin', 'setPin', 'updateLimits', 'getTransactions'],
			},
		},
		default: '',
		placeholder: 'card_xxx',
		description: 'The card ID',
	},
	// ----------------------------------
	//         Replace Card
	// ----------------------------------
	{
		displayName: 'Replacement Reason',
		name: 'replaceReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['replace'],
			},
		},
		options: [
			{ name: 'Lost', value: 'lost' },
			{ name: 'Stolen', value: 'stolen' },
			{ name: 'Damaged', value: 'damaged' },
			{ name: 'Expired', value: 'expired' },
			{ name: 'Other', value: 'other' },
		],
		default: 'lost',
		description: 'Reason for card replacement',
	},
	{
		displayName: 'New Shipping Address',
		name: 'newAddress',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['replace'],
			},
		},
		default: {},
		placeholder: 'Add Address (Optional)',
		options: [
			{
				name: 'address',
				displayName: 'Address',
				values: [
					{
						displayName: 'Street Address',
						name: 'line_1',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Address Line 2',
						name: 'line_2',
						type: 'string',
						default: '',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'postal_code',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	// ----------------------------------
	//         Close Card
	// ----------------------------------
	{
		displayName: 'Close Reason',
		name: 'closeReason',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['close'],
			},
		},
		options: [
			{ name: 'Customer Request', value: 'customer_request' },
			{ name: 'Fraud', value: 'fraud' },
			{ name: 'Lost', value: 'lost' },
			{ name: 'Stolen', value: 'stolen' },
			{ name: 'Account Closed', value: 'account_closed' },
			{ name: 'Other', value: 'other' },
		],
		default: 'customer_request',
		description: 'Reason for closing the card',
	},
	// ----------------------------------
	//         Set PIN
	// ----------------------------------
	{
		displayName: 'New PIN',
		name: 'newPin',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['setPin'],
			},
		},
		default: '',
		description: 'The new 4-digit PIN',
	},
	// ----------------------------------
	//         Update Limits
	// ----------------------------------
	{
		displayName: 'Limits',
		name: 'limits',
		type: 'collection',
		placeholder: 'Add Limit',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['updateLimits'],
			},
		},
		options: [
			{
				displayName: 'Daily Spending Limit (Cents)',
				name: 'daily_spending_limit',
				type: 'number',
				default: 0,
				description: 'Daily spending limit in cents',
			},
			{
				displayName: 'Monthly Spending Limit (Cents)',
				name: 'monthly_spending_limit',
				type: 'number',
				default: 0,
				description: 'Monthly spending limit in cents',
			},
			{
				displayName: 'Single Transaction Limit (Cents)',
				name: 'single_transaction_limit',
				type: 'number',
				default: 0,
				description: 'Per-transaction limit in cents',
			},
			{
				displayName: 'ATM Withdrawal Limit (Cents)',
				name: 'atm_withdrawal_limit',
				type: 'number',
				default: 0,
				description: 'Daily ATM withdrawal limit in cents',
			},
			{
				displayName: 'Allow ATM Withdrawals',
				name: 'allow_atm',
				type: 'boolean',
				default: true,
				description: 'Whether to allow ATM withdrawals',
			},
			{
				displayName: 'Allow International',
				name: 'allow_international',
				type: 'boolean',
				default: false,
				description: 'Whether to allow international transactions',
			},
		],
	},
	// ----------------------------------
	//         List Cards
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['list', 'getTransactions'],
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
				resource: ['card'],
				operation: ['list', 'getTransactions'],
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
				resource: ['card'],
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
				displayName: 'Person ID',
				name: 'person_id',
				type: 'string',
				default: '',
				description: 'Filter by person ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Active', value: 'active' },
					{ name: 'Locked', value: 'locked' },
					{ name: 'Closed', value: 'closed' },
					{ name: 'Expired', value: 'expired' },
				],
				default: [],
				description: 'Filter by status',
			},
			{
				displayName: 'Card Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Debit', value: 'debit' },
					{ name: 'Prepaid', value: 'prepaid' },
					{ name: 'Virtual', value: 'virtual' },
					{ name: 'Credit', value: 'credit' },
				],
				default: '',
				description: 'Filter by card type',
			},
		],
	},
	{
		displayName: 'Transaction Filters',
		name: 'transactionFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getTransactions'],
			},
		},
		options: [
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
				description: 'Filter transactions to this date',
			},
			{
				displayName: 'Transaction Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Purchase', value: 'purchase' },
					{ name: 'ATM Withdrawal', value: 'atm_withdrawal' },
					{ name: 'Refund', value: 'refund' },
					{ name: 'Authorization', value: 'authorization' },
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
					{ name: 'Completed', value: 'completed' },
					{ name: 'Declined', value: 'declined' },
					{ name: 'Reversed', value: 'reversed' },
				],
				default: '',
				description: 'Filter by status',
			},
		],
	},
];

/**
 * Execute card operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		// Create a card
		const accountId = this.getNodeParameter('accountId', index) as string;
		const personId = this.getNodeParameter('personId', index) as string;
		const cardType = this.getNodeParameter('cardType', index) as string;
		const cardProduct = this.getNodeParameter('cardProduct', index, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			person_id: personId,
			type: cardType,
		};

		if (cardProduct) {
			body.product_id = cardProduct;
		}

		if (additionalFields.name_on_card) {
			body.name_on_card = (additionalFields.name_on_card as string).substring(0, 26);
		}
		if (additionalFields.shipping_address) {
			const addr = additionalFields.shipping_address as IDataObject;
			if (addr.address) {
				body.shipping_address = addr.address;
			}
		}
		if (additionalFields.daily_spending_limit) {
			body.daily_spending_limit = additionalFields.daily_spending_limit;
		}
		if (additionalFields.monthly_spending_limit) {
			body.monthly_spending_limit = additionalFields.monthly_spending_limit;
		}
		if (additionalFields.single_transaction_limit) {
			body.single_transaction_limit = additionalFields.single_transaction_limit;
		}
		if (additionalFields.atm_withdrawal_limit) {
			body.atm_withdrawal_limit = additionalFields.atm_withdrawal_limit;
		}
		if (additionalFields.allow_atm !== undefined) {
			body.allow_atm = additionalFields.allow_atm;
		}
		if (additionalFields.allow_international !== undefined) {
			body.allow_international = additionalFields.allow_international;
		}
		if (additionalFields.expedited_shipping) {
			body.expedited_shipping = additionalFields.expedited_shipping;
		}
		if (additionalFields.metadata) {
			body.metadata = typeof additionalFields.metadata === 'string'
				? JSON.parse(additionalFields.metadata)
				: additionalFields.metadata;
		}

		responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/card', body);

	} else if (operation === 'get') {
		// Get card by ID
		const cardId = this.getNodeParameter('cardId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/card/${cardId}`);

	} else if (operation === 'list') {
		// List cards
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.person_id) qs.person_id = filters.person_id;
		if (filters.type) qs.type = filters.type;
		if ((filters.status as string[])?.length) {
			qs.status = (filters.status as string[]).join(',');
		}

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/card',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/card', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'activate') {
		// Activate card
		const cardId = this.getNodeParameter('cardId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/activate`,
		);

	} else if (operation === 'lock') {
		// Lock card
		const cardId = this.getNodeParameter('cardId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/lock`,
		);

	} else if (operation === 'unlock') {
		// Unlock card
		const cardId = this.getNodeParameter('cardId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/unlock`,
		);

	} else if (operation === 'replace') {
		// Replace card
		const cardId = this.getNodeParameter('cardId', index) as string;
		const replaceReason = this.getNodeParameter('replaceReason', index) as string;
		const newAddress = this.getNodeParameter('newAddress', index) as IDataObject;

		const body: IDataObject = { reason: replaceReason };
		if (newAddress.address) {
			body.shipping_address = newAddress.address;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/replace`,
			body,
		);

	} else if (operation === 'close') {
		// Close card
		const cardId = this.getNodeParameter('cardId', index) as string;
		const closeReason = this.getNodeParameter('closeReason', index, 'customer_request') as string;

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/close`,
			{ reason: closeReason },
		);

	} else if (operation === 'getPin') {
		// Get card PIN (returns secure URL)
		const cardId = this.getNodeParameter('cardId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'GET',
			`/card/${cardId}/pin`,
		);

	} else if (operation === 'setPin') {
		// Set card PIN
		const cardId = this.getNodeParameter('cardId', index) as string;
		const newPin = this.getNodeParameter('newPin', index) as string;

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/card/${cardId}/pin`,
			{ pin: newPin },
		);

	} else if (operation === 'updateLimits') {
		// Update card limits
		const cardId = this.getNodeParameter('cardId', index) as string;
		const limits = this.getNodeParameter('limits', index) as IDataObject;

		const body: IDataObject = {};
		if (limits.daily_spending_limit !== undefined) {
			body.daily_spending_limit = limits.daily_spending_limit;
		}
		if (limits.monthly_spending_limit !== undefined) {
			body.monthly_spending_limit = limits.monthly_spending_limit;
		}
		if (limits.single_transaction_limit !== undefined) {
			body.single_transaction_limit = limits.single_transaction_limit;
		}
		if (limits.atm_withdrawal_limit !== undefined) {
			body.atm_withdrawal_limit = limits.atm_withdrawal_limit;
		}
		if (limits.allow_atm !== undefined) {
			body.allow_atm = limits.allow_atm;
		}
		if (limits.allow_international !== undefined) {
			body.allow_international = limits.allow_international;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'PATCH',
			`/card/${cardId}`,
			body,
		);

	} else if (operation === 'getTransactions') {
		// Get card transactions
		const cardId = this.getNodeParameter('cardId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('transactionFilters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;
		if (filters.type) qs.type = filters.type;
		if (filters.status) qs.status = filters.status;

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				`/card/${cardId}/transaction`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/card/${cardId}/transaction`,
				{},
				qs,
			);
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
	...cardOperations,
	...cardFields,
];
