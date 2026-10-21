// Roster (Personalverwaltung) contract — mirrors ChaosOps/src/types/roster.ts and
// ChaosOps_Mobile_App/src/api/roster.ts.
//
// Reconciliation notes (web vs. mobile hand-written copies):
//  - `RosterMember`: web includes `certs` + optional `_count`; mobile's `RosterMember`
//    was the bare member and `RosterMemberListItem` added `certs` + required `_count`.
//    Here `RosterMemberBase` is the bare shape, `RosterMember` is the web shape
//    (base + certs, `_count` optional), and `RosterMemberListItem` is mobile's list item.
//  - `RosterCert`: web additionally carries `fileUrl` + `mimeType`; mobile omitted them.
//    The web shape (superset) is used.
//  - `RosterCertType`: web has `organisationId` and optional `_count`; mobile had no
//    `organisationId` and a required `_count`. Web shape is used; see `RosterCertTypeWithCount`
//    for the list endpoint (always includes the count).
//  - `RosterAssignment`: mobile has `eventId`, web's inline detail type did not. `eventId` is
//    kept required (the server returns it); if a client builds these by hand, add it.
//  - Inputs: web allows `null` for clearing fields, mobile only `undefined`. Web (superset) used.

export type CertStatus = 'no-expiry' | 'valid' | 'expiring' | 'expired';

export interface RosterCertType {
  id: string;
  organisationId: string;
  name: string;
  isDefault: boolean;
  _count?: { certs: number };
}

/** Cert-type list item as returned by the list endpoint (count always present). */
export type RosterCertTypeWithCount = RosterCertType & { _count: { certs: number } };

export interface RosterCert {
  id: string;
  memberId: string;
  certTypeId: string;
  certType: { id: string; name: string };
  issuer: string | null;
  number: string | null;
  /** ISO timestamp at midnight UTC; use the first 10 chars as a calendar date. */
  issuedAt: string | null;
  expiresAt: string | null;
  notes: string | null;
  hasFile: boolean;
  fileUrl: string | null;
  mimeType: string | null;
  originalName: string | null;
  status: CertStatus;
}

export interface RosterMemberBase {
  id: string;
  organisationId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  active: boolean;
}

export interface RosterMember extends RosterMemberBase {
  certs: RosterCert[];
  _count?: { assignments: number };
}

/** Mobile list item: member with certs and a guaranteed assignment count. */
export interface RosterMemberListItem extends RosterMemberBase {
  certs: RosterCert[];
  _count: { assignments: number };
}

export interface RosterAssignment {
  id: string;
  eventId: string;
  role: string | null;
  hours: number | null;
  event: { id: string; name: string; archived: boolean };
}

export interface RosterLogEntry {
  id: string;
  date: string;
  text: string;
  event: { id: string; name: string } | null;
}

export interface RosterMemberDetail extends RosterMember {
  assignments: RosterAssignment[];
  logEntries: RosterLogEntry[];
}

export interface RosterMemberList {
  page: number;
  pageSize: number;
  total: number;
  members: RosterMember[];
}

export interface RosterMemberInput {
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  active?: boolean;
}

export interface RosterCertInput {
  certTypeId: string;
  issuer?: string | null;
  number?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
  notes?: string | null;
}

export interface ExpiringCert {
  id: string;
  expiresAt: string;
  status: CertStatus;
  member: { id: string; name: string };
  certType: { id: string; name: string };
}

export interface EventStaffAssignment {
  id: string;
  eventId: string;
  memberId: string;
  role: string | null;
  hours: number | null;
  member: { id: string; name: string; role: string | null; active: boolean; expiredCerts: number; expiringCerts: number };
}

export interface RosterAuditEntry {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
}
