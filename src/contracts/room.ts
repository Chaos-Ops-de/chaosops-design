// Brainstorm Rooms contract — mirrors ChaosOps/src/types/room.ts (web only; no mobile copy yet).

export type RoomStatus = "draft" | "converted";
export type RoomNodeKind = "plan" | "note" | "task" | "file" | "comment" | "day" | "team";
export type RoomTaskPhase = "prep" | "onday";

export interface RoomParticipantUser {
  id: string;
  username: string;
  email: string | null;
}

export interface RoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  joinedAt: string;
  lastSeenAt: string;
  user: RoomParticipantUser;
}

// Trimmed shape of a Document as embedded on a 'file' RoomNode (see
// nodeDocumentSelect in server/routes/rooms.ts) — not the full Document
// type from lib/api.ts, which carries org/event/workshop ids this doesn't need.
export interface RoomNodeDocument {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface RoomNode {
  id: string;
  roomId: string;
  kind: RoomNodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number | null;
  color: string | null;
  /** Excluded from "Automatisch anordnen" — keeps its current x/y no
   * matter what the rest of the graph does. */
  pinned: boolean;
  /** kind === 'day' only — the real DayPlan this Tag node represents.
   * Null until the first sync creates one (see EventWorkspacePage.tsx). */
  dayPlanId: string | null;
  /** kind === 'day' only — this Tag's own date (YYYY-MM-DD), mandatory
   * (enforced server-side) the moment a day node exists. Source of truth
   * for the linked DayPlan's date, and what autoArrange.ts sorts Tags by. */
  date: string | null;

  // plan
  title: string | null;
  time: string | null;
  duration: string | null;
  owner: string | null;
  scheduleType: string | null;
  location: string | null;
  details: string | null;
  materials: string | null;

  // note / task / comment / team
  text: string | null;

  // task
  phase: RoomTaskPhase | null;
  done: boolean | null;
  assigneeUserId: string | null;

  // file — points at an already-uploaded Document (see
  // src/components/shared/DocumentManager.tsx) rather than holding its own
  // free-text name/URL. null until a document is attached (drag from the
  // Dokumente sidebar, or the picker on the node itself).
  documentId: string | null;
  document: RoomNodeDocument | null;

  authorUserId: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomConnection {
  id: string;
  roomId: string;
  fromNodeId: string | null;
  toNodeId: string;
  createdAt: string;
}

export interface Room {
  id: string;
  organisationId: string;
  eventId: string;
  title: string;
  emoji: string | null;
  description: string | null;
  targetDate: string | null;
  status: RoomStatus;
  createdByUserId: string | null;
  dayPlanId: string | null;
  startModeChosen: boolean;
  createdAt: string;
  updatedAt: string;
  participants: RoomParticipant[];
  _count?: { nodes: number };
}

export interface RoomDetail extends Room {
  nodes: RoomNode[];
  connections: RoomConnection[];
}

export interface UpdateRoomData {
  title?: string;
  emoji?: string;
  description?: string;
  targetDate?: string;
  status?: RoomStatus;
  startModeChosen?: boolean;
}

export interface CreateRoomNodeData {
  kind: RoomNodeKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotation?: number;
  color?: string;
  pinned?: boolean;
  dayPlanId?: string;
  title?: string;
  date?: string;
  time?: string;
  duration?: string;
  owner?: string;
  scheduleType?: string;
  location?: string;
  details?: string;
  materials?: string;
  text?: string;
  phase?: RoomTaskPhase;
  done?: boolean;
  assigneeUserId?: string;
  documentId?: string;
  authorUserId?: string;
}

// assigneeUserId/documentId are also nullable (not just optional) so a
// patch can explicitly *clear* them (e.g. unassigning a task, or detaching
// a file node's document) — omitting a key means "leave it alone", `null`
// means "clear it" (JSON.stringify drops `undefined` keys entirely but
// keeps `null` ones, and the server's PATCH route only touches fields
// actually present in the body). The rest stay plain optional
// strings/numbers — x/y/w/h etc. are never meant to clear.
export type UpdateRoomNodeData = Partial<Omit<CreateRoomNodeData, "kind" | "assigneeUserId" | "documentId">> & {
  assigneeUserId?: string | null;
  documentId?: string | null;
};

export interface CreateRoomConnectionData {
  fromNodeId?: string | null;
  toNodeId: string;
}
