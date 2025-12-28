/**
 * Unit tests for Treasury Prime validation utilities
 *
 * @copyright 2025 Velocity BPA
 * @license BSL-1.1
 */

import {
  validateRoutingNumber,
  validateAccountNumber,
  validateEmail,
  validatePhoneNumber,
  validateSSN,
  validateEIN,
  validateDateFormat,
  validateUUID,
} from '../../nodes/TreasuryPrime/utils/validationUtils';

describe('Validation Utils', () => {
  describe('validateRoutingNumber', () => {
    it('should validate a correct 9-digit routing number', () => {
      // Bank of America routing number (passes checksum)
      expect(validateRoutingNumber('026009593')).toBe(true);
    });

    it('should reject routing numbers with wrong length', () => {
      expect(validateRoutingNumber('12345678')).toBe(false); // 8 digits
      expect(validateRoutingNumber('1234567890')).toBe(false); // 10 digits
    });

    it('should reject routing numbers with non-digits', () => {
      expect(validateRoutingNumber('12345678a')).toBe(false);
      expect(validateRoutingNumber('12-345-67')).toBe(false);
    });

    it('should reject routing numbers with invalid checksum', () => {
      expect(validateRoutingNumber('123456789')).toBe(false);
    });
  });

  describe('validateAccountNumber', () => {
    it('should validate account numbers with proper length', () => {
      expect(validateAccountNumber('12345678')).toBe(true);
      expect(validateAccountNumber('123456789012345678')).toBe(true);
    });

    it('should reject account numbers that are too short', () => {
      expect(validateAccountNumber('1234')).toBe(false);
    });

    it('should reject account numbers that are too long', () => {
      expect(validateAccountNumber('12345678901234567890')).toBe(false);
    });

    it('should reject account numbers with non-digits', () => {
      expect(validateAccountNumber('1234567a')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@example.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user.example.com')).toBe(false);
      expect(validateEmail('user@example')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct US phone numbers', () => {
      expect(validatePhoneNumber('+12025551234')).toBe(true);
      expect(validatePhoneNumber('2025551234')).toBe(true);
      expect(validatePhoneNumber('(202) 555-1234')).toBe(true);
      expect(validatePhoneNumber('202-555-1234')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abcdefghij')).toBe(false);
    });
  });

  describe('validateSSN', () => {
    it('should validate correct SSN formats', () => {
      expect(validateSSN('123-45-6789')).toBe(true);
      expect(validateSSN('123456789')).toBe(true);
    });

    it('should reject invalid SSN formats', () => {
      expect(validateSSN('12-345-6789')).toBe(false);
      expect(validateSSN('12345678')).toBe(false);
      expect(validateSSN('1234567890')).toBe(false);
    });
  });

  describe('validateEIN', () => {
    it('should validate correct EIN formats', () => {
      expect(validateEIN('12-3456789')).toBe(true);
      expect(validateEIN('123456789')).toBe(true);
    });

    it('should reject invalid EIN formats', () => {
      expect(validateEIN('123-456789')).toBe(false);
      expect(validateEIN('12345678')).toBe(false);
    });
  });

  describe('validateDateFormat', () => {
    it('should validate correct ISO date formats', () => {
      expect(validateDateFormat('2024-01-15')).toBe(true);
      expect(validateDateFormat('2024-12-31')).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(validateDateFormat('01-15-2024')).toBe(false);
      expect(validateDateFormat('2024/01/15')).toBe(false);
      expect(validateDateFormat('15-01-2024')).toBe(false);
    });
  });

  describe('validateUUID', () => {
    it('should validate correct UUIDs', () => {
      expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(validateUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(validateUUID('not-a-uuid')).toBe(false);
      expect(validateUUID('550e8400-e29b-41d4-a716')).toBe(false);
      expect(validateUUID('550e8400e29b41d4a716446655440000')).toBe(false);
    });
  });
});
