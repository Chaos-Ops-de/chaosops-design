// Shared API domain shapes, consumed by both the ChaosOps web app and the
// mobile app so the two clients stop hand-retyping the same server contract
// independently. Source of truth for these shapes is `prisma/schema.prisma`
// in the ChaosOps repo — when the schema changes, update here too.

export type DeviceStatus = 'PENDING' | 'PAIRED' | 'ACTIVE';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'member' | 'productowner';
  organisationId: string;
  email?: string | null;
  emailVerified?: boolean;
}

export interface Organisation {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopTimeslot {
  id: number;
  workshopId: number;
  organisationId: string;
  startTime: string;
  endTime: string;
}

export interface WorkshopSignup {
  id: number;
  workshopId: number;
  timeslotId: number | null;
  organisationId: string;
  name: string;
  deviceId: string;
  createdAt: string;
}

export interface Workshop {
  id: number;
  scheduleItemId: number;
  organisationId: string;
  title: string;
  leader?: string;
  location?: string;
  description?: string;
  requirements?: string;
  color?: string;
  capacity?: number;
  signupEnabled: boolean;
  position: number;
  timeslots: WorkshopTimeslot[];
  signups?: WorkshopSignup[];
}

export interface ScheduleItem {
  id: number;
  dayPlanId: string;
  time: string;
  type: string;
  title: string;
  speaker?: string;
  location?: string;
  details?: string;
  materials?: string;
  duration?: string;
  snacks?: string;
  facilitator?: string;
  delay?: number;
  timeChanged?: boolean;
  positionChanged?: boolean;
  originalTime?: string;
  originalPosition?: number;
  position: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  helperMeetingTime?: string;
  helperNotes?: string;
  helperMaterials?: string;
  showHelperInfoOnDisplay?: boolean;
  showHelperInfoOnSharedPlan?: boolean;
  showGridOnDisplay?: boolean;
  showGridOnSharedLink?: boolean;
  showGridOnTeamLink?: boolean;
  endTime?: string;
  workshops?: Workshop[];
}

export interface DayPlan {
  id: string;
  eventId: string;
  name: string;
  date: string;
  leaders: string[];
  createdAt: string;
  updatedAt: string;
  scheduleItems: ScheduleItem[];
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  organisationId: string;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  dayPlans: DayPlan[];
}

export interface Display {
  id: string;
  organisationId: string | null;
  name: string;
  registrationCode: string | null;
  codeExpiresAt: string | null;
  pairingCode: string | null;
  socketId: string | null;
  status: DeviceStatus;
  isActive: boolean;
  showQrCode: boolean;
  currentDayPlanId: string | null;
  currentEventId: string | null;
  zoneId: string | null;
  lastSeenAt: string;
  refreshRequestedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DisplayZone {
  id: string;
  name: string;
  color: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { displays: number };
}
