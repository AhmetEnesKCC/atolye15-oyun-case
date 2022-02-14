import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Store } from "../Redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={Store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
