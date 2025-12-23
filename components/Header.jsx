/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { RxAvatar } from "react-icons/rx";
import Alert from "@mui/material/Alert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Badge, Drawer, IconButton, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUSer } from "../services/redux/slices/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import { decrypted_key } from "../services/appConfig";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Signup from "./Signup";
import { markNotificationsRead, fetchNotifications } from "../services/redux/slices/notificationSlice";
import NotificationDrawer from "./NotificationDrawer";
import { http } from "../services/http"; // Import http for API calls

function Header() {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState(false);
  const userData = useSelector(getUSer);
  const { unreadCounts } = useSelector((state) => state.notification || {});
  const [decryptedUserData, setDecryptedUserData] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const anchorProfileRef = React.useRef(null);
  const prevProfileOpen = React.useRef(openProfile);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [notificationDrawer, setNotificationDrawer] = useState(false);

const getMasterData = () => {
  try {
    const raw = userData?.user?.user || userData?.user;
    if (!raw) return;

    if (typeof raw === "object") {
      setDecryptedUserData(raw);
    } else {
      let decryptedText = "";

      // 🔥 Method 1: Laravel-style JSON (Base64 -> JSON {value, iv})
      try {
        const decoded = window.atob(raw);
        if (decoded.trim().startsWith("{")) {
          const encrypted_json = JSON.parse(decoded);
          if (encrypted_json.value && encrypted_json.iv) {
            const dec = CryptoJS.AES.decrypt(
              encrypted_json.value,
              CryptoJS.enc.Base64.parse(decrypted_key),
              { iv: CryptoJS.enc.Base64.parse(encrypted_json.iv) }
            );
            decryptedText = dec.toString(CryptoJS.enc.Utf8);
          }
        }
      } catch (err) {}

      // 🔥 Method 2: Simple Ciphertext (Fixed IV from .env)
      if (!decryptedText) {
        try {
          const keyHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_KEY);
          const ivHex = CryptoJS.enc.Hex.parse(process.env.NEXT_PUBLIC_ENC_IV);
          const dec = CryptoJS.AES.decrypt(raw, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          decryptedText = dec.toString(CryptoJS.enc.Utf8);
        } catch (err) {}
      }

      if (decryptedText) {
        const jsonStartIndex = decryptedText.indexOf("{");
        const jsonEndIndex = decryptedText.lastIndexOf("}") + 1;
        if (jsonStartIndex >= 0 && jsonEndIndex > 0) {
          const jsonData = decryptedText.substring(jsonStartIndex, jsonEndIndex);
          setDecryptedUserData(JSON.parse(jsonData.trim()));
        }
      }
    }
  } catch (error) {
    console.error("❌ Failed to decrypt master user in Header:", error);
  }
};

  useEffect(() => {
    if (loggedIn) {
      dispatch(fetchNotifications());
    }
  }, [loggedIn, dispatch]);

  useEffect(() => {
    getMasterData();
  }, [userData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(null);
    }
    return () => {};
  }, [router]);

  const handleLogout = async () => {
    try {
       await http.post("/auth/logout", {});
    } catch (error) {
       console.error("Logout error", error);
    }
    router.push("/Login");
    localStorage.clear();
    setAlert(true);
  };

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

  React.useEffect(() => {
    if (prevProfileOpen.current === true && openProfile === false) {
      anchorProfileRef.current.focus();
    }

    prevProfileOpen.current = openProfile;
  }, [openProfile]);

  return (
    <header
      id="haeder"
      className="h-[75px] fixed top-0 z-20 w-full shadow-sm xl:px-20 "
    >
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

      <Image
        src="/images/header-bg.png"
        alt="Header background"
        fill
        priority
      />

      <div className="relative z-10 flex items-center h-full px-5">
        <Link href={"/"} legacyBehavior>
          <a className="flex items-center">
            <Image
              src="/logo/Logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="w-[120px] opacity-80"
            />
          </a>
        </Link>

        <div className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-5">
          <Link href="/browse-profile" legacyBehavior>
            <div className="font-semibold text-sm cursor-pointer hover:text-primary">
              Browse Profile
            </div>
          </Link>
          <Link href="/search" legacyBehavior>
            <div className="font-semibold text-sm cursor-pointer hover:text-primary">
              Search
            </div>
          </Link>
          <Link href="/membership" legacyBehavior>
            <div className="font-semibold text-sm cursor-pointer hover:text-primary">
              Membership
            </div>
          </Link>
          <Link href="/contact-us" legacyBehavior>
            <div className="font-semibold text-sm cursor-pointer hover:text-primary">
              Contact Us
            </div>
          </Link>
          <Link href="/about-us" legacyBehavior>
            <div className="font-semibold text-sm cursor-pointer hover:text-primary">
              About Us
            </div>
          </Link>

          {loggedIn && (
            <>
              <Link href="/profile/short-list-profle" legacyBehavior>
                <div className="font-semibold text-sm cursor-pointer hover:text-primary">
                  Short List Profile
                </div>
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
              >
                <button
                  type="button"
                  className="font-semibold text-sm cursor-pointer hover:text-primary select-none"
                >
                  Interests
                </button>

                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[250px] bg-white shadow-lg border-t-4 border-t-primary rounded-md p-4 transition-all duration-200 ${
                    dropdown
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="font-semibold text-[15px] text-black border-b pb-2">
                    Express Interest Received
                    <div
                      className="mt-3 font-medium cursor-pointer hover:font-semibold hover:text-primary"
                      onClick={() => router.push("/interest-receive-accept")}
                    >
                      Accepted
                    </div>
                    <div
                      className="mt-2 font-medium cursor-pointer hover:font-semibold hover:text-primary"
                      onClick={() => router.push("/interest-receive-pending")}
                    >
                      Pending
                    </div>
                  </div>

                  <div className="mt-3 font-semibold text-[15px] text-black border-b pb-2">
                    Express Interest Sent
                    <div
                      className="mt-3 font-medium cursor-pointer hover:font-semibold hover:text-primary"
                      onClick={() => router.push("/interest-sent-accept")}
                    >
                      Accepted
                    </div>
                    <div
                      className="mt-2 font-medium cursor-pointer hover:font-semibold hover:text-primary"
                      onClick={() => router.push("/interest-sent-pending")}
                    >
                      Pending
                    </div>
                  </div>

                  <div
                    className="mt-3 font-semibold text-[15px] text-black cursor-pointer hover:text-primary"
                    onClick={() => router.push("/blocked-list")}
                  >
                    Block List
                  </div>
                </div>
              </div>

              <Link href="/messages" legacyBehavior>
                <div className="font-semibold text-sm cursor-pointer hover:text-primary">
                  Inbox
                </div>
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {!loggedIn ? (
            <div className="flex items-center gap-4">
              <button
                className="hidden xl:block text-sm font-semibold px-5 py-2 bg-transparent border border-primary rounded-full text-primary outline-none cursor-pointer hover:text-white hover:bg-primary ml-2"
                onClick={() => router.push("/Login")}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setOpenSignup(true);
                  setDrawerOpen(false);
                }}
                className="hidden xl:block text-sm font-semibold px-5 py-2 bg-primary rounded-full text-white outline-none cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="nav-item dropdown h-auto cursor-pointer">
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
                      className="h-8 w-8 rounded-full xl:mt-9"
                      alt="asdf"
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer xl:ml-40 xl:mt-[34.5px] xl:mb-10">
                    <Badge badgeContent={unreadCounts} color="info">
                      <RxAvatar size={25} />
                    </Badge>
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
                    <div className="bg-white max-w-full min-w-full">
                      <ClickAwayListener onClickAway={handleCloseProfile}>
                        <div
                          className="block profile-dropdown-main"
                          autoFocusItem={openProfile}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDownProfile}
                        >
                          <div className="border-t-4 border-t-primary">
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
                                    <a className="dropdown-item">My Profile</a>
                                  </Link>
                                </li>

                                <li className="flex items-center justify-between">
                                  <button
                                    onClick={() => {
                                      dispatch(markNotificationsRead());
                                      setNotificationDrawer(true);
                                    }}
                                    className="outline-none dropdown-item"
                                  >
                                    Notifications
                                  </button>
                                  {unreadCounts > 0 && (
                                    <div className="w-[15px] h-[15px] flex items-center justify-center rounded-full p-2.5 text-xs bg-primary text-white font-bold">
                                      {unreadCounts > 9 ? "9+" : unreadCounts}
                                    </div>
                                  )}
                                </li>

                                <li>
                                  <Link href="/my-orders" legacyBehavior>
                                    <a className="dropdown-item">My Orders</a>
                                  </Link>
                                </li>

                                <li>
                                  <Link href="/change-password" legacyBehavior>
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
          )}
        </div>

        <div className="xl:hidden">
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className=""
      >
        <div className="  w-[260px] h-full flex flex-col bg-white shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/browse-profile">Browse Profile</Link>
            <Link href="/search">Search</Link>
            <Link href="/membership">Membership</Link>
            <Link href="/contact-us">Contact Us</Link>
            <Link href="/about-us">About Us</Link>

            {loggedIn && (
              <>
                <Link href="/profile/short-list-profle">
                  Short List Profile
                </Link>

                <div>
                  <p className="font-bold mt-2 mb-2 ">Interests</p>
                  <div className=" space-y-1 text-gray-700">
                    <p
                      onClick={() => router.push("/interest-receive-accept")}
                      className="cursor-pointer hover:text-primary"
                    >
                      Received Accepted
                    </p>
                    <p
                      onClick={() => router.push("/interest-receive-pending")}
                      className="cursor-pointer hover:text-primary"
                    >
                      Received Pending
                    </p>
                    <p
                      onClick={() => router.push("/interest-sent-accept")}
                      className="cursor-pointer hover:text-primary"
                    >
                      Sent Accepted
                    </p>
                    <p
                      onClick={() => router.push("/interest-sent-pending")}
                      className="cursor-pointer hover:text-primary"
                    >
                      Sent Pending
                    </p>
                    <p
                      onClick={() => router.push("/blocked-list")}
                      className="cursor-pointer hover:text-primary"
                    >
                      Block List
                    </p>
                  </div>
                </div>

                <Link href="/messages">Inbox</Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 mt-3"
                >
                  Logout
                </button>
              </>
            )}

            {!loggedIn && (
              <div className="grid gap-3 mt-5">
                <button
                  className="text-sm font-semibold px-5 py-2 bg-transparent border border-primary rounded-full text-primary outline-none cursor-pointer hover:text-white hover:bg-primary"
                  onClick={() => router.push("/Login")}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setOpenSignup(true);
                    setDrawerOpen(false);
                  }}
                  className="text-sm font-semibold px-5 py-2 bg-primary rounded-full text-white outline-none cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {openSignup && (
        <Signup open={openSignup} onClose={() => setOpenSignup(false)} />
      )}

      {notificationDrawer && (
        <NotificationDrawer
          open={notificationDrawer}
          onClose={() => setNotificationDrawer(false)}
        />
      )}
    </header>
  );
}

export default Header;
