/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import MembershipPopup from "../components/common-component/MembershipPopup";
import { decrypted_key } from "../services/appConfig";

const InterestSentPending = () => {
  const [data, setData] = useState([]);
  const { sentFriendRequest, declineRequest } = useApiService();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const masterData = useSelector((state) => state.user);

  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getSentFriendRequestData = () => {
    sentFriendRequest()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getSentFriendRequestData();
    else router.push("/Login");
  }, [alertMsg]);

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
      console.error("❌ Failed to decrypt master user in InterestSentPending:", error);
    }
  }, [masterData]);

  const handleDeclineRequest = (id) => {
    declineRequest(id).then(() => {
      setAlertMsg("Interest Removed Successfully");
      setAlert(true);
      getSentFriendRequestData();
    });
  };

  const handleNavigateToProfile = (id) => {
    const hasMembership = currentUser?.package_id || currentUser?.package;
    if (!hasMembership) {
      setShowMembershipPopup(true);
      return;
    }
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title>Interests Sent - JodiMilan</title>
      </Head>

      <MembershipPopup
        open={showMembershipPopup}
        onClose={() => setShowMembershipPopup(false)}
        message="Without membership not able to see view details"
      />

      {/* 🔔 Alert */}
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

        <div className="px-4 lg:px-20 pb-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.length > 0 ? (
            data.map((item) => {
              const user = item.friend;
              const profile = user?.profile || {};
              const imgSrc = profile?.profile_image 
                  ? profile.profile_image 
                  : (user?.gender === "Male" ? MenD.src : WomenD.src);

              return (
                 <div
                    key={item.id}
                    className="w-full bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(11,76,133,0.15)] hover:-translate-y-1"
                  >
                    <div className="flex-shrink-0 relative group">
                        <div className="absolute inset-0 rounded-full bg-[#0b4c85] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <img
                            src={imgSrc}
                            alt="Profile"
                            className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                            style={{
                                filter: profile?.photo_privacy === "No" ? "blur(3px)" : "none",
                            }}
                        />
                    </div>

                    <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5 w-full">
                         <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#0b4c85] transition-colors truncate">
                                {user?.name} {user?.last_name || ""}
                            </h3>
                            <p className="text-sm text-primary font-semibold mb-1">
                                {user?.ryt_id || "N/A"}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                            {user?.age && <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100">{user.age} Years Old</span>}
                             {(profile?.birthCity?.name || profile?.birthState?.name) && (
                                <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 truncate max-w-[200px]">
                                    {profile?.birthCity?.name || "City"}, {profile?.birthState?.name || "State"}
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
                           <Tooltip title="Cancel Interest" arrow>
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
                <div className="text-xl font-semibold">No Pending Sent Interests</div>
                <p className="text-sm">Interests you send will appear here.</p>
            </div>
          )}
        </div>
    </>
  );
};

export default InterestSentPending;
