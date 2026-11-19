// Pure logic behind <Dropzone> and <UploadList>; no React / DOM.
import { formatBytes } from '../../utils/format';

/** The slice of a `File` the logic reads, so it also runs on plain objects in tests. */
export interface FileLike {
  name: string;
  size: number;
  type: string;
}

export type RejectReason = 'type' | 'size' | 'count';

export interface RejectedFile<F extends FileLike = FileLike> {
  file: F;
  reason: RejectReason;
}

export interface ValidateOptions {
  /** Same syntax as `<input accept>`: comma-separated MIME types, `image/*` wildcards and `.ext` extensions. */
  accept?: string;
  /** Largest allowed file in bytes. */
  maxSize?: number;
  /** When false only the first file is kept. */
  multiple?: boolean;
  /** Upper bound on how many files one drop may add (only with `multiple`). */
  maxFiles?: number;
}

export interface ValidateResult<F extends FileLike = FileLike> {
  accepted: F[];
  rejected: Array<RejectedFile<F>>;
}

/** True when a file matches one of the `accept` tokens (or when there are none). */
export function matchesAccept(file: FileLike, accept?: string): boolean {
  const tokens = (accept ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/**
 * Splits dropped files into accepted and rejected, each rejection with its
 * reason. Type is checked first, then size, then count — so a wrong file type
 * is reported as such even if it is also too large. Order is preserved.
 */
export function validateFiles<F extends FileLike>(files: readonly F[], options: ValidateOptions = {}): ValidateResult<F> {
  const { accept, maxSize, multiple = false, maxFiles } = options;
  const limit = multiple ? (maxFiles ?? Infinity) : 1;
  const accepted: F[] = [];
  const rejected: Array<RejectedFile<F>> = [];

  for (const file of files) {
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: 'type' });
    } else if (maxSize !== undefined && file.size > maxSize) {
      rejected.push({ file, reason: 'size' });
    } else if (accepted.length >= limit) {
      rejected.push({ file, reason: 'count' });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
}

/** Human-readable (German) reason a file was turned away. */
export function rejectionMessage(reason: RejectReason, options: Pick<ValidateOptions, 'maxSize' | 'multiple' | 'maxFiles'> = {}): string {
  switch (reason) {
    case 'type':
      return 'Dateityp nicht erlaubt';
    case 'size':
      return options.maxSize !== undefined ? `Zu groß (max. ${formatBytes(options.maxSize)})` : 'Datei zu groß';
    case 'count':
      return options.multiple && options.maxFiles !== undefined
        ? `Höchstens ${options.maxFiles} Dateien`
        : 'Nur eine Datei erlaubt';
  }
}

/** Only a drag that carries files should light the drop zone (not selected text or a link). */
export function hasFiles(types: ReadonlyArray<string> | null | undefined): boolean {
  return Array.from(types ?? []).includes('Files');
}

/** Remaining upload time as "noch 12 s", "noch 2 Min. 5 s" or "noch 1 Std. 5 Min."; empty when unknown. */
export function formatTimeLeft(remainingMs: number | null | undefined): string {
  if (remainingMs === null || remainingMs === undefined || !Number.isFinite(remainingMs)) return '';
  if (remainingMs <= 0) return 'gleich fertig';
  const total = Math.ceil(remainingMs / 1000);
  if (total < 60) return `noch ${total} s`;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  if (total < 3600) return seconds > 0 ? `noch ${minutes} Min. ${seconds} s` : `noch ${minutes} Min.`;
  const hours = Math.floor(total / 3600);
  const restMinutes = Math.floor((total % 3600) / 60);
  return restMinutes > 0 ? `noch ${hours} Std. ${restMinutes} Min.` : `noch ${hours} Std.`;
}

/** Whole percent 0-100; anything unknown or out of range is clamped. */
export function clampPercent(progress: number | null | undefined): number {
  if (progress === null || progress === undefined || !Number.isFinite(progress)) return 0;
  return Math.round(Math.min(100, Math.max(0, progress)));
}

export type FileKind = 'image' | 'document' | 'file';

/** Which icon a file without a preview gets. */
export function fileKind(file: Pick<FileLike, 'name' | 'type'>): FileKind {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif|heic)$/.test(name)) return 'image';
  if (type === 'application/pdf' || type.startsWith('text/') || /\.(pdf|docx?|xlsx?|pptx?|txt|csv|md)$/.test(name)) return 'document';
  return 'file';
}
