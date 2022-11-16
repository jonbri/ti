import moment from "moment";
import { Item } from "./types";
import "./App.scss";

const now = new Date();
const nowMonth = now.getMonth() + 1;
const nowDate = now.getDate();

export interface AppProps {
  dates: Item[];
  upcoming: string;
}
const App = ({ dates, upcoming }: AppProps) => (
  <div>
    <h3>
      <a href="./">{moment().format("MMMM DD, YYYY")}</a>
    </h3>
    <h4 className="soon">{upcoming}</h4>
    <table>
      <tbody>
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
            else if (hide) rowColor = "hide";
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
