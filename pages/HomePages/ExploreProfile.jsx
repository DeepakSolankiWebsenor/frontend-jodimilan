import { useState } from "react";
import PageContainer from "../../components/PageContainer";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import Image from "next/image";

const data = [
  {
    title: "Community",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "City",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "Marital Status",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "State",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "Religion",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "Mother Tongue",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
];

const ExploreProfile = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
        <div className="pt-10 pb-5 text-center">
          <div className="font-bold font-playfair text-2xl sm:text-3xl md:text-4xl">
            Explore Matrimonial Profiles By
          </div>

          <div className="my-10 mx-auto grid sm:grid-cols-2 gap-5 max-w-5xl">
            {data.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border rounded-md shadow-sm py-3 px-5 relative transition-all duration-300 text-left"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">
                      {item.title}
                    </div>
                    {isOpen ? (
                      <IoMdRemove className="text-gray-700 h-5 w-5" />
                    ) : (
                      <IoMdAdd className="text-gray-700 h-5 w-5" />
                    )}
                  </button>

                  <div
                    className={`transition-all duration-500 overflow-hidden ${
                      isOpen
                        ? "mt-2 max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-700 text-sm font-medium">
                      {item.content}
                    </p>
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

export default ExploreProfile;
