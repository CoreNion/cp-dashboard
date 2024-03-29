import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale("ja");

self.onmessage = onMessage;

(async () => {
  // 10分ごとに天気を更新
  await refleshWeather();
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 600000));
    await refleshWeather();
  }
})();

async function onMessage(event: MessageEvent<any>) {
  console.log(event);
  const data = event.data;
  if (typeof data === "string") {
    if (data === "REFLESH_WEATHER") {
      await refleshWeather();
    }
  }
}

async function refleshWeather() {
  // メインスレッドから設定を取得
  type weatherStorageType = { amedasCode: string, weatherOfficeNumber: string, weatherAreaNumber: string, isAmedasOnlyTmp: boolean };
  self.postMessage("GET_STORAGE_KEY");
  const storageData: weatherStorageType = await new Promise((resolve) => {
    self.onmessage = (event: MessageEvent<weatherStorageType>) => {
      const data = event.data;
      resolve(data);
    }
  });
  self.onmessage = onMessage;
  
  // 最新の気象データの時刻を取得
  const latestTimeFetch = await fetch(`https://www.jma.go.jp/bosai/amedas/data/latest_time.txt`);
  const latestTime = dayjs(await latestTimeFetch.text());
  // 最新のJSONファイル名 (3時間ごとに別ファイル)
  const latestJsonName = `${latestTime.format("YYYYMMDD")}_${(Math.floor(latestTime.hour() / 3) * 3).toString().padStart(2, "0")}.json`;

  // アメダス/天気予報のデータを取得
  const data = await Promise.all([
    // アメダスのデータ
    (await fetch(`https://www.jma.go.jp/bosai/amedas/data/point/${storageData.amedasCode}/${latestJsonName}`)).text(),
    // 天気予報のデータ
    (await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${storageData.weatherOfficeNumber}.json`)).text(),
  ]).catch((e) => {
    console.error(e);
    return;
  });

  if (data == null) {
    console.error('data is null');
    return;
  }

  /* アメダスのデータの処理 */
  const amedasData = JSON.parse(data[0]);

  // 最後にある最新の気象データを取得
  const latestWeather = Object(Object.values(amedasData).pop());
  // 気温を取得
  const outTmp = latestWeather.temp[0];

  // 気圧を取得
  let pressure = "";
  if (!storageData.isAmedasOnlyTmp)
    pressure = latestWeather.pressure[0];

  /* 天気予報のデータの処理 */
  const forecastData = JSON.parse(data[1]);

  // 今日の天気を取得
  const todayForecast = forecastData[0].timeSeries[0].areas as Array<any>;
  // 設定されている地域のインデックスを取得
  const areaIndex = todayForecast.findIndex((value) => value.area.code == storageData.weatherAreaNumber);
  const todayWeatherCode = todayForecast[areaIndex].weatherCodes[0];

  const weather = w2s(todayWeatherCode);

  self.postMessage({
    outTmp: outTmp,
    pressure: pressure,
    weather: weather,
  }); 
}

function w2s(weatherCode: String) {
  switch (weatherCode) {
    /* 晴れ */
    case "100":
      // 晴れ
    case "130":
      // 朝の内霧後晴れ
    case "131":
      // 晴れ明け方霧
      return "wi:day-sunny";
    case "101":
      // 晴れ時々曇り
    case "132":
      // 晴れ朝夕曇り
      return "wi:day-sunny-overcast";
    case "102":
      // 晴れ一時雨
    case "103":
      // 晴れ時々雨
    case "120":
      // 晴れ朝夕一時雨
    case "121":
      // 晴れ朝の内一時雨
      return "wi:day-rain";
    case "104":
      // 晴れ一時雪
    case "105":
      // 晴れ時々雪
    case "160":
      // 晴れ一時雪か雨
    case "170":
      // 晴れ時々雪か雨
      return "wi:day-snow";
    case "106":
      // 晴れ一時雨か雪
    case "107":
      // 晴れ時々雨か雪
    case "181":
      // 晴れのち雪か雨
      return "wi:day-rain-mix";
    case "108":
      // 晴れ時々雨か雷雨
    case "140":
      // 晴れ時々雨で雷を伴う
      return "wi:day-thunderstorm";
    case "110":
      // 晴れのち時々曇り
    case "111":
      // 晴れのち曇り
      return "wi:day-cloudy";
    case "112":
      // 晴れのち一時雨
    case "113":
      // 晴れのち時々雨
    case "114":
      // 晴れのち雨
    case "122":
      // 晴れ夕方一時雨
    case "126":
      // 晴れ昼頃から雨
    case "127":
      // 晴れ夕方から雨
      return "wi:day-rain";
    case "115":
      // 晴れのち一時雪
    case "116":
      // 晴れのち時々雪
    case "117":
      // 晴れのち雪
      return "wi:day-snow";
    case "118":
      // 晴れのち雨か雪
      return "wi:day-rain-mix";
    case "119":
      // 晴れのち雨か雷雨
    case "125":
      // 晴午後は雷雨
      return "wi:day-thunderstorm";
    case "123":
      // 晴れ山沿い雷雨
      return "wi:day-cloudy";
    case "124":
      // 晴れ山沿い雪
      return "wi:day-sunny-overcast";
    case "128":
      // 晴れ夜は雨
      return "wi:night-alt-rain";
  
    /* 曇り */
    case "200":
      // 曇り
    case "231":
      // 曇り海上海岸は霧か霧雨
      return "wi:cloudy";
    case "201":
      // 曇り時々晴れ
    case "223":
      // 曇り日中時々晴れ
      return "wi:day-cloudy";
    case "202":
      // 曇り一時雨
    case "203":
      // 曇り時々雨
    case "220":
      // 曇り朝夕一時雨
    case "221":
      // 曇り朝の内一時雨
      return "wi:rain-mix";
    case "204":
      // 曇り一時雪
    case "205":
      // 曇り時々雪
      return "wi:snow";
    case "206":
      // 曇り一時雨か雪
    case "207":
      // 曇り時々雨か雪
    case "270":
      // 曇り時々雪か雨
      return "wi:rain-mix";
    case "208":
      // 曇り一時雨か雷雨
    case "240":
      // 曇り時々雨で雷を伴う
      return "wi:thunderstorm";
    case "209":
      // 霧
      return "wi:fog";
    case "210":
      // 曇りのち時々晴れ
    case "211":
      // 曇りのち晴れ
    return "wi:day-cloudy";
    case "212":
      // 曇りのち一時雨
    case "213":
      // 曇りのち時々雨
    case "214":
      // 曇りのち雨
    case "222":
      // 曇り夕方一時雨
    case "224":
      // 曇り昼頃から雨
    case "225":
      // 曇り夕方から雨
    case "226":
      // 曇り夜は雨
      return "wi:night-alt-rain";
    case "215":
      // 曇りのち一時雪
    case "216":
      // 曇りのち時々雪
    case "217":
      // 曇りのち雪
    case "228":
      // 曇り昼頃から雪
    case "229":
      // 曇り夕方から雪
    case "230":
      // 曇り夜は雪
      return "wi:night-alt-snow";
    case "218":
      // 曇りのち雨か雪
    case "281":
      // 曇りのち雪か雨
      return "wi:rain-mix";
    case "219":
      // 曇りのち雨か雷雨
      return "wi:thunderstorm";
    case "250":
      // 曇り時々雪で雷を伴う
      return "wi:thunderstorm";

    /* 雨 */
    case "300":
      // 雨
      return "wi:rain";
    case "301":
      // 雨時々晴れ
      return "wi:day-rain";
    case "302":
      // 雨時々止む
      return "wi:raindrops";
    case "303":
      // 雨時々雪
    case "304":
      // 雨か雪
    case "309":
      // 雨一時雪
    case "322":
      // 雨朝晩一時雪
    case "329":
      // 雨一時みぞれ
      return "wi:rain-mix";
    case "306":
      // 大雨
    case "328":
      // 雨一時強く降る
      return "wi:rain";
    case "308":
      // 雨で暴風を伴う
      return "wi:rain-wind";
    case "311":
      // 雨のち晴れ
    case "320":
      // 朝のうち雨のち晴れ
    case "323":
      // 雨昼ごろから晴れ
    case "324":
      // 雨夕方から晴れ
      return "wi:night-rain";
    case "313":
      // 雨のち曇り
    case "321":
      // 朝のうち雨のち曇り
      return "wi:rain";
    case "314":
      // 雨のち時々雪
    case "315":
      // 雨のち雪
    case "326":
      // 雨夕方から雪
    case "327":
      // 雨夜は雪
      return "wi:rain-mix";
    case "316":
      // 雨か雪のち晴れ
    case "361":
      // 雪か雨のち晴れ
      return "wi:day-rain";
    case "317":
      // 雨か雪のち曇り
    case "371":
      // 雪か雨のち曇り
      return "wi:rain-mix";
    case "325":
      // 雨夜は晴れ
      return "wi:night-alt-rain";
    case "340":
      // 雪か雨
      return "wi:rain-mix";
    case "350":
      // 雨で雷を伴う
      return "wi:thunderstorm";

    /* 雪 */
    case "400":
      // 雪
      return "wi:snow";
    case "401":
      // 雪時々晴れ
      return "wi:day-snow";
    case "402":
      // 雪時々止む
      return "wi:snowflake-cold";
    case "403":
      // 雪時々雨
    case "409":
      // 雪一時雨
      return "wi:rain-mix";
    case "405":
      // 大雪
    case "425":
      // 雪一時強く降る
      return "wi:snow-wind";
    case "406":
      // 風雪強い
    case "407":
      // 暴風雪
      return "wi:snow-wind";
    case "411":
      // 雪のち晴れ
    case "420":
      // 朝のうち雪のち晴れ
      return "wi:day-snow";
    case "413":
      // 雪のち曇り
    case "421":
      // 朝のうち雪のち曇り
      return "wi:snowflake-cold";
    case "414":
      // 雪のち雨
    case "422":
      // 雪昼頃から雨
    case "423":
      // 雪夕方から雨
      return "wi:rain-mix";
    case "426":
      // 雪のちみぞれ
    case "427":
      // 雪一時みぞれ
      return "wi:rain-mix";
    case "450":
      // 雪で雷を伴う
      return "wi:thunderstorm";
    default:
      return "line-md:question-circlewi:alien";
  };
}