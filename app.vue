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
      href: 'pwa/apple-touch-icon@192px.png',
    },
  ],
});

const widthState = widthScreenSize();

// 一回でも画面がクリックされたかどうか
const firstClick = useState(() => false);

onMounted(async () => {
  // 画面クリック後に行う、バックグラウンドで正常に動作するための対策
  // iOS / Safariでは、画面クリック後に各種権限を取得する必要がある模様
  document.body.onclick = async () => {
    if (!firstClick.value) {
      // バックグラウンドでの根本的な動作対策
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

      // フォアグラウンドで音を鳴らした履歴を残す (いきなりバックグラウンドでは音が鳴らない模様)
      // iOSではこれだけでは不十分
      new Audio("./beep.mp3").play();

      // チャイム音源を読み込む (iOS対策でHTMLAudioをこの時点で読み込む)
      if (chimeFileName().value !== 'デフォルトの音声') {
        await appendFileToAudioState('chime.mp3', chimeSource);
      } else {
        chimeSource().value.load();
      }

      // 予鈴音源を読み込む
      if (preChimeFileName().value !== 'デフォルトの音声') {
        await appendFileToAudioState('pre-chime.mp3', preChimeSource);
      } else {
        preChimeSource().value.load();
      }

      // アラート音源を読み込む
      if (alertFileName().value !== 'デフォルトの音声') {
        await appendFileToAudioState('alert.mp3', timerAlertSource);
      } else {
        timerAlertSource().value.load();
      }

      firstClick.value = true;
      document.body.onclick = null;
    }
  };

  // ウィンドウサイズを取得し適用
  widthState.value = window.innerWidth;

  // 画面サイズ更新時にstateを更新するようにする
  window.addEventListener('resize', () => {
    widthState.value = window.innerWidth;
  });

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
      <div v-if="!firstClick" class="toast toast-top toast-center whitespace-normal z-50 w-full">
        <div class="alert alert-warning">
          <Icon class="icon" name="uil:exclamation-triangle" size="30px" />
          <p>
            <span>チャイムやタイマーを正常に動作させるため、1回は画面をクリックしてください。</span>
            <br>
            <span>画面をクリックした後、バックグラウンドで正常に動作させるために、短い効果音が1回再生されます。</span>
          </p>
        </div>
      </div>
    </ClientOnly>

    <!-- 大画面デバイスの表示 -->
    <div v-if="widthState >= 1280" class="min-h-[100dvh] flex flex-row text-center gap-2">
      <div class="basis-[20.0%] flex flex-row justify-between">
        <status></status>
      </div>

      <div class="grow m-auto">
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
    <div v-if="widthState <= 1280" class="min-h-[100dvh] min-w-full flex flex-col text-center mb-2">
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
      <clock class="grow m-auto"></clock>
      <TimerSetting></TimerSetting>
      <div class="flex flex-row justify-center gap-5 my-3">
        <span>Copyright © 2024 CoreNion</span>
        <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code / Licence</a>
      </div>
    </div>
  </NuxtLayout>
</template>
