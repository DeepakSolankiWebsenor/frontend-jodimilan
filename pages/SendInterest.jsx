import Image from "next/image";
import React, { useState } from "react";
import Profile from "../public/images/profile.jpg";
import { SiMinutemailer } from "react-icons/si";
import { MdPermContactCalendar } from "react-icons/md";
import { BsFillChatFill } from "react-icons/bs";
import { BsStarFill } from "react-icons/bs";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";

function SendInterest() {
  const [card, setCard] = useState(true);
  const router = useRouter();
  return (
    <div className="md:px-32 px-4">
      <div className="text-sm font-semibold pt-2" onClick={() => router.back()}>
        Back to Profile of VYZW6407
      </div>

      <div className="flex bg-white my-2 drop-shadow-lg">
        <div className="w-[17%]">
          <Image
            src={Profile}
            width={100}
            height={100}
            className="md:h-48 w-full"
          />
        </div>

        {card ? (
          <>
            <div className="w-[80%] px-4">
              <div className="border-b text-sm py-1">Write new message</div>
              <div>
                <textarea
                  name="inquiry"
                  id="inquiry"
                  cols="30"
                  rows="5"
                  placeholder="Interest sent. You may send a personalized message with the interest."
                  className="focus:outline-none w-full h-full rounded-[4px] py-1 px-1"
                />
              </div>
            </div>

            <div className="md:w-[5%] w-[10%] cursor-pointer">
              <div
                className="h-1/2 bg-gray-100 flex justify-center items-center"
                onClick={() => setCard(false)}
              >
                <MdOutlineDone size={35} className="" />
              </div>
              <div
                className="h-1/2 bg-[#34495e] flex justify-center items-center"
                onClick={() => setCard(false)}
              >
                <AiOutlineClose size={35} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-[78%] md:pl-5 md:pr-7 pl-2 pr-2">
              <div className="md:flex md:justify-between items-center border-b">
                <div className="md:text-xl text-md font-medium">
                  Diwakar Vasisth
                </div>
                <div className="md:text-xs text-[10px]">
                  Last seen on 08-jan-23
                </div>
              </div>
              <div className="flex pt-2 text-sm">
                <div>
                  <div>25 yrs, 5'5"</div>
                  <div>Bhopal, India</div>
                  <div>Hindu, Teli</div>
                  <div>Hindi, Delhi</div>
                </div>
                <div className="md:pl-40 pl-12">
                  <div>25 yrs, 5'5"</div>
                  <div>Bhopal, India</div>
                  <div>Hindu, Teli</div>
                  <div>Hindi, Delhi</div>
                </div>
              </div>
            </div>
            <div className="md:w-3/12">
              <div className="bg-[#34495e] text-white flex justify-between flex-col md:block md:px-0 md:py-0">
                <div
                  className="hover:bg-[#aa0000] flex items-center px-3 md:py-0 py-[6px] cursor-pointer"
                  onClick={() => router.push("/SendInterest")}
                >
                  <SiMinutemailer size={20} />
                  <div className="hidden md:block px-2 py-3">Send Interests</div>
                </div>
                <div
                  className="hover:bg-[#aa0000] flex items-center px-3 md:py-0 py-[6px] cursor-pointer"
                  onClick={() => setViewContact(true)}
                >
                  <MdPermContactCalendar size={20} />
                  <div className="hidden md:block px-2 py-3">View Contacts</div>
                </div>
                <div
                  className="hover:bg-[#aa0000] flex items-center px-3 md:py-0 py-[6px] cursor-pointer"
                  onClick={() => setViewContact(true)}
                >
                  <BsFillChatFill size={20} />
                  <div className="hidden md:block px-2 py-3">Chat</div>
                </div>
                <div
                  className="hover:bg-[#aa0000] flex items-center px-3 md:py-0 py-[6px] cursor-pointer"
                  onClick={() => router.push("/profile/short-list-profle")}
                >
                  <BsStarFill size={20} />
                  <div className="hidden md:block px-2 py-3">Shortlist</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="py-2 text-xl font-semibold">Similar profiles</div>
      <div className="flex gap-8">
        <div className="md:w-[85%] w-full">
          <div className="flex bg-white my-2 drop-shadow-lg">
            <div className="w-[20%]">
              <Image
                src={Profile}
                width={100}
                height={100}
                className="md:h-48 w-full"
              />
            </div>
            <div className="w-[75%] md:pl-5 md:pr-7 pl-2 pr-2">
              <div className="md:flex md:justify-between items-center border-b">
                <div className="md:text-xl text-md font-medium">
                  Diwakar Vasisth
                </div>
                <div className="md:text-xs text-[10px]">
                  Last seen on 08-jan-23
                </div>
              </div>
              <div className="flex pt-2 text-sm">
                <div>
                  <div>25 yrs, 5'5"</div>
                  <div>Bhopal, India</div>
                  <div>Hindu, Teli</div>
                  <div>Hindi, Delhi</div>
                </div>
                <div className="md:pl-40 pl-12">
                  <div>25 yrs, 5'5"</div>
                  <div>Bhopal, India</div>
                  <div>Hindu, Teli</div>
                  <div>Hindi, Delhi</div>
                </div>
              </div>
            </div>
            <div className="w-[5%] flex flex-col justify-between items-center cursor-pointer hover:bg-[#34495e] text-gray-300 text-center">
              <div className="hover:bg-[#aa0000] flex justify-center w-full py-2">
                <SiMinutemailer size={25} />
              </div>
              <div className="hover:bg-[#aa0000] flex justify-center w-full py-2">
                <MdPermContactCalendar size={25} />
              </div>
              <div className="hover:bg-[#aa0000] flex justify-center w-full py-2">
                <BsFillChatFill size={25} />
              </div>
              <div className="hover:bg-[#aa0000] flex justify-center w-full py-2">
                <BsStarFill size={25} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[15%] hidden md:block">
          <div className="py-2 font-semibold">Success Stories</div>
          <div className="border text-center text-sm">
            <div>
              <Image
                src={Profile}
                width={100}
                height={100}
                className="h-32 w-full"
              />
            </div>
            <div>Pragya sha</div>
            <div>weds</div>
            <div>Ravi Sharma</div>
          </div>

          <div className="border text-center text-sm my-1">
            <div>
              <Image
                src={Profile}
                width={100}
                height={100}
                className="h-32 w-full"
              />
            </div>
            <div>Pragya sha</div>
            <div>weds</div>
            <div>Ravi Sharma</div>
          </div>

          <div className="border text-center text-sm">
            <div>
              <Image
                src={Profile}
                width={100}
                height={100}
                className="h-32 w-full"
              />
            </div>
            <div>Pragya sha</div>
            <div>weds</div>
            <div>Ravi Sharma</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendInterest;
