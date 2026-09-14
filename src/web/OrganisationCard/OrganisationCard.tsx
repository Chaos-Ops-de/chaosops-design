import React from 'react';
import './OrganisationCard.css';

export interface OrganisationCardProps {
  name: string;
  description?: string;
  /** Fully-resolved logo URL — the caller resolves it against its own API base URL. */
  logoUrl?: string | null;
  selected?: boolean;
  onClick: () => void;
}

export const OrganisationCard: React.FC<OrganisationCardProps> = ({ name, description, logoUrl, selected, onClick }) => {
  return (
    <button
      className={selected ? 'chaos-org-card chaos-org-card--selected' : 'chaos-org-card'}
      onClick={onClick}
      aria-pressed={selected}
      tabIndex={0}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: logoUrl ? '0.5rem' : '0' }}>
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${name} Logo`}
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              borderRadius: 'var(--chaos-radius-sm)',
              flexShrink: 0
            }}
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div style={{ fontWeight: '700' }}>{name}</div>
      </div>
      {description && <div className="chaos-org-card__description">{description}</div>}
    </button>
  );
};
