<script setup lang="ts">
import dayjs from 'dayjs';

const countdownDatesState = countdownDates();

const selectedEventColor = ref<string>("gray");
const eventLabel = ref<string>("");
const selectedDate: Ref<Date | null> = ref(new Date());
const everyYear = ref<boolean>(false);

const attr = ref<any[]>([]);

const onDateSettings = () => {
  countdownDatesState.value = [
    ...(countdownDatesState.value),
    {
      date: dayjs(selectedDate.value!).format("YYYY-MM-DD"),
      label: eventLabel.value,
      color: selectedEventColor.value,
      everyYear: everyYear.value,
    },
  ];
  
  // 日付順にソート
  countdownDatesState.value = countdownDatesState.value.sort((a, b) => {
    return a.date < b.date ? -1 : 1;
  });
};

const removeDate = (date: string) => {
  countdownDatesState.value = countdownDatesState.value.filter((d) => d.date !== date);
  eventLabel.value = "";
  selectedDate.value = null;
};

watch(countdownDatesState, () => {
  refleshCountDownDate();
});

watch(selectedDate, () => {
  eventLabel.value = "";
  selectedEventColor.value = "gray";
  for (const date of countdownDatesState.value) {
    if (dayjs(selectedDate.value!).format("YYYY-MM-DD") === date.date) {
      eventLabel.value = date.label;
      selectedEventColor.value = date.color;
      everyYear.value = date.everyYear ?? false;
      break;
    }
  }
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
  <form method="dialog">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
  </form>

  <h3 class="font-bold text-lg">カウントダウン設定</h3>
  <p class="py-2">
    <VDatePicker v-model="selectedDate" expanded title-position="left" :attributes="attr" color="orange">
      <template #footer>
        <span class="block p-2 border-t w-full">{{ selectedDate === null ? "未選択" :
          dayjs(selectedDate).format("YYYY年MM月DD日") }}</span>
        <span class="block p-2 text-red-500 font-bold" v-if="eventLabel != ''">イベントが設定されています</span>
      </template>
    </VDatePicker>
  </p>
  <p class="py-2">
  <div class="join w-full">
    <button class="join-item btn btn-error" @click="removeDate(dayjs(selectedDate).format('YYYY-MM-DD'))">
      <Icon name="uil:trash-alt" size="2.5vh" />
    </button>
    <select class="join-item select select-bordered border" v-model="selectedEventColor">
      <option v-for="color of ['gray', 'red', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink']">
        {{ color }}
      </option>
    </select>
    <input class="join-item input input-bordered w-full" placeholder="日付のタイトル" v-model="eventLabel" />
    <button :class="['join-item', 'btn', 'btn-primary', selectedDate === null ? 'btn-disabled' : '']"
      @click="onDateSettings">設定</button>
  </div>
  <label class="label cursor-pointer mt-2">
    <span class="label-text">毎年繰り返す</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="everyYear" />
  </label>
  </p>
</template>