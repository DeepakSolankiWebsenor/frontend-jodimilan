import React, { useState } from 'react';
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';
import { FiUsers } from "react-icons/fi";
import { IoIosDoneAll } from "react-icons/io";
import { RiCommunityLine } from "react-icons/ri";
import { FaPlaceOfWorship } from "react-icons/fa";

function Statistic() {

    const [counterOn, setCounterOn] = useState(false);

    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="container lg:px-24 mx-px-14 px-4 py-10 mx-auto">
                    <div className="flex flex-col text-center w-full mb-10">
                        <div className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse <span className="text-primary">Reliac Heirloom</span></div>
                        <div className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven&apos;t heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</div>
                    </div>
                    <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
                        <div className="flex flex-wrap text-center" style={{ fontFamily: 'Josefin Sans' }}>
                            <div className="md:p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div className="border-2 border-primary px-4 py-6 rounded-lg counter-box">
                                    <FiUsers className="text-primary w-12 h-12 mb-3 inline-block counter-icon" />
                                    <div className="title-font font-medium text-3xl text-gray-900 counter-text">
                                        {counterOn && <CountUp start={0} end={27} duration={2} delay={0} />}
                                        K
                                    </div>
                                    <div className="counter-text font-semibold">Users</div>
                                </div>
                            </div>
                            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div className="border-2 border-primary px-4 py-6 rounded-lg counter-box">
                                    <IoIosDoneAll className="text-primary w-12 h-12 mb-3 inline-block counter-icon" />
                                    <div className="title-font font-medium text-3xl text-gray-900 counter-text">
                                        {counterOn && <CountUp start={0} end={13} duration={2} delay={0} />}
                                        K
                                    </div>
                                    <div className="counter-text font-semibold">Matches</div>
                                </div>
                            </div>
                            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div className="border-2 border-primary px-4 py-6 rounded-lg counter-box">
                                    <RiCommunityLine className="text-primary w-12 h-12 mb-3 inline-block counter-icon" />
                                    <div className="title-font font-medium text-3xl text-gray-900 counter-text">
                                        {counterOn && <CountUp start={0} end={74} duration={2} delay={0} />}
                                    </div>
                                    <div className="counter-text font-semibold">Communities</div>
                                </div>
                            </div>
                            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                                <div className="border-2 border-primary px-4 py-6 rounded-lg counter-box">
                                    <FaPlaceOfWorship className="text-primary w-12 h-12 mb-3 inline-block counter-icon" />
                                    <div className="title-font font-medium text-3xl text-gray-900 counter-text">
                                        {counterOn && <CountUp start={0} end={46} duration={2} delay={0} />}
                                    </div>
                                    <div className="counter-text font-semibold">Places</div>
                                </div>
                            </div>
                        </div>
                    </ScrollTrigger>
                </div>
            </section></>
    );
}

export default Statistic;