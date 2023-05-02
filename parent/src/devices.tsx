import { h } from "preact";
import Navbar from "./navbar";
import { getDKDateString } from "./util";
interface DevicesProps {
  deviceArray: Array<any>;
}
const Devices = ({ route, deviceArray }: DevicesProps) => {
  const deleteDevice = (id, e) => {
    e.preventDefault();
    ww.postMessage({ fct: "deleteDevice", pupilId: id });
  };
  return (
    <div>
      <h2 class="mb-8 text-2xl text-cyan-900 font-bold text-center">
        {import.meta.env.VITE_MENUDEVICES}
      </h2>

      <>
        <div class="overflow-x-auto relative shadow-md rounded-lg mb-10">
          <table class="w-full text-sm text-left text-gray-500 ">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" class="py-3 px-6">
                  {import.meta.env.VITE_MENUDEVICES}
                </th>
                <th scope="col" class="py-3 px-6">
                  {import.meta.env.VITE_DATEADDED}
                </th>
                <th scope="col" class="py-3 px-6"></th>
                <th scope="col" class="py-3 px-6" />
              </tr>
            </thead>
            <tbody>
              {deviceArray.map(({ date, id, pupilId }) => {
                return (
                  <tr class="bg-white border-b">
                    <th
                      scope="row"
                      class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {id}
                    </th>
                    <td class="py-4 px-6">{getDKDateString(date)}</td>
                    <td class="py-4 px-6">
                      <a
                        href="#"
                        onClick={(e) => deleteDevice(pupilId, e)}
                        class="font-medium text-blue-600 hover:underline"
                      >
                        {import.meta.env.VITE_DELETE}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>

      <Navbar route={route}></Navbar>
    </div>
  );
};

export default Devices;
