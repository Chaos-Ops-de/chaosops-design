import { useCallback, useEffect, useRef, useState } from 'react';
import type { UploadItemData } from './UploadList';
import { clampPercent, fileKind } from './dropzoneLogic';
import { estimateRemainingMs, nextToStart } from './uploadLogic';

export interface UploadContext {
  /** Report progress as a percent, 0 to 100. */
  onProgress: (percent: number) => void;
  /** Aborted when the file is removed or the component unmounts. */
  signal: AbortSignal;
}

/** Sends one file. Resolve when it is stored, reject (with a readable message) when it failed. */
export type UploadFn = (file: File, context: UploadContext) => Promise<void>;

export interface UseUploadsOptions {
  upload: UploadFn;
  /** Uploads running at once; the rest wait in the queue. */
  maxConcurrent?: number;
  /** Show a thumbnail for images (an object URL, revoked on remove and unmount). */
  previews?: boolean;
  /** For tests. */
  makeId?: () => string;
  now?: () => number;
}

export interface UseUploads {
  items: UploadItemData[];
  /** Queues files; they start as slots free up. */
  add: (files: File[]) => void;
  /** Puts a failed file back in the queue. It keeps its place in the list. */
  retry: (id: string) => void;
  /** Cancels a running upload and drops the file from the list. */
  remove: (id: string) => void;
  clear: () => void;
  /** Counts for a summary line. */
  counts: { queued: number; uploading: number; done: number; error: number };
  /** True once there is at least one file and none is waiting or running. */
  settled: boolean;
}

interface UploadRecord {
  file: File;
  controller: AbortController | null;
  startedAt: number;
  previewUrl?: string;
}

const defaultId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * State for an upload list. It runs the uploads you describe with `upload`,
 * at most `maxConcurrent` at a time, and keeps each file's progress, time left,
 * failure and retry independent, so one bad file never blocks the others.
 * Pair it with `<Dropzone onFiles={add} />` and `<UploadList items={items} .../>`.
 */
export function useUploads({ upload, maxConcurrent = 3, previews = true, makeId = defaultId, now = Date.now }: UseUploadsOptions): UseUploads {
  const [items, setItems] = useState<UploadItemData[]>([]);
  const records = useRef(new Map<string, UploadRecord>());
  // Ids whose upload has been handed to `upload` for this attempt; guards against a double start.
  const started = useRef(new Set<string>());
  const uploadRef = useRef(upload);
  uploadRef.current = upload;

  const patch = useCallback((id: string, changes: Partial<UploadItemData>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }, []);

  const run = useCallback((id: string) => {
    const record = records.current.get(id);
    if (!record) return;
    const controller = new AbortController();
    record.controller = controller;
    record.startedAt = now();
    uploadRef.current(record.file, {
      signal: controller.signal,
      onProgress: (raw) => {
        if (controller.signal.aborted) return;
        const percent = clampPercent(raw);
        patch(id, { progress: percent, remainingMs: estimateRemainingMs(record.startedAt, now(), percent) });
      },
    }).then(
      () => {
        if (!controller.signal.aborted) patch(id, { status: 'done', progress: 100, remainingMs: null });
      },
      (err: unknown) => {
        if (controller.signal.aborted) return;
        patch(id, { status: 'error', remainingMs: null, error: err instanceof Error && err.message ? err.message : 'Upload fehlgeschlagen' });
      },
    );
  }, [now, patch]);

  // Start queued files whenever a slot is free.
  useEffect(() => {
    const starting = nextToStart(items, maxConcurrent).map((i) => items[i]!.id).filter((id) => !started.current.has(id));
    if (starting.length === 0) return;
    for (const id of starting) started.current.add(id);
    setItems((prev) => prev.map((item) => (starting.includes(item.id) ? { ...item, status: 'uploading', progress: 0, remainingMs: null } : item)));
    for (const id of starting) run(id);
  }, [items, maxConcurrent, run]);

  const add = useCallback((files: File[]) => {
    const added: UploadItemData[] = files.map((file) => {
      const id = makeId();
      const record: UploadRecord = { file, controller: null, startedAt: 0 };
      if (previews && fileKind(file) === 'image' && typeof URL !== 'undefined' && 'createObjectURL' in URL) {
        record.previewUrl = URL.createObjectURL(file);
      }
      records.current.set(id, record);
      return { id, name: file.name, size: file.size, type: file.type, status: 'queued', progress: 0, previewUrl: record.previewUrl };
    });
    setItems((prev) => [...prev, ...added]);
  }, [makeId, previews]);

  const retry = useCallback((id: string) => {
    started.current.delete(id);
    patch(id, { status: 'queued', progress: 0, error: undefined, remainingMs: null });
  }, [patch]);

  const dispose = (id: string) => {
    const record = records.current.get(id);
    record?.controller?.abort();
    if (record?.previewUrl) URL.revokeObjectURL(record.previewUrl);
    records.current.delete(id);
    started.current.delete(id);
  };

  const remove = useCallback((id: string) => {
    dispose(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    for (const id of Array.from(records.current.keys())) dispose(id);
    setItems([]);
  }, []);

  // Leaving the page cancels what is still running and frees the thumbnails.
  useEffect(() => () => {
    for (const id of Array.from(records.current.keys())) dispose(id);
  }, []);

  const counts = {
    queued: items.filter((i) => i.status === 'queued').length,
    uploading: items.filter((i) => i.status === 'uploading').length,
    done: items.filter((i) => i.status === 'done').length,
    error: items.filter((i) => i.status === 'error').length,
  };

  return { items, add, retry, remove, clear, counts, settled: items.length > 0 && counts.queued === 0 && counts.uploading === 0 };
}
