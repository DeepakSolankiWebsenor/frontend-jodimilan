import Image from "next/image";
import PageContainer from "../../components/PageContainer";
import { FaEdit } from "react-icons/fa";
import { BiDonateHeart } from "react-icons/bi";
import { HiUsers } from "react-icons/hi2";

const data = [
  {
    icon: FaEdit,
    title: "Create your profile",
    desc: "Register for free & put up your Matrimony Profile",
  },
  {
    icon: BiDonateHeart,
    title: "Discover Matches",
    desc: "Browse verified profiles tailored to your interests, community, and lifestyle.",
  },
  {
    icon: HiUsers,
    title: "Connect & Begin Your Journey",
    desc: "Express interest, chat securely, and take the next step towards a meaningful relationship.",
  },
];

const HowItWorks = () => {
  return (
    <div className="relative">
      <Image
        src="/images/how-it-work-bg.png"
        alt="Left Background"
        width={300}
        height={300}
        className="-z-10 absolute left-0 top-1/2 -translate-y-1/2 w-16 sm:w-32 md:w-40 object-contain pointer-events-none"
      />
      <Image
        src="/images/how-it-work-bg-2.png"
        alt="Right Background"
        width={300}
        height={300}
        className="-z-10 absolute right-0 top-1/2 -translate-y-1/2 w-16 sm:w-32 md:w-40 object-contain pointer-events-none"
      />

      <PageContainer>
        <div className="pt-12 pb-5 text-center">
          <div className="font-bold font-playfair text-2xl sm:text-3xl md:text-4xl">
            How It Works
          </div>
          <div className="text-gray-500 mt-3 sm:mt-4 font-medium text-sm sm:text-base">
            Your Journey to finding love in 3 simple steps
          </div>

          <div className="my-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10">
            {data.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="w-full sm:w-[45%] md:w-[30%] bg-white p-6 sm:p-8 md:p-10 rounded-full border-2 border-primary text-center"
                >
                  <Icon className="text-primary h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
                  <div className="text-primary text-lg sm:text-xl font-bold mt-3 sm:mt-4">
                    {item.title}
                  </div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base mt-2">
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default HowItWorks;
