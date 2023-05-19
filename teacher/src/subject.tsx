import { useState, useEffect } from "preact/hooks";

export function Subject({ subject, exercises }) {
  const { name } = subject;
  console.log(exercises);
  return (
    <div class="m-4">
      <h2 class="mb-2 text-lg font-semibold text-gray-900">
        {name + " " + exercises.length + " øvelser"}
      </h2>
      <table class="content-start  w-full md:w-3/4 lg:w-1/2 text-sm text-left text-gray-500 ">
        <caption class="px-5 py-2 md:py-5 text-lg font-semibold text-left text-gray-900 bg-white ">
          <p class="mt-1 text-sm font-normal text-gray-500 "></p>
        </caption>
        <tbody>
          {exercises.map((sex, index) => {
            console.log(sex);
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
