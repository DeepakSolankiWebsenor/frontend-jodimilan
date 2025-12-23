import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useDispatch } from "react-redux";
import useApiService from "../services/ApiService";
import { COMMON_DATA, setUser } from "../services/redux/slices/userSlice";
import useFirebase from "../hooks/useFirebase";
import { setNotifications } from "../services/redux/slices/notificationSlice";

function Layout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { initFirebase } = useFirebase();
  const [hideFooter, setHideFooter] = useState(false);
  const { commonOption, getNotifications, getUserProfile } = useApiService();

  useEffect(() => {
    const location = window.location.pathname;
    if (location === "/messages") {
      setHideFooter(true);
    } else {
      setHideFooter(false);
    }
  }, [router.query]);

  const getNotificationsData = () => {
    getNotifications()
      .then((res) => {
        if (res?.data?.status === 200) {
          dispatch(setNotifications(res?.data?.notifications));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    commonOption()
      .then((res) => {
        if (res.data.code) {
          dispatch(COMMON_DATA(res?.data?.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (token) {
      getNotificationsData();
      initFirebase({ userId });
      
      // Sync user profile in Redux
      getUserProfile()
        .then((res) => {
          console.log("💎 LAYOUT SYNC RESPONSE:", res.data);
          if (res?.data?.code === 200 || res?.data?.status === 200) {
            const encryptedStr = res?.data?.data?.user;
            console.log("💎 DISPATCHING ENCRYPTED USER:", encryptedStr ? encryptedStr.substring(0, 20) + "..." : "NULL");
            dispatch(setUser(encryptedStr));
          }
        })
        .catch(err => console.error("❌ Sync profile error:", err));
    }
  }, []);

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
