// Organisation extras + auth response shapes — mirrors
// ChaosOps_Mobile_App/src/api/{organisations,auth}.ts. The web app declares these
// inline in lib/api.ts; keep this file the shared source when it migrates.
// `User` / `Organisation` themselves live in ./index.

import type { Organisation, User } from './index';

export type OrgRole = 'admin' | 'member';

/** A pending organisation invitation as listed to org admins (web's staff view `OrgInvitation` omits `invitedBy`). */
export interface Invitation {
  id: string;
  email: string;
  role: OrgRole;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export type OrganisationUser = User & { avatarUrl?: string | null; isChaosOpsTeam?: boolean };

export type MeResponse = { user: User; organisation: Organisation | null };

export type LoginOrganisationOption = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
};

export type LoginResponse =
  | { requiresOrganisationSelection: true; organisations: LoginOrganisationOption[] }
  | {
      requiresOrganisationSelection?: false;
      organisation: Pick<Organisation, 'id' | 'name'>;
      user: Pick<User, 'id' | 'username' | 'role' | 'email' | 'emailVerified'>;
    }
  | { requiresPODashboard: true; user: Pick<User, 'id' | 'username' | 'role'> };

export type RequestPasswordResetResponse =
  | { requiresOrganisationSelection: true; organisations: LoginOrganisationOption[] }
  | { message: string };

export type ResetPasswordResponse = { success: boolean; message: string };
export type VerifyEmailResponse = { message: string; user: User; organisation: Organisation | null };
export type ResendVerificationResponse = { message: string; sent?: boolean };
export type AcceptInvitationResponse = {
  message: string;
  user: Pick<User, 'id' | 'username' | 'email' | 'role' | 'emailVerified'>;
  organisation: Organisation;
};
export type ValidateInvitationResponse = {
  valid: boolean;
  email: string;
  /** Plain string on the wire (not narrowed to `OrgRole`). */
  role: string;
  organisation: { id: string; name: string };
};
