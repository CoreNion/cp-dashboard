import useLocalStorage from 'use-local-storage';

export const useScreenEffect = () => {
  return useLocalStorage<string>('screenEffect', "none");
};

export const useFont = () => {
  return useLocalStorage<string>('font', "CP-Dashboard");
};

export const useCustomFonts = () => {
  return useLocalStorage<string[]>('customFonts', []);
};

export const useFontSize = () => {
  return useLocalStorage<number>('fontSize', 1.0);
};
