/**
 * Treasury Prime Utility Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest } from '../../transport/treasuryPrimeClient';
import { validateRoutingNumber, validateAccountNumber } from '../../utils/validationUtils';
import { getRoutingNumberInfo } from '../../utils/routingUtils';

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Get the API status and health',
				action: 'Get API status',
			},
			{
				name: 'Get Rate Limits',
				value: 'getRateLimits',
				description: 'Get current rate limit status',
				action: 'Get rate limits',
			},
			{
				name: 'Test Connection',
				value: 'testConnection',
				description: 'Test the API connection',
				action: 'Test connection',
			},
			{
				name: 'Validate Account Number',
				value: 'validateAccountNumber',
				description: 'Validate an account number format',
				action: 'Validate account number',
			},
			{
				name: 'Validate Routing Number',
				value: 'validateRoutingNumber',
				description: 'Validate an ABA routing number',
				action: 'Validate routing number',
			},
		],
		default: 'testConnection',
	},
];

export const utilityFields: INodeProperties[] = [
	// ----------------------------------
	//         utility: validateRoutingNumber
	// ----------------------------------
	{
		displayName: 'Routing Number',
		name: 'routingNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateRoutingNumber'],
			},
		},
		description: 'The 9-digit ABA routing number to validate',
	},
	{
		displayName: 'Validation Options',
		name: 'routingValidationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateRoutingNumber'],
			},
		},
		options: [
			{
				displayName: 'Check ACH Eligibility',
				name: 'checkAchEligibility',
				type: 'boolean',
				default: true,
				description: 'Whether to check if the routing number is eligible for ACH',
			},
			{
				displayName: 'Check Wire Eligibility',
				name: 'checkWireEligibility',
				type: 'boolean',
				default: true,
				description: 'Whether to check if the routing number is eligible for wires',
			},
			{
				displayName: 'Get Bank Info',
				name: 'getBankInfo',
				type: 'boolean',
				default: true,
				description: 'Whether to retrieve bank information for the routing number',
			},
		],
	},

	// ----------------------------------
	//         utility: validateAccountNumber
	// ----------------------------------
	{
		displayName: 'Account Number',
		name: 'accountNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateAccountNumber'],
			},
		},
		description: 'The account number to validate',
	},
	{
		displayName: 'Account Type',
		name: 'accountType',
		type: 'options',
		default: 'checking',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateAccountNumber'],
			},
		},
		options: [
			{
				name: 'Checking',
				value: 'checking',
			},
			{
				name: 'Savings',
				value: 'savings',
			},
		],
		description: 'The type of account',
	},
	{
		displayName: 'Routing Number (Optional)',
		name: 'routingNumberForValidation',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateAccountNumber'],
			},
		},
		description: 'Optional routing number to validate the account against a specific bank',
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'testConnection': {
			try {
				// Try to get bank info to verify connection
				const response = await treasuryPrimeApiRequest.call(this, 'GET', '/bank');
				responseData = {
					success: true,
					connected: true,
					message: 'Successfully connected to Treasury Prime API',
					bank: response,
				};
			} catch (error) {
				responseData = {
					success: false,
					connected: false,
					message: `Connection failed: ${(error as Error).message}`,
				};
			}
			break;
		}

		case 'getApiStatus': {
			try {
				const response = await treasuryPrimeApiRequest.call(this, 'GET', '/status');
				responseData = {
					status: 'operational',
					...response,
				};
			} catch (error) {
				// If the /status endpoint doesn't exist, try to infer status
				try {
					await treasuryPrimeApiRequest.call(this, 'GET', '/bank');
					responseData = {
						status: 'operational',
						message: 'API is responding normally',
						timestamp: new Date().toISOString(),
					};
				} catch {
					responseData = {
						status: 'error',
						message: `API error: ${(error as Error).message}`,
						timestamp: new Date().toISOString(),
					};
				}
			}
			break;
		}

		case 'getRateLimits': {
			try {
				const response = await treasuryPrimeApiRequest.call(
					this,
					'GET',
					'/rate_limit',
					{},
					{},
					{ resolveWithFullResponse: true },
				);

				// Extract rate limit headers
				const respObj = response as IDataObject;
				const headers = (respObj.headers as IDataObject) || {};
				responseData = {
					limit: headers['x-ratelimit-limit'] || 'unknown',
					remaining: headers['x-ratelimit-remaining'] || 'unknown',
					reset: headers['x-ratelimit-reset'] || 'unknown',
					retryAfter: headers['retry-after'] || null,
					data: respObj.body || response,
				};
			} catch (error) {
				// If the endpoint doesn't exist, return what we can from headers
				responseData = {
					message: 'Rate limit information not available',
					error: (error as Error).message,
				};
			}
			break;
		}

		case 'validateRoutingNumber': {
			const routingNumber = this.getNodeParameter('routingNumber', index) as string;
			const routingValidationOptions = this.getNodeParameter(
				'routingValidationOptions',
				index,
			) as IDataObject;

			// Perform local validation
			const isValid = validateRoutingNumber(routingNumber);

			const result: IDataObject = {
				routingNumber,
				valid: isValid,
				format: routingNumber.length === 9 ? 'correct' : 'incorrect',
			};

			if (!isValid) {
				result.error = 'Invalid routing number checksum';
			}

			// Get routing number info if valid and requested
			if (isValid && routingValidationOptions.getBankInfo) {
				const routingInfo = getRoutingNumberInfo(routingNumber);
				if (routingInfo && routingInfo.district) {
					result.federalReserveDistrict = routingInfo.district.district;
					result.federalReserveCity = routingInfo.district.city;
					result.achEligible = routingInfo.achEligible;
					result.wireEligible = routingInfo.wireEligible;
				}
			}

			// Check ACH eligibility via API if requested
			if (isValid && routingValidationOptions.checkAchEligibility) {
				try {
					const achCheck = await treasuryPrimeApiRequest.call(
						this,
						'GET',
						`/routing/${routingNumber}/ach`,
					);
					result.achEligible = achCheck.eligible ?? true;
					result.achBankName = achCheck.bank_name;
				} catch {
					result.achEligible = 'unknown';
				}
			}

			// Check wire eligibility via API if requested
			if (isValid && routingValidationOptions.checkWireEligibility) {
				try {
					const wireCheck = await treasuryPrimeApiRequest.call(
						this,
						'GET',
						`/routing/${routingNumber}/wire`,
					);
					result.wireEligible = wireCheck.eligible ?? true;
					result.wireBankName = wireCheck.bank_name;
				} catch {
					result.wireEligible = 'unknown';
				}
			}

			responseData = result;
			break;
		}

		case 'validateAccountNumber': {
			const accountNumber = this.getNodeParameter('accountNumber', index) as string;
			const accountType = this.getNodeParameter('accountType', index) as string;
			const routingNumberForValidation = this.getNodeParameter(
				'routingNumberForValidation',
				index,
			) as string;

			// Perform local validation
			const isValid = validateAccountNumber(accountNumber);

			const result: IDataObject = {
				accountNumber: `****${accountNumber.slice(-4)}`, // Mask for security
				accountType,
				valid: isValid,
				length: accountNumber.length,
			};

			if (!isValid) {
				result.error = 'Invalid account number format';
			}

			// If routing number provided, validate the combination
			if (isValid && routingNumberForValidation) {
				const routingValid = validateRoutingNumber(routingNumberForValidation);
				result.routingNumberValid = routingValid;

				if (routingValid) {
					try {
						// Try to verify via API
						const verification = await treasuryPrimeApiRequest.call(
							this,
							'POST',
							'/counterparty/verify',
							{
								routing_number: routingNumberForValidation,
								account_number: accountNumber,
								account_type: accountType,
							},
						);
						result.verificationStatus = verification.status || 'verified';
						result.bankName = verification.bank_name;
					} catch {
						result.verificationStatus = 'unverified';
						result.message = 'Could not verify account via API';
					}
				}
			}

			responseData = result;
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: index } },
	);

	return executionData;
}
