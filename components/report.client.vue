<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = time();
// 画面サイズ
const wSize = widthScreenSize();

// カウントダウン名
const countdownName = useState('countdownName', () => 'レポート日数');

// イベントまでの残り時間 (ms)
const countdownLimit = useState('countdownLimit', () => 0);
// イベントまでの残り日数
const countdownLimitDays = useState('countdownLimitDays', () => 0);
// 赤くするかどうか
const needCountdownAlert = useState('needCountdownAlert', () => false);

// 消費した日数の割合
const countdownRatio = useState('countdownRatio', () => 0);

/// イベントカウントダウンのステータスを更新
function refleshReportStatus(djs: dayjs.Dayjs = dayjs()) {
  // 一回限りのイベントと年間定期のイベントを取得
  const onceDates = countdownDates().value;
  const yearlyDates = yearlyCountdownDates().value.map<CountdownData>((d) => {
    return {
      date: `${djs.year()}-${d.date}`,
      label: d.label,
      color : d.color,
      type: "yearly",
    };
  });
  // 一回限りのイベントと年間定期のイベントを結合
  const allDates = <CountdownData[]>[...onceDates, ...yearlyDates].sort((a, b) => {
    return a.date < b.date ? -1 : 1;
  });

  // 一番近いイベントの日付と前回の日付を取得
  const nearEvent = allDates.find((d) => djs.isBefore(d.date));
  const lastEvent = allDates.find((d) => djs.isAfter(d.date));
  if (nearEvent == null) return;

  const nearEventDate = dayjs(nearEvent.date);
  // 前回のイベントがない場合は1月1日とする
  const lastEventDate = dayjs(lastEvent ? lastEvent.date : `${djs.year()}-01-01`);

  // カウントダウンのステータスを更新
  countdownName.value = nearEvent.label + "まで";
  countdownLimit.value = calcLimit(nearEventDate, djs);
  countdownLimitDays.value = calcLimitDays(nearEventDate, djs);
  needCountdownAlert.value = needAlert(nearEventDate, djs);
  countdownRatio.value = calcRatio(nearEventDate, djs, lastEventDate);
}

// イベント期限の割合を更新
onMounted(() => {
  refleshReportStatus(dayjs(timeState.value));
  setInterval(() => {
    refleshReportStatus(dayjs(timeState.value));
  }, 1000);
});

// 縦型バナー宣伝画像の表示の切り替え
const verticalBannerVisible = isVerticalBanner();
// 縦バナーのソース
const verticalBanner = verticalBannerSource();
</script>

<template>
  <div v-if="!verticalBannerVisible" class="m-2 min-w-full flex flex-col items-end">
    <div class="flex flex-col items-center">
      <h2 class="text-[2vw] max-2xl:text-4xl mb-3 font-medium">{{ countdownName }}</h2>
      <div
        :class="['radial-progress', 'text-[4vw]', 'max-2xl:text-6xl', 'font-bold', needCountdownAlert ? 'text-red-600' : 'text-primary']"
        :style="{ '--value': countdownRatio, '--size': wSize >= 1536 ? '15vw' : '220px', '--thickness': wSize >= 1536 ? '2vw' : '30px' }">
        {{ Math.floor(countdownLimitDays) }}日
      </div>
      <div v-if="needCountdownAlert" class="mt-3 flex flex-col items-center">
        <span class="text-[1.6vw]">残り時間</span>
        <div class="countdown text-[2.5vw] font-bold text-red-600">
          <span :style="{ '--value': Math.floor(dayjs.duration(countdownLimit).asHours()) }"></span>:
          <span :style="{ '--value': dayjs.duration(countdownLimit).minutes() }"></span>:
          <span :style="{ '--value': dayjs.duration(countdownLimit).seconds() }"></span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="m-2">
    <img v-if="verticalBanner != null" class="max-h-[45vh] border" :src="verticalBanner" />
  </div>
</template>