import { useRouter } from "next/router";
import Head from "next/head";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchNotifications } from "../services/redux/slices/notificationSlice";

export default function PaymentSuccess() {
  const router = useRouter();
  const { order } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Payment Successful 🎉 - JodiMilan</title>
      </Head>

      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-5">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full animate-fadeIn">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon sx={{ fontSize: 80, color: "#16a34a" }} />
          </div>

          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mt-3">
            Thank you for upgrading your membership! 🎉
          </p>

          <div className="mt-5 bg-green-50 border border-green-300 rounded-md p-3">
            <p className="text-gray-700 font-medium">
              Order Number:
              <span className="font-bold text-green-700 ml-1">{order}</span>
            </p>
          </div>

          <p className="text-gray-500 text-sm mt-3">
            You can now enjoy premium features on JodiMilan.
          </p>

          <button
            className="mt-6 bg-primary text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary/80 transition"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn .7s ease-in-out;
        }
      `}</style>
    </>
  );
}
