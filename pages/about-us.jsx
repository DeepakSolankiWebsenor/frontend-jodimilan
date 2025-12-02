import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import HeaderTwo from "./HeaderTwo";
import useApiService from "../services/ApiService";
import parse from "html-react-parser";
import Head from "next/head";

const About = () => {
  const [data, setData] = useState(null);
  const { cms } = useApiService();
  const dataFetchedRef = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    cms("about")
      .then((res) => {
        if (res?.data?.code === 200) {
          setData(res?.data?.data);
        }
      })
      .catch((error) => {
        console.log("CMS Error: ", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const cmsData = data?.[0];

  return (
    <>
      <Head>
        <title>About Us - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <div className="w-full h-auto">
        <HeaderTwo />

        <div className="mt-12 text-center px-6">
          {/* Title */}
          <div className="text-3xl md:text-4xl font-bold">
            {cmsData?.cms_type || "Loading..."}
          </div>

          {/* Brand Name */}
          <div className="text-3xl md:text-4xl mt-1">
            <span className="text-primary font-semibold">JodiMilan</span>
            <span className="text-primary">.com</span>
          </div>

          {/* Description */}
          <div className="text-md text-gray-600 mt-6 leading-7">
            {cmsData?.description ? (
              <div>{parse(cmsData?.description)}</div>
            ) : (
              <div>Loading content...</div>
            )}
          </div>

          {/* Other Static Fields */}
          <div className="text-lg mt-6 font-medium">
            <strong>Registered Name: </strong>Arush
          </div>

          <div className="text-lg mt-4 font-medium">
            <strong>Mobile Number: </strong>9772910309
          </div>

          {loading && (
            <div className="mt-6 text-gray-400 animate-pulse">
              Fetching data...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default About;
