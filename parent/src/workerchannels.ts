let deviceIds = [];
let channels = {};
var pupilExerciseSummary = {};
let deviceToPupil = {}; //read from localstorage
import { getClockFromMS, getDateString } from "./util";
var responseMap = new Map(); //[ms+pupilId]={obj}
const handleResponses = (sb, sbSession, sendTargets) => {
  const teacherdevices = sb
    .from("teacherdevices")
    .select("*")
    .eq("teacherid", sbSession.user.id)
    .order("dateadded", { ascending: true });
  let deviceArray = [];
  Promise.all([teacherdevices]).then(([vals]) => {
    if (vals.data)
      vals.data.forEach((val) => {
        deviceIds.push(val.deviceid);
        const pupilId = Object.values(deviceToPupil)[0] || val.deviceid;
        deviceToPupil[val.deviceid] = pupilId;
        deviceArray.push({ date: new Date(val.dateadded), id: val.deviceid });
        if (pupilExerciseSummary[pupilId] == undefined)
          pupilExerciseSummary[pupilId] = { t: new Map() }; //bruges t?
        channels[val.deviceid] = sb.channel(val.deviceid);
        channels[val.deviceid].on("broadcast", { event: "upd" }, (payload) => {
          if (payload.payload.current) {
            postMessage({
              current: payload.payload.current.eid
                ? {
                    start: new Date().getTime(),
                    ...payload.payload.current,
                    deviceid: val.deviceid,
                  }
                : {},
            });
          } else handleInserts({ ...payload.payload, deviceid: val.deviceid });
        });
        channels[val.deviceid].subscribe();
      });
    // deviceArray.push({ id: "c8afe", date: new Date() });
    // deviceArray.push({ id: "c8adfe", date: new Date() });
    let idLength = 4;
    let deviceArrayShort = deviceArray.map((el) => ({
      date: el.date,
      pupilId: el.id,
      id: el.id.substring(0, idLength) + "..",
    }));
    while (
      new Set(deviceArrayShort.map((el) => el.id)).size !==
      deviceArrayShort.length
    ) {
      idLength++;
      deviceArrayShort = deviceArray.map((el) => ({
        date: el.date,
        pupilId: el.id,
        id: el.id.substring(0, idLength) + "..",
      }));
    }

    postMessage({ deviceIds, deviceArray: deviceArrayShort });
    sb.from("responses")
      .select("*")
      .in("deviceid", deviceIds)
      .then((responseData: { data: Array<Responses> }) => {
        for (var i = 0; i < responseData.data.length; i++) {
          handleResponse(responseData.data[i]);
        }
        sortFilterSend();
      });

    sb.from("targets")
      .select("*")
      .in("deviceid", deviceIds)
      .then((obj) => {
        let data = obj.data || [];
        for (let i = 0; i < data.length; i++) {
          const { pid, target, deviceid, everynday, startnday } = data[i];
          postMessage({
            target: { deviceId: deviceid, target, pid, everynday, startnday },
          });
        }
        if (deviceIds.length > 1 && sendTargets) {
          //sendTargets=>lige tilføjet, send targets to latest nyeste
          for (let i = 0; i < data.length; i++) {
            const { pid, target } = data[i];
            setTarget(sb, { pid, newTarget: target });
          }
        }
      });
    sb.channel("insertChanges")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
        },
        (val) => handleInserts(val.new)
      )
      .subscribe();
    // sb.from("responses").on("INSERT", handleInserts).subscribe();
  });
};
function setTarget(
  sb,
  { pid, newTarget, target, everynday = 1, startnday = 1 }
) {
  console.log({ pid, newTarget, target, everynday, startnday });
  deviceIds.forEach((deviceId) => {
    let channelObject = {};
    channelObject = { target: Number(newTarget) };
    if (target != 0)
      sb.from("targets")
        .upsert([{ pid, deviceid: deviceId, target, everynday, startnday }])
        .then((res) => {
          console.log(res);
        });
    else
      sb.from("targets")
        .delete()
        .eq("deviceid", deviceId)
        .eq("pid", pid)
        .then((res) => console.log(res));

    postMessage({
      target: {
        deviceId,
        target,
        pid: Number(pid),
        everynday,
        startnday,
      },
    });
    channels[deviceId].send({
      type: "broadcast",
      event: "targetUpdate",
      payload: {
        [pid]: {
          target,
          pid: Number(pid),
          everynday,
          startnday,
        },
      }, //update - inkluder startnday og everynday
    });
  });
}
export { handleResponses, setTarget };
const handleResponse = (responseObj) => {
  const { ms, pid, sc, eid, dayscore, timeint, deviceid } = responseObj;
  if (!responseMap.has(timeint + deviceid)) {
    const date = new Date(timeint);
    const mm = ("0" + (date.getMonth() + 1)).slice(-2);
    const dd = ("0" + date.getDate()).slice(-2);
    const yyyy = date.getFullYear();
    const pupilId = deviceToPupil[deviceid];
    const dateString = yyyy + "-" + mm + "-" + dd;
    if (
      pupilExerciseSummary[pupilId][pid] &&
      pupilExerciseSummary[pupilId][pid][eid]
    ) {
      pupilExerciseSummary[pupilId][pid][eid].n++;
      pupilExerciseSummary[pupilId][pid][eid].sc += sc;
      pupilExerciseSummary[pupilId][pid][eid].ts.push(Number(timeint));
      pupilExerciseSummary[pupilId][pid].i.s[eid] =
        pupilExerciseSummary[pupilId][pid][eid].sc /
        pupilExerciseSummary[pupilId][pid][eid].n;
    } else {
      if (!pupilExerciseSummary[pupilId][pid])
        pupilExerciseSummary[pupilId][pid] = {
          i: { t: 0, s: { [eid]: sc } }, //SKAL [EID]være der??
        }; //info time successrate
      pupilExerciseSummary[pupilId][pid][eid] = {
        t: 0, //total tid
        tn: 0, //antal timede
        sc, //antal rigtige
        n: 1, //antal forsøg
        ts: [Number(timeint)], //timestamps
      };
    }
    responseMap.set(timeint + pupilId, {
      ...responseObj,
      dt: yyyy + dd + mm,
      pupilId,
      dateString,
    });
  } else console.log("dobbelt");
};
const handleInserts = (val) => {
  const { timeint, pupilId } = val;
  if (!responseMap.has(timeint + pupilId)) {
    handleResponse(val);
    sortFilterSend();
  }
};
const sortFilterSend = () => {
  let timeUsedOnDates = new Map();
  timeUsedOnDates.set(getDateString(), 0);
  let responseArrays = [];
  responseMap = new Map(
    [...responseMap.entries()].sort((a, b) => b[1].timeint - a[1].timeint)
  );

  responseMap.forEach(({ dateString, ms }) => {
    timeUsedOnDates.set(
      dateString,
      (timeUsedOnDates.get(dateString) || 0) + ms
    );
  });
  timeUsedOnDates.forEach((msTotal, currentDateString) => {
    const responseArray = JSON.parse(
      JSON.stringify(
        [...responseMap.values()].filter(
          (res) => res.dateString === currentDateString
        )
      )
    );
    let programmeHeaders = [];
    if (responseArray.length) {
      let { pid, dayscore } = responseArray[0];
      let currentPid = pid;
      programmeHeaders.push({ pid, dayscore, index: 0 });
      let lastOfThisProgrammeResponse = responseArray[0];
      for (var i = 1; i < responseArray.length; i++) {
        const res = responseArray[i];
        ({ pid, dayscore } = res);
        if (pid !== currentPid) {
          programmeHeaders.at(-1).start = getClockFromMS(
            lastOfThisProgrammeResponse.timeint
          );
          programmeHeaders.push({ pid, dayscore, index: i });
          currentPid = pid;
        }
        lastOfThisProgrammeResponse = res;
      }
      programmeHeaders.at(-1).start = getClockFromMS(
        lastOfThisProgrammeResponse.timeint
      );
      programmeHeaders.forEach(
        ({ index, ...rest }) => (responseArray[index].header = { ...rest })
      );
    }
    responseArrays.push({ date: currentDateString, responseArray, msTotal });
    postMessage({ pupilExerciseSummary, responseArrays, responseMap });
  });
};
