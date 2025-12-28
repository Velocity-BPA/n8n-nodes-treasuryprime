/**
 * Treasury Prime Reporting Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';

export const reportingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
			},
		},
		options: [
			{
				name: 'Download Report',
				value: 'download',
				description: 'Download a generated report',
				action: 'Download a report',
			},
			{
				name: 'Generate Report',
				value: 'generate',
				description: 'Generate a new report',
				action: 'Generate a report',
			},
			{
				name: 'Get Custom Report',
				value: 'getCustom',
				description: 'Get a custom report',
				action: 'Get custom report',
			},
			{
				name: 'Get Report',
				value: 'get',
				description: 'Get a report by ID',
				action: 'Get a report',
			},
			{
				name: 'Get Report Types',
				value: 'getTypes',
				description: 'Get available report types',
				action: 'Get report types',
			},
			{
				name: 'List Reports',
				value: 'list',
				description: 'List all reports',
				action: 'List all reports',
			},
			{
				name: 'Schedule Report',
				value: 'schedule',
				description: 'Schedule a recurring report',
				action: 'Schedule a report',
			},
		],
		default: 'list',
	},
];

export const reportingFields: INodeProperties[] = [
	// ----------------------------------
	//         reporting: generate
	// ----------------------------------
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		default: 'transaction_summary',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generate', 'schedule'],
			},
		},
		options: [
			{
				name: 'Account Balance',
				value: 'account_balance',
				description: 'Account balance report',
			},
			{
				name: 'Account Summary',
				value: 'account_summary',
				description: 'Account summary report',
			},
			{
				name: 'ACH Activity',
				value: 'ach_activity',
				description: 'ACH transaction activity report',
			},
			{
				name: 'Card Activity',
				value: 'card_activity',
				description: 'Card transaction activity report',
			},
			{
				name: 'Check Activity',
				value: 'check_activity',
				description: 'Check activity report',
			},
			{
				name: 'Compliance Summary',
				value: 'compliance_summary',
				description: 'Compliance status summary report',
			},
			{
				name: 'Fee Summary',
				value: 'fee_summary',
				description: 'Fee summary report',
			},
			{
				name: 'Interest Summary',
				value: 'interest_summary',
				description: 'Interest accrual summary report',
			},
			{
				name: 'Transaction Detail',
				value: 'transaction_detail',
				description: 'Detailed transaction report',
			},
			{
				name: 'Transaction Summary',
				value: 'transaction_summary',
				description: 'Transaction summary report',
			},
			{
				name: 'Wire Activity',
				value: 'wire_activity',
				description: 'Wire transfer activity report',
			},
		],
		description: 'The type of report to generate',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generate', 'getCustom'],
			},
		},
		description: 'Start date for the report period',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generate', 'getCustom'],
			},
		},
		description: 'End date for the report period',
	},
	{
		displayName: 'Report Options',
		name: 'reportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs to include',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'XLSX', value: 'xlsx' },
				],
				default: 'csv',
				description: 'Output format of the report',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Account', value: 'account' },
					{ name: 'Day', value: 'day' },
					{ name: 'Month', value: 'month' },
					{ name: 'Transaction Type', value: 'transaction_type' },
					{ name: 'Week', value: 'week' },
				],
				default: '',
				description: 'How to group report data',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include transaction details',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Custom name for the report',
			},
		],
	},

	// ----------------------------------
	//         reporting: get, download
	// ----------------------------------
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['get', 'download'],
			},
		},
		description: 'The ID of the report',
	},

	// ----------------------------------
	//         reporting: download
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['download'],
			},
		},
		description: 'Name of the binary property to store the downloaded file',
	},

	// ----------------------------------
	//         reporting: schedule
	// ----------------------------------
	{
		displayName: 'Schedule Frequency',
		name: 'scheduleFrequency',
		type: 'options',
		required: true,
		default: 'weekly',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['schedule'],
			},
		},
		options: [
			{
				name: 'Daily',
				value: 'daily',
			},
			{
				name: 'Weekly',
				value: 'weekly',
			},
			{
				name: 'Monthly',
				value: 'monthly',
			},
			{
				name: 'Quarterly',
				value: 'quarterly',
			},
		],
		description: 'How often to generate the report',
	},
	{
		displayName: 'Schedule Options',
		name: 'scheduleOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['schedule'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs to include',
			},
			{
				displayName: 'Day of Month',
				name: 'dayOfMonth',
				type: 'number',
				default: 1,
				description: 'Day of the month for monthly/quarterly reports (1-28)',
			},
			{
				displayName: 'Day of Week',
				name: 'dayOfWeek',
				type: 'options',
				options: [
					{ name: 'Monday', value: 1 },
					{ name: 'Tuesday', value: 2 },
					{ name: 'Wednesday', value: 3 },
					{ name: 'Thursday', value: 4 },
					{ name: 'Friday', value: 5 },
					{ name: 'Saturday', value: 6 },
					{ name: 'Sunday', value: 0 },
				],
				default: 1,
				description: 'Day of the week for weekly reports',
			},
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				description: 'Comma-separated list of email addresses to send the report to',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the scheduled report is enabled',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'XLSX', value: 'xlsx' },
				],
				default: 'csv',
				description: 'Output format of the report',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Custom name for the scheduled report',
			},
			{
				displayName: 'Time (Hour)',
				name: 'hour',
				type: 'number',
				default: 8,
				description: 'Hour of the day to generate the report (0-23 UTC)',
			},
		],
	},

	// ----------------------------------
	//         reporting: getCustom
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'customQuery',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getCustom'],
			},
		},
		description: 'Custom query for the report (JSON format)',
	},
	{
		displayName: 'Custom Report Options',
		name: 'customReportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getCustom'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'XLSX', value: 'xlsx' },
				],
				default: 'json',
				description: 'Output format of the report',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 1000,
				description: 'Maximum number of records to return',
			},
		],
	},

	// ----------------------------------
	//         reporting: list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reporting'],
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
				resource: ['reporting'],
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
				resource: ['reporting'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Report Type',
				name: 'reportType',
				type: 'options',
				options: [
					{ name: 'All Types', value: '' },
					{ name: 'Account Balance', value: 'account_balance' },
					{ name: 'Account Summary', value: 'account_summary' },
					{ name: 'Transaction Summary', value: 'transaction_summary' },
					{ name: 'Transaction Detail', value: 'transaction_detail' },
					{ name: 'ACH Activity', value: 'ach_activity' },
					{ name: 'Wire Activity', value: 'wire_activity' },
				],
				default: '',
				description: 'Filter by report type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
				],
				default: '',
				description: 'Filter by report status',
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'dateTime',
				default: '',
				description: 'Filter reports created after this date',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				description: 'Filter reports created before this date',
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
		case 'generate': {
			const reportType = this.getNodeParameter('reportType', index) as string;
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			const reportOptions = this.getNodeParameter('reportOptions', index) as IDataObject;

			const body: IDataObject = {
				type: reportType,
				start_date: startDate,
				end_date: endDate,
			};

			if (reportOptions.accountIds) {
				body.account_ids = (reportOptions.accountIds as string).split(',').map((id) => id.trim());
			}
			if (reportOptions.format) {
				body.format = reportOptions.format;
			}
			if (reportOptions.groupBy) {
				body.group_by = reportOptions.groupBy;
			}
			if (reportOptions.includeDetails !== undefined) {
				body.include_details = reportOptions.includeDetails;
			}
			if (reportOptions.name) {
				body.name = reportOptions.name;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/report', body);
			break;
		}

		case 'get': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/report/${reportId}`);
			break;
		}

		case 'list': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;

			const qs: IDataObject = {};

			if (filters.reportType) {
				qs.type = filters.reportType;
			}
			if (filters.status) {
				qs.status = filters.status;
			}
			if (filters.fromDate) {
				qs.from_date = filters.fromDate;
			}
			if (filters.toDate) {
				qs.to_date = filters.toDate;
			}

			if (returnAll) {
				responseData = await treasuryPrimeApiRequestAllItems.call(this, 'GET', '/report', {}, qs);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				qs.page_size = limit;
				const response = await treasuryPrimeApiRequest.call(this, 'GET', '/report', {}, qs);
				responseData = (response.data as IDataObject[]) || response;
			}
			break;
		}

		case 'download': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;

			const response = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/report/${reportId}/download`,
				{},
				{},
				{ encoding: null, resolveWithFullResponse: true },
			);

			const respObj = response as IDataObject;
			const headers = (respObj.headers as IDataObject) || {};
			const contentType = (headers['content-type'] as string) || 'application/octet-stream';
			const contentDisposition = (headers['content-disposition'] as string) || '';
			let fileName = `report_${reportId}`;

			const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
			if (fileNameMatch) {
				fileName = fileNameMatch[1];
			}

			const binaryData = await this.helpers.prepareBinaryData(
				Buffer.from(respObj.body as string),
				fileName,
				contentType,
			);

			return [
				{
					json: { success: true, reportId },
					binary: {
						[binaryPropertyName]: binaryData,
					},
				},
			];
		}

		case 'schedule': {
			const reportType = this.getNodeParameter('reportType', index) as string;
			const scheduleFrequency = this.getNodeParameter('scheduleFrequency', index) as string;
			const scheduleOptions = this.getNodeParameter('scheduleOptions', index) as IDataObject;

			const body: IDataObject = {
				type: reportType,
				frequency: scheduleFrequency,
			};

			if (scheduleOptions.accountIds) {
				body.account_ids = (scheduleOptions.accountIds as string).split(',').map((id) => id.trim());
			}
			if (scheduleOptions.dayOfMonth !== undefined) {
				body.day_of_month = scheduleOptions.dayOfMonth;
			}
			if (scheduleOptions.dayOfWeek !== undefined) {
				body.day_of_week = scheduleOptions.dayOfWeek;
			}
			if (scheduleOptions.emailRecipients) {
				body.email_recipients = (scheduleOptions.emailRecipients as string)
					.split(',')
					.map((email) => email.trim());
			}
			if (scheduleOptions.enabled !== undefined) {
				body.enabled = scheduleOptions.enabled;
			}
			if (scheduleOptions.format) {
				body.format = scheduleOptions.format;
			}
			if (scheduleOptions.hour !== undefined) {
				body.hour = scheduleOptions.hour;
			}
			if (scheduleOptions.name) {
				body.name = scheduleOptions.name;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/report/schedule', body);
			break;
		}

		case 'getTypes': {
			responseData = await treasuryPrimeApiRequest.call(this, 'GET', '/report/types');
			break;
		}

		case 'getCustom': {
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			const customQueryStr = this.getNodeParameter('customQuery', index) as string;
			const customReportOptions = this.getNodeParameter('customReportOptions', index) as IDataObject;

			let customQuery: IDataObject;
			try {
				customQuery = JSON.parse(customQueryStr);
			} catch {
				throw new Error('Invalid JSON format for custom query');
			}

			const body: IDataObject = {
				query: customQuery,
				start_date: startDate,
				end_date: endDate,
			};

			if (customReportOptions.format) {
				body.format = customReportOptions.format;
			}
			if (customReportOptions.limit !== undefined) {
				body.limit = customReportOptions.limit;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/report/custom', body);
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
