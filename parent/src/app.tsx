import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import Home from "./home";
import Programmes from "./programmes";
import Devices from "./devices";
import Connect from "./connect";
import { NoConnectedDevices } from "./homenotconnected";
const route = signal(location.pathname.substring(1).split("/"));
const connectionProps = signal({});
const homeProps = signal({});
const current = signal({});
const targets = signal({});
const pupilExerciseSummary = signal({});
const deviceIds = signal(false);
const deviceArray = signal([]);
const responseMap = signal(null);
const exerciseDict = signal({}); //[pid][eid]=ex
const urlSearchParams = new URLSearchParams(window.location.search);
export function App() {
  useEffect(() => {
    var ww = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    fetch("/programmedict.json")
      .then((r) => r.json())
      .then((json) => {
        let dict = {};
        Object.entries(json.programmeDict).forEach(([pid, prog]) => {
          dict[pid] = prog.exerciseDict;
          //  dict[pid + "title"] = prog.title;
          dict[pid].title = prog.title;
          dict[pid].pictureId = prog.pictureId;
        });
        exerciseDict.value = dict;
      });
    ww.onmessage = (ev) => {
      Object.keys(ev.data).forEach((prop) => {
        const { pid, target, deviceId, everynday, startnday } = ev.data[prop];
        switch (prop) {
          case "pupilExerciseSummary":
            pupilExerciseSummary.value = ev.data[prop];
            break;
          case "connectionProps":
            connectionProps.value = ev.data[prop];
            break;
          case "responseArrays":
            homeProps.value = { responseArrays: ev.data[prop] };
            current.value = {};
            break;
          case "current":
            current.value = ev.data[prop];
            break;
          case "deviceIds":
            deviceIds.value = ev.data[prop];
            break;
          case "error":
            alert("Der gik noget galt");
            break;
          case "reload":
            location.reload();
            break;
          case "deviceArray":
            deviceArray.value = ev.data[prop];
            break;
          case "responseMap":
            responseMap.value = ev.data[prop];
            break;
          case "updateTarget":
            let prevValue = { ...targets.value[deviceId] };
            if (everynday) prevValue[pid].everynday = everynday;
            prevValue[pid].startnday = startnday;
            targets.value = {
              ...targets.value,
              [deviceId]: prevValue,
            };

            break;
          case "target":
            let previousPupilTargets = { ...targets.value[deviceId] } || {};
            if (!target) delete previousPupilTargets[pid];
            else previousPupilTargets[pid] = { target, everynday, startnday };
            targets.value = {
              ...targets.value,
              [deviceId]: previousPupilTargets,
            };
            break;
          default:
            console.log("mangler fct til " + prop);
        }
      });
    };
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.guid) ww.postMessage({ fct: "connect", guid: params.guid });
    window.addEventListener(
      "popstate",
      (event: Event) =>
        //@ts-ignore
        (route.value = event.target?.location?.pathname.substr(1).split("/"))
    );

    window.ww = ww;
  }, []);
  if (!deviceIds.value) return null;
  if (!deviceIds.value.length && route.value[0] !== "connect") {
    return <NoConnectedDevices />;
  }
  return (
    <>
      {route.value[0] === "" && (
        <Home
          {...homeProps.value}
          deviceIds={deviceIds}
          targets={targets.value}
          exerciseDict={exerciseDict.value}
          current={current.value}
          route={route}
          pupilExerciseSummary={pupilExerciseSummary}
        ></Home>
      )}
      {route.value[0] === "connect" && (
        <Connect {...connectionProps.value} route={route}></Connect>
      )}
      {route.value[0] === "programmes" && (
        <Programmes
          pupilExerciseSummary={pupilExerciseSummary}
          route={route}
          targets={targets.value}
          responseMap={responseMap.value}
          exerciseDict={exerciseDict.value}
        ></Programmes>
      )}
      {route.value[0] === "devices" && (
        <Devices
          route={route}
          targets={targets.value}
          deviceArray={deviceArray.value}
          exerciseDict={exerciseDict.value}
        ></Devices>
      )}
    </>
  );
}
