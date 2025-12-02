/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";
import WomenD from "../public/images/girldefault.png";
import MenD from "../public/images/mendefault.png";
import Head from "next/head";
import CircularLoader from "../components/common-component/loader";
import { toast } from "react-toastify";

const InterestReceiveAccept = () => {
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const { acceptedRequests } = useApiService();
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const getAcceptedRequestData = () => {
    acceptedRequests()
      .then((res) => {
        console.log("API RESPONSE:", res?.data);

        if (res?.data?.success === true || res?.data?.code === 200) {
          setData(res?.data?.data);
        } else {
          toast.error("Failed to load data");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong!");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) getAcceptedRequestData();
    else router.push("/Login");
  }, []);

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  const renderCard = (user, key) => {
    const imgSrc = user?.profile_photo
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profile_photo}`
      : user?.gender === "Male"
      ? MenD.src
      : WomenD.src;

    return (
      <div key={key}>
        <div className="flex items-center justify-between py-4 gap-4">
          <img
            src={imgSrc}
            alt="profile"
            className="h-[120px] w-[120px] object-cover rounded-md bg-gray-100"
          />

          <div className="flex-1">
            <div className="text-gray-700 font-semibold text-lg">
              {user?.name} {user?.last_name || ""}
              <span className="text-sm text-gray-500 ml-1">
                ({user?.ryt_id})
              </span>
            </div>

            {user?.age && (
              <div className="text-gray-600 font-medium mt-2">
                {user.age} Years
              </div>
            )}
          </div>

          <button
            className="bg-[#0b4c85] text-white text-sm font-semibold px-4 py-2 rounded"
            onClick={() => handleNavigateToProfile(user.ryt_id)}
          >
            View Profile
          </button>
        </div>

        <hr className="border-b-[1px] w-full my-3" />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Interests Received Accepted - JodiMilan</title>
        <meta name="description" content="100% verified profiles - JodiMilan" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <div className="w-full min-h-[400px] px-4 lg:px-20 pb-10">
        <h1 className="text-center text-2xl font-medium text-[#0b4c85] my-5">
          Interests Received Accepted
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <CircularLoader />
          </div>
        ) : data?.received?.length > 0 ? (
          data.received.map((item, index) => renderCard(item.user, index))
        ) : (
          <div className="font-semibold text-lg text-gray-500 text-center mt-10">
            No Data Found!
          </div>
        )}
      </div>
    </>
  );
};

export default InterestReceiveAccept;
