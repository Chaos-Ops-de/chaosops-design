// Platform-neutral password helpers (no DOM / React Native APIs), German copy.
// Shared by the web PasswordField and the native PasswordInput.

/** One requirement shown in a live checklist. */
export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

/** Length is the only default rule: a long password beats symbol rules. */
export const defaultPasswordRules: PasswordRule[] = [
  { id: 'length', label: 'Mindestens 12 Zeichen', test: (pw) => pw.length >= 12 },
];

/** Extra rules a form can opt into next to {@link defaultPasswordRules}. */
export const optionalPasswordRules: PasswordRule[] = [
  { id: 'lowercase', label: 'Ein Kleinbuchstabe', test: (pw) => /[a-z]/.test(pw) },
  { id: 'uppercase', label: 'Ein Großbuchstabe', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'digit', label: 'Eine Ziffer', test: (pw) => /[0-9]/.test(pw) },
];

/** Evaluates `rules` against `password`, in order, for a live checklist. */
export function passwordRequirements(
  password: string,
  rules: PasswordRule[] = defaultPasswordRules,
): PasswordRequirement[] {
  return rules.map((rule) => ({ id: rule.id, label: rule.label, met: rule.test(password) }));
}

/**
 * Words and fragments people reach for. Matched after undoing common "leet"
 * swaps, so "P@ssw0rd" is recognised as "password". Each match is charged a
 * flat {@link COMMON_WORD_BITS} instead of the bits its characters would earn.
 */
export const commonPasswordFragments: readonly string[] = [
  'password', 'passwort', 'passwd', 'qwerty', 'qwertz', 'letmein', 'welcome', 'willkommen',
  'admin', 'login', 'iloveyou', 'monkey', 'dragon', 'master', 'football', 'hallo', 'sunshine',
  'princess', 'abc123', 'chaos', 'chaosops', 'test1234', 'geheim',
];

/** Cost in bits of one common word — about a 130-entry list. */
const COMMON_WORD_BITS = 7;

const LEET: Record<string, string> = { '@': 'a', '4': 'a', '0': 'o', '!': 'i', '3': 'e', '$': 's', '5': 's', '7': 't' };

const KEYBOARD_ROWS = ['qwertzuiop', 'qwertyuiop', 'asdfghjkl', 'yxcvbnm', 'zxcvbnm', '1234567890'];

/** Lowercases and undoes leet swaps one-for-one, so indexes still match the original. `1` can be an i or an l. */
function normalize(password: string, oneAs: 'i' | 'l'): string {
  let out = '';
  for (const ch of password.toLowerCase()) out += ch === '1' ? oneAs : (LEET[ch] ?? ch);
  return out;
}

/** Marks every character that belongs to a common word or fragment. */
function commonCoverage(password: string): boolean[] {
  const covered = new Array<boolean>(password.length).fill(false);
  for (const oneAs of ['i', 'l'] as const) {
    const text = normalize(password, oneAs);
    for (const fragment of commonPasswordFragments) {
      let from = 0;
      for (;;) {
        const at = text.indexOf(fragment, from);
        if (at === -1) break;
        for (let i = at; i < at + fragment.length; i++) covered[i] = true;
        from = at + 1;
      }
    }
  }
  return covered;
}

function adjacentOnKeyboard(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return KEYBOARD_ROWS.some((row) => {
    const i = row.indexOf(x);
    const j = row.indexOf(y);
    return i !== -1 && j !== -1 && Math.abs(i - j) === 1;
  });
}

/** Size of the character pool the password draws from. */
function charsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/.test(password)) size += 33;
  // Umlauts, ß and anything else outside printable ASCII.
  if (/[^\x20-\x7e]/.test(password)) size += 32;
  return size;
}

/**
 * Estimates the entropy of a password in bits. This is an ESTIMATE meant for
 * coaching a user as they type, not a security guarantee:
 *
 * - base: effective length x log2(character pool size);
 * - a repeated character, or one that continues an alphabet or keyboard-row
 *   run ("aaaa", "abcd", "asdf", "1234"), counts for a fraction of a character;
 * - characters inside a common word (after undoing leet swaps) are removed and
 *   the word is charged a flat 7 bits, so "P@ssw0rd" scores as one common word.
 */
