import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }) {
  const [hideFooter, setHideFooter] = useState(false);
  const [user_id, setUser_id] = useState("");
  const [prefix_id, setPrefix_id] = useState("");
  const {  pushNotificationSubscribe } =
    useApiService();
  const router = useRouter();


  useEffect(() => {
    if (user_id && prefix_id) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          await getToken(getMessaging(firebaseApp), {
            vapidKey:
              "BMfBN0pzzkOsJ1lMk7pWGi4RJ4CYwS_EYzS-kfHU-efROryUL8Qi9oHufm8WNSlcKmeLlAl7zmVNZxYbRtdh8-4",
          })
            .then((currentToken) => {
              if (currentToken) {

                let params = {
                  topic: `${prefix_id}_user_id_${user_id}`,
                  token: currentToken,
                };

                pushNotificationSubscribe(params)
                  .then((res) => {
                    if (res.status === 200) {
                    }
                  })
                  .catch((error) => {
                  });

                onMessage(getMessaging(firebaseApp), (payload) => {
                  const notificationTitle = payload.notification.title;
                  const notificationOptions = {
                    body: payload.notification.body,
                  };

                  var notification = new Notification(
                    notificationTitle,
                    notificationOptions
                  );

                  notification.onclick = function (ev) {
                    ev.preventDefault();
                    window.open("/", "_blank");
                    notification.close();
                  };
                });
                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
              } else {
                console.log(
                  "No registration token available. Request permission to generate one."
                );
                // setTokenFound(false);
                // shows on the UI that permission is required
              }
            })
            .catch((err) => {
              // console.log("An error occurred while retrieving token. ", err);
              // catch error while creating client token
            });
        }
      });
    }
  }, [user_id, prefix_id]);
  useEffect(() => {
    const location = window.location.pathname;
    if (location === "/messages") {
      setHideFooter(true);
    } else {
      setHideFooter(false);
    }
  }, [router.query]);

  return (
    <>
      <header>
        <Header />
      </header>
      <section className="pt-24">
        <main>{children}</main>
      </section>
      {!hideFooter && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}

export default Layout;
