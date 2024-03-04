<template>
  <div class="min-h-screen">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const selectedEffect = screenEffect();

function createSnowflake() {
  const val = selectedEffect.value;
  if (val === "none") return;

  const snowflake = document.createElement('div');
  snowflake.classList.add(val);
  snowflake.style.left = Math.random() * 100 + 'vw';
  snowflake.style.opacity = Math.random().toString();
  snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 10000);
}

onMounted(() => {
  setInterval(createSnowflake, 150);
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

[data-theme="dash"] body {
  font-family: 'Inter', 'Murecho', sans-serif;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%)
}</style>