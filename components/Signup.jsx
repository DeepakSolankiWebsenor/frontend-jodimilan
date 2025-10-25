import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useApiService from "../services/ApiService";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";
import { toast } from "react-toastify";

const defaultValues = {
  profile_by: "",
  gender: "",
  mat_status: "",
  religion: "",
  caste: "",
  dob: "",
  name: "",
  last_name: "",
  email: "",
  password: "",
  dialing_code: "",
  phone: "",
};

const Signup = ({ open, onClose }) => {
  const router = useRouter();
  const { customerSignup } = useApiService();
  const [options, setOptions] = useState(null);
  const [loading, setloading] = useState(false);
  const [signupErrors, setSignupErrors] = useState("");
  const masterData1 = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    setOptions(masterData1?.common_data);
  }, [masterData1]);

  const onSubmit = (data) => {
    setloading(true);
    setSignupErrors("");

    const params = {};

    for (const key in data) {
      if (data[key]) {
        params[key] = data[key];
      }
    }

    params["dialing_code"] = "91";

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

          toast.success("Registration successfully");

          setloading(true);
          setTimeout(() => {
            onClose();
            reset();
            setloading(false);
            router.push("/profile/profile-page");
          }, 1000);
        }
      })
      .catch((errors) => {
        setSignupErrors(errors?.response?.data?.errors);
        setloading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 650,
          borderRadius: 3,
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <div className="font-bold">Register Yourself</div>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Profile By</label>
              <select
                {...register("profile_by", { required: "Please select" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              >
                <option value="" hidden>
                  Please Select
                </option>
                {options?.profile?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors?.profile_by && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.profile_by?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Gender</label>
              <select
                {...register("gender", { required: "Please select gender" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              >
                <option value="" hidden>
                  Please Select
                </option>
                {options?.gender?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors?.gender && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.gender?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Marital Status</label>
              <select
                {...register("mat_status", { required: "Please select" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              >
                <option value="" hidden>
                  Please Select
                </option>
                {options?.mat_status?.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </select>
              {errors?.mat_status && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.mat_status?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Religion</label>
              <select
                {...register("religion", { required: "Please select" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              >
                <option value="" hidden>
                  Please Select
                </option>
                {options?.religion?.map((item, index) => (
                  <option value={item?.id} key={index}>
                    {item?.name}
                  </option>
                ))}
              </select>
              {errors?.religion && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.religion?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Clan</label>
              <select
                {...register("caste", { required: "Please select" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              >
                <option value="" hidden>
                  Please Select
                </option>
                {options?.caste?.map((item, index) => (
                  <option value={item?.id} key={index}>
                    {item?.name}
                  </option>
                ))}
              </select>
              {errors?.caste && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.caste?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dob", { required: "Please select date" })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
              {errors.dob && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.dob?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">First Name</label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters required",
                  },
                })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
              {errors.name && (
                <p className="text-red-500 font-medium text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Last Name</label>
              <input
                {...register("last_name")}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
              {(errors.email || signupErrors?.email) && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.email?.message || signupErrors?.email}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
              {errors.password && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.password?.message}
                </p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Phone No.</label>
              <input
                type="number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be a 10-digit number",
                  },
                })}
                className="outline-none p-3 bg-gray-200 rounded-md text-xs font-medium"
              />
              {(errors?.phone || signupErrors?.phone) && (
                <p className="text-red-500 font-medium text-xs">
                  {errors?.phone?.message || signupErrors?.phone}
                </p>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="outline-none text-primary border border-primary bg-white font-semibold text-sm px-3 py-2 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="outline-none bg-primary text-white font-semibold text-sm px-3 py-2 rounded-lg cursor-pointer"
          >
            {loading ? "Please wait..." : "Accept & Register"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Signup;
