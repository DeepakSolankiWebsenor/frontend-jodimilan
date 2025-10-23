import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Profile from "../public/images/profile.jpg";
import HeaderTwo from "./HeaderTwo";
import useApiService from "../services/ApiService";
import parse from "html-react-parser";
import Head from "next/head";

const About = () => {
  const [data, setData] = useState([]);
  const { cms } = useApiService();
  const dataFetchedRef = useRef(false);

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
        console.log(error);
      });
  }, []);

  return (
    <>
      <Head>
        <title>About Us - MyShaadi</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo/Logo.png" />
      </Head>

      <div className="w-full h-auto">
        <HeaderTwo />
        <div className="mt-12 text-center">
          <div className="text-4xl">{data[0]?.cms_type}</div>
          <div className="text-4xl">
            <span className="text-primary">Myshaadi</span>
            <span className="text-primary">.com </span>
          </div>

          <div className="text-md text-gray-500 mt-5 px-10">
            {data[0]?.description && <div>{parse(data[0]?.description)}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
