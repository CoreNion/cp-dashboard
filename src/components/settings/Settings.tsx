import { lazy } from 'react';
import { updateSettings, useSettings } from '../../store/settings.ts';
import { DynamicModal } from '../DynamicModal.tsx';
import { AdSetting } from './AdSetting.tsx';
import { AudioSetting } from './AudioSetting.tsx';
import { ChimeSetting } from './ChimeSetting.tsx';
import { GeneralSetting } from './GeneralSetting.tsx';

// 地図やカレンダーのライブラリはサイズが大きいため、開いたときに読み込む
const WeatherSetting = lazy(() => import('./WeatherSetting.tsx').then((m) => ({ default: m.WeatherSetting })));
const CountdownSetting = lazy(() => import('./CountdownSetting.tsx').then((m) => ({ default: m.CountdownSetting })));

/** 設定画面 */
export const Settings = () => {
  const chime = useSettings((s) => s.chime);

  return (
    <div>
      <h3 className="font-bold text-lg">設定</h3>
      <div className="pt-2">
        <GeneralSetting />
        <DynamicModal btnTitle="天気設定" btnWfull>
          <WeatherSetting />
        </DynamicModal>
      </div>

      <div className="divider"></div>

      <h4 className="font-bold">音声設定</h4>
      <div className="py-3">
        <AudioSetting labelText="タイマー終了時" kind="alert" />
        <AudioSetting labelText="チャイム" kind="chime" />
        <AudioSetting labelText="予鈴チャイム" kind="preChime" />

        <label className="setting-row cursor-pointer mt-4">
          <span>チャイム鳴動状態</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={chime.enabled}
            onChange={(e) => updateSettings('chime', { enabled: e.target.checked })}
          />
        </label>
        <label className="setting-row cursor-pointer mt-4">
          <span>予鈴鳴動状態</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={chime.preEnabled}
            onChange={(e) => updateSettings('chime', { preEnabled: e.target.checked })}
          />
        </label>
      </div>
      <DynamicModal btnTitle="チャイム設定" btnWfull>
        <ChimeSetting />
      </DynamicModal>

      <div className="divider"></div>

      <h4 className="font-bold">宣伝機能設定 (大画面のみ)</h4>
      <AdSetting />
      <DynamicModal btnWfull btnTitle="カウントダウン設定">
        <CountdownSetting />
      </DynamicModal>

      <div className="divider"></div>

      <span className="font-light">First Built by CoreNion (N6)</span>
      <br />
      <span className="font-light">Special Thanks to Shibuya CP🫶</span>
      <br />
      <span className="font-light">Campus Dashboard v{__APP_VERSION__}</span>
      <div className="flex flex-row justify-around mt-3">
        <a href="https://github.com/CoreNion/cp-dashboard/wiki/" className="link">
          ドキュメント
        </a>
        <a href="https://github.com/CoreNion/cp-dashboard/" className="link">
          Source Code
        </a>
      </div>
    </div>
  );
};
