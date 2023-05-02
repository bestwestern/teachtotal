const deleteDevice = (sb, deviceid, teacherid) => {
  console.log("del in progress");
  console.log(deviceid, teacherid);
  sb.from("teacherdevices")
    .delete()
    .match({ deviceid, teacherid })
    .then((args) => {
      console.log(args);
      if (args.error) postMessage({ error: "Noget gik galt" });
      else postMessage({ reload: 1 });
    });
};
export { deleteDevice };
