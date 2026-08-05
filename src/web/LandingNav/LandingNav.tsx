import React, { useState } from 'react';
import { LogIn, Menu, X, Monitor } from 'lucide-react';
import './LandingNav.css';

const navLinks = [
  { label: 'Über uns', to: '/about' },
  { label: 'Dokumentation', to: '/documentation' },
  { label: 'Changelog', to: '/changelog' },
  { label: 'Kontakt', to: '/contact' },
];

export interface LandingNavProps {
  /** URL of the Chaos Ops logo (app-specific bundler resolves the path). */
  logoSrc: string;
  /** Current route path, used to highlight the active nav link. */
  activePath: string;
  /** Navigates within the current app (e.g. react-router's navigate). */
  onNavigate: (to: string) => void;
  /** Called instead of onNavigate('/register-display') when set — for apps where this route lives on another origin. */
  onRegisterDisplayClick?: () => void;
  /** Called instead of onNavigate('/login') when set — for apps where this route lives on another origin. */
  onLoginClick?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  logoSrc,
  activePath,
  onNavigate,
  onRegisterDisplayClick,
  onLoginClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const goToRegisterDisplay = onRegisterDisplayClick ?? (() => onNavigate('/register-display'));
  const goToLogin = onLoginClick ?? (() => onNavigate('/login'));

  return (
    <nav className="chaos-landing-navbar" aria-label="Hauptnavigation">
      <button
        className="chaos-landing-nav-logo-btn"
        onClick={() => { onNavigate('/'); setMenuOpen(false); }}
        aria-label="Zur Startseite"
      >
        <img src={logoSrc} alt="Chaos Ops" className="chaos-landing-nav-logo" />
      </button>

      {/* Desktop links */}
      <ul className="chaos-landing-nav-links" role="list">
        {navLinks.map(({ label, to }) => (
          <li key={to}>
            <button
              className={`chaos-landing-nav-link ${activePath === to ? 'chaos-landing-nav-link--active' : ''}`}
              onClick={() => onNavigate(to)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="chaos-landing-nav-display-btn"
        onClick={() => { goToRegisterDisplay(); setMenuOpen(false); }}
      >
        <Monitor size={14} />
        Display registrieren
      </button>

      <button
        className="chaos-landing-nav-login-btn"
        onClick={() => { goToLogin(); setMenuOpen(false); }}
      >
        <LogIn size={14} />
        Anmelden
      </button>

      {/* Mobile hamburger */}
      <button
        className="chaos-landing-nav-hamburger"
        onClick={() => setMenuOpen(v => !v)}
        aria-expanded={menuOpen}
        aria-label="Menü öffnen"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="chaos-landing-nav-mobile-menu" role="dialog" aria-label="Navigation">
          <ul role="list">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <button
                  className={`chaos-landing-nav-mobile-link ${activePath === to ? 'chaos-landing-nav-mobile-link--active' : ''}`}
                  onClick={() => { onNavigate(to); setMenuOpen(false); }}
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <button
                className="chaos-landing-nav-mobile-display-btn"
                onClick={() => { goToRegisterDisplay(); setMenuOpen(false); }}
              >
                <Monitor size={14} />
                Display registrieren
              </button>
            </li>
            <li>
              <button
                className="chaos-landing-nav-mobile-login-btn"
                onClick={() => { goToLogin(); setMenuOpen(false); }}
              >
                <LogIn size={14} />
                Anmelden
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
