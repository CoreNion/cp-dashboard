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
export const kChimeTimes = [
  // 朝礼
  "09:30",
  // 1限
  "09:45",
  "10:35",
  // 2限
  "10:45",
  "11:35",
  // 3限
  "11:45",
  "12:35",
  // 4限
  "13:15",
  "14:05",
  // 5限
  "14:15",
  "15:05",
  // 6限
  "15:15",
  "16:05",
  // 終礼
  "16:15",
  // 完全下校
  "17:30",
];

/** 
 * Arduinoにセンサー情報の取得をリクエストするときの生データ
 */
export const kRawRequest = new TextEncoder().encode("REQUEST_SENSOR_DATA;");

/**
 * センサー情報の種類
 */
export const kDataKinds = ["気温", "湿度", "気圧","ガス抵抗値"];