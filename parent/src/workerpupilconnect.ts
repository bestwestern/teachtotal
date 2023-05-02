import { handleResponses } from "./workerchannels";
const createChannel = (sb, sbSession, guid, teacherid) => {
  console.log("connect in progress");
  const channel = sb.channel(guid);
  channel
    .on("presence", { event: "sync" }, () => {
      console.log("SYNC currently online users", channel.presenceState());
      const currentPresences = Object.values(channel.presenceState());
      for (var i = 0; i < currentPresences.length; i++) {
        console.log(currentPresences[i]);
        const { success, duplicate } = currentPresences[i];
        if (success) {
          postMessage({ connectionProps: { success, duplicate } });

          //OPRET TARGETS hvis der findes!

          handleResponses(sb, sbSession, true);
          sb.removeChannel(channel);
        }
        console.log({ success, duplicate });
      }
    })
    .on("presence", { event: "join" }, ({ newPresences }) => {
      for (var i = 0; i < newPresences.length; i++) {
        console.log(newPresences[i]);
        const { success, duplicate } = newPresences[i];
        if (success) {
          console.log({ success });
          postMessage({ connectionProps: { success, duplicate } });

          //OPRET TARGETS hvis der findes!

          handleResponses(sb, sbSession, true);
          sb.removeChannel(channel);
        }
        console.log({ success, duplicate });
      }
    })
    .on("presence", { event: "leave" }, ({ leftPresences }) =>
      console.log("users have left", leftPresences)
    )
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const status = await channel.track({ [guid]: teacherid });
        console.log(status);
      }
    });
};
export { createChannel };
