import { Alert, CircularProgress, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillTelephoneFill } from "react-icons/bs";
import { RiMailFill } from "react-icons/ri";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import useApiService from "../services/ApiService";
import { useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";

function ContactUs() {
  const masterData = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendEnquiry } = useApiService();
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
    let params = {
      name: name,
      contact_no: contact_no,
      message: message,
    };

    sendEnquiry(params)
      .then((res) => {
        if (res.data.status === 200) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setAlert(true);
            reset();
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Head>
        <title>Contact Us</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
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
          Your Enquiry Submitted Successfully !
        </Alert>
      </Snackbar>

      <div className="text-center py-10 px-4">
        <div className="md:text-4xl text-3xl text-primary border-b-4 border-b-primary font-medium w-max rounded-md mx-auto">
          Contact Us
        </div>
        <div className="text-gray-600 text-sm font-medium pt-4 uppercase">
          You can reach us using the following form below.
        </div>
      </div>

      <div className="pb-20 flex justify-center">
        <div className="md:px-20 px-4 w-full md:w-[70%]">
          <div>
            <div className="text-2xl font-semibold text-gray-800 pb-4 text-center">
              Submit Your Enquiry
            </div>
            <div className="border bg-gray-100 rounded-md md:p-10 p-4">
              <form autoComplete="off" onSubmit={handleSubmit(handleInquiry)}>
                <div className="flex flex-col">
                  <label className="text-[#333] font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="focus:outline-none border rounded-[4px] p-2 font-medium text-gray-800"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                  />
                </div>
                {errors.name && (
                  <div className="text-red-600 text-[14px] my-2 font-semibold">
                    {errors.name.type === "required" &&
                      "Name field is required."}
                  </div>
                )}

                <div className="flex flex-col mt-2">
                  <label className="text-[#333] font-medium">Contact No.</label>
                  <input
                    type="number"
                    name="contact_no"
                    className="focus:outline-none border rounded-[4px] p-2 font-medium text-gray-800"
                    placeholder="Enter your contact number"
                    {...register("contact_no", {
                      required: true,
                      pattern: /^\d{10}$/,
                      minLength: 10,
                      maxLength: 10,
                      onChange: (e) => console.log(e),
                    })}
                  />
                </div>
                {errors.contact_no && (
                  <div className="text-red-600 text-[14px] mt-2 font-semibold">
                    {errors.contact_no.type === "required"
                      ? "Contact no field is required."
                      : "Contact number should be 10 digit only"}
                  </div>
                )}

                <div className="flex flex-col mt-2">
                  <label className="text-[#333] font-medium">
                    Message/Inquiry
                  </label>
                  <textarea
                    name="message"
                    cols="30"
                    rows="5"
                    className="focus:outline-none border rounded-[4px] p-2 font-medium text-gray-800"
                    placeholder="Enter your message"
                    {...register("message", { required: true })}
                  ></textarea>
                </div>
                {errors.message && (
                  <div className="text-red-600 text-[14px] font-semibold">
                    {errors.message.type === "required" &&
                      "Message field is required."}
                  </div>
                )}

                <div className="flex justify-center mt-3">
                  <button
                    className="bg-primary hover:bg-[#ff716f] text-white text-center w-full py-2 px-4 rounded-md"
                    type="submit"
                  >
                    {loading ? (
                      <CircularProgress size={20} color={"inherit"} />
                    ) : (
                      "Send Enquiry"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mt-6">
            <div className="lg:mb-0 md:mb-2">
              <div className="flex border border-primary p-2 rounded-md">
                <div className="border border-primary bg-primary p-4 rounded-md">
                  <RiMailFill size={30} className="text-white mx-auto" />
                </div>
                <div className="rounded-md w-full self-center">
                  <div
                    className="text-gray-800 font-medium px-2 py-2"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {data && data[0]?.company_email}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:mb-0 md:mb-2 mb-2">
              <div className="flex border border-primary p-2 rounded-md">
                <div className="border border-primary bg-primary p-4 rounded-md">
                  <BsFillTelephoneFill
                    size={30}
                    className="text-white mx-auto"
                  />
                </div>
                <div className="rounded-md w-full self-center">
                  <div
                    className="text-gray-800 font-medium px-2 py-1"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {data && data[0]?.company_phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
