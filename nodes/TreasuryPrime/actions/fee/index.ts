/**
 * Treasury Prime Fee Actions
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

export const feeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fee'],
			},
		},
		options: [
			{
				name: 'Get Schedule',
				value: 'getSchedule',
				description: 'Get fee schedule',
				action: 'Get fee schedule',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a fee',
				action: 'Create a fee',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a fee by ID',
				action: 'Get a fee',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List fees',
				action: 'List fees',
			},
			{
				name: 'Waive',
				value: 'waive',
				description: 'Waive a fee',
				action: 'Waive a fee',
			},
			{
				name: 'Get By Account',
				value: 'getByAccount',
				description: 'Get fees by account',
				action: 'Get fees by account',
			},
			{
				name: 'Get Types',
				value: 'getTypes',
				description: 'Get available fee types',
				action: 'Get fee types',
			},
		],
		default: 'list',
	},
];

export const feeFields: INodeProperties[] = [
	// Fee ID
	{
		displayName: 'Fee ID',
		name: 'feeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fee'],
				operation: ['get', 'waive'],
			},
		},
		default: '',
		description: 'The ID of the fee (starts with fee_)',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['fee'],
				operation: ['create', 'getByAccount'],
			},
		},
		default: '',
		description: 'The ID of the account (starts with acct_)',
	},
	// Fee type for create
	{
		displayName: 'Fee Type',
		name: 'feeType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['fee'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Monthly Maintenance', value: 'monthly_maintenance' },
			{ name: 'Wire Transfer', value: 'wire_transfer' },
			{ name: 'ACH Transfer', value: 'ach_transfer' },
			{ name: 'Overdraft', value: 'overdraft' },
			{ name: 'NSF', value: 'nsf' },
			{ name: 'Stop Payment', value: 'stop_payment' },
			{ name: 'Statement', value: 'statement' },
			{ name: 'Card Replacement', value: 'card_replacement' },
			{ name: 'Expedited Card', value: 'expedited_card' },
			{ name: 'ATM', value: 'atm' },
			{ name: 'Foreign Transaction', value: 'foreign_transaction' },
			{ name: 'Check', value: 'check' },
			{ name: 'Account Closure', value: 'account_closure' },
			{ name: 'Other', value: 'other' },
		],
		default: 'other',
		description: 'Type of fee to create',
	},
	// Amount
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['fee'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Fee amount in cents (e.g., 500 for $5.00)',
	},
	// Waive reason
	{
		displayName: 'Waive Reason',
		name: 'waiveReason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['fee'],
				operation: ['waive'],
			},
		},
		default: '',
		description: 'Reason for waiving the fee',
	},
	// Return all
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['fee'],
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
				resource: ['fee'],
				operation: ['list', 'getByAccount'],
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
				resource: ['fee'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the fee',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'External reference for the fee',
			},
			{
				displayName: 'Effective Date',
				name: 'effective_date',
				type: 'dateTime',
				default: '',
				description: 'Date when the fee takes effect',
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
				resource: ['fee'],
				operation: ['list', 'getByAccount'],
			},
		},
		options: [
			{
				displayName: 'Fee Type',
				name: 'fee_type',
				type: 'options',
				options: [
					{ name: 'Monthly Maintenance', value: 'monthly_maintenance' },
					{ name: 'Wire Transfer', value: 'wire_transfer' },
					{ name: 'ACH Transfer', value: 'ach_transfer' },
					{ name: 'Overdraft', value: 'overdraft' },
					{ name: 'NSF', value: 'nsf' },
					{ name: 'Stop Payment', value: 'stop_payment' },
					{ name: 'Other', value: 'other' },
				],
				default: '',
				description: 'Filter by fee type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Applied', value: 'applied' },
					{ name: 'Waived', value: 'waived' },
					{ name: 'Reversed', value: 'reversed' },
				],
				default: '',
				description: 'Filter by fee status',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter fees from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter fees up to this date',
			},
		],
	},
];

export async function executeFeeOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getSchedule': {
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FEE}/schedule`,
			);
			break;
		}

		case 'create': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const feeType = this.getNodeParameter('feeType', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				fee_type: feeType,
				amount,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				ENDPOINTS.FEE,
				body,
			);
			break;
		}

		case 'get': {
			const feeId = this.getNodeParameter('feeId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FEE}/${feeId}`,
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
					ENDPOINTS.FEE,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.FEE,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'waive': {
			const feeId = this.getNodeParameter('feeId', index) as string;
			const waiveReason = this.getNodeParameter('waiveReason', index, '') as string;

			const body: IDataObject = {};
			if (waiveReason) body.reason = waiveReason;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.FEE}/${feeId}/waive`,
				body,
			);
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
					ENDPOINTS.FEE,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.FEE,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getTypes': {
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FEE}/types`,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for fee resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeFeeOperation;
