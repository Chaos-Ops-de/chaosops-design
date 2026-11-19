import React, { useId, useRef, useState } from 'react';
import { AlertCircle, Upload } from 'lucide-react';
import { formatBytes } from '../../utils/format';
import {
  hasFiles,
  rejectionMessage,
  validateFiles,
  type RejectedFile,
  type ValidateOptions,
} from './dropzoneLogic';
import './Dropzone.css';

export interface DropzoneProps extends Pick<ValidateOptions, 'accept' | 'maxSize' | 'multiple' | 'maxFiles'> {
  /** Receives the files that passed validation. Uploading them is up to the caller. */
  onFiles: (files: File[]) => void;
  /** Receives the files that were turned away, each with its reason. */
  onRejected?: (rejected: Array<RejectedFile<File>>) => void;
  disabled?: boolean;
  /** Forces the drag-over look; for docs and stories. */
  dragging?: boolean;
  /** Replaces the default copy inside the zone. */
  children?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface RejectedListProps extends Pick<ValidateOptions, 'maxSize' | 'multiple' | 'maxFiles'> {
  rejected: Array<RejectedFile<{ name: string; size: number; type: string }>>;
  className?: string;
}

/** Why each file was turned away, announced politely so the drop is never silently ignored. */
export const RejectedList: React.FC<RejectedListProps> = ({ rejected, maxSize, multiple, maxFiles, className }) => {
  if (rejected.length === 0) return null;
  return (
    <ul className={['chaos-dropzone__rejected', className].filter(Boolean).join(' ')} role="status" aria-live="polite">
      {rejected.map(({ file, reason }, i) => (
        <li key={`${file.name}-${i}`} className="chaos-dropzone__rejected-item">
          <AlertCircle size={16} aria-hidden="true" />
          <span className="chaos-dropzone__rejected-name">{file.name}</span>
          <span className="chaos-dropzone__rejected-reason">{rejectionMessage(reason, { maxSize, multiple, maxFiles })}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * Drop zone for files. Dragging a file over it answers back with three signals
 * (a solid, colored border, a glow, and new copy) before anything is dropped.
 * It does not upload: it validates and hands the accepted files to `onFiles`,
 * so progress, retries and storage stay with the caller (see `UploadList`).
 * A real file input stays in the DOM, so click, Enter and Space open the picker.
 */
export const Dropzone: React.FC<DropzoneProps> = ({
  accept,
  maxSize,
  multiple = false,
  maxFiles,
  onFiles,
  onRejected,
  disabled = false,
  dragging,
  children,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  // dragenter/dragleave also fire for every child element, so a depth counter
  // tells "left the zone" apart from "moved onto a child".
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState<Array<RejectedFile<File>>>([]);
  const active = dragging ?? over;

  const accepting: ValidateOptions = { accept, maxSize, multiple, maxFiles };

  const take = (list: FileList | File[]) => {
    const result = validateFiles(Array.from(list), accepting);
    setRejected(result.rejected);
    if (result.rejected.length > 0) onRejected?.(result.rejected);
    if (result.accepted.length > 0) onFiles(result.accepted);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const hints = [
    accept ? `Erlaubt: ${accept.split(',').map((t) => t.trim()).join(', ')}` : null,
    maxSize !== undefined ? `Max. ${formatBytes(maxSize)}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className={['chaos-dropzone-wrap', className].filter(Boolean).join(' ')} style={style}>
      <div
        className="chaos-dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel ?? 'Dateien auswählen oder hierher ziehen'}
        aria-describedby={hints ? hintId : undefined}
        data-dragging={active || undefined}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          if (disabled || !hasFiles(e.dataTransfer?.types)) return;
          e.preventDefault();
          depth.current += 1;
          setOver(true);
        }}
        onDragOver={(e) => {
          if (disabled || !hasFiles(e.dataTransfer?.types)) return;
          // Without preventDefault the browser refuses the drop.
          e.preventDefault();
        }}
        onDragLeave={() => {
          if (disabled) return;
          depth.current = Math.max(0, depth.current - 1);
          if (depth.current === 0) setOver(false);
        }}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          take(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="chaos-dropzone__input"
          tabIndex={-1}
          aria-hidden="true"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) take(e.target.files);
            // Lets the same file be chosen again after it was removed.
            e.target.value = '';
          }}
        />
        {children ?? (
          <>
            <span className="chaos-dropzone__icon" aria-hidden="true"><Upload size={24} /></span>
            <span className="chaos-dropzone__title">
              {active ? 'Zum Ablegen loslassen' : multiple ? 'Dateien hierher ziehen' : 'Datei hierher ziehen'}
            </span>
            {!active && <span className="chaos-dropzone__sub">oder klicken zum Auswählen</span>}
            {hints && <span id={hintId} className="chaos-dropzone__hint">{hints}</span>}
          </>
        )}
      </div>
      <RejectedList rejected={rejected} maxSize={maxSize} multiple={multiple} maxFiles={maxFiles} />
    </div>
  );
};
