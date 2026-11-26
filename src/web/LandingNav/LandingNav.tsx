import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './LandingNav.css';

const navLinks = [
  { label: 'Über uns', to: '/about' },
  { label: 'Dokumentation', to: '/documentation' },
  { label: 'Changelog', to: '/changelog' },
  { label: 'Kontakt', to: '/contact' },
];

/**
 * Plain left-clicks navigate in-app; modified clicks (new tab, etc.) fall
 * through to the browser. Links are real <a href> so crawlers can follow them.
 */
const handleLinkClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  to: string,
  onNavigate: (to: string) => void,
  after?: () => void,
) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  onNavigate(to);
  after?.();
};

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
    <div className="chaos-landing-navbar-sticky">
      <nav className="chaos-landing-navbar" aria-label="Hauptnavigation">
        <span className="chaos-landing-nav-tape" aria-hidden="true" />

        <a
          href="/"
          className="chaos-landing-nav-logo-btn"
          onClick={(e) => handleLinkClick(e, '/', onNavigate, () => setMenuOpen(false))}
          aria-label="Zur Startseite"
        >
          <img src={logoSrc} alt="Chaos Ops" className="chaos-landing-nav-logo" />
        </a>

        {/* Desktop links */}
        <ul className="chaos-landing-nav-links" role="list">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <a
                href={to}
                className={`chaos-landing-nav-link ${activePath === to ? 'chaos-landing-nav-link--active' : ''}`}
                aria-current={activePath === to ? 'page' : undefined}
                onClick={(e) => handleLinkClick(e, to, onNavigate)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="chaos-landing-nav-actions">
          {/* Language switcher — visual only for now; no i18n backing yet. */}
          <div className="chaos-landing-nav-locale" role="group" aria-label="Sprache">
            <span className="chaos-landing-nav-locale-active">DE</span>
            <span className="chaos-landing-nav-locale-sep">/</span>
            <span className="chaos-landing-nav-locale-disabled" aria-disabled="true" title="Bald verfügbar">EN</span>
          </div>

          <button
            className="chaos-landing-nav-display-btn"
            onClick={() => { goToRegisterDisplay(); setMenuOpen(false); }}
          >
            Display registrieren
          </button>

          <button
            className="chaos-landing-nav-login-btn"
            onClick={() => { goToLogin(); setMenuOpen(false); }}
          >
            Anmelden
          </button>
        </div>

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
                  <a
                    href={to}
                    className={`chaos-landing-nav-mobile-link ${activePath === to ? 'chaos-landing-nav-mobile-link--active' : ''}`}
                    aria-current={activePath === to ? 'page' : undefined}
                    onClick={(e) => handleLinkClick(e, to, onNavigate, () => setMenuOpen(false))}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="chaos-landing-nav-locale chaos-landing-nav-locale--mobile" role="group" aria-label="Sprache">
              <span className="chaos-landing-nav-locale-active">DE</span>
              <span className="chaos-landing-nav-locale-sep">/</span>
              <span className="chaos-landing-nav-locale-disabled" aria-disabled="true" title="Bald verfügbar">EN</span>
            </div>
            <button
              className="chaos-landing-nav-mobile-display-btn"
              onClick={() => { goToRegisterDisplay(); setMenuOpen(false); }}
            >
              Display registrieren
            </button>
            <button
              className="chaos-landing-nav-mobile-login-btn"
              onClick={() => { goToLogin(); setMenuOpen(false); }}
            >
              Anmelden
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};
