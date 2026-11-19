import { describe, expect, it } from 'vitest';
import { pageItems, pageRange, totalPages } from './paginationLogic';

describe('web/Pagination totalPages', () => {
  it('rounds up and never drops below one page', () => {
    expect(totalPages(100, 25)).toBe(4);
    expect(totalPages(101, 25)).toBe(5);
    expect(totalPages(0, 25)).toBe(1);
    expect(totalPages(10, 0)).toBe(1);
  });
});

describe('web/Pagination pageRange', () => {
  it('returns the 1-based row span of a page', () => {
    expect(pageRange(1, 25, 100)).toEqual({ from: 1, to: 25 });
    expect(pageRange(4, 25, 100)).toEqual({ from: 76, to: 100 });
  });

  it('ends on the last row of a partial page', () => {
    expect(pageRange(5, 25, 101)).toEqual({ from: 101, to: 101 });
  });

  it('is 0–0 with no rows and clamps an out-of-range page', () => {
    expect(pageRange(1, 25, 0)).toEqual({ from: 0, to: 0 });
    expect(pageRange(99, 25, 30)).toEqual({ from: 26, to: 30 });
    expect(pageRange(0, 25, 30)).toEqual({ from: 1, to: 25 });
  });
});

describe('web/Pagination pageItems', () => {
  it('is a single page for one page', () => {
    expect(pageItems({ page: 1, totalPages: 1 })).toEqual([1]);
    expect(pageItems({ page: 5, totalPages: 0 })).toEqual([1]);
  });

  it('lists every page when they all fit', () => {
    expect(pageItems({ page: 1, totalPages: 2 })).toEqual([1, 2]);
    expect(pageItems({ page: 4, totalPages: 7 })).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses the right side near the start', () => {
    expect(pageItems({ page: 1, totalPages: 20 })).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageItems({ page: 4, totalPages: 20 })).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
  });

  it('collapses both sides in the middle', () => {
    expect(pageItems({ page: 10, totalPages: 20 })).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    expect(pageItems({ page: 5, totalPages: 20 })).toEqual([1, 'gap', 4, 5, 6, 'gap', 20]);
  });

  it('collapses the left side near the end', () => {
    expect(pageItems({ page: 20, totalPages: 20 })).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    expect(pageItems({ page: 17, totalPages: 20 })).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });

  it('shows the single page a gap would have replaced', () => {
    // 8 pages, page 5: a left gap would hide only pages 2-3 (two), the right shows 6 7 8.
    expect(pageItems({ page: 5, totalPages: 8 })).toEqual([1, 'gap', 4, 5, 6, 7, 8]);
    // 8 pages, page 4: left side has 2 and 3, no gap for one page.
    expect(pageItems({ page: 4, totalPages: 8 })).toEqual([1, 2, 3, 4, 5, 'gap', 8]);
  });

  it('keeps first and last reachable and never renders hundreds of links (500 pages)', () => {
    for (const page of [1, 2, 250, 499, 500]) {
      const items = pageItems({ page, totalPages: 500 });
      expect(items[0]).toBe(1);
      expect(items[items.length - 1]).toBe(500);
      expect(items.length).toBeLessThanOrEqual(7);
      expect(items).toContain(page);
    }
  });

  it('keeps a constant length for every page once collapsed', () => {
    for (const siblings of [0, 1, 2]) {
      for (const total of [8, 9, 12, 40, 500]) {
        if (total <= 2 * siblings + 5) continue;
        for (let page = 1; page <= total; page++) {
          expect(pageItems({ page, totalPages: total, siblings })).toHaveLength(2 * siblings + 5);
        }
      }
    }
  });

  it('never has a gap standing in for one page, adjacent gaps, or out-of-order pages', () => {
    for (const total of [8, 10, 25, 100]) {
      for (let page = 1; page <= total; page++) {
        const items = pageItems({ page, totalPages: total });
        let last = 0;
        items.forEach((item, i) => {
          if (item === 'gap') {
            const next = items[i + 1];
            expect(typeof next).toBe('number');
            expect((next as number) - last).toBeGreaterThan(2);
          } else {
            expect(item).toBeGreaterThan(last);
            last = item;
          }
        });
      }
    }
  });

  it('clamps an out-of-range current page and supports siblings of 0 and 2', () => {
    expect(pageItems({ page: 99, totalPages: 20 })).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    expect(pageItems({ page: 10, totalPages: 20, siblings: 0 })).toEqual([1, 'gap', 10, 'gap', 20]);
    expect(pageItems({ page: 10, totalPages: 20, siblings: 2 })).toEqual([1, 'gap', 8, 9, 10, 11, 12, 'gap', 20]);
  });
});
