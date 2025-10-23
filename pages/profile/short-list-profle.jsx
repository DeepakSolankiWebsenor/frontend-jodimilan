/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useApiService from "../../services/ApiService";
import Avtar from "../../public/images/avtar.png";
import MenD from "../../public/images/mendefault.png";
import WomenD from "../../public/images/girldefault.png";
import { Alert, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";
import CircularLoader from "../../components/common-component/loader";
import PaginationControlled from "../../components/common-component/pagination";
import Usercard from "../../components/common-component/card/usercard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../../services/appConfig";

function ShortListProfle() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [shortList, setShortList] = useState();
  const [page, setPage] = useState(1);
  const { getWishlist, removeFromShortlist } = useApiService();
  const [alert, setAlert] = useState(false);
  const dataFetchedRef = useRef(false);
  const masterData = useSelector((state) => state.user);

  const getWishlistProfiles = () => {
    getWishlist(page)
      .then((res) => {
        if (res.data.status === 200) {
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
          const parsed = JSON.parse(jsonData);

          setShortList(parsed?.user);
          setData(parsed?.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      getWishlistProfiles();
    }
    // if (dataFetchedRef.current) return;
    // dataFetchedRef.current = true;
  }, [page]);

  const handleRemoveShortlist = (id) => {
    removeFromShortlist(id)
      .then((res) => {
        if (res?.data?.status === 200) {
          getWishlistProfiles();
          // setData(res?.data?.user);
          setAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleNavigateToProfile = (id) => {
    router.push(`/profile/profile-detail/${id}`);
  };

  return (
    <div>
      <Head>
        <title>ShortList - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/Logo.png" />
      </Head>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Wishlist Remove Successfully !
        </Alert>
      </Snackbar>
      <div className="text-center text-xl font-semibold bg-[#e5e7eb] py-4">
        Short List Profile
      </div>
      {loading ? (
        <div className="flex justify-center py-7">
          <CircularLoader />
        </div>
      ) : data.length > 0 ? (
        <div className="mt-7 md:px-6 px-3 mb-12">
          {/* right side filter */}
          {/* <div className="hidden md:block w-[18%]"></div> */}

          {/* Main Image card section */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            {data.length &&
              data.map((item, index) => {
                const { age, userprofile, ryt_id, caste, gender } =
                  item?.profile_user[0] || {};
                const {
                  occupation,
                  birth_city,
                  height,
                  profile_img_src,
                  photo_privacy,
                } = userprofile || {};

                return (
                  <div
                    className=" w-full lg:min-h-[310px] rounded-md border bg-white relative card"
                    key={index}
                  >
                    <div className="flex justify-center my-2">
                      {profile_img_src ? (
                        <img
                          src={profile_img_src}
                          height={100}
                          width={100}
                          alt="ss"
                          className="md:w-[300px] w-64 md:h-[250px] h-48"
                          style={{
                            filter: photo_privacy === "No" ? "blur(2px)" : "",
                          }}
                        />
                      ) : (
                        <Image
                          src={gender === "Male" ? MenD : WomenD}
                          height={100}
                          width={100}
                          alt="ss"
                          className="md:w-[260px] w-56 md:h-[260px] h-52 mx-auto"
                        />
                      )}
                    </div>
                    <div className="bg-gray-50 py-2 px-4 rounded-b-md">
                      <div className="font-semibold text-gray-800">
                        {ryt_id || "--"}
                      </div>
                      <div className="text-gray-800 text-sm mt-2 font-medium">
                        Age :
                        <span className="font-semibold ml-1">
                          {age || "--"}
                        </span>
                      </div>
                      <div className="text-gray-800 text-sm mt-2 font-medium">
                        Height :
                        <span className="font-semibold ml-1">
                          {height || "--"}
                        </span>
                      </div>
                      <div className="text-gray-800 text-sm mt-2 font-medium">
                        Clan :
                        <span className="font-semibold ml-1">
                          {caste?.name || "--"}
                        </span>
                      </div>
                      <div className="text-gray-800 text-sm mt-2 font-medium">
                        Occupation :
                        <span className="font-semibold ml-1">
                          {occupation || "--"}
                        </span>
                      </div>
                      <div className="text-gray-800 text-sm mt-2 font-medium">
                        Location :
                        <span className="font-semibold ml-1">
                          {birth_city?.name || "--"}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 shortlist-actions bg-opacity-75 bg-white w-full h-full">
                      <div className="flex flex-col justify-center items-center h-full">
                        <button
                          className=" bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded"
                          onClick={() =>
                            handleNavigateToProfile(item.profile_user[0]?.encrypted_user_id)
                          }
                        >
                          View Profile
                        </button>
                        <button
                          className=" bg-red-700 text-white text-sm font-semibold px-4 py-1 rounded my-2"
                          onClick={() => handleRemoveShortlist(item?.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* left section */}
          {/* <div className="hidden md:block w-[18%]"></div> */}
        </div>
      ) : (
        <div className="my-4 h-96">
          <div className="text-center font-medium text-[25px]">
            You have not Short Listed any Profiles yet.
          </div>
          <div className="font-medium mt-2 text-center text-gray-600">
            Click here to add profile in wishlist
            <span
              className="text-[#2183d9] cursor-pointer ml-1"
              onClick={() => router.push("/browse-profile")}
            >
              Browse Profile
            </span>
          </div>
        </div>
      )}
      {data.length > 0 && (
        <div className="flex justify-center">
          <PaginationControlled
            setPage={setPage}
            last_page={shortList?.last_page}
            page={page}
          />
        </div>
      )}
    </div>
  );
}

export default ShortListProfle;
