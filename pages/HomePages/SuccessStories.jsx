/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import useApiService from "../../services/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { SUCCESS_STORIES } from "../../services/redux/slices/userSlice";

var settings = {
  dots: true,
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

function SuccessStories() {
  const dispatch = useDispatch()
  const [data, setData] = useState([]);
  const { cms } = useApiService();
  const { success_stories } = useSelector((state) => state?.user);

  useEffect(() => {
    setData(success_stories)
  }, [success_stories]);

  return (
    <>
      {/* Success Stories */}
      <section>
        <div className="lg:px-24 md:px-14 px-4 pb-14">
          <div className="text-3xl font-medium text-center mb-4">
            Success <span className="text-[#aa0000]">Stories</span>
          </div>
          <Slider {...settings}>
            {data?.map((item, index) => (
              <div className="lg:p-4 py-4 px-2" key={index}>
                <div className="slider-image-container overflow-hidden rounded-lg">
                  <img
                    src={item?.bannerImageSrc}
                    alt="safd"
                    style={{
                      width: "100%",
                      height: "400px",
                    }}
                    className="rounded-lg"
                  />
                  <div className="content rounded-b-lg">
                    <div
                      className="text-2xl text-center"
                      style={{ fontFamily: "Pacifico" }}
                    >
                      {item?.title}
                    </div>
                    <div className="text-sm font-medium mt-2">
                      {item?.short_description}
                    </div>
                    <Link href="/success-story" legacyBehavior>
                      <a className="text-white font-medium text-sm">
                        Read more...
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}

export default SuccessStories;
