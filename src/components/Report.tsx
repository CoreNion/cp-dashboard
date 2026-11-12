import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useRuntime } from '../store/runtime.ts';
import { useSettings } from '../store/settings.ts';
import type { CountdownData, Settings } from '../types.ts';
import { calcLimit, calcLimitDays, calcRatio, needAlert } from '../utils/calc-report.ts';
import { cssVars } from '../utils/css.ts';
import { zoned } from '../utils/time.ts';

dayjs.extend(duration);

/** イベントカウントダウンのステータスを計算する */
const calcCountdownStatus = (countdown: Settings['countdown'], djs: dayjs.Dayjs, timezone: string) => {
  /** イベントの日時 (設定されたタイムゾーンでの、その日の終わり) */
  const eventDate = (date: string) => zoned(`${date}T23:59:59`, timezone);

  // 年間定期のイベントを今年の日付にし、一回限りのイベントと結合
  const yearlyDates = countdown.yearly.map<CountdownData>((d) => ({ ...d, date: `${djs.year()}-${d.date}` }));
  const allDates = [...countdown.once, ...yearlyDates];

  // 一番近い今後のイベントと、最後に行われたイベントを見つける
  const byDiff = allDates.map((d) => ({ event: d, diff: eventDate(d.date).diff(djs) }));
  const future = byDiff.filter((d) => d.diff >= 0).sort((a, b) => a.diff - b.diff);
  const past = byDiff.filter((d) => d.diff < 0).sort((a, b) => b.diff - a.diff);

  const nearEvent = future[0]?.event;
  if (nearEvent == null) return null;
  const lastEvent = past[0]?.event;

  const nearEventDate = eventDate(nearEvent.date);
  // 前回のイベントがない場合は1月1日とする
  const lastEventDate = eventDate(lastEvent ? lastEvent.date : `${djs.year()}-01-01`);

  return {
    name: nearEvent.label + 'まで',
    // イベントまでの残り時間 (ms)
    limit: calcLimit(nearEventDate, djs),
    // イベントまでの残り日数
    limitDays: calcLimitDays(nearEventDate, djs),
    // 赤くするかどうか
    alert: needAlert(nearEventDate, djs),
    // 消費した日数の割合
    ratio: calcRatio(nearEventDate, djs, lastEventDate),
  };
};

/** 行事カウントダウン (縦型バナー有効時はバナー画像) */
export const Report = () => {
  const time = useRuntime((s) => s.time);
  const width = useRuntime((s) => s.width);
  const verticalBanner = useRuntime((s) => s.verticalBannerUrl);
  const countdown = useSettings((s) => s.countdown);
  const verticalBannerVisible = useSettings((s) => s.banner.vertical);
  const timezone = useSettings((s) => s.clock.timezone);

  if (verticalBannerVisible) {
    return <div className="m-2">{verticalBanner != null && <img className="max-h-[45vh] border" src={verticalBanner} alt="宣伝画像" />}</div>;
  }

  const status = calcCountdownStatus(countdown, zoned(time, timezone), timezone) ?? { name: 'イベントなし', limit: 0, limitDays: 0, alert: false, ratio: 0 };
  const limit = dayjs.duration(status.limit);
  const ratio = Math.min(100, Math.max(0, status.ratio));
  const isLarge = width >= 1536;

  return (
    <div className="m-2 min-w-full flex flex-col items-end">
      <div className="flex flex-col items-center">
        <h2 className="text-[2vw] max-2xl:text-4xl mb-3 font-medium">{status.name}</h2>
        <div
          className={`radial-progress text-[4vw] max-2xl:text-6xl font-bold ${status.alert ? 'text-red-600' : 'text-primary'}`}
          style={cssVars({ '--value': ratio, '--size': isLarge ? '15vw' : '220px', '--thickness': isLarge ? '2vw' : '30px' })}
          role="progressbar"
          aria-valuenow={Math.round(ratio)}
        >
          {Math.floor(status.limitDays)}日
        </div>
        {status.alert && limit.asHours() >= 24 && (
          <div className="mt-3 flex flex-col items-center">
            <span className="text-[1.6vw]">残り時間</span>
            <div className="countdown text-[2.5vw] font-bold text-red-600">
              <span style={cssVars({ '--value': Math.floor(limit.asHours()), '--digits': 2 })}>{Math.floor(limit.asHours())}</span>:
              <span style={cssVars({ '--value': limit.minutes(), '--digits': 2 })}>{limit.minutes()}</span>:
              <span style={cssVars({ '--value': limit.seconds(), '--digits': 2 })}>{limit.seconds()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
