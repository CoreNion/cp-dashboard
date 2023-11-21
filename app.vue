<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-row text-center gap-2">
      <div class="max-xl:hidden basis-[30.0%] flex flex-row justify-between">
        <status></status>
      </div>

      <div class="grow">
        <clock></clock>
      </div>

      <div class="max-xl:hidden basis-[25.0%] flex flex-col items-end gap-4">
        <report></report>
        <div class="grow m-2 flex flex-col justify-end items-center gap-2">
          <TimerSetting></TimerSetting>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
