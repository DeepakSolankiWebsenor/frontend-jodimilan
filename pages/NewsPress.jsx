import React from 'react';
import Slider from "react-slick";
import Image from "next/image";

function NewsPress() {

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
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            {/* News & Press */}
            < section >
                <div className='md:px-60 px-4 py-10'>
                    <div className='text-3xl font-semibold text-center mb-4'>News &
                        <span className='text-[#b10a02]'> Press</span>
                    </div>
                    <Slider {...settings}>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news1.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news1.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news1.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/news/news2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                            </div>
                        </div>
                    </Slider>
                </div>
            </section >
        </>
    );
}

export default NewsPress;