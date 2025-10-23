import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SidebarLayout from "../components/SidebarLayout";

const Inbox = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    }
  }, []);

  return (
    <div className="w-ful lg:flex">
      <SidebarLayout />
      <div className="w-[300px] text-gray-400"></div>
    </div>
  );
};

export default Inbox;
