import { useRouter } from "next/router";
import { useEffect } from "react";
import useApiService from "../services/ApiService";

export default function PaymentStatusChecker() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const { getOrderDetails } = useApiService();

  useEffect(() => {
    if (!orderNumber) return;

    const interval = setInterval(() => {
      getOrderDetails(orderNumber).then((res) => {
        const order = res.data.data;

        if (order.payment_status === "Paid") {
          clearInterval(interval);
          router.push(`/thank-you?order=${order.order_number}`);
        }

        if (order.payment_status === "Unpaid" && order.status === "Cancelled") {
          clearInterval(interval);
          router.push(`/payment-failed?order=${order.order_number}`);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [orderNumber]);

  return (
    <h2 className="text-center mt-10">Processing your secure payment...</h2>
  );
}
