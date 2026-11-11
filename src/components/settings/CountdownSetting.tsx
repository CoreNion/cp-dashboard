import dayjs from 'dayjs';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ja } from 'react-day-picker/locale';
import { kCountdownColors, kYearlyCountdownDates } from '../../constants.ts';
import { getSettings, updateSettings, useSettings } from '../../store/settings.ts';
import type { CountdownData, Settings } from '../../types.ts';
import { Icon } from '../Icon.tsx';

type FormState = {
  /** 選択された日付 */
  selectedDate: Date | null;
  /** イベントのタイトル */
  label: string;
  /** イベントの色 */
  color: string;
  /** 年間定期のイベントかどうか */
  everyYear: boolean;
};

const sortByDate = (dates: CountdownData[]) => dates.toSorted((a, b) => a.date.localeCompare(b.date));

/** 指定した日付に設定されているイベントを探す (年間定期のイベントを優先) */
const findEvent = (countdown: Settings['countdown'], date: Date): CountdownData | undefined => {
  const d = dayjs(date);
  return countdown.yearly.find((e) => e.date === d.format('MM-DD')) ?? countdown.once.find((e) => e.date === d.format('YYYY-MM-DD'));
};

/** 日付を選択したときのフォームの状態 */
const createFormState = (countdown: Settings['countdown'], date: Date | null): FormState => {
  const event = date != null ? findEvent(countdown, date) : undefined;
  return {
    selectedDate: date,
    label: event?.label ?? '',
    color: event?.color ?? 'gray',
    everyYear: event?.type === 'yearly',
  };
};

/** カウントダウンに表示するイベントの設定 */
export const CountdownSetting = () => {
  const countdown = useSettings((s) => s.countdown);
  const [form, setForm] = useState<FormState>(() => createFormState(getSettings().countdown, new Date()));

  // 選択中の日付にイベントがすでに設定されているか
  const eventExists = form.selectedDate != null && findEvent(countdown, form.selectedDate) != null;

  /// 設定ボタンが押されたときの処理
  const onDateSettings = () => {
    if (form.selectedDate == null) return;
    if (form.label === '') {
      alert('タイトルを入力してください');
      return;
    }

    const selected = dayjs(form.selectedDate);
    if (form.everyYear) {
      // 年間定期のイベントを追加 (同じ日付のイベントは置き換え)
      const date = selected.format('MM-DD');
      const event: CountdownData = { date, label: form.label, color: form.color, type: 'yearly' };
      updateSettings('countdown', { yearly: sortByDate([...countdown.yearly.filter((d) => d.date !== date), event]) });
    } else {
      // 一回限りのイベントを追加 (同じ日付のイベントは置き換え)
      const date = selected.format('YYYY-MM-DD');
      const event: CountdownData = { date, label: form.label, color: form.color, type: 'once' };
      updateSettings('countdown', { once: sortByDate([...countdown.once.filter((d) => d.date !== date), event]) });
    }
  };

  // イベントの削除
  const removeDate = () => {
    if (form.selectedDate == null) return;

    const selected = dayjs(form.selectedDate);
    if (form.everyYear) {
      updateSettings('countdown', { yearly: countdown.yearly.filter((d) => d.date !== selected.format('MM-DD')) });
    } else {
      updateSettings('countdown', { once: countdown.once.filter((d) => d.date !== selected.format('YYYY-MM-DD')) });
    }

    setForm(createFormState({ once: [], yearly: [] }, null));
  };

  const onResetButton = () => {
    if (window.confirm('カレンダーにある予定を全て削除し、デフォルトの状態に戻しますか？')) {
      updateSettings('countdown', { once: [], yearly: kYearlyCountdownDates });
      setForm(createFormState({ once: [], yearly: kYearlyCountdownDates }, form.selectedDate));
    }
  };

  // イベントのある日を、イベントの色で表示する
  const modifiers = Object.fromEntries(
    kCountdownColors.map((color) => [`event-${color}`, (date: Date) => findEvent(countdown, date)?.color === color]),
  );
  const modifiersClassNames = Object.fromEntries(kCountdownColors.map((color) => [`event-${color}`, `countdown-event countdown-event-${color}`]));

  return (
    <>
      <h3 className="font-bold text-lg">カウントダウン設定</h3>
      <div className="py-2 flex flex-col items-center">
        <DayPicker
          className="react-day-picker"
          mode="single"
          locale={ja}
          selected={form.selectedDate ?? undefined}
          onSelect={(date) => setForm(createFormState(countdown, date ?? null))}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          footer={
            <div className="border-t border-base-300 mt-2 text-sm">
              <span className="block p-2">{form.selectedDate == null ? '未選択' : dayjs(form.selectedDate).format('YYYY年MM月DD日')}</span>
              {eventExists && <span className="block px-2 pb-2 text-red-500 font-bold">イベントが設定されています</span>}
            </div>
          }
        />
      </div>
      <div className="py-2">
        <div className="join w-full">
          <button className="join-item btn btn-error" onClick={removeDate} disabled={!eventExists} aria-label="イベントを削除">
            <Icon name="uil:trash-alt" size="2.5vh" />
          </button>
          <select
            className="join-item select w-28"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            aria-label="イベントの色"
          >
            {kCountdownColors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
          <input
            className="join-item input w-full"
            placeholder="日付のタイトル"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
          />
          <button className="join-item btn btn-primary" onClick={onDateSettings} disabled={form.selectedDate == null}>
            設定
          </button>
        </div>
        <label className="setting-row cursor-pointer mt-2">
          <span>毎年繰り返す</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={form.everyYear}
            onChange={(e) => setForm({ ...form, everyYear: e.target.checked })}
          />
        </label>
        <button className="btn btn-error w-full" onClick={onResetButton}>
          カレンダーのリセット
        </button>
      </div>
    </>
  );
};
