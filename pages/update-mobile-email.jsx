import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useApiService from "../services/ApiService";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Head from "next/head";

const UpdateMobileEmail = () => {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpShow, setOtpShow] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCodeShow, setEmailCodeShow] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const { profileUpdate, verifyOtp, verifyEmail, createOTP, createOTPEmail } =
    useApiService();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [errors, setErrors] = useState({
    phone: "",
    otp: "",
    email: "",
    emailCode: "",
  });
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  const handleMobileUpdate = () => {
    const _form = new FormData();
    if (!phone) {
      setErrors({ phone: "Please enter phone number." });
    } else if (phone.length > 0 && phone.length !== 10) {
      setErrors({ phone: "Phone number must be 10 digit." });
    }

    if (email !== "") {
      _form.append("email", email);
    }

    if ((tab == 0 && phone.length === 10) || email !== "") {
      _form.append('phone', phone)
      createOTP(_form)
        .then((response) => {
          setOtpShow(true);
        })
        .catch((error) => {
          if (error.response.data.code === 422) {
            setErrors({ phone: error.response.data?.message });
          }
          console.log("error", error);
        });
    }
  };

  const handleOtpVerify = () => {
    let params = {
      phone: phone,
      otp: otp,
    };

    if (otp === "") {
      setErrors({ otp: "Otp is required" });
    } else if (otp.length !== 6) {
      setErrors({ otp: "OTP should be 6 digits only" });
    } else {
      verifyOtp(params)
        .then((res) => {
          if (res.data.code === 200) {
            profileUpdate(params)
              .then((res) => {
                if (res.data.status === 200) {
                  setLoading(true);
                  setPhone("");
                  setTimeout(() => {
                    setLoading(false);
                    setOtpShow(false);
                    setAlert(true);
                    setAlertMsg("Phone verified successfully.");
                  }, 1000);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          if (error.response.data.code === 422) {
            setServerError(error.response.data.message);
          }
        });
    }
  };

  const handleEmailUpdate = () => {
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setErrors({ email: "Please enter Email" });
    } else if (!pattern.test(email)) {
      setErrors({ email: "Please enter valid email" });
    } else {
      const _form = new FormData();
      if (email !== "") {
        _form.append("email", email);
      }
      createOTPEmail(_form)
        .then((response) => {
          setEmailCodeShow(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEmailVerify = () => {
    if (emailCode === "") {
      setErrors({ emailCode: "Verification code is required" });
    } else if (emailCode.length !== 6) {
      setErrors({ emailCode: "Verification code should be 6 digits only" });
    } else {
      let params = {
        email: email,
        otp: emailCode,
      };
      verifyEmail(params)
        .then((res) => {
          if (res.data.code === 200) {
            profileUpdate(params)
              .then((res) => {
                if (res.data.status === 200) {
                  setEmail("");
                  setServerError("");
                  setEmailCodeShow(false);
                  setTimeout(() => {
                    setAlert(true);
                    setLoading(false);
                    setAlertMsg("Email verified successfully.");
                  }, 2000);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          if (error.response.data.code === 422) {
            setServerError(error.response.data.message);
          }
        });
    }
  };

  return (
    <div>
      <Head>
        <title>Update User</title>
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
          {alertMsg}
        </Alert>
      </Snackbar>

      <div className="text-center lg:my-10 my-5 lg:text-4xl text-2xl px-3 text-[#333] font-medium">
        <span className="text-[#aa0000]">Change</span> Primary Mobile & Email
      </div>

      <div className="flex justify-center">
        <div className="flex justify-center mb-5 lg:w-[600px] md:w-[500px] w-[300px]">
          <div
            className={`text-xs w-full text-center font-bold uppercase px-5 py-3 cursor-pointer ${
              tab === 0 ? `border-b-2 border-[#aa0000]` : "border-none"
            }`}
            onClick={() => setTab(0)}
          >
            Mobile No.
          </div>
          <div
            className={`text-xs w-full text-center font-bold uppercase px-5 py-3 cursor-pointer ${
              tab === 1 ? `border-b-2 border-[#aa0000]` : "border-none"
            }`}
            onClick={() => setTab(1)}
          >
            Email Address
          </div>
        </div>
      </div>

      <div className="mb-10 flex justify-center w-full">
        {tab === 0 ? (
          <div className="border-2 border-gray-300 rounded-md md:p-10 p-4 lg:w-[600px] md:w-[500px] w-[300px]">
            <div className="text-center font-medium text-sm">
              Kindly Enter the New Mobile No. after selecting country code and
              proceed to verify:
            </div>
            <div className="flex gap-3 mt-5 justify-center">
              <div className="lg:w-[100px] w-[94px]">
                <input
                  type={"text"}
                  disabled
                  className="font-medium w-full focus:outline-none border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-500"
                  defaultValue={"(IN +91)"}
                />
              </div>
              <div className="w-full">
                <input
                  type="number"
                  name="phone"
                  value={phone}
                  className="font-medium focus:outline-none w-full border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-500"
                  placeholder="Enter your phone"
                  autoComplete="off"
                  onChange={(e) => {
                    // if (e.target.value) {
                    setErrors({ phone: "" });
                    setPhone(e.target.value);

                    setServerError("");
                    // }
                  }}
                />
                {errors.phone && (
                  <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {otpShow && (
              <div className="mt-5">
                <input
                  type={"number"}
                  name="otp"
                  className="font-medium focus:outline-none w-full border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-500"
                  placeholder="Enter verification code"
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.value) {
                      setErrors({ otp: "" });
                      setOtp(e.target.value);
                      setServerError("");
                    }
                  }}
                />
                {errors.otp && (
                  <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                    {errors.otp}
                  </div>
                )}
                {serverError && (
                  <div className="text-red-600 text-center text-xs mt-2 font-semibold pl-1">
                    {serverError}
                  </div>
                )}
              </div>
            )}

            {otpShow ? (
              <div className="flex justify-center pt-3">
                <button
                  className="w-full bg-sky-600 font-semibold hover:bg-[#ff716f] text-white text-center py-2 px-4 rounded-md"
                  onClick={handleOtpVerify}
                >
                  {loading ? (
                    <CircularProgress size={20} color={"inherit"} />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            ) : (
              <div className="flex justify-center pt-3">
                <button
                  className="w-full bg-sky-600 font-semibold hover:bg-[#ff716f] text-white text-center py-2 px-4 rounded-md"
                  onClick={handleMobileUpdate}
                >
                  {loading ? (
                    <CircularProgress size={20} color={"inherit"} />
                  ) : (
                    "Send Verify Code"
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-gray-300 rounded-md md:p-10 p-4 lg:w-[600px] md:w-[500px] w-[300px]">
            <div className="text-center font-medium text-sm">
              Kindly Enter the New Email and proceed to verify:
            </div>
            <div className="mt-5 w-full">
              <div className="flex mt-3">
                <div className="my-auto text-[#333] w-[150px] font-medium text-sm lg:text-base">
                  Current Email
                </div>
                <div className="w-full">
                  <input
                    type={"text"}
                    name="email"
                    className="lg:text-base text-sm font-medium focus:outline-none w-full border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-500"
                    placeholder="Enter new email"
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.value) {
                        setErrors({ email: "" });
                        setEmail(e.target.value);
                        setServerError("");
                      }
                    }}
                    value={email}
                  />
                  {errors.email && (
                    <div className="mt-2 text-red-600 text-xs font-semibold pl-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {emailCodeShow && (
                <div className="flex items-center w-full mt-3">
                  <label className="mb-1 text-[#333] w-[150px] font-medium text-sm lg:text-base">
                    Email Verify Code
                  </label>
                  <input
                    type={"number"}
                    name="email_code"
                    className="lg:text-base text-sm font-medium focus:outline-none w-full border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-500"
                    placeholder="Enter email verifcation code"
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.value) {
                        setErrors({ email: "" });
                        setServerError("");
                        setEmailCode(e.target.value);
                      }
                    }}
                  />
                </div>
              )}
              {errors.emailCode && (
                <div className="text-red-600 text-center text-xs mt-2 font-semibold pl-1">
                  {errors.emailCode}
                </div>
              )}
              {serverError && (
                <div className="text-red-600 text-center text-xs mt-2 font-semibold pl-1">
                  {serverError}
                </div>
              )}
            </div>
            {emailCodeShow ? (
              <div className="flex justify-center pt-3">
                <button
                  className="w-full bg-sky-600 font-semibold hover:bg-[#ff716f] text-white text-center py-2 px-4 rounded-md"
                  onClick={handleEmailVerify}
                >
                  {loading ? (
                    <CircularProgress size={20} color={"inherit"} />
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </div>
            ) : (
              <div className="flex justify-center pt-3">
                <button
                  className="w-full bg-sky-600 font-semibold hover:bg-[#ff716f] text-white text-center py-2 px-4 rounded-md"
                  onClick={handleEmailUpdate}
                >
                  {loading ? (
                    <CircularProgress size={20} color={"inherit"} />
                  ) : (
                    "Send Email Verify Code"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMobileEmail;
