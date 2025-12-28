/**
 * Treasury Prime Trigger Node
 * Webhook trigger for real-time banking events
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { verifyWebhookSignature, parseWebhookEvent } from './transport/webhookHandler';

export class TreasuryPrimeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Treasury Prime Trigger',
		name: 'treasuryPrimeTrigger',
		icon: 'file:treasuryprime.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive real-time webhook events from Treasury Prime',
		defaults: {
			name: 'Treasury Prime Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'treasuryPrimeApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for',
				options: [
					// All events
					{
						name: '*',
						value: '*',
						description: 'All events',
					},
					// Account events
					{
						name: 'Account - Created',
						value: 'account.created',
					},
					{
						name: 'Account - Updated',
						value: 'account.updated',
					},
					{
						name: 'Account - Closed',
						value: 'account.closed',
					},
					{
						name: 'Account - Status Changed',
						value: 'account.status_changed',
					},
					{
						name: 'Account - Balance Changed',
						value: 'account.balance_changed',
					},
					// Account Application events
					{
						name: 'Application - Created',
						value: 'account_application.created',
					},
					{
						name: 'Application - Submitted',
						value: 'account_application.submitted',
					},
					{
						name: 'Application - Approved',
						value: 'account_application.approved',
					},
					{
						name: 'Application - Denied',
						value: 'account_application.denied',
					},
					{
						name: 'Application - Document Required',
						value: 'account_application.document_required',
					},
					// Person events
					{
						name: 'Person - Created',
						value: 'person.created',
					},
					{
						name: 'Person - Updated',
						value: 'person.updated',
					},
					{
						name: 'Person - KYC Status Changed',
						value: 'person.kyc_status_changed',
					},
					// Business events
					{
						name: 'Business - Created',
						value: 'business.created',
					},
					{
						name: 'Business - Updated',
						value: 'business.updated',
					},
					{
						name: 'Business - KYB Status Changed',
						value: 'business.kyb_status_changed',
					},
					// ACH events
					{
						name: 'ACH - Created',
						value: 'ach.created',
					},
					{
						name: 'ACH - Pending',
						value: 'ach.pending',
					},
					{
						name: 'ACH - Sent',
						value: 'ach.sent',
					},
					{
						name: 'ACH - Completed',
						value: 'ach.completed',
					},
					{
						name: 'ACH - Returned',
						value: 'ach.returned',
					},
					{
						name: 'ACH - Canceled',
						value: 'ach.canceled',
					},
					{
						name: 'ACH - NOC Received',
						value: 'ach.noc_received',
					},
					// Wire events
					{
						name: 'Wire - Created',
						value: 'wire.created',
					},
					{
						name: 'Wire - Pending',
						value: 'wire.pending',
					},
					{
						name: 'Wire - Sent',
						value: 'wire.sent',
					},
					{
						name: 'Wire - Completed',
						value: 'wire.completed',
					},
					{
						name: 'Wire - Returned',
						value: 'wire.returned',
					},
					{
						name: 'Wire - Canceled',
						value: 'wire.canceled',
					},
					// Book Transfer events
					{
						name: 'Book Transfer - Created',
						value: 'book.created',
					},
					{
						name: 'Book Transfer - Completed',
						value: 'book.completed',
					},
					{
						name: 'Book Transfer - Failed',
						value: 'book.failed',
					},
					// Check events
					{
						name: 'Check - Created',
						value: 'check.created',
					},
					{
						name: 'Check - Mailed',
						value: 'check.mailed',
					},
					{
						name: 'Check - In Transit',
						value: 'check.in_transit',
					},
					{
						name: 'Check - Delivered',
						value: 'check.delivered',
					},
					{
						name: 'Check - Cashed',
						value: 'check.cashed',
					},
					{
						name: 'Check - Voided',
						value: 'check.voided',
					},
					{
						name: 'Check - Stopped',
						value: 'check.stopped',
					},
					{
						name: 'Check - Returned',
						value: 'check.returned',
					},
					{
						name: 'Check Deposit - Created',
						value: 'check_deposit.created',
					},
					{
						name: 'Check Deposit - Pending',
						value: 'check_deposit.pending',
					},
					{
						name: 'Check Deposit - Cleared',
						value: 'check_deposit.cleared',
					},
					{
						name: 'Check Deposit - Returned',
						value: 'check_deposit.returned',
					},
					// Card events
					{
						name: 'Card - Created',
						value: 'card.created',
					},
					{
						name: 'Card - Activated',
						value: 'card.activated',
					},
					{
						name: 'Card - Locked',
						value: 'card.locked',
					},
					{
						name: 'Card - Unlocked',
						value: 'card.unlocked',
					},
					{
						name: 'Card - Replaced',
						value: 'card.replaced',
					},
					{
						name: 'Card - Closed',
						value: 'card.closed',
					},
					{
						name: 'Card - Transaction',
						value: 'card.transaction',
					},
					{
						name: 'Card - Transaction Declined',
						value: 'card.transaction_declined',
					},
					// Transaction events
					{
						name: 'Transaction - Created',
						value: 'transaction.created',
					},
					{
						name: 'Transaction - Pending',
						value: 'transaction.pending',
					},
					{
						name: 'Transaction - Posted',
						value: 'transaction.posted',
					},
					{
						name: 'Transaction - Returned',
						value: 'transaction.returned',
					},
					// Counterparty events
					{
						name: 'Counterparty - Created',
						value: 'counterparty.created',
					},
					{
						name: 'Counterparty - Verified',
						value: 'counterparty.verified',
					},
					{
						name: 'Counterparty - Verification Failed',
						value: 'counterparty.verification_failed',
					},
					// Compliance events
					{
						name: 'Compliance - Alert',
						value: 'compliance.alert',
					},
					{
						name: 'Compliance - Document Required',
						value: 'compliance.document_required',
					},
					{
						name: 'Compliance - Review Required',
						value: 'compliance.review_required',
					},
					// Document events
					{
						name: 'Document - Uploaded',
						value: 'document.uploaded',
					},
					{
						name: 'Document - Verified',
						value: 'document.verified',
					},
					{
						name: 'Document - Rejected',
						value: 'document.rejected',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature',
					},
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw request body in the output',
					},
					{
						displayName: 'Filter by Account ID',
						name: 'filterAccountId',
						type: 'string',
						default: '',
						description: 'Only trigger for events related to this account ID',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// In a real implementation, we would check if the webhook is registered
				// For now, we assume it exists if we're being called
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// In a real implementation, we would register the webhook with Treasury Prime
				// The webhook URL would be: this.getNodeWebhookUrl('default')
				const webhookUrl = this.getNodeWebhookUrl('default');
				this.logger.info(`Treasury Prime webhook URL: ${webhookUrl}`);
				this.logger.info(
					'Please register this webhook URL in your Treasury Prime dashboard',
				);
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// In a real implementation, we would unregister the webhook
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];
		const options = this.getNodeParameter('options') as IDataObject;

		// Log licensing notice
		this.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.',
		);

		// Verify signature if enabled
		if (options.verifySignature !== false) {
			const signature = req.headers['x-treasury-prime-signature'] as string;
			const timestamp = req.headers['x-treasury-prime-timestamp'] as string;

			if (signature) {
				const credentials = await this.getCredentials('treasuryPrimeApi');
				const webhookSecret = credentials.webhookSecret as string;

				if (webhookSecret) {
					const rawBody = JSON.stringify(body);
					let isValid: boolean;
					
					if (timestamp) {
						// Include timestamp in signature verification
						const signedPayload = `${timestamp}.${rawBody}`;
						isValid = verifyWebhookSignature(signedPayload, signature, webhookSecret);
					} else {
						isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
					}

					if (!isValid) {
						return {
							webhookResponse: {
								status: 401,
								body: { error: 'Invalid signature' },
							},
						};
					}
				}
			}
		}

		// Parse the webhook event
		const event = parseWebhookEvent(body);

		// Check if this event type is subscribed
		const eventType = event.type as string;
		const isSubscribed = events.includes('*') || events.includes(eventType);

		if (!isSubscribed) {
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, processed: false, reason: 'Event type not subscribed' },
				},
			};
		}

		// Filter by account ID if specified
		if (options.filterAccountId) {
			const eventData = event.data as IDataObject | undefined;
			const accountObj = eventData?.account as IDataObject | undefined;
			const accountId = eventData?.account_id || accountObj?.id;
			if (accountId && accountId !== options.filterAccountId) {
				return {
					webhookResponse: {
						status: 200,
						body: { received: true, processed: false, reason: 'Account ID filtered' },
					},
				};
			}
		}

		// Build output data
		const outputData: IDataObject = {
			event_type: eventType,
			event_id: event.id,
			created_at: event.created_at,
			data: event.data,
		};

		// Include raw body if requested
		if (options.includeRawBody) {
			outputData.rawBody = body;
		}

		// Include headers for debugging
		outputData.headers = {
			signature: req.headers['x-treasury-prime-signature'],
			timestamp: req.headers['x-treasury-prime-timestamp'],
		};

		return {
			workflowData: [this.helpers.returnJsonArray([outputData])],
		};
	}
}
