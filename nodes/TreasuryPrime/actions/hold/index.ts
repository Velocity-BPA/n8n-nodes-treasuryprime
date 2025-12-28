/**
 * Treasury Prime Hold Actions
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

export const holdOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['hold'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a hold on an account',
				action: 'Create a hold',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a hold by ID',
				action: 'Get a hold',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List holds',
				action: 'List holds',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a hold',
				action: 'Release a hold',
			},
			{
				name: 'Get By Account',
				value: 'getByAccount',
				description: 'Get holds by account',
				action: 'Get holds by account',
			},
			{
				name: 'Update Amount',
				value: 'updateAmount',
				description: 'Update hold amount',
				action: 'Update hold amount',
			},
		],
		default: 'list',
	},
];

export const holdFields: INodeProperties[] = [
	// Hold ID
	{
		displayName: 'Hold ID',
		name: 'holdId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['hold'],
				operation: ['get', 'release', 'updateAmount'],
			},
		},
		default: '',
		description: 'The ID of the hold (starts with hold_)',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['hold'],
				operation: ['create', 'getByAccount'],
			},
		},
		default: '',
		description: 'The ID of the account (starts with acct_)',
	},
	// Amount
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['hold'],
				operation: ['create', 'updateAmount'],
			},
		},
		default: 0,
		description: 'Hold amount in cents (e.g., 5000 for $50.00)',
	},
	// Hold type
	{
		displayName: 'Hold Type',
		name: 'holdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['hold'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Check Deposit', value: 'check_deposit' },
			{ name: 'Card Authorization', value: 'card_authorization' },
			{ name: 'ACH', value: 'ach' },
			{ name: 'Wire', value: 'wire' },
			{ name: 'Manual', value: 'manual' },
			{ name: 'Legal', value: 'legal' },
			{ name: 'Other', value: 'other' },
		],
		default: 'manual',
		description: 'Type of hold',
	},
	// Return all
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['hold'],
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
				resource: ['hold'],
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
				resource: ['hold'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the hold',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'External reference for the hold',
			},
			{
				displayName: 'Expiration Date',
				name: 'expiration_date',
				type: 'dateTime',
				default: '',
				description: 'Date when the hold expires automatically',
			},
			{
				displayName: 'Related Transaction ID',
				name: 'related_transaction_id',
				type: 'string',
				default: '',
				description: 'ID of related transaction',
			},
		],
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
				resource: ['hold'],
				operation: ['list', 'getByAccount'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Released', value: 'released' },
					{ name: 'Expired', value: 'expired' },
				],
				default: '',
				description: 'Filter by hold status',
			},
			{
				displayName: 'Hold Type',
				name: 'hold_type',
				type: 'options',
				options: [
					{ name: 'Check Deposit', value: 'check_deposit' },
					{ name: 'Card Authorization', value: 'card_authorization' },
					{ name: 'ACH', value: 'ach' },
					{ name: 'Wire', value: 'wire' },
					{ name: 'Manual', value: 'manual' },
					{ name: 'Legal', value: 'legal' },
				],
				default: '',
				description: 'Filter by hold type',
			},
		],
	},
];

export async function executeHoldOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'create': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const holdType = this.getNodeParameter('holdType', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				account_id: accountId,
				amount,
				hold_type: holdType,
				...additionalFields,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				ENDPOINTS.HOLD,
				body,
			);
			break;
		}

		case 'get': {
			const holdId = this.getNodeParameter('holdId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.HOLD}/${holdId}`,
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
					ENDPOINTS.HOLD,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.HOLD,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'release': {
			const holdId = this.getNodeParameter('holdId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.HOLD}/${holdId}/release`,
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
					ENDPOINTS.HOLD,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.HOLD,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'updateAmount': {
			const holdId = this.getNodeParameter('holdId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'PATCH',
				`${ENDPOINTS.HOLD}/${holdId}`,
				{ amount },
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for hold resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeHoldOperation;
