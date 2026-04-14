import { useState } from 'react';

export type ViewPreference = 'void' | 'flat';

const VIEW_PREFERENCE_KEY = 'mercyland-view';

export const useViewPreference = (): [ViewPreference, (pref: ViewPreference) => void] => {
  const [preference, setPreferenceState] = useState<ViewPreference>(() => {
    const stored = localStorage.getItem(VIEW_PREFERENCE_KEY);
    return stored === 'void' || stored === 'flat' ? stored : 'flat';
  });

  const setPreference = (pref: ViewPreference) => {
    localStorage.setItem(VIEW_PREFERENCE_KEY, pref);
    setPreferenceState(pref);
  };

  return [preference, setPreference];
};
