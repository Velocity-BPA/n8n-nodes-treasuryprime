/**
 * Unit tests for Treasury Prime signature utilities
 *
 * @copyright 2025 Velocity BPA
 * @license BSL-1.1
 */

import {
  computeWebhookSignature,
  verifyWebhookSignature,
  verifyWebhookWithTimestamp,
  generateIdempotencyKey,
} from '../../nodes/TreasuryPrime/utils/signatureUtils';

describe('Signature Utils', () => {
  const testSecret = 'test-webhook-secret-key';
  const testPayload = JSON.stringify({ event: 'test', data: { id: '123' } });

  describe('computeWebhookSignature', () => {
    it('should generate consistent signatures for same input', () => {
      const sig1 = computeWebhookSignature(testPayload, testSecret);
      const sig2 = computeWebhookSignature(testPayload, testSecret);
      expect(sig1).toBe(sig2);
    });

    it('should generate different signatures for different payloads', () => {
      const sig1 = computeWebhookSignature(testPayload, testSecret);
      const sig2 = computeWebhookSignature('{"different": "payload"}', testSecret);
      expect(sig1).not.toBe(sig2);
    });

    it('should generate different signatures for different secrets', () => {
      const sig1 = computeWebhookSignature(testPayload, testSecret);
      const sig2 = computeWebhookSignature(testPayload, 'different-secret');
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid signatures', () => {
      const signature = computeWebhookSignature(testPayload, testSecret);
      expect(verifyWebhookSignature(testPayload, signature, testSecret)).toBe(true);
    });

    it('should reject invalid signatures', () => {
      expect(verifyWebhookSignature(testPayload, 'invalidsignature', testSecret)).toBe(false);
    });

    it('should reject empty signatures', () => {
      expect(verifyWebhookSignature(testPayload, '', testSecret)).toBe(false);
    });
  });

  describe('verifyWebhookWithTimestamp', () => {
    it('should verify valid signatures with recent timestamps', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signedPayload = `${timestamp}.${testPayload}`;
      const signature = computeWebhookSignature(signedPayload, testSecret);
      const header = `t=${timestamp},v1=${signature}`;

      const result = verifyWebhookWithTimestamp(testPayload, header, testSecret);
      expect(result.valid).toBe(true);
    });

    it('should reject signatures with old timestamps', () => {
      const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString(); // 6+ minutes ago
      const signedPayload = `${oldTimestamp}.${testPayload}`;
      const signature = computeWebhookSignature(signedPayload, testSecret);
      const header = `t=${oldTimestamp},v1=${signature}`;

      const result = verifyWebhookWithTimestamp(testPayload, header, testSecret);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('too old');
    });

    it('should reject invalid signatures', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const header = `t=${timestamp},v1=invalidsignature`;

      const result = verifyWebhookWithTimestamp(testPayload, header, testSecret);
      expect(result.valid).toBe(false);
    });

    it('should reject missing timestamp', () => {
      const signature = computeWebhookSignature(testPayload, testSecret);
      const header = `v1=${signature}`;

      const result = verifyWebhookWithTimestamp(testPayload, header, testSecret);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('timestamp');
    });

    it('should reject missing signature', () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const header = `t=${timestamp}`;

      const result = verifyWebhookWithTimestamp(testPayload, header, testSecret);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('signature');
    });
  });

  describe('generateIdempotencyKey', () => {
    it('should generate UUID-format idempotency keys', () => {
      const key = generateIdempotencyKey();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(key).toMatch(uuidRegex);
    });

    it('should generate unique keys on each call', () => {
      const keys = new Set<string>();
      for (let i = 0; i < 100; i++) {
        keys.add(generateIdempotencyKey());
      }
      expect(keys.size).toBe(100);
    });
  });
});
