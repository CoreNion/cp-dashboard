import { useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

export type ClockEffectType = "自動 (端末に最適化)" | "通常" | "反転" | "なし";

export const useTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return time;
};

export const useClockEffect = () => {
  return useLocalStorage<ClockEffectType>('clockEffect', "自動 (端末に最適化)");
};
