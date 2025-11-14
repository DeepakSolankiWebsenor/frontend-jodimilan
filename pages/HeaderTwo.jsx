import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import AboutBg from "../public/images/banner-2.jpg";

const HeaderTwo = () => {
  const [user, setUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser(false);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="h-[200px]">
        <Image
          src={AboutBg}
          alt="about"
          className="w-full h-[200px] object-cover"
        />
      </div>

      {user ? (
        <div className="bg-[#f8dfdf]">
          <div className="p-[20px] text-gray-600 text-center">
            If you have not yet registered with JodiMilan.com, you may &nbsp;
            <span
              className="text-gray-800 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/")}
            >
              Register &nbsp;
            </span>
            here. Already a Member ? &nbsp;
            <span
              className="text-gray-800 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/Login")}
            >
              Login
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default HeaderTwo;
