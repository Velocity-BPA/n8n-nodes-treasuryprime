/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NodeApiError, NodeOperationError, IExecuteFunctions } from 'n8n-workflow';

/**
 * Validate routing number format (9 digits)
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }

  // Validate checksum using MICR algorithm
  const digits = routingNumber.split('').map(Number);
  const checksum =
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    1 * (digits[2] + digits[5] + digits[8]);

  return checksum % 10 === 0;
}

/**
 * Validate account number format
 */
export function validateAccountNumber(accountNumber: string): boolean {
  // Account numbers are typically 4-17 digits
  return /^\d{4,17}$/.test(accountNumber);
}

/**
 * Validate amount (positive number with max 2 decimal places)
 */
export function validateAmount(amount: number): boolean {
  if (amount <= 0) {
    return false;
  }
  // Check for max 2 decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (E.164 format)
 */
export function validatePhoneNumber(phone: string): boolean {
  // E.164 format: +[country code][number], max 15 digits
  return /^\+[1-9]\d{1,14}$/.test(phone);
}

/**
 * Validate SSN format (XXX-XX-XXXX or XXXXXXXXX)
 */
export function validateSSN(ssn: string): boolean {
  return /^(\d{3}-\d{2}-\d{4}|\d{9})$/.test(ssn);
}

/**
 * Validate EIN format (XX-XXXXXXX or XXXXXXXXX)
 */
export function validateEIN(ein: string): boolean {
  return /^(\d{2}-\d{7}|\d{9})$/.test(ein);
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate Treasury Prime ID format (starts with resource type prefix)
 */
export function validateTreasuryPrimeId(id: string, expectedPrefix?: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Treasury Prime IDs follow pattern: prefix_uuid
  const parts = id.split('_');
  if (parts.length < 2) {
    return false;
  }

  if (expectedPrefix && parts[0] !== expectedPrefix) {
    return false;
  }

  return true;
}

/**
 * Common ID prefixes for Treasury Prime resources
 */
export const ID_PREFIXES = {
  ACCOUNT: 'acct',
  ACCOUNT_APPLICATION: 'acct_app',
  PERSON: 'psn',
  BUSINESS: 'bus',
  DOCUMENT: 'doc',
  ACH: 'ach',
  WIRE: 'wire',
  BOOK: 'book',
  CHECK: 'chk',
  CHECK_DEPOSIT: 'chk_dep',
  CARD: 'card',
  COUNTERPARTY: 'cp',
  TRANSACTION: 'txn',
  PAYMENT: 'pmt',
  RECURRING_PAYMENT: 'rec_pmt',
  BILL_PAYMENT: 'bill_pmt',
  STATEMENT: 'stmt',
  HOLD: 'hold',
  FEE: 'fee',
  ALERT: 'alert',
  WEBHOOK: 'wh',
} as const;

/**
 * Validate required fields
 */
export function validateRequiredFields(
  context: IExecuteFunctions,
  fields: Record<string, unknown>,
  requiredFields: string[],
): void {
  for (const field of requiredFields) {
    const value = fields[field];
    if (value === undefined || value === null || value === '') {
      throw new NodeOperationError(context.getNode(), `Missing required field: ${field}`);
    }
  }
}

/**
 * Validate and format amount to cents
 */
export function toCents(amount: number): number {
  if (!validateAmount(amount)) {
    throw new Error(`Invalid amount: ${amount}. Must be a positive number with max 2 decimal places.`);
  }
  return Math.round(amount * 100);
}

/**
 * Convert cents to dollars
 */
export function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Sanitize string for API (trim whitespace, remove control characters)
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  // eslint-disable-next-line no-control-regex
  return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Format SSN for display (XXX-XX-XXXX)
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    throw new Error('Invalid SSN format');
  }
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
}

/**
 * Format EIN for display (XX-XXXXXXX)
 */
export function formatEIN(ein: string): string {
  const cleaned = ein.replace(/\D/g, '');
  if (cleaned.length !== 9) {
    throw new Error('Invalid EIN format');
  }
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (!data || data.length <= visibleChars) {
    return '****';
  }
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
}

/**
 * Validate and throw appropriate errors for API responses
 */
export function handleApiError(
  context: IExecuteFunctions,
  error: unknown,
  operation: string,
): never {
  if (error instanceof NodeApiError || error instanceof NodeOperationError) {
    throw error;
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  throw new NodeApiError(context.getNode(), {
    message: `Treasury Prime API error during ${operation}: ${errorMessage}`,
    description: errorMessage,
  });
}
