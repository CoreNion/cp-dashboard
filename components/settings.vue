<script setup lang="ts">
import { isChimeEnabled } from '~/composables/states';

const colorMode = useColorMode();

// センサーのソース
const sensorSourceState = sensorSource();
// チャイムの音源
const chimeSourceState = chimeSource();
// 予鈴の音源
const preChimeSourceState = preChimeSource();
// タイマーのアラート音源
const timerAlertSourceState = timerAlertSource();

const chimeComputed = computed<boolean>(
  {
    get() {
      if (process.client) {
        return JSON.parse(localStorage.getItem('isChimeEnabled') ?? 'false');
      } else {
        return false;
      }
    },
    set(value) {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('isChimeEnabled', JSON.stringify(value));
      isChimeEnabled().value = value;
    }
  }
);
const preChimeComputed = computed<boolean>(
  {
    get() {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem('isPreChimeEnabled') ?? 'false');
      } else {
        return false;
      }
    },
    set(value) {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('isPreChimeEnabled', JSON.stringify(value));
      isPreChimeEnabled().value = value;
    }
  }
);

const alertFileNameState = useState('alertFileName', () => 'デフォルトの音声');
const chimeFileNameState = useState('chimeFileName', () => 'デフォルトの音声');
const preChimeFileNameState = useState('preChimeFileName', () => 'デフォルトの音声');

// センサー情報のソースを変更
const onSourceChange = async (e: Event) => {
  if (!(e.target instanceof HTMLSelectElement)) return;
  const value = e.target.value;

  // ローカルストレージに保存
  localStorage.setItem('sensorSource', value);
}

// 音源変更時の処理
const onAudioChange = async (e: Event, fileName: string, sourceState: globalThis.Ref<string>, storageKey: string, fileNameState: globalThis.Ref<string>) => {
  // ファイルを読み込む
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, fileName);
  // メモリ上の音源を更新
  sourceState.value = URL.createObjectURL(file);
  // ファイル名を更新
  fileNameState.value = file.name;

  // ローカルストレージに元のファイル名を保存
  localStorage.setItem(storageKey, file.name);
}

// 音源削除時の処理
const removeAudio = (fileName: string, sourceState: globalThis.Ref<string>, storageKey: string, fileNameState: globalThis.Ref<string>) => {
  // ローカルストレージからメタデータ(元ファイル名)を削除
  localStorage.removeItem(storageKey);
  // OPFSからファイルを削除
  removeFile(fileName);

  // メモリ上の音源/名前を元に戻す
  fileNameState.value = 'デフォルトの音声';
  sourceState.value = defaultAlertAudioSource().value;
}

const onAlertAudioChange = async (e: Event) => {
  onAudioChange(e, 'alert.mp3', timerAlertSourceState, 'alertFileName', alertFileNameState);
}

const removeAlertAudio = () => {
  removeAudio('alert.mp3', timerAlertSourceState, 'alertFileName', alertFileNameState);
}

const onChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'chime.mp3', chimeSourceState, 'chimeFileName', chimeFileNameState);
}

const removeChimeAudio = () => {
  removeAudio('chime.mp3', chimeSourceState, 'chimeFileName', chimeFileNameState);
}

const onPreChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'pre-chime.mp3', preChimeSourceState, 'preChimeFileName', preChimeFileNameState);
}

const removePreChimeAudio = () => {
  removeAudio('pre-chime.mp3', preChimeSourceState, 'preChimeFileName', preChimeFileNameState);
}

// 音源を再生
const playAudio = (link: string) => {
  const audio = new Audio(link);
  audio.volume = 1.0;
  audio.play();
}

onMounted(() => {
  // ローカルストレージから元ファイル名を取得
  const alertFileName = localStorage.getItem('alert.mp3');
  if (alertFileName != null) {
    alertFileNameState.value = alertFileName;
  }

  const chimeFileName = localStorage.getItem('chime.mp3');
  if (chimeFileName != null) {
    chimeFileNameState.value = chimeFileName;
  }

  const preChimeFileName = localStorage.getItem('pre-chime.mp3');
  if (preChimeFileName != null) {
    preChimeFileNameState.value = preChimeFileName;
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

        <WeatherSetting></WeatherSetting>
      </p>

      <div class="divider"></div>

      <h4 class="font-bold">音声設定</h4>

      <p class="py-3">
        <AudioSetting labelText="タイマー終了時" :fileName="alertFileNameState" :source="timerAlertSourceState"
          :onAudioChange="onAlertAudioChange" :removeAudio="removeAlertAudio" :playAudio="playAudio" />

        <AudioSetting labelText="チャイム" :fileName="chimeFileNameState" :source="chimeSourceState"
          :onAudioChange="onChimeAudioChange" :removeAudio="removeChimeAudio" :playAudio="playAudio" />

        <AudioSetting labelText="予鈴チャイム" :fileName="preChimeFileNameState" :source="preChimeSourceState"
          :onAudioChange="onPreChimeAudioChange" :removeAudio="removePreChimeAudio" :playAudio="playAudio" />

        <label class="label cursor-pointer mt-4">
          <span class="label-text">チャイム鳴動状態</span>
          <input type="checkbox" class="toggle toggle-secondary" v-model="chimeComputed" />
        </label>
        <label class="label cursor-pointer mt-4">
          <span class="label-text">予鈴鳴動状態</span>
          <input type="checkbox" class="toggle toggle-secondary" v-model="preChimeComputed" />
        </label>
      </p>
    </div>
  </dialog>
</template>