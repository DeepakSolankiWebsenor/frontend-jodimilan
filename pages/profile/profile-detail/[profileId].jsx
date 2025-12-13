/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Dialog, Transition } from "@headlessui/react";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

import useApiService from "../../../services/ApiService";
import { decrypted_key } from "../../../services/appConfig";

import WomenD from "../../../public/images/girldefault.png";
import MenD from "../../../public/images/mendefault.png";
import KingIcon from "../../../public/images/king_crown.png";
import QueenIcon from "../../../public/images/queen_crown.png";

/**
 * Helper to decrypt the encrypted payload (data.user) that comes as:
 * Base64 string -> JSON { value, iv } -> AES-256-CBC decrypted string -> JSON
 */
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

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      console.error("❌ Empty decrypt result");
      return null;
    }

    return JSON.parse(decryptedText);
  } catch (err) {
    console.error("❌ Decrypt error:", err);
    return null;
  }
};



const ProfileDetail = () => {
  const router = useRouter();
  const { profileId } = router.query;

  const {
    profileById,
    addToWishlist,
    blockUser,
    unblockUser,
    viewContact,
    sendFriendRequest,
  } = useApiService();

  const [profileData, setProfileData] = useState(null); // decrypted user
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [viewContactShow, setViewContactShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [blockedObj, setBlockedObj] = useState(null);
const [alertSeverity, setAlertSeverity] = useState("success");


  const cancelButtonRef = useRef(null);

  // Logged-in user master data (encrypted in redux)
  const masterData1 = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null); // decrypted logged-in user

  // 🔓 Decrypt logged-in master user from redux (if needed)
const getMasterData = () => {
  try {
    const cipher = masterData1?.user?.user;
    if (!cipher) return;

    const keyHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_KEY);
    const ivHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_IV);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipher) },
      keyHex,
      {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8);

    const parsed = JSON.parse(text);
    setUserData(parsed);
  } catch (error) {
    console.error("❌ Failed to decrypt master user:", error);
  }
};


