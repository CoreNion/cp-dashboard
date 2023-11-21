import type { Pausable } from "@vueuse/core";

// タイマーのインターバル
export const interval = () => useState<Pausable | null>('interval', () => null);
// タイマーが動いているかどうか
export const isTimerActive = () => useState('isTimerActive', () => false);
// タイマー残り時間 (h:m:s)
export const timer = () => useState<number[] | null>('timer', () => null);
