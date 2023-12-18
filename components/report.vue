<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = time();

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
  // レポートの残り時間
  if ((timeState.value.getMonth() == 11 && timeState.value.getDate() < 16)
  || (timeState.value.getMonth() >= 3 && timeState.value.getMonth() <= 10)) {
    // 次のレポートの期限を計算
    const nextReportDeadline = calcNextReportDeadline(djs);

    // レポートの残り時間
    countdownLimit.value = calcLimit(nextReportDeadline, djs);
    countdownLimitDays.value = calcLimitDays(nextReportDeadline, djs);
    needCountdownAlert.value = needAlert(nextReportDeadline, djs);
    countdownRatio.value = calcRatio(nextReportDeadline, djs);
  } else {
    // クリスマスまでのカウントダウン
    countdownName.value = 'クリスマスまで';
    const eventDay = dayjs("2023-12-25");
    
    countdownLimit.value = calcLimit(eventDay, djs);
    countdownLimitDays.value = calcLimitDays(eventDay, djs);
    needCountdownAlert.value = needAlert(eventDay, djs);
    countdownRatio.value = calcRatio(eventDay, djs);
  }
}

// 10分ごとにイベント期限の割合を更新
onMounted(() => {
  refleshReportStatus(dayjs(timeState.value));
  setInterval(() => {
    refleshReportStatus(dayjs(timeState.value));
  }, 1000);
});
</script>

<template>
  <div class="m-2">
    <h2 class="text-[2vw] mb-3">{{ countdownName }}</h2>
    <ClientOnly>
      <div :class="['radial-progress', 'text-[3vw]', 'font-bold', needCountdownAlert ? 'text-red-600' : 'text-primary']"
        :style="{ '--value': countdownRatio, '--size': '12vw', '--thickness': '1.5vw' }">
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
    </ClientOnly>
  </div>
</template>