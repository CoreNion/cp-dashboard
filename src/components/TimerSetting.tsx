import { useRuntime } from '../store/runtime.ts';
import { updateSettings, useSettings } from '../store/settings.ts';
import { addTimerLimit, pauseTimer, resetTimer, startTimer } from '../services/timer.ts';

/** チャイム/予鈴の切り替えと、タイマーの操作 */
export const TimerSetting = () => {
  const { active, setting } = useRuntime((s) => s.timer);
  const chime = useSettings((s) => s.chime);

  return (
    <div className="min-w-full flex flex-row flex-wrap justify-center items-center gap-2">
      <div className="2xl:min-w-full flex flex-col gap-1">
        <label className="setting-row cursor-pointer gap-4">
          <span>チャイム</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={chime.enabled}
            onChange={(e) => updateSettings('chime', { enabled: e.target.checked })}
          />
        </label>
        <label className="setting-row cursor-pointer">
          <span>予鈴</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={chime.preEnabled}
            onChange={(e) => updateSettings('chime', { preEnabled: e.target.checked })}
          />
        </label>
      </div>

      <div>
        <h3 className="text-xl font-bold">タイマー設定</h3>

        <div className="flex flex-row items-center">
          <input className="grow w-14 outline-none input input-ghost" placeholder="時間" value={setting[0]} readOnly aria-label="時間" />
          <span className="font-bold mx-2">:</span>
          <input className="grow w-14 outline-none input input-ghost" placeholder="分" value={setting[1]} readOnly aria-label="分" />
          <span className="font-bold mx-2">:</span>
          <input className="grow w-14 outline-none input input-ghost" placeholder="秒" value={setting[2]} readOnly aria-label="秒" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row gap-2">
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 5, 0])}>
              +5分
            </button>
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 1, 0])}>
              +1分
            </button>
            <button className="btn btn-outline btn-secondary max-2xl:btn-sm" onClick={() => addTimerLimit([0, 0, 10])}>
              +10秒
            </button>
          </div>

          <div className="flex gap-2 justify-center">
            <button className="btn btn-primary max-2xl:btn-sm" onClick={() => (active ? pauseTimer() : startTimer())}>
              {active ? '一時停止' : 'スタート'}
            </button>
            <button className="btn btn-neutral max-2xl:btn-sm" onClick={resetTimer}>
              clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
