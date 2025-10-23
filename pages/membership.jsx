import React, { Fragment, useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SmsFailedIcon from "@mui/icons-material/SmsFailed";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Dialog, Transition } from "@headlessui/react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useRouter } from "next/router";
import Head from "next/head";
import { payment_url } from "../services/appConfig";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

function Membership() {
  const [data, setData] = useState([]);
  const {
    getPackages,
    planSubscribe,
    createOrder,
    orderCheckout,
    getCurrentPlan,
  } = useApiService();
  const dataFetchedRef = useRef(false);
  const [planData, setPlanData] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const cancelButtonRef = useRef();
  const [error, setError] = useState("");
  const [checkoutShow, setCheckoutShow] = useState(true);
  const [checkoutData, setCheckoutData] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [encryptedOrderId, setEncryptedOrderId] = useState("");
  const [pusherData, setPusherData] = useState(null);
  const [currentPlanData, setCurrentPlanData] = useState(null);

  const getPackagesData = () => {
    getPackages()
      .then((res) => {
        if (res.data.code === 200) {
          setData(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCurrentPlanDetail = () => {
    getCurrentPlan()
      .then((res) => {
        var encrypted_json = JSON.parse(atob(res?.data?.data));
        var dec = CryptoJS.AES.decrypt(
          encrypted_json.value,
          CryptoJS.enc.Base64.parse(decrypted_key),
          {
            iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
          }
        );

        var decryptedText = dec.toString(CryptoJS.enc.Utf8);
        var jsonStartIndex = decryptedText.indexOf("{");
        var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
        var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
        jsonData.trim();
        const parsed = JSON.parse(jsonData);

        setCurrentPlanData(parsed);
      })
      .catch((error) => console.log(error));
  };

  console.log(currentPlanData, "currentPlanData");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      getCurrentPlanDetail();
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getPackagesData();
  }, []);

  const paymentListner = (id) => {
    let PusherClient = new Pusher("6ff945b69651927a0a68", {
      cluster: "ap2",
      wsHost: "api.royalthikana.com",
      wsPort: "9001",
      wssHost: "api.royalthikana.com",
      wssPort: "9001",
      enabledTransports: ["ws", "wss"],
      forceTLS: false,
    });

    const channel = PusherClient.subscribe("CCAvenue");

    const echo = new Echo({
      broadcaster: "pusher",
      client: PusherClient,
    });

    const data1s = echo
      .channel(`CcavenueStatus.${id}`)
      .listen("CCAvenue", (ev) => {
        setPusherData(ev?.data);
      });

    echo.channel(`CcavenueStatus.${id}`).listen("CCAvenue", async (e) => {});
  };

  const handlePay = () => {
    if (isLoggedIn) {
      if (planData === "") {
        setError("Please Select Plan");
      } else {
        setError("");
        setLoading(true);
        let params = {
          total: planData.package_price,
          package_id: planData.id,
        };
        createOrder(params)
          .then((res) => {
            if (res.data.code === 200) {
              setEncryptedOrderId(res?.data?.data?.encrypted_order_id);
              setCheckoutData(res?.data?.data);
              // setConfirmModal(true);
              window.open(
                payment_url + res?.data?.data?.encrypted_order_id,
                "_blank"
              );
              paymentListner(res?.data?.data?.id);
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      }
    } else {
      router.push("/Login");
    }
  };

  return (
    <div>
      <Head>
        <title>Membership Plans - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/Logo.png" />
      </Head>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Plan suscribe Successfully !
        </Alert>
      </Snackbar>

      <div className="text-center pt-10">
        <div className="text-4xl text-[#333] font-medium">
          <span className="text-[#aa0000]">Membership</span> Plan
        </div>
      </div>

      {confirmModal && (
        <Transition.Root show={confirmModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative"
            initialFocus={cancelButtonRef}
            onClose={setConfirmModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div
                className="flex min-h-full items-end justify-center p-4 text-center 
                sm:items-center sm:p-0"
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    className="relative transform overflow-hidden rounded-lg bg-white text-left
                    shadow-xl transition-all sm:my-8 max-h-[800px] h-full max-w-[60%] w-full"
                  >
                    <iframe
                      className="w-full h-[600px]"
                      src={payment_url + encryptedOrderId}
                    ></iframe>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      <div className="md:flex md:px-24 px-2 py-10">
        <div className="md:w-[65%] md:pr-14">
          {data.map((item, index) => {
            let is_corrent_plan = false;
            if (
              item?.id == currentPlanData?.user?.pacakge_id &&
              !currentPlanData?.user?.plan_expire
            ) {
              is_corrent_plan = true;
            } else {
              is_corrent_plan = false;
            }

            return (
              <label
                className={`flex border border-gray-600 rounded-md mb-5 ${
                  is_corrent_plan ? "" : "cursor-pointer"
                }`}
                key={index}
              >
                <div className="bg-gray-600 rounded-l-md border-r w-1/4 flex justify-center items-center">
                  <div className="md:text:md text-sm text-white font-medium py-2 px-6">
                    {item.package_title}
                  </div>
                </div>
                <div className="bg-gray-50 border-r text-gray-600 w-1/4 text-center p-2">
                  <div>View</div>
                  <div className="text-xl font-medium text-[#aa0000]">
                    {item.total_profile_view}
                  </div>
                  <div>Contacts</div>
                </div>
                <div className="bg-gray-100 border-r text-gray-600 w-1/4 text-center p-2">
                  <div>Validity</div>
                  <div className="text-xl font-medium text-[#aa0000]">
                    {item.package_duration}
                  </div>
                  <div>Days</div>
                </div>
                <div className="bg-gray-50 text-gray-600 w-1/4 text-center flex items-center justify-between py-2 px-4 rounded-r-md">
                  <div>
                    <div className="text-base md:text-2xl text-gray-800">
                      {item.package_price}
                      <CurrencyRupeeIcon className="text-gray-600" />
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="package"
                    className="cursor-pointer"
                    disabled={is_corrent_plan ? true : false}
                    onChange={() => setPlanData(item)}
                  />
                </div>
              </label>
            );
          })}

          <div className="mt-10 border border-gray-600 rounded-md md:mb-0 mb-10 hidden">
            <div className="border-b border-gray-600 p-2 bg-[#2495f611] text-center rounded-t-md">
              <div className="text-gray-800 font-medium text-xl">
                Bank Account Details
              </div>
            </div>
            <div className="text-gray-800">
              <div className="p-2 bg-gray-50">
                <div className="">
                  Account Name :
                  <span className="font-medium">
                    MyShaadi Infotech Pvt. Ltd.
                  </span>
                </div>
              </div>
              <div className="p-2 bg-gray-100">
                <div className="">
                  Bank: <span className="font-medium">ICICI Bank</span>
                </div>
              </div>
              <div className="p-2 bg-gray-50">
                <div className="">
                  Acct. Number:
                  <span className="font-medium">629605015035</span>
                </div>
              </div>
              <div className="p-2 bg-gray-100">
                <div className="">
                  IFSC Code: <span className="font-medium">ICIC0006296</span>
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded-b-md">
                <div className="">
                  Address:
                  <span className="font-medium">
                    Vikaspuri, New Delhi - 110018
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {pusherData ? (
          <div className="md:w-[35%] border h-fit p-3 text-center">
            <div className="flex justify-center">
              {pusherData?.order_status === "Success" ? (
                <CheckCircleIcon
                  sx={{ height: 100, width: 100, color: "#2ece2e" }}
                />
              ) : pusherData?.order_status === "Failure" ? (
                <SmsFailedIcon sx={{ height: 100, width: 100, color: "red" }} />
              ) : (
                <FeedbackIcon
                  sx={{ height: 100, width: 100, color: "orange" }}
                />
              )}
            </div>
            <div className="mt-3 font-semibold text-[22px]">
              {pusherData?.order_status === "Success"
                ? "Payment is processed successfully."
                : pusherData?.order_status === "Failure"
                ? "Your payment has failed."
                : "Your payment has been aborted."}
            </div>
            <div className="text-gray-700 mt-1 font-medium">
              {pusherData?.order_status === "Success" &&
                "Thanks for purchasing the package."}

              {pusherData?.order_status !== "Aborted" && (
                <div className="mt-1">
                  Transaction ID: {pusherData?.tracking_id}
                </div>
              )}

              {pusherData?.order_status !== "Success" && (
                <div className="mt-1">
                  <button
                    className="bg-[#aa0000] outline-none text-white text-sm font-semibold 
                  rounded-md py-2 px-4 cursor-pointer"
                    onClick={() => setPusherData(null)}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="md:w-[35%]">
            <div className="border rounded-md">
              <div className="rounded-t bg-gray-600">
                <div className="p-2 text-white text-center">
                  Add Highlighter Plan
                </div>
              </div>
              <div>
                <div className="p-4">
                  <div className="text-sm pb-4">
                    <div>Greater Visibility</div>
                    <div>
                      Get more responses (from people searching profiles like
                      yours)
                    </div>
                    <div>Get Highlighted to relevant Matches</div>
                    <div>
                      Feature on top of Search Results(based on search criteria)
                    </div>
                  </div>

                  {currentPlanData?.user?.plan_expire && (
                    <div className="my-2 text-sm text-red-600 font-semibold">
                      Your plan has been expired.
                    </div>
                  )}

                  {currentPlanData && (
                    <div className="my-3">
                      <div className="font-semibold">Current Plan</div>
                      <div className="mt-2 flex gap-3">
                        <div className="font-medium">Package Name : </div>
                        <div> {currentPlanData?.package_title} </div>
                      </div>
                      <div className="mt-2 flex gap-3">
                        <div className="font-medium">Remaining Days : </div>
                        <div>
                          {currentPlanData?.user?.remaining_days} Days Left
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t font-medium flex justify-end pt-2 text-sm">
                    <div className="ml-2">
                      {planData?.package_price || 0} Rs. for
                      <span className="ml-1">
                        {planData?.package_duration || 0} days.
                      </span>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 font-semibold text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-600 rounded-b">
                <div className="flex justify-between text-white p-2">
                  <div className="text-center">
                    <div className="text-sm">Total Payable (Incl. 18% GST)</div>
                    <div className="text-xl">
                      Rs. {planData?.package_price || 0}
                    </div>
                  </div>
                  <div className="flex justify-center items-center pr-6">
                    <button
                      className="bg-[#aa0000] outline-none text-white text-sm font-semibold rounded-md py-2 px-4 cursor-pointer"
                      onClick={handlePay}
                    >
                      {loading ? (
                        <CircularProgress size={20} color={"inherit"} />
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Membership;
