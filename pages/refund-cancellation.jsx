import React, { useState, useEffect } from "react";
import HeaderTwo from "./HeaderTwo";
import useApiService from "../services/ApiService";
import parse from "html-react-parser";
import Head from "next/head";

const RefundCancellation = () => {
  const [data, setData] = useState(null);
  const { cms } = useApiService();

  useEffect(() => {
    cms("refund")
      .then((res) => {
        if (res.data?.code === 200) {
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
        <title>{data?.title || "Refund and Cancellation"} - MyShaadi</title>
        <meta
          name="description"
          content="Refund and Cancellation Policy for MyShaadi Matrimonial Services."
        />
      </Head>
      <div className="w-full h-auto">
        <HeaderTwo />
        <div className="mt-12 text-center">
          {data?.cmsType && (
            <div className="text-4xl"> {data?.cmsType} </div>
          )}
          <div className="text-4xl mt-1">
            <span className="text-primary font-semibold">MyShaadi</span>
            <span className="text-primary">.com </span>
          </div>

          <div className="text-md text-gray-500 my-5 px-10 leading-7">
            {data?.description && <div>{parse(data?.description)}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundCancellation;
