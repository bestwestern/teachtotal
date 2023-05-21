import { useState, useEffect } from "preact/hooks";
const graphHeight = 40;
const now = new Date().getTime();
let sampleData = ["Søren", "Kristina", "Alexander"].map((name) => {
  let responses = [];
  const responseCount = Math.floor(Math.random() * 20);
  let lastResponseTime = now;
  for (var i = 0; i < responseCount; i++) {
    const timeUsed = Math.floor(Math.random() * 7000) + 1500;
    const thisResponseTime =
      lastResponseTime - timeUsed - Math.floor(Math.random() * 500) - 200;
    responses.push({
      score: Math.floor(Math.random() * 2),
      time: thisResponseTime,
      tTime: new Date(thisResponseTime).toLocaleTimeString(),
      timeUsed,
    });
    lastResponseTime = thisResponseTime;
  }
  return { name, responses };
});
export function Subject({ subject, exercises }) {
  const { name } = subject;
  console.log(exercises);
  return (
    <div class="m-4">
      <h2 class="mb-2 text-lg font-semibold text-gray-900">{name}</h2>
      <h2 class="mb-2 text-md font-semibold text-gray-900">
        Sidste 10 minutters svar
      </h2>
      <table class="content-st3art  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <tbody>
          {sampleData.map((el, nameIndex) => {
            console.table(el.responses);
            return (
              <tr class="bg-gray-50 border-b">
                <td>
                  <div class="flex">
                    <div class="flex my-auto w-1/3">
                      <b class="flex">{el.name}</b>
                      <span class="flex ml-2"> 100 % af 1</span>
                    </div>
                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>

                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>
                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>
                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>

                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>
                    <div class="h-full ml-1">
                      <div
                        class="bg-gray-50 rounded-sm"
                        style={{ width: "3px", height: "27.532px" }}
                      ></div>
                      <div
                        class="bg-green-600 rounded-sm"
                        style={{ width: "3px", height: "12.468px" }}
                      ></div>
                    </div>
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
          const bg = nameIndex % 2 ? "bg-white" : "bg-gray-50";
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
            console.log(sex);
            console.log(sex.ex);
            const masterPercentage = Math.floor(Math.random() * 50) + 50;
            const bg = "bg-white"; // index % 2 ? "bg-white" : "bg-gray-50";
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
