import { CreateSubject } from "./createsubject";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "preact/hooks";
import { Subject } from "./subject";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  import.meta.env.VITE_SUPABASEURL,
  import.meta.env.VITE_SUPABASEKEY
);
export function App() {
  const [route, setRoute] = useState(location.pathname.substring(1).split("/"));
  const [subjects, setSubjects] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [subjectExercises, setSubjectExercises] = useState([]);
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  useEffect(() => {
    supabase
      .from("subjects")
      .select("*")
      .then((subjectResponse) => {
        console.log(subjectResponse);
        if (subjectResponse.error) alert("Kan ikke forbinde til server");
        setSubjects(subjectResponse.data);
        setSubjectsFetched(true);
      });
    supabase
      .from("exercises")
      .select("*")
      .then((exerciseResponse) => {
        console.log(exerciseResponse);
        if (exerciseResponse.error) alert("Kan ikke forbinde til server");
        setExercises(exerciseResponse.data);
      });
    supabase
      .from("subjectexercises")
      .select("*")
      .then((subjectExerciseResponse) => {
        console.log(subjectExerciseResponse);
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
  }, []);
  console.log(route);
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
        exercises={chosenSubjectExercises}
      ></Subject>
    ) : (
      <i>indlæser</i>
    );
  }
  return (
    <div class="m-4">
      <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Emner:
      </h2>

      {subjectsFetched ? (
        <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          {subjects.map((subject) => {
            console.log(subject);
            const { name, id } = subject;
            return (
              <a
                key={id}
                onClick={linkClick}
                href={"/subject/" + id}
                class="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
              >
                {name}
              </a>
            );
          })}
          <a
            href="/create"
            class="block w-full px-4 py-2 rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
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
