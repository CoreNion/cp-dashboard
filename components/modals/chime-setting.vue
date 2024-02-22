<script setup lang="ts">
import { removeChimeTime } from '~/utils/time';

const userChimeTimesState = userChimeTimes();

const changeChimeTimeEl = (oldTime: ChimeTime, event: any) => {
  changeChimeTime(oldTime, { time: event.target.value, chime: oldTime.chime, preChime: oldTime.preChime });
}
const changeChimeEnabled = (time: ChimeTime, event: any) => {
  changeChimeTime(time, { time: time.time, chime: event.target.checked, preChime: time.preChime });
}
const changePreChimeEnabled = (time: ChimeTime, event: any) => {
  changeChimeTime(time, { time: time.time, chime: time.chime, preChime: event.target.checked });
}
</script>

<template>
  <h3 class="font-bold text-lg">チャイム時刻設定</h3>
  <p class="py-2">
    <button class="btn w-full" @click="addChimeTime('00:00')">
      チャイム鳴動時刻を追加
    </button>
  <table class="table">
    <thead>
      <tr>
        <th>削除</th>
        <th>時刻</th>
        <th>チャイム</th>
        <th>予鈴</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="chimeTime of userChimeTimesState">
        <td>
          <button class="btn btn-sm btn-circle btn-outline btn-error" @click="removeChimeTime(chimeTime.time)">
            <Icon name="uil:trash-alt" />
          </button>
        </td>
        <td>
          <input type="time" :value="chimeTime.time" class="input input-bordered"
            @change="(e) => changeChimeTimeEl(chimeTime, e)" />
        </td>
        <td>
          <input type="checkbox" class="toggle toggle-primary" :checked="chimeTime.chime"
            @change="(e) => changeChimeEnabled(chimeTime, e)" />
        </td>
        <td>
          <input type="checkbox" class="toggle toggle-secondary" :checked="chimeTime.preChime"
            @change="(e) => changePreChimeEnabled(chimeTime, e)" />
        </td>
      </tr>
    </tbody>
  </table>
  </p>
</template>