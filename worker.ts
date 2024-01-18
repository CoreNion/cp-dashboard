import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';

dayjs.extend(duration);
dayjs.locale("ja");

setInterval(() => {
  self.postMessage(dayjs().toDate());
}, 100);