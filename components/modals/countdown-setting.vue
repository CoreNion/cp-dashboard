<script setup lang="ts">
const countdownDatesState = countdownDates();

const selectedEventColor = ref<string>("blue");
const eventLabel = ref<string>("");
const selectedDate = ref(new Date());
const attr = ref<any[]>([]);

const onDateSettings = () => {
  countdownDatesState.value = [
    ...(countdownDatesState.value),
    {
      date: selectedDate.value.toISOString(),
      label: eventLabel.value,
      color: selectedEventColor.value,
    },
  ];
};

watch(countdownDatesState, () => {
  refleshCountDownDate();
});

const refleshCountDownDate = () => {
  attr.value = countdownDatesState.value.map((date) => {
    return {
      key: date.label,
      dates: new Date(date.date),
      highlight: {
        color: date.color,
      },
      popover: {
        label: date.label,
        visibility: 'hover',
      },
    };
  });
};

onMounted(() => {
  refleshCountDownDate();
});
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
          <VDatePicker v-model="selectedDate" expanded title-position="left" :attributes="attr" color="orange" />
        </p>
        <p class="py-2">
          <span class="join-item select ">{{ selectedDate }}</span>
          <div class="join w-full">
            <select class="join-item select select-bordered border" v-model="selectedEventColor">
              <option v-for="color of ['gray', 'red', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink']">
                {{ color }}
              </option>
            </select>
            <input class="join-item input input-bordered w-full" placeholder="日付のタイトル" v-model="eventLabel" />
            <button class="join-item btn btn-primary" @click="onDateSettings">設定</button>
          </div>
        </p>
      </div>
    </dialog>
  </div>
</template>