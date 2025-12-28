/**
 * Treasury Prime Sandbox Actions
 * Velocity BPA - Licensed under BSL 1.1
 */

import type {
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { treasuryPrimeApiRequest } from '../../transport/treasuryPrimeClient';

export const sandboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sandbox'],
			},
		},
		options: [
			{
				name: 'Advance Time',
				value: 'advanceTime',
				description: 'Advance the sandbox time',
				action: 'Advance sandbox time',
			},
			{
				name: 'Reset Sandbox',
				value: 'reset',
				description: 'Reset the sandbox to initial state',
				action: 'Reset sandbox',
			},
			{
				name: 'Simulate ACH NOC',
				value: 'simulateAchNoc',
				description: 'Simulate an ACH Notification of Change',
				action: 'Simulate ACH NOC',
			},
			{
				name: 'Simulate ACH Return',
				value: 'simulateAchReturn',
				description: 'Simulate an ACH return',
				action: 'Simulate ACH return',
			},
			{
				name: 'Simulate Card Transaction',
				value: 'simulateCardTransaction',
				description: 'Simulate a card transaction',
				action: 'Simulate card transaction',
			},
			{
				name: 'Simulate Check Return',
				value: 'simulateCheckReturn',
				description: 'Simulate a check return',
				action: 'Simulate check return',
			},
			{
				name: 'Simulate Wire Return',
				value: 'simulateWireReturn',
				description: 'Simulate a wire return',
				action: 'Simulate wire return',
			},
		],
		default: 'simulateAchReturn',
	},
];

