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
  { time: "09:30", chime: true, preChime: true },
  // 1限
  { time: "09:45", chime: true, preChime: true },
  { time: "10:35", chime: true, preChime: false },
  // 2限
  { time: "10:45", chime: true, preChime: true },
  { time: "11:35", chime: true, preChime: false },
  // 3限
  { time: "11:45", chime: true, preChime: true },
  { time: "12:35", chime: true, preChime: false },
  // 4限
  { time: "13:15", chime: true, preChime: true },
  { time: "14:05", chime: true, preChime: false },
  // 5限
  { time: "14:15", chime: true, preChime: true },
  { time: "15:05", chime: true, preChime: false },
  // 6限
  { time: "15:15", chime: true, preChime: true },
  { time: "16:05", chime: true, preChime: false },
  // 終礼
  { time: "16:15", chime: true, preChime: false },
  // 完全下校
  { time: "17:25", chime: false, preChime: true },
  { time: "17:30", chime: true, preChime: true },
];

/**
 * カウントダウンに表示する日付
 */
export const kYearlyCountdownDates: CountdownData[] = [
  { date: "02-14", label: "バレンタイン", color: "pink", type: "yearly" },
  { date: "03-31", label: "今年度終了", color: "gray", type: "yearly" },
  { date: "06-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "07-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "08-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "09-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "10-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "11-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "12-15", label: "レポート期限", color: "blue", type: "yearly" },
  { date: "12-25", label: "クリスマス", color: "red", type: "yearly" },
  { date: "12-31", label: "大晦日", color: "gray", type: "yearly" },
];

/** 
 * Arduinoにセンサー情報の取得をリクエストするときの生データ
 */
export const kRawRequest = new TextEncoder().encode("REQUEST_SENSOR_DATA;");

/**
 * センサー情報の種類
 */
export const kDataKinds = ["気温", "湿度", "気圧", "ガス抵抗値"];

/**
 * 画面効果の種類
 */
export const kEffects = ["none", "sakura", "snowflake"];