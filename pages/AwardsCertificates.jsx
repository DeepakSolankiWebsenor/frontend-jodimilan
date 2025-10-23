import React from 'react';
import Slider from "react-slick";
import Image from "next/image";

function AwardsCertificates() {

    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
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
            {/* Award & Certifications */}
            < section >
                <div className='md:px-24 px-4 py-10'>
                    <div className='text-3xl font-semibold text-center mb-4'>Awards &
                        <span className='text-[#b10a02]'> Certification</span>
                    </div>
                    <Slider {...settings}>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Padma Ratna Award - 2021</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Time Branch Icon Award - 2020</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Padma Ratna Award - 2021</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Time Branch Icon Award - 2020</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Padma Ratna Award - 2021</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className='w-full h-auto mx-auto'>
                                <Image src="/award/award2.jpg" alt="" width={200} height={100} style={{ width: "100%", height: "300px", objectFit: "cover" }} className="mx-auto" />
                                <div className='bg-slate-100 p-2'>
                                    <div className='text-center'>
                                        <div className="font-semibold text-xl">Time Branch Icon Award - 2020</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </section >
        </>
    );
}

export default AwardsCertificates;