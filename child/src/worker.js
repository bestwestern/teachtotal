import { get, set, clear } from "idb-keyval";
import { add, createDateStr } from "./util";
import { suggestExercise, suggestExercises } from "./worker_suggestexercise";
import { registerScore } from "./worker_registerscore";
import { exerciseStarted } from "./worker_exercisestarted";
import { pl } from "./pl";
let pidToFixedPoints = {};
pl.filter((x) => x.fixedPoint).forEach(
  ({ id, fixedPoint }) => (pidToFixedPoints[id] = fixedPoint)
); //ingen nedtælling af points
console.log(pl);
var scores, currentExercises, dailyScores;
Promise.all([get("scores"), get("currentExercises"), get("dailyScores")]).then(
  ([scoresRead, currentExercisesRead, dailyScoresRead]) => {
    const todayString = createDateStr();
    dailyScores =
      dailyScoresRead && dailyScoresRead.date == todayString
        ? dailyScoresRead
        : { date: todayString };
    scores = scoresRead || {};
    currentExercises = suggestExercises(scores, pl, currentExercisesRead || {});
    for (var pid in pidToFixedPoints)
      currentExercises[pid].fixedPoint = pidToFixedPoints[pid];
    postMessage({ currentExercises, dailyScores });
    set("currentExercises", currentExercises);
  }
);
onmessage = (ev) => {
  const { fct, ...data } = ev.data;
  switch (fct) {
    case "registerScore":
      [scores, dailyScores] = registerScore({
        ...data,
        oldScores: scores,
        oldDailyScores: dailyScores,
      });
      set("dailyScores", dailyScores);
      set("scores", scores);
      break;
    case "exerciseStarted":
      currentExercises = exerciseStarted({ currentExercises, ...data });
      postMessage({ currentExercises, dailyScores });

      set("currentExercises", currentExercises);
      break;
    case "suggestExercise":
      currentExercises = suggestExercise(
        scores,
        pl,
        currentExercises,
        data.pid,
        data.force
      );
      for (var pid in pidToFixedPoints)
        currentExercises[pid].fixedPoint = pidToFixedPoints[pid];
      postMessage({ currentExercises, dailyScores });
      set("currentExercises", currentExercises);
      break;
    default:
      console.log(fct + " missing");
      break;
  }
};
