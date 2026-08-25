// Mercy Land — analytics: fire-once mount event (specs/analytics.md)
// "One entry = one event." Two of the four events fire when something appears (a scene mounts, an
// overlay opens), and both need the same guard: StrictMode double-invokes effects in dev, and a
// host may re-render or (in Scene's case) stop remounting per id if the AnimatePresence key ever
// changes. Keying the guard on a dedupe string rather than on mount covers both — the event
// refires only when the thing being viewed actually changes.

import { useEffect, useRef } from 'react';
import { track } from '../lib/analytics';
import type { TrackProps } from '../lib/analytics';

export function useTrackOnce(event: string, props: TrackProps, dedupeKey: string): void {
  const firedFor = useRef<string | null>(null);
  // `props` is deliberately not a dep: it is always derived from `dedupeKey`, and a fresh object
  // identity each render would defeat the guard.
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    if (firedFor.current === dedupeKey) return;
    firedFor.current = dedupeKey;
    track(event, latest.current);
  }, [event, dedupeKey]);
}
