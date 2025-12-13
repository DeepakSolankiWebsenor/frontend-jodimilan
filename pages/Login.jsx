/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../services/redux/slices/userSlice";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import useApiService from "../services/ApiService";
import Signup from "../components/Signup";
import OtpVerify from "../components/OtpVerify";

const UserLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { customerLogin, resendOtp } = useApiService();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const [signupOpen, setSignupOpen] = useState(false);

  // OTP Modal States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [phoneForOtp, setPhoneForOtp] = useState("");
  const [dialingCode, setDialingCode] = useState("91");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // --------------------------
  // 🔥 LOGIN WITH OTP HANDLING
  // --------------------------
  const userLoginFunction = (data) => {
    setDisableButton(true);
    setLoading(true);
    setServerError("");

    const params = data.email.startsWith("RYT")
      ? { ryt_id: data.email, password: data.password }
      : { email: data.email, password: data.password };

    customerLogin(params)
      .then((res) => {
        if (res?.data?.code === 200) {
          localStorage.setItem("token", res.data.data.access_token);

          const userData = res.data.data.user || res.data.data;
          dispatch(setUser(userData));

          toast.success("Login Successful!");
          router.push("/profile/profile-page");
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");

        const code = err?.response?.data?.code;
        const msg = err?.response?.data?.message;
        const dataResp = err?.response?.data?.data || {};

        // 🔥 CASE: Phone Not Verified → Open OTP Modal
        if (code === 403 && msg?.includes("Phone not verified")) {
          setServerError("Your account is not active. Verify OTP.");

          // Get phone + dialing code
          setPhoneForOtp(dataResp.phone);
          setDialingCode(dataResp.dialing_code || "91");

          // Open OTP Popup
          setOtpModalOpen(true);

          return;
        }

        if (code === 401) {
          setServerError(msg);
        } else {
          setServerError("Something went wrong, try again.");
        }
      })
      .finally(() => {
        setDisableButton(false);
        setLoading(false);
      });
  };

  return (
    <>
      {/* OTP Popup */}
      <OtpVerify
        open={otpModalOpen}
        phone={phoneForOtp}
        dialing_code={dialingCode}
        onClose={() => setOtpModalOpen(false)}
        onVerified={() => {
          setOtpModalOpen(false);
          router.push("/profile/profile-page");
        }}
      />

      {/* Signup Dialog */}
      <Signup open={signupOpen} onClose={() => setSignupOpen(false)} />

      {/* LOGIN UI */}
      <div className="lg:px-48 md:px-6 px-4">
        <div className="py-20">
          <div className="md:w-96 w-80 bg-white border py-6 px-4 rounded shadow mx-auto">
            <div className="text-center text-2xl text-slate-600 font-semibold">
              Login
            </div>

            <form onSubmit={handleSubmit(userLoginFunction)} autoComplete="off">
              <div className="mt-6">
                {/* Email / RYT ID */}
                <input
                  type="text"
                  placeholder="Email / RYT ID"
                  className="border border-gray-300 py-2 px-2 rounded w-full outline-none"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2">
                    Please enter Email or RYT ID
                  </p>
                )}

                {/* Password */}
                <div className="flex border border-gray-300 rounded mt-4 items-center pr-2">
                  <input
                    type={passwordShow ? "text" : "password"}
                    placeholder="Password"
                    className="py-2 px-2 rounded w-full outline-none"
                    {...register("password", { required: true })}
                  />
                  <span
                    onClick={() => setPasswordShow(!passwordShow)}
                    className="text-gray-600 cursor-pointer"
                  >
                    {passwordShow ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-2">
                    Please enter password
                  </p>
                )}

                {/* Backend Error */}
                {serverError && (
                  <p className="text-red-600 text-xs mt-2">{serverError}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={disableButton}
                  className="mt-4 bg-primary text-white py-2 rounded w-full"
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="text-center mt-4">
              <button
                className="text-primary text-sm"
                onClick={() => router.push("/ForgetPassword")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-gray-600 text-sm text-center mt-2">
              Don't have an account?
              <button
                className="text-primary ml-1"
                onClick={() => setSignupOpen(true)}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
