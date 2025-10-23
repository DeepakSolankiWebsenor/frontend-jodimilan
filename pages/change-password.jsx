import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useForm } from "react-hook-form";
import useApiService from "../services/ApiService";
import Head from "next/head";

const ChangePassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const { changePassword } = useApiService();
  const [serverError, setServerError] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  const handlePasswordChange = (data) => {
    const { current_password, password, password_confirmation } = data;
    let params = {
      current_password: current_password,
      password: password,
      password_confirmation: password_confirmation,
    };

    changePassword(params)
      .then((res) => {
        if (res.data.code === 200) {
          setServerError("");
          setLoading(true);
          setTimeout(() => {
            setAlert(true);
            setLoading(false);
          }, 2000);
          setTimeout(() => {
            router.push("/")
          }, 3000)
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 422) {
          setServerError(error?.response?.data?.errors?.password);
        } else if (error.response?.data.code === 401) {
          setServerError(error?.response?.data?.message);
        } else {
          setServerError("");
        }
      });
  };

  return (
    <div>
      <Head>
        <title>Change Password</title>
        <meta name="description" content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate." />
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
          Password updated Successfully.
        </Alert>
      </Snackbar>

      <div className="text-center lg:my-10 my-5 lg:text-4xl text-2xl px-3 text-[#333] font-medium">
        <span className="text-primary">Change</span> Password
      </div>

      <div className="mb-10 flex justify-center w-full">
        <form onSubmit={handleSubmit(handlePasswordChange)}>
          <div className="border-2 border-gray-300 rounded-md md:p-10 p-4 lg:w-[600px] md:w-[500px] w-[300px]">
            <div className="flex flex-col py-[14px]">
              <label className="mb-1 text-[#333] font-semibold">
                Current Password
              </label>
              <input
                type="text"
                name="current_password"
                className="font-medium focus:outline-none border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-400"
                placeholder="Enter current password"
                {...register("current_password", { required: true })}
              />
              {errors.current_password && (
                <div className="mt-2 text-sm text-red-600 font-medium">
                  Old Password is required
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[#333] font-semibold">
                New Password
              </label>
              <input
                type="text"
                name="password"
                className="font-medium focus:outline-none border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-400"
                placeholder="Enter new password"
                {...register("password", {
                  required: true,
                  pattern:
                    /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*).{8}$/,
                })}
              />
            </div>
            {errors.password && (
              <div className="mt-2 text-sm text-red-600 font-semibold">
                {errors.password.type === "required"
                  ? "Password is required"
                  : "Minimum 8 characters required"}
              </div>
            )}
            <div className="flex flex-col py-[14px]">
              <div className="flex flex-col">
                <label className="mb-1 text-[#333] font-semibold">
                  Confirm Password
                </label>
                <input
                  type="text"
                  name="password_confirmation"
                  className="font-medium focus:outline-none border border-gray-400 rounded-[4px] p-2 placeholder:font-medium placeholder:text-gray-400"
                  placeholder="Enter confirm password"
                  {...register("password_confirmation", { required: true })}
                />
              </div>
              {errors.password_confirmation && (
                <div className="mt-2 text-sm text-red-600 font-semibold">
                  Confirm Password field is required
                </div>
              )}
              {serverError && (
                <div className="mt-2 text-sm text-red-600 font-semibold">
                  {serverError}
                </div>
              )}
            </div>
            <div className="flex justify-center pt-3">
              <button
                type="submit"
                className="w-full bg-sky-600 font-semibold hover:bg-[#ff716f] text-white text-center py-2 px-4 rounded-md"
              >
                {loading ? (
                  <CircularProgress size={20} color={"inherit"} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
