<template>
  <div class="min-h-screen">
    <slot></slot>
  </div>
</template>

<style>
body {
  background: none;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #C7D4E0;
  border-radius: 50%;
  filter: drop-shadow(0 0 15px #C7D4E0);
}

[data-theme="dash"] body {
  font-family: 'Inter', 'BIZ UDPGothic', sans-serif;
}

input[type="time"]::-webkit-calendar-picker-indicator{
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%)
}
</style>