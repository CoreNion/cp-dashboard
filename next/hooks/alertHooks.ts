'use client';

import useLocalStorage from 'use-local-storage';

// アラート関連のカスタムフック

export const useAlertFileName = () => {
  const [alertFileName, setAlertFileName] = useLocalStorage<string>('alert.mp3', 'デフォルトの音声');
  return [alertFileName, setAlertFileName] as const;
};
