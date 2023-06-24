import { loadJS, timeout } from "./util";
import { get, set, clear } from "idb-keyval";
import { nanoid } from "nanoid";
let sb,
  resultsToSend = {}, //læs i localstorage
  pupilId,
  sbSession,
  channel,
  guidChannel,
  hash,
  encryptWithAES,
  decryptWithAES,
  timeoutObj = setTimeout(() => {}, 1);
// loadJS("crypto.js", () => {
//   encryptWithAES = (text, passphrase) => {
//     return CryptoJS.AES.encrypt(text, passphrase).toString();
//   };
//   decryptWithAES = (ciphertext, passphrase) => {
//     const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
//     const originalText = bytes.toString(CryptoJS.enc.Utf8);
//     return originalText;
//   };
// });
function init(setTeacherSubjects, newTargetCallback) {
  get("pupilId").then((val) => {
    pupilId = val;
    if (val) {
      //   initSupa();
      // store.setState({ pupilId });
    } else {
      pupilId = nanoid();
      if (import.meta.env.DEV) pupilId = "test" + pupilId.substr(4);
      set("pupilId", pupilId);
    }
    loadJS("supabase2.0.3.min.js", () => {
      sb = supabase.createClient(
        import.meta.env.VITE_SUPABASEURL,
        import.meta.env.VITE_SUPABASEKEY
      );
      sb.auth
        .signInWithPassword({
          email: pupilId + "@lortemail.dk",
          password: pupilId,
        })
        .then((response) => {
          // sb.from("responses")
          //   .select("*")
          //   .then((obj) => {
          //     console.log(obj);
          //   });
          if (response.error)
            sb.auth
              .signUp({ email: pupilId + "@lortemail.dk", password: pupilId })
              .then((response2) => {
                console.log("signup attempt");
                console.log(response2);
                sbSession = response2.data.session;
                setupChannel();
              })
              .catch((err) => console.log(err));
          // alert(err);
          else {
            sbSession = response.data.session;
            setupChannel();
          }
        })
        .catch((err) => {
          console.log({ err });
        });
      const subjectResponse = sb.from("subjects").select("*");
      const subjectExerciseResponse = sb.from("subjectexercises").select("*");
      const exerciseResponse = sb.from("exercises").select("*");
      subjectResponse.then((val) => {
        if (val.data) {
          setTeacherSubjects(val.data);
        }
        // console.log({ val });
      });
      //  sb.storage.listBuckets().then((val) => console.log({ val }));
      Promise.all([
        subjectResponse,
        subjectExerciseResponse,
        exerciseResponse,
      ]).then(([teacherSubjects, teacherSubEx, teacherExercises]) => {
        // console.log(teacherExercises);
        // sb.storage
        //   .from("images")
        //   .getPublicURL("images/" + teacherExercises.data[0].id)
        //   .then((val) => console.log(val));
        let ts = teacherSubjects.data.slice(0);
        const subEx = teacherSubEx.data;
        const exes = teacherExercises.data;
        for (var i = 0; i < subEx.length; i++) {
          const te = exes.find((ex) => ex.id == subEx[i].exerciseid);
          let tsub = ts.find((sub) => sub.id === subEx[i].subjectid);
          if (tsub.exercises === undefined) tsub.exercises = [];
          tsub.exercises.push(te);
        }
        setTeacherSubjects(ts);
        console.table(ts);
      });
    });
  });
  // get("targets").then((val) => {
  //   newTargetCallback(val || {});
  // });
  const setupChannel = () => {
    let newTargets = {};
    sb.from("targets")
      .select("*")
      .eq("deviceid", sbSession.user.id)
      .then((obj) => {
        (obj?.data || []).forEach((element) => {
          const { target, everynday, startnday } = element;
          newTargets[element.pid] = { target, everynday, startnday };
        });
        newTargetCallback(newTargets);
        set("targets", newTargets);
      });
    channel = sb.channel(sbSession.user.id);
    channel.on("broadcast", { event: "targetUpdate" }, (payload) => {
      newTargetCallback(payload.payload);
      console.log(payload);
      get("targets").then((val) => {
        let newVal = val || {};
        set("targets", { ...newVal, ...payload.payload });
      });
    });
    channel.subscribe();
  };
}
const registerResultInSupabase = (data) => {
  console.log({ data });
  if (data) resultsToSend[data.timeint] = data;
  if (!sb) {
    clearTimeout(timeoutObj);
    timeoutObj = setTimeout(() => {
      registerResultInSupabase();
    }, 200);
  } else {
    DBInsert();
    if (data && channel)
      channel.send({
        type: "broadcast",
        event: "upd",
        payload: { ...data, deviceid: sbSession.user.id },
      });
  }
};
const DBInsert = () => {
  if (sbSession)
    for (var prop in resultsToSend) {
      var data = resultsToSend[prop];
      const { eid, sc, ms, dayscore, timeint, pid } = data;
      const sbScore = {
        eid,
        sc,
        ms,
        dayscore,
        timeint,
        pid,
        deviceid: sbSession.user.id,
      };
      sb.from("responses")
        .insert([sbScore])
        .then((res) => {
          if (res.status == 201) delete resultsToSend[timeint];
          //gem resultstosend
        })
        .catch((err) => console.log(err));
    }
};

async function createPresence(setRoute) {
  if (!sb) {
    await timeout(10);
    return createPresence(setRoute);
  } else {
    //const test = await sb.auth.getSession();
    const guid = nanoid(8);
    hash = nanoid(8);
    guidChannel = sb.channel(guid);
    guidChannel
      .on("presence", { event: "sync" }, () => {
        const state = guidChannel.presenceState();
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        for (var i = 0; i < newPresences.length; i++) {
          const teacherId = newPresences[i][guid];
          if (teacherId) connectToTeacher(setRoute, teacherId);
        }
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) =>
        console.log("users have left", leftPresences)
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const status = await guidChannel.track({ guid });
        }
      });
    setTimeout(() => console.log(sb.getChannels()), 1000);
    return new Promise(function (resolve, reject) {
      resolve({ guid, hash });
    });
  }
}
const sendCurrentExercise = (eid, pid) => {
  if (channel)
    channel.send({
      type: "broadcast",
      event: "upd",
      payload: { current: { eid, pid } },
    });
};
const connectToTeacher = (setRoute, teacherId) => {
  const deviceid = sbSession.user.id;
  sb.from("teacherdevices")
    .insert([{ teacherid: teacherId, deviceid }])
    .then((res) => {
      console.log(res);
      if (res?.error?.message.startsWith("duplicate")) {
        console.log("already added");
        guidChannel.track({ success: deviceid, duplicate: true });
      } else {
        if (res.status === 201) {
          console.log("success!");
          // sb.removeAllguidChannels();
          guidChannel.track({ success: deviceid });
          setTimeout(() => sb.removeChannel(guidChannel), 1000);
        }
      }
      history.replaceState(null, "", window.location.origin + "/");
      setTimeout(() => {
        location.reload();
      }, 1000);
      //setRoute([""]);
    })
    .catch((err) => console.log(err));
};
export { registerResultInSupabase, createPresence, sendCurrentExercise, init };
