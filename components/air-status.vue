<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, type ChartData } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

const gasDatas = useState<Map<string, number>>(() => new Map());
const gasState = gas();

watch(
  gasState,
  (counter) => {
    if (counter == null) return;

    const now = dayjs().format('HH:mm:ss');
    gasDatas.value.set(now, counter);
  }
);
</script>
<template>
  <a class="link" onclick="air_modal.showModal()">空気質グラフ</a>
  <dialog id="air_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div>
        <Line :data="{
          labels: Array.from(gasDatas.keys()),
          datasets: [
            {
              label: 'ガス抵抗値',
              data: Array.from(gasDatas.values()),
            },
          ],
        }" :options="{
        }"
        />
      </div>
    </div>
  </dialog>
</template>