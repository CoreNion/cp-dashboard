<script setup lang="ts">
const chimeTimeState = userChimeTimes();
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
      <table class="table">
        <thead>
          <tr>
            <th>削除</th>
            <th>時刻</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chimeTime of chimeTimeState">
            <td>
              <button class="btn btn-sm btn-circle btn-outline btn-error">
                <IconCSS name="uil:trash-alt" />
              </button>
            </td>
            <td>{{ chimeTime[0] + ':' + chimeTime[1] }}</td>
          </tr>
        </tbody>
      </table>
      <label class="label cursor-pointer mt-4">
        <span class="label-text">1分前に予鈴を鳴らす</span>
        <input type="checkbox" class="toggle toggle-secondary"  />
      </label>
      </p>
    </div>
  </dialog>
</template>