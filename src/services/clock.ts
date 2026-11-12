import { updateRuntime } from '../store/runtime.ts';
import { getSettings, settingsStore } from '../store/settings.ts';
import type { ClockMessage, ClockRequest } from '../workers/clock.ts';
import { zoned } from '../utils/time.ts';
import { playAudio } from './audio.ts';

/** 今日鳴らしたチャイム/予鈴の記録 (日付が変わるとリセット) */
type PlayedRecord = { date: string; chime: Set<string>; preChime: Set<string> };

const createPlayedRecord = (date: string): PlayedRecord => ({ date, chime: new Set(), preChime: new Set() });

let played = createPlayedRecord('');

/** 現在時刻に応じてチャイム/予鈴を鳴らす */
const checkChime = (date: Date) => {
  const { enabled, preEnabled, times } = getSettings().chime;
  if (!enabled) return;

  const now = zoned(date, getSettings().clock.timezone);

  // 日付が変わったら鳴動状況をリセット
  const today = now.format('YYYY-MM-DD');
  if (played.date !== today) played = createPlayedRecord(today);

  const currentTime = now.format('HH:mm');
  const nextMinute = now.add(1, 'minute').format('HH:mm');

  times.forEach((cT) => {
    if (currentTime === cT.time && cT.chime && !played.chime.has(cT.time)) {
      // チャイムを鳴らす
      playAudio('chime');
      played.chime.add(cT.time);
    } else if (nextMinute === cT.time && cT.preChime && !played.preChime.has(cT.time)) {
      // 1分前に予鈴を鳴らす
      if (preEnabled) playAudio('preChime');
      played.preChime.add(cT.time);
    }
  });
};

let worker: Worker | null = null;

const postRequest = (request: ClockRequest) => worker?.postMessage(request);

/**
 * 時計用のworkerを起動する
 * @returns 最初の時刻を受信したら解決されるPromise
 */
export const startClock = () =>
  new Promise<void>((resolve) => {
    const clockWorker = new Worker(new URL('../workers/clock.ts', import.meta.url), { type: 'module' });
    worker = clockWorker;

    // workerからの時刻を用いて各種処理を行う
    clockWorker.addEventListener('message', (event: MessageEvent<ClockMessage>) => {
      const data = event.data;

      if (data.type === 'tick') {
        // 現在時刻を更新
        const date = new Date(data.time);
        updateRuntime({ time: date });
        checkChime(date);

        resolve();
      } else if (data.type === 'sync') {
        // 時刻補正の状態を更新
        updateRuntime({ clockSync: data.status });
      }
    });

    // 時刻補正の設定を渡して時計を開始し、以降は設定が変更されるたびに渡し直す
    let ntpSync = getSettings().clock.ntpSync;
    postRequest({ type: 'config', ntpSync });
    settingsStore.subscribe(() => {
      const next = getSettings().clock.ntpSync;
      if (next === ntpSync) return;

      ntpSync = next;
      postRequest({ type: 'config', ntpSync });
    });
  });

/** 時刻を今すぐ同期する */
export const syncClockNow = () => {
  postRequest({ type: 'sync' });
};
