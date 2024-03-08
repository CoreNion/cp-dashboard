<template>
  <div class="min-h-screen" :style="{ 'font-family': fontFamily}">
    <slot></slot>
  </div>
  <div id="effect">
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn, type Pausable } from '@vueuse/core'

const selectedEffect = screenEffect();
const fontState = font();
const fontFamily = ref<string>("'Inter', 'Murecho', 'sans-serif'");

let interval: Pausable | null = null;

function createEffect() {
  const val = selectedEffect.value;

  const snowflake = document.createElement('div');
  snowflake.classList.add(val);
  snowflake.style.left = Math.random() * 100 + 'vw';
  snowflake.style.opacity = Math.random().toString();
  snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';

  document.getElementById("effect")!.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 10000);
}

onMounted(() => {
  // フォントを設定
  if (fontState.value === 'CP-Dashboard')
    fontFamily.value = "'Inter', 'Murecho', 'sans-serif'";
  else
    fontFamily.value = `'${fontState.value}'`;

  interval = useIntervalFn(createEffect, 150);
});

watch(selectedEffect, (newVal) => {
  if (newVal === 'none') {
    interval?.pause();
    document.getElementById("effect")!.innerHTML = '';
  } else {
    interval?.resume();
  }
});

// フォントの変更検知
watch(fontState, (newFont) => {
  if (newFont === 'CP-Dashboard')
    fontFamily.value = "'Inter', 'Murecho', 'sans-serif'";
  else
    fontFamily.value = `'${fontState.value}'`;
});
</script>

<style>
body {
  background: none;
  overflow: hidden;
}

/* 雪 */
.snowflake {
  position: fixed;
  top: 0px;
  width: 15px;
  height: 15px;
  background: #C7D4E0;
  border-radius: 50%;
  z-index: 999;
  animation: fall 10s linear infinite, yurayura 3s ease-in-out infinite;
}

/* 桜 */
.sakura {
  position: fixed;
  top: 0px;
  width: 25px;
  height: 6px;
  background: #f59fad;
  border-radius: 50%;
  z-index: 999;
  animation: fall 10s linear infinite, yurayura 3s ease-in-out infinite;
}

/* 落下アニメーション */
@keyframes fall {
  0% {
    top: -10vh;
  }

  100% {
    top: 100vh;
  }
}

/* ゆらゆらアニメーション */
@keyframes yurayura {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: translate(40px, 20px) rotate(120deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%)
}

.dummy {
  font-family: 'Inter', 'Murecho', sans-serif;
}
</style>