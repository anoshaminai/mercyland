import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView();
  }, [hash, pathname]);
  return null;
};
