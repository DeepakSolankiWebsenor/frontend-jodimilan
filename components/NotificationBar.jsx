import { onMessage, isSupported } from "firebase/messaging";
import { toast } from "react-toastify";
import { IoNotificationsOutline } from "react-icons/io5";
import { useEffect } from "react";
import { messaging } from "../services/firebase";
import { useDispatch } from "react-redux";
import { addNotification } from "../services/redux/slices/notificationSlice";

const NotificationBar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = null;

    const setupListener = async () => {
      try {
        const supported = await isSupported();
        if (!supported || !messaging) {
          console.warn(
            "Firebase Messaging not supported in this browser or incognito mode."
          );
          return;
        }

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);

          const { title, body, data: actionData } = payload.data || {};
          const parsedActionData = actionData ? JSON.parse(actionData) : null;

          dispatch(addNotification(parsedActionData));

          toast(
            <div
              onClick={() => handleClickOnNotification(parsedActionData)}
              className="flex flex-col w-full cursor-pointer rounded-xl outline-none"
            >
              <div className="flex items-start gap-3">
                <IoNotificationsOutline className="w-[25px] h-[25px] text-yellow-400" />
                <div>
                  <p className="font-semibold text-gray-600">{title}</p>
                  <p className="text-xs text-gray-500">{body}</p>
                </div>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: 3000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              hideProgressBar: true,
            }
          );
        });
      } catch (error) {
        console.error("Error initializing notification listener:", error);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationBar;
