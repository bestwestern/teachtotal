import { get, set, clear } from "idb-keyval";

function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}
function loadJS(url, implementationCode) {
  var scriptTag = document.createElement("script");
  scriptTag.src = url;
  scriptTag.onload = implementationCode;
  scriptTag.onreadystatechange = implementationCode;
  document.body.appendChild(scriptTag);
}
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const createDateStr = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = ("0" + (1 + now.getMonth())).slice(-2);
  const dd = ("0" + now.getDate()).slice(-2);
  return yyyy + mm + dd;
};
export { add, loadJS, timeout, createDateStr };
