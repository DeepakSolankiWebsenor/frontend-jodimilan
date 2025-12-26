/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useApiService from "../../services/ApiService";
import { shouldShowPhoto } from "../../utils/PrivacyUtils";
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
import Link from "next/link";
import moment from "moment";

/* AES Decrypt */
const decryptPayload = (cipherBase64) => {
  try {
    if (!cipherBase64) return null;

    const keyHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_KEY);
    const ivHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_IV);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipherBase64) },
      keyHex,
      {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8).trim();
    if (!text || (!text.startsWith("{") && !text.startsWith("["))) return null;

    return JSON.parse(text);
  } catch (err) {
    return null;
  }
};

const normalizeUser = (user) => {
  if (!user) return null;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Logic: Prioritize top-level profile_photo, then profile.profile_image
  let profile_img_src = user?.profile_photo || user?.profile?.profile_image;
  
  if (profile_img_src && !profile_img_src.startsWith('http')) {
    profile_img_src = `${baseUrl}/${profile_img_src}`;
  }

  return {
    ...user,
    profile: {
      ...user.profile,
      profile_img_src: profile_img_src || null,
    },
  };
};

function ProfilePage() {
  const dispatch = useDispatch();
  const { getUserProfile, dailyRecommendation, commonOption, cms } =
    useApiService();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [alert, setAlert] = useState(false);
  const [dailyData, setDailyData] = useState([]);

  const [interestRecevied, setInterestReceived] = useState({
    accepted: 0,
    pending: 0,
  });
  const [interestSent, setInterestSent] = useState({
    accepted: 0,
    pending: 0,
  });

  const dataFetchedRef = useRef(false);

  const fetchUserProfile = () => {
    getUserProfile("/user/profile")
      .then((res) => {
        const code = res?.data?.code ?? res?.data?.status;
        const success =
          res?.data?.success === true ||
          res?.data?.status === 200 ||
          code === 200;

        if (!success) return;

        setInterestReceived({
          accepted: res?.data?.friend_request_received_accepted ?? 0,
          pending: res?.data?.friend_request_received_pending ?? 0,
        });

        setInterestSent({
          accepted: res?.data?.friend_request_sent_accepted ?? 0,
          pending: res?.data?.friend_request_sent_pending ?? 0,
        });

        const encryptedUser = res?.data?.data?.user || res?.data?.user || null;

        const decryptedUser = decryptPayload(encryptedUser);
        const normalized = normalizeUser(decryptedUser);
        setProfileData(normalized);

        if (encryptedUser) dispatch(setUser({ user: encryptedUser }));
      })
      .catch(() => {});
  };

  const fetchDailyRecommendations = () => {
    dailyRecommendation()
      .then((res) => {
        const list = res?.data?.data || [];
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const formatted = list.map((u) => {
          let img_src = u.profile_photo || u.profile?.profile_image;
          
          if (img_src && !img_src.startsWith('http')) {
            img_src = `${baseUrl}/${img_src}`;
          }

          return {
            ...u,
            img_src: img_src || null,
          };
        });

        setDailyData(formatted);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    commonOption()
      .then((res) => {
        if (res.data?.code) dispatch(COMMON_DATA(res.data.data));
      })
      .catch(() => {});

    cms("success")
      .then((res) => {
        if (res.data?.code === 200) dispatch(SUCCESS_STORIES(res.data.data));
      })
      .catch(() => {});

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      fetchUserProfile();
      fetchDailyRecommendations();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Profile - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner."
        />
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

      <section className="pb-10 min-h-[78vh]">
        <div className="relative">
          <div>
            <Image
              src="/landingbanner/TopBanner2.jpg"
              alt="banner"
              width={200}
              height={100}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                filter: "blur(5px)",
              }}
            />
          </div>

          <div className="w-full flex justify-center">
            <div className="lg:flex lg:w-[65%] justify-evenly">
              <div className="bg-gray-100 w-full">
                <div className="lg:flex lg:justify-evenly gap-5 p-4">
                  <div className="w-[210px] h-[210px] min-w-[210px] lg:m-0 m-auto">
                    {profileData?.profile?.profile_img_src ? (
                      <img
                        src={
                          profileData?.profile?.profile_img_src ||
                          "/images/avtar.png"
                        }
                        alt="profile img"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src={profileData?.gender === "Male" ? MenD : WomenD}
                        height={210}
                        width={210}
                        alt="default"
                        className="rounded-full mx-auto"
                      />
                    )}
                  </div>

                  <div className="text-center lg:mt-0 mt-3">
                    <div className="font-semibold text-lg">
                      {profileData?.name} {profileData?.last_name} (
                      {profileData?.ryt_id})
                    </div>

                    {/* Mobile actions */}
                    <div className="bg-[#1585DB] w-full text-white font-semibold px-4 py-2 flex items-center justify-between lg:hidden mt-2">
                      <div
                        className="cursor-pointer flex gap-1 flex-col items-center"
                        onClick={() => router.push("/search")}
                      >
                        <BiSearchAlt />
                        <div>Search</div>
                      </div>

                      <div
                        className="cursor-pointer flex gap-1 flex-col items-center"
                        onClick={() => router.push("/messages")}
                      >
                        <BsFillChatFill />
                        <div>Inbox</div>
                      </div>

                      <div
                        className="cursor-pointer flex gap-1 flex-col items-center"
                        onClick={() =>
                          router.push("/profile/short-list-profle")
                        }
                      >
                        <BsFillStarFill />
                        <div>Shortlisted</div>
                      </div>

                      <div
                        className="cursor-pointer flex gap-1 flex-col items-center"
                        onClick={() => router.push("/profile/edit-profile")}
                      >
                        <FaUserEdit />
                        <div>Edit</div>
                      </div>
                    </div>

                    <div className="mt-3 font-semibold">
                      Express Interest Received
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        className="bg-[#1585DB] text-white px-4 py-2"
                        onClick={() => router.push("/interest-receive-accept")}
                      >
                        Accepted 
                        {/* ({interestRecevied.accepted}) */}
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2"
                        onClick={() => router.push("/interest-receive-pending")}
                      >
                        Pending 
                        {/* ({interestRecevied.pending}) */}
                      </button>
                    </div>

                    <div className="mt-3 font-semibold">
                      Express Interest Sent
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        className="bg-[#1585DB] text-white px-4 py-2"
                        onClick={() => router.push("/interest-sent-accept")}
                      >
                        Accepted
                         {/* ({interestSent.accepted}) */}
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2"
                        onClick={() => router.push("/interest-sent-pending")}
                      >
                        Pending
                         {/* ({interestSent.pending}) */}
                      </button>
                    </div>

                    {profileData?.pacakge_id && (
                      <>
                        {profileData?.plan_expire ? (
                          <div className="my-4 text-sm text-red-600">
                            Your plan has been expired.
                          </div>
                        ) : (
                          <div className="mt-4 text-sm">
                            Package (Exp. Date -{" "}
                            {profileData?.pacakge_expiry
                              ? moment(profileData?.pacakge_expiry).format(
                                  "DD-MMM-YYYY"
                                )
                              : "-"}
                            )
                          </div>
                        )}
                      </>
                    )}

                    <button
                      className="mt-4 border px-4 py-2 bg-gray-400 text-white font-semibold"
                      onClick={() => router.push("/browse-profile")}
                    >
                      Browse Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop action bar */}
              <div className="bg-[#1585DB] hidden lg:grid text-white lg:w-[20%] font-semibold px-4 py-2">
                <div
                  className="cursor-pointer flex gap-2 items-center"
                  onClick={() => router.push("/search")}
                >
                  <BiSearchAlt />
                  Search
                </div>
                <div
                  className="cursor-pointer flex gap-2 items-center mt-3"
                  onClick={() => router.push("/messages")}
                >
                  <BsFillChatFill />
                  Inbox
                </div>
                <div
                  className="cursor-pointer flex gap-2 items-center mt-3"
                  onClick={() => router.push("/profile/short-list-profle")}
                >
                  <BsFillStarFill />
                  Shortlisted
                </div>
                <div
                  className="cursor-pointer flex gap-2 items-center mt-3"
                  onClick={() => router.push("/profile/edit-profile")}
                >
                  <FaUserEdit />
                  Edit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {dailyData.length > 0 && (
        <section className="pb-10 bg-white">
          <div className="text-xl font-bold text-center mb-6 text-[#1585DB]">
            Suggested For You
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {dailyData.map((user, index) => (
              <div
                key={index}
                className="w-[180px] p-4 bg-gray-100 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() =>
                  router.push(`/profile/profile-detail/${user.ryt_id}`)
                }
              >
                <img
                  src={
                    user.img_src ||
                    (user.gender === "Male" ? MenD.src : WomenD.src)
                  }
                  alt="profile"
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                  style={{
                    filter: shouldShowPhoto(user, profileData, 'public') ? "none" : "blur(5px)",
                  }}
                />

                <div className="text-center font-semibold mt-2">
                  {user.name} {user.last_name || ""}
                </div>

                <div className="text-center text-sm">
                  {user.age ? `${user.age} yrs` : ""}
                </div>

                <div className="text-center text-sm text-gray-600">
                  {user.ryt_id}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default ProfilePage;
