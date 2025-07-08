'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import dayjs from 'dayjs';

// タイマー関連のカスタムフックをまとめたファイル

export const useTimer = () => {
  const [timer, setTimer] = useState<number[] | null>(null);
  return [timer, setTimer] as const;
};

export const useTimerSetting = () => {
  const [timerSetting, setTimerSetting] = useState<[number, number, number]>([0, 0, 0]);
  return [timerSetting, setTimerSetting] as const;
};

export const useTimerAlertSource = () => {
  const [timerAlertSource, setTimerAlertSource] = useState<HTMLAudioElement | null>(null);
  return [timerAlertSource, setTimerAlertSource] as const;
};

export const useTime = () => {
  const [time, setTime] = useState(dayjs().toDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(dayjs().toDate());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return time;
};

interface ChimeTime {
  time: string;
  label: string;
}

const kChimeTimes: ChimeTime[] = []; // TODO: 実際の定義に置き換える

export const useUserChimeTimes = () => {
  const [userChimeTimes, setUserChimeTimes] = useLocalStorage<ChimeTime[]>('chimeTimes', kChimeTimes);
  return [userChimeTimes, setUserChimeTimes] as const;
};


export const useIsTimerActive = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  return [isTimerActive, setIsTimerActive] as const;
};
