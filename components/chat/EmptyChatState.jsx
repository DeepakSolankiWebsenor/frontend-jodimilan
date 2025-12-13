import React from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Button, SwipeableDrawer } from "@mui/material";

const EmptyChatState = ({ toggleDrawer, state, DrawerListContent }) => {
  return (
    <div className="md:w-3/4 w-full h-full flex flex-col">
      {/* Mobile header with drawer */}
      <div className="h-14 md:bg-transparent bg-sky-700 w-full flex items-center p-3">
        <div className="flex justify-between w-full text-black">
          <div className="font-semibold md:hidden w-1/2 flex">
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
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="font-semibold lg:text-[30px] text-lg text-gray-500">
            No Chat Found!
          </div>
          <div className="text-[16px] mt-3 text-gray-500">
            Please select any user to start a chat.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatState;
