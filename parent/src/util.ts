function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}
const getClockFromMS = (ms) => {
  const date = new Date(ms);
  const hh = ("0" + date.getHours()).slice(-2);
  const min = ("0" + date.getMinutes()).slice(-2);
  return hh + "." + min;
};
const getDateString = (date = new Date()) => {
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  const yyyy = date.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};
const getDKDateString = (date = new Date()) => {
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  const min = ("0" + date.getMinutes()).slice(-2);
  const hh = ("0" + date.getHours()).slice(-2);
  const yyyy = date.getFullYear();
  return dd + "/" + mm + " " + yyyy;
};
export { add, getClockFromMS, getDateString, getDKDateString };
