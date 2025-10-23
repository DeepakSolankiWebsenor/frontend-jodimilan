import React from "react";
import { FaGlobeAsia, FaLock, FaEdit, FaUsers } from "react-icons/fa";

function WhyUs() {
  return (
    <>
      <section
        className="text-gray-600 body-font"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <div className="container md:px-24 px-4 py-10 mx-auto">
          <div className="flex flex-col text-center w-full mb-10">
            <div className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              {" "}
              Why <span className="text-primary">MyShaadi</span> .com?
            </div>
          </div>
          <div className="flex flex-wrap text-center">
            <div className="p-4 lg:w-1/4  sm:w-1/2 w-full rounded-xl whyUsBox">
              <div className="p-4 overflow-hidden">
                <FaGlobeAsia className="text-6xl mx-auto mb-4 text-primary hover:text-white whyUsBoxText " />
                <div className="title-font font-medium text-lg text-gray-900 mb-2 whyUsBoxText ">
                  Global set of Profiles
                </div>
                <div className="text-sm whyUsBoxText ">
                  We have global set of profiles.
                </div>
              </div>
            </div>
            <div className="p-4 lg:w-1/4  sm:w-1/2  w-full whyUsBox rounded-xl">
              <div className="p-4">
                <FaLock className="text-6xl mx-auto mb-4 text-primary whyUsBoxText" />
                <div className="title-font font-medium text-lg text-gray-900 mb-2 whyUsBoxText">
                  Privacy Features
                </div>
                <div className="text-sm whyUsBoxText">
                  Members can set privacy settings and control over who can see their pictures and contact details.
                </div>
              </div>
            </div>
            <div className="p-4 lg:w-1/4  sm:w-1/2  w-full whyUsBox rounded-xl">
              <div className="p-4">
                <FaEdit className="text-6xl mx-auto mb-4 text-primary whyUsBoxText" />
                <div className="title-font font-medium text-lg text-gray-900 mb-2 whyUsBoxText">
                  Free Registration
                </div>
                <div className="text-sm whyUsBoxText">
                  We provide free registration to all our members. You can opt to take membership only once you find suitable options.
                </div>
              </div>
            </div>
            <div className="p-4 lg:w-1/4  sm:w-1/2  w-full whyUsBox rounded-xl">
              <div className="p-4">
                <FaUsers className="text-6xl mx-auto mb-4 text-primary whyUsBoxText" />
                <div className="title-font font-medium text-lg text-gray-900 mb-2 whyUsBoxText">
                  Only Rajputana
                </div>
                <div className="text-sm whyUsBoxText">
                   Myshaadi.com  allows only people from Rajput community exclusively.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyUs;
