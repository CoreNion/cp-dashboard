<script setup lang="ts">
defineProps({
  linkTypeButton: Boolean,
  btnTitle: String,
  btnWfull: Boolean,
  IconName: String,
});

// IDを生成
const thisID = "modal-" + Math.random().toString(32);

// モーダルの中身の表示状態
const loadContents = ref(false);

// モーダルを表示
const showModal = () => {
  loadContents.value = true;

  // @ts-ignore
  document.getElementById(thisID)?.showModal();
};
// モーダルを閉じる
const closeModal = async () => {
  // いきなり閉じるとアニメーションが見えないので、0.5秒待ってから閉じる
  await new Promise((resolve) => setTimeout(resolve, 500));

  loadContents.value = false;
};
</script>

<template>
  <a v-if="linkTypeButton" class="link" @click="showModal">{{ btnTitle }}</a>
  <button v-else :class="['btn', btnWfull? 'w-full' : '']" @click="showModal">
    <span v-if="btnTitle != undefined">{{ btnTitle }} </span>
    <Icon v-if="IconName != undefined" :name="IconName" size="2.5vh" />
  </button>

  <dialog :id="thisID" class="modal">
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