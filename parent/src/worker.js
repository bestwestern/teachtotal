import { add } from "./util";
import { init } from "./workerinit";
import { createChannel } from "./workerpupilconnect";
import { deleteDevice } from "./workerdeletedevice";
import { handleResponses, setTarget } from "./workerchannels";
let teacherId, sbSession, sb;
init().then((val) => {
  ({ teacherId, sbSession, sb } = val);
  handleResponses(sb, sbSession);
});
onmessage = message;
function message(ev) {
  if (sb) {
    const { fct, ...data } = ev.data;
    console.log({ data });
    switch (fct) {
      case "connect":
        createChannel(sb, sbSession, data.guid, sbSession.user.id);
        break;
      case "setTarget":
        setTarget(sb, data);
        break;
      case "deleteDevice":
        deleteDevice(sb, ev.data.pupilId, sbSession.user.id);
        break;
      default:
        console.log("missing fct" + fct);
        break;
    }
  } else setTimeout(() => message(ev), 10);
}
