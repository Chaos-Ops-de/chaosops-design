import { describe, expect, it } from 'vitest';
import { emptyStateContent, emptyStateCopy, type EmptyStateKind } from './emptyState';

const kinds: EmptyStateKind[] = ['firstRun', 'noResults', 'error', 'filtered'];

describe('emptyStateCopy', () => {
  it('has distinct copy for each of the four kinds', () => {
    const titles = kinds.map((k) => emptyStateCopy[k].title);
    expect(new Set(titles).size).toBe(4);
    for (const k of kinds) {
      expect(emptyStateCopy[k].title).toBeTruthy();
      expect(emptyStateCopy[k].description).toBeTruthy();
    }
  });
});

describe('emptyStateContent', () => {
  it('returns the default copy for a kind', () => {
    expect(emptyStateContent('error')).toEqual(emptyStateCopy.error);
  });

  it('lets overrides win field by field', () => {
    const out = emptyStateContent('firstRun', { title: 'Noch keine Events' });
    expect(out.title).toBe('Noch keine Events');
    expect(out.description).toBe(emptyStateCopy.firstRun.description);
  });

  it('falls back to noResults for an unknown kind', () => {
    expect(emptyStateContent('nope' as EmptyStateKind)).toEqual(emptyStateCopy.noResults);
  });
});
