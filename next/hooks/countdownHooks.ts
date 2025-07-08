'use client';

import useLocalStorage from 'use-local-storage';

// カウントダウン関連のカスタムフックをまとめたファイル

interface CountdownData {
  date: string;
  label: string;
  color: string;
}

const kYearlyCountdownDates: CountdownData[] = []; // TODO: 実際の定義に置き換える

export const useYearlyCountdownDates = () => {
  const [yearlyCountdownDates, setYearlyCountdownDates] = useLocalStorage<CountdownData[]>('yearlyCountdownDates', kYearlyCountdownDates);
  return [yearlyCountdownDates, setYearlyCountdownDates] as const;
};

export const useCountdownDates = () => {
  const [countdownDates, setCountdownDates] = useLocalStorage<CountdownData[]>('countdownDates', []);
  return [countdownDates, setCountdownDates] as const;
};
