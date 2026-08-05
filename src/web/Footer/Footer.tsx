import React from 'react';
import { PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export interface FooterProps {
  /** Where the "Chaos Ops. Organisiere, Plane, Zeige!" tagline links to. */
  logoHref: string;
}

export const Footer: React.FC<FooterProps> = ({ logoHref }) => (
    <footer
        className="chaos-app-footer"
        style={{
            width: '100%',
            background: 'var(--chaos-bg)',
            borderRadius: '0 0 1.2rem 1.2rem',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '0.5rem',
            paddingTop: '0.5rem',
        }}
    >
        <div style={{ cursor: 'pointer' }} onClick={() => window.location.href = logoHref}>
            <span className="chaos-app-footer-icon" aria-hidden="true"><PenLine size={20} /></span>
            <span style={{ fontWeight: 700, letterSpacing: '0.01em' }}>Chaos Ops. Organisiere, Plane, Zeige!</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
            <Link to="/impressum" style={{ color: 'var(--chaos-ink)', fontSize: '0.95rem', textDecoration: 'underline', opacity: 0.9 }}>Impressum</Link>
            <Link to="/agb" style={{ color: 'var(--chaos-ink)', fontSize: '0.95rem', textDecoration: 'underline', opacity: 0.9 }}>AGB</Link>
            <Link to="/dsgvo" style={{ color: 'var(--chaos-ink)', fontSize: '0.95rem', textDecoration: 'underline', opacity: 0.9 }}>Datenschutz</Link>
        </div>
    </footer>
);
