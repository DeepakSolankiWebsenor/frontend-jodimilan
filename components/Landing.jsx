/* eslint-disable @next/next/no-img-element */
import React from 'react';
import SuccessStories from '../pages/HomePages/SuccessStories';
import FindForm from '../pages/HomePages/FindForm';
import TopBanner from '../pages/HomePages/TopBanner';
import Statistic from '../pages/HomePages/Statistic';
import WhyUs from '../pages/HomePages/WhyUs';

function LandingPage() {

    return (
        <>
            <TopBanner />
            <WhyUs />
            <FindForm />
            {/* <AdsSection /> */}
            {/* <AwardsCertificates /> */}
            {/* <NewsPress /> */}
            {/* <Statistic />
            <SuccessStories /> */}
        </>
    );

}

export default LandingPage;