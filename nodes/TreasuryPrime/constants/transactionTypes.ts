/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Treasury Prime Transaction Types
 *
 * Different types of transactions in the Treasury Prime system.
 */

export const TRANSACTION_TYPES = {
  ACH_CREDIT: 'ach_credit',
  ACH_DEBIT: 'ach_debit',
  WIRE_CREDIT: 'wire_credit',
  WIRE_DEBIT: 'wire_debit',
  BOOK_CREDIT: 'book_credit',
  BOOK_DEBIT: 'book_debit',
  CHECK_CREDIT: 'check_credit',
  CHECK_DEBIT: 'check_debit',
  CARD_AUTHORIZATION: 'card_authorization',
  CARD_SETTLEMENT: 'card_settlement',
  CARD_REVERSAL: 'card_reversal',
  FEE: 'fee',
  INTEREST: 'interest',
  ADJUSTMENT: 'adjustment',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export const TRANSACTION_TYPE_OPTIONS = [
  { name: 'ACH Credit', value: TRANSACTION_TYPES.ACH_CREDIT },
  { name: 'ACH Debit', value: TRANSACTION_TYPES.ACH_DEBIT },
  { name: 'Wire Credit', value: TRANSACTION_TYPES.WIRE_CREDIT },
  { name: 'Wire Debit', value: TRANSACTION_TYPES.WIRE_DEBIT },
  { name: 'Book Credit', value: TRANSACTION_TYPES.BOOK_CREDIT },
  { name: 'Book Debit', value: TRANSACTION_TYPES.BOOK_DEBIT },
  { name: 'Check Credit', value: TRANSACTION_TYPES.CHECK_CREDIT },
  { name: 'Check Debit', value: TRANSACTION_TYPES.CHECK_DEBIT },
  { name: 'Card Authorization', value: TRANSACTION_TYPES.CARD_AUTHORIZATION },
  { name: 'Card Settlement', value: TRANSACTION_TYPES.CARD_SETTLEMENT },
  { name: 'Card Reversal', value: TRANSACTION_TYPES.CARD_REVERSAL },
  { name: 'Fee', value: TRANSACTION_TYPES.FEE },
  { name: 'Interest', value: TRANSACTION_TYPES.INTEREST },
  { name: 'Adjustment', value: TRANSACTION_TYPES.ADJUSTMENT },
  { name: 'Deposit', value: TRANSACTION_TYPES.DEPOSIT },
  { name: 'Withdrawal', value: TRANSACTION_TYPES.WITHDRAWAL },
] as const;

/**
 * Transaction Status Values
 */
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  POSTED: 'posted',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  FAILED: 'failed',
} as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[keyof typeof TRANSACTION_STATUSES];

export const TRANSACTION_STATUS_OPTIONS = [
  { name: 'Pending', value: TRANSACTION_STATUSES.PENDING },
  { name: 'Posted', value: TRANSACTION_STATUSES.POSTED },
  { name: 'Cancelled', value: TRANSACTION_STATUSES.CANCELLED },
  { name: 'Returned', value: TRANSACTION_STATUSES.RETURNED },
  { name: 'Failed', value: TRANSACTION_STATUSES.FAILED },
] as const;

/**
 * Transfer Status Values
 */
export const TRANSFER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SENT: 'sent',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  FAILED: 'failed',
} as const;

export type TransferStatus = (typeof TRANSFER_STATUSES)[keyof typeof TRANSFER_STATUSES];

export const TRANSFER_STATUS_OPTIONS = [
  { name: 'Pending', value: TRANSFER_STATUSES.PENDING },
  { name: 'Processing', value: TRANSFER_STATUSES.PROCESSING },
  { name: 'Sent', value: TRANSFER_STATUSES.SENT },
  { name: 'Completed', value: TRANSFER_STATUSES.COMPLETED },
  { name: 'Cancelled', value: TRANSFER_STATUSES.CANCELLED },
  { name: 'Returned', value: TRANSFER_STATUSES.RETURNED },
  { name: 'Failed', value: TRANSFER_STATUSES.FAILED },
] as const;

/**
 * Check Status Values
 */
export const CHECK_STATUSES = {
  PENDING: 'pending',
  MAILED: 'mailed',
  DELIVERED: 'delivered',
  CASHED: 'cashed',
  VOIDED: 'voided',
  STOPPED: 'stopped',
  RETURNED: 'returned',
  EXPIRED: 'expired',
} as const;

export type CheckStatus = (typeof CHECK_STATUSES)[keyof typeof CHECK_STATUSES];

export const CHECK_STATUS_OPTIONS = [
  { name: 'Pending', value: CHECK_STATUSES.PENDING },
  { name: 'Mailed', value: CHECK_STATUSES.MAILED },
  { name: 'Delivered', value: CHECK_STATUSES.DELIVERED },
  { name: 'Cashed', value: CHECK_STATUSES.CASHED },
  { name: 'Voided', value: CHECK_STATUSES.VOIDED },
  { name: 'Stopped', value: CHECK_STATUSES.STOPPED },
  { name: 'Returned', value: CHECK_STATUSES.RETURNED },
  { name: 'Expired', value: CHECK_STATUSES.EXPIRED },
] as const;

/**
 * Card Status Values
 */
export const CARD_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  LOCKED: 'locked',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
  EXPIRED: 'expired',
  REPLACED: 'replaced',
} as const;

export type CardStatus = (typeof CARD_STATUSES)[keyof typeof CARD_STATUSES];

export const CARD_STATUS_OPTIONS = [
  { name: 'Pending', value: CARD_STATUSES.PENDING },
  { name: 'Active', value: CARD_STATUSES.ACTIVE },
  { name: 'Locked', value: CARD_STATUSES.LOCKED },
  { name: 'Suspended', value: CARD_STATUSES.SUSPENDED },
  { name: 'Closed', value: CARD_STATUSES.CLOSED },
  { name: 'Expired', value: CARD_STATUSES.EXPIRED },
  { name: 'Replaced', value: CARD_STATUSES.REPLACED },
] as const;

/**
 * Card Types
 */
export const CARD_TYPES = {
  DEBIT: 'debit',
  PREPAID: 'prepaid',
  CREDIT: 'credit',
  VIRTUAL: 'virtual',
} as const;

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export const CARD_TYPE_OPTIONS = [
  { name: 'Debit', value: CARD_TYPES.DEBIT },
  { name: 'Prepaid', value: CARD_TYPES.PREPAID },
  { name: 'Credit', value: CARD_TYPES.CREDIT },
  { name: 'Virtual', value: CARD_TYPES.VIRTUAL },
] as const;

/**
 * Wire Types
 */
export const WIRE_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
} as const;

export type WireType = (typeof WIRE_TYPES)[keyof typeof WIRE_TYPES];

export const WIRE_TYPE_OPTIONS = [
  { name: 'Domestic', value: WIRE_TYPES.DOMESTIC },
  { name: 'International', value: WIRE_TYPES.INTERNATIONAL },
] as const;
