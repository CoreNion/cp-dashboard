<script setup lang="ts">
/*
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, type ChartData } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale); */

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
});
</script>
<template>
  <dialog id="air_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="showSensorRecordModal = false">✕</button>
      </form>
      <div>
        <!--
        <Line :data="{
          labels: Array.from(gasDatas.keys()),
          datasets: [
            {
              label: 'ガス抵抗値',
              data: Array.from(gasDatas.values()),
              borderColor: '#4c51bf',
            },
          ],
        }" />
      -->
      </div>

      <div class="divider"></div>

      <h4 class="pb-2 font-bold">記録をダウンロードする</h4>
      
      <div class="flex flex-row gap-2">
        <select class="flex-1 select select-bordered" v-model="selectedFile">
          <option disabled selected>記録を選択...</option>
          <option v-for="file of fileList" :key="file.key">{{ file.key }}</option>
        </select>
        <button :class="['btn', 'btn-primary', selectedFile == null ? 'btn-disabled' : 'btn-active']" @click="downloadFile(selectedFile!)">
          <IconCSS name="uil:file-download-alt" size="2vw" />
        </button>
      </div>
    </div>
  </dialog>
</template>