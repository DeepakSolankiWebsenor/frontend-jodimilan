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
import { toast } from "react-toastify";

const defaultValues = {
  profile_by: "",
  gender: "",
  mat_status: "",
  religion: "",
  religion_name: "",
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
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [otpServerError, setOtpServerError] = useState("");
  const [userPhone, setUserPhone] = useState(""); // Changed from email to phone
  const [options, setOptions] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const masterData = useSelector((state) => state.user);

  const { customerSignup, verifyOtp, resendOtp } = useApiService();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    setOptions(masterData?.common_data);
  }, [masterData]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = (data) => {
    setLoading(true);
    setSignupError("");

    customerSignup({ ...data, password_confirmation: data.password, dialing_code: "91" })
      .then((res) => {
        if (res?.data?.code === 201) {
          toast.success("OTP sent successfully!");
          setUserPhone(data.phone); // Store phone
          setStep("otp");
          setTimer(30);
          setIsResendDisabled(true);
        }
      })
      .catch((err) => {
        const errorData = err?.response?.data;
        const msg = errorData?.message || "Signup failed";

        if (errorData?.errors) {
          setSignupError(""); 
          
          if (Array.isArray(errorData.errors)) {
            // Handle Array format (e.g. 409 Duplicate entry)
            errorData.errors.forEach((e) => {
              const field = e.field?.includes("phone") ? "phone" : e.field?.includes("email") ? "email" : "name";
              let displayMessage = e.message || msg;
              
              if (displayMessage.includes("users_dialing_code_phone_unique")) {
                displayMessage = "This phone number is already registered";
              } else if (displayMessage.includes("users_email_unique")) {
                displayMessage = "This email is already registered";
              }

              setError(field, {
                type: "server",
                message: displayMessage,
              });
            });
          } else if (typeof errorData.errors === 'object') {
            // Handle Object format (e.g. 422 Validation failed)
            Object.keys(errorData.errors).forEach((field) => {
              const errorMessage = typeof errorData.errors[field] === 'string' 
                ? errorData.errors[field] 
                : (errorData.errors[field]?.message || JSON.stringify(errorData.errors[field]));
              
              setError(field, {
                type: "server",
                message: errorMessage,
              });
            });
          }
        } else {
          setSignupError(msg);
          toast.error(msg);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleOtpVerify = () => {
    if (!otp || otp.length !== 6) {
      setOtpServerError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setOtpServerError("");

    verifyOtp({ phone: userPhone, otp, dialing_code: "91" }) // Use phone
      .then((res) => {
        if (res.data.code === 200) {
          toast.success("OTP verified successfully");
          localStorage.setItem("token", res.data.data.access_token);
          reset();

          setTimeout(() => {
            onClose();
            router.push("/profile/profile-page");
          }, 1000);
        }
      })
      .catch(() => {
        setOtpServerError("Invalid OTP, please try again.");
      })
      .finally(() => setLoading(false));
  };

   const handleResendOtp = () => {
    if (!userPhone || isResendDisabled) return;

    setResendLoading(true);
     resendOtp({ phone: userPhone, dialing_code: "91" }) // Use phone
       .then((res) => {
         if (res?.data?.code === 200) {
           toast.success("New OTP sent");
           setOtp("");
           setTimer(30);
           setIsResendDisabled(true);
         }
       })
       .catch(() => toast.error("Failed to resend OTP"))
       .finally(() => setResendLoading(false));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "95%",
          maxWidth: "600px",
          borderRadius: 4,
          p: 1,
          maxHeight: "92vh",
          overflowY: "auto",
        },
      }}
    >
      {step === "signup" ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle className="text-center text-lg font-bold pt-2">
            Register Yourself
          </DialogTitle>

          {(signupError || Object.keys(errors).some(k => errors[k]?.type === 'server')) && (
            <div className="text-center text-red-500 text-xs mt-1">
              {signupError && <p>{signupError}</p>}
              {Object.keys(errors).map((key) => 
                errors[key]?.type === 'server' && (
                  <p key={key}>
                    {typeof errors[key].message === 'string' 
                      ? errors[key].message 
                      : (errors[key].message?.message || "An error occurred")}
                  </p>
                )
              )}
            </div>
          )}

          <DialogContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="grid gap-1">
                <label className="text-sm font-medium">Profile By</label>
                <select
                  {...register("profile_by", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                >
                  <option hidden>Select</option>
                  {options?.profile?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.profile_by && (
                  <p className="text-red-500 text-xs">
                    {errors.profile_by.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Gender</label>
                <select
                  {...register("gender", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                >
                  <option hidden>Select</option>
                  {options?.gender?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Marital Status</label>
                <select
                  {...register("mat_status", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                >
                  <option hidden>Select</option>
                  {options?.mat_status?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.mat_status && (
                  <p className="text-red-500 text-xs">
                    {errors.mat_status.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Religion</label>
                <select
                  {...register("religion", {
                    required: "Required",
                    onChange: (e) => {
                      const selectedId = e.target.value;
                      const religionObj = options?.religion?.find(
                        (item) => item.id == selectedId
                      );
                      if (religionObj) {
                        setValue("religion_name", religionObj.name);
                      }
                    },
                  })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                >
                  <option hidden>Select</option>
                  {options?.religion?.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.religion && (
                  <p className="text-red-500 text-xs">
                    {errors.religion.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Caste</label>
                <select
                  {...register("caste", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                >
                  <option hidden>Select</option>
                  {options?.caste?.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.caste && (
                  <p className="text-red-500 text-xs">{errors.caste.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  {...register("dob", { 
                    required: "Required",
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      return age >= 21 || "User must be 21 years or older";
                    }
                  })}
                  max={new Date().toISOString().split("T")[0]}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">First Name</label>
                <input
                  {...register("name", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  {...register("last_name")}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs">{errors.last_name.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register("email", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  {...register("password", { 
                    required: "Required",
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,}$/,
                      message: "Password must contain letters, numbers, and at least one special character (#$@!%&*?)"
                    }
                  })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("phone", { required: "Required" })}
                  className="p-3 bg-gray-200 rounded text-xs outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </DialogContent>

          <DialogActions className="flex justify-between p-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="border border-primary text-primary rounded-lg px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white rounded-lg px-3 py-2"
            >
              {loading ? "Please wait..." : "Register"}
            </button>
          </DialogActions>
        </form>
      ) : (
        <>
          <DialogTitle className="text-center text-lg font-bold">
            Verify OTP
          </DialogTitle>

          <DialogContent>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) && setOtp(e.target.value)
              }
              placeholder="Enter 6-digit OTP"
              className="w-full text-center p-3 mt-2 rounded bg-gray-200 tracking-widest text-xs outline-none"
            />
            {otpServerError && (
              <p className="text-red-500 text-xs mt-2">{otpServerError}</p>
            )}
          </DialogContent>

          <DialogActions className="flex justify-between px-3 pb-3">
            <button
              onClick={() => setStep("signup")}
              disabled={loading || resendLoading}
              className="border border-primary text-primary rounded-lg px-3 py-2"
            >
              Back
            </button>

            <button
              onClick={handleResendOtp}
              disabled={resendLoading || isResendDisabled}
              className={`border border-primary rounded-lg px-3 py-2 ${
                resendLoading || isResendDisabled
                  ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-400"
                  : "text-primary"
              }`}
            >
              {resendLoading
                ? "Sending..."
                : timer > 0
                ? `Resend OTP (${timer}s)`
                : "Resend OTP"}
            </button>

            <button
              onClick={handleOtpVerify}
              disabled={loading}
              className="bg-primary text-white rounded-lg px-3 py-2"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default Signup;
