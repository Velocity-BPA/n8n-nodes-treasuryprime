/**
 * Treasury Prime Interest Actions
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest } from '../../transport/treasuryPrimeClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const interestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['interest'],
			},
		},
		options: [
			{
				name: 'Get Rate',
				value: 'getRate',
				description: 'Get current interest rate for an account',
				action: 'Get interest rate',
			},
			{
				name: 'Get Earned',
				value: 'getEarned',
				description: 'Get interest earned for an account',
				action: 'Get interest earned',
			},
			{
				name: 'Get Paid',
				value: 'getPaid',
				description: 'Get interest paid for an account',
				action: 'Get interest paid',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get interest settings for an account',
				action: 'Get interest settings',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: 'Update interest settings for an account',
				action: 'Update interest settings',
			},
		],
		default: 'getRate',
	},
];

export const interestFields: INodeProperties[] = [
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['interest'],
				operation: ['getRate', 'getEarned', 'getPaid', 'getSettings', 'updateSettings'],
			},
		},
		default: '',
		description: 'The ID of the account (starts with acct_)',
	},
	// Date range for getEarned and getPaid
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['interest'],
				operation: ['getEarned', 'getPaid'],
			},
		},
		default: '',
		description: 'Start date for the interest period',
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['interest'],
				operation: ['getEarned', 'getPaid'],
			},
		},
		default: '',
		description: 'End date for the interest period',
	},
	// Settings for updateSettings
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['interest'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Interest Rate (BPS)',
				name: 'interest_rate_bps',
				type: 'number',
				default: '',
				description: 'Interest rate in basis points (e.g., 100 = 1%)',
			},
			{
				displayName: 'Compounding Frequency',
				name: 'compounding_frequency',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
					{ name: 'Annually', value: 'annually' },
				],
				default: 'daily',
				description: 'How often interest compounds',
			},
			{
				displayName: 'Payment Frequency',
				name: 'payment_frequency',
				type: 'options',
				options: [
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
					{ name: 'Annually', value: 'annually' },
					{ name: 'At Maturity', value: 'at_maturity' },
				],
				default: 'monthly',
				description: 'How often interest is paid out',
			},
			{
				displayName: 'Accrual Method',
				name: 'accrual_method',
				type: 'options',
				options: [
					{ name: 'Simple', value: 'simple' },
					{ name: 'Compound', value: 'compound' },
				],
				default: 'compound',
				description: 'Method for calculating interest',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether interest accrual is enabled',
			},
		],
	},
];

export async function executeInterestOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getRate': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.ACCOUNT}/${accountId}/interest/rate`,
			);
			break;
		}

		case 'getEarned': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const fromDate = this.getNodeParameter('fromDate', index, '') as string;
			const toDate = this.getNodeParameter('toDate', index, '') as string;
			const qs: IDataObject = {};
			if (fromDate) qs.from_date = fromDate;
			if (toDate) qs.to_date = toDate;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.ACCOUNT}/${accountId}/interest/earned`,
				{},
				qs,
			);
			break;
		}

		case 'getPaid': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const fromDate = this.getNodeParameter('fromDate', index, '') as string;
			const toDate = this.getNodeParameter('toDate', index, '') as string;
			const qs: IDataObject = {};
			if (fromDate) qs.from_date = fromDate;
			if (toDate) qs.to_date = toDate;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.ACCOUNT}/${accountId}/interest/paid`,
				{},
				qs,
			);
			break;
		}

		case 'getSettings': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.ACCOUNT}/${accountId}/interest/settings`,
			);
			break;
		}

		case 'updateSettings': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const settings = this.getNodeParameter('settings', index, {}) as IDataObject;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'PATCH',
				`${ENDPOINTS.ACCOUNT}/${accountId}/interest/settings`,
				settings,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for interest resource`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
// Export execute alias for main node
export const execute = executeInterestOperation;
