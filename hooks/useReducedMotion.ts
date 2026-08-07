'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server has no media queries; assume motion is fine and let the client
// correct it on hydration.
const getServerSnapshot = () => false;

/**
 * Reports `prefers-reduced-motion: reduce`, and keeps reporting if the user
 * flips the OS setting while the page is open.
 *
 * `useSyncExternalStore` rather than useEffect + setState: matchMedia is an
 * external store, and reading it in an effect would cost an extra render pass
 * on every mount.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
