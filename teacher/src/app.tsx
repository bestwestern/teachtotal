import { CreateSubject } from "./createsubject";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "preact/hooks";
import { Subject } from "./subject";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.VITE_SUPABASEURL,
  import.meta.env.VITE_SUPABASEKEY
);
const now = new Date().getTime();
let sampleData = [
  { name: "Søren", start: -3, t: 3, mast: 0.87 },
  { name: "Anders", start: -23, t: 6, mast: 0.6 },
  { name: "Denise", start: -2, t: 7, mast: 0.3 },
  { name: "Helle", start: -255, t: 7, mast: 0.5 },
  { name: "Claus", start: -255, t: 7, mast: 0.5 },
  { name: "Esben", start: -3, t: 7, mast: 0.8 },
  { name: "Kurt", start: -23, t: 6, mast: 0.6 },
  { name: "Dennis", start: -2, t: 6, mast: 0.3 },
  { name: "Rune", start: -255, t: 5, mast: 0.5 },
  { name: "Ellen", start: -3, t: 7, mast: 0.94 },
  { name: "Emma", start: -23, t: 7, mast: 0.6 },
  { name: "Sanne", start: -2, t: 6, mast: 0.3 },
].map(({ name, mast, start, t }) => {
  let responses = [];
  let responseTime = now + start * 1000;
  const ms = 1500 + Math.random() * 1000 * t;
  while (responseTime > now - 600000) {
    responses.push({
      score: mast > Math.random() ? 1 : 0,
      time: responseTime,
      ms,
    });
    if (Math.random() > 0.9) responseTime -= 12000;
    responseTime = responseTime - ms;
  }
  return { name, responses };
});
export function App() {
  const [route, setRoute] = useState(location.pathname.substring(1).split("/"));
  const [subjects, setSubjects] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [responses, setResponses] = useState([]);
  const [timer, setTimer] = useState(new Date().getTime());
  const [subjectExercises, setSubjectExercises] = useState([]);
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setResponses(sampleData);
    }, 500);
    setInterval(() => {
      sampleData[0].responses.unshift({ score: 1, time: new Date().getTime() });
      Math.random() > 0.3 &&
        sampleData[2].responses.unshift({
          score: Math.random() > 0.4 ? 1 : 0,
          time: new Date().getTime(),
        });
      setResponses(sampleData);
    }, 3000);
    supabase
      .from("subjects")
      .select("*")
      .then((subjectResponse) => {
        if (subjectResponse.error) alert("Kan ikke forbinde til server");
        setSubjects(subjectResponse.data);
        setSubjectsFetched(true);
      });
    supabase
      .from("exercises")
      .select("*")
      .then((exerciseResponse) => {
        if (exerciseResponse.error) alert("Kan ikke forbinde til server");
        setExercises(exerciseResponse.data);
      });
    supabase
      .from("subjectexercises")
      .select("*")
      .then((subjectExerciseResponse) => {
        if (subjectExerciseResponse.error)
          alert("Kan ikke forbinde til server");
        setSubjectExercises(subjectExerciseResponse.data);
      });

    window.addEventListener(
      "popstate",
      (event: Event) =>
        // ww.postMessage({
        //@ts-ignore
        setRoute(event.target?.location?.pathname.substr(1).split("/")),
      // }),
      false
    );
    const tInt = setInterval(() => {
      setTimer(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(tInt);
    };
  }, []);
  const primaryRoute = route[0];
  const linkClick = (e: MouseEvent) => {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    e.preventDefault();
    const href = e.target.href;
    const host = e.target.host;
    const i = href.indexOf(host);
    const url = href.substring(i + host.length);
    setRoute(url.substr(1).split("/"));
    history.pushState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return false;
  };
  if (primaryRoute === "create") return <CreateSubject supabase={supabase} />;
  if (primaryRoute === "subject") {
    const subjectId = Number(route[1]);
    const chosenSubject = subjects.find((s) => s.id === subjectId);
    const chosenSubjectExercises = subjectExercises
      .filter((se) => se.subjectid === subjectId)
      .map((se) => ({
        ...se,
        ex: exercises.find((ex) => ex.id === se.exerciseid),
      }));
    return subjectsFetched ? (
      <Subject
        subject={chosenSubject}
        subjectResponses={responses} //brug kun for subject
        exercises={chosenSubjectExercises}
        timer={timer}
      ></Subject>
    ) : (
      <i>indlæser</i>
    );
  }
  return (
    <div class="m-4">
      <h2 class="mb-2 text-lg font-semibold text-gray-900">Emner:</h2>

      {subjectsFetched ? (
        <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
          {subjects.map((subject) => {
            const { name, id } = subject;
            return (
              <a
                key={id}
                onClick={linkClick}
                href={"/subject/" + id}
                class="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 "
              >
                {name}
              </a>
            );
          })}
          <a
            href="/create"
            class="block w-full px-4 py-2 rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 "
          >
            Opret nyt emne
          </a>
        </div>
      ) : (
        <i>Indlæser emner</i>
      )}

      {false && (
        <a
          href="/create"
          class="inline-flex items-center my-3 justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 "
        >
          Opret emne
        </a>
      )}
    </div>
  );
}
