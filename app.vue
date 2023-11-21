<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <!-- 全画面時の表示 -->
    <div class="max-2xl:hidden min-h-screen flex flex-row text-center gap-2">
      <div class="basis-[30.0%] flex flex-row justify-between">
        <status></status>
      </div>

      <div class="grow">
        <clock></clock>
      </div>

      <div class="basis-[25.0%] flex flex-col items-end gap-4">
        <report></report>
        <div class="grow m-2 flex flex-col justify-end items-center gap-2">
          <TimerSetting></TimerSetting>
        </div>
      </div>
    </div>

    <div class="2xl:hidden min-h-screen flex flex-col items-center text-center">
      <clock class="grow"></clock>
      <TimerSetting class="m-2"></TimerSetting>
    </div>
  </NuxtLayout>
</template>
