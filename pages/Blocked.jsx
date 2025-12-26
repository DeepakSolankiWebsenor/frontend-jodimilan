/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Avatar from "../public/images/avtar.png";
import SidebarLayout from "../components/SidebarLayout";
import useApiService from "../services/ApiService";
import { Alert, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

import { shouldShowPhoto } from "../utils/PrivacyUtils";

const Blocked = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const { getBlockedUsers, unblockUser } = useApiService();
  const [alert, setAlert] = useState(false);
  const masterData = useSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getBlockedUsers()
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      console.error("❌ Failed to decrypt master user in Blocked:", error);
    }
  }, [masterData]);

  const handleUnblockUser = (id, block_profile_id) => {
    let params = {
      block_profile_id: block_profile_id,
      status: "No",
    };

    unblockUser(id, params)
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data);
          setAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          User Unblocked Successfully !
        </Alert>
      </Snackbar>

      <SidebarLayout>
        <div className="flex flex-col items-center mt-4 px-4">
          <div className="text-center mb-3">
            <div className="text-2xl font-medium text-[#0b4c85]">
              Blocked/Ignored {data?.length}
            </div>
            <div className="mt-2 text-gray-500 font-medium">
              Member blocked by you will appear here.
            </div>
          </div>

          {!data?.length && (
            <div className="my-4 font-semibold lg:text-[30px] text-lg text-gray-500">
              No user found in your Block List
            </div>
          )}

          {data?.map((item, index) => {
            const blockedUser = item?.blockedUser;
            const profile = blockedUser?.profile;
            
            const { ryt_id, age, name, last_name, gender, mat_status, profile_photo,state_name,city_name } = blockedUser || {};
            const {
              height,
              birth_city,
              educations,
              annual_income,
              occupation,
              profile_image
            } = profile || {};

            const displayImage = profile_photo || profile_image;

            return (
              <div key={index} className="w-full mb-3">
                <div className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between">
                  <div className="flex md:items-center lg:items-center items-start gap-4">
                    <div>
                      {displayImage ? (
                        <img
                          src={
                            displayImage?.startsWith("http")
                              ? displayImage
                              : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${displayImage}`
                          }
                          alt="profile"
                          className="lg:h-[150px] md:h-[150px] w-[150px] object-cover rounded-lg"
                          style={{
                            filter: shouldShowPhoto(blockedUser, currentUser, 'public') ? "none" : "blur(5px)",
                          }}
                        />
                      ) : (
                        <Image
                          src={Avatar}
                          height={150}
                          width={150}
                          alt="avatar"
                          className="lg:h-[150px] md:h-[150px] w-[150px] object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-700 font-semibold text-lg">
                        {name} {last_name} ({ryt_id || "RYT_ID"})
                      </div>
                      <div className="text-gray-600 font-medium mt-1">
                        {age && <span>{age} Years,</span>}
                        {gender && <span className="ml-1">{gender},</span>}
                        {height && <span className="ml-1">{height}</span>}
                      </div>
                      <div className="text-gray-600 font-medium mt-1">
                        {educations && <span>{educations},</span>}
                        {occupation && <span>{occupation},</span>}
                        {annual_income && (
                          <span className="ml-1">{annual_income}</span>
                        )}
                      </div>
                      <div className="text-gray-600 font-medium mt-1">
                        {mat_status && <span>{mat_status}</span>}
                        {state_name  && <span className="ml-1">from {state_name + " " +(city_name)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="md:block lg:block flex items-center gap-4 ml-4 justify-end">
                    {/* <button
                      className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                      onClick={() =>
                        handleNavigateToProfile(item?.block_profile_id)
                      }
                    >
                      View Profile
                    </button> */}
                    <button
                      className="mt-2 lg:ml-2 md:ml-2 bg-green-700 text-white text-sm font-semibold px-4 py-1 rounded"
                      onClick={() =>
                        handleUnblockUser(item?.id, item?.block_profile_id)
                      }
                    >
                      Unblock
                    </button>
                  </div>
                </div>
                <hr className="border-[1px solid] w-full my-3" />
              </div>
            );
          })}
        </div>
      </SidebarLayout>
    </>
  );
};
export default Blocked;
