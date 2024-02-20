<script>
export default {
  props: {
    labelText: String,
    fileName: String,
    source: String,
    onAudioChange: Function,
    removeAudio: Function,
    playAudio: Function
  }
}
</script>

<template>
  <label class="label">
    <span class="label-text whitespace-nowrap">{{ labelText }}</span>
    <div class="flex flex-col items-end gap-1 w-full">
      <input type="file" class="file-input file-input-bordered w-full max-w-xs" accept="audio/*"
        @change="onAudioChange" />
      <div class="flex flex-row items-center gap-2">
        <button v-if="fileName != 'デフォルトの音声'" class="btn btn-sm btn-circle btn-outline btn-error"
          @click="removeAudio">
          <Icon name="uil:trash-alt" />
        </button>
        <button class="grow link" @click="playAudio(source)">{{ fileName }}</button>
      </div>
    </div>
  </label>
</template>