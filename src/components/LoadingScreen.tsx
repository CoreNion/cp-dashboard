import { useEffect, useState } from 'react';
import { useRuntime } from '../store/runtime.ts';

/** フェードアウトにかける時間 (ms)。index.htmlの.splashのtransitionと合わせる */
const kFadeDuration = 400;

/**
 * 読み込み中の画面。
 * index.htmlにある静的なスプラッシュと同じ見た目で、初期化が完了するとフェードアウトする。
 */
export const LoadingScreen = () => {
  const ready = useRuntime((s) => s.ready);
  // フェードアウトが終わったらDOMから取り除く
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const id = setTimeout(() => setRemoved(true), kFadeDuration);
    return () => clearTimeout(id);
  }, [ready]);

  if (removed) return null;

  return (
    <div className={`splash ${ready ? 'splash-hide' : ''}`} role="status" aria-label="読み込み中">
      <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
      <span className="splash-title">Campus Dashboard</span>
      <span className="splash-spinner"></span>
    </div>
  );
};
