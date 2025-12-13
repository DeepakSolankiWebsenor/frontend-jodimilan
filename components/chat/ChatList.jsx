import React from "react";
import Image from "next/image";
import Avatar1 from "../../public/images/avtar.png";
import CircularLoader from "../../components/common-component/loader";

const ChatList = ({ friends, loading, handleChatSelect, singleUser, toggleDrawer }) => {
  const loggedUserId = typeof window !== 'undefined' ? Number(localStorage.getItem("user_id")) : null;

  return (
    <>
      {friends?.length > 0 ? (
        friends
          ?.filter((it) => it.id !== loggedUserId)
          ?.map((item, index) => (
            <div key={index}>
              <div
                onClick={() => {
                  if (toggleDrawer) toggleDrawer("left", false)({});
                  handleChatSelect(item);
                }}
                className={`relative cursor-pointer shadow-sm text-black px-[10px] py-2 w-full justify-between flex items-center gap-2 font-medium ${
                  singleUser?.id === item.id ? "bg-sky-200" : "hover:bg-sky-100"
                }`}
              >
                {/* Left: Profile + Info */}
                <div className="flex gap-3 items-center" style={{ overflowWrap: "anywhere" }}>
                  {item?.profile ? (
                    <img
                      src={item.profile}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src={Avatar1}
                      height={40}
                      width={40}
                      alt="default"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}

                  <div className="hidden md:block">
                    <div className="font-semibold text-base capitalize">
                      <span className="mr-1">{item?.name}</span>
                      <span className="text-sm">({item?.ryt_id})</span>
                    </div>
                  </div>
                  {/* Mobile view name (since md:block hides it on mobile in original code? Wait.) 
                      In original code:
                      <div className="hidden md:block"> ... </div>
                      Wait, in the drawer (mobile), the original code was:
                       <div className="my-auto block">
                          <div className="font-semibold text-xl capitalize">
                            {item?.ryt_id}
                          </div>
                        </div>
                      The sidebar and drawer had SLIGHTLY different markup for the name.
                      Sidebar: hidden md:block (so name hidden on mobile sidebar? But sidebar is hidden on mobile).
                      Drawer: my-auto block (visible).
                      
                      If I use this ChatList for BOTH, I need to handle this.
                      The Sidebar is `md:block hidden`. So it's only visible on Desktop.
                      The Drawer is for Mobile.
                      
                      If I use this component in the Sidebar, `hidden md:block` is fine because the sidebar itself is hidden on mobile.
                      If I use this component in the Drawer (Mobile), `hidden md:block` will HIDE the name!
                      
                      I should remove `hidden md:block` if I want it to work in the Drawer.
                      Or pass a prop `isDrawer`.
                      
                      Actually, let's look at the Drawer markup in `messages.js`:
                      It shows `item?.ryt_id` in `text-xl`.
                      The Sidebar shows `item?.name` and `item?.ryt_id` in `text-base`.
                      
                      I will standardize it to show Name + ID, and make it visible always (since the container width controls visibility).
                      The Sidebar container is hidden on mobile, so it doesn't matter.
                      The Drawer container is visible on mobile.
                      
                      So I will remove `hidden md:block`.
                  */}
                  <div className="block">
                    <div className="font-semibold text-base capitalize">
                      <span className="mr-1">{item?.name}</span>
                      <span className="text-sm">({item?.ryt_id})</span>
                    </div>
                  </div>
                </div>

                {/* Right: unread count */}
                {item?.session?.unreadCount > 0 && (
                  <div className="text-xs rounded-full bg-red-600 text-white min-w-[20px] px-1 text-center">
                    {item?.session?.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))
      ) : !loading ? (
        <div className="text-black px-[10px] py-4 flex items-center font-semibold text-sm">
          No User Found...
        </div>
      ) : (
        <div className="flex justify-center my-4">
          <CircularLoader />
        </div>
      )}
    </>
  );
};

export default ChatList;
