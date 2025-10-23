/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

const InterestReceivePending = () => {
  const [data, seteData] = useState([]);
  const { getFriendRequest, acceptRequest, declineRequest, sessionCreate } =
    useApiService();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dataFetchedRef = useRef(false);
  const masterData = useSelector((state) => state.user);

  const getFriendRequestData = () => {
    getFriendRequest()
      .then((res) => {
        if (res?.data?.status === 200) {
          var encrypted_json = JSON.parse(atob(res?.data?.users));
          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          );
          var decryptedText = dec.toString(CryptoJS.enc.Utf8);
          var jsonStartIndex = decryptedText.indexOf("[");
          var jsonEndIndex = decryptedText.lastIndexOf("]") + 1;
          var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          jsonData.trim();
          const parsed = JSON.parse(jsonData);

          seteData(parsed);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      getFriendRequestData();
    } else {
      router.push("/Login");
    }
  }, []);

  const handleAcceptRequest = (id, session_id) => {
    acceptRequest(id)
      .then((res) => {
        if (res?.data?.status === 200) {
          getFriendRequestData();
          setAlertMsg(res?.data?.message);
          setAlert(true);
          const _form = new FormData();
          _form.append("friend_id", session_id);
          sessionCreate(_form).then((response) => {});
          // handleSessionCreate(session_id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeclineRequest = (id) => {
    declineRequest(id).then((res) => {
      getFriendRequestData();
      setAlert(true);
      setAlertMsg("Friend Request Decline Successfully");
    });
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title> Interests Received Pending - MyShaadi</title>
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
        <Alert icon={<ThumbUpAltIcon />} severity={"success"}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <div className="w-[100%] min-h-[400px]">
        <div className="text-center my-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Interests Received Pending
          </div>
        </div>

        <div className="px-4 md:px-2 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.length > 0 ? (
            data?.map((item) => {
              const {
                height,
                birth_city,
                birth_state,
                educations,
                annual_income,
                occupation,
                profile_img_src,
                photo_privacy,
              } = item?.users?.userprofile || {};

              return (
                <>
                  <div
                    className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between"
                    key={item?.id}
                  >
                    <div className="flex md:items-center lg:items-center items-start gap-5">
                      <div className="w-[30%] lg:w-auto md:w-auto">
                        {profile_img_src ? (
                          <img
                            src={profile_img_src}
                            alt="asd"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                            style={{
                              filter: photo_privacy === "No" ? "blur(3px)" : "",
                            }}
                          />
                        ) : (
                          <Image
                            src={
                              item?.friends?.gender === "Male" ? MenD : WomenD
                            }
                            height={150}
                            width={150}
                            alt="sf"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                          />
                        )}
                      </div>
                      <div className="w-[70%] lg:w-auto md:w-auto">
                        <div className="text-gray-700 font-semibold text-lg">
                          {item?.users?.ryt_id || "RYT_ID"}
                        </div>
                        <div className="text-gray-600 font-medium mt-2">
                          {item?.users?.age && <span>{item?.users?.age},</span>}
                          {height && <span className="ml-1">{height},</span>}
                          {birth_city?.name && (
                            <span className="ml-1">{birth_city?.name},</span>
                          )}
                          {birth_state?.name && (
                            <span className="ml-1">{birth_state?.name},</span>
                          )}
                        </div>
                        <div className="text-gray-600 font-medium mt-2">
                          {educations && <span>{educations},</span>}
                          {annual_income && (
                            <span className="ml-1">Rs. {annual_income},</span>
                          )}
                          {occupation && (
                            <span className="ml-1">{occupation},</span>
                          )}
                          {item?.users?.mat_status && (
                            <span className="ml-1">
                              {item?.users?.mat_status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:block lg:block flex items-center gap-4 justify-end">
                      <div className="text-gray-600 font-medium">
                        {item?.created_date}
                      </div>
                      <button
                        className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                        onClick={() => handleNavigateToProfile(item?.users?.encrypted_user_id)}
                      >
                        View Profile
                      </button>
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            handleAcceptRequest(item.id, item.users.id)
                          }
                        >
                          <Tooltip title="Accept" arrow>
                            <CheckOutlinedIcon className="text-[30px] text-[green]" />
                          </Tooltip>
                        </button>
                        <button onClick={() => handleDeclineRequest(item.id)}>
                          <Tooltip title="Decline" arrow>
                            <ClearOutlinedIcon className="ml-1 text-[30px] text-[#9f2020]" />
                          </Tooltip>
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className="border-[1px solid] w-full my-3" />
                </>
              );
            })
          ) : (
            <div className="mt-10 font-semibold lg:text-[30px] text-lg text-gray-500 text-center">
              No Data found !
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterestReceivePending;
