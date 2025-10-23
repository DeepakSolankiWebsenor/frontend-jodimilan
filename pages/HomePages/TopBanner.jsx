/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { SlMustache } from "react-icons/sl";
import { GiJewelCrown } from "react-icons/gi";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useApiService from "../../services/ApiService";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../../services/appConfig";

function TopBanner() {
  const [passwordType, setPasswordType] = useState("password");
  const router = useRouter();
  const dataFetchedRef = useRef(false);
  const [post, setPost] = useState(null);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpServerError, setOtpServerError] = useState("");
  const [signupErrors, setSignupErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [sliderData, setSliderData] = useState([]);

  const { commonOption, verifyOtp, customerSignup, getSlider } =
    useApiService();
  const ref = useRef();
  var newDate = new Date();
  newDate.setFullYear(newDate.getFullYear() - 20);

  const masterData1 = useSelector((state) => state.user);

  useEffect(() => {
    setPost(masterData1?.common_data);
  }, [masterData1]);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const userRegistrationFunction = (data) => {
    setLoading(true);
    let params = {};

    for (const key in data) {
      if (data[key]) {
        params[key] = data[key];
      }
    }

    customerSignup(params)
      .then((response) => {
        if (response?.data?.code === 201) {
          var encrypted_json = JSON.parse(atob(response?.data?.data?.user));

          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          ).toString(CryptoJS.enc.Utf8);

          const parsed = JSON.parse(dec.slice(8, -2));

          setPhoneNumber(parsed?.phone);
          setLoading(true);
          setTimeout(() => {
            setOtpMode(true);
            setLoading(false);
          }, 1000);
        }
      })
      .catch((errors) => {
        setSignupErrors(errors?.response?.data?.errors);
        setLoading(false);
      });
  };

  const handleVerifyOtp = () => {
    if (phoneNumber === "") {
      setPhoneError("Please enter phone");
    } else if (otp === "") {
      setOtpError("Please enter OTP");
    } else if (otp.length !== 6) {
      setOtpError("Only 6 digit allowed");
    } else {
      let params = {
        otp: otp,
        phone: phoneNumber,
      };

      verifyOtp(params)
        .then((response) => {
          if (response.data.code === 200) {
            localStorage.setItem("token", response?.data.data.access_token);
            setOtpServerError("");
            setLoading(true);
            setTimeout(() => {
              router.push("/profile/profile-page");
              setLoading(false);
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setOtpServerError(error.response.data.message);
        });
    }
  };

  const getSliderData = () => {
    getSlider()
      .then((res) => {
        if (res.data.status === 200) {
          setSliderData(res?.data?.slider);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // getCommonOption();
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getSliderData();
    const token = localStorage.getItem("token");
    setAccessToken(token);
  }, []);

  if (!post) return null;

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
  };

  return (
    <>
      {/* Banner & Form 1 */}
      <div className="relative md:h-auto h-[800px]">
        <div className="h-[650px]">
          <Slider {...settings}>
            {sliderData?.map((item, index) => (
              <div key={index}>
                <img
                  src={item?.ImageSrc}
                  alt={"slider"}
                  width={200}
                  height={200}
                  style={{
                    width: "100%",
                    height: "650px",
                    margin: "auto",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
        {/* <div className="absolute md:top-[50%] md:-translate-y-[50%] md:left-[10%] md:-translate-x-[10%] top-[2%] -translate-y-[5%] left-[50%] -translate-x-[50%] md:w-1/2 w-full px-4">
          <div
            className="bg-black opacity-80 text-white md:text-3xl text-xl font-bold py-3 md:py-10 px-20 rounded-md md:w-max w-full text-center"
            style={{ fontFamily: "Great Vibes" }}
          >
            <div className="flex justify-center">
              <span className="md:text-8xl text-4xl leading-tight">Banna</span>
              <SlMustache className="self-center md:text-8xl text-4xl md:ml-5 ml-4 md:mt-0 mt-0 " />
            </div>
            <span className="md:text-4xl text-xl">&</span>
            <div className="flex justify-center">
              <span className="md:text-8xl text-4xl leading-tight">Baisa</span>
              <GiJewelCrown className="self-center md:text-8xl text-4xl md:ml-4 ml-3 md:pb-2 pb-1" />
            </div>
            <span className="md:text-4xl text-xl">Matrimony</span>
          </div>
        </div> */}

        {!accessToken && (
          <div className="absolute md:top-[50%] md:-translate-y-[50%] md:right-[10%] md:-translate-x-[10%] top-[90%] -translate-y-[90%] right-[0%] left-[50%] -translate-x-[50%] md:w-1/2 w-full px-4">
            <div className="bg-white rounded-md p-4 shadow-md md:w-max w-full ml-auto">
              <div className="text-xl text-gray-900 title-font font-medium text-center mb-4">
                Register Yourself
              </div>
              {otpMode ? (
                <div className="left-0">
                  <div className="w-1/2">
                    <input
                      name="phone"
                      id="phone"
                      type="number"
                      placeholder="Enter your phone"
                      className="px-3 py-2 border-2 rounded md:w-[22rem] w-full text-sm font-medium"
                      value={phoneNumber}
                    />
                    {phoneError && (
                      <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                        {phoneError}
                      </div>
                    )}
                  </div>
                  <div className="w-1/2 mt-3">
                    <input
                      name="otp"
                      id="otp"
                      type="number"
                      placeholder="OTP"
                      className="px-3 py-2 border-2 rounded md:w-[22rem] w-full text-sm font-medium"
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setOtpError("");
                      }}
                    />
                    {otpError && (
                      <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                        {otpError}
                      </div>
                    )}
                  </div>
                  {otpServerError && (
                    <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                      {otpServerError}
                    </div>
                  )}

                  <div className="pt-3">
                    <button
                      className="bg-[#aa0000] hover:opacity-80 transition-all py-3 px-3 text-white w-full rounded-md"
                      onClick={handleVerifyOtp}
                    >
                      {loading ? (
                        <CircularProgress size={20} color={"inherit"} />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(userRegistrationFunction)}
                  autoComplete="off"
                >
                  <div className="grid grid-rows-[200px_minmax(900px,_1fr)_100px gap-2">
                    <div className="flex md:justify-between justify-center">
                      <div className="mr-2 w-1/2">
                        <select
                          name="profile_by"
                          id="profile"
                          {...register("profile_by", { required: true })}
                          className="md:w-52 w-full border border-gray-300 rounded px-2 py-2 text-sm font-medium"
                        >
                          <option value="" hidden>
                            Profile By
                          </option>
                          {post?.profile?.map((pro, index) => {
                            return (
                              <option key={index} value={pro}>
                                {pro}
                              </option>
                            );
                          })}
                        </select>
                        {errors.profile_by && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Profile By
                          </div>
                        )}
                      </div>

                      <div className="w-1/2">
                        <select
                          name="gender"
                          id="gender"
                          {...register("gender", { required: true })}
                          className="md:w-52 w-full border border-gray-300 rounded px-2 py-2 text-sm font-medium"
                        >
                          <option value="" hidden>
                            Gender
                          </option>
                          {post?.gender?.map((gen, index) => {
                            return (
                              <option key={index} value={gen}>
                                {gen}
                              </option>
                            );
                          })}
                        </select>
                        {errors.gender && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Gender
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:justify-between justify-center">
                      <div className="mr-2 w-1/2">
                        <select
                          name="mat_status"
                          {...register("mat_status", { required: true })}
                          className="md:w-52 w-full border border-gray-300 rounded px-2 py-2 text-sm font-medium"
                        >
                          <option value="" hidden>
                            Marital Status
                          </option>
                          {post?.mat_status?.map((mat_sat, index) => {
                            return (
                              <option key={index} value={mat_sat}>
                                {mat_sat}
                              </option>
                            );
                          })}
                        </select>
                        {errors.mat_status && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Marital Status
                          </div>
                        )}
                      </div>
                      <div className="w-1/2">
                        <select
                          name="religion"
                          id="religion"
                          {...register("religion", { required: true })}
                          className="md:w-52 w-full border border-gray-300 rounded px-2 py-2 text-sm font-medium"
                        >
                          <option value="" hidden>
                            Community
                          </option>
                          {post?.religion?.map((rel, index) => {
                            return (
                              <option key={index} value={rel.id}>
                                {rel.name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.religion && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Religion
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:justify-between justify-center">
                      <div className="mr-2 w-1/2">
                        <select
                          name="caste"
                          id="caste"
                          {...register("caste", { required: true })}
                          className="md:w-52 w-full border border-gray-300 rounded px-2 py-2 text-sm font-medium"
                        >
                          <option value="" hidden>
                            Clan
                          </option>
                          {post?.caste?.map((cas, index) => {
                            return (
                              <option key={index} value={cas.id}>
                                {cas.name}
                              </option>
                            );
                          })}
                        </select>
                        {errors.caste && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Caste
                          </div>
                        )}
                      </div>
                      <div className="w-1/2">
                        <input
                          name="dob"
                          {...register("dob", { required: true })}
                          type={"text"}
                          placeholder="Enter date of birth"
                          // defaultValue={moment(newDate).format("YYYY-MM-DD")}
                          onFocus={(e) => (e.target.type = "date")}
                          className="px-2 py-2 border-2 rounded text-gray-600 md:w-52 w-full text-sm font-medium"
                        />
                        {errors.dob && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            Please select Date of Birth
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:justify-between justify-center">
                      <div className="mr-2 w-1/2">
                        <input
                          name="name"
                          id="name"
                          {...register("name", {
                            required: true,
                            pattern: /^\b[A-Z.\s']+\b$/i,
                          })}
                          type="text"
                          placeholder="First Name"
                          className="px-3 border-2 py-2 rounded md:w-52 w-full text-sm font-medium"
                        />
                        {errors.name && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            {errors.name.type === "required" ? (
                              "Please Enter Name"
                            ) : (
                              <span>
                                Name should not contain <br /> numbers and
                                special characters
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-1/2">
                        <input
                          name="last_name"
                          id="last_name"
                          {...register("last_name", {
                            required: true,
                            pattern: /^\b[A-Z.\s']+\b$/i,
                          })}
                          type="text"
                          placeholder="Last Name"
                          className="px-3 border-2 py-2 rounded md:w-52 w-full text-sm font-medium"
                        />
                        {errors.last_name && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            {errors.last_name.type === "required" ? (
                              "Please Enter Last Name"
                            ) : (
                              <span>
                                Last Name should not contain <br /> numbers and
                                special characters
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:justify-between justify-center">
                      <div className="mr-2 w-full">
                        <input
                          name="email"
                          id="email"
                          
                          {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          })}
                          placeholder="Email Id"
                          className="px-3 border-2 py-2 rounded w-full text-sm font-medium"
                        />
                        {errors.email && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            {errors.email.type === "required"
                              ? "Please Enter Email"
                              : "Please Enter Valid Email"}
                          </div>
                        )}
                        {signupErrors?.email && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            {signupErrors?.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:justify-between justify-center">
                      <div className="flex items-center border border-gray-300 bg-white rounded w-full">
                        <input
                          name="password"
                          id="password"
                          {...register("password", {
                            required: true,
                            pattern:
                              /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*).{8}$/,
                          })}
                          type={passwordType}
                          placeholder="Password"
                          className="px-3 py-2 rounded w-full text-sm font-medium"
                        />
                        <div
                          className="btn btn-outline-primary px-3 cursor-pointer"
                          onClick={togglePassword}
                        >
                          {passwordType === "password" ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </div>
                      </div>
                      {errors.password && (
                        <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                          {errors.password.type === "required"
                            ? "Please Enter Password"
                            : "Password should be atleast 8 characters"}
                        </div>
                      )}
                    </div>
                    <div className="flex md:justify-between justify-center">
                      <div className="w-1/5 self-center mr-2">
                        <input
                          name="dialing_code"
                          id="dialing_code"
                          {...register("dialing_code", { required: true })}
                          type="tel"
                          placeholder="+91"
                          value={"+ 91"}
                          className="px-3 border-2 py-2 rounded w-full text-center text-sm font-medium"
                        />
                      </div>
                      <div className="w-4/5">
                        <input
                          name="phone"
                          id="phone"
                          {...register("phone", {
                            required: true,
                            pattern: /^\d{10}$/,
                            minLength: 10,
                            maxLength: 10,
                          })}
                          type="number"
                          placeholder="Enter Your Number"
                          className="px-3 border-2 py-2 rounded w-full pl-2 text-sm font-medium"
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <div className="text-red-600 text-xs font-semibold pl-1 text-end">
                        {errors.phone.type === "required"
                          ? "Please Enter Phone"
                          : "Phone number should be 10 digit only"}
                      </div>
                    )}
                    {signupErrors?.phone && (
                      <div className="text-red-600 text-xs font-semibold pl-1 text-end">
                        {signupErrors?.phone}
                      </div>
                    )}
                    <div className="py-2">
                      <div className="text-xs font-semibold text-gray-500 text-center">
                        By clicking on &apos;Accept & Register&apos;, that
                        confirm you <br /> accept the Terms of Use and Safety
                        Tips
                      </div>
                    </div>
                    <div>
                      <div>
                        <button
                          type="submit"
                          className="bg-[#aa0000] hover:opacity-80 transition-all py-3 px-3 text-white w-full rounded-md"
                        >
                          {loading ? (
                            <CircularProgress size={20} color={"inherit"} />
                          ) : (
                            "Accept & Register"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TopBanner;
