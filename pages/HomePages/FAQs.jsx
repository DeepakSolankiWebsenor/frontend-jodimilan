import { useState } from "react";
import PageContainer from "../../components/PageContainer";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PageContainer>
      <div className="pt-10 pb-5 text-center">
        <div className="font-bold font-playfair text-2xl sm:text-3xl md:text-4xl">
          Frequently Asked Questions
        </div>
        <div className="my-10 mx-auto grid gap-5">
          {data.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-secondary rounded py-4 px-5 border">
                <div
                  onClick={() => toggleFAQ(idx)}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <div className="font-semibold text-gray-800">
                    {item.title}
                  </div>
                  {isOpen ? (
                    <IoMdRemove className="text-gray-700 h-5 w-5" />
                  ) : (
                    <IoMdAdd className="text-gray-700 h-5 w-5" />
                  )}
                </div>
                <div
                  className={`overflow-hidden text-start transition-[max-height] duration-500 ease-in-out ${
                    isOpen ? "max-h-40 sm:max-h-60 mt-2" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-700 font-medium text-sm">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default FAQs;

const data = [
  {
    title: "Why is JodiMilan.com better compared to other matrimonial websites?",
    content:
      "JodiMilan focuses on quality over quantity: curated and verified profiles, advanced matchmaking filters, and personalized recommendations. Strong privacy controls and responsive customer support help ensure a safer, more efficient search for compatible matches.",
  },
  {
    title: "Is JodiMilan.com a trustworthy matchmaking platform?",
    content:
      "Yes — we use profile verification, manual moderation, secure payment processing, and clear privacy policies to protect members. User reports and a dedicated support team help maintain a trustworthy community.",
  },
  {
    title: "What is the difference between free membership vs paid membership?",
    content:
      "Free membership lets you create a profile, browse and save matches with limited contact options. Paid plans unlock direct messaging, full contact details, advanced search filters, and higher visibility to other members.",
  },
  {
    title: "What additional benefits do I get as a Premium Member?",
    content:
      "Premium members get priority visibility, unlimited messaging, access to phone/email (where permitted), advanced matchmaking filters, profile boosts, and faster support — all designed to accelerate meaningful connections.",
  },
  {
    title: "How can I contact other members on JodiMilan.com?",
    content:
      "You can send interest or direct messages through the platform. Some members may allow phone or email exchange after mutual consent or via paid plans. Always follow safety guidelines: verify profiles, avoid sharing sensitive info, and use the platform’s reporting tools if needed.",
  },
];
