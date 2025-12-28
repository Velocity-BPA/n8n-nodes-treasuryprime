/**
 * Treasury Prime Compliance Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest } from '../../transport/treasuryPrimeClient';

export const complianceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['compliance'],
			},
		},
		options: [
			{
				name: 'Get Compliance Report',
				value: 'getReport',
				description: 'Get a compliance report',
				action: 'Get compliance report',
			},
			{
				name: 'Get Compliance Requirements',
				value: 'getRequirements',
				description: 'Get compliance requirements for an entity',
				action: 'Get compliance requirements',
			},
			{
				name: 'Get Compliance Status',
				value: 'getStatus',
				description: 'Get compliance status for an entity',
				action: 'Get compliance status',
			},
			{
				name: 'Get CTR Filing Status',
				value: 'getCtrStatus',
				description: 'Get Currency Transaction Report filing status',
				action: 'Get CTR filing status',
			},
			{
				name: 'Get OFAC Check',
				value: 'getOfacCheck',
				description: 'Get OFAC screening results',
				action: 'Get OFAC check results',
			},
			{
				name: 'Get SAR Filing Status',
				value: 'getSarStatus',
				description: 'Get Suspicious Activity Report filing status',
				action: 'Get SAR filing status',
			},
			{
				name: 'Submit Compliance Data',
				value: 'submitData',
				description: 'Submit compliance data for an entity',
				action: 'Submit compliance data',
			},
		],
		default: 'getStatus',
	},
];

export const complianceFields: INodeProperties[] = [
	// ----------------------------------
	//         compliance: getStatus, getRequirements
	// ----------------------------------
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'options',
		required: true,
		default: 'person',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getStatus', 'getRequirements', 'submitData', 'getOfacCheck'],
			},
		},
		options: [
			{
				name: 'Person',
				value: 'person',
				description: 'Individual account holder',
			},
			{
				name: 'Business',
				value: 'business',
				description: 'Business account holder',
			},
			{
				name: 'Account',
				value: 'account',
				description: 'Bank account',
			},
		],
		description: 'The type of entity to check compliance for',
	},
	{
		displayName: 'Entity ID',
		name: 'entityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getStatus', 'getRequirements', 'submitData', 'getOfacCheck'],
			},
		},
		description: 'The ID of the entity',
	},

	// ----------------------------------
	//         compliance: submitData
	// ----------------------------------
	{
		displayName: 'Compliance Type',
		name: 'complianceType',
		type: 'options',
		required: true,
		default: 'kyc',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['submitData'],
			},
		},
		options: [
			{
				name: 'KYC (Know Your Customer)',
				value: 'kyc',
				description: 'Customer identity verification',
			},
			{
				name: 'KYB (Know Your Business)',
				value: 'kyb',
				description: 'Business verification',
			},
			{
				name: 'CIP (Customer Identification Program)',
				value: 'cip',
				description: 'Customer identification',
			},
			{
				name: 'CDD (Customer Due Diligence)',
				value: 'cdd',
				description: 'Enhanced due diligence',
			},
			{
				name: 'Beneficial Ownership',
				value: 'beneficial_ownership',
				description: 'Beneficial ownership information',
			},
		],
		description: 'The type of compliance data to submit',
	},
	{
		displayName: 'Compliance Data',
		name: 'complianceData',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['submitData'],
			},
		},
		description: 'The compliance data to submit (JSON format)',
	},

	// ----------------------------------
	//         compliance: getSarStatus, getCtrStatus
	// ----------------------------------
	{
		displayName: 'Filing ID',
		name: 'filingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getSarStatus', 'getCtrStatus'],
			},
		},
		description: 'The ID of the SAR or CTR filing',
	},

	// ----------------------------------
	//         compliance: getReport
	// ----------------------------------
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		default: 'aml_summary',
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getReport'],
			},
		},
		options: [
			{
				name: 'AML Summary',
				value: 'aml_summary',
				description: 'Anti-Money Laundering summary report',
			},
			{
				name: 'BSA Report',
				value: 'bsa_report',
				description: 'Bank Secrecy Act compliance report',
			},
			{
				name: 'CTR Summary',
				value: 'ctr_summary',
				description: 'Currency Transaction Report summary',
			},
			{
				name: 'KYC Summary',
				value: 'kyc_summary',
				description: 'Know Your Customer verification summary',
			},
			{
				name: 'OFAC Screening',
				value: 'ofac_screening',
				description: 'OFAC screening results report',
			},
			{
				name: 'Risk Assessment',
				value: 'risk_assessment',
				description: 'Customer risk assessment report',
			},
			{
				name: 'SAR Summary',
				value: 'sar_summary',
				description: 'Suspicious Activity Report summary',
			},
			{
				name: 'Transaction Monitoring',
				value: 'transaction_monitoring',
				description: 'Transaction monitoring report',
			},
		],
		description: 'The type of compliance report to generate',
	},
	{
		displayName: 'Report Options',
		name: 'reportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getReport'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter report by account ID',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for the report period',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'CSV', value: 'csv' },
				],
				default: 'json',
				description: 'Output format of the report',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'Filter report by person ID',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for the report period',
			},
		],
	},

	// ----------------------------------
	//         compliance: getOfacCheck - additional options
	// ----------------------------------
	{
		displayName: 'OFAC Options',
		name: 'ofacOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['compliance'],
				operation: ['getOfacCheck'],
			},
		},
		options: [
			{
				displayName: 'Include History',
				name: 'includeHistory',
				type: 'boolean',
				default: false,
				description: 'Whether to include previous OFAC check results',
			},
			{
				displayName: 'Refresh Check',
				name: 'refreshCheck',
				type: 'boolean',
				default: false,
				description: 'Whether to perform a new OFAC screening',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getStatus': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/${entityType}/${entityId}/compliance`,
			);
			break;
		}

		case 'getRequirements': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/${entityType}/${entityId}/compliance/requirements`,
			);
			break;
		}

		case 'submitData': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;
			const complianceType = this.getNodeParameter('complianceType', index) as string;
			const complianceDataStr = this.getNodeParameter('complianceData', index) as string;

			let complianceData: IDataObject;
			try {
				complianceData = JSON.parse(complianceDataStr);
			} catch {
				throw new Error('Invalid JSON format for compliance data');
			}

			const body: IDataObject = {
				type: complianceType,
				data: complianceData,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/${entityType}/${entityId}/compliance`,
				body,
			);
			break;
		}

		case 'getSarStatus': {
			const filingId = this.getNodeParameter('filingId', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/compliance/sar/${filingId}`,
			);
			break;
		}

		case 'getCtrStatus': {
			const filingId = this.getNodeParameter('filingId', index) as string;

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/compliance/ctr/${filingId}`,
			);
			break;
		}

		case 'getOfacCheck': {
			const entityType = this.getNodeParameter('entityType', index) as string;
			const entityId = this.getNodeParameter('entityId', index) as string;
			const ofacOptions = this.getNodeParameter('ofacOptions', index) as IDataObject;

			const qs: IDataObject = {};

			if (ofacOptions.includeHistory) {
				qs.include_history = ofacOptions.includeHistory;
			}
			if (ofacOptions.refreshCheck) {
				qs.refresh = ofacOptions.refreshCheck;
			}

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/${entityType}/${entityId}/compliance/ofac`,
				{},
				qs,
			);
			break;
		}

		case 'getReport': {
			const reportType = this.getNodeParameter('reportType', index) as string;
			const reportOptions = this.getNodeParameter('reportOptions', index) as IDataObject;

			const qs: IDataObject = {
				type: reportType,
			};

			if (reportOptions.accountId) {
				qs.account_id = reportOptions.accountId;
			}
			if (reportOptions.personId) {
				qs.person_id = reportOptions.personId;
			}
			if (reportOptions.startDate) {
				qs.start_date = reportOptions.startDate;
			}
			if (reportOptions.endDate) {
				qs.end_date = reportOptions.endDate;
			}
			if (reportOptions.format) {
				qs.format = reportOptions.format;
			}

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				'/compliance/report',
				{},
				qs,
			);
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
