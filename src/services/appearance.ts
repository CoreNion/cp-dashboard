import { kBannerFile, kDefaultFont, kDefaultFontFamily, kVerticalBannerFile } from '../constants.ts';
import { getRuntime, updateRuntime } from '../store/runtime.ts';
import { getSettings, settingsStore } from '../store/settings.ts';
import { createFileURL } from '../utils/file-manager.ts';

/* ---------- テーマ ---------- */

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/** テーマを<html>に適用する ("system"は端末の設定に合わせる) */
const applyTheme = (theme: string) => {
  const resolved = theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : theme;
  document.documentElement.setAttribute('data-theme', resolved);
};

/* ---------- フォント ---------- */

/** 設定されたフォントを読み込み、フォントファミリーを適用する */
const applyFont = async (font: string) => {
  if (font === kDefaultFont) {
    updateRuntime({ fontFamily: kDefaultFontFamily });
    return;
  }

  // アプリ内に追加されたフォントは、OPFSから読み込む
  if (getSettings().appearance.customFonts.includes(font)) {
    try {
      const url = await createFileURL(font);
      if (url == null) throw new Error(`フォントファイルが見つかりません: ${font}`);

      const fontFace = new FontFace(font, `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (e) {
      // 読み込めない場合はデフォルトのフォントで続行
      console.warn(e);
      updateRuntime({ fontFamily: kDefaultFontFamily });
      return;
    }
  }

  updateRuntime({ fontFamily: `'${font}'` });
};

/* ---------- バナー画像 ---------- */

/** 有効になっているバナー画像をOPFSから読み込む */
const loadBanners = async () => {
  const { horizontal, vertical } = getSettings().banner;
  const runtime = getRuntime();

  const [bannerUrl, verticalBannerUrl] = await Promise.all([
    horizontal && runtime.bannerUrl == null ? createFileURL(kBannerFile) : runtime.bannerUrl,
    vertical && runtime.verticalBannerUrl == null ? createFileURL(kVerticalBannerFile) : runtime.verticalBannerUrl,
  ]);
  updateRuntime({ bannerUrl, verticalBannerUrl });
};

/**
 * 見た目に関する設定 (テーマ/フォント/バナー) を適用し、以降の設定変更にも追従する
 * @returns 最初の適用が完了したら解決されるPromise
 */
export const startAppearance = async () => {
  let prev = getSettings();

  settingsStore.subscribe(() => {
    const next = getSettings();
    if (next.appearance.theme !== prev.appearance.theme) applyTheme(next.appearance.theme);
    if (next.appearance.font !== prev.appearance.font) applyFont(next.appearance.font);
    if (next.banner !== prev.banner) loadBanners();
    prev = next;
  });

  // 端末のダークモード切り替えに追従
  darkQuery.addEventListener('change', () => applyTheme(getSettings().appearance.theme));

  // 画面サイズ更新時に状態を更新
  window.addEventListener('resize', () => updateRuntime({ width: window.innerWidth }));

  applyTheme(prev.appearance.theme);
  await Promise.all([applyFont(prev.appearance.font), loadBanners()]);
};
