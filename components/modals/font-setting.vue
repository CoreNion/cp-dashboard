<script setup lang="ts">
const fontState = font();
const cfts = customFonts();
const fontSizeOffset = fontSize();

const loaded = ref<boolean>(false);
const availableFonts = ref<any[]>(["CP-Dashboard", "system-ui", "sans-serif"]);

onMounted(async () => {
  /// カスタムフォントを追加
  cfts.value.forEach((font) => {
    availableFonts.value.push(font);
  });

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

const onFontUpload = async (e: Event) => {
  // ファイルを読み込む
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, file.name);

  // フォントを検証し追加
  const font = new FontFace(file.name, `url(${URL.createObjectURL(file)})`);
  await font.load();
  console.log(font);

  // フォント一覧に追加
  cfts.value.push(file.name);
  availableFonts.value.push(file.name);
};

const onFontRemove = (font: string) => {
  removeFile(font);
  cfts.value.splice(cfts.value.indexOf(font), 1);
};
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

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-left font-bold">
        フォントをアプリ内に追加
      </div>
      <div class="collapse-content text-base-content">
        <label class="label">
          <span class="label-text">フォントファイル</span>
          <input type="file" class="file-input file-input-bordered w-72 file-input-sm" accept="font/*"
            @change="onFontUpload" />
        </label>

        <div class="divider"></div>

        <span class="font-bold">サイトにインストールされているフォント</span>
        <div class="flex flex-col gap-2">
          <div v-for="font of cfts" :key="font" class="flex flex-row items-center gap-2">
            <div class="tooltip tooltip-right" data-tip="フォントを削除">
              <button class="btn btn-sm btn-error" @click="onFontRemove(font)">
                <Icon class="icon" name="uil:trash-alt" size="2vh" />
              </button>
            </div>
            <span class="flex-1">{{ font }}</span>
            <div class="tooltip tooltip-left" data-tip="フォントを適用">
              <button class="btn btn-sm btn-primary" @click="fontState = font" aria-label="r">
                <Icon class="icon" name="uil:check" size="2vh" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <label class="w-full grid">
      <div class="flex flex-row justify-center mb-1 font-semibold">
        <span>文字サイズの倍率: </span>
        <span>{{ fontSizeOffset }}</span>
      </div>
      <input type="range" min="0.5" max="1.5" step="0.05" v-model="fontSizeOffset" class="range range-primary" />
    </label>

    <div class="text-sm mt-3">
      <span>＊一部のブラウザでは、PCにインストールされているフォントは使用できない場合があります。</span>
      <br>
      <span>"CP-Dashboard"はこのアプリのデフォルトフォントです</span>
    </div>
  </div>

  <span v-else class="loading loading-infinity w-[5vw]"></span>
</template>