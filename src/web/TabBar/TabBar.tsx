import React from 'react';
import './TabBar.css';

export interface TabBarItem {
  key: string;
  label: string;
  /** Icon node. */
  icon: React.ReactNode;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Floating mint pill tab bar; the active tab sits in an amber outlined circle. For content tabs use `Tabs`. */
export const TabBar: React.FC<TabBarProps> = ({ items, activeKey, onChange, 'aria-label': ariaLabel, className, style }) => (
  <div role="tablist" aria-label={ariaLabel} className={['chaos-tab-bar', className].filter(Boolean).join(' ')} style={style}>
    {items.map((item) => {
      const active = item.key === activeKey;
      return (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={active}
          aria-label={item.label}
          title={item.label}
          className="chaos-tab-bar__tab"
          onClick={() => onChange(item.key)}
        >
          <span className={`chaos-tab-bar__icon${active ? ' chaos-tab-bar__icon--active' : ''}`}>{item.icon}</span>
        </button>
      );
    })}
  </div>
);
