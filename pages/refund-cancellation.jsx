import React from "react";
import HeaderTwo from "./HeaderTwo";
import useApiService from "../services/ApiService";
import { useState } from "react";
import { useEffect } from "react";
import parse from "html-react-parser";

const RefundCancellation = () => {
  const [data, setData] = useState([]);
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
    <div className="w-full h-auto">
    <HeaderTwo />
    <div className="mt-12 text-center">
        {data[0]?.cms_type && (
          <div className="text-4xl"> {data[0]?.cms_type} </div>
        )}
        <div className="text-4xl">
          <span className="text-primary">Myshaadi</span>
          <span className="text-primary">.com </span>
        </div>

        <div className="text-md text-gray-500 my-5 px-10">
          {data[0]?.description && <div>{parse(data[0]?.description)}</div>}
        </div>
      </div>
  </div>
  )
}

export default RefundCancellation
