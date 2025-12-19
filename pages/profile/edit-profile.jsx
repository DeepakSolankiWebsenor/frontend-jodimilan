/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
/* Last Update: 2025-12-19 12:25 PM */
import React, { useCallback, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import WomenD from "../../public/images/girldefault.png";
import MenD from "../../public/images/mendefault.png";
import ImageUploading from "react-images-uploading";
import useApiService from "../../services/ApiService";
import { CircularProgress, Tooltip } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ReplyIcon from "@mui/icons-material/Reply";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../services/redux/slices/userSlice";
import Head from "next/head";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../../services/appConfig";
import moment from "moment";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ImageViewer from "react-simple-image-viewer";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ThikanaEnquiryForm from "../../components/ThikanaEnquiryForm";
import PartnerPreferences from "./PartnerPreferences";

/* AES Decrypt */
const decryptPayload = (cipherBase64) => {
  try {
    if (!cipherBase64) return null;

    const keyHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_KEY);
    const ivHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_IV);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipherBase64) },
      keyHex,
      {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const text = decrypted.toString(CryptoJS.enc.Utf8).trim();
    if (!text || (!text.startsWith("{") && !text.startsWith("["))) return null;

    return JSON.parse(text);
  } catch (err) {
    console.error("Decryption Error:", err);
    return null;
  }
};

const alignUserData = (data) => {
  console.log("DEBUG: alignUserData input:", data);
  if (!data) return null;
  
  // Clone data to avoid mutations
  const raw = { ...data };
  
  // The API response might have a 'user' property that is the encrypted string itself.
  if (typeof raw.user === 'string') {
      delete raw.user;
  }

  const profile = raw.profile || {};

  // Create a dedicated user object for display
  const processedUser = {
    ...raw,
    ...profile, // Flatten profile fields (like thikana_state ID)
    fullName: raw.name ? `${raw.name} ${raw.last_name || ""}`.trim() : "---",
    
    // Explicitly handle location relations for display
    caste: raw.casteRelation || raw.caste,
    religion: raw.religionRelation || raw.religion,
    state: raw.stateRelation || raw.state,
    country: raw.countryRelation || raw.country,

    // Flatten location names if relations exist
    thikana_state_name: profile.thikanaState?.name || profile.thikana_state,
    thikana_city_name: profile.thikanaCity?.name || profile.thikana_city,
    thikana_area_name: profile.thikanaArea?.name || profile.thikana_area,
    thikhana_name: profile.thikhanaRelation?.name || profile.thikhana_id,
    
    birth_country_name: profile.birthCountry?.name || profile.birth_country,
    birth_state_name: profile.birthState?.name || profile.birth_state,
    birth_city_name: profile.birthCity?.name || profile.birth_city,

    ed_country_name: profile.edCountry?.name || profile.ed_country,
    ed_state_name: profile.edState?.name || profile.ed_state,
    ed_city_name: profile.edCity?.name || profile.ed_city,
  };

  // Ensure partner_preferences is an object
  if (processedUser.partner_preferences && typeof processedUser.partner_preferences === "string") {
    try {
      processedUser.partner_preferences = JSON.parse(processedUser.partner_preferences);
    } catch (e) {
      console.warn("Failed to parse partner_preferences JSON string", e);
    }
  }

  const aligned = {
    ...raw,
    ...profile,
    profile_img_src: raw.profile_photo || profile.profile_image || null,
    displayUser: processedUser,
  };

  console.log("ALIGNED DATA CHECK:", {
      fullName: aligned.displayUser?.fullName,
      thikana_state: aligned.displayUser?.thikana_state_name,
      thikhana: aligned.displayUser?.thikhana_name
  });

  return aligned;
};

