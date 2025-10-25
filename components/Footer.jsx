import Image from "next/image";
import Link from "next/link";
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { TbBrandTwitter } from "react-icons/tb";
import { RiYoutubeLine } from "react-icons/ri";
import { FiLinkedin } from "react-icons/fi";

const socials = [
  FiFacebook,
  FaInstagram,
  FiLinkedin,
  TbBrandTwitter,
  RiYoutubeLine,
];

function Footer() {
  return (
    <footer className="bg-primary text-white pt-10 sm:pt-20 px-5 sm:px-10 md:px-20 pb-5">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="grid gap-5 w-full md:w-1/4">
          <Image
            src="/images/logo-white.png"
            alt="Logo"
            height={400}
            width={600}
            className="object-cover w-[100px]"
          />
          <div className="text-sm sm:text-base">
            We are committed to helping individuals and <br /> families find the
            perfect life partner with trust, <br /> security, and care. With
            thousands of verified <br /> profiles and personalized matchmaking,
            your <br /> journey to lifelong happiness begins here.
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <Image
              src="/images/playstore.png"
              alt="Play Store"
              height={400}
              width={600}
              className="object-cover w-[130px] sm:w-[150px]"
            />
            <Image
              src="/images/appstore.png"
              alt="App Store"
              height={400}
              width={600}
              className="object-cover w-[130px] sm:w-[150px]"
            />
          </div>
        </div>

        <div className="grid gap-5 w-full sm:w-auto">
          <div className="font-bold text-lg">Company</div>
          <div className="grid gap-2 font-medium text-sm sm:text-base">
            <Link href="/about-us" legacyBehavior>
              About Us
            </Link>
            <Link href="/contact-us" legacyBehavior>
              Contact Us
            </Link>
          </div>
        </div>

        <div className="grid gap-5 w-full sm:w-auto">
          <div className="font-bold text-lg">Need Help?</div>
          <div className="grid gap-2 font-medium text-sm sm:text-base">
            <div>Member Login</div>
            <div>Sign Up</div>
          </div>
        </div>

        <div className="grid gap-5 w-full sm:w-auto">
          <div className="font-bold text-lg">Privacy & You</div>
          <div className="grid gap-2 font-medium text-sm sm:text-base">
            <Link href="/terms-and-conditions" legacyBehavior>
              Terms and Conditions
            </Link>
            <Link href="/privacy-policy" legacyBehavior>
              Privacy Policy
            </Link>
            <Link href="/refund-cancellation" legacyBehavior>
              Refund & Cancellation
            </Link>
          </div>
        </div>

        <div className="grid gap-5 w-full sm:w-auto">
          <div className="font-bold text-lg">Find us on:</div>
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map((Icon, i) => (
              <Icon
                key={i}
                className="text-white h-[20px] w-[20px] min-w-[20px]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm sm:text-base leading-relaxed">
        MyShaadi.com, India’s No.1 Matchmaking and Matrimony Service*, was
        founded with a simple objective - to help people find happiness.
        Shaadi.com is a leader in what is sometimes known as the matrimony
        category, we have touched more than 50 million lives.
        <br />
        <br />
        MyShaadi.com - a trusted matrimonial & matchmaking service, has always
        differentiated itself from other matrimonials through its innovation-led
        approach by redefining the way Indian brides and grooms meet for
        marriage.
        <br />
        <br />
        We have also created trusted and renowned community-specific matrimony
        platforms such as TamilShaadi.com, TeluguShaadi.com,
        MalayaleeShaadi.com, KannadaShaadi.com, BengaliShaadi.com,
        GujaratiShaadi.com, MarathiShaadi.com, PunjabiShaadi.com, and more that
        have changed the way of finding a life partner.
        <br />
        <br />
        MyShaadi.com (sometimes mis-spelled as MyShadi.com, MyShadhi.com, or
        MySadi.com) is a social networking site specializing in matchmaking and
        not just a matrimonial service.
        <br />
        <br />* Based on the number of downloads in the last 12 months of the
        MyShaadi.com App – as reported by AppTweak.
      </div>

      <div className="mt-10 border-t border-gray-100 border-opacity-25 pt-5 text-center text-sm">
        © 2024 MyShaadi. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
