'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Module-level registry so any component can call startNavigation()
 * without needing prop drilling or a Context.
 */
let listeners = new Set();

export function startNavigation() {
  listeners.forEach((cb) => cb(true));
}

function stopNavigation() {
  listeners.forEach((cb) => cb(false));
}

// Inner component needs Suspense because useSearchParams suspends
function ProgressBarInner() {
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Register / unregister this instance
  useEffect(() => {
    listeners.add(setActive);
    return () => listeners.delete(setActive);
  }, []);

  // Animate width while active
  useEffect(() => {
    if (!active) {
      setWidth(0);
      return;
    }
    setWidth(20);
    const t1 = setTimeout(() => setWidth(60), 200);
    const t2 = setTimeout(() => setWidth(80), 800);
    const t3 = setTimeout(() => setWidth(90), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);

  // Stop the bar whenever the route actually changes
  useEffect(() => {
    setWidth(100);
    const t = setTimeout(() => {
      stopNavigation();
      setWidth(0);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!active && width === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        height: '3px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          borderRadius: '0 2px 2px 0',
          transition: width === 100 ? 'width 0.2s ease' : 'width 0.6s ease',
          boxShadow: '0 0 8px rgba(59,130,246,0.6)',
        }}
      />
    </div>
  );
}

export default function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
