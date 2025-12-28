/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * ACH SEC (Standard Entry Class) Codes
 *
 * Standard Entry Class codes define the type of ACH transaction
 * and the authorization method used.
 */

export const ACH_SEC_CODES = {
  PPD: 'PPD',
  CCD: 'CCD',
  WEB: 'WEB',
  TEL: 'TEL',
  CTX: 'CTX',
  RCK: 'RCK',
  ARC: 'ARC',
  BOC: 'BOC',
  POP: 'POP',
  IAT: 'IAT',
} as const;

export type AchSecCode = (typeof ACH_SEC_CODES)[keyof typeof ACH_SEC_CODES];

export const ACH_SEC_CODE_OPTIONS = [
  {
    name: 'PPD - Prearranged Payment and Deposit',
    value: ACH_SEC_CODES.PPD,
    description: 'Consumer transactions with prior authorization',
  },
  {
    name: 'CCD - Corporate Credit or Debit',
    value: ACH_SEC_CODES.CCD,
    description: 'Business-to-business transactions',
  },
  {
    name: 'WEB - Internet-Initiated Entry',
    value: ACH_SEC_CODES.WEB,
    description: 'Consumer transactions authorized via internet',
  },
  {
    name: 'TEL - Telephone-Initiated Entry',
    value: ACH_SEC_CODES.TEL,
    description: 'Consumer transactions authorized via telephone',
  },
  {
    name: 'CTX - Corporate Trade Exchange',
    value: ACH_SEC_CODES.CTX,
    description: 'B2B transactions with addenda records',
  },
  {
    name: 'RCK - Re-presented Check Entry',
    value: ACH_SEC_CODES.RCK,
    description: 'Returned check converted to ACH',
  },
  {
    name: 'ARC - Accounts Receivable Entry',
    value: ACH_SEC_CODES.ARC,
    description: 'Check converted at lockbox or collection point',
  },
  {
    name: 'BOC - Back Office Conversion',
    value: ACH_SEC_CODES.BOC,
    description: 'Check converted at merchant back office',
  },
  {
    name: 'POP - Point-of-Purchase Entry',
    value: ACH_SEC_CODES.POP,
    description: 'Check converted at point of sale',
  },
  {
    name: 'IAT - International ACH Transaction',
    value: ACH_SEC_CODES.IAT,
    description: 'Cross-border ACH transactions',
  },
] as const;

/**
 * ACH Direction
 */
export const ACH_DIRECTIONS = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const;

export type AchDirection = (typeof ACH_DIRECTIONS)[keyof typeof ACH_DIRECTIONS];

export const ACH_DIRECTION_OPTIONS = [
  {
    name: 'Credit - Push funds to recipient',
    value: ACH_DIRECTIONS.CREDIT,
  },
  {
    name: 'Debit - Pull funds from sender',
    value: ACH_DIRECTIONS.DEBIT,
  },
] as const;

/**
 * ACH Return Codes
 *
 * Standard NACHA return reason codes for failed ACH transactions.
 */
export const ACH_RETURN_CODES: Record<string, { code: string; description: string; retryable: boolean }> = {
  R01: {
    code: 'R01',
    description: 'Insufficient Funds',
    retryable: true,
  },
  R02: {
    code: 'R02',
    description: 'Account Closed',
    retryable: false,
  },
  R03: {
    code: 'R03',
    description: 'No Account/Unable to Locate Account',
    retryable: false,
  },
  R04: {
    code: 'R04',
    description: 'Invalid Account Number',
    retryable: false,
  },
  R05: {
    code: 'R05',
    description: 'Unauthorized Debit to Consumer Account',
    retryable: false,
  },
  R06: {
    code: 'R06',
    description: 'Returned per ODFI Request',
    retryable: false,
  },
  R07: {
    code: 'R07',
    description: 'Authorization Revoked by Customer',
    retryable: false,
  },
  R08: {
    code: 'R08',
    description: 'Payment Stopped',
    retryable: false,
  },
  R09: {
    code: 'R09',
    description: 'Uncollected Funds',
    retryable: true,
  },
  R10: {
    code: 'R10',
    description: 'Customer Advises Not Authorized',
    retryable: false,
  },
  R11: {
    code: 'R11',
    description: 'Check Truncation Entry Returned',
    retryable: false,
  },
  R12: {
    code: 'R12',
    description: 'Branch Sold to Another DFI',
    retryable: false,
  },
  R13: {
    code: 'R13',
    description: 'Invalid ACH Routing Number',
    retryable: false,
  },
  R14: {
    code: 'R14',
    description: 'Representative Payee Deceased or Unable to Continue',
    retryable: false,
  },
  R15: {
    code: 'R15',
    description: 'Beneficiary or Account Holder Deceased',
    retryable: false,
  },
  R16: {
    code: 'R16',
    description: 'Account Frozen',
    retryable: false,
  },
  R17: {
    code: 'R17',
    description: 'File Record Edit Criteria',
    retryable: false,
  },
  R20: {
    code: 'R20',
    description: 'Non-Transaction Account',
    retryable: false,
  },
  R21: {
    code: 'R21',
    description: 'Invalid Company Identification',
    retryable: false,
  },
  R22: {
    code: 'R22',
    description: 'Invalid Individual ID Number',
    retryable: false,
  },
  R23: {
    code: 'R23',
    description: 'Credit Entry Refused by Receiver',
    retryable: false,
  },
  R24: {
    code: 'R24',
    description: 'Duplicate Entry',
    retryable: false,
  },
  R29: {
    code: 'R29',
    description: 'Corporate Customer Advises Not Authorized',
    retryable: false,
  },
  R31: {
    code: 'R31',
    description: 'Permissible Return Entry',
    retryable: false,
  },
  R33: {
    code: 'R33',
    description: 'Return of XCK Entry',
    retryable: false,
  },
};

