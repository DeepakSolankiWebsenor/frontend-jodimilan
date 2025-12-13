import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useRouter } from "next/router";
import Head from "next/head";

function Membership() {
  const [data, setData] = useState([]);
  const { getPackages, createOrder, getCurrentPlan } = useApiService();
  const dataFetchedRef = useRef(false);

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("");
  const [currentPlanData, setCurrentPlanData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Fetch Packages
  const getPackagesData = () => {
    getPackages()
      .then((res) => {
        if (res.data.code === 200) setData(res.data.data || []);
      })
      .catch((err) => console.log("getPackages error =>", err));
  };

  // Fetch current user's active plan
  const getCurrentPlanDetail = () => {
    getCurrentPlan()
      .then((res) => {
        console.log("getCurrentPlan res =>", res);
        if (res.data.code === 200 && res.data.data) {
          const plan = res.data.data;

          setCurrentPlanData({
            package_id: Number(plan.package_id),
            expiry: plan.expiry,
            package: plan.package,
            remaining_days:
              Math.ceil(
                (new Date(plan.expiry).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              ) || 0,
          });
        }
      })
      .catch((err) => console.log("getCurrentPlan error =>", err));
  };

  // Init
  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      getCurrentPlanDetail();
    }

    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getPackagesData();
  }, []);

  // Handle Payment
  const handlePay = () => {
    if (!isLoggedIn) return router.push("/Login");
    if (!planData) return setError("Please select a plan");

    setError("");
    setLoading(true);

    createOrder({ total: planData.package_price, package_id: planData.id })
      .then(async (res) => {
        if (res.data.code === 200) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          document.body.appendChild(script);

          script.onload = () => {
            const {
              razorpay_order_id,
              order_number,
              total,
              name,
              email,
              phone,
            } = res.data.data;

            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: total * 100,
              currency: "INR",
              name: "Jodi Milan",
              description: "Membership Package",
              order_id: razorpay_order_id,
              handler: () => {
                router.push(`/payment-success?order=${order_number}`);
              },
              prefill: { name, email, contact: phone },
              theme: { color: "#C32148" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);
          };
        }
      })
      .catch(() => setLoading(false));
  };



  console.log("currentPlanData =>", currentPlanData);
  return (
    <div>
      <Head>
        <title>Membership Plans - JodiMilan</title>
        <meta
          name="description"
          content="Find your perfect match. Safe & Verified members only."
        />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="info">
          Redirecting to payment...
        </Alert>
      </Snackbar>

      <h2 className="text-center pt-10 text-3xl md:text-4xl text-[#333] font-semibold">
        <span className="text-primary">Membership</span> Plan
      </h2>

      <div className="w-full px-3 md:px-24 py-10 md:flex gap-6">
        {/* LEFT — PLANS */}
        <div className="w-full md:w-2/3">
          {data.length === 0 && (
            <div className="text-gray-500 text-center py-10">
              No plans available.
            </div>
          )}

          {data.map((item) => {
            const isCurrentPlan =
              currentPlanData &&
              item.id === currentPlanData.package_id &&
              new Date(currentPlanData.expiry) > new Date();

            const isSelected = planData?.id === item.id;

            return (
              <label
                key={item.id}
                onClick={() => !isCurrentPlan && setPlanData(item)}
                className={`grid grid-cols-2 sm:grid-cols-4 border border-gray-600 rounded-md mb-4 transition cursor-pointer
                  ${isCurrentPlan ? "opacity-50" : "hover:shadow-md"}
                  ${isSelected ? "ring-2 ring-primary" : ""}
                `}
              >
                {/* Title */}
                <div className="bg-gray-600 col-span-2 sm:col-span-1 text-white text-center flex items-center justify-center rounded-l-md p-3">
                  <span className="font-medium">{item.package_title}</span>
                </div>

                {/* Views */}
                <div className="bg-gray-50 text-center p-3">
                  <p className="text-xs">View</p>
                  <p className="text-lg font-semibold text-primary">
                    {item.total_profile_view}
                  </p>
                  <p className="text-xs">Contacts</p>
                </div>

                {/* Validity */}
                <div className="bg-gray-100 text-center p-3">
                  <p className="text-xs">Validity</p>
                  <p className="text-lg font-semibold text-primary">
                    {item.package_duration}
                  </p>
                  <p className="text-xs">Days</p>
                </div>

                {/* Price + Radio */}
                <div className="bg-gray-50 text-center flex items-center justify-between p-3 rounded-r-md gap-2">
                  <div>
                    <div className="font-semibold flex items-center justify-center gap-1">
                      <CurrencyRupeeIcon fontSize="small" />
                      {item.package_price}
                    </div>

                    {isCurrentPlan && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Current Plan
                      </p>
                    )}
                  </div>

                  <input
                    type="radio"
                    name="package"
                    value={item.id}
                    checked={isSelected}
                    disabled={isCurrentPlan}
                    onChange={() => setPlanData(item)}
                    className="cursor-pointer"
                  />
                </div>
              </label>
            );
          })}
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="w-full md:w-1/3">
          <div className="border rounded-md bg-white shadow-sm">
            <div className="bg-gray-600 rounded-t text-center text-white p-2 font-medium">
              Plan Summary
            </div>

            <div className="p-4">
              {currentPlanData && (
                <div className="bg-green-50 p-3 border border-green-400 rounded-md mb-4">
                  <p className="font-semibold text-green-700">Current Plan:</p>
                  <p className="text-sm">
                    {currentPlanData.package.package_title}
                  </p>
                  <p className="text-xs mt-1 text-gray-700">
                    Remaining Days:{" "}
                    <span className="font-semibold">
                      {currentPlanData.remaining_days} Days
                    </span>
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 font-semibold text-sm">{error}</p>
              )}

              <div className="border-t pt-3 text-sm">
                <span className="font-semibold">
                  {planData?.package_price || 0} Rs.
                </span>{" "}
                for {planData?.package_duration || 0} Days
              </div>
            </div>

            <div className="bg-gray-600 rounded-b p-2 flex justify-between items-center text-white">
              <div className="text-center">
                <p className="text-sm">Total Payable</p>
                <p className="text-xl">₹ {planData?.package_price || 0}</p>
              </div>

              <button
                className="bg-primary px-4 py-2 rounded-md font-medium disabled:opacity-50"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;
