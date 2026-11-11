import type { ChangeEvent } from 'react';
import { kBannerFile, kVerticalBannerFile } from '../../constants.ts';
import { updateRuntime } from '../../store/runtime.ts';
import { updateSettings, useSettings } from '../../store/settings.ts';
import { saveFile } from '../../utils/file-manager.ts';

/** バナー宣伝画像の設定 */
export const AdSetting = () => {
  const banner = useSettings((s) => s.banner);

  // バナー画像のアップロード時の処理
  const onUpload = async (e: ChangeEvent<HTMLInputElement>, fileName: string, key: 'bannerUrl' | 'verticalBannerUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // OPFSにファイルを保存
    await saveFile(file, fileName);
    // メモリ上の画像を更新
    updateRuntime({ [key]: URL.createObjectURL(file) });
  };

  return (
    <>
      <label className="setting-row cursor-pointer">
        <span>横型バナー宣伝画像の有効化</span>
        <input
          type="checkbox"
          className="toggle toggle-secondary"
          checked={banner.horizontal}
          onChange={(e) => updateSettings('banner', { horizontal: e.target.checked })}
        />
      </label>
      {banner.horizontal && (
        <label className="flex flex-col w-full">
          <span className="setting-row"> 17:3(1700x300)サイズの画像を推奨</span>
          <input type="file" accept="image/*" className="file-input file-input-sm w-full" onChange={(e) => onUpload(e, kBannerFile, 'bannerUrl')} />
        </label>
      )}

      <label className="setting-row cursor-pointer mt-3">
        <span>
          縦型バナー宣伝画像の有効化
          <br />
          (イベントカウントダウンの部分に表示されます)
        </span>
        <input
          type="checkbox"
          className="toggle toggle-secondary"
          checked={banner.vertical}
          onChange={(e) => updateSettings('banner', { vertical: e.target.checked })}
        />
      </label>
      {banner.vertical && (
        <label className="flex flex-col w-full">
          <span className="setting-row"> 23:40(920x1600)サイズの画像を推奨</span>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-sm w-full"
            onChange={(e) => onUpload(e, kVerticalBannerFile, 'verticalBannerUrl')}
          />
        </label>
      )}
    </>
  );
};
