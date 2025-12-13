import React from "react";
import SendIcon from "@mui/icons-material/Send";

const MessageInput = ({
  message,
  setMessage,
  handleKeyPress,
  handlesendChat,
  userData,
  singleUser,
}) => {
  return (
    <div className="h-16 bg-sky-100 border-t flex items-center px-3">
      {!userData?.user?.plan_expire ? (
        <>
          {singleUser?.session?.block?.length === 0 ||
          singleUser?.session?.block == null ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <input
                  type="text"
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  value={message}
                  placeholder="Type something..."
                  className="h-11 px-4 font-medium border rounded-3xl shadow-sm outline-none w-full text-black placeholder:text-slate-500 bg-white"
                />
              </div>
              <button
                onClick={handlesendChat}
                disabled={message?.length === 0}
                className="disabled:opacity-50 border-none flex items-center justify-center w-10 h-10 rounded-full bg-sky-300 font-medium text-black hover:scale-95 transition"
              >
                <SendIcon className="text-[20px]" />
              </button>
            </div>
          ) : (
            <div className="text-center w-full text-sm font-medium">
              You can&apos;t reply to this conversation.
            </div>
          )}
        </>
      ) : (
        <div className="text-center w-full text-sm font-medium">
          Upgrade or Buy Plan.
        </div>
      )}
    </div>
  );
};

export default MessageInput;
