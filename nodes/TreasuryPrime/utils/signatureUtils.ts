/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * Webhook Signature Verification
 *
 * Treasury Prime uses HMAC-SHA256 signatures to verify webhook payloads.
 * The signature is sent in the X-Webhook-Signature header.
 */

/**
 * Compute HMAC-SHA256 signature for webhook payload
 */
export function computeWebhookSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  return hmac.digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = computeWebhookSignature(payload, secret);

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  } catch {
    return false;
  }
}

/**
 * Parse webhook signature header
 *
 * The signature header may contain multiple parts:
 * t=timestamp,v1=signature
 */
export function parseSignatureHeader(header: string): {
  timestamp?: string;
  signature?: string;
} {
  const parts = header.split(',');
  const result: { timestamp?: string; signature?: string } = {};

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') {
      result.timestamp = value;
    } else if (key === 'v1') {
      result.signature = value;
    }
  }

  return result;
}

/**
 * Verify webhook with timestamp tolerance
 *
 * Helps prevent replay attacks by checking the timestamp is within tolerance
 */
export function verifyWebhookWithTimestamp(
  payload: string,
  signatureHeader: string,
  secret: string,
  toleranceSeconds = 300, // 5 minutes default
): { valid: boolean; reason?: string } {
  const parsed = parseSignatureHeader(signatureHeader);

  if (!parsed.signature) {
    return { valid: false, reason: 'Missing signature in header' };
  }

  if (!parsed.timestamp) {
    return { valid: false, reason: 'Missing timestamp in header' };
  }

  // Check timestamp is within tolerance
  const webhookTime = parseInt(parsed.timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  const timeDiff = Math.abs(currentTime - webhookTime);

  if (timeDiff > toleranceSeconds) {
    return {
      valid: false,
      reason: `Webhook timestamp too old: ${timeDiff} seconds difference`,
    };
  }

  // Compute expected signature including timestamp
  const signedPayload = `${parsed.timestamp}.${payload}`;
  const isValid = verifyWebhookSignature(signedPayload, parsed.signature, secret);

  if (!isValid) {
    return { valid: false, reason: 'Invalid signature' };
  }

  return { valid: true };
}

/**
 * Generate idempotency key
 *
 * Used to ensure operations are only processed once
 */
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data for comparison
 */
export function hashSensitiveData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Aliases for backward compatibility
export const generateWebhookSignature = computeWebhookSignature;
export const createIdempotencyKey = generateIdempotencyKey;
