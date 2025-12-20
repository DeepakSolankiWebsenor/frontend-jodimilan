/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useApiService from "../../services/ApiService";
import MenD from "../../public/images/mendefault.png";
import WomenD from "../../public/images/girldefault.png";
import { Alert, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import CircularLoader from "../../components/common-component/loader";

const BASE_URL = "http://localhost:3006/api/";
// const BASE_URL = "hhttps://backend-jodimilan-2ekb.vercel.app/api/";

function ShortListProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [alert, setAlert] = useState(false);

  const { getWishlist, removeFromShortlist } = useApiService();

  const getWishlistProfiles = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      console.log("Wishlist Res:", res);

      if (res?.data?.code === 200) {
        setProfiles(res?.data?.data || []);
      }
    } catch (error) {
      console.log("Wishlist Fetch Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/Login");
    else getWishlistProfiles();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await removeFromShortlist(id);
      if (res?.data?.code === 200) {
        setAlert(true);
        setProfiles((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewProfile = (id) => {
    console.log("Navigating to profile with ID:", id);
    if (!id) {
        console.error("ID is undefined!");
        return;
    }
    router.push(`/profile/profile-detail/${id}`);
  };



  return (
    <div>
      <Head>
        <title>ShortList - JodiMilan</title>
      </Head>

      <Snackbar
        open={alert}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Removed Successfully!
        </Alert>
      </Snackbar>

      <div className="text-center text-xl font-semibold bg-gray-200 py-4">
        Short Listed Profiles
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularLoader />
        </div>
      ) : profiles.length ? (
        <div className="mt-7 md:px-6 px-3 mb-12">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {profiles.map((item) => {
              const user = item?.profileUser || {};
              const prof = user?.profile || {};

              return (
                <div
                  key={item.id}
                  className="rounded-xl border shadow-md bg-white overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="w-full h-64 bg-gray-100">
                    {user?.profile_photo ? (
                      <img
                        src={`${BASE_URL}${user.profile_photo}`}
                        alt="Profile"
                        className="w-24 h-32 object-cover rounded-md mx-auto"
                      />
                    ) : (
                      <Image
                        src={user?.gender === "Male" ? MenD : WomenD}
                        alt="default"
                        width={250}
                        height={100}
                        className="object-cover rounded-md mx-auto pt-1 "
                      />
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="text-center py-4 px-2">
                    <h3 className="text-[17px] font-bold text-gray-800">
                      {user?.name} {user?.last_name}
                    </h3>

                    <p className="text-sm text-gray-700 mt-1">
                      Age:{" "}
                      <span className="font-bold">{user?.age || "--"}</span>
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      Height:{" "}
                      <span className="font-bold">{prof?.height || "--"}</span>
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      Clan:{" "}
                      <span className="font-bold">{user?.caste || "--"}</span>
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      Occupation:{" "}
                      <span className="font-bold">
                        {prof?.occupation || "--"}
                      </span>
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      className="w-1/2 bg-[#1A57A5] hover:bg-blue-700 text-white rounded-md py-2 text-sm"
                      onClick={() => handleViewProfile(user?.ryt_id)}
                    >
                      View Profile
                    </button>

                    <button
                      className="w-1/2 bg-[#DE1717] hover:bg-red-700 text-white rounded-md py-2 text-sm"
                      onClick={() => handleRemove(item?.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center my-12">
          <h3 className="text-2xl font-semibold text-gray-700">
            No Shortlisted Profiles Yet!
          </h3>
          <p className="text-gray-600 mt-3">
            Browse profiles to shortlist →{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => router.push("/browse-profile")}
            >
              Click Here
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default ShortListProfile;
