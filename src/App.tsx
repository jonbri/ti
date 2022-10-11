import React from "react";
import data, { RawItem } from "./data";
import moment, { Moment, unitOfTime } from "moment";
import "./App.css";

interface Item extends RawItem {
  formattedAge: string;
  daysUntilBirthday: number;
}

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
const nowMonth = new Date().getMonth() + 1;
const nowDate = new Date().getDate();

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

const numberOfUpcoming = 4;
const createUpcoming = () => {
  let sorted = dates.slice().filter(({ hide }) => !hide);
  sorted = sorted.sort(
    (
      { death: death0, daysUntilBirthday: daysUntilBirthday0 },
      { daysUntilBirthday: daysUntilBirthday1 }
    ) => {
      if (death0) return 1;
      else if (daysUntilBirthday0 === daysUntilBirthday1) return 0;
      else if (daysUntilBirthday0 < daysUntilBirthday1) return -1;
      else if (daysUntilBirthday0 > daysUntilBirthday1) return 1;
      return 0;
    }
  );
  const display = [];
  for (let i = 0; i < numberOfUpcoming; i++) {
    display.push(`${sorted[i].name}: ${sorted[i].daysUntilBirthday}`);
  }
  return display.join(", ");
};

const App = () => (
  <div>
    <h3>
      <a href="./">{moment().format("MMMM DD, YYYY")}</a>
    </h3>
    <h4 className="soon">
      <span>Soon: </span>
      {createUpcoming()}
    </h4>
    <table>
      <tbody>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        {dates.map(
          ({
            name,
            death,
            hide,
            formattedAge,
            birthday,
            daysUntilBirthday,
          }) => {
            let rowColor = "";
            if (death) rowColor = "passedAway";
            else if (hide === true) rowColor = "hide";
            const [, month, date] = birthday.split("-");
            return !death &&
              nowMonth === parseInt(month) &&
              nowDate === parseInt(date) ? (
              <tr
                className={rowColor ? `${rowColor} today` : "today"}
                key={name}
              >
                <td colSpan={2}>
                  {formattedAge.replace(/[^\d]+/, "") +
                    " " +
                    name.toUpperCase()}
                </td>
                <td
                  style={{
                    fontSize: "16px",
                  }}
                >
                  {birthday}
                </td>
                <td></td>
              </tr>
            ) : (
              <tr className={rowColor} key={name}>
                <td>{name}</td>
                <td colSpan={death ? 3 : 1}>
                  {death
                    ? `${formattedAge.replace(
                        /([\d]+).*$/,
                        "$1"
                      )} (${birthday} - ${death})`
                    : formattedAge
                        .replace(" months", "mo")
                        .replace(" years", "y")}
                </td>
                {death ? null : <td>{birthday}</td>}
                {death ? null : <td>{`(-${daysUntilBirthday})`}</td>}
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  </div>
);

export default App;