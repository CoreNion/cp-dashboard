<script setup lang="ts">
import dayjs from 'dayjs';

// 選択された日付
const selectedDate: Ref<Date | null> = ref(new Date());

// カウントダウンの日付
const countdownDatesState = countdownDates();
// 年間定期のカウントダウンの日付
const yearlyCountdownDatesState = yearlyCountdownDates();
// カレンダーに表示する属性
const attr = ref<any[]>([]);

// イベントがすでに設定されているか
const eventExists = ref<boolean>(false);
// 選択されたイベントの色
const selectedEventColor = ref<string>("gray");
// イベントのタイトル
const eventLabel = ref<string>("");
// 年間定期のイベントかどうか
const everyYear = ref<boolean>(false);

/// 設定ボタンが押されたときの処理
const onDateSettings = () => {
  if (eventLabel.value === "") {
    alert("タイトルを入力してください");
    return;
  }

  if (everyYear.value) {
    // 年間定期のイベントを追加
    yearlyCountdownDatesState.value = [
      ...(yearlyCountdownDatesState.value),
      {
        date: dayjs(selectedDate.value!).format("MM-DD"),
        label: eventLabel.value,
        color: selectedEventColor.value,
        type: "yearly",
      },
    ];

    // 日付順にソート
    yearlyCountdownDatesState.value = yearlyCountdownDatesState.value.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });
  } else {
    // 一回限りのイベントを追加
    countdownDatesState.value = [
      ...(countdownDatesState.value),
      {
        date: dayjs(selectedDate.value!).format("YYYY-MM-DD"),
        label: eventLabel.value,
        color: selectedEventColor.value,
        type: "once",
      },
    ];

    // 日付順にソート
    countdownDatesState.value = countdownDatesState.value.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });
  }

  refleshCountDownDate();
  eventExists.value = true;
};

// イベントの削除
const removeDate = (date: string) => {
  if (everyYear.value) {
    yearlyCountdownDatesState.value = yearlyCountdownDatesState.value.filter((d) => {
      return d.date !== date.substring(5);
    });
  } else {
    countdownDatesState.value = countdownDatesState.value.filter((d) => d.date !== date);
  }

  selectedDate.value = null;
  refleshCountDownDate();
};

// カウントダウンの日付一覧が変更されたときの処理
watch(countdownDatesState, () => {
  refleshCountDownDate();
});

// 選択された日付が変更されたときの処理
watch(selectedDate, () => {
  eventLabel.value = "";
  selectedEventColor.value = "gray";
  eventExists.value = false;

  for (const date of countdownDatesState.value) {
    if (dayjs(selectedDate.value!).format("YYYY-MM-DD") === date.date) {
      eventLabel.value = date.label;
      selectedEventColor.value = date.color;
      everyYear.value = false;
      eventExists.value = true;
      break;
    }
  }

  for (const date of yearlyCountdownDatesState.value) {
    if (dayjs(selectedDate.value!).format("MM-DD") === date.date) {
      eventLabel.value = date.label;
      selectedEventColor.value = date.color;
      everyYear.value = true;
      eventExists.value = true;
      break;
    }
  }
});

// カレンダーを更新する
const refleshCountDownDate = () => {
  // 一回限りのイベントをカレンダーに表示
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

  // 年間定期のイベントをカレンダーに表示
  attr.value = [...attr.value,
  ...yearlyCountdownDatesState.value.map((origDate) => {
    const d = dayjs(`${dayjs().year()}-${origDate.date}`);
    return {
      key: origDate.label,
      dates: {
        start: d.date(),
        repeat: {
          every: 'year',
          months: d.month() + 1,
          days: d.date(),
        },
      },
      highlight: {
        color: origDate.color,
      },
      popover: {
        label: origDate.label,
        visibility: 'hover',
      },
    };
  })];
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
        <span class="block p-2 text-red-500 font-bold" v-if="eventExists">イベントが設定されています</span>
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
    <input class="join-item input input-bordered w-full" placeholder="日付のタイトル" v-model="eventLabel" required />
    <button :class="['join-item', 'btn', 'btn-primary', selectedDate === null ? 'btn-disabled' : '']"
      @click="onDateSettings">設定</button>
  </div>
  <label class="label cursor-pointer mt-2">
    <span class="label-text">毎年繰り返す</span>
    <input type="checkbox" class="toggle toggle-secondary" v-model="everyYear" />
  </label>
  </p>
</template>