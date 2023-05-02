import { h } from "preact";
import Link from "./link";
import Navbar from "./navbar";
import play from "./assets/play.svg";

interface HomeProps {
  programmelist: Array<ProgrammeObject>;
  setRoute: (route: Array<string>) => void;
  targets: any;
  dailyScore: any;
}
const Home = ({
  programmelist,
  setRoute,
  targets = {},
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
  console.log({ targetCount, targetsReached });
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