export const sandboxFields: INodeProperties[] = [
	// ----------------------------------
	//         sandbox: advanceTime
	// ----------------------------------
	{
		displayName: 'Days to Advance',
		name: 'days',
		type: 'number',
		required: true,
		default: 1,
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['advanceTime'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 30,
		},
		description: 'Number of days to advance the sandbox time (1-30)',
	},
	{
		displayName: 'Advance Options',
		name: 'advanceOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['advanceTime'],
			},
		},
		options: [
			{
				displayName: 'Process ACH',
				name: 'processAch',
				type: 'boolean',
				default: true,
				description: 'Whether to process pending ACH transfers',
			},
			{
				displayName: 'Process Interest',
				name: 'processInterest',
				type: 'boolean',
				default: true,
				description: 'Whether to process interest accruals',
			},
			{
				displayName: 'Process Wires',
				name: 'processWires',
				type: 'boolean',
				default: true,
				description: 'Whether to process pending wire transfers',
			},
		],
	},

	// ----------------------------------
	//         sandbox: simulateAchReturn
	// ----------------------------------
	{
		displayName: 'ACH ID',
		name: 'achId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateAchReturn', 'simulateAchNoc'],
			},
		},
		description: 'The ID of the ACH transfer to return or modify',
	},
	{
		displayName: 'Return Code',
		name: 'returnCode',
		type: 'options',
		required: true,
		default: 'R01',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateAchReturn'],
			},
		},
		options: [
			{ name: 'R01 - Insufficient Funds', value: 'R01' },
			{ name: 'R02 - Account Closed', value: 'R02' },
			{ name: 'R03 - No Account/Unable to Locate', value: 'R03' },
			{ name: 'R04 - Invalid Account Number', value: 'R04' },
			{ name: 'R05 - Unauthorized Debit', value: 'R05' },
			{ name: 'R06 - Returned per ODFI Request', value: 'R06' },
			{ name: 'R07 - Authorization Revoked', value: 'R07' },
			{ name: 'R08 - Payment Stopped', value: 'R08' },
			{ name: 'R09 - Uncollected Funds', value: 'R09' },
			{ name: 'R10 - Customer Advises Not Authorized', value: 'R10' },
			{ name: 'R11 - Check Truncation Entry Return', value: 'R11' },
			{ name: 'R12 - Branch Sold', value: 'R12' },
			{ name: 'R13 - RDFI Not Qualified', value: 'R13' },
			{ name: 'R14 - Representative Payee Deceased', value: 'R14' },
			{ name: 'R15 - Beneficiary Deceased', value: 'R15' },
			{ name: 'R16 - Account Frozen', value: 'R16' },
			{ name: 'R17 - File Record Edit Criteria', value: 'R17' },
			{ name: 'R20 - Non-Transaction Account', value: 'R20' },
			{ name: 'R21 - Invalid Company ID', value: 'R21' },
			{ name: 'R22 - Invalid Individual ID Number', value: 'R22' },
			{ name: 'R23 - Credit Entry Refused', value: 'R23' },
			{ name: 'R24 - Duplicate Entry', value: 'R24' },
			{ name: 'R29 - Corporate Customer Advises Not Authorized', value: 'R29' },
		],
		description: 'The ACH return reason code',
	},

	// ----------------------------------
	//         sandbox: simulateAchNoc
	// ----------------------------------
	{
		displayName: 'NOC Code',
		name: 'nocCode',
		type: 'options',
		required: true,
		default: 'C01',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateAchNoc'],
			},
		},
		options: [
			{ name: 'C01 - Incorrect DFI Account Number', value: 'C01' },
			{ name: 'C02 - Incorrect Routing Number', value: 'C02' },
			{ name: 'C03 - Incorrect Routing and Account Number', value: 'C03' },
			{ name: 'C04 - Incorrect Individual Name', value: 'C04' },
			{ name: 'C05 - Incorrect Transaction Code', value: 'C05' },
			{ name: 'C06 - Incorrect Account and Transaction Code', value: 'C06' },
			{ name: 'C07 - Incorrect Routing, Account, and Transaction Code', value: 'C07' },
			{ name: 'C09 - Incorrect Individual ID Number', value: 'C09' },
			{ name: 'C10 - Incorrect Company Name', value: 'C10' },
			{ name: 'C11 - Incorrect Company ID', value: 'C11' },
			{ name: 'C12 - Incorrect Company Name and ID', value: 'C12' },
			{ name: 'C13 - Addenda Format Error', value: 'C13' },
		],
		description: 'The NOC change code',
	},
	{
		displayName: 'Corrected Data',
		name: 'correctedData',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateAchNoc'],
			},
		},
		description: 'The corrected data (JSON format, e.g., {"account_number": "1234567890"})',
	},

	// ----------------------------------
	//         sandbox: simulateWireReturn
	// ----------------------------------
	{
		displayName: 'Wire ID',
		name: 'wireId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateWireReturn'],
			},
		},
		description: 'The ID of the wire transfer to return',
	},
	{
		displayName: 'Return Reason',
		name: 'wireReturnReason',
		type: 'options',
		required: true,
		default: 'account_closed',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateWireReturn'],
			},
		},
		options: [
			{ name: 'Account Closed', value: 'account_closed' },
			{ name: 'Beneficiary Unknown', value: 'beneficiary_unknown' },
			{ name: 'Incorrect Account Number', value: 'incorrect_account_number' },
			{ name: 'Insufficient Funds', value: 'insufficient_funds' },
			{ name: 'Regulatory Hold', value: 'regulatory_hold' },
			{ name: 'Rejected by Beneficiary Bank', value: 'rejected_by_beneficiary_bank' },
		],
		description: 'The reason for returning the wire',
	},

	// ----------------------------------
	//         sandbox: simulateCheckReturn
	// ----------------------------------
	{
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCheckReturn'],
			},
		},
		description: 'The ID of the check to return',
	},
	{
		displayName: 'Return Reason',
		name: 'checkReturnReason',
		type: 'options',
		required: true,
		default: 'insufficient_funds',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCheckReturn'],
			},
		},
		options: [
			{ name: 'Account Closed', value: 'account_closed' },
			{ name: 'Endorsement Missing', value: 'endorsement_missing' },
			{ name: 'Insufficient Funds', value: 'insufficient_funds' },
			{ name: 'Invalid Signature', value: 'invalid_signature' },
			{ name: 'Post-Dated', value: 'post_dated' },
			{ name: 'Stale Dated', value: 'stale_dated' },
			{ name: 'Stop Payment', value: 'stop_payment' },
		],
		description: 'The reason for returning the check',
	},

	// ----------------------------------
	//         sandbox: simulateCardTransaction
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCardTransaction'],
			},
		},
		description: 'The ID of the card',
	},
	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		default: 1000,
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCardTransaction'],
			},
		},
		description: 'Transaction amount in cents',
	},
	{
		displayName: 'Transaction Type',
		name: 'cardTransactionType',
		type: 'options',
		required: true,
		default: 'purchase',
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCardTransaction'],
			},
		},
		options: [
			{ name: 'ATM Withdrawal', value: 'atm_withdrawal' },
			{ name: 'Capture', value: 'capture' },
			{ name: 'Pre-Authorization', value: 'preauthorization' },
			{ name: 'Purchase', value: 'purchase' },
			{ name: 'Refund', value: 'refund' },
			{ name: 'Reversal', value: 'reversal' },
		],
		description: 'The type of card transaction to simulate',
	},
	{
		displayName: 'Transaction Options',
		name: 'transactionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['simulateCardTransaction'],
			},
		},
		options: [
			{
				displayName: 'Decline',
				name: 'decline',
				type: 'boolean',
				default: false,
				description: 'Whether to simulate a declined transaction',
			},
			{
				displayName: 'Decline Reason',
				name: 'declineReason',
				type: 'options',
				options: [
					{ name: 'Card Expired', value: 'card_expired' },
					{ name: 'Card Inactive', value: 'card_inactive' },
					{ name: 'Card Locked', value: 'card_locked' },
					{ name: 'CVV Mismatch', value: 'cvv_mismatch' },
					{ name: 'Insufficient Funds', value: 'insufficient_funds' },
					{ name: 'Limit Exceeded', value: 'limit_exceeded' },
				],
				default: 'insufficient_funds',
				description: 'The reason for declining the transaction',
			},
			{
				displayName: 'International',
				name: 'international',
				type: 'boolean',
				default: false,
				description: 'Whether this is an international transaction',
			},
			{
				displayName: 'MCC Code',
				name: 'mccCode',
				type: 'string',
				default: '5411',
				description: 'Merchant Category Code',
			},
			{
				displayName: 'Merchant Name',
				name: 'merchantName',
				type: 'string',
				default: 'Test Merchant',
				description: 'Name of the merchant',
			},
		],
	},

	// ----------------------------------
	//         sandbox: reset
	// ----------------------------------
	{
		displayName: 'Reset Options',
		name: 'resetOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sandbox'],
				operation: ['reset'],
			},
		},
		options: [
			{
				displayName: 'Confirm Reset',
				name: 'confirm',
				type: 'boolean',
				default: false,
				description: 'Confirm that you want to reset all sandbox data',
			},
			{
				displayName: 'Keep Accounts',
				name: 'keepAccounts',
				type: 'boolean',
				default: false,
				description: 'Whether to keep existing accounts (but clear transactions)',
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
		case 'advanceTime': {
			const days = this.getNodeParameter('days', index) as number;
			const advanceOptions = this.getNodeParameter('advanceOptions', index) as IDataObject;

			const body: IDataObject = {
				days,
			};

			if (advanceOptions.processAch !== undefined) {
				body.process_ach = advanceOptions.processAch;
			}
			if (advanceOptions.processInterest !== undefined) {
				body.process_interest = advanceOptions.processInterest;
			}
			if (advanceOptions.processWires !== undefined) {
				body.process_wires = advanceOptions.processWires;
			}

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				'/sandbox/advance_time',
				body,
			);
			break;
		}

		case 'reset': {
			const resetOptions = this.getNodeParameter('resetOptions', index) as IDataObject;

			if (!resetOptions.confirm) {
				throw new Error('You must confirm the sandbox reset by checking the "Confirm Reset" option');
			}

			const body: IDataObject = {};

			if (resetOptions.keepAccounts !== undefined) {
				body.keep_accounts = resetOptions.keepAccounts;
			}

			responseData = await treasuryPrimeApiRequest.call(this, 'POST', '/sandbox/reset', body);
			break;
		}

		case 'simulateAchReturn': {
			const achId = this.getNodeParameter('achId', index) as string;
			const returnCode = this.getNodeParameter('returnCode', index) as string;

			const body: IDataObject = {
				return_code: returnCode,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/sandbox/ach/${achId}/return`,
				body,
			);
			break;
		}

		case 'simulateAchNoc': {
			const achId = this.getNodeParameter('achId', index) as string;
			const nocCode = this.getNodeParameter('nocCode', index) as string;
			const correctedDataStr = this.getNodeParameter('correctedData', index) as string;

			let correctedData: IDataObject;
			try {
				correctedData = JSON.parse(correctedDataStr);
			} catch {
				throw new Error('Invalid JSON format for corrected data');
			}

			const body: IDataObject = {
				noc_code: nocCode,
				corrected_data: correctedData,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/sandbox/ach/${achId}/noc`,
				body,
			);
			break;
		}

		case 'simulateWireReturn': {
			const wireId = this.getNodeParameter('wireId', index) as string;
			const wireReturnReason = this.getNodeParameter('wireReturnReason', index) as string;

			const body: IDataObject = {
				reason: wireReturnReason,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/sandbox/wire/${wireId}/return`,
				body,
			);
			break;
		}

		case 'simulateCheckReturn': {
			const checkId = this.getNodeParameter('checkId', index) as string;
			const checkReturnReason = this.getNodeParameter('checkReturnReason', index) as string;

			const body: IDataObject = {
				reason: checkReturnReason,
			};

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/sandbox/check/${checkId}/return`,
				body,
			);
			break;
		}

		case 'simulateCardTransaction': {
			const cardId = this.getNodeParameter('cardId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const cardTransactionType = this.getNodeParameter('cardTransactionType', index) as string;
			const transactionOptions = this.getNodeParameter('transactionOptions', index) as IDataObject;

			const body: IDataObject = {
				amount,
				type: cardTransactionType,
			};

			if (transactionOptions.decline !== undefined) {
				body.decline = transactionOptions.decline;
			}
			if (transactionOptions.declineReason) {
				body.decline_reason = transactionOptions.declineReason;
			}
			if (transactionOptions.international !== undefined) {
				body.international = transactionOptions.international;
			}
			if (transactionOptions.mccCode) {
				body.mcc_code = transactionOptions.mccCode;
			}
			if (transactionOptions.merchantName) {
				body.merchant_name = transactionOptions.merchantName;
			}

			responseData = await treasuryPrimeApiRequest.call(
				this,
				'POST',
				`/sandbox/card/${cardId}/transaction`,
				body,
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
