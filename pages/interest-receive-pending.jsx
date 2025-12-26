/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { shouldShowPhoto } from "../utils/PrivacyUtils";
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
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../services/redux/slices/notificationSlice";
import CryptoJS from "crypto-js";
import MembershipPopup from "../components/common-component/MembershipPopup";
import { decrypted_key } from "../services/appConfig";

const InterestReceivePending = () => {
  const [data, setData] = useState([]);
  const { getFriendRequest, acceptRequest, declineRequest, sessionCreate } =
    useApiService();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const masterData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

  const getFriendRequestData = () => {
    getFriendRequest()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
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

  // Decrypt current user data
  useEffect(() => {
    try {
      const raw = masterData?.user?.user || masterData?.user;
      if (!raw) return;

      if (typeof raw === "object") {
        setCurrentUser(raw);
        return;
      }

      let decryptedText = "";

      // 🔥 Method 1: Laravel-style JSON (Base64 -> JSON {value, iv})
      try {
        const decoded = window.atob(raw);
        if (decoded.trim().startsWith("{")) {
          const encrypted_json = JSON.parse(decoded);
          if (encrypted_json.value && encrypted_json.iv) {
            const dec = CryptoJS.AES.decrypt(
              encrypted_json.value,
              CryptoJS.enc.Base64.parse(decrypted_key),
              { iv: CryptoJS.enc.Base64.parse(encrypted_json.iv) }
            );
            decryptedText = dec.toString(CryptoJS.enc.Utf8);
          }
        }
      } catch (err) {}

      // 🔥 Method 2: Simple Ciphertext (Fixed IV from .env)
      if (!decryptedText) {
        try {
          const keyHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_KEY);
          const ivHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_IV);
          const dec = CryptoJS.AES.decrypt(raw, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          decryptedText = dec.toString(CryptoJS.enc.Utf8);
        } catch (err) {}
      }

      if (decryptedText) {
        const jsonStartIndex = decryptedText.indexOf("{");
        const jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
        if (jsonStartIndex >= 0 && jsonEndIndex > 0) {
          const jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          setCurrentUser(JSON.parse(jsonData.trim()));
        }
      }
    } catch (error) {
      console.error("❌ Failed to decrypt master user in InterestReceivePending:", error);
    }
  }, [masterData]);

  const handleAcceptRequest = (id, session_id) => {
    acceptRequest(id)
      .then((res) => {
        if (res?.data?.code === 200) {
          getFriendRequestData();
          dispatch(fetchNotifications());
          setAlertMsg(res?.data?.message || "Request Accepted");
          setAlert(true);

          sessionCreate({ friend_id: session_id });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeclineRequest = (id) => {
    declineRequest(id)
      .then((res) => {
        if (res?.data?.code === 200) {
          getFriendRequestData();
          setAlertMsg("Friend Request Declined Successfully");
          setAlert(true);
        }
      })
      .catch(console.log);
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title>Interests Received Pending - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <MembershipPopup
        open={showMembershipPopup}
        onClose={() => setShowMembershipPopup(false)}
        message="Without membership not able to see view details"
      />

      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          {alertMsg}
        </Alert>
      </Snackbar>

      <div className="w-[100%] min-h-[400px]">
        <div className="text-center my-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Interests Received Pending
          </div>
        </div>

        <div className="px-4 lg:px-20 pb-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.length > 0 ? (
            data.map((item) => {
              // Prioritize 'friend' object as per API sample, fallback to 'user'
              const user = item?.friend || item?.user || {};
              const profile = user?.profile || {};
              
              let imgSrc;
              if (user?.profile_photo) {
                  imgSrc = user.profile_photo.startsWith("http") 
                      ? user.profile_photo 
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profile_photo}`;
              } else if (profile?.profile_image) {
                   imgSrc = profile.profile_image.startsWith("http")
                      ? profile.profile_image
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.profile_image}`;
              } else {
                  imgSrc = user?.gender === "Male" ? MenD.src : WomenD.src;
              }

              return (
                 <div
                    key={item?.id}
                    className="w-full bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(11,76,133,0.15)] hover:-translate-y-1"
                  >
                    <div className="flex-shrink-0 relative group">
                        <div className="absolute inset-0 rounded-full bg-[#0b4c85] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <img
                            src={imgSrc}
                            alt="Profile"
                            className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                            style={{
                                filter: shouldShowPhoto(user, currentUser, 'friend') ? "none" : "blur(5px)",
                            }}
                        />
                    </div>

                    <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5 w-full">
                         <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#0b4c85] transition-colors truncate">
                                {user?.name} {user?.last_name || ""}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                ID: <span className="text-[#0b4c85]">{user?.ryt_id || "N/A"}</span>
                            </p>
                        </div>

                         <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-600">
                             {user?.age && (
                                <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 font-semibold">
                                    {user.age} Years
                                </span>
                             )}
                              {profile?.height && (
                                <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 font-semibold">
                                    {profile.height}
                                </span>
                             )}
                              {(profile?.birthCity?.name || profile?.birthState?.name) && (
                                <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 font-semibold truncate max-w-[150px]">
                                    {profile?.birthCity?.name}{profile?.birthCity?.name && profile?.birthState?.name ? ", " : ""}{profile?.birthState?.name}
                                </span>
                             )}
                         </div>
                    </div>

                    <div className="mt-2 sm:mt-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                        <button
                            className="w-full sm:w-auto bg-[#0b4c85] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg hover:bg-[#093d6b] hover:shadow-xl hover:shadow-[#0b4c85]/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                            onClick={() => handleNavigateToProfile(user?.ryt_id)}
                        >
                            <span>View Profile</span>
                        </button>

                        <div className="flex items-center gap-2">
                             <Tooltip title="Accept Interest" arrow>
                                <button
                                    onClick={() => handleAcceptRequest(item.id, user.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <CheckOutlinedIcon fontSize="small" />
                                </button>
                            </Tooltip>
                            <Tooltip title="Decline Interest" arrow>
                                <button
                                    onClick={() => handleDeclineRequest(item.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <ClearOutlinedIcon fontSize="small" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                 </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <div className="text-xl font-semibold">No Pending Interests</div>
                <p className="text-sm">New requests will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterestReceivePending;
