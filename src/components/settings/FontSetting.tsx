import { useEffect, useState, type ChangeEvent } from 'react';
import { kDefaultFont } from '../../constants.ts';
import { getSettings, updateSettings, useSettings } from '../../store/settings.ts';
import { removeFile, saveFile } from '../../utils/file-manager.ts';
import { Icon } from '../Icon.tsx';

/** 端末にインストールされているフォントの一覧を取得する (対応ブラウザのみ) */
const queryLocalFontFamilies = async (): Promise<string[]> => {
  try {
    const query = (window as { queryLocalFonts?: () => Promise<{ family: string }[]> }).queryLocalFonts;
    if (query == null) return [];

    return (await query()).map((font) => font.family);
  } catch (e) {
    console.warn(e);
    return [];
  }
};

/** フォントと文字サイズの設定 */
export const FontSetting = () => {
  const { font, customFonts, fontSize } = useSettings((s) => s.appearance);
  // 端末のフォント一覧 (読み込みが終わるまではnull)
  const [localFonts, setLocalFonts] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    queryLocalFontFamilies().then((fonts) => {
      if (!cancelled) setLocalFonts(fonts);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (localFonts == null) {
    return (
      <>
        <h3 className="font-bold text-lg">フォント設定</h3>
        <span className="loading loading-infinity w-[5vw]"></span>
      </>
    );
  }

  // 選択できるフォント (重複は除く)
  const availableFonts = [...new Set([kDefaultFont, 'system-ui', 'sans-serif', ...customFonts, ...localFonts])];

  const onFontUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // フォントとして読み込めるか検証
      const fontFace = new FontFace(file.name, `url(${URL.createObjectURL(file)})`);
      await fontFace.load();

      // OPFSにファイルを保存
      await saveFile(file, file.name);
    } catch (err) {
      console.error(err);
      alert('フォントを読み込めませんでした。');
      return;
    }

    // フォント一覧に追加
    const current = getSettings().appearance.customFonts;
    if (!current.includes(file.name)) updateSettings('appearance', { customFonts: [...current, file.name] });
  };

  const onFontRemove = async (target: string) => {
    try {
      await removeFile(target);
    } catch (err) {
      console.warn(err);
    }

    const current = getSettings().appearance;
    updateSettings('appearance', {
      customFonts: current.customFonts.filter((f) => f !== target),
      // 使用中のフォントを削除した場合は、デフォルトに戻す
      font: current.font === target ? kDefaultFont : current.font,
    });
  };

  return (
    <>
      <h3 className="font-bold text-lg">フォント設定</h3>

      <div>
        <label className="setting-row">
          <span>フォント</span>
          <select className="select max-w-56 md:max-w-xs" value={font} onChange={(e) => updateSettings('appearance', { font: e.target.value })}>
            {availableFonts.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>

        <div className="collapse collapse-arrow bg-base-200 my-2">
          <input type="checkbox" aria-label="フォントをアプリ内に追加" />
          <div className="collapse-title text-left font-bold">フォントをアプリ内に追加</div>
          <div className="collapse-content text-base-content overflow-auto">
            <input type="file" className="file-input w-full" accept="font/*,.ttf,.otf,.woff,.woff2" onChange={onFontUpload} />

            <div className="divider"></div>

            <span className="font-bold">サイトにインストールされているフォント</span>
            <div className="flex flex-col gap-2">
              {customFonts.map((f) => (
                <div key={f} className="flex flex-row items-center gap-2">
                  <div className="tooltip tooltip-right" data-tip="フォントを削除">
                    <button className="btn btn-sm btn-error" onClick={() => onFontRemove(f)} aria-label="フォントを削除">
                      <Icon name="uil:trash-alt" size="2vh" />
                    </button>
                  </div>
                  <span className="flex-1">{f}</span>
                  <div className="tooltip tooltip-left" data-tip="フォントを適用">
                    <button className="btn btn-sm btn-primary" onClick={() => updateSettings('appearance', { font: f })} aria-label="フォントを適用">
                      <Icon name="uil:check" size="2vh" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <label className="w-full grid">
          <div className="flex flex-row justify-center mb-1 font-semibold">
            <span>文字サイズの倍率: </span>
            <span>{fontSize}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={fontSize}
            onChange={(e) => updateSettings('appearance', { fontSize: Number.parseFloat(e.target.value) })}
            className="range range-primary w-full"
          />
        </label>

        <div className="text-sm mt-3">
          <span>＊一部のブラウザでは、PCにインストールされているフォントは使用できない場合があります。</span>
          <br />
          <span>"CP-Dashboard"はこのアプリのデフォルトフォントです</span>
        </div>
      </div>
    </>
  );
};
