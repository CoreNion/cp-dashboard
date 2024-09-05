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
const onAudioChange = async (e: Event, fileName: string, sourceState: globalThis.Ref<HTMLAudioElement>, fileNameState: globalThis.Ref<string>) => {
  // ファイルを読み込む
  if (!(e.target instanceof HTMLInputElement)) return;
  const file = e.target.files?.[0];
  if (!file) return;

  // OPFSにファイルを保存
  saveFile(file, fileName);
  // メモリ上の音源を更新
  sourceState.value = new Audio(URL.createObjectURL(file));
  sourceState.value.load();
  // ファイル名を更新
  fileNameState.value = file.name;
}

// 音源削除時の処理
const removeAudio = (sourceState: globalThis.Ref<HTMLAudioElement>, fileNameState: globalThis.Ref<string>, origFileName: String) => {
  // OPFSからファイルを削除
  removeFile(fileNameState.value);

  // 音源/名前を元に戻す
  fileNameState.value = 'デフォルトの音声';
  sourceState.value = new Audio(`${useRuntimeConfig().app.baseURL}/${origFileName}`);
  sourceState.value.load();
}

const onAlertAudioChange = async (e: Event) => {
  onAudioChange(e, 'alert.mp3', timerAlertSourceState, alertFileNameState);
}

const removeAlertAudio = () => {
  removeAudio(timerAlertSourceState, alertFileNameState, "alert.mp3");
}

const onChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'chime.mp3', chimeSourceState, chimeFileNameState);
}

const removeChimeAudio = () => {
  removeAudio(chimeSourceState, chimeFileNameState, "chime.mp3");
}

const onPreChimeAudioChange = async (e: Event) => {
  onAudioChange(e, 'pre-chime.mp3', preChimeSourceState, preChimeFileNameState);
}

const removePreChimeAudio = () => {
  removeAudio(preChimeSourceState, preChimeFileNameState, "pre-chime.mp3");
}

// 音源を再生
const playAudio = (audio: HTMLAudioElement) => {
  audio.volume = 1.0;
  audio.play();
}
</script>

<template>
  <div>
    <h3 class="font-bold text-lg">設定</h3>
    <p class="pt-2">
      <GeneralSetting></GeneralSetting>
      <DynamicModal btnTitle="天気設定" :btn-wfull="true">
        <WeatherSetting></WeatherSetting>
      </DynamicModal>

      <div class="mt-3">
        <DynamicModal linkTypeButton btnTitle="センサーの記録" class="mt-3">
          <SensorRecord></SensorRecord>
        </DynamicModal>
      </div>
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
    <DynamicModal btnTitle="チャイム設定" :btn-wfull="true">
      <ChimeSetting></ChimeSetting>
    </DynamicModal>

    <div class="divider"></div>

    <h4 class="font-bold">宣伝機能設定 (大画面のみ)</h4>
    <AdSetting></AdSetting>
    <DynamicModal :btn-wfull="true" btnTitle="カウントダウン設定">
      <CountdownSetting></CountdownSetting>
    </DynamicModal>

    <div class="divider"></div>

    <span class="font-light">First Built by CoreNion (N6)</span>
    <br>
    <span class="font-light">Special Thanks to Shibuya CP🫶</span>
    <div class="flex flex-row justify-around mt-3">
      <a href="https://github.com/CoreNion/cp-dashboard/wiki/" class="link">ドキュメント</a>
      <a href="https://github.com/CoreNion/cp-dashboard/" class="link">Source Code</a>
    </div>
  </div>
</template>