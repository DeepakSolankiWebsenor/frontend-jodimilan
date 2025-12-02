/* eslint-disable @next/next/no-img-element */
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Image from "next/image";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";
import { useSelector } from "react-redux";

const InterestSentPending = () => {
  const [data, setData] = useState([]);
  const { sentFriendRequest, declineRequest } = useApiService();
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const masterData = useSelector((state) => state.user);

  const getSentFriendRequestData = () => {
    sentFriendRequest()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getSentFriendRequestData();
    else router.push("/Login");
  }, [alertMsg]);

  const handleDeclineRequest = (id) => {
    declineRequest(id).then(() => {
      setAlertMsg("Interest Removed Successfully");
      setAlert(true);
      getSentFriendRequestData();
    });
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <>
      <Head>
        <title>Interests Sent - JodiMilan</title>
      </Head>

      {/* 🔔 Alert */}
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

      <div className="w-full min-h-[400px]">
        <div className="text-center my-5">
          <h1 className="text-2xl font-semibold text-primary">
            Interests Sent
          </h1>
        </div>

        <div className="px-3 sm:px-6 lg:px-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.length > 0 ? (
            data?.map((item) => {
              const user = item.friend;
              const profile = user?.profile || {};

              return (
                <div
                  key={item.id}
                  className="w-full border-b pb-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  {/* LEFT - Profile Section */}
                  <div className="flex items-start md:items-center gap-8 w-full md:w-auto  ">
                    {/* Profile Picture Frame */}
                    <div className="w-[90px] h-[110px] sm:w-[110px] sm:h-[130px] overflow-hidden rounded-md flex-shrink-0 ">
                      {profile?.profile_image ? (
                        <img
                          src={profile.profile_image}
                          alt="profile"
                          className="w-full h-full object-cover"
                          style={{
                            filter:
                              profile.photo_privacy === "No"
                                ? "blur(3px)"
                                : "none",
                          }}
                        />
                      ) : (
                        <Image
                          src={user?.gender === "Male" ? MenD : WomenD}
                          alt="default"
                          width={110}
                          height={130}
                          className=" object-cover"
                        />
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col gap-1 text-sm ">
                      <p className="text-gray-700 font-bold text-base sm:text-lg truncate">
                        {user?.name} ({user?.ryt_id || "NA"})
                      </p>

                      <p className="text-gray-600">
                        {user?.age} yrs • {profile?.height || "N/A"}
                      </p>

                      <p className="text-gray-600 truncate">
                        {profile?.birth_city || "City"} •{" "}
                        {profile?.birth_state || "State"}
                      </p>

                      <p className="text-gray-600 truncate">
                        {profile?.educations} •{" "}
                        {profile?.annual_income && `₹${profile.annual_income}`}{" "}
                        • {profile?.occupation || ""}
                      </p>

                      <p className="text-gray-600">
                        {user?.mat_status || "Not Provided"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT — Action Buttons */}
                  <div className="flex md:flex-col gap-3 w-50 md:w-auto justify-center md:justify-end items-center  ml-16">
                    <button
                      className="bg-primary text-white px-4 py-1.5 rounded text-sm font-medium w-[120px]"
                      onClick={() => handleNavigateToProfile(user.ryt_id)}
                    >
                      View Profile
                    </button>

                    <Tooltip title="Cancel Interest" arrow>
                      <button
                        className="w-[40px] h-[40px] flex justify-center items-center border rounded-full hover:bg-red-100 transition"
                        onClick={() => handleDeclineRequest(item.id)}
                      >
                        <ClearOutlinedIcon className="text-red-600" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center mt-10 text-lg font-semibold text-gray-500">
              No Pending Interests!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterestSentPending;
