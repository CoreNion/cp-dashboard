'use client';

import useLocalStorage from 'use-local-storage';

// 外観関連のカスタムフックをまとめたファイル

export const useScreenEffect = () => {
  const [screenEffect, setScreenEffect] = useLocalStorage<string>('screenEffect', "none");
  return [screenEffect, setScreenEffect] as const;
};
