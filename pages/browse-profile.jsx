/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import HeaderTwo from "./HeaderTwo";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Head from "next/head";
import useApiService from "../services/ApiService";
import { useSelector } from "react-redux";
import CircularLoader from "../components/common-component/loader";
import PaginationControlled from "../components/common-component/pagination";
import Usercard from "../components/common-component/card/usercard";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": { borderBottom: 0 },
  "&:before": { display: "none" },
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
  "& .MuiAccordionSummary-content": { marginLeft: theme.spacing(1) },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Browseprofile = () => {
  const [expanded, setExpanded] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [options, setOptions] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const { getUsers, BrowseProfileData, getStates, getCities } = useApiService();
  const filterMaster = useSelector((state) => state.user?.common_data);

  const [filterTags, setFilterTags] = useState({
    occupation: [],
    state: [],
    birth_city: [],
    caste: [],
  });

  useEffect(() => {
    setOptions(filterMaster);
    // Fetch initial states (Default Country ID 101 for India)
    getStates(101).then((res) => {
      if (res?.data) setStates(res.data);
    });
  }, [filterMaster]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (filterTags.state.length > 0) {
      // Fetch cities for the last selected state (or all selected states if API supports it, 
      // but usually typical UX is to load cities for selected states)
      // For simplicity/API limitation, we might iterate or fetching for the most specific one. 
      // Assuming getCities takes a single state ID.
      // If multiple states, we might need to fetch for all and merge, 
      // but let's start with fetching for the last added state or just all if possible.
      
      // Better approach: reset cities and fetch for all selected states
      // const allCities = [];
      // Promise.all(filterTags.state.map(id => getCities(id))).then(...)
      
      // For now, let's just fetch for the most recent one or handle differently.
      // Let's iterate and merge.
      
      const fetchAllCities = async () => {
         let mergedCities = [];
         for(const stateId of filterTags.state) {
            const res = await getCities(stateId);
            if(res?.data) mergedCities = [...mergedCities, ...res.data];
         }
         setCities(mergedCities);
      };
      
      fetchAllCities();

    } else {
      setCities([]);
    }
  }, [filterTags.state]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(page);

      if (res.data.code === 200) {
        const items = res?.data?.data?.items || [];
        const paginate = res?.data?.data?.pagination || {};

        setFilteredUsers(items);
        setPagination(paginate);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleFilterChange = (type, event) => {
    const value = event.target.value;
    const filters = { ...filterTags };
    
    filters[type] = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];

    setFilterTags(filters);
  };

  const handleFilterEvent = async () => {
    setLoading(true);
    let query = "";
    
    try {
        const { occupation, state, birth_city, caste } = filterTags;

        if (Array.isArray(occupation)) occupation.forEach((v, i) => (query += `occupation[${i}]=${v}&`));
        if (Array.isArray(state)) state.forEach((v, i) => (query += `state[${i}]=${v}&`));
        if (Array.isArray(birth_city)) birth_city.forEach((v, i) => (query += `city[${i}]=${v}&`));
        if (Array.isArray(caste)) caste.forEach((v, i) => (query += `caste[${i}]=${v}&`));

        const res = await BrowseProfileData(query);

        const items = res?.data?.data?.items || [];
        const paginate = res?.data?.data?.pagination || {};

        setFilteredUsers(items);
        setPagination(paginate);
        setPage(paginate?.current_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Browse Profile - JodiMilan</title>
        <meta name="description" content="Verified Rajput Matrimony Profiles" />
      </Head>

      <HeaderTwo />

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-bold">Profiles</h1>
        <p className="text-gray-500 mt-2">
          Search & explore verified rajput community profiles
        </p>
      </div>

      <div className="my-10 flex lg:flex-row flex-col px-4 md:px-10 gap-6">
        {/* Sidebar Filter */}
        <div className="md:w-1/4 shadow-md rounded-lg h-fit">
          <div className="h-10 bg-sky-400 text-sm text-white font-medium flex px-4 items-center">
            FILTER PROFILES
          </div>

          {/* Occupation */}
          <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
            <AccordionSummary>
              BY Occupation {filterTags.occupation.length > 0 && `[${filterTags.occupation.length}]`}
            </AccordionSummary>
            <AccordionDetails>
              <div className="max-h-60 overflow-y-auto">
              {options?.options_type?.occupation?.map((item, idx) => (
                <label key={idx} className="block mt-2 text-gray-700">
                  <input
                    type="checkbox"
                    value={item?.id || item}
                    onChange={(e) => handleFilterChange("occupation", e)}
                  />
                  <span className="ml-2">{item?.name || item}</span>
                </label>
              ))}
              </div>
            </AccordionDetails>
          </Accordion>

           {/* STATE */}
           <Accordion expanded={expanded === "panelState"} onChange={handleChange("panelState")}>
            <AccordionSummary>
              BY State {filterTags.state.length > 0 && `[${filterTags.state.length}]`}
            </AccordionSummary>
            <AccordionDetails>
              <div className="max-h-60 overflow-y-auto">
              {states?.map((item, idx) => (
                <label key={idx} className="block mt-2 text-gray-700">
                  <input
                    type="checkbox"
                    value={item.id}
                    onChange={(e) => handleFilterChange("state", e)}
                  />
                  <span className="ml-2">{item.name}</span>
                </label>
              ))}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* CITY */}
          <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
            <AccordionSummary>
              BY City {filterTags.birth_city.length > 0 && `[${filterTags.birth_city.length}]`}
            </AccordionSummary>
            <AccordionDetails>
               <div className="max-h-60 overflow-y-auto">
              {cities.length > 0 ? (
                cities.map((item, idx) => (
                  <label key={idx} className="block mt-2 text-gray-700">
                    <input
                      type="checkbox"
                      value={item.id}
                      onChange={(e) => handleFilterChange("birth_city", e)}
                    />
                    <span className="ml-2">{item.name}</span>
                  </label>
                ))
              ) : (
                <div className="text-gray-500 text-sm">Select a state first</div>
              )}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* CASTE */}
          <Accordion expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
            <AccordionSummary>
              BY Clan {filterTags.caste.length > 0 && `[${filterTags.caste.length}]`}
            </AccordionSummary>
            <AccordionDetails>
              <div className="max-h-60 overflow-y-auto">
              {options?.caste?.map((item, idx) => (
                <label key={idx} className="block mt-2 text-gray-700">
                  <input
                    type="checkbox"
                    value={item.id}
                    onChange={(e) => handleFilterChange("caste", e)}
                  />
                  <span className="ml-2">{item.name}</span>
                </label>
              ))}
              </div>
            </AccordionDetails>
          </Accordion>

          <button
            onClick={handleFilterEvent}
            className="text-center bg-sky-500 h-10 w-full border rounded-b-lg text-white font-semibold"
          >
            Apply Filter
          </button>
        </div>

        {/* Profile Cards */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-10">
              <CircularLoader />
            </div>
          ) : filteredUsers?.length > 0 ? (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
              {filteredUsers.map((user, idx) => (
                <Usercard key={idx} item={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600 text-xl">
              No profiles found 🙁
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-center mb-12">
          <PaginationControlled
            setPage={setPage}
            page={pagination?.current_page || page}
            last_page={pagination?.total_pages || 1}
          />
        </div>
      )}
    </>
  );
};

export default Browseprofile;
