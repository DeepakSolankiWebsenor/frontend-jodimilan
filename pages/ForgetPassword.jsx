import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useApiService from "../services/ApiService";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { forgetPassword } = useApiService();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleForgetPassword = () => {
    let params = {
      email: email,
    };

    forgetPassword(params)
      .then((res) => {
        if (res.data.code === 200) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setMessage(res?.data?.message);
          }, 1000);
          setTimeout(() => {
            router.push("/Login");
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.code === 422) {
          setErrorMsg(error.response.data.errors.email);
        } else if (error?.response?.data?.code === 400) {
          setErrorMsg(error.response.data.message);
        }
      });
  };

  return (
    <div className="lg:px-48 md:px-6 px-4">
      <div className="py-20">
        <div className="h-full">
          <div className="">
            <div className="md:w-[500px] w-80 bg-white border py-6 md:px-6 px-4 rounded shadow mx-auto">
              <div className="text-center text-2xl text-slate-600 font-semibold">
                Find Your Account
              </div>
              <hr className="my-2 border border-gray-200" />
              <div className="my-4 text-[16px] font-semibold text-gray-600 text-center">
                Please enter your email address to search for your account.
              </div>
              <div className="my-3">
                <div className="">
                  <div className="text-gray-800 font-semibold">
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      className="border border-gray-300 py-2 px-2 rounded w-full"
                      onChange={(e) => {
                        if (e.target.value) {
                          setErrorMsg("");
                        }
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  {errorMsg && (
                    <div className="mt-2 text-red-600 font-semibold text-[14px]">
                      {errorMsg}
                    </div>
                  )}

                  {message && (
                    <div className="mt-3 bg-green-200 rounded-md p-2 font-medium text-[16px] text-center">
                      {message}
                    </div>
                  )}

                  <button
                    className="mt-4 bg-[#aa0000] text-white text-sm font-semibold py-2 px-4 rounded w-full hover:bg-[#ff716f] transition-all"
                    onClick={handleForgetPassword}
                  >
                    {loading ? (
                      <CircularProgress size={20} color={"inherit"} />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
