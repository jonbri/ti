import moment from "moment";
import { Item } from "./types";
import "./App.css";

const nowMonth = new Date().getMonth() + 1;
const nowDate = new Date().getDate();

const numberOfUpcoming = 4;
const createUpcoming = (dates: Item[]) => {
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

export interface AppProps {
  dates: Item[];
}
const App = ({ dates }: AppProps) => (
  <div>
    <h3>
      <a href="./">{moment().format("MMMM DD, YYYY")}</a>
    </h3>
    <h4 className="soon">
      <span>Soon: </span>
      {createUpcoming(dates)}
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
                  {`${formattedAge.replace(
                    /[^\d]+/,
                    ""
                  )} ${name.toUpperCase()}`}
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
