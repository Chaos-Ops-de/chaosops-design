import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../surface.css';
import './WelcomeCard.css';

export interface WelcomeCardProps {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Intro card: bold greeting, short text and a mint pill CTA with a round dark arrow button. */
export const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, text, actionLabel, onAction, className, style }) => (
  <section className={['chaos-surface', 'chaos-welcome-card', className].filter(Boolean).join(' ')} style={style}>
    <h2 className="chaos-welcome-card__title">{title}</h2>
    <p className="chaos-welcome-card__text">{text}</p>
    <button type="button" className="chaos-welcome-card__cta" onClick={onAction}>
      <span className="chaos-welcome-card__label">{actionLabel}</span>
      <span className="chaos-welcome-card__arrow" aria-hidden="true"><ArrowRight size={18} /></span>
    </button>
  </section>
);
