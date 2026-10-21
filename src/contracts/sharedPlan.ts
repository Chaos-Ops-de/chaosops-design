// Shared plan (public/team share links) contract — mirrors ChaosOps/src/types/sharedPlan.ts.

import type { ScheduleItem } from './index';

export interface SharedPlan {
  id: string;
  shareToken: string;
  title: string;
  description?: string;
  type: 'public' | 'team';
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  viewCount: number;
  lastViewAt?: string;
  shareUrl: string;
  creator: {
    id: string;
    username: string;
  };
}

export interface OrgSharedPlan extends SharedPlan {
  event: {
    id: string;
    name: string;
  };
}

export interface CreateSharedPlanPayload {
  title: string;
  description?: string;
  expiresAt?: string;
  type: 'public' | 'team';
}

export interface EventSharedPlanResponse {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  viewCount: number;
  type: string;
  event: {
    id: string;
    name: string;
    organisation: { name: string; logoUrl?: string };
  };
  dayPlans: Array<{
    id: string;
    name: string;
    date: string;
    scheduleItems: ScheduleItem[];
  }>;
}
