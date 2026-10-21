// Backup status contract — identical in ChaosOps/src/types/backup.ts and
// ChaosOps_Mobile_App/src/api/staff.ts.

export interface BackupRun {
  id: string;
  startedAt: string;
  finishedAt: string;
  status: 'success' | 'failed';
  destination: string;
  sizeBytes: number | null;
  message: string | null;
}

export type DeploymentEnvironment = 'test_localDev' | 'development_live' | 'production_live';

export interface BackupLatest {
  lastRun: BackupRun | null;
  lastSuccess: BackupRun | null;
  environment: DeploymentEnvironment;
  running: boolean;
}
