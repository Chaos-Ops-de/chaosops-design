import React from 'react';
import './ChangelogEntries.css';

export type ChangelogTag = 'neu' | 'verbessert' | 'behoben';

export interface ChangelogEntry {
  id: string;
  date: string; // ISO "YYYY-MM-DD"
  tag: ChangelogTag;
  title: string;
  description: string;
}

const TAG_LABELS: Record<ChangelogTag, string> = {
  neu: 'Neu',
  verbessert: 'Verbessert',
  behoben: 'Behoben',
};

const TAG_CLASS: Record<ChangelogTag, string> = {
  neu: 'chaos-changelog-tag--neu',
  verbessert: 'chaos-changelog-tag--verbessert',
  behoben: 'chaos-changelog-tag--behoben',
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number) as [number, number, number];
  return new Date(year, month - 1, day).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export interface ChangelogEntriesProps {
  entries: ChangelogEntry[];
}

export const ChangelogEntries: React.FC<ChangelogEntriesProps> = ({ entries }) => {
  if (entries.length === 0) {
    return <p className="chaos-changelog-empty">Noch keine Einträge.</p>;
  }

  return (
    <ul className="chaos-changelog-list">
      {entries.map((entry) => (
        <li key={entry.id} className="chaos-changelog-entry">
          <div className="chaos-changelog-entry__header">
            <span className={`chaos-changelog-tag ${TAG_CLASS[entry.tag]}`}>
              {TAG_LABELS[entry.tag]}
            </span>
            <time className="chaos-changelog-date" dateTime={entry.date}>
              {formatDate(entry.date)}
            </time>
          </div>
          <h3 className="chaos-changelog-title">{entry.title}</h3>
          <p className="chaos-changelog-description">{entry.description}</p>
        </li>
      ))}
    </ul>
  );
};
