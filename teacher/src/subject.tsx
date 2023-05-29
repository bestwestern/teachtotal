import { useState, useEffect } from "preact/hooks";
const graphHeight = 40;

export function Subject({ subject, exercises, subjectResponses, timer }) {
  const [rowData, setRowData] = useState([]);
  const [createTime, setCreateTime] = useState(-1);
  useEffect(() => {
    if (
      timer - createTime > 9100 ||
      (subjectResponses.length && !rowData.length)
    )
      createRowData();
  }, [subjectResponses, timer]);
  const createRowData = () => {
    setCreateTime(timer);
    const newRowData = subjectResponses.map((el, nameIndex) => {
      const { name, responses } = el;
      let resArr = new Array(60).fill(null);
      for (var resIndex = 0; resIndex < responses.length; resIndex++) {
        const { score, time } = responses[resIndex];
        const diff = timer - time;
        const diffIndex = Math.floor(diff / 10000);
        resArr[diffIndex] = [...(resArr[diffIndex] || []), score];
      }
      return { responses: resArr, name };
    });
    setRowData(newRowData);
  };
  const { name } = subject;
  return (
    <div class="m-4">
      <h2 class="mb-2 text-lg font-semibold text-gray-900">{name}</h2>
      <h2 class="mb-2 text-md font-semibold text-gray-900">
        Sidste 10 minutters svar {timer}
      </h2>
      <table class="content-start  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <tbody>
          {rowData.map((el, nameIndex) => {
            const { name, responses } = el;
            return (
              <tr class="bg-gray-100 border-b" style={{ height: "30px" }}>
                <td>
                  <div class="flex">
                    <div class="flex my-auto w-2/5">
                      <b class="flex">{name}</b>
                      <span class="flex ml-2"> 100 % af 1</span>
                    </div>
                    {responses.map((arr) => {
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
      {false &&
        ["Ellen", "Annali", "Mads"].map((el, nameIndex) => {
          let ms, sc;
          const bg = nameIndex % 2 ? "bg-white" : "bg-gray-100";
          ms = Math.floor(Math.random() * 3000) + 2000;
          ms = Math.floor(Math.random() * 2);
          const className = sc ? "bg-green-600" : "bg-red-600";
          const heightPercentage = Math.min(100, ms / 100);
          const height = (graphHeight * heightPercentage) / 100;
          return (
            <div style={{ height: graphHeight + "px" }}>
              <div class={"h-full" + (nameIndex ? "" : " ml-3")}>
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
            </div>
          );
        })}
      <table class="content-start  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <caption class="px-5 py-2 md:py-5 text-lg font-semibold text-left text-gray-900 bg-white ">
          <p class="mt-1 text-sm font-normal text-gray-500 "></p>
        </caption>
        <tbody>
          {exercises.map((sex, index) => {
            if (!sex.ex) return null;
            const masterPercentage = Math.floor(Math.random() * 50) + 50;
            const bg = "bg-white"; // index % 2 ? "bg-white" : "bg-gray-100";
            const className = true
              ? "bg-green-600 h-2.5 rounded-full"
              : "bg-red-600 h-2.5 rounded-full";
            if (false) className = "bg-yellow-600 h-2.5 rounded-full";
            return (
              <tr class={bg + " border-b"}>
                <td className="py-2">
                  <span class=" text-gray-900 whitespace-nowrap font-medium">
                    {sex.ex.answer}
                  </span>
                  <span class=" text-gray-900 whitespace-nowrap ">
                    {" mestret af " + masterPercentage + "% af klassen"}
                  </span>
                  <div class="w-full bg-red-600 rounded-full h-2.5 ">
                    <div
                      class={className}
                      style={"width: " + masterPercentage + "%"}
                    ></div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
