// Event handbook contract (emergency contacts, accommodation, participants) — mirrors ChaosOps/src/types/handbook.ts.

export type EmergencyContactCategory = 'ORGANISATORISCH' | 'ERSTHELFER' | 'SONSTIGE';

export interface EmergencyContact {
  id: string;
  eventId: string;
  category: EmergencyContactCategory;
  name: string;
  phone: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  eventId: string;
  name: string;
  groupOrigin?: string | null;
  notes?: string | null;
  roomId?: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationRoom {
  id: string;
  eventId: string;
  label: string;
  floor?: string | null;
  capacity: number;
  barrierFree: boolean;
  position: number;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationImage {
  id: string;
  eventId: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  position: number;
  createdAt: string;
}

export interface OrganisationHandbookSettings {
  handbookLegalFramework?: string | null;
  handbookCampRules?: string | null;
  handbookCrisisProtocol?: string | null;
}
