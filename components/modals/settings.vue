<script setup lang="ts">
// チャイムの音源
const chimeSourceState = chimeSource();
// チャイムのファイル名
const chimeFileNameState = chimeFileName();
// 予鈴の音源
const preChimeSourceState = preChimeSource();
// 予鈴のファイル名
const preChimeFileNameState = preChimeFileName();
// タイマーのアラート音源
const timerAlertSourceState = timerAlertSource();
// タイマーのファイル名
const alertFileNameState = alertFileName();

// チャイムの鳴動状態
const isChimeEnabledState = isChimeEnabled();
// 予鈴の鳴動状態
const isPreChimeEnabledState = isPreChimeEnabled();

// 音源変更時の処理
const onAudioChange = async (e: Event, fileName: string, sourceState: globalThis.Ref<string>, fileNameState: globalThis.Ref<string>) => {
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
}

// 音源削除時の処理
const removeAudio = (sourceState: globalThis.Ref<string>, fileNameState: globalThis.Ref<string>) => {
  // OPFSからファイルを削除
  removeFile(fileNameState.value);

  // 音源/名前を元に戻す
  fileNameState.value = 'デフォルトの音声';
  sourceState.value = defaultAlertAudioSource().value;
}

const onAlertAudioChange = async (e: Event) => {
  onAudioChange(e, 'alert.mp3', timerAlertSourceState, alertFileNameState);
}

const removeAlertAudio = () => {
  removeAudio(timerAlertSourceState, alertFileNameState);
}

const onChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'chime.mp3', chimeSourceState, chimeFileNameState);
}

const removeChimeAudio = () => {
  removeAudio(chimeSourceState, chimeFileNameState);
}

const onPreChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'pre-chime.mp3', preChimeSourceState, preChimeFileNameState);
}

const removePreChimeAudio = () => {
  removeAudio(preChimeSourceState, preChimeFileNameState);
}

// 音源を再生
const playAudio = (link: string) => {
  const audio = new Audio(link);
  audio.volume = 1.0;
  audio.play();
}
</script>

<template>
  <div>
    <h3 class="font-bold text-lg">設定</h3>
    <p class="py-2">
      <GeneralSetting></GeneralSetting>
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
        <input type="checkbox" class="toggle toggle-secondary" v-model="isChimeEnabledState" />
      </label>
      <label class="label cursor-pointer mt-4">
        <span class="label-text">予鈴鳴動状態</span>
        <input type="checkbox" class="toggle toggle-secondary" v-model="isPreChimeEnabledState" />
      </label>
    </p>

    <ChimeSetting></ChimeSetting>
  </div>
</template>