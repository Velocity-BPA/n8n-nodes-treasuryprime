/**
 * Treasury Prime Statement Actions
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

export const statementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['statement'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a statement by ID',
				action: 'Get a statement',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List statements',
				action: 'List statements',
			},
			{
				name: 'Get PDF',
				value: 'getPdf',
				description: 'Get statement as PDF',
				action: 'Get statement PDF',
			},
			{
				name: 'Get By Account',
				value: 'getByAccount',
				description: 'Get statements by account',
				action: 'Get statements by account',
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get transactions from a statement',
				action: 'Get statement transactions',
			},
		],
		default: 'list',
	},
];

export const statementFields: INodeProperties[] = [
	// Statement ID
	{
		displayName: 'Statement ID',
		name: 'statementId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['get', 'getPdf', 'getTransactions'],
			},
		},
		default: '',
		description: 'The ID of the statement (starts with stmt_)',
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['getByAccount'],
			},
		},
		default: '',
		description: 'The ID of the account (starts with acct_)',
	},
	// Binary Property for PDF
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['getPdf'],
			},
		},
		default: 'data',
		description: 'Name of the binary property to store the PDF',
	},
	// Return all
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['statement'],
				operation: ['list', 'getByAccount', 'getTransactions'],
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
				resource: ['statement'],
				operation: ['list', 'getByAccount', 'getTransactions'],
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
				resource: ['statement'],
				operation: ['list', 'getByAccount'],
			},
		},
		options: [
			{
				displayName: 'Year',
				name: 'year',
				type: 'number',
				default: '',
				description: 'Filter by year',
			},
			{
				displayName: 'Month',
				name: 'month',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 12,
				},
				default: '',
				description: 'Filter by month (1-12)',
			},
		],
	},
];

export async function executeStatementOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'get': {
			const statementId = this.getNodeParameter('statementId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.STATEMENT}/${statementId}`,
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
					ENDPOINTS.STATEMENT,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.STATEMENT,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getPdf': {
			const statementId = this.getNodeParameter('statementId', index) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;

			const response = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.STATEMENT}/${statementId}/pdf`,
				{},
				{},
				{ encoding: null, resolveWithFullResponse: true },
			);

			const binaryData = await this.helpers.prepareBinaryData(
				Buffer.from(response.body as Buffer),
				`statement_${statementId}.pdf`,
				'application/pdf',
			);

			return [
				{
					json: { statementId },
					binary: { [binaryPropertyName]: binaryData },
				},
			];
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
					ENDPOINTS.STATEMENT,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					ENDPOINTS.STATEMENT,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		case 'getTransactions': {
			const statementId = this.getNodeParameter('statementId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const qs: IDataObject = {};

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(
					this,
					'GET',
					`${ENDPOINTS.STATEMENT}/${statementId}/transactions`,
					{},
					qs,
				);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.limit = limit;
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					`${ENDPOINTS.STATEMENT}/${statementId}/transactions`,
					{},
					qs,
				);
				responseData = (response.data as IDataObject[]) || [];
			}
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for statement resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeStatementOperation;
