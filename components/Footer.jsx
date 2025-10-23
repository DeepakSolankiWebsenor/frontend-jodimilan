import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <>
      <footer className="text-gray-600 body-font">
        <div className="container px-12 py-16 bg-gray-200 footer-width">
          <div className="flex flex-wrap md:text-left text-center order-first">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <div className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                About Company
              </div>
              <nav className="list-none mb-10">
                <li>
                  <Link href="/about-us" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      About Us
                    </a>
                  </Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <div className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Help & Support
              </div>
              <nav className="list-none mb-10">
                <li>
                  <Link href="/contact-us" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      Contact Us
                    </a>
                  </Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <div className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Privacy and Safety
              </div>
              <nav className="list-none mb-10">
                <li>
                  <Link href="/terms-and-conditions" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      Terms and Conditions
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      Privacy Policy
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/refund-cancellation" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      Refund and Cancellation
                    </a>
                  </Link>
                </li>
                {/* <li>
                  <Link href="/safe-search" legacyBehavior>
                    <a className="text-gray-600 hover:text-gray-800">
                      Search Safe
                    </a>
                  </Link>
                </li> */}
              </nav>
            </div>
            {/* <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <div className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                SUBSCRIBE
              </div>
              <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
                <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                  <label
                    htmlFor="footer-field"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Subscribe
                  </label>
                  <input
                    type="text"
                    id="footer-field"
                    name="footer-field"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <button className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:opacity-90 transition-all rounded">
                  Subscribe
                </button>
              </div>
              <div className="text-gray-500 text-sm mt-2 md:text-left text-center">
                Bitters chicharrones fanny pack
                <br className="lg:block hidden" />
                waistcoat green juice
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer 2 */}
        <div className="bg-[#002646] text-white py-5">
          <div className="container px-5 md:py-0 py-5 mx-auto flex items-center sm:flex-row flex-col footer-width">
            <Link href="/" legacyBehavior>
              <a className="flex title-font font-medium items-center text-white mb-0">
                <Image
                  src="/logo/Logo.png"
                  alt=""
                  width={100}
                  height={100}
                  className="w-[55px]"
                />
              </a>
            </Link>
            <div className="text-sm text-white sm:ml-6 sm:mt-0 mt-4 hover:text-gray-500">
              © 2025 My Shaadi —
              <a
                href="https://twitter.com/knyttneve"
                rel="noopener noreferrer"
                className="text-white ml-1 hover:text-gray-500"
                target="_blank"
              >
                @myshadi
              </a>
            </div>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
              <a className="text-gray-500 hover:text-white">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500 hover:text-white">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500 hover:text-white">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500 hover:text-white">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
