import { useSyncExternalStore } from 'react';

let ready = false;
const listeners = new Set<() => void>();

export const markVideoReady = () => {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
};

export const useVideoReady = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => ready,
    () => false,
  );
