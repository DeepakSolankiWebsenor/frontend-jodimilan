import React from "react";
import Image from "next/image";
import Avatar1 from "../../public/images/avtar.png";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import BlockIcon from "@mui/icons-material/Block";
import { Button, SwipeableDrawer, Tooltip } from "@mui/material";

const ChatHeader = ({
  singleUser,
  handleBlockUser,
  localStorageValue,
  toggleDrawer,
  state,
  DrawerListContent, // Component or function to render drawer content
}) => {
  return (
    <div className="h-14 sticky top-0 z-30 bg-white border-b w-full flex items-center px-2">
      <div className="flex justify-between w-full text-black">
        {/* Mobile: drawer toggle */}
        <div className="md:hidden flex items-center">
          <React.Fragment key={"left"}>
            <Button onClick={toggleDrawer("left", true)}>
              <MenuOpenIcon className="text-black" />
            </Button>
            <SwipeableDrawer
              anchor={"left"}
              open={state["left"]}
              onClose={toggleDrawer("left", false)}
              onOpen={toggleDrawer("left", true)}
            >
              {DrawerListContent}
            </SwipeableDrawer>
          </React.Fragment>
        </div>

        {/* User info */}
        <div className="font-semibold flex items-center flex-1 overflow-hidden">
          <div>
            {singleUser?.profile ? (
              <img
                src={singleUser.profile}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <Image
                src={Avatar1}
                height={32}
                width={32}
                alt="default"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
          </div>

          <div className="capitalize ml-2 overflow-hidden">
            <div className="truncate">
              {singleUser?.name} ({singleUser?.ryt_id})
            </div>
            <div className="text-slate-400 text-xs">
              {singleUser?.online === true && "Online"}
            </div>
          </div>
        </div>

        {/* Block button */}
        <div
          className="text-black ml-2 flex items-center"
          onClick={() => handleBlockUser(singleUser)}
        >
          <Tooltip
            title={
              singleUser?.session?.block?.filter(
                (item) => item?.blocked_by == localStorageValue
              ).length
                ? "Unblock this user"
                : "Block this user"
            }
          >
            <BlockIcon className="text-red-500 cursor-pointer" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
