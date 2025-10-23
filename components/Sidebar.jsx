import React from "react";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import AppBlockingOutlinedIcon from "@mui/icons-material/AppBlockingOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import SwipeRightOutlinedIcon from "@mui/icons-material/SwipeRightOutlined";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      <div className="font-semibold text-gray-600 text-lg text-center mt-4 lg:hidden md:hidden block">
        INBOX
      </div>
      <div className="text-sm h-full md:text-base lg:text-base lg:w-[20%] lg:p-6 p-3 lg:min-h-[700px] lg:border-r md:border-r flex flex-wrap justify-center lg:block gap-2 py-6 border-b-2 lg:border-b-0 md:border-b-0 border-slate-300">
        <div className="font-semibold text-gray-600 text-lg hidden lg:block md:block">
          INBOX
        </div>
        {/* <div className="lg:mt-4">
          <Link
            href="/Request"
            className={`font-medium flex item-center text-center lg:text-left md:text-left hover:text-[#0f6aba] ${
              pathname === "/Request" && "text-[#0f6aba]"
            }`}
          >
            <div className="hidden lg:block md:block">
              <Diversity3OutlinedIcon className="mr-2" />
            </div>
            <div>Requests</div>
          </Link>
        </div> */}
        {/* <div className="lg:mt-6">
          <Link
            href="/acceptance"
            className={`font-medium flex item-center text-center lg:text-left md:text-left hover:text-[#0f6aba] ${
              pathname === "/acceptance" && "text-[#0f6aba]"
            }`}
          >
            <div className="hidden lg:block md:block">
              <SwipeRightOutlinedIcon className="mr-2" />
            </div>
            <div>Request Approved</div>
          </Link>
        </div> */}
        <div className="lg:mt-6">
          <Link
            href="/messages"
            className={`font-medium flex item-center text-center lg:text-left md:text-left hover:text-[#0f6aba] ${
              pathname === "/messages" && "text-[#0f6aba]"
            }`}
          >
            <div className="hidden lg:block md:block">
              <MarkEmailUnreadOutlinedIcon className="mr-2" />
            </div>
            <div>Messages</div>
          </Link>
        </div>
        {/* <div className="lg:mt-6">
          <Link
            href="/Blocked"
            className={`font-medium flex item-center text-center lg:text-left md:text-left hover:text-[#0f6aba] ${
              pathname === "/Blocked" && "text-[#0f6aba]"
            }`}
          >
            <div className="hidden lg:block md:block">
              <AppBlockingOutlinedIcon className="mr-2" />
            </div>
            <div>Blocked Members</div>
          </Link>
        </div> */}
        {/* <div className="lg:mt-6">
        <Link
          href="/Viewed"
          className={`font-medium text-center lg:text-left md:text-left hover:text-[#0f6aba] ${
            pathname === "/Viewed" && "text-[#0f6aba]"
          }`}
        >
          <PageviewOutlinedIcon className="mr-2" />
          Viewed Contacts
        </Link>
      </div> */}
      </div>
    </>
  );
};

export default Sidebar;
