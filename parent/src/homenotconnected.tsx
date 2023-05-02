import { h } from "preact";
const NoConnectedDevices = () => {
  const headerText =
    import.meta.env.VITE_NOPUPILS1 +
    " " +
    import.meta.env.VITE_PUPILURL +
    " " +
    import.meta.env.VITE_NOPUPILS2;
  return (
    <div class="relative py-16 bg-gradient-to-br ">
      <div class="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40 from-sky-50 to-gray-200">
        <div class="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
          <div class="rounded-xl bg-white shadow-xl">
            <div class="p-6 sm:p-16">
              <div class="space-y-4">
                <h2 class="mb-8 text-2xl text-cyan-900 font-bold">
                  {headerText}
                </h2>
                <div class="mt-16 grid space-y-4">
                  <div class="space-y-4 text-gray-600 text-center ">
                    <p class="text-lg">
                      {import.meta.env.VITE_NOPUPILSCAMERA}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { NoConnectedDevices };
