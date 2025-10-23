import Image from "next/image";
import PageContainer from "../../components/PageContainer";
import { FiUsers } from "react-icons/fi";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { AiOutlineLock } from "react-icons/ai";

const data = [
  { icon: FiUsers, title: "Best Matches" },
  { icon: MdOutlineVerifiedUser, title: "Verified Profiles" },
  { icon: AiOutlineLock, title: "100% Privacy" },
];

const DownloadOurApp = () => {
  return (
    <div className="relative bg-secondary overflow-visible py-10 sm:py-16">
      <PageContainer>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 min-h-[500px] relative">
          <div className="relative z-10 max-w-[600px] text-center lg:text-left">
            <div className="font-bold text-2xl text-primary">
              Download Our App
            </div>

            <div className="my-3 font-bold font-playfair text-4xl sm:text-5xl">
              Love in Your Pocket
            </div>

            <div className="text-gray-500 text-xl sm:text-2xl font-medium leading-snug">
              Find matches anytime, anywhere — faster{" "}
              <br className="hidden sm:block" /> and easier on mobile.
            </div>

            <div className="flex justify-center lg:justify-start flex-wrap gap-3 mt-6">
              <Image
                src="/images/playstore.png"
                alt="Play Store"
                height={400}
                width={600}
                className="object-cover w-[130px] sm:w-[150px]"
              />
              <Image
                src="/images/appstore.png"
                alt="App Store"
                height={400}
                width={600}
                className="object-cover w-[130px] sm:w-[150px]"
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 border-t-2 border-b-2 py-5">
              {data.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-500"
                  >
                    <Icon className="h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] border border-gray-500 p-2 rounded-full" />
                    <div className="font-medium text-sm sm:text-base">
                      {item.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
      <div className="absolute sm:block hidden right-0 bottom-0">
        <Image
          src="/images/download-our-app.png"
          alt="App Preview"
          height={600}
          width={600}
          className="object-contain w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px]"
        />
      </div>
    </div>
  );
};

export default DownloadOurApp;
