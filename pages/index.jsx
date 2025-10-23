import Head from "next/head";
import LandingPage from "../components/Landing";
import Script from "next/script";
import useApiService from "../services/ApiService";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  COMMON_DATA,
  SUCCESS_STORIES,
} from "../services/redux/slices/userSlice";
import FindPerfectMatch from "./HomePages/FindPerfectMatch";

export default function Home() {
  return (
    <div>
      <Head>
        <title>MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/Logo.png" />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FindPerfectMatch />
      </div>
    </div>
  );
}

// export default function Home() {
//   const dispatch = useDispatch();
//   const { getUserProfile, commonOption, cms, getNotifications } =
//     useApiService();
//   const dataFetchedRef = useRef(false);
//   useEffect(() => {
//     if (dataFetchedRef.current) return;
//     dataFetchedRef.current = true;
//     commonOption()
//       .then((res) => {
//         if (res.data.code) {
//           dispatch(COMMON_DATA(res?.data?.data));
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     // getUserProfile()
//     // .then((res) => {
//     //   if (res.data.status === 200) {
//     //     dispatch(setUser({ user: res.data.user }));
//     //   }
//     // })
//     // .catch((error) => console.log(error));

//     // cms
//     cms("success")
//       .then((res) => {
//         if (res.data?.code === 200) {
//           dispatch(SUCCESS_STORIES(res?.data?.data));
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     // getNotifications()
//     // .then((res) => {
//     //   if (res.data.status === 200) {
//     //     dispatch(NOTIFICATION(res?.data))
//     //   }
//     // })
//     // .catch((error) => {
//     //   console.log(error);
//     // });
//     return () => {};
//   }, []);
//   return (
//     <>
//       <Head>
//         <title>MyShaadi</title>
//         <meta
//           name="description"
//           content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
//         />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/logo/Logo.png" />
//       </Head>
//       <Script src="https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js"></Script>
//       {/* <Script>
//       if ("serviceWorker" in navigator) {
//         window.addEventListener("load", function () {
//           navigator.serviceWorker.register("/firebase-messaging-sw.js");
//         });
//       }
//     </Script> */}
//       <LandingPage />
//     </>
//   );
// }
