import { useEffect, useState } from "react";
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
  const { customerLogin, resendOtp } = useApiService();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/profile/profile-page");
  }, [router]);

  const userLoginFunction = (data) => {
    setDisableButton(true);
    setLoading(true);
    setServerError("");

    let params = {};
    if (data.email.toLowerCase().includes("ryt")) {
      params = { ryt_id: data.email, password: data.password };
    } else {
      params = { email: data.email, password: data.password };
    }

    customerLogin(params)
      .then((res) => {
        if (res?.data?.code === 200) {
          localStorage.setItem("token", res?.data?.data?.access_token);
          setIsLoginSuccess(true);
          router.push("/profile/profile-page");
        }
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        const msg = error?.response?.data?.message;

        if (code === 401) {
          setServerError(msg);
        } else if (code === 403) {
          setServerError("Your account is not active. Verify OTP.");
          setEmailForOtp(data.email);

          resendOtp({ email: data.email })
            .then(() => {
              toast.success("OTP resent to your email!");
              setOtpModalOpen(true);
            })
            .catch(() => toast.error("Failed to resend OTP"));
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setDisableButton(false);
        setLoading(false);
      });
  };

  return (
    <>
      <OtpVerify
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        email={emailForOtp}
      />

      <Signup open={signupOpen} onClose={() => setSignupOpen(false)} />

      <Snackbar
        open={isLoginSuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setIsLoginSuccess(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Sign In Successfully !
        </Alert>
      </Snackbar>

      <div className="lg:px-48 md:px-6 px-4">
        <div className="py-20">
          <div className="md:w-96 w-80 bg-white border py-6 px-4 rounded shadow mx-auto">
            <div className="text-center text-2xl text-slate-600 font-semibold">
              Login
            </div>

            <form onSubmit={handleSubmit(userLoginFunction)} autoComplete="off">
              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Email / RYT ID"
                  className="border border-gray-300 py-2 px-2 rounded w-full outline-none"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2 font-semibold pl-1">
                    Please enter Email or RYT ID
                  </p>
                )}

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
                    {!passwordShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                </div>

                {errors.password && (
                  <p className="text-red-600 text-xs mt-2 font-semibold pl-1">
                    Please enter password
                  </p>
                )}

                {serverError && (
                  <p className="text-red-600 text-xs font-semibold pl-1 mt-2">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={disableButton}
                  className="mt-4 bg-primary text-white text-sm font-semibold py-2 px-4 rounded w-full"
                >
                  {loading ? (
                    <CircularProgress size={20} color={"inherit"} />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <button
                className="text-primary font-medium text-sm"
                onClick={() => router.push("/ForgetPassword")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-gray-600 text-sm text-center mt-2">
              Don't have an account?
              <button
                className="text-primary font-medium cursor-pointer ml-1"
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
