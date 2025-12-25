import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../../components/PageContainer";

const minAge = [
  { id: 1, name: 21 },
  { id: 2, name: 22 },
  { id: 3, name: 23 },
  { id: 4, name: 24 },
  { id: 5, name: 25 },
];

const maxAge = [
  { id: 1, name: 26 },
  { id: 2, name: 27 },
  { id: 3, name: 28 },
  { id: 4, name: 29 },
  { id: 5, name: 30 },
];

const FindPerfectMatch = () => {
  const router = useRouter();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-white py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/20 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 select-none pointer-events-none" />
      
      <PageContainer>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content Section */}
          <div className="w-full lg:w-[55%] z-10 text-center lg:text-left">
            <div data-aos="fade-right" data-aos-delay="100">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Begin Your Journey
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-8">
                Find Your <span className="text-primary italic relative">
                  Perfect Match
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
                , for <br /> a Lifetime of Happiness!
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Step into a world of verified community profiles. Discover meaningful connections built on trust, safety, and shared values.
              </p>
            </div>

            <div data-aos="zoom-in" data-aos-delay="300" className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl border border-white/40">
              <p className="text-base font-bold text-gray-800 mb-6 flex items-center justify-center lg:justify-start gap-2 uppercase tracking-wide">
                <span className="w-8 h-px bg-primary hidden md:block" />
                Quick Search Guide
                <span className="w-8 h-px bg-primary hidden md:block" />
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "I'm looking for a", placeholder: "e.g. Female" },
                  { label: "Religion", placeholder: "e.g. Hindu" },
                  { label: "Marital Status", placeholder: "e.g. Unmarried" },
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2 text-left">
                    <label className="text-xs font-bold text-gray-500 ml-1">{field.label}</label>
                    <div className="w-full p-4 bg-white/50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 cursor-not-allowed transition-all">
                      {field.placeholder}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-gray-500 ml-1">Age Criteria</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-4 bg-white/50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 text-center">21</div>
                    <span className="text-gray-400 font-bold">to</span>
                    <div className="flex-1 p-4 bg-white/50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 text-center">30</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/search")}
                className="btn-glow mt-8 py-4 bg-primary text-white text-base font-bold rounded-2xl w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
              >
                Let's Find Your Match
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="w-full lg:w-[45%] relative mt-12 lg:mt-0">
            <div className="flex justify-center items-center gap-6 md:gap-8">
              <div data-aos="fade-up" data-aos-delay="400" className="floating">
                <Image
                  src="/images/home-1.png"
                  alt="Couple profile"
                  height={500}
                  width={350}
                  className="rounded-[2.5rem] shadow-2xl border-4 border-white object-cover aspect-[3/4] hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div data-aos="fade-down" data-aos-delay="600" className="floating-delayed mt-12">
                <Image
                  src="/images/home-2.png"
                  alt="Wedding celebration"
                  height={450}
                  width={320}
                  className="rounded-[2.5rem] shadow-2xl border-4 border-white object-cover aspect-[3/4] hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default FindPerfectMatch;
