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
    title: "Why is MyShaadi.com better compared to other matrimonial websites?",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "Is MyShaadi.com a trustworthy matchmaking platform?",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "What is the difference between free membership vs paid membership?",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "What additional benefits do I get as a Premium Member?",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    title: "How can I contact other members on MyShaadi.com?",
    content:
      "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
];
