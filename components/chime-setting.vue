<script setup lang="ts">
import { removeChimeTime } from '~/utils/time';

const userChimeTimesState = userChimeTimes();

const changeChimeTimeEl = (oldTime: string, event: any) => {
  changeChimeTime(oldTime, event.target.value);
}
</script>

<template>
  <button class="btn w-full" onclick="timeSettingModal.showModal()">チャイム/予鈴時刻設定</button>
  <dialog id="timeSettingModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="chimeTime of userChimeTimesState">
            <td>
              <button class="btn btn-sm btn-circle btn-outline btn-error" @click="removeChimeTime(chimeTime)">
                <IconCSS name="uil:trash-alt" />
              </button>
            </td>
            <td>
                <input type="time" :value="chimeTime" class="input input-bordered" @change="(e) => changeChimeTimeEl(chimeTime, e)" />
            </td>
          </tr>
        </tbody>
      </table>
      </p>
    </div>
  </dialog>
</template>