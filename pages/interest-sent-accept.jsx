/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useApiService from "../services/ApiService";
import Head from "next/head";
import MenD from "../public/images/mendefault.png";
import WomenD from "../public/images/girldefault.png";
import CircularLoader from "../components/common-component/loader";
import { toast } from "react-toastify";

const InterestSentAccept = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sent: [], received: [] });
  const { acceptedRequests } = useApiService();
  const router = useRouter();
  const dataFetchedRef = useRef(false);

  const getAcceptedRequestData = () => {
    acceptedRequests()
      .then((res) => {
        console.log("Sent Accepted API:", res.data);
        if (res?.data?.success === true) {
          setData(res?.data?.data);
        } else {
          toast.error("Failed to load data");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      getAcceptedRequestData();
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
        <title>Interests Sent Accepted - JodiMilan</title>
      </Head>

      <div className="w-[100%] min-h-[400px]">
        <div className="text-center my-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Interests Sent Accepted
          </div>
        </div>

        <div className="px-4 md:px-2 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          ) : data?.sent?.length > 0 ? (
            data.sent.map((item, index) => {
              const user = item.friend;
              return (
                <div key={index}>
                  <div className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between">
                    <div className="flex md:items-center lg:items-center items-start gap-5">
                      <div className="w-[30%] lg:w-auto md:w-auto">
                        {user?.profile_photo ? (
                          <img
                            src={user.profile_photo}
                            alt="profile"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px] object-cover rounded"
                          />
                        ) : (
                          <Image
                            src={user?.gender === "Male" ? MenD : WomenD}
                            height={150}
                            width={150}
                            alt="default-img"
                            className="h-[120px] lg:h-[150px] md:h-[150px] w-[150px]"
                          />
                        )}
                      </div>

                      <div className="w-[70%] lg:w-auto md:w-auto">
                        <div className="text-gray-700 font-semibold text-lg">
                          {user?.name} ({user?.ryt_id})
                        </div>

                        <div className="text-gray-600 font-medium mt-2">
                          {user?.age && <span>{user.age} Years</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4 justify-end">
                      <button
                        className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                        onClick={() => handleNavigateToProfile(user.ryt_id)}
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

export default InterestSentAccept;
