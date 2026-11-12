import { kAutoTimezone, kChimeTimes, kDefaultAudioName, kDefaultFont, kYearlyCountdownDates } from '../constants.ts';
import type { Settings } from '../types.ts';

/** 設定を保存するLocalStorageのキー */
export const kSettingsKey = 'cpd-settings';

/** 設定の初期値 */
export const createDefaultSettings = (): Settings => ({
  version: __APP_VERSION__,
  appearance: {
    theme: 'dash',
    clockEffect: '自動 (端末に最適化)',
    screenEffect: 'none',
    font: kDefaultFont,
    customFonts: [],
    fontSize: 1.0,
  },
  chime: {
    enabled: false,
    preEnabled: false,
    times: kChimeTimes,
  },
  audio: {
    alert: kDefaultAudioName,
    chime: kDefaultAudioName,
    preChime: kDefaultAudioName,
  },
  countdown: {
    once: [],
    yearly: kYearlyCountdownDates,
  },
  infoScroll: {
    enabled: false,
    text: '',
  },
  weather: {
    wideRegion: '010300',
    office: '130000',
    area: '130010',
    amedasCode: '44132',
    amedasName: '東京',
    onlyTemp: false,
  },
  banner: {
    horizontal: false,
    vertical: false,
  },
  clock: {
    ntpSync: true,
    timezone: kAutoTimezone,
  },
});

/* ---------- v1 (Nuxt版) からの移行 ---------- */

/** v1で使用していたLocalStorageのキー (センサー系など、移行せず破棄するものも含む) */
const kLegacyKeys = [
  'nuxt-color-mode',
  'clockEffect',
  'screenEffect',
  'font',
  'customFonts',
  'fontSize',
  'alert.mp3',
  'chime.mp3',
  'pre-chime.mp3',
  'chimeTimes',
  'countdownDates',
  'yearlyCountdownDates',
  'isChimeEnabled',
  'isPreChimeEnabled',
  'isInfoScrollEnabled',
  'infoScrollText',
  'weatherWideRegionNumber',
  'weatherOfficeNumber',
  'weatherAreaNumber',
  'isAmedasOnlyTmp',
  'weatherAmedasCode',
  'weatherAmedasName',
  'isBannerVisible',
  'isVerticalBanner',
  'banner.png',
  'vertical-banner.png',
  // 廃止されたセンサー機能
  'sensorSource',
  'isSensorInfoVisible',
  'isSensorRecording',
];

/* v1の値はVueUseのuseLocalStorage形式 (文字列はそのまま、真偽値/数値は文字列、配列はJSON) */

const legacyString = (storage: Storage, key: string, fallback: string) => storage.getItem(key) ?? fallback;

const legacyBoolean = (storage: Storage, key: string, fallback: boolean) => {
  const raw = storage.getItem(key);
  return raw === 'true' ? true : raw === 'false' ? false : fallback;
};

const legacyNumber = (storage: Storage, key: string, fallback: number) => {
  const raw = storage.getItem(key);
  const value = raw == null ? NaN : Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
};

const legacyArray = <T>(storage: Storage, key: string, fallback: T[]): T[] => {
  const raw = storage.getItem(key);
  if (raw == null) return fallback;

  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch {
    return fallback;
  }
};

/** v1の設定が残っているか */
const hasLegacySettings = (storage: Storage) => kLegacyKeys.some((key) => storage.getItem(key) != null);

