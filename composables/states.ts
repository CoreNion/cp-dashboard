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
// 時刻表示の効果
export const clockEffect = () => useLocalStorage<ClockEffectType>('clockEffect', () => "自動 (端末に最適化)");

// 選択されている効果
export const screenEffect = () => useLocalStorage<string>('screenEffect', () => "none");
// 選択されているフォント
export const font = () => useLocalStorage<string>('font', () => "CP-Dashboard");
// カスタムフォント
export const customFonts = () => useLocalStorage<string[]>('customFonts', () => []);
// フォントサイズ (+-オフセット)
export const fontSize = () => useLocalStorage<number>('fontSize', () => 1.0);

// 現在のセンサー情報のソース
export const sensorSource = () => useLocalStorage<string>('sensorSource', () => "serial");

// タイマーの音声のソース
export const timerAlertSource = () => useState<HTMLAudioElement>('timerSource', () => new Audio(`${useRuntimeConfig().app.baseURL}alert.mp3`));
// alert.mp3の元ファイル名
export const alertFileName = () => useLocalStorage<string>('alert.mp3', () => 'デフォルトの音声');
// チャイムの音声ソース
export const chimeSource = () => useState<HTMLAudioElement>('chimeSource', () => new Audio(`${useRuntimeConfig().app.baseURL}chime.mp3`));
// チャイムの元ファイル名
export const chimeFileName = () => useLocalStorage<string>('chime.mp3', () => 'デフォルトの音声');
// 予鈴の音声ソース
export const preChimeSource = () => useState<HTMLAudioElement>('preChimeSource', () => new Audio(`${useRuntimeConfig().app.baseURL}pre-chime.mp3`));
// 予鈴の元ファイル名
export const preChimeFileName = () => useLocalStorage<string>('pre-chime.mp3', () => 'デフォルトの音声');

// チャイム鳴動時刻
export const userChimeTimes = () => useLocalStorage<ChimeTime[]>('chimeTimes', () => kChimeTimes);
// 鳴らしたチャイム一覧(Map)
export const chimePlayed = () => useState<Map<string, boolean>>('chimePlayed', () => kChimeTimes.reduce((acc, cur) => acc.set(cur.time, false), new Map<string, boolean>()));
// 鳴らした予鈴一覧(Map)
export const preChimePlayed = () => useState<Map<string, boolean>>('preChimePlayed', () => kChimeTimes.reduce((acc, cur) => acc.set(cur.time, false), new Map<string, boolean>()));

// カウントダウンに表示する日付の一覧 (繰り返さないイベント)
export const countdownDates = () => useLocalStorage<CountdownData[]>('countdownDates', () => []);
// カウントダウンに表示する日付の一覧 (毎年)
export const yearlyCountdownDates = () => useLocalStorage<CountdownData[]>('yearlyCountdownDates', () => kYearlyCountdownDates);

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

// センサー情報の表示の切り替え
export const isSensorInfoVisible = () => useLocalStorage<boolean>('isSensorInfoVisible', () => false);
// センサー記録を保存するか
export const isSensorRecording = () => useLocalStorage<boolean>('isSensorRecording', () => true);
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

// バナー宣伝画像の表示の切り替え
export const isBannerVisible = () => useLocalStorage<boolean>('isBannerVisible', () => false);
// バナーのソース
export const bannerSource = () => useState<string | null>('bannerSource', () => null);
// 縦型バナーの表示の切り替え
export const isVerticalBanner = () => useLocalStorage<boolean>('isVerticalBanner', () => false);
// 縦バナーのソース
export const verticalBannerSource = () => useState<string | null>('verticalBannerSource', () => null);