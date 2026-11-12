/* 時計更新用のworker (バックグラウンドのタブでも正確に動作させるため、メインスレッドから分離) */

import type { ClockSync } from '../types.ts';

/** メインスレッドから受け取るメッセージ */
export type ClockRequest = { type: 'config'; ntpSync: boolean } | { type: 'sync' };

/** メインスレッドへ送るメッセージ */
export type ClockMessage = { type: 'tick'; time: number } | { type: 'sync'; status: ClockSync };

/** 1回の問い合わせで得られた補正量と往復時間 (ms) */
type Sample = { offset: number; delay: number };

/* WebNTP (https://webntp.shogo82148.com/) のWebSocket API */
const kWebNtpUrl = 'wss://webntp.shogo82148.com/websocket';
const kWebNtpProtocol = 'webntp.shogo82148.com';

/** 1回の同期で問い合わせる回数 */
const kSampleCount = 8;
/** これより往復時間が長い問い合わせは使用しない (ms) */
const kMaxDelay = 1000;
/** 1回の同期にかけられる時間 (ms) */
const kSyncTimeout = 5000;
/** 同期の間隔 (ms) */
const kSyncInterval = 10 * 60 * 1000;
/** 同期に失敗した場合に再試行するまでの時間 (ms) */
const kRetryInterval = 60 * 1000;
/** 端末の時計が変更されたと判断する、時計の進みの食い違い (ms) */
const kClockJumpThreshold = 1000;

const kSyncOff: ClockSync = { state: 'off', offset: null, delay: null, syncedAt: null };

// 時刻補正が有効か
let ntpSync = false;
// 端末の時計に対する補正量 (ms)
let offset = 0;
let status: ClockSync = kSyncOff;
let syncing = false;
let syncTimer: ReturnType<typeof setTimeout> | undefined;
let started = false;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const post = (message: ClockMessage) => self.postMessage(message);

/** 補正済みの現在時刻 (ms) */
const now = () => Date.now() + offset;

const postTick = () => post({ type: 'tick', time: now() });

const setStatus = (next: ClockSync) => {
  status = next;
  post({ type: 'sync', status });
};

/**
 * WebNTPへ複数回問い合わせ、往復時間が最も短かった結果を返す。
 * 往復時間が短いほど、行きと帰りの時間差による誤差が小さい
 */
const measure = () =>
  new Promise<Sample>((resolve, reject) => {
    const socket = new WebSocket(kWebNtpUrl, [kWebNtpProtocol]);
    const samples: Sample[] = [];
    let count = 0;
    let sentAt = 0;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      socket.close();

      const best = samples.reduce<Sample | null>((acc, s) => (acc === null || s.delay < acc.delay ? s : acc), null);
      if (best !== null) resolve(best);
      else reject(new Error('WebNTPから時刻を取得できませんでした'));
    };
    const timeout = setTimeout(finish, kSyncTimeout);

    const send = () => {
      // 往復時間は、端末の時計の変更に影響されないperformance.now()で測る
      sentAt = performance.now();
      socket.send((Date.now() / 1000).toString());
    };

    socket.addEventListener('open', send);
    socket.addEventListener('message', (event: MessageEvent<unknown>) => {
      const delay = performance.now() - sentAt;
      const received = Date.now();

      try {
        // st: サーバーが応答を送信した時刻 (秒)
        const { st } = JSON.parse(String(event.data)) as { st?: unknown };
        if (typeof st === 'number' && delay <= kMaxDelay) {
          samples.push({ offset: st * 1000 - received + delay / 2, delay });
        }
      } catch {
        finish();
        return;
      }

      if (++count >= kSampleCount) finish();
      else send();
    });
    socket.addEventListener('error', finish);
    socket.addEventListener('close', finish);
  });

const scheduleSync = (ms: number) => {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncClock, ms);
};

/** WebNTPと同期して補正量を更新する (失敗した場合は前回の補正量を維持) */
const syncClock = async () => {
  if (!ntpSync || syncing) return;

  syncing = true;
  setStatus({ ...status, state: 'syncing' });
  try {
    const best = await measure();
    // 同期中に無効化された場合は反映しない
    if (!ntpSync) return;

    offset = best.offset;
    setStatus({ state: 'synced', offset: best.offset, delay: best.delay, syncedAt: now() });
    postTick();
    scheduleSync(kSyncInterval);
  } catch (e) {
    if (!ntpSync) return;

    console.warn('時刻の同期に失敗しました', e);
    setStatus({ ...status, state: 'failed' });
    scheduleSync(kRetryInterval);
  } finally {
    syncing = false;
  }
};

/** 1秒ごとに時刻を送信する */
const startTick = async () => {
  let lastWall = Date.now();
  let lastPerf = performance.now();

  while (true) {
    // 現在時刻を送信
    postTick();

    // 次に秒が切り替わる瞬間まで待つ
    // 毎回秒の境界に合わせ直すことで、待ち時間の遅延が蓄積しないようにする (+1msは境界の手前で起きるのを防ぐため)
    await sleep(1000 - (now() % 1000) + 1);

    // 端末の時計が変更された場合 (手動での変更やスリープからの復帰など) は同期し直す
    const wall = Date.now();
    const perf = performance.now();
    if (Math.abs(wall - lastWall - (perf - lastPerf)) > kClockJumpThreshold) syncClock();
    lastWall = wall;
    lastPerf = perf;
  }
};

self.addEventListener('message', (event: MessageEvent<ClockRequest>) => {
  const data = event.data;

  if (data.type === 'config') {
    ntpSync = data.ntpSync;
    if (ntpSync) {
      syncClock();
    } else {
      // 補正をやめて端末の時計に戻す
      clearTimeout(syncTimer);
      offset = 0;
      setStatus(kSyncOff);
      if (started) postTick();
    }

    // 最初の設定を受け取ってから時計を開始
    if (!started) {
      started = true;
      startTick();
    }
  } else if (data.type === 'sync') {
    syncClock();
  }
});

// オンラインに復帰したら同期し直す
self.addEventListener('online', () => {
  syncClock();
});
