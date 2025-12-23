import { http } from "./http";

export const NotificationApi = {
  getNotifications: async () => {
    return await http.get("/user/notifications");
  },
  markRead: async (id) => {
    return await http.get(`/user/readnotifications/${id}`);
  },
  markAllRead: async () => {
    return await http.post("/user/notifications/read-all", {});
  },
};

