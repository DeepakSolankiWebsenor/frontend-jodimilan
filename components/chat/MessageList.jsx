import React from "react";
import moment from "moment";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

const MessageList = ({ chatData }) => {
  const loggedUserId = typeof window !== 'undefined' ? Number(localStorage.getItem("user_id")) : null;

  return (
    <>
      {chatData?.map((message, index) => {
        const prevDate =
          index > 0
            ? moment(chatData[index - 1]?.created_at).format("DD-MM-YYYY")
            : null;
        const currentDate = moment(message.created_at).format("DD-MM-YYYY");

        const isMine = message.from_user_id === loggedUserId;

        return (
          <div className="md:px-12 px-3 py-1" key={message.id}>
            {prevDate !== currentDate && (
              <div className="py-1 text-xs rounded-2xl mx-auto px-3 bg-sky-300 my-2 text-center text-black w-fit bg-opacity-60">
                {currentDate === moment().format("DD-MM-YYYY")
                  ? "Today"
                  : currentDate ===
                    moment().add(-1, "days").format("DD-MM-YYYY")
                  ? "Yesterday"
                  : currentDate}
              </div>
            )}

            <div
              className={`w-full flex my-1 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`text-black md:min-h-[20px] px-3 pt-2 my-auto max-w-[80%] md:max-w-[60%] rounded-lg shadow-sm break-words ${
                  isMine
                    ? "bg-[#d9fdd3] rounded-tr-none"
                    : "bg-white rounded-tl-none border border-gray-200"
                }`}
              >
                <span className="flex font-semibold normal-case items-start gap-1">
                  {!isMine && <PermIdentityIcon className="!text-sm mt-[1px]" />}
                  <span className="text-sm">{message.message}</span>
                </span>

                <div className="text-[0.6rem] text-right mt-1 text-gray-500">
                  {moment(message.created_at).format("LT")}
                </div>
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MessageList;
