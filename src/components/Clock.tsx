import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { kWideScreenWidth } from '../constants.ts';
import { useRuntime } from '../store/runtime.ts';
import { useSettings } from '../store/settings.ts';
import { cssVars, isSafariOrFirefox } from '../utils/css.ts';
import { zoned } from '../utils/time.ts';
import { Icon } from './Icon.tsx';

dayjs.locale('ja');

const pad = (value: number) => value.toString().padStart(2, '0');

/** アニメーション付きの数字 (DaisyUIのcountdown) */
const CountdownDigit = ({ value }: { value: number }) => (
  <span style={cssVars({ '--value': value, '--digits': 2 })} aria-live="polite" aria-label={`${value}`}>
    {value}
  </span>
);

/** 時計 (タイマー動作中は残り時間) と日付などのサブ表示 */
export const Clock = ({ className }: { className?: string }) => {
  const time = useRuntime((s) => s.time);
  const timer = useRuntime((s) => s.timer.remaining);
  const width = useRuntime((s) => s.width);
  const weatherIcon = useRuntime((s) => s.weather.icon);
  const banner = useRuntime((s) => s.bannerUrl);

  const { clockEffect, fontSize } = useSettings((s) => s.appearance);
  const infoScroll = useSettings((s) => s.infoScroll);
  const bannerVisible = useSettings((s) => s.banner.horizontal);
  const timezone = useSettings((s) => s.clock.timezone);

  const now = zoned(time, timezone);
  const isWide = width >= kWideScreenWidth;

  // 時計/日付の文字サイズ
  const mainClockSize = `${(isWide ? 13 : 19) * fontSize}vw`;
  const subClockSize = `${(isWide ? 5 : 9) * fontSize}vw`;

  // メイン表示の数値 (タイマー動作中は残り時間)
  const digits = timer ?? [now.hour(), now.minute(), now.second()];
  const isSimple = clockEffect === 'シンプル' || (clockEffect === '自動 (端末に最適化)' && isSafariOrFirefox());

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className ?? ''}`}
      style={cssVars({ '--main-clock-size': mainClockSize, '--sub-clock-size': subClockSize })}
    >
      {/* メイン表示 */}
      {isSimple ? (
        <h1 className="main-clock font-bold leading-none tabular-nums">{digits.map(pad).join(':')}</h1>
      ) : (
        <h1 className="countdown main-clock font-bold">
          <CountdownDigit value={digits[0]} />:
          <CountdownDigit value={digits[1]} />:
          <CountdownDigit value={digits[2]} />
        </h1>
      )}

      {/* サブ表示 */}
      <h2>
        {timer != null ? (
          <div className="flex flex-row items-center">
            <span className="sub-clock mr-3"> {now.format('MM/DD (ddd)')} </span>
            <div className="sub-clock font-mono">
              <span> {now.format('HH:mm:ss')}</span>
            </div>
          </div>
        ) : infoScroll.enabled ? (
          <div className="flex flex-row items-center">
            <span className="shrink sub-clock mr-3 whitespace-nowrap"> {now.format('MM/DD(ddd)')} </span>
            <div className="scrolling-text sub-clock font-bold text-primary border-2">
              <span style={{ animationDuration: `${infoScroll.text.length <= 10 ? 4 : infoScroll.text.length * 0.4}s` }}>
                {infoScroll.text}
              </span>
            </div>
          </div>
        ) : (
          <span className="sub-clock max-w-full">
            {now.format(isWide ? 'YYYY年MM月DD日(ddd)' : 'MM/DD (ddd)')}{' '}
            <Icon name={weatherIcon ?? 'system-uicons:cloud-disconnect'} className="m-auto leading-none align-middle" size={subClockSize} />*
          </span>
        )}
      </h2>

      {/* 上部の宣伝画像エリア */}
      {bannerVisible && isWide && banner != null && (
        <div className="fixed top-0 m-3 z-10">
          <div className="bg-neutral flex flex-row items-center rounded-xl border-4 overflow-hidden">
            <span className="p-2 text-neutral-content text-3xl [writing-mode:vertical-rl]">宣伝</span>
            <img src={banner} className="h-[17vh]" alt="宣伝画像" />
          </div>
        </div>
      )}
    </div>
  );
};
