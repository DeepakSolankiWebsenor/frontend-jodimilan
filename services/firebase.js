import { firebaseConfig } from "./appConfig";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfigs = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfigs) : getApps()[0];

let messaging = null;
(async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    messaging = getMessaging(app);
  } else {
    console.warn("Firebase messaging is not supported in this environment.");
  }
})();

export { app, messaging };
