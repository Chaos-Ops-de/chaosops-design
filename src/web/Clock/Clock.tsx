import React, { useMemo } from 'react';
import { ArrowRight, Clock as ClockIcon } from 'lucide-react';
import './Clock.css';

const suggestionConfig = {
  morgens: [
    "Gemütlich eine Tasse Kaffee oder Tee trinken",
    "Noch einmal tief durchatmen",
    "Einen guten Platz suchen",
    "Sich mit Sitznachbarn austauschen"
  ],
  mittags: [
    "Ein Glas kaltes Wasser trinken",
    "Kurz die Beine vertreten",
    "Den Kopf für den nächsten Punkt freimachen"
  ],
  abends: [
    "Den Tag Revue passieren lassen",
    "Die besten Momente des Tages notieren",
    "Sich auf den entspannten Teil des Tages freuen"
  ],
  nachts: [
    "Den Abend gemütlich ausklingen lassen",
    "Bis morgen gut erholen!",
    "Schlafen gehen..."
  ]
};

export interface ClockProps {
  time: Date;
  nextEventTime?: string;
  /** Only show countdown & suggestions on the 'display' view */
  viewType?: 'display' | 'shared' | 'team' | 'preview';
}

export const Clock: React.FC<ClockProps> = ({ time, nextEventTime, viewType = 'preview' }) => {
  const timePeriod = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const timeInMins = h * 60 + m;

    if (timeInMins >= 4 * 60 && timeInMins < 12 * 60) return 'morgens';
    if (timeInMins >= 12 * 60 && timeInMins < 15 * 60 + 30) return 'mittags';
    if (timeInMins >= 15 * 60 + 30 && timeInMins < 23 * 60) return 'abends';
    return 'nachts';
  }, [time]);

  const { diffMinutes, diffSeconds, showCountdown } = useMemo(() => {
    if (!nextEventTime) return { diffMinutes: 0, diffSeconds: 0, showCountdown: false };
    const [h, m] = nextEventTime.split(':').map(Number) as [number, number];
    const eventDate = new Date(time);
    eventDate.setHours(h, m, 0, 0);

    const diffMs = eventDate.getTime() - time.getTime();
    if (diffMs <= 0 || diffMs > 15 * 60 * 1000) {
      return { diffMinutes: 0, diffSeconds: 0, showCountdown: false };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    return {
      diffMinutes: Math.floor(totalSeconds / 60),
      diffSeconds: totalSeconds % 60,
      showCountdown: true
    };
  }, [time, nextEventTime]);

  const isNachts = timePeriod === 'nachts';
  // Only show countdown & suggestions on the display view
  const isDisplayView = viewType === 'display';
  const showSuggestions = isDisplayView && (showCountdown || isNachts);
  const suggestions = suggestionConfig[timePeriod] || [];

  const countdownTone = diffMinutes < 2 ? 'urgent' : diffMinutes < 5 ? 'warning' : 'calm';
  const showHurry = showCountdown && diffMinutes < 2;

  return (
    <div className="chaos-clock">
      <aside className="chaos-clock__face" aria-label="Aktuelle Uhrzeit Seitenanzeige">
        <span className="chaos-clock__label">
          <ClockIcon size={14} strokeWidth={2.5} aria-hidden="true" />
          UHR
        </span>
        <span className="chaos-clock__time">
          {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </aside>

      <div className={`chaos-clock__panel${showSuggestions ? ' chaos-clock__panel--open' : ''}`} aria-hidden={!showSuggestions}>
        {showCountdown && !isNachts && (
          <div className="chaos-clock__countdown">
            <div className="chaos-clock__countdown-label">Nächster Punkt in:</div>
            <div className={`chaos-clock__countdown-timer chaos-clock__countdown-timer--${countdownTone}`}>
              {String(diffMinutes).padStart(2, '0')}:{String(diffSeconds).padStart(2, '0')}
            </div>
          </div>
        )}
        {showHurry ? (
          <div className="chaos-clock__hurry">Schonmal in den Raum gehen!</div>
        ) : (
          <>
            <div className="chaos-clock__heading">In dieser Zeit könntest du:</div>
            <ul className="chaos-clock__list">
              {suggestions.map((sug) => (
                <li key={sug}>
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
