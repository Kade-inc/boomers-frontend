import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";

export interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  reference: string;
  referenceModel: string;
}

interface NotificationsStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => {
      // Check if the notification is already present
      if (state.notifications.some((n) => n._id === notification._id)) {
        return {}; // No update if duplicate
      }
      return { notifications: [notification, ...state.notifications] };
    }),

  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n,
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Notifications Store", useNotificationsStore);
}

export default useNotificationsStore;
