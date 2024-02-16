<script setup lang="ts">
// テーマ設定
const colorMode = useColorMode();

// センサーのソース
const isSnowEnabledState = isSnowEnabled();

// センサー情報を表示するかどうか
const sensorVisible = isSensorInfoVisible();

// 情報スクロールの有効化
const isInfoScrollEnabledSt = isInfoScrollEnabled();
// 情報スクロールのテキスト
const infoScrollTextSt = infoScrollText();

// 雪の切り替え設定
const onSnowModeChange = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const value = e.target.checked;

  // @ts-ignore
  await import("pure-snow.js").then(({ createSnow, showSnow }) => {
    showSnow(value);
  });
}
</script>

<template>
  <label class="label">
    <span class="label-text">テーマ</span>
    <select class="select select-bordered max-w-xs" v-model="colorMode.preference">
      <option disabled selected>テーマを選択...</option>
      <option v-for="theme of themes" :key="theme">{{ theme }}</option>
    </select>
  </label>
  <label class="label cursor-pointer">
    <span class="label-text">Snow❄︎</span>
    <input type="checkbox" class="toggle toggle-secondary" @change="onSnowModeChange" v-model="isSnowEnabledState" />
  </label>

  <label class="label cursor-pointer">
    <span class="label-text">センサーからの情報を表示</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="sensorVisible" />
  </label>

  <label class="label cursor-pointer">
    <span class="label-text">情報スクロールの有効化</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="isInfoScrollEnabledSt" />
  </label>
  <input v-if="isInfoScrollEnabledSt" type="text" placeholder="スクロールに表示される文章を入力..." class="input input-bordered w-full"
    v-model="infoScrollTextSt" />
</template>