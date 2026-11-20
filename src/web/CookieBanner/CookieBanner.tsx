import React, { useCallback, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Cookie } from 'lucide-react';
import './CookieBanner.css';

const COOKIE_KEY = 'cookieConsent';

export type CookieConsent = 'accepted' | 'necessary';

/** Stored choice, or null if the visitor has not decided yet (or storage is unavailable). */
export function getCookieConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(COOKIE_KEY);
    return value === 'accepted' || value === 'necessary' ? value : null;
  } catch {
    return null;
  }
}

export interface CookieBannerProps {
  /** Link to the privacy policy; the link is hidden when omitted. */
  privacyHref?: string;
  /** Called once when the visitor decides — use it to enable optional tooling. */
  onConsent?: (consent: CookieConsent) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ privacyHref, onConsent }) => {
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const textId = useId();

  useEffect(() => {
    if (getCookieConsent() === null) setVisible(true);
  }, []);

  const decide = useCallback(
    (consent: CookieConsent) => {
      try {
        localStorage.setItem(COOKIE_KEY, consent);
      } catch {
        /* private mode: the banner just stays dismissed for this page view */
      }
      setVisible(false);
      onConsent?.(consent);
    },
    [onConsent],
  );

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="chaos-cookie-banner"
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={textId}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
          >
            <div className="chaos-cookie-banner__icon" aria-hidden="true">
              <Cookie size={22} />
            </div>
            <div className="chaos-cookie-banner__body">
              <p id={titleId} className="chaos-cookie-banner__title">
                Cookies &amp; Datenschutz
              </p>
              <p id={textId} className="chaos-cookie-banner__text">
                Wir nutzen notwendige Cookies, damit die Seite funktioniert, und weitere, um sie zu verbessern.
                {privacyHref && (
                  <>
                    {' '}
                    <a className="chaos-cookie-banner__link" href={privacyHref}>
                      Mehr erfahren
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="chaos-cookie-banner__actions">
              <button
                type="button"
                className="chaos-cookie-banner__button chaos-cookie-banner__button--secondary"
                onClick={() => decide('necessary')}
              >
                Nur notwendige
              </button>
              <button
                type="button"
                className="chaos-cookie-banner__button chaos-cookie-banner__button--primary"
                onClick={() => decide('accepted')}
              >
                Akzeptieren
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
