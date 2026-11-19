import React, { useId, useMemo } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Skeleton } from '../Skeleton';
import { tabularNumsCss } from '../../tokens/typography';
import {
  EMPTY_CELL, ariaSortFor, cardRoles, cycleSort, flipDirection, formatCell, pinOffsets, shouldTruncate, sortOptions, sortRows,
  type CardRole, type SortState,
} from './dataTableLogic';
import './DataTable.css';

export type DataTableDensity = 'compact' | 'default' | 'comfortable';
export type DataTableAlign = 'start' | 'end' | 'center';

export interface DataTableColumn<T> {
  /** Reads `row[key]` unless `value` is given; also the sort key. */
  key: string;
  header: React.ReactNode;
  /** Plain text for the phone card and the sort control. Falls back to `header` when that is a string. */
  label?: string;
  /** Custom cell content; empty results show an en dash. */
  render?: (row: T) => React.ReactNode;
  /** Overrides `row[key]` for sorting and plain-text cells. */
  value?: (row: T) => unknown;
  align?: DataTableAlign;
  /** Right-aligned with tabular figures; never truncates. */
  numeric?: boolean;
  /** Pixel number, or any CSS width. A number also lets a later pinned column sit next to this one. */
  width?: number | string;
  sortable?: boolean;
  /** Clip long text with an ellipsis and show it in a native tooltip. Ignored for `numeric` columns. */
  truncate?: boolean;
  /** Keeps the column in view while the table scrolls sideways. */
  pin?: boolean;
  /** In the phone card, print "Header: value" for this column (use it for values that are ambiguous alone). */
  cardLabel?: boolean;
}

export interface DataTableProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: readonly T[];
  getRowId: (row: T, index: number) => string;
  /** Row height: compact 40, default 48, comfortable 56. */
  density?: DataTableDensity;
  /** Controlled sort. Only the sorted column shows an arrow. */
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Rows arrive already ordered (server-side sort): the table only shows the arrow. */
  manualSort?: boolean;
  /** Locale for text sorting. */
  locale?: string;
  /** Shown at the end of each row: on hover or focus with a mouse, always on touch. */
  rowActions?: (row: T) => React.ReactNode;
  /** Makes rows clickable (and keyboard-reachable). Clicks on buttons and links inside a row do not fire it. */
  onRowClick?: (row: T) => void;
  /** Zebra rows, on wide tables only. Off by default: hover and hairlines carry the row. */
  striped?: boolean;
  /** Visible table title. Without one, pass `aria-label`. */
  caption?: React.ReactNode;
  'aria-label'?: string;
  /** Renders skeleton rows. Delay showing it (about 300 ms) in the caller. */
  loading?: boolean;
  loadingRows?: number;
  /** Shown when there are no rows. */
  emptyState?: React.ReactNode;
  /** Scrolls the body inside the table so the header can stay put (CSS length). */
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const alignClass = (column: Pick<DataTableColumn<unknown>, 'align' | 'numeric'>) =>
  `chaos-dt--${column.align ?? (column.numeric ? 'end' : 'start')}`;

function readValue<T>(row: T, column: DataTableColumn<T>): unknown {
  return column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
}

const labelOf = <T,>(column: DataTableColumn<T>): string | undefined =>
  column.label ?? (typeof column.header === 'string' ? column.header : undefined);

/** Whether a click started on something that has its own behavior inside a row. */
const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && target.closest('button, a, input, select, textarea, label, [role="button"]') !== null;

