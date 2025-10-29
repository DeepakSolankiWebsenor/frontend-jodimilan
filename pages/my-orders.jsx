import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CircularLoader from "../components/common-component/loader";
import PaginationControlled from "../components/common-component/pagination";
import useApiService from "../services/ApiService";

const MyOrders = () => {
  const router = useRouter();
  const { orderHistory } = useApiService();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const getOrderHistory = () => {
    orderHistory(page)
      .then((res) => {
        if (res.data.code === 200) {
          setData(res?.data?.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/Login");
    } else {
      getOrderHistory();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      getOrderHistory();
    }
  }, [page]);

  return (
    <div>
      <Head>
        <title>My Order</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>
      <div className="text-center lg:my-10 my-5 lg:text-4xl text-2xl px-3 text-[#333] font-medium">
        <span className="text-primary">My</span> Orders
      </div>

      <div className="flex justify-center mb-10 min-h-[30vh]">
        <div className="w-[300px] md:w-[600px] lg:w-[1200px]">
          {!loading ? (
            data?.data.length > 0 ? (
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Plan Name</TableCell>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Plan Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data?.map((item, index) => {
                      const { order_number, customer, status } = item || {};
                      return (
                        <TableRow hover key={index}>
                          <TableCell>
                            {order_number || "--"}
                          </TableCell>
                          <TableCell>
                            {item?.package?.package_title || "--"}
                          </TableCell>
                          <TableCell>
                            {moment(item?.created_at).format("DD-MM-YYYY") ||
                              "--"}
                          </TableCell>
                          <TableCell>
                            {moment(customer?.pacakge_expiry).format(
                              "DD-MM-YYYY"
                            ) || "--"}
                          </TableCell>
                          <TableCell> {status || "--"} </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className="font-semibold lg:text-[30px] text-lg text-gray-500 text-center">
                You have not any Order History.
              </div>
            )
          ) : (
            <div className="flex justify-center py-20">
              <CircularLoader />
            </div>
          )}
        </div>
      </div>
      {!loading && data?.data?.length > 0 && (
        <div className="flex justify-center">
          <PaginationControlled
            setPage={setPage}
            last_page={data?.last_page}
            page={page}
          />
        </div>
      )}
    </div>
  );
};

export default MyOrders;
