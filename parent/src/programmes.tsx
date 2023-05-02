import { signal } from "@preact/signals";
import { h } from "preact";
import Navbar from "./navbar";
interface ProgrammeProps {
  success: boolean;
  pupilExerciseSummary: any;
  route: any;
}
const graphHeight = 40;
const numberOfBars = 15;
const expandedProgrammes = signal({});
const expandedProgrammeExercises = signal({});
const masterPercentage = 0.7;
const Programmes = ({
  route,
  exerciseDict,
  responseMap,
  targets,
  pupilExerciseSummary,
}: ProgrammeProps) => {
  const setTarget = ({ pid, everynday, startnday, target }) => {
    window.ww.postMessage({
      fct: "setTarget",
      pid,
      target,
      everynday,
      startnday,
    });
  };
  const expandExerciseClick = (pid, eid, currentValue) => {};
  const deviceid = Object.keys(targets || { dummy: 1 })[0];
  const pupilId = Object.keys(pupilExerciseSummary.value)[0];
  //https://flowbite.com/docs/components/tables/
  return (
    <>
      <h2 class="text-2xl text-cyan-900 font-bold text-center">
        {Object.entries(exerciseDict).length +
          " " +
          import.meta.env.VITE_MENUPROGRAMMES}
      </h2>
      <div class="shadow-md rounded-lg mb-14 grid place-items-center">
        <table class="content-start  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
          <caption class="px-5 py-2 md:py-5 text-lg font-semibold text-left text-gray-900 bg-white ">
            <p class="mt-1 text-sm font-normal text-gray-500 ">
              {import.meta.env.VITE_MASTEREXPLANATION}
            </p>
          </caption>
          <tbody>
            {Object.entries(exerciseDict).map(([pid, programmeExercises]) => {
              const programmeTarget = targets?.[deviceid]?.[pid];
              const target = programmeTarget?.target;
              const progExercises = Object.keys(exerciseDict[pid]).filter(
                (x) => !isNaN(x)
              );
              const everynday = programmeTarget?.everynday;
              const startnday = programmeTarget?.startnday;
              // console.log(pupilExerciseSummary.value);
              // console.log(responseMap?.value);
              const programmeSummary =
                pupilExerciseSummary.value[pupilId]?.[pid]; //DUR kun fordi der kun er 1 elev!
              const masteredN = Object.values(programmeSummary || {}).filter(
                (exerciseObj) => {
                  // console.log(exerciseObj);
                  const { sc, n } = exerciseObj;
                  return sc / n > masterPercentage;
                }
              ).length;
              // console.log({ masteredN });
              const programmeIsExpanded = expandedProgrammes.value[pid];
              return (
                <>
                  <tr
                    class={
                      "bg-white " + (programmeIsExpanded ? "" : "border-b")
                    }
                  >
                    <td class="w-24 py-2 md:w-32">
                      <img
                        src={"/imgs/" + exerciseDict[pid].pictureId + ".jpeg"}
                      />
                    </td>
                    <td
                      scope="row"
                      class="py-2 pl-2  text-gray-900 whitespace-nowrap "
                    >
                      <span class="font-medium">{exerciseDict[pid].title}</span>
                      <br />
                      <span>
                        {progExercises.length +
                          " " +
                          import.meta.env.VITE_OPGAVER}
                      </span>
                      <br />
                      <span>
                        {masteredN + " " + import.meta.env.VITE_MASTERED}
                      </span>
                      <br />
                      <button class="flex">
                        <span
                          class="underline flex"
                          onClick={(e) =>
                            (expandedProgrammes.value = {
                              ...expandedProgrammes.value,
                              [pid]: !programmeIsExpanded,
                            })
                          }
                        >
                          <img
                            class="w-2 transform flex mr-2"
                            style={{
                              transition: "transform 250ms ease-out",
                              "-ms-transform": programmeIsExpanded
                                ? "rotate(0)"
                                : "rotate(-180deg)",
                              transform: programmeIsExpanded
                                ? "rotate(-180deg)"
                                : "rotate(0)",
                            }}
                            src="./down.svg"
                          />
                          {(programmeIsExpanded
                            ? import.meta.env.VITE_HIDE
                            : import.meta.env.VITE_SHOW) +
                            " " +
                            import.meta.env.VITE_OPGAVER}
                        </span>
                      </button>
                    </td>
                    <td class="py-2 px-2">
                      <select
                        onChange={(e) =>
                          setTarget({
                            pid,
                            target: Number(e.target.value),
                            everynday,
                            startnday,
                          })
                        }
                        id="small"
                        class="mb-1 w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                      >
                        {programmeTarget ? (
                          <option value={0}>0</option>
                        ) : (
                          <option selected>
                            {import.meta.env.VITE_CONNECTION_SUCCESS_GOTOTARGET}
                          </option>
                        )}
                        {[10, 20, 30, 40, 50, 60, 80, 100, 150, 200].map(
                          (x, index) => (
                            <option selected={target == x} value={x}>
                              {x + " points"}
                            </option>
                          )
                        )}
                      </select>
                      {programmeTarget && (
                        <>
                          <br />
                          <select
                            onChange={(e) =>
                              setTarget({
                                pid,
                                target,
                                everynday: Number(e.target.value),
                                startnday: 1,
                              })
                            }
                            id="small"
                            class=" w-full mb-1 p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => (
                              <option selected={everynday == x} value={x}>
                                {x === 1
                                  ? import.meta.env.VITE_EVERY +
                                    " " +
                                    import.meta.env.VITE_TIME
                                  : import.meta.env.VITE_EVERY +
                                    " " +
                                    x +
                                    ". " +
                                    import.meta.env.VITE_TIME}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                      {everynday > 1 && (
                        <>
                          <br />
                          <select
                            onChange={(e) =>
                              setTarget({
                                pid,
                                target,
                                everynday,
                                startnday: Number(e.target.value),
                              })
                            }
                            id="small"
                            class=" w-full mb-1 p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9]
                              .filter((x) => x <= everynday)
                              .map((x) => (
                                <option selected={startnday == x} value={x}>
                                  {import.meta.env.VITE_STARTDAY + " " + x}
                                </option>
                              ))}
                          </select>
                        </>
                      )}
                    </td>
                  </tr>
                  {programmeIsExpanded &&
                    progExercises.map((el, index) => {
                      const ex = programmeExercises[el];
                      const eid = ex.id;
                      const inf =
                        pupilExerciseSummary.value[pupilId]?.[Number(pid)]?.[
                          eid
                        ];
                      const exerciseIsExpanded =
                        expandedProgrammeExercises.value[pid + "x" + eid];
                      let title = ex.title;
                      let responses = [];
                      let txt = "";
                      if (inf)
                        for (
                          var i = Math.max(inf.ts.length - numberOfBars, 0);
                          i < inf.ts.length;
                          i++
                        ) {
                          responses.push(responseMap.get(inf.ts[i] + pupilId));
                        }

                      const bg = index % 2 ? "bg-white" : "bg-gray-50";
                      if (inf)
                        txt +=
                          " " +
                          Math.round((inf.sc / inf.n) * 100) +
                          " % af " +
                          inf.n;
                      return (
                        <>
                          <tr
                            class={
                              bg +
                              (index === progExercises.length - 1 ||
                              !exerciseIsExpanded
                                ? " border-b"
                                : "")
                            }
                          >
                            <td colSpan={3}>
                              <div
                                class="flex"
                                style={{ height: graphHeight + "px" }}
                              >
                                <div class="flex my-auto w-1/2">
                                  <b class="flex">{title}</b>
                                  <span class="flex ml-2">{txt}</span>
                                  {inf && (
                                    <button class="flex ml-2">
                                      <span
                                        class="underline flex"
                                        onClick={(e) =>
                                          (expandedProgrammeExercises.value = {
                                            ...expandedProgrammeExercises.value,
                                            [pid + "x" + eid]:
                                              !exerciseIsExpanded,
                                          })
                                        }
                                      >
                                        <img
                                          class="w-2 transform flex mr-2"
                                          style={{
                                            transition:
                                              "transform 250ms ease-out",
                                            "-ms-transform": exerciseIsExpanded
                                              ? "rotate(0)"
                                              : "rotate(-180deg)",
                                            transform: exerciseIsExpanded
                                              ? "rotate(-180deg)"
                                              : "rotate(0)",
                                          }}
                                          src="./down.svg"
                                        />
                                        {(exerciseIsExpanded
                                          ? import.meta.env.VITE_HIDE
                                          : import.meta.env.VITE_SHOW) +
                                          " " +
                                          import.meta.env.VITE_SVAR}
                                      </span>
                                    </button>
                                  )}
                                </div>
                                {responses.map((el, index) => {
                                  const { ms, sc } = el;
                                  const className = sc
                                    ? "bg-green-600"
                                    : "bg-red-600";
                                  const heightPercentage = Math.min(
                                    100,
                                    ms / 100
                                  );
                                  const height =
                                    (graphHeight * heightPercentage) / 100;
                                  return (
                                    <div
                                      class={"h-full" + (index ? "" : " ml-3")}
                                    >
                                      <div
                                        class={bg + " rounded-sm"}
                                        style={{
                                          width: "10px",
                                          height: graphHeight - height + "px",
                                        }}
                                      ></div>
                                      <div
                                        class={className + " rounded-sm"}
                                        style={{
                                          width: "10px",
                                          height: height + "px",
                                        }}
                                      ></div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>

                          {exerciseIsExpanded &&
                            inf.ts.map((x, exerciseIndex) => {
                              const response = responseMap.get(x + pupilId);
                              const { dateString, timeint, sc, ms } = response;
                              console.log(ms, sc);
                              return (
                                <tr
                                  class={
                                    bg +
                                    (exerciseIndex === inf.ts.length - 1
                                      ? " border-b"
                                      : "")
                                  }
                                >
                                  <td colSpan={3}>
                                    <div
                                      class="flex"
                                      style={{ height: "18px" }}
                                    >
                                      <div class="flex my-auto w-1/2">
                                        <span>
                                          {dateString +
                                            ": " +
                                            (ms
                                              ? Math.round(ms / 1000) + " sek."
                                              : "-")}
                                        </span>
                                      </div>
                                      <div class="flex my-auto w-1/2">
                                        <div
                                          class={
                                            "w-full bg-gray-200 rounded-full h-2.5 flex" +
                                            (ms ? "" : " justify-center")
                                          }
                                        >
                                          <div
                                            class={
                                              sc
                                                ? "bg-green-600 h-2.5 rounded-full "
                                                : "bg-red-600 h-2.5 rounded-full "
                                            }
                                            style={
                                              "width: " +
                                              (ms
                                                ? Math.min(100, ms / 100)
                                                : "20") +
                                              "%"
                                            }
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      );
                    })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <Navbar route={route}></Navbar>
    </>
  );
};

export default Programmes;
