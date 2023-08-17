import { h } from "preact";
import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { getClockFromMS } from "./util";
import Navbar from "./navbar";
const time = signal(new Date());
const showingDates = signal({});
const date = new Date();
const m = date.getMonth();
const d = date.getDate();
const yyyy = date.getFullYear();
const dateStringToDisplayString = (dtst) => {
  //date string to
  const parts = dtst.split("-");
  let returnString = Number(parts[2]) + "/" + Number(parts[1]);

  if (parts[0] != yyyy) returnString += " " + parts[0];
  return returnString;
};
function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(0);
  let minutes = (ms / (1000 * 60)).toFixed(0);
  let hours = (ms / (1000 * 60 * 60)).toFixed(0);
  if (seconds < 60) return seconds + "s";
  else if (minutes < 60) return minutes + "m";
  else if (hours < 24) return hours + "t";
}
interface HomeProps {
  deviceIds: { value: Array<any> };
}

const Home = (props: HomeProps) => {
  useEffect(() => {
    var timerID = setInterval(() => (time.value = new Date()), 20);
    return function cleanup() {
      clearInterval(timerID);
    };
  });
  const {
    responseArrays = [],
    deviceIds,
    exerciseDict = false,
    targets,
    route,
    current,
    pupilExerciseSummary,
  } = props;
  if (!Object.keys(exerciseDict).length) return null;
  return (
    <div class="mb-16">
      {responseArrays.map(({ date, responseArray, msTotal }, index) => {
        // const responseArray = Object.values(responseArrays).length
        //   ? Object.values(responseArrays)[0]
        //   : [];
        let visibleResponses: Array<any> = JSON.parse(
          JSON.stringify(responseArray || [])
        );
        if (!index && Object.keys(current).length) {
          const { start, pid, eid, deviceid } = current;
          const ms = Math.max(0, time.value - current.start);
          visibleResponses.unshift({ ms, eid, pid, deviceid });
          if (visibleResponses.length > 1 && pid === visibleResponses[1].pid) {
            visibleResponses[0].header = visibleResponses[1].header;
            delete visibleResponses[1].header;
          } else {
            visibleResponses[0].header = {
              eid,
              pid,
              start: getClockFromMS(start),
            };
          }
        }
        const expansionSet = showingDates.value[date];
        let isExpanded = expansionSet;
        if (index === 0 && expansionSet === undefined) isExpanded = true;
        return (
          <div class="mb-12" key={date}>
            <button
              class="flex "
              onClick={(e) =>
                (showingDates.value = {
                  ...showingDates.value,
                  [date]: !isExpanded,
                })
              }
            >
              <div class="flex mr-3 pb-2">
                {msTotal > 0 && (
                  <img
                    class="w-6 transform"
                    style={{
                      transition: "transform 250ms ease-out",
                      "-ms-transform": isExpanded
                        ? "rotate(0)"
                        : "rotate(-180deg)",
                      transform: isExpanded ? "rotate(-180deg)" : "rotate(0)",
                    }}
                    src="./down.svg"
                  />
                )}
              </div>
              <div class="flex">
                <h2 class="mb-2 text-2xl text-cyan-900 font-bold">
                  {dateStringToDisplayString(date) +
                    (msTotal === 0
                      ? import.meta.env.VITE_NORESPONSES
                      : " " + msToTime(msTotal))}{" "}
                </h2>
              </div>
            </button>
            {isExpanded &&
              visibleResponses.map(
                ({ ms, eid, pid, sc, header, deviceid }: Responses) => {
                  const secs = (Math.round(ms / 1000) || 1) + " sek";
                  return responseRow(
                    exerciseDict,
                    secs,
                    sc,
                    ms,
                    pid,
                    eid,
                    header,
                    deviceid,
                    pupilExerciseSummary.value,
                    targets
                  );
                }
              )}
            <Navbar route={route} />
          </div>
        );
      })}
    </div>
  );
};

export default Home;
const responseRow = (
  exerciseDict,
  secs,
  sc,
  ms,
  pid,
  eid,
  header,
  deviceid,
  summary,
  targets = {}
) => {
  const setTarget = ({ pid, target, everynday, startnday }) => {
    window.ww.postMessage({
      fct: "setTarget",
      pid,
      target,
      everynday,
      startnday,
    });
  };
  let className = sc
    ? "bg-green-600 h-2.5 rounded-full"
    : "bg-red-600 h-2.5 rounded-full";
  if (sc === undefined) className = "bg-yellow-600 h-2.5 rounded-full";
  const exSummary = summary?.[deviceid]?.[pid]?.[eid];
  const programmeTarget = targets?.[deviceid]?.[pid];
  const target = programmeTarget?.target;
  const everynday = programmeTarget?.everynday;
  const startnday = programmeTarget?.startnday;
  let masterText = "";
  if (exSummary && exSummary.n > 1) {
    masterText =
      "(" +
      Math.round((exSummary.sc / exSummary.n) * 100) +
      "% af " +
      exSummary.n +
      " )";
  }
  console.log({ exSummary });

  // " (start " +
  // header.start +
  // ") "
  return (
    <>
      {header && (
        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-lg pt-4">
              {header.start +
                ": " +
                exerciseDict[pid].title +
                " " +
                (header.dayscore || 0) +
                " points"}
            </span>
          </div>
          <div>
            <select
              onChange={(e) =>
                setTarget({
                  pid,
                  target: Number(e.target.value),
                  everynday,
                  startnday,
                })
              }
              id="small"
              class="mb-1 w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            >
              {programmeTarget ? (
                <option value={0}>0</option>
              ) : (
                <option selected>
                  {import.meta.env.VITE_CONNECTION_SUCCESS_GOTOTARGET}
                </option>
              )}
              {[10, 20, 30, 40, 50, 60, 80, 100, 150, 200].map((x, index) => (
                <option selected={target == x} value={x}>
                  {x + " points"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div class="mb-4">
        <div class="flex justify-between">
          <div>
            <span class="text-base font-medium text-blue-700 ">
              {exerciseDict[pid][eid].title}
            </span>
            <span class="ml-2">{masterText}</span>
          </div>
          <span class="text-sm font-medium text-blue-700 ">{secs}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 ">
          <div
            class={className}
            style={"width: " + Math.min(100, ms / 100) + "%"}
          ></div>
        </div>
      </div>
    </>
  );
};
