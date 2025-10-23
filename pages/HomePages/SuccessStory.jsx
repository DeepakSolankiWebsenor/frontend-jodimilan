import Image from "next/image";
import PageContainer from "../../components/PageContainer";

const data = [
  "/images/suc-story-1.png",
  "/images/suc-story-2.png",
  "/images/suc-story-3.png",
  "/images/suc-story-4.png",
];

const SuccessStory = () => {
  return (
    <PageContainer>
      <div className="pt-10 pb-5 text-center">
        <div className="font-bold font-playfair text-2xl sm:text-3xl md:text-4xl">
          Matrimony Service with Millions of Success Stories
        </div>

        <div className="my-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-10">
          {data.map((item, index) => (
            <div
              key={index}
              className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px]"
            >
              <Image
                height={300}
                width={300}
                alt={`success-story-${index + 1}`}
                src={item}
                className="w-full h-auto object-contain rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default SuccessStory;
