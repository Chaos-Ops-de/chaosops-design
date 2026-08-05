import { useEffect, useRef, useState } from 'react';

interface UseUnsavedChangesGuardOptions {
  /** Only track dirty state / guard closes while true (e.g. the modal is open). */
  enabled: boolean;
}

/**
 * Tracks whether any input/select/textarea inside a container has changed,
 * and gates a close action behind a confirmation prompt while dirty.
 *
 * Spread `dirtyTrackingProps` onto the container div wrapping the form fields.
 * These use React's capture-phase synthetic handlers rather than a raw
 * `addEventListener` on the DOM node, so they don't race with native event
 * bubbling. The resulting `setIsDirty` is still deferred with `setTimeout`
 * (see `markDirty`) because updating state synchronously within the same
 * event as a nested controlled input's own onChange can pre-empt that
 * handler entirely, silently dropping the keystroke.
 */
export function useUnsavedChangesGuard({ enabled }: UseUnsavedChangesGuardOptions) {
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const pendingCloseRef = useRef<(() => void) | null>(null);

  // Reset when disabled (mirrors modal close/reopen).
  useEffect(() => {
    if (!enabled) {
      setIsDirty(false);
      setShowConfirm(false);
      pendingCloseRef.current = null;
    }
  }, [enabled]);

  // Deferred to a macrotask (see doc comment above) so the field's own
  // onChange always finishes first. A microtask isn't late enough — React
  // can still be mid-dispatch for the same event at that point.
  const markDirty = () => {
    if (enabled) setTimeout(() => setIsDirty(true), 0);
  };

  const guardedClose = (onClose: () => void) => {
    if (isDirty) {
      pendingCloseRef.current = onClose;
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirm(false);
    const close = pendingCloseRef.current;
    pendingCloseRef.current = null;
    close?.();
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
    pendingCloseRef.current = null;
  };

  return {
    isDirty,
    showConfirm,
    guardedClose,
    confirmClose,
    cancelConfirm,
    dirtyTrackingProps: { onChangeCapture: markDirty, onInputCapture: markDirty },
  };
}
