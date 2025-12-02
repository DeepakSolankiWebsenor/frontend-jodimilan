import { useRouter } from "next/router";
import { useEffect } from "react";
import useApiService from "@/services/ApiService";


export default function CheckoutPage() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const { getOrderDetails } = useApiService();

  useEffect(() => {
    if (!orderNumber) return;

    getOrderDetails(orderNumber).then((res) => {
      const order = res.data.data;
      loadRazorpay(order);
    });
  }, [orderNumber]);

  const loadRazorpay = (order) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.total * 100,
        currency: "INR",
        order_id: order.razorpay_order_id,
        name: "Membership Payment",
        description: "Secure Payment",
        prefill: { name: order.name, email: order.email, contact: order.phone },

        handler: () => {
          // Redirect user to status watcher page
          router.push(`/payment-status/${order.order_number}`);
        },

        modal: {
          ondismiss: () => {
            router.push(`/payment-failed?order=${order.order_number}`);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    document.body.appendChild(script);
  };

  return <h2 className="text-center m-10">Redirecting...</h2>;
}