const normalizeProfile = (user) => {
  if (!user) return null;

  const profile = user.profile || {};

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return {
    ...user,

    userprofile: {
      ...profile,
      educations: profile.educations || "",
      occupation: profile.occupation || "",
      annual_income: profile.annual_income || "",
      height: profile.height || "",
      occupation_details: profile.occupation_details || "",
      education_details: profile.education_details || "",
      about_yourself: profile.about_yourself || "",
      partner_prefernces: profile.partner_prefernces || "",
      
      // 📌 Fix image for UI
      profile_img_src: profile.profile_image
        ? `${baseUrl}/${profile.profile_image}`
        : null,

      // 📌 Fix location mapping
      thikana_city: { name: profile.thikana_city || "" },
      birth_city: { name: profile.birth_city || "" },
      ed_city: { name: profile.ed_city || "" },
    },

    // 📌 Fix caste for UI
    caste: { name: user.caste || "" },
  };
};



  // 🔓 Get profile by RYT ID + decrypt response.data.data.user
  const fetchProfileById = () => {
    if (!profileId) return;

    setIsDataLoading(true);

    profileById(profileId)
      .then((res) => {
        console.log("📥 profileById response:", res);

        // Node response shape: { code, success, message, data: { user: "<encrypted>" } }
        const code = res?.data?.code;
        const success = res?.data?.success;

        if (code === 404 || res?.data?.status === 404) {
          setUserNotFound(true);
          return;
        }

        if (code === 200 && success) {
          const encryptedUser =
            res?.data?.data?.user || res?.data?.user || null;

         const decryptedUser = decryptPayload(encryptedUser);

         console.log("🔓 Decrypted profile user:", decryptedUser);

if (!decryptedUser) {
  console.error("❌ Could not decrypt user payload");
  return;
}

const normalized = normalizeProfile(decryptedUser);

console.log("📌 Normalized profile:", normalized);

setBlockedObj(res?.data?.data?.is_blocked_profile || null);
setProfileData(normalized);


          
        } else {
          console.error("❌ Unexpected response format:", res?.data);
        }
      })
      .catch((err) => {
        console.error("❌ profileById error:", err);
      })
      .finally(() => setIsDataLoading(false));
  };

  useEffect(() => {
    getMasterData();
  }, [masterData1]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
      return;
    }

    if (router.isReady) {
      fetchProfileById();
    }
  }, [router.isReady, profileId]);

  const handleWishlist = () => {
    if (!profileData?.shortlist_profile_id) {
      const params = { user_profile_id: profileData?.id };
      addToWishlist(params)
        .then((res) => {
          if (res.data.status === 200 || res.data.code === 200) {
            setAlertMsg("You have added this user to wishlist!");
            setAlert(true);
            fetchProfileById();
          } else if (res.data.status === 401) {
            setAlert(true);
            setAlertMsg(res?.data?.message);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleBlockUser = () => {
    if (!profileData?.id) return;
    setLoading(true);
    const params = {
      block_profile_id: profileData?.id,
      status: "Yes",
    };
    blockUser(params)
      .then((res) => {
        if (res.data.status === 200 || res.data.code === 200) {
          setAlertMsg("You have blocked this user");
          setAlert(true);
          setBlockModal(false);
          router.push("/Blocked");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleUnblockUser = () => {
    if (!profileData?.id || !blockedObj?.id) return;
    setLoading(true);
    const params = {
      block_profile_id: profileData?.id,
      status: "No",
    };
    unblockUser(blockedObj?.id, params)
      .then((res) => {
        if (res?.data?.status === 200 || res?.data?.code === 200) {
          const temp = { ...profileData, is_blocked: false };
          setProfileData(temp);
          setAlertMsg("You have unblocked this user");
          setAlert(true);
          setBlockModal(false);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleViewContact = () => {
    if (!profileData) return;

    if (profileData?.profile?.contact_privacy === "Yes") {
      if (!userData?.user?.plan_expire) {
        viewContact(profileId)
          .then(() => {})
          .catch((error) => console.error(error));
      }
    } else if (profileData?.friend_request_approved) {
      viewContact(profileId)
        .then(() => {})
        .catch((error) => console.error(error));
    }
    setViewContactShow(true);
  };

 const handleSendRequest = () => {
  if (!profileData?.id) return;

  const params = { request_profile_id: profileData?.id };

  sendFriendRequest(params)
    .then((res) => {

      const { code, message } = res?.data || {};


      if (code === 200) {
        setAlertMsg(message || "Interest Sent Successfully!");
        setAlertSeverity("success");
        setAlert(true);
        fetchProfileById();
      } else {
        setAlertMsg(message || "Something went wrong");
        setAlertSeverity("error");
        setAlert(true);
      }
    })
    .catch((err) => {
      console.log("❌ sendFriendRequest error:", err);
      console.error(err);
      setAlertMsg(`${err?.response?.data?.message || "Error sending interest request"}`);
      setAlertSeverity("error");
      setAlert(true);
    });
};


  //------------- RENDERING ---------------

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (userNotFound) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] font-semibold text-xl">
        No User Found By This Id.
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Profile Details</title>
      </Head>

      {/* Snackbar */}
<Snackbar
  open={alert}
  autoHideDuration={3000}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
  onClose={() => setAlert(false)}
>
  <Alert
    icon={<ThumbUpAltIcon />}
    severity={alertSeverity}
    onClose={() => setAlert(false)}
    variant="filled"
  >
    {alertMsg || ""}
  </Alert>
</Snackbar>



      {/* Block / Unblock Modal */}
      <Transition.Root show={blockModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setBlockModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {profileData?.is_blocked ? "Unblock User" : "Block User"}
                        </Dialog.Title>
                        <div className="mt-2">
                          {profileData?.is_blocked ? (
                            <div className="text-sm text-gray-500">
                              They will be able to find you.
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              They will not be able to find you and all the
                              communication started will be blocked.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setBlockModal(false)}
                      ref={cancelButtonRef}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="mt-2 lg:mt-0 md:mt-0 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={
                        profileData?.is_blocked
                          ? handleUnblockUser
                          : handleBlockUser
                      }
                    >
                      {loading ? (
                        <CircularProgress size={20} color={"inherit"} />
                      ) : (
                        "Yes"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* View contact modal */}
      <Transition.Root show={viewContactShow} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setViewContactShow}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PermContactCalendarOutlinedIcon
                          className="h-6 w-6 text-sky-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          View contact
                        </Dialog.Title>
                        <div className="mt-4">
                          {/* Simple version: show contact if either privacy allows or friend_request_approved */}
                          {profileData?.profile?.contact_privacy === "No" &&
                          !profileData?.friend_request_approved ? (
                            <div className="font-medium">
                              You or this user has not accepted the interest
                              request.
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium mt-2">
                                Name :
                                <span className="ml-1">
                                  {profileData?.name} {profileData?.last_name}
                                </span>
                              </div>
                              <div className="font-medium mt-2">
                                Occupation Details :
                                <span className="ml-1">
                                  {profileData?.profile?.occupation_details ||
                                    profileData?.profile?.occupation ||
                                    ""}
                                </span>
                              </div>
                              <div className="font-medium mt-2">
                                Education Details :
                                <span className="ml-1">
                                  {profileData?.profile?.education_details ||
                                    profileData?.profile?.educations ||
                                    ""}
                                </span>
                              </div>
                              <div className="font-medium mt-2">
                                Phone number :
                                <span className="ml-1">
                                  {profileData?.phone}
                                </span>
                              </div>
                              <div className="font-medium mt-2">
                                Email Address :
                                <span className="ml-1">
                                  {profileData?.email}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setViewContactShow(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* MAIN PROFILE UI */}
      {profileData && (
        <div className="lg:px-32 md:px-12 md:mt-5 mt-0 lg:mt-0 bg-gray-100">
          <div className="relative">
            <div className="z-20">
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
                }}
              />
            </div>

            <div style={{ transform: "translateY(-55px)" }}>
              <div className="w-full md:flex md:justify-center">
                <div className="ml-4 md:pt-0 pt-2  md:ml-0 lg:ml-4 w-[92%] md:flex bg-white drop-shadow-sm">
                  {/* PROFILE IMAGE */}
                  <div className="lg:w-[320px] my-3 md:w-[300px] relative">
                    <Image
                      src={profileData?.gender === "Male" ? MenD : WomenD}
                      alt="profile image"
                      height={100}
                      width={120}
                      className="md:w-full w-auto mx-auto md:h-full h-56"
                    />
                    {profileData?.profile?.photo_privacy === "No" && (
                      <div className="absolute top-[50%] left-[50%] -translate-x-[50%]">
                        <div className="text-white text-center">
                          <div className="font-medium">Visible On Accept</div>
                          <LockOutlinedIcon />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BASIC INFO */}
                  <div className="w-full bg-white">
                    <div className="px-4 pt-3 flex flex-col justify-around">
                      <div className="flex gap-3 items-center text-xl font-medium">
                        <div>{profileData?.ryt_id}</div>
                        {!profileData?.plan_expire ? (
                          <div>
                            <Image
                              src={
                                profileData?.gender === "Male"
                                  ? KingIcon
                                  : QueenIcon
                              }
                              height={100}
                              width={100}
                              alt="ss"
                              className="h-[25px] w-[25px]"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="md:flex text-sm pt-2">
                        <div className="font-medium">
                          <div>
                            <span className="font-semibold"> Age : </span>
                            <span>{profileData?.age || ""}</span>
                          </div>

                          <div className="mt-2">
                            <span className="font-semibold"> Height : </span>
                            <span>{profileData?.profile?.height || ""}</span>
                          </div>

                          <div className="mt-2">
                            <span className="font-semibold"> Clan : </span>
                            <span>{profileData?.profile?.gothra || ""}</span>
                          </div>
                        </div>

                        <div className="lg:pl-28 md:pl-2 md:py-0 py-2 font-medium">
                          <div>
                            <span className="font-semibold">Educations : </span>
                            {profileData?.profile?.educations || ""}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">Occupation : </span>
                            {profileData?.profile?.occupation || ""}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold mr-1">
                              Annual Income :
                            </span>
                            {profileData?.profile?.annual_income || ""}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold mr-1">
                              Marital Status :
                            </span>
                            {profileData?.mat_status || ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        {profileData?.is_blocked ? (
                          <Tooltip
                            title="Unblock this profile"
                            onClick={() => setBlockModal(true)}
                          >
                            <button className="mt-4 bg-green-700 text-white text-sm font-semibold px-4 py-1 rounded">
                              Unblock
                            </button>
                          </Tooltip>
                        ) : (
                          <button onClick={() => setBlockModal(true)}>
                            <Tooltip title="Block this profile" arrow>
                              <BlockIcon className="text-red-600" />
                            </Tooltip>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="md:w-[27%] lg:h-[225px] md:h-[254px]">
                    <div className="bg-[#34495e] py-2 font-medium text-white flex flex-col justify-evenly px-6 md:px-0 md:py-0 min-h-full">
                      <div
                        className={`${
                          !profileData?.friend_request_sent &&
                          !profileData?.friend_request_approved
                            ? "hover:bg-primary"
                            : ""
                        }  md:flex items-center md:px-2 md:py-0 my-auto cursor-pointer`}
                      >
                        <button
                          disabled={
                            profileData?.friend_request_sent ||
                            profileData?.friend_request_approved
                          }
                          className="block md:w-auto w-12 md:text-left md:text-base text-xs lg:px-2 md:pl-2 md:py-2"
                          onClick={handleSendRequest}
                        >
                          {profileData?.friend_request_approved
                            ? "Interest Approved"
                            : profileData?.friend_request_sent
                            ? "Interest Sent"
                            : "Send Interest"}
                        </button>
                      </div>

                      <div
                        className="hover:bg-primary md:flex items-center my-auto lg:px-3 md:px-1 cursor-pointer"
                        onClick={handleViewContact}
                      >
                        <div className="md:block md:text-base text-xs lg:px-2 md:pl-2 py-2">
                          View Contacts
                        </div>
                      </div>

                      <div
                        className={`${
                          !profileData?.shortlist_profile_id
                            ? "hover:bg-primary cursor-pointer"
                            : ""
                        }  md:flex my-auto items-center lg:px-3 md:px-1 `}
                        onClick={handleWishlist}
                      >
                        <div className="md:block md:text-base text-xs lg:px-2 md:pl-2 py-2">
                          {profileData?.shortlist_profile_id
                            ? "Shortlisted"
                            : "Shortlist"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILS BLOCKS */}
              <div className="w-full lg:px-10 px-2 md:px-0 mt-4">
                <div className="flex gap-4 pt-4 w-full">
                  <div className="md:w-[80%] w-full p-2">
                    {/* Education & Profession */}
                    <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center">
                      <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                        <SchoolOutlinedIcon /> Education & Profession Details
                      </div>
                      <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                        Education
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.educations || ""},{" "}
                        </span>
                        Occupation
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.occupation || ""},{" "}
                        </span>
                        Employed in
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.employeed_in || ""}
                        </span>
                      </div>
                    </div>

                    {/* Family */}
                    <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                      <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                        <FamilyRestroomOutlinedIcon /> Family Details
                      </div>
                      <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                        Father
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.father_occupation || ""},{" "}
                        </span>
                        Mother
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.mother_occupation || ""},{" "}
                        </span>
                        Brothers
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.no_of_brothers || ""},{" "}
                        </span>
                        Sisters
                        <span className="ml-1 font-semibold mr-1">
                          {profileData?.profile?.no_of_sisters || ""}
                        </span>
                      </div>
                    </div>

                    {/* Religious */}
                    <div className="bg-white p-3 lg:h-[120px] md:flex flex-col justify-center mt-5">
                      <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                        <Diversity2OutlinedIcon /> Social / Religious Details
                      </div>
                      <div className="mt-2 md:flex flex-wrap w-11/12 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                        <div>
                          Moonsign
                          <span className="ml-1 font-semibold mr-1">
                            {profileData?.profile?.moon_sign || ""},{" "}
                          </span>
                        </div>
                        <div>
                          Manglik
                          <span className="ml-1 font-semibold mr-1">
                            {profileData?.profile?.manglik || ""},{" "}
                          </span>
                        </div>
                        <div>
                          Gothra
                          <span className="ml-1 font-semibold mr-1">
                            {profileData?.profile?.gothra || ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* About */}
                    <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                      <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                        <InfoOutlinedIcon /> About
                      </div>
                      <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                        {profileData?.profile?.about_yourself || ""}
                      </div>
                    </div>

                    {/* Partner preferences */}
                    <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                      <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                        <InfoOutlinedIcon /> Partner Preferences
                      </div>
                      <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                        {profileData?.profile?.partner_prefernces || ""}
                      </div>
                    </div>
                  </div>

                  {/* Right side similar profiles etc. — you can re-add later */}
                  <div className="w-[25%] md:block hidden">
                    <div className="font-semibold pb-2 ">Similar Profiles</div>
                    <div className="text-sm text-gray-500">
                      (Bind your similar profile data here once backend is ready)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
