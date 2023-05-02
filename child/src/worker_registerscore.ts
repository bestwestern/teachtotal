export function registerScore(data: any) {
  const { oldScores, pid, eid, bonus, correct, oldDailyScores } = data;
  let newScores = { ...oldScores };
  let newDailyScores = { ...oldDailyScores };
  if (!newScores[pid]) newScores[pid] = {};
  if (!newDailyScores[pid]) newDailyScores[pid] = 0;
  if (correct) newDailyScores[pid] += 5 + bonus;
  let currentExerciseScore = newScores[pid][eid] || {
    n: 0,
    s: 0,
  };
  currentExerciseScore.n++;
  if (correct) currentExerciseScore.s++;
  newScores[pid][eid] = currentExerciseScore;
  return [newScores, newDailyScores];
}
