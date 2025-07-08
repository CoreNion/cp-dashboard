'use client';

import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

// チャイム関連のカスタムフックをまとめたファイル

export const useIsChimeEnabled = () => {
  const [isChimeEnabled, setIsChimeEnabled] = useLocalStorage<boolean>('isChimeEnabled', false);
  return [isChimeEnabled, setIsChimeEnabled] as const;
};

export const useChimeFileName = () => {
  const [chimeFileName, setChimeFileName] = useLocalStorage<string>('chime.mp3', 'デフォルトの音声');
  return [chimeFileName, setChimeFileName] as const;
};

interface ChimeTime {
  time: string;
  label: string;
}

const kChimeTimes: ChimeTime[] = []; // TODO: 実際の定義に置き換える

export const useChimePlayed = () => {
  const [chimePlayed, setChimePlayed] = useState<Map<string, boolean>>(() => kChimeTimes.reduce((acc, cur) => acc.set(cur.time, false), new Map<string, boolean>()));
  return [chimePlayed, setChimePlayed] as const;
};

export const useChimeSource = () => {
  const [chimeSource, setChimeSource] = useState<HTMLAudioElement | null>(null);
  return [chimeSource, setChimeSource] as const;
};

export const useIsPreChimeEnabled = () => {
  const [isPreChimeEnabled, setIsPreChimeEnabled] = useLocalStorage<boolean>('isPreChimeEnabled', false);
  return [isPreChimeEnabled, setIsPreChimeEnabled] as const;
};


export const usePreChimeFileName = () => {
  const [preChimeFileName, setPreChimeFileName] = useLocalStorage<string>('pre-chime.mp3', 'デフォルトの音声');
  return [preChimeFileName, setPreChimeFileName] as const;
};

export const usePreChimePlayed = () => {
  const [preChimePlayed, setPreChimePlayed] = useState<Map<string, boolean>>(() => kChimeTimes.reduce((acc, cur) => acc.set(cur.time, false), new Map<string, boolean>()));
  return [preChimePlayed, setPreChimePlayed] as const;
};

export const usePreChimeSource = () => {
  const [preChimeSource, setPreChimeSource] = useState<HTMLAudioElement | null>(null);
  return [preChimeSource, setPreChimeSource] as const;
};

interface ChimeTime {
  time: string;
  label: string;
}

export const useUserChimeTimes = () => {
  const [userChimeTimes, setUserChimeTimes] = useLocalStorage<ChimeTime[]>('chimeTimes', kChimeTimes);
  return [userChimeTimes, setUserChimeTimes] as const;
};
