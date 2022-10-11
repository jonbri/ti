import React from "react";
import data, { RawItem } from "./data";
import moment, { Moment, unitOfTime } from "moment";
import "./App.css";

// https://codepen.io/blackjacques/pen/RKPKba
const getFormattedDateDiff = (
  date1: string | Moment,
  date2: string | Moment,
  intervals?: unitOfTime.Diff[]
) => {
  var b = moment(date1),
    a = moment(date2),
    out: string[] = [];
  intervals = intervals || ["years", "months"];
  function singularize(s: string, num: number) {
    return num === 1 ? s.slice(0, -1) : s;
  }
  intervals.forEach(function (interval) {
    var diff = a.diff(b, interval);
    b.add(diff, interval);
    if (diff > 0) {
      out.push(diff + " " + singularize(interval, diff));
    }
  });
  return out.join(", ") || "0";
};

const getDayOfYear = (m: string | moment.Moment) =>
  parseInt(moment(m).format("DDD"));
const nowMonth = new Date().getMonth() + 1;
const nowDate = new Date().getDate();

// top-level React control
interface HomeProps {
  dates: Item[];
}
const Home = ({ dates }: HomeProps) => {
  const formattedNow = moment().format("MMMM DD, YYYY");
  const topAnchor = React.createElement(
    "a",
    {
      href: "./",
    },
    formattedNow
  );

  const createTimestamp = () => React.createElement("h3", null, topAnchor);

  const createTable = (data: Item[]) => {
    const createHeaderRow = () =>
      React.createElement("tr", null, [
        React.createElement("th", null, ""),
        React.createElement("th", null, ""),
        React.createElement("th", null, ""),
        React.createElement("th", null, ""),
      ]);
    const createRows = () => {
      return data.map(
        ({ name, death, hide, formattedAge, birthday, daysUntilBirthday }) => {
          let rowColor = "";
          if (death) rowColor = "passedAway";
          else if (hide === true) rowColor = "hide";
          const [, month, date] = birthday.split("-");
          if (
            !death &&
            nowMonth === parseInt(month) &&
            nowDate === parseInt(date)
          ) {
            return React.createElement(
              "tr",
              {
                className: rowColor ? `${rowColor} today` : "today",
                style: {},
              },
              [
                React.createElement(
                  "td",
                  { colSpan: 2 },
                  formattedAge.replace(/[^\d]+/, "") + " " + name.toUpperCase()
                ),
                React.createElement(
                  "td",
                  { style: { fontSize: "16px" } },
                  birthday
                ),
                React.createElement("td", null, ""),
              ]
            );
          } else {
            return React.createElement("tr", { className: rowColor }, [
              React.createElement("td", null, name),
              React.createElement(
                "td",
                { colSpan: death ? 3 : 1 },
                death
                  ? `${formattedAge.replace(
                      /([\d]+).*$/,
                      "$1"
                    )} (${birthday} - ${death})`
                  : formattedAge.replace(" months", "mo").replace(" years", "y")
              ),
              death ? null : React.createElement("td", null, birthday),
              death
                ? null
                : React.createElement(
                    "td",
                    null,
                    "(-" + daysUntilBirthday + ")"
                  ),
            ]);
          }
        }
      );
    };
    return React.createElement(
      "table",
      {},
      [createHeaderRow()].concat(createRows())
    );
  };

  const numberOfUpcoming = 4;
  const createUpcoming = () => {
    let sorted = dates.slice().filter(({ hide }) => hide !== true);
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
      display.push(sorted[i].name + ": " + sorted[i].daysUntilBirthday);
    }

    const soonLabel = React.createElement("span", {}, "Soon: ");
    return React.createElement(
      "h4",
      {
        className: "soon",
      },
      [soonLabel, display.join(", ")]
    );
  };

  return React.createElement(
    "div",
    {},
    createTimestamp(),
    createUpcoming(),
    createTable(dates)
  );
};

interface Item extends RawItem {
  formattedAge: string;
  daysUntilBirthday: number;
}
// called for each member of window.aData
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

function App() {
  const dates = data.map(transformData);
  return <Home dates={dates} />;
}

export default App;
