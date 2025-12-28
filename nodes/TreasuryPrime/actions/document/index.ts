/**
 * Treasury Prime Document Resource
 * 
 * Handles document upload, retrieval, and management for KYC/KYB verification.
 * Documents include ID verification, proof of address, business formation docs, etc.
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

// Document Types for Treasury Prime KYC/KYB
export const documentTypes = [
	{ name: 'Government ID (Front)', value: 'government_id_front' },
	{ name: 'Government ID (Back)', value: 'government_id_back' },
	{ name: 'Passport', value: 'passport' },
	{ name: 'Driver License', value: 'drivers_license' },
	{ name: 'SSN Card', value: 'ssn_card' },
	{ name: 'Proof of Address', value: 'proof_of_address' },
	{ name: 'Utility Bill', value: 'utility_bill' },
	{ name: 'Bank Statement', value: 'bank_statement' },
	{ name: 'Tax Return', value: 'tax_return' },
	{ name: 'Articles of Incorporation', value: 'articles_of_incorporation' },
	{ name: 'Certificate of Formation', value: 'certificate_of_formation' },
	{ name: 'Operating Agreement', value: 'operating_agreement' },
	{ name: 'Bylaws', value: 'bylaws' },
	{ name: 'EIN Letter', value: 'ein_letter' },
	{ name: 'Business License', value: 'business_license' },
	{ name: 'Beneficial Ownership', value: 'beneficial_ownership' },
	{ name: 'Voided Check', value: 'voided_check' },
	{ name: 'Signature Card', value: 'signature_card' },
	{ name: 'Other', value: 'other' },
];

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload a document for KYC/KYB verification',
				action: 'Upload a document',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get document details by ID',
				action: 'Get a document',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all documents',
				action: 'List all documents',
			},
			{
				name: 'Get by Person',
				value: 'getByPerson',
				description: 'Get all documents for a person',
				action: 'Get documents by person',
			},
			{
				name: 'Get by Business',
				value: 'getByBusiness',
				description: 'Get all documents for a business',
				action: 'Get documents by business',
			},
			{
				name: 'Get by Account',
				value: 'getByAccount',
				description: 'Get all documents for an account',
				action: 'Get documents by account',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get document verification status',
				action: 'Get document status',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a document',
				action: 'Delete a document',
			},
			{
				name: 'Download',
				value: 'download',
				description: 'Download document file',
				action: 'Download a document',
			},
		],
		default: 'upload',
	},
];

export const documentFields: INodeProperties[] = [
	// ----------------------------------
	//         Upload Document
	// ----------------------------------
	{
		displayName: 'Owner Type',
		name: 'ownerType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{ name: 'Person', value: 'person' },
			{ name: 'Business', value: 'business' },
			{ name: 'Account Application', value: 'account_application' },
		],
		default: 'person',
		description: 'The type of entity this document belongs to',
	},
	{
		displayName: 'Owner ID',
		name: 'ownerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		default: '',
		placeholder: 'psn_xxx or bus_xxx or acctapp_xxx',
		description: 'The ID of the person, business, or account application',
	},
	{
		displayName: 'Document Type',
		name: 'documentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: documentTypes,
		default: 'government_id_front',
		description: 'The type of document being uploaded',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the document file',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the document',
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'Custom label for the document',
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
	//         Get Document
	// ----------------------------------
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['get', 'getStatus', 'delete', 'download'],
			},
		},
		default: '',
		placeholder: 'doc_xxx',
		description: 'The ID of the document',
	},
	// ----------------------------------
	//         Get by Person/Business/Account
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getByPerson'],
			},
		},
		default: '',
		placeholder: 'psn_xxx',
		description: 'The ID of the person',
	},
	{
		displayName: 'Business ID',
		name: 'businessId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getByBusiness'],
			},
		},
		default: '',
		placeholder: 'bus_xxx',
		description: 'The ID of the business',
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getByAccount'],
			},
		},
		default: '',
		placeholder: 'acct_xxx',
		description: 'The ID of the account',
	},
	// ----------------------------------
	//         List Documents
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['list', 'getByPerson', 'getByBusiness', 'getByAccount'],
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
				resource: ['document'],
				operation: ['list', 'getByPerson', 'getByBusiness', 'getByAccount'],
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
				resource: ['document'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Document Type',
				name: 'type',
				type: 'options',
				options: documentTypes,
				default: '',
				description: 'Filter by document type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Verified', value: 'verified' },
					{ name: 'Rejected', value: 'rejected' },
					{ name: 'Expired', value: 'expired' },
				],
				default: '',
				description: 'Filter by verification status',
			},
			{
				displayName: 'Person ID',
				name: 'person_id',
				type: 'string',
				default: '',
				description: 'Filter by person ID',
			},
			{
				displayName: 'Business ID',
				name: 'business_id',
				type: 'string',
				default: '',
				description: 'Filter by business ID',
			},
		],
	},
	// ----------------------------------
	//         Download Document
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyOutput',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['download'],
			},
		},
		default: 'data',
		description: 'Name of the binary property to store the downloaded file',
	},
];

/**
 * Execute document operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'upload') {
		// Upload a document for KYC/KYB
		const ownerType = this.getNodeParameter('ownerType', index) as string;
		const ownerId = this.getNodeParameter('ownerId', index) as string;
		const documentType = this.getNodeParameter('documentType', index) as string;
		const binaryProperty = this.getNodeParameter('binaryProperty', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

		const binaryData = this.helpers.assertBinaryData(index, binaryProperty);
		const buffer = await this.helpers.getBinaryDataBuffer(index, binaryProperty);

		// Build form data
		const formData: IDataObject = {
			type: documentType,
			file: {
				value: buffer,
				options: {
					filename: binaryData.fileName || 'document',
					contentType: binaryData.mimeType,
				},
			},
		};

		// Add owner reference based on type
		if (ownerType === 'person') {
			formData.person_id = ownerId;
		} else if (ownerType === 'business') {
			formData.business_id = ownerId;
		} else if (ownerType === 'account_application') {
			formData.account_application_id = ownerId;
		}

		if (additionalFields.description) {
			formData.description = additionalFields.description;
		}
		if (additionalFields.label) {
			formData.label = additionalFields.label;
		}
		if (additionalFields.metadata) {
			formData.metadata = typeof additionalFields.metadata === 'string'
				? JSON.parse(additionalFields.metadata)
				: additionalFields.metadata;
		}

		responseData = await treasuryPrimeApiRequest.call(
			this,
			'POST',
			'/document',
			{},
			{},
			{ formData },
		);

	} else if (operation === 'get') {
		// Get document by ID
		const documentId = this.getNodeParameter('documentId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'GET', `/document/${documentId}`);

	} else if (operation === 'list') {
		// List all documents
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = { ...filters };

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/document',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/document', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'getByPerson') {
		// Get documents by person
		const personId = this.getNodeParameter('personId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		const qs: IDataObject = { person_id: personId };

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/document',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/document', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'getByBusiness') {
		// Get documents by business
		const businessId = this.getNodeParameter('businessId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		const qs: IDataObject = { business_id: businessId };

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/document',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/document', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'getByAccount') {
		// Get documents by account
		const accountId = this.getNodeParameter('accountId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		const qs: IDataObject = { account_id: accountId };

		if (returnAll) {
			responseData = await treasuryPrimeApiRequestAllItems.call(
				this,
				'GET',
				'/document',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.page_size = limit;
			const response = await treasuryPrimeApiRequest.call(this, 'GET', '/document', {}, qs);
			responseData = (response.data as IDataObject[]) || response;
		}

	} else if (operation === 'getStatus') {
		// Get document verification status
		const documentId = this.getNodeParameter('documentId', index) as string;
		const response = await treasuryPrimeApiRequest.call(this, 'GET', `/document/${documentId}`);
		responseData = {
			id: response.id,
			status: response.status,
			verification_status: response.verification_status,
			verification_result: response.verification_result,
			rejection_reason: response.rejection_reason,
			verified_at: response.verified_at,
		};

	} else if (operation === 'delete') {
		// Delete a document
		const documentId = this.getNodeParameter('documentId', index) as string;
		responseData = await treasuryPrimeApiRequest.call(this, 'DELETE', `/document/${documentId}`);

	} else if (operation === 'download') {
		// Download document file
		const documentId = this.getNodeParameter('documentId', index) as string;
		const binaryPropertyOutput = this.getNodeParameter('binaryPropertyOutput', index) as string;

		// First get document metadata
		const docMeta = await treasuryPrimeApiRequest.call(this, 'GET', `/document/${documentId}`);
		
		// Download the file
		const response = await treasuryPrimeApiRequest.call(
			this,
			'GET',
			`/document/${documentId}/download`,
			{},
			{},
			{ encoding: 'arraybuffer', returnFullResponse: true },
		);

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(response.body as Buffer),
			docMeta.filename as string || 'document',
			docMeta.content_type as string || 'application/octet-stream',
		);

		return [{
			json: docMeta as IDataObject,
			binary: {
				[binaryPropertyOutput]: binaryData,
			},
		}];
	}

	return [{ json: responseData as IDataObject }];
}

export const description: INodeProperties[] = [
	...documentOperations,
	...documentFields,
];
