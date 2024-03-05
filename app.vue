<script setup lang="ts">
const fontState = font();

useSeoMeta({
  title: 'Campus Dashboard',
  ogTitle: 'Campus Dashboard',
  description: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogDescription: '必要な情報を一目で確認できる、タイマー付きのダッシュボードサイト。',
  ogImage: 'https://cpd.cnion.dev/ogp.png',
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

// フォントの変更検知
watch(fontState, (newFont) => {
  if (newFont === 'CP-Dashboard')
    document.body.style.fontFamily = "'Inter', 'Murecho', sans-serif";
  else
    document.body.style.fontFamily = newFont;
});

const widthState = widthScreenSize();

// 一回でも画面がクリックされたかどうか
const firstClick = useState(() => false);

defaultAlertAudioSource().value = `${useRuntimeConfig().app.baseURL}alert.mp3`;

onMounted(async () => {
  // フォントを設定
  if (fontState.value === 'CP-Dashboard')
    document.body.style.fontFamily = "'Inter', 'Murecho', sans-serif";
  else
    document.body.style.fontFamily = fontState.value;

  // 画面がクリックされたらfirstClickをtrueにする
  document.body.onclick = () => {
    firstClick.value = true;
  };

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

  // バナー画像を読み込む
  if (isBannerVisible().value) {
    try {
      const bannerHandle = await opfsRoot.getFileHandle('banner.png', { create: false });
      const bannerBuffer = await bannerHandle.getFile();
      bannerSource().value = URL.createObjectURL(bannerBuffer);
    } catch (e) {
      console.warn(e);
    }
  }

  // 縦バナー画像を読み込む
  if (isVerticalBanner().value) {
    try {
      const verticalBannerHandle = await opfsRoot.getFileHandle('vertical-banner.png', { create: false });
      const verticalBannerBuffer = await verticalBannerHandle.getFile();
      verticalBannerSource().value = URL.createObjectURL(verticalBannerBuffer);
    } catch (e) {
      console.warn(e);
    }
  }
});
</script>

<template>
  <div id="snow"></div>
  <NuxtPwaManifest />
  <NuxtLayout>
    <ClientOnly>
      <div v-if="!firstClick" class="toast toast-top toast-center z-50">
        <div class="alert alert-warning">
          <span>
            <Icon class="icon" name="uil:exclamation-triangle" size="2vw" />
            アラームを動作させるために、画面を一回以上クリックしてください！
          </span>
        </div>
      </div>
    </ClientOnly>

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
          <button class="btn btn-neutral" onclick="window.location.replace(window.location.href)">再読み込み</button>
          <TimerSetting></TimerSetting>
          <span>Copyright © 2024 CoreNion</span>
          <a href="https://github.com/CoreNion/cp-dashboard/wiki/" class="link">Document</a>
          <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
        </div>
      </div>
    </div>

    <!-- 小画面デバイスの表示　-->
    <div v-if="widthState <= 1280" class="min-h-screen min-w-full flex flex-col items-center text-center">
      <div class="navbar bg-neutral">
        <div class="navbar-start">
          <button class="btn" onclick="window.location.replace(window.location.href)">
            <Icon name="uil:redo" size="2.5vh" />
          </button>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost text-xl text-neutral-content">Campus Dashboard</a>
        </div>
        <div class="navbar-end">
          <DynamicModal IconName="uil:setting">
            <Settings />
          </DynamicModal>
        </div>
      </div>
      <clock class="grow"></clock>
      <TimerSetting class="m-2"></TimerSetting>
      <div class="flex flex-row gap-5">
        <span>Copyright © 2024 CoreNion</span>
        <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
      </div>
    </div>
  </NuxtLayout>
</template>
