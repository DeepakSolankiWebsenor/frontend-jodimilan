/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";
import WomenD from "../public/images/girldefault.png";
import MenD from "../public/images/mendefault.png";
import Head from "next/head";
import CircularLoader from "../components/common-component/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import MembershipPopup from "../components/common-component/MembershipPopup";
import { decrypted_key } from "../services/appConfig";

const InterestReceiveAccept = () => {
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const { acceptedRequests } = useApiService();
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const masterData = useSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  const getAcceptedRequestData = () => {
    acceptedRequests()
      .then((res) => {
        console.log("API RESPONSE:", res?.data);

        if (res?.data?.success === true || res?.data?.code === 200) {
          setData(res?.data?.data);
        } else {
          toast.error("Failed to load data");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong!");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) getAcceptedRequestData();
    else router.push("/Login");
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
      console.error("❌ Failed to decrypt master user in InterestReceiveAccept:", error);
    }
  }, [masterData]);

  const handleNavigateToProfile = (id) => {
    const hasMembership = currentUser?.package_id || currentUser?.package;
    if (!hasMembership) {
      setShowMembershipPopup(true);
      return;
    }
    router.push(`/profile/profile-detail/${id}`);
  };

  const renderCard = (user, key) => {
    const imgSrc = user?.profile_photo
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profile_photo}`
      : user?.gender === "Male"
      ? MenD.src
      : WomenD.src;

    return (
      <div
        key={key}
        className="w-full bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(11,76,133,0.15)] hover:-translate-y-1"
      >
        <div className="flex-shrink-0 relative group">
          <div className="absolute inset-0 rounded-full bg-[#0b4c85] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <img
            src={imgSrc}
            alt="profile"
            className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#0b4c85] transition-colors">
              {user?.name} {user?.last_name || ""}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              ID: <span className="text-[#0b4c85]">{user?.ryt_id}</span>
            </p>
          </div>
          
          {user?.age && (
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full border border-gray-100">
                {user.age} Years Old
              </span>
            </div>
          )}
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
  };

  return (
    <>
      <Head>
        <title>Interests Received Accepted - JodiMilan</title>
        <meta name="description" content="100% verified profiles - JodiMilan" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <MembershipPopup
        open={showMembershipPopup}
        onClose={() => setShowMembershipPopup(false)}
        message="Without membership not able to see view details"
      />

      <div className="w-full min-h-[400px] px-4 lg:px-20 pb-10">
        <h1 className="text-center text-2xl font-medium text-[#0b4c85] my-5">
          Interests Received Accepted
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <CircularLoader />
          </div>
        ) : data?.received?.length > 0 ? (
          data.received.map((item, index) => renderCard(item.user, index))
        ) : (
          <div className="font-semibold text-lg text-gray-500 text-center mt-10">
            No Data Found!
          </div>
        )}
      </div>
    </>
  );
};

export default InterestReceiveAccept;
