/**
 * Treasury Prime n8n Node
 * Banking-as-a-Service integration for n8n
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import actions
import * as account from './actions/account';
import * as accountApplication from './actions/accountApplication';
import * as person from './actions/person';
import * as business from './actions/business';
import * as document from './actions/document';
import * as ach from './actions/ach';
import * as wire from './actions/wire';
import * as bookTransfer from './actions/bookTransfer';
import * as check from './actions/check';
import * as card from './actions/card';
import * as counterparty from './actions/counterparty';
import * as transaction from './actions/transaction';
import * as payment from './actions/payment';
import * as billPay from './actions/billPay';
import * as statement from './actions/statement';
import * as interest from './actions/interest';
import * as fee from './actions/fee';
import * as hold from './actions/hold';
import * as alert from './actions/alert';
import * as webhook from './actions/webhook';
import * as compliance from './actions/compliance';
import * as bank from './actions/bank';
import * as reporting from './actions/reporting';
import * as sandbox from './actions/sandbox';
import * as utility from './actions/utility';

export class TreasuryPrime implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Treasury Prime',
		name: 'treasuryPrime',
		icon: 'file:treasuryprime.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Banking-as-a-Service platform for embedded banking',
		defaults: {
			name: 'Treasury Prime',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'treasuryPrimeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Manage bank accounts (checking, savings)',
					},
					{
						name: 'Account Application',
						value: 'accountApplication',
						description: 'Handle account opening applications',
					},
					{
						name: 'ACH',
						value: 'ach',
						description: 'Automated Clearing House transfers',
					},
					{
						name: 'Alert',
						value: 'alert',
						description: 'Account alerts and notifications',
					},
					{
						name: 'Bank',
						value: 'bank',
						description: 'Bank information and configuration',
					},
					{
						name: 'Bill Pay',
						value: 'billPay',
						description: 'Bill payment operations',
					},
					{
						name: 'Book Transfer',
						value: 'bookTransfer',
						description: 'Internal transfers between accounts',
					},
					{
						name: 'Business',
						value: 'business',
						description: 'Business account holders and KYB',
					},
					{
						name: 'Card',
						value: 'card',
						description: 'Debit and prepaid card issuing',
					},
					{
						name: 'Check',
						value: 'check',
						description: 'Check issuing and deposits',
					},
					{
						name: 'Compliance',
						value: 'compliance',
						description: 'AML, KYC, KYB, and regulatory compliance',
					},
					{
						name: 'Counterparty',
						value: 'counterparty',
						description: 'External transfer recipients',
					},
					{
						name: 'Document',
						value: 'document',
						description: 'Document management for KYC/KYB',
					},
					{
						name: 'Fee',
						value: 'fee',
						description: 'Account fees and charges',
					},
					{
						name: 'Hold',
						value: 'hold',
						description: 'Balance holds and reservations',
					},
					{
						name: 'Interest',
						value: 'interest',
						description: 'Interest rates and accruals',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment operations',
					},
					{
						name: 'Person',
						value: 'person',
						description: 'Individual account holders and KYC',
					},
					{
						name: 'Reporting',
						value: 'reporting',
						description: 'Generate and manage reports',
					},
					{
						name: 'Sandbox',
						value: 'sandbox',
						description: 'Sandbox simulation operations',
					},
					{
						name: 'Statement',
						value: 'statement',
						description: 'Account statements',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Transaction history and details',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Validation and utility functions',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Webhook configuration and management',
					},
					{
						name: 'Wire',
						value: 'wire',
						description: 'Domestic and international wire transfers',
					},
				],
				default: 'account',
			},

			// Account operations and fields
			...account.accountOperations,
			...account.accountFields,

			// Account Application operations and fields
			...accountApplication.accountApplicationOperations,
			...accountApplication.accountApplicationFields,

			// Person operations and fields
			...person.personOperations,
			...person.personFields,

			// Business operations and fields
			...business.businessOperations,
			...business.businessFields,

			// Document operations and fields
			...document.documentOperations,
			...document.documentFields,

			// ACH operations and fields
			...ach.achOperations,
			...ach.achFields,

			// Wire operations and fields
			...wire.wireOperations,
			...wire.wireFields,

			// Book Transfer operations and fields
			...bookTransfer.bookTransferOperations,
			...bookTransfer.bookTransferFields,

			// Check operations and fields
			...check.checkOperations,
			...check.checkFields,

			// Card operations and fields
			...card.cardOperations,
			...card.cardFields,

			// Counterparty operations and fields
			...counterparty.counterpartyOperations,
			...counterparty.counterpartyFields,

			// Transaction operations and fields
			...transaction.transactionOperations,
			...transaction.transactionFields,

			// Payment operations and fields
			...payment.paymentOperations,
			...payment.paymentFields,

			// Bill Pay operations and fields
			...billPay.billPayOperations,
			...billPay.billPayFields,

			// Statement operations and fields
			...statement.statementOperations,
			...statement.statementFields,

			// Interest operations and fields
			...interest.interestOperations,
			...interest.interestFields,

			// Fee operations and fields
			...fee.feeOperations,
			...fee.feeFields,

			// Hold operations and fields
			...hold.holdOperations,
			...hold.holdFields,

			// Alert operations and fields
			...alert.alertOperations,
			...alert.alertFields,

			// Webhook operations and fields
			...webhook.webhookOperations,
			...webhook.webhookFields,

			// Compliance operations and fields
			...compliance.complianceOperations,
			...compliance.complianceFields,

			// Bank operations and fields
			...bank.bankOperations,
			...bank.bankFields,

			// Reporting operations and fields
			...reporting.reportingOperations,
			...reporting.reportingFields,

			// Sandbox operations and fields
			...sandbox.sandboxOperations,
			...sandbox.sandboxFields,

			// Utility operations and fields
			...utility.utilityOperations,
			...utility.utilityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		// Log licensing notice once per execution
		this.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
		);

		for (let i = 0; i < items.length; i++) {
			try {
				let executionData: INodeExecutionData[] = [];

				switch (resource) {
					case 'account':
						executionData = await account.execute.call(this, i);
						break;
					case 'accountApplication':
						executionData = await accountApplication.execute.call(this, i);
						break;
					case 'person':
						executionData = await person.execute.call(this, i);
						break;
					case 'business':
						executionData = await business.execute.call(this, i);
						break;
					case 'document':
						executionData = await document.execute.call(this, i);
						break;
					case 'ach':
						executionData = await ach.execute.call(this, i);
						break;
					case 'wire':
						executionData = await wire.execute.call(this, i);
						break;
					case 'bookTransfer':
						executionData = await bookTransfer.execute.call(this, i);
						break;
					case 'check':
						executionData = await check.execute.call(this, i);
						break;
					case 'card':
						executionData = await card.execute.call(this, i);
						break;
					case 'counterparty':
						executionData = await counterparty.execute.call(this, i);
						break;
					case 'transaction':
						executionData = await transaction.execute.call(this, i);
						break;
					case 'payment':
						executionData = await payment.execute.call(this, i);
						break;
					case 'billPay':
						executionData = await billPay.execute.call(this, i);
						break;
					case 'statement':
						executionData = await statement.execute.call(this, i);
						break;
					case 'interest':
						executionData = await interest.execute.call(this, i);
						break;
					case 'fee':
						executionData = await fee.execute.call(this, i);
						break;
					case 'hold':
						executionData = await hold.execute.call(this, i);
						break;
					case 'alert':
						executionData = await alert.execute.call(this, i);
						break;
					case 'webhook':
						executionData = await webhook.execute.call(this, i);
						break;
					case 'compliance':
						executionData = await compliance.execute.call(this, i);
						break;
					case 'bank':
						executionData = await bank.execute.call(this, i);
						break;
					case 'reporting':
						executionData = await reporting.execute.call(this, i);
						break;
					case 'sandbox':
						executionData = await sandbox.execute.call(this, i);
						break;
					case 'utility':
						executionData = await utility.execute.call(this, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown resource: ${resource}`,
							{ itemIndex: i },
						);
				}

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
