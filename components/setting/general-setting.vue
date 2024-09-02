<script setup lang="ts">
// テーマ設定
const colorMode = useColorMode();

// 時刻表示設定
const simpleTimeState = clockEffect();

// センサーのソース
const selectedEffect = screenEffect();

// センサー情報を表示するかどうか
const sensorVisible = isSensorInfoVisible();

// 情報スクロールの有効化
const isInfoScrollEnabledSt = isInfoScrollEnabled();
// 情報スクロールのテキスト
const infoScrollTextSt = infoScrollText();

</script>

<template>
  <label class="label">
    <span class="label-text">テーマ</span>
    <select class="select select-bordered max-w-xs" v-model="colorMode.preference">
      <option disabled selected>テーマを選択...</option>
      <option v-for="theme of themes" :key="theme">{{ theme }}</option>
    </select>
  </label>
  <label class="label">
    <span class="label-text">
      時刻表示の効果
    </span>
    <select class="select select-bordered max-w-xs" v-model="simpleTimeState">
      <option disabled selected>効果を選択...</option>
      <option v-for="clockEffect of kClockEffects" :key="clockEffect">{{ clockEffect }}</option>
    </select>
  </label>
  <label class="label">
    <span class="label-text">画面エフェクト</span>
    <select class="select select-bordered max-w-xs" v-model="selectedEffect">
      <option disabled selected>効果を選択...</option>
      <option v-for="effect of kEffects" :key="effect">{{ effect }}</option>
    </select>
  </label>

  <DynamicModal :btn-wfull="true" btnTitle="フォント設定">
    <FontSetting></FontSetting>
  </DynamicModal>

  <label class="label cursor-pointer">
    <span class="label-text">センサーからの情報を表示</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="sensorVisible" />
  </label>

  <label class="label cursor-pointer">
    <span class="label-text">情報スクロールの有効化</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="isInfoScrollEnabledSt" />
  </label>
  <input v-if="isInfoScrollEnabledSt" type="text" placeholder="スクロールに表示される文章を入力..." class="input input-bordered w-full my-2"
    v-model="infoScrollTextSt" />
</template>