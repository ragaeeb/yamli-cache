import { useEffect } from 'preact/hooks'
import './app.css'
import { YamliCache } from 'yamli-cache'
import packageInfo from "../package.json";

type AppProps = {
  cache: YamliCache;
}

export function App({cache}: AppProps) {
  useEffect(() => {
    (window as any).Yamli.yamlify('arabic');

    return () => {
      (window as any).Yamli.deyamlify('arabic');
    };
}, []);

  return (
    <>
      <div class="card">
      <h1>{packageInfo.name} v{(packageInfo as any).dependencies["yamli-cache"]} Demo</h1>
      Total words in cache: {Object.keys(cache).length}
        <p>
          Enter some text into the field below, the next time you type the same word it should pull it from cache. Refresh the page and it should persist
          between refreshes.
          <ul>
            {Object.entries(cache).map(([key, values]) => <li key={key}>{key}: {values.split('|').toString()}</li>)}
          </ul>
        </p>
      </div>
      <input id='arabic' />
    </>
  )
}
