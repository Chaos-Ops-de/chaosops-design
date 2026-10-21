// Content moderation contract — identical in ChaosOps/src/types/staff.ts and
// ChaosOps_Mobile_App/src/api/{staff,moderation}.ts (mobile declared the report
// enums twice; here they live once). Label maps (e.g. German reason labels) are
// runtime values and intentionally stay in the apps.

export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';
export type ReportTargetType = 'USER' | 'EVENT' | 'SCHEDULE_ITEM';
export type ReportReason = 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE' | 'OTHER';

export interface ContentReportEntry {
  id: string;
  reporter: { id: string; username: string };
  organisationId: string | null;
  organisationName: string | null;
  targetType: ReportTargetType;
  targetId: string;
  /** Username / event name / item title; null when the target no longer exists. */
  targetLabel: string | null;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}

export interface BlockedUser {
  userId: string;
  username: string;
  createdAt: string;
}

/** Body of `POST /moderation/reports` (mobile `reportContent`). */
export interface ReportContentInput {
  targetType: ReportTargetType;
  targetId: string | number;
  reason: ReportReason;
  details?: string;
}
