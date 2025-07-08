'use client';

import { useState } from 'react';

// シリアル関連のカスタムフックをまとめたファイル

export const useSerialPort = () => {
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null);
  return [serialPort, setSerialPort] as const;
};

export const useIsSerialReady = () => {
  const [isSerialReady, setIsSerialReady] = useState(false);
  return [isSerialReady, setIsSerialReady] as const;
};