/** v1のLocalStorageの各キーから設定を組み立てる */
const readLegacySettings = (storage: Storage): Settings => {
  const d = createDefaultSettings();

  return {
    version: __APP_VERSION__,
    appearance: {
      theme: legacyString(storage, 'nuxt-color-mode', d.appearance.theme),
      clockEffect: legacyString(storage, 'clockEffect', d.appearance.clockEffect),
      screenEffect: legacyString(storage, 'screenEffect', d.appearance.screenEffect),
      font: legacyString(storage, 'font', d.appearance.font),
      customFonts: legacyArray(storage, 'customFonts', d.appearance.customFonts),
      fontSize: legacyNumber(storage, 'fontSize', d.appearance.fontSize),
    },
    chime: {
      enabled: legacyBoolean(storage, 'isChimeEnabled', d.chime.enabled),
      preEnabled: legacyBoolean(storage, 'isPreChimeEnabled', d.chime.preEnabled),
      times: legacyArray(storage, 'chimeTimes', d.chime.times),
    },
    audio: {
      alert: legacyString(storage, 'alert.mp3', d.audio.alert),
      chime: legacyString(storage, 'chime.mp3', d.audio.chime),
      preChime: legacyString(storage, 'pre-chime.mp3', d.audio.preChime),
    },
    countdown: {
      once: legacyArray(storage, 'countdownDates', d.countdown.once),
      yearly: legacyArray(storage, 'yearlyCountdownDates', d.countdown.yearly),
    },
    infoScroll: {
      enabled: legacyBoolean(storage, 'isInfoScrollEnabled', d.infoScroll.enabled),
      text: legacyString(storage, 'infoScrollText', d.infoScroll.text),
    },
    weather: {
      wideRegion: legacyString(storage, 'weatherWideRegionNumber', d.weather.wideRegion),
      office: legacyString(storage, 'weatherOfficeNumber', d.weather.office),
      area: legacyString(storage, 'weatherAreaNumber', d.weather.area),
      amedasCode: legacyString(storage, 'weatherAmedasCode', d.weather.amedasCode),
      amedasName: legacyString(storage, 'weatherAmedasName', d.weather.amedasName),
      onlyTemp: legacyBoolean(storage, 'isAmedasOnlyTmp', d.weather.onlyTemp),
    },
    banner: {
      horizontal: legacyBoolean(storage, 'isBannerVisible', d.banner.horizontal),
      vertical: legacyBoolean(storage, 'isVerticalBanner', d.banner.vertical),
    },
    clock: d.clock,
  };
};

/** v1のキーを削除する (カスタムフォントはファイル名がキーになっている) */
const removeLegacyKeys = (storage: Storage, settings: Settings) => {
  [...kLegacyKeys, ...settings.appearance.customFonts].forEach((key) => storage.removeItem(key));
};

/* ---------- v2以降の設定の移行 ---------- */

/**
 * 保存済みの設定を新しいバージョンの形式へ変換する処理の一覧。
 * 設定の形式を変更した場合は、変更したバージョンと変換処理をここへ追加する。
 */
const kMigrations: { version: string; migrate: (settings: Settings) => Settings }[] = [];

/** バージョン文字列を比較する (a < b なら負の値) */
const compareVersion = (a: string, b: string) => {
  const pa = a.split('.').map((v) => Number.parseInt(v) || 0);
  const pb = b.split('.').map((v) => Number.parseInt(v) || 0);
  return [0, 1, 2].reduce((acc, i) => (acc !== 0 ? acc : (pa[i] ?? 0) - (pb[i] ?? 0)), 0);
};

/** 保存された設定に不足している項目を初期値で補う */
const mergeWithDefaults = (saved: Partial<Settings>): Settings => {
  const d = createDefaultSettings();

  return {
    version: saved.version ?? d.version,
    appearance: { ...d.appearance, ...saved.appearance },
    chime: { ...d.chime, ...saved.chime },
    audio: { ...d.audio, ...saved.audio },
    countdown: { ...d.countdown, ...saved.countdown },
    infoScroll: { ...d.infoScroll, ...saved.infoScroll },
    weather: { ...d.weather, ...saved.weather },
    banner: { ...d.banner, ...saved.banner },
    clock: { ...d.clock, ...saved.clock },
  };
};

/** v2以降の保存済み設定を読み込み、必要なら現在の形式へ変換する */
const readSavedSettings = (raw: string): Settings | null => {
  try {
    const saved = mergeWithDefaults(JSON.parse(raw) as Partial<Settings>);

    const migrated = kMigrations
      .filter((m) => compareVersion(saved.version, m.version) < 0)
      .reduce((acc, m) => m.migrate(acc), saved);

    return { ...migrated, version: __APP_VERSION__ };
  } catch (e) {
    console.error('設定の読み込みに失敗しました', e);
    return null;
  }
};

/**
 * 設定を読み込む。旧バージョンの設定が残っている場合は自動的に移行する。
 */
export const loadSettings = (storage: Storage = localStorage): Settings => {
  const raw = storage.getItem(kSettingsKey);
  if (raw != null) {
    const saved = readSavedSettings(raw);
    if (saved != null) {
      storage.setItem(kSettingsKey, JSON.stringify(saved));
      return saved;
    }
  }

  // v1 (Nuxt版) の設定が残っていれば移行する
  if (hasLegacySettings(storage)) {
    const migrated = readLegacySettings(storage);
    // 新しい設定を保存してから、古いキーを削除する
    storage.setItem(kSettingsKey, JSON.stringify(migrated));
    removeLegacyKeys(storage, migrated);

    console.info(`v1の設定をv${__APP_VERSION__}へ移行しました`);
    return migrated;
  }

  return createDefaultSettings();
};
