/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";

const InterestReceivePending = () => {
  const [data, setData] = useState([]);
  const { getFriendRequest, acceptRequest, declineRequest, sessionCreate } =
    useApiService();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const getFriendRequestData = () => {
    getFriendRequest()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      getFriendRequestData();
    } else {
      router.push("/Login");
    }
  }, []);

  const handleAcceptRequest = (id, session_id) => {
    acceptRequest(id)
      .then((res) => {
        if (res?.data?.status === 200) {
          getFriendRequestData();
          setAlertMsg(res?.data?.message);
          setAlert(true);

          const form = new FormData();
          form.append("friend_id", session_id);
          sessionCreate(form);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeclineRequest = (id) => {
    declineRequest(id)
      .then(() => {
        getFriendRequestData();
        setAlert(true);
        setAlertMsg("Friend Request Declined Successfully");
      })
      .catch(console.log);
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title>Interests Received Pending - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner."
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
          {alertMsg}
        </Alert>
      </Snackbar>

      <div className="w-[100%] min-h-[400px]">
        <div className="text-center my-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Interests Received Pending
          </div>
        </div>

        <div className="px-4 md:px-2 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.length > 0 ? (
            data.map((item) => {
              const user = item?.user || {};
              const profile = user?.profile || {};

              return (
                <React.Fragment key={item?.id}>
                  <div className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between">
                    <div className="flex items-start md:items-center lg:items-center gap-5">
                      <div className="w-[30%] lg:w-auto md:w-auto">
                        {profile?.profile_img_src ? (
                          <img
                            src={profile?.profile_img_src}
                            alt="Profile Image"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                            style={{
                              filter:
                                profile?.photo_privacy === "No"
                                  ? "blur(3px)"
                                  : "",
                            }}
                          />
                        ) : (
                          <Image
                            src={user?.gender === "Male" ? MenD : WomenD}
                            height={150}
                            width={150}
                            alt="Default Img"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                          />
                        )}
                      </div>

                      <div>
                        <div className="text-gray-700 font-semibold text-lg">
                          {user?.ryt_id}
                        </div>

                        <div className="text-gray-600 font-medium mt-2">
                          {user?.age && <span>{user.age}, </span>}
                          {profile?.height && (
                            <span className="ml-1">{profile.height}, </span>
                          )}
                          {profile?.birth_city && (
                            <span className="ml-1">{profile.birth_city}, </span>
                          )}
                          {profile?.birth_state && (
                            <span className="ml-1">{profile.birth_state}</span>
                          )}
                        </div>

                        <div className="text-gray-600 font-medium mt-2">
                          {profile?.educations && (
                            <span>{profile.educations}, </span>
                          )}
                          {profile?.annual_income && (
                            <span className="ml-1">
                              Rs. {profile.annual_income},{" "}
                            </span>
                          )}
                          {profile?.occupation && (
                            <span className="ml-1">{profile.occupation}, </span>
                          )}
                          {user?.mat_status && (
                            <span className="ml-1">{user.mat_status}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end">
                      <div className="text-gray-600 font-medium">
                        {item?.created_at?.split("T")[0]}
                      </div>

                      <button
                        className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                        onClick={() => handleNavigateToProfile(user?.ryt_id)}
                      >
                        View Profile
                      </button>

                      <div className="mt-2">
                        <Tooltip title="Accept" arrow>
                          <CheckOutlinedIcon
                            className="text-[30px] text-[green] cursor-pointer"
                            onClick={() =>
                              handleAcceptRequest(item.id, user.id)
                            }
                          />
                        </Tooltip>

                        <Tooltip title="Decline" arrow>
                          <ClearOutlinedIcon
                            className="ml-1 text-[30px] text-[#9f2020] cursor-pointer"
                            onClick={() => handleDeclineRequest(item.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[1px solid] w-full my-3" />
                </React.Fragment>
              );
            })
          ) : (
            <div className="mt-10 font-semibold lg:text-[30px] text-lg text-gray-500 text-center">
              No Data Found!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterestReceivePending;
