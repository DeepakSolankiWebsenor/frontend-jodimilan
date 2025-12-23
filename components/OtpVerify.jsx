import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";

const OtpVerify = ({ open, onClose, phone, dialingCode = "91" }) => { // Changed email to phone
  const { verifyOtp, resendOtp } = useApiService();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

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

  const handleOtpVerify = () => {
    if (otp.length !== 6) {
      setErrorMsg("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    verifyOtp({ phone, otp, dialing_code: dialingCode }) // Use phone
      .then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem("token", res.data.data.access_token);
          toast.success("OTP Verified Successfully");
          onClose();
          router.push("/profile/profile-page");
        }
      })
      .catch(() => setErrorMsg("Invalid OTP, try again"))
      .finally(() => setLoading(false));
  };

  const handleResendOtp = () => {
    if (isResendDisabled) return;
    setResendLoading(true);
    resendOtp({ phone, dialing_code: dialingCode }) // Use phone
      .then(() => {
        toast.success("OTP resent successfully!");
        setTimer(30);
        setIsResendDisabled(true);
      })
      .catch(() => toast.error("Failed to resend OTP"))
      .finally(() => setResendLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
          placeholder="Enter OTP"
          className="w-full text-center p-3 mt-2 rounded bg-gray-200"
        />

        {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
      </DialogContent>

      <DialogActions className="flex justify-between px-3 pb-3">
        <button
          className={`border border-primary px-3 py-2 rounded ${
            resendLoading || isResendDisabled
              ? "opacity-50 cursor-not-allowed text-gray-400 border-gray-400"
              : "text-primary"
          }`}
          onClick={handleResendOtp}
          disabled={resendLoading || isResendDisabled}
        >
          {resendLoading
            ? "Sending..."
            : timer > 0
            ? `Resend OTP (${timer}s)`
            : "Resend OTP"}
        </button>

        <button
          className="bg-primary text-white px-3 py-2 rounded"
          onClick={handleOtpVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpVerify;
