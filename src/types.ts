/** チャイムの鳴動時刻 */
export type ChimeTime = {
  time: string;
  chime: boolean;
  preChime: boolean;
};

export type CountdownDateType = 'yearly' | 'once';

/** カウントダウンに表示するイベント */
export type CountdownData = {
  date: string;
  label: string;
  color: string;
  type: CountdownDateType;
};

/** 音源の種類 */
export type AudioKind = 'alert' | 'chime' | 'preChime';

/** 永続化される設定 */
export type Settings = {
  /** この設定を保存したアプリのバージョン */
  version: string;
  appearance: {
    theme: string;
    clockEffect: string;
    screenEffect: string;
    font: string;
    customFonts: string[];
    /** フォントサイズの倍率 */
    fontSize: number;
  };
  chime: {
    enabled: boolean;
    preEnabled: boolean;
    times: ChimeTime[];
  };
  /** 各音源の元ファイル名 (デフォルトの場合は kDefaultAudioName) */
  audio: Record<AudioKind, string>;
  countdown: {
    /** 繰り返さないイベント (YYYY-MM-DD) */
    once: CountdownData[];
    /** 毎年のイベント (MM-DD) */
    yearly: CountdownData[];
  };
  infoScroll: {
    enabled: boolean;
    text: string;
  };
  weather: {
    /** 広域地方番号 */
    wideRegion: string;
    /** office番号 */
    office: string;
    /** 地域番号 */
    area: string;
    amedasCode: string;
    amedasName: string;
    /** 外気温のみ使用するか */
    onlyTemp: boolean;
  };
  banner: {
    horizontal: boolean;
    vertical: boolean;
  };
  clock: {
    /** オンライン時にWebNTPで時刻を補正するか */
    ntpSync: boolean;
    /** 表示に使うタイムゾーン (IANA名。kAutoTimezoneの場合は端末の設定) */
    timezone: string;
  };
};

/** WebNTPによる時刻補正の状態 */
export type ClockSync = {
  state: 'off' | 'syncing' | 'synced' | 'failed';
  /** 端末の時計に対する補正量 (ms) */
  offset: number | null;
  /** 補正量を求めた通信の往復時間 (ms) */
  delay: number | null;
  /** 最後に同期した時刻 (ms) */
  syncedAt: number | null;
};

/** 保存されないアプリの状態 */
export type Runtime = {
  /** 初期化が完了したか */
  ready: boolean;
  /** 一回でも画面がクリックされたか */
  firstClicked: boolean;
  /** 画面の横幅 */
  width: number;
  /** 現在時刻 */
  time: Date;
  clockSync: ClockSync;
  timer: {
    active: boolean;
    /** 残り時間 (h:m:s) */
    remaining: number[] | null;
    /** 設定時間 (h:m:s) */
    setting: number[];
  };
  weather: {
    icon: string | null;
    outTmp: number | null;
    pressure: number | null;
  };
  /** 適用中のフォントファミリー */
  fontFamily: string;
  bannerUrl: string | null;
  verticalBannerUrl: string | null;
};
