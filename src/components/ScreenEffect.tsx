import { useEffect, useRef } from 'react';
import { useSettings } from '../store/settings.ts';

/** 雪や桜が降る画面エフェクト */
export const ScreenEffect = () => {
  const effect = useSettings((s) => s.appearance.screenEffect);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (effect === 'none' || container == null) return;

    // 一定間隔でエフェクトの粒を生成
    const interval = setInterval(() => {
      const particle = document.createElement('div');
      particle.classList.add(effect);
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.opacity = Math.random().toString();

      container.appendChild(particle);

      // 落下し終わったら削除
      setTimeout(() => particle.remove(), 10000);
    }, 150);

    return () => {
      clearInterval(interval);
      container.replaceChildren();
    };
  }, [effect]);

  return <div ref={containerRef} aria-hidden="true"></div>;
};
