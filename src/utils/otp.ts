// Platform-neutral helpers for one-time-code style inputs (no DOM / React
// Native APIs). Shared by the web OtpInput and the native OtpInput.

export type OtpCharset = 'numeric' | 'alphanumeric';

/**
 * Keeps only the characters the charset allows and cuts to `length`.
 * Spaces, dashes and anything else are stripped, so a pasted "123 456" or
 * "123-456" fills all six slots. Alphanumeric codes are uppercased.
 */
export function sanitizeOtp(input: string, charset: OtpCharset = 'numeric', length: number = 6): string {
  const allowed = charset === 'numeric' ? /[0-9]/ : /[A-Za-z0-9]/;
  let out = '';
  for (const ch of input) {
    if (!allowed.test(ch)) continue;
    out += charset === 'alphanumeric' ? ch.toUpperCase() : ch;
    if (out.length >= length) break;
  }
  return out;
}

/** One entry per slot: the character in it, or an empty string. */
export function otpSlots(value: string, length: number): string[] {
  return Array.from({ length }, (_, i) => value[i] ?? '');
}

/** The slot the next typed character lands in (the last slot once full). */
export function nextFocusIndex(value: string, length: number): number {
  return Math.max(0, Math.min(value.length, length - 1));
}

export function isOtpComplete(value: string, length: number): boolean {
  return length > 0 && value.length >= length;
}

/**
 * Which caret position a click on the slot row maps to. The row is `width`
 * wide starting at `left`; the caret can sit after the last filled slot at
 * most, so tapping an empty slot lands on the first empty one.
 */
export function caretForClick(x: number, left: number, width: number, length: number, valueLength: number): number {
  if (width <= 0 || length <= 0) return valueLength;
  const slot = Math.floor(((x - left) / width) * length);
  return Math.max(0, Math.min(slot, valueLength));
}

/** Whole seconds left in a resend cooldown that started at `startedAt` (ms), never below 0 or above `total`. */
export function remainingSeconds(startedAt: number, now: number, total: number): number {
  const left = Math.ceil(total - (now - startedAt) / 1000);
  return Math.max(0, Math.min(total, left));
}
