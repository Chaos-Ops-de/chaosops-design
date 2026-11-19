import { describe, expect, it } from 'vitest';
import {
  clampPercent, fileKind, formatTimeLeft, hasFiles, matchesAccept, rejectionMessage, validateFiles, type FileLike,
} from './dropzoneLogic';

const f = (name: string, size = 1000, type = ''): FileLike => ({ name, size, type });

describe('dropzone/matchesAccept', () => {
  it('accepts everything when there is no accept list', () => {
    expect(matchesAccept(f('a.exe'), undefined)).toBe(true);
    expect(matchesAccept(f('a.exe'), '')).toBe(true);
    expect(matchesAccept(f('a.exe'), ' , ')).toBe(true);
  });

  it('matches an exact MIME type', () => {
    expect(matchesAccept(f('x', 1, 'application/pdf'), 'application/pdf')).toBe(true);
    expect(matchesAccept(f('x', 1, 'application/zip'), 'application/pdf')).toBe(false);
  });

  it('matches wildcard MIME types', () => {
    expect(matchesAccept(f('x', 1, 'image/png'), 'image/*')).toBe(true);
    expect(matchesAccept(f('x', 1, 'image/svg+xml'), 'image/*')).toBe(true);
    expect(matchesAccept(f('x', 1, 'video/mp4'), 'image/*')).toBe(false);
  });

  it('matches extensions case-insensitively and only at the end of the name', () => {
    expect(matchesAccept(f('Plan.PDF'), '.pdf')).toBe(true);
    expect(matchesAccept(f('plan.pdf.exe'), '.pdf')).toBe(false);
  });

  it('matches any one of several tokens, ignoring spaces and case', () => {
    const accept = ' Image/* , .PDF ,application/zip';
    expect(matchesAccept(f('a.pdf'), accept)).toBe(true);
    expect(matchesAccept(f('a', 1, 'IMAGE/JPEG'), accept)).toBe(true);
    expect(matchesAccept(f('a', 1, 'application/zip'), accept)).toBe(true);
    expect(matchesAccept(f('a.txt', 1, 'text/plain'), accept)).toBe(false);
  });
});

describe('dropzone/validateFiles', () => {
  it('accepts valid files in order', () => {
    const files = [f('a.pdf'), f('b.pdf')];
    const r = validateFiles(files, { accept: '.pdf', multiple: true });
    expect(r.accepted).toEqual(files);
    expect(r.rejected).toEqual([]);
  });

  it('rejects by type and by size with the right reason', () => {
    const r = validateFiles([f('a.png', 10, 'image/png'), f('b.png', 9_000_000, 'image/png'), f('c.zip', 10, 'application/zip')], {
      accept: 'image/*', maxSize: 5_000_000, multiple: true,
    });
    expect(r.accepted.map((x) => x.name)).toEqual(['a.png']);
    expect(r.rejected.map((x) => [x.file.name, x.reason])).toEqual([['b.png', 'size'], ['c.zip', 'type']]);
  });

  it('reports type before size when both fail', () => {
    const r = validateFiles([f('big.zip', 99, 'application/zip')], { accept: 'image/*', maxSize: 1, multiple: true });
    expect(r.rejected[0]!.reason).toBe('type');
  });

  it('keeps only the first file without multiple and rejects the rest as count', () => {
    const r = validateFiles([f('a'), f('b'), f('c')], {});
    expect(r.accepted.map((x) => x.name)).toEqual(['a']);
    expect(r.rejected.map((x) => [x.file.name, x.reason])).toEqual([['b', 'count'], ['c', 'count']]);
  });

  it('applies maxFiles with multiple, counting only accepted files', () => {
    const r = validateFiles([f('a.png', 1, 'image/png'), f('x.zip', 1, 'application/zip'), f('b.png', 1, 'image/png'), f('c.png', 1, 'image/png')], {
      accept: 'image/*', multiple: true, maxFiles: 2,
    });
    expect(r.accepted.map((x) => x.name)).toEqual(['a.png', 'b.png']);
    expect(r.rejected.map((x) => [x.file.name, x.reason])).toEqual([['x.zip', 'type'], ['c.png', 'count']]);
  });

  it('allows a file exactly at the size limit', () => {
    expect(validateFiles([f('a', 100)], { maxSize: 100 }).accepted).toHaveLength(1);
    expect(validateFiles([f('a', 101)], { maxSize: 100 }).rejected).toHaveLength(1);
  });

  it('handles an empty drop', () => {
    expect(validateFiles([], { multiple: true })).toEqual({ accepted: [], rejected: [] });
  });

  it('keeps the original file objects', () => {
    const file = f('a');
    expect(validateFiles([file]).accepted[0]).toBe(file);
  });
});

