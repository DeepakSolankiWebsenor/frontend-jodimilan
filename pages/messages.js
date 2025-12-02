'use client';
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";
import useApiService from "../services/ApiService";
import BlockIcon from "@mui/icons-material/Block";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Avatar1 from "../public/images/avtar.png";
import Head from "next/head";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useSelector } from "react-redux";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import moment from "moment";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { Alert, Link, Snackbar, Tooltip } from "@mui/material";
import CircularLoader from "../components/common-component/loader";
import PersonIcon from "@mui/icons-material/Person";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CryptoJS from "crypto-js";
import { decrypted_key, SOCKET_CONFIG } from "../services/appConfig";
import { getUSer } from "../services/redux/slices/userSlice";

export default function Messages() {
  const [chatData, setChatData] = useState();
  const [allData, setAllData] = useState([]);
  const [friends, setFriends] = useState([]);
  const [blockeUserId, setBlockeUserId] = useState([]);
  const [userData, setUserData] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);


  const [alert, setAlert] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [singleUser, setSingleUser] = useState("");
  const masterData = useSelector((state) => state.user);
  const [state, setState] = useState({ left: false });
  const [localStorageValue, setLocalStorageValue] = useState()
  const [id, setId] = useState();
  const {
    getAllfriends,
    getChatbySessionid,
    sendMessage,
    blockchatuser,
    getUserProfile,
    chatCounting,
  } = useApiService();
  const { user } = useSelector((state) => state.user);
  var roomId = '';
  // below creating new Pusher object and passing our app configuration to it
  let PusherClient = new Pusher(SOCKET_CONFIG.KEY, {
    cluster: "ap2",
    wsHost: SOCKET_CONFIG.URL,
    wsPort: SOCKET_CONFIG.PORT,
    wssHost: SOCKET_CONFIG.URL,
    wssPort: SOCKET_CONFIG.PORT,
    enabledTransports: ["ws", "wss"],
    forceTLS: false,
  });

  // now we will use PusherClient to subscribe channel
  // now we will productChat channel to get message from this channel

  // for liste ning to any channel we have to create Echo object

  const echo = new Echo({
    broadcaster: "pusher",
    client: PusherClient,
  });

  PusherClient.subscribe("PrivateChatEvent");
  /* PusherClient.subscribe("MsgReadEvent"); */

  const messListener = (idS) => {
    echo.channel(`Chat.${Number(localStorage.getItem('currentChatId'))}`)
      .listen("PrivateChatEvent", (ev) => {
        let tempMsg = { ...ev?.data };
        console.log('new message', ev)
        if (ev?.data.session_id === Number(localStorage.getItem('currentChatId')))
          setChatData((chatData) => [...chatData, tempMsg]);
      });

    echo
      .channel(`PrivateChatEndEvent.${Number(localStorage.getItem('currentChatId'))}`)
      .listen("PrivateChatEndEvent", async (e) => { });
  };

  /* echo.channel(`Chat`)
    .listen("MsgReadEvent", (ev) => {
      let tempMsg = { ...ev?.data };
      console.log(ev?.data,'MsgReadEvent')
      //if(ev?.data.session_id===Number(localStorage.getItem('currentChatId')))
      //setChatData((chatData) => [...chatData, tempMsg]);
    }); */

  const dataFetchedRef = useRef(false);

  const getMasterData = () => {
    if (masterData?.user !== null) {
      var encrypted_json = JSON.parse(window.atob(masterData?.user?.user));
      var dec = CryptoJS.AES.decrypt(
        encrypted_json.value,
        CryptoJS.enc.Base64.parse(decrypted_key),
        {
          iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
        }
      );

      var decryptedText = dec.toString(CryptoJS.enc.Utf8);
      var jsonStartIndex = decryptedText.indexOf("{");
      var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
      var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
      jsonData.trim();
      const parsed = JSON.parse(jsonData);

      setUserData(parsed);
    }
  };

  const getProfileData = () => {
    getUserProfile()
      .then((res) => {
        if (res.data?.status === 200) {
          var encrypted_json = JSON.parse(window.atob(res?.data?.user));
          var dec = CryptoJS.AES.decrypt(
            encrypted_json.value,
            CryptoJS.enc.Base64.parse(decrypted_key),
            {
              iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
            }
          );

          var decryptedText = dec.toString(CryptoJS.enc.Utf8);
          var jsonStartIndex = decryptedText.indexOf("{");
          var jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
          var jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          jsonData.trim();
          const parsed = JSON.parse(jsonData);

          setUserData(parsed);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getFriends();
  }, []);

  const getFriends = () => {
    getAllfriends()
      .then((res) => {
        if (res?.status == 200) {
          setFriends(res.data.data);
          setAllData(res.data.data)
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleBlockUser = (user) => {
    let userID = localStorage.getItem("user_id")
    if (user?.session?.block?.filter((item) => Number(item.blocked_by) == Number(userID)).length > 0) {
      blockchatuser(sessionId, "unblock")
        .then((response) => {
          if (response.status == 200) {
            setAlert(true);
            let tempUser = { ...user };
            let ids = [];
            ids = user.session.block.filter((el) => Number(el.blocked_by) !== Number(userID))
            user.session.block = ids;
            setSingleUser(tempUser);
            const updated = friends?.map((item) => {
              if (item?.id === user?.id) {
                return {
                  ...item,
                  session: {
                    ...item?.session,
                    block: [
                      {
                        blocked_by: user?.session?.block
                      }
                    ],
                  },
                };
                return item;
              }
              return item;
            });
            setFriends(updated);
          }
        })
        .catch((error) => console.log(error));
    } else {
      blockchatuser(sessionId, "block")
        .then((response) => {
          if (response?.status === 200) {
            setAlert(true);
            let tempUser = { ...user };
            let ids = [];
            if (user?.session?.block?.length > 0) {
              if (user?.session?.block?.filter((el) => el.blocked_by !== userID)) {
                ids = [...user?.session?.block, { blocked_by: Number(userID) }]
              }
            } else {
              ids.push({ blocked_by: Number(userID) })
            }
            user.session.block = ids;
            setSingleUser(tempUser);
            const updated = friends?.map((item) => {
              if (item?.id === user?.id) {
                return {
                  ...item,
                  session: {
                    ...item?.session?.block,
                    block: null,
                  },
                };
                return item;
              }
              return item;
            });
            setFriends(updated);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Link href="/" legacyBehavior>
        <a className="flex title-font font-medium justify-center mx-auto items-center text-gray-900 mb-0">
          <Image
            src="/logo/Logo.png"
            alt=""
            width={100}
            height={100}
            style={{ width: "50%", height: "98px" }}
          />
        </a>
      </Link>
      <div className="h-14 font-medium bg-sky-700 p-3 text-xl">Chat</div>
      {friends?.length > 0 ? (
        friends?.map((item, index) => {
          return (
            <div
              onClick={() => {
                toggleDrawer("left", false);
                handleChatSelect(item)
              }}
              className={`relative cursor-pointer shadow-md text-black p-[10px] w-full justify-between flex items-center lg:gap-[10px] md:gap-[10px] font-medium ${singleUser.id === item.id ? "bg-sky-200" : "hover:bg-sky-200"
                }`}
              key={index}
            >
              <div className="flex gap-2">
                {item?.profile ? (
                  <img
                    src={item.profile}
                    alt="asd"
                    className="w-11 h-11 rounded-full"
                    style={{
                      filter:
                        item?.users?.userprofile?.photo_privacy === "No" &&
                        "blur(2px)",
                    }}
                  />
                ) : (
                  <Image
                    src={Avatar1}
                    height={20}
                    width={20}
                    alt="sd"
                    className="w-[50px] h-[50px] rounded-full"
                  />
                )}
                <div className="my-auto block">
                  <div className="font-semibold text-xl capitalize">
                    {item?.ryt_id}
                  </div>
                </div>
              </div>
              <div>
                {item?.session?.unreadCount >= 0 && (
                  <div className="right-2 text-sm -top-2 rounded-full bg-red-600 text-white w-5 text-center  ">
                    {item?.session?.unreadCount}
                  </div>
                )}
                {/* {item?.online ? <div className="bg-green-600 h-2 w-2 rounded-full"></div> : <div className="bg-slate-600 h-2 w-2 rounded-full"></div>} */}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-black p-[10px] flex items-center font-semibold text-sm">
          No User Found...
        </div>
      )}
    </Box>
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleChatRequest = (id) => {
    getChatbySessionid(id).then((res) => {
      setChatData(res.data.data);
    });
  };
  const handleChatCount = (id) => {

    chatCounting(id).then((res) => {
      getFriends()
    });
  };


  const handlesendChat = () => {
    const _form = new FormData();
    _form.append("content", message);
    _form.append("to_user", singleUser?.id);
    sendMessage(localStorage.getItem('currentChatId'), _form)
      .then((res) => {
        setMessage("");
        if (singleUser.unreadCount > 0) {
          handleChatCount(singleUser?.session?.id);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && message.trim() !== "") {
      handlesendChat();
      setMessage("");
    }
  };

  const handleChatSelect = (item) => {
    handleChatCount(item?.session?.id);
    setId(item?.session?.id)
    localStorage.setItem('currentChatId', item?.session?.id)
    messListener(item?.session?.id);
    setSessionId(item?.session?.id)
    handleChatRequest(item?.session?.id);
    setSingleUser(item);
  };

  useEffect(() => {
    setLocalStorageValue(localStorage.getItem("user_id"))
  }, [singleUser])

  return (
    <>
      <Head>
        <title>Message - JodiMilan</title>
        <meta
          name="description"
          content="100% Mobile Verified Profiles. Safe and Secure. Register Free to Find Your Life Partner. Most Trusted Matrimony Service - Brand Trust Report. Register Now to Find Your Soulmate."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.jpg" />
      </Head>

      {/* Alert */}
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          {singleUser?.session?.block?.filter(
            (item) => item?.blocked_by == localStorageValue
          ).length
            ? "Blocked User Successfully"
            : "Unblocked User Successfully"}
        </Alert>
      </Snackbar>

      {/* Main chat container */}
      <div className="border w-full rounded-md flex flex-col md:flex-row md:h-[calc(100vh-96px)] h-[calc(100vh-96px)] overflow-hidden">
        {/* LEFT: chat list (visible only on md+) */}
        <div className="example2 md:w-1/4 w-full md:block hidden border-r">
          {/* List header */}
          <div className="bg-sky-200 border-b border-slate-300 sticky top-0 z-20 shadow px-3 flex justify-between text-black h-14">
            <div className="font-bold text-lg my-auto">Chat</div>
            <div className="my-auto">
              <input
                type="text"
                name="search"
                placeholder="Find..."
                onChange={(e) => {
                  if (e.target.value === "") {
                    setFriends(allData);
                  } else {
                    setFriends(
                      allData.filter((data) =>
                        data.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      )
                    );
                  }
                }}
                className="border-2 rounded-xl px-3 font-light bg-white outline-none py-1 placeholder:text-black text-black text-sm md:w-28"
              />
            </div>
          </div>

          {/* List body */}
          <div className="md:h-[calc(100vh-96px-56px)] h-[calc(100vh-96px-56px)] overflow-y-auto">
            {friends?.length > 0 ? (
              friends
                ?.filter(
                  (it) => it.id !== Number(localStorage.getItem("user_id"))
                )
                ?.map((item, index) => {
                  return (
                    <div key={index}>
                      {item?.status === "Active" && (
                        <div
                          onClick={() => handleChatSelect(item)}
                          className={`relative cursor-pointer shadow-sm text-black px-[10px] py-2 w-full justify-between flex items-center gap-2 font-medium ${
                            singleUser?.id === item.id
                              ? "bg-sky-200"
                              : "hover:bg-sky-100"
                          }`}
                        >
                          <div
                            className="flex gap-3 items-center"
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {item?.profile ? (
                              <img
                                src={item.profile}
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                                style={{
                                  filter:
                                    item?.users?.userprofile?.photo_privacy ===
                                    "No"
                                      ? "blur(2px)"
                                      : "none",
                                }}
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
                                <span className="text-sm">
                                  ({item?.ryt_id})
                                </span>
                              </div>
                            </div>
                          </div>

                          {item?.session?.unreadCount > 0 && (
                            <div className="text-xs rounded-full bg-red-600 text-white min-w-[20px] px-1 text-center">
                              {item?.session?.unreadCount}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
            ) : !loading ? (
              <div className="text-black px-[10px] py-4 flex items-center font-semibold text-sm">
                No User Found...
              </div>
            ) : (
              <div className="flex justify-center my-4">
                <CircularLoader />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Chat panel */}
        {chatData ? (
          <div className="md:w-3/4 w-full flex flex-col md:ml-1 h-full">
            {/* Chat header */}
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
                      {list("left")}
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

            {/* Messages area */}
            <div className="bg-white flex-1 w-full scrollBar flex flex-col-reverse overflow-y-auto">
              {chatData ? (
                <div className="w-full pr-3">
                  {chatData
                    ?.filter(
                      (value, index) =>
                        index === chatData.findIndex((o) => o._id === value._id)
                    )
                    .map((message, index) => {
                      const prevDate = moment(
                        chatData[index - 1]?.createdAt
                      )?.format("DD-MM-YYYY");
                      const currentDate = moment(message.createdAt).format(
                        "DD-MM-YYYY"
                      );

                      return (
                        <div className="md:px-12 px-3 py-1" key={index}>
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
                              message.user?._id ===
                              Number(localStorage.getItem("user_id"))
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <span
                              className={`text-black md:min-h-[20px] px-3 pt-2 my-auto max-w-[80%] md:max-w-[60%] opacity-75 rounded-lg break-words ${
                                message.user?._id ===
                                Number(localStorage.getItem("user_id"))
                                  ? "bg-[#7dd3fc]"
                                  : "bg-red-200"
                              }`}
                            >
                              <span className="flex font-semibold normal-case items-start gap-1">
                                <PermIdentityIcon className="!text-sm mt-[1px]" />
                                <span className="text-sm">{message.text}</span>
                              </span>
                              <div className="text-[0.6rem] text-right mt-1">
                                {moment(message.createdAt).format("LT")}
                              </div>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="font-semibold lg:text-[30px] text-lg text-gray-500">
                    No messages here yet...
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            {chatData && (
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
            )}
          </div>
        ) : (
          // If no chat selected
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
                      {list("left")}
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
        )}
      </div>
    </>
  );

};

