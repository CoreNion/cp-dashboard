import { useRuntime } from '../store/runtime.ts';
import { useSettings } from '../store/settings.ts';
import { cssVars } from '../utils/css.ts';
import { DynamicModal } from './DynamicModal.tsx';
import { Icon } from './Icon.tsx';
import { GeneralSetting } from './settings/GeneralSetting.tsx';
import { Settings } from './settings/Settings.tsx';

/** 気象情報の表示 (大画面のみ) */
export const Status = () => {
  const { outTmp, pressure } = useRuntime((s) => s.weather);
  const fontSize = useSettings((s) => s.appearance.fontSize);

  // 種類名/値の文字サイズ
  const valueNameSize = `${6 * fontSize}vh`;
  const valueSize = `${8.5 * fontSize}vh`;

  return (
    <div
      className="min-w-full stats stats-vertical shadow"
      style={cssVars({ '--value-name-size': valueNameSize, '--value-size': valueSize })}
    >
      {/* 気圧 */}
      <div className="stat px-0 py-1">
        <div className="stat-title value-name">気圧*</div>
        <div className="stat-value font-semibold leading-none flex flex-col">
          <span className="value">{pressure != null ? pressure.toFixed() : '-'}</span>
          <span className="value-name">hPa</span>
        </div>
      </div>

      {/* 外気温 */}
      <div className="stat py-1">
        <div className="stat-title value-name">外気温*</div>
        <div className="stat-value font-semibold value flex flex-row items-center justify-center">
          <span>{outTmp != null ? outTmp : '-'}</span>
          <Icon name="uil:celsius" size={valueSize} />
        </div>
      </div>

      {/* 一般設定 (十分に大きい画面のみ) */}
      <div className="stat px-5 max-2xl:hidden">
        <div>
          <GeneralSetting />
        </div>
      </div>

      <div className="stat m-auto gap-2">
        <span>*出典: 気象庁ホームページ</span>

        <DynamicModal btnTitle="設定">
          <Settings />
        </DynamicModal>
      </div>
    </div>
  );
};
