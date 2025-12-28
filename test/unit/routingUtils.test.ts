/**
 * Unit tests for Treasury Prime routing utilities
 *
 * @copyright 2025 Velocity BPA
 * @license BSL-1.1
 */

import {
  validateABARoutingNumber,
  getFederalReserveDistrict,
  getRoutingNumberInfo,
} from '../../nodes/TreasuryPrime/utils/routingUtils';

describe('Routing Utils', () => {
  describe('validateABARoutingNumber', () => {
    it('should validate correct routing numbers with valid checksum', () => {
      // These are real bank routing numbers
      expect(validateABARoutingNumber('021000021')).toBe(true); // JPMorgan Chase
      expect(validateABARoutingNumber('026009593')).toBe(true); // Bank of America
      expect(validateABARoutingNumber('011401533')).toBe(true); // Bank of America (MA)
    });

    it('should reject routing numbers with invalid checksum', () => {
      expect(validateABARoutingNumber('123456789')).toBe(false);
      expect(validateABARoutingNumber('111111111')).toBe(false);
    });

    it('should reject invalid format routing numbers', () => {
      expect(validateABARoutingNumber('12345678')).toBe(false); // Too short
      expect(validateABARoutingNumber('1234567890')).toBe(false); // Too long
      expect(validateABARoutingNumber('12345678a')).toBe(false); // Contains letter
    });
  });

  describe('getFederalReserveDistrict', () => {
    it('should return correct district for valid routing numbers', () => {
      expect(getFederalReserveDistrict('011401533')).toBe('Boston');
      expect(getFederalReserveDistrict('021000021')).toBe('New York');
      expect(getFederalReserveDistrict('031000503')).toBe('Philadelphia');
      expect(getFederalReserveDistrict('041000124')).toBe('Cleveland');
      expect(getFederalReserveDistrict('051000017')).toBe('Richmond');
      expect(getFederalReserveDistrict('061000052')).toBe('Atlanta');
      expect(getFederalReserveDistrict('071000013')).toBe('Chicago');
      expect(getFederalReserveDistrict('081000210')).toBe('St. Louis');
      expect(getFederalReserveDistrict('091000019')).toBe('Minneapolis');
      expect(getFederalReserveDistrict('101000023')).toBe('Kansas City');
      expect(getFederalReserveDistrict('111000025')).toBe('Dallas');
      expect(getFederalReserveDistrict('121000358')).toBe('San Francisco');
    });

    it('should return unknown for invalid routing numbers', () => {
      expect(getFederalReserveDistrict('001234567')).toBe('Unknown');
      expect(getFederalReserveDistrict('131234567')).toBe('Unknown');
    });
  });

  describe('getRoutingNumberInfo', () => {
    it('should return complete info for valid routing numbers', () => {
      const info = getRoutingNumberInfo('021000021');
      expect(info.valid).toBe(true);
      expect(info.district?.name).toBe('New York');
      expect(info.routingNumber).toBe('021000021');
    });

    it('should indicate invalid for bad routing numbers', () => {
      const info = getRoutingNumberInfo('123456789');
      expect(info.valid).toBe(false);
    });
  });
});
