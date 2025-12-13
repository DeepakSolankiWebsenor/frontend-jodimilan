import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import useApiService from "../services/ApiService";
import { toast } from "react-toastify";

const OtpVerify = ({
  open,
  onClose,
  phone,
  dialing_code = "91",
  onVerified,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp, resendOtp } = useApiService();

  const handleOtpVerify = () => {
    if (!otp || otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    verifyOtp({ phone, otp, dialing_code })
      .then((res) => {
        if (res?.data?.code === 200) {
          toast.success("OTP Verified!");

          if (onVerified) onVerified(); // 🔥 call login success handler
        }
      })
      .catch(() => {
        toast.error("Invalid OTP");
      })
      .finally(() => setLoading(false));
  };

  const handleResend = () => {
    resendOtp({ phone, dialing_code })
      .then(() => toast.success("OTP sent again"))
      .catch(() => toast.error("Failed to resend"));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="text-center font-bold">Verify OTP</DialogTitle>

      <DialogContent>
        <input
          type="text"
          value={otp}
          maxLength={6}
          onChange={(e) =>
            /^\d*$/.test(e.target.value) && setOtp(e.target.value)
          }
          className="w-full p-3 mt-2 text-center bg-gray-100 rounded tracking-widest"
        />
      </DialogContent>

      <DialogActions className="flex justify-between px-3 pb-3">
        <button
          onClick={handleResend}
          className="border text-primary rounded px-3 py-2"
        >
          Resend OTP
        </button>

        <button
          onClick={handleOtpVerify}
          className="bg-primary text-white rounded px-3 py-2"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpVerify;
