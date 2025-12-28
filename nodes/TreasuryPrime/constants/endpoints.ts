/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Treasury Prime API Endpoints
 *
 * Base URLs for different environments and API versions.
 */

export const TREASURY_PRIME_ENDPOINTS = {
  PRODUCTION: 'https://api.treasuryprime.com',
  SANDBOX: 'https://api.sandbox.treasuryprime.com',
  API_VERSION: 'v1',
} as const;

/**
 * API Resource Paths
 */
export const API_PATHS = {
  // Account Management
  ACCOUNTS: '/account',
  ACCOUNT_APPLICATIONS: '/account_application',

  // People & Businesses
  PERSONS: '/person',
  BUSINESSES: '/business',

  // Documents
  DOCUMENTS: '/document',

  // Transfers
  ACH: '/ach',
  WIRE: '/wire',
  BOOK: '/book',

  // Checks
  CHECKS: '/check',
  CHECK_DEPOSITS: '/check_deposit',

  // Cards
  CARDS: '/card',
  CARD_TRANSACTIONS: '/card_transaction',

  // Counterparties
  COUNTERPARTIES: '/counterparty',

  // Transactions
  TRANSACTIONS: '/transaction',

  // Payments
  PAYMENTS: '/payment',
  RECURRING_PAYMENTS: '/recurring_payment',
  BILL_PAYMENTS: '/bill_payment',
  BILLERS: '/biller',

  // Statements & Reporting
  STATEMENTS: '/statement',
  REPORTS: '/report',

  // Account Features
  HOLDS: '/hold',
  FEES: '/fee',
  INTEREST: '/interest',
  ALERTS: '/alert',

  // Webhooks
  WEBHOOKS: '/webhook',
  WEBHOOK_EVENTS: '/webhook_event',
  WEBHOOK_DELIVERIES: '/webhook_delivery',

  // Compliance
  COMPLIANCE: '/compliance',

  // Bank Info
  BANK: '/bank',

  // Sandbox
  SANDBOX: '/sandbox',

  // Utility
  ROUTING_NUMBERS: '/routing_number',
  API_STATUS: '/status',
} as const;

// Alias for backward compatibility - includes all paths for direct access
export const ENDPOINTS = {
  ...TREASURY_PRIME_ENDPOINTS,
  PATHS: API_PATHS,
  // Direct path aliases for convenience
  ACCOUNT: API_PATHS.ACCOUNTS,
  ACCOUNTS: API_PATHS.ACCOUNTS,
  ACCOUNT_APPLICATION: API_PATHS.ACCOUNT_APPLICATIONS,
  PERSON: API_PATHS.PERSONS,
  BUSINESS: API_PATHS.BUSINESSES,
  DOCUMENT: API_PATHS.DOCUMENTS,
  ACH: API_PATHS.ACH,
  WIRE: API_PATHS.WIRE,
  BOOK: API_PATHS.BOOK,
  CHECK: API_PATHS.CHECKS,
  CHECK_DEPOSIT: API_PATHS.CHECK_DEPOSITS,
  CARD: API_PATHS.CARDS,
  CARD_TRANSACTION: API_PATHS.CARD_TRANSACTIONS,
  COUNTERPARTY: API_PATHS.COUNTERPARTIES,
  TRANSACTION: API_PATHS.TRANSACTIONS,
  PAYMENT: API_PATHS.PAYMENTS,
  RECURRING_PAYMENT: API_PATHS.RECURRING_PAYMENTS,
  BILL_PAY: API_PATHS.BILL_PAYMENTS,
  BILL_PAYMENT: API_PATHS.BILL_PAYMENTS,
  BILLER: API_PATHS.BILLERS,
  STATEMENT: API_PATHS.STATEMENTS,
  REPORT: API_PATHS.REPORTS,
  HOLD: API_PATHS.HOLDS,
  FEE: API_PATHS.FEES,
  INTEREST: API_PATHS.INTEREST,
  ALERT: API_PATHS.ALERTS,
  WEBHOOK: API_PATHS.WEBHOOKS,
  WEBHOOK_EVENT: API_PATHS.WEBHOOK_EVENTS,
  WEBHOOK_DELIVERY: API_PATHS.WEBHOOK_DELIVERIES,
  COMPLIANCE: API_PATHS.COMPLIANCE,
  BANK: API_PATHS.BANK,
  SANDBOX: API_PATHS.SANDBOX,
  ROUTING_NUMBER: API_PATHS.ROUTING_NUMBERS,
  API_STATUS: API_PATHS.API_STATUS,
};

/**
 * Get the base URL for a given environment
 */
export function getBaseUrl(environment: string, customEndpoint?: string): string {
  switch (environment) {
    case 'production':
      return TREASURY_PRIME_ENDPOINTS.PRODUCTION;
    case 'sandbox':
      return TREASURY_PRIME_ENDPOINTS.SANDBOX;
    case 'custom':
      return customEndpoint || TREASURY_PRIME_ENDPOINTS.SANDBOX;
    default:
      return TREASURY_PRIME_ENDPOINTS.SANDBOX;
  }
}
