import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";

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

const FindPerfectMatch = () => {
  const router = useRouter();
  const masterData1 = useSelector((state) => state.user);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    gender: "",
    mat_status: "",
    religion: "",
    minAge: "",
    maxAge: "",
  });

  const isFormEmpty = Object.values(form).every(
    (value) => value === "" || value === null
  );

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    setOptions(masterData1?.common_data);
  }, [masterData1]);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row items-center gap-10 px-5 py-10">
        <div className="w-full md:w-1/2">
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold">
            Find Your Perfect Match, for <br /> a Lifetime of Happiness!
          </h2>
          <div className="my-10 text-sm sm:text-base md:text-lg">
            Join millions of verified profiles and start your journey toward a
            meaningful <br /> relationship, safely and securely.
          </div>

          <div className="bg-secondary rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="grid gap-1">
                <label className="text-sm font-medium">I'm looking for a</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="outline-none p-3 bg-white rounded-md text-xs font-medium"
                >
                  <option value="" hidden>
                    Please Select
                  </option>
                  {options?.gender?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1 w-full">
                <label className="text-sm font-medium">Aged</label>
                <div className="flex items-center gap-2 w-full">
                  <select
                    name="minAge"
                    value={form.minAge}
                    onChange={handleChange}
                    className="outline-none p-3 bg-white rounded-md text-xs font-medium w-full"
                  >
                    <option value="" hidden>
                      Please Select
                    </option>
                    {minAge.map((item, index) => (
                      <option value={item.name} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="text-sm font-medium">to</div>
                  <select
                    name="maxAge"
                    value={form.maxAge}
                    onChange={handleChange}
                    className="outline-none p-3 bg-white rounded-md text-xs font-medium w-full"
                  >
                    <option value="" hidden>
                      Please Select
                    </option>
                    {maxAge.map((item, index) => (
                      <option value={item.name} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Religion</label>
                <select
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className="outline-none p-3 bg-white rounded-md text-xs font-medium"
                >
                  <option value="" hidden>
                    Please Select
                  </option>
                  {options?.religion?.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-medium">Marital Status</label>
                <select
                  name="mat_status"
                  value={form.mat_status}
                  onChange={handleChange}
                  className="outline-none p-3 bg-white rounded-md text-xs font-medium"
                >
                  <option value="" hidden>
                    Please Select
                  </option>
                  {options?.mat_status?.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={isFormEmpty}
              onClick={() => router.push("/search")}
              className="disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer outline-none mt-5 py-2 bg-primary text-sm text-center w-full text-white font-semibold rounded-md"
            >
              Find Match
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-wrap justify-center gap-4 mt-5 md:mt-0">
          <Image
            src="/images/home-1.png"
            alt="Home Image 1"
            height={400}
            width={600}
            className="object-contain w-[40%] rounded-lg"
          />
          <Image
            src="/images/home-2.png"
            alt="Home Image 2"
            height={400}
            width={600}
            className="object-contain w-[40%] rounded-lg"
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default FindPerfectMatch;
