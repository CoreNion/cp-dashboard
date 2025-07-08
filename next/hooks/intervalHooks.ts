'use client';

import { useState, useEffect, useRef } from 'react';

export interface Pausable {
  pause: () => void;
  resume: () => void;
  isActive: boolean;
}

// インターバル関連のカスタムフックをまとめたファイル

export const useInterval = (callback: () => void, delay: number | null): Pausable => {
  const savedCallback = useRef(callback);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const resume = () => {
    if (delay !== null && !isActive) {
      intervalId.current = setInterval(() => savedCallback.current(), delay);
      setIsActive(true);
    }
  };

  const pause = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (delay !== null) {
      resume();
    } else {
      pause();
    }
    return pause;
  }, [delay]);

  return { pause, resume, isActive };
};
