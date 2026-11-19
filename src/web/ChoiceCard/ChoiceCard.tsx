import React from 'react';
import './ChoiceCard.css';

export interface ChoiceCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Logo, avatar or icon before the text. */
  leading?: React.ReactNode;
  /** Chevron or badge after the text. */
  trailing?: React.ReactNode;
  /** The picked card in a pick-one list (sets `aria-pressed`). Leave undefined for a card that just navigates. */
  selected?: boolean;
  /** Extra content under the text (meta lines, badges). */
  children?: React.ReactNode;
}

/** A whole card that is one button: pick an organisation, an event, a day. Disabled cards stay readable. */
export const ChoiceCard = React.forwardRef<HTMLButtonElement, ChoiceCardProps>(function ChoiceCard(
  { title, description, leading, trailing, selected, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={['chaos-choice-card', selected ? 'chaos-choice-card--selected' : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {leading != null && <span className="chaos-choice-card__leading">{leading}</span>}
      <span className="chaos-choice-card__text">
        <span className="chaos-choice-card__title">{title}</span>
        {description != null && <span className="chaos-choice-card__desc">{description}</span>}
        {children}
      </span>
      {trailing != null && <span className="chaos-choice-card__trailing">{trailing}</span>}
    </button>
  );
});
