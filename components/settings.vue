<script setup lang="ts">
const colorMode = useColorMode();
const themes = [
  'system',
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

// センサーのソース
const sensorSourceState = sensorSource();

// 現在の室温
const roomTmpState = roomTmp();

// センサー情報のソースを変更
const onSourceChange = async (e: Event) => {
  if (!(e.target instanceof HTMLSelectElement)) return;
  const value = e.target.value;

  // ローカルストレージに保存
  localStorage.setItem('sensorSource', value);
}
</script>

<template>
  <button class="btn" onclick="my_modal_1.showModal()">設定</button>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold text-lg">設定</h3>
      <p class="py-4">
        <label class="label">
          <span class="label-text">テーマ</span>
          <select class="select select-bordered w-full max-w-xs" v-model="colorMode.preference">
            <option disabled selected>テーマを選択...</option>
            <option v-for="theme of themes" :key="theme">{{ theme }}</option>
          </select>
        </label>

        <label class="label">
          <span class="label-text">センサー情報</span>
          <select class="select select-bordered w-full max-w-xs" @change="onSourceChange" v-model="sensorSourceState">
            <option disabled selected>ソースを選択...</option>
            <option value="serial">Arduino (シリアル接続)</option>
            <option value="rpi">Raspberry Pi</option>
          </select>
        </label>
      </p>
    </div>
  </dialog>
</template>