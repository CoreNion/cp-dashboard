'use client';

import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

// 天気情報関連のカスタムフックをまとめたファイル

export const useWeather = () => {
  const [weather, setWeather] = useState<string | null>(null);
  return [weather, setWeather] as const;
};

export const useWeatherAmedasCode = () => {
  const [weatherAmedasCode, setWeatherAmedasCode] = useLocalStorage<string>('weatherAmedasCode', "44132");
  return [weatherAmedasCode, setWeatherAmedasCode] as const;
};

export const useWeatherAmedasName = () => {
  const [weatherAmedasName, setWeatherAmedasName] = useLocalStorage<string>('weatherAmedasName', "東京");
  return [weatherAmedasName, setWeatherAmedasName] as const;
};

export const useWeatherAreaNumber = () => {
  const [weatherAreaNumber, setWeatherAreaNumber] = useLocalStorage<string>('weatherAreaNumber', "130010");
  return [weatherAreaNumber, setWeatherAreaNumber] as const;
};

export const useWeatherOfficeNumber = () => {
  const [weatherOfficeNumber, setWeatherOfficeNumber] = useLocalStorage<string>('weatherOfficeNumber', "130000");
  return [weatherOfficeNumber, setWeatherOfficeNumber] as const;
};

export const useWeatherWideRegionNumber = () => {
  const [weatherWideRegionNumber, setWeatherWideRegionNumber] = useLocalStorage<string>('weatherWideRegionNumber', "010300");
  return [weatherWideRegionNumber, setWeatherWideRegionNumber] as const;
};


export const useIsAmedasOnlyTmp = () => {
  const [isAmedasOnlyTmp, setIsAmedasOnlyTmp] = useLocalStorage<boolean>('isAmedasOnlyTmp', false);
  return [isAmedasOnlyTmp, setIsAmedasOnlyTmp] as const;
};
