import { h } from "preact";
import { get, set, clear } from "idb-keyval";
import Navbar from "./navbar";
import { loadJS } from "./util";
import { createPresence } from "./supabase";
import { useEffect, useState } from "preact/hooks";

let baseUrl = "http://127.0.0.1:3001/connect/";
if (import.meta.env.PROD) {
  const b = location.origin;
  const i = b.indexOf(".");
  baseUrl = b.substr(0, i) + "parent" + b.substring(i) + "/connect";
}
//stackoverflow.com/questions/23690666/check-if-my-website-is-open-in-another-tab
//https: interface ConnectProps {}
const Connect = ({ setRoute }: ConnectProps) => {
  useEffect(() => {
    if (QRCode) {
      generateQR();
    } else
      loadJS("/qrcode.min.js", () => {
        generateQR();
      });
  }, []);
  const [url, setUrl] = useState("");
  const reset = () => {
    clear();
    location.reload();
  };
  const generateQR = () => {
    createPresence(setRoute).then(({ guid, hash }) => {
      const createdUrl = baseUrl + "?guid=" + guid + "&hash=" + hash;
      setUrl(createdUrl);
      const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: createdUrl,
        width: 256,
        height: 256,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    });
  };
  const share = () => {
    if (navigator.share) {
      const shareData = {
        title: import.meta.env.VITE_PARENT_TITLE,
        // text: "Learn web development on MDN!",
        url,
      };

      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(url);
      alert("copied to clipboard");
    }
  };
  return (
    <>
      <Navbar
        txt={import.meta.env.VITE_DOCUMENT_CONNECTTITLE}
        route={[""]}
        setRoute={setRoute}
        useConnectImage={false}
      ></Navbar>
      <div class="flex justify-center items-center">
        <div id="qrcode"></div>
      </div>
      {!!import.meta.env.DEV && <p>{url}</p>}
      <div class="flex justify-center items-center mt-16">
        <p class="text-lg pl-8">
          {url.length
            ? import.meta.env.VITE_DOCUMENT_CONNECTIONINSTRUCTIONS
            : import.meta.env.VITE_LOADING}
        </p>
        {url.length > 0 && (
          <button
            onClick={share}
            type="button"
            class="bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
          >
            <svg
              class="w-8 h-8"
              version="1.1"
              viewBox="0 0 465 465"
              style="enable-background:new 0 0 465 465;"
            >
              <path
                d="M370.656,290.363c-30.818,0-57.958,16.049-73.502,40.227l-122.311-64.265c4.39-10.408,6.819-21.838,6.819-33.824
	s-2.429-23.416-6.819-33.824l122.311-64.265c15.545,24.178,42.684,40.227,73.502,40.227c48.148,0,87.319-39.171,87.319-87.318
	C457.975,39.171,418.804,0,370.656,0c-48.147,0-87.318,39.171-87.318,87.319c0,11.987,2.429,23.416,6.819,33.824l-122.311,64.265
	c-15.545-24.178-42.684-40.227-73.502-40.227c-48.147,0-87.318,39.171-87.318,87.319s39.171,87.319,87.318,87.319
	c30.818,0,57.958-16.049,73.502-40.227l122.311,64.265c-4.39,10.408-6.819,21.838-6.819,33.824
	c0,48.148,39.171,87.319,87.318,87.319c48.148,0,87.319-39.171,87.319-87.319C457.975,329.534,418.804,290.363,370.656,290.363z
	 M370.656,15c39.877,0,72.319,32.442,72.319,72.319c0,39.876-32.442,72.318-72.319,72.318s-72.318-32.442-72.318-72.318
   C298.337,47.442,330.779,15,370.656,15z M94.343,304.819c-39.876,0-72.318-32.442-72.318-72.319s32.442-72.319,72.318-72.319
	s72.318,32.442,72.318,72.319S134.219,304.819,94.343,304.819z M370.656,450c-39.877,0-72.318-32.442-72.318-72.319
	c0-39.876,32.441-72.318,72.318-72.318s72.319,32.442,72.319,72.318C442.975,417.558,410.533,450,370.656,450z"
              />
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
              <g></g>
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Connect;
