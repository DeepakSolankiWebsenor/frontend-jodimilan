import { useRouter } from "next/router";

export default function PaymentFailed() {
  const router = useRouter();
  const { order } = router.query;

  return (
    <div className="text-center p-20">
      <h1 className="text-red-600 text-3xl">Payment Failed ❌</h1>
      {order && <p className="mt-3 text-gray-700">Order ID: {order}</p>}
      <button
        className="mt-5 bg-primary text-white px-4 py-2 rounded"
        onClick={() => router.push("/membership")}
      >
        Try Again
      </button>
    </div>
  );
}
