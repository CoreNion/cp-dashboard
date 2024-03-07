<script setup lang="ts">
const fontState = font();
const fontSizeOffset = fontSize();

const loaded = ref<boolean>(false);
const availableFonts = ref<any[]>(["CP-Dashboard", "system-ui", "sans-serif"]);

onMounted(async () => {
  try {
    // @ts-ignore
    const queryFonts: any[] = await window.queryLocalFonts();
    queryFonts.forEach((font) => {
      // 重複を避ける
      if (availableFonts.value.includes(font.family)) return;

      availableFonts.value.push(font.family);
    });
  } catch (e) {
    console.warn(e);
  }

  loaded.value = true;
});
</script>

<template>
  <h3 class="font-bold text-lg">フォント設定</h3>

  <div v-if="loaded">
    <label class="label">
      <span class="label-text">フォント</span>
      <select class="select select-bordered max-w-xs" v-model="fontState">
        <option disabled selected>フォントを選択...</option>
        <option v-for="font of availableFonts" :key="font">{{ font }}</option>
      </select>
    </label>

    <label class="w-full grid">
      <div class="flex flex-row justify-center">
        <span>文字サイズの倍率: </span>
        <span>{{ fontSizeOffset }}</span>
      </div>
      <input type="range" min="0.5" max="1.5" step="0.05" v-model="fontSizeOffset" class="range range-primary" />
    </label>

    <div class="text-sm mt-3">
      <span>PCにインストールされているフォントを設定することができます。</span>
      <br>
      <span>＊一部のブラウザーでは使用できない場合があります。</span>
      <br>
      <span>("CP-Dashboard"はこのサイトのデフォルトフォントです)</span>
    </div>
  </div>

  <span v-else class="loading loading-infinity w-[5vw]"></span>
</template>