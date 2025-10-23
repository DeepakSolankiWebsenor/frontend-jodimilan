import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "../components/Layout";
import "../styles/globals.css";
import TopBarProgress from "react-topbar-progress-indicator";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import { Provider } from "react-redux";
import Store from "../services/redux/store";
// import { firebaseApp } from "../services/firebase";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import useApiService from "../services/ApiService";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import useApiService from "../services/ApiService";
import { NOTIFICATION } from "../services/redux/slices/userSlice";

TopBarProgress.config({
  barColors: {
    0: "darkBlue",
    "1.0": "white",
  },
});

export default function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(false);
  const { getNotifications } = useApiService();
  let persistor = persistStore(Store);

  Router.events.on("routeChangeStart", () => {
    setProgress(true);
  });

  Router.events.on("routeChangeComplete", () => {
    setProgress(false);
  });

  const getNotificationsData = () => {
    getNotifications()
      .then((res) => {
        if (res?.data?.status === 200) {
          Store.dispatch(NOTIFICATION(res?.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (progress == false) {
      const token = localStorage.getItem("token");
      if (token) {
        getNotificationsData();
      }
    }
  }, [progress]);

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor} loading={null}>
        {() => (
          <>
            {progress && <TopBarProgress />}
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </>
        )}
      </PersistGate>
    </Provider>
  );
}
