import Head from "next/head";
import FindPerfectMatch from "./HomePages/FindPerfectMatch";
import HowItWorks from "./HomePages/HowItWorks";
import SuccessStory from "./HomePages/SuccessStory";
import FAQs from "./HomePages/FAQs";
import ExploreProfile from "./HomePages/ExploreProfile";
import DownloadOurApp from "./HomePages/DownloadOurApp";

export default function Home() {
  return (
    <div>
      <Head>
        <title>JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      <FindPerfectMatch />
      <HowItWorks />
      <SuccessStory />
      <FAQs />
      <ExploreProfile />
      <DownloadOurApp />
    </div>
  );
}