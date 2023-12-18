<script setup lang="ts">
import { refleshWeather } from './status.vue';
import { amedasInfo, regionCodeName } from '#imports';

// 広域地方 (コード)
const selectedWideRegion = weatherWideRegionNumber();
// 地方 (コード)
const selectedLocalRegion = weatherOfficeNumber();
// 地域 (コード)
const selectedRegion = weatherAreaNumber();

// 広域地方の選択肢
const wideRegionOptions = useState<Array<regionCodeName>>(() => []);
// 地方の選択肢
const localRegionOptions = useState<Array<regionCodeName>>(() => []);
// 地域の選択肢
const regionOptions = useState<Array<regionCodeName>>(() => []);

// マーカーの位置
const markerPlaces = useState<Array<amedasInfo>>(() => []);

let refleshLocalRegion: (e: Event) => void;
let refleshRegion: (e: Event) => void;
let setAreaNumber: (e: Event) => void;

// 天気予報エリア一覧
let areas = "";
// アメダスの地点一覧
let amedasInfos: Array<amedasInfo> = [];

onMounted(async () => {
  // エリア情報を取得
  const data = await Promise.all([
    $fetch<string>('https://www.jma.go.jp/bosai/common/const/area.json'),
    $fetch<string>('https://www.jma.go.jp/bosai/amedas/const/amedastable.json'),
  ]).catch((e) => {
    console.error(e);
    return;
  });
  if (data == null) {
    console.error('data is null');
    return;
  }
  areas = data[0];
  amedasInfos = convertAmedasInfos(data[1]);

  // 広域地方, 地方, 地域のコードを取得
  const regions = Object(areas)["centers"];
  const offices = Object(areas)["offices"];
  const class10s = Object(areas)["class10s"];

  // 広域地方の選択肢を作成 (コード, 地方名)
  wideRegionOptions.value = Object.entries(regions).map(([key, value]) => {
    return new regionCodeName(key, (value as any)["name"])
  });

  // 地方/地域の選択肢を作成
  localRegionOptions.value = getWeatherAreaCodes(regions, selectedWideRegion.value, offices);
  regionOptions.value = getWeatherAreaCodes(offices, selectedLocalRegion.value, class10s);

  // 地方の選択肢を更新する関数
  refleshLocalRegion = (e: Event) => {
    if (!(e.target instanceof HTMLSelectElement)) return;
    selectedWideRegion.value = e.target.value;
    regionOptions.value = [];

    // 地方内の地域のコードを取得
    localRegionOptions.value = getWeatherAreaCodes(regions, selectedWideRegion.value, offices);
  }

  // 地域の選択肢を更新する関数
  refleshRegion = (e: Event) => {
    if (!(e.target instanceof HTMLSelectElement)) return;
    selectedLocalRegion.value = e.target.value;

    // 地域内の地域のコードを取得
    regionOptions.value = getWeatherAreaCodes(offices, selectedLocalRegion.value, class10s);
  }

  // 地域番号などを更新する関数
  setAreaNumber = async (e: Event) => {
    if (!(e.target instanceof HTMLSelectElement)) return;

    // メモリ上
    weatherWideRegionNumber().value = selectedWideRegion.value!;
    weatherOfficeNumber().value = selectedLocalRegion.value!;
    weatherAreaNumber().value = e.target.value;

    // ストレージ
    localStorage.setItem('weatherWideRegion', weatherWideRegionNumber().value);
    localStorage.setItem('weatherOfficeNumber', weatherOfficeNumber().value);
    localStorage.setItem('weatherAreaNumber', weatherAreaNumber().value);

    // 天気を更新
    await refleshWeather();
  }
});

function onMapChanged(e: any) {
  // 既存のマーカーの削除
  markerPlaces.value = [];

  const target = e.target;
  if (target.getZoom() < 8) return;

  // マップに表示されている範囲に存在するアメダスの地点を取得
  const bounds = target.getBounds();
  // マップを更新
  markerPlaces.value = filterByMapArea(amedasInfos, bounds);
}
</script>

<template>
  <button class="btn btn-neutral min-w-full mt-3" onclick="weatherSettingsModal.showModal()">天気設定</button>
  <dialog id="weatherSettingsModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <h3 class="font-bold text-lg">天気設定</h3>

      <div class="divider"></div>

      <h3 class="font-bold text-lg">予報の地域設定</h3>
      <p class="my-3">
        <label class="label">
          <span class="label-text">広域地方</span>
          <select class="select select-bordered w-full max-w-xs" v-model="selectedWideRegion"
            @change="refleshLocalRegion">
            <option disabled selected>地方... (表示されない場合は読み込み中かオフラインです)</option>
            <option v-for="region of wideRegionOptions" :value="region.code">{{ region.name }}</option>
          </select>
        </label>

        <label class="label">
          <span class="label-text">都道府県/地方</span>
          <select class="select select-bordered w-full max-w-xs" v-model="selectedLocalRegion" @change="refleshRegion">
            <option disabled selected>都道府県/地方を選択... (表示されない場合は読み込み中かオフラインです)</option>
            <option v-for="region of localRegionOptions" :value="region.code">{{ region.name }}
            </option>
          </select>
        </label>

        <label class="label">
          <span class="label-text">地域</span>
          <select class="select select-bordered w-full max-w-xs" v-model="selectedRegion" @change="setAreaNumber">
            <option disabled selected>地域を選択... (表示されない場合は読み込み中かオフラインです)</option>
            <option v-for="region of regionOptions" :value="region.code">{{ region.name }}
            </option>
          </select>
        </label>

      <div class="divider"></div>

      <h3 class="font-bold text-lg">アメダスの地点設定</h3>
      <label class="label">
        <span class="label-text">現在の設定地点</span>
        <span class="label-text font-bold"></span>
      </label>

      <p class="min-w-full h-[433px] mt-3">
        <LMap ref="map" :zoom="4" @zoomend="onMapChanged" @moveend="onMapChanged" :center="[32.592850, 137.273600]">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            name="OpenStreetMap" />
          <LMarker v-for="place of markerPlaces" :lat-lng="[place.lat, place.lon]">
            <LPopup>
              <span>{{ place.name }}</span>
              <br />
              <button class="btn btn-xs" @click="console.log(place.name)">設定</button>
            </LPopup>
          </LMarker>
        </LMap>
      </p>
      </p>
    </div>
  </dialog>
</template>
