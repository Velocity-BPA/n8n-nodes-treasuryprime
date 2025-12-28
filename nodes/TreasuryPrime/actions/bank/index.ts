/**
 * Treasury Prime Bank Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest } from '../../transport/treasuryPrimeClient';

export const bankOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bank'],
			},
		},
		options: [
			{
				name: 'Get Bank Hours',
				value: 'getHours',
				description: 'Get bank operating hours',
				action: 'Get bank hours',
			},
			{
				name: 'Get Bank Info',
				value: 'getInfo',
				description: 'Get bank information',
				action: 'Get bank info',
			},
			{
				name: 'Get Bank Limits',
				value: 'getLimits',
				description: 'Get bank transaction limits',
				action: 'Get bank limits',
			},
			{
				name: 'Get Bank Products',
				value: 'getProducts',
				description: 'Get available bank products',
				action: 'Get bank products',
			},
			{
				name: 'Get Bank Routing Number',
				value: 'getRoutingNumber',
				description: 'Get bank routing number',
				action: 'Get bank routing number',
			},
			{
				name: 'Get Supported Features',
				value: 'getFeatures',
				description: 'Get supported features',
				action: 'Get supported features',
			},
		],
		default: 'getInfo',
	},
];

export const bankFields: INodeProperties[] = [
	// ----------------------------------
	//         bank: getProducts
	// ----------------------------------
	{
		displayName: 'Product Type',
		name: 'productType',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['bank'],
				operation: ['getProducts'],
			},
		},
		options: [
			{
				name: 'All Products',
				value: 'all',
				description: 'Get all available products',
			},
			{
				name: 'Account Products',
				value: 'account',
				description: 'Deposit account products',
			},
			{
				name: 'Card Products',
				value: 'card',
				description: 'Card issuing products',
			},
			{
				name: 'Lending Products',
				value: 'lending',
				description: 'Lending and credit products',
			},
			{
				name: 'Payment Products',
				value: 'payment',
				description: 'Payment processing products',
			},
		],
		description: 'Filter products by type',
	},

	// ----------------------------------
	//         bank: getLimits
	// ----------------------------------
	{
		displayName: 'Limit Type',
		name: 'limitType',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['bank'],
				operation: ['getLimits'],
			},
		},
		options: [
			{
				name: 'All Limits',
				value: 'all',
				description: 'Get all transaction limits',
			},
			{
				name: 'ACH Limits',
				value: 'ach',
				description: 'ACH transfer limits',
			},
			{
				name: 'Card Limits',
				value: 'card',
				description: 'Card transaction limits',
			},
			{
				name: 'Check Limits',
				value: 'check',
				description: 'Check transaction limits',
			},
			{
				name: 'Wire Limits',
				value: 'wire',
				description: 'Wire transfer limits',
			},
		],
		description: 'Filter limits by type',
	},

	// ----------------------------------
	//         bank: getHours
	// ----------------------------------
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['bank'],
				operation: ['getHours'],
			},
		},
		description: 'Check operating hours for a specific date (leave empty for today)',
	},
	{
		displayName: 'Service Type',
		name: 'serviceType',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['bank'],
				operation: ['getHours'],
			},
		},
		options: [
			{
				name: 'All Services',
				value: 'all',
				description: 'Get hours for all services',
			},
			{
				name: 'ACH Processing',
				value: 'ach',
				description: 'ACH processing hours',
			},
			{
				name: 'Wire Processing',
				value: 'wire',
				description: 'Wire processing hours',
			},
			{
				name: 'Customer Support',
				value: 'support',
				description: 'Customer support hours',
			},
		],
		description: 'Filter hours by service type',
	},

	// ----------------------------------
	//         bank: getFeatures
	// ----------------------------------
	{
		displayName: 'Feature Category',
		name: 'featureCategory',
		type: 'options',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['bank'],
				operation: ['getFeatures'],
			},
		},
		options: [
			{
				name: 'All Features',
				value: 'all',
				description: 'Get all supported features',
			},
			{
				name: 'Account Features',
				value: 'account',
				description: 'Account management features',
			},
			{
				name: 'Card Features',
				value: 'card',
				description: 'Card issuing features',
			},
			{
				name: 'Compliance Features',
				value: 'compliance',
				description: 'Compliance and KYC features',
			},
			{
				name: 'Payment Features',
				value: 'payment',
				description: 'Payment and transfer features',
			},
		],
		description: 'Filter features by category',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getInfo': {
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank');
			break;
		}

		case 'getRoutingNumber': {
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank/routing');
			break;
		}

		case 'getProducts': {
			const productType = this.getNodeParameter('productType', index) as string;

			const qs: IDataObject = {};
			if (productType && productType !== 'all') {
				qs.type = productType;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank/product', {}, qs);
			break;
		}

		case 'getLimits': {
			const limitType = this.getNodeParameter('limitType', index) as string;

			const qs: IDataObject = {};
			if (limitType && limitType !== 'all') {
				qs.type = limitType;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank/limit', {}, qs);
			break;
		}

		case 'getHours': {
			const date = this.getNodeParameter('date', index) as string;
			const serviceType = this.getNodeParameter('serviceType', index) as string;

			const qs: IDataObject = {};
			if (date) {
				qs.date = date;
			}
			if (serviceType && serviceType !== 'all') {
				qs.service = serviceType;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank/hours', {}, qs);
			break;
		}

		case 'getFeatures': {
			const featureCategory = this.getNodeParameter('featureCategory', index) as string;

			const qs: IDataObject = {};
			if (featureCategory && featureCategory !== 'all') {
				qs.category = featureCategory;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/bank/feature', {}, qs);
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
