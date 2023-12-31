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
export const chimeTimes = [
  // 朝礼
  [9, 30],
  // 1限
  [9, 45],
  [10, 35],
  // 2限
  [10, 45],
  [11, 35],
  // 3限
  [11, 45],
  [12, 35],
  // 4限
  [13, 15],
  [14, 5],
  // 5限
  [14, 15],
  [15, 5],
  // 6限
  [15, 15],
  [16, 5],
  // 学校終了
  [16, 15],
  // 完全下校
  [17, 30],
];

/**
 * 予鈴を鳴らす時間 (基本的に1分前)
 */
export const preChimeTimes = [
  // 朝礼
  [9, 29],
  // 1限
  [9, 44],
  // 2限
  [10, 44],
  // 3限
  [11, 44],
  // 4限
  [13, 14],
  // 5限
  [14, 14],
  // 6限
  [15, 14],
  // 完全下校
  [17, 20]
];

/** 
 * Arduinoにセンサー情報の取得をリクエストするときの生データ
 */
export const kRawRequest = new TextEncoder().encode("REQUEST_SENSOR_DATA;");
