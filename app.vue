<script setup lang="ts">
// 現在時刻
const timeState = useState('time', () => new Date(new Date().getTime()));
// 現在の室温
const roomTmpState = useState('roomTemp', () => 21);
// 現在の外気温 (WIP)
const outTmpState = useState('outTemp', () => 25);
// 天気
const weatherState = useState('weather', () => '☀️');

// 1秒ごとに現在時刻を更新
setInterval(() => {
  timeState.value = new Date(new Date().getTime());
}, 1000);

// 毎月15日のレポート提出期限
const reportMonthDeadline = new Date(timeState.value.getFullYear(), timeState.value.getMonth(), 15);
// 毎月15日のレポート提出期限までの残り時間を計算
const reportMonthDeadlineTime = new Date(reportMonthDeadline.getTime() - timeState.value.getTime());

/* レポート期限の割合を計算 */
// レポート期限の開始日
const reportStartMonth = new Date(reportMonthDeadline.getFullYear(), (reportMonthDeadline.getMonth() - 1), 15);
// レポート期限の開始日からレポート期限までの日数
const reportDays = new Date(reportMonthDeadline.getTime() - reportStartMonth.getTime())
// 消費した日数 / レポート期限までの日数 * 100
const reportRatio = ((reportDays.getTime() - reportMonthDeadlineTime.getTime()) / reportDays.getTime()) * 100;
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col text-center">
      <div class="flex flex-row justify-between">
        <div class="stats stats-vertical shadow">
          <div class="stat">
            <div class="stat-title text-3xl">室温</div>
            <div class="stat-value text-5xl">{{ roomTmpState }}℃</div>
          </div>
          <div class="stat">
            <div class="stat-title text-3xl">外気温</div>
            <div class="stat-value text-5xl">{{ outTmpState }}℃</div>
          </div>
          <div class="stat">
            <div class="stat-title text-3xl">天気</div>
            <div class="stat-value text-5xl">{{ weatherState }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-4 m-2">
          <div>
            <h2 class="text-2xl mb-3">レポート日数</h2>
            <div class="radial-progress text-primary text-4xl"
              :style="{ '--value': reportRatio, '--size': '8rem', '--thickness': '1rem' }">
              {{ reportMonthDeadlineTime.getDate() }}日
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4">
        <!-- 時間表示 -->
        <h1 class="countdown text-9xl font-bold">
          <span :style="{ '--value': timeState.getHours() }"></span>:
          <span :style="{ '--value': timeState.getMinutes() }"></span>:
          <span :style="{ '--value': timeState.getSeconds() }"></span>
        </h1>
        <!-- 日付表示 -->
        <h2 class="countdown text-4xl">
          {{ timeState.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
          }) }}
        </h2>
      </div>
    </div>
  </NuxtLayout>
</template>
