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

// バナー宣伝画像の表示の切り替え
const bannerVisible = isBannerVisible();
// バナーのソース
const banner = bannerSource();

// 雪の切り替え設定
const onSnowModeChange = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const value = e.target.checked;

  // @ts-ignore
  await import("pure-snow.js").then(({ createSnow, showSnow }) => {
    showSnow(value);
  });
}

// バナー画像のアップロード時の処理
const onBannerUpload = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, 'banner.png');
  // メモリ上の画像を更新
  banner.value = URL.createObjectURL(file);
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

  <label class="label cursor-pointer">
    <span class="label-text">バナー宣伝画像の有効化</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="bannerVisible" />
  </label>
  <label v-if="bannerVisible" class="form-control w-full">
    <div class="label">
      <span class="label-text">	17:3(850x150)サイズの画像を推奨</span>
    </div>
    <input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full" @change="onBannerUpload"/>
  </label>
</template>