function EditProfile() {
  const [thikanaEdit, setThikanaEdit] = useState(true);
  const [socialEdit, setSocialEdit] = useState(true);
  const [educationEdit, setEducationEdit] = useState(true);
  const [physicalEdit, setPhysicalEdit] = useState(true);
  const [familyDetailEdit, setFamilyDetailEdit] = useState(true);
  const [privacySettingsEdit, setPrivacySettingsEdit] = useState(true);
  const [aboutEdit, setAboutEdit] = useState(true);
  const [preferenceEdit, setPreferenceEdit] = useState(true);
  const { register, handleSubmit, setValue } = useForm();
  const [userData, setUserData] = useState(null);
  console.log("DEBUG: EditProfile initialized. Initial userData:", userData);
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [options, setOptions] = useState([]);
  const router = useRouter();
  const [profileremove, setProfileremove] = useState(false);
  const [photoPrivacy, setPhotoPrivacy] = useState("");
  const [contactPrivacy, setContactPrivacy] = useState("");
  const {
    profileUpdate,
    profileImageRemove,
    getCities,
    getAreas,
    getThikanas,
    getStates,
    getUserProfile,
    albumUpload,
    deleteAlbumImage,
  } = useApiService();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const dispatch = useDispatch();
  const masterData1 = useSelector((state) => state.user);
  const [stateOptions, setStateOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [thikanaOptions, setThikanaOptions] = useState([]);
  const [birthCountry, setBirthCountry] = useState(null);
  const [birthState, setBirthState] = useState(null);
  const [birthCity, setBirthCity] = useState(null);
  const [thikanaState, setThikanaState] = useState(null);
  const [thikanaCity, setThikanaCity] = useState(null);
  const [thikanaArea, setThikanaArea] = useState(null);
  const [thikana, setThikana] = useState(null);
  const [images, setImages] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [openEnquiryModal, setOpenEnquiryModal] = useState(false);

  const getUserPorofileData = () => {
    getUserProfile("/user/profile")
      .then((res) => {
        const code = res?.data?.code ?? res?.data?.status;
        const success = res?.data?.success === true || res?.data?.status === 200 || code === 200;

        if (success) {
          const encryptedUser = res?.data?.data?.user || res?.data?.user || null;
          console.log("DEBUG: Encrypted string from API:", encryptedUser ? encryptedUser.substring(0, 50) + "..." : "null");
          
          let decrypted = null;
          if (typeof encryptedUser === 'string') {
              decrypted = decryptPayload(encryptedUser);
          } else if (encryptedUser && typeof encryptedUser === 'object') {
              decrypted = encryptedUser;
          }
          
          console.log("DEBUG: Decrypted payload object:", decrypted);
          
          if (decrypted) {
            console.log("DEBUG: Decrypted partner_preferences:", decrypted.partner_preferences);
            const parsed = alignUserData(decrypted);
            console.log("DEBUG: Aligned partner_preferences:", parsed?.displayUser?.partner_preferences);
            setUserData(parsed);
            setPhotoPrivacy(parsed?.photo_privacy);
            setContactPrivacy(parsed?.contact_privacy);

            // Fetch state options for the dropdown if country exists
            const dispUser = parsed.displayUser || parsed;

            // Autofill form fields
            const fieldMappings = [
              "gothra", "moon_sign", "manglik", "birth_time", 
              "educations", "education_details", "annual_income", 
              "occupation", "occupation_details", "employeed_in",
              "height", "diet", "smoke", "drink",
              "no_of_brothers", "no_of_sisters", 
              "father_contact_no", "father_occupation",
              "mother_contact_no", "mother_occupation",
              "about_yourself"
            ];

            fieldMappings.forEach(field => {
              if (parsed[field] !== undefined && parsed[field] !== null) {
                setValue(field, parsed[field]);
              } else if (dispUser[field] !== undefined && dispUser[field] !== null) {
                setValue(field, dispUser[field]);
              }
            });

            // Handle location fields (objects with IDs)
            const bCountry = parsed.birth_country || dispUser.countryRelation || dispUser.country;
            if (bCountry) {
              const countryId = typeof bCountry === 'object' ? bCountry.id : bCountry;
              setValue("birth_country", countryId);
              setBirthCountry(typeof bCountry === 'object' ? bCountry : { id: bCountry });
              getStates(countryId).then((res) => {
                if (res.code === 200) setStateOptions(res.data);
              });
            }

            const bState = parsed.birth_state || dispUser.stateRelation || dispUser.state;
            if (bState) {
              const stateId = typeof bState === 'object' ? bState.id : bState;
              setValue("birth_state", stateId);
              setBirthState(typeof bState === 'object' ? bState : { id: bState });
              getCities(stateId).then((res) => {
                if (res.code === 200) setCitiesOptions(res.data);
              });
            }

            const bCity = parsed.birth_city || dispUser.cityRelation || dispUser.city;
            if (bCity) {
              const cityId = typeof bCity === 'object' ? bCity.id : bCity;
              setValue("birth_city", cityId);
              setBirthCity(typeof bCity === 'object' ? bCity : { id: bCity });
            }

            const tState = parsed.thikana_state || dispUser.stateRelation || dispUser.state;
            if (tState) {
              const stateId = typeof tState === 'object' ? tState.id : tState;
              setValue("thikana_state", stateId);
              setThikanaState(typeof tState === 'object' ? tState : { id: tState });
              getCities(stateId).then((res) => {
                if (res.code === 200) setCitiesOptions(res.data);
              });
            }

            const tCity = parsed.thikana_city || dispUser.cityRelation || dispUser.city;
            if (tCity) {
              const cityId = typeof tCity === 'object' ? tCity.id : tCity;
              setValue("thikana_city", cityId);
              setThikanaCity(typeof tCity === 'object' ? tCity : { id: tCity });
              getAreas(cityId).then((res) => {
                if (res.code === 200) setAreaOptions(res.data);
              });
            }

            const tArea = parsed.thikana_area || dispUser.areaRelation || dispUser.area;
            if (tArea) {
              const areaId = typeof tArea === 'object' ? tArea.id : tArea;
              setValue("thikana_area", areaId);
              setThikanaArea(typeof tArea === 'object' ? tArea : { id: tArea });
              getThikanas(areaId).then((res) => {
                if (res.code === 200) setThikanaOptions(res.data);
              });
            }

            const tThikhana = parsed.thikhana_id || dispUser.thikhana_id || (parsed.profile ? parsed.profile.thikhana_id : null);
            if (tThikhana) {
              const thikhanaId = typeof tThikhana === 'object' ? tThikhana.id : tThikhana;
              setValue("thikhana_id", thikhanaId);
              setThikana(typeof tThikhana === 'object' ? tThikhana : { id: thikhanaId });
            }

            if (parsed.mother_caste) {
              setValue("mother_caste", typeof parsed.mother_caste === 'object' ? parsed.mother_caste.id : parsed.mother_caste);
            }

            // Simple fields that might be nested or at top level
            if (dispUser.name) setValue("name", dispUser.name);
            if (dispUser.email) setValue("email", dispUser.email);
            if (dispUser.phone) setValue("phone", dispUser.phone);

            dispatch(setUser({ user: encryptedUser }));
          }
        }
      })
      .catch((error) => {
        console.error("Fetch Profile Error:", error);
      });
  };

  useEffect(() => {
    getUserPorofileData();
  }, []);

  useEffect(() => {
    setOptions(masterData1?.common_data);
  }, [masterData1]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  const handleImageChange = (imageList) => {
    setIsImageUpload(true);
    setProfileImage(imageList);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append(
      "profile_image",
      profileImage[0].file,
      profileImage[0].file.name
    );

    profileUpdate(formData)
      .then((res) => {
        if (res.status === 200) {
          const encryptedUser = res?.data?.user_profile;
          const decrypted = decryptPayload(encryptedUser);

          if (decrypted) {
            setUserData(alignUserData(decrypted));
            dispatch(setUser({ user: encryptedUser }));
          }
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setIsImageUpload(false);
            setAlert(true);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleProfileremove = () => {
    profileImageRemove().then((res) => {
      if (res.data.status === 200) {
        const encryptedUser = res?.data?.user;
        const decrypted = decryptPayload(encryptedUser);

        if (decrypted) {
          setUserData(alignUserData(decrypted));
          dispatch(setUser({ user: encryptedUser }));
        }
        setAlert(true);
        setProfileremove(true);
      }
    });
  };

  const handleEdit = (data) => {
    console.log("DEBUG: handleEdit Raw Data:", data);
    const params = {};

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        params[key] = data[key];
      }
    }
    
    console.log("DEBUG: handleEdit Params to Send:", params);

    profileUpdate(params)
      .then((res) => {
        if (res.status === 200 || res.data?.success) {
          const encryptedUser = res?.data?.data?.user || res?.data?.user || res?.data?.user_profile;
          const decrypted = decryptPayload(encryptedUser);

          if (decrypted) {
            setUserData(alignUserData(decrypted));
            setSocialEdit(true);
            setEducationEdit(true);
            setPhysicalEdit(true);
            setFamilyDetailEdit(true);
            setThikanaEdit(true);
            setAboutEdit(true);
            setPreferenceEdit(true);
            setAlert(true);
            
            // Re-fetch to ensure all relational data (like caste names) is fresh
            getUserPorofileData();
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const handleCountryChange = (e) => {
    getStates(e.target.value)
      .then((res) => {
        if (res.code === 200) {
          if (e.target.name === "birth_country") {
            setBirthState(null);
            setBirthCity(null);
          }
          setStateOptions(res?.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleStateChange = (e) => {
    setValue("thikana_city", "");
    setValue("thikana_area", "");
    setValue("thikhana_id", "");
    getCities(e.target.value)
      .then((res) => {
        if (res.code === 200) {
          if (e.target.name === "birth_state") {
            setBirthCity(null);
          } else {
            setThikanaCity(null);
            setThikanaArea(null);
            setThikana(null);
          }
          setCitiesOptions(res?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCityChange = (e) => {
    setValue("thikana_area", "");
    setValue("thikhana_id", "");
    getAreas(e.target.value)
      .then((res) => {
        if (res?.code === 200) {
          if (e.target.name === "thikana_city") {
            setThikanaArea(null);
            setThikana(null);
          }
          setAreaOptions(res?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAreaChange = (e) => {
    getThikanas(e.target.value)
      .then((res) => {
        if (e.target.name === "thikana_area") {
          setThikana(null);
        }
        if (res.code === 200) {
          setThikanaOptions(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
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
    }
  };

  const handleUpdatePrivacySettings = (key, value) => {
    // Optimistic Update: Change the radio selection immediately
    if (key === "photo") {
      setPhotoPrivacy(value);
    } else {
      setContactPrivacy(value);
    }

    const params = key === "photo" ? { photo_privacy: value } : { contact_privacy: value };

    profileUpdate(params)
      .then((res) => {
        const code = res?.data?.code ?? res?.data?.status;
        const success = res?.data?.success === true || res?.data?.status === 200 || code === 200;

        if (success) {
          const encryptedUser = res?.data?.data?.user || res?.data?.user_profile || res?.data?.user;
          let decrypted = null;
          if (typeof encryptedUser === 'string') {
              decrypted = decryptPayload(encryptedUser);
          } else if (encryptedUser && typeof encryptedUser === 'object') {
              decrypted = encryptedUser;
          }

          if (decrypted) {
            const parsed = alignUserData(decrypted);
            setUserData(parsed);
            setAlert(true);
            
            // Sync with final server value just in case
            if (key === "photo") {
              setPhotoPrivacy(parsed?.photo_privacy);
            } else {
              setContactPrivacy(parsed?.contact_privacy);
            }
          }
        }
      })
      .catch((error) => {
        console.log("Privacy Update Error:", error);
        // Optional: Re-fetch current data to reset the radio button on error
        getUserPorofileData();
      });
  };

  const handleAlbumImageChange = (imageList) => {
    setImages(imageList);
  };

  const handleAlbumUpload = () => {
    const formData = new FormData();
    images.map((item, index) => {
      formData.append(`images[${index}]`, item.file, item.file.name);
    });

    albumUpload(formData)
      .then((res) => {
        if (res.data.status === 200) {
          const encryptedUser = res?.data?.user;
          const decrypted = decryptPayload(encryptedUser);

          if (decrypted) {
            setUserData(alignUserData(decrypted));
            setLoading(true);
            setAlert(true);
            setTimeout(() => {
              setImages([]);
              setLoading(false);
              getUserPorofileData();
            }, 2000);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteAlbumImage = (id) => {
    deleteAlbumImage(id)
      .then((res) => {
        if (res.data.status === 200) {
          const encryptedUser = res?.data?.user;
          const decrypted = decryptPayload(encryptedUser);
          if (decrypted) {
            setUserData(alignUserData(decrypted));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const {
    diet,
    birth_time,
    annual_income,
    drink,
    educations,
    employeed_in,
    birth_city,
    birth_country,
    birth_state,
    ed_city,
    ed_country,
    ed_state,
    father_contact_no,
    father_occupation,
    gothra,
    height,
    manglik,
    moon_sign,
    mother_contact_no,
    mother_occupation,
    no_of_brothers,
    no_of_sisters,
    occupation,
    profile_img_src,
    smoke,
    displayUser,
    mother_caste,
    thikana_area,
    thikana_city,
    thikana_state,
    thikhana,
    about_yourself,
    partner_preferences,
    occupation_details,
    education_details,
  } = userData || {};

  console.log("RENDER DEBUG: Current state status:", {
      userDataExists: !!userData,
      displayUserExists: !!displayUser,
      userName: displayUser?.name,
      userDob: displayUser?.dob,
      userPhone: displayUser?.phone
  });

  const imageData = userData?.album_images?.map((item) => {
    return item.album_img_src;
  });

  const onFatherPhoneNumberChange = (event) => {
    const numericPhoneNumber = event.target.value.replace(/\D/g, "");
    const limitedPhoneNumber = numericPhoneNumber.slice(0, 10);
    setValue("father_contact_no", limitedPhoneNumber);
  };

  const onMotherPhoneNumberChange = (event) => {
    const numericPhoneNumber = event.target.value.replace(/\D/g, "");
    const limitedPhoneNumber = numericPhoneNumber.slice(0, 10);
    setValue("mother_contact_no", limitedPhoneNumber);
  };

  const occupationDetailChange = (event) => {
    setValue("occupation_details", event.target.value);
  };

  const educationDetailsChange = (event) => {
    setValue("education_details", event.target.value);
  };

  return (
    <>
      <Head>
        <title>Edit Profile - {displayUser?.name || "User"}</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <ThikanaEnquiryForm
        openEnquiryModal={openEnquiryModal}
        setOpenEnquiryModal={setOpenEnquiryModal}
        options={options}
        handleChange={handleChange}
      />

      {isViewerOpen && (
        <div>
          <ImageViewer
            src={imageData}
            currentIndex={currentImage}
            disableScroll={true}
            onClose={closeImageViewer}
            backgroundStyle={{ backgroundOrigin: "inherit" }}
            leftArrowComponent={
              <KeyboardArrowLeftIcon className="text-[50px]" />
            }
            rightArrowComponent={
              <KeyboardArrowRightIcon className="text-[50px]" />
            }
          />
        </div>
      )}

      <div className="w-full">
        <Snackbar
          open={alert}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setAlert(false)}
        >
          <Alert icon={<ThumbUpAltIcon />} severity="success">
            {profileremove
              ? "Profile image removed successfully"
              : " Profile Updated Successfully !"}
          </Alert>
        </Snackbar>

        <div className="text-center py-4 mb-3 font-semibold text-xl bg-[#e5e7eb]">
          Edit My Profile
        </div>

        <div
          className="my-7 lg:px-10 px-4 flex items-center text-sky-800"
          onClick={() => router.push("/profile/profile-page")}
        >
          <ReplyIcon />
          <span className="font-semibold cursor-pointer ml-2">
            Back To Profile
          </span>
        </div>

        <div className="my-2 lg:px-10 px-4 lg:flex lg:gap-6 md:gap-4 md:flex items-center lg:items-start md:items-start">
          {/* image section */}
          <div className="lg:w-[400px]">
            <div className="w-full relative">
              <ImageUploading
                value={profileImage}
                onChange={handleImageChange}
                dataURLKey="data_url"
                className="lg:w-full h-[300px] w-full md:w-[200px] md:h-[300px]"
              >
                {({ imageList, onImageUpload }) => (
                  <div className="text-center">
                    <div onClick={onImageUpload}>
                      {isImageUpload ? (
                        <Image
                          src={imageList?.[0].data_url}
                          alt="asd"
                          height={100}
                          width={100}
                          className="lg:w-full h-[300px] w-full md:w-[200px] md:h-[300px] hover:opacity-30 cursor-pointer"
                        />
                      ) : profile_img_src ? (
                        <img
                          src={profile_img_src}
                          height={100}
                          width={100}
                          alt="img"
                          className="lg:w-full h-[300px] w-full md:w-[200px] md:h-[300px] hover:opacity-30 cursor-pointer"
                        />
                      ) : (
                        <Image
                          src={
                            displayUser?.gender === "Male" ? MenD : WomenD
                          }
                          height={100}
                          width={100}
                          alt="img"
                          className="lg:w-full h-[300px] w-full md:w-[200px] md:h-[300px] hover:opacity-30 cursor-pointer"
                        />
                      )}
                      {(!isImageUpload || !profile_img_src) && (
                        <div className="cursor-pointer font-semibold mt-2 text-center">
                          Click on Image to Upload Profile Picture
                        </div>
                      )}
                    </div>
                    {isImageUpload && (
                      <>
                        <div className="mt-2 flex md:block items-center gap-3 justify-center">
                          <button
                            onClick={handleImageUpload}
                            className="bg-primary text-white w-full rounded-md py-2 font-semibold"
                          >
                            {loading ? (
                              <CircularProgress size={20} color={"inherit"} />
                            ) : (
                              "Upload"
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </ImageUploading>
              {userData?.profile_img_src && (
                <div className="absolute -top-[6px] right-0">
                  <Tooltip title="Remove Profile Picture" arrow>
                    <button
                      className="flex font-semibold text-sm items-center justify-center bg-red-600 text-white h-[20px] w-[20px] rounded-full"
                      onClick={() => handleProfileremove()}
                    >
                      X
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* form section */}
          <div className="w-full mt-2 lg:mt-0 md:mt-0">
            {/* Basic Information */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium">
              <div className="p-2 bg-primary text-white font-semibold">
                Basic Information
              </div>
              <div className="p-4 leading-7">
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Full Name :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.fullName ?? "---"}
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Clan :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.caste?.name || displayUser?.caste || "---"}
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Date Of Birth :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.dob ?? "---"}
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Marital Status :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.mat_status ?? "---"}
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Mobile No :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.phone ?? "---"}
                  </div>
                </div>
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Email Address :</div>
                  <div className="md:w-2/3 w-1/2">
                    {displayUser?.email ?? "---"}
                  </div>
                </div>
              </div>
            </div>

            {displayUser?.pacakge_id !== null &&
              displayUser?.pacakge_id !== "" && (
                <div className="bg-white drop-shadow-lg md:w-4/5 w-full  text-[15px] font-medium my-4">
                  <div className="p-2 bg-primary flex justify-between items-center">
                    <div className="text-white font-semibold">
                      Package Details
                    </div>
                  </div>
                  <div className="flex p-4">
                    {displayUser?.plan_expire ? (
                      <div className="my-2 text-sm text-red-600 font-semibold">
                        Your plan has been expired.
                      </div>
                    ) : (
                      <>
                        <div className="md:w-1/3 w-1/2">
                          <div>Package Title : </div>
                          <div className="my-2">Package Duration : </div>
                          <div>Expiry Date : </div>
                          <div className="my-2">Profile View Count : </div>
                          <div>Profile Remaining View Count : </div>
                          <div className="my-2">
                            Profile View Count Comsumed :{" "}
                          </div>
                        </div>
                        <div>
                          <div>{displayUser?.package?.package_title}</div>
                          <div className="my-2">
                            {displayUser?.package?.package_duration} Days
                          </div>
                          <div>
                            {moment(displayUser?.pacakge_expiry).format(
                              "DD-MMMM-YYYY"
                            )}
                          </div>
                          <div className="my-2">
                            {displayUser?.package?.total_profile_view}
                          </div>
                          <div>{displayUser?.total_profile_view_count}</div>
                          <div className="my-2">
                            {displayUser?.profile_visit}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            {/* Social Religious Attributes */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full  text-[15px] font-medium my-4">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">
                    Social Religious Attributes
                  </div>
                  {socialEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setSocialEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setSocialEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setSocialEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex p-4">
                  <div className="md:w-1/3 w-1/2">
                    <div className="my-2">Gothra(m) :</div>
                    <div className="">Moonsign :</div>
                    <div className="my-2">Manglik :</div>
                    <div className="">Birth Country :</div>
                    <div className="my-2">Birth State :</div>
                    <div className="">Birth City :</div>
                    <div className="my-2">Time of Birth :</div>
                  </div>
                  {socialEdit ? (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        {" "}
                        {gothra ?? "--"}{" "}
                      </div>
                      <div className=""> {moon_sign ?? "--"} </div>
                      <div className="my-2">
                        {" "}
                        {manglik ?? "--"}{" "}
                      </div>
                      <div className="">
                        {displayUser?.birth_country_name || "--"}
                      </div>
                      <div className="my-2">
                        {displayUser?.birth_state_name || "--"}
                      </div>
                      <div className="">
                        {displayUser?.birth_city_name || "--"}
                      </div>
                      <div className="my-2">
                        {displayUser?.birth_time ?? "--"}
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        <input
                          name="gothra"
                          placeholder="Enter gothra"
                          className="md:w-52 px-3 border-2 rounded w-full text-sm font-medium"
                          defaultValue={gothra}
                          {...register("gothra")}
                        />
                      </div>

                      <div className="">
                        <select
                          name="moon_sign"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("moon_sign")}
                        >
                          <option value={moon_sign ?? ""} hidden>
                            {moon_sign ?? "Select Moonsign"}
                          </option>
                          {options?.options_type?.moonsigns?.map(
                            (item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="manglik"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("manglik")}
                        >
                          <option value={manglik ?? ""} hidden>
                            {manglik ?? "Select Manglik"}
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="birth_country"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("birth_country")}
                          onChange={handleCountryChange}
                        >
                          <option value={birthCountry?.id ?? ""} hidden>
                            {birthCountry?.name || "Select Birth Country"}
                          </option>
                          {options?.country?.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="birth_state"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("birth_state")}
                          onChange={handleStateChange}
                        >
                          <option value={birthState?.id ?? ""} hidden>
                            {birthState?.name || "Select Birth State"}
                          </option>
                          {stateOptions?.length > 0 ? (
                            stateOptions?.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.name}
                              </option>
                            ))
                          ) : (
                            <option value={""} disabled>
                              No State Found
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="birth_city"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("birth_city")}
                        >
                          <option value={birthCity?.id || ""} hidden>
                            {birthCity?.name || "Select Birth City"}
                          </option>
                          {citiesOptions?.length > 0 ? (
                            citiesOptions?.map((item, index) => {
                              return (
                                <option value={item.id} key={index}>
                                  {item.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value={""} disabled>
                              No City Found
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <input
                          name="birth_time"
                          // type="time"
                          type="text"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("birth_time")}
                          defaultValue={birth_time}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Location */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full  text-[15px] font-medium my-4">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">Location</div>
                  {thikanaEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setThikanaEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setThikanaEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setThikanaEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex p-4">
                  <div className="md:w-1/3 w-1/2">
                    <div className="my-2">State :</div>
                    <div className="">City :</div>
                    <div className="my-2">Block :</div>
                    <div className="">Thikana :</div>
                  </div>
                  {thikanaEdit ? (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        {displayUser?.thikana_state_name || "--"}
                      </div>
                      <div className="">
                        {displayUser?.thikana_city_name || "--"}
                      </div>
                      <div className="my-2">
                        {displayUser?.thikana_area_name || "--"}
                      </div>
                      <div className="">
                        {displayUser?.thikhana_name || "--"}
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        <select
                          name="thikana_state"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("thikana_state")}
                          onChange={handleStateChange}
                        >
                          <option value={thikanaState?.id ?? ""} hidden>
                            {thikanaState?.name || "Select State"}
                          </option>
                          {options?.state?.map((item, index) => {
                            return (
                              <option value={item?.id} key={index}>
                                {item?.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="thikana_city"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("thikana_city")}
                          onChange={handleCityChange}
                        >
                          <option value={thikanaCity?.id ?? ""} hidden>
                            {thikanaCity?.name || "Select City"}
                          </option>
                          {citiesOptions?.length > 0 ? (
                            citiesOptions?.map((item, index) => {
                              return (
                                <option value={item?.id} key={index}>
                                  {item?.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              No City Found
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="thikana_area"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("thikana_area")}
                          onChange={handleAreaChange}
                        >
                          <option value={thikanaArea?.id ?? ""} hidden>
                            {thikanaArea?.name || "Select Block"}
                          </option>
                          {areaOptions?.length > 0 ? (
                            areaOptions?.map((item, index) => {
                              return (
                                <option value={item?.id} key={index}>
                                  {item?.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              No Block Found
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="thikhana_id"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("thikhana_id")}
                        >
                          <option value={displayUser?.thikhana_id ?? ""} hidden>
                            {displayUser?.thikhana_name || "Select Thikana"}
                          </option>
                          {thikanaOptions?.length > 0 ? (
                            thikanaOptions?.map((item, index) => {
                              return (
                                <option value={item?.id} key={index}>
                                  {item?.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              No Thikana Found
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Education and Occupation */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">
                    Education and Occupation
                  </div>
                  {educationEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setEducationEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setEducationEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setEducationEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 flex">
                  <div className="md:w-1/3 w-1/2">
                    <div className="my-2">Education :</div>
                    <div className="my-2">Education Detail :</div>
                    <div>Annual Income :</div>
                    <div className="my-2">Occupation :</div>
                    <div className="my-2">Occupation Detail :</div>
                    <div>Employed in :</div>
                    <div className="my-2">Country :</div>
                    <div>State :</div>
                    <div className="my-2">City :</div>
                  </div>
                  {educationEdit ? (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        {displayUser?.educations ?? "--"}{" "}
                      </div>
                      <div className="my-2 block md:hidden">
                        {displayUser?.education_details?.length > 17
                          ? displayUser?.education_details.substring(0, 18)
                          : displayUser?.education_details ?? "--"}{" "}
                      </div>
                      <div className="my-2 md:block hidden">
                        {displayUser?.education_details ?? "--"}{" "}
                      </div>
                      <div className="block md:hidden">
                        {" "}
                        {displayUser?.annual_income?.length > 17
                          ? displayUser?.annual_income.substring(0, 18)
                          : displayUser?.annual_income ?? "--"}{" "}
                      </div>
                      <div className="md:block hidden">
                        {" "}
                        {displayUser?.annual_income ?? "--"}{" "}
                      </div>
                      <div className="my-2">
                        {displayUser?.occupation ?? "--"}{" "}
                      </div>
                      <div className="my-2 block md:hidden">
                        {displayUser?.occupation_details?.length > 17
                          ? displayUser?.occupation_details.substring(0, 18)
                          : displayUser?.occupation_details ?? "--"}{" "}
                      </div>
                      <div className="my-2 md:block hidden">
                        {displayUser?.occupation_details ?? "--"}{" "}
                      </div>
                      <div> {displayUser?.employeed_in ?? "--"} </div>
                      <div className="my-2">
                        {displayUser?.ed_country_name || "--"}
                      </div>
                      <div> {displayUser?.ed_state_name || "--"} </div>
                      <div className="my-2">
                        {displayUser?.ed_city_name || "--"}
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        <select
                          name="educations"
                          className="md:w-52 w-full px-3 border-2 rounded text-sm font-medium"
                          {...register("educations")}
                        >
                          <option value={educations ?? ""} hidden>
                            {educations ?? "Select Education"}
                          </option>
                          {options?.options_type?.education?.map(
                            (item, index) => {
                              return (
                                <option value={item ?? ""} key={index}>
                                  {item ?? "Select Education"}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <input
                          type="text"
                          className="border-2 md:w-52 w-full rounded px-2"
                          onChange={educationDetailsChange}
                          name="education_details"
                          defaultValue={education_details ?? ""}
                          {...register("education_details")}
                          placeholder="Education Detail"
                        />
                      </div>

                      <div className="my-2">
                        <select
                          name="annual_income"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("annual_income")}
                        >
                          <option value={annual_income ?? ""} hidden>
                            {annual_income ?? "Select Annual Income"}
                          </option>
                          {options?.options_type?.Income?.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="occupation"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("occupation")}
                        >
                          <option value={occupation ?? ""} hidden>
                            {occupation ?? "Select Occupation"}
                          </option>
                          {options?.options_type?.occupation?.map(
                            (item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <input
                          type="text"
                          className="border-2 md:w-52 w-full rounded px-2"
                          onChange={occupationDetailChange}
                          name="occupation_details"
                          defaultValue={occupation_details ?? ""}
                          {...register("occupation_details")}
                          placeholder="Occupation Detail"
                        />
                      </div>

                      <div className="my-2">
                        <select
                          name="employeed_in"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("employeed_in")}
                        >
                          <option value={employeed_in ?? ""} hidden>
                            {employeed_in ?? "Select Employment"}
                          </option>
                          <option value="Private">Private</option>
                          <option value="Goverment">Goverment</option>
                          <option value="Studying">Studying</option>
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="ed_country"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("ed_country")}
                          onChange={handleCountryChange}
                        >
                          <option value={birthCountry?.id ?? ""} hidden>
                            {birthCountry?.name || "Select Country"}
                          </option>
                          {options?.country?.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="ed_state"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("ed_state")}
                          onChange={handleStateChange}
                        >
                          <option value={birthState?.id} hidden>
                            {birthState?.name || "Select State"}
                          </option>
                          {stateOptions?.length > 0 ? (
                            stateOptions?.map((item, index) => {
                              return (
                                <option value={item?.id} key={index}>
                                  {item?.name}
                                </option>
                              );
                            })
                          ) : (
                            <option value="" disabled>
                              No State Found
                            </option>
                          )}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="ed_city"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("ed_city")}
                        >
                          <option value={birthCity?.id ?? ""} hidden>
                            {birthCity?.name || "Select City"}
                          </option>
                          {citiesOptions?.length > 0 ? (
                            citiesOptions?.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No City Found
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Physical Attributes */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium my-4">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">
                    Physical Attributes
                  </div>
                  {physicalEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setPhysicalEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setPhysicalEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setPhysicalEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 flex">
                  <div className="md:w-1/3 w-1/2">
                    <div className="my-2">Height :</div>
                    <div className="">Diet :</div>
                    <div className="my-2">Smoke :</div>
                    <div className="">Drink :</div>
                  </div>
                  {physicalEdit ? (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        {" "}
                        {displayUser?.height ?? "--"}{" "}
                      </div>
                      <div className=""> {displayUser?.diet ?? "--"} </div>
                      <div className="my-2"> {displayUser?.smoke ?? "--"} </div>
                      <div className=""> {displayUser?.drink ?? "--"} </div>
                    </div>
                  ) : (
                    <div className="md:w-2/3 w-1/2">
                      <div className="my-2">
                        <select
                          name="height"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("height")}
                        >
                          <option value={height ?? ""} hidden>
                            {height ?? "Select Height"}
                          </option>
                          {options?.options_type?.height?.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="diet"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("diet")}
                        >
                          <option value={diet ?? ""} hidden>
                            {diet ?? "Select Diet"}
                          </option>
                          {options?.options_type?.Diet?.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="smoke"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("smoke")}
                        >
                          <option value={smoke ?? ""} hidden>
                            {smoke ?? "Do You Smoke?"}
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Occasionally">Occasionally</option>
                        </select>
                      </div>

                      <div className="">
                        <select
                          name="drink"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("drink")}
                        >
                          <option value={drink ?? ""} hidden>
                            {drink ?? "Do You Drink?"}
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Occasionally">Occasionally</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Family Details */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium mb-4">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">Family Details</div>
                  {familyDetailEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setFamilyDetailEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setFamilyDetailEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setFamilyDetailEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex p-4">
                  <div className="md:w-1/3 w-1/2">
                    <div className="">No of Brothers :</div>
                    <div className="my-2">No of Sisters :</div>
                    <div className="">Father Contact :</div>
                    <div className="my-2">Father Occupation :</div>
                    <div className="">Mother Contact :</div>
                    <div className="my-2">Mother Occupation :</div>
                    <div className="my-2">Mother Clan :</div>
                  </div>
                  {familyDetailEdit ? (
                    <div className="md:w-2/3 w-1/2">
                      <div className="">
                        {" "}
                        {displayUser?.no_of_brothers ?? "--"}{" "}
                      </div>
                      <div className="my-2">
                        {" "}
                        {displayUser?.no_of_sisters ?? "--"}{" "}
                      </div>
                      <div className="my-2">
                        {displayUser?.father_contact_no ?? "--"}
                      </div>
                      <div className="">
                        {displayUser?.father_occupation ?? "--"}
                      </div>
                      <div className="my-2">
                        {displayUser?.mother_contact_no ?? "--"}
                      </div>
                      <div className="">
                        {displayUser?.mother_occupation ?? "--"}
                      </div>
                      <div className="my-2">
                        {displayUser?.mother_caste?.name || displayUser?.mother_caste || "--"}
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-2/3 w-1/2">
                      <div className="">
                        <select
                          name="no_of_brothers"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("no_of_brothers")}
                        >
                          <option value={no_of_brothers ?? ""} hidden>
                            {no_of_brothers ?? "Select Number of Brothers"}
                          </option>
                          <option value="None">None</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="Above 5">Above 5</option>
                        </select>
                      </div>

                      <div className="my-2">
                        <select
                          name="no_of_sisters"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("no_of_sisters")}
                        >
                          <option value={no_of_sisters ?? ""} hidden>
                            {no_of_sisters ?? "Select Number of Sisters"}
                          </option>
                          <option value="None">None</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="Above 5">Above 5</option>
                        </select>
                      </div>

                      <div className="my-2">
                        <input
                          name="father_contact_no"
                          type="number"
                          pattern="[0-9]*"
                          maxLength="10"
                          placeholder="Father's contact"
                          className="md:w-52 px-3 border-2 rounded w-full text-sm font-medium"
                          defaultValue={father_contact_no ?? ""}
                          {...register("father_contact_no")}
                          onChange={onFatherPhoneNumberChange}
                        />
                      </div>

                      <div className="">
                        <select
                          name="father_occupation"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("father_occupation")}
                        >
                          <option value={father_occupation ?? ""} hidden>
                            {father_occupation ?? "Select Father Occupation"}
                          </option>
                          <option value="Not Alive">Not Alive</option>
                          <option value="Retired">Retired</option>
                          <option value="Working">Working</option>
                        </select>
                      </div>

                      <div className="my-2">
                        <input
                          name="mother_contact_no"
                          type="number"
                          placeholder="Mother contact"
                          className="md:w-52 px-3 border-2 rounded w-full text-sm font-medium"
                          defaultValue={mother_contact_no ?? ""}
                          {...register("mother_contact_no")}
                          onChange={onMotherPhoneNumberChange}
                        />
                      </div>

                      <div className="">
                        <select
                          name="mother_occupation"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("mother_occupation")}
                        >
                          <option value={mother_occupation ?? ""} hidden>
                            {mother_occupation ?? "Select Mother Occupation"}
                          </option>
                          <option value="Not Alive">Not Alive</option>
                          <option value="House Wife">House Wife</option>
                          <option value="Retired">Retired</option>
                          <option value="Working">Working</option>
                        </select>
                      </div>

                      <div className="mt-2">
                        <select
                          name="mother_caste"
                          className="md:w-52 w-full border border-gray-300 rounded px-2 text-sm font-medium"
                          {...register("mother_caste")}
                        >
                          <option value={mother_caste?.id || ""} hidden>
                            {mother_caste?.name || "Select Mother Clan"}
                          </option>
                          {options?.caste?.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium mb-4">
              <div className="p-2 bg-primary flex justify-between items-center">
                <div className="text-white font-semibold">Privacy Settings</div>
                {privacySettingsEdit ? (
                  <div
                    className="flex text-white cursor-pointer"
                    onClick={() => setPrivacySettingsEdit(false)}
                  >
                    <div className="text-white font-semibold pr-1">Edit</div>
                    <AiFillEdit size={19} />
                  </div>
                ) : (
                  <div className="flex">
                    <div
                      className="text-white font-semibold pr-1 cursor-pointer"
                      onClick={() => setPrivacySettingsEdit(true)}
                    >
                      Cancel
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex">
                  <div className="md:w-1/3 w-1/2">Photo Privacy</div>
                  {!privacySettingsEdit ? (
                    <div>
                      <label className="flex">
                        <input
                          name="photo_privacy"
                          type="radio"
                          className="outline-none"
                          checked={photoPrivacy === "Yes" ? true : false}
                          onChange={(e) =>
                            handleUpdatePrivacySettings("photo", "Yes")
                          }
                        />
                        <div className="ml-2 font-medium text-gray-700">
                          Show to all members.
                        </div>
                      </label>
                      <label className="flex">
                        <input
                          name="photo_privacy"
                          type="radio"
                          className="outline-none"
                          checked={photoPrivacy === "No" ? true : false}
                          onChange={(e) =>
                            handleUpdatePrivacySettings("photo", "No")
                          }
                        />
                        <div className="ml-2 font-medium text-gray-700">
                          Show to only whom I express interest and express
                          interest request accepted.
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div>
                      {photoPrivacy == "Yes"
                        ? "Show to all members."
                        : "Show to only whom I express interest and express interest request accepted."}
                    </div>
                  )}
                </div>
                <div className="flex mt-2">
                  <div className="md:w-1/3 w-1/2">Contact Privacy</div>
                  {!privacySettingsEdit ? (
                    <div>
                      <label className="flex">
                        <input
                          name="contact_privacy"
                          type="radio"
                          className="outline-none"
                          checked={contactPrivacy === "Yes" ? true : false}
                          value={contactPrivacy}
                          onChange={(e) =>
                            handleUpdatePrivacySettings("contact", "Yes")
                          }
                        />
                        <div className="ml-2 font-medium text-gray-700">
                          Show to all members. (Only Premium Users)
                        </div>
                      </label>
                      <label className="flex">
                        <input
                          name="contact_privacy"
                          type="radio"
                          className="outline-none"
                          checked={contactPrivacy === "No" ? true : false}
                          value={contactPrivacy}
                          onChange={(e) =>
                            handleUpdatePrivacySettings("contact", "No")
                          }
                        />
                        <div className="ml-2 font-medium text-gray-700">
                          Show to only whom I express interest and express
                          interest request accepted.
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div>
                      {contactPrivacy == "Yes"
                        ? "Show to all members."
                        : "Show to only whom I express interest and express interest request accepted."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About yourself */}
            <div className="bg-white drop-shadow-lg md:w-4/5 w-full text-[15px] font-medium mb-4">
              <form onSubmit={handleSubmit(handleEdit)}>
                <div className="p-2 bg-primary flex justify-between items-center">
                  <div className="text-white font-semibold">About Family</div>
                  {aboutEdit ? (
                    <div
                      className="flex text-white cursor-pointer"
                      onClick={() => setAboutEdit(false)}
                    >
                      <div className="text-white font-semibold pr-1">Edit</div>
                      <AiFillEdit size={19} />
                    </div>
                  ) : (
                    <div className="flex">
                      <div
                        className="flex text-white cursor-pointer"
                        onClick={() => setSocialEdit(false)}
                      >
                        <FaEdit size={19} />
                        <button
                          className="text-white font-semibold pl-1 pr-5"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                      <div
                        className="text-white font-semibold pr-1 cursor-pointer"
                        onClick={() => setAboutEdit(true)}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex">
                    <div className="md:w-1/3 w-1/2">About Family</div>
                    {!aboutEdit ? (
                      <div className="w-full">
                        <textarea
                          name="about_yourself"
                          rows="4"
                          placeholder="About yourself"
                          className="border-2 outline-none w-full p-2"
                          defaultValue={about_yourself}
                          {...register("about_yourself")}
                        />
                      </div>
                    ) : (
                      <div className="max-w-[50%]">
                        {displayUser?.about_yourself || "--"}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <PartnerPreferences
              fetchProfile={getUserPorofileData}
              data={displayUser?.partner_preferences || userData?.partner_preferences}
            />

            <div className="mt-4">
              <div className="mt-5">
                <div className="font-medium text-[20px]">
                  <CollectionsOutlinedIcon /> Album
                </div>
                {userData?.album_images?.length > 0 ? (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {userData?.album_images.map((item, index) => (
                      <div key={item.id} className="relative">
                        <img
                          key={item.id}
                          src={item.album_img_src}
                          alt="album"
                          className="h-[100px] w-[100px] hover:opacity-70 cursor-pointer rounded-md"
                          onClick={() => openImageViewer(index)}
                        />
                        <div className="absolute -top-[6px] right-0">
                          <Tooltip title="Remove" arrow>
                            <button
                              className="flex font-semibold text-sm items-center justify-center bg-red-600 text-white h-[20px] w-[20px] rounded-full"
                              onClick={() => handleDeleteAlbumImage(item.id)}
                            >
                              X
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 font-medium text-gray-700">
                    You have not uploaded any photos in your Album yet, to
                    upload photos choose your pictures.
                  </div>
                )}
                {userData?.album_images?.length < 10 && (
                  <div className="mt-2">
                    <ImageUploading
                      multiple
                      value={images}
                      onChange={handleAlbumImageChange}
                      dataURLKey="data_url"
                    >
                      {({ imageList, onImageUpload, onImageRemove }) => (
                        <div className="mt-5">
                          <button
                            className="font-semibold bg-primary w-[80px] text-gray-50 text-sm h-[30px]"
                            onClick={onImageUpload}
                          >
                            Choose
                          </button>
                          {imageList?.length > 0 && (
                            <>
                              <button
                                className="ml-1 font-semibold bg-green-800 w-[80px] text-gray-50 text-sm h-[30px]"
                                onClick={() => handleAlbumUpload(imageList)}
                              >
                                {loading ? (
                                  <CircularProgress
                                    size={12}
                                    color={"inherit"}
                                  />
                                ) : (
                                  "Upload"
                                )}
                              </button>
                              <div className="mt-3 font-medium text-gray-500">
                                (Note : You can just add 10 photos only in your
                                Album)
                              </div>
                            </>
                          )}
                          <div className="flex gap-10 mt-5 flex-wrap">
                            {imageList?.map((image, index) => (
                              <div key={index} className="image-item">
                                <div className="relative">
                                  <img
                                    src={image["data_url"]}
                                    alt=""
                                    className="w-[150px] h-[150px]"
                                  />
                                  <div className="absolute -top-[6px] right-0">
                                    <button
                                      className="bg-red-600 text-white text-sm font-semibold h-6 w-6 rounded-full"
                                      onClick={() => onImageRemove(index)}
                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
