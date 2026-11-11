import { kChimeTimes } from '../../constants.ts';
import { getSettings, updateSettings, useSettings } from '../../store/settings.ts';
import type { ChimeTime } from '../../types.ts';
import { Icon } from '../Icon.tsx';

/// チャイムの鳴動時刻を昇順でソート
const sortChimeTimes = (times: ChimeTime[]) => times.toSorted((a, b) => a.time.localeCompare(b.time));

/** チャイムの鳴動時刻を追加 */
const addChimeTime = (time: string) => {
  const { times } = getSettings().chime;
  updateSettings('chime', { times: sortChimeTimes([...times, { time, chime: true, preChime: false }]) });
};

/** チャイムの鳴動時刻を削除 */
const removeChimeTime = (index: number) => {
  const { times } = getSettings().chime;
  updateSettings('chime', { times: times.filter((_, i) => i !== index) });
};

/** チャイムの鳴動時刻を変更 */
const changeChimeTime = (index: number, patch: Partial<ChimeTime>) => {
  const { times } = getSettings().chime;
  updateSettings('chime', { times: sortChimeTimes(times.map((t, i) => (i === index ? { ...t, ...patch } : t))) });
};

const onResetButton = () => {
  if (window.confirm('チャイムの設定時刻を全て削除し、デフォルトの状態に戻しますか？')) {
    updateSettings('chime', { times: kChimeTimes });
  }
};

/** チャイムの鳴動時刻の設定 */
export const ChimeSetting = () => {
  const times = useSettings((s) => s.chime.times);

  return (
    <>
      <h3 className="font-bold text-lg">チャイム時刻設定</h3>
      <div className="py-2">
        <button className="btn w-full" onClick={() => addChimeTime('00:00')}>
          チャイム鳴動時刻を追加
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>削除</th>
              <th>時刻</th>
              <th>チャイム</th>
              <th>予鈴</th>
            </tr>
          </thead>
          <tbody>
            {times.map((chimeTime, index) => (
              // 時刻の変更で並び順が変わるため、入力中は確定(フォーカスが外れる)まで反映しない
              <tr key={`${index}-${chimeTime.time}`}>
                <td>
                  <button className="btn btn-sm btn-circle btn-outline btn-error" onClick={() => removeChimeTime(index)} aria-label="削除">
                    <Icon name="uil:trash-alt" />
                  </button>
                </td>
                <td>
                  <input
                    type="time"
                    defaultValue={chimeTime.time}
                    className="input"
                    aria-label="時刻"
                    onBlur={(e) => {
                      if (e.target.value !== '' && e.target.value !== chimeTime.time) changeChimeTime(index, { time: e.target.value });
                    }}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={chimeTime.chime}
                    aria-label="チャイム"
                    onChange={(e) => changeChimeTime(index, { chime: e.target.checked })}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={chimeTime.preChime}
                    aria-label="予鈴"
                    onChange={(e) => changeChimeTime(index, { preChime: e.target.checked })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-error w-full" onClick={onResetButton}>
          時刻のリセット
        </button>
      </div>
    </>
  );
};
