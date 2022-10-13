import moment, { unitOfTime } from "moment";
import { RawItem } from "./types";
import data from "./data";

const getFormattedDateDiff = (date1: string, date2: string) => {
  const b = moment(date1);
  const a = moment(date2);
  const out: string[] = [];
  const singularize = (s: string, num: number) =>
    s.slice(0, num === 1 ? -1 : s.length);
  const intervals: unitOfTime.Diff[] = ["years", "months"];
  intervals.forEach((interval) => {
    const diff = a.diff(b, interval);
    b.add(diff, interval);
    if (diff > 0) out.push(`${diff} ${singularize(interval, diff)}`);
  });
  return out.join(", ") || "0";
};

const getDayOfYear = (m: string) => parseInt(moment(m).format("DDD"));
const currentYear = new Date().getFullYear().toString();

const numberOfUpcoming = 4;
const dates = data.map((item: RawItem) => {
  const now = moment().toString();
  const { birthday, death } = item;
  const formattedAge = death
    ? getFormattedDateDiff(birthday, death)
    : getFormattedDateDiff(birthday, now);
  let daysUntilBirthday = -1;
  if (!death) {
    const birthdayCurrentYear = birthday.replace(/^[\d]+/, currentYear);
    const birthdayDayOfYear = getDayOfYear(birthdayCurrentYear);
    const nowDayOfYear = getDayOfYear(now);
    daysUntilBirthday =
      birthdayDayOfYear > nowDayOfYear
        ? birthdayDayOfYear - nowDayOfYear
        : birthdayDayOfYear + (365 - nowDayOfYear);
  }
  return {
    ...item,
    formattedAge,
    daysUntilBirthday,
  };
});

const upcoming = dates
  .slice()
  .filter(({ hide }) => !hide)
  .sort(
    (
      { death: death0, daysUntilBirthday: daysUntilBirthday0 },
      { daysUntilBirthday: daysUntilBirthday1 }
    ) => {
      if (death0) return 1;
      else if (daysUntilBirthday0 < daysUntilBirthday1) return -1;
      else if (daysUntilBirthday0 > daysUntilBirthday1) return 1;
      return 0;
    }
  )
  .slice(0, numberOfUpcoming)
  .map(({ name, daysUntilBirthday }) => `${name}: ${daysUntilBirthday}`)
  .join(", ");

export const getData = () => ({
  dates,
  upcoming,
});