export const ACH_RETURN_CODE_OPTIONS = Object.values(ACH_RETURN_CODES).map((code) => ({
  name: `${code.code} - ${code.description}`,
  value: code.code,
}));

/**
 * ACH Notification of Change (NOC) Codes
 */
export const ACH_NOC_CODES: Record<string, { code: string; description: string; field: string }> = {
  C01: {
    code: 'C01',
    description: 'Incorrect DFI Account Number',
    field: 'account_number',
  },
  C02: {
    code: 'C02',
    description: 'Incorrect Routing Number',
    field: 'routing_number',
  },
  C03: {
    code: 'C03',
    description: 'Incorrect Routing Number and DFI Account Number',
    field: 'routing_number,account_number',
  },
  C04: {
    code: 'C04',
    description: 'Incorrect Individual Name/Receiving Company Name',
    field: 'name',
  },
  C05: {
    code: 'C05',
    description: 'Incorrect Transaction Code',
    field: 'transaction_code',
  },
  C06: {
    code: 'C06',
    description: 'Incorrect DFI Account Number and Transaction Code',
    field: 'account_number,transaction_code',
  },
  C07: {
    code: 'C07',
    description: 'Incorrect Routing Number, DFI Account Number, and Transaction Code',
    field: 'routing_number,account_number,transaction_code',
  },
  C09: {
    code: 'C09',
    description: 'Incorrect Individual Identification Number',
    field: 'individual_id',
  },
  C13: {
    code: 'C13',
    description: 'Addenda Format Error',
    field: 'addenda',
  },
};

export const ACH_NOC_CODE_OPTIONS = Object.values(ACH_NOC_CODES).map((code) => ({
  name: `${code.code} - ${code.description}`,
  value: code.code,
}));

/**
 * ACH Processing Speed
 */
export const ACH_PROCESSING_SPEEDS = {
  STANDARD: 'standard',
  SAME_DAY: 'same_day',
  NEXT_DAY: 'next_day',
} as const;

export type AchProcessingSpeed = (typeof ACH_PROCESSING_SPEEDS)[keyof typeof ACH_PROCESSING_SPEEDS];

export const ACH_PROCESSING_SPEED_OPTIONS = [
  {
    name: 'Standard (2-3 business days)',
    value: ACH_PROCESSING_SPEEDS.STANDARD,
  },
  {
    name: 'Same Day ACH',
    value: ACH_PROCESSING_SPEEDS.SAME_DAY,
  },
  {
    name: 'Next Day',
    value: ACH_PROCESSING_SPEEDS.NEXT_DAY,
  },
] as const;

// Aliases for backward compatibility
export const SEC_CODES = ACH_SEC_CODES;
export const SEC_CODE_OPTIONS = ACH_SEC_CODE_OPTIONS;
export const NOC_CODES = ACH_NOC_CODES;
export const NOC_CODE_OPTIONS = ACH_NOC_CODE_OPTIONS;
export const RETURN_CODES = ACH_RETURN_CODES;
export const RETURN_CODE_OPTIONS = ACH_RETURN_CODE_OPTIONS;
