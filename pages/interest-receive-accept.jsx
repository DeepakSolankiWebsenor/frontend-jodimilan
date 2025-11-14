/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import Avatar from "../public/images/avtar.png";
import { useRouter } from "next/router";
import WomenD from "../public/images/girldefault.png";
import MenD from "../public/images/mendefault.png";
import Head from "next/head";
import CircularLoader from "../components/common-component/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

const InterestReceiveAccept = () => {
  const [data, setData] = useState([]);
  const { acceptedRequests } = useApiService();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dataFetchedRef = useRef(false);
  const masterData = useSelector((state) => state.user);

  const getAcceptedRequrestData = () => {
    acceptedRequests()
      .then((res) => {
        if (res.data.status === 200) {
          var encrypted_json = JSON.parse(atob(res?.data?.requests));
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

          setData(parsed);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      getAcceptedRequrestData();
    } else {
      router.push("/Login");
    }
  }, []);

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title> Interests Received Accepted - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>
      <div className="w-[100%] min-h-[400px]">
        <div className="text-center my-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Interests Received Accepted
          </div>
        </div>

        <div className="px-4 md:px-2 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.sent?.length > 0 ? (
            data?.sent?.map((item, index) => {
              return (
                <div key={index}>
                  <div className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between">
                    <div className="flex md:items-center lg:items-center items-start gap-5">
                      <div className="w-[30%] lg:w-auto md:w-auto">
                        {item?.users?.userprofile?.profile_img_src ? (
                          <img
                            src={item?.users?.userprofile?.profile_img_src}
                            alt="asd"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                            style={{
                              filter:
                                item?.users?.userprofile.photo_privacy === "No"
                                  ? "blur(3px)"
                                  : "",
                            }}
                          />
                        ) : (
                          <Image
                            src={item?.users?.gender === "Male" ? MenD : WomenD}
                            height={150}
                            width={150}
                            alt="sf"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                          />
                        )}
                      </div>
                      <div className="w-[70%] lg:w-auto md:w-auto">
                        <div className="text-gray-700 font-semibold text-lg">
                          {item?.users?.userprofile?.contact_privacy ===
                            "Yes" && item?.users?.name}
                          <span className="ml-1">
                            ({item?.users?.ryt_id || "RYT_ID"})
                          </span>
                        </div>
                        <div className="text-gray-600 font-medium mt-2">
                          {item?.users?.age && <span>{item?.users?.age},</span>}
                          {item?.users?.userprofile?.height && (
                            <span className="ml-1">
                              {item?.users?.userprofile?.height},
                            </span>
                          )}
                          {item?.users?.userprofile?.birth_city?.name && (
                            <span className="ml-1">
                              {item?.users?.userprofile?.birth_city?.name},
                            </span>
                          )}
                          {item?.users?.userprofile?.birth_state?.name && (
                            <span className="ml-1">
                              {item?.users?.userprofile?.birth_state?.name},
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 font-medium mt-2">
                          {item?.users?.userprofile?.educations && (
                            <span>{item?.users?.userprofile?.educations},</span>
                          )}
                          {item?.users?.userprofile?.annual_income && (
                            <span className="ml-1">
                              Rs. {item?.users?.userprofile?.annual_income},
                            </span>
                          )}
                          {item?.users?.userprofile?.occupation && (
                            <span className="ml-1">
                              {item?.users?.userprofile?.occupation},
                            </span>
                          )}
                          {item?.users?.mat_status && (
                            <span className="ml-1">
                              {item?.users?.mat_status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:block lg:block flex items-center gap-4 ml-4 justify-end">
                      <button
                        className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                        onClick={() => handleNavigateToProfile(item?.users?.encrypted_user_id)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                  <hr className="border-b-[1px solid] w-full my-3" />
                </div>
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

export default InterestReceiveAccept;
