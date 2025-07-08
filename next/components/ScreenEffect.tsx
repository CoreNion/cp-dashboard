'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInterval } from '@/hooks/intervalHooks';
import { useScreenEffect } from '@/hooks/useScreenEffect';
import { useFont } from '@/hooks/fontHooks';

// TODO: isFileExistとcreateFileURLは後で実装するか、publicディレクトリからのパスに置き換える
const isFileExist = async (fontName: string) => {
  // 仮実装: publicディレクトリにフォントファイルが存在すると仮定
  return fontName !== 'CP-Dashboard';
};

const createFileURL = async (fontName: string) => {
  // 仮実装: publicディレクトリからのパスを返す
  return `/${fontName}.ttf`; // 仮の拡張子
};

type ScreenEffectProps = {
  children?: React.ReactNode;
};

export const ScreenEffect: React.FC<ScreenEffectProps> = ({ children }) => {
  const [selectedEffect] = useScreenEffect();
  const [fontState] = useFont();
  const [fontFamily, setFontFamily] = useState<string>("'Inter', 'M PLUS Rounded 1c', 'sans-serif'");

  const createEffect = useCallback(() => {
    const val = selectedEffect;

    const effectDiv = document.createElement('div');
    effectDiv.classList.add(val);
    effectDiv.style.left = Math.random() * 100 + 'vw';
    effectDiv.style.opacity = Math.random().toString();
    effectDiv.style.fontSize = Math.random() * 20 + 10 + 'px';

    document.getElementById("effect")?.appendChild(effectDiv);

    setTimeout(() => {
      effectDiv.remove();
    }, 10000);
  }, [selectedEffect]);

  const interval = useInterval(createEffect, selectedEffect === 'none' ? null : 150);

  const setFont = useCallback(async (font: string) => {
    if (font === 'CP-Dashboard') {
      setFontFamily("'Inter', 'M PLUS Rounded 1c', 'sans-serif'");
    } else if (await isFileExist(font)) {
      const fontData = new FontFace(font, `url(${await createFileURL(font)})`);
      await fontData.load();
      document.fonts.add(fontData);
      setFontFamily(`'${fontData.family}'`);
    } else {
      setFontFamily(`'${fontState}'`);
    }
  }, [fontState]);

  useEffect(() => {
    setFont(fontState);
  }, [fontState, setFont]);

  useEffect(() => {
    if (selectedEffect === 'none') {
      interval.pause();
      const effectElement = document.getElementById("effect");
      if (effectElement) {
        effectElement.innerHTML = '';
      }
    } else {
      interval.resume();
    }
  }, [selectedEffect, interval]);

  return (
    <div className="min-h-[100dvh]" style={{ fontFamily: fontFamily }}>
      {children}
      <div id="effect"></div>
    </div>
  );
}
