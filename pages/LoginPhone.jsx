import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { use, useEffect, useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import Link from "next/link";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";

const UserLogin = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({
    phone: "",
    otp: "",
  });
  const { verifyOtp } = useApiService();
  const router = useRouter();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      router.push("/profile/profile-page");
    }
  }, [router]);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const handleVerifyOtp = () => {
    let params = {
      phone: phone,
      otp: otp,
    };

    if (phone === "") {
      setError({ phone: "Please enter your phone" });
    } else if (phone.length !== 10) {
      setError({ phone: "Phone number should be 10 digits only" });
    } else if (otp === "") {
      setError({ otp: "Please enter OTP" });
    } else if (otp.length !== 6) {
      setError({ otp: "Only 6 digit allowed" });
    } else {
      setError("");

      verifyOtp(params)
        .then((res) => {
          if (res.data.code === 200) {
            localStorage.setItem("token", res?.data.data.access_token);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <div className="lg:px-48 md:px-6 px-4">
        <div className="py-20">
          <div className="h-full">
            {/* Validate Email and Password */}
            <div className="">
              <div className="md:w-96 w-80 bg-white border py-6 md:px-6 px-4 rounded shadow mx-auto">
                <div className="text-center text-2xl text-slate-600 font-semibold">
                  Varify Contact Number
                </div>
                <div className="my-6">
                  <div className="text-gray-600 text-sm text-center font-medium leading-[18px] mb-4">
                    Please enter your Phone Number and OTP and click on
                    &quot;Continue&quot; to login.
                  </div>
                  <div className="text-gray-800 font-semibold">
                    <input
                      autoComplete="off"
                      type="number"
                      name="phone"
                      placeholder="Phone Number"
                      className="border border-gray-300 py-2 px-2 rounded w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {error.phone && (
                      <div className="text-red-600 mt-2 text-xs font-semibold pl-1">
                        {error.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center border font-semibold border-gray-300 rounded mt-4">
                    <input
                      autoComplete="off"
                      type={passwordType}
                      name="otp"
                      placeholder="OTP"
                      className="py-2 px-2 rounded w-full"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div
                      className="cursor-pointer btn btn-outline-primary px-3"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </div>
                  </div>
                  {error.otp && (
                    <div className="text-red-600 mt-2 text-xs font-semibold pl-1">
                      {error.otp}
                    </div>
                  )}
                </div>
                <button
                  className="bg-primary text-white text-sm font-semibold py-2 px-4 rounded w-full hover:bg-[#ff716f] transition-all"
                  onClick={handleVerifyOtp}
                >
                  Continue
                </button>

                {/* <div className="flex justify-between mt-4">
                  <div className="text-gray-600 text-sm text-center font-medium leading-[18px] self-center items-center align-middle">
                    <input type="checkbox" className="align-middle" />
                    <span className="align-middle ml-1">Remember me</span>
                  </div>
                  <div className="text-gray-600 hover:text-gray-800 text-sm text-center font-medium leading-[18px]">
                    <span className="align-middle">
                      <Link href="/" legacyBehavior>
                        Resend OTP
                      </Link>
                    </span>
                  </div>
                </div> */}

                <div className="text-gray-600 text-sm text-center font-medium leading-[18px] mt-4">
                  Don&apos;t have an account. &quot;
                  <span className="text-primary">
                    <Link href="/" legacyBehavior>
                      Register
                    </Link>
                  </span>
                  &quot; here.
                </div>

                <div className="text-center text-slate-800 text-sm font-semibold my-4">
                  -- Or --
                </div>

                <div>
                  <div className="text-slate-800 text-center text-sm font-semibold mb-4">
                    Login with Social Sites
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center justify-center border border-yellow-600 text-yellow-600 py-1 px-4 rounded w-1/2 mr-1 cursor-pointer hover:border-yellow-400 hover:bg-yellow-400 hover:text-white transition-all">
                      <FcGoogle />
                      <div className="text-sm font-semibold">oogle</div>
                    </div>
                    <div className="flex items-center justify-center border border-primary text-primary py-1 px-4 rounded w-1/2 ml-1 cursor-pointer hover:bg-primary hover:text-white transition-all">
                      <BsFacebook className="" />
                      <div className="text-sm font-semibold">acebook</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Validate Email and Password End */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
