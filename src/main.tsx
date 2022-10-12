import data from "./data";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import moment, { Moment, unitOfTime } from "moment";
import { Item, RawItem } from "./types";

// https://codepen.io/blackjacques/pen/RKPKba
const getFormattedDateDiff = (
  date1: string | Moment,
  date2: string | Moment
) => {
  var b = moment(date1),
    a = moment(date2),
    out: string[] = [];
  const singularize = (s: string, num: number) =>
    num === 1 ? s.slice(0, -1) : s;
  const intervals: unitOfTime.Diff[] = ["years", "months"];
  intervals.forEach((interval) => {
    var diff = a.diff(b, interval);
    b.add(diff, interval);
    if (diff > 0) out.push(`${diff} ${singularize(interval, diff)}`);
  });
  return out.join(", ") || "0";
};

const getDayOfYear = (m: string | moment.Moment) =>
  parseInt(moment(m).format("DDD"));
const transformData = (o: RawItem): Item => {
  const now = moment();
  const currentYear = new Date().getFullYear();
  const formattedAge = o.death
    ? getFormattedDateDiff(o.birthday, o.death)
    : getFormattedDateDiff(o.birthday, now);
  const sBirthdayCurrentYear = o.birthday.replace(
    /^[\d]+/,
    currentYear.toString()
  );
  let daysUntilBirthday = -1;
  if (!o.death) {
    const iBirthdayDayOfYear = getDayOfYear(sBirthdayCurrentYear);
    const iCurrentDayOfYear = getDayOfYear(now);
    if (iBirthdayDayOfYear > iCurrentDayOfYear) {
      // birthday has not yet passed
      daysUntilBirthday = iBirthdayDayOfYear - iCurrentDayOfYear;
    } else {
      daysUntilBirthday = iBirthdayDayOfYear + (365 - iCurrentDayOfYear);
    }
  }
  return {
    ...o,
    formattedAge,
    daysUntilBirthday,
  };
};

const dates = data.map(transformData);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App dates={dates} />
  </React.StrictMode>
);
