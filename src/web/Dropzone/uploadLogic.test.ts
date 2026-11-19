import { describe, expect, it } from 'vitest';
import { estimateRemainingMs, nextToStart, progressFromEvent, uploadErrorMessage } from './uploadLogic';

const item = (status: 'queued' | 'uploading' | 'done' | 'error') => ({ status });

describe('web/Dropzone uploadLogic nextToStart', () => {
  it('starts queued files up to the concurrency limit, in list order', () => {
    const items = [item('queued'), item('queued'), item('queued'), item('queued'), item('queued')];
    expect(nextToStart(items, 3)).toEqual([0, 1, 2]);
  });

  it('counts running uploads against the limit', () => {
    const items = [item('uploading'), item('queued'), item('uploading'), item('queued'), item('queued')];
    expect(nextToStart(items, 3)).toEqual([1]);
  });

  it('starts nothing when the limit is reached', () => {
    expect(nextToStart([item('uploading'), item('uploading'), item('queued')], 2)).toEqual([]);
  });

  it('ignores done and failed files, so one failure never blocks the rest', () => {
    const items = [item('error'), item('done'), item('queued'), item('queued')];
    expect(nextToStart(items, 2)).toEqual([2, 3]);
  });

  it('treats a limit below one as one', () => {
    expect(nextToStart([item('queued'), item('queued')], 0)).toEqual([0]);
  });

  it('handles an empty list', () => {
    expect(nextToStart([], 3)).toEqual([]);
  });
});

describe('web/Dropzone uploadLogic progress', () => {
  it('rounds loaded over total to a whole percent', () => {
    expect(progressFromEvent(1, 3)).toBe(33);
    expect(progressFromEvent(50, 100)).toBe(50);
  });

  it('clamps and guards unknown totals', () => {
    expect(progressFromEvent(150, 100)).toBe(100);
    expect(progressFromEvent(-5, 100)).toBe(0);
    expect(progressFromEvent(10, 0)).toBe(0);
    expect(progressFromEvent(Number.NaN, 100)).toBe(0);
  });
});

describe('web/Dropzone uploadLogic estimateRemainingMs', () => {
  it('has no estimate before there is enough signal', () => {
    expect(estimateRemainingMs(0, 400, 50)).toBeNull();
    expect(estimateRemainingMs(0, 5000, 0)).toBeNull();
    expect(estimateRemainingMs(0, 5000, 0.4)).toBeNull();
  });

  it('extrapolates from the pace so far', () => {
    // 25% in 2 s -> 75% left at the same pace -> 6 s
    expect(estimateRemainingMs(0, 2000, 25)).toBe(6000);
    expect(estimateRemainingMs(1000, 3000, 50)).toBe(2000);
  });

  it('is zero when complete', () => {
    expect(estimateRemainingMs(0, 4000, 100)).toBe(0);
  });
});

describe('web/Dropzone uploadLogic uploadErrorMessage', () => {
  it('names the common failures in German', () => {
    expect(uploadErrorMessage(413)).toContain('zu groß');
    expect(uploadErrorMessage(403)).toBe('Keine Berechtigung');
    expect(uploadErrorMessage(504)).toBe('Zeitüberschreitung');
    expect(uploadErrorMessage(500)).toBe('Serverfehler (500)');
    expect(uploadErrorMessage(422)).toBe('Upload abgelehnt (422)');
  });
});
