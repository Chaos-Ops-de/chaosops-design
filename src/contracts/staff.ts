// Platform-staff (Control Center) contract — mirrors ChaosOps/src/types/staff.ts and
// ChaosOps_Mobile_App/src/api/staff.ts. The two copies agreed field for field;
// the only difference was mobile inlining the org member/invitation/event/display
// shapes that web names (`OrgMember`, …). The web names are used.
// Report/moderation types live in ./moderation, backups in ./backup.

export interface StaffStats {
  orgs: number;
  users: number;
  events: number;
  dayPlans: number;
  activeDisplays: number;
  workshopSignups: number;
  pendingInvitations: number;
  activeSharedPlans: number;
  dbLatencyMs: number;
  serverUptimeSeconds: number;
  memoryMb: number;
  cpuPercent: number;
  memoryPercent: number;
  errorCount24h: number;
  failedLogins24h: number;
  lastError: string | null;
  emailEnabled: boolean;
  ntfyEnabled: boolean;
  healthStatus: 'ok' | 'degraded' | 'error';
}

export type ActivityLogType =
  | 'login'
  | 'login_failed'
  | 'org_created'
  | 'org_deleted'
  | 'user_deleted'
  | 'user_role_changed'
  | 'flag_changed'
  | 'display_cleanup'
  | 'session_revoked'
  | 'error'
  | 'event_created'
  | 'display_paired'
  | 'content_reported';

export interface ActivityLogEntry {
  timestamp: string;
  type: ActivityLogType;
  message: string;
  actorId: string | null;
  actorName: string | null;
}

export interface SystemConfigEntry {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrgEntry {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  isDemo: boolean;
  demoExpiresAt: string | null;
  memberCount: number;
  displayCount: number;
  eventCount: number;
}

export interface OrgMember {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
}

export interface OrgInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  expiresAt: string;
  createdAt: string;
}

export interface OrgEvent {
  id: string;
  name: string;
  archived: boolean;
  createdAt: string;
}

export interface OrgDisplay {
  id: string;
  name: string;
  status: 'PENDING' | 'PAIRED' | 'ACTIVE';
  isActive: boolean;
  lastSeenAt: string;
}

export interface OrgDetail {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  isDemo: boolean;
  demoExpiresAt: string | null;
  members: OrgMember[];
  invitations: OrgInvitation[];
  events: OrgEvent[];
  displays: OrgDisplay[];
}

/**
 * Platform-wide role only (users.role); null for ordinary users with no
 * Control Center access. Org-scoped roles live on `UserOrgMembership`.
 */
export type PlatformRole = 'productowner' | 'productadmin' | null;

export interface UserEntry {
  id: string;
  username: string;
  email: string;
  role: PlatformRole;
  orgCount: number;
  emailVerified: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface UserOrgMembership {
  id: string;
  name: string;
  role: 'admin' | 'member';
}

export interface UserDetail {
  id: string;
  username: string;
  email: string;
  role: PlatformRole;
  emailVerified: boolean;
  createdAt: string;
  avatarUrl?: string | null;
  activeSessions: number;
  deviceTokens: number;
  organisations: UserOrgMembership[];
}
