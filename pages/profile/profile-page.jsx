/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useApiService from "../../services/ApiService";
import WomenD from "../../public/images/girldefault.png";
import MenD from "../../public/images/mendefault.png";
import { Alert, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { BsFillChatFill, BsFillStarFill } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  COMMON_DATA,
  SUCCESS_STORIES,
  setUser,
} from "../../services/redux/slices/userSlice";
import Head from "next/head";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../../services/appConfig";
import moment from "moment";
import Link from "next/link";

function ProfilePage() {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState();
  const { getUserProfile, dailyRecommendation, commonOption, cms } =
    useApiService();
  const router = useRouter();
  const [alert, setAlert] = useState(false);
  const [dailyData, setDailyData] = useState([]);
  const [interestRecevied, setInterestReceived] = useState({
    accepted: 0,
    pending: 0,
  });
  const [interestSent, setInterestSent] = useState({ accepted: 0, pending: 0 });

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    commonOption()
      .then((res) => {
        if (res.data.code) {
          dispatch(COMMON_DATA(res?.data?.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    cms("success")
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch(SUCCESS_STORIES(res?.data?.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {};
  }, []);

  const getUserPorofileData = () => {
    getUserProfile("/user/profile")
      .then((res) => {
        if (res.data.status === 200) {
          setInterestReceived({
            accepted: res?.data?.friend_request_received_accepted,
            pending: res?.data?.friend_request_received_pending,
          });
          setInterestSent({
            accepted: res?.data?.friend_request_sent_accepted,
            pending: res?.data?.friend_request_sent_pending,
          });

          var encrypted_json = JSON.parse(atob(res?.data?.user));
          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          ).toString(CryptoJS.enc.Utf8);
          const parsed = JSON.parse(dec.slice(8, -2));
          setProfileData(parsed);
          dispatch(setUser({ user: res?.data?.user }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserPorofileData();
    } else {
      router.push("/Login");
    }
  }, []);

  const getDailyRecommendation = () => {
    dailyRecommendation()
      .then((res) => {
        if (res.data.status === 200) {
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

          setDailyData(parsed);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Login");
    }

    getDailyRecommendation();
  }, []);

  console.log(profileData, "profileData");

  return (
    <>
      <Head>
        <title>Profile - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Profile Updated Successfully !
        </Alert>
      </Snackbar>

      <section className=" pb-10 min-h-[78vh]">
        <div className="relative">
          <div className="">
            <Image
              src="/landingbanner/TopBanner2.jpg"
              alt=""
              width={200}
              height={100}
              style={{
                width: "100%",
                height: "260px",
                margin: "auto",
                objectFit: "cover",
                filter: "blur(5px)",
              }}
            />
          </div>

          {/* profile detail card */}
          <div className="w-full flex justify-center">
            <div className="lg:flex lg:w-[65%] justify-evenly">
              <div className="bg-gray-100 w-full">
                <div className="lg:flex lg:justify-evenly gap-5 p-4">
                  <div className="w-[210px] h-[210px] min-w-[210px] lg:m-0 m-auto">
                    {profileData?.profile_img_src ? (
                      <img
                        src={
                          profileData?.profile_img_src || "/images/avtar.png"
                        }
                        alt="profile img"
                        width={250}
                        height={150}
                        className="h-full w-full rounded-full"
                      />
                    ) : (
                      <Image
                        src={
                          profileData?.user?.gender === "Male" ? MenD : WomenD
                        }
                        height={100}
                        width={100}
                        alt="ss"
                        className="w-[210px] h-[210px] mx-auto"
                      />
                    )}
                  </div>
                  <div className="text-center lg:mt-0 mt-3">
                    <div className="font-semibold text-lg">
                      <span>
                        {(profileData?.user.name || "") +
                          " " +
                          (profileData?.user?.last_name || "")}
                      </span>
                      <span> ({profileData?.user?.ryt_id}) </span>
                    </div>

                    <div
                      className="bg-[#1585DB] lg:w-[20%] w-full text-white font-semibold px-4 
                      py-2 flex items-center justify-between md:hidden mt-2 md:mt-0"
                    >
                      <div
                        className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer"
                        onClick={() => router.push("/search")}
                      >
                        <div>
                          <BiSearchAlt />
                        </div>
                        <div>Search</div>
                      </div>
                      <div
                        className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                        onClick={() => router.push("/messages")}
                      >
                        <div>
                          <BsFillChatFill />
                        </div>
                        <div>Inbox</div>
                      </div>
                      <div
                        className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                        onClick={() =>
                          router.push("/profile/short-list-profle")
                        }
                      >
                        <div>
                          <BsFillStarFill />
                        </div>
                        <div>Shortlisted</div>
                      </div>
                      <div
                        className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                        onClick={() => router.push("/profile/edit-profile")}
                      >
                        <div>
                          <FaUserEdit />
                        </div>
                        <div>Edit</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="font-semibold">
                        Express Interest Received
                      </div>
                      <div className="flex items-center gap-2 justify-center mt-2">
                        <button
                          className="bg-[#1585DB] text-white font-medium px-4 py-2"
                          onClick={() =>
                            router.push("/interest-receive-accept")
                          }
                        >
                          Accepted ({interestRecevied?.accepted})
                        </button>
                        <button
                          className="bg-yellow-500 text-white font-medium px-4 py-2"
                          onClick={() =>
                            router.push("/interest-receive-pending")
                          }
                        >
                          Pending ({interestRecevied?.pending})
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-semibold">Express Interest Sent</div>
                      <div className="flex items-center gap-2 justify-center mt-2">
                        <button
                          className="bg-[#1585DB] text-white font-medium px-4 py-2"
                          onClick={() => router.push("/interest-sent-accept")}
                        >
                          Accepted ({interestSent?.accepted})
                        </button>
                        <button
                          className="bg-yellow-500 text-white font-medium px-4 py-2"
                          onClick={() => router.push("/interest-sent-pending")}
                        >
                          Pending ({interestSent?.pending})
                        </button>
                      </div>
                    </div>

                    {profileData?.thikhana?.name && (
                      <div className="gap-1 flex justify-between py-3 rounded-xl px-6 text-white font-semibold mt-3">
                        <Link href="/my-thikana" legacyBehavior>
                          <div className="bg-gray-400 py-3 px-8 rounded-l-xl cursor-pointer">
                            My thikana
                          </div>
                        </Link>
                        <div className="bg-gray-400 py-3 px-8 rounded-r-xl">
                          {profileData?.thikhana?.name}
                        </div>
                      </div>
                    )}

                    {/* {(profileData?.birth_city!==null||profileData?.birth_state!==null||profileData?.birth_country!==null)&&<div className="mt-3">
                      <div className="font-semibold">Community</div>
                      <div className="flex items-center gap-4 justify-center mt-2">
                        {profileData?.birth_city!==null&&<div className="bg-[#1585DB] text-white font-medium px-4 py-2">
                          {profileData?.birth_city?.name}
                        </div>}
                       {profileData?.birth_state!==null&& <div className="bg-yellow-500 text-white font-medium px-4 py-2">
                          {profileData?.birth_state?.name}
                        </div>}
                        {profileData?.birth_country!==null&&<div className="bg-[#1585DB] text-white font-medium px-4 py-2">
                          {profileData?.birth_country?.name}
                        </div>}
                      </div>
                    </div>} */}
                    {profileData?.user?.pacakge_id && (
                      <>
                        {profileData?.user?.plan_expire ? (
                          <div className="my-4">
                            <div className="font-semibold">Package</div>
                            <div className="my-2 text-sm text-red-600 font-semibold">
                              Your plan has been expired.
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <div className="font-semibold">
                              Package (Exp. Date -{" "}
                              {moment(profileData?.user?.pacakge_expiry).format(
                                "DD-MMM-YYYY"
                              )}
                              )
                            </div>
                            <div className="flex items-center gap-4 justify-center mt-2">
                              {profileData?.user?.package?.package_title !==
                                null && (
                                <div className="bg-[#1585DB] text-white font-medium px-4 py-2">
                                  {profileData?.user?.package?.package_title}
                                </div>
                              )}
                              {profileData?.user?.package
                                ?.total_profile_view !== null && (
                                <div className="bg-yellow-500 text-white font-medium px-4 py-2">
                                  Contact(
                                  {
                                    profileData?.user?.package
                                      ?.total_profile_view
                                  }
                                  )
                                </div>
                              )}
                              {profileData?.user?.total_profile_view_count !==
                                null && (
                                <div className="bg-[#1585DB] text-white font-medium px-4 py-2">
                                  Left(
                                  {profileData?.user?.total_profile_view_count})
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <button
                      className="mt-4 flex justify-center items-center m-auto border px-4 py-2 bg-gray-400 text-white font-semibold"
                      onClick={() => router.push("/browse-profile")}
                    >
                      Browse Profile
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="bg-[#1585DB] lg:w-[20%] w-full text-white font-semibold px-4 
                py-2 lg:grid md:flex items-center justify-between hidden"
              >
                <div
                  className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer"
                  onClick={() => router.push("/search")}
                >
                  <div>
                    <BiSearchAlt />
                  </div>
                  <div>Search</div>
                </div>
                <div
                  className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                  onClick={() => router.push("/messages")}
                >
                  <div>
                    <BsFillChatFill />
                  </div>
                  <div>Inbox</div>
                </div>
                <div
                  className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                  onClick={() => router.push("/profile/short-list-profle")}
                >
                  <div>
                    <BsFillStarFill />
                  </div>
                  <div>Shortlisted</div>
                </div>
                <div
                  className="flex hover:opacity-80 lg:flex-row gap-2 flex-col items-center cursor-pointer lg:mt-3 mt-0"
                  onClick={() => router.push("/profile/edit-profile")}
                >
                  <div>
                    <FaUserEdit />
                  </div>
                  <div>Edit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;
