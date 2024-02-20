<script setup lang="ts">
import 'chartjs-adapter-moment';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Colors, TimeScale, type ChartDataset, type Point } from 'chart.js';

ChartJS.register(Colors, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, TimeScale);

const selectedDataKind = ref<string>("");
watch(selectedDataKind, async () => {
  const allRecords = await getSensorRecords(selectedDataKind.value, 5);

  // 1時間ごとの平均記録に変換
  const recordHourly = allRecords.map((record) => {
    const dayRecords = new Map<string, number | null>();
    for (let i = 0; i < 24; i++) {
      const recTime = Array.from(record.value.keys()).filter((key) => {
        return parseInt(key.split(":")[0]) === i;
      });
      if (recTime.length === 0) {
        dayRecords.set(`${i}:00`, null);
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
    }
  });
});

const chartData = ref<ChartDataset<"line", (number | Point | null)[]>[]>([]);

const selectedFile = ref<string | null>(null);
const fileList = ref<{
  key: string;
  value: FileSystemDirectoryHandle | FileSystemFileHandle;
}[]>([]);
const deleteFile = async (file: string) => {
  await removeFile(file);

  selectedFile.value = null;
  fileList.value = fileList.value.filter((f) => f.key !== file);
};

onMounted(async () => {
  fileList.value = await listCsvFiles();

  selectedDataKind.value = "気温";
});
</script>

<template>
  <div>
    <h4 class="pb-2 font-bold">センサーの記録</h4>
    <div>
      <select class="flex-1 select select-bordered w-full" v-model="selectedDataKind">
        <option v-for="kind of kDataKinds" :key="kind">{{ kind }}</option>
      </select>
      <Line :data="{
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: chartData,
      }" :options="{ responsive: true }" />
    </div>

    <div class="divider"></div>

    <h4 class="pb-2 font-bold">記録をダウンロードする</h4>

    <div class="join w-full">
      <button :class="['btn', 'btn-error', 'join-item', selectedFile == null ? 'btn-disabled' : 'btn-active']"
        @click="deleteFile(selectedFile!)">
        <Icon name="uil:trash-alt" size="3vh" />
      </button>
      <select class="flex-1 select select-bordered join-item" v-model="selectedFile">
        <option disabled selected>記録を選択...</option>
        <option v-for="file of fileList" :key="file.key">{{ file.key }}</option>
      </select>
      <button :class="['btn', 'btn-primary', 'join-item', selectedFile == null ? 'btn-disabled' : 'btn-active']"
        @click="downloadFile(selectedFile!)">
        <Icon name="uil:file-download-alt" size="2vw" />
      </button>
    </div>
  </div>
</template>