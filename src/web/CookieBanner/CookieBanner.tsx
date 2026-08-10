import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import './CookieBanner.css';

const COOKIE_KEY = 'cookieConsent';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="chaos-cookie-banner"
            role="dialog"
            aria-label="Cookie-Hinweis"
            style={{ x: '-50%' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
          >
            <span className="chaos-cookie-banner__text">
              Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. Mit der Nutzung akzeptierst du unsere Cookies.
            </span>
            <button
              className="chaos-cookie-banner__button"
              onClick={acceptCookies}
            >
              Akzeptieren
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};
