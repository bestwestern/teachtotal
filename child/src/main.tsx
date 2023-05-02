import { render } from "preact";
import { App } from "./app";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
window.QRCode = false;
let reload = false;
window.onfocus = function () {
  if (import.meta.env.PROD && reload) location.reload();
};
window.onblur = function () {
  reload = true;
};
render(<App />, document.getElementById("app") as HTMLElement);
registerSW({ immediate: true });
