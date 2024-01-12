import { useState } from "preact/hooks";
import { pl } from "./pl";
console.log({ pl });
export function App() {
  const [programme, set_programme] = useState(pl[0].title);
  const [exercise, set_exercise] = useState(pl[0].exercises[0].title);
  const changeProgramme = (newProgramme) => {
    if (newProgramme!==programme){

      set_programme(newProgramme);
      set_exercise(
        pl.find((prog) => prog.title === newProgramme).exercises[0].title
        );
      }
  };
  const selected_programme = pl.find((prog) => prog.title === programme);
  const selected_exercise = selected_programme.exercises.find(
    (ex) => ex.title === exercise
  );
  console.log({ selected_exercise });
  return (
    <>
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        {pl.map(({ title }) => (
          <button
            type="button"
            onclick={(e) => changeProgramme(title)}
            class={
              programme === title
                ? "btn btn-primary"
                : "btn btn-outline-primary"
            }
          >
            {title}
          </button>
        ))}
      </div>
      <br />
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        {selected_programme.exercises.map(({ title }) =>title).sort().map(title=> (
          <button
            type="button"
            onclick={(e) => set_exercise(title)}
            class={
              exercise === title ? "btn btn-primary" : "btn btn-outline-primary"
            }
          >
            {title}
          </button>
        ))}
      </div>
      <br />
      <img
      id={selected_exercise.pictureId }
        src={selected_exercise.pictureId + ".webp"}
        class="img-fluid"
        alt="..."
      ></img>
    </>
  );
}
