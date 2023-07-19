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
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [targets, setTargets] = useState({});
  const [masterN, setMasterN] = useState({});
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
        const data = ev.data[prop];
        switch (prop) {
          case "currentExercises":
            setCurrentExercises(data);
            break;
          case "dailyScores":
            setDailyScore(data);
            break;
          case "masterN":
            setMasterN((prev) => ({ ...prev, ...data }));
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
    init(setTeacherSubjects, (val) => {
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
  let programmeIndex = urlToProgrammeIndex[route[0]];
  let programme = programmeIndex > -1 ? programmeList[programmeIndex] : false;
  if (!programme && route[0].length) {
    const teacherSubject = teacherSubjects.find(
      (sub) => sub.name?.toLowerCase() === route[0]
    );
    // if (teacherSubject?.exercises) {
    //   const ts = teacherSubject;
    //   console.log({ ts });
    //   programme = {
    //     id: -ts.id,
    //     title: ts.name,
    //   };
    //   currentExercises[-ts.id] = {
    //     question: {
    //       title: ts.exercises[0].answer,
    //       pictureId: "jkl",
    //       answer: ts.exercises[0].answer,
    //       pictureURL:
    //         import.meta.env.VITE_SUPABASEURL +
    //         "/storage/v1/object/public/images/" +
    //         ts.exercises[0].id +
    //         ".webp",
    //     },
    //     answers: [
    //       {
    //         answer: ts.exercises[0].answer,
    //         text: ts.exercises[0].answer,
    //         title: "12",
    //         id: 3,
    //         pictureId: 3,
    //       },
    //       {
    //         title: "10",
    //         text: "10",
    //         answer: "10",
    //         id: 13,
    //         pictureId: 13,
    //       },
    //       {
    //         title: "halv 8",
    //         text: "halv 8",
    //         answer: "halv 8",
    //         id: 22,
    //         pictureId: 22,
    //       },
    //       {
    //         title: "kvart over 5",
    //         text: "kvart over 5",
    //         answer: "kvart over 5",
    //         id: 29,
    //         pictureId: 31,
    //       },
    //     ],
    //   };
    // }
  }
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
            masterN={masterN}
            setRoute={setRoute}
            dailyScore={dailyScore}
            programme={programme}
            currentQuestionAnswers={currentExercises?.[programme.id]}
          ></Programme>
        )}
        {route[0] === "" && (
          <Home
            dailyScore={dailyScore}
            teacherSubjects={teacherSubjects}
            masterN={masterN}
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
