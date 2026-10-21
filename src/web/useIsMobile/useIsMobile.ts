import { useEffect, useState } from 'react';

const read = (breakpoint: number) => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);

/** True while the viewport is at most `breakpoint` px wide (default 640). SSR-safe (false on the server). */
export function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(() => read(breakpoint));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setIsMobile(read(breakpoint));
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}
