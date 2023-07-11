import { h } from "preact";
import Navbar from "./navbar";
import play from "./assets/play.svg";
import Link from "./link";

interface HomeProps {
  programmelist: Array<ProgrammeObject>;
  setRoute: (route: Array<string>) => void;
  targets: any;
  dailyScore: any;
  teacherSubjects: any;
}
const Home = ({
  programmelist,
  setRoute,
  targets = {},
  teacherSubjects,
  dailyScore,
}: HomeProps) => {
  const targetCount = Object.keys(targets).length;
  let targetsReached: Array<number> = [];
  if (targetCount) {
    for (var i = 0; i < programmelist.length; i++) {
      const pid = programmelist[i].id;
      if (targets[pid] && targets[pid] <= dailyScore[pid])
        targetsReached.push(pid);
    }
  }
  return (
    <>
      <Navbar
        txt={import.meta.env.VITE_HOME_NAVTEXT}
        showCheckMark={targetCount && targetCount === targetsReached.length}
        route={["connect"]}
        setRoute={setRoute}
        useConnectImage={true}
      ></Navbar>
      <div class="flex flex-wrap justify-center">
        {teacherSubjects.length > 0 && (
          <div class="basis-1/2 lg:basis-1/3 flex-center p-2 rounded overflow-hidden shadow-xl border-solid border-2">
            <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <div
                aria-current="true"
                class="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600"
              >
                Lærer opgaver (NAVN)
              </div>
              {teacherSubjects.map((subject) => {
                const { name } = subject;
                return (
                  <Link
                    className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                    route={[name.toLowerCase()]}
                    setRoute={setRoute}
                    text={name}
                  ></Link>
                );
              })}
            </div>
          </div>
        )}
        {programmelist.map(({ id, pictureId, title, url }) => {
          let targetText = "";
          if (
            targetCount &&
            !targets[id] &&
            targetCount !== targetsReached.length
          )
            return null; //hvis der er mål, men ikke for dette program OG alle mål ikke nået
          if (targets[id])
            targetText = (dailyScore[id] || 0) + "/" + targets[id];
          return (
            <button
              type="button"
              onclick={(e) => {
                history.pushState(null, "", url);
                setRoute([url]);
              }}
              class="basis-1/2 lg:basis-1/3 flex p-2 rounded overflow-hidden shadow-xl border-solid border-2"
            >
              <div class=" flex flex-col justify-center h-full">
                <div class="py-2 w-16 flex md:w-32">
                  <img src={"/imgs/" + pictureId + ".webp"} />
                </div>
              </div>
              <div class="flex flex-col justify-between pl-2 py-2">
                <div class="flex">
                  <span class="font-medium text-lg text-gray-900 ">
                    {title}
                  </span>
                </div>
                {targetText.length > 0 && (
                  <div class="flex">
                    {targetCount > 0 && targetsReached.includes(id) ? (
                      <span>{targetText} &#10003;</span>
                    ) : (
                      <span>{targetText}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Home;
