import React, { useEffect, useState } from "react";
import Image from "next/image";
import WomenD from "../../../public/images/girldefault.png";
import MenD from "../../../public/images/mendefault.png";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import MembershipPopup from "../MembershipPopup";
import { decrypted_key } from "../../../services/appConfig";

const Usercard = ({ item, index, className }) => {
  const profile = item.userprofile || item.profile || {};
  const { height, occupation, birthCity, photo_privacy } = profile;
  const profile_img_src = item?.profile_photo || profile?.profile_image || null;

  const [user, setUser] = useState(false);
  const [showMembershipPopup, setShowMembershipPopup] = useState(false);
  const router = useRouter();

  // Logged-in user data from redux
  const masterData = useSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
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
      } catch (err) {
        // Not JSON-in-Base64, ignore and try next method
      }

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
        } catch (err) {
          // Both methods failed
        }
      }

      if (decryptedText) {
        // Extract clean JSON
        const jsonStartIndex = decryptedText.indexOf("{");
        const jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
        if (jsonStartIndex >= 0 && jsonEndIndex > 0) {
          const jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          const parsed = JSON.parse(jsonData.trim());
          console.log("💎 DECRYPTED USER IN USERCARD:", parsed);
          setCurrentUser(parsed);
        }
      }
    } catch (error) {
      console.error("❌ Failed to decrypt master user in Usercard:", error);
    }
  }, [masterData]);


  const handleNavigateToProfile = (id) => {
    if (!user) {
      router.push("/Login");
      return;
    }

    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <React.Fragment>
      <MembershipPopup
        open={showMembershipPopup}
        onClose={() => setShowMembershipPopup(false)}
        message="Without membership not able to see view details"
      />
      <div
        key={index}
        className={`h-[500px]  ${className} cursor-pointer rounded-md border-2 sm:w-full w-80 mb-6 hover:shadow-lg `}
        onClick={() => handleNavigateToProfile(item?.ryt_id)}
      >
        <div className="flex justify-center ">
          {profile_img_src ? (
            <img
              src={profile_img_src}
              height={100}
              width={100}
              alt="ss"
              className="md:w-[270px] w-64 md:h-[240px] h-48"
              style={{
                filter: photo_privacy === "No" ? "blur(2px)" : "",
              }}
            />
          ) : (
            <Image
              src={item?.gender === "Male" ? MenD : WomenD}
              height={100}
              width={100}
              alt="ss"
              className="md:w-[230px] w-52 md:h-[240px] h-48 py-2 mx-auto"
            />
          )}
        </div>
        <div className="px-4 text-gray-700 mt-2">
          <div className="font-semibold text-[20px]">
            {item.name}
            {item.last_name ? ` ${item.last_name}` : ""} ({item.ryt_id || "--"})
          </div>
          <div className="my-1 font-medium text-[15px]">
            Height :<span className="font-semibold ml-1">{height || "--"}</span>
          </div>
          <div className="my-1 lineLimit font-medium text-[16px]">
            Clan :
            <span className="font-semibold ml-1">
              {item?.profile?.gothra || "--"}
            </span>
          </div>
          <div className="my-1 font-medium text-[15px]">
            Age :<span className="font-semibold ml-1">{item?.age || "--"}</span>
          </div>
          <div className="my-1 font-medium whitespace-nowrap truncate text-[15px]">
            Occupation :
            <span className="font-semibold ml-1">{occupation || "--"}</span>
          </div>
          <div className="my-1  font-medium text-[15px]">
            Marital Status :
            <span className="font-semibold ml-1">
              {item.mat_status || "--"}
            </span>
          </div>
          <div className="my-1 font-medium text-[15px]">
            Location :
            <span className="font-semibold ml-1">
              {item?.city_name + ", " + (item?.state_name) || "--"}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Usercard;

