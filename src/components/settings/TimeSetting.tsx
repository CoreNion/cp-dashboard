import { kAutoTimezone } from '../../constants.ts';
import { syncClockNow } from '../../services/clock.ts';
import { useRuntime } from '../../store/runtime.ts';
import { updateSettings, useSettings } from '../../store/settings.ts';
import type { ClockSync } from '../../types.ts';
import { deviceTimezone, listTimezones, zoned } from '../../utils/time.ts';

const kTimezones = listTimezones();

const kStateLabels: Record<ClockSync['state'], string> = {
  off: '補正なし (端末の時計)',
  syncing: '同期中...',
  synced: '同期済み',
  failed: '同期失敗 (自動で再試行します)',
};

/** 補正量を符号付きで表示する */
const formatOffset = (offset: number) => `${offset >= 0 ? '+' : '-'}${Math.abs(offset).toFixed(0)} ms`;

/** 時刻補正とタイムゾーンの設定 */
export const TimeSetting = () => {
  const clock = useSettings((s) => s.clock);
  const sync = useRuntime((s) => s.clockSync);

  return (
    <div>
      <h3 className="font-bold text-lg">時刻設定</h3>

      <div className="pt-2">
        <label className="setting-row cursor-pointer">
          <span>オンライン時刻補正</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={clock.ntpSync}
            onChange={(e) => updateSettings('clock', { ntpSync: e.target.checked })}
          />
        </label>
        <p className="text-sm opacity-70">
          オンライン時に
          <a href="https://webntp.shogo82148.com/" className="link" target="_blank" rel="noreferrer">
            WebNTP
          </a>
          から正確な時刻を取得し、端末の時計のずれを補正します。
        </p>

        <div className="stats stats-vertical w-full shadow my-3">
          <div className="stat py-2">
            <div className="stat-title">状態</div>
            <div className="text-lg font-semibold">{kStateLabels[sync.state]}</div>
          </div>
          <div className="stat py-2">
            <div className="stat-title">端末の時計に対する補正量</div>
            <div className="text-lg font-semibold tabular-nums">
              {sync.offset != null ? formatOffset(sync.offset) : '-'}
              {sync.delay != null && <span className="text-sm font-normal opacity-70"> (往復 {sync.delay.toFixed(0)} ms)</span>}
            </div>
          </div>
          <div className="stat py-2">
            <div className="stat-title">最終同期</div>
            <div className="text-lg font-semibold tabular-nums">
              {sync.syncedAt != null ? zoned(sync.syncedAt, clock.timezone).format('HH:mm:ss') : '-'}
            </div>
          </div>
        </div>

        <button className="btn btn-outline btn-secondary w-full" disabled={!clock.ntpSync || sync.state === 'syncing'} onClick={syncClockNow}>
          今すぐ同期
        </button>
      </div>

      <div className="divider"></div>

      <label className="setting-row">
        <span>タイムゾーン</span>
        <select className="select w-56" value={clock.timezone} onChange={(e) => updateSettings('clock', { timezone: e.target.value })}>
          <option value={kAutoTimezone}>自動 ({deviceTimezone()})</option>
          {kTimezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm opacity-70">時計・日付・チャイム・カウントダウンに使用するタイムゾーンです。</p>
    </div>
  );
};
