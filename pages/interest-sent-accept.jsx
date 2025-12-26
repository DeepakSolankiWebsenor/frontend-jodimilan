/* eslint-disable @next/next/no-img-element */
import { shouldShowPhoto } from "../utils/PrivacyUtils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import MembershipPopup from "../components/common-component/MembershipPopup";
import { decrypted_key } from "../services/appConfig";

const InterestSentAccept = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sent: [], received: [] });
  const { acceptedRequests } = useApiService();
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const masterData = useSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  const getAcceptedRequestData = () => {
    acceptedRequests()
      .then((res) => {
        console.log("Sent Accepted API:", res.data);
        if (res?.data?.success === true) {
          setData(res?.data?.data);
        } else {
          toast.error("Failed to load data");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      getAcceptedRequestData();
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
      console.error("❌ Failed to decrypt master user in InterestSentAccept:", error);
    }
  }, [masterData]);

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title>Interests Sent Accepted - JodiMilan</title>
      </Head>

      <MembershipPopup
        open={showMembershipPopup}
        onClose={() => setShowMembershipPopup(false)}
        message="Without membership not able to see view details"
      />

        <div className="px-4 lg:px-20 pb-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.sent?.length > 0 ? (
            data.sent.map((item, index) => {
              const user = item.friend;
              let imgSrc;
              if (user?.profile_photo) {
                imgSrc = user.profile_photo.startsWith("http")
                  ? user.profile_photo
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profile_photo}`;
              } else {
                imgSrc = user?.gender === "Male" ? MenD.src : WomenD.src;
              }

              return (
                 <div
                    key={index}
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

                    <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
                         <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#0b4c85] transition-colors">
                                {user?.name}
                            </h3>
                            <p className="text-sm text-primary font-semibold mb-1">
                                {user?.ryt_id || "N/A"}
                            </p>
                            <div className="text-xs text-gray-500 space-y-0.5 font-medium">
                                {user?.age && <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100">{user.age} Years Old</span>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                        <button
                            className="w-full sm:w-auto bg-[#0b4c85] text-white text-sm font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-[#093d6b] hover:shadow-xl hover:shadow-[#0b4c85]/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                            onClick={() => handleNavigateToProfile(user.ryt_id)}
                        >
                            <span>View Profile</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                 </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <div className="text-xl font-semibold">No Accepted Sent Interests</div>
                <p className="text-sm">Interests you send that get accepted will appear here.</p>
            </div>
          )}
        </div>
    </>
  );
};

export default InterestSentAccept;
