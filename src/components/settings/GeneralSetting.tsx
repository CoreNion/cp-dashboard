import { kClockEffects, kEffects, themes } from '../../constants.ts';
import { updateSettings, useSettings } from '../../store/settings.ts';
import { DynamicModal } from '../DynamicModal.tsx';
import { FontSetting } from './FontSetting.tsx';

/** テーマや表示効果などの一般設定 */
export const GeneralSetting = () => {
  const appearance = useSettings((s) => s.appearance);
  const infoScroll = useSettings((s) => s.infoScroll);

  return (
    <>
      <label className="setting-row">
        <span>テーマ</span>
        <select className="select w-44" value={appearance.theme} onChange={(e) => updateSettings('appearance', { theme: e.target.value })}>
          {themes.map((theme) => (
            <option key={theme}>{theme}</option>
          ))}
        </select>
      </label>
      <label className="setting-row">
        <span>時刻表示の効果</span>
        <select
          className="select w-44"
          value={appearance.clockEffect}
          onChange={(e) => updateSettings('appearance', { clockEffect: e.target.value })}
        >
          {kClockEffects.map((clockEffect) => (
            <option key={clockEffect}>{clockEffect}</option>
          ))}
        </select>
      </label>
      <label className="setting-row">
        <span>画面エフェクト</span>
        <select
          className="select w-44"
          value={appearance.screenEffect}
          onChange={(e) => updateSettings('appearance', { screenEffect: e.target.value })}
        >
          {kEffects.map((effect) => (
            <option key={effect}>{effect}</option>
          ))}
        </select>
      </label>

      <DynamicModal btnWfull btnTitle="フォント設定">
        <FontSetting />
      </DynamicModal>

      <label className="setting-row cursor-pointer">
        <span>情報スクロールの有効化</span>
        <input
          type="checkbox"
          className="toggle toggle-secondary"
          checked={infoScroll.enabled}
          onChange={(e) => updateSettings('infoScroll', { enabled: e.target.checked })}
        />
      </label>
      {infoScroll.enabled && (
        <input
          type="text"
          placeholder="スクロールに表示される文章を入力..."
          className="input w-full my-2"
          value={infoScroll.text}
          onChange={(e) => updateSettings('infoScroll', { text: e.target.value })}
        />
      )}
    </>
  );
};
