/**
 * Treasury Prime Check Resource
 * 
 * Handles check operations including:
 * - Check creation and mailing
 * - Check deposits (mobile/remote)
 * - Stop payments
 * - Check images
 * 
 * @copyright Velocity BPA 2025
 * @license BSL-1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	IBinaryKeyData,
} from 'n8n-workflow';

import { treasuryPrimeApiRequest, treasuryPrimeApiRequestAllItems } from '../../transport/treasuryPrimeClient';

export const checkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['check'],
			},
		},
		options: [
			{
				name: 'Create Check',
				value: 'create',
				description: 'Create a new check to be mailed',
				action: 'Create a check',
			},
			{
				name: 'Get Check',
				value: 'get',
				description: 'Get check details by ID',
				action: 'Get a check',
			},
			{
				name: 'List Checks',
				value: 'list',
				description: 'List all checks',
				action: 'List checks',
			},
			{
				name: 'Cancel Check',
				value: 'cancel',
				description: 'Cancel/void a check',
				action: 'Cancel a check',
			},
			{
				name: 'Stop Payment',
				value: 'stopPayment',
				description: 'Place a stop payment on a check',
				action: 'Stop check payment',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get check status',
				action: 'Get check status',
			},
			{
				name: 'Get Image',
				value: 'getImage',
				description: 'Get check image (front/back)',
				action: 'Get check image',
			},
			{
				name: 'Create Deposit',
				value: 'createDeposit',
				description: 'Create a check deposit (remote deposit capture)',
				action: 'Create check deposit',
			},
			{
				name: 'Get Deposit',
				value: 'getDeposit',
				description: 'Get check deposit details',
				action: 'Get check deposit',
			},
			{
				name: 'Get Deposit Image',
				value: 'getDepositImage',
				description: 'Get deposited check image',
				action: 'Get deposit image',
			},
		],
		default: 'create',
	},
];

export const checkFields: INodeProperties[] = [
	// ----------------------------------
	//         Create Check
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create', 'createDeposit'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The account ID for the check',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'The check amount in cents (e.g., 15000 for $150.00)',
	},
	{
		displayName: 'Payee Name',
		name: 'payeeName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the check payee',
	},
	{
		displayName: 'Payee Address',
		name: 'payeeAddress',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		default: {},
		placeholder: 'Add Address',
		options: [
			{
				name: 'address',
				displayName: 'Address',
				values: [
					{
						displayName: 'Street Address',
						name: 'line_1',
						type: 'string',
						required: true,
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
						required: true,
						default: '',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'CA',
					},
					{
						displayName: 'Postal Code',
						name: 'postal_code',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Memo',
				name: 'memo',
				type: 'string',
				default: '',
				description: 'Memo line on the check',
			},
			{
				displayName: 'Check Number',
				name: 'check_number',
				type: 'string',
				default: '',
				description: 'Custom check number (if not auto-assigned)',
			},
			{
				displayName: 'Mail Type',
				name: 'mail_type',
				type: 'options',
				options: [
					{ name: 'Standard', value: 'standard' },
					{ name: 'Express', value: 'express' },
					{ name: 'Overnight', value: 'overnight' },
				],
				default: 'standard',
				description: 'Mail delivery type',
			},
			{
				displayName: 'Send Date',
				name: 'send_date',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Date to send the check (future dated)',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '',
				description: 'Unique key to prevent duplicate checks',
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
	//         Create Deposit
	// ----------------------------------
	{
		displayName: 'Front Image (Binary Property)',
		name: 'frontImage',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['createDeposit'],
			},
		},
		default: 'front',
		description: 'Binary property containing the check front image',
	},
	{
		displayName: 'Back Image (Binary Property)',
		name: 'backImage',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['createDeposit'],
			},
		},
		default: 'back',
		description: 'Binary property containing the check back image',
	},
	{
		displayName: 'Deposit Amount (Cents)',
		name: 'depositAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['createDeposit'],
			},
		},
		default: 0,
		description: 'The deposit amount in cents',
	},
	// ----------------------------------
	//         Get/Cancel/Stop Payment
	// ----------------------------------
	{
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['get', 'cancel', 'stopPayment', 'getStatus', 'getImage'],
			},
		},
		default: '',
		placeholder: 'chk_xxx',
		description: 'The check ID',
	},
	{
		displayName: 'Deposit ID',
		name: 'depositId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['getDeposit', 'getDepositImage'],
			},
		},
		default: '',
		placeholder: 'dep_xxx',
		description: 'The check deposit ID',
	},
	{
		displayName: 'Stop Payment Reason',
		name: 'stopReason',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['stopPayment'],
			},
		},
		options: [
			{ name: 'Lost', value: 'lost' },
			{ name: 'Stolen', value: 'stolen' },
			{ name: 'Dispute', value: 'dispute' },
			{ name: 'Duplicate', value: 'duplicate' },
			{ name: 'Other', value: 'other' },
		],
		default: 'lost',
		description: 'Reason for stop payment',
	},
	{
		displayName: 'Image Side',
		name: 'imageSide',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['getImage', 'getDepositImage'],
			},
		},
		options: [
			{ name: 'Front', value: 'front' },
			{ name: 'Back', value: 'back' },
			{ name: 'Both', value: 'both' },
		],
		default: 'both',
		description: 'Which side of the check image to retrieve',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['getImage', 'getDepositImage'],
			},
		},
		default: 'data',
		description: 'Name of the binary property to store the image',
	},
	// ----------------------------------
	//         List Checks
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['check'],
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
				resource: ['check'],
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
				resource: ['check'],
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
					{ name: 'Mailed', value: 'mailed' },
					{ name: 'In Transit', value: 'in_transit' },
					{ name: 'Delivered', value: 'delivered' },
					{ name: 'Cashed', value: 'cashed' },
					{ name: 'Voided', value: 'voided' },
					{ name: 'Stopped', value: 'stopped' },
					{ name: 'Returned', value: 'returned' },
				],
				default: [],
				description: 'Filter by status',
			},
			{
				displayName: 'Check Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Outgoing', value: 'outgoing' },
					{ name: 'Deposit', value: 'deposit' },
				],
				default: '',
				description: 'Filter by check type',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter checks from this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter checks to this date',
			},
			{
				displayName: 'Check Number',
				name: 'check_number',
				type: 'string',
				default: '',
				description: 'Filter by check number',
			},
		],
	},
];

/**
 * Execute check operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		// Create a check
		const accountId = this.getNodeParameter('accountId', index) as string;
		const amount = this.getNodeParameter('amount', index) as number;
		const payeeName = this.getNodeParameter('payeeName', index) as string;
		const payeeAddress = this.getNodeParameter('payeeAddress', index) as IDataObject;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const body: IDataObject = {
			account_id: accountId,
			amount,
			payee: {
				name: payeeName,
			},
		};

		// Add payee address
		if (payeeAddress.address) {
			(body.payee as IDataObject).address = payeeAddress.address;
		}

		if (additionalFields.memo) {
			body.memo = additionalFields.memo;
		}
		if (additionalFields.check_number) {
			body.check_number = additionalFields.check_number;
		}
		if (additionalFields.mail_type) {
			body.mail_type = additionalFields.mail_type;
		}
		if (additionalFields.send_date) {
			body.send_date = additionalFields.send_date;
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
			'/check',
			body,
			{},
			{ headers },
		);

	} else if (operation === 'get') {
		// Get check by ID
		const checkId = this.getNodeParameter('checkId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/check/${checkId}`);

	} else if (operation === 'list') {
		// List checks
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};
		
		if (filters.account_id) qs.account_id = filters.account_id;
		if (filters.type) qs.type = filters.type;
		if (filters.check_number) qs.check_number = filters.check_number;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;
		if ((filters.status as string[])?.length) {
			qs.status = (filters.status as string[]).join(',');
		}

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/check',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/check', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'cancel') {
		// Cancel/void a check
		const checkId = this.getNodeParameter('checkId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(
			this,
			'PATCH',
			`/check/${checkId}`,
			{ status: 'voided' },
		);

	} else if (operation === 'stopPayment') {
		// Stop payment on a check
		const checkId = this.getNodeParameter('checkId', index) as string;
		const stopReason = this.getNodeParameter('stopReason', index) as string;

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			`/check/${checkId}/stop_payment`,
			{ reason: stopReason },
		);

	} else if (operation === 'getStatus') {
		// Get check status
		const checkId = this.getNodeParameter('checkId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/check/${checkId}`);
		
		responseData = {
			id: response.id,
			check_number: response.check_number,
			status: response.status,
			amount: response.amount,
			payee: response.payee,
			mailed_at: response.mailed_at,
			cashed_at: response.cashed_at,
			voided_at: response.voided_at,
			tracking_number: response.tracking_number,
			created_at: response.created_at,
			updated_at: response.updated_at,
		};

	} else if (operation === 'getImage') {
		// Get check image
		const checkId = this.getNodeParameter('checkId', index) as string;
		const imageSide = this.getNodeParameter('imageSide', index) as string;
		const binaryProperty = this.getNodeParameter('binaryProperty', index) as string;

		const result: IDataObject = { id: checkId };
		const binary: IBinaryKeyData = {};

		if (imageSide === 'front' || imageSide === 'both') {
			const frontResponse = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/check/${checkId}/image/front`,
				{},
				{},
				{ encoding: 'arraybuffer', returnFullResponse: true },
			);
			binary[`${binaryProperty}_front`] = await this.helpers.prepareBinaryData(
				Buffer.from(frontResponse.body as Buffer),
				`check_${checkId}_front.png`,
				'image/png',
			);
		}

		if (imageSide === 'back' || imageSide === 'both') {
			const backResponse = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/check/${checkId}/image/back`,
				{},
				{},
				{ encoding: 'arraybuffer', returnFullResponse: true },
			);
			binary[`${binaryProperty}_back`] = await this.helpers.prepareBinaryData(
				Buffer.from(backResponse.body as Buffer),
				`check_${checkId}_back.png`,
				'image/png',
			);
		}

		return [{ json: result, binary }];

	} else if (operation === 'createDeposit') {
		// Create check deposit (RDC)
		const accountId = this.getNodeParameter('accountId', index) as string;
		const frontImageProp = this.getNodeParameter('frontImage', index) as string;
		const backImageProp = this.getNodeParameter('backImage', index) as string;
		const depositAmount = this.getNodeParameter('depositAmount', index) as number;

		const frontBinary = this.helpers.assertBinaryData(index, frontImageProp);
		const backBinary = this.helpers.assertBinaryData(index, backImageProp);
		const frontBuffer = await this.helpers.getBinaryDataBuffer(index, frontImageProp);
		const backBuffer = await this.helpers.getBinaryDataBuffer(index, backImageProp);

		const formData: IDataObject = {
			account_id: accountId,
			amount: depositAmount,
			front_image: {
				value: frontBuffer,
				options: {
					filename: frontBinary.fileName || 'front.jpg',
					contentType: frontBinary.mimeType,
				},
			},
			back_image: {
				value: backBuffer,
				options: {
					filename: backBinary.fileName || 'back.jpg',
					contentType: backBinary.mimeType,
				},
			},
		};

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			'/check/deposit',
			{},
			{},
			{ formData },
		);

	} else if (operation === 'getDeposit') {
		// Get check deposit details
		const depositId = this.getNodeParameter('depositId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/check/deposit/${depositId}`);

	} else if (operation === 'getDepositImage') {
		// Get deposited check image
		const depositId = this.getNodeParameter('depositId', index) as string;
		const imageSide = this.getNodeParameter('imageSide', index) as string;
		const binaryProperty = this.getNodeParameter('binaryProperty', index) as string;

		const result: IDataObject = { id: depositId };
		const binary: IBinaryKeyData = {};

		if (imageSide === 'front' || imageSide === 'both') {
			const frontResponse = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/check/deposit/${depositId}/image/front`,
				{},
				{},
				{ encoding: 'arraybuffer', returnFullResponse: true },
			);
			binary[`${binaryProperty}_front`] = await this.helpers.prepareBinaryData(
				Buffer.from(frontResponse.body as Buffer),
				`deposit_${depositId}_front.png`,
				'image/png',
			);
		}

		if (imageSide === 'back' || imageSide === 'both') {
			const backResponse = await treasuryPrimeApiRequest.call(
				this,
				'GET',
				`/check/deposit/${depositId}/image/back`,
				{},
				{},
				{ encoding: 'arraybuffer', returnFullResponse: true },
			);
			binary[`${binaryProperty}_back`] = await this.helpers.prepareBinaryData(
				Buffer.from(backResponse.body as Buffer),
				`deposit_${depositId}_back.png`,
				'image/png',
			);
		}

		return [{ json: result, binary }];
	}

	// Handle array responses
	if (Array.isArray(responseData)) {
		return responseData.map(item => ({ json: item }));
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...checkOperations,
	...checkFields,
];
