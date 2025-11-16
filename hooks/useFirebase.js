import { messaging } from "../services/firebase";
import { firebaseConfig } from "../services/appConfig";
import { getToken } from "firebase/messaging";
import useApiService from "../services/ApiService";

const useFirebase = () => {
  const { pushNotificationSubscribe } = useApiService();

  const initFirebase = async ({ userId }) => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey: firebaseConfig.vapidKey,
        });

        console.log("FCM Token:", token);
        localStorage.setItem("fcmToken", token);

        await handleSubscribeToTopic({ userId, token });
      } catch (error) {
        console.log("Error getting token:", error);
      }
    }
  };

  const handleSubscribeToTopic = async ({ userId, token }) => {
    try {
      await pushNotificationSubscribe({
        token,
        topic: `T_user_id_${userId}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    initFirebase,
  };
};

export default useFirebase;
