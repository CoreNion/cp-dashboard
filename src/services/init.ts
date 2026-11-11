import { updateRuntime } from '../store/runtime.ts';
import { startAppearance } from './appearance.ts';
import { loadAllAudio } from './audio.ts';
import { startClock } from './clock.ts';
import { startTimerWorker } from './timer.ts';
import { startWeather } from './weather.ts';

/** 初期化が終わらない場合に、読み込み中の画面を強制的に終了するまでの時間 (ms) */
const kReadyTimeout = 5000;

/**
 * アプリの各機能を起動する。
 * 表示に必要な準備が終わると、読み込み中の画面が解除される。
 */
export const startApp = async () => {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, kReadyTimeout));

  // 天気はネットワークに依存するため、取得完了を待たない
  startTimerWorker();
  startWeather();

  try {
    await Promise.race([Promise.all([startAppearance(), startClock()]), timeout]);
  } catch (e) {
    console.error('初期化中にエラーが発生しました', e);
  }

  updateRuntime({ ready: true });
};

/**
 * 最初の画面クリック時に行う、バックグラウンドで正常に動作するための対策。
 * iOS / Safariでは、画面クリック後に各種権限を取得する必要がある模様
 */
export const onFirstClick = async () => {
  // スリープを無効化
  try {
    await navigator.wakeLock.request('screen');
    // タブ切り替え後でも持続するようにする
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        try {
          await navigator.wakeLock.request('screen');
        } catch (e) {
          console.warn(e);
        }
      }
    });
  } catch (e) {
    console.warn(e);
  }

  // フォアグラウンドで音を鳴らした履歴を残す (いきなりバックグラウンドでは音が鳴らない模様)
  // iOSではこれだけでは不十分
  new Audio(`${import.meta.env.BASE_URL}beep.mp3`).play().catch((e) => console.warn(e));

  // チャイム/予鈴/アラートの音源を読み込む (iOS対策でHTMLAudioをこの時点で読み込む)
  await loadAllAudio();

  updateRuntime({ firstClicked: true });
};
