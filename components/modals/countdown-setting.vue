<script setup lang="ts">
const date = ref(new Date())
const attr = ref([
  {
    key: 'today',
    highlight: {
      color: 'blue',
    },
    dates: new Date(2024, 1, 22),
  },
  {
    highlight: {
      color: 'red',
      fillMode: 'light',
    },
    dates: new Date(2024, 1, 24),
  },
  {
    highlight: {
      color: 'green',
      fillMode: 'outline',
    },
    dates: new Date(2024, 1, 25),
  },
]);
</script>

<template>
  <div>
    <button class="btn btn-neutral min-w-full mt-3" onclick="eventSetting.showModal()">カウントダウン設定</button>
    <dialog id="eventSetting" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 class="font-bold text-lg">カウントダウン設定</h3>
        <p class="py-2">
          <VCalendar v-model="date" expanded title-position="left" :attributes="attr" />
        </p>
      </div>
    </dialog>
  </div>
</template>