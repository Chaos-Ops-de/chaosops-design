import { describe, expect, it } from 'vitest';
import { CERT_STATUS_LABEL, worstCertStatus } from './certStatus';

describe('worstCertStatus', () => {
  it('returns null without certs', () => {
    expect(worstCertStatus([])).toBeNull();
  });

  it('picks the most urgent status', () => {
    expect(worstCertStatus([{ status: 'valid' }, { status: 'expired' }, { status: 'expiring' }])).toBe('expired');
    expect(worstCertStatus([{ status: 'no-expiry' }, { status: 'valid' }])).toBe('valid');
    expect(worstCertStatus([{ status: 'no-expiry' }])).toBe('no-expiry');
  });
});

describe('CERT_STATUS_LABEL', () => {
  it('labels every status', () => {
    expect(Object.keys(CERT_STATUS_LABEL).sort()).toEqual(['expired', 'expiring', 'no-expiry', 'valid']);
  });
});
