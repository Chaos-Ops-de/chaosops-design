import React from 'react';
import { AlertCircle, Check, File as FileIcon, FileText, Image as ImageIcon, RotateCcw, X } from 'lucide-react';
import { formatBytes } from '../../utils/format';
import { clampPercent, fileKind, formatTimeLeft } from './dropzoneLogic';
import './Dropzone.css';

export type UploadStatus = 'queued' | 'uploading' | 'done' | 'error';

export interface UploadItemData {
  id: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  /** 0 to 100; only read while `uploading`. */
  progress?: number;
  /** Remaining time in ms, when the caller can estimate it. */
  remainingMs?: number | null;
  /** Why it failed, shown next to the retry button. */
  error?: string;
  /** Object URL or image URL; shown as a thumbnail instead of an icon. */
  previewUrl?: string;
}

export interface UploadItemProps extends UploadItemData {
  /** Shown on failure. The file stays in the list so nothing has to be picked again. */
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const KIND_ICON = { image: ImageIcon, document: FileText, file: FileIcon } as const;

/**
 * One file in an upload. It reports its own state, so a failure never blocks
 * the other files: the failed row offers a retry and the rest carry on.
 */
export const UploadItem: React.FC<UploadItemProps> = ({
  id, name, size, type, status, progress, remainingMs, error, previewUrl, onRetry, onRemove,
}) => {
  const Icon = KIND_ICON[fileKind({ name, type })];
  const percent = clampPercent(progress);
  const timeLeft = status === 'uploading' ? formatTimeLeft(remainingMs) : '';

  return (
    <li className="chaos-upload" data-status={status}>
      <span className="chaos-upload__thumb" aria-hidden="true">
        {previewUrl ? <img src={previewUrl} alt="" /> : <Icon size={20} />}
      </span>

      <div className="chaos-upload__body">
        <div className="chaos-upload__row">
          <span className="chaos-upload__name" title={name}>{name}</span>
          <span className="chaos-upload__size">{formatBytes(size)}</span>
        </div>

        {status === 'uploading' && (
          <div className="chaos-upload__progress">
            <div
              className="chaos-upload__bar"
              role="progressbar"
              aria-label={`Upload von ${name}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <span className="chaos-upload__fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="chaos-upload__meta">{percent} %{timeLeft ? ` · ${timeLeft}` : ''}</span>
          </div>
        )}

        {status === 'queued' && <span className="chaos-upload__meta">Wartet…</span>}

        {status === 'done' && (
          <span className="chaos-upload__meta chaos-upload__meta--done">
            <Check size={14} aria-hidden="true" /> Hochgeladen
          </span>
        )}

        {status === 'error' && (
          <span className="chaos-upload__meta chaos-upload__meta--error" role="alert">
            <AlertCircle size={14} aria-hidden="true" /> {error ?? 'Upload fehlgeschlagen'}
          </span>
        )}
      </div>

      {status === 'error' && onRetry && (
        <button type="button" className="chaos-upload__action" onClick={() => onRetry(id)} aria-label={`${name} erneut hochladen`}>
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      )}
      {onRemove && (
        <button type="button" className="chaos-upload__action" onClick={() => onRemove(id)} aria-label={`${name} entfernen`}>
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </li>
  );
};

export interface UploadListProps {
  items: UploadItemData[];
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
  'aria-label'?: string;
  className?: string;
}

/** The files of one upload, each with its own progress, retry and remove. */
export const UploadList: React.FC<UploadListProps> = ({ items, onRetry, onRemove, className, 'aria-label': ariaLabel }) => {
  if (items.length === 0) return null;
  return (
    <ul className={['chaos-upload-list', className].filter(Boolean).join(' ')} aria-label={ariaLabel ?? 'Hochgeladene Dateien'}>
      {items.map((item) => (
        <UploadItem key={item.id} {...item} onRetry={onRetry} onRemove={onRemove} />
      ))}
    </ul>
  );
};
