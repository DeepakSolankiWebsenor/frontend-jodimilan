import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useApiService from "../../services/ApiService";
import { useSelector } from "react-redux";

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

function FindForm() {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(false)
  const [data, setData] = useState({
    gender: "",
    mat_status: "",
    religion: "",
    caste: "",
    minAge: "",
    maxAge: "",
    pageN:1
  });

  const masterData1 = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    setOptions(masterData1?.common_data);
  }, [masterData1])


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    if(data.gender){
      setError(false)
      router.push(
      {
        pathname: "/search",
        query: data,
      },
      "/search"
    );
    }
    else {
      setError(true)
    }
   
  };

  return (
    <>
      {/* Find Someone From */}
      <section>
        <div className="md:py-8 py-0 lg:px-24 md:px-14 gap-2 px-4">
          <div className="md:grid grid-cols-2 block bg-gray-50">
            <div className="self-center">
              <div className="text-center">
                <div className="relative lg:mr-0 md:mr-3">
                  <Image
                    src="/landingbanner/Kataar.webp"
                    alt=""
                    width={400}
                    height={400}
                    className="mx-auto opacity-90"
                    style={{
                      // width: "100%",
                      // height: "400px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] ">
                    <div
                      className="md:text-3xl text-2xl font-bold uppercase text-gray-900 md:leading-loose"
                      style={{}}
                    >
                      find
                      <span className="text-white text-4xl font-bold">
                        some one
                      </span>
                      <br />
                      <span className="text-[#F96167] text-4xl font-bold bg-white px-4 rounded-md opacity-100">
                        special
                      </span>
                      <br /> who can be your
                      <span className="text-[#F96167] text-4xl font-bold bg-white px-4 rounded-md opacity-100">
                        pride
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-center">
              <div className="lg:w-full">
                <div className="lg:w-max py-6 px-0">
                  <div className="text-center mb-4 text-2xl font-semibold text-[#aa0000] bg-white py-2 border-b-4 border-b-[#aa0000]">
                    Find Your Groom/Bride
                  </div>
                  <div className="md:flex justify-between md:mb-1 mb-2">
                    <div className="">
                      <div className="text-gray-600 font-semibold mb-1 ml-2">
                        I&apos;m Looking for
                      </div>
                      <select
                        name="gender"
                        className="lg:w-52 md:w-44 w-full  border font-medium border-gray-300 rounded px-2 py-2"
                        onChange={handleChange}
                      >
                        <option value="" hidden>
                          Select
                        </option>
                        {options?.gender?.map((item, index) => (
                          <option value={item} key={index}>
                            {item}
                          </option>
                        ))}
                      </select>
                      {error && <div className="text-sm text-red-600">Please Select*</div>}
                    </div>
                    <div className="">
                      <div className="text-gray-600 font-semibold mb-1 ml-2 md:pt-0 pt-2">
                        Marital Status
                      </div>
                      <select
                        name="mat_status"
                        className=" lg:w-52 md:w-44 w-full border font-medium border-gray-300 rounded px-2 py-2"
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
                  <div className="md:flex  justify-between md:mb-1 mb-2">
                    <div>
                      <div className="text-gray-600 font-semibold mb-1 ml-2">
                        Community
                      </div>
                      <select
                        name="religion"
                        className="lg:w-52 md:w-44 w-full border font-medium border-gray-300 rounded px-2 py-2"
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
                      <div className="text-gray-600 font-semibold mb-1 ml-2 md:pt-0 pt-2">
                        Clan
                      </div>
                      <select
                        name="caste"
                        className="lg:w-52 md:w-44 w-full border font-medium border-gray-300 rounded px-2 py-2"
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
                  <div className="md:mb-4 mb-2 ">
                    <div className="text-gray-600 font-semibold mb-1 ml-2">
                      Age
                    </div>
                    <div className="flex w-full">
                      <select
                        name="minAge"
                        className="md:w-52 w-1/2 border font-medium border-gray-300 rounded px-2 py-2"
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
                      <span className="self-center px-2 text-gray-600 font-medium">
                        To
                      </span>
                      <select
                        name="maxAge"
                        className="md:w-52 w-[43%] border font-medium border-gray-300 rounded px-2 py-2"
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
                  <div
                    className="bg-zinc-800 text-white rounded-md p-2 text-center cursor-pointer"
                    onClick={handleSearch}
                  >
                    Search
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FindForm;
