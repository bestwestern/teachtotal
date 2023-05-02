const answerCount = 4; //svarmuligheder
const successRatio = 0.5;
var testQId = 790;
const badN = 4; //mindste antal samtidige ikke-mestrede øvelser
function suggestExercise(
  scores: any,
  pl: Array<any>,
  currentlySuggestedExercises: {
    [pid: number]: { question: ExerciseObject; answers: Array<ExerciseObject> };
  },
  progId: number,
  force: boolean
) {
  let newSuggestedExercises = { ...currentlySuggestedExercises };
  const {
    id: pid,
    exerciseDict,
    exercises,
    showInOrder = 1,
    usePictureAsAnswer,
  } = pl.find((x) => x.id === progId);
  let question;
  if (!force && currentlySuggestedExercises[pid]) {
    const { started } = currentlySuggestedExercises[pid].question;
    if (started) {
      const now = new Date().getTime();
      if (now - started < 10000) return newSuggestedExercises;
    }
    //tjek dato og om øvelsen stadig findes
  }
  if (scores[pid]) {
    const currentEid = currentlySuggestedExercises?.[pid]?.question.id;
    const currentProgramme = pl.find((x) => x.id === pid);
    const { goodExercises, badExercises, newExercises } =
      analyseProgrammeScores(currentProgramme, scores);
    if (badExercises.length < badN) {
      // console.log("ikke nok dårlige");
      if (newExercises.length) {
        // console.log("returner ny");
        if (showInOrder) {
          if (newExercises.length === 1)
            question = exercises.find((x) => x.id == newExercises[0]);
          else {
            const newIndex = Math.floor(Math.random() * 2);
            question = exercises.find((x) => x.id == newExercises[newIndex]);
          }
        } else {
          const newIndex = Math.floor(Math.random() * newExercises.length);
          question = exercises.find((x) => x.id == newExercises[newIndex]);
        }
      } else {
        // console.log("ingen nye");
        //ingen nye exercises
        if (badExercises.length === 0) {
          // console.log("ingen dårlige - returner tilfældig good"); //bør tage højde for scores
          question = randomFrom(goodExercises, exercises, currentEid);
          //returner tilfældig god
        } else if (badExercises.length === 1) {
          // console.log("kun 1 dårlig");
          if (badExercises[0].id === currentEid) {
            // console.log("dårlige lige vist - vis vilkårlig god");
            question = randomFrom(goodExercises, exercises, currentEid);
          } else {
            // console.log("vis den dårlige");
            question = exercises.find((x) => x.id === badExercises[0].id);
          }
        } else {
          // console.log("HER! returner dårlig", { badExercises, goodExercises });
          question = randomFrom(badExercises, exercises, currentEid);
        }
      }
    } else {
      // console.log("dårlige nok - returner en af dem");
      question = randomFrom(badExercises, exercises, currentEid);
    }

    //
  } else {
    question = exercises[0];
  }
  //TEST AF NYE OPG:
  if (!import.meta.env.PROD && pid == 8) {
    question = exercises.find((x) => x.id == testQId);
    testQId++;
  }
  delete question.started;
  // console.log({ question });
  let answers = [question];
  let failSafe = 0;
  while (answers.length < answerCount && failSafe++ < 100) {
    const newAnswerSuggestion =
      exercises[Math.floor(Math.random() * exercises.length)];
    if (
      answers.findIndex((e) =>
        usePictureAsAnswer
          ? e.pictureId === newAnswerSuggestion.pictureId
          : e.id === newAnswerSuggestion.id ||
            e.answer === newAnswerSuggestion.answer
      ) === -1
    )
      answers.push(newAnswerSuggestion);
  }
  newSuggestedExercises[pid] = {
    question,
    answers: shuffle(answers),
  };
  return newSuggestedExercises;
}
function suggestExercises(
  scores: any,
  pl: Array<any>,
  currentlySuggestedExercises: {
    [pid: number]: { question: ExerciseObject; answers: Array<ExerciseObject> };
  }
) {
  let newSuggestedExercises = { ...currentlySuggestedExercises };
  pl.forEach(({ id: pid, exerciseDict, exercises, usePictureAsAnswer }) => {
    //tjek localstorage
    newSuggestedExercises = suggestExercise(
      scores,
      pl,
      newSuggestedExercises,
      pid
    );
  });
  return newSuggestedExercises;
}

function randomFrom(arr: Array<{ id: number }>, exercises, currentEid: number) {
  let rndIndex = Math.floor(Math.random() * arr.length);
  let fallBack = 0;
  while (arr[rndIndex].id === currentEid && fallBack++ < 100) {
    rndIndex = Math.floor(Math.random() * arr.length);
  }
  return exercises.find((x) => x.id === arr[rndIndex].id);
}
function analyseProgrammeScores(currentProgramme, scores) {
  const pid = currentProgramme.id;
  let goodExercises = [];
  let badExercises = [];
  let newExercises = [];
  currentProgramme.exercises.forEach(({ id }) => {
    if (scores[pid] && scores[pid][id]) {
      const sc = scores[pid][id].s / scores[pid][id].n;
      if (sc > successRatio)
        goodExercises.push({
          id,
          sc,
          n: scores[pid][id].n,
          c: scores[pid][id].c || 0,
        });
      else
        badExercises.push({
          id,
          sc,
          n: scores[pid][id].n,
          c: scores[pid][id].c || 0,
        });
    } else newExercises.push(id);
  });
  return { goodExercises, badExercises, newExercises };
}

const shuffle = (array: Array<any>) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
export { suggestExercise, suggestExercises };
