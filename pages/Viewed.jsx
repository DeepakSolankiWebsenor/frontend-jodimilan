import Image from "next/image";
import React from "react";
import Avatar from "../public/images/avtar.png";
import SidebarLayout from "../components/SidebarLayout";

const Viewed = () => {
  return (
    <SidebarLayout>
      <div className="flex flex-col items-center mt-4 px-4">
        <div className="text-center mb-5">
          <div className="text-2xl font-medium text-[#0b4c85]">
            Viewed My Contacts 0
          </div>
          <div className="mt-2 text-gray-500 font-medium">
            People who viewed your contacts will appear here.
          </div>
        </div>

        {[...Array(2)].map((_, index) => (
          <>
            <div
              className="lg:w-full lg:h-[150px] md:h-[150px] lg:flex md:flex items-center justify-between"
              key={index}
            >
             <div className="flex md:items-center lg:items-center items-start gap-5">
              <div>
                <Image
                  src={Avatar}
                  height={150}
                  width={150}
                  alt="sf"
                  className="lg:h-[150px] md:h-[150px] w-[150px]"
                />
              </div>
              <div>
                <div className="text-gray-700 font-semibold text-lg">
                  Diwakar Vashisth
                </div>
                <div className="text-gray-600 font-medium mt-2">
                  27, 5, Bhopal, Ahirwar
                </div>
                <div className="text-gray-600 font-medium mt-2">
                  MBA/PGDM, Rs. 0 - 1 Lakh, Sr. Manager/ Manager, Never Married
                </div>
              </div>
            </div>
              <div className="md:block lg:block flex items-center gap-4 ml-4 justify-end">
                <div className="text-gray-600 font-medium">06-Jan-23</div>
                <button className="mt-2 bg-slate-700 text-white text-sm font-semibold px-4 py-1 rounded">
                  View Profile
                </button>
              </div>
            </div>
            <hr className="border-[1px solid] w-full my-3" />
          </>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default Viewed;
