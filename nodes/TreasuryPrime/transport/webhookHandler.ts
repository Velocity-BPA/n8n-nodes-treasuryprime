/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IWebhookFunctions } from 'n8n-workflow';
import { verifyWebhookSignature, verifyWebhookWithTimestamp } from '../utils/signatureUtils';
import { EVENT_TYPES, EventType } from '../constants/eventTypes';

// Re-export for convenience
export { verifyWebhookSignature, verifyWebhookWithTimestamp };

/**
 * Treasury Prime Webhook Event Interface
 */
export interface ITreasuryPrimeWebhookEvent {
  id: string;
  type: EventType;
  created_at: string;
  data: IDataObject;
  bank_id: string;
  object_id?: string;
  object_type?: string;
}

/**
 * Webhook Verification Options
 */
export interface IWebhookVerificationOptions {
  secret: string;
  signature: string;
  payload: string;
  timestampTolerance?: number;
}

/**
 * Verify Treasury Prime webhook signature
 */
export function verifyTreasuryPrimeWebhook(
  options: IWebhookVerificationOptions,
): { valid: boolean; reason?: string } {
  const { secret, signature, payload, timestampTolerance = 300 } = options;

  if (!secret) {
    return { valid: false, reason: 'Webhook secret not configured' };
  }

  if (!signature) {
    return { valid: false, reason: 'No signature header provided' };
  }

  // Check if signature contains timestamp (newer format)
  if (signature.includes('t=') && signature.includes('v1=')) {
    return verifyWebhookWithTimestamp(payload, signature, secret, timestampTolerance);
  }

  // Simple signature verification (older format)
  const isValid = verifyWebhookSignature(payload, signature, secret);
  return isValid ? { valid: true } : { valid: false, reason: 'Invalid signature' };
}

/**
 * Parse webhook event from request body
 */
export function parseWebhookEvent(body: IDataObject): ITreasuryPrimeWebhookEvent {
  return {
    id: body.id as string,
    type: body.type as EventType,
    created_at: body.created_at as string,
    data: body.data as IDataObject,
    bank_id: body.bank_id as string,
    object_id: body.object_id as string | undefined,
    object_type: body.object_type as string | undefined,
  };
}

/**
 * Check if event type matches filter
 */
export function eventMatchesFilter(
  eventType: EventType,
  filterEvents: EventType[],
): boolean {
  if (filterEvents.length === 0) {
    return true; // No filter = accept all
  }
  return filterEvents.includes(eventType);
}

/**
 * Extract resource type from event type
 */
export function getResourceFromEventType(eventType: EventType): string {
  const parts = eventType.split('.');
  return parts[0] || 'unknown';
}

/**
 * Check if event is a test/ping event
 */
export function isTestEvent(eventType: EventType): boolean {
  return (
    eventType === EVENT_TYPES.WEBHOOK_PING ||
    eventType === EVENT_TYPES.WEBHOOK_TEST
  );
}

/**
 * Get human-readable event description
 */
export function getEventDescription(event: ITreasuryPrimeWebhookEvent): string {
  const resource = getResourceFromEventType(event.type);
  const action = event.type.split('.')[1] || 'unknown';

  return `${resource.charAt(0).toUpperCase() + resource.slice(1)} ${action.replace(/_/g, ' ')}`;
}

/**
 * Process incoming webhook request
 */
export async function processWebhookRequest(
  webhookFunctions: IWebhookFunctions,
  filterEvents: EventType[] = [],
): Promise<{
  workflowData: IDataObject[][] | null;
  webhookResponse?: IDataObject;
}> {
  const req = webhookFunctions.getRequestObject();
  const body = webhookFunctions.getBodyData() as IDataObject;

  // Get webhook secret from credentials
  const credentials = await webhookFunctions.getCredentials('treasuryPrimeApi');
  const webhookSecret = credentials?.webhookSecret as string | undefined;

  // Get signature from headers
  const signature =
    (req.headers['x-webhook-signature'] as string) ||
    (req.headers['x-tp-signature'] as string) ||
    '';

  // Verify signature if secret is configured
  if (webhookSecret) {
    const rawBody = JSON.stringify(body);
    const verification = verifyTreasuryPrimeWebhook({
      secret: webhookSecret,
      signature,
      payload: rawBody,
    });

    if (!verification.valid) {
      return {
        workflowData: null,
        webhookResponse: {
          status: 'error',
          message: verification.reason || 'Signature verification failed',
        },
      };
    }
  }

  // Parse the event
  const event = parseWebhookEvent(body);

  // Handle test/ping events
  if (isTestEvent(event.type)) {
    return {
      workflowData: null,
      webhookResponse: {
        status: 'ok',
        message: 'Webhook test received',
      },
    };
  }

  // Check if event matches filter
  if (!eventMatchesFilter(event.type, filterEvents)) {
    return {
      workflowData: null,
      webhookResponse: {
        status: 'ok',
        message: 'Event filtered',
      },
    };
  }

  // Return the event data for workflow processing
  return {
    workflowData: [
      [
        {
          json: {
            ...event,
            _description: getEventDescription(event),
            _receivedAt: new Date().toISOString(),
          },
        },
      ],
    ],
    webhookResponse: {
      status: 'ok',
      message: 'Event received',
      event_id: event.id,
    },
  };
}

/**
 * Format webhook response
 */
export function formatWebhookResponse(
  success: boolean,
  message: string,
  data?: IDataObject,
): IDataObject {
  return {
    status: success ? 'ok' : 'error',
    message,
    ...data,
  };
}