export function estimateEntropyBits(password: string): number {
  if (!password) return 0;
  const chars = [...password];
  const covered = commonCoverage(password);

  let effective = 0;
  let commonRuns = 0;
  let inRun = false;
  let prevDiff: number | null = null;
  for (let i = 0; i < chars.length; i++) {
    if (covered[i]) {
      if (!inRun) commonRuns += 1;
      inRun = true;
      prevDiff = null;
      continue;
    }
    inRun = false;
    const ch = chars[i]!;
    const prev = i > 0 && !covered[i - 1] ? chars[i - 1]! : null;
    let weight = 1;
    if (prev !== null) {
      const diff = ch.toLowerCase().charCodeAt(0) - prev.toLowerCase().charCodeAt(0);
      if (diff === 0) weight = 0.2;
      else if (Math.abs(diff) === 1 && prevDiff === diff) weight = 0.3;
      else if (adjacentOnKeyboard(prev, ch) && prevDiff !== null && Math.abs(prevDiff) === 1) weight = 0.3;
      prevDiff = diff;
    } else {
      prevDiff = null;
    }
    effective += weight;
  }

  const pool = charsetSize(password);
  const bits = effective * Math.log2(Math.max(pool, 2)) + commonRuns * COMMON_WORD_BITS;
  return Math.round(bits * 10) / 10;
}

/** 0 (just started) to 4 (very strong). */
export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const LEVEL_THRESHOLDS = [28, 40, 60, 80] as const;

/** Maps estimated bits onto 0-4. */
export function strengthLevel(bits: number): StrengthLevel {
  let level = 0;
  for (const threshold of LEVEL_THRESHOLDS) if (bits >= threshold) level += 1;
  return level as StrengthLevel;
}

/** Coaching copy per level — says what to do next, never "weak". */
export const strengthHints: Record<StrengthLevel, string> = {
  0: 'Länger wird besser',
  1: 'Guter Anfang',
  2: 'Auf einem guten Weg',
  3: 'Stark',
  4: 'Sehr stark',
};

/** Convenience: password to level in one call. */
export function passwordStrength(password: string): StrengthLevel {
  return strengthLevel(estimateEntropyBits(password));
}

/** Returns an integer in `[0, maxExclusive)`. */
export type RandomInt = (maxExclusive: number) => number;

/** Uniform random integer from `crypto.getRandomValues` (rejection sampling, no modulo bias). */
export const secureRandomInt: RandomInt = (maxExclusive) => {
  const cryptoApi = (globalThis as { crypto?: { getRandomValues<T extends ArrayBufferView>(a: T): T } }).crypto;
  if (!cryptoApi) throw new Error('No secure random source available.');
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  do cryptoApi.getRandomValues(buf); while (buf[0]! >= limit);
  return buf[0]! % maxExclusive;
};

const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DIGITS = '23456789';
const SYMBOLS = '!#$%&*+-=?@_';

export interface GeneratePasswordOptions {
  /** Include symbols (default true). */
  symbols?: boolean;
}

/**
 * Generates a random password with at least one lowercase letter, uppercase
 * letter, digit and (unless disabled) symbol. Look-alike characters (l, I, 1,
 * O, 0) are left out so it can be read aloud or typed from a screen. Pass your
 * own `randomInt` to make the result deterministic in tests.
 */
export function generatePassword(
  length: number = 16,
  randomInt: RandomInt = secureRandomInt,
  options: GeneratePasswordOptions = {},
): string {
  const pools = [LOWER, UPPER, DIGITS, ...(options.symbols === false ? [] : [SYMBOLS])];
  const size = Math.max(length, pools.length);
  const pick = (pool: string) => pool[randomInt(pool.length)]!;
  const all = pools.join('');

  const chars: string[] = pools.map(pick);
  while (chars.length < size) chars.push(pick(all));

  // Fisher-Yates, so the guaranteed characters don't always lead.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join('');
}
