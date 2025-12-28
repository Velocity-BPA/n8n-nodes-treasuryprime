/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Treasury Prime Webhook Event Types
 *
 * All event types that can be received via Treasury Prime webhooks.
 */

export const EVENT_TYPES = {
  // Account Events
  ACCOUNT_CREATED: 'account.created',
  ACCOUNT_UPDATED: 'account.updated',
  ACCOUNT_CLOSED: 'account.closed',
  ACCOUNT_FROZEN: 'account.frozen',
  ACCOUNT_UNFROZEN: 'account.unfrozen',
  BALANCE_CHANGED: 'account.balance_changed',
  ACCOUNT_STATUS_CHANGED: 'account.status_changed',

  // Account Application Events
  APPLICATION_CREATED: 'account_application.created',
  APPLICATION_SUBMITTED: 'account_application.submitted',
  APPLICATION_APPROVED: 'account_application.approved',
  APPLICATION_DENIED: 'account_application.denied',
  APPLICATION_CANCELLED: 'account_application.cancelled',
  DOCUMENT_REQUIRED: 'account_application.document_required',

  // Person Events
  PERSON_CREATED: 'person.created',
  PERSON_UPDATED: 'person.updated',
  PERSON_ARCHIVED: 'person.archived',
  PERSON_KYC_APPROVED: 'person.kyc_approved',
  PERSON_KYC_DENIED: 'person.kyc_denied',
  PERSON_KYC_PENDING: 'person.kyc_pending',

  // Business Events
  BUSINESS_CREATED: 'business.created',
  BUSINESS_UPDATED: 'business.updated',
  BUSINESS_ARCHIVED: 'business.archived',
  BUSINESS_KYB_APPROVED: 'business.kyb_approved',
  BUSINESS_KYB_DENIED: 'business.kyb_denied',
  BUSINESS_KYB_PENDING: 'business.kyb_pending',

  // Document Events
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_VERIFIED: 'document.verified',
  DOCUMENT_REJECTED: 'document.rejected',
  DOCUMENT_EXPIRED: 'document.expired',

  // ACH Events
  ACH_INITIATED: 'ach.initiated',
  ACH_PENDING: 'ach.pending',
  ACH_PROCESSING: 'ach.processing',
  ACH_SENT: 'ach.sent',
  ACH_COMPLETED: 'ach.completed',
  ACH_RETURNED: 'ach.returned',
  ACH_CANCELLED: 'ach.cancelled',
  ACH_FAILED: 'ach.failed',
  ACH_NOC_RECEIVED: 'ach.noc_received',

  // Wire Events
  WIRE_INITIATED: 'wire.initiated',
  WIRE_PENDING: 'wire.pending',
  WIRE_PROCESSING: 'wire.processing',
  WIRE_SENT: 'wire.sent',
  WIRE_COMPLETED: 'wire.completed',
  WIRE_RETURNED: 'wire.returned',
  WIRE_CANCELLED: 'wire.cancelled',
  WIRE_FAILED: 'wire.failed',

  // Book Transfer Events
  BOOK_CREATED: 'book.created',
  BOOK_COMPLETED: 'book.completed',
  BOOK_FAILED: 'book.failed',

  // Check Events
  CHECK_CREATED: 'check.created',
  CHECK_MAILED: 'check.mailed',
  CHECK_DELIVERED: 'check.delivered',
  CHECK_CASHED: 'check.cashed',
  CHECK_VOIDED: 'check.voided',
  CHECK_STOPPED: 'check.stopped',
  CHECK_RETURNED: 'check.returned',
  CHECK_EXPIRED: 'check.expired',

  // Check Deposit Events
  CHECK_DEPOSIT_RECEIVED: 'check_deposit.received',
  CHECK_DEPOSIT_PENDING: 'check_deposit.pending',
  CHECK_DEPOSIT_CLEARED: 'check_deposit.cleared',
  CHECK_DEPOSIT_RETURNED: 'check_deposit.returned',

  // Card Events
  CARD_CREATED: 'card.created',
  CARD_ACTIVATED: 'card.activated',
  CARD_LOCKED: 'card.locked',
  CARD_UNLOCKED: 'card.unlocked',
  CARD_SUSPENDED: 'card.suspended',
  CARD_REPLACED: 'card.replaced',
  CARD_CLOSED: 'card.closed',
  CARD_EXPIRED: 'card.expired',

  // Card Transaction Events
  CARD_AUTHORIZATION: 'card_transaction.authorization',
  CARD_SETTLEMENT: 'card_transaction.settlement',
  CARD_REVERSAL: 'card_transaction.reversal',
  CARD_REFUND: 'card_transaction.refund',
  CARD_DECLINED: 'card_transaction.declined',

  // Transaction Events
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_PENDING: 'transaction.pending',
  TRANSACTION_POSTED: 'transaction.posted',
  TRANSACTION_RETURNED: 'transaction.returned',

  // Payment Events
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_SCHEDULED: 'payment.scheduled',
  PAYMENT_PROCESSING: 'payment.processing',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_CANCELLED: 'payment.cancelled',
  PAYMENT_FAILED: 'payment.failed',

  // Bill Pay Events
  BILL_PAYMENT_CREATED: 'bill_payment.created',
  BILL_PAYMENT_SCHEDULED: 'bill_payment.scheduled',
  BILL_PAYMENT_SENT: 'bill_payment.sent',
  BILL_PAYMENT_COMPLETED: 'bill_payment.completed',
  BILL_PAYMENT_CANCELLED: 'bill_payment.cancelled',
  BILL_PAYMENT_FAILED: 'bill_payment.failed',

  // Hold Events
  HOLD_CREATED: 'hold.created',
  HOLD_RELEASED: 'hold.released',
  HOLD_EXPIRED: 'hold.expired',

  // Fee Events
  FEE_CREATED: 'fee.created',
  FEE_CHARGED: 'fee.charged',
  FEE_WAIVED: 'fee.waived',
  FEE_REFUNDED: 'fee.refunded',

  // Interest Events
  INTEREST_ACCRUED: 'interest.accrued',
  INTEREST_PAID: 'interest.paid',
  INTEREST_RATE_CHANGED: 'interest.rate_changed',

  // Statement Events
  STATEMENT_GENERATED: 'statement.generated',
  STATEMENT_AVAILABLE: 'statement.available',

  // Compliance Events
  COMPLIANCE_ALERT: 'compliance.alert',
  COMPLIANCE_DOCUMENT_REQUIRED: 'compliance.document_required',
  COMPLIANCE_REVIEW_REQUIRED: 'compliance.review_required',
  SAR_FILED: 'compliance.sar_filed',
  CTR_FILED: 'compliance.ctr_filed',

  // Counterparty Events
  COUNTERPARTY_CREATED: 'counterparty.created',
  COUNTERPARTY_UPDATED: 'counterparty.updated',
  COUNTERPARTY_VERIFIED: 'counterparty.verified',
  COUNTERPARTY_DELETED: 'counterparty.deleted',

  // Webhook Events
  WEBHOOK_PING: 'webhook.ping',
  WEBHOOK_TEST: 'webhook.test',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

/**
 * Event Type Categories
 */
export const EVENT_CATEGORIES = {
  ACCOUNT: [
    EVENT_TYPES.ACCOUNT_CREATED,
    EVENT_TYPES.ACCOUNT_UPDATED,
    EVENT_TYPES.ACCOUNT_CLOSED,
    EVENT_TYPES.ACCOUNT_FROZEN,
    EVENT_TYPES.ACCOUNT_UNFROZEN,
    EVENT_TYPES.BALANCE_CHANGED,
    EVENT_TYPES.ACCOUNT_STATUS_CHANGED,
  ],
  APPLICATION: [
    EVENT_TYPES.APPLICATION_CREATED,
    EVENT_TYPES.APPLICATION_SUBMITTED,
    EVENT_TYPES.APPLICATION_APPROVED,
    EVENT_TYPES.APPLICATION_DENIED,
    EVENT_TYPES.APPLICATION_CANCELLED,
    EVENT_TYPES.DOCUMENT_REQUIRED,
  ],
  PERSON: [
    EVENT_TYPES.PERSON_CREATED,
    EVENT_TYPES.PERSON_UPDATED,
    EVENT_TYPES.PERSON_ARCHIVED,
    EVENT_TYPES.PERSON_KYC_APPROVED,
    EVENT_TYPES.PERSON_KYC_DENIED,
    EVENT_TYPES.PERSON_KYC_PENDING,
  ],
  BUSINESS: [
    EVENT_TYPES.BUSINESS_CREATED,
    EVENT_TYPES.BUSINESS_UPDATED,
    EVENT_TYPES.BUSINESS_ARCHIVED,
    EVENT_TYPES.BUSINESS_KYB_APPROVED,
    EVENT_TYPES.BUSINESS_KYB_DENIED,
    EVENT_TYPES.BUSINESS_KYB_PENDING,
  ],
  ACH: [
    EVENT_TYPES.ACH_INITIATED,
    EVENT_TYPES.ACH_PENDING,
    EVENT_TYPES.ACH_PROCESSING,
    EVENT_TYPES.ACH_SENT,
    EVENT_TYPES.ACH_COMPLETED,
    EVENT_TYPES.ACH_RETURNED,
    EVENT_TYPES.ACH_CANCELLED,
    EVENT_TYPES.ACH_FAILED,
    EVENT_TYPES.ACH_NOC_RECEIVED,
  ],
  WIRE: [
    EVENT_TYPES.WIRE_INITIATED,
    EVENT_TYPES.WIRE_PENDING,
    EVENT_TYPES.WIRE_PROCESSING,
    EVENT_TYPES.WIRE_SENT,
    EVENT_TYPES.WIRE_COMPLETED,
    EVENT_TYPES.WIRE_RETURNED,
    EVENT_TYPES.WIRE_CANCELLED,
    EVENT_TYPES.WIRE_FAILED,
  ],
  BOOK: [EVENT_TYPES.BOOK_CREATED, EVENT_TYPES.BOOK_COMPLETED, EVENT_TYPES.BOOK_FAILED],
  CHECK: [
    EVENT_TYPES.CHECK_CREATED,
    EVENT_TYPES.CHECK_MAILED,
    EVENT_TYPES.CHECK_DELIVERED,
    EVENT_TYPES.CHECK_CASHED,
    EVENT_TYPES.CHECK_VOIDED,
    EVENT_TYPES.CHECK_STOPPED,
    EVENT_TYPES.CHECK_RETURNED,
    EVENT_TYPES.CHECK_EXPIRED,
    EVENT_TYPES.CHECK_DEPOSIT_RECEIVED,
    EVENT_TYPES.CHECK_DEPOSIT_PENDING,
    EVENT_TYPES.CHECK_DEPOSIT_CLEARED,
    EVENT_TYPES.CHECK_DEPOSIT_RETURNED,
  ],
  CARD: [
    EVENT_TYPES.CARD_CREATED,
    EVENT_TYPES.CARD_ACTIVATED,
    EVENT_TYPES.CARD_LOCKED,
    EVENT_TYPES.CARD_UNLOCKED,
    EVENT_TYPES.CARD_SUSPENDED,
    EVENT_TYPES.CARD_REPLACED,
    EVENT_TYPES.CARD_CLOSED,
    EVENT_TYPES.CARD_EXPIRED,
    EVENT_TYPES.CARD_AUTHORIZATION,
    EVENT_TYPES.CARD_SETTLEMENT,
    EVENT_TYPES.CARD_REVERSAL,
    EVENT_TYPES.CARD_REFUND,
    EVENT_TYPES.CARD_DECLINED,
  ],
  TRANSACTION: [
    EVENT_TYPES.TRANSACTION_CREATED,
    EVENT_TYPES.TRANSACTION_PENDING,
    EVENT_TYPES.TRANSACTION_POSTED,
    EVENT_TYPES.TRANSACTION_RETURNED,
  ],
  COMPLIANCE: [
    EVENT_TYPES.COMPLIANCE_ALERT,
    EVENT_TYPES.COMPLIANCE_DOCUMENT_REQUIRED,
    EVENT_TYPES.COMPLIANCE_REVIEW_REQUIRED,
    EVENT_TYPES.SAR_FILED,
    EVENT_TYPES.CTR_FILED,
  ],
} as const;

/**
 * Get display options for all event types
 */
export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPES).map(([key, value]) => ({
  name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  value,
}));
