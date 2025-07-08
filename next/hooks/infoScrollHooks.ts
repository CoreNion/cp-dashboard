'use client';

import useLocalStorage from 'use-local-storage';

// インフォスクロール関連のカスタムフックをまとめたファイル

export const useInfoScrollEnabled = () => {
  const [isInfoScrollEnabled, setIsInfoScrollEnabled] = useLocalStorage<boolean>('isInfoScrollEnabled', false);
  return [isInfoScrollEnabled, setIsInfoScrollEnabled] as const;
};

export const useInfoScrollText = () => {
  const [infoScrollText, setInfoScrollText] = useLocalStorage<string>('infoScrollText', "");
  return [infoScrollText, setInfoScrollText] as const;
};
