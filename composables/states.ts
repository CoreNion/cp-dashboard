import type { Pausable } from "@vueuse/core";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
export const time = () => useState<Date>('time', () => dayjs().toDate());

// 現在のセンサー情報のソース
export const sensorSource = () => useState<string>('sensorSource', () => "rpi");

// alert.mp3のソース
export const defaultAlertAudioSource = () => useState<string>('defaultAlertAudioSource', () => '/alert.mp3');

// タイマーの音声のソース
export const timerAlertSource = () => useState<string>('timerSource', () => defaultAlertAudioSource().value);
// チャイムの音声ソース
export const chimeSource = () => useState<string>('chimeSource', () => defaultAlertAudioSource().value);
// 予鈴の音声ソース
export const preChimeSource = () => useState<string>('preChimeSource', () => defaultAlertAudioSource().value);

// タイマーのインターバル
export const interval = () => useState<Pausable | null>('interval', () => null);
// タイマーが動いているかどうか
export const isTimerActive = () => useState('isTimerActive', () => false);
// タイマー残り時間 (h:m:s)
export const timer = () => useState<number[] | null>('timer', () => null);
// チャイムの有効/無効
export const isChimeEnabled = () => useState<boolean>('isChimeEnabled', () => false);
// 予鈴の有効/無効
export const isPreChimeEnabled = () => useState<boolean>('isPreChimeEnabled', () => false);

// 天気の広域地方番号
export const weatherWideRegionNumber = () => useState<string>('weatherWideRegionNumber', () => "010300");
// 天気のoffice番号
export const weatherOfficeNumber = () => useState<string>('weatherOfficeNumber', () => "130000");
// 天気の地域番号
export const weatherAreaNumber = () => useState<string>('weatherAreaNumber', () => "130010");

// 現在の室温
export const roomTmp = () => useState<Number | null>('roomTemp', () => null);
// 現在の気圧
export const pressure = () => useState<Number | null>('pressure', () => null);
// 現在の外気温
export const outTmp= () => useState<Number | null>('outTemp', () => null);
// 天気
export const weather = () => useState<string | null>('weather', () => null);