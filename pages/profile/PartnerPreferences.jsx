import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApiService from "../../services/ApiService";



const schema = yup.object().shape({
  marital_status: yup.string().required("Marital status is required"),
  religion: yup.string().required("Religion is required"),
  caste: yup.string().required("Caste is required"),
  clan: yup.string().nullable(),
  min_age: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Min age is required")
    .min(18, "Min age must be at least 18"),
  max_age: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Max age is required")
    .min(yup.ref("min_age"), "Max age must be greater than or equal to min age"),
});

const defaultValues = {
  marital_status: "",
  religion: "",
  caste: "",
  clan: "",
  min_age: "",
  max_age: "",
};

const PartnerPreferences = ({ data, fetchProfile }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePartnerPreferences } = useApiService();
  const masterData1 = useSelector((state) => state.user);

  const {
    watch,
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const toggleEdit = () => setIsEdit(!isEdit);

  useEffect(() => {
    if (data) {
      reset({
        marital_status: data?.marital_status || "",
        religion: data?.religion?.toString?.() || data?.religion || "",
        caste: data?.caste?.toString?.() || data?.caste || "",
        clan: data?.clan?.toString?.() || data?.clan || "",
        min_age: data?.min_age?.toString?.() || "",
        max_age: data?.max_age?.toString?.() || "",
      });
    }
  }, [data, reset]);

  const getNameById = (list, id) => {
    if (!list || !id) return "—";
    const item = list.find(
      (opt) => opt?.id?.toString() === id?.toString() || opt === id
    );
    return item?.name || item || "—";
  };

  const getClanNameById = (religionId, casteId, clanId) => {
      if(!clanId) return "—";
      const religion = masterData1?.common_data?.religion?.find(r => r.id == religionId);
      const caste = religion?.castes?.find(c => c.id == casteId);
      const clan = caste?.clans?.find(c => c.id == clanId);
      return clan?.name || "—";
  }

  const onSubmit = async (data) => {
    const selectedReligion = masterData1?.common_data?.religion?.find(r => r.id == data.religion);
    const selectedCaste = selectedReligion?.castes?.find(c => c.id == data.caste);
    const selectedClan = selectedCaste?.clans?.find(c => c.id == data.clan);

    const payload = {
      ...data,
      religion_name: selectedReligion?.name,
      caste_name: selectedCaste?.name,
      clan_name: selectedClan?.name,
      enabled: 1
    };

    setLoading(true);
    try {
      const res = await updatePartnerPreferences(payload);
      if (res?.success || res?.status === 200 || res?.code === 200) {
        toggleEdit();
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium mb-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-2 bg-primary flex justify-between items-center">
          <p className="text-white font-semibold">Partner Preferences</p>
          {!isEdit ? (
            <div
              onClick={toggleEdit}
              className="flex text-white cursor-pointer"
            >
              <div className="text-white font-semibold pr-1">Edit</div>
              <AiFillEdit size={19} />
            </div>
          ) : (
            <div className="flex">
              <button
                type="submit"
                disabled={Boolean(loading)}
                className="disabled:cursor-not-allowed flex gap-2 text-white font-semibold pl-1 pr-5"
              >
                <FaEdit size={19} />
                {loading ? "Updating..." : "Update"}
              </button>
              <div
                onClick={toggleEdit}
                className="text-white font-semibold pr-1 cursor-pointer"
              >
                Cancel
              </div>
            </div>
          )}
        </div>

        <div className="p-4 grid gap-3 leading-7">
          {/* Debug print */}
          {console.log("DEBUG: PartnerPreferences Render - data prop:", data)}
          {/* Marital Status */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Marital Status :</div>
              {isEdit ? (
                <div>
                  <Controller
                    control={control}
                    name="marital_status"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      >
                        <option value="" hidden>
                          Select
                        </option>
                        {masterData1?.common_data?.mat_status?.map(
                          (item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  />
                  {errors.marital_status && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.marital_status.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">
                  {data?.marital_status || "--"}
                </div>
              )}
            </div>
          </div>

          {/* Religion */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Community :</div>
              {isEdit ? (
                <div>
                  <Controller
                    name="religion"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                         onChange={(e) => {
                            field.onChange(e);
                            setValue("caste", "");
                            setValue("clan", "");
                        }}
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      >
                        <option value="" hidden>
                          Select
                        </option>
                        {masterData1?.common_data?.religion?.map(
                          (item, index) => (
                            <option key={index} value={item?.id}>
                              {item?.name}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  />
                  {errors.religion && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.religion.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">
                  {data?.religion_name || getNameById(
                    masterData1?.common_data?.religion,
                    data?.religion
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Caste */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Caste :</div>
              {isEdit ? (
                <div>
                  <Controller
                    name="caste"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            setValue("clan", "");
                        }}
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      >
                        <option value="" hidden>
                          Select
                        </option>
                         {(() => {
                            const selectedReligionId = watch("religion");
                            const religion = masterData1?.common_data?.religion?.find(r => r.id == selectedReligionId);
                            return religion?.castes?.map((item, index) => (
                              <option key={index} value={item?.id}>
                                {item?.name}
                              </option>
                            ));
                        })()}
                      </select>
                    )}
                  />
                  {errors.caste && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.caste.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">
                  {data?.caste_name || getNameById(masterData1?.common_data?.caste, data?.caste)}
                </div>
              )}
            </div>
          </div>

          {/* Clan - Optional */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Clan (Optional) :</div>
              {isEdit ? (
                <div>
                  <Controller
                    name="clan"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      >
                        <option value="">
                          Select
                        </option>
                        {(() => {
                            const selectedReligionId = watch("religion");
                            const religion = masterData1?.common_data?.religion?.find(r => r.id == selectedReligionId);
                            const selectedCasteId = watch("caste");
                            const caste = religion?.castes?.find(c => c.id == selectedCasteId);
                            
                            return caste?.clans?.map((item, index) => (
                              <option key={index} value={item?.id}>
                                {item?.name}
                              </option>
                            ));
                        })()}
                      </select>
                    )}
                  />
                  {errors.clan && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.clan.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">
                   {data?.clan_name || getClanNameById(data?.religion, data?.caste, data?.clan)}
                </div>
              )}
            </div>
          </div>

          {/* Min Age */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Min Age :</div>
              {isEdit ? (
                <div>
                  <Controller
                    name="min_age"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="18"
                        placeholder="Enter Min Age"
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      />
                    )}
                  />
                  {errors.min_age && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.min_age.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">{data?.min_age}</div>
              )}
            </div>
          </div>

          {/* Max Age */}
          <div>
            <div className="flex items-center">
              <div className="md:w-1/3 w-1/2">Max Age :</div>
              {isEdit ? (
                <div>
                  <Controller
                    name="max_age"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        placeholder="Enter Max Age"
                        className="outline-none md:w-52 w-36 text-sm border border-gray-300 rounded px-2 py-2 font-medium"
                      />
                    )}
                  />
                  {errors.max_age && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.max_age.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="md:w-2/3 w-1/2">{data?.max_age || "—"}</div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PartnerPreferences;
