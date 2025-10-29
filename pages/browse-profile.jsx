/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import HeaderTwo from "./HeaderTwo";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useRouter } from "next/router";
// import Avatar from "../public/images/Avatar.webp";
import useApiService from "../services/ApiService";
import Head from "next/head";
import { useSelector } from "react-redux";
import CircularLoader from "../components/common-component/loader";
import PaginationControlled from "../components/common-component/pagination";
import Usercard from "../components/common-component/card/usercard";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const browseprofile = () => {
  const [expanded, setExpanded] = useState("");
  const [data, setData] = useState([]);
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = useState(true);
  // const dataFetchedRef = useRef(false);
  const { getUsers, BrowseProfileData } = useApiService();
  const [user, setUser] = useState(false);
  const [options, setOptions] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterTags, setFilterTags] = useState({
    occupation: [],
    birth_city: [],
    caste: [],
  });
  const masterData = useSelector((state) => state.user);

  useEffect(() => {
    setOptions(masterData?.common_data);
  }, [masterData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
    }

    getUsers(page)
      .then((res) => {
        setLoading(false);
        if (res.data.code === 200) {
          var encrypted_json = JSON.parse(atob(res?.data?.user));
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

          setData(parsed);
          setFilteredUsers(parsed?.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [page]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleFilterEvent = () => {
    setLoading(true);
    let params = "";
    let params2 = "";
    let params3 = "";
    const { occupation, birth_city, caste } = filterTags;
    params = occupation.map((data, index) =>
      `occupation[${index}]=${data}`.concat("&")
    );
    params2 = birth_city.map((data, index) =>
      `city[${index}]=${data}`.concat("&")
    );
    params3 = caste.map((data, index) => `caste[${index}]=${data}`.concat("&"));
    var paramData = `${params.toString().replace(",", "")}${params2
      .toString()
      .replace(",", "")}${params3.toString().replace(",", "")}`;
    // paramData = paramData.replace(",", "")
    BrowseProfileData(paramData).then((res) => {
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
      var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
      jsonData.trim();
      const parsed = JSON.parse(jsonData);

      setLoading(false);
      setData(parsed?.users);
      setFilteredUsers(parsed?.data);
    });
  };
  const handleFilterChange = (type, event) => {
    const filters = { ...filterTags };
    const currVal = event.target.value;
    if (filters[type].includes(currVal)) {
      const tempVal = filters[type].filter((elem) => elem !== currVal);
      filters[type] = [...tempVal];
    } else {
      filters[type] = [...filters[type], currVal];
    }

    setFilterTags({ ...filters });
    // const result = data.user?.filter((user) => {
    //   if (
    //     filters.occupation.length > 0 &&
    //     !filters.occupation.includes(user?.userprofile?.occupation)
    //   ) {
    //     return false;
    //   }
    //   if (filters.caste.length > 0 && !filters.caste.includes(user?.caste)) {
    //     return false;
    //   }
    //   if (
    //     filters.birth_city.length > 0 &&
    //     !filters.birth_city.includes(user?.userprofile?.birth_city?.name)
    //   ) {
    //     return false;
    //   }
    //   return true;
    // });
    // setFilteredUsers(result);
  };

  return (
    <>
      <Head>
        <title>Browse Profile - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>
      <div className="w-full h-auto">
        <HeaderTwo />

        <div className="mt-10 text-center">
          <div className="text-4xl">Profiles</div>
          <div className="text-4xl">
            <span className="text-primary">MyShaadi</span>
            <span className="text-primary"> Matrimonial </span>
          </div>
          <div className="text-md text-gray-500 mt-5 flex justify-center">
            <div className="w-full md:px-24 px-4">
              Myshaadi.com is dedicated to cherish, nurture and preserve the aesthetic beliefs of “Rajput Community” by providing match making assistance for Bannas and Baisas of the Rajput community exclusively
            </div>
          </div>
        </div>

        <div className="my-10  flex lg:flex-row md:flex-row flex-col lg:gap-6 md:px-10 px-4">
          {/* side bar */}
          <div className=" md:w-1/4">
            <div className="h-10 bg-sky-400 text-sm font-medium flex px-10 items-center">
              BROWSE PROFILES
            </div>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                className="text-black font-medium"
              >
                <div className="text-sm">
                  BY OCCUPATION{" "}
                  {filterTags.occupation.length > 0 &&
                    `[${filterTags.occupation.length}]`}
                </div>
              </AccordionSummary>
              <AccordionDetails className="font-medium">
                <div>
                  {options?.options_type?.occupation?.map((item, index) => (
                    <div
                      className="mt-2 text-gray-700 flex items-center"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        value={item}
                        onChange={(event) =>
                          handleFilterChange("occupation", event)
                        }
                      />
                      <span className="ml-1 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
                className="text-black font-medium"
              >
                <div className="text-sm">
                  BY CITY{" "}
                  {filterTags.birth_city.length > 0 &&
                    `[${filterTags.birth_city.length}]`}
                </div>
              </AccordionSummary>
              <AccordionDetails className="font-medium">
                {options?.city?.map((item, index) => {
                  return (
                    <div
                      className="mt-2 text-gray-700 flex items-center"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        value={item.id}
                        onChange={(event) =>
                          handleFilterChange("birth_city", event)
                        }
                      />
                      <span className="ml-1 font-medium">{item.name}</span>
                    </div>
                  );
                })}
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
                className="text-black font-medium"
              >
                <div className="text-sm">
                  BY CLAN{" "}
                  {filterTags.caste.length > 0 &&
                    `[${filterTags.caste.length}]`}
                </div>
              </AccordionSummary>
              <AccordionDetails className="font-medium">
                {options?.caste?.map((item, index) => (
                  <div
                    className="mt-2 text-gray-700 flex items-center"
                    key={index}
                  >
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      value={item.id}
                      onChange={(event) => handleFilterChange("caste", event)}
                    />
                    <span className="ml-1 font-medium">{item.name}</span>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
            <button
              onClick={() => {
                handleFilterEvent();
              }}
              className="text-center bg-sky-400 h-10 w-full border rounded-b-lg"
            >
              Filter
            </button>
          </div>
          <div className="md:w-3/4">
            {!loading ? (
              filteredUsers?.length > 0 ? (
                <div className="w-full mt-6 lg:mt-0 md:mt-0">
                  <div className="grid lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 flex-wrap lg:justify-start justify-center">
                    {filteredUsers?.map((item, index) => {
                      return <Usercard item={item} index={index} />;
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-5 mb-5 text-center w-full">
                  <div className="font-semibold text-[30px] text-gray-500">
                    No Users Found
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-center py-10">
                <CircularLoader />
              </div>
            )}
          </div>
        </div>
        {!loading && filteredUsers?.length > 0 && (
          <div className="flex justify-center">
            <PaginationControlled
              setPage={setPage}
              last_page={data?.last_page}
              page={page}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default browseprofile;
