<template>
  <div class="min-h-screen">
    <slot></slot>
  </div>
</template>

<style>
body {
  background: none;
}

.snowflake {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #C7D4E0;
  border-radius: 50%;
  filter: drop-shadow(0 0 15px #C7D4E0);
}
</style>