import { useState } from 'react';

const ACCESS_KEY = 'chatWorldAccess';
const EMAIL_KEY = 'chatWorldEmail';

const readEmail = () => {
  try {
    return localStorage.getItem(EMAIL_KEY) || null;
  } catch {
    return null;
  }
};

const initHasAccess = () => {
  try {
    if (localStorage.getItem(ACCESS_KEY) === 'true') return true;
    if (localStorage.getItem(EMAIL_KEY)) {
      localStorage.setItem(ACCESS_KEY, 'true');
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const useChatWorldAccess = (): {
  hasAccess: boolean;
  rememberedEmail: string | null;
  grantAccess: (email?: string) => void;
} => {
  const [hasAccess, setHasAccess] = useState<boolean>(initHasAccess);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(readEmail);

  const grantAccess = (email?: string) => {
    try {
      localStorage.setItem(ACCESS_KEY, 'true');
      if (email) {
        localStorage.setItem(EMAIL_KEY, email);
        setRememberedEmail(email);
      }
    } catch {
      // localStorage unavailable (private mode quota, etc.) — proceed in-memory.
    }
    setHasAccess(true);
  };

  return { hasAccess, rememberedEmail, grantAccess };
};
