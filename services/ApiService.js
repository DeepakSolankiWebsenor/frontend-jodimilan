import { http } from "./http";

function useApiService() {
  function commonOption() {
    return http.get("/user/common-options").then((res) => {
      return res;
    });
  }

  function customerSignup(params) {
    return http.post("/auth/signup", params).then((res) => { // Updated URL
      return res;
    });
  }
  function profileImageRemove() {
    return http
      .post("/user/profile/image/remove", "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function customerLogin(params) {
    return http.post("/auth/login", params).then((res) => { // Updated URL
      return res;
    });
  }

  function loginWithOtp(params) {
      return http.post("/auth/otp/login", params).then((res) => {
          return res;
      });
  }

  function verifyOtp(params) {
    return http.post("/auth/verify-otp", params).then((res) => { // Updated to public endpoint
      return res;
    });
  }

  function resendOtp(params) {
    return http.post("/auth/resend/otp", params).then((res) => { // Updated URL
      return res;
    });
  }

  function BrowseProfileData(params) {
    return http
      .get("/user/browseProfile?" + params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getUserProfile() {
    return http
      .get("/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getCurrentPlan() {
    return http
      .get("/user/currrent-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function profileUpdate(params) {
    return http
      .post("/user/profile/update", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function userSearch(
    page,
    gender,
    mat_status,
    minAge,
    maxAge,
    religion,
    caste,
    clan
  ) {
    return localStorage.getItem("token") ? http
      .get(
        `/user/customer/search?page=${page}&gender=${gender}&mat_status=${mat_status}&minAge=${minAge}&maxAge=${maxAge}
         &religion=${religion}&caste=${caste}&clan=${clan}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      ) : http.get(
        `/user/customer/search?page=${page}&gender=${gender}&mat_status=${mat_status}&minAge=${minAge}&maxAge=${maxAge}
        &religion=${religion}&caste=${caste}&clan=${clan}`)
        .then((res) => {
          return res;
        });
  }

  function readNotificaton(id) {
    return http
      .get(`/user/readnotifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function blockchatuser(session, type) {
    return http
      .post(`user/session/${session}/${type}`, "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function addToWishlist(params) {
    return http
      .post("/user/add/wishlist", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getWishlist(page) {
    return http
      .get(`/user/wishlist?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function blockUser(params) {
    return http
      .post("/user/block/profile", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getUsers(page) {
    return http
      .get(`/user/userprofiles?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function profileById(id) {
    return http
      .get(`/user/profileById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getPackages() {
    return http.get("/user/packages").then((res) => {
      return res;
    });
  }

  function getBlockedUsers() {
    return http
      .get("/user/block/profile/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function searchById(id) {
    return http
      .get(`/user/serachById?ryt_id=` + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function sendMessage(id, data) {
    return http
      .post(`/user/send/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function albumUpload(params) {
    return http
      .post("/user/album/images/upload", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function sendFriendRequest(params) {
    return http
      .post("/user/friend/request/send", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getFriendRequest(page = 1) {
    return http
      .get(`/user/auth/user/friend/requests?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function sentFriendRequest(page = 1) {
    return http
      .get(`/user/friend/requests/pending?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

function acceptRequest(id) {
  return http.post(
    "/user/friend/requests/accept",
    { request_id: Number(id) },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}



  function declineRequest(id) {
    return http
      .post("/user/friend/requests/decline?request_id=" + id, "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function acceptedRequests(page = 1) {
    return http
      .get(`/user/friend/requests/accepted?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function forgetPassword(params) {
    return http.post("/user/forgot-password", params).then((res) => {
      return res;
    });
  }

  function changePassword(params) {
    return http
      .post("/user/change-password", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function createOTP(params) {
    return http
      .post("/user/create/otp", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

function verifyMobileOTP(params) {
  return http.post("/user/verify/mobile-otp", params, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}


  function createEmailOTP(params) {
    return http
      .post("/user/create/otp/email", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }


  function verifyEmailOTP(params) {
    return http.post("/user/verify/email-otp", params, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }


  function sendOTP(params) {
    return http.post("/user/resendOtp", params).then((res) => {
      return res;
    });
  }

  function deleteAlbumImage(id) {
    return http
      .post("/user/album/images/delete/" + id, "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function deleteAccount(params) {
    return http
      .post("/user/delete/account", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function sendEnquiry(params) {
    return http.post("/user/send/enquiry", params).then((res) => {
      return res;
    });
  }

  function cms(url) {
    return http.get("/user/cms/" + url).then((res) => {
     console.log("CMS Response: ", res);
      return res;
    });
  }

  function addThikhanaenquiry(params) {
    return http.post(`/user/thikhanaenquiry`, params).then((res) => {
      return res;
    });
  }

  function getThikanaQuestions() {
    return http.get(`/user/thikhanaquestion`).then((res) => {
      return res;
    });
  }

  function viewContact(id) {
    return http.get(`/user/view-contact/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(res => {
      return res
    })
  }


  function unblockUser(id, params) {
    return http
      .post("/user/block/profile?id=" + id, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function planSubscribe(params) {
    return http
      .post("/user/plansuscribe", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function verifyEmail(params) {
    return http
      .post("/user/customer/verify/email", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function dailyRecommendation() {
    return http
      .get("/user/daily/recommendation/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function pushNotificationSubscribe(params) {
    return http
      .post("/user/subscribe", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getNotifications() {
    return http
      .get("/user/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getSlider() {
    return http.get("/user/slider").then((res) => {
      return res;
    });
  }

  function removeFromShortlist(id) {
    return http
      .post("/user/remove/wishlist/" + id, +"", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function createOrder(params) {
    return http
      .post("/user/order/create", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function orderCheckout(params) {
    return http
      .post("/user/order/Checkout", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function orderHistory(page) {
    return http
      .get(`/user/order/history?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getOrderDetails(orderNumber) {
    return http.get(`/user/order/details/${orderNumber}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  function sessionCreate(params) {
    return http
      .post("/user/session/create", params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  const getChatbySessionid = (id) => {
    return http
      .post(`/user/session/${id}/chats`, "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  };


  function chatCounting(session) {
    return http.post(`user/session/${session}/read`, "", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      return res;
    });
  }

  function getAllfriends() {
    return http
      .post("/user/getFriends", "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function getPhotoRequest(form) {
    return http
      .post("/user/photo/request/send", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res;
      });
  }

  function encryptedData() {
    return http.get("/user/encrypted-data").then((response) => {
      return response.data;
    });
  }

  function searchThikana(form) {
    return http.get("/user/thikhana/search?" + form).then((response) => {
      return response.data;
    });
  }

  function getStates(id) {
    return http.get(`user/state/${id}`).then((response) => {
      return response.data;
    });
  }

  function getThikana(id) {
    return http.get(`user/thikhana/${id}`).then((response) => {
      return response.data;
    });
  }

  function getCities(id) {
    return http.get(`user/city/${id}`).then((response) => {
      return response.data;
    });
  }

  function getAreas(id) {
    return http.get(`user/area/${id}`).then((response) => {
      return response.data;
    });
  }

  function getThikanas(id) {
    return http.get(`user/thikana/${id}`).then((response) => {
      return response.data;
    });
  }

  function updatePartnerPreferences(data) {
    return http
      .post(`user/profile/update-partner-preferences`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  return {
    chatCounting,
    getStates,
    getThikanas,
    getAreas,
    getCities,
    commonOption,
    customerLogin,
    getUserProfile,
    profileUpdate,
    userSearch,
    verifyOtp,
    customerSignup,
    addToWishlist,
    getWishlist,
    blockUser,
    getUsers,
    profileById,
    getPackages,
    getBlockedUsers,
    searchById,
    albumUpload,
    sendFriendRequest,
    getFriendRequest,
    acceptRequest,
    declineRequest,
    acceptedRequests,
    forgetPassword,
    changePassword,
    deleteAlbumImage,
    deleteAccount,
    sendEnquiry,
    cms,
    unblockUser,
    addThikhanaenquiry,
    planSubscribe,
    verifyEmail,
    dailyRecommendation,
    pushNotificationSubscribe,
    getNotifications,
    getSlider,
    removeFromShortlist,
    createOrder,
    getOrderDetails,
    orderCheckout,
    orderHistory,
    sessionCreate,
    profileImageRemove,
    getAllfriends,
    getChatbySessionid,
    sendMessage,
    getPhotoRequest,
    BrowseProfileData,
    readNotificaton,
    blockchatuser,
    createOTP,
    sentFriendRequest,
    createEmailOTP,
    verifyEmailOTP,
    sendOTP,
    getCurrentPlan,
    encryptedData,
    searchThikana,
    getThikana,
    getThikanaQuestions,
    viewContact,
    updatePartnerPreferences,
    resendOtp,
    verifyMobileOTP,
    loginWithOtp, // Added export
  };
}

export default useApiService;
