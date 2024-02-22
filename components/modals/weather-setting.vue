<script setup lang="ts">
import { amedasInfo, regionCodeName } from '#imports';
import { refleshWeather } from '~/plugins/04.weather.client';

const loaded = ref<boolean>(false);

// 広域地方 (コード)
const selectedWideRegion = weatherWideRegionNumber();
// 地方 (コード)
const selectedLocalRegion = weatherOfficeNumber();
// 地域 (コード)
const selectedRegion = weatherAreaNumber();
// アメダスの地点 (コード)
const selectedAmedasCode = weatherAmedasCode();
// 外気温のみ利用するか
const useOnlyTemp = isAmedasOnlyTmp();
// アメダス地点名
const weatherAmedasNameState = weatherAmedasName();

const selectedOnlyTemp = () => {
  return getAmedasInfo(origAmedasInfos, selectedAmedasCode.value).onlyTemp;
};
// 広域地方の選択肢
const wideRegionOptions = useState<Array<regionCodeName>>(() => []);
// 地方の選択肢
const localRegionOptions = useState<Array<regionCodeName>>(() => []);
// 地域の選択肢
const regionOptions = useState<Array<regionCodeName>>(() => []);

// さらなるズームが必要か
const needMoreZoom = useState<boolean>(() => true);
// マーカーの位置
const markerPlaces = useState<Array<amedasInfo>>(() => []);
// 現在のBounds
const boundsState = useState<any>(() => []);
// 現在のズーム状態
const zoomState = useState<number>(() => 4);

let refleshLocalRegion: (e: Event) => void;
let refleshRegion: (e: Event) => void;
let setAreaNumber: (e: Event) => void;

// 天気予報エリア一覧
let areas = "";
// アメダス情報
let origAmedasInfos: any;
// 使用可能なアメダス情報
let usingAmedasInfos: Array<amedasInfo> = [];

watch(() => useOnlyTemp.value, async () => {
  onMapChanged();
});

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
  origAmedasInfos = data[1];

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

    // 天気を更新
    await refleshWeather();
  }

  loaded.value = true;
});

watch(boundsState, () => {
  onMapChanged();
});

watch(zoomState, () => {
  onMapChanged();
});

function onMapChanged() {
  // 既存のマーカーの削除
  markerPlaces.value = [];

  if (zoomState.value < 8) {
    needMoreZoom.value = true;
    return;
  }
  needMoreZoom.value = false;

  // マップを更新
  usingAmedasInfos = convertAmedasInfos(origAmedasInfos, useOnlyTemp.value);
  markerPlaces.value = filterByMapArea(usingAmedasInfos, boundsState.value);
}

function setAmedasLocation(code: string, name: string) {
  selectedAmedasCode.value = code;
  weatherAmedasNameState.value = name;

  // 天気を更新
  refleshWeather();
}
</script>

<template>
  <h3 class="font-bold text-lg">天気設定</h3>

  <div class="divider"></div>

  <h3 class="font-bold text-lg">予報の地域設定</h3>
  <p class="my-3">
    <label class="label">
      <span class="label-text">広域地方</span>
      <select class="select select-bordered w-full max-w-xs" v-model="selectedWideRegion" @change="refleshLocalRegion">
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
  </p>

  <div class="divider"></div>

  <h3 class="font-bold text-lg">アメダスの地点設定</h3>
  <p class="my-3" v-if="loaded">
    <label class="label">
      <span class="label-text">現在の設定地点</span>
      <span class="label-text font-bold">
        <span>{{ weatherAmedasNameState }}</span>
      </span>
    </label>
    <label class="label">
      <span class="label-text">外気温情報のみ利用する<br>(気圧表示にはセンサーが必要)</span>
      <div class="tooltip tooltip-left"
        :data-tip="selectedOnlyTemp() ? 'アメダスの気圧を使用するには、気圧情報を取得できる地点に変更してください。' : '有効にすると、気温のみ取得可能な地点も表示されます。'">
        <input type="checkbox" :class="['toggle', 'toggle-secondary']" :disabled="selectedOnlyTemp()"
          v-model="useOnlyTemp" />
      </div>
    </label>

  <p class="min-w-full h-[433px] mt-3">
  <h2 class="text-error font-bold h-5"> {{ needMoreZoom ? "地点を表示するには、もう少しズームしてください。" : '' }}</h2>

  <LMap ref="map" :center="[32.592850, 137.273600]" v-model:bounds="boundsState" v-model:zoom="zoomState">
    <LTileLayer url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
      attribution="<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>" name="地理院タイル" />
    <LMarker v-for="place of markerPlaces" :lat-lng="[place.lat, place.lon]">
      <LPopup>
        <p>
          <span>{{ place.name }}</span>
          <br>
          <span v-if="place.onlyTemp"> (外気温のみ)</span>
          <span v-else> (気温/気圧)</span>
        </p>
        <button class="btn btn-xs"
          @click="setAmedasLocation(place.code, `${place.name} ${place.onlyTemp ? '(外気温のみ)' : ''}`)">設定</button>
      </LPopup>
    </LMarker>
  </LMap>
  </p>
  </p>
  <p v-else class="skeleton w-full h-96"></p>
</template>
