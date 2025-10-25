import { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import useApiService from "../services/ApiService";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../services/redux/slices/userSlice";
import useFirebase from "../hooks/useFirebase";

const UserLogin = () => {
  const { initFirebase } = useFirebase();
  const [serverError, setServerError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { customerLogin } = useApiService();
  const [alert, setAlert] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const inputRef = createRef();
  const dispatch = useDispatch();
  const [disableButton, setDisableButton] = useState(false);

  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.back();
    }
  }, [router]);

  const userLoginFunction = (data) => {
    setDisableButton(true);
    let params = {};
    if (data.email.includes("RYT") || data.email.includes("ryt")) {
      params = {
        ryt_id: data.email,
        password: data.password,
      };
    } else {
      if (data.email.includes("@")) {
        params = {
          email: data.email,
          password: data.password,
        };
      }
    }

    setFieldError("");
    customerLogin(params)
      .then((res) => {
        if (res?.data?.code === 200) {
          var encrypted_json = JSON.parse(atob(res?.data?.data?.user));
          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          ).toString(CryptoJS.enc.Utf8);
          const parsed = JSON.parse(dec.slice(8, -2));
          localStorage.setItem("user_id", parsed?.id);
          localStorage.setItem("token", res?.data?.data?.access_token);
          dispatch(setUser({ user: res?.data?.data?.user }));

          setServerError("");
          setAlert(true);
          initFirebase({ userId: parsed?.id });
          router.push("/profile/profile-page");
        }
      })
      .catch((error) => {
        if (error?.response?.data?.code === 401) {
          setServerError(error?.response?.data?.message);
        } else if (error?.response?.data?.code === 400) {
          // router.push("/otp-verification");
          setServerError("Your account is not active. Please contact admin.");
        }
      })
      .finally(() => setDisableButton(false));
  };

  return (
    <>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Sign In Successfully !
        </Alert>
      </Snackbar>

      <div className="lg:px-48 md:px-6 px-4">
        <div className="py-20">
          <div className="h-full">
            {/* Validate Email and Password */}
            <div className="">
              <div className="md:w-96 w-80 bg-white border py-6 md:px-6 px-4 rounded shadow mx-auto">
                <div className="text-center text-2xl text-slate-600 font-semibold">
                  Login
                </div>
                <div className="my-6">
                  <div className="text-gray-600 text-sm text-center font-medium leading-[18px] mb-4">
                    Please enter your email and password and click on
                    &quot;Continue&quot; to login.
                  </div>
                  <form
                    onSubmit={handleSubmit(userLoginFunction)}
                    autoComplete="off"
                  >
                    <div className="">
                      <div className="text-gray-800 font-semibold">
                        <input
                          type="text"
                          name="email"
                          autoFocus={true}
                          placeholder="Email/ID"
                          className="border border-gray-300 py-2 px-2 rounded w-full"
                          {...register("email", {
                            required: true,
                            pattern: "",
                          })}
                        />
                        {errors.email && (
                          <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                            {errors.email.type === "required"
                              ? "Please Enter Email"
                              : "Please Enter Valid Email"}
                          </div>
                        )}
                      </div>

                      <div className="flex border font-semibold border-gray-300 rounded mt-4 items-center pr-2">
                        <input
                          type={passwordShow ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="py-2 px-2 rounded w-full outline-none"
                          {...register("password", {
                            required: true,
                            pattern:
                              /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*).{8}$/,
                          })}
                        />
                        <div
                          className="cursor-pointer text-gray-600"
                          onClick={() => setPasswordShow(!passwordShow)}
                        >
                          {!passwordShow ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </div>
                      </div>
                      {errors.password && (
                        <div className="text-red-600 text-xs mt-2 font-semibold pl-1">
                          {errors.password.type === "required"
                            ? "Please Enter Password"
                            : "Minimum 8 characters required"}
                        </div>
                      )}
                      {serverError && (
                        <div className="text-red-600 text-xs font-semibold pl-1 mt-2">
                          {serverError}
                        </div>
                      )}
                      {fieldError && (
                        <div className="text-red-600 text-xs font-semibold pl-1 mt-2">
                          {fieldError}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="mt-4 bg-primary text-white text-sm font-semibold py-2 px-4 rounded w-full hover:bg-[#ff716f] transition-all outline-none"
                        disabled={disableButton ? true : false}
                      >
                        {loading ? (
                          <CircularProgress size={20} color={"inherit"} />
                        ) : (
                          "Continue"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="text-center">
                  <button
                    className="text-primary cursor-pointer font-medium text-sm"
                    onClick={() => router.push("/ForgetPassword")}
                  >
                    Forgot Password
                  </button>
                </div>

                <div className="text-gray-600 text-sm text-center font-medium leading-[18px] mt-2">
                  Don&apos;t have an account. &quot;
                  <button
                    className="text-primary cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Register
                  </button>
                  &quot; here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
