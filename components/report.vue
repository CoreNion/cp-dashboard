<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

// 現在時刻
const timeState = time();

// レポートの残り日数
const reportMonthLimitDays = useState('reportMonthLimitDays', () => 0);
// 赤くするかどうか
const needReportMonthAlert = useState('needReportMonthAlert', () => false);

// 消費したレポート日数の割合
const reportRatio = useState('reportRatio', () => 0);

/// レポートのステータスを更新
function refleshReportStatus(djs: dayjs.Dayjs = dayjs()) {
  // 次のレポートの期限を計算
  const nextReportDeadline = calcNextReportDeadline(djs);

  // レポートの残り時間
  reportMonthLimitDays.value = calcReportLimitDays(nextReportDeadline, djs);
  needReportMonthAlert.value = needReportAlert(nextReportDeadline, djs);
  reportRatio.value = calcReportRatio(nextReportDeadline, djs);
}

// 10分ごとにレポート期限の割合を更新
onMounted(() => {
  refleshReportStatus(dayjs(timeState.value));
  setInterval(() => {
    refleshReportStatus(dayjs(timeState.value));
  }, 2000);
});
</script>

<template>
  <div v-if="(timeState.getMonth() == 11 && timeState.getDate() < 16) || (timeState.getMonth() >= 3 && timeState.getMonth() <= 10)"
    class="m-2">
    <h2 class="text-[2vw] mb-3">レポート日数</h2>
    <ClientOnly>
      <div :class="['radial-progress', 'text-[3vw]', 'font-bold', needReportMonthAlert ? 'text-red-600' : 'text-primary']"
        :style="{ '--value': reportRatio, '--size': '12vw', '--thickness': '1.5vw' }">
        {{ Math.floor(reportMonthLimitDays) }}日
      </div>
    </ClientOnly>
  </div>
</template>