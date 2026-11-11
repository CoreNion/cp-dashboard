import type { CSSProperties } from 'react';

/** CSS変数をstyle属性に渡すためのヘルパー */
export const cssVars = (vars: Record<`--${string}`, string | number>) => vars as CSSProperties;

/** SafariまたはFirefoxかどうか (時刻のアニメーション表示が重いブラウザ) */
export const isSafariOrFirefox = () => {
  const ua = navigator.userAgent;
  const isFirefox = /firefox|fxios/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome|chromium|crios|edg|opr|android/i.test(ua);
  return isFirefox || isSafari;
};
