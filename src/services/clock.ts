import dayjs from 'dayjs';
import { updateRuntime } from '../store/runtime.ts';
import { getSettings } from '../store/settings.ts';
import { playAudio } from './audio.ts';

/** 今日鳴らしたチャイム/予鈴の記録 (日付が変わるとリセット) */
type PlayedRecord = { date: string; chime: Set<string>; preChime: Set<string> };

const createPlayedRecord = (date: string): PlayedRecord => ({ date, chime: new Set(), preChime: new Set() });

let played = createPlayedRecord('');

/** 現在時刻に応じてチャイム/予鈴を鳴らす */
const checkChime = (date: Date) => {
  const { enabled, preEnabled, times } = getSettings().chime;
  if (!enabled) return;

  const now = dayjs(date);

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

/**
 * 時計用のworkerを起動する
 * @returns 最初の時刻を受信したら解決されるPromise
 */
export const startClock = () =>
  new Promise<void>((resolve) => {
    const worker = new Worker(new URL('../workers/clock.ts', import.meta.url), { type: 'module' });

    // workerからの時刻を用いて各種処理を行う
    worker.addEventListener('message', (event: MessageEvent<Date>) => {
      const date = event.data;
      if (!(date instanceof Date)) return;

      // 現在時刻を更新
      updateRuntime({ time: date });
      checkChime(date);

      resolve();
    });
  });
