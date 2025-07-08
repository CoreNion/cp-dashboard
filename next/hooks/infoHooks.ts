import useLocalStorage from 'use-local-storage';

export const useInfoScrollEnabled = () => {
  return useLocalStorage<boolean>('isInfoScrollEnabled', false);
};

export const useInfoScrollText = () => {
  return useLocalStorage<string>('infoScrollText', "");
};
