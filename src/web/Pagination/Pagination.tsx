import React from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { pageItems, pageRange } from './paginationLogic';
import './Pagination.css';

/*
 * Paging is controlled: pass `page` and `onPageChange`. Nothing here reads or
 * writes the URL — keep the page number in the address bar yourself so page
 * 500 is a link you can share or refresh. Prefer cursor-based paging
 * ("after this id") on the server: offset paging shifts when a row is added
 * and shows the same item twice.
 */

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one (default 1). Use 0 on narrow phones. */
  siblings?: number;
  /** Accessible name of the nav landmark. */
  'aria-label'?: string;
  className?: string;
}

/** Numbered page links: first, gap, current with siblings, gap, last. */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
  'aria-label': ariaLabel = 'Seiten',
  className,
}) => {
  const count = Math.max(1, Math.floor(totalPages));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const items = pageItems({ page: current, totalPages: count, siblings });

  return (
    <nav className={['chaos-pagination', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <ul className="chaos-pagination__list">
        <li>
          <button
            type="button"
            className="chaos-pagination__btn"
            onClick={() => onPageChange(current - 1)}
            disabled={current <= 1}
            aria-label="Vorherige Seite"
          >
            <ChevronLeft size={18} className="chaos-pagination__icon" aria-hidden="true" />
          </button>
        </li>
        {items.map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} className="chaos-pagination__gap" aria-hidden="true">…</li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={['chaos-pagination__btn', item === current ? 'chaos-pagination__btn--current' : ''].filter(Boolean).join(' ')}
                onClick={() => onPageChange(item)}
                aria-label={`Seite ${item}`}
                aria-current={item === current ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="chaos-pagination__btn"
            onClick={() => onPageChange(current + 1)}
            disabled={current >= count}
            aria-label="Nächste Seite"
          >
            <ChevronRight size={18} className="chaos-pagination__icon" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export interface PaginationSummaryProps {
  page: number;
  pageSize: number;
  total: number;
  className?: string;
}

/** "1–25 von 100" with tabular figures. Renders nothing when there are no rows. */
export const PaginationSummary: React.FC<PaginationSummaryProps> = ({ page, pageSize, total, className }) => {
  if (total <= 0) return null;
  const { from, to } = pageRange(page, pageSize, total);
  return (
    <span className={['chaos-pagination-summary', className].filter(Boolean).join(' ')}>
      {from}–{to} von {total}
    </span>
  );
};

export interface LoadMoreButtonProps {
  onLoadMore: () => void;
  /** A page is being fetched: keeps the width, blocks clicks. */
  loading?: boolean;
  /** Nothing left to load: the button is replaced by a quiet note. */
  done?: boolean;
  label?: string;
  doneLabel?: string;
  className?: string;
}

/** "Mehr laden" for lists where the user wants control, or as the footer of a feed. */
export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onLoadMore,
  loading = false,
  done = false,
  label = 'Mehr laden',
  doneLabel = 'Alles geladen',
  className,
}) => {
  const classes = ['chaos-load-more', className].filter(Boolean).join(' ');
  if (done) {
    return (
      <p className={`${classes} chaos-load-more--done`} role="status">
        <Check size={16} aria-hidden="true" />
        {doneLabel}
      </p>
    );
  }
  return (
    <div className={classes}>
      <Button variant="outline" loading={loading} onClick={onLoadMore}>
        {label}
      </Button>
    </div>
  );
};
