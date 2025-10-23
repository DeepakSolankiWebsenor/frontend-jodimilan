/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import Avatar from "../public/images/avtar.png";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CircularLoader from "../components/common-component/loader";
import Head from "next/head";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";
import { useRouter } from "next/router";

const BlockedList = () => {
  const { getBlockedUsers, unblockUser } = useApiService();
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getBlockedUsers()
        .then((res) => {
          if (res.data.status === 200) {
            var encrypted_json = JSON.parse(atob(res?.data?.user));
            var dec = CryptoJS.AES.decrypt(
              encrypted_json.value,
              CryptoJS.enc.Base64.parse(decrypted_key),
              {
                iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
              }
            );

            var decryptedText = dec.toString(CryptoJS.enc.Utf8);
            var jsonStartIndex = decryptedText.indexOf("[{");
            var jsonEndIndex = decryptedText.lastIndexOf("}]") + 2;
            var jsonData = decryptedText.substring(
              jsonStartIndex,
              jsonEndIndex
            );
            jsonData.trim();
            const parsed = JSON.parse(jsonData);

            setData(parsed);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setLoading(false));
    } else {
      router.push("/Login");
    }
  }, []);

  const handleUnblockUser = (id, block_profile_id) => {
    let params = {
      block_profile_id: block_profile_id,
      status: "No",
    };

    unblockUser(id, params)
      .then((res) => {
        if (res?.data.status === 200) {
          setData(res?.data?.user);
          setAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-[100%] min-h-[400px]">
      <Head>
        <title>Blocked List</title>
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
          User Unblocked Successfully !
        </Alert>
      </Snackbar>

      <div className="text-center my-5">
        <div className="text-2xl font-medium text-[#0b4c85]">Block List</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-14">
          <CircularLoader />
        </div>
      ) : data?.length > 0 ? (
        data?.map((item, index) => {
          const { userprofile, ryt_id, age, gender } = item?.users;
          const {
            height,
            birth_city,
            profile_img_src,
            educations,
            annual_income,
            occupation,
            photo_privacy,
          } = userprofile || {};
          return (
            <div key={index} className="w-full px-4 md:px-2 lg:px-10">
              <div className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between">
                <div className="flex md:items-center lg:items-center items-start gap-4">
                  <div>
                    {profile_img_src ? (
                      <img
                        src={profile_img_src}
                        alt="sadf"
                        className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                        style={{
                          filter: photo_privacy === "No" ? "blur(3px)" : "",
                        }}
                      />
                    ) : (
                      <Image
                        src={Avatar}
                        height={150}
                        width={150}
                        alt="sf"
                        className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-700 font-semibold text-lg">
                      {ryt_id || "RYT_ID"}
                    </div>
                    <div className="text-gray-600 font-medium mt-2">
                      {age && <span>{age},</span>}
                      {height && <span className="ml-1">{height},</span>}
                      {birth_city?.name && <span>{birth_city?.name},</span>}
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
                        <span className="ml-1">{item?.users?.mat_status}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:block lg:block flex items-center gap-4 ml-4 justify-end">
                  <button
                    className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                    onClick={() =>
                      router.push({
                        pathname: `/profile/profile-detail/${item?.block_profile_id}`,
                      })
                    }
                  >
                    View Profile
                  </button>
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
        })
      ) : (
        <div className="mt-10 font-semibold lg:text-[30px] text-lg text-gray-500 text-center">
          No Data found !
        </div>
      )}
    </div>
  );
};

export default BlockedList;
