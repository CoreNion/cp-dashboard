import { useRuntime } from '../store/runtime.ts';
import { Icon } from './Icon.tsx';

/** 最初の画面クリックを促す案内 */
export const FirstClickToast = () => {
  const firstClicked = useRuntime((s) => s.firstClicked);
  if (firstClicked) return null;

  return (
    <div className="toast toast-top toast-center whitespace-normal z-50 w-full">
      <div role="alert" className="alert alert-warning">
        <Icon name="uil:exclamation-triangle" size="30px" />
        <p>
          <span>チャイムやタイマーを正常に動作させるため、1回は画面をクリックしてください。</span>
          <br />
          <span>画面をクリックした後、バックグラウンドで正常に動作させるために、短い効果音が1回再生されます。</span>
        </p>
      </div>
    </div>
  );
};
