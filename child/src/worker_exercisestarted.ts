export function exerciseStarted({ currentExercises, pid, eid, ms }) {
  currentExercises[pid].question.started = ms;
  return currentExercises;
}
