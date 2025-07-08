'use client';

import { useState } from 'react';
import useLocalStorage from 'use-local-storage';
// Pausable型は useInterval からインポート
import { Pausable } from './intervalHooks';

// センサー関連のカスタムフックをまとめたファイル

export const useSensorSource = () => {
  const [sensorSource, setSensorSource] = useLocalStorage<string>('sensorSource', "serial");
  return [sensorSource, setSensorSource] as const;
};

export const useSensorInterval = () => {
  const [sensorInterval, setSensorInterval] = useState<Pausable | null>(null);
  return [sensorInterval, setSensorInterval] as const;
};

export const useIsSensorRecording = () => {
  const [isSensorRecording, setIsSensorRecording] = useLocalStorage<boolean>('isSensorRecording', true);
  return [isSensorRecording, setIsSensorRecording] as const;
};

export const useIsSensorInfoVisible = () => {
  const [isSensorInfoVisible, setIsSensorInfoVisible] = useLocalStorage<boolean>('isSensorInfoVisible', false);
  return [isSensorInfoVisible, setIsSensorInfoVisible] as const;
};

export const useRoomTmp = () => {
  const [roomTmp, setRoomTmp] = useState<number | null>(null);
  return [roomTmp, setRoomTmp] as const;
};

export const useOutTmp = () => {
  const [outTmp, setOutTmp] = useState<number | null>(null);
  return [outTmp, setOutTmp] as const;
};

export const usePressure = () => {
  const [pressure, setPressure] = useState<number | null>(null);
  return [pressure, setPressure] as const;
};

export const useHumidity = () => {
  const [humidity, setHumidity] = useState<number | null>(null);
  return [humidity, setHumidity] as const;
};

export const useGas = () => {
  const [gas, setGas] = useState<number | null>(null);
  return [gas, setGas] as const;
};
