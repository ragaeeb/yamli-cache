import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { disableAnalytics, initCache, YamliCache } from "yamli-cache";


const { Yamli } = window as any;
let cache: YamliCache = {};

const loadCache = () => JSON.parse(localStorage.getItem('yamli-cache-demo') || '{}');

if (Yamli) {
  disableAnalytics(Yamli);
  Yamli.init({
    settingsPlacement: "inside",
    startMode: "onOrUserDefault",
    uiLanguage: "en",
  });

  cache = initCache(Yamli, loadCache())

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      "yamli-cache-demo",
      JSON.stringify({ ...loadCache(), ...cache })
    );
  });
}

render(<App cache={cache}/>, document.getElementById("app")!);
