import React from 'react';
import '../surface.css';
import './RankedList.css';

export interface RankedListItem {
  key: string;
  label: string;
  count: number;
  /** Optional icon / thumbnail, shown in a mint outlined tile. */
  icon?: React.ReactNode;
}

export interface RankedListProps {
  title?: string;
  items: RankedListItem[];
  /** Appended to each count, e.g. "x" gives "3x". */
  countSuffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** "Most widely used" list: icon tile, label and a bold count per row, sorted by count (highest first). */
export const RankedList: React.FC<RankedListProps> = ({ title, items, countSuffix = 'x', className, style }) => {
  const sorted = [...items].sort((a, b) => b.count - a.count);
  return (
    <section className={['chaos-surface', 'chaos-ranked-list', className].filter(Boolean).join(' ')} style={style}>
      {title && <h3 className="chaos-surface__title chaos-ranked-list__title">{title}</h3>}
      <ol className="chaos-ranked-list__items">
        {sorted.map((item) => (
          <li key={item.key} className="chaos-ranked-list__row">
            {item.icon != null && <span className="chaos-ranked-list__tile">{item.icon}</span>}
            <span className="chaos-ranked-list__label">{item.label}</span>
            <strong className="chaos-ranked-list__count">{item.count}{countSuffix}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
};
