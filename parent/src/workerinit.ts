import { createClient } from "@supabase/supabase-js";
import { get, set, clear } from "idb-keyval";
const sb = createClient(
  import.meta.env.VITE_SUPABASEURL,
  import.meta.env.VITE_SUPABASEKEY
);
import { nanoid } from "nanoid";
let teacherGuid, sbSession;

get("teacherGuid").then((val) => {
  teacherGuid = val;
  if (val) {
    //   initSupa();
    // store.setState({ teacherGuid });
  } else {
    teacherGuid = nanoid();
    if (import.meta.env.DEV) teacherGuid = "test" + teacherGuid.substr(4);
    set("teacherGuid", teacherGuid);
  }

  sb.auth
    .signInWithPassword({
      email: teacherGuid + "@lortemail.dk",
      password: teacherGuid,
    })
    .then((response) => {
      if (response.error)
        sb.auth
          .signUp({
            email: teacherGuid + "@lortemail.dk",
            password: teacherGuid,
          })
          .then((response2) => {
            sbSession = response2.data.session;
          })
          .catch((err) => {
            alert(err);
          });
      else {
        sbSession = response.data.session;
      }
    })
    .catch((err) => {});
});
async function init() {
  if (sbSession)
    return new Promise(function (resolve, reject) {
      resolve({ sbSession, teacherGuid, sb });
    });
  else {
    await timeout(10);
    return init();
  }
}
export { init };
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
