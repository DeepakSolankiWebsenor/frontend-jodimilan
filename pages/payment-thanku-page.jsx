import { useRouter } from "next/router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";

export default function ThankYou() {
  const router = useRouter();
  const { order } = router.query;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center transform transition-all scale-100 hover:scale-105 duration-300">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="text-green-500" sx={{ fontSize: 80 }} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Thank you for your payment. Your membership has been successfully
          activated!
        </p>

        <div className="mt-6 bg-green-50 py-4 rounded-xl border border-green-200">
          <p className="text-green-800 font-medium">
            Order Number:
            <span className="font-bold ml-2">{order}</span>
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg transition"
          >
            Continue Browsing 🚀
          </Link>
        </div>

        <p className="text-gray-500 text-xs mt-5">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}
