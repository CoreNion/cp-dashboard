import { useEffect } from 'react';
import { Clock } from './components/Clock.tsx';
import { DynamicModal } from './components/DynamicModal.tsx';
import { FirstClickToast } from './components/FirstClickToast.tsx';
import { Icon } from './components/Icon.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Report } from './components/Report.tsx';
import { ScreenEffect } from './components/ScreenEffect.tsx';
import { Settings } from './components/settings/Settings.tsx';
import { Status } from './components/Status.tsx';
import { TimerSetting } from './components/TimerSetting.tsx';
import { kWideScreenWidth } from './constants.ts';
import { onFirstClick } from './services/init.ts';
import { useRuntime } from './store/runtime.ts';

const reload = () => window.location.replace(window.location.href);

/** 大画面デバイスの表示 */
const WideLayout = () => (
  <div className="min-h-[100dvh] flex flex-row text-center gap-2">
    <div className="basis-[20.0%] flex flex-row justify-between">
      <Status />
    </div>

    <div className="grow m-auto">
      <Clock />
    </div>

    <div className="basis-[15.0%] flex flex-col items-end m-3 gap-4">
      <Report />
      <div className="grow m-2 flex flex-col justify-end gap-2">
        <button className="btn btn-neutral" onClick={reload}>
          再読み込み
        </button>
        <TimerSetting />
        <span>Copyright © 2024 CoreNion</span>
      </div>
    </div>
  </div>
);

/** 小画面デバイスの表示 */
const NarrowLayout = () => (
  <div className="min-h-[100dvh] min-w-full flex flex-col text-center mb-2">
    <div className="navbar bg-neutral">
      <div className="navbar-start">
        <button className="btn" onClick={reload} aria-label="再読み込み">
          <Icon name="uil:redo" size="2.5vh" />
        </button>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl text-neutral-content">Campus Dashboard</a>
      </div>
      <div className="navbar-end">
        <DynamicModal iconName="uil:setting" ariaLabel="設定">
          <Settings />
        </DynamicModal>
      </div>
    </div>
    <Clock className="grow m-auto" />
    <TimerSetting />
    <div className="flex flex-row justify-center gap-5 my-3">
      <span>Copyright © 2024 CoreNion</span>
      <a href="https://github.com/CoreNion/cp-dashboard/" className="link">
        Source Code / Licence
      </a>
    </div>
  </div>
);

export const App = () => {
  const ready = useRuntime((s) => s.ready);
  const width = useRuntime((s) => s.width);
  const fontFamily = useRuntime((s) => s.fontFamily);

  // 最初の1回のクリックで、音声の再生やスリープ防止を有効化する
  useEffect(() => {
    document.body.addEventListener('click', onFirstClick, { once: true });
    return () => document.body.removeEventListener('click', onFirstClick);
  }, []);

  return (
    <>
      <LoadingScreen />
      {ready && (
        <div className="min-h-[100dvh]" style={{ fontFamily }}>
          <FirstClickToast />
          {width >= kWideScreenWidth ? <WideLayout /> : <NarrowLayout />}
        </div>
      )}
      <ScreenEffect />
    </>
  );
};