describe('dropzone/rejectionMessage', () => {
  it('names the reason in German, with the size limit when known', () => {
    expect(rejectionMessage('type')).toBe('Dateityp nicht erlaubt');
    expect(rejectionMessage('size')).toBe('Datei zu groß');
    expect(rejectionMessage('size', { maxSize: 5 * 1024 * 1024 })).toContain('max.');
    expect(rejectionMessage('count')).toBe('Nur eine Datei erlaubt');
    expect(rejectionMessage('count', { multiple: true, maxFiles: 3 })).toBe('Höchstens 3 Dateien');
  });
});

describe('dropzone/hasFiles', () => {
  it('is true only when the drag carries files', () => {
    expect(hasFiles(['Files'])).toBe(true);
    expect(hasFiles(['text/plain', 'Files'])).toBe(true);
    expect(hasFiles(['text/plain', 'text/uri-list'])).toBe(false);
    expect(hasFiles(null)).toBe(false);
    expect(hasFiles(undefined)).toBe(false);
  });
});

describe('dropzone/formatTimeLeft', () => {
  it('formats seconds', () => {
    expect(formatTimeLeft(12_000)).toBe('noch 12 s');
    expect(formatTimeLeft(11_200)).toBe('noch 12 s');
    expect(formatTimeLeft(59_000)).toBe('noch 59 s');
  });

  it('formats minutes with and without seconds', () => {
    expect(formatTimeLeft(60_000)).toBe('noch 1 Min.');
    expect(formatTimeLeft(125_000)).toBe('noch 2 Min. 5 s');
    expect(formatTimeLeft(3_599_000)).toBe('noch 59 Min. 59 s');
  });

  it('formats hours', () => {
    expect(formatTimeLeft(3_600_000)).toBe('noch 1 Std.');
    expect(formatTimeLeft(3_900_000)).toBe('noch 1 Std. 5 Min.');
  });

  it('says almost done at or below zero and is empty when unknown', () => {
    expect(formatTimeLeft(0)).toBe('gleich fertig');
    expect(formatTimeLeft(-5)).toBe('gleich fertig');
    expect(formatTimeLeft(null)).toBe('');
    expect(formatTimeLeft(undefined)).toBe('');
    expect(formatTimeLeft(NaN)).toBe('');
  });
});

describe('dropzone/clampPercent', () => {
  it('rounds and clamps to 0-100', () => {
    expect(clampPercent(42.4)).toBe(42);
    expect(clampPercent(-3)).toBe(0);
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(undefined)).toBe(0);
    expect(clampPercent(NaN)).toBe(0);
  });
});

describe('dropzone/fileKind', () => {
  it('picks an icon kind by MIME type, falling back to the extension', () => {
    expect(fileKind(f('a.png', 1, 'image/png'))).toBe('image');
    expect(fileKind(f('photo.HEIC'))).toBe('image');
    expect(fileKind(f('a.pdf', 1, 'application/pdf'))).toBe('document');
    expect(fileKind(f('notes.docx'))).toBe('document');
    expect(fileKind(f('data.csv', 1, 'text/csv'))).toBe('document');
    expect(fileKind(f('bundle.zip', 1, 'application/zip'))).toBe('file');
  });
});
