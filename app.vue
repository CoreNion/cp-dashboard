<script setup lang="ts">
useSeoMeta({
  title: 'CP Dashboard',
  ogTitle: 'CP Dashboard',
  description: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogDescription: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogImage: 'https://coreinion.github.io/cp-dashboard/ogp.png',
  twitterCard: 'summary_large_image',
});

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: 'icon.svg',
    },
    {
      rel: 'apple-touch-icon',
      href: 'pwa/apple-touch-icon-180x180.png',
    },
  ],
});

const widthState = widthScreenSize();

defaultAlertAudioSource().value = `${useRuntimeConfig().app.baseURL}alert.mp3`;

onMounted(async () => {
  // ウィンドウサイズを取得
  widthState.value = window.innerWidth;

  // 画面サイズ更新時にstateを更新するようにする
  window.addEventListener('resize', () => {
    widthState.value = window.innerWidth;
  });

  try {
    // スリープを無効化
    await navigator.wakeLock.request('screen');
    // タブ切り替え後でも持続するようにする
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        await navigator.wakeLock.request('screen');
      }
    });
  } catch (e) {
    console.warn(e);
  }

  // OPFSからチャイム音源とアラート音源を読み込む
  const opfsRoot = await navigator.storage.getDirectory();

  // チャイム音源を読み込む
  try {
    const chimeHandle = await opfsRoot.getFileHandle('chime.mp3', { create: false });
    const chimeBuffer = await chimeHandle.getFile();
    chimeSource().value = URL.createObjectURL(chimeBuffer);
  } catch (e) {
    console.warn(e);
  }

  // 予鈴音源を読み込む
  try {
    const preChimeHandle = await opfsRoot.getFileHandle('pre-chime.mp3', { create: false });
    const preChimeBuffer = await preChimeHandle.getFile();
    preChimeSource().value = URL.createObjectURL(preChimeBuffer);
  } catch (e) {
    console.warn(e);
  }

  // アラート音源を読み込む
  try {
    const alertHandle = await opfsRoot.getFileHandle('alert.mp3', { create: false });
    const alertBuffer = await alertHandle.getFile();
    timerAlertSource().value = URL.createObjectURL(alertBuffer);
  } catch (e) {
    console.warn(e);
  }

  // @ts-ignore
  await import("pure-snow.js").then(({ createSnow, showSnow }) => {
    createSnow();
    showSnow(isSnowEnabled().value);
  });
});
</script>

<template>
  <div id="snow"></div>
  <NuxtPwaManifest />
  <NuxtLayout>
    <!-- 大画面デバイスの表示 -->
    <div v-if="widthState >= 1280" class="min-h-screen flex flex-row text-center gap-2">
      <div class="basis-[20.0%] flex flex-row justify-between">
        <status></status>
      </div>

      <div class="grow">
        <clock></clock>
      </div>

      <div class="basis-[15.0%] flex flex-col items-end m-3 gap-4">
        <report></report>
        <div class="grow m-2 flex flex-col justify-end gap-2">
          <TimerSetting></TimerSetting>
          <span>Copyright © 2024 CoreNion</span>
          <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
        </div>
      </div>
    </div>

    <!-- 小画面デバイスの表示　-->
    <div v-if="widthState <= 1280" class="min-h-screen min-w-full flex flex-col items-center text-center">
      <clock class="grow"></clock>
      <TimerSetting class="m-2"></TimerSetting>
      <div class="flex flex-row gap-5">
        <span>Copyright © 2024 CoreNion</span>
        <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
      </div>
    </div>
  </NuxtLayout>
</template>
