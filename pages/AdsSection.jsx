/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Slider from "react-slick";

function AdsSection() {

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
    };

    return (
        <>
            {/* ADVERTISMENT */}
            <section>
                <Slider {...settings}>
                    <div>
                        {/* <Image src="/landingbanner/slider1.jpg" alt="" width={200} height={200} style={{ width: "80%" }} /> */}
                        <img src="/adsImages/AdsImage.jpg" alt="" width={200} height={200} style={{ width: "100%", height: "auto", margin: "auto" }} />
                    </div>
                </Slider>
            </section>
        </>
    );
}

export default AdsSection;