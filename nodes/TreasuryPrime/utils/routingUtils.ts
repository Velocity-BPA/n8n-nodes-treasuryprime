/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Routing Number Utilities
 *
 * Utilities for working with ABA routing numbers used in ACH and wire transfers.
 */

/**
 * Validate ABA routing number using MICR checksum algorithm
 */
export function validateRoutingNumber(routingNumber: string): {
  valid: boolean;
  reason?: string;
} {
  // Remove any formatting
  const cleaned = routingNumber.replace(/[\s-]/g, '');

  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      reason: 'Routing number must be exactly 9 digits',
    };
  }

  // Validate checksum using MICR algorithm
  // Formula: 3*(d1+d4+d7) + 7*(d2+d5+d8) + 1*(d3+d6+d9) mod 10 = 0
  const digits = cleaned.split('').map(Number);
  const checksum =
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    1 * (digits[2] + digits[5] + digits[8]);

  if (checksum % 10 !== 0) {
    return {
      valid: false,
      reason: 'Invalid routing number checksum',
    };
  }

  return { valid: true };
}

/**
 * Get Federal Reserve district from routing number
 *
 * First two digits indicate the Federal Reserve district
 */
export function getFederalReserveDistrict(routingNumber: string): {
  district: number;
  name: string;
  city: string;
} | null {
  const cleaned = routingNumber.replace(/[\s-]/g, '');
  if (cleaned.length < 2) return null;

  const prefix = parseInt(cleaned.substring(0, 2), 10);

  const districts: Record<
    number,
    { district: number; name: string; city: string }
  > = {
    0: { district: 1, name: 'Boston', city: 'Boston, MA' },
    1: { district: 1, name: 'Boston', city: 'Boston, MA' },
    2: { district: 2, name: 'New York', city: 'New York, NY' },
    3: { district: 3, name: 'Philadelphia', city: 'Philadelphia, PA' },
    4: { district: 4, name: 'Cleveland', city: 'Cleveland, OH' },
    5: { district: 5, name: 'Richmond', city: 'Richmond, VA' },
    6: { district: 6, name: 'Atlanta', city: 'Atlanta, GA' },
    7: { district: 7, name: 'Chicago', city: 'Chicago, IL' },
    8: { district: 8, name: 'St. Louis', city: 'St. Louis, MO' },
    9: { district: 9, name: 'Minneapolis', city: 'Minneapolis, MN' },
    10: { district: 10, name: 'Kansas City', city: 'Kansas City, MO' },
    11: { district: 11, name: 'Dallas', city: 'Dallas, TX' },
    12: { district: 12, name: 'San Francisco', city: 'San Francisco, CA' },
  };

  // First digit determines base district
  const firstDigit = parseInt(cleaned[0], 10);

  // Handle Thrift institutions (21-32) and Electronic transactions (61-72)
  if (prefix >= 21 && prefix <= 32) {
    return districts[prefix - 20] || null;
  } else if (prefix >= 61 && prefix <= 72) {
    return districts[prefix - 60] || null;
  } else if (prefix >= 80) {
    // Traveler's checks and other special uses
    return null;
  }

  return districts[firstDigit] || null;
}

/**
 * Determine if routing number is for ACH-eligible institution
 */
export function isAchEligible(routingNumber: string): boolean {
  const cleaned = routingNumber.replace(/[\s-]/g, '');
  if (cleaned.length !== 9) return false;

  const prefix = parseInt(cleaned.substring(0, 2), 10);

  // ACH-eligible prefixes: 01-12 (Federal Reserve), 21-32 (Thrift), 61-72 (Electronic)
  return (
    (prefix >= 1 && prefix <= 12) ||
    (prefix >= 21 && prefix <= 32) ||
    (prefix >= 61 && prefix <= 72)
  );
}

/**
 * Determine if routing number is for wire-eligible institution
 */
export function isWireEligible(routingNumber: string): boolean {
  // Most routing numbers that pass validation are wire-eligible
  // Specific exclusions would need to be verified with the actual institution
  const validation = validateRoutingNumber(routingNumber);
  return validation.valid;
}

/**
 * Format routing number for display (XXX-XXX-XXX)
 */
export function formatRoutingNumber(routingNumber: string): string {
  const cleaned = routingNumber.replace(/[\s-]/g, '');
  if (cleaned.length !== 9) {
    return routingNumber;
  }
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

/**
 * Parse routing number from various formats
 */
export function parseRoutingNumber(input: string): string {
  return input.replace(/[\s-]/g, '');
}

/**
 * Common test routing numbers for sandbox environments
 */
export const TEST_ROUTING_NUMBERS = {
  // Standard test routing numbers
  TEST_BANK_1: '021000021', // JPMorgan Chase (commonly used for testing)
  TEST_BANK_2: '011401533', // Bank of America
  TEST_BANK_3: '091000019', // Wells Fargo

  // Treasury Prime sandbox routing numbers
  TP_SANDBOX_1: '999999999', // Example sandbox routing
  TP_SANDBOX_2: '000000000', // Another example

  // ACH test routing numbers
  ACH_TEST_1: '011000015', // Federal Reserve Bank
  ACH_TEST_2: '011000028', // Federal Reserve Bank
} as const;

/**
 * Validate account number basic format
 */
export function validateAccountNumber(accountNumber: string): {
  valid: boolean;
  reason?: string;
} {
  // Remove any formatting
  const cleaned = accountNumber.replace(/[\s-]/g, '');

  // Account numbers are typically 4-17 digits
  if (!/^\d{4,17}$/.test(cleaned)) {
    return {
      valid: false,
      reason: 'Account number must be 4-17 digits',
    };
  }

  return { valid: true };
}

/**
 * Mask account number for display
 */
export function maskAccountNumber(accountNumber: string, visibleDigits = 4): string {
  const cleaned = accountNumber.replace(/[\s-]/g, '');
  if (cleaned.length <= visibleDigits) {
    return '*'.repeat(cleaned.length);
  }
  return '*'.repeat(cleaned.length - visibleDigits) + cleaned.slice(-visibleDigits);
}

/**
 * Generate account number display string (masked with last 4)
 */
export function formatAccountDisplay(
  routingNumber: string,
  accountNumber: string,
): string {
  const maskedAccount = maskAccountNumber(accountNumber);
  const formattedRouting = formatRoutingNumber(routingNumber);
  return `Routing: ${formattedRouting} | Account: ${maskedAccount}`;
}

/**
 * Get comprehensive routing number information
 * Alias function that combines validation and district lookup
 */
export function getRoutingNumberInfo(routingNumber: string): {
  valid: boolean;
  routingNumber: string;
  formatted: string;
  district: { district: number; name: string; city: string } | null;
  achEligible: boolean;
  wireEligible: boolean;
  reason?: string;
} {
  const validation = validateRoutingNumber(routingNumber);
  const cleaned = parseRoutingNumber(routingNumber);

  return {
    valid: validation.valid,
    routingNumber: cleaned,
    formatted: formatRoutingNumber(routingNumber),
    district: getFederalReserveDistrict(routingNumber),
    achEligible: isAchEligible(routingNumber),
    wireEligible: isWireEligible(routingNumber),
    reason: validation.reason,
  };
}

// Alias for backward compatibility
export const validateABARoutingNumber = validateRoutingNumber;
