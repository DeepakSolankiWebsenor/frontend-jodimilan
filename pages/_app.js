import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "../components/Layout";
import "../styles/globals.css";
import TopBarProgress from "react-topbar-progress-indicator";
import { useState } from "react";
import { Router } from "next/router";
import { Provider} from "react-redux";
import Store from "../services/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import NotificationBar from "../components/NotificationBar";

TopBarProgress.config({
  barColors: {
    0: "darkBlue",
    "1.0": "white",
  },
});

export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(false);

  let persistor = persistStore(Store);

  Router.events.on("routeChangeStart", () => {
    setProgress(true);
  });

  Router.events.on("routeChangeComplete", () => {
    setProgress(false);
  });

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor} loading={null}>
        {() => (
          <>
            {progress && <TopBarProgress />}
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <NotificationBar />
          </>
        )}
      </PersistGate>
    </Provider>
  );
}
