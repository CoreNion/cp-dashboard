<script setup lang="ts">
const colorMode = useColorMode();
const themes = [
  'dash',
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
  'dim',
  'nord',
  'sunset',
];

// センサーのソース
const sensorSourceState = sensorSource();
// チャイムの音源
const chimeSourceState = chimeSource();
// タイマーのアラート音源
const timerAlertSourceState = timerAlertSource();

// チャイムの有効/無効
const isChimeEnabledState = isChimeEnabled();

// センサー情報のソースを変更
const onSourceChange = async (e: Event) => {
  if (!(e.target instanceof HTMLSelectElement)) return;
  const value = e.target.value;

  // ローカルストレージに保存
  localStorage.setItem('sensorSource', value);
}

const alertFileNameState = useState('alertFileName', () => 'デフォルトの音声');
const onAlertAudioChange = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, 'alert.mp3');
  // メモリ上の音源を更新
  timerAlertSource().value = URL.createObjectURL(file);
  // 名前を更新
  alertFileNameState.value = file.name;
}
const removeAlertAudio = () => {
  localStorage.removeItem('alert.mp3');
  removeFile('alert.mp3');

  // メモリ上の音源/名前を元に戻す
  alertFileNameState.value = 'デフォルトの音声';
  timerAlertSourceState.value = '/alert.mp3';
}

const chimeFileNameState = useState('chimeFileName', () => 'デフォルトの音声');
const onChimeAudioChange = async (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  saveFile(file, 'chime.mp3');
  chimeSourceState.value = URL.createObjectURL(file);
  chimeFileNameState.value = file.name;
}
const removeChimeAudio = () => {
  localStorage.removeItem('chime.mp3');
  removeFile('chime.mp3');

  chimeFileNameState.value = 'デフォルトの音声';
  chimeSourceState.value = '/alert.mp3';
}

const playAudio = (link: string) => {
  const audio = new Audio(link);
  audio.play();
}

onMounted(() => {
  const alertFileName = localStorage.getItem('alert.mp3');
  if (alertFileName != null) {
    alertFileNameState.value = alertFileName;
  }

  const chimeFileName = localStorage.getItem('chime.mp3');
  if (chimeFileName != null) {
    chimeFileNameState.value = chimeFileName;
  }
});
</script>

<template>
  <button class="btn" onclick="my_modal_1.showModal()">設定</button>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold text-lg">設定</h3>
      <p class="py-2">
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

      <div class="divider"></div>

      <h4 class="font-bold">音声設定</h4>

      <p class="py-3">        
        <label class="label">
          <span class="label-text whitespace-nowrap">アラート音</span>
          <div class="flex flex-col items-end gap-1 w-full">
            <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept="audio/*"
              @change="onAlertAudioChange" />
            <div class="flex flex-row items-center gap-2">
              <button v-if="alertFileNameState != 'デフォルトの音声'" class="btn btn-sm btn-circle btn-outline btn-error"
                @click="removeAlertAudio">
                <Icon name="uil:trash-alt" />
              </button>
              <button class="grow link" @click="playAudio(timerAlertSourceState)">{{ alertFileNameState }}</button>
            </div>
          </div>
        </label>

        <label class="label">
          <span class="label-text whitespace-nowrap">チャイム</span>
          <div class="flex flex-col items-end gap-1 w-full">
            <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept="audio/*"
              @change="onChimeAudioChange" />
            <div class="flex flex-row items-center gap-2">
              <button v-if="chimeFileNameState != 'デフォルトの音声'" class="btn btn-sm btn-circle btn-outline btn-error"
                @click="removeChimeAudio">
                <Icon name="uil:trash-alt" />
              </button>
              <button class="grow link" @click="playAudio(chimeSourceState)">{{ chimeFileNameState }}</button>
            </div>
          </div>
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">チャイム鳴動状態</span>
          <input type="checkbox" class="toggle toggle-secondary" v-model="isChimeEnabledState" />
        </label>
      </p>
  </div>
</dialog></template>