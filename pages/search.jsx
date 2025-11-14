/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import HeaderTwo from "./HeaderTwo";
import Image from "next/image";
import useApiService from "../services/ApiService";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import WomenD from "../public/images/girldefault.png";
import MenD from "../public/images/mendefault.png";
import PaginationControlled from "../components/common-component/pagination";
import Usercard from "../components/common-component/card/usercard";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";
import { Pagination } from "@mui/material";

const minAge = [
  { id: 1, name: 21 },
  { id: 2, name: 22 },
  { id: 3, name: 23 },
  { id: 4, name: 24 },
  { id: 5, name: 25 },
];

const maxAge = [
  { id: 1, name: 26 },
  { id: 2, name: 27 },
  { id: 3, name: 28 },
  { id: 4, name: 29 },
  { id: 5, name: 30 },
];

function Search() {
  const [openTab, setOpenTab] = useState(1);
  const { userSearch, searchById } = useApiService();
  const [options, setOptions] = useState([]);
  const [data, setData] = useState({
    gender: "",
    mat_status: "",
    religion: "",
    caste: "",
    minAge: "",
    maxAge: "",
  });
  const router = useRouter();
  const [searchData, setSearchData] = useState([]);
  const [rytId, setRytId] = useState("");
  const [dataById, setDataById] = useState();
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [userSearchData, setUserSearchData] = useState();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(false);
  const [userData, setUserData] = useState("");
  const masterData1 = useSelector((state) => state.user);

  const getMasterData = () => {
    if (masterData1?.user !== null) {
      var encrypted_json = JSON.parse(window.atob(masterData1?.user?.user));
      var dec = CryptoJS.AES.decrypt(
        encrypted_json.value,
        CryptoJS.enc.Base64.parse(decrypted_key),
        {
          iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
        }
      );

      var decryptedText = dec.toString(CryptoJS.enc.Utf8);
      var jsonStartIndex = decryptedText.indexOf("{");
      var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
      var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
      jsonData.trim();
      const parsed = JSON.parse(jsonData);

      setUserData(parsed);
      if (parsed?.user?.gender === "Male") {
        setData({ ...data, gender: "Female" });
      } else {
        setData({ ...data, gender: "Male" });
      }
    }
  };

  useEffect(() => {
    getMasterData();
    setOptions(masterData1?.common_data);
  }, [masterData1]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, []);

  const saerchFunction = (
    page,
    gender,
    mat_status,
    minAge,
    maxAge,
    religion,
    caste
  ) => {
    userSearch(page, gender, mat_status, minAge, maxAge, religion, caste)
      .then((res) => {
        if (res.data.code === 200) {
          var encrypted_json = JSON.parse(atob(res?.data?.data));
          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          );

          var decryptedText = dec.toString(CryptoJS.enc.Utf8);
          var jsonStartIndex = decryptedText.indexOf("{");
          var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
          var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          jsonData.trim();
          const parsed = JSON.parse(jsonData);

          setDataById();
          setUserSearchData(parsed?.data);
          setSearchData(parsed?.data);
          setTotalPage(parsed?.last_page);
          if (window !== "undefined") {
            window.scrollTo({
              top: 600,
              behavior: "smooth",
            });
          }
          if (parsed?.data?.length == 0) {
            setMessage("No Result !!");
          } else {
            setMessage("");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saerchFilter = () => {
    const {
      pageN,
      gender = "",
      mat_status = "",
      minAge = "",
      maxAge = "",
      religion = "",
      caste = "",
    } = router.query;
    if (gender || mat_status || minAge || maxAge || religion || caste) {
      saerchFunction(
        pageN,
        gender,
        mat_status,
        minAge,
        maxAge,
        religion,
        caste
      );
    } else if (page > 0) {
      saerchFunction(
        page,
        data.gender,
        data.mat_status,
        data.minAge,
        data.maxAge,
        data.religion,
        data.caste
      );
    }
  };

  useEffect(() => {
    saerchFilter();
  }, [page]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (data?.gender) {
      setError("");
      setPage(1);
      saerchFunction(
        page,
        data?.gender,
        data?.mat_status,
        data?.minAge,
        data?.maxAge,
        data?.religion,
        data?.caste
      );
    } else {
      setError("Please select gender");
    }
  };

  const handleClearFilters = () => {
    if (user) {
      setData({
        ...data,
        mat_status: "",
        religion: "",
        caste: "",
        minAge: "",
        maxAge: "",
      });
    } else {
      setData({
        gender: "",
        mat_status: "",
        religion: "",
        caste: "",
        minAge: "",
        maxAge: "",
      });
    }

    setSearchData([]);
  };

  const handleSearchById = () => {
    if (rytId) {
      searchById(rytId)
        .then((res) => {
          setSearchData([]);
          if (res.data.status === 200) {
            console.log(res, "res search id");
            var encrypted_json = JSON.parse(atob(res?.data?.users));
            var dec = CryptoJS.AES.decrypt(
              encrypted_json.value,
              CryptoJS.enc.Base64.parse(decrypted_key),
              {
                iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
              }
            );

            var decryptedText = dec.toString(CryptoJS.enc.Utf8);

            var jsonStartIndex = decryptedText.indexOf("{");
            var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
            var jsonData = decryptedText.substring(
              jsonStartIndex,
              jsonEndIndex
            );

            jsonData.trim();
            const parsed = JSON.parse(jsonData);

            setUserSearchData(parsed);
            setDataById(parsed);
            setMessage("");
          } else if (res.data.status === 404) {
            setMessage(res.data.message);
            setSearchData();
            setDataById("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setDataById("");
      setMessage("Please enter RYTID");
    }
  };

  return (
    <>
      <Head>
        <title>Search - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>
      <div className="w-full h-auto">
        <HeaderTwo />
        <div className="my-5 text-center">
          <div className="">
            <div className="text-4xl self-center">Find Your</div>
            <div className="text-4xl">
              <div className="w-max m-auto px-4 py-2 rounded-md">
                <span className="text-primary">Special</span>
                <span className="text-primary"> Someone </span>
              </div>
            </div>
          </div>

          <div className="text-md  flex justify-center">
            <div className="flex flex-wrap lg:w-[500px] md:w-[500px]">
              <div className="w-full">
                <ul className="flex mb-0 list-none pt-3 pb-4" role="tablist">
                  <li className="-mb-px mr-2 text-center w-full">
                    <div
                      className={
                        "text-xs font-bold uppercase px-5 py-3 border rounded block leading-normal cursor-pointer" +
                        (openTab === 1
                          ? "text-primary border-primary bg-blueGray-600 cursor-pointer"
                          : "text-blueGray-600 cursor-pointer bg-white")
                      }
                      data-toggle="tab"
                      role="tablist"
                      onClick={() => {
                        setOpenTab(1);
                        setSearchData([]);
                        setDataById("");
                        setPage(0);
                      }}
                    >
                      By Profile
                    </div>
                  </li>
                  <li className="-mb-px mr-2 text-center w-full">
                    <div
                      className={
                        "text-xs font-bold uppercase px-5 py-3 border rounded block leading-normal cursor-pointer" +
                        (openTab === 2
                          ? "text-primary border-primary bg-blueGray-600 cursor-pointer"
                          : "text-blueGray-600 cursor-pointer bg-white")
                      }
                      data-toggle="tab"
                      role="tablist"
                      onClick={() => {
                        setOpenTab(2);
                        setSearchData([]);
                        setDataById("");
                      }}
                    >
                      Search by ID
                    </div>
                  </li>
                </ul>
                <div className="relative flex flex-col min-w-0 break-words bg-gray-100 w-full mb-6 rounded-md">
                  <div className="px-6 py-6 flex-auto">
                    <div className="tab-content tab-space">
                      <div
                        className={openTab === 1 ? "block" : "hidden"}
                        id="link1"
                      >
                        <form>
                          <div className="grid grid-rows-[200px_minmax(900px,_1fr)_100px gap-2">
                            <div className="flex md:justify-between justify-center">
                              <div className="mr-2">
                                <div className="font-medium mb-2 text-start ml-2">
                                  I&apos;m looking for
                                </div>
                                <select
                                  name="gender"
                                  className="md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.gender}
                                  disabled={user ? true : false}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select
                                  </option>
                                  {options?.gender?.map((item, index) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                {error && (
                                  <div className="text-sm text-red-600">
                                    Please Select*
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium mb-2 text-start ml-2">
                                  Marital Status
                                </div>
                                <select
                                  name="mat_status"
                                  className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.mat_status}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select Marital Status
                                  </option>
                                  {options?.mat_status?.map((item, index) => (
                                    <option value={item} key={index}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex md:justify-between justify-center">
                              <div className="mr-2">
                                <div className="font-medium mb-2 text-start ml-2">
                                  Community
                                </div>
                                <select
                                  name="religion"
                                  className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.religion}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select Community
                                  </option>
                                  {options?.religion?.map((item, index) => (
                                    <option value={item.id} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <div className="font-medium mb-2 text-start ml-2">
                                  Select Clan
                                </div>
                                <select
                                  name="caste"
                                  className="md:w-52 text-sm w-36 border border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.caste}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select Clan
                                  </option>
                                  {options?.caste?.map((item, index) => (
                                    <option value={item.id} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="text-start font-medium mb-2 ml-2">
                                Age
                              </div>
                              <div className="flex">
                                <select
                                  name="minAge"
                                  className="text-sm border w-full border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.minAge}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select Min Age
                                  </option>
                                  {minAge.map((item, index) => (
                                    <option value={item.name} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                <span className="self-center px-2 font-medium">
                                  To
                                </span>
                                <select
                                  name="maxAge"
                                  className="text-sm border w-full border-gray-300 rounded px-2 py-2 font-medium"
                                  value={data?.maxAge}
                                  onChange={handleChange}
                                >
                                  <option value="" hidden>
                                    Select Max Age
                                  </option>
                                  {maxAge.map((item, index) => (
                                    <option value={item.name} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <button
                              className="bg-primary text-white rounded-md p-2 text-center cursor-pointer"
                              onClick={handleSearch}
                            >
                              Search
                            </button>
                          </div>
                        </form>
                        {data?.gender && (
                          <div className="w-full mt-3">
                            <button
                              className="bg-primary w-full text-white rounded-md p-2 text-center cursor-pointer"
                              onClick={handleClearFilters}
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                      <div
                        className={openTab === 2 ? "block" : "hidden"}
                        id="link2"
                      >
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="ID"
                            name="ryt_id"
                            className="w-full p-2 rounded-md border border-gray-300 mr-2 focus:outline-none placeholder:font-medium"
                            onChange={(e) => setRytId(e.target.value)}
                          />
                          <button
                            className="bg-primary px-4 text-white rounded-md"
                            onClick={handleSearchById}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {searchData?.length > 0 && (
            <div className="lg:px-32 mt-2 lg:text-left md:text-left text-center font-medium lg:text-[20px] md:text-[20px] text-[16px] px-10 text-gray-700">
              HERE IS YOUR RESULT
              <hr className="my-4 border" />
            </div>
          )}

          {message && (
            <div className="text-center font-medium text-[20px] text-gray-700">
              {message}
            </div>
          )}

          {dataById && (
            <Usercard item={dataById} index={1} className="w-[300px] mx-auto" />
          )}

          <div className="grid justify-center md:grid-cols-3 lg:grid-cols-4 gap-2 lg:px-32 md:px-8">
            {searchData &&
              searchData?.map((item, index) => {
                if (item.ryt_id !== userData?.user?.ryt_id) {
                  return <Usercard item={item} index={index} />;
                }
              })}
          </div>

          {searchData?.length > 1 && (
            <div className="flex justify-center mt-5">
              <Pagination
                page={page}
                count={totalPage}
                onChange={(e, value) => setPage(value)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
