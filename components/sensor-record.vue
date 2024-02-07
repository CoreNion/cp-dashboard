<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Colors, type ChartData, type ChartDataset, type Point } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(Colors, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

const selectedDataKind = ref<string>("");
watch(selectedDataKind, async () => {
  const allRecords = await getSensorRecords(selectedDataKind.value);

  // 1時間ごとの平均記録に変換
  const recordHourly = allRecords.map((record) => {
    const dayRecords = new Map<string, number>();
    for (let i = 0; i < 24; i++) {
      const recTime = Array.from(record.value.keys()).filter((key) => {
        return parseInt(key.split(":")[0]) === i;
      });
      if (recTime.length === 0) {
        dayRecords.set(`${i}:00`, 0);
      } else {
        dayRecords.set(`${i}:00`, recTime.reduce((acc, cur) => acc + record.value.get(cur)!, 0) / recTime.length);
      }
    }
    return {
      date: record.date,
      value: dayRecords,
    };
  });

  chartData.value = recordHourly.map((record) => {
    return {
      label: record.date,
      data: Array.from(record.value.values()),
      fill: false,
      tension: 0.1,
    }
  });
});


const chartData = ref<ChartDataset<"line", (number | Point | null)[]>[]>([]);

const selectedFile = ref<string | null>(null);
const fileList = ref<{
  key: string;
  value: FileSystemDirectoryHandle | FileSystemFileHandle;
}[]>([]);

// センサー記録用のモーダルを表示するか
const showSensorRecordModal = useState("showSensorRecordModal", () => false);
onMounted(async () => {
  // @ts-ignore
  air_modal.showModal();
  fileList.value = await listCsvFiles();

  selectedDataKind.value = "気温";
});
</script>
<template>
  <dialog id="air_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="showSensorRecordModal = false">✕</button>
      </form>

      <h4 class="pb-2 font-bold">センサーの記録</h4>
      <div>
        <select class="flex-1 select select-bordered w-full" v-model="selectedDataKind">
          <option v-for="kind of kDataKinds" :key="kind">{{ kind }}</option>
        </select>
        <Line :data="{
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          datasets: chartData,
        }"
         />
      </div>

      <div class="divider"></div>

      <h4 class="pb-2 font-bold">記録をダウンロードする</h4>
      <div class="flex flex-row gap-2">
        <select class="flex-1 select select-bordered" v-model="selectedFile">
          <option disabled selected>記録を選択...</option>
          <option v-for="file of fileList" :key="file.key">{{ file.key }}</option>
        </select>
        <button :class="['btn', 'btn-primary', selectedFile == null ? 'btn-disabled' : 'btn-active']"
          @click="downloadFile(selectedFile!)">
          <IconCSS name="uil:file-download-alt" size="2vw" />
        </button>
      </div>
    </div>
  </dialog>
</template>