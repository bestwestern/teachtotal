import { useState, useEffect } from "preact/hooks";
const graphHeight = 40;
let samplePercentages = [];
let testDict = {};
for (var i = 0; i < 100; i++) {
  const master = Math.floor(Math.random() * 50) + 30;
  const fail = Math.random() > 0.35 ? 100 - master : (100 - master) / 2;
  samplePercentages[i] = [master, fail];
}
export function Subject({ subject, exercises, subjectResponses, timer }) {
  const [rowData, setRowData] = useState([]);
  const [firstrowData, setFirstRowData] = useState([]);
  const [createTime, setCreateTime] = useState(-1);
  const [expandedExercises, setExpandedExercises] = useState({});
  useEffect(() => {
    if (
      timer - createTime > 9100 ||
      (subjectResponses.length && !rowData.length)
    )
      createRowData();
    else {
      createFirstRowData();
    }
  }, [subjectResponses, timer]);
  const createRowData = () => {
    setCreateTime(timer);
    const newRowData = subjectResponses.map((el, nameIndex) => {
      const { name, responses } = el;
      let resArr = new Array(60).fill(null);
      let sc = 0;
      let attempts = 0;
      for (var resIndex = 0; resIndex < responses.length; resIndex++) {
        const { score, time } = responses[resIndex];
        const diff = timer - time;
        const diffIndex = Math.floor(diff / 10000);
        if (diffIndex < 61) {
          sc += score;
          attempts++;
          resArr[diffIndex] = [...(resArr[diffIndex] || []), score];
        }
      }
      return { responses: resArr, name, attempts, sc };
    });
    setFirstRowData([]);
    setRowData(newRowData);
  };
  const createFirstRowData = () => {
    const newFirstRowData = subjectResponses.map((el, nameIndex) => {
      let sc = 0;
      let attempts = 0;
      const { name, responses } = el;
      let resArr = new Array(1).fill(null);
      const firstResponses = responses.filter((x) => x.time > createTime);
      for (var resIndex = 0; resIndex < firstResponses.length; resIndex++) {
        const { score, time } = firstResponses[resIndex];
        resArr[0] = [...(resArr[0] || []), score];
        sc += score;
        attempts++;
      }
      return { responses: resArr, name, attempts, sc };
    });
    setFirstRowData(newFirstRowData);
  };
  const { name } = subject;

  console.log({ testDict });
  return (
    <div class="m-4">
      <h2 class="mb-2 text-2xl font-semibold text-gray-900">{name}</h2>
      <h2 class="mb-2 text-md font-semibold text-gray-900">
        Sidste 10 minutters svar {timer}
      </h2>
      <table class="content-start  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <tbody>
          {rowData.map((el, nameIndex) => {
            let firstResponses = [new Array(5)];
            let firstsc = 0;
            let firstAttempts = 0;
            if (firstrowData.length) {
              firstResponses = firstrowData[nameIndex].responses;
              firstsc = firstrowData[nameIndex].sc;
              firstAttempts = firstrowData[nameIndex].attempts;
            }
            const { name, responses, sc, attempts } = el;
            const attemptsTotal = firstAttempts + attempts;
            const scTotal = firstsc + sc;
            // console.log({
            //   attemptsTotal,
            //   scTotal,
            //   per: scTotal / attemptsTotal,
            // });
            return (
              <tr class="bg-gray-100 border-b" style={{ height: "30px" }}>
                <td>
                  <div class="flex">
                    <div class="flex my-auto w-2/5">
                      <b class="flex underline hover:cursor-pointer">{name}</b>
                      <span class="flex ml-2">
                        {" "}
                        {((scTotal * 100) / attemptsTotal).toFixed(0) +
                          "% ud af " +
                          attemptsTotal}
                      </span>
                    </div>
                    {[...firstResponses, ...responses].map((arr) => {
                      return (
                        <>
                          <div class="h-full">
                            {[0, 1, 2, 3, 4].map((xxx, arrIndex) => {
                              let className = "bg-gray-100";
                              const val = arr ? arr[4 - arrIndex] : undefined;
                              if (val !== undefined) {
                                className = val ? "bg-green-600" : "bg-red-600";
                              }
                              return (
                                <>
                                  <div
                                    class="bg-gray-100 rounded-sm"
                                    style={{ width: "6px", height: "3px" }}
                                  ></div>
                                  <div
                                    class={className + " rounded-sm"}
                                    style={{ width: "6px", height: "3px" }}
                                  ></div>
                                </>
                              );
                            })}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2 class="mb-2 text-md mt-8  font-semibold text-gray-900">
        Øvelser mestret
      </h2>
      <table class="content-start w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <tbody>
          {exercises.map((sex, index) => {
            if (!sex.ex) return null;
            const masterPercentage = samplePercentages[index][0];
            const failPercentage = samplePercentages[index][1];
            const exerciseIsExpanded = expandedExercises[sex.id];

            const bg = index % 2 ? "bg-white" : "bg-gray-100";

            return (
              <>
                <tr
                  class={
                    bg +
                    (index === exercises.length - 1 || !exerciseIsExpanded
                      ? " border-b"
                      : "")
                  }
                >
                  <td>
                    <div class="flex my-2">
                      <div class="flex my-auto w-1/2">
                        <b class="flex">{sex.ex.answer}</b>
                        <span class="flex ml-2">
                          {+masterPercentage + "% af klassen"}
                        </span>

                        <button class="flex ml-2">
                          <span
                            class="underline flex"
                            onClick={(e) =>
                              setExpandedExercises((prev) => ({
                                ...prev,
                                [sex.id]: !exerciseIsExpanded,
                              }))
                            }
                          >
                            <img
                              class="w-2 transform flex mr-2"
                              style={{
                                transition: "transform 250ms ease-out",
                                "-ms-transform": exerciseIsExpanded
                                  ? "rotate(0)"
                                  : "rotate(-180deg)",
                                transform: exerciseIsExpanded
                                  ? "rotate(-180deg)"
                                  : "rotate(0)",
                              }}
                              src="/down.svg"
                            />
                            {exerciseIsExpanded
                              ? import.meta.env.VITE_HIDE
                              : import.meta.env.VITE_SHOW}
                          </span>
                        </button>
                      </div>
                      <div class="flex my-auto w-1/2">
                        <div
                          class={"w-full bg-gray-400 rounded-full h-2.5 flex"}
                        >
                          <div
                            class="bg-green-600 h-2.5 rounded-l "
                            style={"width: " + masterPercentage + "%"}
                          ></div>
                          <div
                            class="bg-red-600 h-2.5 rounded-r "
                            style={"width: " + failPercentage + "%"}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                {exerciseIsExpanded &&
                  rowData.map((el, nameIndex) => {
                    const { name } = el;
                    const total = masterPercentage + failPercentage;
                    if (testDict[sex.id] == undefined) {
                      testDict[sex.id] = {};
                      rowData.map((testEl) => {
                        const rnd = Math.random();
                        if (rnd < masterPercentage / 100) {
                          testDict[sex.id][testEl.name] =
                            70 + Math.random() * 30;
                        } else {
                          if (rnd < (masterPercentage + failPercentage) / 100)
                            testDict[sex.id][testEl.name] = 50 * Math.random();
                          else testDict[sex.id][testEl.name] = 0;
                        }
                      });
                    }
                    const pupilMasterPercentage = testDict[sex.id][name];

                    return (
                      <tr
                        class={
                          bg +
                          (nameIndex === rowData.length - 1 ? " border-b" : "")
                        }
                      >
                        <td>
                          <div class="flex" style={{ height: "18px" }}>
                            <div class="flex my-auto w-1/2">
                              <span>{name}</span>
                            </div>
                            <div class="flex my-auto w-1/2">
                              <div
                                class={
                                  "w-full bg-gray-200 rounded-full h-2.5 flex"
                                }
                              >
                                {pupilMasterPercentage > 0 && (
                                  <>
                                    <div
                                      class="bg-green-600 h-2.5 rounded-full "
                                      style={
                                        "width: " + pupilMasterPercentage + "%"
                                      }
                                    ></div>
                                    <div
                                      class="bg-red-600 h-2.5 rounded-full "
                                      style={
                                        "width: " +
                                        (100 - pupilMasterPercentage) +
                                        "%"
                                      }
                                    ></div>
                                  </>
                                )}
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
        </tbody>
      </table>
    </div>
  );
}
