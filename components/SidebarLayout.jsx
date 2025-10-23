import React from "react";
import Sidebar from "./Sidebar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="w-full lg:flex">
      {/* <Sidebar /> */}
      <div className="w-[100%] h-full">{children}</div>
    </div>
  );
};

export default SidebarLayout;
