/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsFillGridFill } from "react-icons/bs";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { RxAvatar } from "react-icons/rx";
import { IoMdNotifications } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Alert from "@mui/material/Alert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NOTIFICATION, getUSer } from "../services/redux/slices/userSlice";
import Badge from "@mui/material/Badge";
import useApiService from "../services/ApiService";
import { ToastContainer, toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import moment from "moment";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function Header() {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState(false);
  const userData = useSelector(getUSer);
  const { notification } = useSelector((state) => state?.user);
  const [notifications, setNotifications] = useState([]);
  const { readNotificaton } = useApiService();
  const [decryptedUserData, setDecryptedUserData] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const getMasterData = () => {
    if (userData?.user !== null) {
      var encrypted_json = JSON.parse(window.atob(userData?.user?.user));
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

      setDecryptedUserData(parsed);
    }
  };

  useEffect(() => {
    getMasterData();
  }, [userData]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const toggleSideMenu = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else if (!ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };

  const closeSideMenu = () => {
    ref.current.classList.remove("translate-x-full");
  };

  const ref = useRef();

  useEffect(() => {
    if (window !== undefined) {
      const height = document.querySelector("#haeder").offsetHeight;
    }
    const token = localStorage.getItem("token");
    if (token !== null) {
      setLoggedIn(true);
      setNotifications(notification);
    } else {
      setLoggedIn(null);
    }
    return () => {};
  }, [router, notification]);

  const handleLogout = () => {
    router.push("/Login");
    localStorage.removeItem("token");
    setAlert(true);
  };

  const handlereadNotification = (notification_id, action, user_id) => {
    readNotificaton(notification_id)
      .then((response) => {
        dispatch(NOTIFICATION(response.data));
      })
      .catch((error) => console.log(error));

    if (action === "profile_visited") {
      router.push({ pathname: `/profile/profile-detail/${user_id}` });
    } else if (action === "friend_request") {
      router.push({
        pathname:
          action === "friend_request" ? "/interest-receive-pending" : "",
      });
    } else {
      router.push({
        pathname:
          action === "friend_request_accepted" ? "/interest-sent-accept" : "",
      });
    }
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // profile dropDown
  const [openProfile, setOpenProfile] = React.useState(false);
  const anchorProfileRef = React.useRef(null);

  const handleToggleProfile = () => {
    setOpenProfile((prevOpen) => !prevOpen);
  };

  const handleCloseProfile = (event) => {
    if (
      anchorProfileRef.current &&
      anchorProfileRef.current.contains(event.target)
    ) {
      return;
    }

    setOpenProfile(false);
  };

  function handleListKeyDownProfile(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenProfile(false);
    } else if (event.key === "Escape") {
      setOpenProfile(false);
    }
  }

  const prevProfileOpen = React.useRef(openProfile);
  React.useEffect(() => {
    if (prevProfileOpen.current === true && openProfile === false) {
      anchorProfileRef.current.focus();
    }

    prevProfileOpen.current = openProfile;
  }, [openProfile]);

  return (
    <>
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setAlert(false)}
      >
        <Alert icon={<ThumbUpAltIcon />} severity="success">
          Logout Successfully !
        </Alert>
      </Snackbar>
      <ToastContainer />
      <header
        id="haeder"
        className="bg-white text-gray-600 body-font fixed top-0 z-10 w-full shadow-sm"
      >
        <div className="container  justify-between mx-auto flex flex-wrap lg:px-10 md:px-2 px-2 pr-4 md:flex-row items-center">
          <Link href={loggedIn ? "/profile/profile-page" : "/"} legacyBehavior>
            <a className="flex title-font font-medium items-center text-gray-900 mb-0">
              <Image
                src="/logo/Logo.png"
                alt=""
                width={100}
                height={100}
                className="w-[75px]"
              />
            </a>
          </Link>
          <div>
            <button
              onClick={toggleSideMenu}
              className="text-lg bg-gray-800 px-2 py-1 hover:bg-gray-600 rounded block lg:hidden z-10"
            >
              <MenuIcon className="text-xl text-white" />
            </button>
          </div>
          <nav className="lg:ml-auto lg:mr-auto lg:flex md:hidden hidden flex-wrap items-center text-base justify-center h-24">
            <div
              className="nav-item hover:border-b-4 border-b-[#aa0000]  dropdown h-24 cursor-pointer hover:text-[#aa0000]"
              onClick={() => router.push("/browse-profile")}
            >
              {/* <Link href="" legacyBehavior> */}
              <div className="mt-9 font-semibold text-sm">
                <a className="dropdown-item">Browse Profile</a>
              </div>
              {/* </Link> */}
            </div>

            <Link href="/search" legacyBehavior>
              <a className="lg:pl-5 pl-2 hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                <div className="mt-9 font-semibold text-sm">Search</div>
              </a>
            </Link>

            <Link href="/membership" legacyBehavior>
              <a className="lg:px-5 px-2 hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                <div className="mt-9 font-semibold text-sm">Membership</div>
              </a>
            </Link>

            {loggedIn && (
              <>
                <Link href="/profile/short-list-profle" legacyBehavior>
                  <a className="hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                    <div className="mt-9 font-semibold text-sm">
                      Short List Profile
                    </div>
                  </a>
                </Link>

                <div className="dropdown md:ml-5 ml-3 h-24 transition-all">
                  <div className="font-semibold cursor-pointer text-sm mt-9 hover:text-[#aa0000]">
                    Interests
                  </div>

                  <div className="dropdown-content w-[250px] border-t-[#aa0000] border-t-4">
                    <div className="p-4">
                      <div className="font-semibold text-[15px] text-black border-b-2 pb-2">
                        Express Interest Received
                        <div
                          className="mt-3 font-medium cursor-pointer hover:font-semibold hover:text-[#aa0000]"
                          onClick={() =>
                            router.push({
                              pathname: "/interest-receive-accept",
                            })
                          }
                        >
                          Accepted
                        </div>
                        <div
                          className="mt-2 font-medium cursor-pointer hover:font-semibold hover:text-[#aa0000]"
                          onClick={() =>
                            router.push({
                              pathname: "/interest-receive-pending",
                            })
                          }
                        >
                          Pending
                        </div>
                      </div>
                      <div className="mt-2 font-semibold text-[15px] text-black border-b-2 pb-2">
                        Express Interest Sent
                        <div
                          className="mt-3 font-medium cursor-pointer hover:font-semibold hover:text-[#aa0000]"
                          onClick={() =>
                            router.push({
                              pathname: "/interest-sent-accept",
                            })
                          }
                        >
                          Accepted
                        </div>
                        <div
                          className="mt-2 font-medium cursor-pointer hover:font-semibold hover:text-[#aa0000]"
                          onClick={() =>
                            router.push({
                              pathname: "/interest-sent-pending",
                            })
                          }
                        >
                          Pending
                        </div>
                      </div>
                      <div
                        className="mt-2 font-semibold text-[15px] text-black cursor-pointer hover:text-[#aa0000]"
                        onClick={() =>
                          router.push({
                            pathname: "/blocked-list",
                          })
                        }
                      >
                        Block List
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/messages" legacyBehavior>
                  <a className="px-5 hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                    <div className="mt-9 font-semibold text-sm">Inbox</div>
                  </a>
                </Link>
              </>
            )}

            <Link href="/contact-us" legacyBehavior>
              <a className="hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                <div className="mt-9 font-semibold text-sm">Contact Us</div>
              </a>
            </Link>

            <Link href="/about-us" legacyBehavior>
              <a className="px-5 hover:text-[#aa0000] h-24 hover:border-b-4 border-b-[#aa0000] transition-all">
                <div className="mt-9 font-semibold text-sm">About Us</div>
              </a>
            </Link>
          </nav>
          {/* IoMdNotifications */}
          {loggedIn && (
            <div className="hidden md:hidden lg:block">
              <div className="nav-item dropdown w-[50px] h-24 cursor-pointer relative">
                {notifications?.notifications_count > 0 && (
                  <div className="absolute h-[20px] w-[20px] top-[25%] left-[50%]">
                    <Badge
                      badgeContent={
                        notifications?.notifications.filter(
                          (el) => el.read_at === null
                        ).length
                      }
                      color="error"
                    />
                  </div>
                )}
                <div
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <a className="nav-link  hover:text-[#aa0000] h-24 transition-all">
                    <IoMdNotifications size={27} className="mt-9" />
                  </a>
                </div>

                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom"
                  transition
                  disablePortal
                  // sx={{marginRight:"10px"}}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps}>
                      <div className="max-w-full min-w-full">
                        <ClickAwayListener onClickAway={handleClose}>
                          {notifications?.notifications && (
                            <div
                              className={
                                "mt-10 mr-10 w-[300px] min-h-auto relative max-h-[350px] overflow-y-scroll bg-white"
                              }
                              autoFocusItem={open}
                              id="composition-menu"
                              aria-labelledby="composition-button"
                              onKeyDown={handleListKeyDown}
                            >
                              <div className="h-[50px] text-white font-semibold  flex items-center justify-center bg-slate-700">
                                <IoMdNotifications size={20} className="mr-2" />
                                Notifications
                              </div>
                              {notifications?.notifications.length > 0 ? (
                                notifications?.notifications?.map(
                                  (item, index) => {
                                    const data =
                                      item?.data && JSON.parse(item?.data);
                                    const { action, view_user_id } = data || {};
                                    return (
                                      data &&
                                      data.userId !==
                                        Number(
                                          localStorage.getItem("user_id")
                                        ) && (
                                        <div
                                          className={`border-b-gray-100 border-b-2 ${
                                            item?.read_at === null
                                              ? "bg-sky-200"
                                              : ""
                                          }`}
                                        >
                                          <div
                                            className={`mt-2  py-1 pt-2 text-left px-3 font-semibold hover:text-sky-600 `}
                                            key={index}
                                            onClick={() => {
                                              setOpen(false);
                                              handlereadNotification(
                                                item?.id,
                                                action,
                                                view_user_id
                                              );
                                            }}
                                          >
                                            {data?.message}
                                          </div>
                                          <div className="flex justify-end text-sm mb-1 pr-2">
                                            {" "}
                                            {moment(item?.created_at).format(
                                              "DD MMM YYYY hh:mm a"
                                            )}
                                          </div>
                                        </div>
                                      )
                                    );
                                  }
                                )
                              ) : (
                                <div className="mt-2 text-center font-medium">
                                  You have not get any notification.
                                </div>
                              )}
                            </div>
                          )}
                        </ClickAwayListener>
                      </div>
                    </Grow>
                  )}
                </Popper>
              </div>
            </div>
          )}

          <div className="hidden md:hidden lg:block">
            {loggedIn ? (
              <div className="nav-item dropdown h-24 cursor-pointer">
                <div
                  ref={anchorProfileRef}
                  id="composition-button"
                  aria-controls={openProfile ? "composition-menu" : undefined}
                  aria-expanded={openProfile ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggleProfile}
                  className=""
                >
                  {decryptedUserData?.profile_img_src ? (
                    <div>
                      <img
                        src={decryptedUserData?.profile_img_src}
                        className="h-8 w-8 rounded-full mt-9"
                        alt="asdf"
                      />
                    </div>
                  ) : (
                    <div className="mt-9">
                      <RxAvatar size={25} />
                    </div>
                  )}
                </div>
                <Popper
                  open={openProfile}
                  anchorEl={anchorProfileRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps}>
                      <div className="bg-white max-w-full min-w-full mt-10 ">
                        <ClickAwayListener onClickAway={handleCloseProfile}>
                          <div
                            className="block profile-dropdown-main"
                            autoFocusItem={openProfile}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDownProfile}
                          >
                            <div className="border-t-4 border-t-[#aa0000]">
                              <div className="w-max p-1 mx-1 align-self-center">
                                <ul
                                  onClick={handleCloseProfile}
                                  className="list-unstyled text-sm font-medium p-2 space-y-2"
                                >
                                  <li>
                                    <Link
                                      href="/profile/profile-page"
                                      legacyBehavior
                                    >
                                      <a className="dropdown-item">
                                        My Profile
                                      </a>
                                    </Link>
                                  </li>

                                  <li>
                                    <Link href="/my-orders" legacyBehavior>
                                      <a className="dropdown-item">My Orders</a>
                                    </Link>
                                  </li>

                                  <li>
                                    <Link
                                      href="/change-password"
                                      legacyBehavior
                                    >
                                      <a className="dropdown-item">
                                        {" "}
                                        Change Password{" "}
                                      </a>
                                    </Link>
                                  </li>

                                  {/* <li>
                          <Link href="/privacy-settings" legacyBehavior>
                            <a className="dropdown-item">Privacy Setting</a>
                          </Link>
                        </li> */}

                                  <li>
                                    <Link href="/delete-profile" legacyBehavior>
                                      <a className="dropdown-item">
                                        Delete Profile
                                      </a>
                                    </Link>
                                  </li>

                                  <li>
                                    <Link
                                      href="/update-mobile-email"
                                      legacyBehavior
                                    >
                                      <a className="dropdown-item">
                                        Update Phone No. & Email
                                      </a>
                                    </Link>
                                  </li>

                                  <li>
                                    <button onClick={handleLogout}>
                                      <Link legacyBehavior href="/Login">
                                        <a className="dropdown-item">Logout</a>
                                      </Link>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </ClickAwayListener>
                      </div>
                    </Grow>
                  )}
                </Popper>
              </div>
            ) : (
              <button
                className="lg:inline-flex md:hidden hidden items-center bg-[#aa0000] text-white border-0 py-2 px-4 focus:outline-none hover:opacity-90 rounded text-base"
                onClick={() => router.push("/Login")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Responsive Sidebar */}

      <div
        ref={ref}
        className="lg:hidden fixed top-0 right-[100%] transform overflow-scroll transition-transform translate-x-0 bg-white shadow-lg  z-50 h-full md:w-96 w-4/5"
      >
        <Link href={loggedIn ? "/profile/profile-page" : "/"} legacyBehavior>
          <a className="flex title-font sticky top-1 bg-white font-medium items-center text-gray-900 mb-0">
            <Image
              src="/logo/Logo.png"
              alt=""
              width={100}
              height={100}
              className="w-52 h-24 mx-auto"
            />
          </a>
        </Link>
        <div
          className="border-t pt-2 sticky top-24 flex justify-end px-2 mb-[1px]"
          onClick={closeSideMenu}
        >
          <CancelIcon />
        </div>

        <div className="text-start pb-10">
          <Link href="/browse-profile" legacyBehavior>
            <a>
              <div className="font-semibold py-4 px-4" onClick={closeSideMenu}>
                Browse Profile
              </div>
            </a>
          </Link>
          <Link href="/search" legacyBehavior>
            <a>
              <div className="font-semibold py-4 px-4" onClick={closeSideMenu}>
                Search
              </div>
            </a>
          </Link>
          <Link href="/membership" legacyBehavior>
            <a>
              <div className="font-semibold py-4 px-4" onClick={closeSideMenu}>
                Membership
              </div>
            </a>
          </Link>

          {loggedIn && (
            <>
              <Link href="/profile/short-list-profle" legacyBehavior>
                <a>
                  <div
                    className="font-semibold py-4 px-4"
                    onClick={closeSideMenu}
                  >
                    Short List Profile
                  </div>
                </a>
              </Link>

              <Link href="/messages" legacyBehavior>
                <a>
                  <div
                    className="font-semibold py-4 px-4"
                    onClick={closeSideMenu}
                  >
                    Inbox
                  </div>
                </a>
              </Link>
            </>
          )}

          <Link href="/about-us" legacyBehavior>
            <a>
              <div className="font-semibold py-4 px-4" onClick={closeSideMenu}>
                About Us
              </div>
            </a>
          </Link>
          <Link href="/contact-us" legacyBehavior>
            <a>
              <div className="font-semibold py-4 px-4" onClick={closeSideMenu}>
                Contact Us
              </div>
            </a>
          </Link>

          {loggedIn ? (
            <>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <div className="font-semibold py-4">Interests</div>
                </AccordionSummary>
                <AccordionDetails className="font-medium">
                  <div className="w-full p-4" onClick={closeSideMenu}>
                    <div className="font-semibold">
                      Express Interest Received
                    </div>
                    <div
                      className="mt-4"
                      onClick={() =>
                        router.push({
                          pathname: "/interest-receive-accept",
                        })
                      }
                    >
                      Accepted
                    </div>
                    <div
                      className="mt-4"
                      onClick={() =>
                        router.push({
                          pathname: "/interest-receive-pending",
                        })
                      }
                    >
                      Pending
                    </div>
                    <div className="font-semibold mt-4">
                      Express Interest Sent
                    </div>
                    <div
                      className="mt-4"
                      onClick={() =>
                        router.push({
                          pathname: "/interest-sent-accept",
                        })
                      }
                    >
                      Accepted
                    </div>
                    <div
                      className="mt-4"
                      onClick={() =>
                        router.push({
                          pathname: "/interest-sent-pending",
                        })
                      }
                    >
                      Pending
                    </div>
                    <div
                      className="font-semibold mt-4"
                      onClick={() =>
                        router.push({
                          pathname: "/blocked-list",
                        })
                      }
                    >
                      Block List
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <div className="font-semibold py-4">Notifications</div>
                </AccordionSummary>
                <AccordionDetails className="font-medium">
                  <div className="w-full p-4">
                    <ul className="list-unstyled" onClick={closeSideMenu}>
                      {notifications?.notifications ? (
                        notifications?.notifications?.map((item, index) => {
                          const data = item?.data && JSON.parse(item?.data);
                          const { action, view_user_id } = data || {};
                          return (
                            data && (
                              <div
                                className="mt-2 border-b-2 py-1 border-b-gray-100 text-left text-sm px-3 font-semibold hover:text-sky-600"
                                key={index}
                                onClick={() =>
                                  handlereadNotification(
                                    item?.id,
                                    action,
                                    view_user_id
                                  )
                                }
                              >
                                {data?.message}
                              </div>
                            )
                          );
                        })
                      ) : (
                        <li className="py-2">
                          You have not get any notification.
                        </li>
                      )}
                    </ul>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <div className="font-semibold py-4">Profile</div>
                </AccordionSummary>
                <AccordionDetails className="font-medium">
                  <div className="w-full p-4">
                    <ul className="list-unstyled" onClick={closeSideMenu}>
                      <li className="py-2">
                        <Link href="/profile/profile-page" legacyBehavior>
                          <a className="dropdown-item">My Profile</a>
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link href="/my-orders" legacyBehavior>
                          <a className="dropdown-item">My Orders</a>
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link href="/change-password" legacyBehavior>
                          <a className="dropdown-item">Change Password</a>
                        </Link>
                      </li>
                      {/* <li className="py-2">
                        <Link href="/privacy-settings" legacyBehavior>
                          <a className="dropdown-item">Privacy Setting</a>
                        </Link>
                      </li> */}
                      <li className="py-2">
                        <Link href="/delete-profile" legacyBehavior>
                          <a className="dropdown-item">Delete Profile</a>
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link href="/update-mobile-email" legacyBehavior>
                          <a className="dropdown-item">
                            Update Phone No. & Email
                          </a>
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>
                          <Link legacyBehavior href="/Login">
                            <a className="dropdown-item">Logout</a>
                          </Link>
                        </button>
                      </li>
                    </ul>
                  </div>
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            <Link href="/Login" legacyBehavior>
              <a>
                <div
                  className="font-semibold py-4 px-4"
                  onClick={closeSideMenu}
                >
                  Login
                </div>
              </a>
            </Link>
          )}
        </div>
      </div>
      {/* Responsive Sidebar End */}
    </>
  );
}

export default Header;
