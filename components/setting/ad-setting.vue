<script setup lang="ts">
// 横型バナー宣伝画像の表示の切り替え
const bannerVisible = isBannerVisible();
// 横バナーのソース
const banner = bannerSource();
// 縦型バナー宣伝画像の表示の切り替え
const verticalBannerVisible = isVerticalBanner();
// 縦バナーのソース
const verticalBanner = verticalBannerSource();

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

const onVerticalBannerUpload = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, 'vertical-banner.png');
  // メモリ上の画像を更新
  verticalBanner.value = URL.createObjectURL(file);
}
</script>
<template>
  <label class="label cursor-pointer">
    <span class="label-text">横型バナー宣伝画像の有効化</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="bannerVisible" />
  </label>
  <label v-if="bannerVisible" class="form-control w-full">
    <div class="label">
      <span class="label-text"> 17:3(1700x300)サイズの画像を推奨</span>
    </div>
    <input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full"
      @change="onBannerUpload" />
  </label>

  <label class="label cursor-pointer mt-3">
    <span class="label-text">
      縦型バナー宣伝画像の有効化
      <br>
      (イベントカウントダウンの部分に表示されます)
    </span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="verticalBannerVisible" />
  </label>
  <label v-if="verticalBannerVisible" class="form-control w-full">
    <div class="label">
      <span class="label-text"> 23:40(920x1600)サイズの画像を推奨</span>
    </div>
    <input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full"
      @change="onVerticalBannerUpload" />
  </label>
</template>