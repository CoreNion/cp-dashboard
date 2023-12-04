<script setup lang="ts">
useSeoMeta({
  title: 'CP Dashboard',
  ogTitle: 'CP Dashboard',
  description: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogDescription: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogImage: 'https://coreinion.github.io/cp-dashboard/ogp.png',
  twitterCard: 'summary_large_image',
});

// チャイムの有効/無効
const isChimeEnabledState = isChimeEnabled();

onMounted(async () => {
  // OPFSからチャイム音源とアラート音源を読み込む
  const opfsRoot = await navigator.storage.getDirectory();

  // チャイム音源を読み込む
  try {
    const chimeHandle = await opfsRoot.getFileHandle('chime.mp3', { create: false });
    const chimeBuffer = await chimeHandle.getFile();
    chimeSource().value = URL.createObjectURL(chimeBuffer);
  } catch (e) {
  }

  // アラート音源を読み込む
  try {
    const alertHandle = await opfsRoot.getFileHandle('alert.mp3', { create: false });
    const alertBuffer = await alertHandle.getFile();
    timerAlertSource().value = URL.createObjectURL(alertBuffer);
  } catch {
    
  }
});
</script>

<template>
  <NuxtLayout>
    <!-- 全画面時の表示 -->
    <div class="max-2xl:hidden min-h-screen flex flex-row text-center gap-2">
      <div class="basis-[30.0%] flex flex-row justify-between">
        <status></status>
      </div>

      <div class="grow">
        <clock></clock>
      </div>

      <div class="basis-[25.0%] flex flex-col items-end gap-4">
        <report></report>
        <div class="grow m-2 flex flex-col justify-end items-center gap-2">
          <TimerSetting></TimerSetting>
          <span>Copyright © 2023 CoreNion</span>
          <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
        </div>
      </div>
    </div>

    <div class="2xl:hidden min-h-screen min-w-full flex flex-col items-center text-center">
      <label class="label cursor-pointer">
        <span class="label-text mr-4">チャイム機能</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="isChimeEnabledState" />
      </label>
      <clock class="grow"></clock>
      <TimerSetting class="m-2"></TimerSetting>
      <div class="flex flex-row gap-5">
        <span>Copyright © 2023 CoreNion</span>
        <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
      </div>
    </div>
  </NuxtLayout>
</template>