/**
 * Data table: numbers right-aligned in tabular figures, one hairline between
 * rows, hover highlight, a sticky header, optional pinned columns and row
 * actions that appear on hover. Below 640 px of its own width (a container
 * query, not the viewport) every row becomes a card: the first column names
 * it, the first numeric column sits top right, and sorting moves to a
 * control above the cards.
 *
 * Needs a block-level parent: the wrapper is an inline-size container.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  density = 'default',
  sort = null,
  onSortChange,
  manualSort = false,
  locale = 'de-DE',
  rowActions,
  onRowClick,
  striped = false,
  caption,
  'aria-label': ariaLabel,
  loading = false,
  loadingRows = 5,
  emptyState,
  maxHeight,
  className,
  style,
}: DataTableProps<T>) {
  const sortId = useId();
  const roles = useMemo(() => cardRoles(columns), [columns]);
  const offsets = useMemo(() => pinOffsets(columns), [columns]);
  const sortChoices = useMemo(() => sortOptions(columns), [columns]);
  const shown = useMemo(
    () => (manualSort ? [...rows] : sortRows(rows, columns, sort, locale)),
    [rows, columns, sort, manualSort, locale],
  );
  const columnCount = columns.length + (rowActions ? 1 : 0);
  // A body that scrolls (or pins columns) must be reachable by keyboard.
  const scrollable = maxHeight !== undefined || columns.some((c) => c.pin);

  const pinStyle = (key: string): React.CSSProperties | undefined =>
    key in offsets ? ({ '--chaos-dt-pin-offset': `${offsets[key]}px` } as React.CSSProperties) : undefined;

  const cardRole = (key: string): CardRole => roles[key] ?? 'rest';

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div
      className={['chaos-dt', className].filter(Boolean).join(' ')}
      data-density={density}
      style={style}
    >
      {onSortChange && sortChoices.length > 0 && (
        <div className="chaos-dt__cardsort">
          <label className="chaos-dt__cardsort-label" htmlFor={sortId}>Sortieren nach</label>
          <select
            id={sortId}
            className="chaos-dt__cardsort-select"
            value={sort?.key ?? ''}
            onChange={(e) =>
              onSortChange(e.target.value === '' ? null : { key: e.target.value, direction: sort?.direction ?? 'asc' })
            }
          >
            <option value="">Keine Sortierung</option>
            {sortChoices.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="chaos-dt__cardsort-dir"
            disabled={!sort}
            aria-label={sort?.direction === 'desc' ? 'Aufsteigend sortieren' : 'Absteigend sortieren'}
            onClick={() => sort && onSortChange({ key: sort.key, direction: flipDirection(sort.direction) })}
          >
            {sort?.direction === 'desc' ? <ArrowDown size={18} aria-hidden="true" /> : <ArrowUp size={18} aria-hidden="true" />}
          </button>
        </div>
      )}

      <div
        className="chaos-dt__scroll"
        data-striped={striped || undefined}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'region' : undefined}
        aria-label={scrollable ? (ariaLabel ?? 'Tabelle') : undefined}
      >
        {/* Explicit roles: the card layout sets display:block on table parts, which would drop table semantics in some screen readers. */}
        <table className="chaos-dt__table" role="table" aria-label={caption ? undefined : ariaLabel} aria-busy={loading || undefined}>
          {caption && <caption className="chaos-dt__caption">{caption}</caption>}
          <thead role="rowgroup">
            <tr role="row">
              {columns.map((column) => {
                const canSort = Boolean(column.sortable && onSortChange);
                const active = sort?.key === column.key;
                const Icon = active ? (sort!.direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    role="columnheader"
                    className={['chaos-dt__th', alignClass(column), canSort ? 'chaos-dt__th--sortable' : ''].filter(Boolean).join(' ')}
                    aria-sort={column.sortable ? ariaSortFor(sort, column.key) : undefined}
                    data-pinned={column.key in offsets || undefined}
                    style={{ width: column.width, ...pinStyle(column.key) }}
                  >
                    {canSort ? (
                      <button type="button" className="chaos-dt__sort" onClick={() => onSortChange!(cycleSort(sort, column.key))}>
                        <span>{column.header}</span>
                        <Icon
                          size={14}
                          aria-hidden="true"
                          className={['chaos-dt__sort-icon', active ? '' : 'chaos-dt__sort-icon--quiet'].filter(Boolean).join(' ')}
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {rowActions && (
                <th scope="col" role="columnheader" className="chaos-dt__th chaos-dt__th--actions">
                  <span className="chaos-dt__sr-only">Aktionen</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody role="rowgroup">
            {loading &&
              Array.from({ length: loadingRows }, (_, i) => (
                <tr key={`loading-${i}`} role="row" className="chaos-dt__row chaos-dt__row--loading">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      role="cell"
                      className={['chaos-dt__td', alignClass(column)].join(' ')}
                      data-card-role={cardRole(column.key)}
                    >
                      <Skeleton variant="bar" height={12} width={column.numeric ? '40%' : '75%'} style={column.numeric ? { marginInlineStart: 'auto' } : undefined} />
                    </td>
                  ))}
                  {rowActions && <td role="cell" className="chaos-dt__td" data-card-role="actions" />}
                </tr>
              ))}

            {!loading && shown.length === 0 && (
              <tr role="row" className="chaos-dt__row chaos-dt__row--empty">
                <td role="cell" className="chaos-dt__td chaos-dt__td--empty" colSpan={columnCount} data-card-role="empty">
                  {emptyState ?? <p className="chaos-dt__empty-text">Keine Einträge</p>}
                </td>
              </tr>
            )}

            {!loading &&
              shown.map((row, index) => {
                const clickable = Boolean(onRowClick);
                return (
                  <tr
                    key={getRowId(row, index)}
                    role="row"
                    className={['chaos-dt__row', clickable ? 'chaos-dt__row--clickable' : ''].filter(Boolean).join(' ')}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? (e) => { if (!isInteractiveTarget(e.target)) onRowClick!(row); } : undefined}
                    onKeyDown={clickable ? (e) => handleRowKeyDown(e, row) : undefined}
                  >
                    {columns.map((column) => {
                      const raw = readValue(row, column);
                      const truncate = shouldTruncate(column);
                      const rendered = column.render ? column.render(row) : undefined;
                      const hasRendered = rendered !== undefined && rendered !== null && rendered !== '';
                      const content: React.ReactNode = column.render ? (hasRendered ? rendered : EMPTY_CELL) : formatCell(raw);
                      const title = truncate ? (typeof content === 'string' ? content : formatCell(raw)) : undefined;
                      return (
                        <td
                          key={column.key}
                          role="cell"
                          className={['chaos-dt__td', alignClass(column), column.numeric ? 'chaos-dt__td--numeric' : ''].filter(Boolean).join(' ')}
                          data-card-role={cardRole(column.key)}
                          data-label={labelOf(column)}
                          data-card-label={column.cardLabel || undefined}
                          data-pinned={column.key in offsets || undefined}
                          style={{ ...(column.numeric ? tabularNumsCss : null), ...pinStyle(column.key) }}
                        >
                          {truncate ? <span className="chaos-dt__text--truncate" title={title}>{content}</span> : content}
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td role="cell" className="chaos-dt__td chaos-dt__actions" data-card-role="actions">
                        <div className="chaos-dt__actions-inner">{rowActions(row)}</div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
