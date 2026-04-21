import { useState } from 'react';

const CHAT_WORLD_ACCESS_KEY = 'chatWorldAccess';

export const useChatWorldAccess = (): [boolean, () => void] => {
  const [hasAccess, setHasAccess] = useState<boolean>(() => {
    return localStorage.getItem(CHAT_WORLD_ACCESS_KEY) === 'true';
  });

  const grantAccess = () => {
    localStorage.setItem(CHAT_WORLD_ACCESS_KEY, 'true');
    setHasAccess(true);
  };

  return [hasAccess, grantAccess];
};
