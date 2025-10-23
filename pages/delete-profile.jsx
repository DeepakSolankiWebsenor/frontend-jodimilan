import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import useApiService from "../services/ApiService";
import { Transition, Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Head from "next/head";

const options = [
  { id: 1, label: "I am now Engaged/Married" },
  { id: 2, label: "I am not finding enough Responses" },
  { id: 3, label: "I am not Happy with Your Services" },
  { id: 4, label: "I got Married through Royalthikan.com" },
];

const DeleteProfile = () => {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const { deleteAccount } = useApiService();
  const cancelButtonRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  const handleDeleteAccount = () => {
    setDeleteModal(false);
    if (reason === "") {
      setErrorMsg("Delete account reason field is required.");
    } else {
      let params = {
        delete_account_reason: reason,
      };
      deleteAccount(params)
        .then((res) => {
          if (res.data.status === 200) {
            setLoading(true);
            setAlert(true);
            setErrorMsg("");
            setTimeout(() => {
              setLoading(false);
              localStorage.removeItem("token");
              router.push("/");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Head>
        <title>Delete Profile</title>
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
          Profile Deleted Successfully !
        </Alert>
      </Snackbar>

      <Transition.Root show={deleteModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setDeleteModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Delete Account
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="font-medium text-gray-600">
                            Are you sure you want to delete your account?
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setDeleteModal(false)}
                      ref={cancelButtonRef}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleDeleteAccount}
                    >
                      {loading ? (
                        <CircularProgress size={20} color={"inherit"} />
                      ) : (
                        "Yes"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="text-center lg:my-10 my-5 lg:text-4xl text-2xl px-3 text-[#333] font-medium">
        <span className="text-[#aa0000]">Delete</span> Profile
      </div>

      <div className="mb-10 flex justify-center w-full">
        <div className="border-2 border-gray-300 rounded-md md:p-10 p-4 lg:w-[600px] md:w-[500px] w-[300px]">
          <div className="flex flex-col py-[14px]">
            <select
              name="reason"
              className="lg:text-base md:text-base text-sm outline-none w-full border border-gray-300 rounded p-2 font-medium"
              onChange={(e) => {
                if (e.target.value) {
                  setErrorMsg("");
                  setReason(e.target.value);
                }
              }}
            >
              <option value="" hidden>
                Select your Reason
              </option>
              {options.map((item) => (
                <option value={item.label} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {errorMsg && (
            <div className="text-red-600 text-center font-semibold">
              {errorMsg}
            </div>
          )}
          <div className="flex justify-center pt-3 lg:text-base md:text-base text-sm">
            <button
              className="w-full bg-red-700 font-semibold hover:bg-red-800 text-white text-center py-2 px-4 rounded-md"
              onClick={() => setDeleteModal(true)}
            >
              {loading ? (
                <CircularProgress size={20} color={"inherit"} />
              ) : (
                "Delete Profile"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
