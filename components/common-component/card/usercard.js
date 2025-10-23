import React, { useEffect, useState } from "react";
import Image from "next/image";
import WomenD from "../../../public/images/girldefault.png";
import MenD from "../../../public/images/mendefault.png";
import { useRouter } from "next/router";

const Usercard = ({ item, index, className }) => {
  const { profile_img_src, height, occupation, birth_city, photo_privacy } =
    item.userprofile || {};
  const [user, setUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
    }
  }, []);
  const router = useRouter();

  const handleNavigateToProfile = (id) => {
    router.push({
      pathname: user ? `/profile/profile-detail/${id}` : "/Login",
    });
  };

  console.log(item, "item");

  return (
    <React.Fragment>
      <div
        key={index}
        className={`h-[470px] ${className} cursor-pointer rounded-md border-2`}
        onClick={() => handleNavigateToProfile(item?.encrypted_user_id)}
      >
        <div className="flex justify-center">
          {profile_img_src ? (
            <img
              src={profile_img_src}
              height={100}
              width={100}
              alt="ss"
              className="md:w-[270px] w-64 md:h-[240px] h-48"
              style={{
                filter: photo_privacy === "No" ? "blur(2px)" : "",
              }}
            />
          ) : (
            <Image
              src={item?.gender === "Male" ? MenD : WomenD}
              height={100}
              width={100}
              alt="ss"
              className="md:w-[230px] w-52 md:h-[240px] h-48 py-2 mx-auto"
            />
          )}
        </div>
        <div className="px-4 text-gray-700 mt-2">
          <div className="font-semibold text-[20px]">
            {item.ryt_id || "--"}
          </div>
          <div className="my-1 font-medium text-[15px]">
            Height :
            <span className="font-semibold ml-1">
              {height || "--"}
            </span>
          </div>
          <div className="my-1 lineLimit font-medium text-[16px]">
            Clan :
            <span className="font-semibold ml-1">
              {item?.caste?.name || "--"}
            </span>
          </div>
          <div className="my-1 font-medium text-[15px]">
            Age :
            <span className="font-semibold ml-1">
              {item?.age || "--"}
            </span>
          </div>
          <div className="my-1 font-medium whitespace-nowrap truncate text-[15px]">
            Occupation :
            <span className="font-semibold ml-1">
              {occupation || "--"}
            </span>
          </div>
          <div className="my-1  font-medium text-[15px]">
            Marital Status :
            <span className="font-semibold ml-1">
              {item.mat_status || "--"}
            </span>
          </div>
          <div className="my-1 font-medium text-[15px]">
            Location :
            <span className="font-semibold ml-1">
              {birth_city?.name || "--"}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Usercard;
