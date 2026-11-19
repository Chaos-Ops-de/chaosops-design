import { describe, expect, it } from 'vitest';
import {
  defaultPasswordRules,
  estimateEntropyBits,
  generatePassword,
  optionalPasswordRules,
  passwordRequirements,
  passwordStrength,
  secureRandomInt,
  strengthHints,
  strengthLevel,
} from './password';

describe('utils/password requirements', () => {
  it('defaults to a single length rule that ticks at 12 characters', () => {
    expect(defaultPasswordRules.map((r) => r.id)).toEqual(['length']);
    expect(passwordRequirements('elf-zeichen')[0]!.met).toBe(false);
    expect(passwordRequirements('zwoelf-zeichen')[0]!.met).toBe(true);
  });

  it('evaluates opt-in rules in order', () => {
    const reqs = passwordRequirements('Abc', optionalPasswordRules);
    expect(reqs.map((r) => [r.id, r.met])).toEqual([
      ['lowercase', true],
      ['uppercase', true],
      ['digit', false],
    ]);
  });

  it('accepts custom rules', () => {
    const reqs = passwordRequirements('x', [{ id: 'custom', label: 'Custom', test: () => true }]);
    expect(reqs).toEqual([{ id: 'custom', label: 'Custom', met: true }]);
  });
});

describe('utils/password entropy', () => {
  it('is 0 for an empty password', () => {
    expect(estimateEntropyBits('')).toBe(0);
  });

  it('does not rate P@ssw0rd as strong, even though it passes every symbol rule', () => {
    const level = passwordStrength('P@ssw0rd');
    expect(level).toBeLessThanOrEqual(1);
    expect(estimateEntropyBits('P@ssw0rd')).toBeLessThan(estimateEntropyBits('Xk9#mQ2$'));
  });

  it('sees through leet swaps of other common words', () => {
    expect(passwordStrength('Qw3rty!!')).toBeLessThanOrEqual(1);
    expect(passwordStrength('W3lc0me2024')).toBeLessThanOrEqual(2);
  });

  it('scores a long passphrase above a short symbol-heavy password', () => {
    const passphrase = estimateEntropyBits('correct horse battery staple');
    const shortSymbols = estimateEntropyBits('Xk9#mQ2$');
    expect(passphrase).toBeGreaterThan(shortSymbols);
    expect(passwordStrength('correct horse battery staple')).toBe(4);
  });

  it('gives repeated characters and runs little credit', () => {
    expect(estimateEntropyBits('aaaaaaaaaaaa')).toBeLessThan(estimateEntropyBits('aqzwsxedcrfv'));
    expect(estimateEntropyBits('abcdefgh')).toBeLessThan(estimateEntropyBits('akzmqwpt'));
    expect(estimateEntropyBits('12345678')).toBeLessThan(estimateEntropyBits('83920157'));
  });

  it('grows with length and with a wider character pool', () => {
    expect(estimateEntropyBits('akzmqwptxn')).toBeGreaterThan(estimateEntropyBits('akzmqwpt'));
    expect(estimateEntropyBits('AkZm#wPt')).toBeGreaterThan(estimateEntropyBits('akzmqwpt'));
  });

  it('counts umlauts as a wider pool', () => {
    expect(estimateEntropyBits('akzmqwpä')).toBeGreaterThan(estimateEntropyBits('akzmqwpt'));
  });
});

describe('utils/password strength level', () => {
  it('maps bits onto 0-4 at the thresholds', () => {
    expect(strengthLevel(0)).toBe(0);
    expect(strengthLevel(27.9)).toBe(0);
    expect(strengthLevel(28)).toBe(1);
    expect(strengthLevel(40)).toBe(2);
    expect(strengthLevel(60)).toBe(3);
    expect(strengthLevel(80)).toBe(4);
    expect(strengthLevel(500)).toBe(4);
  });

  it('coaches instead of labelling a password weak', () => {
    for (const hint of Object.values(strengthHints)) {
      expect(hint.toLowerCase()).not.toContain('schwach');
    }
    expect(Object.keys(strengthHints)).toHaveLength(5);
  });
});

/** Deterministic rng: a small linear congruential generator. */
function seeded(seed: number) {
  let state = seed;
  return (max: number) => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state % max;
  };
}

describe('utils/password generation', () => {
  it('respects the requested length', () => {
    expect(generatePassword(16, seeded(1))).toHaveLength(16);
    expect(generatePassword(24, seeded(2))).toHaveLength(24);
  });

  it('never goes shorter than the number of character classes', () => {
    expect(generatePassword(2, seeded(3))).toHaveLength(4);
    expect(generatePassword(2, seeded(3), { symbols: false })).toHaveLength(3);
  });

  it('includes every character class and leaves out look-alikes', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const pw = generatePassword(16, seeded(seed));
      expect(pw).toMatch(/[a-z]/);
      expect(pw).toMatch(/[A-Z]/);
      expect(pw).toMatch(/[0-9]/);
      expect(pw).toMatch(/[!#$%&*+\-=?@_]/);
      expect(pw).not.toMatch(/[lIO01]/);
    }
  });

  it('omits symbols on request', () => {
    for (let seed = 1; seed <= 20; seed++) {
      expect(generatePassword(16, seeded(seed), { symbols: false })).toMatch(/^[A-Za-z0-9]+$/);
    }
  });

  it('is deterministic for the same rng and varies across seeds', () => {
    expect(generatePassword(16, seeded(7))).toBe(generatePassword(16, seeded(7)));
    expect(generatePassword(16, seeded(7))).not.toBe(generatePassword(16, seeded(8)));
  });

  it('generates passwords that score well', () => {
    expect(passwordStrength(generatePassword(16, seeded(11)))).toBeGreaterThanOrEqual(3);
  });

  it('secureRandomInt stays in range', () => {
    for (let i = 0; i < 200; i++) {
      const n = secureRandomInt(7);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(7);
    }
  });
});
