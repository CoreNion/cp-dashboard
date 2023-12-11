import type { Pausable } from "@vueuse/core";

// 現在のセンサー情報のソース
export const sensorSource = () => useState<string>('sensorSource', () => "rpi");
// タイマーの音声のソース
export const timerAlertSource = () => useState<string>('timerSource', () => "/alert.mp3");
// チャイムの音声ソース
export const chimeSource = () => useState<string>('chimeSource', () => "/alert.mp3");
// 予鈴の音声ソース
export const preChimeSource = () => useState<string>('preChimeSource', () => "/alert.mp3");

// タイマーのインターバル
export const interval = () => useState<Pausable | null>('interval', () => null);
// タイマーが動いているかどうか
export const isTimerActive = () => useState('isTimerActive', () => false);
// タイマー残り時間 (h:m:s)
export const timer = () => useState<number[] | null>('timer', () => null);
// チャイムの有効/無効
export const isChimeEnabled = () => useState<boolean>('isChimeEnabled', () => true);
// 予鈴の有効/無効
export const isPreChimeEnabled = () => useState<boolean>('isPreChimeEnabled', () => true);

// 現在の室温
export const roomTmp = () => useState<Number | null>('roomTemp', () => null);
// 現在の気圧
export const pressure = () => useState<Number | null>('pressure', () => null);
// 現在の外気温
export const outTmp= () => useState<Number | null>('outTemp', () => null);
// 天気
export const weather = () => useState<string | null>('weather', () => null);