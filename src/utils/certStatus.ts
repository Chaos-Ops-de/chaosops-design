// Roster certificate status helpers, shared by the web and mobile roster screens.
import type { CertStatus } from '../contracts/roster';

/** German display label per status. */
export const CERT_STATUS_LABEL: Record<CertStatus, string> = {
  'no-expiry': 'Unbefristet',
  valid: 'Gültig',
  expiring: 'Läuft bald ab',
  expired: 'Abgelaufen',
};

/** Higher = more urgent. */
export const CERT_STATUS_URGENCY: Record<CertStatus, number> = {
  'no-expiry': 0,
  valid: 1,
  expiring: 2,
  expired: 3,
};

/** Most urgent status across the given certs; null when the list is empty. */
export function worstCertStatus(certs: ReadonlyArray<{ status: CertStatus }>): CertStatus | null {
  let worst: CertStatus | null = null;
  for (const c of certs) {
    if (worst === null || CERT_STATUS_URGENCY[c.status] > CERT_STATUS_URGENCY[worst]) worst = c.status;
  }
  return worst;
}
