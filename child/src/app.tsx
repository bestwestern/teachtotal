import { useState, useEffect } from "preact/hooks";
import { dataProgrammes } from "./programmelist";
import { init } from "./supabase";
import Programme from "./programme";
import Home from "./home";
import Connect from "./connect";
import { get, set } from "idb-keyval";
import { createDateStr } from "./util";
import { Cache } from "./Cache";
import { sendCurrentExercise } from "./supabase";
let urlToProgrammeIndex: { [url: string]: number } = {};
const programmeList: Array<ProgrammeObject> = dataProgrammes.map(
  (pr, index) => {
    const url = pr.url || pr.title.toLowerCase();
    urlToProgrammeIndex[url] = index;
    return { ...pr, url };
  }
);
let dayN = -1;
export function App() {
  const [route, setRoute] = useState(location.pathname.substring(1).split("/"));
  const [dailyScore, setDailyScore] = useState({});
  const [targets, setTargets] = useState({});
  //const [dayN, setDayN] = useState(0);
  const [currentExercises, setCurrentExercises] = useState<{
    [pid: number]: { question: ExerciseObject; answers: Array<ExerciseObject> };
  }>({});
  useEffect(() => {
    if (urlToProgrammeIndex[route[0]] === undefined) sendCurrentExercise(false);
  }, [route]);
  useEffect(() => {
    var ww = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    ww.onmessage = (ev) => {
      Object.keys(ev.data).forEach((prop) => {
        switch (prop) {
          case "currentExercises":
            setCurrentExercises(ev.data[prop]);
            break;
          case "dailyScores":
            setDailyScore(ev.data[prop]);
            break;
          default:
            console.log("mangler fct til " + prop);
        }
      });
    };
    // ww.postMessage({
    //   routeChange: location.pathname.substring(1).split("/"),
    // });
    window.addEventListener(
      "popstate",
      (event: Event) =>
        // ww.postMessage({
        //@ts-ignore
        setRoute(event.target?.location?.pathname.substr(1).split("/")),
      // }),
      false
    );
    window.ww = ww;
    //get("targets").then((val) => setTargets(val || {}));
    document.title = import.meta.env.VITE_DOCUMENT_TITLE;
    get("dayCount").then((val) => {
      const todayString = createDateStr();
      let n = 0;
      if (val) {
        if (val.todayString === todayString) n = val.count;
        else {
          n = val.count + 1;
          set("dayCount", { todayString, count: n });
        }
      } else {
        n = 1;
        set("dayCount", { todayString, count: n });
      }
      dayN = n;
    });
    init((val) => {
      setTargets((prevTargets) => {
        let newTargets = { ...prevTargets };
        for (var prop in val) {
          const { everynday, startnday, target } = val[prop];
          if (target) {
            if (everynday > 1) {
              let currentDayN = dayN % everynday;
              if (currentDayN === 0) currentDayN = everynday;
              if (currentDayN == startnday)
                newTargets = { ...newTargets, [prop]: target };
              else delete newTargets[prop];
            } else newTargets = { ...newTargets, [prop]: target };
          } else {
            console.log("aldrig her?!");
            delete newTargets[prop];
          }
        }
        return newTargets;
      });
    });
  }, []);
  const programmeIndex = urlToProgrammeIndex[route[0]];
  const programme = programmeIndex > -1 ? programmeList[programmeIndex] : false;
  return (
    <>
      <Cache
        currentQuestionAnswers={currentExercises}
        pictureIds={programmeList.map(({ pictureId }) => pictureId)}
      ></Cache>
      <div class="min-h-full min-w-full">
        {programme && (
          <Programme
            targets={targets}
            setRoute={setRoute}
            dailyScore={dailyScore}
            programme={programmeList[programmeIndex]}
            currentQuestionAnswers={currentExercises?.[programme.id]}
          ></Programme>
        )}
        {route[0] === "" && (
          <Home
            dailyScore={dailyScore}
            targets={targets}
            programmelist={programmeList}
            setRoute={setRoute}
            dailyScore={dailyScore}
          ></Home>
        )}
        {route[0] === "connect" && <Connect setRoute={setRoute}></Connect>}
      </div>
    </>
  );
}
