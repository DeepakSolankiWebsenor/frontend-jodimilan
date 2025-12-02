/* eslint-disable @next/next/no-img-element */
import {
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useForm } from "react-hook-form";
import useApiService from "../services/ApiService";
import Head from "next/head";

const ChangePassword = () => {
  const router = useRouter();
  const { changePassword } = useApiService();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [serverError, setServerError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const watchPassword = watch("new_password", "");

  useEffect(() => {
    if (!router.isReady) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/Login");
    }
  }, [router.isReady]);

  // Password Strength Checker
  const checkStrength = (pass) => {
    if (!pass) return setPasswordStrength(0);
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    setPasswordStrength(score);
  };

  useEffect(() => {
    checkStrength(watchPassword);
  }, [watchPassword]);

  const handlePasswordChange = (data) => {
    const { current_password, new_password, confirm_password } = data;

    if (new_password !== confirm_password) {
      setServerError("Passwords do not match");
      return;
    }

    setLoading(true);
    setServerError("");

    changePassword({
      current_password,
      new_password,
    })
      .then((res) => {
        if (res?.data?.code === 200) {
          setAlert(true);
          setTimeout(() => router.push("/"), 2000);
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Something went wrong!";
        setServerError(message);
      })
      .finally(() => setLoading(false));
  };

  const strengthColor = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"][
    passwordStrength - 1
  ];

  return (
    <div>
      <Head>
        <title>Change Password</title>
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

      <div className="text-center my-6 lg:my-10 lg:text-4xl text-3xl font-semibold text-[#333]">
        <span className="text-primary">Change</span> Password
      </div>

      <div className="mb-10 flex justify-center w-full">
        <form
          onSubmit={handleSubmit(handlePasswordChange)}
          className="border-2 border-gray-300 rounded-md md:p-10 p-4 lg:w-[500px] md:w-[450px] w-[300px]"
        >
          {/* Current Password */}
          <div className="relative mb-6">
            <label className="mb-1 text-[#333] font-semibold">
              Current Password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              className="w-full border border-gray-400 rounded-md p-2 pr-10"
              placeholder="Enter current password"
              {...register("current_password", { required: true })}
            />
            <IconButton
              onClick={() => setShowCurrent(!showCurrent)}
              className="!absolute right-2 top-6"
            >
              {showCurrent ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            {errors.current_password && (
              <p className="text-red-600 text-sm mt-1">
                Current password is required
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative mb-6">
            <label className="mb-1 text-[#333] font-semibold">
              New Password
            </label>
            <input
              type={showNew ? "text" : "password"}
              className="w-full border border-gray-400 rounded-md p-2 pr-10"
              placeholder="Enter new password"
              {...register("new_password", { required: true, minLength: 6 })}
            />
            <IconButton
              onClick={() => setShowNew(!showNew)}
              className="!absolute right-2 top-6"
            >
              {showNew ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            {errors.new_password && (
              <p className="text-red-600 text-sm mt-1">
                New password must be at least 6 characters
              </p>
            )}

            {/* Password Strength Bar */}
            {watchPassword && (
              <LinearProgress
                variant="determinate"
                value={(passwordStrength / 5) * 100}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#eee",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: strengthColor,
                  },
                }}
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative mb-6">
            <label className="mb-1 text-[#333] font-semibold">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border border-gray-400 rounded-md p-2 pr-10"
              placeholder="Confirm new password"
              {...register("confirm_password", { required: true })}
            />
            <IconButton
              onClick={() => setShowConfirm(!showConfirm)}
              className="!absolute right-2 top-6"
            >
              {showConfirm ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            {errors.confirm_password && (
              <p className="text-red-600 text-sm mt-1">Required</p>
            )}
          </div>

          {/* Server Errors */}
          {serverError && (
            <p className="text-red-600 text-sm mb-3 font-semibold">
              {serverError}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-[#ff716f] font-semibold"
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
