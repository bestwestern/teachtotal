import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
//import { signal } from "@preact/signals";
import Navbar from "./navbar";
import { registerResultInSupabase, sendCurrentExercise } from "./supabase";
import play from "./assets/play.svg";
interface ProgrammeProps {
  programme: ProgrammeObject;
  setRoute: (route: Array<string>) => void;
  currentQuestionAnswers: null | {
    question: ExerciseObject;
    answers: Array<ExerciseObject>;
    fixedPoint: number;
  };
  targets: { [pid: number]: number };
  dailyScore: {
    [pid: number]: number;
  };
}

const Programme = ({
  programme,
  currentQuestionAnswers,
  setRoute,
  targets,
  dailyScore,
}: ProgrammeProps) => {
  const fixedPoint = currentQuestionAnswers?.fixedPoint;
  const programmeTarget = targets?.[programme.id];
  const [previousQuestionInfo, setPreviousQuestionInfo] = useState({});
  const { usePictureAsAnswer, audioQuestion } = programme;
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [date, setDate] = useState(new Date());
  //Replaces componentDidMount and componentWillUnmount
  useEffect(() => {
    var timerID = setInterval(() => setDate(new Date()), 400);
    return function cleanup() {
      clearInterval(timerID);
    };
  });
  useEffect(() => {
    setDate(new Date());
    if (
      Object.keys(previousQuestionInfo).length === 0 &&
      currentQuestionAnswers &&
      !currentQuestionAnswers?.question?.started
    ) {
      if (!audioQuestion) {
        exerciseStarted(currentQuestionAnswers.question.id);
      }
    }
  }, [currentQuestionAnswers, previousQuestionInfo]);
  const exerciseStarted = (eid) => {
    const pid = programme.id;
    sendCurrentExercise(eid, pid);
    window.ww.postMessage({
      fct: "exerciseStarted",
      pid,
      eid,
      ms: new Date().getTime(),
    });
  };
  const [answers, setAnswers] = useState<Array<number>>([]);
  const currentQuestion = currentQuestionAnswers?.question;
  const hasLongAnswer = currentQuestionAnswers
    ? Math.max(
        ...currentQuestionAnswers.answers.map((ans) => ans.answer.length)
      ) > 15
    : false;
  const nextQuestionClick = () => {
    setAnswers([]);
    setPreviousQuestionInfo({});
    setAudioPlayed(false);
  };
  const playAudio = () => {
    window.soundFile.play();
    if (!currentQuestion.started)
      exerciseStarted(currentQuestionAnswers?.question.id);
    setAudioPlayed(true);
  };
  const answerClick = (id: number, correct: boolean, bonus: number) => {
    if (answers.includes(id)) return;
    const pid = programme.id;
    const sc = correct ? 1 : 0;
    const score = fixedPoint || (bonus + 5) * sc;
    if (!answers.length) {
      const started = currentQuestion.started;
      const eid = currentQuestion?.id;
      ww.postMessage({
        fct: "registerScore",
        eid,
        correct,
        pid,
        bonus,
      });
      const ms = new Date().getTime() - started;

      registerResultInSupabase({
        ms: ms > 20000 ? null : ms,
        eid,
        pid,
        dayscore: (dailyScore[programme.id] || 0) + score,
        timeint: started,
        sc,
      });
    }
    if (correct) {
      setPreviousQuestionInfo({
        text: currentQuestion.title,
        points: answers.length ? 0 : score,
        answer: currentQuestion.answer,
      }); //setquestion text også?
      ww.postMessage({ fct: "suggestExercise", pid, force: true });
    }
    setAnswers([...answers, id]);
  };
  const justShowText =
    !audioQuestion && !(!usePictureAsAnswer && currentQuestion?.pictureId);
  let timeUsed = 0;
  let bonus = 0;
  if (!answers.length) {
    timeUsed =
      currentQuestion?.started && date.getTime() - currentQuestion.started;
    const twoSecs = Math.floor(timeUsed / 2000);
    bonus = Math.min(5, Math.max(0, 5 - twoSecs));
    if (fixedPoint) bonus = fixedPoint - 5;
  }
  let navText = programme.title + ": " + (dailyScore[programme.id] || 0);
  if (programmeTarget)
    navText += ", " + import.meta.env.VITE_TARGET + ": " + programmeTarget;
  let pointsText =
    import.meta.env.VITE_GET +
    " " +
    ((timeUsed > 0 ? bonus : 0) + 5) +
    " points";
  if (answers.length) pointsText = "";
  if (previousQuestionInfo.points)
    pointsText =
      import.meta.env.VITE_YOUGOT +
      " " +
      previousQuestionInfo.points +
      " points";
  return (
    <>
      <Navbar
        txt={navText}
        route={[""]}
        showCheckMark={dailyScore[programme.id] >= programmeTarget}
        setRoute={setRoute}
        useConnectImage={false}
      ></Navbar>
      {(!audioQuestion || audioPlayed) &&
        (Object.keys(previousQuestionInfo).length === 0 ||
          previousQuestionInfo.text.length < 10) && (
          <span class="px-2 absolute">{pointsText}</span>
        )}
      {currentQuestionAnswers && (
        <>
          {Object.keys(previousQuestionInfo).length ? (
            <>
              {previousQuestionInfo.text.length < 10 ? (
                <p class="text-center text-6xl">{previousQuestionInfo.text}</p>
              ) : (
                <p class="text-center text-xl">{previousQuestionInfo.text}</p>
              )}
              <div class="flex justify-center items-center pt-10">
                <button
                  onClick={nextQuestionClick}
                  type="button"
                  class="py-2.5 px-12 mr-2 mb-2 text-2xl font-medium text-gray-900 shadow-lg bg-white rounded-full border border-gray-200 "
                >
                  {previousQuestionInfo.answer}&#10004;
                  {"    " + import.meta.env.VITE_NEXT}
                </button>
              </div>
            </>
          ) : (
            <>
              {audioQuestion && (
                <AudioButton
                  question={currentQuestion}
                  audioPlayed={audioPlayed}
                  playAudio={playAudio}
                ></AudioButton>
              )}
              {currentQuestion?.pictureId && !usePictureAsAnswer && (
                <div class="flex justify-center items-center">
                  <img
                    class="h-48 w-48 md:h-96 md:w-96"
                    src={"/imgs/" + currentQuestion.pictureId + ".webp"}
                  ></img>
                </div>
              )}

              {justShowText && (
                <p class={"text-center text-3xl md:text-6xl"}>
                  {currentQuestion.title}
                </p>
              )}
              <div
                class={
                  hasLongAnswer
                    ? "p-3 grid grid-cols-1 lg:grid-cols-2  gap-3"
                    : "p-3 grid grid-cols-2 lg:grid-cols-4  gap-3"
                }
              >
                {currentQuestionAnswers.answers.map((question) => {
                  const { pictureId, answer, id } = question;
                  if (audioQuestion && !audioPlayed) return null;
                  return (
                    <button
                      key={id}
                      onClick={() =>
                        answerClick(
                          id,
                          usePictureAsAnswer
                            ? currentQuestion?.pictureId === pictureId
                            : currentQuestion?.answer === answer,
                          bonus
                        )
                      }
                      disabled={answers.includes(id)}
                      class={
                        "rounded overflow-hidden shadow-xl border-solid border-2" +
                        (answers.includes(id) && " opacity-20")
                      }
                    >
                      {usePictureAsAnswer && pictureId ? (
                        <PictureExerciseAnswer
                          pictureId={pictureId}
                          answer={answer}
                          id={id}
                        ></PictureExerciseAnswer>
                      ) : (
                        <TextExerciseAnswer
                          className={
                            hasLongAnswer ? "px-4 py-6" : "px-12 py-16"
                          }
                          id={id}
                          answer={answer}
                        ></TextExerciseAnswer>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
interface AudioButtonProps {
  question: ExerciseObject;
  playAudio: any;
}
const AudioButton = ({
  question,
  playAudio,
  audioPlayed,
}: AudioButtonProps) => {
  useEffect(() => {
    //flyttes til cache komponent
    const audioSrc = question.audioFilename
      ? "mp3/" + question.audioFilename + ".mp3"
      : "https://ssl.gstatic.com/dictionary/static/sounds/oxford/" +
        question.title.toLowerCase() +
        "--_us_1.mp3";
    window.soundFile = new Audio(audioSrc);
  }, [question]);
  return (
    <div class="flex justify-center items-center" onclick={playAudio}>
      <button
        type="button"
        class="focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
      >
        <img class="w-8 h-8" src={play}></img>
      </button>
      <strong>{audioPlayed && question.title}</strong>
    </div>
  );
};
const TextExerciseAnswer = ({ id, answer, className }: ExerciseObject) => {
  return (
    <div class={className}>
      <div class="font-bold  text-center align-top text-3xl ">{answer}</div>
    </div>
  );
};
const PictureExerciseAnswer = ({ pictureId, answer, id }: ExerciseObject) => {
  return (
    <>
      <img class="w-full p-5" src={"/imgs/" + pictureId + ".webp"}></img>
      <div class="px-2 py-1">
        <div class="font-bold text-base text-center align-top sm:text-xl ">
          {answer}
        </div>
      </div>
    </>
  );
};
export default Programme;
