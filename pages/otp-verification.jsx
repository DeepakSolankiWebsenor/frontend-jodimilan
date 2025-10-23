import { Alert, CircularProgress, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useState } from "react";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";

function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(null);
  const [phone, setPhone] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendOTP, verifyOtp } = useApiService();
  const [phoneError, setPhoneError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const handleSendOTP = () => {
    if (!phone) {
      setPhoneError("Please enter your phone number");
    } else if (phone.length != 10) {
      setPhoneError("Phone number must be 10 digit");
    } else {
      setLoading(true);
      setPhoneError("");
      const params = {
        phone,
      };
      sendOTP(params)
        .then((res) => {
          if (res.data.code == 200) {
            setShowOtpScreen(true);
          }
        })
        .catch((error) => {
          setPhoneError(error?.response?.data?.message);
          console.log(error);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      setOtpError("Please enter your OTP");
    } else if (otp.length != 6) {
      setOtpError("OTP must be 6 digit");
    } else {
      setLoading(true);
      setOtpError("");
      const params = {
        phone,
        otp,
      };

      verifyOtp(params)
        .then((res) => {
          if (res?.data?.code === 200) {
            setShowAlert(true);
            router.push("/login");
          }
        })
        .catch((error) => {
          console.log(error);
          setOtpError(error?.response?.data?.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="lg:px-48 md:px-6 px-4">
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setShowAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          OTP Verified Successfully !
        </Alert>
      </Snackbar>

      <div className="py-20">
        <div className="h-full">
          <div className="">
            <div
              className="md:w-[500px] w-80 bg-white border py-6 md:px-6 px-4 rounded shadow 
              mx-auto"
            >
              <div className="text-center text-2xl text-slate-600 font-semibold">
                OTP Verification
              </div>
              <hr className="my-2 border border-gray-200" />
              <div className="my-4 text-[16px] font-semibold text-gray-600 text-center">
                Please enter your phone number for OTP Verification.
              </div>
              <div className="my-3">
                <div className="text-gray-800 font-semibold">
                  <input
                    type="number"
                    name="phone"
                    placeholder="Enter your number"
                    autoComplete="off"
                    className="border border-gray-300 py-2 px-2 rounded w-full 
                      disabled:opacity-50 outline-none"
                    disabled={showOtpScreen ? true : false}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError("");
                    }}
                  />
                  {phoneError && (
                    <div className="mt-2 font-semibold text-red-600 text-sm">
                      {phoneError}
                    </div>
                  )}
                </div>

                {showOtpScreen && (
                  <div className="text-gray-800 font-semibold mt-4">
                    <input
                      type="number"
                      name="otp"
                      placeholder="Enter your OTP"
                      autoComplete="off"
                      className="border border-gray-300 py-2 px-2 rounded w-full 
                      disabled:opacity-50 outline-none"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setOtpError("");
                      }}
                    />
                    {otpError && (
                      <div className="mt-2 font-semibold text-red-600 text-sm">
                        {otpError}
                      </div>
                    )}
                  </div>
                )}

                {loading ? (
                  <button
                    className="mt-4 bg-[#aa0000] text-white text-sm font-semibold py-2 px-4 
                    rounded w-full hover:bg-[#ff716f] transition-all outline-none"
                    disabled
                  >
                    <CircularProgress size={20} color={"inherit"} />
                  </button>
                ) : (
                  <button
                    className="mt-4 bg-[#aa0000] text-white text-sm font-semibold py-2 px-4 
                    rounded w-full hover:bg-[#ff716f] transition-all outline-none"
                    onClick={showOtpScreen ? handleVerifyOtp : handleSendOTP}
                  >
                    {showOtpScreen ? "Verify OTP" : "Send OTP"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
