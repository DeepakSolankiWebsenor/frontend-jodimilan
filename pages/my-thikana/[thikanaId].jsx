import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "../../public/logo/Logo.png";
import useApiService from "../../services/ApiService";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import parse from "html-react-parser";

const responsiveSettings = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
];

const carousel_settings = {
  mobileFirst: true,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: responsiveSettings,
};

const ThikanaDetail = () => {
  const router = useRouter();
  const { thikanaId } = router.query;
  const { getThikana } = useApiService();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (router.isReady && thikanaId) {
      getThikana(thikanaId)
        .then((res) => {
          if (res?.code === 200) {
            setData(res?.data);
            setMessage("");
          } else if (res.code == 404) {
            setMessage(res?.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [router.query]);

  console.log();

  return (
    <div className="min-h-[60vh] h-full">
      <Head>
        <title>Thikana Details</title>
      </Head>

      {message ? (
        <div className="my-5 px-10 text-center font-medium text-lg md:text-2xl text-gray-700">
          {message}
        </div>
      ) : (
        <div className="my-5 lg:px-32 md:px-20 px-10">
          <div className="text-center font-medium text-lg md:text-2xl text-gray-700">
            myshadi.com/{data?.name}
          </div>

          <div className="mt-6">
            <div className="h-[250px] md:h-[450px] lg:h-[600px] w-full">
              {data?.image_src ? (
                <img
                  src={data?.image_src}
                  alt=""
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <Image
                  src={Logo}
                  height={1200}
                  width={1200}
                  className="h-full w-full rounded-md border-2"
                />
              )}
            </div>

            <div className="mt-5">
              <div className="font-semibold text-center lg:text-2xl md:text-lg text-[#1585DB]">
                ~ About Thikana ~
              </div>
              <div
                className="font-medium mt-4"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              ></div>

              <div>
                <div className="uppercase font-semibold text-lg text-[#1585DB]">
                  History [इतिहास]
                </div>
                <div
                  className="mt-2 font-medium"
                  dangerouslySetInnerHTML={{ __html: data?.history }}
                ></div>
              </div>

              <div className="mt-4">
                <div className="uppercase font-semibold text-lg text-[#1585DB]">
                  Present Clan
                </div>
                <div
                  className="mt-2 font-medium"
                  dangerouslySetInnerHTML={{ __html: data?.present_clan }}
                ></div>
              </div>

              <div className="mt-4">
                <div className="uppercase font-semibold text-lg text-[#1585DB]">
                  Personality [शख़्सियत]
                </div>
                <div
                  className="mt-2 font-medium"
                  dangerouslySetInnerHTML={{ __html: data?.personality }}
                ></div>
              </div>

              {data?.thikhana_images?.length > 0 && (
                <div className="my-4 pb-5">
                  <div className="uppercase font-semibold text-lg text-[#1585DB]">
                    Photo Gallery [फ़ोटो]
                  </div>
                  <div className="slider-container">
                    <Slider {...carousel_settings}>
                      {data?.thikhana_images?.map((item, index) => {
                        return (
                          <div
                            className="min-w-[200px] w-[250px] h-[350px] px-4 outline-none mt-4"
                            key={index}
                          >
                            <img
                              src={item?.image_src}
                              className="h-full w-full object-cover rounded-md"
                              alt=""
                            />
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThikanaDetail;
