import React, { useId } from 'react';
import { Button } from '../Button';
import { emptyStateContent, type EmptyStateKind } from './emptyStateContent';
import './EmptyState.css';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Which of the four empty situations this is; picks the default copy. */
  kind?: EmptyStateKind;
  /** Overrides the default title for `kind`. */
  title?: string;
  /** Overrides the default description for `kind`. */
  description?: string;
  /** A mascot or small illustration (e.g. an `<img>`). Decorative — give it `alt=""`. */
  illustration?: React.ReactNode;
  /** The next step the user would take (not "refresh"); rendered as the primary button. */
  action?: EmptyStateAction;
  /** A quieter alternative, rendered as a ghost button. */
  secondaryAction?: EmptyStateAction;
  /** Heading level for the title (default 2). */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Empty screen, designed per situation: first run, no results, error, or
 * filtered out. Small illustration, human copy, one primary action.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  kind = 'noResults',
  title,
  description,
  illustration,
  action,
  secondaryAction,
  headingLevel = 2,
  className,
  style,
}) => {
  const headingId = useId();
  const content = emptyStateContent(kind, { title, description });

  return (
    <section
      aria-labelledby={headingId}
      className={['chaos-empty', `chaos-empty--${kind}`, className].filter(Boolean).join(' ')}
      style={style}
    >
      {illustration && <div className="chaos-empty__illustration" aria-hidden="true">{illustration}</div>}
      {React.createElement(`h${headingLevel}`, { id: headingId, className: 'chaos-empty__title' }, content.title)}
      <p className="chaos-empty__description">{content.description}</p>
      {(action || secondaryAction) && (
        <div className="chaos-empty__actions">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
          )}
        </div>
      )}
    </section>
  );
};
