'use client';

import useLocalStorage from 'use-local-storage';

// フォント関連のカスタムフックをまとめたファイル

export const useFont = () => {
  const [font, setFont] = useLocalStorage<string>('font', "CP-Dashboard");
  return [font, setFont] as const;
};

export const useFontSize = () => {
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 1.0);
  return [fontSize, setFontSize] as const;
};

export const useCustomFonts = () => {
  const [customFonts, setCustomFonts] = useLocalStorage<string[]>('customFonts', []);
  return [customFonts, setCustomFonts] as const;
};
