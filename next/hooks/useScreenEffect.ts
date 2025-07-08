'use client';

import useLocalStorage from 'use-local-storage';

export const useScreenEffect = () => {
  const [screenEffect, setScreenEffect] = useLocalStorage<string>('screenEffect', "none");
  return [screenEffect, setScreenEffect] as const;
};
