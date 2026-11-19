import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../Button';
import { remainingSeconds } from '../../utils/otp';

export interface ResendCodeProps {
  /** Cooldown in seconds between requests (default 30). */
  seconds?: number;
  onResend: () => void | Promise<void>;
  label?: React.ReactNode;
  /** Start the cooldown right away, because a code was just sent (default true). */
  startOnMount?: boolean;
  className?: string;
}

/**
 * "Send code again" button that stays disabled with a countdown after each
 * request. The cooldown stops people hammering it and rate-limiting themselves.
 */
export const ResendCode: React.FC<ResendCodeProps> = ({
  seconds = 30, onResend, label = 'Code erneut senden', startOnMount = true, className,
}) => {
  const [startedAt, setStartedAt] = useState<number | null>(() => (startOnMount ? Date.now() : null));
  const [now, setNow] = useState(() => Date.now());

  const remaining = startedAt === null ? 0 : remainingSeconds(startedAt, now, seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [remaining > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = async () => {
    if (remaining > 0) return;
    const start = Date.now();
    setStartedAt(start);
    setNow(start);
    await onResend();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      icon={<RefreshCw size={16} aria-hidden="true" />}
      disabled={remaining > 0}
      disabledReason={remaining > 0 ? `Du kannst in ${remaining} Sekunden einen neuen Code anfordern.` : undefined}
      onClick={handleClick}
    >
      {remaining > 0 ? `${label} (${remaining} s)` : label}
    </Button>
  );
};
