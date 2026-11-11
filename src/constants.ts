import type { AudioKind, ChimeTime, CountdownData } from './types.ts';

/**
 * DaisyUIのテーマ
 */
export const themes = [
  'dash',
  'system',
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
];

/**
 * チャイムを鳴らす時間
 */
export const kChimeTimes: ChimeTime[] = [
  // 朝礼
  { time: '09:30', chime: true, preChime: true },
  // 1限
  { time: '09:45', chime: true, preChime: true },
  { time: '10:35', chime: true, preChime: false },
  // 2限
  { time: '10:45', chime: true, preChime: true },
  { time: '11:35', chime: true, preChime: false },
  // 3限
  { time: '11:45', chime: true, preChime: true },
  { time: '12:35', chime: true, preChime: false },
  // 4限
  { time: '13:15', chime: true, preChime: true },
  { time: '14:05', chime: true, preChime: false },
  // 5限
  { time: '14:15', chime: true, preChime: true },
  { time: '15:05', chime: true, preChime: false },
  // 6限
  { time: '15:15', chime: true, preChime: true },
  { time: '16:05', chime: true, preChime: false },
  // 終礼
  { time: '16:15', chime: true, preChime: false },
  // 完全下校
  { time: '17:25', chime: false, preChime: true },
  { time: '17:30', chime: true, preChime: true },
];

/**
 * カウントダウンに表示する日付
 */
export const kYearlyCountdownDates: CountdownData[] = [
  { date: '02-14', label: 'バレンタイン', color: 'pink', type: 'yearly' },
  { date: '03-31', label: '今年度終了', color: 'gray', type: 'yearly' },
  { date: '06-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '07-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '08-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '09-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '10-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '11-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '12-15', label: 'レポート期限', color: 'blue', type: 'yearly' },
  { date: '12-25', label: 'クリスマス', color: 'red', type: 'yearly' },
  { date: '12-31', label: '大晦日', color: 'gray', type: 'yearly' },
];

/**
 * カウントダウンのイベントに設定できる色
 */
export const kCountdownColors = ['gray', 'red', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'];

/**
 * 画面効果の種類
 */
export const kEffects = ['none', 'sakura', 'snowflake'];

/**
 * 時刻表示の効果
 */
export const kClockEffects = ['自動 (端末に最適化)', 'シンプル', 'アニメーション'];

/**
 * アプリのデフォルトフォントの名前
 */
export const kDefaultFont = 'CP-Dashboard';

/**
 * デフォルトフォントのフォントファミリー
 */
export const kDefaultFontFamily = "'Inter', 'M PLUS Rounded 1c', sans-serif";

/**
 * デフォルト音源使用時のファイル名表示
 */
export const kDefaultAudioName = 'デフォルトの音声';

/**
 * 各音源のファイル名 (public内のデフォルト音源 / OPFS内のカスタム音源で共通)
 */
export const kAudioFiles: Record<AudioKind, string> = {
  alert: 'alert.mp3',
  chime: 'chime.mp3',
  preChime: 'pre-chime.mp3',
};

/**
 * バナー画像のOPFS内のファイル名
 */
export const kBannerFile = 'banner.png';
export const kVerticalBannerFile = 'vertical-banner.png';

/**
 * 大画面レイアウトに切り替える横幅
 */
export const kWideScreenWidth = 1280;
