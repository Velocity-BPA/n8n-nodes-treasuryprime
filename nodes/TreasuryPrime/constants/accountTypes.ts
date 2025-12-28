/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Treasury Prime Account Types
 *
 * Different types of bank accounts supported by Treasury Prime.
 */

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  MONEY_MARKET: 'money_market',
  CD: 'cd',
} as const;

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];

export const ACCOUNT_TYPE_OPTIONS = [
  { name: 'Checking', value: ACCOUNT_TYPES.CHECKING },
  { name: 'Savings', value: ACCOUNT_TYPES.SAVINGS },
  { name: 'Money Market', value: ACCOUNT_TYPES.MONEY_MARKET },
  { name: 'Certificate of Deposit (CD)', value: ACCOUNT_TYPES.CD },
] as const;

/**
 * Account Status Values
 */
export const ACCOUNT_STATUSES = {
  PENDING: 'pending',
  OPEN: 'open',
  FROZEN: 'frozen',
  CLOSED: 'closed',
  RESTRICTED: 'restricted',
} as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[keyof typeof ACCOUNT_STATUSES];

export const ACCOUNT_STATUS_OPTIONS = [
  { name: 'Pending', value: ACCOUNT_STATUSES.PENDING },
  { name: 'Open', value: ACCOUNT_STATUSES.OPEN },
  { name: 'Frozen', value: ACCOUNT_STATUSES.FROZEN },
  { name: 'Closed', value: ACCOUNT_STATUSES.CLOSED },
  { name: 'Restricted', value: ACCOUNT_STATUSES.RESTRICTED },
] as const;

/**
 * Account Application Status Values
 */
export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  DENIED: 'denied',
  CANCELLED: 'cancelled',
  INCOMPLETE: 'incomplete',
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES];

export const APPLICATION_STATUS_OPTIONS = [
  { name: 'Pending', value: APPLICATION_STATUSES.PENDING },
  { name: 'Submitted', value: APPLICATION_STATUSES.SUBMITTED },
  { name: 'In Review', value: APPLICATION_STATUSES.IN_REVIEW },
  { name: 'Approved', value: APPLICATION_STATUSES.APPROVED },
  { name: 'Denied', value: APPLICATION_STATUSES.DENIED },
  { name: 'Cancelled', value: APPLICATION_STATUSES.CANCELLED },
  { name: 'Incomplete', value: APPLICATION_STATUSES.INCOMPLETE },
] as const;

/**
 * Document Types
 */
export const DOCUMENT_TYPES = {
  DRIVERS_LICENSE: 'drivers_license',
  PASSPORT: 'passport',
  STATE_ID: 'state_id',
  SSN_CARD: 'ssn_card',
  UTILITY_BILL: 'utility_bill',
  BANK_STATEMENT: 'bank_statement',
  TAX_RETURN: 'tax_return',
  ARTICLES_OF_INCORPORATION: 'articles_of_incorporation',
  EIN_LETTER: 'ein_letter',
  OPERATING_AGREEMENT: 'operating_agreement',
  OTHER: 'other',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_OPTIONS = [
  { name: "Driver's License", value: DOCUMENT_TYPES.DRIVERS_LICENSE },
  { name: 'Passport', value: DOCUMENT_TYPES.PASSPORT },
  { name: 'State ID', value: DOCUMENT_TYPES.STATE_ID },
  { name: 'SSN Card', value: DOCUMENT_TYPES.SSN_CARD },
  { name: 'Utility Bill', value: DOCUMENT_TYPES.UTILITY_BILL },
  { name: 'Bank Statement', value: DOCUMENT_TYPES.BANK_STATEMENT },
  { name: 'Tax Return', value: DOCUMENT_TYPES.TAX_RETURN },
  { name: 'Articles of Incorporation', value: DOCUMENT_TYPES.ARTICLES_OF_INCORPORATION },
  { name: 'EIN Letter', value: DOCUMENT_TYPES.EIN_LETTER },
  { name: 'Operating Agreement', value: DOCUMENT_TYPES.OPERATING_AGREEMENT },
  { name: 'Other', value: DOCUMENT_TYPES.OTHER },
] as const;

/**
 * Person Roles
 */
export const PERSON_ROLES = {
  OWNER: 'owner',
  OFFICER: 'officer',
  DIRECTOR: 'director',
  AUTHORIZED_SIGNER: 'authorized_signer',
  BENEFICIAL_OWNER: 'beneficial_owner',
} as const;

export type PersonRole = (typeof PERSON_ROLES)[keyof typeof PERSON_ROLES];

export const PERSON_ROLE_OPTIONS = [
  { name: 'Owner', value: PERSON_ROLES.OWNER },
  { name: 'Officer', value: PERSON_ROLES.OFFICER },
  { name: 'Director', value: PERSON_ROLES.DIRECTOR },
  { name: 'Authorized Signer', value: PERSON_ROLES.AUTHORIZED_SIGNER },
  { name: 'Beneficial Owner', value: PERSON_ROLES.BENEFICIAL_OWNER },
] as const;

/**
 * Business Types
 */
export const BUSINESS_TYPES = {
  SOLE_PROPRIETORSHIP: 'sole_proprietorship',
  PARTNERSHIP: 'partnership',
  LLC: 'llc',
  CORPORATION: 'corporation',
  S_CORPORATION: 's_corporation',
  C_CORPORATION: 'c_corporation',
  NON_PROFIT: 'non_profit',
  TRUST: 'trust',
} as const;

export type BusinessType = (typeof BUSINESS_TYPES)[keyof typeof BUSINESS_TYPES];

export const BUSINESS_TYPE_OPTIONS = [
  { name: 'Sole Proprietorship', value: BUSINESS_TYPES.SOLE_PROPRIETORSHIP },
  { name: 'Partnership', value: BUSINESS_TYPES.PARTNERSHIP },
  { name: 'LLC', value: BUSINESS_TYPES.LLC },
  { name: 'Corporation', value: BUSINESS_TYPES.CORPORATION },
  { name: 'S Corporation', value: BUSINESS_TYPES.S_CORPORATION },
  { name: 'C Corporation', value: BUSINESS_TYPES.C_CORPORATION },
  { name: 'Non-Profit', value: BUSINESS_TYPES.NON_PROFIT },
  { name: 'Trust', value: BUSINESS_TYPES.TRUST },
] as const;
