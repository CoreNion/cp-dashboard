<script setup lang="ts">
defineProps({
  linkTypeButton: Boolean,
  btnTitle: String,
  IconName: String,
});

// モーダル全体の表示状態
const openModal = ref(false);
// モーダルの中身の表示状態
const loadContents = ref(false);

// モーダルを表示
const showModal = () => {
  openModal.value = true;
  loadContents.value = true;
};
// モーダルを閉じる
const closeModal = async () => {
  // いきなり閉じるとアニメーションが見えないので、0.5秒待ってから閉じる
  openModal.value = false;
  await new Promise((resolve) => setTimeout(resolve, 500));

  loadContents.value = false;
};
</script>

<template>
  <a v-if="linkTypeButton" class="link" @click="showModal">{{ btnTitle }}</a>
  <button v-else class="btn" @click="showModal">
    <span v-if="btnTitle != undefined">{{ btnTitle }} </span>
    <Icon v-if="IconName != undefined" :name="IconName" size="2.5vh" />
  </button>

  <dialog :class="['modal', openModal ? 'modal-open' : '']">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
      </form>

      <div v-if="loadContents">
        <slot></slot>
      </div>
      <div v-else class="skeleton w-32 h-32"></div>
    </div>
  </dialog>
</template>