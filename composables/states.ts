import type { Pausable } from "@vueuse/core";

// 現在のセンサー情報のソース
export const sensorSource = () => useState<String>('sensorSource', () => "rpi");

// タイマーのインターバル
export const interval = () => useState<Pausable | null>('interval', () => null);
// タイマーが動いているかどうか
export const isTimerActive = () => useState('isTimerActive', () => false);
// タイマー残り時間 (h:m:s)
export const timer = () => useState<number[] | null>('timer', () => null);
// チャイムの有効/無効
export const isChimeEnabled = () => useState<boolean>('isChimeEnabled', () => true);

// 現在の室温
export const roomTmp = () => useState<Number | null>('roomTemp', () => null);
// 現在の気圧
export const pressure = () => useState<Number | null>('pressure', () => null);
// 現在の外気温
export const outTmp= () => useState<Number | null>('outTemp', () => null);
// 天気
export const weather = () => useState<String | null>('weather', () => null);