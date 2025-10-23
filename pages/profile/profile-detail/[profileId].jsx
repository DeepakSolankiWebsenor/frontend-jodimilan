/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect } from "react";
import BlockIcon from "@mui/icons-material/Block";
import { SiMinutemailer } from "react-icons/si";
import { MdPermContactCalendar } from "react-icons/md";
import { BsFillChatFill } from "react-icons/bs";
import { BsStarFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import useApiService from "../../../services/ApiService";
import Avtar from "../../../public/images/Avatar.webp";
import WomenD from "../../../public/images/girldefault.png";
import MenD from "../../../public/images/mendefault.png";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ImageViewer from "react-simple-image-viewer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import Head from "next/head";
import { useSelector } from "react-redux";
import { append } from "domutils";
import { decrypted_key } from "../../../services/appConfig";
import CryptoJS from "crypto-js";
import QueenIcon from "../../../public/images/queen_crown.png";
import KingIcon from "../../../public/images/king_crown.png";
import moment from "moment";

const ProfileDetail = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const [viewContactShow, setViewContactShow] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [profileData, setProfileData] = useState();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similarProfile, setSimilarProfile] = useState([]);
  const {
    addToWishlist,
    blockUser,
    profileById,
    sendFriendRequest,
    getPhotoRequest,
    unblockUser,
    viewContact,
  } = useApiService();
  const [alertMsg, setAlertMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [albumView, setAlbumView] = useState(false);
  const [userData, setUserData] = useState();
  const cancelButtonRef = useRef(null);
  const currentDate = moment(new Date());
  const packageExpireDate = moment(userData?.user?.pacakge_expiry);
  const difference = packageExpireDate.diff(currentDate, "days");
  const masterData1 = useSelector((state) => state.user);
  const [blockedObj, setBlockedObj] = useState(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [privacyState, setPrivacyState] = useState();

  // profile by id
  const getProfileById = () => {
    setIsDataLoading(true);

    profileById(profileId)
      .then((res) => {
        if (res?.data?.status == 404) {
          setUserNotFound(true);
        } else if (res.data.status === 200) {
          // for similar profiles ->
          var similarEncrypted_json = JSON.parse(
            atob(res?.data?.similar_profiles)
          );
          var similarDec = CryptoJS.AES.decrypt(
            similarEncrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(similarEncrypted_json.iv),
            }
          );

          var similarDecryptedText = similarDec.toString(CryptoJS.enc.Utf8);
          var similarJsonStartIndex = similarDecryptedText.indexOf("[");
          var similarJsonEndIndex = similarDecryptedText.lastIndexOf("]") + 1;
          const similarJsonData = similarDecryptedText?.substring(
            similarJsonStartIndex,
            similarJsonEndIndex
          );

          similarJsonData.trim();
          const similarParsed = JSON.parse(similarJsonData);
          setSimilarProfile(similarParsed);

          // for user profile by id ->
          var encrypted_json = JSON.parse(atob(res?.data?.user));
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
          const userParsed = JSON.parse(jsonData);

          setBlockedObj(res?.data?.is_blocked_profile);
          setProfileData(userParsed);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsDataLoading(false));
  };

  const getMasterData = () => {
    if (masterData1?.user !== null) {
      var encrypted_json = JSON.parse(window.atob(masterData1?.user?.user));
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

      setUserData(parsed);
    }
  };

  useEffect(() => {
    getMasterData();
    // setUserData(masterData1?.user?.user);
  }, [masterData1]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (router.isReady) {
        getProfileById();
      }
    } else {
      router.push("/Login");
    }
  }, [router.query]);

  const handleWishlist = () => {
    if (profileData?.shortlist_profile_id === false) {
      let params = {
        user_profile_id: profileData?.id,
      };
      addToWishlist(params)
        .then((res) => {
          if (res.data.status === 200) {
            setAlertMsg("You have added this user to wishlist !");
            setAlert(true);
            getProfileById();
          } else if (res.data.status === 401) {
            setAlert(true);
            setAlertMsg(res?.data?.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleBlockUser = () => {
    setLoading(true);
    let params = {
      block_profile_id: profileData?.id,
      status: "Yes",
    };
    blockUser(params)
      .then((res) => {
        if (res.data.status === 200) {
          setAlertMsg("You have blocked this user");
          setAlert(true);
          setBlockModal(false);
          setLoading(false);
          router.push("/Blocked");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const handleUnblockUser = () => {
    setLoading(true);
    let params = {
      block_profile_id: profileData?.id,
      status: "No",
    };
    unblockUser(blockedObj?.id, params)
      .then((res) => {
        if (res?.data?.status === 200) {
          let tempProfileData = { ...profileData };
          tempProfileData.is_blocked = false;
          setProfileData(tempProfileData);
          setAlertMsg("You have unblocked this user");
          setAlert(true);
          setLoading(true);
          setBlockModal(false);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const handlePhotoRequest = () => {
    const _form = new FormData();
    _form.append("request_profile_photo_id", profileData?.id);
    getPhotoRequest(_form).then((res) => {
      if (res.data.status === 200) {
        setAlertMsg(res?.data?.message);
        getProfileById();
        setAlert(true);
      } else if (res.data.status === 401) {
        setAlertMsg(res?.data?.message);
        setAlert(true);
      }
    });
  };

  const handleSendRequest = () => {
    let params = {
      request_profile_id: profileData?.id,
    };
    sendFriendRequest(params)
      .then((res) => {
        if (res.data.status === 200) {
          setAlertMsg(res?.data?.message);
          setAlert(true);
          getProfileById();
        } else if (res.data.status === 401) {
          setAlertMsg(res?.data?.message);
          setAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const imageData = profileData?.userprofile?.album_images?.map((item) => {
    return item.album_img_src;
  });

  const handleNavigateToProfile = (id) => {
    router.push({
      pathname: `/profile/profile-detail/${id}`,
    });
  };

  const handleViewContact = () => {
    if (profileData?.userprofile?.contact_privacy == "Yes") {
      if (!userData?.user?.plan_expire) {
        viewContact(profileId)
          .then((res) => {})
          .catch((error) => console.log(error));
      }
    } else if (profileData?.friend_request_approved) {
      viewContact(profileId)
        .then((res) => {})
        .catch((error) => console.log(error));
    }
    setViewContactShow(true);
  };

  // {profileData?.userprofile?.contact_privacy ==
  //   "Yes" ? (
  //     !userData?.user?.plan_expire ? (
  //       <div>
  //         <div className="font-medium mt-2">
  //           Name :
  //           <span className="ml-1">
  //             {profileData?.name} {profileData?.last_name}
  //           </span>
  //         </div>
  //         <div className="font-medium mt-2">
  //           Occupation Details :
  //           <span className="ml-1">
  //             {
  //               profileData?.userprofile
  //                 ?.occupation_details
  //             }
  //           </span>
  //         </div>
  //         <div className="font-medium mt-2">
  //           Education Details :
  //           <span className="ml-1">
  //             {
  //               profileData?.userprofile
  //                 ?.education_details
  //             }
  //           </span>
  //         </div>
  //         <div className="font-medium mt-2">
  //           Phone number :
  //           <span className="ml-1">
  //             {profileData?.phone}
  //           </span>
  //         </div>
  //         <div className="font-medium mt-2">
  //           Email Address :
  //           <span className="ml-1">
  //             {profileData?.email}
  //           </span>
  //         </div>
  //         <div className="font-medium mt-2">
  //           Thikana :
  //           <span className="ml-1">
  //             {profileData?.userprofile?.thikhana?.name ||
  //               ""}
  //           </span>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="font-medium">
  //         You need to purchase plan to view this{" "}
  //         {"user's "}
  //         Contact information.
  //       </div>
  //     )
  //   ) : profileData?.friend_request_approved ? (
  //     <div>
  //       <div className="font-medium mt-2">
  //         Name :
  //         <span className="ml-1">
  //           {profileData?.name} {profileData?.last_name}
  //         </span>
  //       </div>
  //       <div className="font-medium mt-2">
  //         Occupation Details :
  //         <span className="ml-1">
  //           {profileData?.userprofile?.occupation_details}
  //         </span>
  //       </div>
  //       <div className="font-medium mt-2">
  //         Education Details :
  //         <span className="ml-1">
  //           {profileData?.userprofile?.education_details}
  //         </span>
  //       </div>
  //       <div className="font-medium mt-2">
  //         Thikana :
  //         <span className="ml-1">
  //           {profileData?.userprofile?.thikhana?.name ||
  //             ""}
  //         </span>
  //       </div>
  //       <div className="font-medium mt-2">
  //         Phone number :
  //         <span className="ml-1">
  //           {profileData?.phone}
  //         </span>
  //       </div>
  //       <div className="font-medium mt-2">
  //         Email Address :
  //         <span className="ml-1">
  //           {profileData?.email}
  //         </span>
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="font-medium">
  //       You or This user has not accepted the sent
  //       interest request.
  //     </div>
  //   )}
  useEffect(() => {
    if (userData?.user?.plan_expire) {
      if (profileData?.userprofile?.contact_privacy == "No") {
        if (profileData?.friend_request_approved) {
          setPrivacyState(2);
        } else {
          setPrivacyState(3);
        }
      } else {
        setPrivacyState(2);
      }
    } else {
      setPrivacyState(1);
    }
  }, []);

  console.log(profileData, "checkViewContactForm");

  return (
    <div>
      <Head>
        <title>Profile Details</title>
      </Head>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity={"success"}>
          {alertMsg}
        </Alert>
      </Snackbar>

      {albumView && (
        <div>
          <ImageViewer
            src={imageData}
            disableScroll={true}
            onClose={() => setAlbumView(false)}
            backgroundStyle={{ backgroundOrigin: "inherit" }}
            leftArrowComponent={
              <KeyboardArrowLeftIcon className="text-[50px]" />
            }
            rightArrowComponent={
              <KeyboardArrowRightIcon className="text-[50px]" />
            }
          />
        </div>
      )}

      {/* block modal */}
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
                          {profileData?.is_blocked
                            ? "Unblock User"
                            : "Block User"}
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

      {/* view contact */}
      <Transition.Root show={viewContactShow} as={Fragment}>
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
                          {userData?.user?.plan_expire ? (
                            <div>
                              You need to purchase plan to view this {"user's "} contact details
                            </div>
                          ) : profileData?.userprofile?.contact_privacy ==
                            "No" ? (
                            profileData?.friend_request_approved ? (
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
                                    {
                                      profileData?.userprofile
                                        ?.occupation_details
                                    }
                                  </span>
                                </div>
                                <div className="font-medium mt-2">
                                  Education Details :
                                  <span className="ml-1">
                                    {
                                      profileData?.userprofile
                                        ?.education_details
                                    }
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
                            ) : (
                              <div className="font-medium">
                                You or This user has not accepted the sent
                                interest request.
                              </div>
                            )
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
                                  {profileData?.userprofile?.occupation_details}
                                </span>
                              </div>
                              <div className="font-medium mt-2">
                                Education Details :
                                <span className="ml-1">
                                  {profileData?.userprofile?.education_details}
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

      {isDataLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <CircularProgress size={60} color={"inherit"} />
        </div>
      ) : (
        <>
          {userNotFound ? (
            <div className="flex justify-center items-center min-h-[50vh] font-semibold text-xl">
              No User Found By This Id.
            </div>
          ) : (
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
                      {profileData?.userprofile?.profile_img_src ? (
                        <div className="relative lg:w-[340px] md:w-[300px] lg:h-full md:h-[full]">
                          <img
                            src={profileData?.userprofile?.profile_img_src}
                            height={100}
                            width={100}
                            className="w-1/2 mx-auto md:w-52 md:h-52 mt-2 rounded  h-56"
                            style={{
                              filter:
                                profileData?.userprofile?.photo_privacy == "Yes"
                                  ? ""
                                  : profileData?.friend_request_approved
                                  ? ""
                                  : "blur(3px)",
                            }}
                            alt="profile image"
                          />
                          {profileData?.userprofile?.photo_privacy == "No" &&
                            !profileData?.friend_request_approved && (
                              <div className="absolute top-[50%] left-[50%] -translate-x-[50%]">
                                <div className="text-white text-center">
                                  <div className="font-medium">
                                    Visible On Accept
                                  </div>
                                  <LockOutlinedIcon />
                                </div>
                              </div>
                            )}

                          {profileData?.friend_request_approved &&
                            profileData?.userprofile?.album_images.length >
                              0 && (
                              <div className="absolute top-[70%] left-[50%] -translate-x-[50%]">
                                <div className="text-white border rounded p-1 opacity-50 hover:opacity-100 text-center">
                                  <button
                                    className="font-semibold text-white text-sm hover:underline"
                                    onClick={() => setAlbumView(true)}
                                  >
                                    VIEW ALBUM
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="lg:w-[320px]  my-3 md:w-[300px] relative">
                          <Image
                            src={profileData?.gender === "Male" ? MenD : WomenD}
                            alt="profile image"
                            height={100}
                            width={120}
                            className="md:w-full w-auto mx-auto md:h-full h-56"
                          />
                          <div className="absolute top-[75%] md:left-[25%] left-[32%] lg:left-[15%]">
                            <button
                              disabled={profileData?.photo_request_check}
                              onClick={() => handlePhotoRequest()}
                              className="bg-[#34495e] text-white p-2 text-sm font-semibold rounded-md"
                            >
                              {profileData?.photo_request_check
                                ? "Photo Request Sent"
                                : "Send Photo Request"}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className=" w-full bg-white">
                        <div className="px-4 pt-3 flex flex-col justify-around">
                          <div className="flex gap-3 items-center text-xl font-medium">
                            <div>
                              {profileData?.ryt_id}
                            </div>
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
                                <span>
                                  {profileData?.age || ""}
                                </span>
                              </div>
                              <div>
                                <div className="mt-2">
                                  <span className="font-semibold">
                                    {" "}
                                    Height :{" "}
                                  </span>
                                  <span>
                                    {profileData?.userprofile?.height ||
                                      ""}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold"> City : </span>
                                {profileData?.userprofile?.thikana_city?.name ||
                                  ""}
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold"> Clan : </span>
                                {profileData?.caste?.name ||
                                  ""}
                              </div>
                            </div>
                            <div className="lg:pl-28 md:pl-2 md:py-0 py-2 font-medium">
                              <div>
                                <span className="font-semibold">
                                  Educations :{" "}
                                </span>
                                {profileData?.userprofile?.educations ||
                                  ""}
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold">
                                  Occupation :{" "}
                                </span>
                                {profileData?.userprofile?.occupation ||
                                  ""}
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold mr-1">
                                  Annual Income :
                                </span>
                                {profileData?.userprofile?.annual_income ||
                                  ""}
                              </div>
                              <div className="mt-2">
                                <span className="font-semibold mr-1">
                                  Marital Status :
                                </span>
                                {profileData?.mat_status ||
                                  ""}
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
                                  Ublock
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

                      <div className="md:w-[27%] lg:h-[225px] md:h-[254px]">
                        <div
                          className="bg-[#34495e] py-2 font-medium text-white flex justify-between lg:flex md:flex md:flex-col md:justify-evenly lg:justify-between
                                  px-6 md:px-0 md:py-0 min-h-full"
                        >
                          <div
                            className={`${
                              profileData?.friend_request_sent === false &&
                              profileData?.friend_request_approved === false
                                ? "hover:bg-[#aa0000]"
                                : ""
                            }  md:flex items-center  md:px-2 md:py-0 my-auto cursor-pointer`}
                          >
                            <div className="flex justify-center">
                              <SiMinutemailer size={20} />
                            </div>
                            {profileData?.friend_request_received ? (
                              <button
                                className="block md:w-auto w-12 md:text-left md:text-base text-xs lg:px-2 md:pl-2 md:py-2"
                                onClick={() =>
                                  router.push("/interest-receive-pending")
                                }
                              >
                                Respond to Sent Interest
                              </button>
                            ) : (
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
                            )}
                          </div>
                          <div
                            className="hover:bg-[#aa0000] md:flex items-center my-auto lg:px-3 md:px-1 cursor-pointer"
                            onClick={handleViewContact}
                          >
                            <div className="flex justify-center">
                              <MdPermContactCalendar size={20} />
                            </div>
                            <div className="md:block md:text-base text-xs lg:px-2 md:pl-2 py-2">
                              View Contacts
                            </div>
                          </div>
                          <div
                            className="hover:bg-[#aa0000] md:flex items-center my-auto lg:px-3 md:px-1 cursor-pointer"
                            onClick={() =>
                              profileData?.friend_request_approved === true &&
                              router.push("/messages")
                            }
                          >
                            <div className="flex justify-center">
                              <BsFillChatFill size={20} />{" "}
                            </div>
                            <div className="md:block md:text-base text-xs lg:px-2 md:pl-2 py-2">
                              Chat
                            </div>
                          </div>
                          <div
                            className={`${
                              profileData?.shortlist_profile_id === false
                                ? "hover:bg-[#aa0000] cursor-pointer"
                                : ""
                            }  md:flex my-auto items-center lg:px-3 md:px-1 `}
                            onClick={handleWishlist}
                          >
                            <div className="flex justify-center">
                              {" "}
                              <BsStarFill size={20} />{" "}
                            </div>
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

                  {/* <div className="w-full flex justify-center lg:px-10 px-4 md:px-2 h-[300px]">
              <div className="bg-white w-full p-4 lg:flex md:flex justify-between">
                <div className="w-[80%] border">img</div>
                <div className="w-[20%] lg:mt-0 md:mt-0 mt-4">content</div>
              </div>
            </div> */}

                  <div className="w-full lg:px-10 px-2 md:px-0">
                    <div className="flex gap-4 pt-4 w-full">
                      <div className="md:w-[80%] w-full p-2">
                        <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center">
                          <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                            <SchoolOutlinedIcon /> Education & Profession
                            Details
                          </div>
                          <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                            Education
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.educations ||
                                ""}
                              ,
                            </span>
                            Occupation
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.occupation ||
                                ""}
                              ,
                            </span>
                            Employeed in
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.employeed_in ||
                                ""}
                              ,
                            </span>
                            {/* Currently at */}
                            City
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.ed_city?.name ||
                                ""}
                            </span>
                            State
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.ed_state?.name ||
                                ""}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                          <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                            <FamilyRestroomOutlinedIcon /> Family Details
                          </div>
                          <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                            Father
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.father_occupation ||
                                ""}
                              ,
                            </span>
                            Mother
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.mother_occupation ||
                                ""}
                              ,
                            </span>
                            Mother Clan
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.mother_caste?.name ||
                                ""}
                              ,
                            </span>
                            Brothers
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.no_of_brothers ||
                                ""}
                              ,
                            </span>
                            Sisters
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.no_of_sisters ||
                                ""}
                              ,
                            </span>
                            Currently at
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.birth_city?.name ||
                                ""}
                              <span className="ml-1">
                                {profileData?.userprofile?.birth_state?.name}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 lg:h-[120px] md:flex flex-col justify-center mt-5">
                          <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                            <Diversity2OutlinedIcon /> Social Religious Details
                          </div>
                          <div className="mt-2 md:flex flex-wrap w-11/12 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                            <div>
                              Born
                              <span className="ml-1 font-semibold mr-1">
                                {profileData?.dob || ""},
                              </span>
                            </div>
                            <div>
                              Moonsign
                              <span className="ml-1 font-semibold mr-1">
                                {profileData?.userprofile?.moon_sign ||
                                  ""}
                                ,
                              </span>
                            </div>
                            <div>
                              Manglik
                              <span className="ml-1 font-semibold mr-1">
                                {profileData?.userprofile?.manglik ||
                                  ""}
                                ,
                              </span>
                            </div>
                            Gothra
                            <span className="ml-1 font-semibold mr-1">
                              {profileData?.userprofile?.gothra ||
                                ""}
                              ,
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                          <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                            <InfoOutlinedIcon /> About
                          </div>
                          <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                            {profileData?.userprofile?.about_yourself ||
                              ""}
                          </div>
                        </div>
                        <div className="bg-white p-3 lg:h-[120px] flex flex-col justify-center mt-5">
                          <div className="font-semibold lg:text-[20px] text-[17px] text-[#0560af] flex items-center gap-2">
                            <HandshakeOutlinedIcon /> Partner Preferences
                          </div>
                          <div className="mt-2 font-medium text-[#34495e] text-sm md:text-sm lg:text-base">
                            {profileData?.userprofile?.partner_prefernces ||
                              ""}
                          </div>
                        </div>
                      </div>

                      <div className="w-[25%] md:block hidden">
                        <div className="font-semibold pb-2 ">
                          Similar Profiles
                        </div>

                        {similarProfile?.length > 0 &&
                          similarProfile?.map((item, index) => {
                            return (
                              <div
                                className="cursor-pointer lg:h-[100px] py-2 my-3 flex items-center md:flex-col lg:flex-row text-[12px] font-medium bg-[#f3e9e9] drop-shadow-md rounded-lg"
                                key={index}
                                onClick={() =>
                                  handleNavigateToProfile(
                                    item?.user?.encrypted_user_id
                                  )
                                }
                              >
                                <div className="lg:pl-2">
                                  {item?.profile_img_src ? (
                                    <img
                                      src={item?.profile_img_src}
                                      alt="asd"
                                      className="h-14 w-14 rounded-full"
                                      style={{
                                        filter:
                                          item?.photo_privacy === "No"
                                            ? "blur(2px)"
                                            : "",
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      src={
                                        item?.user?.gender &&
                                        item?.user?.gender === "Male"
                                          ? MenD
                                          : WomenD
                                      }
                                      width={100}
                                      height={100}
                                      className="h-14 w-14 rounded-full"
                                      alt="asdf"
                                    />
                                  )}
                                </div>
                                <div className="pl-3 md:pl-0 lg:pl-3 md:pt-2">
                                  <div className="font-semibold">
                                    {item?.user?.ryt_id &&
                                      item?.user?.ryt_id}
                                  </div>
                                  <div>
                                    {item?.user?.age} {item?.birth_city?.name}
                                  </div>
                                  <div>{item?.educations}</div>
                                  <div>{item?.annual_income}</div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileDetail;
