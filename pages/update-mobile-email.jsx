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
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeShow, setEmailCodeShow] = useState(false);

  const {
    profileUpdate,
    verifyMobileOTP,
    verifyEmailOTP,
    createOTP,
    createEmailOTP,
  } = useApiService();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/Login");
    }
  }, [router]);

  // ==========================
  // 📌 Send OTP for Mobile
  // ==========================
 const handleMobileUpdate = (e) => {
  e.preventDefault();
  setErrors({});
  setServerError("");

  if (!phone || phone.length !== 10) {
    setErrors({ phone: "Please enter a valid 10-digit phone number" });
    return;
  }

  setLoading(true);
  createOTP({
    phone: phone,
    dialing_code: "91",
  })
    .then(() => {
      setOtpShow(true);
    })
    .catch((err) => {
      const message = err?.response?.data?.message || "Unable to send OTP";
      setServerError(message);
    })
    .finally(() => setLoading(false));
};


  // ==========================
  // 📌 Verify Mobile OTP
  // ==========================
  const handleOtpVerify = (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    if (!otp || otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits only" });
      return;
    }

    // Backend ke hisaab se: mobile verify ke liye phone + otp bhej rahe hain
    const verifyPayload = { phone, otp };

    setLoading(true);
    verifyMobileOTP(verifyPayload)
      .then((res) => {
        if (res.data.code === 200) {
          const updateForm = new FormData();
          updateForm.append("phone", phone);

          return profileUpdate(updateForm);
        }
      })
      .then((res) => {
        if (res) {
          setPhone("");
          setOtp("");
          setOtpShow(false);
          setAlertMsg("Phone verified successfully.");
          setAlert(true);
        }
      })
      .catch((err) => {
        const message = err?.response?.data?.message || "Invalid OTP";
        setServerError(message);
      })
      .finally(() => setLoading(false));
  };

  // ==========================
  // 📌 Send OTP for Email
  // ==========================
  const handleEmailUpdate = (e) => {
  e.preventDefault();
  setErrors({});
  setServerError("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    setErrors({ email: "Enter a valid email address" });
    return;
  }

  setLoading(true);
  createEmailOTP({ email })
    .then(() => {
      setEmailCodeShow(true);
    })
    .catch((err) => {
      const message =
        err?.response?.data?.message || "Unable to send verification email";
      setServerError(message);
    })
    .finally(() => setLoading(false));
};


  // ==========================
  // 📌 Verify Email OTP
  // ==========================
  const handleEmailVerify = (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    if (!emailCode || emailCode.length !== 6) {
      setErrors({ emailCode: "Verification Code must be 6 digits" });
      return;
    }

    // Backend ke error message se pata chala: "Email and OTP are required"
    // isliye yaha email + otp dono bhej rahe hain
    const payload = { email, otp: emailCode };

    setLoading(true);
    verifyEmailOTP(payload)
      .then((res) => {
        if (res.data.code === 200) {
          const updateForm = new FormData();
          updateForm.append("email", email);

          return profileUpdate(updateForm);
        }
      })
      .then((res) => {
        if (res) {
          setAlertMsg("Email verified successfully.");
          setAlert(true);
          setEmail("");
          setEmailCode("");
          setEmailCodeShow(false);
        }
      })
      .catch((error) => {
        const message = error?.response?.data?.message || "Invalid OTP";
        setServerError(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Head>
        <title>Update Mobile & Email</title>
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

      <div className="text-center my-6 text-3xl font-semibold text-[#333]">
        <span className="text-primary">Update</span> Mobile & Email
      </div>

      <div className="flex justify-center mb-5 w-full">
        <div className="flex justify-center w-[320px] md:w-[500px]">
          <span
            className={`w-full text-center p-3 font-semibold cursor-pointer ${
              tab === 0 ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => {
              setServerError("");
              setErrors({});
              setTab(0);
            }}
          >
            Mobile No.
          </span>
          <span
            className={`w-full text-center p-3 font-semibold cursor-pointer ${
              tab === 1 ? "border-b-2 border-primary" : ""
            }`}
            onClick={() => {
              setServerError("");
              setErrors({});
              setTab(1);
            }}
          >
            Email
          </span>
        </div>
      </div>

      {/* 📌 MOBILE */}
      {tab === 0 && (
        <div className="flex justify-center">
          <form className="border p-6 rounded-md w-[300px] md:w-[500px] lg:w-[600px]">
            <label className="font-medium block mb-2">New Mobile Number</label>
            <input
              type="tel"
              className="border p-2 w-full"
              placeholder="Enter new phone number"
              value={phone}
              maxLength={10}
              minLength={10}
              pattern="[0-9]{10}"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  // prevent entering >10 digits
                  setPhone(value);
                }
              }}
            />

            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}

            {serverError && !otpShow && (
              <p className="text-red-600 text-sm mt-1">{serverError}</p>
            )}

            {otpShow && (
              <>
                <label className="font-medium block mt-4 mb-2">Enter OTP</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {errors.otp && (
                  <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                )}
                {serverError && (
                  <p className="text-red-600 text-sm text-center mt-1">
                    {serverError}
                  </p>
                )}
              </>
            )}

            <button
              className="bg-primary text-white w-full py-2 mt-5 rounded-md hover:bg-[#ff716f]"
              onClick={otpShow ? handleOtpVerify : handleMobileUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : otpShow ? (
                "Verify OTP"
              ) : (
                "Send Verify Code"
              )}
            </button>
          </form>
        </div>
      )}

      {/* 📌 EMAIL */}
      {tab === 1 && (
        <div className="flex justify-center">
          <form className="border p-6 rounded-md w-[300px] md:w-[500px] lg:w-[600px]">
            <label className="font-medium block mb-2">New Email</label>
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}

            {serverError && !emailCodeShow && (
              <p className="text-red-600 text-sm mt-1">{serverError}</p>
            )}

            {emailCodeShow && (
              <>
                <label className="font-medium block mt-4 mb-2">
                  Verification Code
                </label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  placeholder="Enter verification code"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                {errors.emailCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.emailCode}
                  </p>
                )}
                {serverError && (
                  <p className="text-red-600 text-sm text-center mt-1">
                    {serverError}
                  </p>
                )}
              </>
            )}

            <button
              className="bg-primary text-white w-full py-2 mt-5 rounded-md hover:bg-[#ff716f]"
              onClick={emailCodeShow ? handleEmailVerify : handleEmailUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : emailCodeShow ? (
                "Verify Code"
              ) : (
                "Send Email Verify Code"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateMobileEmail;
