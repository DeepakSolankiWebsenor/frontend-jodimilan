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
    religion: [],
    caste: [],
    clan: [],
  });

  const [availableCastes, setAvailableCastes] = useState([]);
  const [availableClans, setAvailableClans] = useState([]);

  useEffect(() => {
    setOptions(filterMaster);
    // Fetch initial states (Default Country ID 101 for India)
    getStates(101).then((res) => {
      if (res?.data) setStates(res.data);
    });
  }, [filterMaster]);

  // Derive Available Castes based on Selected Religions
  useEffect(() => {
    if (filterTags.religion.length > 0 && options?.religion) {
      const selectedReligionIds = filterTags.religion.map(id => Number(id));
      const newCastes = options.religion
        .filter(r => selectedReligionIds.includes(r.id))
        .flatMap(r => r.castes || []);
      setAvailableCastes(newCastes);
    } else {
      setAvailableCastes([]);
    }
  }, [filterTags.religion, options]);

  // Derive Available Clans based on Selected Castes
  useEffect(() => {
    if (filterTags.caste.length > 0 && availableCastes.length > 0) {
      const selectedCasteIds = filterTags.caste.map(id => Number(id));
      const newClans = availableCastes
        .filter(c => selectedCasteIds.includes(c.id))
        .flatMap(c => c.clans || []);
      setAvailableClans(newClans);
    } else {
      setAvailableClans([]);
    }
  }, [filterTags.caste, availableCastes]);

  // Auto-clear logic: If dependencies change, remove invalid child selections
  useEffect(() => {
    if (availableCastes.length === 0 && filterTags.caste.length > 0) {
      setFilterTags(prev => ({ ...prev, caste: [], clan: [] }));
    } else if (availableCastes.length > 0) {
        // Optional: Filter out castes that are no longer available
        const currentCasteIds = new Set(availableCastes.map(c => String(c.id)));
        const validCastes = filterTags.caste.filter(id => currentCasteIds.has(id));
        if (validCastes.length !== filterTags.caste.length) {
             setFilterTags(prev => ({ ...prev, caste: validCastes }));
        }
    }
  }, [availableCastes]);

  useEffect(() => {
     if (availableClans.length === 0 && filterTags.clan.length > 0) {
       setFilterTags(prev => ({ ...prev, clan: [] }));
     } else if (availableClans.length > 0) {
         // Optional: Filter out clans that are no longer available
         const currentClanIds = new Set(availableClans.map(c => String(c.id)));
         const validClans = filterTags.clan.filter(id => currentClanIds.has(id));
         if (validClans.length !== filterTags.clan.length) {
              setFilterTags(prev => ({ ...prev, clan: validClans }));
         }
     }
  }, [availableClans]);


  // Fetch Cities when State changes
  useEffect(() => {
    if (filterTags.state.length > 0) {
      const fetchAllCities = async () => {
         let mergedCities = [];
         for(const stateId of filterTags.state) {
            const res = await getCities(stateId);
            if(res?.data) mergedCities = [...mergedCities, ...res.data];
         }
         // Ensure unique cities by ID
         const uniqueCities = Array.from(new Map(mergedCities.map(item => [item.id, item])).values());
         setCities(uniqueCities);
      };
      
      fetchAllCities();

    } else {
      setCities([]);
      // Reset selected cities if no state is selected
      if (filterTags.birth_city.length > 0) {
        setFilterTags(prev => ({ ...prev, birth_city: [] }));
      }
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
        const { occupation, state, birth_city, caste, religion, clan } = filterTags;

        if (Array.isArray(occupation)) occupation.forEach((v, i) => (query += `occupation[${i}]=${v}&`));
        if (Array.isArray(state)) state.forEach((v, i) => (query += `state[${i}]=${v}&`));
        if (Array.isArray(birth_city)) birth_city.forEach((v, i) => (query += `city[${i}]=${v}&`));
        if (Array.isArray(religion)) religion.forEach((v, i) => (query += `religion[${i}]=${v}&`));
        if (Array.isArray(caste)) caste.forEach((v, i) => (query += `caste[${i}]=${v}&`));
        if (Array.isArray(clan)) clan.forEach((v, i) => (query += `clan[${i}]=${v}&`));

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

  const handleResetFilter = () => {
    setFilterTags({
      occupation: [],
      state: [],
      birth_city: [],
      religion: [],
      caste: [],
      clan: [],
    });
    setCities([]);
    setAvailableCastes([]);
    setAvailableClans([]);
    setPage(1);
    // Directly fetch users to reset list
    fetchUsers(); 
  };

  return (
    <>
      <Head>
        <title>Browse Profile - JodiMilan</title>
        <meta name="description" content="Verified Matrimony Profiles" />
      </Head>

      <HeaderTwo />

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-bold">Profiles</h1>
        <p className="text-gray-500 mt-2">
          Search & explore verified community profiles
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
                    checked={filterTags.occupation.includes(String(item?.id || item))}
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
                    checked={filterTags.state.includes(String(item.id))}
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
                      checked={filterTags.birth_city.includes(String(item.id))}
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

           {/* RELIGION */}
           <Accordion expanded={expanded === "panelReligion"} onChange={handleChange("panelReligion")}>
            <AccordionSummary>
              BY Religion {filterTags.religion.length > 0 && `[${filterTags.religion.length}]`}
            </AccordionSummary>
            <AccordionDetails>
              <div className="max-h-60 overflow-y-auto">
              {options?.religion?.map((item, idx) => (
                <label key={idx} className="block mt-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterTags.religion.includes(String(item.id))}
                    value={item.id}
                    onChange={(e) => handleFilterChange("religion", e)}
                  />
                  <span className="ml-2">{item.name}</span>
                </label>
              ))}
              </div>
            </AccordionDetails>
          </Accordion>

          {/* CASTE */}
          {filterTags.religion.length > 0 && (
            <Accordion expanded={expanded === "panel3"} onChange={handleChange("panel3")}>
              <AccordionSummary>
                BY Caste {filterTags.caste.length > 0 && `[${filterTags.caste.length}]`}
              </AccordionSummary>
              <AccordionDetails>
                <div className="max-h-60 overflow-y-auto">
                {availableCastes.length > 0 ? (
                  availableCastes.map((item, idx) => (
                    <label key={idx} className="block mt-2 text-gray-700">
                      <input
                        type="checkbox"
                        checked={filterTags.caste.includes(String(item.id))}
                        value={item.id}
                        onChange={(e) => handleFilterChange("caste", e)}
                      />
                      <span className="ml-2">{item.name}</span>
                    </label>
                  ))
                ) : (
                   <div className="text-gray-500 text-sm">No castes available</div>
                )}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          {/* CLAN */}
          {filterTags.caste.length > 0 && (
            <Accordion expanded={expanded === "panelClan"} onChange={handleChange("panelClan")}>
              <AccordionSummary>
              BY Clan (Optional) {filterTags.clan.length > 0 && `[${filterTags.clan.length}]`}
            </AccordionSummary>
              <AccordionDetails>
                <div className="max-h-60 overflow-y-auto">
                {availableClans.length > 0 ? (
                  availableClans.map((item, idx) => (
                    <label key={idx} className="block mt-2 text-gray-700">
                      <input
                        type="checkbox"
                        checked={filterTags.clan.includes(String(item.id))}
                        value={item.id}
                        onChange={(e) => handleFilterChange("clan", e)}
                      />
                      <span className="ml-2">{item.name}</span>
                    </label>
                  ))
                ) : (
                   <div className="text-gray-500 text-sm">No clans available</div>
                )}
                </div>
              </AccordionDetails>
            </Accordion>
          )}

          <button
            onClick={handleFilterEvent}
            className="text-center bg-sky-500 h-10 w-full text-white font-semibold"
          >
            Apply Filter
          </button>
          <button
            onClick={handleResetFilter}
            className="text-center bg-gray-500 h-10 w-full border rounded-b-lg text-white font-semibold"
          >
            Reset Filter
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
