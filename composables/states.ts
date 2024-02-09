import { useLocalStorage, type Pausable } from "@vueuse/core";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 画面の横幅
export const widthScreenSize = () => useState<number>('widthScreenSize', () => 1280);

// 現在時刻
export const time = () => useState<Date>('time', () => dayjs().toDate());

// 降雪モード
export const isSnowEnabled = () => useLocalStorage<boolean>('isSnowEnabled', () => false);

// 現在のセンサー情報のソース
export const sensorSource = () => useLocalStorage<string>('sensorSource', () => "serial");

// alert.mp3のソース
export const defaultAlertAudioSource = () => useState<string>('defaultAlertAudioSource', () => '/alert.mp3');
// タイマーの音声のソース
export const timerAlertSource = () => useState<string>('timerSource', () => defaultAlertAudioSource().value);
// チャイムの音声ソース
export const chimeSource = () => useState<string>('chimeSource', () => defaultAlertAudioSource().value);
// 予鈴の音声ソース
export const preChimeSource = () => useState<string>('preChimeSource', () => defaultAlertAudioSource().value);
// チャイム鳴動時刻
export const userChimeTimes = () => useLocalStorage<number[][]>('chimeTimes', () => chimeTimes);

// タイマーのインターバル
export const interval = () => useState<Pausable | null>('interval', () => null);
// タイマーが動いているかどうか
export const isTimerActive = () => useState('isTimerActive', () => false);
// タイマー残り時間 (h:m:s)
export const timer = () => useState<number[] | null>('timer', () => null);
// チャイムの有効/無効
export const isChimeEnabled = () => useLocalStorage<boolean>('isChimeEnabled', () => false);
// 予鈴の有効/無効
export const isPreChimeEnabled = () => useLocalStorage<boolean>('isPreChimeEnabled', () => false);
// タイマーの設定時間 (h:m:s)
export const timerSetting = () => useState('timerSetting', () => [0, 0, 0]);

// 情報スクロールを有効にするかどうか
export const isInfoScrollEnabled = () => useLocalStorage<boolean>('isInfoScrollEnabled', () => false);
// 情報スクロールに表示する文字列
export const infoScrollText = () => useLocalStorage<string>('infoScrollText', () => "");

// 天気の広域地方番号
export const weatherWideRegionNumber = () => useLocalStorage<string>('weatherWideRegionNumber', () => "010300");
// 天気のoffice番号
export const weatherOfficeNumber = () => useLocalStorage<string>('weatherOfficeNumber', () => "130000");
// 天気の地域番号
export const weatherAreaNumber = () => useLocalStorage<string>('weatherAreaNumber', () => "130010");
// 外気温のみ使用するかどうか
export const isAmedasOnlyTmp = () => useLocalStorage<boolean>('isAmedasOnlyTmp', () => false);
// 天気のアメダス番号
export const weatherAmedasCode = () => useLocalStorage<string>('weatherAmedasCode', () => "44132");
// 天気のアメダス名
export const weatherAmedasName = () => useLocalStorage<string>('weatherAmedasName', () => "東京");

// センサーのインターバル
export const sensorInterval = () => useState<Pausable | null>('sensorInterval', () => null);
// シリアル通信の準備ができているか
export const isSerialReady = () => useState('isSerialReady', () => false);
// シリアルポート
export const serialPort = () => useState<SerialPort | null>('serialPort', () => null);

// 現在の室温
export const roomTmp = () => useState<Number | null>('roomTemp', () => null);
// 現在の湿度
export const humidity = () => useState<Number | null>('humidity', () => null);
// 現在の気圧
export const pressure = () => useState<Number | null>('pressure', () => null);
// 現在のガス抵抗値
export const gas = () => useState<number | null>('gas', () => null);

// 現在の外気温
export const outTmp= () => useState<Number | null>('outTemp', () => null);
// 天気
export const weather = () => useState<string | null>('weather', () => null);