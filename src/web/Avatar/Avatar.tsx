import React from 'react';
import { User } from 'lucide-react';
import { colorForUserId, initialFor } from '../../utils/avatarColor';
import './Avatar.css';

export interface AvatarProps {
  /** Source of the initial letter; falls back to a generic user icon when empty. */
  name?: string | null;
  /** Profile picture URL. Renders instead of the initial/icon (falls back on load error). */
  src?: string | null;
  /** Diameter in px. */
  size?: number;
  /** Derives a stable accent hue from the id (collaboration UIs). Without it the avatar is ink-on-cream. */
  userId?: string | null;
  /** ChaosOps "staff" ring — Product Owner / Product Admin accounts. */
  ring?: boolean;
  /** Overlap a previous avatar (participant stacks). */
  overlap?: boolean;
  /** Extra outline ring for emphasis (e.g. "you"). */
  ringed?: boolean;
  className?: string;
  title?: string;
  /** Presence of onClick renders a real <button> (hover/press/focus included) instead of a decorative <div>. */
  onClick?: () => void;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
}

export const Avatar: React.FC<AvatarProps> = ({
  name, src, size = 40, userId, ring = false, overlap = false, ringed = false, className, title, onClick, ...aria
}) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [src]);
  const showImage = !!src && !failed;
  const hasName = !!name?.trim();

  const style: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    // As a <button> the global 44px touch-target rule would otherwise stretch a smaller circle into an oval.
    minHeight: size,
    fontSize: Math.round(size * 0.4),
    ...(userId != null && !showImage ? { background: colorForUserId(userId) } : null),
    ...(showImage ? { background: 'var(--chaos-input-bg)' } : null),
  };

  const classes = [
    'chaos-avatar',
    userId != null ? 'chaos-avatar--colored' : '',
    ring ? 'chaos-avatar--staff' : '',
    overlap ? 'chaos-avatar--overlap' : '',
    ringed ? 'chaos-avatar--ringed' : '',
    onClick ? 'chaos-avatar--interactive' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = showImage
    ? <img className="chaos-avatar__img" src={src!} alt="" onError={() => setFailed(true)} />
    : hasName
      ? initialFor(name)
      : <User size={Math.round(size * 0.45)} aria-hidden="true" />;

  if (onClick) {
    return (
      <button type="button" className={classes} style={style} onClick={onClick} title={title} {...aria}>
        {content}
      </button>
    );
  }
  return (
    <div className={classes} style={style} title={title ?? (name || undefined)} aria-hidden="true">
      {content}
    </div>
  );
};
