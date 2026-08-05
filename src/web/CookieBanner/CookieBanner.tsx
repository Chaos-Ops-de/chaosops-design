import React, { useState, useEffect } from 'react';
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

  if (!visible) return null;

  return (
    <div className="chaos-cookie-banner">
      <span className="chaos-cookie-banner__text">
        Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. Mit der Nutzung akzeptierst du unsere Cookies.
      </span>
      <button
        className="chaos-cookie-banner__button"
        onClick={acceptCookies}
      >
        Akzeptieren
      </button>
    </div>
  );
};
