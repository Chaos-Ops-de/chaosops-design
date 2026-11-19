import { describe, expect, it } from 'vitest';
import * as web from './emptyStateContent';
import * as shared from '../../utils/emptyState';

describe('web emptyStateContent re-export', () => {
  it('exposes the shared copy and content function unchanged', () => {
    expect(web.emptyStateCopy).toBe(shared.emptyStateCopy);
    expect(web.emptyStateContent).toBe(shared.emptyStateContent);
  });
});
