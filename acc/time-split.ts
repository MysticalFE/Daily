const TIME_TO_SECOND: number = 60 * 1000;
interface TimeProps {
  startTime: number;
  endTime: number;
  interval: number;
}

function getTimeList(params: TimeProps): void | Array<string> {
  const { startTime, endTime, interval } = params;
  if (startTime - endTime > 0) return;
  let timeList = [] as string[];
  const step = Math.floor((endTime - startTime) / interval);
  while (startTime < endTime) {
    const nextTime = startTime + step > endTime ? endTime : startTime + step;
    timeList.push(min2Time(nextTime));
  }
  return timeList;
}

function min2Time(mins: number): string {
  mins = Math.floor(mins / TIME_TO_SECOND);
  let hour: number | string = Math.round(mins / 60);
  let minute: number | string = mins - hour * 60;
  hour >= 24 ? (hour = hour - 24) : "";
  hour < 10 ? (hour = "0" + hour) : "";
  minute < 10 ? (minute = "0" + minute) : "";
  return `${hour}:${minute}`;
}
