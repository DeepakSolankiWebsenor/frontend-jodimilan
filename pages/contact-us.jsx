import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsFillTelephoneFill } from "react-icons/bs";
import { RiMailFill } from "react-icons/ri";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import useApiService from "../services/ApiService";
import Head from "next/head";
import { useSelector } from "react-redux";

function ContactUs() {
  const masterData = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendEnquiry } = useApiService();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setData(masterData?.common_data?.settings);
  }, [masterData]);

 const handleInquiry = (data) => {
   const { name, contact_no, message } = data;
   let params = { name, contact_no, message };

   setLoading(true);
   sendEnquiry(params)
     .then((res) => {
       setLoading(false);
       if (res.data.success) {
         setShowModal(true);
         reset();
       }
     })
     .catch(() => setLoading(false));
 };


  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 text-center max-w-sm mx-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <ThumbUpAltIcon
                className="text-green-600"
                style={{ fontSize: 35 }}
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              Thank You! 🎉
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Your enquiry has been submitted successfully.
              <br />
              We will contact you soon!
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-primary hover:bg-[#ff6a69] text-white py-2 px-5 rounded-lg mt-5"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="text-center py-6 px-4">
        <div className="text-primary border-b-4 border-primary text-3xl md:text-4xl font-semibold mx-auto inline-block pb-1">
          Contact Us
        </div>
        <p className="text-gray-600 text-sm font-medium pt-3 uppercase">
          You can reach us using the form below.
        </p>
      </div>

      <div className="pb-10 flex justify-center px-3">
        <div className="w-full lg:w-[70%]">
          <div className="text-center text-xl md:text-2xl text-gray-800 font-semibold mb-4">
            Submit Your Enquiry
          </div>

          <div className="border bg-gray-100 rounded-lg p-4 md:p-8">
            <form autoComplete="off" onSubmit={handleSubmit(handleInquiry)}>
              {/* Name */}
              <label className="text-[#333] font-medium mb-1 ml-1">Name</label>
              <input
                type="text"
                className="border rounded-md w-full p-2 text-gray-800"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}

              {/* Phone */}
              <label className="text-[#333] font-medium mt-4 mb-1 ml-1">
                Contact No.
              </label>
              <input
                type="text"
                maxLength={10}
                className="border rounded-md w-full p-2 text-gray-800"
                placeholder="Enter your contact number"
                {...register("contact_no", {
                  required: "Contact number is required",
                  minLength: { value: 10, message: "Must be 10 digits" },
                  maxLength: { value: 10, message: "Must be 10 digits" },
                  pattern: {
                    value: /^[6-9][0-9]{9}$/,
                    message: "Enter valid Indian mobile number",
                  },
                })}
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
              />
              {errors.contact_no && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.contact_no.message}
                </p>
              )}

              {/* Message */}
              <label className="text-[#333] font-medium mt-4 mb-1 ml-1">
                Message / Inquiry
              </label>
              <textarea
                rows="5"
                className="border rounded-md w-full p-2 text-gray-800"
                placeholder="Enter your message"
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}

              <button
                className="bg-primary text-white hover:bg-[#ff716f] w-full mt-5 py-2 rounded-md font-medium"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Send Enquiry"
                )}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {/* Email */}
            <div className="flex border border-primary rounded-lg p-4">
              <div className="bg-primary p-4 rounded-lg">
                <RiMailFill size={26} className="text-white" />
              </div>
              <p className="text-gray-700 font-medium ml-3 break-all">
                {data?.[0]?.company_email}
              </p>
            </div>

            {/* Phone */}
            <div className="flex border border-primary rounded-lg p-4">
              <div className="bg-primary p-4 rounded-lg">
                <BsFillTelephoneFill size={26} className="text-white" />
              </div>
              <p className="text-gray-700 font-medium ml-3 break-all">
                {data?.[0]?.company_phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
