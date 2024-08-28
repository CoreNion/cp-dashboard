<script setup lang="ts">
useSeoMeta({
  title: 'Campus Dashboard | 多機能デジタル時計',
  ogTitle: 'Campus Dashboard | 多機能デジタル時計',
  description: 'Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。',
  ogDescription: 'Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。',
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

const widthState = widthScreenSize();

// 一回でも画面がクリックされたかどうか
const firstClick = useState(() => false);

defaultAlertAudioSource().value = `${useRuntimeConfig().app.baseURL}alert.mp3`;

onMounted(async () => {
  // 画面がクリックされたらfirstClickをtrueにする
  document.body.onclick = () => {
    firstClick.value = true;
  };

  // ウィンドウサイズを取得し適用
  widthState.value = window.innerWidth;

  // 画面サイズ更新時にstateを更新するようにする
  window.addEventListener('resize', () => {
    widthState.value = window.innerWidth;
  });

  // バックグラウンド対策
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

  // チャイム音源を読み込む
  appendFileToState('chime.mp3', chimeSource);

  // 予鈴音源を読み込む
  appendFileToState('pre-chime.mp3', preChimeSource);

  // アラート音源を読み込む
  appendFileToState('alert.mp3', timerAlertSource);

  // バナー画像を読み込む
  if (isBannerVisible().value) 
    appendFileToState('banner.png', bannerSource);

  // 縦バナー画像を読み込む
  if (isVerticalBanner().value)
    appendFileToState('vertical-banner.png', verticalBannerSource);
});
</script>

<template>
  <div id="snow"></div>
  <NuxtPwaManifest />
  <NuxtLayout>
    <ClientOnly>
      <div v-if="!firstClick" class="toast toast-top toast-center z-50">
        <div class="alert alert-warning">
          <Icon class="icon" name="uil:exclamation-triangle" size="2vw" />
          <span>
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
