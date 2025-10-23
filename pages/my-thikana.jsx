/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useState } from "react";
import Head from "next/head";
import Banner from "../public/images/my-thikana-banner.jpg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import useApiService from "../services/ApiService";
import Logo from "../public/logo/Logo.png";
import { useRouter } from "next/router";
import ThikanaEnquiryForm from "../components/ThikanaEnquiryForm";

const MyThikana = () => {
  const router = useRouter();
  const masterData1 = useSelector((state) => state.user);
  const {
    searchThikana,
    getCities,
    getAreas,
    getThikanas,
  } = useApiService();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stateError, setStateError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [blockError, setBlockError] = useState("");
  const [nameError, setNameError] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [openEnquiryModal, setOpenEnquiryModal] = useState(false);
  const [showEnquiryButton, setShowEnquiryButton] = useState(false);
  const [showEnquiryBtnSearch, setShowEnquiryBtnSearch] = useState(false);
  const [options, setOptions] = useState({
    state: [],
    district: [],
    block: [],
    thikana: [],
  });
  const [form, setForm] = useState({
    state_id: "",
    city_id: "",
    area_id: "",
    name: "",
    thikana_name: "",
  });

  useEffect(() => {
    setOptions({
      ...options,
      state: masterData1?.common_data?.state,
    });
  }, [masterData1]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "state_id") {
      getCities(e.target.value)
        .then((res) => {
          if (res?.code === 200) {
            setOptions({
              ...options,
              district: res?.data,
              block: [],
              thikana: [],
            });
            let temp = { ...form };
            temp.state_id = e.target.value;
            temp.city_id = "";
            temp.area_id = "";
            temp.name = "";
            setForm(temp);
          }
        })
        .catch((error) => console.log(error));
    } else if (e.target.name === "city_id") {
      getAreas(e.target.value)
        .then((res) => {
          if (res.code === 200) {
            setOptions({
              ...options,
              block: res?.data,
              thikana: [],
            });
            let temp = { ...form };
            temp.city_id = e.target.value;
            temp.area_id = "";
            temp.name = "";
            setForm(temp);
          }
        })
        .catch((error) => console.log(error));
    } else if (e.target.name === "area_id") {
      getThikanas(e.target.value)
        .then((res) => {
          if (res.code === 200) {
            if (res?.data?.length === 0) {
              setShowEnquiryButton(true);
              setOptions({
                ...options,
                thikana: [],
              });
              let temp = { ...form };
              temp.area_id = e.target.value;
              temp.name = "";
              setForm(temp);
            } else {
              setShowEnquiryButton(false);
              setOptions({
                ...options,
                thikana: res?.data,
              });
            }
          }
        })
        .catch((error) => console.log(error));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSearch = () => {
    if (activeTab === 0) {
      if (!form.state_id) {
        setStateError("Please select State");
      } else {
        setStateError("");
      }

      if (!form.city_id) {
        setDistrictError("Please select District");
      } else {
        setDistrictError("");
      }

      if (!form.area_id) {
        setBlockError("Please select Area");
      } else {
        setBlockError("");
      }

      if (form.state_id && form.city_id && form.area_id) {
        setLoading(true);
        const params = `area_id=${form.area_id}&state_id=${form.state_id}&city_id=${form.city_id}&name=${form.name}`;

        searchThikana(params)
          .then((res) => {
            if (res?.code == 200) {
              if (res?.data?.length) {
                if (form?.name) {
                  const id = res?.data[0]?.id;
                  router.push(`my-thikana/${id}`);
                } else {
                  setData(res?.data);
                  setMessage("");
                }
              } else {
                setData([]);
                setMessage("No Data Found!");
              }
              if (window !== "undefined") {
                window.scrollTo({
                  top: 1000,
                  behavior: "smooth",
                });
              }
            }
          })
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }
    } else {
      if (!form.thikana_name) {
        setNameError("Please enter Thikana name");
      } else {
        setNameError();
        setLoading(true);
        const params = `name=${form.thikana_name}`;

        searchThikana(params)
          .then((res) => {
            if (res?.code == 200) {
              if (res?.data?.length) {
                setSingleData(res?.data);
                setMessage("");
              } else {
                setSingleData([]);
                setShowEnquiryBtnSearch(true);
                setMessage("No Data Found !");
              }
            }
            if (window !== "undefined") {
              window.scrollTo({
                top: 800,
                behavior: "smooth",
              });
            }
          })
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }
    }
  };

  const handleClearData = () => {
    setForm({
      area_id: "",
      name: "",
      thikana_name: "",
      state_id: "",
      city_id: "",
    });
    setShowEnquiryButton(false);
    setStateError('')
    setNameError('')
    setBlockError('')
    setDistrictError('')
  };

  return (
    <>
      <Head>
        <title>My Thikana - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life 
          Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/Logo.png" />
      </Head>

      <ThikanaEnquiryForm
        openEnquiryModal={openEnquiryModal}
        setOpenEnquiryModal={setOpenEnquiryModal}
        options={options}
        handleChange={handleChange}
      />

      <div className="w-full">
        <div className="h-[200px] md:h-[450px] w-full min-w-full">
          <Image
            src={Banner}
            height={1200}
            width={1200}
            alt="ss"
            className="h-full w-full"
          />
        </div>

        <div className="my-10">
          <div className="text-4xl text-center">
            Find your <span className="text-[#aa0000]"> Thikana</span>
          </div>

          <div className="mt-4 flex justify-center">
            <div>
              <div className="flex flex-wrap lg:w-[500px] md:w-[500px]">
                <div className="w-full">
                  <ul className="flex mb-0 list-none pt-3 pb-4" role="tablist">
                    <li className="-mb-px mr-2 text-center w-full">
                      <div
                        className={
                          "text-xs font-bold uppercase px-5 py-3 border rounded block leading-normal cursor-pointer" +
                          (activeTab === 0
                            ? "text-[#aa0000] border-[#aa0000] bg-blueGray-600 cursor-pointer"
                            : "text-blueGray-600 cursor-pointer bg-white")
                        }
                        data-toggle="tab"
                        role="tablist"
                        onClick={() => {
                          setActiveTab(0);
                          setMessage("");
                          setShowEnquiryBtnSearch(false);
                        }}
                      >
                        BY THIKANA
                      </div>
                    </li>
                    <li className="-mb-px mr-2 text-center w-full">
                      <div
                        className={
                          "text-xs font-bold uppercase px-5 py-3 border rounded block leading-normal cursor-pointer" +
                          (activeTab === 1
                            ? "text-[#aa0000] border-[#aa0000] bg-blueGray-600 cursor-pointer"
                            : "text-blueGray-600 cursor-pointer bg-white")
                        }
                        data-toggle="tab"
                        role="tablist"
                        onClick={() => {
                          setActiveTab(1);
                          setMessage("");
                          setShowEnquiryBtnSearch(false);
                        }}
                      >
                        BY NAME
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className="relative flex flex-col min-w-0 break-words bg-gray-100 w-full 
                mb-6 rounded-md"
              >
                <div className="px-6 py-6 flex-auto">
                  <div className="tab-content tab-space">
                    <div
                      className={activeTab === 0 ? "block" : "hidden"}
                      id="link1"
                    >
                      <div className="grid grid-rows-[200px_minmax(900px,_1fr)_100px gap-2">
                        <div className="flex md:justify-between justify-center">
                          <div className="mr-2">
                            <div className="font-medium mb-2 text-start ml-2">
                              STATE
                            </div>
                            <select
                              name="state_id"
                              className="md:w-52 w-36 text-sm border border-gray-300 rounded px-2
                              py-2 font-medium"
                              value={form.state_id}
                              onChange={handleChange}
                            >
                              <option value="" hidden>
                                Select State
                              </option>
                              {options?.state?.map((item, index) => {
                                return (
                                  <option value={item?.id} key={index}>
                                    {item?.name}
                                  </option>
                                );
                              })}
                            </select>
                            {stateError && (
                              <div className="mt-2 text-sm text-red-600">
                                {stateError}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium mb-2 text-start ml-2">
                              DISTRICT
                            </div>
                            <select
                              name="city_id"
                              className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 
                              py-2 font-medium"
                              value={form.city_id}
                              onChange={handleChange}
                            >
                              <option value="" hidden>
                                Select District
                              </option>
                              {options?.district?.length > 0 ? (
                                options?.district?.map((item, index) => {
                                  return (
                                    <option value={item?.id} key={index}>
                                      {item?.name}
                                    </option>
                                  );
                                })
                              ) : (
                                <option value="" disabled>
                                  No District
                                </option>
                              )}
                            </select>
                            {districtError && (
                              <div className="mt-2 text-sm text-red-600">
                                {districtError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex md:justify-between justify-center mt-2">
                          <div className="mr-2">
                            <div className="font-medium mb-2 text-start ml-2">
                              BLOCK
                            </div>
                            <select
                              name="area_id"
                              className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 
                              py-2 font-medium"
                              value={form.area_id}
                              onChange={handleChange}
                            >
                              <option value="" hidden>
                                Select Block
                              </option>
                              {options?.block?.length > 0 ? (
                                options?.block?.map((item, index) => {
                                  return (
                                    <option value={item?.id} key={index}>
                                      {item?.name}
                                    </option>
                                  );
                                })
                              ) : (
                                <option value="" disabled>
                                  No Block
                                </option>
                              )}
                            </select>
                            {blockError && (
                              <div className="mt-2 text-sm text-red-600">
                                {blockError}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium mb-2 text-start ml-2">
                              THIKANA
                            </div>
                            <select
                              name="name"
                              className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 
                              py-2 font-medium"
                              value={form?.name}
                              onChange={handleChange}
                            >
                              <option value="" hidden>
                                Select Thikana
                              </option>
                              {options?.thikana?.length ? (
                                options?.thikana?.map((item, index) => {
                                  return (
                                    <option value={item?.name} key={index}>
                                      {item?.name}
                                    </option>
                                  );
                                })
                              ) : (
                                <option value="" disabled>
                                  No Thikana
                                </option>
                              )}
                            </select>
                          </div>
                        </div>

                        <button
                          className="my-2 bg-[#aa0000] text-white rounded-md p-2 text-center"
                          onClick={() => setOpenEnquiryModal(true)}
                        >
                          Add Thikana Enquiry
                        </button>
                        <button
                          className="mt-2 bg-[#aa0000] text-white rounded-md p-2 text-center 
                              cursor-pointer"
                          onClick={handleSearch}
                          disabled={loading ? true : false}
                        >
                          {loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Search"
                          )}
                        </button>
                        {(form.area_id ||
                          form.city_id ||
                          form.state_id ||
                          form.name) && (
                            <button
                              className="mt-2 bg-[#aa0000] text-white rounded-md p-2 text-center 
                          cursor-pointer"
                              onClick={handleClearData}
                            >
                              Clear
                            </button>
                          )}
                      </div>
                    </div>

                    <div
                      className={activeTab === 1 ? "block" : "hidden"}
                      id="link2"
                    >
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Thikana Name"
                          name="thikana_name"
                          className="w-full p-2 rounded-md border border-gray-300 mr-2 focus:outline-none 
                          placeholder:font-medium"
                          value={form?.thikana_name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              ["thikana_name"]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="bg-[#aa0000] px-4 text-white rounded-md"
                          onClick={handleSearch}
                          disabled={loading ? true : false}
                        >
                          {loading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Search"
                          )}
                        </button>
                      </div>
                      {nameError && (
                        <div className="my-2 text-sm text-red-600">
                          {nameError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activeTab == 0 ? (
            <>
              {data?.length > 0 ? (
                <div className="lg:px-22 mt-2 lg:text-left md:text-left text-center font-medium lg:text-[20px] md:text-[20px] text-[16px] px-10 text-gray-700">
                  HERE IS YOUR RESULT
                  <hr className="my-4 border" />
                </div>
              ) : (
                <div className="text-center text-gray-700">{message}</div>
              )}

              <div className="lg:px-22 px-10 md:flex grid gap-10 flex-wrap justify-center">
                {data?.length > 0 &&
                  data?.map((item, index) => {
                    return (
                      <div
                        className={`h-[400px] w-[300px] cursor-pointer rounded-md border-2`}
                        key={index}
                        onClick={() => router.push(`my-thikana/${item?.id}`)}
                      >
                        <div className="min-w-full h-[250px]">
                          {item?.image_src ? (
                            <img
                              src={item?.image_src}
                              alt="ss"
                              className="h-full w-full"
                            />
                          ) : (
                            <Image
                              src={Logo}
                              height={1200}
                              width={1200}
                              alt="ss"
                              className="h-full w-full"
                            />
                          )}
                        </div>
                        <div className="mt-4 px-2 text-lg">
                          <span className="font-medium mr-2">Thikana :</span>
                          <span>{item?.name}</span>
                        </div>
                        <div className="mt-2 px-2">
                          <span className="font-medium mr-2">State :</span>
                          <span>{item?.states?.name}</span>
                        </div>
                        <div className="mt-2 px-2">
                          <span className="font-medium mr-2">City :</span>
                          <span>{item?.city?.name}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <>
              {singleData?.length > 0 ? (
                <div className="lg:px-32 mt-2 lg:text-left md:text-left text-center font-medium lg:text-[20px] md:text-[20px] text-[16px] px-10 text-gray-700">
                  HERE IS YOUR RESULT
                  <hr className="my-4 border" />
                </div>
              ) : (
                <div className="w-full text-center">
                  {showEnquiryBtnSearch && (
                    <div className="mt-3">
                      <div className="text-center font-medium">
                        Can't find your thikana, submit the form' <br /> to
                        enter the details of thikana which is not available.
                      </div>
                      <button
                        className="my-2 font-medium px-4 bg-[#aa0000] text-white rounded-md p-2 text-center"
                        onClick={() => setOpenEnquiryModal(true)}
                      >
                        Add Thikana Enquiry
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="lg:px-22 px-10 md:flex grid gap-10 flex-wrap justify-center">
                {singleData?.length > 0 &&
                  singleData?.map((item, index) => {
                    return (
                      <div
                        className={`h-[400px] w-[300px] cursor-pointer rounded-md border-2`}
                        key={index}
                        onClick={() => router.push(`my-thikana/${item?.id}`)}
                      >
                        <div className="min-w-full h-[250px]">
                          {item?.image_src ? (
                            <img
                              src={item?.image_src}
                              alt="ss"
                              className="h-full w-full"
                            />
                          ) : (
                            <Image
                              src={Logo}
                              height={1200}
                              width={1200}
                              alt="ss"
                              className="h-full w-full"
                            />
                          )}
                        </div>
                        <div className="mt-4 px-2 text-lg">
                          <span className="font-medium mr-2">Thikana :</span>
                          <span>{item?.name}</span>
                        </div>
                        <div className="mt-2 px-2">
                          <span className="font-medium mr-2">State :</span>
                          <span>{item?.states?.name}</span>
                        </div>
                        <div className="mt-2 px-2">
                          <span className="font-medium mr-2">City :</span>
                          <span>{item?.city?.name}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyThikana;
